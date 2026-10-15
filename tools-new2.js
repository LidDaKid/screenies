/* screenies — ao3 work, wattpad story, genius lyrics, suno song, letterboxd review, achievement popups */

(function () {
  var esc = U.esc;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function stroke(d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function fill(d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' ph0"' + DI(path) + '></div>'; }
  // "a, b, c" -> pieces, keeps blanks out
  function parts(v) { return String(v == null ? '' : v).replace(/​/g, '').split(',').map(function (x) { return x.trim(); }).filter(Boolean); }

  var I = {
    back: stroke('M15 5l-7 7 7 7', 2.2),
    left: stroke('M14.5 6 8.5 12l6 6', 2.2),
    right: stroke('M9.5 6l6 6-6 6', 2.2),
    star: fill('M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z'),
    starO: stroke('M12 3.6l2.5 5.2 5.7.8-4.2 3.9 1 5.7-5-2.7-5 2.7 1-5.7-4.2-3.9 5.7-.8z', 1.6),
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    dotsV: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
    send: fill('M3.4 20.4 21 12 3.4 3.6 3.4 10.2 15 12 3.4 13.8z'),
    phone: stroke('M5.2 3.5h3.3l1.7 4.3-2.2 1.4a12 12 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7v3.3a1.7 1.7 0 0 1-1.8 1.7A17 17 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8z', 1.8),
    eye: stroke('M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 1.8),
    list: stroke('M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01', 2.2),
    clock: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', 1.8),
    plus: stroke('M12 5v14M5 12h14', 2.4),
    heart: stroke('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z', 1.9),
    heartF: fill('M12 20.5S3 15 3 9a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 21 9c0 6-9 11.5-9 11.5z'),
    chat: stroke('M12 3.5c5 0 9 3.4 9 7.8S17 19 12 19c-1 0-2-.1-2.9-.4L4 21l1.5-4.1C4 15.4 3 13.4 3 11.3 3 6.9 7 3.5 12 3.5z', 1.8),
    share: stroke('M12 15V3.5M7.5 8 12 3.5 16.5 8M4.5 14v4.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V14', 1.8),
    play: fill('M8 5.5v13l11-6.5z'),
    pause: fill('M7 5h3.5v14H7zM13.5 5H17v14h-3.5z'),
    prev: fill('M6 5h2v14H6zM19 5v14L9 12z'),
    next: fill('M16 5h2v14h-2zM5 5v14l10-7z'),
    thumb: stroke('M7 21H4.5A1.5 1.5 0 0 1 3 19.5v-7A1.5 1.5 0 0 1 4.5 11H7m0 10V11m0 10h9.6a2 2 0 0 0 2-1.6l1.3-7A2 2 0 0 0 17.9 10H14V5.5A2.5 2.5 0 0 0 11.5 3L7 11', 1.8),
    up: stroke('M12 19V5M6 11l6-6 6 6', 2),
    trophy: fill('M7 3h10v2h3.5v2.5A4.5 4.5 0 0 1 16.4 12a5 5 0 0 1-3.4 2.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 7.6 12 4.5 4.5 0 0 1 3.5 7.5V5H7zm0 4H5.5v.5A2.5 2.5 0 0 0 7.2 9.9 6 6 0 0 1 7 8.4zm10 0v1.4a6 6 0 0 1-.2 1.5 2.5 2.5 0 0 0 1.7-2.4V7z'),
    xbox: '<svg viewBox="0 0 24 24"><path d="M12 2.2c1.8 0 3.3.5 4.6 1.4-.1 0-1.5-.6-4.6 1.8C8.9 3 7.5 3.6 7.4 3.6A8 8 0 0 1 12 2.2zM5.6 5.1c.1-.1.3-.1.5-.1 1.3.1 3.6 1.9 4.4 2.6-3.3 3.1-5.6 7.1-5.6 9.5A9.8 9.8 0 0 1 5.6 5.1zm12.8 0a9.8 9.8 0 0 1 .7 12c0-2.4-2.3-6.4-5.6-9.5.8-.7 3.1-2.5 4.4-2.6.2 0 .4 0 .5.1zM12 9.3c2.7 2.3 6.8 7.5 5.6 9.9A9.8 9.8 0 0 1 12 21.8a9.8 9.8 0 0 1-5.6-2.6C5.2 16.8 9.3 11.6 12 9.3z"/></svg>',
    gscore: '<svg viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 2.2a7.3 7.3 0 0 1 6.6 4.2H12a3.1 3.1 0 0 0 0 6.2h3.2a3.9 3.9 0 0 1-3.2 1.7 4.9 4.9 0 0 1 0-9.8V4.7z" /></svg>'
  };

  /* ============================== ao3 ============================== */

  var AO3_RATING = { general: ['General Audiences', 'G', '#77a614'], teen: ['Teen And Up Audiences', 'T', '#e8d405'], mature: ['Mature', 'M', '#e87d0f'],
    explicit: ['Explicit', 'E', '#9c0000'], none: ['Not Rated', '', '#ffffff'] };
  var AO3_WARN = { none: ['No Archive Warnings Apply', '', '#ffffff'], choose: ['Creator Chose Not To Use Archive Warnings', '?', '#e87d0f'],
    yes: ['Graphic Depictions Of Violence', '!', '#9c0000'] };
  var AO3_CAT = { ff: ['F/F', '#c11', 'linear-gradient(#c11,#c11)'], fm: ['F/M', '#7a1c7a', ''], mm: ['M/M', '#2c5aa0', ''], gen: ['Gen', '#77a614', ''],
    multi: ['Multi', '', 'conic-gradient(#c11 0 25%, #7a1c7a 0 50%, #2c5aa0 0 75%, #77a614 0)'], other: ['Other', '#000', ''], none: ['', '#fff', ''] };
  function ao3Tags(path, v, bold) {
    return EW(path, parts(v).map(function (t) { return '<a class="ao3-tag' + (bold ? ' b' : '') + '">' + esc(t) + '</a>'; }).join('<span class="ao3-c">, </span>'));
  }
  function ao3Req(s) {
    var r = AO3_RATING[s.rating] || AO3_RATING.none, w = AO3_WARN[s.warn] || AO3_WARN.none, c = AO3_CAT[s.cat] || AO3_CAT.none;
    function sq(bg, txt, cls) { return '<span class="ao3-sq ' + (cls || '') + '" style="background:' + bg + '">' + txt + '</span>'; }
    return '<div class="ao3-req">' +
      sq(r[2], r[1] || '', r[1] === 'T' ? 'dk' : '') + sq(c[2] || c[1], c[0] && c[0] !== 'Multi' ? '<i>' + (s.cat === 'ff' ? '♀♀' : s.cat === 'fm' ? '♀♂' : s.cat === 'mm' ? '♂♂' : s.cat === 'gen' ? '◯' : s.cat === 'other' ? '✱' : '') + '</i>' : '') +
      sq(w[2], w[1]) + sq(s.complete ? '#77a614' : '#9c0000', s.complete ? '✓' : '✕') + '</div>';
  }
  TOOLS.push({
    id: 'ao3',
    label: 'ao3',
    defaults: { mode: 'work', rating: 'teen', warn: 'none', cat: 'ff', complete: false, fandom: '', rels: '', chars: '', tags: '', title: '', author: '',
      summary: '', notes: '', published: '', updated: '', words: '', chapters: '', comments: '', kudos: '', bookmarks: '', hits: '', chTitle: '', text: '' },
    fields: [
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'show', options: [['work', 'work page'], ['blurb', 'search result']] },
        { key: 'complete', type: 'toggle', label: 'complete' }
      ] },
      { type: 'row', fields: [
        { key: 'rating', type: 'select', label: 'rating', options: Object.keys(AO3_RATING).map(function (k) { return [k, AO3_RATING[k][0]]; }) },
        { key: 'warn', type: 'select', label: 'warnings', options: Object.keys(AO3_WARN).map(function (k) { return [k, AO3_WARN[k][0]]; }) },
        { key: 'cat', type: 'select', label: 'category', options: Object.keys(AO3_CAT).map(function (k) { return [k, AO3_CAT[k][0] || 'none']; }) }
      ] },
      { key: 'fandom', type: 'text', label: 'fandom(s)', placeholder: 'commas between' },
      { key: 'rels', type: 'text', label: 'relationships', placeholder: 'commas between' },
      { key: 'chars', type: 'text', label: 'characters', placeholder: 'commas between' },
      { key: 'tags', type: 'textarea', label: 'additional tags', rows: 2, placeholder: 'commas between' },
      { type: 'row', fields: [
        { key: 'title', type: 'text', label: 'title' },
        { key: 'author', type: 'text', label: 'author' }
      ] },
      { key: 'summary', type: 'textarea', label: 'summary', rows: 3 },
      { key: 'notes', type: 'textarea', label: 'notes', rows: 2 },
      { type: 'row', fields: [
        { key: 'published', type: 'text', label: 'published', placeholder: '2026-10-14' },
        { key: 'updated', type: 'text', label: 'updated' },
        { key: 'words', type: 'text', label: 'words' }
      ] },
      { type: 'row', fields: [
        { key: 'chapters', type: 'text', label: 'chapters', placeholder: '3/?' },
        { key: 'comments', type: 'text', label: 'comments' },
        { key: 'kudos', type: 'text', label: 'kudos' }
      ] },
      { type: 'row', fields: [
        { key: 'bookmarks', type: 'text', label: 'bookmarks' },
        { key: 'hits', type: 'text', label: 'hits' }
      ] },
      { type: 'head', label: 'chapter' },
      { key: 'chTitle', type: 'text', label: 'chapter title', placeholder: 'Chapter 1' },
      { key: 'text', type: 'textarea', label: 'story text', rows: 6 }
    ],
    render: function (s) {
      var r = AO3_RATING[s.rating] || AO3_RATING.none, w = AO3_WARN[s.warn] || AO3_WARN.none, c = AO3_CAT[s.cat] || AO3_CAT.none;
      function stat(label, k) { return s[k] ? '<dt>' + label + ':</dt><dd>' + E(k, s[k]) + '</dd>' : ''; }
      var stats = stat('Published', 'published') + stat('Updated', 'updated') + stat('Words', 'words') + stat('Chapters', 'chapters') +
        stat('Comments', 'comments') + stat('Kudos', 'kudos') + stat('Bookmarks', 'bookmarks') + stat('Hits', 'hits');
      if (s.mode === 'blurb') {
        var bstats = '<dt>Language:</dt><dd>English</dd>' +
          [['Words', 'words'], ['Chapters', 'chapters'], ['Comments', 'comments'], ['Kudos', 'kudos'], ['Bookmarks', 'bookmarks'], ['Hits', 'hits']]
            .map(function (p) { return s[p[1]] ? '<dt>' + p[0] + ':</dt><dd' + (p[1] !== 'words' && p[1] !== 'chapters' ? ' class="lk"' : '') + '>' + E(p[1], s[p[1]]) + '</dd>' : ''; }).join('');
        return '<div class="shot ao3 ao3-bl"><div class="ao3-blurb">' +
          '<div class="ao3-bh">' + ao3Req(s) + '<div class="ao3-bt"><div class="ao3-bn"><a class="ao3-tl">' + E('title', s.title) + '</a> by <a class="ao3-au">' + E('author', s.author) + '</a></div>' +
          '<div class="ao3-bf">' + ao3Tags('fandom', s.fandom) + '</div></div><div class="ao3-date">' + (bare(s.updated) || !bare(s.published) ? E('updated', s.updated) : E('published', s.published)) + '</div></div>' +
          '<ul class="ao3-btags"><li class="w">' + '<a class="ao3-tag b">' + esc(w[0]) + '</a></li>' +
          (s.rels ? '<li>' + ao3Tags('rels', s.rels) + '</li>' : '') + (s.chars ? '<li>' + ao3Tags('chars', s.chars) + '</li>' : '') + (s.tags ? '<li>' + ao3Tags('tags', s.tags) + '</li>' : '') + '</ul>' +
          (s.summary ? '<blockquote class="ao3-bsum">' + EB('summary', s.summary) + '</blockquote>' : '') +
          '<dl class="ao3-bstats">' + bstats + '</dl></div></div>';
      }
      return '<div class="shot ao3">' +
        '<div class="ao3-head"><div class="ao3-logo"><span class="ao3-mark">a<b>O</b>3</span><span class="ao3-name">Archive of Our Own <sup>beta</sup></span></div>' +
        '<div class="ao3-nav"><span>Fandoms</span><span>Browse</span><span>Search</span><span>About</span></div></div>' +
        '<div class="ao3-main"><div class="ao3-btns"><span>Entire Work</span><span>Next Chapter &rarr;</span><span>Chapter Index</span><span>Comments</span><span>Share</span></div>' +
        '<dl class="ao3-meta">' +
        '<dt>Rating:</dt><dd><a class="ao3-tag">' + r[0] + '</a></dd>' +
        '<dt>Archive Warning:</dt><dd><a class="ao3-tag">' + w[0] + '</a></dd>' +
        (c[0] ? '<dt>Category:</dt><dd><a class="ao3-tag">' + c[0] + '</a></dd>' : '') +
        '<dt>Fandom:</dt><dd>' + ao3Tags('fandom', s.fandom) + '</dd>' +
        (s.rels ? '<dt>Relationship:</dt><dd>' + ao3Tags('rels', s.rels) + '</dd>' : '') +
        (s.chars ? '<dt>Characters:</dt><dd>' + ao3Tags('chars', s.chars) + '</dd>' : '') +
        (s.tags ? '<dt>Additional Tags:</dt><dd>' + ao3Tags('tags', s.tags) + '</dd>' : '') +
        '<dt>Language:</dt><dd>English</dd>' +
        (stats ? '<dt>Stats:</dt><dd><dl class="ao3-stats">' + stats + '</dl></dd>' : '') + '</dl>' +
        '<div class="ao3-pre"><div class="ao3-title">' + E('title', s.title) + '</div><div class="ao3-byline"><a>' + E('author', s.author) + '</a></div>' +
        (s.summary ? '<div class="ao3-sum"><div class="ao3-h3">Summary:</div><blockquote>' + EB('summary', s.summary) + '</blockquote></div>' : '') +
        (s.notes ? '<div class="ao3-sum"><div class="ao3-h3">Notes:</div><blockquote>' + EB('notes', s.notes) + '</blockquote></div>' : '') + '</div>' +
        '<div class="ao3-chap"><div class="ao3-ch">' + E('chTitle', s.chTitle) + '</div><div class="ao3-text">' + EB('text', s.text) + '</div></div>' +
        '</div></div>';
    }
  });

  /* ============================== wattpad ============================== */

  TOOLS.push({
    id: 'wattpad',
    label: 'wattpad',
    defaults: { cover: '', title: '', authorPic: '', author: '', reads: '', votes: '', parts: '', time: '', status: 'ongoing', mature: false, rank: '', desc: '', tags: '' },
    fields: [
      { key: 'cover', type: 'image', label: 'cover', max: 700 },
      { key: 'title', type: 'text', label: 'title' },
      { type: 'row', fields: [
        { key: 'authorPic', type: 'image', label: 'author pfp', max: 200 },
        { key: 'author', type: 'text', label: 'author' }
      ] },
      { type: 'row', fields: [
        { key: 'reads', type: 'text', label: 'reads', placeholder: '1.2M' },
        { key: 'votes', type: 'text', label: 'votes' },
        { key: 'parts', type: 'text', label: 'parts' }
      ] },
      { type: 'row', fields: [
        { key: 'time', type: 'text', label: 'reading time', placeholder: '4h 12m' },
        { key: 'status', type: 'select', label: 'status', options: [['ongoing', 'ongoing'], ['complete', 'complete']] },
        { key: 'mature', type: 'toggle', label: 'mature' }
      ] },
      { key: 'rank', type: 'text', label: 'ranking', placeholder: '#1 in vampire' },
      { key: 'desc', type: 'textarea', label: 'description', rows: 4 },
      { key: 'tags', type: 'text', label: 'tags', placeholder: 'commas between' }
    ],
    render: function (s) {
      function st(icon, k, label) { return '<div class="wp-st"><div class="wp-sl">' + icon + label + '</div><div class="wp-sv">' + E(k, s[k]) + '</div></div>'; }
      return '<div class="shot wp">' +
        '<div class="wp-top"><div class="wp-bgblur" style="' + (s.cover ? 'background-image:url(' + s.cover + ')' : '') + '"></div>' +
        '<div class="wp-cwrap">' + pic(s.cover, 'cover', 'wp-cover') + '</div></div>' +
        '<div class="wp-title">' + E('title', s.title) + '</div>' +
        '<div class="wp-author">' + U.avatar(s.authorPic, s.author, 'wp-ava', undefined, 'authorPic') + E('author', s.author) + '</div>' +
        '<div class="wp-stats">' + st(I.eye, 'reads', 'Reads') + st(I.star, 'votes', 'Votes') + st(I.list, 'parts', 'Parts') +
        (s.time ? st(I.clock, 'time', 'Time') : '') + '</div>' +
        '<div class="wp-btns"><div class="wp-read">Start reading</div><div class="wp-add">' + I.plus + '</div></div>' +
        '<div class="wp-pills"><span class="wp-pill ' + (s.status === 'complete' ? 'done' : '') + '">' + (s.status === 'complete' ? 'Complete' : 'Ongoing') + '</span>' +
        (s.mature ? '<span class="wp-pill mat">Mature</span>' : '') + '</div>' +
        (s.rank ? '<div class="wp-rank"><span class="wp-medal">' + I.trophy + '</span><span>Ranked <b>' + E('rank', s.rank) + '</b></span></div>' : '') +
        '<div class="wp-desc">' + EB('desc', s.desc) + '</div>' +
        '<div class="wp-tags">' + EW('tags', parts(s.tags).map(function (t) { return '<span class="wp-tag">' + esc(t.replace(/^#/, '')) + '</span>'; }).join(' ')) + '</div>' +
        '</div>';
    }
  });

  /* ============================== genius ============================== */

  function gnLyrics(text, hl, active) {
    var h = U.br(text);
    var needle = String(hl || '').replace(/​/g, '').trim();
    if (needle) {
      var e = U.br(needle);
      var at = h.indexOf(e);
      if (at >= 0) h = h.slice(0, at) + '<span class="gn-hl' + (active ? ' on' : '') + '">' + e + '</span>' + h.slice(at + e.length);
    }
    // [Verse 1] style section labels stay plain but get their own look
    return h.replace(/(^|<br>)(\[[^\]<]*\])/g, '$1<span class="gn-sec">$2</span>');
  }
  TOOLS.push({
    id: 'genius',
    label: 'genius lyrics',
    defaults: { cover: '', palette: [], bg: '#4a2a3a', title: '', artist: '', feat: '', producer: '', album: '', released: '', views: '', lyrics: '', hl: '',
      active: true, note: '', noteBy: '', votes: '' },
    fields: [
      { key: 'cover', type: 'image', label: 'cover', max: 600, palette: true },
      { key: 'bg', type: 'color', label: 'header color', swatches: function (s) { return s.palette; } },
      { type: 'row', fields: [
        { key: 'title', type: 'text', label: 'song' },
        { key: 'artist', type: 'text', label: 'artist' }
      ] },
      { type: 'row', fields: [
        { key: 'feat', type: 'text', label: 'featuring' },
        { key: 'producer', type: 'text', label: 'produced by' }
      ] },
      { type: 'row', fields: [
        { key: 'album', type: 'text', label: 'album' },
        { key: 'released', type: 'text', label: 'release date' },
        { key: 'views', type: 'text', label: 'views', placeholder: '1.4M' }
      ] },
      { key: 'lyrics', type: 'textarea', label: 'lyrics ([Verse 1] on its own line)', rows: 8 },
      { type: 'head', label: 'annotation' },
      { key: 'hl', type: 'textarea', label: 'highlighted line (copy it from the lyrics)', rows: 2 },
      { key: 'active', type: 'toggle', label: 'open (yellow)' },
      { key: 'note', type: 'textarea', label: 'annotation', rows: 4 },
      { type: 'row', fields: [
        { key: 'noteBy', type: 'text', label: 'contributors', placeholder: '12' },
        { key: 'votes', type: 'text', label: 'upvotes', placeholder: '+87' }
      ] }
    ],
    render: function (s) {
      var dark = U.shade(s.bg, -0.45);
      var credits = [s.feat ? ['Featuring', 'feat'] : null, s.producer ? ['Produced by', 'producer'] : null, s.album ? ['Album', 'album'] : null].filter(Boolean)
        .map(function (p) { return '<div class="gn-cr"><span>' + p[0] + '</span> ' + E(p[1], s[p[1]]) + '</div>'; }).join('');
      var meta = [s.released ? E('released', s.released) : '', s.views ? '<span class="gn-eye">' + I.eye + E('views', s.views) + '</span>' : ''].filter(Boolean).join('<span class="gn-dot"></span>');
      return '<div class="shot gn">' +
        '<div class="gn-bar"><span class="gn-logo">GENIUS</span><span class="gn-search">Search lyrics &amp; more</span><span class="gn-nav">FEATURED</span><span class="gn-nav">CHARTS</span><span class="gn-nav">VIDEOS</span></div>' +
        '<div class="gn-head" style="background:linear-gradient(90deg,' + dark + ',' + s.bg + ')">' + pic(s.cover, 'cover', 'gn-cover') +
        '<div class="gn-hw"><div class="gn-title">' + E('title', s.title) + '</div><div class="gn-artist">' + E('artist', s.artist) + '</div>' + credits +
        '<div class="gn-meta">' + meta + '</div></div></div>' +
        '<div class="gn-body"><div class="gn-lyr"><div class="gn-lh">' + esc(bare(s.title) || '') + ' Lyrics</div>' +
        '<div class="gn-text">' + EW('lyrics', gnLyrics(s.lyrics, s.hl, s.active)) + '</div></div>' +
        '<div class="gn-side">' + (s.note || s.hl ? '<div class="gn-ann"><div class="gn-al"><span class="gn-ab">Genius Annotation</span>' +
          (s.noteBy ? '<span class="gn-cn">' + E('noteBy', s.noteBy) + ' contributors</span>' : '') + '</div>' +
          '<div class="gn-at">' + EB('note', s.note) + '</div>' +
          '<div class="gn-av"><span class="gn-up">' + I.thumb + '<b>' + E('votes', s.votes) + '</b></span><span class="gn-dn">' + I.thumb + '</span><span class="gn-sh">' + I.share + 'Share</span></div></div>' : '') +
        '</div></div></div>';
    }
  });

  /* ============================== suno ============================== */

  TOOLS.push({
    id: 'suno',
    label: 'suno song',
    defaults: { cover: '', title: '', styles: '', pfp: '', handle: '', version: 'v4.5', likes: '', plays: '', comments: '', date: '', liked: false,
      lyrics: '', now: '', length: '', progress: 30, playing: true },
    fields: [
      { key: 'cover', type: 'image', label: 'cover art', max: 800 },
      { key: 'title', type: 'text', label: 'song title' },
      { key: 'styles', type: 'textarea', label: 'styles', rows: 2, placeholder: 'emo pop punk, female vocals, ...' },
      { type: 'row', fields: [
        { key: 'pfp', type: 'image', label: 'your pfp', max: 200 },
        { key: 'handle', type: 'text', label: 'your @' }
      ] },
      { type: 'row', fields: [
        { key: 'version', type: 'select', label: 'model', options: [['v3.5', 'v3.5'], ['v4', 'v4'], ['v4.5', 'v4.5'], ['v4.5+', 'v4.5+'], ['v5', 'v5']] },
        { key: 'date', type: 'text', label: 'date', placeholder: 'October 14, 2026' }
      ] },
      { type: 'row', fields: [
        { key: 'likes', type: 'text', label: 'likes' },
        { key: 'plays', type: 'text', label: 'plays' },
        { key: 'comments', type: 'text', label: 'comments' },
        { key: 'liked', type: 'toggle', label: 'liked' }
      ] },
      { key: 'lyrics', type: 'textarea', label: 'lyrics', rows: 7 },
      { type: 'head', label: 'player' },
      { type: 'row', fields: [
        { key: 'now', type: 'text', label: 'time', placeholder: '0:48' },
        { key: 'length', type: 'text', label: 'length', placeholder: '3:12' },
        { key: 'playing', type: 'toggle', label: 'playing' }
      ] },
      { key: 'progress', type: 'range', label: 'progress', min: 0, max: 100 }
    ],
    render: function (s) {
      var p = Math.max(0, Math.min(100, +s.progress || 0));
      return '<div class="shot su">' +
        '<div class="su-top"><span class="su-logo">SUNO</span><span class="su-ic">' + I.share + '</span></div>' +
        '<div class="su-cw">' + pic(s.cover, 'cover', 'su-cover') + '</div>' +
        '<div class="su-title">' + E('title', s.title) + '</div>' +
        '<div class="su-who">' + U.avatar(s.pfp, s.handle, 'su-ava', undefined, 'pfp') + '<span>' + E('handle', String(s.handle || '').replace(/^@/, '')) + '</span>' +
        '<span class="su-follow">Follow</span></div>' +
        '<div class="su-styles">' + EB('styles', s.styles) + '</div>' +
        '<div class="su-info"><span class="su-ver">' + esc(s.version) + '</span>' + (s.date ? '<span>' + E('date', s.date) + '</span>' : '') + '</div>' +
        '<div class="su-acts"><span class="su-play">' + (s.playing ? I.pause : I.play) + '</span>' +
        '<span class="su-act' + (s.liked ? ' on' : '') + '">' + (s.liked ? I.heartF : I.heart) + E('likes', s.likes) + '</span>' +
        '<span class="su-act">' + I.chat + E('comments', s.comments) + '</span>' +
        '<span class="su-act">' + I.play + E('plays', s.plays) + '</span>' +
        '<span class="su-act su-more">' + I.dots + '</span></div>' +
        '<div class="su-lyrics">' + EB('lyrics', s.lyrics) + '</div>' +
        '<div class="su-player">' + pic(s.cover, 'cover', 'su-pc') + '<div class="su-pw"><div class="su-pt">' + E('title', s.title) + '</div>' +
        '<div class="su-pbar"><span>' + E('now', s.now) + '</span><div class="su-track"><i style="width:' + p + '%"></i></div><span>' + E('length', s.length) + '</span></div></div>' +
        '<span class="su-pb">' + I.prev + '</span><span class="su-pp">' + (s.playing ? I.pause : I.play) + '</span><span class="su-pb">' + I.next + '</span></div>' +
        '</div>';
    }
  });

  /* ============================== letterboxd ============================== */

  function lbStars(v) {
    var n = parseFloat(v) || 0, out = '';
    for (var i = 1; i <= Math.floor(n); i++) out += '★';
    if (n % 1) out += '½';
    return out;
  }
  TOOLS.push({
    id: 'letterboxd',
    label: 'letterboxd',
    defaults: { avatar: '', name: '', poster: '', film: '', year: '', stars: '4', liked: true, rewatch: false, watched: '', review: '', likes: '', comments: '', spoiler: false },
    fields: [
      { type: 'row', fields: [
        { key: 'avatar', type: 'image', label: 'your pfp', max: 200 },
        { key: 'name', type: 'text', label: 'your name' }
      ] },
      { key: 'poster', type: 'image', label: 'poster', max: 500 },
      { type: 'row', fields: [
        { key: 'film', type: 'text', label: 'movie' },
        { key: 'year', type: 'text', label: 'year' }
      ] },
      { type: 'row', fields: [
        { key: 'stars', type: 'select', label: 'stars', options: ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'].map(function (k) { return [k, k === '0' ? 'none' : lbStars(k)]; }) },
        { key: 'liked', type: 'toggle', label: 'liked' },
        { key: 'rewatch', type: 'toggle', label: 'rewatch' }
      ] },
      { key: 'watched', type: 'text', label: 'watched date', placeholder: '14 Oct 2026' },
      { key: 'review', type: 'textarea', label: 'review', rows: 5 },
      { type: 'row', fields: [
        { key: 'likes', type: 'text', label: 'likes' },
        { key: 'comments', type: 'text', label: 'comments' },
        { key: 'spoiler', type: 'toggle', label: 'spoilers' }
      ] }
    ],
    render: function (s) {
      var re = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a8 8 0 0 1 14-5l2 2M20 4v4h-4M20 13a8 8 0 0 1-14 5l-2-2M4 20v-4h4"/></svg>';
      return '<div class="shot lb">' +
        '<div class="lb-bar"><span class="lb-dots"><i></i><i></i><i></i></span><span class="lb-word">Letterboxd</span></div>' +
        '<div class="lb-main">' + pic(s.poster, 'poster', 'lb-poster') +
        '<div class="lb-col"><div class="lb-by">' + U.avatar(s.avatar, s.name, 'lb-ava', undefined, 'avatar') + '<span>Review by <b>' + E('name', s.name) + '</b></span></div>' +
        '<div class="lb-film"><span class="lb-ft">' + E('film', s.film) + '</span> <span class="lb-yr">' + E('year', s.year) + '</span>' +
        '<span class="lb-rate">' + (lbStars(s.stars) ? '<span class="lb-stars">' + lbStars(s.stars) + '</span>' : '') +
        (s.liked ? '<span class="lb-heart">' + I.heartF + '</span>' : '') + (s.rewatch ? '<span class="lb-re">' + re + '</span>' : '') + '</span></div>' +
        (s.watched ? '<div class="lb-wd">Watched ' + E('watched', s.watched) + '</div>' : '') +
        (s.spoiler ? '<div class="lb-spoil">This review may contain spoilers.</div>' : '') +
        '<div class="lb-review">' + EB('review', s.review) + '</div>' +
        '<div class="lb-acts"><span class="lb-like">' + I.heartF + '<span>Like review</span></span>' +
        (s.likes ? '<span class="lb-n">' + E('likes', s.likes) + ' likes</span>' : '') + (s.comments ? '<span class="lb-n">' + E('comments', s.comments) + ' comments</span>' : '') + '</div>' +
        '</div></div></div>';
    }
  });

  /* ============================== achievement popups ============================== */

  var PS_GRADE = { bronze: ['Bronze', '#c77b4a', '#8a4b2a'], silver: ['Silver', '#d9dde3', '#8d939c'], gold: ['Gold', '#f4c54a', '#b07d12'], platinum: ['Platinum', '#cfe3f3', '#7d9bb5'] };
  function mcT(html, color) { return '<span class="ach-mct" style="color:' + color + ';text-shadow:2px 2px 0 ' + U.shade(color, -0.75) + '">' + html + '</span>'; }
  TOOLS.push({
    id: 'achieve',
    label: 'achievement',
    defaults: { style: 'xbox', bg: '', icon: '', title: '', desc: '', score: '', grade: 'gold', mcType: 'advancement', rare: false, rarePct: '' },
    fields: [
      { key: 'style', type: 'select', label: 'style', options: [['xbox', 'xbox'], ['steam', 'steam'], ['ps', 'playstation trophy'], ['mc', 'minecraft advancement']] },
      { key: 'bg', type: 'image', label: 'screenshot behind (optional)', max: 1600 },
      { key: 'icon', type: 'image', label: 'icon', max: 300 },
      { key: 'title', type: 'text', label: 'achievement name' },
      { key: 'desc', type: 'text', label: 'description' },
      { type: 'row', fields: [
        { key: 'score', type: 'text', label: 'gamerscore (xbox)', placeholder: '50' },
        { key: 'grade', type: 'select', label: 'trophy (ps)', options: Object.keys(PS_GRADE).map(function (k) { return [k, PS_GRADE[k][0]]; }) },
        { key: 'mcType', type: 'select', label: 'kind (minecraft)', options: [['advancement', 'advancement'], ['goal', 'goal'], ['challenge', 'challenge']] }
      ] },
      { type: 'row', fields: [
        { key: 'rare', type: 'toggle', label: 'rare (xbox/steam)' },
        { key: 'rarePct', type: 'text', label: 'unlocked by', placeholder: '2.1%' }
      ] }
    ],
    render: function (s) {
      var pop;
      if (s.style === 'steam') {
        pop = '<div class="ach-steam' + (s.rare ? ' rare' : '') + '">' + pic(s.icon, 'icon', 'ach-sti') +
          '<div class="ach-stw"><div class="ach-stl">' + (s.rare ? 'Rare achievement unlocked!' : 'Achievement Unlocked!') + '</div>' +
          '<div class="ach-stt">' + E('title', s.title) + '</div><div class="ach-std">' + E('desc', s.desc) + '</div>' +
          (s.rare && s.rarePct ? '<div class="ach-stp">' + E('rarePct', s.rarePct) + ' of players have this</div>' : '') + '</div></div>';
      } else if (s.style === 'ps') {
        var g = PS_GRADE[s.grade] || PS_GRADE.gold;
        var cup = '<span class="ach-cup" style="color:' + g[1] + ';filter:drop-shadow(0 1px 0 ' + g[2] + ')">' + I.trophy + '</span>';
        pop = '<div class="ach-ps">' + pic(s.icon, 'icon', 'ach-psi') + '<div class="ach-psw"><div class="ach-psl">' + cup + 'You earned a trophy!</div>' +
          '<div class="ach-pst">' + E('title', s.title) + '</div>' + (s.desc ? '<div class="ach-psd">' + E('desc', s.desc) + '</div>' : '') + '</div></div>';
      } else if (s.style === 'mc') {
        var kinds = { advancement: 'Advancement Made!', goal: 'Goal Reached!', challenge: 'Challenge Complete!' };
        pop = '<div class="ach-mc"><div class="ach-mci"' + DI('icon') + '>' + (s.icon ? '<img src="' + s.icon + '" alt="">' : '') + '</div>' +
          '<div class="ach-mcl">' + mcT(kinds[s.mcType] || kinds.advancement, s.mcType === 'challenge' ? '#ff88ff' : '#ffff00') + '</div>' +
          '<div class="ach-mcx">' + mcT(E('title', s.title), '#ffffff') + '</div></div>';
      } else {
        pop = '<div class="ach-xb' + (s.rare ? ' rare' : '') + '"><div class="ach-xbc">' + (s.icon ? '<img src="' + s.icon + '"' + DI('icon') + ' alt="">' : '<span' + DI('icon') + '>' + I.trophy + '</span>') + '</div>' +
          '<div class="ach-xbw"><div class="ach-xbl">' + (s.rare ? 'Rare achievement unlocked' : 'Achievement unlocked') + (s.rare && s.rarePct ? ' · ' + E('rarePct', s.rarePct) : '') + '</div>' +
          '<div class="ach-xbt"><span class="ach-g">' + I.gscore + '</span>' + E('score', s.score) + ' &ndash; ' + E('title', s.title) + '</div></div></div>';
      }
      var behind = s.bg ? '<img class="ach-bg" src="' + s.bg + '"' + DI('bg') + ' alt="">' : '';
      return '<div class="shot ach st-' + s.style + (s.bg ? ' has-bg' : '') + '">' + behind + '<div class="ach-pos">' + pop + '</div></div>';
    }
  });
})();
