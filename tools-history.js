/* screenies — search history ("what if ___ had google:" meme or just the phone) + amazon order history.
   css lives in shots-history.css (every class starts with hs-). */

(function () {
  var esc = U.esc;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function txt(v) { return String(bare(v) == null ? '' : bare(v)).replace(/​/g, '').trim(); }

  /* ---------- grungy paper texture, drawn once per look and cached ---------- */

  var TEX = {};
  function rng(seed) {
    var a = seed | 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function grunge(base, dark, light, w, h, seed) {
    var key = [base, dark, light, w, h, seed].join('|');
    if (TEX[key]) return TEX[key];
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d'), r = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (var k = 0; k < 26; k++) {
      var x = r() * w, y = r() * h, rad = 40 + r() * 160;
      var gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, dark + '55'); gr.addColorStop(1, dark + '00');
      g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    var img = g.getImageData(0, 0, w, h), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var n = (r() - 0.5) * 26;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
    g.lineWidth = 0.7;
    for (k = 0; k < 420; k++) {
      x = r() * w; y = r() * h;
      var L = 4 + r() * 22;
      g.strokeStyle = (r() < 0.5 ? dark : light) + 'aa';
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * L * 0.6, y + L); g.stroke();
    }
    for (k = 0; k < 1800; k++) {
      g.fillStyle = (r() < 0.5 ? dark : light) + 'cc';
      var s = r() < 0.8 ? 1 : 2;
      g.fillRect(r() * w, r() * h, s, s);
    }
    var v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.28)');
    g.fillStyle = v; g.fillRect(0, 0, w, h);
    return (TEX[key] = c.toDataURL('image/jpeg', 0.9));
  }

  //            paper base, dark, light       phone base, dark, light       title,   name,    phone text
  var LOOKS = {
    og:    ['#e2e2df', '#a0a09c', '#f6f6f4', '#343231', '#141313', '#5c5a58', '#4e4e4e', '#151515', '#f4f0e8'],
    brown: ['#ded7c8', '#9d9589', '#f2eee4', '#766852', '#3e3426', '#9a8a6c', '#5c564e', '#46403a', '#f4eee2'],
    pink:  ['#f6dee8', '#cf9fb6', '#fff2f7', '#1e161c', '#080508', '#5a2846', '#3a2c34', '#e64696', '#ffc2e2'],
    light: ['#ffffff', '#d8d8d8', '#ffffff', '#ffffff', '#e8e8e8', '#ffffff', '#333333', '#111111', '#202124']
  };

  var CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
  var MIC = '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="#4285f4"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round"/></svg>';
  var LENS = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M4 9V6a2 2 0 0 1 2-2h3" stroke="#ea4335"/><path d="M15 4h3a2 2 0 0 1 2 2v3" stroke="#4285f4"/><path d="M20 15v3a2 2 0 0 1-2 2h-3" stroke="#34a853"/><path d="M9 20H6a2 2 0 0 1-2-2v-3" stroke="#fbbc05"/><circle cx="12" cy="12" r="3.2" stroke="#ea4335"/></svg>';
  var BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  var MC = document.createElement('canvas').getContext('2d');
  function measure(str, font) { MC.font = font; return MC.measureText(str).width; }

  // shrink the list text until everything fits under the search bar
  function listSize(rows, width, room) {
    for (var fs = 30; fs > 15; fs--) {
      var per = Math.max(8, Math.floor(width / (fs * 0.47)));
      var lines = rows.reduce(function (a, r) { return a + Math.max(1, Math.ceil(r.length / per)); }, 0);
      if (lines * fs * 1.2 + rows.length * fs * 0.62 <= room) return fs;
    }
    return 15;
  }

  TOOLS.push({
    id: 'searchhist',
    label: 'search history',
    group: 'phone',
    phone: false,
    defaults: { mode: 'meme', look: 'og', t1: 'what if', name: '', t2: 'had google:', clock: '', battery: '', list: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'layout', options: [['meme', 'what if ___ had google'], ['phone', 'just the phone']] },
        { key: 'look', type: 'select', label: 'look', options: [['og', 'grey'], ['brown', 'brown'], ['pink', 'pink + black'], ['light', 'light']] }
      ] },
      { type: 'row', fields: [
        { key: 't1', type: 'text', label: 'title start', placeholder: 'what if' },
        { key: 'name', type: 'text', label: 'name' }
      ] },
      { key: 't2', type: 'text', label: 'title end', placeholder: 'had google:' },
      { type: 'row', fields: [
        { key: 'clock', type: 'text', label: 'time', placeholder: '13.43' },
        { key: 'battery', type: 'text', label: 'battery', placeholder: '72' }
      ] },
      { type: 'head', label: 'searches' },
      { key: 'list', type: 'list', compact: true, adds: [{ label: '+ search', item: item({ text: '' }) }], item: [
        { key: 'text', type: 'text', label: 'search' }
      ] }
    ],
    render: function (s) {
      var L = LOOKS[s.look] || LOOKS.og, meme = s.mode !== 'phone';
      var rows = (s.list || []).map(function (r) { return txt(r.text); });
      var fs = listSize(rows, 400, 520);
      var list = (s.list || []).map(function (r, i) {
        return '<div class="hs-row"><i>' + CLOCK + '</i><span>' + E('list.' + i + '.text', r.text) + '</span></div>';
      }).join('');
      var phone = '<div class="hs-phone" style="color:' + L[8] + ';background-image:url(' + grunge(L[3], L[4], L[5], 522, 680, 7) + ')">' +
        '<div class="hs-sbar"><b>' + E('clock', s.clock) + '</b><span class="hs-sic">⚠ ⏰ •</span><em></em>' +
        '<span class="hs-sig"><i></i><i></i><i></i></span><span class="hs-plane">✈</span><span class="hs-batt">' + E('battery', s.battery) + '</span></div>' +
        '<div class="hs-bar"><i class="hs-back">' + BACK + '</i><span class="hs-q">Search...</span><i class="hs-mic">' + MIC + '</i><i class="hs-lens">' + LENS + '</i></div>' +
        '<div class="hs-list" style="font-size:' + fs + 'px">' + list + '<div class="hs-row hs-cut"><i>' + CLOCK + '</i></div></div></div>';
      if (!meme) return '<div class="shot hs hs-solo hs-' + s.look + '">' + phone + '</div>';
      // short names sit next to "what if" like the original; long ones get their own line
      var nm = txt(s.name) || 'Name';
      var room = 478 - 14 - 16 - measure(txt(s.t1) || 'what if', '700 72px Oswald, Impact, sans-serif') - 14;
      var at100 = measure(nm, '100px Papyrus, Macondo, serif') / 100;
      var ns = Math.min(78, Math.floor(room / at100)), own = ns < 50;
      if (own) ns = Math.max(26, Math.min(78, Math.floor(440 / at100)));
      var nameEl = '<span class="hs-name" style="color:' + L[7] + ';font-size:' + ns + 'px">' + E('name', s.name) + '</span>';
      return '<div class="shot hs hs-meme hs-' + s.look + '">' +
        '<div class="hs-paper" style="background-image:url(' + grunge(L[0], L[1], L[2], 478, 680, 3) + ')">' +
        '<div class="hs-t1" style="color:' + L[6] + '"><span>' + E('t1', s.t1) + '</span>' + (own ? '' : ' ' + nameEl) + '</div>' +
        (own ? '<div class="hs-own">' + nameEl + '</div>' : '') +
        '<div class="hs-t2" style="color:' + L[6] + '">' + E('t2', s.t2) + '</div></div>' + phone + '</div>';
    }
  });

  /* ============================== amazon order history ============================== */

  var CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>';
  var SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20"/></svg>';

  TOOLS.push({
    id: 'amazonhist',
    label: 'amazon orders',
    group: 'phone',
    phone: false,
    defaults: { shipTo: '', count: '', range: 'past 3 months', orders: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'shipTo', type: 'text', label: 'ship to (name)' },
        { key: 'count', type: 'text', label: 'how many orders', placeholder: '12' }
      ] },
      { key: 'range', type: 'text', label: 'placed in', placeholder: 'past 3 months' },
      { type: 'head', label: 'orders' },
      { key: 'orders', type: 'list', adds: [{ label: '+ order', item: item({ date: '', total: '', status: '', statusColor: 'black', note: '', emoji: '', image: '', title: '', qty: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'date', type: 'text', label: 'order placed', placeholder: 'November 3, 2026' },
          { key: 'total', type: 'text', label: 'total', placeholder: '$12.99' }
        ] },
        { type: 'row', fields: [
          { key: 'status', type: 'text', label: 'status', placeholder: 'Delivered Nov 5' },
          { key: 'statusColor', type: 'select', label: 'status color', options: [['black', 'black'], ['green', 'green'], ['red', 'red'], ['orange', 'orange']] }
        ] },
        { key: 'note', type: 'text', label: 'under status', placeholder: 'Your package was left near the front door' },
        { type: 'row', fields: [
          { key: 'image', type: 'image', label: 'product picture', max: 400 },
          { key: 'emoji', type: 'text', label: 'or an emoji' }
        ] },
        { key: 'title', type: 'textarea', label: 'product name', rows: 2 },
        { key: 'qty', type: 'text', label: 'quantity', placeholder: '400' }
      ] }
    ],
    render: function (s) {
      var cards = (s.orders || []).map(function (o, i) {
        var p = 'orders.' + i + '.';
        var pic = o.image ? '<img src="' + o.image + '"' + DI(p + 'image') + ' alt="">' : '<div class="hs-az-emo"' + DI(p + 'image') + '>' + E(p + 'emoji', o.emoji) + '</div>';
        var qty = txt(o.qty) && txt(o.qty) !== '1' ? '<b class="hs-az-qty">' + E(p + 'qty', o.qty) + '</b>' : '';
        return '<div class="hs-az-card"><div class="hs-az-head">' +
          '<div><small>ORDER PLACED</small><span>' + E(p + 'date', o.date) + '</span></div>' +
          '<div><small>TOTAL</small><span>' + E(p + 'total', o.total) + '</span></div>' +
          '<div><small>SHIP TO</small><span class="hs-az-link">' + E('shipTo', s.shipTo) + '</span></div>' +
          '<div class="hs-az-no"><small>ORDER # 114-' + String(3017402 + i * 731).slice(0, 7) + '-' + String(9928113 - i * 4441).slice(0, 7) + '</small><span class="hs-az-link">View order details</span></div></div>' +
          '<div class="hs-az-body"><div class="hs-az-main"><div class="hs-az-status c-' + (o.statusColor || 'black') + '">' + E(p + 'status', o.status) + '</div>' +
          (txt(o.note) ? '<div class="hs-az-note">' + E(p + 'note', o.note) + '</div>' : '') +
          '<div class="hs-az-item"><div class="hs-az-pic">' + pic + qty + '</div><div><div class="hs-az-title">' + EB(p + 'title', o.title) + '</div>' +
          '<div class="hs-az-btns"><span class="hs-az-buy">Buy it again</span><span>View your item</span></div></div></div></div>' +
          '<div class="hs-az-side"><span class="hs-az-y">Track package</span><span>Return or replace items</span><span>Write a product review</span></div></div></div>';
      }).join('');
      return '<div class="shot hs-az"><div class="hs-az-top"><span class="hs-az-logo">amazon</span><div class="hs-az-sbox"><span>Search Amazon</span><i>' + SEARCH + '</i></div><span class="hs-az-cart">' + CART + 'Cart</span></div>' +
        '<div class="hs-az-page"><div class="hs-az-crumb">Your Account › <b>Your Orders</b></div>' +
        '<div class="hs-az-h1"><h2>Your Orders</h2><div class="hs-az-find"><i>' + SEARCH + '</i>Search all orders<span>Search Orders</span></div></div>' +
        '<div class="hs-az-tabs"><span class="on">Orders</span><span>Buy Again</span><span>Not Yet Shipped</span><span>Cancelled Orders</span></div>' +
        '<div class="hs-az-count"><b>' + E('count', s.count) + ' orders</b> placed in <span class="hs-az-range">' + E('range', s.range) + ' ▾</span></div>' +
        cards + '</div></div>';
    }
  });
})();
