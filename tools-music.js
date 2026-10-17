/* screenies — music group: concert ticket, receipt, last.fm, soundcloud/bandcamp, setlist, spotify blend */

(function () {
  var esc = U.esc;

  // extra fonts (marker handwriting + receipt/ticket printing) — a cors link so the png export can embed them
  (function () {
    if (document.getElementById('mzk-fonts')) return;
    var l = document.createElement('link');
    l.id = 'mzk-fonts';
    l.rel = 'stylesheet';
    l.crossOrigin = 'anonymous';
    l.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Courier+Prime:wght@400;700&display=swap';
    document.head.appendChild(l);
  })();

  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function uidm() { return Math.random().toString(36).slice(2, 8); }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' mzk-ph"' + DI(path) + '></div>'; }
  function ava(src, name, cls, path) { return U.avatar(src, bare(name), cls, undefined, path); }
  function txt(v) { return String(bare(v) == null ? '' : bare(v)).replace(/​/g, '').trim(); }
  function parts(v) { return txt(v).split(',').map(function (x) { return x.trim(); }).filter(Boolean); }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function fill(d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; }

  // seeded randomness so barcodes/waveforms stay the same for the same text
  function hash(str) {
    var h = 2166136261;
    str = String(str || '');
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // classic 1d barcode
  function barcode(seed, h, color) {
    var r = rng(hash(seed) + 7), x = 0, d = '';
    function bar(w) { d += 'M' + x + ' 0h' + w + 'v' + h + 'h-' + w + 'z'; x += w; }
    bar(2); x += 1; bar(1); x += 1;
    for (var i = 0; i < 46; i++) {
      bar(1 + Math.floor(r() * 3));
      x += 1 + Math.floor(r() * 3);
    }
    bar(2); x += 1; bar(1); x += 1; bar(2);
    return '<svg viewBox="0 0 ' + x + ' ' + h + '" preserveAspectRatio="none" fill="' + (color || '#000') + '"><path d="' + d + '"/></svg>';
  }
  // stacked pdf417-ish barcode (ticketmaster safetix)
  function pdf417(seed) {
    var r = rng(hash(seed) + 3), rows = 24, cols = 150, d = '';
    for (var y = 0; y < rows; y++) {
      var x = 0;
      // start pattern
      [8, 1, 1, 1, 1, 1, 1, 3].forEach(function (w, i) { if (i % 2 === 0) d += 'M' + x + ' ' + y * 3 + 'h' + w + 'v3h-' + w + 'z'; x += w; });
      x += 2;
      while (x < cols + 12) {
        var w = 1 + Math.floor(r() * 3);
        if (r() > 0.45) d += 'M' + x + ' ' + y * 3 + 'h' + w + 'v3h-' + w + 'z';
        x += w;
      }
      x = cols + 14;
      [7, 1, 1, 3, 1, 1, 1, 2, 1].forEach(function (w, i) { if (i % 2 === 0) d += 'M' + x + ' ' + y * 3 + 'h' + w + 'v3h-' + w + 'z'; x += w; });
    }
    return '<svg viewBox="0 0 ' + (cols + 32) + ' ' + rows * 3 + '" preserveAspectRatio="none"><path d="' + d + '"/></svg>';
  }
  function qr(seed) {
    var n = 29, r = rng(hash(seed) + 11), d = '';
    function finder(cx, cy) {
      d += 'M' + cx + ' ' + cy + 'h7v7h-7zM' + (cx + 1) + ' ' + (cy + 1) + 'v5h5v-5z' + 'M' + (cx + 2) + ' ' + (cy + 2) + 'h3v3h-3z';
    }
    function inFinder(x, y) { return (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9); }
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if ((x === 6 || y === 6) ? (x + y) % 2 === 0 : r() > 0.52) d += 'M' + x + ' ' + y + 'h1v1h-1z';
    }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    d += 'M' + (n - 9) + ' ' + (n - 9) + 'h5v5h-5zM' + (n - 8) + ' ' + (n - 8) + 'v3h3v-3zM' + (n - 7) + ' ' + (n - 7) + 'h1v1h-1z';
    return '<svg viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" fill-rule="evenodd"><path d="' + d + '"/></svg>';
  }

  // "3:45" / "1:02:03" -> seconds
  function secs(t) {
    var p = txt(t).split(':').map(function (x) { return parseInt(x, 10); });
    if (!p.length || p.some(isNaN)) return 0;
    return p.reduce(function (a, b) { return a * 60 + b; }, 0);
  }
  function clock(sec) {
    var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
    return (h ? h + ':' + ('0' + m).slice(-2) : m) + ':' + ('0' + s).slice(-2);
  }

  var I = {
    close: stroke('M6 6l12 12M18 6 6 18', 2.2),
    dotsV: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="19" r="1.9"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>',
    play: fill('M8 5.2v13.6L19 12z'),
    pause: fill('M7 5h3.6v14H7zM13.4 5H17v14h-3.6z'),
    heart: stroke('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z', 1.8),
    heartF: fill('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z'),
    repost: stroke('M4.5 7.5 7.5 4.5l3 3M7.5 5v9.5a3 3 0 0 0 3 3h3M19.5 16.5l-3 3-3-3M16.5 19V9.5a3 3 0 0 0-3-3h-3', 1.9),
    share: stroke('M12 15V3.5M7.5 8 12 3.5 16.5 8M4.5 14v4.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V14', 1.9),
    link: stroke('M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1', 1.9),
    chat: fill('M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z'),
    user: fill('M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm-8 9c0-4 3.6-7 8-7s8 3 8 7z'),
    wave: fill('M3 10h2v4H3zM7 7h2v10H7zM11 4h2v16h-2zM15 8h2v8h-2zM19 10h2v4h-2z'),
    prev: fill('M6 5h2v14H6zM19 5v14L9 12z'),
    next: fill('M16 5h2v14h-2zM5 5v14l10-7z'),
    shuffle: stroke('M3 7h3.5c2 0 3.2 1 4.3 2.6l2.4 4.8C14.3 16 15.5 17 17.5 17H21M18 14l3 3-3 3M3 17h3.5c1.5 0 2.5-.6 3.4-1.6M14.1 8.6C15 7.6 16 7 17.5 7H21M18 4l3 3-3 3', 1.8),
    dl: stroke('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v8M8.5 12.5 12 16l3.5-3.5', 1.7),
    addUser: stroke('M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 20.5c0-3.6 3.1-6 7-6s7 2.4 7 6M19 8v6M16 11h6', 1.8),
    back: stroke('M15 5l-7 7 7 7', 2.2),
    wallet: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="#fff"/><rect x="3" y="5" width="18" height="3.4" rx="1.2" fill="#ff9500"/><rect x="3" y="8" width="18" height="3.4" fill="#34c759"/><rect x="3" y="11" width="18" height="3.4" fill="#0a84ff"/><path d="M3 14h6.2a2.8 2.8 0 0 0 5.6 0H21v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#d9d9d9"/></svg>',
    spotify: ICON.spotify,
    sc: '<svg viewBox="0 0 40 18"><path d="M0 13.5c0 1 .5 1.8 1.2 1.8s1.2-.8 1.2-1.8-.5-1.8-1.2-1.8S0 12.5 0 13.5zm3-3.2v6.4c0 .4.3.6.6.6s.6-.2.6-.6v-6.4c0-.4-.3-.6-.6-.6s-.6.2-.6.6zm2.6-1.5v8c0 .4.3.6.6.6s.6-.2.6-.6v-8c0-.4-.3-.6-.6-.6s-.6.2-.6.6zm2.6-.6v8.6c0 .4.3.6.6.6s.6-.2.6-.6V8.2c0-.4-.3-.6-.6-.6s-.6.2-.6.6zm2.6 1v7.6c0 .4.3.6.6.6s.6-.2.6-.6V9.2c0-.4-.3-.6-.6-.6s-.6.2-.6.6zm2.6-4.6v12.2c0 .4.3.6.6.6s.6-.2.6-.6V4.6c0-.4-.3-.6-.6-.6s-.6.2-.6.6zm2.6-1.4v13.6c0 .3.3.6.6.6H33c3 0 5.4-2.4 5.4-5.4S36 6.6 33 6.6c-.8 0-1.5.2-2.2.5C30.3 3.2 27 .3 23 .3c-1 0-2 .2-2.9.5-.4.1-.5.3-.5.6z"/></svg>',
    bcLogo: '<svg viewBox="0 0 24 14"><path d="M0 14 7 0h17l-7 14z"/></svg>'
  };

  /* ============================== concert ticket ============================== */

  TOOLS.push({
    id: 'ticket',
    label: 'concert ticket',
    defaults: { style: 'mobile', code: 'safetix', clock: '9:41', battery: 80, showPct: false, image: '', artist: '', tour: '', venue: '', city: '', date: '', time: '',
      section: '', row: '', seat: '', price: '', kind: '', count: '', band: '#1d1b2e', bandText: '#f4c9de' },
    fields: [
      { type: 'row', fields: [
        { key: 'style', type: 'select', label: 'style', options: [['mobile', 'ticketmaster app'], ['paper', 'printed ticket'], ['band', 'festival wristband']] },
        { key: 'code', type: 'select', label: 'barcode', options: [['safetix', 'safetix'], ['qr', 'qr code']] }
      ] },
      U.STATUS_FIELDS,
      { key: 'image', type: 'image', label: 'event picture', max: 1000 },
      { type: 'row', fields: [
        { key: 'artist', type: 'text', label: 'artist' },
        { key: 'tour', type: 'text', label: 'tour' }
      ] },
      { type: 'row', fields: [
        { key: 'venue', type: 'text', label: 'venue' },
        { key: 'city', type: 'text', label: 'city' }
      ] },
      { type: 'row', fields: [
        { key: 'date', type: 'text', label: 'date', placeholder: 'Sat, Oct 17, 2026' },
        { key: 'time', type: 'text', label: 'time', placeholder: '7:30 PM' }
      ] },
      { type: 'row', fields: [
        { key: 'section', type: 'text', label: 'section' },
        { key: 'row', type: 'text', label: 'row' },
        { key: 'seat', type: 'text', label: 'seat' }
      ] },
      { type: 'row', fields: [
        { key: 'price', type: 'text', label: 'price', placeholder: '$45.00' },
        { key: 'kind', type: 'text', label: 'ticket type', placeholder: 'General Admission' },
        { key: 'count', type: 'text', label: 'tickets', placeholder: '2' }
      ] },
      { type: 'row', fields: [
        { key: 'band', type: 'color', label: 'band color', swatches: function () { return ['#1d1b2e', '#000000', '#c2185b', '#f4c9de', '#5e2a84', '#b71c1c', '#ffffff']; } },
        { key: 'bandText', type: 'color', label: 'band text', swatches: function () { return ['#f4c9de', '#ffffff', '#000000', '#ff3d9a', '#c0c0c0', '#f4c542']; } }
      ] }
    ],
    render: function (s) {
      var seed = txt(s.artist) + txt(s.venue) + txt(s.date) + txt(s.section) + txt(s.row) + txt(s.seat);
      if (s.style === 'paper') return tkPaper(s, seed);
      if (s.style === 'band') return tkBand(s);
      var n = Math.max(1, parseInt(txt(s.count), 10) || 1);
      var dots = '';
      for (var i = 0; i < Math.min(n, 8); i++) dots += '<i' + (i === 0 ? ' class="on"' : '') + '></i>';
      var bc = s.code === 'qr' ? '<div class="mzk-tm-qr">' + qr(seed) + '</div>' : '<div class="mzk-tm-pdf">' + pdf417(seed) + '<span class="mzk-tm-scan"></span></div>';
      var when = [s.date ? E('date', s.date) : '', s.time ? E('time', s.time) : ''].filter(Boolean).join(' &bull; ') || E('date', s.date);
      return '<div class="shot mzk-tm">' +
        '<div class="mzk-tm-top">' + U.statusBar(s) +
        '<div class="mzk-tm-nav"><span class="mzk-tm-x">' + I.close + '</span><span class="mzk-tm-tt">My Tickets</span><span class="mzk-tm-x">' + I.dotsV + '</span></div></div>' +
        '<div class="mzk-tm-body">' +
        '<div class="mzk-tm-count">' + (n > 1 ? n + ' tickets' : '1 ticket') + '</div>' +
        '<div class="mzk-tm-card">' +
        '<div class="mzk-tm-head"><div class="mzk-tm-kind">' + E('kind', s.kind) + '</div>' +
        '<div class="mzk-tm-ssr"><div><span>SEC</span><b>' + E('section', s.section) + '</b></div><div><span>ROW</span><b>' + E('row', s.row) + '</b></div><div><span>SEAT</span><b>' + E('seat', s.seat) + '</b></div></div></div>' +
        '<div class="mzk-tm-img">' + pic(s.image, 'image', 'mzk-tm-photo') + '<div class="mzk-tm-shade"></div>' +
        '<div class="mzk-tm-ev"><div class="mzk-tm-art">' + E('artist', s.artist) + (s.tour ? '<span class="mzk-tm-tour">' + E('tour', s.tour) + '</span>' : '') + '</div>' +
        '<div class="mzk-tm-when">' + when + '</div><div class="mzk-tm-ven">' + E('venue', s.venue) + (s.city ? ', ' + E('city', s.city) : '') + '</div></div></div>' +
        '<div class="mzk-tm-code">' + bc + '<div class="mzk-tm-ss">Screenshots won\'t get you in.</div></div>' +
        '<div class="mzk-tm-wal"><span class="mzk-tm-wbtn">' + I.wallet + '<span><small>Add to</small>Apple Wallet</span></span></div>' +
        '<div class="mzk-tm-links"><span>View Ticket</span><span>Ticket Details</span></div>' +
        '</div>' +
        '<div class="mzk-tm-dots">' + dots + '</div>' +
        '<div class="mzk-tm-btns"><span>Transfer</span><span>Sell</span></div>' +
        '</div></div>';
    }
  });

  function tkPaper(s, seed) {
    var r = rng(hash(seed) + 5), L = 'ABCDEFGHJKLMNPRSTUVWXYZ';
    var ev = 'E' + Math.floor(r() * 9000 + 1000) + L[Math.floor(r() * L.length)];
    var serial = L[Math.floor(r() * L.length)] + Math.floor(r() * 90000 + 10000) + ' ' + L[Math.floor(r() * L.length)] + L[Math.floor(r() * L.length)] + Math.floor(r() * 900 + 100);
    var ref = Math.floor(r() * 9e6 + 1e6);
    var pattern = '';
    for (var i = 0; i < 26; i++) pattern += '<span>ticketmaster ticketmaster ticketmaster ticketmaster ticketmaster ticketmaster ticketmaster</span>';
    var when = [s.date ? E('date', s.date) : '', s.time ? E('time', s.time) : ''].filter(Boolean).join(' ') || E('date', s.date);
    return '<div class="shot mzk-tp"><div class="mzk-tp-tk">' +
      '<div class="mzk-tp-pat">' + pattern + '</div>' +
      '<div class="mzk-tp-logo"><span>ticketmaster</span></div>' +
      '<div class="mzk-tp-main">' +
      '<div class="mzk-tp-grid">' +
      '<div class="mzk-tp-cell w"><i>EVENT CODE</i><b>' + ev + '</b></div>' +
      '<div class="mzk-tp-cell"><i>SECTION/AISLE</i><b>' + E('section', s.section) + '</b></div>' +
      '<div class="mzk-tp-cell"><i>ROW/BOX</i><b>' + E('row', s.row) + '</b></div>' +
      '<div class="mzk-tp-cell"><i>SEAT</i><b>' + E('seat', s.seat) + '</b></div>' +
      '<div class="mzk-tp-cell"><i>ADMISSION</i><b>' + E('price', s.price) + '</b></div></div>' +
      '<div class="mzk-tp-print">' +
      '<div class="mzk-tp-l1">' + E('kind', s.kind) + '</div>' +
      '<div class="mzk-tp-big">' + E('artist', s.artist) + '</div>' +
      (s.tour ? '<div class="mzk-tp-l">' + E('tour', s.tour) + '</div>' : '') +
      '<div class="mzk-tp-l">' + E('venue', s.venue) + '</div>' +
      '<div class="mzk-tp-l">' + E('city', s.city) + '</div>' +
      '<div class="mzk-tp-l">' + when + '</div></div>' +
      '<div class="mzk-tp-foot"><span>ADMIT ONE</span><span>' + serial + '</span><span>NO REFUNDS/NO EXCHANGES</span></div></div>' +
      '<div class="mzk-tp-perf"></div>' +
      '<div class="mzk-tp-stub"><div class="mzk-tp-sc"><i>EVENT CODE</i><b>' + ev + '</b></div>' +
      '<div class="mzk-tp-sc"><i>SECTION</i><b>' + E('section', s.section) + '</b></div>' +
      '<div class="mzk-tp-sc"><i>ROW</i><b>' + E('row', s.row) + '</b></div>' +
      '<div class="mzk-tp-sc"><i>SEAT</i><b>' + E('seat', s.seat) + '</b></div>' +
      '<div class="mzk-tp-sc"><i>ADMISSION</i><b>' + E('price', s.price) + '</b></div>' +
      '<div class="mzk-tp-sa">' + E('artist', s.artist) + '</div><div class="mzk-tp-sd">' + E('date', s.date) + '</div>' +
      '<div class="mzk-tp-ref">' + ref + '</div></div>' +
      '</div></div>';
  }

  function tkBand(s) {
    var star = '<b class="mzk-wb-star">★</b>';
    var words = ['artist', 'tour', 'kind', 'date'].filter(function (k) { return k === 'artist' || txt(s[k]) || s[k] === GHOST; })
      .map(function (k) { return E(k, s[k]); }).join(star);
    var rep = '';
    for (var i = 0; i < 8; i++) rep += '<span>' + words + star + '</span>';
    return '<div class="shot mzk-wb" style="--band:' + s.band + ';--bt:' + s.bandText + '">' +
      '<div class="mzk-wb-strap"><div class="mzk-wb-weave"><div class="mzk-wb-txt">' + rep + '</div></div>' +
      '<div class="mzk-wb-tag">' + (s.image ? '<img src="' + s.image + '"' + DI('image') + ' alt="">' : '<div class="mzk-wb-tn"' + DI('image') + '></div>') +
      '<div class="mzk-wb-chip"></div></div>' +
      '<div class="mzk-wb-clasp"><i></i></div></div>' +
      '<div class="mzk-wb-tail"><div class="mzk-wb-weave"><div class="mzk-wb-txt">' + rep + '</div></div></div>' +
      '</div>';
  }

  /* ============================== receipt (receiptify) ============================== */

  var RC_PERIOD = { month: 'LAST MONTH', six: 'LAST 6 MONTHS', all: 'ALL TIME' };
  TOOLS.push({
    id: 'receipt',
    label: 'music receipt',
    defaults: { title: '', period: 'month', font: 'thermal', order: '', name: '', date: '', items: [], card: '', auth: '', thanks: '', site: '' },
    fields: [
      { key: 'title', type: 'text', label: 'store name', placeholder: 'RECEIPTIFY' },
      { type: 'row', fields: [
        { key: 'period', type: 'select', label: 'period', options: [['month', 'last month'], ['six', 'last 6 months'], ['all', 'all time']] },
        { key: 'font', type: 'select', label: 'print', options: [['thermal', 'thermal'], ['type', 'typewriter']] }
      ] },
      { type: 'row', fields: [
        { key: 'order', type: 'text', label: 'order #', placeholder: '0001' },
        { key: 'name', type: 'text', label: 'name' }
      ] },
      { key: 'date', type: 'text', label: 'date', placeholder: 'SATURDAY, OCTOBER 17, 2026' },
      { type: 'head', label: 'songs' },
      { key: 'items', type: 'list', adds: [{ label: '+ song', item: item({ song: '', artist: '', time: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'song', type: 'text', label: 'song' },
          { key: 'artist', type: 'text', label: 'artist' },
          { key: 'time', type: 'text', label: 'length' }
        ] }
      ] },
      { type: 'head', label: 'bottom' },
      { type: 'row', fields: [
        { key: 'card', type: 'text', label: 'card #', placeholder: '2026' },
        { key: 'auth', type: 'text', label: 'auth code' }
      ] },
      { key: 'thanks', type: 'text', label: 'thank you line', placeholder: 'THANK YOU FOR VISITING!' },
      { key: 'site', type: 'text', label: 'bottom link' }
    ],
    render: function (s) {
      var list = s.items || [], total = 0;
      var rows = list.map(function (it, i) {
        var p = 'items.' + i + '.';
        total += secs(it.time);
        return '<tr><td class="mzk-rc-q">' + ('0' + (i + 1)).slice(-2) + '</td><td class="mzk-rc-i">' + E(p + 'song', it.song) +
          (txt(it.artist) || it.artist === GHOST ? ' - ' + E(p + 'artist', it.artist) : '') + '</td><td class="mzk-rc-a">' + E(p + 'time', it.time) + '</td></tr>';
      }).join('');
      var dash = '<div class="mzk-rc-dash"></div>';
      return '<div class="shot mzk-rc' + (s.font === 'type' ? ' mzk-rc-ty' : '') + '"><div class="mzk-rc-paper">' +
        '<div class="mzk-rc-edge t"></div>' +
        '<div class="mzk-rc-in">' +
        '<div class="mzk-rc-store">' + E('title', s.title) + '</div>' +
        '<div class="mzk-rc-per">' + RC_PERIOD[s.period] + '</div>' +
        '<div class="mzk-rc-meta"><div>ORDER #' + E('order', s.order) + ' FOR ' + E('name', s.name) + '</div><div>' + E('date', s.date) + '</div></div>' +
        '<table class="mzk-rc-tb"><thead><tr><td colspan="3">' + dash + '</td></tr><tr><th class="mzk-rc-q">QTY</th><th class="mzk-rc-i">ITEM</th><th class="mzk-rc-a">AMT</th></tr>' +
        '<tr><td colspan="3">' + dash + '</td></tr></thead><tbody>' + rows + '</tbody></table>' +
        dash +
        '<div class="mzk-rc-tot"><span>ITEM COUNT:</span><span>' + list.length + '</span></div>' +
        '<div class="mzk-rc-tot big"><span>TOTAL:</span><span>' + clock(total) + '</span></div>' +
        dash +
        '<div class="mzk-rc-card"><div>CARD #: **** **** **** ' + E('card', s.card) + '</div><div>AUTH CODE: ' + E('auth', s.auth) + '</div><div>CARDHOLDER: ' + E('name', s.name) + '</div></div>' +
        '<div class="mzk-rc-thx">' + E('thanks', s.thanks) + '</div>' +
        '<div class="mzk-rc-bar">' + barcode(txt(s.name) + txt(s.order) + list.length, 60) + '</div>' +
        '<div class="mzk-rc-site">' + E('site', s.site) + '</div>' +
        '</div><div class="mzk-rc-edge b"></div></div></div>';
    }
  });

  /* ============================== last.fm ============================== */

  var LF_PER = [['7', 'Last 7 days'], ['30', 'Last 30 days'], ['90', 'Last 90 days'], ['180', 'Last 180 days'], ['365', 'Last 365 days'], ['all', 'All time']];
  TOOLS.push({
    id: 'lastfm',
    label: 'last.fm',
    defaults: { theme: 'light', layout: 'grid', period: '30', cover: '', avatar: '', user: '', realname: '', since: '', scrobbles: '', artistsN: '', loved: '',
      now: true, recent: [], artists: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'layout', type: 'select', label: 'top artists', options: [['grid', 'grid'], ['list', 'list']] },
        { key: 'period', type: 'select', label: 'period', options: LF_PER }
      ] },
      { key: 'cover', type: 'image', label: 'header picture', max: 1400 },
      { type: 'row', fields: [
        { key: 'avatar', type: 'image', label: 'avatar', max: 300 },
        { key: 'user', type: 'text', label: 'username' }
      ] },
      { type: 'row', fields: [
        { key: 'realname', type: 'text', label: 'name' },
        { key: 'since', type: 'text', label: 'scrobbling since', placeholder: '6 Feb 2012' }
      ] },
      { type: 'row', fields: [
        { key: 'scrobbles', type: 'text', label: 'scrobbles' },
        { key: 'artistsN', type: 'text', label: 'artists' },
        { key: 'loved', type: 'text', label: 'loved tracks' }
      ] },
      { type: 'head', label: 'recent tracks' },
      { key: 'now', type: 'toggle', label: 'first one scrobbling now' },
      { key: 'recent', type: 'list', adds: [{ label: '+ track', item: item({ art: '', title: '', artist: '', when: '', love: false }) }], item: [
        { type: 'row', fields: [
          { key: 'art', type: 'image', label: 'art', max: 200 },
          { key: 'title', type: 'text', label: 'track' },
          { key: 'artist', type: 'text', label: 'artist' }
        ] },
        { type: 'row', fields: [
          { key: 'when', type: 'text', label: 'when', placeholder: '3 minutes ago' },
          { key: 'love', type: 'toggle', label: 'loved' }
        ] }
      ] },
      { type: 'head', label: 'top artists' },
      { key: 'artists', type: 'list', adds: [{ label: '+ artist', item: item({ img: '', name: '', plays: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'img', type: 'image', label: 'picture', max: 500 },
          { key: 'name', type: 'text', label: 'artist' },
          { key: 'plays', type: 'text', label: 'plays' }
        ] }
      ] }
    ],
    render: function (s) {
      var per = (LF_PER.filter(function (p) { return p[0] === s.period; })[0] || LF_PER[1])[1];
      var recent = (s.recent || []).map(function (t, i) {
        var p = 'recent.' + i + '.', live = s.now && i === 0;
        return '<tr class="' + (live ? 'mzk-lf-live' : '') + '"><td class="mzk-lf-c-art">' + pic(t.art, p + 'art', 'mzk-lf-art') + '</td>' +
          '<td class="mzk-lf-c-love' + (t.love ? ' on' : '') + '">' + (t.love ? I.heartF : I.heart) + '</td>' +
          '<td class="mzk-lf-c-name">' + E(p + 'title', t.title) + '</td><td class="mzk-lf-c-artist">' + E(p + 'artist', t.artist) + '</td>' +
          '<td class="mzk-lf-c-when">' + (live ? '<span class="mzk-lf-eq"><i></i><i></i><i></i></span>Scrobbling now' : E(p + 'when', t.when)) + '</td>' +
          '<td class="mzk-lf-c-more">' + I.dots + '</td></tr>';
      }).join('');
      var arts = s.artists || [], maxPlays = 1;
      arts.forEach(function (a) { maxPlays = Math.max(maxPlays, parseInt(txt(a.plays).replace(/\D/g, ''), 10) || 0); });
      var top;
      if (s.layout === 'list') {
        top = '<table class="mzk-lf-chart">' + arts.map(function (a, i) {
          var p = 'artists.' + i + '.', n = parseInt(txt(a.plays).replace(/\D/g, ''), 10) || 0;
          return '<tr><td class="mzk-lf-rank">' + (i + 1) + '</td><td class="mzk-lf-c-art">' + pic(a.img, p + 'img', 'mzk-lf-art r') + '</td>' +
            '<td class="mzk-lf-c-name">' + E(p + 'name', a.name) + '</td>' +
            '<td class="mzk-lf-c-bar"><div class="mzk-lf-bar"><i style="width:' + Math.max(8, n / maxPlays * 100) + '%"></i><span>' + E(p + 'plays', a.plays) + ' scrobbles</span></div></td></tr>';
        }).join('') + '</table>';
      } else {
        top = '<div class="mzk-lf-grid">' + arts.map(function (a, i) {
          var p = 'artists.' + i + '.';
          return '<div class="mzk-lf-tile' + (i < 2 ? ' big' : '') + '">' + pic(a.img, p + 'img', 'mzk-lf-timg') +
            '<div class="mzk-lf-tcap"><div class="mzk-lf-tn">' + E(p + 'name', a.name) + '</div><div class="mzk-lf-tp">' + E(p + 'plays', a.plays) + ' plays</div></div></div>';
        }).join('') + '</div>';
      }
      var meta = [s.realname ? E('realname', s.realname) : '', 'scrobbling since ' + E('since', s.since)].join(' &bull; ');
      return '<div class="shot mzk-lf' + (s.theme === 'dark' ? ' dk' : '') + '">' +
        '<div class="mzk-lf-mast"><span class="mzk-lf-logo">last.fm</span><span class="mzk-lf-nav">Live</span><span class="mzk-lf-nav">Music</span><span class="mzk-lf-nav">Charts</span><span class="mzk-lf-nav">Events</span><span class="mzk-lf-nav">Features</span>' +
        ava(s.avatar, s.user, 'mzk-lf-mav', 'avatar') + '</div>' +
        '<div class="mzk-lf-hero">' + (s.cover ? '<img class="mzk-lf-bg" src="' + s.cover + '"' + DI('cover') + ' alt="">' : '<div class="mzk-lf-bg mzk-lf-nobg"' + DI('cover') + '></div>') +
        '<div class="mzk-lf-hin">' + ava(s.avatar, s.user, 'mzk-lf-av', 'avatar') +
        '<div class="mzk-lf-who"><div class="mzk-lf-user">' + E('user', s.user) + '</div><div class="mzk-lf-since">' + meta + '</div></div>' +
        '<div class="mzk-lf-stats"><div><span>Scrobbles</span><b>' + E('scrobbles', s.scrobbles) + '</b></div><div><span>Artists</span><b>' + E('artistsN', s.artistsN) + '</b></div>' +
        '<div><span>Loved Tracks</span><b>' + E('loved', s.loved) + '</b></div></div></div>' +
        '<div class="mzk-lf-tabs"><span class="on">Overview</span><span>Library</span><span>Playlists</span><span>Following</span><span>Followers</span><span>Loved Tracks</span></div></div>' +
        '<div class="mzk-lf-body">' +
        '<div class="mzk-lf-h2">Recent Tracks</div><table class="mzk-lf-rec">' + recent + '</table>' +
        '<div class="mzk-lf-more">More tracks</div>' +
        '<div class="mzk-lf-h2 mzk-lf-h2r"><span>Top Artists</span><span class="mzk-lf-per">' + per + ' <i>&#9662;</i></span></div>' + top +
        '</div></div>';
    }
  });

  /* ============================== soundcloud / bandcamp ============================== */

  function waveform(seed, n) {
    var r = rng(hash(seed) + 1), out = [], ph = [r() * 6, r() * 6, r() * 6], walk = 0.5;
    for (var i = 0; i < n; i++) {
      var x = i / n;
      walk += (r() - 0.5) * 0.18;
      walk = Math.max(0.25, Math.min(0.9, walk));
      var shape = 0.55 + 0.25 * Math.sin(x * 9 + ph[0]) + 0.12 * Math.sin(x * 31 + ph[1]) + 0.1 * Math.sin(x * 3 + ph[2]);
      var env = Math.min(1, x / 0.03) * Math.min(1, (1 - x) / 0.04);
      var v = (shape * 0.55 + walk * 0.45) * (0.72 + r() * 0.28) * (0.2 + 0.8 * env);
      out.push(Math.max(0.05, Math.min(1, v)));
    }
    return out;
  }
  function scWave(s, w, h) {
    var n = Math.floor(w / 3), amps = waveform(txt(s.title) + '|' + txt(s.artist), n);
    var p = Math.max(0, Math.min(100, +s.progress || 0)) / 100, top = h * 0.7, bot = h - top - 1, d1 = '', d2 = '', d3 = '', d4 = '';
    amps.forEach(function (a, i) {
      var x = i * 3, hh = Math.max(1, a * top), bh = Math.max(1, a * bot * 0.95), played = (i + 0.5) / n < p;
      var t = 'M' + x + ' ' + (top - hh).toFixed(1) + 'h2v' + hh.toFixed(1) + 'h-2z', b = 'M' + x + ' ' + (top + 1) + 'h2v' + bh.toFixed(1) + 'h-2z';
      if (played) { d1 += t; d3 += b; } else { d2 += t; d4 += b; }
    });
    return '<svg class="mzk-sc-svg" viewBox="0 0 ' + n * 3 + ' ' + h + '" width="' + n * 3 + '" height="' + h + '">' +
      '<defs><linearGradient id="mzkscg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a1a"/><stop offset="1" stop-color="#ff3300"/></linearGradient></defs>' +
      '<path fill="url(#mzkscg)" d="' + d1 + '"/><path fill="#ffffff" d="' + d2 + '"/>' +
      '<path fill="#ffb390" d="' + d3 + '"/><path fill="#ffffff" fill-opacity=".55" d="' + d4 + '"/></svg>';
  }

  TOOLS.push({
    id: 'soundcloud',
    label: 'soundcloud / bandcamp',
    defaults: { mode: 'sc', art: '', palette: [], bg: '#6b4a5e', bg2: '#1f1a24', title: '', artist: '', artistPic: '', posted: '', tags: '', plays: '', likes: '', reposts: '',
      commentsN: '', followers: '', tracksN: '', desc: '', now: '', length: '', progress: 32, playing: false, comments: [],
      album: '', price: '', released: '', location: '', bcBg: '#ffffff', bcBox: '#ffffff', bcText: '#333333', bcLink: '#0687f5' },
    fields: [
      { key: 'mode', type: 'select', label: 'site', options: [['sc', 'soundcloud'], ['bc', 'bandcamp']], rebuild: true },
      { key: 'art', type: 'image', label: 'artwork', max: 800, palette: true },
      { type: 'row', fields: [
        { key: 'title', type: 'text', label: 'track' },
        { key: 'artist', type: 'text', label: 'artist' }
      ] },
      { type: 'row', fields: [
        { key: 'artistPic', type: 'image', label: 'artist pic', max: 300 },
        { key: 'tags', type: 'text', label: 'tags', placeholder: 'commas between' }
      ] },
      { type: 'row', fields: [
        { key: 'now', type: 'text', label: 'time', placeholder: '1:12' },
        { key: 'length', type: 'text', label: 'length', placeholder: '3:45' },
        { key: 'playing', type: 'toggle', label: 'playing' }
      ] },
      { key: 'progress', type: 'range', label: 'progress', min: 0, max: 100 },
      { key: 'desc', type: 'textarea', label: 'description', rows: 3 },
      { type: 'head', label: 'soundcloud' },
      { type: 'row', fields: [
        { key: 'bg', type: 'color', label: 'color 1', swatches: function (s) { return s.palette; } },
        { key: 'bg2', type: 'color', label: 'color 2', swatches: function (s) { return s.palette; } }
      ] },
      { type: 'row', fields: [
        { key: 'posted', type: 'text', label: 'posted', placeholder: '2 years ago' },
        { key: 'plays', type: 'text', label: 'plays' },
        { key: 'likes', type: 'text', label: 'likes' }
      ] },
      { type: 'row', fields: [
        { key: 'reposts', type: 'text', label: 'reposts' },
        { key: 'commentsN', type: 'text', label: 'comments' },
        { key: 'followers', type: 'text', label: 'followers' },
        { key: 'tracksN', type: 'text', label: 'tracks' }
      ] },
      { key: 'comments', type: 'list', adds: [{ label: '+ comment', item: item({ pfp: '', name: '', text: '', at: 50, open: false }) }], item: [
        { type: 'row', fields: [
          { key: 'pfp', type: 'image', label: 'pfp', max: 120 },
          { key: 'name', type: 'text', label: 'name' },
          { key: 'open', type: 'toggle', label: 'show' }
        ] },
        { key: 'text', type: 'text', label: 'comment' },
        { key: 'at', type: 'range', label: 'spot', min: 0, max: 100 }
      ] },
      { type: 'head', label: 'bandcamp' },
      { type: 'row', fields: [
        { key: 'album', type: 'text', label: 'from the album' },
        { key: 'price', type: 'text', label: 'price', placeholder: '$1' }
      ] },
      { type: 'row', fields: [
        { key: 'released', type: 'text', label: 'released', placeholder: 'October 17, 2026' },
        { key: 'location', type: 'text', label: 'location' }
      ] },
      { type: 'row', fields: [
        { key: 'bcBg', type: 'color', label: 'page', swatches: function (s) { return ['#ffffff', '#000000', '#1a1a1a', '#f4e1ea'].concat(s.palette); } },
        { key: 'bcBox', type: 'color', label: 'box', swatches: function (s) { return ['#ffffff', '#000000', '#111111'].concat(s.palette); } }
      ] },
      { type: 'row', fields: [
        { key: 'bcText', type: 'color', label: 'text', swatches: function () { return ['#333333', '#ffffff', '#000000']; } },
        { key: 'bcLink', type: 'color', label: 'links', swatches: function (s) { return ['#0687f5', '#ff3d9a', '#c2185b', '#ffffff'].concat(s.palette); } }
      ] }
    ],
    render: function (s) {
      return s.mode === 'bc' ? bcRender(s) : scRender(s);
    }
  });

  function scRender(s) {
    var W = 560, H = 100, p = Math.max(0, Math.min(100, +s.progress || 0));
    var tags = parts(s.tags);
    var cms = (s.comments || []).map(function (c, i) {
      var pre = 'comments.' + i + '.', at = Math.max(0, Math.min(100, +c.at || 0));
      return '<div class="mzk-sc-cm" style="left:' + at + '%">' + ava(c.pfp, c.name, 'mzk-sc-cav', pre + 'pfp') +
        (c.open ? '<div class="mzk-sc-bub"><b>' + E(pre + 'name', c.name) + '</b> ' + E(pre + 'text', c.text) + '</div>' : '') + '</div>';
    }).join('');
    function stat(icon, k) { return s[k] ? '<span class="mzk-sc-st">' + icon + E(k, s[k]) + '</span>' : ''; }
    return '<div class="shot mzk-sc">' +
      '<div class="mzk-sc-top"><span class="mzk-sc-logo">' + I.sc + '</span><span class="mzk-sc-tn on">Home</span><span class="mzk-sc-tn">Feed</span><span class="mzk-sc-tn">Library</span>' +
      '<span class="mzk-sc-search">Search</span><span class="mzk-sc-up">Try Artist Pro</span><span class="mzk-sc-tn">For Artists</span><span class="mzk-sc-tn">Upload</span></div>' +
      '<div class="mzk-sc-hero" style="background:linear-gradient(135deg,' + s.bg + ' 0%,' + s.bg2 + ' 100%)">' +
      '<div class="mzk-sc-hl">' +
      '<div class="mzk-sc-head"><span class="mzk-sc-play">' + (s.playing ? I.pause : I.play) + '</span>' +
      '<div class="mzk-sc-names"><div><span class="mzk-sc-art">' + E('artist', s.artist) + '</span></div><div><span class="mzk-sc-ttl">' + E('title', s.title) + '</span></div></div>' +
      '<div class="mzk-sc-right"><div class="mzk-sc-posted">' + E('posted', s.posted) + '</div>' +
      (tags.length || s.tags === GHOST ? '<div class="mzk-sc-tag">' + EW('tags', tags.length ? '# ' + esc(tags[0]) : '') + '</div>' : '') + '</div></div>' +
      '<div class="mzk-sc-wave">' + scWave(s, W, H) +
      '<span class="mzk-sc-t l">' + E('now', s.now) + '</span><span class="mzk-sc-t r">' + E('length', s.length) + '</span>' +
      '<div class="mzk-sc-cms">' + cms + '</div></div></div>' +
      pic(s.art, 'art', 'mzk-sc-cover') + '</div>' +
      '<div class="mzk-sc-main"><div class="mzk-sc-col">' +
      '<div class="mzk-sc-write">' + ava(s.artistPic, s.artist, 'mzk-sc-me', 'artistPic') + '<span>Write a comment</span></div>' +
      '<div class="mzk-sc-bar"><span class="mzk-sc-btn">' + I.heart + 'Like</span><span class="mzk-sc-btn">' + I.repost + 'Repost</span><span class="mzk-sc-btn">' + I.share + 'Share</span>' +
      '<span class="mzk-sc-btn">' + I.link + 'Copy Link</span><span class="mzk-sc-btn">' + I.dots + 'More</span>' +
      '<span class="mzk-sc-stats">' + stat(I.play, 'plays') + stat(I.heartF, 'likes') + stat(I.repost, 'reposts') + '</span></div>' +
      '<div class="mzk-sc-low"><div class="mzk-sc-user">' + ava(s.artistPic, s.artist, 'mzk-sc-uav', 'artistPic') +
      '<div class="mzk-sc-un">' + E('artist', s.artist) + '</div>' +
      '<div class="mzk-sc-uc">' + (s.followers ? '<span>' + I.user + E('followers', s.followers) + '</span>' : '') + (s.tracksN ? '<span>' + I.wave + E('tracksN', s.tracksN) + '</span>' : '') + '</div>' +
      '<span class="mzk-sc-fol">' + I.addUser + 'Follow</span></div>' +
      '<div class="mzk-sc-desc"><div class="mzk-sc-dt">' + EB('desc', s.desc) + '</div>' +
      (tags.length > 1 ? '<div class="mzk-sc-tags">' + EW('tags', tags.slice(1).map(function (t) { return '<span># ' + esc(t) + '</span>'; }).join('')) + '</div>' : '') +
      (s.commentsN ? '<div class="mzk-sc-cc">' + I.chat + E('commentsN', s.commentsN) + ' comments</div>' : '') + '</div></div>' +
      '</div></div></div>';
  }

  function bcRender(s) {
    var p = Math.max(0, Math.min(100, +s.progress || 0)), tags = parts(s.tags);
    var link = 'color:' + s.bcLink;
    var price = txt(s.price) || s.price === GHOST ? E('price', s.price) : '';
    return '<div class="shot mzk-bc" style="background:' + s.bcBg + ';color:' + s.bcText + ';--lk:' + s.bcLink + ';--tx:' + s.bcText + '">' +
      '<div class="mzk-bc-menu"><span class="mzk-bc-logo">' + I.bcLogo + '<b>bandcamp</b></span><span class="mzk-bc-search">Search and discover music</span><span class="mzk-bc-ml">log in</span></div>' +
      '<div class="mzk-bc-page" style="background:' + s.bcBox + '">' +
      '<div class="mzk-bc-cols"><div class="mzk-bc-center">' +
      '<div class="mzk-bc-name"><div class="mzk-bc-title">' + E('title', s.title) + '</div>' +
      '<div class="mzk-bc-by">' + (s.album ? 'from <a style="' + link + '">' + E('album', s.album) + '</a> ' : '') + 'by <a style="' + link + '">' + E('artist', s.artist) + '</a></div></div>' +
      '<div class="mzk-bc-row"><div class="mzk-bc-left">' +
      '<div class="mzk-bc-player"><span class="mzk-bc-pb">' + (s.playing ? I.pause : I.play) + '</span>' +
      '<div class="mzk-bc-pw"><div class="mzk-bc-pt"><span class="mzk-bc-ptn">' + E('title', s.title) + '</span><span class="mzk-bc-tm">' + E('now', s.now) + ' / ' + E('length', s.length) + '</span></div>' +
      '<div class="mzk-bc-track"><div class="mzk-bc-prog"><i style="left:' + p + '%"></i></div><span class="mzk-bc-nav">' + I.prev + '</span><span class="mzk-bc-nav">' + I.next + '</span></div></div></div>' +
      '<div class="mzk-bc-buy"><div class="mzk-bc-dig">Digital Track</div><div class="mzk-bc-str">Streaming + Download</div>' +
      '<div class="mzk-bc-inc">Includes unlimited streaming via the free Bandcamp app, plus high-quality download in MP3, FLAC and more.</div>' +
      '<div class="mzk-bc-price"><a class="mzk-bc-bt" style="' + link + '">Buy Digital Track</a> ' + (price ? '<span class="mzk-bc-amt">' + price + ' <span class="mzk-bc-usd">USD</span></span> <span class="mzk-bc-om">or more</span>' : '') + '</div>' +
      '<div class="mzk-bc-gift"><a style="' + link + '">Send as Gift</a></div></div>' +
      '<div class="mzk-bc-share"><a style="' + link + '">Share / Embed</a><a class="mzk-bc-wish" style="' + link + '">' + I.heart + 'Wishlist</a></div>' +
      (s.desc ? '<div class="mzk-bc-about">' + EB('desc', s.desc) + '</div>' : '') +
      '<div class="mzk-bc-cred">released ' + E('released', s.released) + '</div>' +
      (tags.length || s.tags === GHOST ? '<div class="mzk-bc-tags"><div class="mzk-bc-tl">tags</div>' + EW('tags', tags.map(function (t) { return '<a style="' + link + '">' + esc(t) + '</a>'; }).join('') + (tags.length ? '<a style="' + link + '">' + esc(txt(s.location)) + '</a>' : '')) + '</div>' : '') +
      '</div>' +
      '<div class="mzk-bc-artcol">' + pic(s.art, 'art', 'mzk-bc-art') + '</div></div></div>' +
      '<div class="mzk-bc-side">' + (s.artistPic ? '<img class="mzk-bc-band" src="' + s.artistPic + '"' + DI('artistPic') + ' alt="">' : '<div class="mzk-bc-band mzk-ph"' + DI('artistPic') + '></div>') +
      '<div class="mzk-bc-bn"><a style="' + link + '">' + E('artist', s.artist) + '</a></div><div class="mzk-bc-loc">' + E('location', s.location) + '</div>' +
      '<span class="mzk-bc-follow">Follow</span></div></div></div></div>';
  }

  /* ============================== setlist ============================== */

  var SL_TAPE = { black: ['#1b1b1d', '#2c2c30'], silver: ['#9a9da3', '#c4c7cc'], white: ['#e9e6dc', '#f7f5ee'], pink: ['#ff6fb0', '#ff9acb'] };
  var SL_INK = { black: '#141414', red: '#c4161c', blue: '#1b3e9a' };
  TOOLS.push({
    id: 'setlist',
    label: 'setlist',
    defaults: { mode: 'site', ink: 'black', tape: 'black', artist: '', tour: '', venue: '', city: '', month: '', day: '', year: '', songs: [], notes: '' },
    fields: [
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'style', options: [['site', 'setlist.fm'], ['paper', 'taped paper']] },
        { key: 'ink', type: 'select', label: 'marker', options: Object.keys(SL_INK).map(function (k) { return [k, k]; }) },
        { key: 'tape', type: 'select', label: 'tape', options: Object.keys(SL_TAPE).map(function (k) { return [k, k]; }) }
      ] },
      { type: 'row', fields: [
        { key: 'artist', type: 'text', label: 'artist' },
        { key: 'tour', type: 'text', label: 'tour' }
      ] },
      { type: 'row', fields: [
        { key: 'venue', type: 'text', label: 'venue' },
        { key: 'city', type: 'text', label: 'city', placeholder: 'New York, NY, USA' }
      ] },
      { type: 'row', fields: [
        { key: 'month', type: 'text', label: 'month', placeholder: 'Oct' },
        { key: 'day', type: 'text', label: 'day', placeholder: '17' },
        { key: 'year', type: 'text', label: 'year', placeholder: '2026' }
      ] },
      { type: 'head', label: 'songs' },
      { key: 'songs', type: 'list', adds: [{ label: '+ song', item: item({ kind: 'song', name: '', info: '' }) }, { label: '+ encore', item: item({ kind: 'break', name: '', info: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'kind', type: 'select', label: 'is', options: [['song', 'song'], ['break', 'encore']] },
          { key: 'name', type: 'text', label: 'song' },
          { key: 'info', type: 'text', label: 'note', placeholder: 'acoustic' }
        ] }
      ] },
      { key: 'notes', type: 'textarea', label: 'notes', rows: 2 }
    ],
    render: function (s) {
      var songs = s.songs || [], n = 0;
      if (s.mode === 'paper') {
        var tp = SL_TAPE[s.tape] || SL_TAPE.black, ink = SL_INK[s.ink] || SL_INK.black, rr = rng(hash(txt(s.artist) + songs.length));
        var lines = songs.map(function (it, i) {
          var p = 'songs.' + i + '.', tilt = ((rr() - 0.5) * 2.4).toFixed(2), dx = Math.round((rr() - 0.5) * 14);
          if (it.kind === 'break') return '<div class="mzk-sp-enc" style="transform:rotate(' + tilt + 'deg)">' + E(p + 'name', it.name) + '<i></i></div>';
          return '<div class="mzk-sp-song" style="transform:translateX(' + dx + 'px) rotate(' + tilt + 'deg)">' + E(p + 'name', it.name) +
            (txt(it.info) ? ' <small>' + E(p + 'info', it.info) + '</small>' : '') + '</div>';
        }).join('');
        var size = songs.length > 16 ? 23 : songs.length > 12 ? 27 : songs.length > 8 ? 32 : 38;
        function tape(cls, rot) { return '<span class="mzk-sp-tape ' + cls + '" style="--t1:' + tp[0] + ';--t2:' + tp[1] + ';transform:rotate(' + rot + 'deg)"></span>'; }
        return '<div class="shot mzk-sp"><div class="mzk-sp-paper" style="color:' + ink + ';font-size:' + size + 'px">' +
          tape('mzk-sp-tl', -38) + tape('mzk-sp-tr', 41) + tape('mzk-sp-bl', 36) + tape('mzk-sp-br', -42) +
          '<div class="mzk-sp-head">' + [s.city ? E('city', s.city) : E('venue', s.venue), (txt(s.month) || txt(s.day)) ? E('month', s.month) + ' ' + E('day', s.day) : ''].filter(Boolean).join(' &nbsp;&middot;&nbsp; ') + '</div>' +
          '<div class="mzk-sp-list">' + lines + '</div>' +
          (s.notes ? '<div class="mzk-sp-note">' + EB('notes', s.notes) + '</div>' : '') +
          '</div></div>';
      }
      var rows = songs.map(function (it, i) {
        var p = 'songs.' + i + '.';
        if (it.kind === 'break') return '<li class="mzk-sl-enc">' + E(p + 'name', it.name) + ':</li>';
        n++;
        return '<li class="mzk-sl-song"><span class="mzk-sl-n">' + n + '</span><span class="mzk-sl-name">' + E(p + 'name', it.name) + '</span>' +
          (txt(it.info) ? '<span class="mzk-sl-info">(' + E(p + 'info', it.info) + ')</span>' : '') + '<span class="mzk-sl-vid">Play Video</span></li>';
      }).join('');
      return '<div class="shot mzk-sl">' +
        '<div class="mzk-sl-top"><span class="mzk-sl-logo">setlist<b>.fm</b></span><span class="mzk-sl-search">Search for setlists, artists, venues...</span>' +
        '<span class="mzk-sl-tn">Artists</span><span class="mzk-sl-tn">Venues</span><span class="mzk-sl-tn">Festivals</span><span class="mzk-sl-tn">Stats</span><span class="mzk-sl-tn">Login</span></div>' +
        '<div class="mzk-sl-crumb">Setlists &rsaquo; ' + esc(txt(s.artist) || 'Artist') + ' &rsaquo; ' + esc(txt(s.year) || 'Year') + '</div>' +
        '<div class="mzk-sl-main"><div class="mzk-sl-head">' +
        '<div class="mzk-sl-date"><span class="m">' + E('month', s.month) + '</span><span class="d">' + E('day', s.day) + '</span><span class="y">' + E('year', s.year) + '</span></div>' +
        '<div class="mzk-sl-ht"><div class="mzk-sl-h"><a>' + E('artist', s.artist) + '</a> Setlist</div>' +
        '<div class="mzk-sl-at">at <a>' + E('venue', s.venue) + (s.city ? ', ' + E('city', s.city) : '') + '</a></div>' +
        (s.tour ? '<div class="mzk-sl-tour">Tour: <a>' + E('tour', s.tour) + '</a></div>' : '') + '</div></div>' +
        '<div class="mzk-sl-acts"><span>Edit setlist</span><span>Mark as attended</span><span>Share</span></div>' +
        '<ol class="mzk-sl-list">' + rows + '</ol>' +
        (s.notes ? '<div class="mzk-sl-notes"><b>Note:</b> ' + EB('notes', s.notes) + '</div>' : '') +
        '<div class="mzk-sl-edit">Edit setlist &middot; Show performance info &middot; Revisions</div>' +
        '</div></div>';
    }
  });

  /* ============================== spotify blend ============================== */

  var BL_PAL = { pink: ['#ff5fa2', '#7b2cbf'], green: ['#1ed760', '#0d6efd'], sunset: ['#ff8a3d', '#e91e63'], night: ['#4b3fd1', '#0f0f2e'], lime: ['#c3f73a', '#18a558'], red: ['#ff4632', '#5b0d22'] };
  TOOLS.push({
    id: 'blend',
    label: 'spotify blend',
    defaults: { shape: 'story', pal: 'pink', match: '', people: [], tracks: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'shape', type: 'select', label: 'shape', options: [['story', 'story'], ['app', 'playlist']] },
        { key: 'pal', type: 'select', label: 'colors', options: Object.keys(BL_PAL).map(function (k) { return [k, k]; }) },
        { key: 'match', type: 'text', label: 'match %', placeholder: '87' }
      ] },
      { type: 'head', label: 'people' },
      { key: 'people', type: 'list', adds: [{ label: '+ person', item: function () { return { id: uidm(), pic: '', name: '' }; } }], item: [
        { type: 'row', fields: [
          { key: 'pic', type: 'image', label: 'pfp', max: 300 },
          { key: 'name', type: 'text', label: 'name' }
        ] }
      ] },
      { type: 'head', label: 'songs' },
      { key: 'tracks', type: 'list', adds: [{ label: '+ song', item: function (s) { return { cover: '', title: '', artist: '', who: (s.people[0] || {}).id || '' }; } }], item: [
        { type: 'row', fields: [
          { key: 'cover', type: 'image', label: 'cover', max: 200 },
          { key: 'title', type: 'text', label: 'song' },
          { key: 'artist', type: 'text', label: 'artist' }
        ] },
        { key: 'who', type: 'select', label: 'whose', options: function (s) {
          return [['', 'nobody']].concat((s.people || []).map(function (p) { return [p.id, txt(p.name) || 'person']; }));
        } }
      ] }
    ],
    render: function (s) {
      var pal = BL_PAL[s.pal] || BL_PAL.pink, people = s.people || [], byId = {};
      people.forEach(function (p, i) { byId[p.id] = { p: p, i: i }; });
      var names = people.map(function (p, i) { return E('people.' + i + '.name', p.name); });
      var title = names.length < 2 ? (names[0] || '') : names.slice(0, -1).join(', ') + ' + ' + names[names.length - 1];
      if (!people.length) title = '<span class="mzk-bl-none">+</span>';
      var plain = people.map(function (p) { return txt(p.name); }).filter(Boolean);
      var faces = people.slice(0, 4).map(function (p, i) { return ava(p.pic, p.name, 'mzk-bl-face f' + i, 'people.' + i + '.pic'); }).join('');
      var cover = '<div class="mzk-bl-cover n' + Math.min(4, Math.max(1, people.length)) + '" style="background:linear-gradient(140deg,' + pal[0] + ' 0%,' + pal[1] + ' 100%)">' +
        '<div class="mzk-bl-faces">' + faces + '</div></div>';
      var rows = (s.tracks || []).slice(0, s.shape === 'app' ? 99 : 4).map(function (t, i) {
        var p = 'tracks.' + i + '.', who = byId[t.who];
        var mini = who ? ava(who.p.pic, who.p.name, 'mzk-bl-mini', 'people.' + who.i + '.pic') : '';
        return '<div class="mzk-bl-row">' + pic(t.cover, p + 'cover', 'mzk-bl-tc') + '<div class="mzk-bl-tw"><div class="mzk-bl-tt">' + E(p + 'title', t.title) + '</div>' +
          '<div class="mzk-bl-ta">' + E(p + 'artist', t.artist) + '</div></div>' + mini + '<span class="mzk-bl-tm">' + I.dots + '</span></div>';
      }).join('');
      if (s.shape === 'app') {
        return '<div class="shot mzk-bl app" style="--c1:' + pal[0] + ';--c2:' + pal[1] + '">' +
          '<div class="mzk-bl-ahead" style="background:linear-gradient(' + U.shade(pal[1], -0.1) + ',#121212)">' +
          '<div class="mzk-bl-anav"><span>' + I.back + '</span></div>' + cover +
          '<div class="mzk-bl-atitle">' + title + '</div>' +
          '<div class="mzk-bl-adesc">A blend of music for ' + esc(plain.length < 2 ? plain.join('') : plain.slice(0, -1).join(', ') + ' and ' + plain[plain.length - 1]) + '. Updates daily.</div>' +
          '<div class="mzk-bl-aava">' + people.map(function (p, i) { return ava(p.pic, p.name, 'mzk-bl-sm', 'people.' + i + '.pic'); }).join('') +
          '<span class="mzk-bl-mpill">' + E('match', s.match) + '% taste match</span></div>' +
          '<div class="mzk-bl-acts"><span class="mzk-bl-ic">' + I.addUser + '</span><span class="mzk-bl-ic">' + I.dl + '</span><span class="mzk-bl-ic">' + I.dots + '</span>' +
          '<span class="mzk-bl-sp"></span><span class="mzk-bl-ic sh">' + I.shuffle + '</span><span class="mzk-bl-pl">' + I.play + '</span></div></div>' +
          '<div class="mzk-bl-list">' + rows + '</div></div>';
      }
      return '<div class="shot mzk-bl story" style="--c1:' + pal[0] + ';--c2:' + pal[1] + ';background:linear-gradient(170deg,' + pal[0] + ' 0%,' + pal[1] + ' 72%,' + U.shade(pal[1], -0.5) + ' 100%)">' +
        '<div class="mzk-bl-logo">' + I.spotify + '<span>Spotify</span></div>' +
        cover +
        '<div class="mzk-bl-title">' + title + '</div>' +
        '<div class="mzk-bl-match"><div class="mzk-bl-pct">' + E('match', s.match) + '<span class="mzk-bl-pc">%</span></div><div class="mzk-bl-ml">Taste match</div></div>' +
        (rows ? '<div class="mzk-bl-card"><div class="mzk-bl-ch">The songs that bring you together</div>' + rows + '</div>' : '') +
        '</div>';
    }
  });
})();
