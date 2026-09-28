/* screenies — calls/facetime, profiles, amazon, game text boxes, now playing lock screen, minecraft */

(function () {
  var esc = U.esc, br = U.br, ava = U.avatar;

  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function fill(d, vb) { return '<svg viewBox="' + (vb || '0 0 24 24') + '"><path d="' + d + '"/></svg>'; }

  var HANDSET = 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z';
  var C = {
    phone: fill(HANDSET),
    hang: '<svg viewBox="0 0 24 24"><path transform="rotate(135 12 12)" d="' + HANDSET + '"/></svg>',
    video: fill('M3 7.5A2.5 2.5 0 0 1 5.5 5h8A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 16.5zM17 10l4-2.5v9L17 14z'),
    clock: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', 1.8),
    bubble: fill('M12 3.5c5 0 9 3.4 9 7.8S17 19 12 19c-1 0-2-.1-2.9-.4L4 21l1.5-4.1C4 15.4 3 13.4 3 11.3 3 6.9 7 3.5 12 3.5z'),
    speaker: fill('M4 9h4l5-4.5v15L8 15H4zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12').replace('<path', '<path stroke="currentColor" stroke-width="1.6" stroke-linecap="round"'),
    mic: fill('M12 2.5a3.2 3.2 0 0 1 3.2 3.2v5.6a3.2 3.2 0 0 1-6.4 0V5.7A3.2 3.2 0 0 1 12 2.5zM6 11a6 6 0 0 0 12 0M12 17v4').replace('<path', '<path stroke="currentColor" stroke-width="1.7" stroke-linecap="round"'),
    cam: fill('M3 7.5A2.5 2.5 0 0 1 5.5 5h8A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 16.5zM17 10l4-2.5v9L17 14z'),
    share: stroke('M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c.4-3 2.5-5 5-5s4.6 2 5 5M16 11a3 3 0 1 0 0-6M17 14c2.3.4 3.7 2.2 4 5', 1.8),
    keypad: '<svg viewBox="0 0 24 24">' + [5, 12, 19].map(function (y) { return [5, 12, 19].map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="2"/>'; }).join(''); }).join('') + '</svg>',
    add: stroke('M12 5v14M5 12h14', 2),
    facetime: fill('M3 7.5A2.5 2.5 0 0 1 5.5 5h8A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 16.5zM17 10l4-2.5v9L17 14z'),
    flash: fill('M9 2h6v3l-1.5 3v12a1.5 1.5 0 0 1-1.5 1.5h0A1.5 1.5 0 0 1 10.5 20V8L9 5z'),
    camera: fill('M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5zM12 16a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z'),
    prev: fill('M11 12 20 6v12zM2 12l9-6v12z'),
    next: fill('M13 12 4 6v12zM22 12l-9-6v12z'),
    pause: fill('M6 4.5h4v15H6zM14 4.5h4v15h-4z'),
    play: fill('M7 4.5 20 12 7 19.5z'),
    airplay: stroke('M6 17H4.5A1.5 1.5 0 0 1 3 15.5v-10A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v10a1.5 1.5 0 0 1-1.5 1.5H18M12 15l4.5 5h-9z', 1.7),
    chev: stroke('M9 5l7 7-7 7', 2.2),
    down: stroke('M6 9.5l6 6 6-6', 2),
    grid: stroke('M4 4h16v16H4zM4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16', 1.6),
    reels: stroke('M4 4h16v16H4zM4 8.5h16M9 4l2.5 4.5M14 4l2.5 4.5M10.5 11.5v5l4-2.5z', 1.6),
    tagged: stroke('M4 4h16v13h-5.5L12 20l-2.5-3H4zM12 11a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6zM7.5 15c.8-1.7 2.5-2.6 4.5-2.6s3.7.9 4.5 2.6', 1.6),
    personAdd: stroke('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M19 8v6M16 11h6', 1.8),
    menu: stroke('M4 7h16M4 12h16M4 17h16', 2),
    back: stroke('M15 5l-7 7 7 7', 2.2),
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    link: stroke('M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1', 1.8),
    cal: stroke('M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8 3v4M16 3v4', 1.6),
    playSmall: stroke('M7 5l12 7-12 7z', 1.8),
    star: fill('M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z')
  };

  /* ============================== calls + facetime ============================== */

  TOOLS.push({
    id: 'calls',
    label: 'calls / facetime',
    defaults: { mode: 'incoming', name: '', label: '', photo: '', bg: '', selfie: '', timer: '', clock: '9:41', battery: 80, showPct: false },
    fields: [
      { key: 'mode', type: 'select', label: 'screen', options: [['incoming', 'incoming call'], ['ftIncoming', 'incoming facetime'], ['facetime', 'on facetime'], ['oncall', 'on a phone call']] },
      { key: 'photo', type: 'image', label: 'their photo', max: 600 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'label', type: 'text', label: 'under name', placeholder: 'mobile' }
      ] },
      { key: 'bg', type: 'image', label: 'background / their camera', max: 1400 },
      { key: 'selfie', type: 'image', label: 'your camera (facetime)', max: 700 },
      { key: 'timer', type: 'text', label: 'call time', placeholder: '12:34' },
      U.STATUS_FIELDS
    ],
    render: function (s) {
      var m = s.mode, bgSrc = s.bg || (m === 'incoming' || m === 'oncall' ? s.photo : '');
      var blurBg = (m === 'incoming' || m === 'oncall') && !s.bg && s.photo;
      var bg = bgSrc ? '<img class="call-bg' + (blurBg ? ' blur' : '') + '" src="' + bgSrc + '"' + DI(s.bg ? 'bg' : 'photo') + ' alt="">' : '<div class="call-bg"' + DI('bg') + '></div>';
      var dim = '<div class="call-dim ' + m + '"></div>';
      function btn(icon, label, cls) {
        return '<div class="call-b ' + (cls || '') + '"><span>' + icon + '</span>' + (label ? '<i>' + label + '</i>' : '') + '</div>';
      }
      var top, bottom = '';
      if (m === 'incoming' || m === 'ftIncoming') {
        top = '<div class="call-top">' + (m === 'ftIncoming' ? '<div class="call-kind">FaceTime Video</div>' : '') +
          '<div class="call-name">' + E('name', s.name) + '</div>' + (s.label ? '<div class="call-label">' + E('label', s.label) + '</div>' : '') + '</div>';
        bottom = '<div class="call-small">' + btn(C.clock, 'Remind Me', 'sm') + btn(C.bubble, 'Message', 'sm') + '</div>' +
          '<div class="call-big">' + btn(C.hang, 'Decline', 'red') + btn(m === 'ftIncoming' ? C.video : C.phone, 'Accept', 'green') + '</div>';
      } else if (m === 'oncall') {
        top = '<div class="call-top center">' + (s.photo ? '<img class="call-ava" src="' + s.photo + '"' + DI('photo') + ' alt="">' : '') +
          '<div class="call-name">' + E('name', s.name) + '</div><div class="call-label">' + (s.timer ? E('timer', s.timer) : E('label', s.label)) + '</div></div>';
        bottom = '<div class="call-pad">' + btn(C.speaker, 'speaker') + btn(C.facetime, 'FaceTime') + btn(C.mic, 'mute') +
          btn(C.add, 'add') + btn(C.hang, 'End', 'red') + btn(C.keypad, 'keypad') + '</div>';
      } else {
        top = '<div class="ft-panel"><div class="ft-who">' + (s.photo ? '<img src="' + s.photo + '"' + DI('photo') + ' alt="">' : '') +
          '<div><b>' + E('name', s.name) + '</b><span>' + (s.timer ? E('timer', s.timer) : 'FaceTime Video') + ' ›</span></div></div>' +
          '<div class="ft-ctrls">' + btn(C.bubble, '', 'glass') + btn(C.speaker, '', 'glass') + btn(C.mic, '', 'glass') +
          btn(C.cam, '', 'glass') + btn(C.share, '', 'glass') + btn(C.hang, '', 'red') + '</div></div>';
        bottom = s.selfie ? '<img class="ft-self" src="' + s.selfie + '"' + DI('selfie') + ' alt="">' : '<div class="ft-self empty"' + DI('selfie') + '></div>';
      }
      return '<div class="shot call t-' + m + '">' + bg + dim + '<div class="call-ui">' + U.statusBar(s) + top + '<div class="call-grow"></div>' + bottom +
        '<div class="call-home"></div></div></div>';
    }
  });

  /* ============================== profiles ============================== */

  var PROFILE_NEW = { image: '', views: '' };

  TOOLS.push({
    id: 'profile',
    label: 'profiles',
    defaults: {
      app: 'instagram', theme: 'light', pfp: '', banner: '', name: '', user: '', verified: false, bio: '', link: '',
      posts: '', followers: '', following: '', likes: '', friends: '', joined: '', followed: false,
      highlights: [], grid: []
    },
    fields: [
      { type: 'row', fields: [
        { key: 'app', type: 'select', label: 'app', options: [['instagram', 'instagram'], ['tiktok', 'tiktok'], ['facebook', 'facebook'], ['x', 'x / twitter']] },
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] }
      ] },
      { key: 'pfp', type: 'image', label: 'pfp', max: 400 },
      { key: 'banner', type: 'image', label: 'cover / banner (facebook, x)', max: 1500 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'user', type: 'text', label: 'username' },
        { key: 'verified', type: 'toggle', label: 'check' }
      ] },
      { key: 'bio', type: 'textarea', label: 'bio', rows: 3 },
      { key: 'link', type: 'text', label: 'link' },
      { type: 'row', fields: [
        { key: 'posts', type: 'text', label: 'posts' },
        { key: 'followers', type: 'text', label: 'followers' },
        { key: 'following', type: 'text', label: 'following' }
      ] },
      { type: 'row', fields: [
        { key: 'likes', type: 'text', label: 'likes (tiktok)' },
        { key: 'friends', type: 'text', label: 'friends (fb)' },
        { key: 'joined', type: 'text', label: 'joined (x)' }
      ] },
      { key: 'followed', type: 'toggle', label: 'already following' },
      { type: 'head', label: 'highlights (instagram)' },
      { key: 'highlights', type: 'list', compact: true, adds: [{ label: '+ highlight', item: item({ image: '', label: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'label', type: 'text', label: 'name' },
          { key: 'image', type: 'image', label: 'cover', max: 300 }
        ] }
      ] },
      { type: 'head', label: 'posts grid' },
      { key: 'grid', type: 'list', compact: true, adds: [{ label: '+ post', item: item(PROFILE_NEW) }], item: [
        { type: 'row', fields: [
          { key: 'image', type: 'image', label: 'picture', max: 700 },
          { key: 'views', type: 'text', label: 'views (tiktok)' }
        ] }
      ] }
    ],
    render: function (s) {
      var badge = s.verified ? '<span class="pf-badge">' + ICON.verified + '</span>' : '';
      var user = String(s.user || '').replace(/^@/, '');
      var grid = (s.grid || []).map(function (g, _i) {
        return '<div class="pf-cell">' + (g.image ? '<img src="' + g.image + '"' + DI('grid.' + _i + '.image') + ' alt="">' : '') +
          (s.app === 'tiktok' && g.views ? '<span class="pf-views">' + C.playSmall + E('grid.' + _i + '.views', g.views) + '</span>' : '') + '</div>';
      }).join('');
      function stat(k, l) { return '<div class="pf-stat"><b>' + E(k, s[k]) + '</b><span>' + l + '</span></div>'; }
      var linkRow = s.link ? '<div class="pf-link">' + C.link + E('link', s.link) + '</div>' : '';
      var t = ' t-' + s.theme;

      if (s.app === 'tiktok') {
        return '<div class="shot pf tk' + t + '"><div class="pf-bar"><span>' + C.personAdd + '</span><b>' + E('name', s.name) + C.down + '</b><span>' + C.menu + '</span></div>' +
          '<div class="tk-head">' + ava(s.pfp, s.name || user, 'tk-pfp', undefined, 'pfp') + '<div class="tk-user">@' + E('user', user) + badge + '</div>' +
          '<div class="tk-stats">' + stat('following', 'Following') + stat('followers', 'Followers') + stat('likes', 'Likes') + '</div>' +
          '<div class="tk-btns"><span class="' + (s.followed ? 'gray' : 'red') + '">' + (s.followed ? 'Following' : 'Follow') + '</span><span class="gray">Message</span><span class="gray sq">' + C.down + '</span></div>' +
          (s.bio ? '<div class="tk-bio">' + EB('bio', s.bio) + '</div>' : '') + linkRow + '</div>' +
          '<div class="pf-tabs"><span class="on">' + C.grid + '</span><span>' + C.tagged + '</span></div><div class="pf-grid tk-grid">' + grid + '</div></div>';
      }

      if (s.app === 'facebook') {
        return '<div class="shot pf fbp' + t + '"><div class="fbp-cover">' + (s.banner ? '<img src="' + s.banner + '"' + DI('banner') + ' alt="">' : '') + '</div>' +
          '<div class="fbp-main">' + ava(s.pfp, s.name, 'fbp-pfp', undefined, 'pfp') + '<div class="fbp-name">' + E('name', s.name) + badge + '</div>' +
          (s.friends ? '<div class="fbp-friends"><b>' + E('friends', s.friends) + '</b> friends</div>' : '') +
          '<div class="fbp-btns"><span class="blue">' + (s.followed ? 'Friends' : '+ Add friend') + '</span><span>' + C.bubble + 'Message</span><span class="sq">' + C.dots + '</span></div>' +
          (s.bio ? '<div class="fbp-bio">' + EB('bio', s.bio) + '</div>' : '') + linkRow + '</div>' +
          (grid ? '<div class="fbp-photos"><b>Photos</b><div class="pf-grid fbp-grid">' + grid + '</div></div>' : '') + '</div>';
      }

      if (s.app === 'x') {
        return '<div class="shot pf xp' + t + '"><div class="xp-banner">' + (s.banner ? '<img src="' + s.banner + '"' + DI('banner') + ' alt="">' : '') + '</div>' +
          '<div class="xp-main"><div class="xp-row">' + ava(s.pfp, s.name, 'xp-pfp', undefined, 'pfp') + '<span class="xp-follow' + (s.followed ? ' on' : '') + '">' + (s.followed ? 'Following' : 'Follow') + '</span></div>' +
          '<div class="xp-name">' + E('name', s.name) + badge + '</div><div class="xp-user">@' + E('user', user) + '</div>' +
          (s.bio ? '<div class="xp-bio">' + EB('bio', s.bio) + '</div>' : '') +
          '<div class="xp-meta">' + (s.link ? '<span class="xp-l">' + C.link + E('link', s.link) + '</span>' : '') + (s.joined ? '<span>' + C.cal + 'Joined ' + E('joined', s.joined) + '</span>' : '') + '</div>' +
          '<div class="xp-counts"><span><b>' + E('following', s.following) + '</b> Following</span><span><b>' + E('followers', s.followers) + '</b> Followers</span></div></div>' +
          '<div class="xp-tabs"><span class="on">Posts</span><span>Replies</span><span>Highlights</span><span>Media</span><span>Likes</span></div></div>';
      }

      var hl = (s.highlights || []).map(function (h, _i) {
        return '<div class="ig-hl"><div class="ig-hlimg">' + (h.image ? '<img src="' + h.image + '"' + DI('highlights.' + _i + '.image') + ' alt="">' : '') + '</div><span>' + E('highlights.' + _i + '.label', h.label) + '</span></div>';
      }).join('');
      return '<div class="shot pf igp' + t + '"><div class="pf-bar"><span>' + C.back + '</span><b>' + E('user', user) + badge + '</b><span>' + C.dots + '</span></div>' +
        '<div class="igp-top">' + ava(s.pfp, s.name || user, 'igp-pfp', undefined, 'pfp') + '<div class="igp-right"><div class="igp-name">' + E('name', s.name) + '</div>' +
        '<div class="igp-stats">' + stat('posts', 'posts') + stat('followers', 'followers') + stat('following', 'following') + '</div></div></div>' +
        (s.bio ? '<div class="igp-bio">' + EB('bio', s.bio) + '</div>' : '') + linkRow +
        '<div class="igp-btns"><span class="' + (s.followed ? 'gray' : 'blue') + '">' + (s.followed ? 'Following' : 'Follow') + '</span><span class="gray">Message</span><span class="gray sq">' + C.personAdd + '</span></div>' +
        (hl ? '<div class="ig-hls">' + hl + '</div>' : '') +
        '<div class="pf-tabs"><span class="on">' + C.grid + '</span><span>' + C.reels + '</span><span>' + C.tagged + '</span></div>' +
        '<div class="pf-grid">' + grid + '</div></div>';
    }
  });

  /* ============================== amazon review ============================== */

  TOOLS.push({
    id: 'amazon',
    label: 'amazon review',
    defaults: { product: '', productTitle: '', pfp: '', name: '', stars: 5, headline: '', date: '', variant: '', verified: true, text: '', images: [], helpful: '' },
    fields: [
      { key: 'product', type: 'image', label: 'product picture', max: 500 },
      { key: 'productTitle', type: 'text', label: 'product name' },
      { key: 'pfp', type: 'image', label: 'reviewer pfp', max: 200 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'reviewer name' },
        { key: 'stars', type: 'select', label: 'stars', options: [['5', '★★★★★'], ['4', '★★★★'], ['3', '★★★'], ['2', '★★'], ['1', '★']] }
      ] },
      { key: 'headline', type: 'text', label: 'review title' },
      { key: 'date', type: 'text', label: 'date', placeholder: 'September 27, 2026' },
      { type: 'row', fields: [
        { key: 'variant', type: 'text', label: 'size / color', placeholder: 'Size: M | Color: Black' },
        { key: 'verified', type: 'toggle', label: 'verified' }
      ] },
      { key: 'text', type: 'textarea', label: 'review', rows: 4 },
      { key: 'helpful', type: 'text', label: 'people found helpful' },
      { type: 'head', label: 'review pictures' },
      { key: 'images', type: 'list', compact: true, adds: [{ label: '+ picture', item: item({ image: '' }) }], item: [
        { key: 'image', type: 'image', label: 'picture', max: 600 }
      ] }
    ],
    render: function (s) {
      var n = +s.stars || 0, stars = '';
      for (var k = 1; k <= 5; k++) stars += '<span class="az-star' + (k <= n ? ' on' : '') + '">' + C.star + '</span>';
      var imgs = (s.images || []).map(function (x, i) { return x.image ? '<img src="' + x.image + '"' + DI('images.' + i + '.image') + ' alt="">' : ''; }).join('');
      var helpful = s.helpful ? (s.helpful === '1' ? 'One person found this helpful' : E('helpful', s.helpful) + ' people found this helpful') : '';
      return '<div class="shot az">' +
        (s.product || s.productTitle ? '<div class="az-prod">' + (s.product ? '<img src="' + s.product + '"' + DI('product') + ' alt="">' : '') + '<span>' + E('productTitle', s.productTitle) + '</span></div>' : '') +
        '<div class="az-who">' + (s.pfp ? '<img class="az-pfp" src="' + s.pfp + '"' + DI('pfp') + ' alt="">' : '<div class="az-pfp az-nopfp">' + stroke('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.6-4 3.8-6.5 8-6.5s7.4 2.5 8 6.5', 1.6) + '</div>') + '<span>' + E('name', s.name) + '</span></div>' +
        '<div class="az-head"><span class="az-stars">' + stars + '</span><b>' + E('headline', s.headline) + '</b></div>' +
        (s.date ? '<div class="az-date">Reviewed in the United States on ' + E('date', s.date) + '</div>' : '') +
        '<div class="az-meta">' + (s.variant ? '<span>' + E('variant', s.variant) + '</span>' : '') + (s.variant && s.verified ? '<i></i>' : '') +
        (s.verified ? '<b>Verified Purchase</b>' : '') + '</div>' +
        '<div class="az-text">' + EB('text', s.text) + '</div>' +
        (imgs ? '<div class="az-imgs">' + imgs + '</div>' : '') +
        (helpful ? '<div class="az-helpful">' + helpful + '</div>' : '') +
        '<div class="az-btns"><span class="az-btn">Helpful</span><i></i><span>Report</span></div></div>';
    }
  });

  /* ============================== game text boxes ============================== */

  TOOLS.push({
    id: 'gametext',
    label: 'game text',
    defaults: { game: 'stardew', bg: '', portrait: '', name: '', text: '' },
    fields: [
      { key: 'game', type: 'select', label: 'game', options: [['stardew', 'stardew valley'], ['pokemon', 'pokemon'], ['undertale', 'undertale']] },
      { key: 'bg', type: 'image', label: 'scene behind', max: 1400 },
      { key: 'portrait', type: 'image', label: 'portrait / face', max: 500 },
      { key: 'name', type: 'text', label: 'name' },
      { key: 'text', type: 'textarea', label: 'text', rows: 4 }
    ],
    render: function (s) {
      var bg = s.bg ? '<img class="gt-bg" src="' + s.bg + '"' + DI('bg') + ' alt="">' : '';
      var box;
      if (s.game === 'pokemon') {
        box = '<div class="pk-box"><div class="pk-in">' + (s.name ? E('name', s.name) + ': ' : '') + EB('text', s.text) + '<span class="pk-arrow"></span></div></div>';
      } else if (s.game === 'undertale') {
        var lines = String(s.text || '').split('\n').map(function (l) { return l.trim() ? '<div class="ut-line"><span>*</span><span>' + esc(l) + '</span></div>' : '<br>'; }).join('');
        box = '<div class="ut-box">' + (s.portrait ? '<img class="ut-face" src="' + s.portrait + '"' + DI('portrait') + ' alt="">' : '') + '<div class="ut-text">' + lines + '</div></div>';
      } else {
        box = '<div class="sv-wrap"><div class="sv-box"><div class="sv-text">' + EB('text', s.text) + '</div></div>' +
          (s.portrait || s.name ? '<div class="sv-side"><div class="sv-portrait">' + (s.portrait ? '<img src="' + s.portrait + '"' + DI('portrait') + ' alt="">' : '') + '</div>' +
          '<div class="sv-name">' + E('name', s.name) + '</div></div>' : '') + '</div>';
      }
      return '<div class="shot gt g-' + s.game + '">' + bg + box + '</div>';
    }
  });

  /* ============================== now playing lock screen ============================== */

  TOOLS.push({
    id: 'lockscreen',
    label: 'now playing',
    defaults: {
      wallpaper: '', cover: '', title: '', artist: '', date: '', clock: '9:41', battery: 80, showPct: false,
      elapsed: '', remaining: '', progress: 35, playing: true
    },
    fields: [
      { key: 'wallpaper', type: 'image', label: 'wallpaper (blank = blurry cover)', max: 1400 },
      { key: 'cover', type: 'image', label: 'album cover', max: 600 },
      { type: 'row', fields: [
        { key: 'title', type: 'text', label: 'song' },
        { key: 'artist', type: 'text', label: 'artist' }
      ] },
      { key: 'date', type: 'text', label: 'date', placeholder: 'Saturday, September 27' },
      { type: 'row', fields: [
        { key: 'elapsed', type: 'text', label: 'time played', placeholder: '1:12' },
        { key: 'remaining', type: 'text', label: 'time left', placeholder: '-2:31' },
        { key: 'playing', type: 'toggle', label: 'playing' }
      ] },
      { key: 'progress', type: 'range', label: 'song progress', min: 0, max: 100, step: 1 },
      U.STATUS_FIELDS
    ],
    render: function (s) {
      var wall = s.wallpaper || s.cover;
      var pct = Math.max(0, Math.min(100, +s.progress || 0));
      return '<div class="shot ls">' + (wall ? '<img class="ls-wall' + (s.wallpaper ? '' : ' blur') + '" src="' + wall + '"' + DI(s.wallpaper ? 'wallpaper' : 'cover') + ' alt="">' : '<div class="ls-wall"' + DI('wallpaper') + '></div>') +
        '<div class="ls-ui">' + U.statusBar(s) +
        '<div class="ls-date">' + E('date', s.date) + '</div><div class="ls-time">' + esc(s.clock) + '</div><div class="ls-grow"></div>' +
        '<div class="ls-np">' + (s.cover ? '<img class="ls-npbg" src="' + s.cover + '"' + DI('cover') + ' alt="">' : '') + '<div class="ls-npin">' +
        '<div class="ls-row">' + (s.cover ? '<img class="ls-art" src="' + s.cover + '"' + DI('cover') + ' alt="">' : '<div class="ls-art"></div>') +
        '<div class="ls-song"><b>' + E('title', s.title) + '</b><span>' + E('artist', s.artist) + '</span></div><span class="ls-air">' + C.airplay + '</span></div>' +
        '<div class="ls-bar"><i style="width:' + pct + '%"></i></div><div class="ls-times"><span>' + E('elapsed', s.elapsed) + '</span><span>' + E('remaining', s.remaining) + '</span></div>' +
        '<div class="ls-ctrls">' + C.prev + (s.playing ? C.pause : C.play) + C.next + '</div></div></div>' +
        '<div class="ls-bottom"><span>' + C.flash + '</span><span>' + C.camera + '</span></div><div class="ls-home"></div></div></div>';
    }
  });

  /* ============================== minecraft ============================== */

  var MC_COLORS = [['#ffffff', 'white'], ['#ffff55', 'yellow'], ['#ffaa00', 'gold'], ['#ff5555', 'red'], ['#55ff55', 'green'],
    ['#55ffff', 'aqua'], ['#5555ff', 'blue'], ['#ff55ff', 'pink'], ['#aa00aa', 'purple'], ['#aaaaaa', 'gray']];

  TOOLS.push({
    id: 'minecraft',
    label: 'minecraft',
    defaults: { bg: '', toast: true, toastType: 'advancement', toastText: '', toastIcon: '', lines: [] },
    fields: [
      { key: 'bg', type: 'image', label: 'game screenshot behind', max: 1600 },
      { type: 'head', label: 'popup' },
      { type: 'row', fields: [
        { key: 'toastType', type: 'select', label: 'kind', options: [['advancement', 'Advancement Made!'], ['goal', 'Goal Reached!'], ['challenge', 'Challenge Complete!'], ['achievement', 'Achievement get! (old)']] },
        { key: 'toast', type: 'toggle', label: 'show' }
      ] },
      { key: 'toastText', type: 'text', label: 'popup text' },
      { key: 'toastIcon', type: 'image', label: 'item icon', max: 128 },
      { type: 'head', label: 'chat' },
      { key: 'lines', type: 'list', adds: [{ label: '+ chat line', item: item({ name: '', color: '#ffffff', text: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'name', type: 'text', label: 'player (blank = server msg)' },
          { key: 'color', type: 'select', label: 'text color', options: MC_COLORS }
        ] },
        { key: 'text', type: 'text', label: 'message' }
      ] }
    ],
    render: function (s) {
      var chat = (s.lines || []).map(function (l, _i) {
        return '<div class="mc-line" style="color:' + esc(l.color || '#fff') + '">' + (l.name ? '&lt;' + E('lines.' + _i + '.name', l.name) + '&gt; ' : '') + E('lines.' + _i + '.text', l.text) + '</div>';
      }).join('');
      var kinds = { advancement: 'Advancement Made!', goal: 'Goal Reached!', challenge: 'Challenge Complete!', achievement: 'Achievement get!' };
      var toast = s.toast && (s.toastText || s.toastIcon) ? '<div class="mc-toast k-' + s.toastType + '">' +
        '<div class="mc-icon">' + (s.toastIcon ? '<img src="' + s.toastIcon + '"' + DI('toastIcon') + ' alt="">' : '') + '</div>' +
        '<div><div class="mc-ttitle">' + kinds[s.toastType] + '</div><div class="mc-ttext">' + E('toastText', s.toastText) + '</div></div></div>' : '';
      return '<div class="shot mc">' + (s.bg ? '<img class="mc-bg" src="' + s.bg + '"' + DI('bg') + ' alt="">' : '') + toast +
        '<div class="mc-chat">' + chat + '</div></div>';
    }
  });

  /* tab order */
  var ORDER = ['spotify', 'applemusic', 'lockscreen', 'tweet', 'imessage', 'calls', 'igdm', 'igcomments', 'profile', 'tiktok', 'twitch',
    'youtube', 'reddit', 'facebook', 'pinterest', 'whisper', 'brat', 'snapchat', 'discord', 'chatgpt', 'claude', 'google', 'amazon',
    'gametext', 'minecraft', 'tumblr', 'notes'];
  TOOLS.sort(function (a, b) {
    var x = ORDER.indexOf(a.id), y = ORDER.indexOf(b.id);
    return (x < 0 ? 999 : x) - (y < 0 ? 999 : y);
  });
})();
