/* screenies — print stuff: teen magazine cover, photo booth strip, doll box, movie poster / vhs cover, trading card */

(function () {
  var esc = U.esc;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' pst-ph0"' + DI(path) + '></div>'; }
  function clean(v) { return String(bare(v) == null ? '' : bare(v)).replace(/​/g, ''); }
  // same picture every time for the same text (barcodes, scratches)
  function seeded(str) {
    var h = 2166136261;
    str = String(str || 'x');
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    var x = (h >>> 0) % 2147483646 + 1;
    return function () { x = x * 16807 % 2147483647; return (x - 1) / 2147483646; };
  }
  // grain/paper textures as small png tiles (svg filter textures break the png export)
  var noiseCache = {};
  function noise(size, rgb, maxA) {
    var k = size + rgb + maxA;
    if (noiseCache[k]) return noiseCache[k];
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var g = c.getContext('2d'), d = g.createImageData(size, size), r = seeded(k), col = rgb.split(',').map(Number);
    for (var i = 0; i < d.data.length; i += 4) {
      d.data[i] = col[0]; d.data[i + 1] = col[1]; d.data[i + 2] = col[2];
      d.data[i + 3] = Math.round(Math.pow(r(), 2.2) * maxA);
    }
    g.putImageData(d, 0, 0);
    return (noiseCache[k] = c.toDataURL('image/png'));
  }
  // shrink big one-line words (mastheads, titles, names) until they fit their box
  function fit(root) {
    function go() {
      [].forEach.call(root.querySelectorAll('[data-fit]'), function (el) {
        el.style.fontSize = '';
        if (el.dataset.fs) el.style.fontSize = el.dataset.fs + 'px';
        var size = parseFloat(getComputedStyle(el).fontSize), v = el.dataset.fit === 'v', n = 0;
        while (n++ < 60 && size > 12 && (v ? el.scrollHeight > el.clientHeight + 1 : el.scrollWidth > el.clientWidth + 1)) {
          size *= 0.94;
          el.style.fontSize = size + 'px';
        }
      });
    }
    go();
    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(function () { if (root.isConnected) go(); });
  }
  function ink(bg) { return U.lum(bg) > 0.45 ? '#111111' : '#ffffff'; }
  function barcode(seed, w, h) {
    var r = seeded(seed), x = 4, out = '';
    while (x < w - 6) {
      var bw = r() < 0.55 ? 1 : r() < 0.6 ? 2 : 3;
      out += '<rect x="' + x + '" y="0" width="' + bw + '" height="' + h + '"/>';
      x += bw + (r() < 0.5 ? 1 : 2);
    }
    // the long guard bars at the start / middle / end
    [2, Math.round(w / 2) - 1, w - 5].forEach(function (g) { out += '<rect x="' + g + '" y="0" width="1" height="' + (h + 5) + '"/><rect x="' + (g + 2) + '" y="0" width="1" height="' + (h + 5) + '"/>'; });
    return '<svg viewBox="0 0 ' + w + ' ' + (h + 5) + '" width="' + w + '" height="' + (h + 5) + '" fill="#000">' + out + '</svg>';
  }
  function digits(seed, n) {
    var r = seeded(seed + 'd'), s = '';
    for (var i = 0; i < n; i++) s += Math.floor(r() * 10);
    return s;
  }
  function burst(fill, pts) {
    var p = [];
    pts = pts || 18;
    for (var k = 0; k < pts * 2; k++) {
      var a = k / (pts * 2) * Math.PI * 2, rr = k % 2 ? 40 : 50;
      p.push((50 + Math.cos(a) * rr).toFixed(1) + ',' + (50 + Math.sin(a) * rr).toFixed(1));
    }
    return '<svg class="pst-burst-bg" viewBox="0 0 100 100"><polygon points="' + p.join(' ') + '" fill="' + fill + '"/></svg>';
  }

  /* ============================== magazine cover ============================== */

  var MAG = {
    pop: { label: 'teen pop mag', font: 'bubble', mast: '#ff2a8a', sw: ['#ff2a8a', '#ffe600', '#00b7ff', '#ffffff', '#111111', '#a64dff', '#ff7a00'] },
    rock: { label: 'rock mag', font: 'metal', mast: '#e10600', sw: ['#ffffff', '#ffd400', '#e10600', '#111111', '#bdbdbd', '#ff6a00'] },
    scene: { label: 'scene mag', font: 'drip', mast: '#ff1fa9', sw: ['#ff1fa9', '#39ff14', '#00e5ff', '#ffffff', '#111111', '#b026ff', '#ffee00'] }
  };
  var MAST_FONTS = [['bubble', 'bubble'], ['block', 'block'], ['metal', 'metal'], ['drip', 'drip'], ['marker', 'marker'], ['glam', 'glam serif'], ['script', 'script']];
  var SPOTS = [['tl', 'top left'], ['tr', 'top right'], ['l', 'middle left'], ['r', 'middle right'], ['bl', 'bottom left'], ['br', 'bottom right'], ['b', 'bottom'], ['corner', 'corner (by the name)']];

  TOOLS.push({
    id: 'magazine',
    mount: fit,
    label: 'magazine cover',
    defaults: { style: 'pop', masthead: '', mastFont: 'bubble', mastColor: '#ff2a8a', topline: '', photo: '', issue: '', date: '', price: '', barcode: true, lines: [] },
    fields: [
      { key: 'style', type: 'select', label: 'style', rebuild: true, options: Object.keys(MAG).map(function (k) { return [k, MAG[k].label]; }),
        onPick: function (o) { var m = MAG[o.style] || MAG.pop; o.mastFont = m.font; o.mastColor = m.mast; } },
      { key: 'photo', type: 'image', label: 'cover photo', max: 1400 },
      { key: 'topline', type: 'text', label: 'line above name' },
      { key: 'masthead', type: 'text', label: 'magazine name' },
      { type: 'row', fields: [
        { key: 'mastFont', type: 'select', label: 'name font', options: MAST_FONTS },
        { key: 'mastColor', type: 'color', label: 'name color', swatches: function (s) { return (MAG[s.style] || MAG.pop).sw; } }
      ] },
      { type: 'row', fields: [
        { key: 'issue', type: 'text', label: 'issue', placeholder: 'ISSUE 47' },
        { key: 'date', type: 'text', label: 'date', placeholder: 'MARCH 2006' },
        { key: 'price', type: 'text', label: 'price', placeholder: '$3.99' }
      ] },
      { key: 'barcode', type: 'toggle', label: 'barcode' },
      { type: 'head', label: 'cover lines' },
      { key: 'lines', type: 'list', adds: [
        { label: '+ line', item: function (s) { return { text: '', spot: 'tl', size: 'm', look: 'plain', color: (MAG[s.style] || MAG.pop).sw[0] }; } },
        { label: '+ headline', item: function (s) { return { text: '', spot: 'b', size: 'xl', look: 'plain', color: (MAG[s.style] || MAG.pop).sw[1] }; } },
        { label: '+ burst', item: function (s) { return { text: '', spot: 'corner', size: 's', look: 'burst', color: (MAG[s.style] || MAG.pop).sw[1] }; } }
      ], item: [
        { key: 'text', type: 'textarea', label: 'text (2nd line = small)', rows: 2 },
        { type: 'row', fields: [
          { key: 'spot', type: 'select', label: 'spot', options: SPOTS },
          { key: 'size', type: 'select', label: 'size', options: [['s', 'small'], ['m', 'medium'], ['l', 'big'], ['xl', 'huge']] },
          { key: 'look', type: 'select', label: 'look', options: [['plain', 'plain'], ['burst', 'burst'], ['banner', 'banner'], ['box', 'box'], ['circle', 'circle']] }
        ] },
        { key: 'color', type: 'color', label: 'color', swatches: function (s) { return (MAG[s.style] || MAG.pop).sw; } }
      ] }
    ],
    render: function (s) {
      var name = clean(s.masthead), n = name.length || 6;
      var fs = Math.round(Math.min(170, Math.max(54, 600 / (n * (s.mastFont === 'block' || s.mastFont === 'metal' ? 0.5 : 0.62)))));
      var zones = {};
      (s.lines || []).forEach(function (ln, i) {
        var p = 'lines.' + i + '.', raw = clean(ln.text).split('\n'), first = raw.shift() || '', rest = raw.join('\n');
        var body = '<b>' + esc(first) + '</b>' + (rest ? '<small>' + U.br(rest) + '</small>' : '');
        var c = ln.color || '#ffffff', look = ln.look || 'plain', inner;
        if (look === 'burst' || look === 'circle') {
          inner = '<div class="pst-ml pst-' + look + ' pst-s-' + ln.size + '" style="color:' + ink(c) + '">' + (look === 'burst' ? burst(c) : '<span class="pst-circ-bg" style="background:' + c + '"></span>') +
            '<div class="pst-mlt">' + EW(p + 'text', body) + '</div></div>';
        } else if (look === 'banner' || look === 'box') {
          var bg = look === 'box' ? '#ffffff' : c, fg = look === 'box' ? c : ink(c);
          inner = '<div class="pst-ml pst-' + look + ' pst-s-' + ln.size + '"><span class="pst-mlt" style="background:' + bg + ';color:' + fg + '">' + EW(p + 'text', body) + '</span></div>';
        } else {
          inner = '<div class="pst-ml pst-plain pst-s-' + ln.size + '" style="color:' + c + '">' + EW(p + 'text', body) + '</div>';
        }
        var z = ln.spot || 'tl';
        (zones[z] = zones[z] || []).push(inner);
      });
      var zhtml = Object.keys(zones).map(function (z) { return '<div class="pst-zone pst-z-' + z + '">' + zones[z].join('') + '</div>'; }).join('');
      var dateLine = [s.issue ? E('issue', s.issue) : '', s.date ? E('date', s.date) : '', s.price ? E('price', s.price) : ''].filter(Boolean).join('<i>&bull;</i>');
      var corner = zones.corner ? '<div class="pst-zone pst-z-corner">' + zones.corner.join('') + '</div>' : '';
      delete zones.corner;
      zhtml = Object.keys(zones).map(function (z) { return '<div class="pst-zone pst-z-' + z + '">' + zones[z].join('') + '</div>'; }).join('');
      return '<div class="shot pst pst-mag pst-st-' + s.style + (s.barcode ? ' pst-has-bc' : '') + '">' + pic(s.photo, 'photo', 'pst-mag-photo') + '<div class="pst-mag-gloss"></div>' +
        '<div class="pst-mag-lay"><div class="pst-mag-head">' + (s.topline ? '<div class="pst-mag-top">' + E('topline', s.topline) + '</div>' : '') +
        '<div class="pst-mast pst-mf-' + s.mastFont + '" data-fit data-fs="' + fs + '" style="color:' + s.mastColor + '">' + E('masthead', s.masthead) + '</div>' +
        (dateLine ? '<div class="pst-mag-date">' + dateLine + '</div>' : '') + '</div><div class="pst-mag-mid">' + zhtml + '</div></div>' + corner +
        (s.barcode ? '<div class="pst-mag-bc"><div class="pst-bc-top"><span>' + esc(clean(s.date) || 'DISPLAY UNTIL') + '</span><b>' + esc(clean(s.price)) + '</b></div>' +
          barcode(name + s.date + s.issue, 92, 40) + '<div class="pst-bc-num">0 ' + digits(name, 5) + ' ' + digits(name + 'x', 5) + ' 7</div></div>' : '') +
        '</div>';
    }
  });

  /* ============================== photo booth strip ============================== */

  TOOLS.push({
    id: 'photobooth',
    label: 'photo booth',
    defaults: { layout: 'strip4', p1: '', p2: '', p3: '', p4: '', paper: '#f6f2ea', frame: '#1a1a1a', bw: false, texture: true, caption: '', date: '', capFont: 'type', inkColor: '#c0392b' },
    fields: [
      { key: 'layout', type: 'select', label: 'layout', options: [['strip3', '3 photo strip'], ['strip4', '4 photo strip'], ['grid', '2x2 grid']] },
      { type: 'row', fields: [
        { key: 'p1', type: 'image', label: 'photo 1', max: 900 },
        { key: 'p2', type: 'image', label: 'photo 2', max: 900 }
      ] },
      { type: 'row', fields: [
        { key: 'p3', type: 'image', label: 'photo 3', max: 900 },
        { key: 'p4', type: 'image', label: 'photo 4', max: 900 }
      ] },
      { type: 'row', fields: [
        { key: 'paper', type: 'color', label: 'strip color', swatches: function () { return ['#f6f2ea', '#ffffff', '#111111', '#ffc8dd', '#2b0f1f', '#c9b6ff', '#b30f2f']; } },
        { key: 'frame', type: 'color', label: 'frame color', swatches: function () { return ['#1a1a1a', '#ffffff', '#ff4fa3', '#c0c0c0', '#d4af37']; } }
      ] },
      { type: 'row', fields: [
        { key: 'bw', type: 'toggle', label: 'black + white' },
        { key: 'texture', type: 'toggle', label: 'paper texture' }
      ] },
      { key: 'caption', type: 'text', label: 'caption' },
      { type: 'row', fields: [
        { key: 'date', type: 'text', label: 'date stamp', placeholder: '10.17.26' },
        { key: 'capFont', type: 'select', label: 'font', options: [['type', 'typewriter'], ['hand', 'handwritten'], ['stamp', 'stamp'], ['booth', 'booth print']] },
        { key: 'inkColor', type: 'color', label: 'ink', swatches: function () { return ['#c0392b', '#111111', '#ff4fa3', '#ffffff', '#3a4ba8']; } }
      ] }
    ],
    render: function (s) {
      var n = s.layout === 'strip3' ? 3 : 4;
      var cells = '';
      for (var i = 1; i <= n; i++) {
        var k = 'p' + i;
        cells += '<div class="pst-pb-cell" style="border-color:' + s.frame + '">' + pic(s[k], k, 'pst-pb-img') + '<span class="pst-pb-vig"></span></div>';
      }
      var dark = U.lum(s.paper) < 0.3;
      return '<div class="shot pst pst-pb pst-pbl-' + s.layout + (s.bw ? ' pst-pb-bw' : '') + (s.texture ? ' pst-pb-tex' : '') + (dark ? ' pst-pb-dark' : '') + '" style="background-color:' + s.paper + ';--pst-paper:url(' + noise(96, dark ? '255,255,255' : '90,75,60', dark ? 40 : 60) + ');--pst-grain:url(' + noise(80, '255,255,255', 46) + ')">' +
        '<div class="pst-pb-grid' + (s.layout === 'grid' ? ' pst-pb-two' : '') + '">' + cells + '</div>' +
        '<div class="pst-pb-foot pst-pbf-' + s.capFont + '" style="color:' + s.inkColor + '">' +
        '<div class="pst-pb-cap">' + E('caption', s.caption) + '</div>' +
        '<div class="pst-pb-date">' + E('date', s.date) + '</div></div></div>';
    }
  });

  /* ============================== doll box ============================== */

  var BOX = {
    pink: ['#ff5fae', '#111111', 'pink + black stripes'],
    purple: ['#7b2cbf', '#1b0b2e', 'purple'],
    teal: ['#17c3b2', '#0b2b33', 'teal'],
    red: ['#c1121f', '#140405', 'blood red'],
    custom: ['', '', 'custom']
  };
  // a cute little skull with a bow (drawn here, not anyone's logo)
  function skull(main, eyes) {
    return '<svg class="pst-skull" viewBox="0 0 100 100">' +
      '<path fill="' + main + '" d="M50 12c-21 0-35 14-35 33 0 11 5 19 12 24v10c0 4 3 7 7 7h4v-7h5v7h14v-7h5v7h4c4 0 7-3 7-7V69c7-5 12-13 12-24 0-19-14-33-35-33z"/>' +
      '<ellipse cx="36" cy="47" rx="9" ry="10" fill="' + eyes + '"/><ellipse cx="64" cy="47" rx="9" ry="10" fill="' + eyes + '"/>' +
      '<path d="M50 56l-5 9h10z" fill="' + eyes + '"/>' +
      '<g transform="translate(68 14) rotate(18)"><path fill="' + eyes + '" stroke="' + main + '" stroke-width="3" stroke-linejoin="round" d="M0 0-17-10q-5 10 0 20zM0 0l17-10q5 10 0 20z"/><circle r="5" fill="' + main + '"/></g></svg>';
  }
  var BIO_LABELS = ['Age', 'Freaky Flaw', 'Pet', 'Killer Style', 'Fave Food', 'Fave Activity', 'Biggest Pet Peeve', 'Friends'];

  TOOLS.push({
    id: 'dollbox',
    mount: fit,
    label: 'doll box',
    defaults: { theme: 'pink', c1: '#ff5fae', c2: '#111111', pic: '', inside: '', brand: '', name: '', nameFont: 'drip', nameColor: '#ffffff', tagline: '', about: '', bio: [], shine: true },
    fields: [
      { key: 'theme', type: 'select', label: 'box colors', options: Object.keys(BOX).map(function (k) { return [k, BOX[k][2]]; }), rebuild: true },
      { type: 'row', fields: [
        { key: 'c1', type: 'color', label: 'color 1' },
        { key: 'c2', type: 'color', label: 'color 2' }
      ] },
      { key: 'pic', type: 'image', label: 'character', max: 1200 },
      { key: 'inside', type: 'image', label: 'inside backdrop', max: 900 },
      { key: 'brand', type: 'text', label: 'brand' },
      { key: 'name', type: 'text', label: 'name' },
      { type: 'row', fields: [
        { key: 'nameFont', type: 'select', label: 'name font', options: [['drip', 'drippy'], ['spooky', 'spooky'], ['cute', 'cute'], ['script', 'script'], ['block', 'block']] },
        { key: 'nameColor', type: 'color', label: 'name color', swatches: function () { return ['#ffffff', '#ff5fae', '#111111', '#b8ff3a', '#c9a2ff', '#7ff3ff']; } }
      ] },
      { key: 'tagline', type: 'text', label: 'tagline', placeholder: 'daughter of ...' },
      { key: 'shine', type: 'toggle', label: 'plastic shine' },
      { type: 'head', label: 'side panel' },
      { key: 'about', type: 'textarea', label: 'about', rows: 4 },
      { key: 'bio', type: 'list', adds: [
        { label: '+ line', item: item({ label: '', value: '' }) },
        { label: '+ fave food', item: item({ label: 'Fave Food', value: '' }) },
        { label: '+ pet', item: item({ label: 'Pet', value: '' }) },
        { label: '+ freaky flaw', item: item({ label: 'Freaky Flaw', value: '' }) },
        { label: '+ killer style', item: item({ label: 'Killer Style', value: '' }) }
      ], item: [
        { key: 'label', type: 'text', label: 'label' },
        { key: 'value', type: 'textarea', label: 'what it says', rows: 2 }
      ] }
    ],
    render: function (s) {
      var t = BOX[s.theme] || BOX.pink, c1 = s.theme === 'custom' ? s.c1 : t[0], c2 = s.theme === 'custom' ? s.c2 : t[1];
      var stripes = s.theme === 'pink' || s.theme === 'custom';
      var pattern = stripes ? 'repeating-linear-gradient(90deg,' + c1 + ' 0 22px,' + c2 + ' 22px 44px)' :
        'radial-gradient(circle at 30% 20%,' + U.shade(c1, 0.25) + ',' + c1 + ' 45%,' + U.shade(c1, -0.35) + ')';
      var bio = (s.bio || []).map(function (b, i) {
        var p = 'bio.' + i + '.';
        return '<div class="pst-db-row"><div class="pst-db-lab" style="color:' + c1 + '">' + E(p + 'label', b.label) + ':</div><div class="pst-db-val">' + EB(p + 'value', b.value) + '</div></div>';
      }).join('');
      var tiny = '<span class="pst-db-mini">' + skull(c1, '#111111') + '</span>';
      return '<div class="shot pst pst-db" style="--c1:' + c1 + ';--c2:' + c2 + '">' +
        '<div class="pst-db-hang"><div class="pst-db-hole"></div></div>' +
        '<div class="pst-db-box">' +
        '<div class="pst-db-front" style="background:' + pattern + '">' +
        '<div class="pst-db-trim"></div>' +
        '<div class="pst-db-brand">' + skull('#ffffff', c2) + '<span>' + E('brand', s.brand) + '</span></div>' +
        '<div class="pst-db-win"><div class="pst-db-back" style="' + (s.inside ? '' : 'background:radial-gradient(circle at 50% 35%,' + U.shade(c1, 0.35) + ',' + U.shade(c1, -0.55) + ')') + '">' +
        (s.inside ? '<img class="pst-db-inside" src="' + s.inside + '"' + DI('inside') + ' alt="">' : '<div class="pst-db-inside pst-db-dots"' + DI('inside') + '></div>') + '</div>' +
        pic(s.pic, 'pic', 'pst-db-char') + (s.shine ? '<div class="pst-db-shine"></div>' : '') + '<div class="pst-db-rim"></div></div>' +
        '<div class="pst-db-plate"><div class="pst-db-name pst-nf-' + s.nameFont + '" style="color:' + s.nameColor + '">' + E('name', s.name) + '</div>' +
        (s.tagline ? '<div class="pst-db-tag">' + E('tagline', s.tagline) + '</div>' : '') + '</div>' +
        '<div class="pst-db-legal">' + tiny + '<span>Doll cannot stand alone. Colors and decorations may vary.</span></div>' +
        '</div>' +
        '<div class="pst-db-side" style="background:' + pattern + '"><div class="pst-db-shade"></div>' +
        '<div class="pst-db-card"><div class="pst-db-ch" style="background:' + c1 + ';color:' + ink(c1) + '">' + E('name', s.name) + '</div>' +
        (s.about ? '<div class="pst-db-about">' + EB('about', s.about) + '</div>' : '') + bio +
        '<div class="pst-db-sig">' + skull(c1, '#ffffff') + '</div></div>' +
        '<div class="pst-db-age">AGES 6+</div></div>' +
        '</div></div>';
    }
  });

  /* ============================== movie poster / vhs cover ============================== */

  var RATINGS = { none: ['', ''], g: ['G', 'GENERAL AUDIENCES'], pg: ['PG', 'PARENTAL GUIDANCE SUGGESTED'], pg13: ['PG-13', 'PARENTS STRONGLY CAUTIONED'],
    r: ['R', 'RESTRICTED'], nr: ['NR', 'NOT RATED'] };
  var TITLE_FONTS = [['bebas', 'tall'], ['anton', 'heavy'], ['serif', 'fancy serif'], ['cinzel', 'epic'], ['horror', 'horror'], ['drip', 'drippy'], ['script', 'script'], ['retro', 'retro'], ['western', 'western']];
  // billing block: lowercase words come out small, CAPS words come out tall
  function billing(v) {
    return clean(v).split('\n').map(function (line) {
      return line.split(/(\s+)/).map(function (w) {
        if (!w.trim()) return ' ';
        var small = w === w.toLowerCase() && /[a-z]/.test(w);
        return small ? '<em>' + esc(w.toUpperCase()) + '</em>' : esc(w);
      }).join('');
    }).join('<br>');
  }
  function ratingBox(s) {
    var r = RATINGS[s.rating] || RATINGS.none;
    if (!r[0]) return '';
    return '<div class="pst-rate"><div class="pst-rate-l">' + r[0] + '</div><div class="pst-rate-r"><b>' + r[1] + '</b>' +
      (s.reason ? '<span>' + E('reason', s.reason) + '</span>' : '') + '</div></div>';
  }
  function scratches(seed, w, h) {
    var r = seeded(seed), out = '';
    for (var i = 0; i < 34; i++) {
      var x = r() * w, y = r() * h, len = 6 + r() * 38, a = (r() - 0.5) * 1.4 + (r() < 0.5 ? 0 : 1.5);
      out += '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (x + Math.cos(a) * len).toFixed(1) + '" y2="' + (y + Math.sin(a) * len).toFixed(1) +
        '" stroke-width="' + (0.3 + r() * 0.7).toFixed(2) + '" stroke-opacity="' + (0.12 + r() * 0.3).toFixed(2) + '"/>';
    }
    for (var j = 0; j < 22; j++) {
      out += '<circle cx="' + (r() * w).toFixed(1) + '" cy="' + (r() * h).toFixed(1) + '" r="' + (0.6 + r() * 2.2).toFixed(1) + '" fill="#fff" fill-opacity="' + (0.25 + r() * 0.4).toFixed(2) + '" stroke="none"/>';
    }
    return '<svg class="pst-scr" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" stroke="#fff" stroke-linecap="round">' + out + '</svg>';
  }

  TOOLS.push({
    id: 'movieposter',
    mount: fit,
    label: 'movie poster',
    defaults: { mode: 'poster', image: '', names: '', tagline: '', title: '', titleFont: 'bebas', titleColor: '#ffffff', titlePos: 'bottom', credits: '', date: '', rating: 'pg13', reason: '',
      sticker: true, store: '', rental: '', rewind: true, wear: true, spine: '#111111' },
    fields: [
      { key: 'mode', type: 'select', label: 'kind', options: [['poster', 'movie poster'], ['vhs', 'vhs cover']], rebuild: true },
      { key: 'image', type: 'image', label: 'poster picture', max: 1400 },
      { key: 'names', type: 'text', label: 'names on top' },
      { key: 'tagline', type: 'text', label: 'tagline' },
      { key: 'title', type: 'textarea', label: 'title', rows: 2 },
      { type: 'row', fields: [
        { key: 'titleFont', type: 'select', label: 'title font', options: TITLE_FONTS },
        { key: 'titlePos', type: 'select', label: 'title spot', options: [['top', 'top'], ['middle', 'middle'], ['bottom', 'bottom']] },
        { key: 'titleColor', type: 'color', label: 'title color', swatches: function () { return ['#ffffff', '#e50914', '#ffd23f', '#ff5fae', '#111111', '#9be7ff']; } }
      ] },
      { key: 'credits', type: 'textarea', label: 'credits (lowercase words come out small)', rows: 4 },
      { type: 'row', fields: [
        { key: 'date', type: 'text', label: 'release date', placeholder: 'OCTOBER 31' },
        { key: 'rating', type: 'select', label: 'rating', options: Object.keys(RATINGS).map(function (k) { return [k, RATINGS[k][0] || 'none']; }) }
      ] },
      { key: 'reason', type: 'text', label: 'rated for' },
      { type: 'head', label: 'vhs' },
      { type: 'row', fields: [
        { key: 'spine', type: 'color', label: 'side color', swatches: function () { return ['#111111', '#ffffff', '#1f3a93', '#b3001b', '#ffd23f']; } },
        { key: 'wear', type: 'toggle', label: 'wear + scratches' }
      ] },
      { type: 'row', fields: [
        { key: 'sticker', type: 'toggle', label: 'rental sticker' },
        { key: 'rewind', type: 'toggle', label: 'be kind rewind' }
      ] },
      { type: 'row', fields: [
        { key: 'store', type: 'text', label: 'store name' },
        { key: 'rental', type: 'text', label: 'sticker text', placeholder: '3 NIGHT RENTAL' }
      ] }
    ],
    render: function (s) {
      var longest = Math.max.apply(null, clean(s.title).split('\n').map(function (l) { return l.length; }).concat([5]));
      var tsz = { script: 0.42, serif: 0.5, cinzel: 0.62, horror: 0.62, retro: 0.55, western: 0.6, drip: 0.45, anton: 0.46, bebas: 0.4 }[s.titleFont] || 0.5;
      var tfs = Math.round(Math.max(34, Math.min(s.mode === 'vhs' ? 104 : 128, (s.mode === 'vhs' ? 370 : 480) / (longest * tsz))));
      var title = '<div class="pst-mv-title pst-tf-' + s.titleFont + '" data-fit data-fs="' + tfs + '" style="color:' + s.titleColor + '">' + EB('title', s.title) + '</div>';
      var tag = s.tagline ? '<div class="pst-mv-tag">' + E('tagline', s.tagline) + '</div>' : '';
      var art = pic(s.image, 'image', 'pst-mv-img');
      if (s.mode === 'vhs') {
        var spineInk = ink(s.spine);
        var stickers = (s.sticker ? '<div class="pst-vhs-rent"><div class="pst-vr-store">' + E('store', s.store) + '</div><div class="pst-vr-txt">' + E('rental', s.rental) + '</div>' +
          '<div class="pst-vr-due">DUE BACK ____</div></div>' : '') +
          (s.rewind ? '<div class="pst-vhs-rw"><b>BE KIND</b><span>PLEASE REWIND</span></div>' : '');
        return '<div class="shot pst pst-vhs' + (s.wear ? ' pst-worn' : '') + '">' +
          '<div class="pst-vhs-spine" style="background:' + s.spine + ';color:' + spineInk + '">' +
          '<div class="pst-vs-logo" style="border-color:' + spineInk + '">VHS</div>' +
          '<div class="pst-vs-title pst-tf-' + s.titleFont + '" data-fit="v">' + E('title', String(s.title || '').replace(/\n/g, ' ')) + '</div>' +
          (RATINGS[s.rating] && RATINGS[s.rating][0] ? '<div class="pst-vs-rate" style="border-color:' + spineInk + '">' + RATINGS[s.rating][0] + '</div>' : '') +
          (s.wear ? '<div class="pst-wear-edge"></div>' : '') + '</div>' +
          '<div class="pst-vhs-front">' + art + '<div class="pst-mv-shade"></div>' +
          '<div class="pst-mv-inner pst-tp-' + s.titlePos + '">' +
          (s.names ? '<div class="pst-mv-names">' + E('names', s.names) + '</div>' : '') + tag +
          '<div class="pst-mv-mid">' + title + '</div>' +
          '<div class="pst-mv-low">' + (s.date ? '<div class="pst-mv-date">' + E('date', s.date) + '</div>' : '') + '</div></div>' +
          '<div class="pst-vhs-band"><span class="pst-vb-logo">VHS</span><span class="pst-vb-hifi">HI-FI<br>STEREO</span>' + ratingBox(s) + '</div>' +
          stickers + (s.wear ? scratches(clean(s.title) + 'v', 420, 740) + '<div class="pst-wear-edge"></div><div class="pst-crease"></div>' : '') + '</div></div>';
      }
      return '<div class="shot pst pst-mv">' + art + '<div class="pst-mv-shade"></div>' +
        '<div class="pst-mv-inner pst-tp-' + s.titlePos + '">' +
        (s.names ? '<div class="pst-mv-names">' + E('names', s.names) + '</div>' : '') + tag +
        '<div class="pst-mv-mid">' + title + '</div>' +
        '<div class="pst-mv-low">' + (s.date ? '<div class="pst-mv-date">' + E('date', s.date) + '</div>' : '') +
        '<div class="pst-bill-wrap"><div class="pst-bill">' + EW('credits', billing(s.credits)) + '</div></div>' +
        '<div class="pst-mv-legal">' + ratingBox(s) + '</div></div></div></div>';
    }
  });

  /* ============================== trading card ============================== */

  var TYPES = {
    fire: ['#e8562a', '#f7a07c', 'fire'], water: ['#2f8fdc', '#9fd1fb', 'water'], grass: ['#3fa34d', '#a8dca0', 'grass'], electric: ['#f5c518', '#fbe9a2', 'electric'],
    psychic: ['#a14fc8', '#e0b6f2', 'psychic'], dark: ['#3b3247', '#8a7d99', 'dark'], fairy: ['#ff7fb6', '#ffd0e4', 'fairy'], fighting: ['#b5562d', '#e7b08d', 'fighting'],
    metal: ['#8d99a6', '#d9dfe5', 'metal'], dragon: ['#b08a2e', '#e8d39a', 'dragon'], normal: ['#b9b4a6', '#ecebe6', 'normal']
  };
  var TYPE_ICON = {
    fire: 'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.4 1.4-3.7 2.3-5 .3 1.6 1 2.5 2 3 0-3 .2-5.5.7-8z',
    water: 'M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z',
    grass: 'M18.5 4.5C9 5 5 9.5 5.5 16c-1 1.5-1.5 2.6-1.8 3.5l1.6.6c.4-1 .9-2 1.7-3.1 6.2.3 11-3.5 11.5-12.5zM8 16c2-3 4.5-5.5 8-7.5-3 2.5-5.2 4.8-7 7.8z',
    electric: 'M13.5 2.5 5.5 13.5h5l-1.5 8 8.5-11.5h-5.3z',
    psychic: 'M12 6.5c-5 0-8.5 5.5-8.5 5.5s3.5 5.5 8.5 5.5 8.5-5.5 8.5-5.5-3.5-5.5-8.5-5.5zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z',
    dark: 'M15 3.5a8.5 8.5 0 1 0 5.5 14.9A9.5 9.5 0 0 1 15 3.5z',
    fairy: 'M12 2.5l2.4 6.6 6.9.4-5.4 4.3 1.8 6.7L12 16.7l-5.7 3.8 1.8-6.7-5.4-4.3 6.9-.4z',
    fighting: 'M7 9.5V6.8a1.6 1.6 0 0 1 3.2 0V9h.3V5.8a1.6 1.6 0 0 1 3.2 0V9h.3V6.6a1.6 1.6 0 0 1 3.2 0v4.1l.6-.4a1.6 1.6 0 0 1 2 2.4L16.5 17A5 5 0 0 1 12.6 19H11a5 5 0 0 1-5-5v-3a1.5 1.5 0 0 1 1-1.5z',
    metal: 'M12 3 19.8 7.5v9L12 21l-7.8-4.5v-9zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    dragon: 'M12 3 21 20H3zm0 6-4 7.5h8z',
    normal: 'M12 4.5l2.2 5.3 5.8.2-4.5 3.6 1.6 5.6L12 16l-5.1 3.2 1.6-5.6L4 10l5.8-.2z'
  };
  function energy(t, cls) {
    var c = TYPES[t] || TYPES.normal;
    return '<span class="pst-en ' + (cls || '') + '" style="background:radial-gradient(circle at 35% 30%,' + c[1] + ',' + c[0] + ' 70%)"><svg viewBox="0 0 24 24"><path fill="' + (t === 'electric' || t === 'normal' || t === 'metal' ? '#2a2a2a' : '#fff') + '" d="' + (TYPE_ICON[t] || TYPE_ICON.normal) + '"/></svg></span>';
  }
  var RARITY = { common: '●', uncommon: '◆', rare: '★', holo: '★★', secret: '★★★', none: '' };

  TOOLS.push({
    id: 'tradingcard',
    label: 'trading card',
    defaults: { style: 'tcg', image: '', name: '', stage: 'basic', hp: '', stat2: '', level: '4', type: 'psychic', custom: '#ff5fae', sub: '', moves: [], weak: 'dark', retreat: '1',
      rarity: 'rare', number: '', flavor: '', artist: '', holo: true },
    fields: [
      { key: 'style', type: 'select', label: 'style', rebuild: true, options: [['tcg', 'monster battle card'], ['sports', 'sports card'], ['anime', 'holo anime card']] },
      { key: 'image', type: 'image', label: 'picture', max: 1100 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'hp', type: 'text', label: 'hp / atk / jersey #' }
      ] },
      { type: 'row', fields: [
        { key: 'type', type: 'select', label: 'type', options: Object.keys(TYPES).map(function (k) { return [k, TYPES[k][2]]; }).concat([['custom', 'custom color']]) },
        { key: 'custom', type: 'color', label: 'custom color' }
      ] },
      { key: 'sub', type: 'text', label: 'kind / team line', placeholder: 'Vampire Bat Monster' },
      { type: 'row', fields: [
        { key: 'stage', type: 'select', label: 'stage', options: [['basic', 'basic'], ['s1', 'stage 1'], ['s2', 'stage 2'], ['none', 'none']] },
        { key: 'stat2', type: 'text', label: 'def (anime)' },
        { key: 'level', type: 'select', label: 'stars (anime)', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(function (k) { return [k, k]; }) }
      ] },
      { type: 'head', label: 'moves / stats' },
      { key: 'moves', type: 'list', adds: [{ label: '+ move', item: item({ cost: '2', name: '', text: '', dmg: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'name', type: 'text', label: 'name' },
          { key: 'dmg', type: 'text', label: 'damage / number' },
          { key: 'cost', type: 'select', label: 'cost', options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']] }
        ] },
        { key: 'text', type: 'textarea', label: 'what it does', rows: 2 }
      ] },
      { type: 'row', fields: [
        { key: 'weak', type: 'select', label: 'weakness', options: [['none', 'none']].concat(Object.keys(TYPES).map(function (k) { return [k, TYPES[k][2]]; })) },
        { key: 'retreat', type: 'select', label: 'retreat', options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']] }
      ] },
      { key: 'flavor', type: 'textarea', label: 'flavor text', rows: 2 },
      { type: 'row', fields: [
        { key: 'rarity', type: 'select', label: 'rarity', options: [['common', '● common'], ['uncommon', '◆ uncommon'], ['rare', '★ rare'], ['holo', '★★ double rare'], ['secret', '★★★ secret'], ['none', 'none']] },
        { key: 'number', type: 'text', label: 'card #', placeholder: '013/165' }
      ] },
      { type: 'row', fields: [
        { key: 'artist', type: 'text', label: 'illustrator' },
        { key: 'holo', type: 'toggle', label: 'holo shine' }
      ] }
    ],
    render: function (s) {
      var t = s.type === 'custom' ? null : TYPES[s.type] || TYPES.normal;
      var c = t ? t[0] : s.custom, cl = t ? t[1] : U.shade(s.custom, 0.6);
      var holo = s.holo ? '<div class="pst-holo"></div><div class="pst-holo2"></div>' : '';
      var rar = RARITY[s.rarity] || '';
      var moves = s.moves || [];
      var ic = s.type === 'custom' ? 'normal' : s.type;

      if (s.style === 'sports') {
        var stats = moves.map(function (m, i) {
          var p = 'moves.' + i + '.';
          return '<div class="pst-sp-st"><b>' + E(p + 'dmg', m.dmg) + '</b><span>' + E(p + 'name', m.name) + '</span></div>';
        }).join('');
        return '<div class="shot pst pst-tc pst-sp" style="--tc:' + c + ';--tl:' + cl + '"><div class="pst-sp-border">' +
          '<div class="pst-sp-art">' + pic(s.image, 'image', 'pst-tc-img') + holo +
          '<div class="pst-sp-num" style="background:' + c + ';color:' + ink(c) + '">' + E('hp', s.hp) + '</div>' +
          (rar ? '<div class="pst-sp-rar">' + rar + '</div>' : '') + '</div>' +
          '<div class="pst-sp-plate"><div class="pst-sp-name">' + E('name', s.name) + '</div><div class="pst-sp-team" style="background:' + c + ';color:' + ink(c) + '">' + E('sub', s.sub) + '</div></div>' +
          (stats ? '<div class="pst-sp-stats">' + stats + '</div>' : '') +
          '<div class="pst-sp-foot"><span>' + E('number', s.number) + '</span><span>' + E('artist', s.artist) + '</span></div>' +
          '</div></div>';
      }

      if (s.style === 'anime') {
        var lvl = Math.max(1, Math.min(12, parseInt(s.level, 10) || 1)), stars = '';
        for (var k = 0; k < lvl; k++) stars += '<i></i>';
        var effects = moves.map(function (m, i) {
          var p = 'moves.' + i + '.';
          return '<div class="pst-an-eff">' + (m.name ? '<b>' + E(p + 'name', m.name) + '</b> ' : '') + EB(p + 'text', m.text) + '</div>';
        }).join('');
        return '<div class="shot pst pst-tc pst-an" style="--tc:' + c + ';--tl:' + cl + '"><div class="pst-an-card">' +
          '<div class="pst-an-namebar"><div class="pst-an-name">' + E('name', s.name) + '</div>' + energy(ic, 'pst-an-attr') + '</div>' +
          '<div class="pst-an-stars">' + stars + '</div>' +
          '<div class="pst-an-frame"><div class="pst-an-art">' + pic(s.image, 'image', 'pst-tc-img') + holo + '</div></div>' +
          '<div class="pst-an-meta"><span>' + E('number', s.number) + '</span>' + (rar ? '<span class="pst-an-rar">' + rar + '</span>' : '') + '</div>' +
          '<div class="pst-an-box"><div class="pst-an-type">[ ' + E('sub', s.sub) + ' ]</div>' + effects +
          (s.flavor ? '<div class="pst-an-fl">' + EB('flavor', s.flavor) + '</div>' : '') +
          '<div class="pst-an-ad"><span>ATK/<b>' + E('hp', s.hp) + '</b></span><span>DEF/<b>' + E('stat2', s.stat2) + '</b></span></div></div>' +
          '<div class="pst-an-foot">' + E('artist', s.artist) + '</div>' +
          (s.holo ? '<div class="pst-holo pst-holo-full"></div>' : '') + '</div></div>';
      }

      var stage = { basic: 'BASIC', s1: 'STAGE 1', s2: 'STAGE 2', none: '' }[s.stage] || '';
      var mv = moves.map(function (m, i) {
        var p = 'moves.' + i + '.', cost = '';
        for (var q = 0; q < (parseInt(m.cost, 10) || 0); q++) cost += energy(q === 0 || ic === 'normal' ? ic : (q % 2 ? 'normal' : ic), 'pst-cost');
        return '<div class="pst-tg-move"><div class="pst-tg-mh"><span class="pst-tg-costs">' + cost + '</span><b>' + E(p + 'name', m.name) + '</b><span class="pst-tg-dmg">' + E(p + 'dmg', m.dmg) + '</span></div>' +
          (m.text ? '<div class="pst-tg-mt">' + EB(p + 'text', m.text) + '</div>' : '') + '</div>';
      }).join('');
      var ret = '';
      for (var z = 0; z < (parseInt(s.retreat, 10) || 0); z++) ret += energy('normal', 'pst-small');
      return '<div class="shot pst pst-tc pst-tg" style="--tc:' + c + ';--tl:' + cl + '"><div class="pst-tg-card">' +
        '<div class="pst-tg-top">' + (stage ? '<span class="pst-tg-stage">' + stage + '</span>' : '') + '<span class="pst-tg-name">' + E('name', s.name) + '</span>' +
        '<span class="pst-tg-hp"><small>HP</small>' + E('hp', s.hp) + '</span>' + energy(ic, 'pst-tg-type') + '</div>' +
        '<div class="pst-tg-frame"><div class="pst-tg-art">' + pic(s.image, 'image', 'pst-tc-img') + holo + '</div></div>' +
        '<div class="pst-tg-sub">' + E('sub', s.sub) + '</div>' +
        '<div class="pst-tg-moves">' + mv + '</div>' +
        '<div class="pst-tg-wr"><div><span>weakness</span>' + (s.weak !== 'none' ? energy(s.weak, 'pst-small') + '<b>×2</b>' : '') + '</div><div><span>resistance</span></div><div><span>retreat</span>' + ret + '</div></div>' +
        '<div class="pst-tg-bottom"><div class="pst-tg-illus">Illus. ' + E('artist', s.artist) + '<br><span class="pst-tg-no">' + E('number', s.number) + '</span> <span class="pst-tg-rar">' + rar + '</span></div>' +
        (s.flavor ? '<div class="pst-tg-fl">' + EB('flavor', s.flavor) + '</div>' : '') + '</div>' +
        '</div></div>';
    }
  });
})();
