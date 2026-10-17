/* screenies — phone stuff: anon questions (tellonym / ngl / curiouscat), tumblr ask, steam profile, find my / snap map,
   imessage group chat, lock + home screen widgets, ios weather. css lives in shots-phone.css (every class starts with pz-). */

(function () {
  var esc = U.esc;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function fill(d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' pz-ph0"' + DI(path) + '></div>'; }
  function num(v, d) { var n = parseFloat(String(v == null ? '' : v).replace(/[^\d.\-]/g, '')); return isNaN(n) ? d : n; }
  function txt(v) { return String(bare(v) == null ? '' : bare(v)).replace(/​/g, '').trim(); }
  function rgba(hex, a) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 'rgba(0,0,0,' + a + ')';
    var n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function rng(seed) {
    var a = (seed | 0) + 0x6d2b79f5;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function sid() { return Math.random().toString(36).slice(2, 8); }
  function batt(pct) {
    var p = Math.max(0, Math.min(100, num(pct, 0))), w = Math.max(1.5, 16 * p / 100);
    return '<svg class="pz-batt" viewBox="0 0 25 12" width="25" height="12"><rect x=".5" y=".5" width="21" height="11" rx="3.4" fill="none" stroke="currentColor" opacity=".45"/>' +
      '<rect x="2.5" y="2.5" width="' + w + '" height="7" rx="1.6" fill="' + (p <= 20 ? '#ff3b30' : 'currentColor') + '"/><path d="M23 4.2v3.6c.7-.3 1.2-1 1.2-1.8s-.5-1.5-1.2-1.8z" opacity=".45"/></svg>';
  }

  var I = {
    heart: stroke('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z', 1.9),
    heartF: fill('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z'),
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    reblog: stroke('M17 3.5 20 6.5l-3 3M4 11.5v-2a3 3 0 0 1 3-3h13M7 20.5 4 17.5l3-3M20 12.5v2a3 3 0 0 1-3 3H4', 2),
    reply: stroke('M12 3.5c5 0 9 3.4 9 7.8S17 19 12 19c-1 0-2-.1-2.9-.4L4 21l1.5-4.1C4 15.4 3 13.4 3 11.3 3 6.9 7 3.5 12 3.5z', 2),
    share: stroke('M21 3 3 10.5l7 2.8L21 3zM21 3l-7.7 18-3.3-7.7', 2),
    chev: '<svg viewBox="0 0 12 21"><path d="M10.5 1.5 1.8 10.5l8.7 9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    video: '<svg viewBox="0 0 30 20"><rect x="0" y="1" width="20" height="18" rx="4.5"/><path d="M22 7.5 28.2 3.4c.8-.5 1.8 0 1.8 1v11.2c0 1-1 1.5-1.8 1L22 12.5z"/></svg>',
    plus: stroke('M12 6v12M6 12h12', 2.2),
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
    flash: '<svg viewBox="0 0 24 24"><path d="M8 2.5h8v3.2l-2 3V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V8.7l-2-3z"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h2.8l1.6-2.2h5.2L16.2 7H19a1.5 1.5 0 0 1 1.5 1.5v9.5A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z"/><circle cx="12" cy="13" r="3.4" fill="#000" opacity=".55"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><path d="M7 10V7.5a5 5 0 0 1 10 0V10h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10zm2 0h6V7.5a3 3 0 0 0-6 0z"/></svg>',
    search: stroke('M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20', 2.4),
    gear: stroke('M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM19.4 13.5l1.6 1.2-1.8 3.1-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2H11l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7L5 14.7l1.6-1.2a7.7 7.7 0 0 1 0-2.4L5 9.9l1.8-3.1 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h3.6l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7L20.6 9.9 19 11.1a7.7 7.7 0 0 1 .4 2.4z', 1.7),
    arrow: fill('M20.5 3.5 3.5 10.6l7.2 2.2 2.2 7.2z'),
    map: stroke('M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6zM9 4v14M15 6v14', 1.8),
    list: stroke('M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01', 2.4),
    cal: stroke('M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4', 1.8),
    star: fill('M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z'),
    loc: fill('M19.5 4.5 4 11.2l6.6 1.9 1.9 6.6z'),
    music: fill('M9 17.5V6l11-2.5v11.6a2.6 2.6 0 1 1-1.7-2.4V7.6L10.7 9.3v9.8a2.6 2.6 0 1 1-1.7-2.4z'),
    play: fill('M8 5.5v13l11-6.5z'),
    pause: fill('M7 5h3.5v14H7zM13.5 5H17v14h-3.5z'),
    note: fill('M5 3.5h14A1.5 1.5 0 0 1 20.5 5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5zm0 5v10.5h14V8.5z'),
    phone: fill('M8 2.5h8A1.5 1.5 0 0 1 17.5 4v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5zm2.3 1.5v.8h3.4V4z'),
    bolt: fill('M13.5 2 5 13.5h6L10 22l9-12h-6.2z')
  };

  /* ---------- weather icons (colored like ios) ---------- */

  var CLOUD = 'M6.8 19.2h10.6a4.3 4.3 0 0 0 .7-8.6 6 6 0 0 0-11.5-1.4A5 5 0 0 0 6.8 19.2z';
  function sunG(cx, cy, r) {
    var rays = '';
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4, x1 = cx + Math.cos(a) * (r + 2.2), y1 = cy + Math.sin(a) * (r + 2.2), x2 = cx + Math.cos(a) * (r + 4.4), y2 = cy + Math.sin(a) * (r + 4.4);
      rays += '<line x1="' + x1.toFixed(2) + '" y1="' + y1.toFixed(2) + '" x2="' + x2.toFixed(2) + '" y2="' + y2.toFixed(2) + '"/>';
    }
    return '<g stroke="#ffd60a" stroke-width="1.7" stroke-linecap="round">' + rays + '</g><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#ffd60a"/>';
  }
  var MOON = 'M15.5 3.2a8.6 8.6 0 1 0 5.3 13.7A7.2 7.2 0 0 1 15.5 3.2z';
  function drops(col) {
    return '<g stroke="' + col + '" stroke-width="1.9" stroke-linecap="round"><line x1="8.6" y1="20.3" x2="7.6" y2="22.6"/><line x1="12.6" y1="20.3" x2="11.6" y2="22.6"/><line x1="16.6" y1="20.3" x2="15.6" y2="22.6"/></g>';
  }
  var WX = {
    sun: ['Sunny', '<svg viewBox="0 0 24 24">' + sunG(12, 12, 4.6) + '</svg>'],
    moon: ['Clear', '<svg viewBox="0 0 24 24"><path d="' + MOON + '" fill="#fff"/></svg>'],
    partly: ['Partly Cloudy', '<svg viewBox="0 0 24 24"><g transform="translate(4 -3) scale(.75)">' + sunG(12, 12, 4.6) + '</g><g transform="translate(0 2) scale(.9)"><path d="' + CLOUD + '" fill="#fff"/></g></svg>'],
    pnight: ['Partly Cloudy', '<svg viewBox="0 0 24 24"><g transform="translate(6 -1) scale(.62)"><path d="' + MOON + '" fill="#fff"/></g><g transform="translate(0 2) scale(.9)"><path d="' + CLOUD + '" fill="#fff"/></g></svg>'],
    cloud: ['Cloudy', '<svg viewBox="0 0 24 24"><path d="' + CLOUD + '" fill="#fff" transform="translate(0 -1)"/></svg>'],
    rain: ['Rain', '<svg viewBox="0 0 24 24"><g transform="translate(1.2 -3.4) scale(.9)"><path d="' + CLOUD + '" fill="#fff"/></g>' + drops('#5ac8fa') + '</svg>'],
    storm: ['Thunderstorms', '<svg viewBox="0 0 24 24"><g transform="translate(1.2 -3.4) scale(.9)"><path d="' + CLOUD + '" fill="#fff"/></g><path d="M12.8 15.4 9.6 19.6h2.5l-1.1 4 3.6-5h-2.6l1.4-3.2z" fill="#ffd60a"/></svg>'],
    snow: ['Snow', '<svg viewBox="0 0 24 24"><g transform="translate(1.2 -3.4) scale(.9)"><path d="' + CLOUD + '" fill="#fff"/></g><g fill="#fff"><circle cx="8.2" cy="20.4" r="1.15"/><circle cx="12.2" cy="22.2" r="1.15"/><circle cx="16.2" cy="20.4" r="1.15"/></g></svg>'],
    fog: ['Fog', '<svg viewBox="0 0 24 24"><g transform="translate(1.2 -4) scale(.9)"><path d="' + CLOUD + '" fill="#fff"/></g><g stroke="#fff" stroke-width="1.7" stroke-linecap="round"><line x1="5" y1="17.8" x2="19" y2="17.8"/><line x1="7" y1="21" x2="17" y2="21"/></g></svg>'],
    wind: ['Windy', '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"><path d="M3 9h11.5a2.6 2.6 0 1 0-2.6-2.6M3 13.5h15.5a2.6 2.6 0 1 1-2.6 2.6M3 18h7"/></svg>']
  };
  var WX_OPTS = Object.keys(WX).map(function (k) { return [k, k === 'pnight' ? 'cloudy night' : k === 'moon' ? 'moon' : WX[k][0].toLowerCase()]; });
  function wx(k) { return (WX[k] || WX.sun)[1]; }

  /* ============================== anon questions ============================== */

  var AQ = { tellonym: ['#ff4486', '#ff8aa9'], ngl: ['#ec1187', '#ff8d10'], cat: ['#f5832a', '#ffbe5c'] };
  var CAT_FACE = '<svg viewBox="0 0 24 24"><path d="M4 3.5l4.2 3.6a10 10 0 0 1 7.6 0L20 3.5v8.2a8 8 0 0 1-16 0z"/><circle cx="9" cy="12" r="1.3" fill="#fff"/><circle cx="15" cy="12" r="1.3" fill="#fff"/><path d="M10.6 15h2.8L12 16.4z" fill="#fff"/></svg>';
  TOOLS.push({
    id: 'tellonym',
    label: 'anon asks',
    group: 'phone',
    defaults: { style: 'ngl', frame: 'story', c1: '#ec1187', c2: '#ff8d10', bg: '', prompt: '', question: '', answer: '', pic: '', name: '', time: '', likes: '' },
    fields: [
      { type: 'row', fields: [
        { key: 'style', type: 'select', label: 'style', options: [['ngl', 'ngl'], ['tellonym', 'tellonym'], ['cat', 'curiouscat']],
          onPick: function (s) { var c = AQ[s.style] || AQ.ngl; s.c1 = c[0]; s.c2 = c[1]; }, rebuild: true },
        { key: 'frame', type: 'select', label: 'shape', options: [['story', 'story'], ['card', 'card']] }
      ] },
      { type: 'row', fields: [
        { key: 'c1', type: 'color', label: 'color', swatches: function () { return ['#ec1187', '#ff4486', '#f5832a', '#8e44ff', '#111111']; } },
        { key: 'c2', type: 'color', label: 'color 2', swatches: function () { return ['#ff8d10', '#ff8aa9', '#ffbe5c', '#3fa9ff', '#444444']; } }
      ] },
      { key: 'bg', type: 'image', label: 'story background', max: 1400 },
      { key: 'prompt', type: 'text', label: 'prompt', placeholder: 'send me anonymous messages!' },
      { key: 'question', type: 'textarea', label: 'question', rows: 2 },
      { key: 'answer', type: 'textarea', label: 'answer', rows: 3 },
      { type: 'row', fields: [
        { key: 'pic', type: 'image', label: 'pfp', max: 300 },
        { key: 'name', type: 'text', label: 'username' }
      ] },
      { type: 'row', fields: [
        { key: 'time', type: 'text', label: 'time', placeholder: '2h' },
        { key: 'likes', type: 'text', label: 'likes' }
      ] }
    ],
    render: function (s) {
      var card, under = '';
      var who = U.avatar(s.pic, s.name, 'pz-aq-ava', s.c1, 'pic');
      if (s.style === 'tellonym') {
        card = '<div class="pz-tl">' +
          '<div class="pz-tl-tell" style="background:' + rgba(s.c1, 0.08) + '"><div class="pz-tl-tl" style="color:' + s.c1 + '">Tell</div><div class="pz-tl-q">' + EB('question', s.question) + '</div></div>' +
          '<div class="pz-tl-who">' + who + '<b>' + E('name', s.name) + '</b>' + (s.time ? '<span>' + E('time', s.time) + '</span>' : '') + '</div>' +
          '<div class="pz-tl-a">' + EB('answer', s.answer) + '</div>' +
          '<div class="pz-tl-foot"><span class="pz-tl-like" style="color:' + s.c1 + '">' + I.heartF + E('likes', s.likes) + '</span><span class="pz-tl-logo" style="color:' + s.c1 + '">tellonym</span></div></div>';
      } else if (s.style === 'cat') {
        card = '<div class="pz-cc">' +
          '<div class="pz-cc-q" style="background:linear-gradient(135deg,' + s.c1 + ',' + s.c2 + ')"><div class="pz-cc-from"><span class="pz-cc-anon">' + CAT_FACE + '</span><b>Anonymous</b>' +
          (s.time ? '<span>' + E('time', s.time) + '</span>' : '') + '</div><div class="pz-cc-qt">' + EB('question', s.question) + '</div></div>' +
          '<div class="pz-cc-a">' + who + '<div class="pz-cc-aw"><b>' + E('name', s.name) + '</b><div>' + EB('answer', s.answer) + '</div></div></div>' +
          '<div class="pz-cc-foot"><span>' + I.heart + E('likes', s.likes) + '</span><span class="pz-cc-logo" style="color:' + s.c1 + '">' + CAT_FACE + 'curiouscat</span></div></div>';
      } else {
        card = '<div class="pz-ngl"><div class="pz-ngl-top" style="background:linear-gradient(90deg,' + s.c1 + ',' + s.c2 + ')">' + who +
          '<span>' + E('prompt', txt(s.prompt) || 'send me anonymous messages!') + '</span></div>' +
          '<div class="pz-ngl-q">' + EB('question', s.question) + '</div></div>';
        under = '<div class="pz-aq-ans">' + EB('answer', s.answer) + '</div>';
      }
      if (s.frame === 'card') {
        return '<div class="shot pz-aq pz-aq-card st-' + s.style + '">' + card + (under ? '<div class="pz-aq-cans">' + EB('answer', s.answer) + '</div>' : '') + '</div>';
      }
      var bg = s.bg ? '<img class="pz-aq-bg" src="' + s.bg + '"' + DI('bg') + ' alt="">'
        : '<div class="pz-aq-bg"' + DI('bg') + ' style="background:linear-gradient(180deg,' + U.shade(s.c1, -0.25) + ',' + U.shade(s.c2, -0.35) + ')"></div>';
      return '<div class="shot pz-aq pz-aq-story st-' + s.style + '">' + bg + '<div class="pz-aq-mid">' + card + under + '</div></div>';
    }
  });

  /* ============================== tumblr ask ============================== */

  var ANON = '<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="#a3a3a3"/><path d="M32 13c-8.5 0-13 5.6-13 12.7 0 5 2.2 9 5.6 11.4v3.6C16 43 11 47.5 9.5 58h45C53 47.5 48 43 39.4 40.7v-3.6c3.4-2.4 5.6-6.4 5.6-11.4C45 18.6 40.5 13 32 13z" fill="#e6e6e6"/><path d="M17.5 27c2-1 4.4-1.6 7-1.6 3 0 4.6 1.2 7.5 1.2s4.5-1.2 7.5-1.2c2.6 0 5 .6 7 1.6l-.4 2c-1.4 0-1.7 4.6-6.4 4.6-4.4 0-5.3-3.6-7.7-3.6s-3.3 3.6-7.7 3.6c-4.7 0-5-4.6-6.4-4.6z" fill="#3c3c3c"/></svg>';
  TOOLS.push({
    id: 'tumblrask',
    label: 'tumblr ask',
    group: 'phone',
    defaults: { theme: 'light', blog: '', avatar: '', asker: '', askerPic: '', question: '', answer: '', image: '', tags: '', notes: '', liked: false },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'theme', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'notes', type: 'text', label: 'notes' },
        { key: 'liked', type: 'toggle', label: 'liked' }
      ] },
      { type: 'head', label: 'ask' },
      { type: 'row', fields: [
        { key: 'askerPic', type: 'image', label: 'asker icon', max: 300 },
        { key: 'asker', type: 'text', label: 'asker', placeholder: 'blank = anonymous' }
      ] },
      { key: 'question', type: 'textarea', label: 'question', rows: 3 },
      { type: 'head', label: 'answer' },
      { type: 'row', fields: [
        { key: 'avatar', type: 'image', label: 'your icon', max: 300 },
        { key: 'blog', type: 'text', label: 'your blog' }
      ] },
      { key: 'answer', type: 'textarea', label: 'answer', rows: 4 },
      { key: 'image', type: 'image', label: 'picture', max: 1200 },
      { key: 'tags', type: 'text', label: 'tags', placeholder: '#tag #another tag' }
    ],
    render: function (s) {
      var named = !!txt(s.asker);
      var askIcon = s.askerPic ? '<img class="pz-ta-aico" src="' + s.askerPic + '"' + DI('askerPic') + ' alt="">'
        : named ? U.avatar('', s.asker, 'pz-ta-aico', undefined, 'askerPic') : '<span class="pz-ta-aico pz-ta-anon"' + DI('askerPic') + '>' + ANON + '</span>';
      var tags = String(bare(s.tags) || '').split('#').map(function (t) { return t.trim(); }).filter(Boolean)
        .map(function (t) { return '<span>#' + esc(t) + '</span>'; }).join('');
      return '<div class="shot pz-ta t-' + s.theme + '"><div class="pz-ta-post">' +
        '<div class="pz-ta-head">' + U.avatar(s.avatar, s.blog, 'pz-ta-ava', undefined, 'avatar') +
        '<div class="pz-ta-names"><b>' + E('blog', s.blog) + '</b><span class="pz-ta-follow">Follow</span></div><span class="pz-ta-more">' + I.dots + '</span></div>' +
        '<div class="pz-ta-askrow"><div class="pz-ta-ask"><div class="pz-ta-asker">' + (named ? '<b>' + E('asker', s.asker) + '</b>' : '<b><span data-e="asker">anonymous</span></b>') + ' asked:</div>' +
        '<div class="pz-ta-q">' + EB('question', s.question) + '</div></div>' + askIcon + '</div>' +
        (s.image ? '<img class="pz-ta-img" src="' + s.image + '"' + DI('image') + ' alt="">' : '') +
        '<div class="pz-ta-a">' + EB('answer', s.answer) + '</div>' +
        '<div class="pz-ta-tags">' + EW('tags', tags) + '</div>' +
        '<div class="pz-ta-foot"><span class="pz-ta-notes">' + (s.notes ? E('notes', s.notes) + ' ' : '') + 'notes</span><span class="pz-ta-icons">' +
        I.share + I.reply + I.reblog + '<span class="' + (s.liked ? 'pz-ta-liked' : '') + '">' + (s.liked ? I.heartF : I.heart) + '</span></span></div>' +
        '</div></div>';
    }
  });

  /* ============================== steam profile ============================== */

  var ST_LV = ['#9b9b9b', '#c02942', '#d95b43', '#fecc23', '#467a3c', '#4e8ddb', '#7652c9', '#c252c9', '#542437', '#997c52'];
  var ST_STATUS = {
    online: ['Currently Online', '#57cbde', 'linear-gradient(180deg,#53a4c4,#45778e)'],
    ingame: ['Currently In-Game', '#90ba3c', 'linear-gradient(180deg,#8fb93b,#6e8c31)'],
    away: ['Currently Away', '#57cbde', 'linear-gradient(180deg,#53a4c4,#45778e)'],
    offline: ['Currently Offline', '#898989', 'linear-gradient(180deg,#6a6a6a,#4b4b4b)']
  };
  TOOLS.push({
    id: 'steam',
    label: 'steam profile',
    group: 'phone',
    defaults: { bgimg: '', avatar: '', name: '', realName: '', flag: '', country: '', summary: '', level: '', status: 'ingame', game: '',
      customFrame: false, frameColor: '#ff5ec4', badgeIcon: '', badgeName: '', badgeXp: '', badgeCount: '', gameCount: '', friendCount: '',
      badges: [], favPic: '', favName: '', favHours: '', favAch: '', hours2wk: '', recent: [] },
    fields: [
      { key: 'bgimg', type: 'image', label: 'profile background', max: 1600 },
      { type: 'row', fields: [
        { key: 'avatar', type: 'image', label: 'avatar', max: 400 },
        { key: 'name', type: 'text', label: 'name' }
      ] },
      { type: 'row', fields: [
        { key: 'customFrame', type: 'toggle', label: 'own frame color' },
        { key: 'frameColor', type: 'color', label: 'frame', swatches: function () { return ['#ff5ec4', '#b14bff', '#ffd23f', '#ff3b3b', '#ffffff']; } }
      ] },
      { type: 'row', fields: [
        { key: 'realName', type: 'text', label: 'real name' },
        { key: 'flag', type: 'text', label: 'flag', placeholder: '🇺🇸' },
        { key: 'country', type: 'text', label: 'country', placeholder: 'United States' }
      ] },
      { key: 'summary', type: 'textarea', label: 'summary', rows: 3 },
      { type: 'row', fields: [
        { key: 'level', type: 'text', label: 'level' },
        { key: 'status', type: 'select', label: 'status', options: [['ingame', 'in-game'], ['online', 'online'], ['away', 'away'], ['offline', 'offline']] }
      ] },
      { key: 'game', type: 'text', label: 'playing' },
      { type: 'head', label: 'featured badge' },
      { type: 'row', fields: [
        { key: 'badgeIcon', type: 'image', label: 'icon', max: 200 },
        { key: 'badgeName', type: 'text', label: 'name' },
        { key: 'badgeXp', type: 'text', label: 'xp' }
      ] },
      { type: 'row', fields: [
        { key: 'badgeCount', type: 'text', label: 'badges' },
        { key: 'gameCount', type: 'text', label: 'games' },
        { key: 'friendCount', type: 'text', label: 'friends' }
      ] },
      { type: 'head', label: 'badge showcase' },
      { key: 'badges', type: 'list', adds: [{ label: '+ badge', item: item({ icon: '', name: '' }) }],
        item: [{ type: 'row', fields: [{ key: 'icon', type: 'image', label: 'icon', max: 200 }, { key: 'name', type: 'text', label: 'name' }] }] },
      { type: 'head', label: 'favorite game' },
      { key: 'favPic', type: 'image', label: 'game art', max: 800 },
      { type: 'row', fields: [
        { key: 'favName', type: 'text', label: 'game' },
        { key: 'favHours', type: 'text', label: 'hours' },
        { key: 'favAch', type: 'text', label: 'achievements' }
      ] },
      { type: 'head', label: 'recent activity' },
      { key: 'hours2wk', type: 'text', label: 'hours past 2 weeks' },
      { key: 'recent', type: 'list', adds: [{ label: '+ game', item: item({ pic: '', game: '', hours: '', last: '', ach: '' }) }],
        item: [
          { key: 'pic', type: 'image', label: 'game art', max: 600 },
          { key: 'game', type: 'text', label: 'game' },
          { type: 'row', fields: [
            { key: 'hours', type: 'text', label: 'hrs on record' },
            { key: 'last', type: 'text', label: 'last played', placeholder: '14 Oct' },
            { key: 'ach', type: 'text', label: 'achievements', placeholder: '12 of 40' }
          ] }
        ] }
    ],
    render: function (s) {
      var stt = ST_STATUS[s.status] || ST_STATUS.online, lv = Math.max(0, Math.round(num(s.level, 0)));
      var lvc = ST_LV[Math.floor((lv % 100) / 10)];
      var frame = s.customFrame ? s.frameColor : stt[2];
      var badges = (s.badges || []).map(function (b, i) {
        return '<div class="pz-st-bdg">' + pic(b.icon, 'badges.' + i + '.icon', 'pz-st-bi') + '<span>' + E('badges.' + i + '.name', b.name) + '</span></div>';
      }).join('');
      function achBar(v, path) {
        var m = /(\d+)\D+(\d+)/.exec(txt(v)), p = m ? Math.min(100, 100 * m[1] / Math.max(1, m[2])) : 0;
        return '<div class="pz-st-ach"><span>Achievement Progress</span><b>' + E(path, v) + '</b><div class="pz-st-abar"><i style="width:' + p + '%"></i></div></div>';
      }
      var recent = (s.recent || []).map(function (g, i) {
        var p = 'recent.' + i + '.';
        return '<div class="pz-st-game">' + pic(g.pic, p + 'pic', 'pz-st-cap') +
          '<div class="pz-st-gw"><div class="pz-st-gn">' + E(p + 'game', g.game) + '</div>' +
          '<div class="pz-st-gd"><span>' + E(p + 'hours', g.hours) + ' hrs on record</span><span>last played on ' + E(p + 'last', g.last) + '</span></div></div>' +
          (g.ach ? achBar(g.ach, p + 'ach') : '') + '</div>';
      }).join('');
      var sideBadges = (s.badges || []).slice(0, 4).map(function (b, i) { return pic(b.icon, 'badges.' + i + '.icon', 'pz-st-sbi'); }).join('');
      return '<div class="shot pz-st">' + (s.bgimg ? '<img class="pz-st-bg" src="' + s.bgimg + '"' + DI('bgimg') + ' alt="">' : '<div class="pz-st-bg"' + DI('bgimg') + '></div>') +
        '<div class="pz-st-wrap"><div class="pz-st-head">' +
        '<div class="pz-st-frame" style="background:' + frame + '">' + (s.avatar ? '<img class="pz-st-ava" src="' + s.avatar + '"' + DI('avatar') + ' alt="">' : '<div class="pz-st-ava pz-st-noava"' + DI('avatar') + '></div>') + '</div>' +
        '<div class="pz-st-id"><div class="pz-st-name">' + E('name', s.name) + '</div>' +
        '<div class="pz-st-real">' + (s.realName ? '<span>' + E('realName', s.realName) + '</span>' : '') +
        (s.flag ? '<span class="pz-st-flag">' + E('flag', s.flag) + '</span>' : '') + (s.country ? '<span>' + E('country', s.country) + '</span>' : '') + '</div>' +
        '<div class="pz-st-sum">' + EB('summary', s.summary) + '</div></div>' +
        '<div class="pz-st-right"><div class="pz-st-lv">Level <span class="pz-st-lvc' + (lv >= 100 ? ' big' : '') + '" style="border-color:' + lvc + '">' + E('level', s.level) + '</span></div>' +
        (s.badgeName || s.badgeIcon ? '<div class="pz-st-feat">' + pic(s.badgeIcon, 'badgeIcon', 'pz-st-fi') + '<div><div class="pz-st-fn">' + E('badgeName', s.badgeName) + '</div>' +
          '<div class="pz-st-fx">' + E('badgeXp', s.badgeXp) + ' XP</div></div></div>' : '') +
        '<div class="pz-st-btns"><span class="pz-st-btn">Add Friend</span><span class="pz-st-btn">More <i>&#9662;</i></span></div></div></div>' +
        '<div class="pz-st-body"><div class="pz-st-main">' +
        (badges ? '<div class="pz-st-sc"><div class="pz-st-sh">Badge Collection</div><div class="pz-st-sbody pz-st-bdgs">' + badges + '</div></div>' : '') +
        (s.favName || s.favPic ? '<div class="pz-st-sc"><div class="pz-st-sh">Favorite Game</div><div class="pz-st-sbody pz-st-fav">' + pic(s.favPic, 'favPic', 'pz-st-fcap') +
          '<div class="pz-st-fw"><div class="pz-st-fgn">' + E('favName', s.favName) + '</div>' +
          '<div class="pz-st-fst"><div><b>' + E('favHours', s.favHours) + '</b><span>Hours played</span></div>' +
          (s.favAch ? '<div><b>' + E('favAch', s.favAch) + '</b><span>Achievements</span></div>' : '') + '</div></div></div></div>' : '') +
        '<div class="pz-st-sc"><div class="pz-st-sh">Recent Activity<span>' + E('hours2wk', s.hours2wk) + ' hours past 2 weeks</span></div><div class="pz-st-recent">' + recent + '</div></div>' +
        '</div><div class="pz-st-side"><div class="pz-st-status st-' + s.status + '" style="color:' + stt[1] + '"><div class="pz-st-sl">' + stt[0] + '</div>' +
        (s.status === 'ingame' ? '<div class="pz-st-sg">' + E('game', s.game) + '</div>' : '') + '</div>' +
        '<div class="pz-st-link"><span>Badges</span><b>' + E('badgeCount', s.badgeCount) + '</b></div>' + (sideBadges ? '<div class="pz-st-sbs">' + sideBadges + '</div>' : '') +
        '<div class="pz-st-link"><span>Games</span><b>' + E('gameCount', s.gameCount) + '</b></div>' +
        '<div class="pz-st-link dim"><span>Inventory</span></div><div class="pz-st-link dim"><span>Screenshots</span></div>' +
        '<div class="pz-st-link"><span>Friends</span><b>' + E('friendCount', s.friendCount) + '</b></div>' +
        '</div></div></div></div>';
    }
  });

  /* ============================== find my / snap map ============================== */

  var MAP_PAL = {
    apple: { land: '#f3f1ec', park: '#c6e5b1', water: '#9dcdf4', road: '#ffffff', edge: '#dedad1', major: '#fbe28f', majorEdge: '#e6c463', block: '#ebe8e1' },
    snap: { land: '#eceff0', park: '#b4e2a0', water: '#7ccbf6', road: '#ffffff', edge: '#d5dbe0', major: '#ffffff', majorEdge: '#c3ccd4', block: '#e3e7e9' }
  };
  function mapSVG(seed, W, H, pal) {
    var r = rng(seed * 9973 + 11), cx = W / 2, cy = H / 2, ext = Math.max(W, H) * 1.7;
    var ang = (r() * 34 - 17).toFixed(1);
    var casing = '', fills = '', majC = '', majF = '', parks = '', blocks = '';
    function road(x1, y1, x2, y2, major) {
      var ln = 'x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"';
      if (major) { majC += '<line ' + ln + '/>'; majF += '<line ' + ln + '/>'; } else { casing += '<line ' + ln + '/>'; fills += '<line ' + ln + '/>'; }
    }
    var xs = [], ys = [], x = cx - ext / 2, y = cy - ext / 2;
    while (x < cx + ext / 2) { xs.push(x); x += 40 + r() * 34; }
    while (y < cy + ext / 2) { ys.push(y); y += 34 + r() * 30; }
    xs.forEach(function (v, i) { road(v, cy - ext / 2, v, cy + ext / 2, i % 4 === 2 && r() < 0.8); });
    ys.forEach(function (v, i) { road(cx - ext / 2, v, cx + ext / 2, v, i % 5 === 3 && r() < 0.8); });
    // faint buildings inside blocks
    for (var bi = 0; bi < xs.length - 1; bi++) {
      for (var bj = 0; bj < ys.length - 1; bj++) {
        if (r() < 0.55) continue;
        var bw = xs[bi + 1] - xs[bi], bh = ys[bj + 1] - ys[bj];
        blocks += '<rect x="' + (xs[bi] + 7).toFixed(1) + '" y="' + (ys[bj] + 7).toFixed(1) + '" width="' + Math.max(4, bw - 14).toFixed(1) + '" height="' + Math.max(4, bh - 14).toFixed(1) + '" rx="2"/>';
      }
    }
    // parks snap to blocks
    var np = 2 + Math.floor(r() * 3);
    for (var k = 0; k < np; k++) {
      var i0 = 2 + Math.floor(r() * (xs.length - 6)), j0 = 2 + Math.floor(r() * (ys.length - 6));
      var i1 = i0 + 1 + Math.floor(r() * 2), j1 = j0 + 1 + Math.floor(r() * 3);
      parks += '<rect x="' + (xs[i0] + 4).toFixed(1) + '" y="' + (ys[j0] + 4).toFixed(1) + '" width="' + (xs[i1] - xs[i0] - 8).toFixed(1) + '" height="' + (ys[j1] - ys[j0] - 8).toFixed(1) + '" rx="5"/>';
    }
    var diag = r() < 0.7 ? (function () {
      var a1 = r() * W, a2 = r() * W;
      return '<line x1="' + a1.toFixed(1) + '" y1="-20" x2="' + a2.toFixed(1) + '" y2="' + (H + 20) + '"/>';
    })() : '';
    var water;
    if (r() < 0.5) {
      var y0 = H * (0.15 + r() * 0.7), y1 = H * (0.15 + r() * 0.7);
      water = '<path d="M-40 ' + y0.toFixed(0) + ' C ' + (W * 0.3).toFixed(0) + ' ' + (y0 + (r() - 0.5) * 220).toFixed(0) + ', ' + (W * 0.7).toFixed(0) + ' ' + (y1 + (r() - 0.5) * 220).toFixed(0) + ', ' + (W + 40) + ' ' + y1.toFixed(0) +
        '" fill="none" stroke="' + pal.water + '" stroke-width="' + (46 + r() * 40).toFixed(0) + '"/>';
    } else {
      var side = r() < 0.5, d = W * (0.18 + r() * 0.12), pts = [], steps = 8;
      for (var q = 0; q <= steps; q++) pts.push(((side ? d : W - d) + (r() - 0.5) * 50).toFixed(0) + ' ' + (H * q / steps).toFixed(0));
      water = '<path d="M' + (side ? -10 : W + 10) + ' -10 L' + pts.join(' L') + ' L' + (side ? -10 : W + 10) + ' ' + (H + 10) + 'z" fill="' + pal.water + '"/>';
    }
    var rot = 'transform="rotate(' + ang + ' ' + cx + ' ' + cy + ')"';
    return '<svg class="pz-map" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="' + pal.land + '"/>' +
      '<g ' + rot + '><g fill="' + pal.block + '">' + blocks + '</g>' +
      '<g stroke="' + pal.edge + '" stroke-width="8.5">' + casing + '</g><g stroke="' + pal.road + '" stroke-width="6">' + fills + '</g>' +
      '<g fill="' + pal.park + '">' + parks + '</g></g>' + water +
      '<g ' + rot + '><g stroke="' + pal.majorEdge + '" stroke-width="13">' + majC + '</g><g stroke="' + pal.major + '" stroke-width="10">' + majF + '</g></g>' +
      (diag ? '<g stroke="' + pal.majorEdge + '" stroke-width="15">' + diag + '</g><g stroke="' + pal.major + '" stroke-width="12">' + diag + '</g>' : '') +
      '</svg>';
  }
  var FM_SPOTS = [[30, 30], [68, 42], [46, 60], [22, 70], [78, 20], [58, 22], [36, 46], [80, 66]];
  function fmTab(icon, label, on) { return '<span class="pz-fm-tab' + (on ? ' on' : '') + '">' + icon + '<i>' + label + '</i></span>'; }
  var FM_IC = {
    people: fill('M8.5 11a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zm7.5.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1.8 19.5c.4-3.9 3.2-6.4 6.7-6.4s6.3 2.5 6.7 6.4zm14.2 0a8.3 8.3 0 0 0-2.3-5.4 5.6 5.6 0 0 1 2.3-.5c3 0 5.3 2.2 6 5.9z'),
    devices: fill('M3 5.5A1.5 1.5 0 0 1 4.5 4h13A1.5 1.5 0 0 1 19 5.5V7h-2V6H5v9h8v2H1.5v-.6a1 1 0 0 1 1-1H3zM15.5 8.5h6a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1zm.8 1.8v7.4h4.4v-7.4z'),
    items: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.6"/><circle cx="8" cy="12" r="1.2"/><circle cx="16" cy="12" r="1.2"/><circle cx="12" cy="8" r="1.2"/><circle cx="12" cy="16" r="1.2"/></svg>',
    me: fill('M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 3.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8zm0 13.4a7.4 7.4 0 0 1-5.6-2.6c.9-1.8 3-2.9 5.6-2.9s4.7 1.1 5.6 2.9a7.4 7.4 0 0 1-5.6 2.6z')
  };
  var SN_IC = {
    map: fill('M12 2.5a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2z'),
    chat: stroke('M12 4c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-.9 0-1.8-.1-2.6-.3L5 20l1-3.6C4.5 15 3.5 13.1 3.5 11 3.5 7.1 7.3 4 12 4z', 2),
    camera: stroke('M3.5 8.5A1.5 1.5 0 0 1 5 7h2.6l1.6-2.2h5.6L16.4 7H19a1.5 1.5 0 0 1 1.5 1.5v9.5A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18zM12 16.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8z', 2),
    stories: stroke('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.5-3.6 3-5.8 6.5-5.8s6 2.2 6.5 5.8M16 4.6a3.5 3.5 0 0 1 0 6.3M18.5 14.6c1.8.8 2.8 2.7 3 5.4', 2),
    spot: stroke('M5 4.5h14A1.5 1.5 0 0 1 20.5 6v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5zM10 9v6l5-3z', 2),
    places: fill('M12 3a6.5 6.5 0 0 0-6.5 6.5c0 4.6 6.5 11.5 6.5 11.5s6.5-6.9 6.5-11.5A6.5 6.5 0 0 0 12 3zm0 4 .9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.5 2.1-.3z'),
    friends: fill('M9 11a3.6 3.6 0 1 0 0-7.2A3.6 3.6 0 0 0 9 11zm7 .4a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.4 19.6c.4-3.8 3.1-6.3 6.6-6.3s6.2 2.5 6.6 6.3zm14 0a8.3 8.3 0 0 0-2.2-5.3c.6-.2 1.2-.3 1.8-.3 3 0 5.3 2.1 5.8 5.6z')
  };

  TOOLS.push({
    id: 'findmy',
    label: 'find my',
    group: 'phone',
    defaults: { mode: 'apple', seed: 7, clock: '9:41', battery: 80, showPct: false, me: true, myPic: '', area: '', friends: [] },
    fields: [
      U.STATUS_FIELDS,
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'app', options: [['apple', 'find my'], ['snap', 'snap map']] },
        { key: 'me', type: 'toggle', label: 'me on map' }
      ] },
      { key: 'seed', type: 'range', label: 'map', min: 1, max: 200, step: 1 },
      { type: 'row', fields: [
        { key: 'myPic', type: 'image', label: 'my bitmoji', max: 400 },
        { key: 'area', type: 'text', label: 'area name (snap)' }
      ] },
      { type: 'head', label: 'friends' },
      { key: 'friends', type: 'list',
        adds: [{ label: '+ friend', item: function (s) {
          var p = FM_SPOTS[(s.friends || []).length % FM_SPOTS.length];
          return { pic: '', name: '', place: '', time: '', dist: '', battery: '', x: p[0], y: p[1] };
        } }],
        item: [
          { type: 'row', fields: [
            { key: 'pic', type: 'image', label: 'pic / bitmoji', max: 400 },
            { key: 'name', type: 'text', label: 'name' }
          ] },
          { type: 'row', fields: [
            { key: 'place', type: 'text', label: 'place', placeholder: 'Home' },
            { key: 'time', type: 'text', label: 'time', placeholder: 'Now' }
          ] },
          { type: 'row', fields: [
            { key: 'dist', type: 'text', label: 'distance', placeholder: '2 mi' },
            { key: 'battery', type: 'text', label: 'battery %' }
          ] },
          { type: 'row', fields: [
            { key: 'x', type: 'range', label: 'left / right', min: 4, max: 96, step: 1 },
            { key: 'y', type: 'range', label: 'up / down', min: 4, max: 96, step: 1 }
          ] }
        ] }
    ],
    render: function (s) {
      var fr = s.friends || [], snap = s.mode === 'snap';
      var W = 390, H = 844, mapH = snap ? H : 520;
      var map = mapSVG(Math.round(num(s.seed, 7)), W, mapH, MAP_PAL[snap ? 'snap' : 'apple']);
      var pins = fr.map(function (f, i) {
        var p = 'friends.' + i + '.', x = num(f.x, 50) / 100 * W, y = num(f.y, 50) / 100 * (snap ? H - 190 : mapH - 60) + (snap ? 90 : 40);
        if (snap) {
          var fig = f.pic ? '<img class="pz-sn-bit" src="' + f.pic + '"' + DI(p + 'pic') + ' alt="">' : U.avatar('', f.name, 'pz-sn-bit pz-sn-nobit', undefined, p + 'pic');
          return '<div class="pz-sn-f" style="left:' + x + 'px;top:' + y + 'px">' + fig + '<div class="pz-sn-pill"><b>' + E(p + 'name', f.name) + '</b>' +
            ((f.place || f.time) ? '<span>' + (f.place ? E(p + 'place', f.place) : '') + (f.place && f.time ? ' · ' : '') + (f.time ? E(p + 'time', f.time) : '') + '</span>' : '') +
            (f.battery ? '<span class="pz-sn-bat">' + batt(f.battery) + E(p + 'battery', f.battery) + (txt(f.battery) ? '%' : '') + '</span>' : '') + '</div></div>';
        }
        return '<div class="pz-fm-pin" style="left:' + x + 'px;top:' + y + 'px">' + U.avatar(f.pic, f.name, 'pz-fm-pa', undefined, p + 'pic') + '<i></i></div>';
      }).join('');
      if (snap) {
        var meFig = s.me ? '<div class="pz-sn-f pz-sn-me" style="left:' + (W / 2) + 'px;top:' + (H / 2 + 40) + 'px">' +
          (s.myPic ? '<img class="pz-sn-bit" src="' + s.myPic + '"' + DI('myPic') + ' alt="">' : '<span class="pz-sn-bit pz-sn-medot"' + DI('myPic') + '></span>') + '</div>' : '';
        return '<div class="shot pz-sn">' + map + '<div class="pz-sn-ui">' + U.statusBar(s) +
          '<div class="pz-sn-top"><span class="pz-sn-me-ic">' + (s.myPic ? '<img src="' + s.myPic + '"' + DI('myPic') + ' alt="">' : '<span' + DI('myPic') + '></span>') + '</span>' +
          '<span class="pz-sn-circ">' + I.search + '</span><span class="pz-sn-area">' + E('area', s.area) + '</span><span class="pz-sn-circ">' + I.gear + '</span></div>' +
          '<div class="pz-sn-layer">' + pins + meFig + '</div>' +
          '<div class="pz-sn-btns"><span class="pz-sn-b"><span class="pz-sn-bi me">' + (s.myPic ? '<img src="' + s.myPic + '" alt="">' : '') + '</span>My Bitmoji</span>' +
          '<span class="pz-sn-b"><span class="pz-sn-bi">' + SN_IC.places + '</span>Places</span><span class="pz-sn-b"><span class="pz-sn-bi">' + SN_IC.friends + '</span>Friends</span></div>' +
          '<div class="pz-sn-nav"><span class="on">' + SN_IC.map + '</span><span>' + SN_IC.chat + '</span><span>' + SN_IC.camera + '</span><span>' + SN_IC.stories + '</span><span>' + SN_IC.spot + '</span></div></div></div>';
      }
      var rows = fr.map(function (f, i) {
        var p = 'friends.' + i + '.';
        return '<div class="pz-fm-row">' + U.avatar(f.pic, f.name, 'pz-fm-ra', undefined, p + 'pic') +
          '<div class="pz-fm-rw"><div class="pz-fm-rn">' + E(p + 'name', f.name) + '</div><div class="pz-fm-rp">' + E(p + 'place', f.place) +
          (f.battery ? '<span class="pz-fm-bat">' + batt(f.battery) + E(p + 'battery', f.battery) + (txt(f.battery) ? '%' : '') + '</span>' : '') + '</div></div>' +
          '<div class="pz-fm-rr"><span>' + E(p + 'dist', f.dist) + '</span><span>' + E(p + 'time', f.time) + '</span></div></div>';
      }).join('');
      return '<div class="shot pz-fm"><div class="pz-fm-map">' + map + '<div class="pz-fm-layer">' + pins +
        (s.me ? '<span class="pz-fm-me" style="left:' + (W * 0.55) + 'px;top:' + (mapH * 0.52) + 'px"></span>' : '') + '</div>' +
        '<div class="pz-fm-ctl"><span>' + I.map + '</span><span class="loc">' + I.loc + '</span></div></div>' +
        '<div class="pz-fm-sb">' + U.statusBar(s) + '</div>' +
        '<div class="pz-fm-sheet"><i class="pz-fm-grab"></i><div class="pz-fm-title">People<span>' + I.plus + '</span></div>' +
        '<div class="pz-fm-list">' + rows + '</div></div>' +
        '<div class="pz-fm-tabs">' + fmTab(FM_IC.people, 'People', true) + fmTab(FM_IC.devices, 'Devices') + fmTab(FM_IC.items, 'Items') + fmTab(FM_IC.me, 'Me') + '</div></div>';
    }
  });

  /* ============================== imessage group chat ============================== */

  var TAPBACK = {
    none: '', heart: fill('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z'),
    like: fill('M7 21H4.5A1.5 1.5 0 0 1 3 19.5v-8A1.5 1.5 0 0 1 4.5 10H7zm2 0V10l3.8-7a2.3 2.3 0 0 1 2.7 2.5L15 9h4.3a2 2 0 0 1 2 2.3l-1.2 7.8a2.3 2.3 0 0 1-2.3 1.9z'),
    dislike: '<svg viewBox="0 0 24 24" style="transform:scaleY(-1)"><path d="M7 21H4.5A1.5 1.5 0 0 1 3 19.5v-8A1.5 1.5 0 0 1 4.5 10H7zm2 0V10l3.8-7a2.3 2.3 0 0 1 2.7 2.5L15 9h4.3a2 2 0 0 1 2 2.3l-1.2 7.8a2.3 2.3 0 0 1-2.3 1.9z"/></svg>',
    haha: '<b class="pz-gc-ha">HA<br>HA</b>', bang: '<b class="pz-gc-bang">!!</b>', q: '<b class="pz-gc-q">?</b>'
  };
  var SYS = { named: 'named the conversation', left: 'left the conversation.', photo: 'changed the group photo.', added: 'added', removed: 'removed', custom: '' };
  TOOLS.push({
    id: 'groupchat',
    label: 'group chat',
    group: 'phone',
    defaults: { clock: '9:41', battery: 80, showPct: false, theme: 'light', bubble: 'blue', group: '', gpic: '', unread: '', typing: '', receipt: '', members: [], msgs: [] },
    fields: [
      U.STATUS_FIELDS,
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'bubble', type: 'select', label: 'my bubbles', options: [['blue', 'blue'], ['green', 'green']] }
      ] },
      { type: 'row', fields: [
        { key: 'gpic', type: 'image', label: 'group photo', max: 300 },
        { key: 'group', type: 'text', label: 'group name' },
        { key: 'unread', type: 'text', label: 'unread' }
      ] },
      { type: 'head', label: 'people' },
      { key: 'members', type: 'list', adds: [{ label: '+ person', item: function () { return { id: sid(), name: '', pic: '' }; } }],
        item: [{ type: 'row', fields: [{ key: 'pic', type: 'image', label: 'pic', max: 300 }, { key: 'name', type: 'text', label: 'name' }] }] },
      { type: 'head', label: 'chat' },
      { key: 'msgs', type: 'list', meKey: 'from',
        adds: [
          { label: '+ message', item: function (s) {
            var m = s.msgs || [], last = m[m.length - 1];
            return { kind: 'msg', from: last && last.kind === 'msg' ? last.from : ((s.members || [])[0] || {}).id || 'me', text: '', image: '', stamp: '', tap: 'none', tapMine: false, sys: 'named' };
          } },
          { label: '+ me', item: item({ kind: 'msg', from: 'me', text: '', image: '', stamp: '', tap: 'none', tapMine: false, sys: 'named' }) },
          { label: '+ group update', item: function (s) {
            return { kind: 'sys', from: ((s.members || [])[0] || {}).id || 'me', text: '', image: '', stamp: '', tap: 'none', tapMine: false, sys: 'named' };
          } }
        ],
        item: [
          { type: 'row', fields: [
            { key: 'kind', type: 'select', label: 'type', options: [['msg', 'message'], ['sys', 'group update']] },
            { key: 'from', type: 'select', label: 'who', options: function (s) { return [['me', 'me']].concat((s.members || []).map(function (p) { return [p.id, txt(p.name) || '(no name)']; })); } }
          ] },
          { key: 'sys', type: 'select', label: 'update', options: [['named', 'named the chat'], ['photo', 'changed group photo'], ['added', 'added someone'], ['removed', 'removed someone'], ['left', 'left'], ['custom', 'own words']] },
          { key: 'text', type: 'textarea', label: 'text / name', rows: 2 },
          { key: 'image', type: 'image', label: 'picture', max: 900 },
          { type: 'row', fields: [
            { key: 'tap', type: 'select', label: 'tapback', options: [['none', 'none'], ['heart', 'heart'], ['like', 'thumbs up'], ['dislike', 'thumbs down'], ['haha', 'haha'], ['bang', '!!'], ['q', '?']] },
            { key: 'tapMine', type: 'toggle', label: 'by me' }
          ] },
          { key: 'stamp', type: 'text', label: 'time above', placeholder: 'Today 9:41 PM' }
        ] },
      { type: 'row', fields: [
        { key: 'receipt', type: 'text', label: 'under last sent', placeholder: 'Delivered' },
        { key: 'typing', type: 'select', label: 'typing', options: function (s) { return [['', 'nobody']].concat((s.members || []).map(function (p) { return [p.id, txt(p.name) || '(no name)']; })); } }
      ] }
    ],
    render: function (s) {
      var people = {}, members = s.members || [], list = s.msgs || [];
      members.forEach(function (p, i) { people[p.id] = { p: p, i: i }; });
      function nm(id) { if (id === 'me') return 'You'; var r = people[id]; return r ? esc(txt(r.p.name)) : 'Someone'; }
      function nmE(id) { if (id === 'me') return 'You'; var r = people[id]; return r ? E('members.' + r.i + '.name', r.p.name) : 'Someone'; }
      function ava(id, cls) { var r = people[id]; return r ? U.avatar(r.p.pic, r.p.name, cls, '#a5abb8', 'members.' + r.i + '.pic') : '<div class="' + cls + ' pz-gc-gray"></div>'; }
      var lastMe = -1;
      list.forEach(function (m, i) { if (m.kind !== 'sys' && m.from === 'me') lastMe = i; });
      var out = '';
      list.forEach(function (m, i) {
        var pre = 'msgs.' + i + '.';
        if (m.stamp) out += '<div class="pz-gc-stamp">' + EW(pre + 'stamp', U.esc(bare(m.stamp)).replace(/^(\S+)(\s)/, '<b>$1</b>$2')) + '</div>';
        if (m.kind === 'sys') {
          var line;
          if (m.sys === 'custom') line = EB(pre + 'text', m.text);
          else if (m.sys === 'named') line = nmE(m.from) + ' named the conversation “' + E(pre + 'text', m.text) + '”.';
          else if (m.sys === 'added' || m.sys === 'removed') line = nmE(m.from) + ' ' + SYS[m.sys] + ' ' + E(pre + 'text', m.text) + (m.sys === 'added' ? ' to the conversation.' : ' from the conversation.');
          else line = nmE(m.from) + ' ' + SYS[m.sys];
          out += '<div class="pz-gc-sys">' + line + '</div>';
          if (m.sys === 'photo' && m.image) out += '<div class="pz-gc-sysimg"><img src="' + m.image + '"' + DI(pre + 'image') + ' alt=""></div>';
          return;
        }
        var me = m.from === 'me', prev = list[i - 1], next = list[i + 1];
        var first = !prev || prev.kind === 'sys' || prev.from !== m.from || !!txt(m.stamp);
        var last = !next || next.kind === 'sys' || next.from !== m.from || !!txt(next.stamp);
        if (!me && i === list.length - 1 && s.typing === m.from) last = false;
        var gap = first && prev && !txt(m.stamp) && prev.kind !== 'sys' ? ' gap' : '';
        var tap = TAPBACK[m.tap] ? '<span class="pz-gc-tap' + (m.tapMine ? ' mine' : '') + '">' + TAPBACK[m.tap] + '</span>' : '';
        var side = me ? 'pz-me' : 'pz-them';
        if (!me && first) out += '<div class="pz-gc-from' + (gap ? ' gap' : '') + '">' + nmE(m.from) + '</div>';
        var lead = me ? '' : '<span class="pz-gc-lead">' + (last ? ava(m.from, 'pz-gc-ava') : '') + '</span>';
        var body = '';
        if (m.image) body += '<div class="pz-gc-bw">' + (m.text ? '' : tap) + '<img class="pz-gc-pic" src="' + m.image + '"' + DI(pre + 'image') + ' alt=""></div>';
        if (m.text || !m.image) {
          var big = U.isEmojiOnly(m.text);
          body += '<div class="pz-gc-bw' + (tap ? ' tapped' : '') + '">' + tap + '<div class="pz-gc-b ' + (big ? 'pz-emoji' : 'pz-bub') + (last && !big ? ' pz-tail' : '') + '">' + EB(pre + 'text', m.text) + '</div></div>';
        }
        out += '<div class="pz-gc-row ' + side + (!me && first ? '' : gap) + (tap ? ' hastap' : '') + '">' + lead + '<div class="pz-gc-col">' + body + '</div></div>';
        if (i === lastMe && s.receipt && !(next && next.kind !== 'sys' && next.from === 'me')) out += '<div class="pz-gc-receipt">' + E('receipt', s.receipt).replace(/^(Read|Delivered)/, '<b>$1</b>') + '</div>';
      });
      if (s.typing && people[s.typing]) {
        var lastM = list[list.length - 1], cont = lastM && lastM.kind !== 'sys' && lastM.from === s.typing;
        if (!cont) out += '<div class="pz-gc-from gap">' + nm(s.typing) + '</div>';
        out += '<div class="pz-gc-row pz-them"><span class="pz-gc-lead">' + ava(s.typing, 'pz-gc-ava') + '</span><div class="pz-gc-col"><div class="pz-gc-bw"><div class="pz-gc-b pz-bub pz-tail pz-gc-typing"><i></i><i></i><i></i></div></div></div></div>';
      }
      var head;
      if (s.gpic) head = '<img class="pz-gc-gpic" src="' + s.gpic + '"' + DI('gpic') + ' alt="">';
      else {
        var shown = members.slice(0, 3);
        head = '<div class="pz-gc-stack n' + Math.max(1, shown.length) + '"' + DI('gpic') + '>' + (shown.length ? shown.map(function (p, i) {
          return U.avatar(p.pic, p.name, 'pz-gc-sa a' + i, '#a5abb8');
        }).join('') : '<div class="pz-gc-sa a0 pz-gc-gray"></div>') + '</div>';
      }
      var title = txt(s.group) ? E('group', s.group) : (members.length ? '<span data-e="group">' + (members.length + 1) + ' People</span>' : E('group', s.group));
      return '<div class="shot pz-gc t-' + s.theme + ' pz-b-' + s.bubble + '">' + U.statusBar(s) +
        '<div class="pz-gc-head"><div class="pz-gc-back">' + I.chev + (s.unread ? '<span class="pz-gc-unread">' + E('unread', s.unread) + '</span>' : '') + '</div>' +
        '<div class="pz-gc-contact">' + head + '<div class="pz-gc-name">' + title + ' <span class="pz-gc-chev">›</span></div></div>' +
        '<div class="pz-gc-video">' + I.video + '</div></div>' +
        '<div class="pz-gc-body">' + out + '</div>' +
        '<div class="pz-gc-input"><span class="pz-gc-plus">' + I.plus + '</span><div class="pz-gc-field">' + (s.bubble === 'green' ? 'Text Message' : 'iMessage') + '<span class="pz-gc-mic">' + I.mic + '</span></div></div></div>';
    }
  });

  /* ============================== lock + home screen widgets ============================== */

  var CLOCK_FONTS = [['bold', 'classic'], ['thin', 'thin'], ['rounded', 'rounded'], ['serif', 'serif'], ['stencil', 'stencil'], ['rails', 'rails'], ['script', 'script']];
  var WG_APP = { photo: 'Photos', music: 'Music', weather: 'Weather', note: 'Notes', calendar: 'Calendar', battery: 'Batteries' };
  function ring(pct, size, sw, col, track) {
    var r = (size - sw) / 2, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, pct));
    return '<svg class="pz-ring" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + track + '" stroke-width="' + sw + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-dasharray="' + (c * p / 100).toFixed(2) + ' ' + c.toFixed(2) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>';
  }
  function gauge(frac, size) {
    // open-bottom arc like the lock screen temperature gauge
    var r = size / 2 - 4, cx = size / 2, cy = size / 2, a0 = 135, a1 = 405, sweep = 270, f = Math.max(0, Math.min(1, frac));
    function pt(a) { var rad = a * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; }
    var p0 = pt(a0), p1 = pt(a1), pd = pt(a0 + sweep * f);
    return '<svg class="pz-ring" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '"><path d="M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 1 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) +
      '" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="4.5" stroke-linecap="round"/><circle cx="' + pd[0].toFixed(1) + '" cy="' + pd[1].toFixed(1) + '" r="3.6" fill="#fff" stroke="rgba(0,0,0,.35)" stroke-width="1.4"/></svg>';
  }
  function lockWidget(w, i) {
    var p = 'lw.' + i + '.', k = w.kind;
    if (k === 'battery') {
      return '<div class="pz-lw circ">' + ring(num(w.value, 0), 62, 5, '#fff', 'rgba(255,255,255,.3)') + '<div class="pz-lw-in"><span class="pz-lw-ph">' + I.phone + '</span><b>' + E(p + 'value', w.value) + '</b></div></div>';
    }
    if (k === 'weather') {
      var t = num(w.value, 0), lo = num(w.lo, t - 10), hi = num(w.hi, t + 10);
      return '<div class="pz-lw circ">' + gauge(hi > lo ? (t - lo) / (hi - lo) : 0.5, 64) + '<div class="pz-lw-in"><b class="big">' + E(p + 'value', w.value) + '</b></div>' +
        '<div class="pz-lw-lohi"><span>' + E(p + 'lo', w.lo) + '</span><span>' + E(p + 'hi', w.hi) + '</span></div></div>';
    }
    if (k === 'date') {
      return '<div class="pz-lw circ pz-lw-glass"><div class="pz-lw-in col"><span class="pz-lw-wd">' + E(p + 'label', w.label) + '</span><b class="big">' + E(p + 'value', w.value) + '</b></div></div>';
    }
    if (k === 'event') {
      return '<div class="pz-lw rect"><div class="pz-lw-ev"><b>' + I.cal + E(p + 'label', w.label) + '</b><span>' + E(p + 'value', w.value) + '</span></div></div>';
    }
    return '<div class="pz-lw rect"><div class="pz-lw-tx"><b>' + E(p + 'label', w.label) + '</b><span>' + E(p + 'value', w.value) + '</span></div></div>';
  }
  function homeWidget(w, i) {
    var p = 'grid.' + i + '.', k = w.kind, inner;
    if (k === 'photo') inner = pic(w.image, p + 'image', 'pz-hw-photo');
    else if (k === 'music') {
      inner = (w.image ? '<img class="pz-hw-mbg" src="' + w.image + '" alt="">' : '') + '<div class="pz-hw-mus">' + pic(w.image, p + 'image', 'pz-hw-art') +
        '<span class="pz-hw-note">' + I.music + '</span><div class="pz-hw-mt"><span class="pz-hw-rp">' + (w.size === 'small' ? '' : 'RECENTLY PLAYED') + '</span><b>' + E(p + 'title', w.title) + '</b><span>' + E(p + 'text', w.text) + '</span></div>' +
        (w.size === 'small' ? '' : '<span class="pz-hw-play">' + I.play + '</span>') + '</div>';
    } else if (k === 'weather') {
      inner = '<div class="pz-hw-wx"><div class="pz-hw-wl"><div class="pz-hw-city">' + E(p + 'title', w.title) + '<span>' + I.loc + '</span></div><div class="pz-hw-temp">' + E(p + 'value', w.value) + '</div></div>' +
        '<div class="pz-hw-wr"><span class="pz-hw-wic">' + wx(w.icon) + '</span><div>' + E(p + 'text', w.text) + '</div><div>' + E(p + 'sub', w.sub) + '</div></div></div>';
    } else if (k === 'note') {
      inner = '<div class="pz-hw-nt"><div class="pz-hw-nh">' + I.note + 'Notes</div><b>' + E(p + 'title', w.title) + '</b><div class="pz-hw-nb">' + EB(p + 'text', w.text) + '</div><span>' + E(p + 'sub', w.sub) + '</span></div>';
    } else if (k === 'calendar') {
      inner = '<div class="pz-hw-cal"><div class="pz-hw-cd"><span>' + E(p + 'sub', w.sub) + '</span><b>' + E(p + 'value', w.value) + '</b></div><div class="pz-hw-ce"><i></i><div><b>' + E(p + 'title', w.title) + '</b><span>' + E(p + 'text', w.text) + '</span></div></div></div>';
    } else {
      inner = '<div class="pz-hw-bat">' + ring(num(w.value, 0), 64, 6, '#30d158', 'rgba(255,255,255,.18)') + '<span class="pz-hw-bph">' + I.phone + '</span><b>' + E(p + 'value', w.value) + '%</b></div>';
    }
    return '<div class="pz-hw k-' + k + ' sz-' + w.size + '"><div class="pz-hw-box">' + inner + '</div><span class="pz-hl">' + (WG_APP[k] || '') + '</span></div>';
  }
  function appIcon(a, path, dock) {
    var ic = a.icon ? '<img class="pz-ai" src="' + a.icon + '"' + DI(path + 'icon') + ' alt="">' : U.avatar('', a.name, 'pz-ai', undefined, path + 'icon');
    return '<div class="pz-app">' + '<div class="pz-ai-w">' + ic + (txt(a.badge) ? '<span class="pz-ai-badge">' + E(path + 'badge', a.badge) + '</span>' : '') + '</div>' +
      (dock ? '' : '<span class="pz-hl">' + E(path + 'name', a.name) + '</span>') + '</div>';
  }
  TOOLS.push({
    id: 'widgets',
    label: 'widgets',
    group: 'phone',
    defaults: { mode: 'lock', wall: '', clock: '9:41', battery: 80, showPct: false, date: '', font: 'bold', color: '#ffffff', dim: false, lw: [], grid: [], dock: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'screen', options: [['lock', 'lock screen'], ['home', 'home screen']], rebuild: true },
        { key: 'dim', type: 'toggle', label: 'darker' }
      ] },
      { key: 'wall', type: 'image', label: 'wallpaper', max: 1600 },
      U.STATUS_FIELDS,
      { type: 'head', label: 'lock screen' },
      { type: 'row', fields: [
        { key: 'font', type: 'select', label: 'clock font', options: CLOCK_FONTS },
        { key: 'color', type: 'color', label: 'clock color', swatches: function () { return ['#ffffff', '#ffb3d9', '#ff4fa3', '#c9a7ff', '#111111', '#ffe08a']; } }
      ] },
      { key: 'date', type: 'text', label: 'date line', placeholder: 'Friday, October 17' },
      { key: 'lw', type: 'list', adds: [{ label: '+ lock widget', item: item({ kind: 'battery', label: '', value: '', lo: '', hi: '' }) }],
        item: [
          { key: 'kind', type: 'select', label: 'widget', options: [['battery', 'battery (round)'], ['weather', 'weather (round)'], ['date', 'date (round)'], ['event', 'calendar (wide)'], ['text', 'text (wide)']] },
          { type: 'row', fields: [
            { key: 'label', type: 'text', label: 'title / day' },
            { key: 'value', type: 'text', label: 'value' }
          ] },
          { type: 'row', fields: [
            { key: 'lo', type: 'text', label: 'low' },
            { key: 'hi', type: 'text', label: 'high' }
          ] }
        ] },
      { type: 'head', label: 'home screen' },
      { key: 'grid', type: 'list',
        adds: [
          { label: '+ app', item: item({ kind: 'app', size: 'small', icon: '', image: '', name: '', badge: '', title: '', text: '', sub: '', value: '', icon2: 'sun' }) },
          { label: '+ widget', item: item({ kind: 'photo', size: 'small', icon: '', image: '', name: '', badge: '', title: '', text: '', sub: '', value: '', icon2: 'sun' }) }
        ],
        item: [
          { type: 'row', fields: [
            { key: 'kind', type: 'select', label: 'what', options: [['app', 'app icon'], ['photo', 'photo widget'], ['music', 'music widget'], ['weather', 'weather widget'], ['note', 'note widget'], ['calendar', 'calendar widget'], ['battery', 'battery widget']] },
            { key: 'size', type: 'select', label: 'widget size', options: [['small', 'small'], ['medium', 'wide'], ['large', 'big']] }
          ] },
          { type: 'row', fields: [
            { key: 'icon', type: 'image', label: 'app icon', max: 300 },
            { key: 'name', type: 'text', label: 'app name' },
            { key: 'badge', type: 'text', label: 'badge' }
          ] },
          { key: 'image', type: 'image', label: 'widget picture', max: 900 },
          { type: 'row', fields: [
            { key: 'title', type: 'text', label: 'title / song / city' },
            { key: 'value', type: 'text', label: 'temp / date / %' }
          ] },
          { type: 'row', fields: [
            { key: 'text', type: 'text', label: 'text / artist' },
            { key: 'sub', type: 'text', label: 'small line' },
            { key: 'icon2', type: 'select', label: 'weather', options: WX_OPTS }
          ] }
        ] },
      { key: 'dock', type: 'list', adds: [{ label: '+ dock app', item: item({ icon: '', name: '', badge: '' }) }],
        item: [{ type: 'row', fields: [{ key: 'icon', type: 'image', label: 'icon', max: 300 }, { key: 'name', type: 'text', label: 'app' }, { key: 'badge', type: 'text', label: 'badge' }] }] }
    ],
    render: function (s) {
      var wall = s.wall ? '<img class="pz-wg-wall" src="' + s.wall + '"' + DI('wall') + ' alt="">' : '<div class="pz-wg-wall pz-wg-def"' + DI('wall') + '></div>';
      var shade = s.dim ? '<div class="pz-wg-dim"></div>' : '';
      if (s.mode === 'home') {
        var cells = (s.grid || []).map(function (g, i) {
          return g.kind === 'app' ? appIcon(g, 'grid.' + i + '.') : homeWidget({ kind: g.kind, size: g.size, image: g.image, title: g.title, text: g.text, sub: g.sub, value: g.value, icon: g.icon2 }, i);
        }).join('');
        var dock = (s.dock || []).map(function (a, i) { return appIcon(a, 'dock.' + i + '.', true); }).join('');
        return '<div class="shot pz-wg home">' + wall + shade + '<div class="pz-wg-ui">' + U.statusBar(s) +
          '<div class="pz-wg-grid">' + cells + '</div><div class="pz-wg-grow"></div>' +
          '<div class="pz-wg-search">' + I.search + 'Search</div>' +
          '<div class="pz-wg-dock">' + dock + '</div><div class="pz-wg-homebar"></div></div></div>';
      }
      var widgets = (s.lw || []).map(lockWidget).join('');
      return '<div class="shot pz-wg lock">' + wall + shade + '<div class="pz-wg-ui">' + U.statusBar(s) +
        '<div class="pz-wg-lock">' + I.lock + '</div>' +
        '<div class="pz-wg-date" style="color:' + s.color + '">' + E('date', s.date) + '</div>' +
        '<div class="pz-wg-clock f-' + s.font + '" style="color:' + s.color + '">' + E('clock', s.clock) + '</div>' +
        (widgets ? '<div class="pz-wg-lws">' + widgets + '</div>' : '') +
        '<div class="pz-wg-grow"></div>' +
        '<div class="pz-wg-bottom"><span>' + I.flash + '</span><span>' + I.cam + '</span></div><div class="pz-wg-homebar"></div></div></div>';
    }
  });

  /* ============================== ios weather ============================== */

  var WX_BG = {
    sunny: ['#2a6fc4', '#5aa2e6', '#8cc4f0'],
    cloudy: ['#4f6a83', '#71889e', '#93a6b8'],
    rain: ['#323e4e', '#46566a', '#5c6c80'],
    night: ['#0b1029', '#1c2650', '#34406d'],
    storm: ['#1e222c', '#30364a', '#474d5f'],
    snow: ['#6f8199', '#97a7bb', '#c0cbd8']
  };
  var TEMP_STOPS = [[0, [74, 120, 240]], [32, [88, 186, 240]], [50, [104, 210, 170]], [62, [190, 222, 90]], [72, [248, 210, 70]], [82, [246, 160, 56]], [95, [238, 92, 56]]];
  function tColor(f) {
    var a = TEMP_STOPS[0], b = TEMP_STOPS[TEMP_STOPS.length - 1];
    if (f <= a[0]) return 'rgb(' + a[1].join(',') + ')';
    if (f >= b[0]) return 'rgb(' + b[1].join(',') + ')';
    for (var i = 0; i < TEMP_STOPS.length - 1; i++) {
      var p = TEMP_STOPS[i], q = TEMP_STOPS[i + 1];
      if (f >= p[0] && f <= q[0]) {
        var t = (f - p[0]) / (q[0] - p[0]);
        return 'rgb(' + p[1].map(function (v, k) { return Math.round(v + (q[1][k] - v) * t); }).join(',') + ')';
      }
    }
    return '#fff';
  }
  function wxSky(cond, seed) {
    var r = rng(seed), W = 390, H = 1100, out = '';
    if (cond === 'rain' || cond === 'storm') {
      for (var i = 0; i < 140; i++) {
        var x = r() * (W + 60), y = r() * H, l = 14 + r() * 26;
        out += '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (x - l * 0.18).toFixed(1) + '" y2="' + (y + l).toFixed(1) + '" stroke-opacity="' + (0.15 + r() * 0.35).toFixed(2) + '"/>';
      }
      return '<svg class="pz-wx-sky" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMin slice"><g stroke="#cfe3ff" stroke-width="1.3" stroke-linecap="round">' + out + '</g></svg>';
    }
    if (cond === 'snow') {
      for (var j = 0; j < 110; j++) out += '<circle cx="' + (r() * W).toFixed(1) + '" cy="' + (r() * H).toFixed(1) + '" r="' + (1 + r() * 2.6).toFixed(1) + '" fill-opacity="' + (0.35 + r() * 0.55).toFixed(2) + '"/>';
      return '<svg class="pz-wx-sky" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMin slice"><g fill="#fff">' + out + '</g></svg>';
    }
    if (cond === 'night') {
      for (var k = 0; k < 70; k++) out += '<circle cx="' + (r() * W).toFixed(1) + '" cy="' + (r() * H * 0.6).toFixed(1) + '" r="' + (0.5 + r() * 1.1).toFixed(1) + '" fill-opacity="' + (0.25 + r() * 0.6).toFixed(2) + '"/>';
      return '<svg class="pz-wx-sky" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMin slice"><g fill="#fff">' + out + '</g></svg>';
    }
    if (cond === 'cloudy') {
      return '<svg class="pz-wx-sky" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMin slice"><g fill="#fff" fill-opacity=".09"><ellipse cx="80" cy="120" rx="160" ry="60"/><ellipse cx="330" cy="70" rx="140" ry="55"/><ellipse cx="260" cy="210" rx="170" ry="50"/></g></svg>';
    }
    if (cond === 'sunny') {
      return '<svg class="pz-wx-sky" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMin slice"><defs><radialGradient id="pzsun"><stop offset="0" stop-color="#fff6c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient></defs><circle cx="330" cy="40" r="190" fill="url(#pzsun)"/></svg>';
    }
    return '';
  }
  TOOLS.push({
    id: 'weather',
    label: 'weather',
    group: 'phone',
    defaults: { clock: '9:41', battery: 80, showPct: false, sky: 'sunny', effects: true, myLoc: false, unit: 'f', city: '', temp: '', cond: '', hi: '', lo: '', desc: '', hours: [], days: [] },
    fields: [
      U.STATUS_FIELDS,
      { type: 'row', fields: [
        { key: 'sky', type: 'select', label: 'sky', options: [['sunny', 'sunny'], ['cloudy', 'cloudy'], ['rain', 'rain'], ['night', 'night'], ['storm', 'storm'], ['snow', 'snow']] },
        { key: 'unit', type: 'select', label: 'degrees', options: [['f', '°F'], ['c', '°C']] }
      ] },
      { type: 'row', fields: [
        { key: 'effects', type: 'toggle', label: 'rain / snow / stars' },
        { key: 'myLoc', type: 'toggle', label: 'my location' }
      ] },
      { key: 'city', type: 'text', label: 'city' },
      { type: 'row', fields: [
        { key: 'temp', type: 'text', label: 'temp' },
        { key: 'hi', type: 'text', label: 'high' },
        { key: 'lo', type: 'text', label: 'low' }
      ] },
      { key: 'cond', type: 'text', label: 'conditions', placeholder: 'Mostly Cloudy' },
      { key: 'desc', type: 'textarea', label: 'forecast line', rows: 2 },
      { type: 'head', label: 'hourly' },
      { key: 'hours', type: 'list', adds: [{ label: '+ hour', item: function (s) { var h = s.hours || []; return { time: h.length ? '' : 'Now', icon: h.length ? h[h.length - 1].icon : 'sun', temp: '', pct: '' }; } }],
        item: [{ type: 'row', fields: [
          { key: 'time', type: 'text', label: 'time' },
          { key: 'icon', type: 'select', label: 'icon', options: WX_OPTS },
          { key: 'temp', type: 'text', label: 'temp' },
          { key: 'pct', type: 'text', label: 'rain %' }
        ] }] },
      { type: 'head', label: '10-day' },
      { key: 'days', type: 'list', adds: [{ label: '+ day', item: function (s) { var d = s.days || []; return { day: d.length ? '' : 'Today', icon: d.length ? d[d.length - 1].icon : 'sun', lo: '', hi: '', pct: '' }; } }],
        item: [
          { type: 'row', fields: [
            { key: 'day', type: 'text', label: 'day' },
            { key: 'icon', type: 'select', label: 'icon', options: WX_OPTS },
            { key: 'pct', type: 'text', label: 'rain %' }
          ] },
          { type: 'row', fields: [
            { key: 'lo', type: 'text', label: 'low' },
            { key: 'hi', type: 'text', label: 'high' }
          ] }
        ] }
    ],
    render: function (s) {
      var g = WX_BG[s.sky] || WX_BG.sunny;
      function deg(path, v) { return E(path, v) + '°'; }
      function toF(v) { return s.unit === 'c' ? v * 9 / 5 + 32 : v; }
      var hours = (s.hours || []).map(function (h, i) {
        var p = 'hours.' + i + '.';
        return '<div class="pz-wx-h"><span class="pz-wx-ht">' + E(p + 'time', h.time) + '</span><span class="pz-wx-hi">' + wx(h.icon) + (h.pct ? '<em>' + E(p + 'pct', h.pct) + (txt(h.pct) ? '%' : '') + '</em>' : '') + '</span><span class="pz-wx-hv">' + deg(p + 'temp', h.temp) + '</span></div>';
      }).join('');
      var days = s.days || [], los = [], his = [];
      days.forEach(function (d) { los.push(num(d.lo, NaN)); his.push(num(d.hi, NaN)); });
      var mn = Math.min.apply(null, los.filter(isFinite).concat(his.filter(isFinite))), mx = Math.max.apply(null, his.filter(isFinite).concat(los.filter(isFinite)));
      if (!isFinite(mn) || !isFinite(mx) || mx <= mn) { mn = 0; mx = 1; }
      var cur = num(s.temp, NaN);
      var rows = days.map(function (d, i) {
        var p = 'days.' + i + '.', lo = num(d.lo, mn), hi = num(d.hi, mx);
        var l = (lo - mn) / (mx - mn) * 100, w = Math.max(4, (hi - lo) / (mx - mn) * 100);
        var dot = i === 0 && isFinite(cur) && cur >= mn && cur <= mx ? '<b class="pz-wx-dot" style="left:' + ((cur - mn) / (mx - mn) * 100) + '%"></b>' : '';
        return '<div class="pz-wx-d"><span class="pz-wx-dn">' + E(p + 'day', d.day) + '</span><span class="pz-wx-di">' + wx(d.icon) + (d.pct ? '<em>' + E(p + 'pct', d.pct) + (txt(d.pct) ? '%' : '') + '</em>' : '') + '</span>' +
          '<span class="pz-wx-lo">' + deg(p + 'lo', d.lo) + '</span><span class="pz-wx-bar"><i style="left:' + l + '%;width:' + w + '%;background:linear-gradient(90deg,' + tColor(toF(lo)) + ',' + tColor(toF(hi)) + ')"></i>' + dot + '</span>' +
          '<span class="pz-wx-hi2">' + deg(p + 'hi', d.hi) + '</span></div>';
      }).join('');
      var top = s.myLoc ? '<div class="pz-wx-city">My Location</div><div class="pz-wx-sub">' + E('city', s.city) + '</div>' : '<div class="pz-wx-city">' + E('city', s.city) + '</div>';
      return '<div class="shot pz-wx sky-' + s.sky + '" style="background:linear-gradient(180deg,' + g[0] + ',' + g[1] + ' 55%,' + g[2] + ')">' +
        (s.effects ? wxSky(s.sky, 42) : '') + '<div class="pz-wx-ui">' + U.statusBar(s) +
        '<div class="pz-wx-top">' + top + '<div class="pz-wx-temp">' + E('temp', s.temp) + '<span>°</span></div>' +
        '<div class="pz-wx-cond">' + E('cond', s.cond) + '</div><div class="pz-wx-hl">H:' + deg('hi', s.hi) + '&nbsp;&nbsp;L:' + deg('lo', s.lo) + '</div></div>' +
        '<div class="pz-wx-card">' + (s.desc ? '<div class="pz-wx-desc">' + EB('desc', s.desc) + '</div>' : '<div class="pz-wx-ch"><span>HOURLY FORECAST</span></div>') +
        '<div class="pz-wx-hours">' + hours + '</div></div>' +
        '<div class="pz-wx-card"><div class="pz-wx-ch">' + I.cal + '<span>10-DAY FORECAST</span></div><div class="pz-wx-days">' + rows + '</div></div>' +
        '<div class="pz-wx-grow"></div><div class="pz-wx-bot"><span>' + I.map + '</span><span class="pz-wx-dots"><i class="loc">' + I.arrow + '</i><i></i><i></i></span><span>' + I.list + '</span></div></div></div>';
    }
  });
})();
