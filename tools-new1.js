/* screenies — instagram post + story, bereal, threads, whatsapp, messenger, iphone notifications */

(function () {
  var esc = U.esc, ava = U.avatar;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function fill(d, vb) { return '<svg viewBox="' + (vb || '0 0 24 24') + '"><path d="' + d + '"/></svg>'; }
  function tags(t, cls) {
    return U.br(t).replace(/(^|[\s>(])([@#][\w.À-￿]+)/g, '$1<span class="' + cls + '">$2</span>');
  }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' ph0"' + DI(path) + '></div>'; }
  function num(v, d) { var n = parseInt(bare(v), 10); return isNaN(n) ? d : n; }
  var BADGE = '<span class="vbadge">' + ICON.verified + '</span>';

  var I = {
    heart: stroke('M12 20.3c-.5-.3-2.2-1.8-4.4-3.8C5 14.2 2.5 12.2 2.5 9.1a5 5 0 0 1 4.7-5.2 4.2 4.2 0 0 1 3.7 1.9c.8 1.2 1 1.8 1.1 1.8s.3-.6 1.1-1.8a4.2 4.2 0 0 1 3.7-1.9 5 5 0 0 1 4.7 5.2c0 3.1-2.5 5.1-5.1 7.4-2.2 2-3.9 3.5-4.4 3.8z', 2),
    heartFull: fill('M12 20.3c-.5-.3-2.2-1.8-4.4-3.8C5 14.2 2.5 12.2 2.5 9.1a5 5 0 0 1 4.7-5.2 4.2 4.2 0 0 1 3.7 1.9c.8 1.2 1 1.8 1.1 1.8s.3-.6 1.1-1.8a4.2 4.2 0 0 1 3.7-1.9 5 5 0 0 1 4.7 5.2c0 3.1-2.5 5.1-5.1 7.4-2.2 2-3.9 3.5-4.4 3.8z'),
    comment: stroke('M20.66 17a10 10 0 1 0-3.6 3.6L22 22z', 2),
    send: stroke('M22 3 9.2 10.1M11.7 20.3 22 3H2l7.2 7.1z', 2),
    repost: stroke('M19 7.5H8.5A4.5 4.5 0 0 0 4 12M16 4.5l3 3-3 3M5 16.5h10.5A4.5 4.5 0 0 0 20 12M8 19.5l-3-3 3-3', 2),
    save: stroke('M20 21l-8-7.6L4 21V3h16z', 2),
    saveFull: fill('M20 21l-8-7.6L4 21V3h16z'),
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
    x: stroke('M5 5l14 14M19 5 5 19', 2),
    music: fill('M9 17.5a2.5 2.5 0 1 1-2-2.45V5l11-2v10.5a2.5 2.5 0 1 1-2-2.45V6.4L9 7.7z'),
    pin: fill('M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z'),
    link: stroke('M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2', 2.2),
    back: stroke('M15 5l-7 7 7 7', 2.4),
    backArrow: stroke('M20 12H4.5M11 5l-7 7 7 7', 2.1),
    tcomment: stroke('M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3A8.5 8.5 0 1 1 20.5 11.5z', 1.8),
    trepost: stroke('M17 3.5 20 6.5l-3 3M4 11.5v-1a4 4 0 0 1 4-4h12M7 20.5 4 17.5l3-3M20 12.5v1a4 4 0 0 1-4 4H4', 1.8),
    tshare: stroke('M21 3 3 10.5l7 2.8L21 3zM21 3l-7.7 18-3.3-7.7', 1.8),
    phone: stroke('M5.2 3.5h3.3l1.7 4.3-2.2 1.4a12 12 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7v3.3a1.7 1.7 0 0 1-1.8 1.7A17 17 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8z', 1.8),
    video: stroke('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5zM16 10.5l5-3v9l-5-3', 1.8),
    plus: stroke('M12 5v14M5 12h14', 2),
    plusCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7.5v9M7.5 12h9" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
    camera: stroke('M3 8.5A1.5 1.5 0 0 1 4.5 7h3L9 4.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5zM12 16.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6z', 1.8),
    cameraFull: '<svg viewBox="0 0 24 24"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3L9 4.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/><circle cx="12" cy="13" r="3.6" fill="#fff"/></svg>',
    image: '<svg viewBox="0 0 24 24"><path d="M5 3.5h14A1.5 1.5 0 0 1 20.5 5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5z"/><path d="M5.5 17.5l4-5 3 3.5 2-2.5 4 4z" fill="#fff"/><circle cx="15.5" cy="8.5" r="1.6" fill="#fff"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="8.5" y="2.5" width="7" height="12" rx="3.5"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    micLine: stroke('M12 3.5a2.8 2.8 0 0 1 2.8 2.8v5.4a2.8 2.8 0 0 1-5.6 0V6.3A2.8 2.8 0 0 1 12 3.5zM6 11.5a6 6 0 0 0 12 0M12 17.5v3', 1.8),
    sticker: stroke('M20.5 12A8.5 8.5 0 1 1 12 3.5M20.5 12h-4.5a4 4 0 0 0-4 4v4.5M20.5 12A8.5 8.5 0 0 0 12 3.5', 1.8),
    smile: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01', 1.9),
    thumb: '<svg viewBox="0 0 24 24"><path d="M2.5 10h4v11h-4zM8.5 20.5V10.2L13 2.8c1.6-.2 2.8 1.2 2.4 2.8L14.6 9h5.3a2 2 0 0 1 2 2.4l-1.5 7.4a2.2 2.2 0 0 1-2.2 1.7z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7.5v.01" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
    play: fill('M7 4.5v15l12.5-7.5z'),
    tick1: '<svg viewBox="0 0 12 11"><path d="M10.9.65 4.53 7.02 1.93 4.42.73 5.6l3.8 3.8L12.1 1.85z"/></svg>',
    tick2: '<svg viewBox="0 0 16 11"><path d="M11.07.65 4.7 7.02 2.1 4.42.9 5.6l3.8 3.8L12.25 1.85zM14.9.65 8.52 7.02l-.75-.75-1.2 1.2 1.95 1.95L16.1 1.85z"/></svg>',
    friends: stroke('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5c2 .6 3.3 2.4 3.5 5.5', 1.8),
    flash: '<svg viewBox="0 0 24 24"><path d="M8 2.5h8v3.2l-2 3V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V8.7l-2-3z"/></svg>',
    lockCam: '<svg viewBox="0 0 24 24"><path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h2.8l1.6-2.2h5.2L16.2 7H19a1.5 1.5 0 0 1 1.5 1.5v9.5A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z"/><circle cx="12" cy="13" r="3.4" fill="#000" opacity=".55"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><path d="M7 10V7.5a5 5 0 0 1 10 0V10h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10zm2 0h6V7.5a3 3 0 0 0-6 0z"/></svg>'
  };

  /* ---------- dragging things around on the picture (story stickers) ---------- */
  // a click types (the words are editable), a drag moves it. positions are % of the picture.
  function dragItems(shot, s, app, listKey, areaSel) {
    var area = shot.querySelector(areaSel);
    if (!area) return;
    [].forEach.call(shot.querySelectorAll('[data-drag]'), function (node) {
      var i = +node.dataset.drag, start = null;
      node.addEventListener('pointerdown', function (e) {
        var it = (s[listKey] || [])[i];
        if (!it) return;
        start = { x: e.clientX, y: e.clientY, ix: +it.x || 50, iy: +it.y || 50, moving: false, id: e.pointerId };
      });
      node.addEventListener('pointermove', function (e) {
        if (!start) return;
        if (!start.moving) {
          if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) < 6) return;
          start.moving = true;
          node.setPointerCapture(start.id);
          window.getSelection().removeAllRanges();
        }
        e.preventDefault();
        var k = app.scale() || 1, it = s[listKey][i];
        it.x = Math.round(Math.max(0, Math.min(100, start.ix + (e.clientX - start.x) / k / area.offsetWidth * 100)));
        it.y = Math.round(Math.max(0, Math.min(100, start.iy + (e.clientY - start.y) / k / area.offsetHeight * 100)));
        node.style.left = it.x + '%';
        node.style.top = it.y + '%';
      });
      function end() {
        if (start && start.moving) {
          app.save();
          if (document.activeElement && node.contains(document.activeElement)) document.activeElement.blur();
        }
        start = null;
      }
      node.addEventListener('pointerup', end);
      node.addEventListener('pointercancel', end);
    });
  }

  /* ============================== instagram post ============================== */

  TOOLS.push({
    id: 'igpost',
    label: 'ig post',
    defaults: {
      theme: 'light', avatar: '', user: '', badge: false, ring: false, sub: '', follow: false,
      photo: '', shape: 'square', slides: '', slide: '1',
      likes: '', comments: '', reposts: '', shares: '', liked: false, saved: false,
      likedBy: '', likedByPic: '', caption: '', viewAll: '', time: ''
    },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'shape', type: 'select', label: 'shape', options: [['square', 'square'], ['portrait', 'tall (4:5)'], ['landscape', 'wide']] }
      ] },
      { key: 'avatar', type: 'image', label: 'pfp', max: 300 },
      { type: 'row', fields: [
        { key: 'user', type: 'text', label: 'username' },
        { key: 'badge', type: 'toggle', label: 'check' },
        { key: 'ring', type: 'toggle', label: 'story ring' }
      ] },
      { type: 'row', fields: [
        { key: 'sub', type: 'text', label: 'location / song', placeholder: 'los angeles, california' },
        { key: 'follow', type: 'toggle', label: 'follow button' }
      ] },
      { key: 'photo', type: 'image', label: 'photo', max: 1400 },
      { type: 'row', fields: [
        { key: 'slides', type: 'number', label: 'photos in post' },
        { key: 'slide', type: 'number', label: 'on photo #' }
      ] },
      { type: 'row', fields: [
        { key: 'likes', type: 'text', label: 'likes' },
        { key: 'comments', type: 'text', label: 'comments' },
        { key: 'reposts', type: 'text', label: 'reposts' },
        { key: 'shares', type: 'text', label: 'shares' }
      ] },
      { type: 'row', fields: [
        { key: 'liked', type: 'toggle', label: 'liked' },
        { key: 'saved', type: 'toggle', label: 'saved' }
      ] },
      { key: 'likedByPic', type: 'image', label: 'liked by pfp', max: 200 },
      { key: 'likedBy', type: 'text', label: 'liked by', placeholder: 'username' },
      { key: 'caption', type: 'textarea', label: 'caption', rows: 3 },
      { type: 'row', fields: [
        { key: 'viewAll', type: 'text', label: 'view all … comments' },
        { key: 'time', type: 'text', label: 'time', placeholder: '2 hours ago' }
      ] }
    ],
    render: function (s) {
      var n = Math.max(0, Math.min(20, num(s.slides, 0))), on = Math.max(1, Math.min(n, num(s.slide, 1)));
      var dots = '';
      if (n > 1) for (var d = 1; d <= n; d++) dots += '<i class="' + (d === on ? 'on' : '') + '"></i>';
      function act(icon, k, cls) {
        return '<span class="igpo-act ' + (cls || '') + '">' + icon + (s[k] ? '<b>' + E(k, s[k]) + '</b>' : '') + '</span>';
      }
      var pfp = ava(s.avatar, s.user, 'igpo-ava', undefined, 'avatar');
      return '<div class="shot igpo t-' + s.theme + '">' +
        '<div class="igpo-head"><span class="igpo-pfp' + (s.ring ? ' ring' : '') + '">' + pfp + '</span>' +
        '<div class="igpo-who"><div class="igpo-name"><b>' + E('user', s.user) + '</b>' + (s.badge ? BADGE : '') + '</div>' +
        (s.sub ? '<div class="igpo-sub">' + E('sub', s.sub) + '</div>' : '') + '</div>' +
        (s.follow ? '<span class="igpo-follow">Follow</span>' : '') + '<span class="igpo-more">' + I.dots + '</span></div>' +
        '<div class="igpo-media sh-' + s.shape + '">' + pic(s.photo, 'photo', 'igpo-photo') +
        (n > 1 ? '<span class="igpo-count">' + on + '/' + n + '</span>' : '') + '</div>' +
        (dots ? '<div class="igpo-dots">' + dots + '</div>' : '') +
        '<div class="igpo-acts"><div class="igpo-left">' +
        act(s.liked ? I.heartFull : I.heart, 'likes', s.liked ? 'liked' : '') + act(I.comment, 'comments') + act(I.repost, 'reposts') + act(I.send, 'shares') + '</div>' +
        '<span class="igpo-act igpo-save">' + (s.saved ? I.saveFull : I.save) + '</span></div>' +
        (s.likedBy ? '<div class="igpo-liked">' + ava(s.likedByPic, s.likedBy, 'igpo-lava', undefined, 'likedByPic') +
          '<span>Liked by <b>' + E('likedBy', s.likedBy) + '</b> and <b>others</b></span></div>' : '') +
        (s.caption ? '<div class="igpo-cap"><b>' + esc(bare(s.user)) + '</b> ' + EW('caption', tags(bare(s.caption), 'igpo-at')) + '</div>' : '') +
        (s.viewAll ? '<div class="igpo-gray">View all ' + E('viewAll', s.viewAll) + ' comments</div>' : '') +
        (s.time ? '<div class="igpo-time">' + E('time', s.time) + '</div>' : '') +
        '</div>';
    }
  });

  /* ============================== instagram story ============================== */

  var IGS_STYLES = [['classic', 'classic'], ['modern', 'modern'], ['neon', 'neon'], ['typewriter', 'typewriter'], ['strong', 'strong'], ['literature', 'literature']];
  var IGS_NEW = { type: 'text', text: '', a: '', b: '', image: '', style: 'classic', color: '#ffffff', bg: 'none', x: 50, y: 50, size: 100, rot: 0 };

  function igsItem(it, i) {
    var p = 'items.' + i + '.', t = it.type, inner = '';
    if (t === 'text') {
      // a box in a light color gets dark letters, like the real thing
      var ink = it.bg === 'box' && U.lum(it.color) > 0.5 ? '#000' : '#fff';
      inner = '<div class="igs-txt st-' + it.style + ' bg-' + it.bg + '" style="--c:' + esc(it.color) + ';--ink:' + ink + '">' + EB(p + 'text', it.text) + '</div>';
    } else if (t === 'poll') {
      inner = '<div class="igs-poll">' + (bare(it.text) || it.text === GHOST ? '<div class="igs-pq">' + EB(p + 'text', it.text) + '</div>' : '') +
        '<div class="igs-po"><span>' + E(p + 'a', it.a) + '</span><span>' + E(p + 'b', it.b) + '</span></div></div>';
    } else if (t === 'question') {
      inner = '<div class="igs-q" style="--c:' + esc(it.color) + '"><div class="igs-qtop">' + ava(it.image, '', 'igs-qava', undefined, p + 'image') +
        '<div class="igs-qtext">' + EB(p + 'text', it.text) + '</div></div><div class="igs-qans">' + (bare(it.a) ? E(p + 'a', it.a) : '<span class="igs-qph">' + E(p + 'a', it.a) + '</span>') + '</div></div>';
    } else if (t === 'music') {
      inner = '<div class="igs-mus">' + pic(it.image, p + 'image', 'igs-mcov') + '<div class="igs-mtx"><b>' + E(p + 'text', it.text) + '</b><span>' + E(p + 'a', it.a) + '</span></div>' +
        '<span class="igs-eq"><i></i><i></i><i></i></span></div>';
    } else if (t === 'mention') {
      inner = '<div class="igs-tag igs-grad">@' + E(p + 'text', String(it.text).replace(/^@/, '')) + '</div>';
    } else if (t === 'location') {
      inner = '<div class="igs-tag igs-grad"><span class="igs-tico">' + I.pin + '</span>' + E(p + 'text', it.text) + '</div>';
    } else if (t === 'link') {
      inner = '<div class="igs-tag igs-link"><span class="igs-tico">' + I.link + '</span>' + E(p + 'text', it.text) + '</div>';
    }
    var sc = Math.max(20, Math.min(300, +it.size || 100)) / 100;
    return '<div class="igs-item" data-drag="' + i + '" style="left:' + (+it.x || 0) + '%;top:' + (+it.y || 0) + '%;transform:translate(-50%,-50%) rotate(' + (+it.rot || 0) + 'deg) scale(' + sc + ')">' + inner + '</div>';
  }

  TOOLS.push({
    id: 'igstory',
    label: 'ig story',
    defaults: {
      clock: '9:41', battery: 80, showPct: false,
      photo: '', bg: '#3a3a3a', avatar: '', user: '', badge: false, time: '', sub: '', bars: 3, on: 1, reply: true, close: true,
      items: []
    },
    fields: [
      U.STATUS_FIELDS,
      { key: 'photo', type: 'image', label: 'photo / video frame', max: 1400 },
      { key: 'bg', type: 'color', label: 'background (no photo)' },
      { key: 'avatar', type: 'image', label: 'pfp', max: 300 },
      { type: 'row', fields: [
        { key: 'user', type: 'text', label: 'username' },
        { key: 'time', type: 'text', label: 'time', placeholder: '4h' },
        { key: 'badge', type: 'toggle', label: 'check' }
      ] },
      { key: 'sub', type: 'text', label: 'under name (song / location)' },
      { type: 'row', fields: [
        { key: 'bars', type: 'number', label: 'stories' },
        { key: 'on', type: 'number', label: 'on story #' },
        { key: 'reply', type: 'toggle', label: 'reply bar' }
      ] },
      { type: 'head', label: 'on the story (drag them on the picture)' },
      { key: 'items', type: 'list',
        adds: [
          { label: '+ text', item: item(IGS_NEW) },
          { label: '+ poll', item: item(Object.assign({}, IGS_NEW, { type: 'poll', a: '', b: '' })) },
          { label: '+ question', item: item(Object.assign({}, IGS_NEW, { type: 'question', color: '#e1306c' })) },
          { label: '+ music', item: item(Object.assign({}, IGS_NEW, { type: 'music' })) },
          { label: '+ mention', item: item(Object.assign({}, IGS_NEW, { type: 'mention' })) },
          { label: '+ location', item: item(Object.assign({}, IGS_NEW, { type: 'location' })) },
          { label: '+ link', item: item(Object.assign({}, IGS_NEW, { type: 'link' })) }
        ],
        item: [
          { key: 'type', type: 'select', label: 'kind', options: [['text', 'text'], ['poll', 'poll'], ['question', 'question box'], ['music', 'music'], ['mention', 'mention'], ['location', 'location'], ['link', 'link']] },
          { key: 'text', type: 'textarea', label: 'text / question / song', rows: 2 },
          { type: 'row', fields: [
            { key: 'a', type: 'text', label: 'option 1 / artist / answer' },
            { key: 'b', type: 'text', label: 'option 2' }
          ] },
          { key: 'image', type: 'image', label: 'cover / question pfp', max: 300 },
          { type: 'row', fields: [
            { key: 'style', type: 'select', label: 'font', options: IGS_STYLES },
            { key: 'bg', type: 'select', label: 'behind text', options: [['none', 'nothing'], ['box', 'box'], ['soft', 'see-through box']] },
            { key: 'color', type: 'color', label: 'color' }
          ] },
          { type: 'row', fields: [
            { key: 'size', type: 'range', label: 'size', min: 30, max: 250, step: 1 },
            { key: 'rot', type: 'range', label: 'tilt', min: -45, max: 45, step: 1 }
          ] }
        ] }
    ],
    render: function (s) {
      var n = Math.max(1, Math.min(20, num(s.bars, 1))), on = Math.max(1, Math.min(n, num(s.on, 1)));
      var bars = '';
      for (var b = 1; b <= n; b++) bars += '<i class="' + (b < on ? 'done' : b === on ? 'cur' : '') + '"></i>';
      var media = s.photo ? '<img class="igs-photo" src="' + s.photo + '"' + DI('photo') + ' alt="">' : '<div class="igs-photo" style="background:' + esc(s.bg) + '"' + DI('photo') + '></div>';
      return '<div class="shot igs">' + U.statusBar(s) +
        '<div class="igs-card">' + media + '<div class="igs-shade"></div>' +
        '<div class="igs-items">' + (s.items || []).map(igsItem).join('') + '</div>' +
        '<div class="igs-top"><div class="igs-bars">' + bars + '</div>' +
        '<div class="igs-head">' + ava(s.avatar, s.user, 'igs-ava', undefined, 'avatar') +
        '<div class="igs-who"><div class="igs-nm"><b>' + E('user', s.user) + '</b>' + (s.badge ? BADGE : '') + '<span>' + E('time', s.time) + '</span></div>' +
        (s.sub ? '<div class="igs-sub">' + E('sub', s.sub) + '</div>' : '') + '</div>' +
        '<span class="igs-ic">' + I.dots + '</span><span class="igs-ic">' + I.x + '</span></div></div></div>' +
        (s.reply ? '<div class="igs-reply"><span class="igs-field">Send message</span><span class="igs-ic">' + I.heart + '</span><span class="igs-ic">' + I.send + '</span></div>' : '<div class="igs-reply"></div>') +
        '</div>';
    },
    mount: function (shot, s, app) { dragItems(shot, s, app, 'items', '.igs-card'); }
  });

  /* ============================== bereal ============================== */

  TOOLS.push({
    id: 'bereal',
    label: 'bereal',
    defaults: {
      clock: '9:41', battery: 80, showPct: false, top: true,
      avatar: '', user: '', place: '', late: '', back: '', front: '', swap: false,
      caption: '', comments: '', mojis: []
    },
    fields: [
      U.STATUS_FIELDS,
      { key: 'top', type: 'toggle', label: 'app top bar' },
      { key: 'avatar', type: 'image', label: 'pfp', max: 300 },
      { key: 'user', type: 'text', label: 'username' },
      { type: 'row', fields: [
        { key: 'place', type: 'text', label: 'location', placeholder: 'Brooklyn' },
        { key: 'late', type: 'text', label: 'time', placeholder: '2 hr late' }
      ] },
      { key: 'back', type: 'image', label: 'back camera (big)', max: 1400 },
      { key: 'front', type: 'image', label: 'front camera (small)', max: 700 },
      { key: 'swap', type: 'toggle', label: 'small one on the right' },
      { key: 'caption', type: 'text', label: 'caption' },
      { key: 'comments', type: 'text', label: 'comments', placeholder: '3' },
      { type: 'head', label: 'realmojis' },
      { key: 'mojis', type: 'list', compact: true,
        adds: [{ label: '+ realmoji', item: item({ pic: '', emoji: '😂' }) }],
        item: [
          { key: 'pic', type: 'image', label: 'selfie', max: 200 },
          { key: 'emoji', type: 'text', label: 'emoji' }
        ] }
    ],
    render: function (s) {
      var moji = (s.mojis || []).slice(0, 6).map(function (m, i) {
        return '<span class="br-moji">' + pic(m.pic, 'mojis.' + i + '.pic', 'br-mpic') + '<b>' + E('mojis.' + i + '.emoji', m.emoji) + '</b></span>';
      }).join('');
      var meta = [s.place ? E('place', s.place) : '', s.late ? E('late', s.late) : ''].filter(Boolean).join(' • ');
      return '<div class="shot br">' + U.statusBar(s) +
        (s.top ? '<div class="br-top"><span class="br-ic">' + I.friends + '</span><div class="br-logo">BeReal.</div>' +
          ava(s.avatar, s.user, 'br-me', undefined, 'avatar') + '</div>' +
          '<div class="br-tabs"><b>My Friends</b><span>Friends of Friends</span></div>' : '') +
        '<div class="br-head">' + ava(s.avatar, s.user, 'br-ava', undefined, 'avatar') +
        '<div class="br-who"><b>' + E('user', s.user) + '</b><span>' + meta + '</span></div><span class="br-ic">' + I.dots + '</span></div>' +
        '<div class="br-photo">' + pic(s.back, 'back', 'br-back') +
        '<div class="br-front' + (s.swap ? ' right' : '') + '">' + pic(s.front, 'front', 'br-fimg') + '</div>' +
        (moji ? '<div class="br-mojis">' + moji + '</div>' : '') + '</div>' +
        '<div class="br-cap">' + (s.caption ? E('caption', s.caption) : '') + '</div>' +
        '<div class="br-com">' + (s.comments ? E('comments', s.comments) + ' comments' : 'Add a comment...') + '</div>' +
        '</div>';
    }
  });

  /* ============================== threads ============================== */

  var TH_NEW = { avatar: '', user: '', badge: false, time: '', text: '', image: '', likes: '', replies: '', reposts: '', shares: '', liked: false, line: false };

  TOOLS.push({
    id: 'threads',
    label: 'threads',
    defaults: { theme: 'light', head: true, posts: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'head', type: 'toggle', label: 'top bar' }
      ] },
      { type: 'head', label: 'posts (first one = the main post)' },
      { key: 'posts', type: 'list',
        adds: [{ label: '+ post', item: item(TH_NEW) }],
        item: [
          { key: 'avatar', type: 'image', label: 'pfp', max: 300 },
          { type: 'row', fields: [
            { key: 'user', type: 'text', label: 'username' },
            { key: 'time', type: 'text', label: 'time', placeholder: '2h' },
            { key: 'badge', type: 'toggle', label: 'check' }
          ] },
          { key: 'text', type: 'textarea', label: 'post', rows: 3 },
          { key: 'image', type: 'image', label: 'picture', max: 1200 },
          { type: 'row', fields: [
            { key: 'likes', type: 'text', label: 'likes' },
            { key: 'replies', type: 'text', label: 'replies' },
            { key: 'reposts', type: 'text', label: 'reposts' },
            { key: 'shares', type: 'text', label: 'shares' }
          ] },
          { type: 'row', fields: [
            { key: 'liked', type: 'toggle', label: 'liked' },
            { key: 'line', type: 'toggle', label: 'line to next (same thread)' }
          ] }
        ] }
    ],
    render: function (s) {
      var list = s.posts || [];
      var out = list.map(function (p, i) {
        var pre = 'posts.' + i + '.';
        function act(icon, k, cls) {
          return '<span class="th-act ' + (cls || '') + '">' + icon + (p[k] ? '<b>' + E(pre + k, p[k]) + '</b>' : '') + '</span>';
        }
        return '<div class="th-post' + (i === 0 ? ' main' : '') + (i > 0 && list[i - 1].line ? ' joined' : '') + '"><div class="th-side">' + ava(p.avatar, p.user, 'th-ava', undefined, pre + 'avatar') +
          (p.line && i < list.length - 1 ? '<i class="th-line"></i>' : '') + '</div>' +
          '<div class="th-main"><div class="th-top"><b>' + E(pre + 'user', p.user) + '</b>' + (p.badge ? BADGE : '') +
          '<span class="th-time">' + E(pre + 'time', p.time) + '</span><span class="th-more">' + I.dots + '</span></div>' +
          (p.text ? '<div class="th-text">' + EW(pre + 'text', tags(bare(p.text), 'th-at')) + '</div>' : '') +
          (p.image ? '<img class="th-img" src="' + p.image + '"' + DI(pre + 'image') + ' alt="">' : '') +
          '<div class="th-acts">' + act(p.liked ? I.heartFull : I.heart, 'likes', p.liked ? 'liked' : '') + act(I.tcomment, 'replies') +
          act(I.trepost, 'reposts') + act(I.tshare, 'shares') + '</div></div></div>';
      }).join('');
      return '<div class="shot th t-' + s.theme + '">' +
        (s.head ? '<div class="th-head"><span class="th-back">' + I.backArrow + '</span><b>Thread</b><span class="th-hic">' + I.dots + '</span></div>' : '') +
        '<div class="th-list">' + out + '</div></div>';
    }
  });

  /* ============================== whatsapp ============================== */

  // the doodle wallpaper, drawn small and tiled
  function waDoodles(col) {
    var g = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="' + col + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M14 20a6 6 0 1 0 12 0 6 6 0 0 0-12 0zM60 12l4 8 9 1-6 6 2 9-9-5-8 5 2-9-6-6 9-1z"/>' +
      '<path d="M95 18c4-6 14-2 10 6l-10 9-10-9c-4-8 6-12 10-6zM18 62h18v12H18zM22 62v-4h10v4"/>' +
      '<path d="M58 60c6 0 10 4 10 10s-4 10-10 10M52 70h14M90 58l12 12-12 12-12-12zM20 100c4-6 12-6 16 0s12 6 16 0"/>' +
      '<path d="M66 100a8 8 0 1 0 16 0 8 8 0 0 0-16 0zM74 96v4l3 2M100 96l8 14H92z"/></svg>';
    return "url('data:image/svg+xml," + encodeURIComponent(g) + "')";
  }
  var WA_WAVE = [4, 7, 12, 9, 15, 11, 6, 13, 17, 10, 5, 9, 14, 8, 12, 16, 7, 11, 13, 6, 9, 12, 8, 5, 10, 14, 9, 6];

  TOOLS.push({
    id: 'whatsapp',
    label: 'whatsapp',
    defaults: {
      clock: '9:41', battery: 80, showPct: false, theme: 'light',
      photo: '', name: '', sub: '', unread: '', wall: '', doodles: true,
      msgs: []
    },
    fields: [
      U.STATUS_FIELDS,
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'doodles', type: 'toggle', label: 'doodle wallpaper' }
      ] },
      { key: 'wall', type: 'image', label: 'own wallpaper', max: 1200 },
      { type: 'head', label: 'them' },
      { key: 'photo', type: 'image', label: 'profile photo', max: 300 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'unread', type: 'text', label: 'unread' }
      ] },
      { key: 'sub', type: 'text', label: 'under name', placeholder: 'online' },
      { type: 'head', label: 'messages' },
      { key: 'msgs', type: 'list', meKey: 'from',
        adds: [
          { label: '+ me', item: item({ from: 'me', kind: 'text', text: '', image: '', time: '', ticks: 'read', length: '', day: '' }) },
          { label: '+ them', item: item({ from: 'them', kind: 'text', text: '', image: '', time: '', ticks: 'read', length: '', day: '' }) }
        ],
        item: [
          { type: 'row', fields: [
            { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['them', 'them']] },
            { key: 'kind', type: 'select', label: 'kind', options: [['text', 'text'], ['voice', 'voice note']] },
            { key: 'ticks', type: 'select', label: 'ticks (me)', options: [['read', 'blue ✓✓'], ['delivered', 'gray ✓✓'], ['sent', 'one ✓'], ['none', 'none']] }
          ] },
          { key: 'text', type: 'textarea', label: 'text', rows: 2 },
          { key: 'image', type: 'image', label: 'picture', max: 900 },
          { type: 'row', fields: [
            { key: 'time', type: 'text', label: 'time', placeholder: '9:41 PM' },
            { key: 'length', type: 'text', label: 'voice length', placeholder: '0:14' },
            { key: 'day', type: 'text', label: 'day above', placeholder: 'Today' }
          ] }
        ] }
    ],
    render: function (s) {
      var list = s.msgs || [], out = '';
      list.forEach(function (m, i) {
        var pre = 'msgs.' + i + '.', prev = list[i - 1];
        if (m.day) out += '<div class="wa-day"><span>' + E(pre + 'day', m.day) + '</span></div>';
        var me = m.from === 'me';
        var first = !prev || prev.from !== m.from || m.day;
        var ticks = me && m.ticks !== 'none' ? '<span class="wa-tk ' + m.ticks + '">' + (m.ticks === 'sent' ? I.tick1 : I.tick2) + '</span>' : '';
        var meta = '<span class="wa-meta">' + E(pre + 'time', m.time) + ticks + '</span>';
        var body;
        if (m.kind === 'voice') {
          var bars = WA_WAVE.map(function (h) { return '<i style="height:' + h + 'px"></i>'; }).join('');
          body = '<div class="wa-voice"><span class="wa-play">' + I.play + '</span><div class="wa-wv"><span class="wa-wave">' + bars + '</span>' +
            '<span class="wa-vlen">' + E(pre + 'length', m.length) + '</span></div>' +
            '<span class="wa-vava">' + (me ? '<span class="wa-vme">' + I.mic + '</span>' : ava(s.photo, s.name, 'wa-vpic', undefined, 'photo') + '<span class="wa-vmic">' + I.mic + '</span>') + '</span></div>' + meta;
        } else {
          body = (m.image ? '<img class="wa-pic" src="' + m.image + '"' + DI(pre + 'image') + ' alt="">' : '') +
            (m.text ? '<div class="wa-text">' + EB(pre + 'text', m.text) + '<span class="wa-pad"></span></div>' : '') + meta;
        }
        out += '<div class="wa-row ' + (me ? 'me' : 'them') + (first ? ' first' : '') + '"><div class="wa-b' + (m.kind === 'voice' ? ' vb' : '') + (m.image && !m.text ? ' pb' : '') + '">' + body + '</div></div>';
      });
      var dark = s.theme === 'dark';
      var bg = s.wall ? '' : (s.doodles ? waDoodles(dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.07)') : 'none');
      return '<div class="shot wa t-' + s.theme + '">' + U.statusBar(s) +
        '<div class="wa-head"><span class="wa-back">' + ICON.chevron + (s.unread ? '<span>' + E('unread', s.unread) + '</span>' : '') + '</span>' +
        ava(s.photo, s.name, 'wa-hava', undefined, 'photo') + '<div class="wa-who"><b>' + E('name', s.name) + '</b>' + (s.sub ? '<span>' + E('sub', s.sub) + '</span>' : '') + '</div>' +
        '<span class="wa-hic">' + I.video + '</span><span class="wa-hic">' + I.phone + '</span></div>' +
        '<div class="wa-body"' + (s.wall ? '' : ' style="background-image:' + bg + '"') + '>' +
        (s.wall ? '<img class="wa-wall" src="' + s.wall + '"' + DI('wall') + ' alt="">' : '') + '<div class="wa-list">' + out + '</div></div>' +
        '<div class="wa-input"><span class="wa-iic">' + I.plus + '</span><span class="wa-field"><span></span><span class="wa-st">' + I.sticker + '</span></span>' +
        '<span class="wa-iic">' + I.camera + '</span><span class="wa-iic">' + I.micLine + '</span></div><div class="wa-home"><i></i></div></div>';
    }
  });

  /* ============================== messenger ============================== */

  var MS_THEMES = {
    blue: ['#0084ff', '#0084ff'], berry: ['#ff5280', '#a033ff', '#0081ff'], candy: ['#ff9a9e', '#ff5ca8', '#c86dd7'],
    purple: ['#b44bff', '#7b5cff'], pink: ['#ff6fb5', '#ff3d8b'], tiedye: ['#ffb33e', '#ff4f8b', '#8a5cff', '#2ab0ff'],
    black: ['#3a3a3c', '#1c1c1e'], green: ['#25c56b', '#0b9a52']
  };
  TOOLS.push({
    id: 'messenger',
    label: 'messenger',
    defaults: {
      clock: '9:41', battery: 80, showPct: false, theme: 'light', color: 'berry',
      photo: '', name: '', sub: '', active: true, seen: true,
      msgs: []
    },
    fields: [
      U.STATUS_FIELDS,
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'color', type: 'select', label: 'chat theme', options: Object.keys(MS_THEMES).map(function (k) { return [k, k]; }) }
      ] },
      { type: 'head', label: 'them' },
      { key: 'photo', type: 'image', label: 'profile photo', max: 300 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'active', type: 'toggle', label: 'green dot' }
      ] },
      { key: 'sub', type: 'text', label: 'under name', placeholder: 'Active now' },
      { type: 'head', label: 'messages' },
      { key: 'msgs', type: 'list', meKey: 'from',
        adds: [
          { label: '+ me', item: item({ from: 'me', text: '', image: '', stamp: '', react: '' }) },
          { label: '+ them', item: item({ from: 'them', text: '', image: '', stamp: '', react: '' }) }
        ],
        item: [
          { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['them', 'them']] },
          { key: 'text', type: 'textarea', label: 'text', rows: 2 },
          { key: 'image', type: 'image', label: 'picture', max: 900 },
          { type: 'row', fields: [
            { key: 'stamp', type: 'text', label: 'time above', placeholder: '9:41 PM' },
            { key: 'react', type: 'text', label: 'reaction', placeholder: '❤️' }
          ] }
        ] },
      { key: 'seen', type: 'toggle', label: 'seen (their pic under your last message)' }
    ],
    render: function (s) {
      var list = s.msgs || [], lastMe = -1, out = '';
      var cols = MS_THEMES[s.color] || MS_THEMES.blue;
      list.forEach(function (m, i) { if (m.from === 'me') lastMe = i; });
      list.forEach(function (m, i) {
        var pre = 'msgs.' + i + '.', prev = list[i - 1], next = list[i + 1];
        var joinUp = prev && prev.from === m.from && !m.stamp;
        var joinDown = next && next.from === m.from && !next.stamp;
        var who = m.from === 'me' ? 'me' : 'them';
        if (m.stamp) out += '<div class="ms-stamp">' + E(pre + 'stamp', m.stamp) + '</div>';
        var big = U.isEmojiOnly(m.text) && !m.image;
        var body = (m.image ? '<img class="ms-pic" src="' + m.image + '"' + DI(pre + 'image') + ' alt="">' : '') +
          (m.text ? '<div class="ms-b' + (big ? ' emoji' : '') + (joinUp ? ' up' : '') + (joinDown ? ' down' : '') + '">' + EB(pre + 'text', m.text) + '</div>' : '');
        out += '<div class="ms-row ' + who + (joinUp ? '' : ' gap') + (m.react ? ' reacted' : '') + '">' +
          (who === 'them' ? (joinDown ? '<div class="ms-ava sp"></div>' : ava(s.photo, s.name, 'ms-ava', undefined, 'photo')) : '') +
          '<div class="ms-col">' + body + (m.react ? '<span class="ms-react">' + E(pre + 'react', m.react) + '</span>' : '') + '</div></div>';
        if (i === lastMe && s.seen && !(next && next.from === 'me')) out += '<div class="ms-seen">' + ava(s.photo, s.name, 'ms-sava') + '</div>';
      });
      var grad = cols.length > 1 ? 'linear-gradient(180deg,' + cols.join(',') + ')' : cols[0];
      return '<div class="shot ms t-' + s.theme + '" style="--accent:' + cols[cols.length - 1] + ';--grad:' + grad + '">' + U.statusBar(s) +
        '<div class="ms-head"><span class="ms-hic">' + I.back + '</span><span class="ms-hpfp">' + ava(s.photo, s.name, 'ms-hava', undefined, 'photo') +
        (s.active ? '<i class="ms-dot"></i>' : '') + '</span>' +
        '<div class="ms-who"><b>' + E('name', s.name) + '</b>' + (s.sub ? '<span>' + E('sub', s.sub) + '</span>' : '') + '</div>' +
        '<span class="ms-hic">' + I.phone + '</span><span class="ms-hic">' + I.video + '</span></div>' +
        '<div class="ms-body">' + out + '</div>' +
        '<div class="ms-input"><span class="ms-iic">' + I.plusCircle + '</span><span class="ms-iic">' + I.cameraFull + '</span><span class="ms-iic">' + I.image + '</span>' +
        '<span class="ms-iic">' + I.mic + '</span><span class="ms-field">Aa<span>' + I.smile + '</span></span><span class="ms-iic">' + I.thumb + '</span></div><div class="ms-home"><i></i></div></div>';
    },
    // the gradient runs down the whole chat (like the real app), so each bubble shows its own slice of it
    mount: function (shot) {
      var h = shot.offsetHeight, top = shot.getBoundingClientRect().top;
      var k = shot.getBoundingClientRect().height / (h || 1) || 1;
      [].forEach.call(shot.querySelectorAll('.ms-row.me .ms-b:not(.emoji)'), function (b) {
        b.style.backgroundSize = '100% ' + h + 'px';
        b.style.backgroundPosition = '0 ' + (-(b.getBoundingClientRect().top - top) / k) + 'px';
      });
    }
  });

  /* ============================== iphone notifications ============================== */

  var NF_APPS = {
    messages: { bg: 'linear-gradient(180deg,#6bf07c,#1fc93c)', ic: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 4c5 0 9 3.2 9 7.3s-4 7.3-9 7.3c-.9 0-1.8-.1-2.6-.3L5 20.5l1.1-3.6C4.2 15.6 3 13.6 3 11.3 3 7.2 7 4 12 4z"/></svg>' },
    instagram: { bg: 'radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285aeb 90%)', ic: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r=".6" fill="#fff"/></svg>' },
    snapchat: { bg: '#fffc00', ic: '<svg viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="1.1" d="M12 3.5c3 0 5 2.2 5 5v2.3c.6.2 1.3-.1 1.7.3.4.5-.6 1.1-1.6 1.5.6 1.6 1.8 2.9 3.4 3.4-.2.6-1.2.8-2 .9-.2.4 0 1-.6 1.1-.8.1-1.7-.3-2.8.4-.9.6-1.6 1.6-3.1 1.6s-2.2-1-3.1-1.6c-1.1-.7-2-.3-2.8-.4-.6-.1-.4-.7-.6-1.1-.8-.1-1.8-.3-2-.9 1.6-.5 2.8-1.8 3.4-3.4-1-.4-2-1-1.6-1.5.4-.4 1.1-.1 1.7-.3V8.5c0-2.8 2-5 5-5z"/></svg>' },
    tiktok: { bg: '#000', ic: '<svg viewBox="0 0 24 24"><path fill="#25f4ee" d="M15.5 3h-2.8v11.4a2.6 2.6 0 1 1-2.6-2.6v-2.9a5.5 5.5 0 1 0 5.4 5.5V9a6.6 6.6 0 0 0 3.9 1.3V7.4c-2.1 0-3.9-1.9-3.9-4.4z" transform="translate(-.6 -.4)"/><path fill="#fe2c55" d="M15.5 3h-2.8v11.4a2.6 2.6 0 1 1-2.6-2.6v-2.9a5.5 5.5 0 1 0 5.4 5.5V9a6.6 6.6 0 0 0 3.9 1.3V7.4c-2.1 0-3.9-1.9-3.9-4.4z" transform="translate(.6 .4)"/><path fill="#fff" d="M15.5 3h-2.8v11.4a2.6 2.6 0 1 1-2.6-2.6v-2.9a5.5 5.5 0 1 0 5.4 5.5V9a6.6 6.6 0 0 0 3.9 1.3V7.4c-2.1 0-3.9-1.9-3.9-4.4z"/></svg>' },
    spotify: { bg: '#000', ic: ICON.spotify.replace('<svg', '<svg fill="#1ed760"') },
    discord: { bg: '#5865f2', ic: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M18.6 6.3A15 15 0 0 0 15 5.2l-.5 1a13.6 13.6 0 0 0-5 0l-.5-1a15 15 0 0 0-3.6 1.1C3.1 9.7 2.5 13 2.8 16.3a15 15 0 0 0 4.5 2.3l1-1.5-1.6-.8.4-.3a10.6 10.6 0 0 0 9.8 0l.4.3-1.6.8 1 1.5a15 15 0 0 0 4.5-2.3c.4-3.8-.6-7.1-2.6-10zM9.2 14.3c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8zm5.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8z"/></svg>' },
    whatsapp: { bg: 'linear-gradient(180deg,#61fd7d,#25cf43)', ic: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z"/><path fill="#25cf43" d="M9.3 7.6c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.1.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.4l-.7-1.8z"/></svg>' },
    x: { bg: '#000', ic: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M17.2 4h2.8l-6.1 7 7.2 9h-5.6l-4.4-5.7L6 20H3.2l6.5-7.5L2.8 4h5.7l4 5.3zm-1 14.4h1.6L7.9 5.5H6.2z"/></svg>' },
    youtube: { bg: '#fff', ic: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="13" rx="4" fill="#ff0000"/><path fill="#fff" d="M10 9.5v6l5.2-3z"/></svg>' },
    messenger: { bg: 'linear-gradient(200deg,#ff6968,#a334fa 45%,#0695ff)', ic: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3C7 3 3 6.8 3 11.6c0 2.6 1.1 4.8 3 6.4v3.2l2.9-1.6c.9.3 2 .4 3.1.4 5 0 9-3.8 9-8.6S17 3 12 3z"/><path fill="#a334fa" d="m6.8 14 3-4.7 2.4 1.9 3.1-1.9-3 4.7-2.4-1.9z"/></svg>' },
    phone: { bg: 'linear-gradient(180deg,#6bf07c,#1fc93c)', ic: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M6.6 3.8 8.8 3.5l1.8 4.3-1.7 1.4a11 11 0 0 0 5.9 5.9l1.4-1.7 4.3 1.8-.3 2.2a2 2 0 0 1-2 1.6A15.6 15.6 0 0 1 3.4 5.8a2 2 0 0 1 1.6-2z"/></svg>' },
    facetime: { bg: 'linear-gradient(180deg,#6bf07c,#1fc93c)', ic: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="12" height="10" rx="2.5" fill="#fff"/><path fill="#fff" d="m16 11 5-3v8l-5-3z"/></svg>' },
    mail: { bg: 'linear-gradient(180deg,#22c3fc,#1a75f2)', ic: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" fill="#fff"/><path d="m3.8 6.8 8.2 6 8.2-6" fill="none" stroke="#1a75f2" stroke-width="1.4"/></svg>' },
    roblox: { bg: '#fff', ic: '<svg viewBox="0 0 24 24"><path fill="#111" d="M6.5 3 21 6.5 17.5 21 3 17.5z"/><path fill="#fff" d="M10.2 9.2l4.6 1.1-1.1 4.5-4.6-1.1z"/></svg>' },
    pinterest: { bg: '#fff', ic: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#e60023"/><path fill="#fff" d="M12.4 5.8c-3.5 0-5.3 2.5-5.3 4.6 0 1.3.5 2.4 1.5 2.8.2.1.3 0 .4-.2l.1-.6c.1-.2 0-.3-.1-.5-.3-.4-.5-.9-.5-1.6 0-2 1.5-3.9 4-3.9 2.2 0 3.4 1.3 3.4 3.1 0 2.4-1 4.3-2.6 4.3-.9 0-1.5-.7-1.3-1.6.2-1 .7-2.1.7-2.9 0-.6-.4-1.2-1.1-1.2-.9 0-1.6.9-1.6 2.2 0 .8.3 1.3.3 1.3l-1.1 4.6c-.3 1.4 0 3 0 3.2 0 .1.1.1.2 0 .1-.1 1.1-1.4 1.4-2.6l.6-2.2c.3.5 1.1 1 2 1 2.6 0 4.4-2.4 4.4-5.6 0-2.4-2-4.7-5.4-4.7z"/></svg>' },
    custom: { bg: '#8e8e93', ic: '' }
  };
  var NF_NEW = { app: 'messages', icon: '', pic: '', title: '', body: '', time: '', more: '' };

  TOOLS.push({
    id: 'notifs',
    label: 'notifications',
    defaults: {
      clock: '9:41', battery: 80, showPct: false, wall: '', date: '', glass: 'light', lockIcon: true,
      list: []
    },
    fields: [
      U.STATUS_FIELDS,
      { key: 'wall', type: 'image', label: 'wallpaper', max: 1400 },
      { type: 'row', fields: [
        { key: 'date', type: 'text', label: 'date', placeholder: 'Tuesday, October 14' },
        { key: 'glass', type: 'select', label: 'bubbles', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'lockIcon', type: 'toggle', label: 'lock' }
      ] },
      { type: 'head', label: 'notifications' },
      { key: 'list', type: 'list',
        adds: [{ label: '+ notification', item: item(NF_NEW) }],
        item: [
          { type: 'row', fields: [
            { key: 'app', type: 'select', label: 'app', options: Object.keys(NF_APPS).map(function (k) { return [k, k]; }) },
            { key: 'time', type: 'text', label: 'time', placeholder: 'now' }
          ] },
          { key: 'icon', type: 'image', label: 'own app icon', max: 200 },
          { key: 'pic', type: 'image', label: 'person pic (app icon goes small)', max: 200 },
          { key: 'title', type: 'text', label: 'title / name' },
          { key: 'body', type: 'textarea', label: 'message', rows: 2 },
          { key: 'more', type: 'text', label: 'stacked (how many more)', placeholder: '3' }
        ] }
    ],
    render: function (s) {
      var cards = (s.list || []).map(function (n, i) {
        var pre = 'list.' + i + '.', app = NF_APPS[n.app] || NF_APPS.custom;
        var icon = n.icon ? '<img class="nf-icon" src="' + n.icon + '"' + DI(pre + 'icon') + ' alt="">'
          : '<span class="nf-icon" style="background:' + app.bg + '"' + DI(pre + 'icon') + '>' + app.ic + '</span>';
        var lead = n.pic ? '<span class="nf-lead"><img class="nf-pic" src="' + n.pic + '"' + DI(pre + 'pic') + ' alt="">' + icon.replace('nf-icon', 'nf-icon mini') + '</span>' : '<span class="nf-lead">' + icon + '</span>';
        var more = num(n.more, 0);
        return '<div class="nf-stack' + (more ? ' st' + Math.min(2, more) : '') + '"><div class="nf-card">' + lead +
          '<div class="nf-main"><div class="nf-top"><b>' + E(pre + 'title', n.title) + '</b><span>' + E(pre + 'time', n.time) + '</span></div>' +
          '<div class="nf-body">' + EB(pre + 'body', n.body) + '</div>' +
          (bare(n.more) ? '<div class="nf-more">' + E(pre + 'more', n.more) + ' more notification' + (more === 1 ? '' : 's') + '</div>' : '') + '</div></div>' +
          (more ? '<i class="nf-under u1"></i>' + (more > 1 ? '<i class="nf-under u2"></i>' : '') : '') + '</div>';
      }).join('');
      return '<div class="shot nf g-' + s.glass + '">' + (s.wall ? '<img class="nf-wall" src="' + s.wall + '"' + DI('wall') + ' alt="">' : '<div class="nf-wall"' + DI('wall') + '></div>') +
        '<div class="nf-ui">' + U.statusBar(s) + (s.lockIcon ? '<div class="nf-lock">' + I.lock + '</div>' : '') +
        '<div class="nf-date">' + E('date', s.date) + '</div><div class="nf-time">' + esc(bare(s.clock)) + '</div>' +
        '<div class="nf-grow"></div><div class="nf-list">' + cards + '</div>' +
        '<div class="nf-bottom"><span>' + I.flash + '</span><span>' + I.lockCam + '</span></div><div class="nf-home"></div></div></div>';
    }
  });
})();
