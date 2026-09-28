/* screenies — tabs, the form builder, saving state, and png export */

(function () {
  var $ = function (sel) { return document.querySelector(sel); };
  var tabs = $('#tabs'), form = $('#form'), fit = $('#fit'), view = $('#view');
  var tool, st, refreshers = [], saveTimer, scale = 1, inputs = {}, real = false;
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
    saveTimer = setTimeout(function () {
      dbDo('readwrite', function (os) { return os.put(JSON.parse(JSON.stringify(s)), t.id); }).then(function () {
        try { localStorage.removeItem('screenies:' + t.id); } catch (e) { /* ignore */ }
      }).catch(function () {
        try { localStorage.setItem('screenies:' + t.id, JSON.stringify(s)); } catch (e) { /* full or blocked */ }
      });
    }, 300);
  }
  var touched = false;

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
    [].forEach.call(fit.querySelectorAll('img'), function (im) {
      if (!im.complete) im.addEventListener('load', refit);
    });
    wireInline();
    if (tool.mount) tool.mount(fit.firstElementChild, st, { scale: function () { return scale; }, save: save });
    refit();
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

    return el('div');
  }

  function listField(f) {
    var box = el('div', 'list');
    var draw = function () {
      box.innerHTML = '';
      var arr = st[f.key] || (st[f.key] = []);
      arr.forEach(function (item, i) {
        var card = el('div', 'item');
        var mark = function () { card.classList.toggle('me', f.meKey && item[f.meKey] === 'me'); };
        mark();
        var bar = el('div', 'item-bar');
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

  /* ---------- tools ---------- */

  function buildForm() {
    var ed = $('#editor'), top = ed.scrollTop;
    refreshers = [];
    inputs = {};
    form.innerHTML = '';
    tool.fields.forEach(function (f) { form.appendChild(field(f, st)); });
    ed.scrollTop = top;
  }

  function open(id) {
    var t = TOOLS.filter(function (x) { return x.id === id; })[0] || TOOLS[0];
    tool = t;
    st = load(t);
    touched = false;
    buildForm();
    [].forEach.call(tabs.children, function (a) { a.classList.toggle('on', a.dataset.id === t.id); });
    document.title = 'screenies · ' + t.label;
    render();
    if (lsGet(t)) return Promise.resolve();
    // the saved version lives in IndexedDB; swap it in when it arrives (unless you already started typing)
    return dbDo('readonly', function (os) { return os.get(t.id); }).then(function (saved) {
      if (!saved || tool !== t || touched) return;
      st = Object.assign(clone(t.defaults), saved);
      buildForm();
      render();
    }).catch(function () { /* no saved copy */ });
  }

  TOOLS.forEach(function (t) {
    var a = el('a', '', U.esc(t.label));
    a.href = '#' + t.id;
    a.dataset.id = t.id;
    tabs.appendChild(a);
  });

  window.addEventListener('hashchange', function () { open(location.hash.slice(1)); });
  window.addEventListener('resize', refit);

  $('#reset').addEventListener('click', function () {
    if (!confirm('reset this one?')) return;
    var id = tool.id;
    try { localStorage.removeItem('screenies:' + id); } catch (e) { /* ignore */ }
    dbDo('readwrite', function (os) { return os.delete(id); }).catch(function () {}).then(function () { open(id); });
  });

  /* ---------- export ---------- */

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
      return modernScreenshot.domToBlob(shot, { scale: 3, type: 'image/png' });
    });
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

  window.__sc = { open: open, shoot: shoot, state: function () { return st; }, tool: function () { return tool; }, render: render, inputs: function () { return inputs; },
    wipe: function () { return dbDo('readwrite', function (os) { return os.clear(); }); } };

  open(location.hash.slice(1) || TOOLS[0].id);
})();
