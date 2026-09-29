/* screenies — android texts, voicemail, amazon order, breaking news, award certificate, wanted/missing posters, screen time */

(function () {
  var esc = U.esc, ava = U.avatar;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function fill(d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; }
  var X = {
    back: stroke('M20 12H4.5M11 5l-7 7 7 7', 2),
    video: stroke('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5zM16 10.5l5-3v9l-5-3'),
    phone: stroke('M5.2 3.5h3.3l1.7 4.3-2.2 1.4a12 12 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7v3.3a1.7 1.7 0 0 1-1.8 1.7A17 17 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8z'),
    dotsV: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="19" r="1.9"/></svg>',
    plus: stroke('M12 5v14M5 12h14', 2),
    smile: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01'),
    image: stroke('M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 16l4.5-4.5 4 4L15 13l5 5M15.5 9.5h.01'),
    mic: stroke('M12 3.5a2.8 2.8 0 0 1 2.8 2.8v5.4a2.8 2.8 0 0 1-5.6 0V6.3A2.8 2.8 0 0 1 12 3.5zM6 11.5a6 6 0 0 0 12 0M12 17.5v3'),
    play: fill('M7 4.5 20 12 7 19.5z'),
    speaker: stroke('M4 9h4l5-4.5v15L8 15H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12', 1.8),
    trash: stroke('M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13M10 11v6M14 11v6', 1.8),
    info: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01', 1.8),
    star: fill('M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z'),
    clock: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', 1.8),
    person: fill('M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z'),
    grid: fill('M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z'),
    voicemail: stroke('M6.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM17.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM6.5 15.5h11', 1.8),
    check: stroke('M5 12.5l4.5 4.5L19 7.5', 2.6),
    box: stroke('M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5 12 12l8.5-4.5M12 12v9', 1.7)
  };

  /* ============================== android texts ============================== */

  function droidBar(s) {
    return '<div class="dbar"><span>' + E('clock', s.clock) + '</span><span class="dbar-i">' +
      '<svg viewBox="0 0 16 12"><path d="M8 11.5 .5 3.5C2.5 1.6 5.1.5 8 .5s5.5 1.1 7.5 3z"/></svg>' +
      '<svg viewBox="0 0 12 12"><path d="M11.5 .5v11H.5z"/></svg>' +
      '<svg viewBox="0 0 8 13"><rect x="1" y="1.5" width="6" height="11" rx="1" fill="none" stroke="currentColor"/><rect x="2" y="' + (12.5 - Math.max(1, (parseInt(s.battery, 10) || 80) / 10)) + '" width="4" height="' + Math.max(1, (parseInt(s.battery, 10) || 80) / 10) + '"/><rect x="3" y="0" width="2" height="1.5"/></svg>' +
      '<b>' + (parseInt(s.battery, 10) || 80) + '%</b></span></div>';
  }

  TOOLS.push({
    id: 'android',
    label: 'android texts',
    defaults: { theme: 'light', clock: '9:41', battery: 80, name: '', photo: '', msgs: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'clock', type: 'text', label: 'clock' },
        { key: 'battery', type: 'number', label: 'battery %' }
      ] },
      { key: 'photo', type: 'image', label: 'contact photo', max: 300 },
      { key: 'name', type: 'text', label: 'contact name' },
      { type: 'head', label: 'messages' },
      { key: 'msgs', type: 'list', meKey: 'from',
        adds: [
          { label: '+ me', item: item({ from: 'me', text: '', time: '', image: '' }) },
          { label: '+ them', item: item({ from: 'them', text: '', time: '', image: '' }) }
        ],
        item: [
          { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['them', 'them']] },
          { key: 'text', type: 'textarea', label: 'text', rows: 2 },
          { key: 'image', type: 'image', label: 'picture', max: 900 },
          { key: 'time', type: 'text', label: 'time above', placeholder: 'Today · 9:41 PM' }
        ] }
    ],
    render: function (s) {
      var list = s.msgs || [];
      var out = list.map(function (m, i) {
        var next = list[i + 1], prev = list[i - 1], who = m.from === 'me' ? 'me' : 'them';
        var last = !next || next.from !== m.from || next.time;
        var first = !prev || prev.from !== m.from || m.time;
        var pre = 'msgs.' + i + '.';
        return (m.time ? '<div class="dm-time">' + E(pre + 'time', m.time) + '</div>' : '') +
          '<div class="dm-row ' + who + (first ? ' first' : '') + (last ? ' last' : '') + '">' +
          (who === 'them' ? (last ? ava(s.photo, s.name, 'dm-ava', undefined, 'photo') : '<i class="dm-ava sp"></i>') : '') +
          '<div class="dm-col">' + (m.image ? '<img class="dm-pic" src="' + m.image + '"' + DI(pre + 'image') + ' alt="">' : '') +
          '<div class="dm-b">' + EB(pre + 'text', m.text) + '</div></div></div>';
      }).join('');
      return '<div class="shot droid t-' + s.theme + '">' + droidBar(s) +
        '<div class="dm-head"><span class="dm-ic">' + X.back + '</span>' + ava(s.photo, s.name, 'dm-hava', undefined, 'photo') +
        '<b>' + E('name', s.name) + '</b><span class="dm-ic">' + X.video + '</span><span class="dm-ic">' + X.phone + '</span><span class="dm-ic">' + X.dotsV + '</span></div>' +
        '<div class="dm-body">' + out + '</div>' +
        '<div class="dm-input"><span class="dm-plus">' + X.plus + '</span><div class="dm-field"><span class="dm-ic">' + X.smile + '</span><span class="dm-ph">RCS message</span>' +
        '<span class="dm-ic">' + X.image + '</span></div><span class="dm-mic">' + X.mic + '</span></div><div class="dm-nav"><i></i></div></div>';
    }
  });

  /* ============================== voicemail ============================== */

  TOOLS.push({
    id: 'voicemail',
    label: 'voicemail',
    defaults: { theme: 'light', clock: '9:41', battery: 80, showPct: false, name: '', label: '', date: '', length: '', played: 30, transcript: '', unread: '', older: [] },
    fields: [
      U.STATUS_FIELDS,
      { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'who called' },
        { key: 'label', type: 'text', label: 'under name', placeholder: 'mobile' }
      ] },
      { type: 'row', fields: [
        { key: 'date', type: 'text', label: 'date', placeholder: 'Yesterday' },
        { key: 'length', type: 'text', label: 'length', placeholder: '0:42' },
        { key: 'unread', type: 'text', label: 'badge' }
      ] },
      { key: 'played', type: 'range', label: 'how far played', min: 0, max: 100, step: 1 },
      { key: 'transcript', type: 'textarea', label: 'transcript', rows: 4 },
      { type: 'head', label: 'other voicemails' },
      { key: 'older', type: 'list', compact: true, adds: [{ label: '+ voicemail', item: item({ name: '', date: '', length: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'name', type: 'text', label: 'name' },
          { key: 'date', type: 'text', label: 'date' },
          { key: 'length', type: 'text', label: 'length' }
        ] }
      ] }
    ],
    render: function (s) {
      var pct = Math.max(0, Math.min(100, +s.played || 0));
      var older = (s.older || []).map(function (v, i) {
        var pre = 'older.' + i + '.';
        return '<div class="vm-row"><div><b>' + E(pre + 'name', v.name) + '</b><span>' + E(pre + 'length', v.length) + '</span></div>' +
          '<span class="vm-date">' + E(pre + 'date', v.date) + '</span><span class="vm-info">' + X.info + '</span></div>';
      }).join('');
      return '<div class="shot vm t-' + s.theme + '">' + U.statusBar(s) +
        '<div class="vm-top"><span>Greeting</span><span>Edit</span></div><div class="vm-title">Voicemail</div>' +
        '<div class="vm-open"><div class="vm-head"><div><b>' + E('name', s.name) + '</b><span>' + E('label', s.label) + '</span></div>' +
        '<span class="vm-date">' + E('date', s.date) + '</span></div>' +
        '<div class="vm-tr"><span class="vm-trl">Transcription</span>' + EB('transcript', s.transcript) + '</div>' +
        '<div class="vm-player"><span class="vm-play">' + X.play + '</span><div class="vm-scrub"><i style="width:' + pct + '%"></i><b style="left:' + pct + '%"></b></div></div>' +
        '<div class="vm-times"><span>0:' + ('0' + Math.round(pct * 0.42)).slice(-2) + '</span><span>-' + E('length', s.length) + '</span></div>' +
        '<div class="vm-acts"><span>' + X.speaker + '</span><span class="vm-call">' + X.phone + '</span><span class="vm-del">' + X.trash + '</span></div></div>' +
        older +
        '<div class="vm-grow"></div>' +
        '<div class="vm-tabs"><span>' + X.star + '<i>Favorites</i></span><span>' + X.clock + '<i>Recents</i></span><span>' + X.person + '<i>Contacts</i></span>' +
        '<span>' + X.grid + '<i>Keypad</i></span><span class="on">' + X.voicemail + (s.unread ? '<em>' + E('unread', s.unread) + '</em>' : '') + '<i>Voicemail</i></span></div></div>';
    }
  });

  /* ============================== amazon order ============================== */

  var AZ_STEPS = ['Ordered', 'Shipped', 'Out for delivery', 'Delivered'];
  TOOLS.push({
    id: 'amazonorder',
    label: 'amazon order',
    defaults: { step: 3, headline: '', sub: '', product: '', productName: '', note: '', photo: '', orderNo: '', dates: '' },
    fields: [
      { key: 'step', type: 'select', label: 'where it is', options: [['0', 'ordered'], ['1', 'shipped'], ['2', 'out for delivery'], ['3', 'delivered']] },
      { key: 'headline', type: 'text', label: 'big green line', placeholder: 'Delivered today' },
      { key: 'sub', type: 'text', label: 'under that', placeholder: 'Your package was left near the front door' },
      { key: 'product', type: 'image', label: 'product picture', max: 500 },
      { key: 'productName', type: 'text', label: 'product name' },
      { key: 'photo', type: 'image', label: 'delivery photo', max: 1000 },
      { key: 'note', type: 'text', label: 'photo caption', placeholder: 'Photo of your delivery' },
      { key: 'orderNo', type: 'text', label: 'order #', placeholder: '112-3456789-0123456' },
      { key: 'dates', type: 'text', label: 'tracker dates', placeholder: 'Mon, Tue, Wed, Thu' }
    ],
    render: function (s) {
      var step = +s.step || 0, dates = String(s.dates || '').split(',').map(function (d) { return d.trim(); });
      var track = AZ_STEPS.map(function (n, i) {
        return '<div class="ao-step' + (i <= step ? ' done' : '') + (i === step ? ' now' : '') + '"><i>' + (i <= step ? X.check : '') + '</i><b>' + n + '</b>' +
          (dates[i] ? '<span>' + esc(dates[i]) + '</span>' : '') + '</div>';
      }).join('');
      return '<div class="shot ao"><div class="ao-bar"><span class="ao-logo">amazon</span><span class="ao-search">Search Amazon</span></div>' +
        '<div class="ao-body"><div class="ao-headline' + (step === 3 ? ' green' : '') + '">' + E('headline', s.headline) + '</div>' +
        '<div class="ao-sub">' + E('sub', s.sub) + '</div>' +
        '<div class="ao-track" style="--p:' + (step / 3 * 100) + '%"><div class="ao-line"><i></i></div>' + track + '</div>' +
        (s.photo || step === 3 ? '<div class="ao-photo">' + (s.photo ? '<img src="' + s.photo + '"' + DI('photo') + ' alt="">' : '<div class="ao-ph"' + DI('photo') + '></div>') +
          '<span>' + E('note', s.note) + '</span></div>' : '') +
        '<div class="ao-item">' + (s.product ? '<img src="' + s.product + '"' + DI('product') + ' alt="">' : '<div class="ao-pimg"' + DI('product') + '>' + X.box + '</div>') +
        '<div><div class="ao-pname">' + E('productName', s.productName) + '</div><span class="ao-btn">Buy it again</span></div></div>' +
        '<div class="ao-order">Order # ' + E('orderNo', s.orderNo) + '</div></div></div>';
    }
  });

  /* ============================== breaking news ============================== */

  TOOLS.push({
    id: 'news',
    label: 'breaking news',
    defaults: { pic: '', style: 'red', tag: 'BREAKING NEWS', headline: '', sub: '', channel: '', ticker: '', time: '', live: true },
    fields: [
      { key: 'pic', type: 'image', label: 'picture behind', max: 1600 },
      { key: 'style', type: 'select', label: 'colors', options: [['red', 'red'], ['blue', 'blue'], ['black', 'black + yellow']] },
      { key: 'tag', type: 'text', label: 'tag' },
      { key: 'headline', type: 'text', label: 'headline' },
      { key: 'sub', type: 'text', label: 'smaller line' },
      { type: 'row', fields: [
        { key: 'channel', type: 'text', label: 'channel', placeholder: 'NEWS 4' },
        { key: 'time', type: 'text', label: 'time', placeholder: '9:41 PM' },
        { key: 'live', type: 'toggle', label: 'LIVE' }
      ] },
      { key: 'ticker', type: 'text', label: 'ticker at the bottom' }
    ],
    render: function (s) {
      return '<div class="shot nw s-' + s.style + '">' + (s.pic ? '<img class="nw-bg" src="' + s.pic + '"' + DI('pic') + ' alt="">' : '<div class="nw-bg"' + DI('pic') + '></div>') +
        '<div class="nw-bug">' + E('channel', s.channel) + (s.live ? '<span class="nw-live">LIVE</span>' : '') + '</div>' +
        '<div class="nw-third"><div class="nw-tag">' + E('tag', s.tag) + '</div>' +
        '<div class="nw-main"><div class="nw-head">' + E('headline', s.headline) + '</div><div class="nw-sub">' + E('sub', s.sub) + '</div></div>' +
        '<div class="nw-foot"><span class="nw-time">' + E('time', s.time) + '</span><span class="nw-ticker">' + E('ticker', s.ticker) + '</span></div></div></div>';
    }
  });

  /* ============================== award certificate ============================== */

  TOOLS.push({
    id: 'award',
    label: 'award',
    defaults: { theme: 'gold', title: 'Certificate of Achievement', presented: 'this award is proudly presented to', name: '', for: '', date: '', signer: '', signer2: '' },
    fields: [
      { key: 'theme', type: 'select', label: 'colors', options: [['gold', 'gold'], ['pink', 'pink'], ['black', 'black + silver'], ['blue', 'blue']] },
      { key: 'title', type: 'text', label: 'title' },
      { key: 'presented', type: 'text', label: 'small line' },
      { key: 'name', type: 'text', label: 'name' },
      { key: 'for', type: 'textarea', label: 'for', rows: 2, placeholder: 'best eyeliner 2026' },
      { type: 'row', fields: [
        { key: 'date', type: 'text', label: 'date' },
        { key: 'signer', type: 'text', label: 'signed by' },
        { key: 'signer2', type: 'text', label: 'second signer' }
      ] }
    ],
    render: function (s) {
      var seal = '<div class="aw-seal"><div class="aw-ribbon l"></div><div class="aw-ribbon r"></div><div class="aw-star">' +
        '<svg viewBox="0 0 100 100"><polygon points="' + (function () {
          var pts = [];
          for (var k = 0; k < 48; k++) { var a = k / 48 * Math.PI * 2, r = k % 2 ? 43 : 50; pts.push((50 + Math.cos(a) * r).toFixed(1) + ',' + (50 + Math.sin(a) * r).toFixed(1)); }
          return pts.join(' ');
        })() + '"/></svg><span>★</span></div></div>';
      return '<div class="shot aw t-' + s.theme + '"><div class="aw-frame"><div class="aw-in">' +
        '<div class="aw-title">' + E('title', s.title) + '</div>' +
        '<div class="aw-pres">' + E('presented', s.presented) + '</div>' +
        '<div class="aw-name">' + E('name', s.name) + '</div><div class="aw-rule"></div>' +
        '<div class="aw-for">' + EB('for', s.for) + '</div>' +
        '<div class="aw-sigs"><div><b>' + E('date', s.date) + '</b><span>date</span></div>' + seal +
        '<div><b class="aw-sign">' + E('signer', s.signer) + '</b><span>' + E('signer2', s.signer2) + '</span></div></div>' +
        '</div></div></div>';
    }
  });

  /* ============================== wanted / missing posters ============================== */

  TOOLS.push({
    id: 'poster',
    label: 'wanted / missing',
    defaults: { kind: 'wanted', photo: '', top: '', name: '', line2: '', reward: '', details: '', phone: '' },
    fields: [
      { key: 'kind', type: 'select', label: 'poster', options: [['wanted', 'wanted'], ['missing', 'missing']] },
      { key: 'photo', type: 'image', label: 'picture', max: 900 },
      { key: 'top', type: 'text', label: 'big word', placeholder: 'WANTED / MISSING' },
      { key: 'line2', type: 'text', label: 'under the big word', placeholder: 'DEAD OR ALIVE / HAVE YOU SEEN ME?' },
      { key: 'name', type: 'text', label: 'name' },
      { key: 'details', type: 'textarea', label: 'details', rows: 3, placeholder: 'for stealing my hoodie' },
      { key: 'reward', type: 'text', label: 'reward', placeholder: '$500' },
      { key: 'phone', type: 'text', label: 'phone (missing tear-offs)', placeholder: '555-0143' }
    ],
    render: function (s) {
      var pic = s.photo ? '<img class="po-pic" src="' + s.photo + '"' + DI('photo') + ' alt="">' : '<div class="po-pic"' + DI('photo') + '></div>';
      if (s.kind === 'missing') {
        var tabs = '';
        for (var k = 0; k < 8; k++) tabs += '<span>' + (k ? esc(s.phone === GHOST ? '' : s.phone) : E('phone', s.phone)) + '</span>';
        return '<div class="shot po missing"><div class="po-big">' + (s.top && s.top !== GHOST ? E('top', s.top) : '<span data-e="top">MISSING</span>') + '</div>' +
          '<div class="po-l2">' + (s.line2 && s.line2 !== GHOST ? E('line2', s.line2) : '<span data-e="line2">HAVE YOU SEEN ME?</span>') + '</div>' + pic +
          '<div class="po-name">' + E('name', s.name) + '</div><div class="po-details">' + EB('details', s.details) + '</div>' +
          (s.reward ? '<div class="po-reward">REWARD ' + E('reward', s.reward) + '</div>' : '') +
          '<div class="po-tabs">' + tabs + '</div></div>';
      }
      return '<div class="shot po wanted"><div class="po-big">' + (s.top && s.top !== GHOST ? E('top', s.top) : '<span data-e="top">WANTED</span>') + '</div>' +
        '<div class="po-l2">' + (s.line2 && s.line2 !== GHOST ? E('line2', s.line2) : '<span data-e="line2">DEAD OR ALIVE</span>') + '</div>' +
        '<div class="po-frame">' + pic + '</div><div class="po-name">' + E('name', s.name) + '</div>' +
        '<div class="po-details">' + EB('details', s.details) + '</div>' +
        '<div class="po-reward"><span>REWARD</span>' + E('reward', s.reward) + '</div></div>';
    }
  });

  /* ============================== screen time ============================== */

  function hm(min) {
    min = Math.max(0, Math.round(min));
    var h = Math.floor(min / 60), m = min % 60;
    return h ? h + 'h ' + m + 'm' : m + 'm';
  }
  function minutes(t) {
    var h = /(\d+)\s*h/i.exec(t || ''), m = /(\d+)\s*m/i.exec(t || '');
    return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0) || (parseFloat(t) || 0);
  }

  TOOLS.push({
    id: 'screentime',
    label: 'screen time',
    defaults: { theme: 'light', clock: '9:41', battery: 12, showPct: false, total: '', change: '', pickups: '', notifs: '', apps: [] },
    fields: [
      U.STATUS_FIELDS,
      { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
      { type: 'row', fields: [
        { key: 'total', type: 'text', label: 'total today', placeholder: '9h 42m' },
        { key: 'change', type: 'text', label: 'vs yesterday', placeholder: '23% above' }
      ] },
      { type: 'row', fields: [
        { key: 'pickups', type: 'text', label: 'pickups' },
        { key: 'notifs', type: 'text', label: 'notifications' }
      ] },
      { type: 'head', label: 'most used' },
      { key: 'apps', type: 'list', compact: true, adds: [{ label: '+ app', item: item({ icon: '', name: '', time: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'icon', type: 'image', label: 'icon', max: 200 },
          { key: 'name', type: 'text', label: 'app' },
          { key: 'time', type: 'text', label: 'time', placeholder: '4h 12m' }
        ] }
      ] }
    ],
    render: function (s) {
      var total = minutes(s.total), apps = s.apps || [];
      var maxApp = Math.max.apply(null, apps.map(function (a) { return minutes(a.time); }).concat([1]));
      // an hour-by-hour chart that adds up to the total (same shape every time)
      var shape = [0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 3, 5, 6, 4, 5, 6, 7, 8, 9, 10, 12, 11, 8, 4], sum = shape.reduce(function (a, b) { return a + b; }, 0);
      var bars = shape.map(function (v) {
        var mins = total * v / sum, h = Math.min(100, mins / 60 * 100);
        return '<i style="height:' + h + '%"><b style="height:55%"></b><em style="height:25%"></em></i>';
      }).join('');
      var list = apps.map(function (a, i) {
        var pre = 'apps.' + i + '.';
        return '<div class="st-app">' + ava(a.icon, a.name, 'st-icon', undefined, pre + 'icon') + '<div class="st-mid"><b>' + E(pre + 'name', a.name) + '</b>' +
          '<div class="st-bar"><i style="width:' + (minutes(a.time) / maxApp * 100) + '%"></i></div></div><span>' + E(pre + 'time', a.time) + '</span></div>';
      }).join('');
      return '<div class="shot scr t-' + s.theme + '">' + U.statusBar(s) +
        '<div class="scr-nav"><span>‹ Settings</span></div><div class="scr-title">Screen Time</div>' +
        '<div class="scr-card"><div class="scr-lab">SCREEN TIME</div><div class="scr-sub">Today</div>' +
        '<div class="scr-big">' + E('total', s.total) + '</div>' + (s.change ? '<div class="scr-chg">' + E('change', s.change) + ' yesterday</div>' : '') +
        '<div class="scr-chart"><div class="scr-bars">' + bars + '</div><div class="scr-hours"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span></div></div>' +
        '<div class="scr-key"><span><i class="k1"></i>Social</span><span><i class="k2"></i>Entertainment</span><span><i class="k3"></i>Other</span></div></div>' +
        (list ? '<div class="scr-card"><div class="scr-lab">MOST USED</div>' + list + '</div>' : '') +
        '<div class="scr-card scr-two"><div><span>Pickups</span><b>' + E('pickups', s.pickups) + '</b></div><div><span>Notifications</span><b>' + E('notifs', s.notifs) + '</b></div></div></div>';
    }
  });

  /* tab order: these go after the phone-ish ones */
  var ORDER = ['spotify', 'applemusic', 'lockscreen', 'tweet', 'imessage', 'android', 'calls', 'voicemail', 'screentime', 'igdm', 'igcomments', 'profile',
    'roblox', 'tiktok', 'twitch', 'youtube', 'reddit', 'facebook', 'pinterest', 'whisper', 'brat', 'snapchat', 'discord', 'chatgpt', 'claude',
    'google', 'amazon', 'amazonorder', 'news', 'award', 'poster', 'minecraft', 'tumblr', 'notes'];
  TOOLS.sort(function (a, b) {
    var x = ORDER.indexOf(a.id), y = ORDER.indexOf(b.id);
    return (x < 0 ? 999 : x) - (y < 0 ? 999 : y);
  });
})();
