/* screenies — the social ones: instagram comments + dms, tiktok, youtube, reddit, facebook, snapchat */

(function () {
  var esc = U.esc, br = U.br, ava = U.avatar;

  function tags(t, cls) {
    return br(t).replace(/(^|[\s>(])([@#][\w.À-￿]+)/g, '$1<span class="' + cls + '">$2</span>');
  }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function flip(svg) { return svg.replace('<path', '<path transform="rotate(180 12 12)"'); }

  var I = {
    back: stroke('M20 12H4.5M11 5l-7 7 7 7', 2.1),
    phone: stroke('M5.2 3.5h3.3l1.7 4.3-2.2 1.4a12 12 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7v3.3a1.7 1.7 0 0 1-1.8 1.7A17 17 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8z'),
    video: stroke('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5zM16 10.5l5-3v9l-5-3'),
    image: stroke('M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 16l4.5-4.5 4 4L15 13l5 5M15.5 9.5h.01'),
    sticker: stroke('M20.5 12A8.5 8.5 0 1 1 12 3.5M20.5 12h-4.5a4 4 0 0 0-4 4v4.5M20.5 12A8.5 8.5 0 0 0 12 3.5M9 10h.01M15 10h.01'),
    mic: stroke('M12 3.5a2.8 2.8 0 0 1 2.8 2.8v5.4a2.8 2.8 0 0 1-5.6 0V6.3A2.8 2.8 0 0 1 12 3.5zM6 11.5a6 6 0 0 0 12 0M12 17.5v3'),
    camera: '<svg viewBox="0 0 24 24"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="12.8" r="3.3" fill="#fff"/></svg>',
    heart: stroke('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z'),
    heartFull: '<svg viewBox="0 0 24 24"><path d="M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z"/></svg>',
    thumb: stroke('M7.5 10.5v9.5M7.5 10.5 11 3.5c1.4 0 2.4 1.2 2.2 2.6L12.8 9h5.4a2 2 0 0 1 2 2.4l-1.4 6.9A2 2 0 0 1 16.8 20H7.5M3.5 10.5h4V20h-4z', 1.7),
    bubble: stroke('M12 3.5c5 0 9 3.4 9 7.8S17 19 12 19c-1 0-2-.1-2.9-.4L4 21l1.5-4.1C4 15.4 3 13.4 3 11.3 3 6.9 7 3.5 12 3.5z', 1.7),
    share: stroke('M14 4.5 21 11l-7 6.5V14c-5 0-8.5 1.5-11 5.5 1-5.5 4-10 11-11z', 1.7),
    send: stroke('M21 3 3 10.5l7 2.8L21 3zM21 3l-7.7 18-3.3-7.7'),
    up: stroke('M12 3.8 4.5 12.5H9V20h6v-7.5h4.5z', 1.6),
    upFull: '<svg viewBox="0 0 24 24"><path d="M12 3.8 4.5 12.5H9V20h6v-7.5h4.5z"/></svg>',
    globe: stroke('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z', 1.6),
    friends: stroke('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5c2 .6 3.3 2.4 3.5 5.5', 1.6),
    pin: stroke('M9 3.5h6l-1 6 3.5 3.5v1h-11v-1L10 9.5zM12 14v6.5', 1.7),
    sort: stroke('M4 7h16M4 12h11M4 17h6', 2),
    x: stroke('M6 6l12 12M18 6 6 18', 2),
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    at: stroke('M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1'),
    smile: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01'),
    down: stroke('M6 9.5l6 6 6-6', 2),
    chevron: stroke('M15 5l-7 7 7 7', 2.4),
    snapCam: stroke('M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5zM12 16a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z', 1.8)
  };
  var BADGE = '<span class="vbadge">' + ICON.verified + '</span>';

  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }

  /* ============================== instagram comments ============================== */

  var IGC_NEW = { avatar: '', user: '', badge: false, text: '', time: '', likes: '', liked: false, reply: false, more: '' };

  TOOLS.push({
    id: 'igcomments',
    label: 'ig comments',
    defaults: {
      theme: 'light', head: true, input: true, me: '',
      list: []
    },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'head', type: 'toggle', label: 'top' },
        { key: 'input', type: 'toggle', label: 'comment bar' }
      ] },
      { key: 'me', type: 'image', label: 'your pfp (comment bar)', max: 200 },
      { type: 'head', label: 'comments' },
      { key: 'list', type: 'list', adds: [{ label: '+ comment', item: item(IGC_NEW) }], item: [
        { key: 'avatar', type: 'image', label: 'pfp', max: 200 },
        { type: 'row', fields: [
          { key: 'user', type: 'text', label: 'username' },
          { key: 'badge', type: 'toggle', label: 'check' }
        ] },
        { key: 'text', type: 'textarea', label: 'comment', rows: 2 },
        { type: 'row', fields: [
          { key: 'time', type: 'text', label: 'time' },
          { key: 'likes', type: 'text', label: 'likes' },
          { key: 'more', type: 'text', label: 'more replies' }
        ] },
        { type: 'row', fields: [
          { key: 'liked', type: 'toggle', label: 'liked' },
          { key: 'reply', type: 'toggle', label: 'is a reply' }
        ] }
      ] }
    ],
    render: function (s) {
      var out = (s.list || []).map(function (c, _i) {
        return '<div class="igc-c' + (c.reply ? ' reply' : '') + '">' + ava(c.avatar, c.user, 'igc-ava', undefined, 'list.' + _i + '.avatar') +
          '<div class="igc-main"><div class="igc-top"><b>' + E('list.' + _i + '.user', c.user) + '</b>' + (c.badge ? BADGE : '') +
          '<span>' + E('list.' + _i + '.time', c.time) + '</span></div>' +
          '<div class="igc-text">' + EW('list.' + _i + '.text', tags(c.text, 'igc-at')) + '</div>' +
          '<div class="igc-sub">Reply</div>' +
          (c.more ? '<div class="igc-more"><i></i>View ' + E('list.' + _i + '.more', c.more) + ' more ' + (c.more === '1' ? 'reply' : 'replies') + '</div>' : '') +
          '</div><div class="igc-like' + (c.liked ? ' on' : '') + '">' + (c.liked ? I.heartFull : I.heart) +
          (c.likes ? '<span>' + E('list.' + _i + '.likes', c.likes) + '</span>' : '') + '</div></div>';
      }).join('');
      return '<div class="shot igc t-' + s.theme + '">' +
        (s.head ? '<div class="igc-head"><i></i><b>Comments</b></div>' : '') +
        '<div class="igc-list">' + out + '</div>' +
        (s.input ? '<div class="igc-input"><div class="igc-emo">❤️🙌🔥👏😢😍😮😂</div>' +
          '<div class="igc-bar">' + ava(s.me, '', 'igc-ava me', undefined, 'me') + '<span>Add a comment…</span>' + I.send + '</div></div>' : '') +
        '</div>';
    }
  });

  /* ============================== instagram dms ============================== */

  TOOLS.push({
    id: 'igdm',
    label: 'ig dms',
    defaults: {
      clock: '9:41', battery: 70, showPct: false, theme: 'light', bubble: 'blue',
      name: '', sub: '', photo: '', seen: '',
      msgs: []
    },
    fields: [
      { type: 'head', label: 'phone' },
      U.STATUS_FIELDS,
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'bubble', type: 'select', label: 'my bubbles', options: [['blue', 'blue'], ['purple', 'purple']] }
      ] },
      { type: 'head', label: 'them' },
      { key: 'photo', type: 'image', label: 'pfp', max: 300 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'sub', type: 'text', label: 'under name' }
      ] },
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
            { key: 'stamp', type: 'text', label: 'time above' },
            { key: 'react', type: 'text', label: 'reaction' }
          ] }
        ] },
      { key: 'seen', type: 'text', label: 'under last sent', placeholder: 'Seen' }
    ],
    render: function (s) {
      var list = s.msgs || [], lastMe = -1, out = '';
      list.forEach(function (m, i) { if (m.from === 'me') lastMe = i; });
      list.forEach(function (m, i) {
        var prev = list[i - 1], next = list[i + 1];
        var joinUp = prev && prev.from === m.from && !m.stamp;
        var joinDown = next && next.from === m.from && !next.stamp;
        var who = m.from === 'me' ? 'me' : 'them';
        if (m.stamp) out += '<div class="igd-stamp">' + E('msgs.' + i + '.stamp', m.stamp) + '</div>';
        var big = U.isEmojiOnly(m.text) && !m.image;
        var body = (m.image ? '<img class="igd-pic" src="' + m.image + '"' + DI('msgs.' + i + '.image') + ' alt="">' : '') +
          (m.text ? '<div class="igd-b' + (big ? ' emoji' : '') + (joinUp ? ' up' : '') + (joinDown ? ' down' : '') + '">' + EB('msgs.' + i + '.text', m.text) + '</div>' : '');
        out += '<div class="igd-row ' + who + (joinUp ? '' : ' gap') + (m.react ? ' reacted' : '') + '">' +
          (who === 'them' ? (joinDown ? '<div class="igd-ava sp"></div>' : ava(s.photo, s.name, 'igd-ava', undefined, 'photo')) : '') +
          '<div class="igd-col">' + body + (m.react ? '<span class="igd-react">' + E('msgs.' + i + '.react', m.react) + '</span>' : '') + '</div></div>';
        if (i === lastMe && s.seen && !(next && next.from === 'me')) out += '<div class="igd-seen">' + E('seen', s.seen) + '</div>';
      });
      return '<div class="shot igd t-' + s.theme + ' b-' + s.bubble + '">' + U.statusBar(s) +
        '<div class="igd-head"><span class="igd-ic">' + I.back + '</span>' + ava(s.photo, s.name, 'igd-hava', undefined, 'photo') +
        '<div class="igd-who"><b>' + E('name', s.name) + '</b><span>' + E('sub', s.sub) + '</span></div>' +
        '<span class="igd-ic">' + I.phone + '</span><span class="igd-ic">' + I.video + '</span></div>' +
        '<div class="igd-body">' + out + '</div>' +
        '<div class="igd-input"><span class="igd-cam">' + I.camera + '</span><span class="igd-ph">Message…</span>' +
        '<span class="igd-ic">' + I.mic + '</span><span class="igd-ic">' + I.image + '</span><span class="igd-ic">' + I.sticker + '</span></div></div>';
    }
  });

  /* ============================== tiktok comments ============================== */

  TOOLS.push({
    id: 'tiktok',
    label: 'tiktok',
    defaults: {
      theme: 'light', count: '', video: '', progress: 50, clock: '9:41', battery: 80, showPct: false,
      list: []
    },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'count', type: 'text', label: 'comment count' }
      ] },
      { type: 'head', label: 'video behind' },
      { key: 'video', type: 'image', label: 'video screenshot', max: 1200 },
      { key: 'progress', type: 'range', label: 'how far into the video', min: 0, max: 100, step: 1 },
      U.STATUS_FIELDS,
      { type: 'head', label: 'comments' },
      { key: 'list', type: 'list', adds: [{ label: '+ comment', item: item({ avatar: '', user: '', creator: false, text: '', time: '', likes: '', liked: false, reply: false, more: '' }) }], item: [
        { key: 'avatar', type: 'image', label: 'pfp', max: 200 },
        { key: 'user', type: 'text', label: 'username' },
        { key: 'text', type: 'textarea', label: 'comment', rows: 2 },
        { type: 'row', fields: [
          { key: 'time', type: 'text', label: 'time' },
          { key: 'likes', type: 'text', label: 'likes' },
          { key: 'more', type: 'text', label: 'replies' }
        ] },
        { type: 'row', fields: [
          { key: 'liked', type: 'toggle', label: 'liked' },
          { key: 'creator', type: 'toggle', label: 'creator' },
          { key: 'reply', type: 'toggle', label: 'is a reply' }
        ] }
      ] }
    ],
    render: function (s) {
      var out = (s.list || []).map(function (c, _i) {
        return '<div class="tt-c' + (c.reply ? ' reply' : '') + '">' + ava(c.avatar, c.user, 'tt-ava', undefined, 'list.' + _i + '.avatar') +
          '<div class="tt-main"><div class="tt-user">' + E('list.' + _i + '.user', c.user) + (c.creator ? '<span class="tt-creator">Creator</span>' : '') + '</div>' +
          '<div class="tt-text">' + EW('list.' + _i + '.text', tags(c.text, 'tt-at')) + '</div>' +
          '<div class="tt-sub"><span>' + E('list.' + _i + '.time', c.time) + '</span><b>Reply</b></div>' +
          (c.more ? '<div class="tt-more"><i></i>View ' + E('list.' + _i + '.more', c.more) + ' ' + (c.more === '1' ? 'reply' : 'replies') + I.down + '</div>' : '') +
          '</div><div class="tt-like' + (c.liked ? ' on' : '') + '">' + (c.liked ? I.heartFull : I.heart) +
          '<span>' + E('list.' + _i + '.likes', c.likes) + '</span></div></div>';
      }).join('');
      var sheet = '<div class="tt t-' + s.theme + '"><div class="tt-head"><span></span><b>' + E('count', s.count) + ' comments</b>' + I.x + '</div>' +
        '<div class="tt-list">' + out + '</div>' +
        '<div class="tt-input"><span>Add comment…</span>' + I.at + I.smile + '</div></div>';
      if (!s.video) return '<div class="shot tt-solo">' + sheet + '</div>';
      var pct = Math.max(0, Math.min(100, +s.progress || 0));
      return '<div class="shot tt-phone">' + U.statusBar(s) +
        '<div class="tt-vid"><img src="' + s.video + '"' + DI('video') + ' alt=""><div class="tt-prog"><i style="width:' + pct + '%"></i><b style="left:' + pct + '%"></b></div></div>' +
        sheet + '</div>';
    }
  });

  /* ============================== youtube comments ============================== */

  TOOLS.push({
    id: 'youtube',
    label: 'youtube',
    defaults: {
      theme: 'dark', show: 'both', count: '', channel: '', channelName: '', channelAvatar: '', verified: false,
      thumb: '', title: '', duration: '', views: '', ago: '', watched: 0,
      list: []
    },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'show', type: 'select', label: 'show', options: [['both', 'video + comments'], ['video', 'just the video'], ['comments', 'just comments']] }
      ] },
      { type: 'head', label: 'channel' },
      { key: 'channelAvatar', type: 'image', label: 'channel pfp', max: 200 },
      { type: 'row', fields: [
        { key: 'channelName', type: 'text', label: 'channel name' },
        { key: 'channel', type: 'text', label: 'channel @' },
        { key: 'verified', type: 'toggle', label: 'check' }
      ] },
      { type: 'head', label: 'video' },
      { key: 'thumb', type: 'image', label: 'thumbnail', max: 1280 },
      { key: 'title', type: 'textarea', label: 'title', rows: 2 },
      { type: 'row', fields: [
        { key: 'duration', type: 'text', label: 'length', placeholder: '12:34' },
        { key: 'views', type: 'text', label: 'views', placeholder: '1.2M' },
        { key: 'ago', type: 'text', label: 'posted', placeholder: '3 days ago' }
      ] },
      { key: 'watched', type: 'range', label: 'watched bar', min: 0, max: 100, step: 1 },
      { type: 'head', label: 'comments' },
      { key: 'count', type: 'text', label: 'comment count' },
      { key: 'list', type: 'list', adds: [{ label: '+ comment', item: item({ avatar: '', handle: '', time: '', text: '', likes: '', pinned: false, hearted: false, creator: false, reply: false, replies: '' }) }], item: [
        { key: 'avatar', type: 'image', label: 'pfp', max: 200 },
        { type: 'row', fields: [
          { key: 'handle', type: 'text', label: '@' },
          { key: 'time', type: 'text', label: 'time' }
        ] },
        { key: 'text', type: 'textarea', label: 'comment', rows: 2 },
        { type: 'row', fields: [
          { key: 'likes', type: 'text', label: 'likes' },
          { key: 'replies', type: 'text', label: 'replies' }
        ] },
        { type: 'row', fields: [
          { key: 'pinned', type: 'toggle', label: 'pinned' },
          { key: 'hearted', type: 'toggle', label: 'heart' },
          { key: 'creator', type: 'toggle', label: 'channel' },
          { key: 'reply', type: 'toggle', label: 'reply' }
        ] }
      ] }
    ],
    render: function (s) {
      var out = (s.list || []).map(function (c, _i) {
        var handle = c.creator ? '<span class="yt-owner">' + E('list.' + _i + '.handle', c.handle) + '</span>' : '<b>' + E('list.' + _i + '.handle', c.handle) + '</b>';
        return '<div class="yt-c' + (c.reply ? ' reply' : '') + '">' + ava(c.creator ? (c.avatar || s.channelAvatar) : c.avatar, c.handle, 'yt-ava', undefined, 'list.' + _i + '.avatar') +
          '<div class="yt-main">' +
          (c.pinned ? '<div class="yt-pin">' + I.pin + 'Pinned by ' + E('channel', s.channel) + '</div>' : '') +
          '<div class="yt-top">' + handle + '<span>' + E('list.' + _i + '.time', c.time) + '</span></div>' +
          '<div class="yt-text">' + EW('list.' + _i + '.text', tags(c.text, 'yt-at')) + '</div>' +
          '<div class="yt-acts"><span class="yt-ic">' + I.thumb + '</span><span class="yt-n">' + E('list.' + _i + '.likes', c.likes) + '</span>' +
          '<span class="yt-ic">' + flip(I.thumb) + '</span>' +
          (c.hearted ? '<span class="yt-heart">' + ava(s.channelAvatar, s.channel, 'yt-hava', undefined, 'channelAvatar') + '<i>' + I.heartFull + '</i></span>' : '') +
          '<b class="yt-reply">Reply</b></div>' +
          (c.replies ? '<div class="yt-replies">' + I.down + E('list.' + _i + '.replies', c.replies) + ' ' + (c.replies === '1' ? 'reply' : 'replies') + '</div>' : '') +
          '</div><span class="yt-dots">' + I.dots + '</span></div>';
      }).join('');
      var name = s.channelName || String(s.channel || '').replace(/^@/, '');
      var meta = [s.views ? E('views', s.views) + ' views' : '', s.ago ? E('ago', s.ago) : ''].filter(Boolean).join(' • ');
      var video = '<div class="yt-video"><div class="yt-thumb">' + (s.thumb ? '<img src="' + s.thumb + '"' + DI('thumb') + ' alt="">' : '') +
        (s.duration ? '<span class="yt-dur">' + E('duration', s.duration) + '</span>' : '') +
        (+s.watched > 0 ? '<div class="yt-watched"><i style="width:' + Math.min(100, +s.watched) + '%"></i></div>' : '') + '</div>' +
        '<div class="yt-vinfo">' + ava(s.channelAvatar, s.channel || name, 'yt-vava', undefined, 'channelAvatar') + '<div class="yt-vtext"><div class="yt-vtitle">' + EB('title', s.title) + '</div>' +
        '<div class="yt-vsub">' + E(s.channelName ? 'channelName' : 'channel', name) + (s.verified ? '<span class="yt-check">' + ICON.verified + '</span>' : '') + '</div>' +
        (meta ? '<div class="yt-vsub">' + meta + '</div>' : '') + '</div><span class="yt-dots">' + I.dots + '</span></div></div>';
      var comments = '<div class="yt-head"><b>' + E('count', s.count) + ' Comments</b><span class="yt-sort">' + I.sort + 'Sort by</span></div>' + out;
      var show = s.show || 'both';
      return '<div class="shot yt t-' + s.theme + '">' + (show !== 'comments' ? video : '') + (show !== 'video' ? comments : '') + '</div>';
    }
  });

  /* ============================== reddit ============================== */

  TOOLS.push({
    id: 'reddit',
    label: 'reddit',
    defaults: {
      theme: 'light', sub: '', subIcon: '', user: '', time: '',
      title: '', flair: '',
      body: '', image: '',
      votes: '', comments: '', voted: 'none',
      list: []
    },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'voted', type: 'select', label: 'your vote', options: [['none', 'none'], ['up', 'up'], ['down', 'down']] }
      ] },
      { type: 'head', label: 'post' },
      { type: 'row', fields: [
        { key: 'sub', type: 'text', label: 'r/' },
        { key: 'subIcon', type: 'image', label: 'sub icon', max: 200 }
      ] },
      { type: 'row', fields: [
        { key: 'user', type: 'text', label: 'u/' },
        { key: 'time', type: 'text', label: 'time' }
      ] },
      { key: 'title', type: 'textarea', label: 'title', rows: 2 },
      { key: 'flair', type: 'text', label: 'flair' },
      { key: 'body', type: 'textarea', label: 'text', rows: 3 },
      { key: 'image', type: 'image', label: 'picture', max: 1200 },
      { type: 'row', fields: [
        { key: 'votes', type: 'text', label: 'votes' },
        { key: 'comments', type: 'text', label: 'comments' }
      ] },
      { type: 'head', label: 'comments' },
      { key: 'list', type: 'list', adds: [{ label: '+ comment', item: item({ avatar: '', user: '', time: '', text: '', votes: '', depth: '0', op: false }) }], item: [
        { key: 'avatar', type: 'image', label: 'pfp', max: 200 },
        { type: 'row', fields: [
          { key: 'user', type: 'text', label: 'u/' },
          { key: 'time', type: 'text', label: 'time' }
        ] },
        { key: 'text', type: 'textarea', label: 'comment', rows: 2 },
        { type: 'row', fields: [
          { key: 'votes', type: 'text', label: 'votes' },
          { key: 'depth', type: 'select', label: 'indent', options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']] },
          { key: 'op', type: 'toggle', label: 'OP' }
        ] }
      ] }
    ],
    render: function (s) {
      var voted = s.voted === 'up' ? ' up' : s.voted === 'down' ? ' down' : '';
      var comments = (s.list || []).map(function (c, _i) {
        var d = parseInt(c.depth, 10) || 0, lines = '';
        for (var k = 0; k < d; k++) lines += '<i style="left:' + (12 + k * 28) + 'px"></i>';
        return '<div class="rd-c" style="padding-left:' + (d * 28) + 'px">' + lines +
          '<div class="rd-ctop">' + ava(c.avatar, c.user, 'rd-cava', undefined, 'list.' + _i + '.avatar') + '<b>' + E('list.' + _i + '.user', c.user) + '</b>' +
          (c.op ? '<span class="rd-op">OP</span>' : '') + (c.time ? '<span>· ' + E('list.' + _i + '.time', c.time) + '</span>' : '') + '</div>' +
          '<div class="rd-ctext">' + EB('list.' + _i + '.text', c.text) + '</div>' +
          '<div class="rd-cacts"><span class="rd-ic">' + I.up + '</span><b>' + E('list.' + _i + '.votes', c.votes) + '</b><span class="rd-ic">' + flip(I.up) + '</span>' +
          '<span class="rd-ic">' + I.bubble + '</span><b>Reply</b><span class="rd-ic">' + I.dots + '</span></div></div>';
      }).join('');
      return '<div class="shot rd t-' + s.theme + '">' +
        '<div class="rd-head">' + ava(s.subIcon, s.sub, 'rd-sava', '#ff4500', 'subIcon') +
        '<div class="rd-who"><div><b>r/' + E('sub', s.sub) + '</b>' + (s.time ? ' <span>· ' + E('time', s.time) + '</span>' : '') + '</div>' + (s.user ? '<span>u/' + E('user', s.user) + '</span>' : '') + '</div>' +
        '<span class="rd-join">Join</span><span class="rd-ic">' + I.dots + '</span></div>' +
        '<div class="rd-title">' + EB('title', s.title) + '</div>' +
        (s.flair ? '<span class="rd-flair">' + E('flair', s.flair) + '</span>' : '') +
        (s.body ? '<div class="rd-body">' + EB('body', s.body) + '</div>' : '') +
        (s.image ? '<img class="rd-img" src="' + s.image + '"' + DI('image') + ' alt="">' : '') +
        '<div class="rd-acts"><span class="rd-pill vote' + voted + '"><span class="rd-ic">' + (s.voted === 'up' ? I.upFull : I.up) + '</span><b>' + E('votes', s.votes) + '</b>' +
        '<span class="rd-ic">' + flip(s.voted === 'down' ? I.upFull : I.up) + '</span></span>' +
        '<span class="rd-pill"><span class="rd-ic">' + I.bubble + '</span><b>' + E('comments', s.comments) + '</b></span>' +
        '<span class="rd-pill"><span class="rd-ic">' + I.share + '</span><b>Share</b></span></div>' +
        (comments ? '<div class="rd-comments">' + comments + '</div>' : '') + '</div>';
    }
  });

  /* ============================== facebook ============================== */

  TOOLS.push({
    id: 'facebook',
    label: 'facebook',
    defaults: {
      theme: 'light', avatar: '', name: '', badge: false, time: '', audience: 'public',
      text: '', image: '',
      reactions: '👍❤️', reactCount: '', comments: '', shares: '',
      list: []
    },
    fields: [
      { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
      { key: 'avatar', type: 'image', label: 'pfp', max: 300 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'badge', type: 'toggle', label: 'check' }
      ] },
      { type: 'row', fields: [
        { key: 'time', type: 'text', label: 'time' },
        { key: 'audience', type: 'select', label: 'who sees it', options: [['public', 'public'], ['friends', 'friends']] }
      ] },
      { key: 'text', type: 'textarea', label: 'post', rows: 3 },
      { key: 'image', type: 'image', label: 'picture', max: 1200 },
      { type: 'row', fields: [
        { key: 'reactions', type: 'text', label: 'reactions' },
        { key: 'reactCount', type: 'text', label: 'count' }
      ] },
      { type: 'row', fields: [
        { key: 'comments', type: 'text', label: 'comments' },
        { key: 'shares', type: 'text', label: 'shares' }
      ] },
      { type: 'head', label: 'comments' },
      { key: 'list', type: 'list', adds: [{ label: '+ comment', item: item({ avatar: '', name: '', text: '', time: '', likes: '' }) }], item: [
        { key: 'avatar', type: 'image', label: 'pfp', max: 200 },
        { key: 'name', type: 'text', label: 'name' },
        { key: 'text', type: 'textarea', label: 'comment', rows: 2 },
        { type: 'row', fields: [
          { key: 'time', type: 'text', label: 'time' },
          { key: 'likes', type: 'text', label: 'likes' }
        ] }
      ] }
    ],
    render: function (s) {
      var emo = (String(s.reactions || '').match(/\p{Extended_Pictographic}️?/gu) || []).slice(0, 3);
      var bigText = s.text && !s.image && s.text.length <= 85 && s.text.indexOf('\n') < 0;
      var comments = (s.list || []).map(function (c, _i) {
        return '<div class="fb-c">' + ava(c.avatar, c.name, 'fb-cava', undefined, 'list.' + _i + '.avatar') + '<div class="fb-cmain">' +
          '<div class="fb-bub"><b>' + E('list.' + _i + '.name', c.name) + '</b><div>' + EB('list.' + _i + '.text', c.text) + '</div>' +
          (c.likes ? '<span class="fb-clikes"><i>👍</i>' + E('list.' + _i + '.likes', c.likes) + '</span>' : '') + '</div>' +
          '<div class="fb-csub"><span>' + E('list.' + _i + '.time', c.time) + '</span><b>Like</b><b>Reply</b></div></div></div>';
      }).join('');
      var counts = [s.comments ? '<span>' + E('comments', s.comments) + ' comments</span>' : '', s.shares ? '<span>' + E('shares', s.shares) + ' shares</span>' : ''].join('');
      return '<div class="shot fb t-' + s.theme + '">' +
        '<div class="fb-head">' + ava(s.avatar, s.name, 'fb-ava', undefined, 'avatar') + '<div class="fb-who"><div class="fb-name"><b>' + E('name', s.name) + '</b>' + (s.badge ? BADGE : '') + '</div>' +
        '<div class="fb-time">' + (s.time ? E('time', s.time) + ' · ' : '') + '<span class="fb-aud">' + (s.audience === 'friends' ? I.friends : I.globe) + '</span></div></div>' +
        '<span class="fb-ic">' + I.dots + '</span><span class="fb-ic">' + I.x + '</span></div>' +
        (s.text ? '<div class="fb-text' + (bigText ? ' big' : '') + '">' + EB('text', s.text) + '</div>' : '') +
        (s.image ? '<img class="fb-img" src="' + s.image + '"' + DI('image') + ' alt="">' : '') +
        ((emo.length || counts) ? '<div class="fb-stats"><span class="fb-reacts">' + emo.map(function (e) { return '<i>' + e + '</i>'; }).join('') +
          (s.reactCount ? '<span>' + E('reactCount', s.reactCount) + '</span>' : '') + '</span><span class="fb-counts">' + counts + '</span></div>' : '') +
        '<div class="fb-acts"><span>' + I.thumb + 'Like</span><span>' + I.bubble + 'Comment</span><span>' + I.share + 'Share</span></div>' +
        (comments ? '<div class="fb-comments">' + comments + '</div>' : '') + '</div>';
    }
  });

  /* ============================== snapchat ============================== */

  TOOLS.push({
    id: 'snapchat',
    label: 'snapchat',
    defaults: {
      clock: '9:41', battery: 45, showPct: false, name: '', photo: '', streak: '',
      msgs: []
    },
    fields: [
      U.STATUS_FIELDS,
      { key: 'photo', type: 'image', label: 'bitmoji / pfp', max: 300 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'streak', type: 'text', label: 'streak' }
      ] },
      { type: 'head', label: 'chats' },
      { key: 'msgs', type: 'list', meKey: 'from',
        adds: [
          { label: '+ me', item: item({ from: 'me', text: '', image: '' }) },
          { label: '+ them', item: item({ from: 'them', text: '', image: '' }) }
        ],
        item: [
          { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['them', 'them']] },
          { key: 'text', type: 'textarea', label: 'text', rows: 2 },
          { key: 'image', type: 'image', label: 'picture', max: 900 }
        ] }
    ],
    render: function (s) {
      var out = '', prev = null;
      (s.msgs || []).forEach(function (m, _i) {
        var who = m.from === 'me' ? 'me' : 'them';
        if (who !== prev) out += '<div class="sc-name ' + who + '">' + (who === 'me' ? 'ME' : esc(String(s.name).toUpperCase())) + '</div>';
        out += '<div class="sc-msg ' + who + '">' + (m.image ? '<img src="' + m.image + '"' + DI('msgs.' + _i + '.image') + ' alt="">' : '') +
          (m.text ? '<div>' + EB('msgs.' + _i + '.text', m.text) + '</div>' : '') + '</div>';
        prev = who;
      });
      return '<div class="shot sc">' + U.statusBar(s) +
        '<div class="sc-head"><span class="sc-ic">' + I.chevron + '</span>' + ava(s.photo, s.name, 'sc-ava', undefined, 'photo') +
        '<div class="sc-who"><b>' + E('name', s.name) + '</b>' + (s.streak ? '<span>' + E('streak', s.streak) + '</span>' : '') + '</div>' +
        '<span class="sc-ic">' + I.phone + '</span><span class="sc-ic">' + I.video + '</span></div>' +
        '<div class="sc-body">' + out + '</div>' +
        '<div class="sc-input"><span class="sc-cam">' + I.snapCam + '</span><span class="sc-field">Send a chat</span>' +
        '<span class="sc-ic">' + I.mic + '</span><span class="sc-ic">' + I.smile + '</span><span class="sc-ic">' + I.image + '</span></div></div>';
    }
  });

  /* ============================== apple music lyrics ============================== */

  var AM_LOGO = '<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5.5" fill="#fa2d48"/>' +
    '<path d="M16.5 5.3v9.4a2.3 2.3 0 1 1-1.4-2.1V8.4l-5.6 1.3v6.6a2.3 2.3 0 1 1-1.4-2.1V7.3z" fill="#fff"/></svg>';

  TOOLS.push({
    id: 'applemusic',
    label: 'apple music',
    defaults: { cover: '', palette: [], title: '', artist: '', lyrics: '', bg: '#3a2a4a', look: 'blur', size: 'm', frame: 'card' },
    fields: [
      { key: 'cover', type: 'image', label: 'album cover', max: 600, palette: true },
      { key: 'title', type: 'text', label: 'song' },
      { key: 'artist', type: 'text', label: 'artist' },
      { key: 'lyrics', type: 'textarea', label: 'lyrics', rows: 5 },
      { key: 'bg', type: 'color', label: 'color', swatches: function (s) { return s.palette; } },
      { type: 'row', fields: [
        { key: 'look', type: 'select', label: 'background', options: [['blur', 'blurry cover'], ['color', 'color']] },
        { key: 'size', type: 'select', label: 'size', options: [['s', 'small'], ['m', 'medium'], ['l', 'big']] },
        { key: 'frame', type: 'select', label: 'shape', options: [['card', 'card'], ['story', 'story']] }
      ] }
    ],
    render: function (s) {
      var blur = s.look === 'blur' && s.cover;
      var bgLayer = blur ? '<img class="am-blur" src="' + s.cover + '"' + DI('cover') + ' alt=""><div class="am-dim"></div>' : '';
      var card = '<div class="am-card sz-' + s.size + '" style="background:linear-gradient(160deg,' + U.shade(s.bg, 0.12) + ',' + U.shade(s.bg, -0.45) + ')">' + bgLayer +
        '<div class="am-in"><div class="am-top">' + (s.cover ? '<img class="am-cover" src="' + s.cover + '"' + DI('cover') + ' alt="">' : '<div class="am-cover am-noart"></div>') +
        '<div class="am-meta"><b>' + E('title', s.title) + '</b><span>' + E('artist', s.artist) + '</span></div></div>' +
        '<div class="am-lyrics">' + EB('lyrics', s.lyrics) + '</div>' +
        '<div class="am-logo">' + AM_LOGO + '<span>Music</span></div></div></div>';
      if (s.frame === 'story') {
        return '<div class="shot am-story" style="background:' + U.shade(s.bg, -0.6) + '">' + (s.cover ? '<img class="am-blur" src="' + s.cover + '"' + DI('cover') + ' alt=""><div class="am-dim"></div>' : '') + card + '</div>';
      }
      return '<div class="shot am-solo">' + card + '</div>';
    }
  });

  /* ============================== pinterest ============================== */

  TOOLS.push({
    id: 'pinterest',
    label: 'pinterest',
    defaults: {
      theme: 'light', image: '', title: '', desc: '', avatar: '', user: '', followers: '',
      likes: '', comments: '', saved: false, board: ''
    },
    fields: [
      { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
      { key: 'image', type: 'image', label: 'pin picture', max: 1200 },
      { key: 'title', type: 'text', label: 'title' },
      { key: 'desc', type: 'textarea', label: 'description', rows: 2 },
      { key: 'avatar', type: 'image', label: 'pfp', max: 200 },
      { type: 'row', fields: [
        { key: 'user', type: 'text', label: 'name' },
        { key: 'followers', type: 'text', label: 'followers' }
      ] },
      { type: 'row', fields: [
        { key: 'likes', type: 'text', label: 'reactions' },
        { key: 'comments', type: 'text', label: 'comments' }
      ] },
      { type: 'row', fields: [
        { key: 'board', type: 'text', label: 'board' },
        { key: 'saved', type: 'toggle', label: 'saved' }
      ] }
    ],
    render: function (s) {
      return '<div class="shot pn t-' + s.theme + '">' +
        (s.image ? '<img class="pn-img" src="' + s.image + '"' + DI('image') + ' alt="">' : '<div class="pn-img pn-noimg"></div>') +
        '<div class="pn-bar"><span class="pn-ic">' + I.heart + '</span>' + (s.likes ? '<b>' + E('likes', s.likes) + '</b>' : '') +
        '<span class="pn-ic">' + I.bubble + '</span>' + (s.comments ? '<b>' + E('comments', s.comments) + '</b>' : '') +
        '<span class="pn-ic">' + I.share + '</span><span class="pn-ic">' + I.dots + '</span><span class="pn-grow"></span>' +
        (s.board ? '<span class="pn-board">' + E('board', s.board) + I.down + '</span>' : '') +
        '<span class="pn-save' + (s.saved ? ' on' : '') + '">' + (s.saved ? 'Saved' : 'Save') + '</span></div>' +
        (s.title ? '<div class="pn-title">' + E('title', s.title) + '</div>' : '') +
        (s.desc ? '<div class="pn-desc">' + EB('desc', s.desc) + '</div>' : '') +
        '<div class="pn-user">' + ava(s.avatar, s.user, 'pn-ava', undefined, 'avatar') + '<div class="pn-who"><b>' + E('user', s.user) + '</b>' +
        (s.followers ? '<span>' + E('followers', s.followers) + ' followers</span>' : '') + '</div><span class="pn-follow">Follow</span></div></div>';
    }
  });

  /* ============================== ai chats ============================== */

  // **bold**, `code`, blank line = new paragraph, "- " lines = bullets
  function md(t) {
    return String(t || '').split(/\n{2,}/).map(function (para) {
      var lines = para.split('\n');
      if (lines.every(function (l) { return /^\s*[-*•] /.test(l); })) {
        return '<ul>' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\s*[-*•] /, '')) + '</li>'; }).join('') + '</ul>';
      }
      if (lines.every(function (l) { return /^\s*\d+[.)] /.test(l); })) {
        return '<ol>' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\s*\d+[.)] /, '')) + '</li>'; }).join('') + '</ol>';
      }
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('');
  }
  function inline(l) {
    return esc(l).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  var AI_MSG = [
    { label: '+ me', item: item({ from: 'me', text: '' }) },
    { label: '+ ai', item: item({ from: 'ai', text: '' }) }
  ];
  var AI_ITEM = [
    { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['ai', 'ai']] },
    { key: 'text', type: 'textarea', label: 'text', rows: 3 }
  ];
  var I_COPY = stroke('M9 9h10.5v10.5H9zM15 9V4.5H4.5V15H9', 1.7);
  var I_RETRY = stroke('M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4.5H9', 1.7);

  TOOLS.push({
    id: 'chatgpt',
    label: 'chatgpt',
    defaults: { theme: 'light', model: '', input: true, msgs: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'model', type: 'text', label: 'next to ChatGPT' },
        { key: 'input', type: 'toggle', label: 'chat bar' }
      ] },
      { type: 'head', label: 'messages' },
      { key: 'msgs', type: 'list', meKey: 'from', adds: AI_MSG, item: AI_ITEM }
    ],
    render: function (s) {
      var list = s.msgs || [];
      var out = list.map(function (m, i) {
        if (m.from === 'me') return '<div class="gpt-me"><div>' + EB('msgs.' + i + '.text', m.text) + '</div></div>';
        var last = !list.slice(i + 1).some(function (x) { return x.from === 'ai'; });
        return '<div class="gpt-ai">' + EW('msgs.' + i + '.text', md(m.text)) +
          (last ? '<div class="gpt-acts">' + I_COPY + I.thumb + flip(I.thumb) + I.share + I_RETRY + '</div>' : '') + '</div>';
      }).join('');
      return '<div class="shot gpt t-' + s.theme + '"><div class="gpt-head"><b>ChatGPT</b>' + (s.model ? '<span>' + E('model', s.model) + '</span>' : '') + I.down + '</div>' +
        '<div class="gpt-body">' + out + '</div>' +
        (s.input ? '<div class="gpt-input"><span>Ask anything</span><div>' + ICON.plus + '<i></i>' + I.mic + '</div></div>' : '') + '</div>';
    }
  });

  var SPARK = (function () {
    var rays = '', n = 12;
    for (var k = 0; k < n; k++) {
      var a = k / n * Math.PI * 2 + 0.2, r = k % 2 ? 7.2 : 10.5, r0 = 1.6;
      rays += '<path d="M' + (12 + Math.cos(a) * r0).toFixed(2) + ' ' + (12 + Math.sin(a) * r0).toFixed(2) +
        'L' + (12 + Math.cos(a) * r).toFixed(2) + ' ' + (12 + Math.sin(a) * r).toFixed(2) + '"/>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="#d97757" stroke-width="2.3" stroke-linecap="round">' + rays + '</svg>';
  })();

  TOOLS.push({
    id: 'claude',
    label: 'claude',
    defaults: { theme: 'light', title: '', me: '', model: '', font: 'serif', input: true, msgs: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'font', type: 'select', label: 'reply font', options: [['serif', 'serif'], ['sans', 'sans']] },
        { key: 'input', type: 'toggle', label: 'chat bar' }
      ] },
      { type: 'row', fields: [
        { key: 'title', type: 'text', label: 'chat title' },
        { key: 'me', type: 'text', label: 'your initial' }
      ] },
      { key: 'model', type: 'text', label: 'model (chat bar)' },
      { type: 'head', label: 'messages' },
      { key: 'msgs', type: 'list', meKey: 'from', adds: AI_MSG, item: AI_ITEM }
    ],
    render: function (s) {
      var list = s.msgs || [];
      var out = list.map(function (m, i) {
        if (m.from === 'me') {
          return '<div class="cl-me"><span class="cl-init">' + E('me', (String(s.me).match(/./u) || [''])[0].toUpperCase()) + '</span><div>' + EB('msgs.' + i + '.text', m.text) + '</div></div>';
        }
        var last = !list.slice(i + 1).some(function (x) { return x.from === 'ai'; });
        return '<div class="cl-ai">' + EW('msgs.' + i + '.text', md(m.text)) +
          (last ? '<div class="cl-foot">' + SPARK + '<span class="cl-acts">' + I_COPY + I.thumb + flip(I.thumb) + I_RETRY + '</span></div>' : '') + '</div>';
      }).join('');
      return '<div class="shot cl t-' + s.theme + ' f-' + s.font + '">' +
        (s.title ? '<div class="cl-head">' + E('title', s.title) + I.down + '</div>' : '') +
        '<div class="cl-body">' + out + '</div>' +
        (s.input ? '<div class="cl-input"><span>Reply to Claude…</span><div class="cl-row"><span class="cl-plus">' + ICON.plus + '</span>' +
          '<span class="cl-grow"></span>' + (s.model ? '<span class="cl-model">' + E('model', s.model) + I.down + '</span>' : '') +
          '<span class="cl-send">' + stroke('M12 19V5M5.5 11.5 12 5l6.5 6.5', 2.2) + '</span></div></div>' : '') + '</div>';
    }
  });

  /* ============================== google search ============================== */

  var G_SPARK = '<svg viewBox="0 0 24 24"><defs><linearGradient id="gsp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4285f4"/><stop offset=".5" stop-color="#9b72cb"/><stop offset="1" stop-color="#d96570"/></linearGradient></defs>' +
    '<path fill="url(#gsp)" d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10z"/></svg>';
  function sitelinks(t) {
    var rows = String(t || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    if (!rows.length) return '';
    return '<div class="g-links">' + rows.map(function (l) {
      var m = /^(.*?)\s+[-–—]\s+(.*)$/.exec(l);
      return '<div class="g-link"><div class="g-ltitle">' + esc(m ? m[1] : l) + '</div>' + (m ? '<div class="g-ldesc">' + esc(m[2]) + '</div>' : '') + '</div>';
    }).join('') + '</div>';
  }
  var G_LOGO = '<span class="g-logo"><i style="color:#4285f4">G</i><i style="color:#ea4335">o</i><i style="color:#fbbc05">o</i><i style="color:#4285f4">g</i><i style="color:#34a853">l</i><i style="color:#ea4335">e</i></span>';

  TOOLS.push({
    id: 'google',
    label: 'google',
    defaults: { theme: 'light', query: '', ai: true, aiText: '', list: [] },
    fields: [
      { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
      { key: 'query', type: 'text', label: 'search' },
      { key: 'ai', type: 'toggle', label: 'ai overview' },
      { key: 'aiText', type: 'textarea', label: 'ai overview text', rows: 4 },
      { type: 'head', label: 'results' },
      { key: 'list', type: 'list', adds: [{ label: '+ result', item: item({ icon: '', site: '', url: '', title: '', date: '', snippet: '', links: '' }) }], item: [
        { key: 'icon', type: 'image', label: 'site icon', max: 100 },
        { type: 'row', fields: [
          { key: 'site', type: 'text', label: 'site name' },
          { key: 'url', type: 'text', label: 'link' }
        ] },
        { key: 'title', type: 'text', label: 'title' },
        { type: 'row', fields: [
          { key: 'date', type: 'text', label: 'date' }
        ] },
        { key: 'snippet', type: 'textarea', label: 'snippet', rows: 2 },
        { key: 'links', type: 'textarea', label: 'sitelinks (one per line, title - description)', rows: 3 }
      ] }
    ],
    render: function (s) {
      var tabs = ['All', 'Images', 'Videos', 'News', 'Shopping', 'Web'].map(function (t, i) {
        return '<span' + (i ? '' : ' class="on"') + '>' + t + '</span>';
      }).join('');
      var results = (s.list || []).map(function (r, _i) {
        return '<div class="g-r"><div class="g-src">' + ava(r.icon, r.site, 'g-fav', undefined, 'list.' + _i + '.icon') +
          '<div class="g-site"><span>' + E('list.' + _i + '.site', r.site) + '</span><small>' + E('list.' + _i + '.url', r.url) + '</small></div>' + I.dots + '</div>' +
          '<div class="g-title">' + E('list.' + _i + '.title', r.title) + '</div>' +
          '<div class="g-snip">' + (r.date ? '<span>' + E('list.' + _i + '.date', r.date) + ' — </span>' : '') + E('list.' + _i + '.snippet', r.snippet) + '</div>' + EW('list.' + _i + '.links', sitelinks(r.links)) + '</div>';
      }).join('');
      return '<div class="shot g t-' + s.theme + '"><div class="g-top">' + G_LOGO +
        '<div class="g-bar"><span class="g-q">' + E('query', s.query) + '</span><span class="g-icons">' + I.x + '<i></i>' + I.mic +
        '<span class="g-search">' + stroke('M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20', 2.2) + '</span></span></div></div>' +
        '<div class="g-tabs">' + tabs + '</div>' +
        (s.ai ? '<div class="g-ai"><div class="g-aihead">' + G_SPARK + '<b>AI Overview</b></div><div class="g-aitext">' + EW('aiText', md(s.aiText)) + '</div></div>' : '') +
        '<div class="g-results">' + results + '</div></div>';
    }
  });

  /* ============================== pinterest whispers ============================== */
  // same recipe as aaronson.org/whisperer: upright font, 64px base, outline = 32 copies around a 0.06em circle

  var WH_ALIGN = {
    center: ['center', 'center', 'center'], top: ['center', 'flex-start', 'center'], bottom: ['center', 'flex-end', 'center'],
    left: ['flex-start', 'center', 'left'], right: ['flex-end', 'center', 'right'],
    topleft: ['flex-start', 'flex-start', 'left'], topright: ['flex-end', 'flex-start', 'right'],
    bottomleft: ['flex-start', 'flex-end', 'left'], bottomright: ['flex-end', 'flex-end', 'right']
  };
  var WH_RING = (function () {
    var out = [];
    for (var k = 0; k < 32; k++) {
      var a = k * 2 * Math.PI / 32;
      out.push([Math.round(1e4 * Math.cos(a)) / 1e4 * 0.06, Math.round(1e4 * Math.sin(a)) / 1e4 * 0.06]);
    }
    return out;
  })();

  TOOLS.push({
    id: 'whisper',
    label: 'pinterest whispers',
    defaults: { image: '', text: '', size: 1, align: 'center', font: 'Whisper', outline: true, color: '#fafafa', outlineColor: '#111111', dx: 0, dy: 0 },
    fields: [
      { key: 'image', type: 'image', label: 'picture', max: 1600 },
      { key: 'text', type: 'textarea', label: 'text', rows: 3 },
      { key: 'size', type: 'range', label: 'font size', min: 0.25, max: 5, step: 0.05 },
      { type: 'row', fields: [
        { key: 'align', type: 'select', label: 'align text', onPick: function (s) { s.dx = 0; s.dy = 0; }, options: [
          ['center', 'center'], ['top', 'top'], ['bottom', 'bottom'], ['left', 'left'], ['right', 'right'],
          ['topleft', 'top left'], ['topright', 'top right'], ['bottomleft', 'bottom left'], ['bottomright', 'bottom right']] },
        { key: 'font', type: 'select', label: 'font', options: [
          ['Whisper', 'upright (whisper)'], ['TikTok Sans', 'tiktok'], ['Arial', 'arial'], ['Courier New', 'courier new'],
          ['Impact', 'impact'], ['Times New Roman', 'times new roman']] }
      ] },
      { type: 'row', fields: [
        { key: 'color', type: 'color', label: 'text color' },
        { key: 'outlineColor', type: 'color', label: 'outline color' },
        { key: 'outline', type: 'toggle', label: 'outline' }
      ] }
    ],
    render: function (s) {
      var a = WH_ALIGN[s.align] || WH_ALIGN.center;
      var font = "'" + s.font + "', 'Noto Color Emoji'" + (s.font === 'TikTok Sans' ? ';font-weight:500' : '');
      var box = 'font-family:' + font + ';font-size:' + s.size + 'em;justify-content:' + a[0] + ';align-items:' + a[1] + ';text-align:' + a[2];
      var txt = E('text', s.text);
      var ring = s.outline ? WH_RING.map(function (p) {
        return '<div class="wh-t wh-evil" style="' + box + ';left:' + p[0] + 'em;top:' + p[1] + 'em;color:' + s.outlineColor + '">' + txt + '</div>';
      }).join('') : '';
      return '<div class="shot wh">' +
        (s.image ? '<img class="wh-img" src="' + s.image + '"' + DI('image') + ' alt="">' : '<div class="wh-img wh-noimg"></div>') +
        '<div class="wh-wrap"><div class="wh-move" style="transform:translate(' + (s.dx || 0) + 'px,' + (s.dy || 0) + 'px)">' +
        '<div class="wh-t" style="' + box + ';color:' + s.color + '"><span class="wh-span">' + txt + '</span></div>' + ring +
        '</div></div></div>';
    },
    // drag the words around like whisperer
    mount: function (shot, s, app) {
      var span = shot.querySelector('.wh-span'), move = shot.querySelector('.wh-move');
      if (!span) return;
      var start = null;
      // a click types (the words are editable), a drag moves them
      span.addEventListener('pointerdown', function (e) {
        start = { x: e.clientX, y: e.clientY, dx: s.dx || 0, dy: s.dy || 0, moving: false, id: e.pointerId };
      });
      span.addEventListener('pointermove', function (e) {
        if (!start) return;
        if (!start.moving) {
          if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) < 6) return;
          start.moving = true;
          span.setPointerCapture(start.id);
          window.getSelection().removeAllRanges();
        }
        e.preventDefault();
        var k = app.scale() || 1;
        s.dx = Math.round(start.dx + (e.clientX - start.x) / k);
        s.dy = Math.round(start.dy + (e.clientY - start.y) / k);
        move.style.transform = 'translate(' + s.dx + 'px,' + s.dy + 'px)';
      });
      function end() {
        if (start && start.moving) {
          app.save();
          // done dragging: drop the typing cursor so the picture redraws in its new spot
          if (document.activeElement && span.contains(document.activeElement)) document.activeElement.blur();
        }
        start = null;
      }
      span.addEventListener('pointerup', end);
      span.addEventListener('pointercancel', end);
    }
  });

  /* ============================== twitch ============================== */

  var TWITCH_COLORS = ['#ff0000', '#0000ff', '#008000', '#b22222', '#ff7f50', '#9acd32', '#ff4500', '#2e8b57',
    '#daa520', '#d2691e', '#5f9ea0', '#1e90ff', '#ff69b4', '#8a2be2', '#00ff7f'];
  var TW_BADGE = {
    mod: '<svg viewBox="0 0 18 18"><rect width="18" height="18" rx="2" fill="#00ad03"/><path d="M4 14 12.5 5.5M11 4h3v3M5.5 10.5l2 2M3.5 14.5l1 1" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
    vip: '<svg viewBox="0 0 18 18"><rect width="18" height="18" rx="2" fill="#e005b9"/><path d="M5 5h8l2 3-6 6.5L3 8z" fill="#fff"/></svg>',
    sub: '<svg viewBox="0 0 18 18"><rect width="18" height="18" rx="2" fill="#8205b4"/><path d="m9 3 1.8 3.9 4.2.5-3.1 2.9.8 4.2L9 12.4l-3.7 2.1.8-4.2L3 7.4l4.2-.5z" fill="#fff"/></svg>',
    streamer: '<svg viewBox="0 0 18 18"><rect width="18" height="18" rx="2" fill="#e91916"/><path d="M4 6h7v6H4zM11 8.5l3.5-2v5L11 9.5z" fill="#fff"/></svg>',
    prime: '<svg viewBox="0 0 18 18"><rect width="18" height="18" rx="2" fill="#0e9dd9"/><path d="M4 12.5V6l2.5 2L9 4.5 11.5 8 14 6v6.5z" fill="#fff"/></svg>'
  };

  TOOLS.push({
    id: 'twitch',
    label: 'twitch',
    defaults: {
      theme: 'dark', stream: '', cam: '', camCorner: 'bottomright', camSize: 28, camBorder: false,
      avatar: '', name: '', title: '', category: '', viewers: '', uptime: '', live: true,
      goalText: '', goalNow: '', goalMax: '', goalFont: 'Inter', goalColor: '#ffffff', goalBar: '#9147ff', goalSize: 16, goalBox: true,
      chatMode: 'side', chatOpacity: 100,
      emotes: [], chat: []
    },
    fields: [
      { type: 'head', label: 'stream' },
      { key: 'stream', type: 'image', label: 'stream screen', max: 1600 },
      { key: 'cam', type: 'image', label: 'streamer cam', max: 800 },
      { type: 'row', fields: [
        { key: 'camCorner', type: 'select', label: 'cam corner', options: [['topleft', 'top left'], ['topright', 'top right'], ['bottomleft', 'bottom left'], ['bottomright', 'bottom right']] },
        { key: 'camBorder', type: 'toggle', label: 'cam border' }
      ] },
      { key: 'camSize', type: 'range', label: 'cam size', min: 10, max: 60, step: 1 },
      { type: 'head', label: 'daily goal' },
      { key: 'goalText', type: 'text', label: 'goal text', placeholder: 'daily goal: subs' },
      { type: 'row', fields: [
        { key: 'goalNow', type: 'text', label: 'now' },
        { key: 'goalMax', type: 'text', label: 'goal' },
        { key: 'goalBox', type: 'toggle', label: 'box' }
      ] },
      { key: 'goalFont', type: 'select', label: 'font', options: [
        ['Inter', 'normal'], ['Silkscreen', 'pixel'], ['Whisper', 'upright (whisper)'], ['Figtree', 'rounded'],
        ['Impact', 'impact'], ['Comic Sans MS', 'comic sans'], ['Courier New', 'typewriter'], ['Source Serif 4', 'serif'], ['Arial Black', 'arial black']] },
      { type: 'row', fields: [
        { key: 'goalColor', type: 'color', label: 'text color' },
        { key: 'goalBar', type: 'color', label: 'bar color' }
      ] },
      { key: 'goalSize', type: 'range', label: 'goal text size', min: 10, max: 44, step: 1 },
      { type: 'head', label: 'streamer' },
      { key: 'avatar', type: 'image', label: 'pfp', max: 300 },
      { type: 'row', fields: [
        { key: 'name', type: 'text', label: 'name' },
        { key: 'live', type: 'toggle', label: 'live' }
      ] },
      { key: 'title', type: 'text', label: 'stream title' },
      { key: 'category', type: 'text', label: 'category / game' },
      { type: 'row', fields: [
        { key: 'viewers', type: 'text', label: 'viewers' },
        { key: 'uptime', type: 'text', label: 'uptime', placeholder: '2:14:09' },
        { key: 'theme', type: 'select', label: 'mode', options: [['dark', 'dark'], ['light', 'light']] }
      ] },
      { type: 'head', label: 'custom emotes' },
      { key: 'emotes', type: 'list', compact: true,
        adds: [{ label: '+ emote', item: item({ code: '', image: '' }) }],
        item: [
          { type: 'row', fields: [
            { key: 'code', type: 'text', label: 'type this in chat', placeholder: 'lydiaHeart' },
            { key: 'image', type: 'image', label: 'emote pic', max: 112 }
          ] }
        ] },
      { type: 'head', label: 'chat' },
      { key: 'chatMode', type: 'select', label: 'chat spot', options: [['side', 'next to stream'], ['overlay', 'on top of stream']] },
      { key: 'chatOpacity', type: 'range', label: 'chat background opacity', min: 0, max: 100, step: 1 },
      { key: 'chat', type: 'list',
        adds: [{ label: '+ chatter', item: function () {
          return { name: '', color: TWITCH_COLORS[Math.floor(Math.random() * TWITCH_COLORS.length)], badge: 'none', text: '' };
        } }],
        item: [
          { type: 'row', fields: [
            { key: 'name', type: 'text', label: 'name' },
            { key: 'color', type: 'color', label: 'name color' }
          ] },
          { key: 'badge', type: 'select', label: 'badge', options: [['none', 'none'], ['mod', 'mod'], ['vip', 'vip'], ['sub', 'sub'], ['prime', 'prime'], ['streamer', 'streamer'], ['mod+sub', 'mod + sub'], ['vip+sub', 'vip + sub']] },
          { key: 'text', type: 'textarea', label: 'message', rows: 2 }
        ] }
    ],
    render: function (s) {
      var emotes = {};
      (s.emotes || []).forEach(function (e, _i) { if (e.code && e.image) emotes[e.code] = e.image; });
      var chat = (s.chat || []).map(function (c, _i) {
        var words = String(c.text || '').split(/(\s+)/).map(function (w) {
          if (emotes[w]) return '<img class="tv-emote" src="' + emotes[w] + '" alt="">';
          return esc(w).replace(/^@[\w]+/, function (m) { return '<b class="tv-at">' + m + '</b>'; });
        }).join('');
        words = EW('chat.' + _i + '.text', words);
        var badges = (c.badge || 'none').split('+').map(function (b) { return TW_BADGE[b] ? '<span class="tv-badge">' + TW_BADGE[b] + '</span>' : ''; }).join('');
        return '<div class="tv-msg">' + badges + '<b class="tv-name" style="color:' + esc(c.color) + '">' + E('chat.' + _i + '.name', c.name) + '</b><span class="tv-colon">: </span>' + words + '</div>';
      }).join('');
      var cam = s.cam ? '<img class="tv-cam c-' + s.camCorner + (s.camBorder ? ' bordered' : '') + '" style="width:' + s.camSize + '%" src="' + s.cam + '"' + DI('cam') + ' alt="">' : '';
      // the goal sits right under the cam (or right above it when the cam is on the bottom)
      var goal = '';
      if (s.goalText || s.goalMax) {
        var corner = s.camCorner || 'bottomright', w = s.cam ? +s.camSize : 30, off = s.cam ? w * 16 / 12 : 0;
        var left = /left$/.test(corner);
        var pos = (corner.indexOf('top') === 0 ? 'top:' : 'bottom:') + off + '%;' + (left ? 'left:0;' : 'right:0;') + 'width:' + Math.max(w, 22) + '%;';
        var now = parseFloat(String(s.goalNow).replace(/,/g, '')), max = parseFloat(String(s.goalMax).replace(/,/g, ''));
        var pct = max > 0 ? Math.max(0, Math.min(100, (now || 0) / max * 100)) : -1;
        var fam = "'" + s.goalFont + "', 'Noto Color Emoji', sans-serif";
        goal = '<div class="tv-goal' + (s.goalBox ? ' boxed' : '') + (left ? '' : ' r') + '" style="' + pos + 'font-family:' + fam + ';font-size:' + s.goalSize + 'px;color:' + s.goalColor + '">' +
          (s.goalText ? '<div class="tv-goaltext">' + E('goalText', s.goalText) + '</div>' : '') +
          (pct >= 0 ? '<div class="tv-goalbar"><i style="width:' + pct + '%;background:' + s.goalBar + '"></i><span>' + E('goalNow', s.goalNow) + ' / ' + E('goalMax', s.goalMax) + '</span></div>' : '') + '</div>';
      }
      var overlay = s.chatMode === 'overlay';
      var chatBox = '<div class="tv-chat' + (overlay ? ' over' : '') + '" style="--op:' + (s.chatOpacity == null ? 100 : s.chatOpacity) + '%">' +
        (overlay ? '' : '<div class="tv-chathead">STREAM CHAT</div>') + '<div class="tv-msgs">' + chat + '</div>' +
        (overlay ? '' : '<div class="tv-input"><span>Send a message</span></div><div class="tv-chatbtns"><span class="tv-chatbtn">Chat</span></div>') + '</div>';
      return '<div class="shot tv t-' + s.theme + (overlay ? ' overlay' : '') + '"><div class="tv-left">' +
        '<div class="tv-video">' + (s.stream ? '<img class="tv-screen" src="' + s.stream + '"' + DI('stream') + ' alt="">' : '') + cam + goal + (overlay ? chatBox : '') + '</div>' +
        '<div class="tv-info"><div class="tv-ava-wrap' + (s.live ? ' live' : '') + '">' + ava(s.avatar, s.name, 'tv-ava', undefined, 'avatar') + (s.live ? '<span class="tv-livebadge">LIVE</span>' : '') + '</div>' +
        '<div class="tv-meta"><div class="tv-name-row"><b>' + E('name', s.name) + '</b>' + (s.name ? '<span class="tv-check">' + ICON.verified + '</span>' : '') + '</div>' +
        '<div class="tv-title">' + E('title', s.title) + '</div>' +
        '<div class="tv-cat">' + E('category', s.category) + '</div></div>' +
        '<div class="tv-right-meta"><div class="tv-btns"><span class="tv-follow">' + I.heart + 'Follow</span><span class="tv-sub">' + ICON.verified.replace('<svg', '<svg class="tv-star"') + 'Subscribe</span></div>' +
        '<div class="tv-stats">' + (s.viewers ? '<span class="tv-viewers">' + stroke('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5', 2) + E('viewers', s.viewers) + '</span>' : '') +
        (s.uptime ? '<span>' + E('uptime', s.uptime) + '</span>' : '') + '</div></div></div></div>' +
        (overlay ? '' : chatBox) + '</div>';
    }
  });

  /* ============================== brat ============================== */

  var BRAT_PRESETS = {
    brat: ['#8ace00', '#000000'], remix: ['#ffffff', '#000000'], pink: ['#ff8fcf', '#000000'],
    black: ['#000000', '#8ace00'], blood: ['#000000', '#ff1f4b'], baby: ['#bfe4ff', '#000000']
  };

  TOOLS.push({
    id: 'brat',
    label: 'brat',
    defaults: { text: '', preset: 'brat', bg: '#8ace00', fg: '#000000', size: 110, blur: 1.6, squish: 82, align: 'center', lower: true, shape: 'square' },
    fields: [
      { key: 'text', type: 'textarea', label: 'text', rows: 3 },
      { key: 'preset', type: 'select', label: 'colors', onPick: function (s) {
        var p = BRAT_PRESETS[s.preset];
        if (p) { s.bg = p[0]; s.fg = p[1]; }
      }, options: [['brat', 'brat green'], ['remix', 'remix white'], ['pink', 'pink'], ['black', 'black + green'], ['blood', 'black + red'], ['baby', 'baby blue'], ['custom', 'custom']] },
      { type: 'row', fields: [
        { key: 'bg', type: 'color', label: 'background' },
        { key: 'fg', type: 'color', label: 'text color' }
      ] },
      { key: 'size', type: 'range', label: 'text size', min: 30, max: 260, step: 1 },
      { key: 'blur', type: 'range', label: 'blur', min: 0, max: 8, step: 0.1 },
      { key: 'squish', type: 'range', label: 'squish', min: 50, max: 130, step: 1 },
      { type: 'row', fields: [
        { key: 'align', type: 'select', label: 'align', options: [['center', 'center'], ['justify', 'spread out'], ['left', 'left'], ['right', 'right']] },
        { key: 'shape', type: 'select', label: 'shape', options: [['square', 'square'], ['wide', 'wide'], ['story', 'story']] },
        { key: 'lower', type: 'toggle', label: 'lowercase' }
      ] }
    ],
    render: function (s) {
      var t = s.lower ? String(s.text || '').toLowerCase() : String(s.text || '');
      var k = (+s.squish || 100) / 100;
      return '<div class="shot brat sh-' + s.shape + '" style="background:' + s.bg + '">' +
        '<div class="brat-t a-' + s.align + '" style="color:' + s.fg + ';font-size:' + s.size + 'px;filter:blur(' + s.blur + 'px);' +
        'transform:scaleX(' + k + ');width:' + (100 / k) + '%">' + EW('text', br(t)) + '</div></div>';
    }
  });

  /* tab order */
  var ORDER = ['spotify', 'applemusic', 'tweet', 'imessage', 'igdm', 'igcomments', 'tiktok', 'twitch', 'youtube', 'reddit', 'facebook', 'pinterest', 'whisper', 'brat', 'snapchat', 'discord', 'chatgpt', 'claude', 'google', 'tumblr', 'notes'];
  TOOLS.sort(function (a, b) { return ORDER.indexOf(a.id) - ORDER.indexOf(b.id); });
})();
