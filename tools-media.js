/* screenies — spotify wrapped/playlist/friend activity, pinterest feed, discord call/profile, youtube notifications,
   food delivery, sims 4, glitter text */

(function () {
  var esc = U.esc, ava = U.avatar;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function fill(d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' ph0"' + DI(path) + '></div>'; }
  var M = {
    play: fill('M8 5.5v13l11-6.5z'),
    shuffle: stroke('M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5', 1.9),
    dl: stroke('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v7M9 12.5l3 3 3-3', 1.7),
    plus: stroke('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8', 1.7),
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    clock: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', 1.7),
    note: fill('M9 17.5a2.5 2.5 0 1 1-2-2.45V5l11-2v10.5a2.5 2.5 0 1 1-2-2.45V6.4L9 7.7z'),
    eq: '<svg viewBox="0 0 16 16"><rect x="1" y="6" width="3" height="9" rx="1"/><rect x="6.5" y="2" width="3" height="13" rx="1"/><rect x="12" y="8" width="3" height="7" rx="1"/></svg>',
    friends: stroke('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5c2 .6 3.3 2.4 3.5 5.5', 1.7),
    x: stroke('M6 6l12 12M18 6 6 18', 2),
    search: stroke('M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20', 2),
    home: fill('M12 3 3 10.5V21h6.5v-6h5v6H21V10.5z'),
    bell: stroke('M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0', 1.8),
    chat: stroke('M12 3.5c5 0 9 3.4 9 7.8S17 19 12 19c-1 0-2-.1-2.9-.4L4 21l1.5-4.1C4 15.4 3 13.4 3 11.3 3 6.9 7 3.5 12 3.5z', 1.8),
    user: stroke('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.6-4 3.8-6.5 8-6.5s7.4 2.5 8 6.5', 1.8),
    mic: fill('M12 2.5a3.3 3.3 0 0 1 3.3 3.3v5.4a3.3 3.3 0 0 1-6.6 0V5.8A3.3 3.3 0 0 1 12 2.5zM5.5 11h1.8a4.7 4.7 0 0 0 9.4 0h1.8a6.5 6.5 0 0 1-5.6 6.4V21h-1.8v-3.6A6.5 6.5 0 0 1 5.5 11z'),
    micOff: stroke('M9 9v2a3 3 0 0 0 5.1 2.1M15 9.3V5.8a3 3 0 0 0-5.8-1.1M6 11a6 6 0 0 0 9.6 4.8M18 11a6 6 0 0 1-.4 2.2M12 17v4M3.5 3.5l17 17', 2),
    deaf: stroke('M4 14v-2a8 8 0 0 1 13.6-5.7M20 12v2M4 14h3v6H5a1 1 0 0 1-1-1zM17 15v5h2a1 1 0 0 0 1-1v-4M3.5 3.5l17 17', 2),
    headset: stroke('M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z', 2),
    cam: fill('M3 7.5A2.5 2.5 0 0 1 5.5 5h8A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 16.5zM17 10l4-2.5v9L17 14z'),
    screen: stroke('M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.5zM8 21h8M12 17v4M12 13V8M9.5 10.5 12 8l2.5 2.5', 1.8),
    rocket: stroke('M5 19c1-3 2-5 5-6M14.5 4.5c3-1 5-1 5-1s0 2-1 5l-6 6-4-4zM9 9l-3 .5-2 2.5 3.5 1M15 15l-.5 3-2.5 2-1-3.5', 1.7),
    hang: '<svg viewBox="0 0 24 24"><path transform="rotate(135 12 12)" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
    speaker: stroke('M4 9h4l5-4.5v15L8 15H4zM16.5 8.5a5 5 0 0 1 0 7', 2),
    gear: stroke('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', 1.5),
    phone: stroke('M5.2 3.5h3.3l1.7 4.3-2.2 1.4a12 12 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7v3.3a1.7 1.7 0 0 1-1.8 1.7A17 17 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8z', 1.8),
    star: fill('M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z'),
    pin: fill('M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z')
  };
  var SPOTIFY = ICON.spotify;

  /* ============================== spotify wrapped ============================== */

  var WR_PAL = {
    pink: ['#ff4fb2', '#1a0a2e', '#ffe14d'], lime: ['#c6f432', '#111111', '#7b2ff7'], purple: ['#6b2bd9', '#ffd5f5', '#c6f432'],
    black: ['#111111', '#1ed760', '#ff4fb2'], orange: ['#ff6f1a', '#2a0f00', '#fff0d6'], red: ['#b3001b', '#ffd6de', '#ffffff']
  };
  TOOLS.push({
    id: 'wrapped',
    label: 'spotify wrapped',
    defaults: { slide: 'summary', pal: 'pink', year: '2026', artistPic: '', minutes: '', genre: '', topArtist: '', artistMinutes: '', percent: '', artists: [], songs: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'slide', type: 'select', label: 'slide', options: [['summary', 'summary card'], ['minutes', 'minutes listened'], ['artist', 'top artist'], ['songs', 'top songs']] },
        { key: 'pal', type: 'select', label: 'colors', options: Object.keys(WR_PAL).map(function (k) { return [k, k]; }) },
        { key: 'year', type: 'text', label: 'year' }
      ] },
      { key: 'artistPic', type: 'image', label: 'top artist picture', max: 900 },
      { type: 'row', fields: [
        { key: 'topArtist', type: 'text', label: 'top artist' },
        { key: 'artistMinutes', type: 'text', label: 'minutes with them' }
      ] },
      { type: 'row', fields: [
        { key: 'minutes', type: 'text', label: 'minutes listened', placeholder: '48,219' },
        { key: 'percent', type: 'text', label: 'top %', placeholder: '1%' },
        { key: 'genre', type: 'text', label: 'top genre' }
      ] },
      { type: 'head', label: 'top artists' },
      { key: 'artists', type: 'list', compact: true, adds: [{ label: '+ artist', item: item({ name: '' }) }], item: [{ key: 'name', type: 'text', label: 'artist' }] },
      { type: 'head', label: 'top songs' },
      { key: 'songs', type: 'list', compact: true, adds: [{ label: '+ song', item: item({ title: '', artist: '', cover: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'title', type: 'text', label: 'song' },
          { key: 'artist', type: 'text', label: 'artist' }
        ] },
        { key: 'cover', type: 'image', label: 'cover', max: 300 }
      ] }
    ],
    render: function (s) {
      var p = WR_PAL[s.pal] || WR_PAL.pink, style = 'background:' + p[0] + ';color:' + p[1] + ';--hi:' + p[2];
      var logo = '<div class="wr-logo">' + SPOTIFY + '<span>Spotify</span></div>';
      var artists = (s.artists || []).slice(0, 5).map(function (a, i) { return '<li><b>' + (i + 1) + '</b>' + E('artists.' + i + '.name', a.name) + '</li>'; }).join('');
      var songs = (s.songs || []).slice(0, 5);
      var body;
      if (s.slide === 'minutes') {
        body = '<div class="wr-center"><div class="wr-small">You listened to</div><div class="wr-huge">' + E('minutes', s.minutes) + '</div><div class="wr-mid">minutes this year.</div>' +
          (s.percent ? '<div class="wr-pill">That puts you in the top ' + E('percent', s.percent) + ' of listeners</div>' : '') + '</div>';
      } else if (s.slide === 'artist') {
        body = '<div class="wr-center"><div class="wr-small">Your top artist was</div>' + pic(s.artistPic, 'artistPic', 'wr-bigpic') +
          '<div class="wr-name">' + E('topArtist', s.topArtist) + '</div>' + (s.artistMinutes ? '<div class="wr-mid">You listened for ' + E('artistMinutes', s.artistMinutes) + ' minutes</div>' : '') + '</div>';
      } else if (s.slide === 'songs') {
        body = '<div class="wr-top"><div class="wr-mid">Your top songs</div><ol class="wr-songs">' + songs.map(function (x, i) {
          var pre = 'songs.' + i + '.';
          return '<li><b>' + (i + 1) + '</b>' + pic(x.cover, pre + 'cover', 'wr-cov') + '<div><span>' + E(pre + 'title', x.title) + '</span><small>' + E(pre + 'artist', x.artist) + '</small></div></li>';
        }).join('') + '</ol></div>';
      } else {
        body = '<div class="wr-sum">' + pic(s.artistPic, 'artistPic', 'wr-sumpic') +
          '<div class="wr-cols"><div><div class="wr-lab">Top Artists</div><ol class="wr-list">' + artists + '</ol></div>' +
          '<div><div class="wr-lab">Top Songs</div><ol class="wr-list">' + songs.map(function (x, i) { return '<li><b>' + (i + 1) + '</b>' + E('songs.' + i + '.title', x.title) + '</li>'; }).join('') + '</ol></div></div>' +
          '<div class="wr-cols"><div><div class="wr-lab">Minutes Listened</div><div class="wr-stat">' + E('minutes', s.minutes) + '</div></div>' +
          '<div><div class="wr-lab">Top Genre</div><div class="wr-stat">' + E('genre', s.genre) + '</div></div></div></div>';
      }
      return '<div class="shot wr" style="' + style + '"><div class="wr-head">' + logo + '<span class="wr-year">' + E('year', s.year) + ' Wrapped</span></div>' + body +
        (s.slide === 'summary' ? '<div class="wr-foot">SPOTIFY.COM/WRAPPED</div>' : '') + '</div>';
    }
  });

  /* ============================== spotify playlist ============================== */

  TOOLS.push({
    id: 'playlist',
    label: 'spotify playlist',
    defaults: { cover: '', palette: [], bg: '#6b2b4a', kind: 'Public Playlist', title: '', desc: '', ownerPic: '', owner: '', saves: '', total: '', tracks: [] },
    fields: [
      { key: 'cover', type: 'image', label: 'playlist cover', max: 600, palette: true },
      { key: 'bg', type: 'color', label: 'header color', swatches: function (s) { return s.palette; } },
      { key: 'title', type: 'text', label: 'playlist name' },
      { key: 'desc', type: 'text', label: 'description' },
      { type: 'row', fields: [
        { key: 'ownerPic', type: 'image', label: 'your pfp', max: 200 },
        { key: 'owner', type: 'text', label: 'made by' }
      ] },
      { type: 'row', fields: [
        { key: 'saves', type: 'text', label: 'saves' },
        { key: 'total', type: 'text', label: 'songs, length', placeholder: '48 songs, 2 hr 41 min' }
      ] },
      { type: 'head', label: 'songs' },
      { key: 'tracks', type: 'list', adds: [{ label: '+ song', item: item({ cover: '', title: '', artist: '', album: '', added: '', time: '' }) }], item: [
        { key: 'cover', type: 'image', label: 'cover', max: 200 },
        { type: 'row', fields: [
          { key: 'title', type: 'text', label: 'song' },
          { key: 'artist', type: 'text', label: 'artist' }
        ] },
        { type: 'row', fields: [
          { key: 'album', type: 'text', label: 'album' },
          { key: 'added', type: 'text', label: 'date added' },
          { key: 'time', type: 'text', label: 'length' }
        ] }
      ] }
    ],
    render: function (s) {
      var rows = (s.tracks || []).map(function (t, i) {
        var pre = 'tracks.' + i + '.';
        return '<div class="pl-row"><span class="pl-n">' + (i + 1) + '</span><div class="pl-t">' + pic(t.cover, pre + 'cover', 'pl-cov') +
          '<div><b>' + E(pre + 'title', t.title) + '</b><span>' + E(pre + 'artist', t.artist) + '</span></div></div>' +
          '<span class="pl-al">' + E(pre + 'album', t.album) + '</span><span class="pl-ad">' + E(pre + 'added', t.added) + '</span><span class="pl-tm">' + E(pre + 'time', t.time) + '</span></div>';
      }).join('');
      return '<div class="shot pl"><div class="pl-head" style="background:linear-gradient(' + s.bg + ',' + U.shade(s.bg, -0.45) + ')">' +
        pic(s.cover, 'cover', 'pl-cover') + '<div class="pl-info"><span>' + E('kind', s.kind) + '</span><h1>' + E('title', s.title) + '</h1>' +
        '<p>' + E('desc', s.desc) + '</p><div class="pl-meta">' + ava(s.ownerPic, s.owner, 'pl-own', undefined, 'ownerPic') + '<b>' + E('owner', s.owner) + '</b>' +
        (s.saves ? '<span>• ' + E('saves', s.saves) + ' saves</span>' : '') + (s.total ? '<span>• ' + E('total', s.total) + '</span>' : '') + '</div></div></div>' +
        '<div class="pl-body" style="background:linear-gradient(' + U.shade(s.bg, -0.55) + ' 0, #121212 240px)"><div class="pl-acts"><span class="pl-play">' + M.play + '</span>' +
        '<span class="pl-ic">' + M.shuffle + '</span><span class="pl-ic">' + M.dl + '</span><span class="pl-ic">' + M.dots + '</span></div>' +
        '<div class="pl-cols"><span class="pl-n">#</span><span class="pl-t">Title</span><span class="pl-al">Album</span><span class="pl-ad">Date added</span><span class="pl-tm">' + M.clock + '</span></div>' +
        rows + '</div></div>';
    }
  });

  /* ============================== spotify friend activity ============================== */

  TOOLS.push({
    id: 'friendact',
    label: 'friend activity',
    defaults: { people: [] },
    fields: [
      { key: 'people', type: 'list', adds: [{ label: '+ friend', item: item({ pfp: '', name: '', song: '', artist: '', from: '', when: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'pfp', type: 'image', label: 'pfp', max: 200 },
          { key: 'name', type: 'text', label: 'name' }
        ] },
        { type: 'row', fields: [
          { key: 'song', type: 'text', label: 'song' },
          { key: 'artist', type: 'text', label: 'artist' }
        ] },
        { type: 'row', fields: [
          { key: 'from', type: 'text', label: 'playlist / album' },
          { key: 'when', type: 'text', label: 'when (blank = now)', placeholder: '2 hr' }
        ] }
      ] }
    ],
    render: function (s) {
      var rows = (s.people || []).map(function (p, i) {
        var pre = 'people.' + i + '.', now = !p.when || p.when === GHOST;
        return '<div class="fa-row"><div class="fa-av">' + ava(p.pfp, p.name, 'fa-pfp', '#535353', pre + 'pfp') + (now ? '<i class="fa-on"></i>' : '') + '</div>' +
          '<div class="fa-mid"><div class="fa-top"><b>' + E(pre + 'name', p.name) + '</b><span class="fa-when">' + (now ? '<span class="fa-eq">' + M.eq + '</span>' : '') + E(pre + 'when', p.when) + '</span></div>' +
          '<div class="fa-song">' + E(pre + 'song', p.song) + ' • ' + E(pre + 'artist', p.artist) + '</div>' +
          '<div class="fa-from">' + M.note + E(pre + 'from', p.from) + '</div></div></div>';
      }).join('');
      return '<div class="shot fa"><div class="fa-head"><b>Friend Activity</b><span>' + M.friends + M.x + '</span></div>' + rows + '</div>';
    }
  });

  /* ============================== pinterest feed ============================== */

  TOOLS.push({
    id: 'pinfeed',
    label: 'pinterest feed',
    defaults: { theme: 'light', tab: 'All', boards: '', pins: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
        { key: 'tab', type: 'text', label: 'first tab' }
      ] },
      { key: 'boards', type: 'text', label: 'more tabs (commas)', placeholder: 'emo, room, hair' },
      { type: 'head', label: 'pins' },
      { key: 'pins', type: 'list', compact: true, adds: [{ label: '+ pin', item: item({ image: '', title: '' }) }], item: [
        { key: 'image', type: 'image', label: 'picture', max: 700 },
        { key: 'title', type: 'text', label: 'title (optional)' }
      ] }
    ],
    render: function (s) {
      var tabs = [s.tab].concat(String(s.boards || '').split(',')).map(function (t) { return bare(t).trim(); }).filter(Boolean);
      var pins = (s.pins || []).map(function (p, i) {
        var pre = 'pins.' + i + '.';
        return '<div class="pf2-pin">' + (p.image ? '<img src="' + p.image + '"' + DI(pre + 'image') + ' alt="">' : '<div class="pf2-ph" style="height:' + (160 + (i * 67) % 120) + 'px"' + DI(pre + 'image') + '></div>') +
          '<div class="pf2-t">' + E(pre + 'title', p.title) + '<span>' + M.dots + '</span></div></div>';
      }).join('');
      return '<div class="shot pf2 t-' + s.theme + '"><div class="pf2-tabs">' + tabs.map(function (t, i) { return '<span' + (i ? '' : ' class="on"') + '>' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<div class="pf2-grid">' + pins + '</div>' +
        '<div class="pf2-nav"><span class="on">' + M.home + '</span><span>' + M.search + '</span><span>' + stroke('M12 5v14M5 12h14', 2) + '</span><span>' + M.chat + '</span><span>' + M.user + '</span></div></div>';
    }
  });

  /* ============================== discord call ============================== */

  TOOLS.push({
    id: 'dccall',
    label: 'discord call',
    defaults: { channel: '', time: '', people: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'channel', type: 'text', label: 'call / channel name' },
        { key: 'time', type: 'text', label: 'call time', placeholder: '1:24:07' }
      ] },
      { type: 'head', label: 'people in the call' },
      { key: 'people', type: 'list', adds: [{ label: '+ person', item: item({ pfp: '', name: '', color: '#5865f2', speaking: false, muted: false, deaf: false, video: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'pfp', type: 'image', label: 'pfp', max: 300 },
          { key: 'name', type: 'text', label: 'name' },
          { key: 'color', type: 'color', label: 'tile color' }
        ] },
        { key: 'video', type: 'image', label: 'camera (optional)', max: 900 },
        { type: 'row', fields: [
          { key: 'speaking', type: 'toggle', label: 'talking' },
          { key: 'muted', type: 'toggle', label: 'muted' },
          { key: 'deaf', type: 'toggle', label: 'deafened' }
        ] }
      ] }
    ],
    render: function (s) {
      var ppl = s.people || [];
      var tiles = ppl.map(function (p, i) {
        var pre = 'people.' + i + '.';
        return '<div class="dcc-tile' + (p.speaking ? ' talk' : '') + '" style="background:' + (p.video ? '#000' : p.color) + '">' +
          (p.video ? '<img class="dcc-vid" src="' + p.video + '"' + DI(pre + 'video') + ' alt="">' : ava(p.pfp, p.name, 'dcc-pfp', undefined, pre + 'pfp')) +
          '<div class="dcc-name">' + (p.muted ? '<i class="dcc-st">' + M.micOff + '</i>' : '') + (p.deaf ? '<i class="dcc-st">' + M.deaf + '</i>' : '') + E(pre + 'name', p.name) + '</div></div>';
      }).join('');
      var cols = ppl.length <= 1 ? 1 : ppl.length <= 4 ? 2 : 3;
      return '<div class="shot dcc"><div class="dcc-top">' + M.speaker + '<b>' + E('channel', s.channel) + '</b>' + (s.time ? '<span>' + E('time', s.time) + '</span>' : '') + '</div>' +
        '<div class="dcc-grid" style="grid-template-columns:repeat(' + cols + ',1fr)">' + tiles + '</div>' +
        '<div class="dcc-bar"><span class="dcc-b">' + M.cam + '</span><span class="dcc-b">' + M.screen + '</span><span class="dcc-b">' + M.rocket + '</span>' +
        '<span class="dcc-b">' + M.mic + '</span><span class="dcc-b">' + M.headset + '</span><span class="dcc-b red">' + M.hang + '</span></div></div>';
    }
  });

  /* ============================== discord profile ============================== */

  var DC_STATUS = { online: '#23a55a', idle: '#f0b232', dnd: '#f23f43', offline: '#80848e' };
  TOOLS.push({
    id: 'dcprofile',
    label: 'discord profile',
    defaults: { banner: '', bannerColor: '#b83b7a', pfp: '', status: 'online', display: '', user: '', pronouns: '', custom: '', about: '', since: '', badges: '', roles: [] },
    fields: [
      { key: 'banner', type: 'image', label: 'banner', max: 900 },
      { key: 'bannerColor', type: 'color', label: 'banner color (no banner pic)' },
      { type: 'row', fields: [
        { key: 'pfp', type: 'image', label: 'pfp', max: 300 },
        { key: 'status', type: 'select', label: 'status', options: [['online', 'online'], ['idle', 'idle'], ['dnd', 'do not disturb'], ['offline', 'offline']] }
      ] },
      { type: 'row', fields: [
        { key: 'display', type: 'text', label: 'display name' },
        { key: 'user', type: 'text', label: 'username' },
        { key: 'pronouns', type: 'text', label: 'pronouns' }
      ] },
      { key: 'custom', type: 'text', label: 'custom status' },
      { key: 'badges', type: 'text', label: 'badges (symbols)', placeholder: '✦ ♱ ☾' },
      { key: 'about', type: 'textarea', label: 'about me', rows: 3 },
      { key: 'since', type: 'text', label: 'member since', placeholder: 'Mar 14, 2019' },
      { type: 'head', label: 'roles' },
      { key: 'roles', type: 'list', compact: true, adds: [{ label: '+ role', item: item({ name: '', color: '#ff77c8' }) }], item: [
        { type: 'row', fields: [
          { key: 'name', type: 'text', label: 'role' },
          { key: 'color', type: 'color', label: 'color' }
        ] }
      ] }
    ],
    render: function (s) {
      var roles = (s.roles || []).map(function (r, i) { return '<span class="dp-role"><i style="background:' + esc(r.color) + '"></i>' + E('roles.' + i + '.name', r.name) + '</span>'; }).join('');
      var badges = [...bare(String(s.badges || ''))].filter(function (c) { return c.trim(); }).map(function (b) { return '<i>' + esc(b) + '</i>'; }).join('');
      return '<div class="shot dp"><div class="dp-banner" style="background:' + s.bannerColor + '">' + (s.banner ? '<img src="' + s.banner + '"' + DI('banner') + ' alt="">' : '<div class="dp-bph"' + DI('banner') + '></div>') + '</div>' +
        '<div class="dp-avwrap">' + ava(s.pfp, s.display || s.user, 'dp-pfp', '#5865f2', 'pfp') + '<i class="dp-dot" style="background:' + DC_STATUS[s.status] + '"></i>' +
        (s.custom ? '<div class="dp-bubble">' + E('custom', s.custom) + '</div>' : '') + '</div>' +
        '<div class="dp-body"><div class="dp-name">' + E('display', s.display) + '</div><div class="dp-user">' + E('user', s.user) + (s.pronouns ? ' • ' + E('pronouns', s.pronouns) : '') +
        (badges ? '<span class="dp-badges">' + badges + '</span>' : '') + '</div>' +
        '<div class="dp-card"><div class="dp-lab">About Me</div><div class="dp-about">' + EB('about', s.about) + '</div>' +
        '<div class="dp-lab">Member Since</div><div class="dp-since">' + ICON.hash.replace('<svg', '<svg class="dp-hash"') + E('since', s.since) + '</div>' +
        (roles ? '<div class="dp-lab">Roles</div><div class="dp-roles">' + roles + '</div>' : '') + '</div>' +
        '<div class="dp-msg">Message @' + E('user', s.user) + '</div></div></div>';
    }
  });

  /* ============================== youtube notifications ============================== */

  TOOLS.push({
    id: 'ytnotif',
    label: 'youtube notifications',
    defaults: { theme: 'dark', list: [] },
    fields: [
      { key: 'theme', type: 'select', label: 'mode', options: [['dark', 'dark'], ['light', 'light']] },
      { key: 'list', type: 'list', adds: [{ label: '+ notification', item: item({ pfp: '', text: '', time: '', thumb: '', unread: true }) }], item: [
        { type: 'row', fields: [
          { key: 'pfp', type: 'image', label: 'channel pfp', max: 200 },
          { key: 'thumb', type: 'image', label: 'video thumbnail', max: 500 }
        ] },
        { key: 'text', type: 'textarea', label: 'notification', rows: 2, placeholder: '@draculaura replied: omg yes' },
        { type: 'row', fields: [
          { key: 'time', type: 'text', label: 'time', placeholder: '2 hours ago' },
          { key: 'unread', type: 'toggle', label: 'blue dot' }
        ] }
      ] }
    ],
    render: function (s) {
      var rows = (s.list || []).map(function (n, i) {
        var pre = 'list.' + i + '.';
        return '<div class="yn-row"><i class="yn-dot' + (n.unread ? ' on' : '') + '"></i>' + ava(n.pfp, n.text, 'yn-pfp', undefined, pre + 'pfp') +
          '<div class="yn-mid"><div class="yn-text">' + EB(pre + 'text', n.text) + '</div><div class="yn-time">' + E(pre + 'time', n.time) + '</div></div>' +
          pic(n.thumb, pre + 'thumb', 'yn-thumb') + '<span class="yn-more">' + M.dots + '</span></div>';
      }).join('');
      return '<div class="shot yn t-' + s.theme + '"><div class="yn-head"><b>Notifications</b>' + M.gear + '</div>' + rows + '</div>';
    }
  });

  /* ============================== food delivery ============================== */

  TOOLS.push({
    id: 'delivery',
    label: 'food delivery',
    defaults: { app: 'uber', clock: '9:41', battery: 64, showPct: false, eta: '', status: '', step: 2, driverPic: '', driver: '', car: '', rating: '', store: '', items: '' },
    fields: [
      U.STATUS_FIELDS,
      { key: 'app', type: 'select', label: 'app', options: [['uber', 'uber eats'], ['dash', 'doordash']] },
      { type: 'row', fields: [
        { key: 'eta', type: 'text', label: 'arriving', placeholder: '9:52 PM' },
        { key: 'step', type: 'select', label: 'progress', options: [['0', 'preparing'], ['1', 'picked up'], ['2', 'on the way'], ['3', 'almost there']] }
      ] },
      { key: 'status', type: 'text', label: 'status line', placeholder: 'Your order is on the way' },
      { type: 'row', fields: [
        { key: 'driverPic', type: 'image', label: 'driver pic', max: 200 },
        { key: 'driver', type: 'text', label: 'driver name' },
        { key: 'rating', type: 'text', label: 'rating', placeholder: '4.9' }
      ] },
      { key: 'car', type: 'text', label: 'car', placeholder: 'Black Honda Civic • 8KXT221' },
      { key: 'store', type: 'text', label: 'restaurant' },
      { key: 'items', type: 'textarea', label: 'order (one per line)', rows: 3, placeholder: '1x hot cheetos\n2x strawberry pocky' }
    ],
    render: function (s) {
      var step = +s.step || 0, segs = '';
      for (var k = 0; k < 4; k++) segs += '<i class="' + (k < step ? 'done' : k === step ? 'now' : '') + '"></i>';
      var items = String(bare(s.items) || '').split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
      return '<div class="shot dl a-' + s.app + '">' + U.statusBar(s) +
        '<div class="dl-map"><svg class="dl-route" viewBox="0 0 390 300" preserveAspectRatio="none"><path d="M60 250 L60 190 L170 190 L170 110 L300 110 L300 60" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span class="dl-car" style="left:170px;top:150px"></span><span class="dl-home" style="left:300px;top:60px">' + M.pin + '</span><span class="dl-store" style="left:60px;top:250px"></span></div>' +
        '<div class="dl-sheet"><div class="dl-grab"></div><div class="dl-eta">' + (s.app === 'dash' ? 'Arriving at ' : 'Arriving by ') + E('eta', s.eta) + '</div>' +
        '<div class="dl-status">' + E('status', s.status) + '</div><div class="dl-steps">' + segs + '</div>' +
        '<div class="dl-driver">' + ava(s.driverPic, s.driver, 'dl-dpic', undefined, 'driverPic') + '<div><b>' + E('driver', s.driver) + (s.rating ? ' <span>★ ' + E('rating', s.rating) + '</span>' : '') + '</b>' +
        '<small>' + E('car', s.car) + '</small></div><span class="dl-btn">' + M.chat + '</span><span class="dl-btn">' + M.phone + '</span></div>' +
        '<div class="dl-order"><b>' + E('store', s.store) + '</b><ul>' + EW('items', items) + '</ul></div></div></div>';
    }
  });

  /* ============================== sims 4 ============================== */

  var SIM_MOODS = { happy: '#62b43b', sad: '#3a78c3', angry: '#d4403a', flirty: '#e0639f', energized: '#f39b1c', tense: '#d9772d', confident: '#2d5fa8',
    focused: '#7954c9', playful: '#e8b90e', inspired: '#1ba3a3', uncomfortable: '#8a8a8a', embarrassed: '#c9739c', bored: '#9b9b9b', dazed: '#9a7fc4', fine: '#c8c8c8' };
  var MOOD_OPTS = Object.keys(SIM_MOODS).map(function (k) { return [k, k]; });
  var PLUMBOB = '<svg viewBox="0 0 20 32"><path d="M10 0 20 12 10 32 0 12z" fill="currentColor"/><path d="M10 0 20 12 10 14z" fill="rgba(255,255,255,.45)"/><path d="M10 0 0 12 10 14z" fill="rgba(255,255,255,.2)"/></svg>';
  TOOLS.push({
    id: 'sims',
    label: 'sims 4',
    defaults: { show: 'both', mood: 'happy', moodText: '', moodlets: [], rels: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'show', type: 'select', label: 'show', options: [['both', 'moodlets + relationships'], ['moods', 'moodlets'], ['rels', 'relationships']] },
        { key: 'mood', type: 'select', label: 'current mood', options: MOOD_OPTS }
      ] },
      { key: 'moodText', type: 'text', label: 'mood title (blank = mood name)' },
      { type: 'head', label: 'moodlets' },
      { key: 'moodlets', type: 'list', adds: [{ label: '+ moodlet', item: item({ icon: '', symbol: '', title: '', mood: 'happy', amount: '+1', desc: '', time: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'icon', type: 'image', label: 'icon', max: 200 },
          { key: 'symbol', type: 'text', label: 'or a symbol', placeholder: '♡' }
        ] },
        { key: 'title', type: 'text', label: 'moodlet' },
        { type: 'row', fields: [
          { key: 'mood', type: 'select', label: 'mood', options: MOOD_OPTS },
          { key: 'amount', type: 'text', label: 'amount', placeholder: '+2' },
          { key: 'time', type: 'text', label: 'time left', placeholder: '3 hours' }
        ] },
        { key: 'desc', type: 'textarea', label: 'description', rows: 2 }
      ] },
      { type: 'head', label: 'relationships' },
      { key: 'rels', type: 'list', adds: [{ label: '+ sim', item: item({ pic: '', name: '', label: '', friend: 70, romance: 0 }) }], item: [
        { type: 'row', fields: [
          { key: 'pic', type: 'image', label: 'portrait', max: 300 },
          { key: 'name', type: 'text', label: 'name' }
        ] },
        { key: 'label', type: 'text', label: 'relationship', placeholder: 'Best Friends' },
        { key: 'friend', type: 'range', label: 'friendship', min: -100, max: 100, step: 1 },
        { key: 'romance', type: 'range', label: 'romance', min: -100, max: 100, step: 1 }
      ] }
    ],
    render: function (s) {
      var mc = SIM_MOODS[s.mood] || SIM_MOODS.fine;
      function bar(v, cls) {
        v = Math.max(-100, Math.min(100, +v || 0));
        var w = Math.abs(v) / 2;
        return '<div class="sm-bar ' + cls + '"><i style="' + (v >= 0 ? 'left:50%' : 'right:50%') + ';width:' + w + '%"></i><em></em></div>';
      }
      var moods = (s.moodlets || []).map(function (m, i) {
        var pre = 'moodlets.' + i + '.', c = SIM_MOODS[m.mood] || mc;
        var icon = m.icon ? '<img src="' + m.icon + '"' + DI(pre + 'icon') + ' alt="">' : '<span>' + E(pre + 'symbol', m.symbol) + '</span>';
        return '<div class="sm-ml"><div class="sm-icon" style="border-color:' + c + ';background:' + c + '22">' + icon + '</div>' +
          '<div class="sm-mtext"><b>' + E(pre + 'title', m.title) + '</b><div class="sm-amt" style="color:' + c + '">' + E(pre + 'amount', m.amount) + ' ' + esc(m.mood[0].toUpperCase() + m.mood.slice(1)) + '</div>' +
          '<p>' + EB(pre + 'desc', m.desc) + '</p>' + (m.time ? '<small>' + E(pre + 'time', m.time) + '</small>' : '') + '</div></div>';
      }).join('');
      var rels = (s.rels || []).map(function (r, i) {
        var pre = 'rels.' + i + '.';
        return '<div class="sm-rel">' + ava(r.pic, r.name, 'sm-rpic', '#8fb8de', pre + 'pic') + '<div class="sm-rmid"><div class="sm-rname"><b>' + E(pre + 'name', r.name) + '</b><span>' + E(pre + 'label', r.label) + '</span></div>' +
          bar(r.friend, 'fr') + bar(r.romance, 'ro') + '</div></div>';
      }).join('');
      var moodTitle = s.moodText && s.moodText !== GHOST ? E('moodText', s.moodText) : '<span data-e="moodText">' + esc(s.mood[0].toUpperCase() + s.mood.slice(1)) + '</span>';
      return '<div class="shot sims">' +
        (s.show !== 'rels' ? '<div class="sm-panel"><div class="sm-head" style="color:' + mc + '"><span class="sm-plumbob">' + PLUMBOB + '</span><b>' + moodTitle + '</b></div><div class="sm-list">' + moods + '</div></div>' : '') +
        (s.show !== 'moods' ? '<div class="sm-panel"><div class="sm-head2">Relationships</div><div class="sm-list">' + rels + '</div></div>' : '') + '</div>';
    }
  });

  /* ============================== glitter text ============================== */

  var GLIT = {
    pink: ['#ff4fb2', '#ffb3e0', '#ffffff', '#d4147f', '#ff8fd0'], silver: ['#ffffff', '#c9ced6', '#8a93a3', '#eef2f8', '#5f6878'],
    gold: ['#fff3a8', '#ffd84d', '#d9a20a', '#fff', '#a8760a'], black: ['#222', '#555', '#999', '#000', '#ddd'],
    purple: ['#b86bff', '#e0bfff', '#fff', '#6b1fc2', '#9e4dff'], rainbow: ['#ff5f7a', '#ffd84d', '#6bff95', '#5fd4ff', '#c38bff', '#fff'],
    red: ['#ff3b3b', '#ff9a9a', '#fff', '#9e0000', '#ff6464'], blue: ['#5fb8ff', '#c3e6ff', '#fff', '#1464c2', '#8fd0ff']
  };
  var glitCache = {};
  // a sparkly texture made once per color set (seeded, so it looks the same every time)
  function glitterTex(name) {
    if (glitCache[name]) return glitCache[name];
    var cols = GLIT[name] || GLIT.pink, c = document.createElement('canvas');
    c.width = c.height = 96;
    var g = c.getContext('2d'), seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    g.fillStyle = cols[3];
    g.fillRect(0, 0, 96, 96);
    for (var i = 0; i < 1400; i++) {
      g.fillStyle = cols[Math.floor(rnd() * cols.length)];
      var sz = rnd() < 0.85 ? 1 + Math.floor(rnd() * 2) : 3;
      g.fillRect(Math.floor(rnd() * 96), Math.floor(rnd() * 96), sz, sz);
    }
    return (glitCache[name] = c.toDataURL('image/png'));
  }
  TOOLS.push({
    id: 'glitter',
    label: 'glitter text',
    defaults: { text: '', color: 'pink', font: 'Pacifico', size: 110, outline: true, outlineColor: '#ffffff', sparkles: true, bg: 'transparent' },
    fields: [
      { key: 'text', type: 'textarea', label: 'text', rows: 2 },
      { type: 'row', fields: [
        { key: 'color', type: 'select', label: 'glitter', options: Object.keys(GLIT).map(function (k) { return [k, k]; }) },
        { key: 'font', type: 'select', label: 'font', options: [['Pacifico', 'bubbly script'], ['Great Vibes', 'fancy script'], ['Cherry Bomb One', 'cute round'], ['Anton', 'bold'], ['Rye', 'western'], ['Silkscreen', 'pixel'], ['Georgia', 'classic']] }
      ] },
      { key: 'size', type: 'range', label: 'size', min: 40, max: 220, step: 1 },
      { type: 'row', fields: [
        { key: 'outlineColor', type: 'color', label: 'outline' },
        { key: 'outline', type: 'toggle', label: 'outline' },
        { key: 'sparkles', type: 'toggle', label: 'sparkles' }
      ] },
      { key: 'bg', type: 'select', label: 'background', options: [['transparent', 'see-through'], ['#000000', 'black'], ['#ffffff', 'white'], ['#ffd1ea', 'pink'], ['#1a0b2e', 'dark purple']] }
    ],
    render: function (s) {
      var tex = glitterTex(s.color), fs = +s.size || 110;
      var st = 'font-family:\'' + s.font + '\', cursive;font-size:' + fs + 'px;background-image:url(' + tex + ');background-size:96px 96px;' +
        (s.outline ? '-webkit-text-stroke:' + Math.max(2, fs / 28) + 'px ' + s.outlineColor + ';paint-order:stroke fill;' : '');
      var spark = '';
      if (s.sparkles) {
        var spots = [[6, 12, 1], [92, 8, .8], [14, 82, .7], [84, 78, 1.1], [50, 4, .6], [97, 46, .7], [2, 48, .8]];
        spark = spots.map(function (p) { return '<i class="gt2-sp" style="left:' + p[0] + '%;top:' + p[1] + '%;transform:translate(-50%,-50%) scale(' + p[2] + ')">✦</i>'; }).join('');
      }
      return '<div class="shot gt2" style="background:' + s.bg + '"><div class="gt2-wrap">' + spark +
        '<div class="gt2-t" style="' + st + '">' + EB('text', s.text) + '</div></div></div>';
    }
  });

  /* tab order */
  var ORDER = ['spotify', 'applemusic', 'lockscreen', 'wrapped', 'playlist', 'friendact', 'tweet', 'imessage', 'android', 'calls', 'voicemail', 'screentime',
    'igdm', 'igcomments', 'profile', 'roblox', 'tiktok', 'twitch', 'youtube', 'ytnotif', 'reddit', 'facebook', 'pinterest', 'pinfeed', 'whisper', 'brat',
    'glitter', 'snapchat', 'discord', 'dccall', 'dcprofile', 'chatgpt', 'claude', 'google', 'amazon', 'amazonorder', 'delivery', 'news', 'award', 'poster',
    'sims', 'minecraft', 'tumblr', 'notes'];
  TOOLS.sort(function (a, b) {
    var x = ORDER.indexOf(a.id), y = ORDER.indexOf(b.id);
    return (x < 0 ? 999 : x) - (y < 0 ? 999 : y);
  });
})();
