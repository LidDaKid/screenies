/* screenies — every mockup: its fields, its defaults, and how it renders.
   render(s) returns html for one .shot element; app.js builds the form and exports the png. */

var U = (function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function br(s) { return esc(s).replace(/\n/g, '<br>'); }

  var TINTS = ['#e8578f', '#7b61ff', '#2fb67c', '#f0932b', '#3a9ad9', '#c0392b', '#8e6c8a', '#16a085'];
  function tint(name) {
    var h = 0;
    for (var i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    return TINTS[Math.abs(h) % TINTS.length];
  }

  // picture if there is one, otherwise a colored circle with the first letter
  // path (optional) makes the picture clickable in the preview to swap it
  function avatar(src, name, cls, color, path) {
    var di = path ? ' data-img="' + path + '"' : '';
    if (src) return '<img class="' + cls + '" src="' + src + '" alt=""' + di + '>';
    var letter = (String(name || '').replace(/\u200b/g, '').replace(/^[@#\s]+/, '').match(/./u) || [''])[0].toUpperCase();
    return '<div class="' + cls + ' ph" style="background:' + (letter ? color || tint(name) : '#b0b3b8') + '"' + di + '>' + esc(letter) + '</div>';
  }

  function isEmojiOnly(t) {
    t = String(t || '').replace(/\s/g, '');
    if (!t || t.length > 24) return false;
    try { return /^(\p{Extended_Pictographic}|\p{Emoji_Component}|‍|️)+$/u.test(t) && !/^[\d#*]+$/.test(t); }
    catch (e) { return false; }
  }

  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 0;
    var n = parseInt(m[1], 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function shade(hex, amt) { // amt < 0 darkens, > 0 lightens
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return hex;
    var n = parseInt(m[1], 16);
    return '#' + [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) {
      v = amt < 0 ? v * (1 + amt) : v + (255 - v) * amt;
      return ('0' + Math.round(v).toString(16)).slice(-2);
    }).join('');
  }

  // iPhone status bar
  var SIGNAL = '<svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>';
  var WIFI = '<svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.1-1.2A10.3 10.3 0 0 0 8 .6C5.3.6 2.8 1.6.9 3.5L2 4.7a8.6 8.6 0 0 1 6-2.4z"/><path d="M8 5.6c1.4 0 2.6.5 3.6 1.4l1.1-1.2A7 7 0 0 0 8 3.9 7 7 0 0 0 3.3 5.8L4.4 7c1-.9 2.2-1.4 3.6-1.4z"/><path d="M8 8.9c.6 0 1.1.2 1.5.6L8 11.2 6.5 9.5c.4-.4.9-.6 1.5-.6z"/></svg>';
  function battery(pct, low) {
    var w = Math.max(1.5, 18.5 * Math.min(100, Math.max(0, pct)) / 100);
    return '<svg viewBox="0 0 27 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".38"/>' +
      '<rect x="2.5" y="2.5" width="' + w + '" height="8" rx="2" ' + (low ? 'fill="#ff3b30"' : '') + '/>' +
      '<path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" opacity=".4"/></svg>';
  }
  function statusBar(s) {
    var pct = parseInt(s.battery, 10);
    if (isNaN(pct)) pct = 80;
    return '<div class="sbar"><span class="sb-time">' + E('clock', s.clock) + '</span><span class="sb-icons">' + SIGNAL + WIFI +
      (s.showPct ? '<span class="sb-pct">' + pct + '</span>' : '') + battery(pct, pct <= 20) + '</span></div>';
  }
  var STATUS_FIELDS = { type: 'row', fields: [
    { key: 'clock', type: 'text', label: 'clock' },
    { key: 'battery', type: 'number', label: 'battery %' },
    { key: 'showPct', type: 'toggle', label: '%' }
  ] };

  return { esc: esc, br: br, avatar: avatar, tint: tint, isEmojiOnly: isEmojiOnly, lum: lum, shade: shade,
    statusBar: statusBar, STATUS_FIELDS: STATUS_FIELDS };
})();

/* click-to-type: every typed value in a preview is wrapped so it can be edited right on the picture.
   path is the state key ('name') or a list path ('msgs.3.text'). */
// while editing, blank fields hold GHOST so the spot still shows up on the picture (as a faint label) and can be clicked
var GHOST = '\u200b';
function bare(v) { return v === GHOST ? '' : v; }
function E(path, v) { return '<span data-e="' + path + '">' + U.esc(bare(v)) + '</span>'; }
function EB(path, v) { return '<span data-e="' + path + '" data-ml>' + U.br(bare(v)) + '</span>'; }
function EW(path, html) {
  var empty = !html.replace(/<[^>]*>/g, '').replace(/\u200b/g, '').trim();
  return '<span data-e="' + path + '" data-ml>' + (empty ? '' : html) + '</span>';
}
function DI(path) { return ' data-img="' + path + '"'; }

var ICON = {
  spotify: '<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
  verified: '<svg viewBox="0 0 22 22"><path d="M20.4 11c0-1.3-.8-2.4-2-3 .4-1.3.2-2.7-.7-3.6s-2.3-1.1-3.6-.7c-.6-1.2-1.7-2-3.1-2s-2.4.8-3 2c-1.3-.4-2.7-.2-3.6.7s-1.2 2.3-.7 3.6c-1.2.6-2 1.8-2 3.1s.8 2.4 2 3c-.4 1.3-.2 2.7.7 3.6s2.3 1.2 3.6.7c.6 1.2 1.8 2 3.1 2s2.5-.8 3.1-2c1.3.4 2.7.2 3.6-.7s1.2-2.3.7-3.6c1.2-.6 2-1.8 2-3.1z"/><path d="M9.6 15.1 6 11.6l1.3-1.3 2.1 2.1 4.4-4.8 1.4 1.3z" fill="#fff"/></svg>',
  dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  reply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M9.5 4h5a7 7 0 0 1 0 14H13l-5 3.5V17.6A7 7 0 0 1 9.5 4z"/></svg>',
  repost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 7.5 7.5 4.5l3 3M7.5 5v9.5a3 3 0 0 0 3 3h3M19.5 16.5l-3 3-3-3M16.5 19V9.5a3 3 0 0 0-3-3h-3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z"/></svg>',
  heartFull: '<svg viewBox="0 0 24 24"><path d="M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3.5h12v17l-6-4.2-6 4.2z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8M4.5 14v4.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V14"/></svg>',
  chevron: '<svg viewBox="0 0 12 21"><path d="M10.5 1.5 1.8 10.5l8.7 9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  video: '<svg viewBox="0 0 30 20"><rect x="0" y="1" width="20" height="18" rx="4.5"/><path d="M22 7.5 28.2 3.4c.8-.5 1.8 0 1.8 1v11.2c0 1-1 1.5-1.8 1L22 12.5z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 3 7.5 21M16.5 3 14 21M4 8.5h17M3 15.5h17"/></svg>',
  plusCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10" stroke="#383a40" stroke-width="2.2" stroke-linecap="round"/></svg>',
  tumblrReblog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3.5 20 6.5l-3 3M4 11.5v-2a3 3 0 0 1 3-3h13M7 20.5 4 17.5l3-3M20 12.5v2a3 3 0 0 1-3 3H4"/></svg>',
  tumblrReply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5c5 0 9 3.4 9 7.8S17 19 12 19c-1 0-2-.1-2.9-.4L4 21l1.5-4.1C4 15.4 3 13.4 3 11.3 3 6.9 7 3.5 12 3.5z"/></svg>',
  tumblrShare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 3 3 10.5l7 2.8L21 3zM21 3l-7.7 18-3.3-7.7"/></svg>',
  notesShare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14.5V2.5M8 6.5l4-4 4 4M8.5 10H6.5a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5h-2"/></svg>',
  notesMore: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><circle cx="7.8" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="16.2" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>',
  checklist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="m8 12.2 2.8 2.8L16.5 9"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3L9 4.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/><circle cx="12" cy="13" r="3.8"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m14 6 4 4"/></svg>',
  compose: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V13"/><path d="M18.5 3.5a2.1 2.1 0 0 1 3 3L13 15l-4 1 1-4z"/></svg>'
};

var TOOLS = [];

/* ============================== spotify lyrics ============================== */

TOOLS.push({
  id: 'spotify',
  label: 'spotify lyrics',
  defaults: {
    cover: '', palette: [], title: '', artist: '',
    lyrics: '',
    bg: '#b8336a', fg: 'auto', size: 'm', frame: 'card'
  },
  fields: [
    { key: 'cover', type: 'image', label: 'album cover', max: 600, palette: true },
    { key: 'title', type: 'text', label: 'song' },
    { key: 'artist', type: 'text', label: 'artist' },
    { key: 'lyrics', type: 'textarea', label: 'lyrics', rows: 5 },
    { key: 'bg', type: 'color', label: 'card color', swatches: function (s) { return s.palette; } },
    { type: 'row', fields: [
      { key: 'fg', type: 'select', label: 'text', options: [['auto', 'auto'], ['#ffffff', 'white'], ['#000000', 'black']] },
      { key: 'size', type: 'select', label: 'size', options: [['s', 'small'], ['m', 'medium'], ['l', 'big']] },
      { key: 'frame', type: 'select', label: 'shape', options: [['card', 'card'], ['story', 'story']] }
    ] }
  ],
  render: function (s) {
    var fg = s.fg === 'auto' ? (U.lum(s.bg) > 0.5 ? '#000000' : '#ffffff') : s.fg;
    var cover = s.cover ? '<img class="sp-cover" src="' + s.cover + '"' + DI('cover') + ' alt="">' : '<div class="sp-cover sp-noart"></div>';
    var card = '<div class="sp-card sz-' + s.size + '" style="background:' + s.bg + ';color:' + fg + '">' +
      '<div class="sp-top">' + cover + '<div class="sp-meta"><div class="sp-title">' + E('title', s.title) + '</div>' +
      '<div class="sp-artist">' + E('artist', s.artist) + '</div></div></div>' +
      '<div class="sp-lyrics">' + EB('lyrics', s.lyrics) + '</div>' +
      '<div class="sp-logo">' + ICON.spotify + '<span>Spotify</span></div></div>';
    if (s.frame === 'story') {
      return '<div class="shot sp-story" style="background:linear-gradient(180deg,' + U.shade(s.bg, -0.35) + ',' + U.shade(s.bg, -0.7) + ')">' + card + '</div>';
    }
    return '<div class="shot sp-solo">' + card + '</div>';
  }
});

/* ============================== tweet ============================== */

function tweetText(t) {
  return U.br(t).replace(/(^|[\s>(])([@#][\wÀ-￿]+|https?:\/\/[^\s<]+)/g, '$1<span class="tw-link">$2</span>');
}

TOOLS.push({
  id: 'tweet',
  label: 'tweet',
  defaults: {
    avatar: '', name: '', handle: '', badge: 'none',
    text: '', image: '',
    time: '', date: '', views: '',
    replies: '', reposts: '', likes: '', bookmarks: '', liked: false, theme: 'light'
  },
  fields: [
    { key: 'avatar', type: 'image', label: 'pfp', max: 300 },
    { type: 'row', fields: [
      { key: 'name', type: 'text', label: 'name' },
      { key: 'handle', type: 'text', label: 'username' }
    ] },
    { type: 'row', fields: [
      { key: 'badge', type: 'select', label: 'check', options: [['none', 'none'], ['blue', 'blue'], ['gold', 'gold'], ['gray', 'gray']] },
      { key: 'theme', type: 'select', label: 'theme', options: [['light', 'light'], ['dim', 'dim'], ['dark', 'dark']] }
    ] },
    { key: 'text', type: 'textarea', label: 'post', rows: 4 },
    { key: 'image', type: 'image', label: 'picture', max: 1200 },
    { type: 'row', fields: [
      { key: 'time', type: 'text', label: 'time' },
      { key: 'date', type: 'text', label: 'date' }
    ] },
    { type: 'row', fields: [
      { key: 'views', type: 'text', label: 'views' },
      { key: 'replies', type: 'text', label: 'replies' },
      { key: 'reposts', type: 'text', label: 'reposts' }
    ] },
    { type: 'row', fields: [
      { key: 'likes', type: 'text', label: 'likes' },
      { key: 'bookmarks', type: 'text', label: 'saves' },
      { key: 'liked', type: 'toggle', label: 'liked' }
    ] }
  ],
  render: function (s) {
    var badge = s.badge !== 'none' ? '<span class="tw-badge b-' + s.badge + '">' + ICON.verified + '</span>' : '';
    var meta = [s.time ? E('time', s.time) : '', s.date ? E('date', s.date) : ''].filter(Boolean).join(' · ');
    if (s.views) meta += ' · <b>' + E('views', s.views) + '</b> Views';
    function act(icon, k, cls) {
      return '<span class="tw-act ' + (cls || '') + '">' + icon + (k ? E(k, s[k]) : '') + '</span>';
    }
    return '<div class="shot tw t-' + s.theme + '">' +
      '<div class="tw-head">' + U.avatar(s.avatar, s.name, 'tw-pfp', undefined, 'avatar') +
      '<div class="tw-who"><div class="tw-name"><span>' + E('name', s.name) + '</span>' + badge + '</div>' +
      (s.handle ? '<div class="tw-handle">@' + E('handle', String(s.handle).replace(/^@/, '')) + '</div>' : '') + '</div>' +
      '<span class="tw-more">' + ICON.dots + '</span></div>' +
      (s.text ? '<div class="tw-text">' + EW('text', tweetText(s.text)) + '</div>' : '') +
      (s.image ? '<img class="tw-img" src="' + s.image + '"' + DI('image') + ' alt="">' : '') +
      '<div class="tw-meta">' + meta + '</div>' +
      '<div class="tw-acts">' + act(ICON.reply, 'replies') + act(ICON.repost, 'reposts') +
      act(s.liked ? ICON.heartFull : ICON.heart, 'likes', s.liked ? 'liked' : '') +
      act(ICON.bookmark, 'bookmarks') + act(ICON.share, '') + '</div></div>';
  }
});

/* ============================== imessage ============================== */

TOOLS.push({
  id: 'imessage',
  label: 'imessage',
  defaults: {
    contact: '', photo: '', unread: '', theme: 'light', bubble: 'blue',
    clock: '9:41', battery: 82, showPct: false, receipt: '', typing: false,
    msgs: []
  },
  fields: [
    { type: 'head', label: 'phone' },
    U.STATUS_FIELDS,
    { type: 'row', fields: [
      { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
      { key: 'bubble', type: 'select', label: 'my bubbles', options: [['blue', 'blue'], ['green', 'green']] }
    ] },
    { type: 'head', label: 'them' },
    { key: 'photo', type: 'image', label: 'contact photo', max: 300 },
    { type: 'row', fields: [
      { key: 'contact', type: 'text', label: 'contact name' },
      { key: 'unread', type: 'text', label: 'unread' }
    ] },
    { type: 'head', label: 'messages' },
    { key: 'msgs', type: 'list', meKey: 'from',
      adds: [
        { label: '+ me', item: { from: 'me', text: '', stamp: '', image: '' } },
        { label: '+ them', item: { from: 'them', text: '', stamp: '', image: '' } }
      ],
      item: [
        { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['them', 'them']] },
        { key: 'text', type: 'textarea', label: 'text', rows: 2 },
        { key: 'image', type: 'image', label: 'picture', max: 900 },
        { key: 'stamp', type: 'text', label: 'time above', placeholder: 'Today 9:41 PM' }
      ] },
    { type: 'row', fields: [
      { key: 'receipt', type: 'text', label: 'under last sent', placeholder: 'Delivered' },
      { key: 'typing', type: 'toggle', label: 'typing' }
    ] }
  ],
  render: function (s) {
    var out = '', list = s.msgs || [], lastMe = -1;
    list.forEach(function (m, i) { if (m.from === 'me') lastMe = i; });
    list.forEach(function (m, i) {
      if (m.stamp) {
        var st = EW('msgs.' + i + '.stamp', U.esc(m.stamp).replace(/^(\S+)(\s)/, '<b>$1</b>$2'));
        out += '<div class="im-stamp">' + st + '</div>';
      }
      var next = list[i + 1], prev = list[i - 1];
      var tail = !next || next.from !== m.from || next.stamp || (i === list.length - 1 && s.typing && m.from === 'them');
      var gap = prev && prev.from !== m.from && !m.stamp ? ' gap' : '';
      var who = m.from === 'me' ? 'me' : 'them';
      if (m.image) {
        out += '<div class="im-row ' + who + gap + '"><img class="im-pic" src="' + m.image + '"' + DI('msgs.' + i + '.image') + ' alt=""></div>';
        gap = '';
      }
      if (m.text) {
        var big = U.isEmojiOnly(m.text);
        out += '<div class="im-row ' + who + gap + '"><div class="im-b ' + (big ? 'emoji' : 'bub') + (tail && !big ? ' tail' : '') + '">' + EB('msgs.' + i + '.text', m.text) + '</div></div>';
      }
      if (i === lastMe && s.receipt && !(next && next.from === 'me')) {
        out += '<div class="im-receipt">' + E('receipt', s.receipt).replace(/^(Read|Delivered)/, '<b>$1</b>') + '</div>';
      }
    });
    if (s.typing) {
      out += '<div class="im-row them gap"><div class="im-b bub tail im-typing"><i></i><i></i><i></i></div></div>';
    }
    var ph = s.photo ? '<img class="im-ava" src="' + s.photo + '"' + DI('photo') + ' alt="">'
      : '<div class="im-ava im-ava-ph"' + DI('photo') + '>' + U.esc((String(s.contact).match(/\p{L}/u) || [''])[0].toUpperCase()) + '</div>';
    return '<div class="shot im t-' + s.theme + ' b-' + s.bubble + '">' + U.statusBar(s) +
      '<div class="im-head"><div class="im-back">' + ICON.chevron + (s.unread ? '<span class="im-unread">' + E('unread', s.unread) + '</span>' : '') + '</div>' +
      '<div class="im-contact">' + ph + '<div class="im-name">' + E('contact', s.contact) + ' <span>›</span></div></div>' +
      '<div class="im-video">' + ICON.video + '</div></div>' +
      '<div class="im-body">' + out + '</div>' +
      '<div class="im-input"><span class="im-plus">' + ICON.plus + '</span><div class="im-field">' +
      (s.bubble === 'green' ? 'Text Message' : 'iMessage') + '<span class="im-mic">' + ICON.mic + '</span></div></div></div>';
  }
});

/* ============================== discord ============================== */

function uid() { return Math.random().toString(36).slice(2, 8); }

TOOLS.push({
  id: 'discord',
  label: 'discord',
  defaults: {
    channel: '', input: true,
    people: [],
    msgs: []
  },
  fields: [
    { type: 'row', fields: [
      { key: 'channel', type: 'text', label: 'channel' },
      { key: 'input', type: 'toggle', label: 'chat bar' }
    ] },
    { type: 'head', label: 'people' },
    { key: 'people', type: 'list', compact: true,
      adds: [{ label: '+ person', item: function () { return { id: uid(), name: '', color: '#f2f3f5', avatar: '' }; } }],
      item: [
        { type: 'row', fields: [
          { key: 'name', type: 'text', label: 'name' },
          { key: 'color', type: 'color', label: 'color' }
        ] },
        { key: 'avatar', type: 'image', label: 'pfp', max: 300 }
      ] },
    { type: 'head', label: 'messages' },
    { key: 'msgs', type: 'list',
      adds: [{ label: '+ message', item: function (s) {
        var last = (s.msgs || [])[s.msgs.length - 1];
        return { from: last ? last.from : (s.people[0] || {}).id, text: '', time: '', reacts: '' };
      } }],
      item: [
        { type: 'row', fields: [
          { key: 'from', type: 'select', label: 'from', options: function (s) {
            return s.people.map(function (p) { return [p.id, p.name]; });
          } },
          { key: 'time', type: 'text', label: 'time', placeholder: 'Today at 4:20 PM' }
        ] },
        { key: 'text', type: 'textarea', label: 'text', rows: 2 },
        { key: 'reacts', type: 'text', label: 'reactions', placeholder: '💀 4, 😭 2' }
      ] }
  ],
  render: function (s) {
    var people = {};
    (s.people || []).forEach(function (p, _i) { people[p.id] = p; });
    var out = '', prevFrom = null;
    (s.msgs || []).forEach(function (m, _i) {
      var p = people[m.from] || { name: 'deleted user', color: '#f2f3f5', avatar: '' };
      var text = EB('msgs.' + _i + '.text', m.text).replace(/(^|\s|>)(@[\w.À-￿]+)/g, '$1<span class="dc-mention">$2</span>');
      if (U.isEmojiOnly(m.text)) text = '<span class="dc-jumbo">' + text + '</span>';
      var reacts = String(m.reacts || '').split(',').map(function (r) { return r.trim(); }).filter(Boolean).map(function (r) {
        var mm = /^(.*?)\s*(\d+)?$/.exec(r);
        return '<span class="dc-react">' + U.esc(mm[1]) + '<b>' + (mm[2] || 1) + '</b></span>';
      }).join('');
      var pi = (s.people || []).indexOf(p);
      var start = m.from !== prevFrom || m.time;
      out += '<div class="dc-msg' + (start ? ' start' : '') + '">' +
        (start ? U.avatar(p.avatar, p.name, 'dc-pfp', undefined, pi >= 0 ? 'people.' + pi + '.avatar' : '') +
          '<div class="dc-top"><span class="dc-name" style="color:' + U.esc(p.color) + '">' + (pi >= 0 ? E('people.' + pi + '.name', p.name) : U.esc(p.name)) + '</span>' +
          (m.time ? '<span class="dc-time">' + E('msgs.' + _i + '.time', m.time) + '</span>' : '') + '</div>' : '') +
        (m.text ? '<div class="dc-text">' + text + '</div>' : '') +
        (reacts ? '<div class="dc-reacts">' + EW('msgs.' + _i + '.reacts', reacts) + '</div>' : '') + '</div>';
      prevFrom = m.from;
    });
    return '<div class="shot dc">' +
      '<div class="dc-head">' + ICON.hash + '<span>' + E('channel', s.channel) + '</span></div>' +
      '<div class="dc-body">' + out + '</div>' +
      (s.input ? '<div class="dc-input">' + ICON.plusCircle + '<span>Message #' + E('channel', s.channel) + '</span></div>' : '') + '</div>';
  }
});

/* ============================== tumblr ============================== */

TOOLS.push({
  id: 'tumblr',
  label: 'tumblr',
  defaults: {
    theme: 'light', tags: '', notes: '', liked: false,
    chain: [{ blog: '', avatar: '', text: '', image: '' }]
  },
  fields: [
    { type: 'row', fields: [
      { key: 'theme', type: 'select', label: 'theme', options: [['light', 'light'], ['dark', 'dark']] },
      { key: 'notes', type: 'text', label: 'notes' },
      { key: 'liked', type: 'toggle', label: 'liked' }
    ] },
    { key: 'tags', type: 'text', label: 'tags' },
    { type: 'head', label: 'posts' },
    { key: 'chain', type: 'list',
      adds: [{ label: '+ reblog', item: function (s) {
        var c = s.chain || [], two = c[c.length - 2];
        return { blog: two ? two.blog : '', avatar: two ? two.avatar : '', text: '', image: '' };
      } }],
      item: [
        { key: 'blog', type: 'text', label: 'blog' },
        { key: 'avatar', type: 'image', label: 'icon', max: 300 },
        { key: 'text', type: 'textarea', label: 'text', rows: 3 },
        { key: 'image', type: 'image', label: 'picture', max: 1200 }
      ] }
  ],
  render: function (s) {
    var c = s.chain || [], last = c[c.length - 1] || { blog: '' };
    var multi = c.length > 1;
    var body = c.map(function (p, i) {
      var pre = 'chain.' + i + '.';
      return '<div class="tb-part">' +
        (multi ? '<div class="tb-who">' + U.avatar(p.avatar, p.blog, 'tb-ava sm', undefined, pre + 'avatar') + '<b>' + E(pre + 'blog', p.blog) + '</b></div>' : '') +
        (p.image ? '<img class="tb-img" src="' + p.image + '"' + DI(pre + 'image') + ' alt="">' : '') +
        '<div class="tb-text">' + EB(pre + 'text', p.text) + '</div></div>';
    }).join('');
    var tags = String(s.tags || '').split('#').map(function (t) { return t.trim(); }).filter(Boolean)
      .map(function (t) { return '<span>#' + U.esc(t) + '</span>'; }).join('');
    tags = EW('tags', tags);
    return '<div class="shot tb t-' + s.theme + '"><div class="tb-post">' +
      '<div class="tb-head">' + U.avatar(last.avatar, last.blog, 'tb-ava', undefined, c.length ? 'chain.' + (c.length - 1) + '.avatar' : '') +
      '<div class="tb-names"><b>' + (c.length ? E('chain.' + (c.length - 1) + '.blog', last.blog) : '') + '</b>' +
      (multi ? '<span class="tb-rb">' + ICON.tumblrReblog + '</span><span class="tb-from">' + U.esc(c[c.length - 2].blog) + '</span>' : '') +
      '<span class="tb-follow">Follow</span></div><span class="tb-more">' + ICON.dots + '</span></div>' +
      body +
      '<div class="tb-tags">' + tags + '</div>' +
      '<div class="tb-foot"><span class="tb-notes">' + (s.notes ? E('notes', s.notes) + ' ' : '') + 'notes</span><span class="tb-icons">' +
      ICON.tumblrShare + ICON.tumblrReply + ICON.tumblrReblog +
      '<span class="' + (s.liked ? 'tb-liked' : '') + '">' + (s.liked ? ICON.heartFull : ICON.heart) + '</span></span></div>' +
      '</div></div>';
  }
});

/* ============================== notes app ============================== */

TOOLS.push({
  id: 'notes',
  label: 'notes app',
  defaults: {
    theme: 'light', clock: '9:41', battery: 64, showPct: false,
    date: '',
    title: '',
    body: ''
  },
  fields: [
    U.STATUS_FIELDS,
    { key: 'theme', type: 'select', label: 'mode', options: [['light', 'light'], ['dark', 'dark']] },
    { key: 'date', type: 'text', label: 'date' },
    { key: 'title', type: 'text', label: 'title' },
    { key: 'body', type: 'textarea', label: 'note', rows: 8 }
  ],
  render: function (s) {
    return '<div class="shot nt t-' + s.theme + '">' + U.statusBar(s) +
      '<div class="nt-head"><span class="nt-back">' + ICON.chevron + '<span>Notes</span></span>' +
      '<span class="nt-tools">' + ICON.notesShare + ICON.notesMore + '</span></div>' +
      '<div class="nt-page">' + (s.date ? '<div class="nt-date">' + E('date', s.date) + '</div>' : '') +
      (s.title ? '<div class="nt-title">' + EB('title', s.title) + '</div>' : '') +
      '<div class="nt-body">' + EB('body', s.body) + '</div></div>' +
      '<div class="nt-bar">' + ICON.checklist + ICON.camera + ICON.pen + ICON.compose + '</div></div>';
  }
});
