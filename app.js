/* screenies — tabs, the form builder, saving state, png export,
   + phone frame, randomize, export options (no bg / old), drag reorder, undo/redo, presets */

(function () {
  var $ = function (sel) { return document.querySelector(sel); };
  var tabs = $('#tabs'), form = $('#form'), fit = $('#fit'), view = $('#view');
  var tool, st, refreshers = [], saveTimer, scale = 1, inner = 1, inputs = {}, real = false;
  var picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = 'image/*';

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* saving: IndexedDB (room for lots of photos), with localStorage as the old/backup spot */

  var dbp = null;
  function db() {
    if (!dbp) {
      dbp = new Promise(function (ok, bad) {
        try {
          var r = indexedDB.open('screenies', 1);
          r.onupgradeneeded = function () { r.result.createObjectStore('tools'); };
          r.onsuccess = function () { ok(r.result); };
          r.onerror = function () { bad(r.error); };
        } catch (e) { bad(e); }
      });
    }
    return dbp;
  }
  function dbDo(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (ok, bad) {
        var tx = d.transaction('tools', mode), req = fn(tx.objectStore('tools'));
        tx.oncomplete = function () { ok(req && req.result); };
        tx.onerror = function () { bad(tx.error); };
      });
    });
  }

  function lsGet(t) {
    try {
      var raw = localStorage.getItem('screenies:' + t.id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function load(t) {
    var s = clone(t.defaults), old = lsGet(t);
    if (old) Object.assign(s, old);
    return s;
  }

  function save() {
    clearTimeout(saveTimer);
    var t = tool, s = st;
    touched = true;
    remember();
    saveTimer = setTimeout(function () {
      dbDo('readwrite', function (os) { return os.put(JSON.parse(JSON.stringify(s)), t.id); }).then(function () {
        try { localStorage.removeItem('screenies:' + t.id); } catch (e) { /* ignore */ }
      }).catch(function () {
        try { localStorage.setItem('screenies:' + t.id, JSON.stringify(s)); } catch (e) { /* full or blocked */ }
      });
    }, 300);
  }
  var touched = false;

  /* little site-wide settings (phone frame, export options) */

  function getLS(k, def) {
    try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? Object.assign(def, v) : def; } catch (e) { return def; }
  }
  function setLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  var opt = getLS('screenies:opts', { phone: false, nobg: false, old: false, reshot: false });
  var phone = getLS('screenies:phone', { clock: '9:41', battery: 80, signal: '4', wifi: true, bar: 'auto' });

  /* ---------- undo / redo ---------- */

  // snapshots share their strings with the live state (pictures are big data urls), only objects + arrays get copied
  function snap(o) {
    if (Array.isArray(o)) return o.map(snap);
    if (o && typeof o === 'object') { var r = {}; for (var k in o) r[k] = snap(o[k]); return r; }
    return o;
  }
  function same(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (var i = 0; i < ka.length; i++) if (!same(a[ka[i]], b[ka[i]])) return false;
    return true;
  }
  var hist = {}, histTimer = null;
  function histOf(id) { return hist[id] || (hist[id] = { stack: [], at: -1 }); }
  function commit() {
    clearTimeout(histTimer);
    histTimer = null;
    if (!tool || !st) return;
    var h = histOf(tool.id);
    if (h.at >= 0 && same(h.stack[h.at], st)) return;
    h.stack = h.stack.slice(0, h.at + 1);
    h.stack.push(snap(st));
    if (h.stack.length > 80) h.stack.shift();
    h.at = h.stack.length - 1;
    histButtons();
  }
  function remember() {
    clearTimeout(histTimer);
    histTimer = setTimeout(commit, 450);
  }
  function step(d) {
    if (!tool) return;
    if (histTimer) commit();
    var h = histOf(tool.id), j = h.at + d;
    if (j < 0 || j >= h.stack.length) return;
    h.at = j;
    st = snap(h.stack[j]);
    buildForm();
    render();
    save();
    clearTimeout(histTimer);
    histTimer = null;
    histButtons();
  }
  var undoBtn, redoBtn;
  function histButtons() {
    if (!undoBtn || !tool) return;
    var h = histOf(tool.id);
    undoBtn.disabled = h.at <= 0;
    redoBtn.disabled = h.at >= h.stack.length - 1;
  }

  /* ---------- rendering ---------- */

  // a light copy of the state where blank typed fields hold GHOST, so their spot is still on the picture to click
  function ghosted() {
    function texty(fields, out) {
      fields.forEach(function (f) {
        if (f.type === 'row') texty(f.fields, out);
        else if (f.type === 'text' || f.type === 'textarea') out.push(f.key);
      });
      return out;
    }
    var g = Object.assign({}, st);
    texty(tool.fields, []).forEach(function (k) { if (g[k] === '' || g[k] == null) g[k] = GHOST; });
    tool.fields.forEach(function walk(f) {
      if (f.type === 'row') return f.fields.forEach(walk);
      if (f.type !== 'list' || !Array.isArray(g[f.key])) return;
      var keys = texty(f.item, []);
      g[f.key] = g[f.key].map(function (it) {
        var c = Object.assign({}, it);
        keys.forEach(function (k) { if (c[k] === '' || c[k] == null) c[k] = GHOST; });
        return c;
      });
    });
    return g;
  }

  function render() {
    fit.innerHTML = tool.render(real ? st : ghosted());
    if (opt.phone && tool.phone !== false) wrapPhone();
    else if (phonePanel) phonePanel.hidden = true;
    [].forEach.call(fit.querySelectorAll('img'), function (im) {
      if (!im.complete) im.addEventListener('load', refit);
    });
    wireInline();
    wirePhone();
    if (tool.mount) tool.mount(fit.querySelector('.shot') || fit.firstElementChild, st, { scale: function () { return scale * inner; }, save: save });
    refit();
  }

  /* ---------- phone frame ---------- */

  function phoneBar() {
    var pct = Math.max(0, Math.min(100, parseInt(phone.battery, 10)));
    if (isNaN(pct)) pct = 80;
    var bars = parseInt(phone.signal, 10), sig = '<svg viewBox="0 0 18 12" width="18" height="12">';
    [[0, 8, 4], [5, 5.5, 6.5], [10, 3, 9], [15, 0, 12]].forEach(function (r, i) {
      sig += '<rect x="' + r[0] + '" y="' + r[1] + '" width="3" height="' + r[2] + '" rx="1"' + (i < bars ? '' : ' opacity=".3"') + '/>';
    });
    sig += '</svg>';
    var wifi = phone.wifi ? '<svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.1-1.2A10.3 10.3 0 0 0 8 .6C5.3.6 2.8 1.6.9 3.5L2 4.7a8.6 8.6 0 0 1 6-2.4z"/><path d="M8 5.6c1.4 0 2.6.5 3.6 1.4l1.1-1.2A7 7 0 0 0 8 3.9 7 7 0 0 0 3.3 5.8L4.4 7c1-.9 2.2-1.4 3.6-1.4z"/><path d="M8 8.9c.6 0 1.1.2 1.5.6L8 11.2 6.5 9.5c.4-.4.9-.6 1.5-.6z"/></svg>' : '';
    var w = Math.max(1.5, 18.5 * pct / 100);
    var bat = '<svg viewBox="0 0 27 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".38"/>' +
      '<rect x="2.5" y="2.5" width="' + w + '" height="8" rx="2"' + (pct <= 20 ? ' fill="#ff3b30"' : '') + '/>' +
      '<path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" opacity=".4"/></svg>';
    return '<div class="pf-sbar"><span class="pf-time" data-pe="clock">' + U.esc(phone.clock) + '</span><span class="pf-icons">' + sig + wifi + bat + '</span></div>';
  }

  function colorOf(cs) {
    var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(cs || '');
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] };
  }

  function wrapPhone() {
    var shot = fit.firstElementChild;
    if (!shot) return;
    var own = tool.phone === 'own' || !!shot.querySelector('.sbar, .dbar');
    var fr = document.createElement('div');
    fr.className = 'pframe' + (own ? ' own' : '');
    fr.innerHTML = '<div class="pf-screen"><div class="pf-island"></div>' + (own ? '' : phoneBar()) +
      '<div class="pf-body"><div class="pf-scale"></div></div><div class="pf-home"></div></div>';
    fit.insertBefore(fr, shot);
    fr.querySelector('.pf-scale').appendChild(shot);
    var c = colorOf(getComputedStyle(shot).backgroundColor), scr = fr.querySelector('.pf-screen');
    var bg = c && c.a > 0.5 ? 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')' : '#000';
    var light = c && c.a > 0.5 ? U.lum('#' + [c.r, c.g, c.b].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('')) > 0.45 : false;
    var mode = phone.bar === 'auto' ? (light ? 'dark' : 'light') : phone.bar;
    scr.style.background = bg;
    fr.classList.add('bar-' + mode);
    if (phonePanel) phonePanel.hidden = own;
    layoutPhone();
  }

  // shrink wide shots so they fit the phone's screen
  function layoutPhone() {
    var fr = fit.querySelector('.pframe');
    if (!fr) { inner = 1; return; }
    var shot = fr.querySelector('.shot'), scl = fr.querySelector('.pf-scale'), body = fr.querySelector('.pf-body');
    if (!shot) return;
    scl.style.transform = '';
    var w = shot.offsetWidth, h = shot.offsetHeight, k = Math.min(1, 390 / (w || 390));
    scl.style.width = w + 'px';
    scl.style.transform = k < 1 ? 'scale(' + k + ')' : '';
    body.style.width = Math.round(w * k) + 'px';
    body.style.height = Math.round(h * k) + 'px';
    // cards narrower than the screen sit in the middle
    fr.classList.toggle('mid', w * k < 370 && !fr.classList.contains('own'));
    inner = k;
  }

  function wirePhone() {
    var node = fit.querySelector('[data-pe]');
    if (!node) return;
    node.contentEditable = 'plaintext-only';
    if (node.contentEditable !== 'plaintext-only') node.contentEditable = 'true';
    node.spellcheck = false;
    node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); node.blur(); } });
    node.addEventListener('input', function () {
      phone.clock = node.innerText.replace(/\n/g, ' ');
      if (inputs['phone.clock']) inputs['phone.clock'].value = phone.clock;
      setLS('screenies:phone', phone);
    });
  }

  var phonePanel = null;
  function drawPhonePanel() {
    if (!phonePanel) {
      phonePanel = el('div', '');
      phonePanel.id = 'phoneset';
      form.parentNode.insertBefore(phonePanel, form.nextSibling);
    }
    phonePanel.innerHTML = '';
    phonePanel.hidden = !opt.phone || (tool && tool.phone === false) || !!(fit.querySelector('.pframe.own'));
    var redraw = function () { setLS('screenies:phone', phone); render(); };
    phonePanel.appendChild(el('h3', '', 'phone'));
    [{ type: 'row', fields: [
      { key: 'clock', type: 'text', label: 'time' },
      { key: 'battery', type: 'number', label: 'battery %' }
    ] }, { type: 'row', fields: [
      { key: 'signal', type: 'select', label: 'signal', options: [['4', '4'], ['3', '3'], ['2', '2'], ['1', '1'], ['0', '0']] },
      { key: 'bar', type: 'select', label: 'text', options: [['auto', 'auto'], ['dark', 'dark'], ['light', 'light']] },
      { key: 'wifi', type: 'toggle', label: 'wifi' }
    ] }].forEach(function (f) { phonePanel.appendChild(field(f, phone, redraw, 'phone.')); });
  }

  /* ---------- typing + picture swapping right on the preview ---------- */

  function getPath(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, st);
  }
  function setPath(path, v) {
    var parts = path.split('.'), o = st;
    for (var i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    o[parts[parts.length - 1]] = v;
  }
  // the form field behind a path ('name', 'msgs.3.text')
  function fieldFor(path) {
    var parts = path.split('.');
    function find(fields, key) {
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (f.type === 'row') { var r = find(f.fields, key); if (r) return r; }
        else if (f.key === key) return f;
      }
      return null;
    }
    var all = tool.fields.concat([U.STATUS_FIELDS]);
    if (parts.length === 1) return find(all, parts[0]);
    var list = find(all, parts[0]);
    return list && list.item ? find(list.item, parts[2]) : null;
  }

  function wireInline() {
    [].forEach.call(fit.querySelectorAll('[data-e]'), function (node) {
      var path = node.dataset.e, f = fieldFor(path);
      if (!f) return;
      var multi = node.hasAttribute('data-ml') || f.type === 'textarea';
      node.contentEditable = 'plaintext-only';
      if (node.contentEditable !== 'plaintext-only') node.contentEditable = 'true';
      node.spellcheck = false;
      node.dataset.ph = f.label;
      node.addEventListener('focus', function () {
        // formatted text (bullets, bold, hashtags) goes back to plain while you edit it
        if (node.hasAttribute('data-ml') && node.innerHTML !== U.br(getPath(path))) node.innerText = getPath(path) || '';
      });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !multi) { e.preventDefault(); node.blur(); }
        if (e.key === 'Escape') node.blur();
      });
      node.addEventListener('input', function () {
        var v = node.innerText.replace(/\n$/, '');
        if (!multi) v = v.replace(/\n/g, ' ');
        if (f.type === 'number') v = parseFloat(v) || 0;
        setPath(path, v);
        if (inputs[path] && inputs[path] !== document.activeElement) inputs[path].value = v;
        // copies of the same text (like the whisper outline) follow along
        [].forEach.call(fit.querySelectorAll('[data-e="' + path + '"]'), function (o) { if (o !== node) o.textContent = v; });
        save();
      });
      node.addEventListener('blur', function (e) {
        var next = e.relatedTarget;
        if (next && fit.contains(next) && next.hasAttribute('data-e')) return;
        setTimeout(function () { if (!fit.contains(document.activeElement) || !document.activeElement.hasAttribute('data-e')) changed(); }, 0);
      });
    });
    [].forEach.call(fit.querySelectorAll('[data-img]'), function (node) {
      node.addEventListener('click', function (e) {
        e.preventDefault();
        var path = node.dataset.img, f = fieldFor(path) || {};
        picker.onchange = function () {
          var fl = picker.files[0];
          picker.value = '';
          if (!fl) return;
          readImage(fl, f.max || 1200).then(function (url) {
            setPath(path, url);
            if (!f.palette) return url;
            return palette(url).then(function (p) { st.palette = p; if (p.length) st.bg = p[0]; });
          }).then(function () { buildForm(); changed(); })
            .catch(function () { alert("that file didn't open as a picture"); });
        };
        picker.click();
      });
    });
  }

  function refit() {
    var shot = fit.firstElementChild;
    if (!shot) return;
    fit.style.transform = '';
    layoutPhone();
    var w = shot.offsetWidth, h = shot.offsetHeight;
    var room = view.clientWidth - 32;
    var k = Math.min(1, room / w);
    scale = k;
    fit.style.width = w + 'px';
    fit.style.transform = k < 1 ? 'scale(' + k + ')' : '';
    fit.style.height = h * k + 'px';
    fit.style.marginLeft = k < 1 ? '0' : 'auto';
  }

  function changed() {
    render();
    refreshers = refreshers.filter(function (f) { return f() !== false; });
    save();
  }

  /* ---------- images ---------- */

  function readImage(file, max) {
    return new Promise(function (ok, bad) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var k = Math.min(1, (max || 1000) / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * k));
        c.height = Math.max(1, Math.round(img.naturalHeight * k));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        var alpha = false;
        if (/png|gif|webp|svg/.test(file.type)) {
          var px = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          for (var i = 3; i < px.length; i += 4) if (px[i] < 250) { alpha = true; break; }
        }
        ok(alpha ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = function () { URL.revokeObjectURL(url); bad(); };
      img.src = url;
    });
  }

  // the cover's main colors, most eye-catching first
  function palette(src) {
    return new Promise(function (ok) {
      var img = new Image();
      img.onload = function () {
        var n = 40, c = document.createElement('canvas');
        c.width = c.height = n;
        var g = c.getContext('2d');
        g.drawImage(img, 0, 0, n, n);
        var d = g.getImageData(0, 0, n, n).data, bins = {};
        for (var i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 128) continue;
          var key = (d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4);
          var b = bins[key] || (bins[key] = { n: 0, r: 0, g: 0, b: 0 });
          b.n++; b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2];
        }
        var list = Object.keys(bins).map(function (k) {
          var b = bins[k], r = b.r / b.n, gg = b.g / b.n, bb = b.b / b.n;
          var mx = Math.max(r, gg, bb), mn = Math.min(r, gg, bb);
          var sat = mx ? (mx - mn) / mx : 0, light = (mx + mn) / 510;
          var score = b.n * (0.25 + sat) * (light < 0.12 ? 0.15 : light > 0.9 ? 0.3 : 1);
          return { r: r, g: gg, b: bb, score: score };
        }).sort(function (a, b) { return b.score - a.score; });
        var picked = [];
        list.forEach(function (c) {
          if (picked.length >= 6) return;
          var far = picked.every(function (p) {
            return Math.abs(p.r - c.r) + Math.abs(p.g - c.g) + Math.abs(p.b - c.b) > 70;
          });
          if (far) picked.push(c);
        });
        ok(picked.map(function (c) {
          return '#' + [c.r, c.g, c.b].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('');
        }));
      };
      img.onerror = function () { ok([]); };
      img.src = src;
    });
  }

  /* ---------- form builder ---------- */

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function labeled(f, input) {
    var wrap = el('label', 'f');
    wrap.appendChild(el('span', '', U.esc(f.label)));
    wrap.appendChild(input);
    return wrap;
  }

  function opts(f) { return typeof f.options === 'function' ? f.options(st) : f.options; }

  function fillSelect(sel, f, obj) {
    sel.innerHTML = '';
    opts(f).forEach(function (o) {
      var op = el('option', '', U.esc(o[1]));
      op.value = o[0];
      sel.appendChild(op);
    });
    sel.value = obj[f.key];
  }

  function field(f, obj, onChange, prefix) {
    onChange = onChange || changed;
    prefix = prefix || '';
    var input, wrap;

    if (f.type === 'head') return el('h3', '', U.esc(f.label));

    if (f.type === 'row') {
      var row = el('div', 'row');
      f.fields.forEach(function (sub) { row.appendChild(field(sub, obj, onChange, prefix)); });
      return row;
    }

    if (f.type === 'text' || f.type === 'number') {
      input = el('input');
      input.type = f.type;
      input.value = obj[f.key] == null ? '' : obj[f.key];
      if (f.placeholder) input.placeholder = f.placeholder;
      input.addEventListener('input', function () { obj[f.key] = input.value; onChange(); });
      inputs[prefix + f.key] = input;
      return labeled(f, input);
    }

    if (f.type === 'textarea') {
      input = el('textarea');
      input.rows = f.rows || 3;
      input.value = obj[f.key] || '';
      input.addEventListener('input', function () { obj[f.key] = input.value; onChange(); });
      inputs[prefix + f.key] = input;
      return labeled(f, input);
    }

    if (f.type === 'select') {
      input = el('select');
      fillSelect(input, f, obj);
      input.addEventListener('change', function () {
        obj[f.key] = input.value;
        if (f.onPick) f.onPick(obj);
        onChange();
        if (f.rebuild) buildForm(); // other controls depend on this choice
      });
      if (typeof f.options === 'function') {
        refreshers.push(function () {
          if (!input.isConnected) return false;
          if (document.activeElement !== input) fillSelect(input, f, obj);
        });
      }
      return labeled(f, input);
    }

    if (f.type === 'range') {
      input = el('input');
      input.type = 'range';
      input.min = f.min;
      input.max = f.max;
      input.step = f.step;
      input.value = obj[f.key];
      input.addEventListener('input', function () { obj[f.key] = parseFloat(input.value); onChange(); });
      input.addEventListener('dblclick', function () {
        obj[f.key] = tool.defaults[f.key];
        input.value = obj[f.key];
        onChange();
      });
      return labeled(f, input);
    }

    if (f.type === 'toggle') {
      wrap = el('label', 'f toggle');
      input = el('input');
      input.type = 'checkbox';
      input.checked = !!obj[f.key];
      input.addEventListener('change', function () { obj[f.key] = input.checked; onChange(); });
      wrap.appendChild(input);
      wrap.appendChild(el('span', '', U.esc(f.label)));
      return wrap;
    }

    if (f.type === 'color') {
      var box = el('div', 'color');
      input = el('input');
      input.type = 'color';
      input.value = obj[f.key];
      input.addEventListener('input', function () { obj[f.key] = input.value; onChange(); });
      box.appendChild(input);
      if (f.swatches) {
        var sw = el('div', 'color');
        var drawSwatches = function () {
          input.value = obj[f.key];
          sw.innerHTML = '';
          (f.swatches(st) || []).forEach(function (hex) {
            var b = el('button', 'swatch' + (hex === obj[f.key] ? ' on' : ''));
            b.type = 'button';
            b.style.background = hex;
            b.addEventListener('click', function () { obj[f.key] = hex; onChange(); });
            sw.appendChild(b);
          });
        };
        drawSwatches();
        refreshers.push(drawSwatches);
        box.appendChild(sw);
      }
      return labeled(f, box);
    }

    if (f.type === 'image') {
      var pic = el('div', 'pic');
      var thumb = el('div', 'thumb');
      var file = el('input');
      file.type = 'file';
      file.accept = 'image/*';
      var pick = el('button', 'ghost small', 'choose');
      pick.type = 'button';
      var clear = el('button', 'ghost small', 'remove');
      clear.type = 'button';
      var show = function () {
        thumb.style.backgroundImage = obj[f.key] ? 'url("' + obj[f.key] + '")' : '';
        clear.style.display = obj[f.key] ? '' : 'none';
      };
      show();
      pick.addEventListener('click', function () { file.click(); });
      thumb.addEventListener('click', function () { file.click(); });
      clear.addEventListener('click', function () {
        obj[f.key] = '';
        if (f.palette) st.palette = [];
        show();
        onChange();
      });
      file.addEventListener('change', function () {
        var fl = file.files[0];
        file.value = '';
        if (!fl) return;
        readImage(fl, f.max).then(function (url) {
          obj[f.key] = url;
          show();
          if (!f.palette) return onChange();
          return palette(url).then(function (p) {
            st.palette = p;
            if (p.length) st.bg = p[0];
            onChange();
          });
        }).catch(function () { alert("that file didn't open as a picture"); });
      });
      pic.appendChild(thumb);
      pic.appendChild(pick);
      pic.appendChild(clear);
      pic.appendChild(file);
      wrap = el('div', 'f');
      wrap.appendChild(el('span', '', U.esc(f.label)));
      wrap.appendChild(pic);
      return wrap;
    }

    if (f.type === 'list') return listField(f);

    // tool-made controls (game loader, sprite picker)
    if (f.type === 'custom') return f.build(obj, { changed: onChange, rebuild: function () { buildForm(); render(); }, state: function () { return st; } });

    return el('div');
  }

  // drag a list card by its grip to a new spot (mouse + touch)
  function dragCard(grip, card, box, arr, redraw) {
    grip.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      e.preventDefault();
      var ed = $('#editor'), y = e.clientY, scroller = null;
      try { grip.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
      card.classList.add('drag');
      box.classList.add('dragging');
      function place() {
        var prev = card.previousElementSibling, next = card.nextElementSibling;
        if (prev && prev.classList.contains('item')) {
          var r = prev.getBoundingClientRect();
          if (y < r.top + r.height / 2) { box.insertBefore(card, prev); return place(); }
        }
        if (next && next.classList.contains('item')) {
          var n = next.getBoundingClientRect();
          if (y > n.top + n.height / 2) { box.insertBefore(next, card); return place(); }
        }
      }
      function scroll() {
        var r = ed.getBoundingClientRect(), d = y < r.top + 50 ? -14 : y > r.bottom - 50 ? 14 : 0;
        if (d) { ed.scrollTop += d; place(); }
      }
      function move(ev) { y = ev.clientY; place(); }
      function up() {
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', up);
        grip.removeEventListener('pointercancel', up);
        clearInterval(scroller);
        card.classList.remove('drag');
        box.classList.remove('dragging');
        var order = [].map.call(box.querySelectorAll(':scope > .item'), function (c) { return +c.dataset.i; });
        if (order.every(function (v, i) { return v === i; })) return;
        var moved = order.map(function (j) { return arr[j]; });
        arr.length = 0;
        moved.forEach(function (it) { arr.push(it); });
        redraw();
        changed();
      }
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', up);
      grip.addEventListener('pointercancel', up);
      scroller = setInterval(scroll, 30);
    });
  }

  function listField(f) {
    var box = el('div', 'list');
    var draw = function () {
      box.innerHTML = '';
      var arr = st[f.key] || (st[f.key] = []);
      arr.forEach(function (item, i) {
        var card = el('div', 'item');
        card.dataset.i = i;
        var mark = function () { card.classList.toggle('me', f.meKey && item[f.meKey] === 'me'); };
        mark();
        var bar = el('div', 'item-bar');
        var grip = el('span', 'grip');
        bar.appendChild(grip);
        dragCard(grip, card, box, arr, draw);
        [['↑', -1], ['↓', 1]].forEach(function (b) {
          var btn = el('button', '', b[0]);
          btn.type = 'button';
          btn.addEventListener('click', function () {
            var j = i + b[1];
            if (j < 0 || j >= arr.length) return;
            arr.splice(j, 0, arr.splice(i, 1)[0]);
            draw();
            changed();
          });
          bar.appendChild(btn);
        });
        var del = el('button', '', '✕');
        del.type = 'button';
        del.addEventListener('click', function () {
          arr.splice(i, 1);
          draw();
          changed();
        });
        bar.appendChild(del);
        card.appendChild(bar);
        f.item.forEach(function (sub) {
          card.appendChild(field(sub, item, function () { mark(); changed(); }, f.key + '.' + i + '.'));
        });
        box.appendChild(card);
      });
      var adds = el('div', 'adds');
      f.adds.forEach(function (a) {
        var btn = el('button', 'small', U.esc(a.label));
        btn.type = 'button';
        btn.addEventListener('click', function () {
          arr.push(typeof a.item === 'function' ? a.item(st) : clone(a.item));
          draw();
          changed();
          var cards = box.querySelectorAll('.item');
          var fresh = cards[cards.length - 1];
          var first = fresh && fresh.querySelector('textarea, input[type=text]');
          if (first) first.focus();
        });
        adds.appendChild(btn);
      });
      box.appendChild(adds);
    };
    draw();
    return box;
  }

  /* ---------- randomize ---------- */

  var R = {
    names: ['Mia', 'Jade', 'Ivy', 'Luna', 'Nova', 'Ruby', 'Zoe', 'Lily', 'Skye', 'Willow', 'Raven', 'Violet', 'Hazel', 'Ember', 'Cleo',
      'Maya', 'Ella', 'Remi', 'Jules', 'Sam', 'Alex', 'Max', 'Leo', 'Kai', 'Theo', 'Finn', 'Milo', 'Ezra', 'Noah', 'Eli', 'Iris', 'Sage'],
    last: ['Black', 'Moon', 'Rivers', 'Vale', 'Hart', 'Frost', 'Lane', 'Gray', 'Stone', 'Wilde', 'Rose', 'Knight'],
    adj: ['midnight', 'velvet', 'static', 'ghost', 'glitter', 'cherry', 'neon', 'sleepy', 'lost', 'paper', 'silver', 'candy', 'moth',
      'rose', 'star', 'vampire', 'spider', 'lace', 'cloud', 'bubblegum', 'haunted', 'lunar'],
    noun: ['kid', 'girl', 'heart', 'core', 'sounds', 'diary', 'queen', 'tapes', 'bunny', 'bat', 'doll', 'ghost', 'witch', 'club', 'angel'],
    artists: ['Evanescence', 'Flyleaf', 'Avril Lavigne', 'Britney Spears', 'My Chemical Romance', 'Fall Out Boy', 'Pierce The Veil',
      'Sleeping With Sirens', 'Bring Me The Horizon', 'Hey Monday', 'Metric', 'Marina', 'Mitski', 'Lana Del Rey', 'The Used',
      'Taking Back Sunday', 'Panic! at the Disco', 'Melanie Martinez', 'Charli xcx', 'Lights', 'Phoebe Bridgers', 'Pale Waves',
      'beabadoobee', 'Cocteau Twins', 'The Cure', 'Garbage', 'PVRIS', 'Lacuna Coil'],
    songs: ['Glass Valentine', 'Velvet Static', 'Bleach Sky', 'Paper Crowns', 'Ghost in the Hallway', 'Cherry Wine Dreams',
      'Satellite Heart', 'Neon Graveyard', 'Midnight Diary', 'Static Lullaby', 'Lace and Lightning', 'Haunted Mall', 'Bat Wings',
      'Silver Teeth', 'Rosewater', 'Black Mascara', 'Starlight Drive', 'Candy Coated', 'Pretty When It Rains', 'Moth to the Porch Light'],
    albums: ['Diary of a Ghost', 'Neon Requiem', 'Glitter & Gravel', 'Afterglow Club', 'The Velvet Hour', 'Bedroom Galaxy', 'Static Hearts'],
    lyrics: ['i keep your voice in a jar by the window', 'we were glitter in the dark, now we\'re just dust', 'call me when the city stops spinning',
      'i painted my nails black for the last time', 'your name still echoes down the hallway', 'we danced like ghosts in a borrowed room',
      'the stars look fake from here', 'i\'m a satellite stuck in your orbit', 'tell me it\'s only the static',
      'my heart\'s a haunted house with the lights on', 'i wrote your name on the mirror in lipstick', 'we were never meant to be daylight people',
      'i\'ll be the storm you didn\'t see coming', 'cherry soda and broken promises', 'stay up with me till the sky turns pink',
      'and every song sounds like you', 'i saved the last dance for the moon'],
    msgs: ['omg wait', 'are you coming tonight??', 'i literally cannot stop listening to this', 'lol same', 'send pics', 'this is so us',
      'be there in 5', 'did you see that??', 'ok but the new album tho', 'i\'m so tired', 'brb', 'no way', 'that\'s actually iconic',
      'can we go to the mall saturday', 'i found the cutest boots', 'who\'s driving', 'it\'s giving 2007', 'ok goodnight', 'i miss you',
      'wait what happened', 'lmaooo', 'dying', 'same honestly', 'sounds good!', 'i\'m outside', 'haha yes', 'we need matching outfits',
      'my playlist is perfect rn', 'thank youuu', 'stop that\'s so cute', 'call me later?', 'ur hair looks amazing'],
    long: ['just finished my new playlist and it\'s perfect.', 'the sky was so pretty tonight.', 'rate my new hair color 1-10',
      'currently listening to the same song for the 40th time', 'can\'t believe it\'s already october', 'new room decor reveal soon',
      'thinking about bangs again...', 'the concert last night was unreal', 'found my old mp3 player and it still works',
      'me and my best friend vs the world', 'black nail polish is a personality trait', 'spent all day redoing my room and no regrets'],
    places: ['Brooklyn', 'Seattle', 'Portland', 'Chicago', 'Austin', 'Salem', 'Denver', 'Toronto', 'the mall', 'Silver Lake'],
    titles: ['things i never said', 'a ghost story', 'room tour', 'the night everything changed', 'new hair who dis', 'midnight drive'],
    channels: ['general', 'music', 'memes', 'outfits', 'art', 'late-night'],
    words: ['midnight', 'glitter', 'static', 'velvet', 'cherry', 'ghost', 'neon', 'dreamy', 'starlight', 'lace', 'moonlit', 'sparkle'],
    emoji: ['💀', '😭', '🖤', '✨', '😂', '🔥', '💕', '👀', '🦇', '🌙'],
    tags: ['#emo', '#scene', '#music', '#2000s', '#aesthetic', '#lyrics', '#mood', '#nightdrive', '#playlist', '#ootd'],
    colors: ['#ff3d9a', '#b8336a', '#7b61ff', '#2fb67c', '#f0932b', '#3a9ad9', '#c0392b', '#1db954', '#e8578f', '#8e6c8a',
      '#16a085', '#ffb3c7', '#9b5de5', '#00bbf9', '#f15bb5', '#4a4e69']
  };
  function rnd(n) { return Math.floor(Math.random() * n); }
  var used = {};
  // pick, skipping things already used this round when possible
  function pick(a) {
    var v;
    for (var i = 0; i < 6; i++) { v = a[rnd(a.length)]; if (typeof v !== 'string' || !used[v]) break; }
    if (typeof v === 'string') used[v] = 1;
    return v;
  }
  function some(a, n) { var c = a.slice(), out = []; while (out.length < n && c.length) out.push(c.splice(rnd(c.length), 1)[0]); return out; }
  function rTime() { var h = 1 + rnd(12), m = ('0' + rnd(60)).slice(-2); return h + ':' + m + (Math.random() < 0.5 ? ' PM' : ' AM'); }
  function rCount() {
    var k = rnd(5);
    if (k === 0) return String(1 + rnd(99));
    if (k === 1) return String(100 + rnd(900));
    if (k === 2) return (1 + rnd(9)) + ',' + ('00' + rnd(1000)).slice(-3);
    if (k === 3) return (1 + rnd(99)) + '.' + rnd(10) + 'K';
    return (1 + rnd(9)) + '.' + rnd(10) + 'M';
  }
  function rUser() {
    var u = pick(R.adj) + pick(['', '.', '_', 'x']) + pick(R.noun);
    return Math.random() < 0.3 ? u + (rnd(90) + 10) : u;
  }
  function rDate() {
    return pick(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']) + ' ' + (1 + rnd(28)) + ', ' + (2019 + rnd(8));
  }

  function kindOf(f) {
    var k = (f.key + ' ' + (f.label || '')).toLowerCase();
    if (/emoji|react|moji/.test(k)) return 'react';
    if (/battery/.test(k)) return 'battery';
    if (/unread|badge/.test(k)) return 'small';
    if (/lyric/.test(k)) return 'lyrics';
    if (/hashtag|\btags?\b/.test(k)) return 'tags';
    if (/handle|user|@|\bblog\b/.test(k)) return 'user';
    if (/artist|band|singer/.test(k)) return 'artist';
    if (/album/.test(k)) return 'album';
    if (/song|track/.test(k)) return 'song';
    if (/\b(likes?|views|replies|reposts|retweets|comments|shares|saves|bookmarks|followers|following|plays|streams|listeners|notes|votes|upvotes|subs|subscribers|members|kudos|hits|reads|stars|count|viewers|friends|posts)\b/.test(k)) return 'count';
    if (/\b(len|length|duration|runtime)\b/.test(k)) return 'len';
    if (/\b(price|cost|total)\b/.test(k)) return 'price';
    if (/\b(match|pct|percent)\b|%/.test(k)) return 'pct';
    if (/temp|\b(hi|lo|high|low|level|lvl|hp|atk|def|attack|defense|damage|dmg|sec|section|row|seat|gate|xp|score|hours|hrs|age|issue|rank|num|number)\b/.test(k)) return 'num';
    if (/\b(ago|late)\b/.test(k)) return 'ago';
    if (/stamp|\btime\b|clock/.test(k)) return 'time';
    if (/\byear\b/.test(k)) return 'year';
    if (/date|\bday\b/.test(k)) return 'date';
    if (/name|\bwho\b|sender|contact|friend|nick|person|caller|author/.test(k)) return 'name';
    if (/place|location|city|where|venue/.test(k)) return 'place';
    if (/channel|server/.test(k)) return 'channel';
    if (/title|headline|subject/.test(k)) return 'title';
    if (/url|link|site|web/.test(k)) return 'url';
    if (/bio|caption|post|text|msg|message|body|comment|reply|content|desc|quote|status|note|prompt|answer|question|review/.test(k)) return 'msg';
    return '';
  }

  function rValue(f, long) {
    var kind = kindOf(f), ph = f.placeholder || '';
    switch (kind) {
      case 'react': return some(R.emoji, 1 + rnd(2)).map(function (e) { return e + ' ' + (1 + rnd(9)); }).join(', ');
      case 'battery': return String(5 + rnd(96));
      case 'small': return String(1 + rnd(12));
      case 'lyrics': return some(R.lyrics, long ? 2 + rnd(3) : 1).join('\n');
      case 'tags': return some(R.tags, 2 + rnd(3)).join(' ');
      case 'user': return rUser();
      case 'artist': return pick(R.artists);
      case 'album': return pick(R.albums);
      case 'song': return pick(R.songs);
      case 'count': return rCount();
      case 'len': return (1 + rnd(5)) + ':' + ('0' + rnd(60)).slice(-2);
      case 'price': return '$' + (5 + rnd(150)) + '.' + pick(['00', '50', '99']);
      case 'pct': return String(1 + rnd(99));
      case 'num': return /temp|\b(hi|lo|high|low)\b/.test((f.key + ' ' + (f.label || '')).toLowerCase()) ? String(30 + rnd(60)) : String(1 + rnd(99));
      case 'ago': return (1 + rnd(11)) + pick(['m', 'h', 'd']);
      case 'time':
        if (/clock/i.test(f.key)) return (1 + rnd(12)) + ':' + ('0' + rnd(60)).slice(-2);
        return /\d{1,2}:\d{2}/.test(ph) ? ph.replace(/\d{1,2}:\d{2}(\s?[AP]M)?/i, rTime()) : rTime();
      case 'year': return String(2019 + rnd(8));
      case 'date': return rDate();
      case 'name': return Math.random() < 0.3 ? pick(R.names) + ' ' + pick(R.last) : pick(R.names);
      case 'place': return pick(R.places);
      case 'channel': return pick(R.channels);
      case 'title': return pick(R.songs.concat(R.titles));
      case 'url': return rUser().replace(/[._]/g, '') + pick(['.net', '.com', '.tumblr.com']);
      case 'msg': return long ? some(R.long.concat(R.msgs), 1 + rnd(2)).join(' ') : pick(R.msgs);
    }
    // nothing obvious: the field's own example, with fresh numbers
    if (ph) return ph.replace(/\d+/g, function (d) { return String(rnd(Math.pow(10, d.length)) || 1); });
    return long ? pick(R.long) : pick(R.words);
  }

  function randomFields(fields, obj, inList, idx) {
    fields.forEach(function (f) {
      if (f.type === 'row') return randomFields(f.fields, obj, inList, idx);
      if (!f.key || f.type === 'image' || f.type === 'custom' || f.type === 'head' || f.type === 'list') return;
      if (f.type === 'text' || f.type === 'textarea') {
        var kind = kindOf(f);
        // little extras (time stamps, reactions) only now and then inside a list
        if (inList && (kind === 'time' || kind === 'react' || kind === 'date' || kind === 'ago') && idx > 0 && Math.random() < 0.7) { obj[f.key] = ''; return; }
        obj[f.key] = rValue(f, f.type === 'textarea' && !inList);
      } else if (f.type === 'number') {
        var kn = kindOf(f);
        if (kn === 'battery') obj[f.key] = 5 + rnd(96);
        else if (kn === 'count') obj[f.key] = 1 + rnd(9999);
      } else if (f.type === 'color') {
        if (/^#[0-9a-f]{6}$/i.test(obj[f.key] || '') && !/fg|ink|font|text/i.test(f.key)) obj[f.key] = pick(R.colors);
      } else if (inList && f.type === 'select') {
        var o = opts(f) || [];
        if (o.length) obj[f.key] = pick(o)[0];
      } else if (inList && f.type === 'toggle') {
        obj[f.key] = Math.random() < 0.3;
      }
    });
  }

  function randomize() {
    if (!tool) return;
    used = {};
    var lists = [];
    (function walk(fields) {
      fields.forEach(function (f) {
        if (f.type === 'row') return walk(f.fields);
        if (f.type === 'list') lists.push(f);
      });
    })(tool.fields);
    randomFields(tool.fields, st, false, 0);
    lists.forEach(function (f) {
      var arr = st[f.key] || (st[f.key] = []), want = 3 + rnd(4);
      // lists can cap how many random fills (e.g. trading card moves)
      if (f.rmax) { want = Math.min(want, f.rmax); if (arr.length > want) arr.length = want; }
      while (arr.length < want && f.adds && f.adds.length) {
        var a = pick(f.adds);
        arr.push(typeof a.item === 'function' ? a.item(st) : clone(a.item));
      }
      arr.forEach(function (it, i) {
        randomFields(f.item, it, true, i);
        // things placed on the picture by dragging (x/y in %) get spread out
        if (it && typeof it.x === 'number' && typeof it.y === 'number' && it.x <= 100 && it.y <= 100) {
          it.x = 22 + rnd(57);
          it.y = 22 + rnd(57);
        }
      });
    });
    buildForm();
    changed();
  }

  /* ---------- presets ---------- */

  var presetSel = {}, presetBox = null;
  function presetsGet(id) {
    return dbDo('readonly', function (os) { return os.get('presets:' + id); }).then(function (v) { return Array.isArray(v) ? v : []; }, function () { return []; });
  }
  function presetsPut(id, list) {
    return dbDo('readwrite', function (os) { return os.put(JSON.parse(JSON.stringify(list)), 'presets:' + id); });
  }
  function drawPresets() {
    if (!presetBox) {
      presetBox = el('div', 'f presets');
      presetBox.id = 'presets';
      form.parentNode.insertBefore(presetBox, form);
    }
    var t = tool;
    presetsGet(t.id).then(function (list) {
      if (tool !== t) return;
      presetBox.innerHTML = '';
      presetBox.appendChild(el('span', '', 'presets'));
      var row = el('div', 'pre-row');
      var cur = presetSel[t.id];
      if (cur != null && !list[cur]) cur = presetSel[t.id] = null;
      if (list.length) {
        var sel = el('select');
        sel.appendChild(el('option', '', ''));
        list.forEach(function (p, i) {
          var o = el('option', '', U.esc(p.name));
          o.value = i;
          sel.appendChild(o);
        });
        sel.value = cur == null ? '' : String(cur);
        sel.addEventListener('change', function () {
          if (sel.value === '') { presetSel[t.id] = null; return drawPresets(); }
          var p = list[+sel.value];
          presetSel[t.id] = +sel.value;
          if (histTimer) commit();
          st = Object.assign(clone(t.defaults), clone(p.state));
          buildForm();
          changed();
          drawPresets();
        });
        row.appendChild(sel);
      }
      function btn(label, fn) {
        var b = el('button', 'ghost small', label);
        b.type = 'button';
        b.addEventListener('click', fn);
        row.appendChild(b);
      }
      btn('new', function () {
        var name = prompt('name', 'preset ' + (list.length + 1));
        if (name == null || !name.trim()) return;
        list.push({ name: name.trim(), state: clone(st) });
        presetSel[t.id] = list.length - 1;
        presetsPut(t.id, list).then(drawPresets, function () { alert("couldn't save that"); });
      });
      if (cur != null) {
        btn('save', function () {
          list[cur].state = clone(st);
          presetsPut(t.id, list).then(function () { flash(this, 'saved'); }.bind(this), function () { alert("couldn't save that"); });
        });
        btn('rename', function () {
          var name = prompt('name', list[cur].name);
          if (name == null || !name.trim()) return;
          list[cur].name = name.trim();
          presetsPut(t.id, list).then(drawPresets);
        });
        btn('remove', function () {
          if (!confirm('remove ' + list[cur].name + '?')) return;
          list.splice(cur, 1);
          presetSel[t.id] = null;
          presetsPut(t.id, list).then(drawPresets);
        });
      }
      presetBox.appendChild(row);
    });
  }

  /* ---------- tools ---------- */

  function buildForm() {
    var ed = $('#editor'), top = ed.scrollTop;
    refreshers = [];
    inputs = {};
    form.innerHTML = '';
    tool.fields.forEach(function (f) { form.appendChild(field(f, st)); });
    drawPhonePanel();
    ed.scrollTop = top;
  }

  // symbols + fonts live in copypaste/ and show in a frame instead of the editor
  var EXTRAS = { symbols: 'symbols', fonts: 'fonts', bio: 'bio maker' }, frame = $('#extraFrame');
  function openExtra(id) {
    document.body.classList.add('extra-on');
    var url = 'copypaste/index.html?embed#' + id;
    if (!frame.getAttribute('src')) frame.setAttribute('src', url);
    else frame.contentWindow.location.hash = id;
    [].forEach.call(tabs.children, function (a) { a.classList.toggle('on', a.dataset.id === id); });
    document.title = 'screenies · ' + id;
  }

  function open(id) {
    if (histTimer) commit();
    if (EXTRAS[id]) return openExtra(id);
    document.body.classList.remove('extra-on');
    var t = TOOLS.filter(function (x) { return x.id === id; })[0] || TOOLS[0];
    tool = t;
    st = load(t);
    touched = false;
    buildForm();
    drawPresets();
    [].forEach.call(tabs.children, function (a) { a.classList.toggle('on', a.dataset.id === t.id); });
    document.title = 'screenies · ' + t.label;
    render();
    var h = histOf(t.id);
    if (lsGet(t)) { commit(); return Promise.resolve(); }
    if (!h.stack.length) commit();
    else histButtons();
    // the saved version lives in IndexedDB; swap it in when it arrives (unless you already started typing)
    return dbDo('readonly', function (os) { return os.get(t.id); }).then(function (saved) {
      if (tool !== t || touched) return;
      if (saved) {
        st = Object.assign(clone(t.defaults), saved);
        buildForm();
        render();
        if (h.stack.length <= 1) { h.stack = [snap(st)]; h.at = 0; }
      }
      commit();
      histButtons();
    }).catch(function () { /* no saved copy */ });
  }

  TOOLS.forEach(function (t) {
    var a = el('a', '', U.esc(t.label));
    a.href = '#' + t.id;
    a.dataset.id = t.id;
    tabs.appendChild(a);
  });
  Object.keys(EXTRAS).forEach(function (id) {
    var a = el('a', 'extra', EXTRAS[id]);
    a.href = '#' + id;
    a.dataset.id = id;
    tabs.appendChild(a);
  });

  window.addEventListener('hashchange', function () { open(location.hash.slice(1)); });
  // game sprites finished loading (or were forgotten): refresh whatever tool uses them
  if (window.GA) GA.onChange(function () { if (tool && tool.usesGames) { buildForm(); render(); } });
  window.addEventListener('resize', refit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (tool) refit(); });

  $('#reset').addEventListener('click', function () {
    if (!confirm('reset this one?')) return;
    var id = tool.id;
    try { localStorage.removeItem('screenies:' + id); } catch (e) { /* ignore */ }
    dbDo('readwrite', function (os) { return os.delete(id); }).catch(function () {}).then(function () { open(id); });
  });

  /* ---------- export ---------- */

  // "no bg": drop whatever sits behind the card (backdrop color/picture), keep the card's own look
  function clearBackdrop(shot) {
    // full phone screens aren't cards; a tool can also name its card (tool.card = '.selector') or opt out (false)
    if (tool.card === false || (!tool.card && shot.querySelector('.sbar, .dbar'))) return false;
    var sel = tool.card ? shot.querySelector(tool.card) : null;
    var R0 = shot.getBoundingClientRect(), area = R0.width * R0.height || 1;
    function filled(n) {
      var cs = getComputedStyle(n), c = colorOf(cs.backgroundColor);
      return cs.backgroundImage !== 'none' || (c && c.a > 0) || n.tagName === 'IMG';
    }
    if (!sel) {
      var q = [].slice.call(shot.children);
      while (q.length && !sel) {
        var n = q.shift(), r = n.getBoundingClientRect(), a = r.width * r.height / area;
        var cover = getComputedStyle(n).position === 'absolute' && a > 0.85;
        var mid = Math.abs(r.left + r.width / 2 - (R0.left + R0.width / 2)) < R0.width * 0.12;
        // the card has to hold (nearly) all of the typed stuff, or it's just a part of the screen
        var typed = shot.querySelectorAll('[data-e]').length, inside = n.querySelectorAll('[data-e]').length;
        if (!cover && n.tagName !== 'IMG' && a > 0.12 && a < 0.92 && mid && filled(n) && inside >= Math.max(1, typed * 0.9)) sel = n;
        else if (!cover) q = q.concat([].slice.call(n.children));
      }
    }
    if (!sel) return false;
    shot.style.setProperty('background', 'transparent', 'important');
    shot.style.setProperty('box-shadow', 'none', 'important');
    [].forEach.call(shot.querySelectorAll('*'), function (n) {
      if (n === sel || sel.contains(n)) return;
      if (n.contains(sel)) { n.style.setProperty('background', 'transparent', 'important'); return; }
      n.style.setProperty('visibility', 'hidden', 'important');
    });
    return true;
  }

  function canvasOf(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function imgFrom(src) {
    return new Promise(function (ok, bad) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = bad; im.src = src; });
  }
  // shrink, save as a rough jpeg, then blow it back up
  function jpegPass(c, q, k) {
    var w = Math.max(1, Math.round(c.width * k)), h = Math.max(1, Math.round(c.height * k)), s = canvasOf(w, h), g = s.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, w, h);
    g.drawImage(c, 0, 0, w, h);
    return imgFrom(s.toDataURL('image/jpeg', q)).then(function (im) {
      var o = canvasOf(c.width, c.height), og = o.getContext('2d');
      og.imageSmoothingEnabled = true;
      og.drawImage(im, 0, 0, c.width, c.height);
      return o;
    });
  }
  function crunch(blob) {
    var url = URL.createObjectURL(blob), alpha = null, W, H;
    return imgFrom(url).then(function (im) {
      URL.revokeObjectURL(url);
      W = im.naturalWidth; H = im.naturalHeight;
      var c = canvasOf(W, H), g = c.getContext('2d');
      g.drawImage(im, 0, 0);
      if (!opt.reshot) {
        var d = g.getImageData(0, 0, W, H).data;
        alpha = new Uint8ClampedArray(W * H);
        for (var i = 0, j = 3; i < alpha.length; i++, j += 4) alpha[i] = d[j];
      }
      return opt.old ? jpegPass(c, 0.5, 0.36) : c;
    }).then(function (c) {
      return opt.old ? jpegPass(c, 0.35, 0.6) : c;
    }).then(function (c) {
      if (!opt.old) return c;
      // faded, a bit warm/green, grainy
      var g = c.getContext('2d'), img = g.getImageData(0, 0, W, H), d = img.data;
      for (var i = 0; i < d.length; i += 4) {
        var r = d[i], gg = d[i + 1], b = d[i + 2], l = 0.3 * r + 0.59 * gg + 0.11 * b, nz = (Math.random() - 0.5) * 18;
        r = l + (r - l) * 0.78; gg = l + (gg - l) * 0.78; b = l + (b - l) * 0.78;
        d[i] = (r - 128) * 0.9 + 128 + 9 + nz;
        d[i + 1] = (gg - 128) * 0.9 + 128 + 6 + nz;
        d[i + 2] = (b - 128) * 0.9 + 128 - 8 + nz;
      }
      g.putImageData(img, 0, 0);
      return jpegPass(c, 0.42, 0.5);
    }).then(function (c) {
      if (!opt.reshot) return c;
      // a screenshot of a screenshot: smaller inside a dark border, faint moire lines
      var o = canvasOf(W, H), g = o.getContext('2d'), m = Math.round(Math.min(W, H) * 0.045);
      g.fillStyle = '#141414';
      g.fillRect(0, 0, W, H);
      g.imageSmoothingQuality = 'low';
      g.drawImage(c, m, Math.round(m * 1.6), W - m * 2, H - Math.round(m * 3.2));
      var img = g.getImageData(0, 0, W, H), d = img.data;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var k = 1 + 0.06 * Math.sin(x * 0.61 + y * 0.17) * Math.sin(y * 0.53 - x * 0.07), p = (y * W + x) * 4;
          d[p] *= k; d[p + 1] *= k; d[p + 2] *= k;
        }
      }
      g.putImageData(img, 0, 0);
      return jpegPass(o, 0.55, 0.7);
    }).then(function (c) {
      if (alpha) {
        var g = c.getContext('2d'), img = g.getImageData(0, 0, W, H), d = img.data;
        for (var i = 0, j = 3; i < alpha.length; i++, j += 4) d[j] = alpha[i];
        g.putImageData(img, 0, 0);
      }
      return new Promise(function (ok) { c.toBlob(ok, 'image/png'); });
    });
  }

  function shoot() {
    var shot = fit.firstElementChild;
    var keep = fit.style.transform;
    if (fit.contains(document.activeElement)) document.activeElement.blur();
    real = true;
    render();
    shot = fit.firstElementChild;
    fit.classList.add('exporting');
    fit.style.transform = '';
    var p = (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      layoutPhone();
      if (opt.nobg && !shot.classList.contains('pframe')) clearBackdrop(shot);
      return modernScreenshot.domToBlob(shot, { scale: 3, type: 'image/png' });
    }).then(function (b) { return opt.old || opt.reshot ? crunch(b) : b; });
    function done() { real = false; fit.classList.remove('exporting'); render(); }
    return p.then(function (b) { done(); return b; }, function (e) { done(); throw e; });
  }

  function flash(btn, text) {
    var old = btn.dataset.label || (btn.dataset.label = btn.textContent);
    btn.textContent = text;
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.textContent = old; }, 1400);
  }

  $('#save').addEventListener('click', function () {
    var btn = this;
    flash(btn, '...');
    shoot().then(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'screenie-' + tool.id + '-' + Date.now().toString(36) + '.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      flash(btn, 'saved');
    }).catch(function (e) { console.error(e); flash(btn, 'oops'); });
  });

  $('#copy').addEventListener('click', function () {
    var btn = this;
    if (!window.ClipboardItem || !navigator.clipboard) return flash(btn, 'no copy here');
    flash(btn, '...');
    navigator.clipboard.write([new ClipboardItem({ 'image/png': shoot() })])
      .then(function () { flash(btn, 'copied'); })
      .catch(function (e) { console.error(e); flash(btn, 'oops'); });
  });

  /* ---------- the extra buttons ---------- */

  (function () {
    var bar = $('#actions'), left = el('div', 'acts-left'), toggles = el('div', 'acts-opts');
    function mk(parent, label, fn, cls) {
      var b = el('button', cls || 'ghost small', label);
      b.type = 'button';
      b.addEventListener('click', fn);
      parent.appendChild(b);
      return b;
    }
    undoBtn = mk(left, 'undo', function () { step(-1); });
    redoBtn = mk(left, 'redo', function () { step(1); });
    mk(left, 'random', randomize);
    [['phone', 'phone'], ['nobg', 'no bg'], ['old', 'old'], ['reshot', 'reshot']].forEach(function (o) {
      var b = mk(toggles, o[1], function () {
        opt[o[0]] = !opt[o[0]];
        b.classList.toggle('on', opt[o[0]]);
        setLS('screenies:opts', opt);
        if (o[0] === 'phone') { drawPhonePanel(); render(); }
      }, 'ghost small opt');
      b.dataset.opt = o[0];
      b.classList.toggle('on', !!opt[o[0]]);
    });
    bar.insertBefore(left, bar.firstChild);
    bar.insertBefore(toggles, $('#save'));
  })();

  document.addEventListener('keydown', function (e) {
    if (!(e.ctrlKey || e.metaKey) || e.altKey || document.body.classList.contains('extra-on')) return;
    var k = e.key.toLowerCase();
    if (k !== 'z' && k !== 'y') return;
    var t = e.target;
    // inside a text box the browser's own undo handles the typing
    if (t && (t.isContentEditable || t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && /^(text|number|search|)$/.test(t.type)))) return;
    e.preventDefault();
    step(k === 'y' || e.shiftKey ? 1 : -1);
  });

  window.__sc = { open: open, shoot: shoot, state: function () { return st; }, tool: function () { return tool; }, render: render, inputs: function () { return inputs; },
    wipe: function () { return dbDo('readwrite', function (os) { return os.clear(); }); },
    undo: function () { step(-1); }, redo: function () { step(1); }, randomize: randomize, opts: opt, phone: phone,
    history: function () { return histOf(tool.id); }, commit: commit, presets: function () { return presetsGet(tool.id); } };

  open(location.hash.slice(1) || TOOLS[0].id);
})();
