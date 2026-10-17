/* screenies — retro: myspace profile, msn / aim, flip phone texts, ipod now playing
   every class here starts with r1- */

(function () {
  var esc = U.esc;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function txt(v) { return String(bare(v) == null ? '' : bare(v)).replace(/​/g, ''); }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' r1-nopic"' + DI(path) + '></div>'; }
  function svg(vb, inner, extra) { return '<svg viewBox="' + vb + '"' + (extra || '') + '>' + inner + '</svg>'; }
  function secs(t) {
    var m = /^\s*-?(\d+):(\d{1,2})\s*$/.exec(txt(t));
    return m ? +m[1] * 60 + +m[2] : null;
  }

  /* ============================== myspace ============================== */

  var MS_THEMES = {
    classic: ['classic', '#e5e5e5', '#ffffff', '#6698cb', '#000000', '#003399', '#ff6600'],
    scene: ['scene pink', '#000000', '#0c0c0c', '#ff2a93', '#ffffff', '#ff79bf', '#ff2a93'],
    emo: ['emo red', '#000000', '#101010', '#9e0b0b', '#e8e8e8', '#ff4747', '#ff2525'],
    pastel: ['pastel', '#ffd3ea', '#ffffff', '#b48ae8', '#333333', '#d6338a', '#ff4fa0'],
    toxic: ['toxic', '#000000', '#0c0c0c', '#2fbf3f', '#ffffff', '#8cff5a', '#39ff14'],
    purple: ['purple', '#1b0b2e', '#ffffff', '#7b3fbf', '#222222', '#6a1fb5', '#e0218a']
  };
  var MS_KEYS = ['bg', 'box', 'accent', 'text', 'link', 'head'];

  var MS_IC = {
    msg: '<path d="M1 3h14v10H1z" fill="#fff" stroke="currentColor"/><path d="M1 3l7 5.5L15 3" fill="none" stroke="currentColor"/>',
    fwd: '<path d="M1 4h10v9H1z" fill="#fff" stroke="currentColor"/><path d="M1 4l5 4 5-4" fill="none" stroke="currentColor"/><path d="M10 1h3l3 3-3 3h-3z" fill="#e8a400"/>',
    add: '<circle cx="6" cy="5" r="3" fill="#f2c18d" stroke="currentColor"/><path d="M1 15c0-4 2-5.5 5-5.5s5 1.5 5 5.5z" fill="currentColor"/><path d="M13 5v6M10 8h6" stroke="#2a9d2a" stroke-width="2"/>',
    fav: '<path d="M8 1l2.1 4.6 5 .5-3.7 3.4 1 4.9L8 12 3.6 14.4l1-4.9L.9 6.1l5-.5z" fill="#ffcc00" stroke="#b38600"/>',
    im: '<path d="M1.5 2h13v9h-7l-4 3.5V11h-2z" fill="#fff" stroke="currentColor"/><path d="M4 5.5h8M4 8h6" stroke="currentColor"/>',
    block: '<circle cx="8" cy="8" r="6.5" fill="#fff" stroke="#c00" stroke-width="2"/><path d="M3.5 3.5l9 9" stroke="#c00" stroke-width="2"/>',
    grp: '<circle cx="5" cy="5" r="2.5" fill="#f2c18d" stroke="currentColor"/><circle cx="11" cy="5" r="2.5" fill="#f2c18d" stroke="currentColor"/><path d="M0.5 14c0-3 1.8-5 4.5-5s4.5 2 4.5 5zM6.5 14c0-3 1.8-5 4.5-5s4.5 2 4.5 5z" fill="currentColor"/>',
    rank: '<path d="M2 14h12" stroke="currentColor"/><path d="M3 9h3v5H3zM7 5h3v9H7zM11 11h3v3h-3z" fill="currentColor"/>'
  };
  function msIcon(k) { return '<svg class="r1-ms-ci" viewBox="0 0 16 16">' + MS_IC[k] + '</svg>'; }

  TOOLS.push({
    id: 'myspace',
    label: 'myspace',
    defaults: {
      theme: 'classic', bg: '#e5e5e5', box: '#ffffff', accent: '#6698cb', text: '#000000', link: '#003399', head: '#ff6600', glitter: false, bgPic: '',
      pic: '', name: '', quote: '', gender: '', age: '', place: '', country: '', online: true, lastLogin: '', mood: '', url: '',
      song: '', artist: '', playing: true,
      about: '', meet: '', general: '', music: '', movies: '', tv: '', books: '', heroes: '',
      status: '', herefor: '', hometown: '', zodiac: '',
      friendCount: '', friends: [], commentCount: '', comments: []
    },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'layout', rebuild: true,
          options: Object.keys(MS_THEMES).map(function (k) { return [k, MS_THEMES[k][0]]; }),
          onPick: function (o) { var t = MS_THEMES[o.theme]; if (t) MS_KEYS.forEach(function (k, i) { o[k] = t[i + 1]; }); } },
        { key: 'glitter', type: 'toggle', label: 'glitter' }
      ] },
      { type: 'row', fields: [
        { key: 'bg', type: 'color', label: 'background' },
        { key: 'box', type: 'color', label: 'boxes' },
        { key: 'accent', type: 'color', label: 'accent' }
      ] },
      { type: 'row', fields: [
        { key: 'text', type: 'color', label: 'text' },
        { key: 'link', type: 'color', label: 'links' },
        { key: 'head', type: 'color', label: 'headings' }
      ] },
      { key: 'bgPic', type: 'image', label: 'background pic', max: 900 },
      { type: 'head', label: 'profile' },
      { key: 'pic', type: 'image', label: 'profile pic', max: 400 },
      { key: 'name', type: 'text', label: 'name' },
      { key: 'quote', type: 'text', label: 'headline' },
      { type: 'row', fields: [
        { key: 'gender', type: 'text', label: 'gender' },
        { key: 'age', type: 'text', label: 'age' }
      ] },
      { type: 'row', fields: [
        { key: 'place', type: 'text', label: 'city' },
        { key: 'country', type: 'text', label: 'country' }
      ] },
      { type: 'row', fields: [
        { key: 'lastLogin', type: 'text', label: 'last login' },
        { key: 'online', type: 'toggle', label: 'online now' }
      ] },
      { type: 'row', fields: [
        { key: 'mood', type: 'text', label: 'mood' },
        { key: 'url', type: 'text', label: 'url' }
      ] },
      { type: 'head', label: 'profile song' },
      { type: 'row', fields: [
        { key: 'song', type: 'text', label: 'song' },
        { key: 'artist', type: 'text', label: 'artist' },
        { key: 'playing', type: 'toggle', label: 'playing' }
      ] },
      { type: 'head', label: 'blurbs' },
      { key: 'about', type: 'textarea', label: 'about me', rows: 4 },
      { key: 'meet', type: 'textarea', label: "who i'd like to meet", rows: 2 },
      { type: 'head', label: 'interests' },
      { type: 'row', fields: [
        { key: 'general', type: 'text', label: 'general' },
        { key: 'music', type: 'text', label: 'music' }
      ] },
      { type: 'row', fields: [
        { key: 'movies', type: 'text', label: 'movies' },
        { key: 'tv', type: 'text', label: 'television' }
      ] },
      { type: 'row', fields: [
        { key: 'books', type: 'text', label: 'books' },
        { key: 'heroes', type: 'text', label: 'heroes' }
      ] },
      { type: 'head', label: 'details' },
      { type: 'row', fields: [
        { key: 'status', type: 'text', label: 'status' },
        { key: 'herefor', type: 'text', label: 'here for' }
      ] },
      { type: 'row', fields: [
        { key: 'hometown', type: 'text', label: 'hometown' },
        { key: 'zodiac', type: 'text', label: 'zodiac' }
      ] },
      { type: 'head', label: 'top 8' },
      { key: 'friendCount', type: 'text', label: 'friend count' },
      { key: 'friends', type: 'list', compact: true,
        adds: [{ label: '+ friend', item: item({ pic: '', name: '' }) }],
        item: [
          { type: 'row', fields: [
            { key: 'pic', type: 'image', label: 'pic', max: 260 },
            { key: 'name', type: 'text', label: 'name' }
          ] }
        ] },
      { type: 'head', label: 'comments' },
      { key: 'commentCount', type: 'text', label: 'comment count' },
      { key: 'comments', type: 'list',
        adds: [{ label: '+ comment', item: item({ pic: '', name: '', date: '', text: '' }) }],
        item: [
          { type: 'row', fields: [
            { key: 'pic', type: 'image', label: 'pic', max: 260 },
            { key: 'name', type: 'text', label: 'name' }
          ] },
          { key: 'date', type: 'text', label: 'date' },
          { key: 'text', type: 'textarea', label: 'comment', rows: 2 }
        ] }
    ],
    render: function (s) {
      var dark = U.lum(s.box) < 0.25;
      var light = dark ? U.shade(s.accent, -0.55) : U.shade(s.accent, 0.5);
      var pale = dark ? U.shade(s.accent, -0.78) : U.shade(s.accent, 0.72);
      var ltext = dark ? U.shade(s.accent, 0.45) : U.shade(s.accent, -0.35);
      var cl = dark ? U.shade(s.head, -0.7) : U.shade(s.head, 0.6), cr = dark ? U.shade(s.head, -0.82) : U.shade(s.head, 0.74);
      var vars = '--ms-bg:' + s.bg + ';--ms-box:' + s.box + ';--ms-ac:' + s.accent + ';--ms-tx:' + s.text + ';--ms-ln:' + s.link + ';--ms-hd:' + s.head +
        ';--ms-lt:' + light + ';--ms-pl:' + pale + ';--ms-lx:' + ltext + ';--ms-cl:' + cl + ';--ms-cr:' + cr + ';' +
        (s.bgPic ? 'background-image:url(' + s.bgPic + ');' : '');
      var who = esc(txt(s.name));
      var whos = who ? who + "'s" : '';

      var age = txt(s.age);
      var info = '<div class="r1-ms-quote">' + (txt(s.quote) || s.quote ? '"' + E('quote', s.quote) + '"' : '') + '</div><br>' +
        E('gender', s.gender) + '<br>' + E('age', s.age) + (/^\d+$/.test(age) ? ' years old' : '') + '<br>' +
        E('place', s.place) + '<br>' + E('country', s.country) + '<br><br>' +
        (s.online ? '<div class="r1-ms-online"><svg viewBox="0 0 14 16"><circle cx="7" cy="3.4" r="2.9" fill="#ffcc33" stroke="#c77700"/><path d="M2 15.5l1.6-6.2C4 7.6 5.3 7 7 7s3 .6 3.4 2.3l1.6 6.2z" fill="#ff9900" stroke="#c77700"/></svg><span>Online Now!</span></div><br>' : '') +
        '<div class="r1-ms-login">Last Login: ' + E('lastLogin', s.lastLogin) + '</div>';

      var contact = ['msg', 'Send Message', 'fwd', 'Forward to Friend', 'add', 'Add to Friends', 'fav', 'Add to Favorites',
        'im', 'Instant Message', 'block', 'Block User', 'grp', 'Add to Group', 'rank', 'Rank User'];
      var cgrid = '';
      for (var i = 0; i < contact.length; i += 2) cgrid += '<div class="r1-ms-cb">' + msIcon(contact[i]) + '<a>' + contact[i + 1] + '</a></div>';

      function row(label, k, multi) { return '<tr><td class="r1-ms-lb">' + label + '</td><td class="r1-ms-vl">' + (multi ? EB(k, s[k]) : E(k, s[k])) + '</td></tr>'; }
      var interests = [['General', 'general'], ['Music', 'music'], ['Movies', 'movies'], ['Television', 'tv'], ['Books', 'books'], ['Heroes', 'heroes']]
        .filter(function (p) { return s[p[1]]; }).map(function (p) { return row(p[0], p[1]); }).join('');
      var details = [['Status:', 'status'], ['Here for:', 'herefor'], ['Hometown:', 'hometown'], ['Zodiac Sign:', 'zodiac']]
        .filter(function (p) { return s[p[1]]; }).map(function (p) { return row(p[0], p[1]); }).join('');

      var left = '<div class="r1-ms-l">' +
        '<div class="r1-ms-name">' + E('name', s.name) + '</div>' +
        '<div class="r1-ms-id">' + pic(s.pic, 'pic', 'r1-ms-pic') + '<div class="r1-ms-info">' + info + '</div></div>' +
        '<div class="r1-ms-mood"><b>Mood:</b> ' + E('mood', s.mood) + '</div>' +
        '<div class="r1-ms-view"><b>View My:</b> <a>Pics</a> | <a>Videos</a></div>' +
        '<div class="r1-ms-box r1-ms-contact"><div class="r1-ms-bh">Contacting ' + who + '</div><div class="r1-ms-cg">' + cgrid + '</div></div>' +
        '<div class="r1-ms-box r1-ms-url"><b>MySpace URL:</b><br>http://www.myspace.com/' + E('url', s.url) + '</div>' +
        (interests ? '<table class="r1-ms-tb"><tr><td colspan="2" class="r1-ms-th">' + whos + ' Interests</td></tr>' + interests + '</table>' : '') +
        (details ? '<table class="r1-ms-tb"><tr><td colspan="2" class="r1-ms-th">' + whos + ' Details</td></tr>' + details + '</table>' : '') +
        '</div>';

      var player = (s.song || s.artist) ? '<div class="r1-ms-player"><span class="r1-ms-pb">' +
        (s.playing ? '<svg viewBox="0 0 10 10"><path d="M2 1h2v8H2zM6 1h2v8H6z"/></svg>' : '<svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z"/></svg>') + '</span>' +
        '<span class="r1-ms-pb sq"><svg viewBox="0 0 10 10"><path d="M2 2h6v6H2z"/></svg></span>' +
        '<div class="r1-ms-pt"><div class="r1-ms-ps">' + E('song', s.song) + '</div><div class="r1-ms-pa">' + E('artist', s.artist) + '</div></div>' +
        '<div class="r1-ms-pbar"><i style="width:' + (s.playing ? 34 : 0) + '%"></i></div>' +
        '<span class="r1-ms-vol"><svg viewBox="0 0 12 10"><path d="M0 3h2.5L6 0v10L2.5 7H0z"/><path d="M8 2.5c1 .8 1 4.2 0 5M9.8 1c2 1.6 2 6.4 0 8" fill="none" stroke="currentColor"/></svg></span></div>' : '';

      var fr = (s.friends || []).slice(0, 8).map(function (f, i) {
        return '<div class="r1-ms-fr"><a class="r1-ms-fn">' + E('friends.' + i + '.name', f.name) + '</a>' + pic(f.pic, 'friends.' + i + '.pic', 'r1-ms-fp') + '</div>';
      }).join('');
      var cms = s.comments || [];
      var crows = cms.map(function (c, i) {
        var p = 'comments.' + i + '.';
        return '<tr><td class="r1-ms-cl"><a class="r1-ms-cn">' + E(p + 'name', c.name) + '</a>' + pic(c.pic, p + 'pic', 'r1-ms-cp') + '</td>' +
          '<td class="r1-ms-cr"><div class="r1-ms-cd">' + E(p + 'date', c.date) + '</div>' + EB(p + 'text', c.text) + '</td></tr>';
      }).join('');

      var right = '<div class="r1-ms-r">' + player +
        '<div class="r1-ms-ext">' + who + ' is in your extended network</div>' +
        ((s.about || s.meet) ? '<div class="r1-ms-sec"><div class="r1-ms-hd">' + whos + ' Blurbs</div>' +
          (s.about ? '<div class="r1-ms-bt">About me:</div><div class="r1-ms-bx">' + EB('about', s.about) + '</div>' : '') +
          (s.meet ? '<div class="r1-ms-bt">Who I\'d like to meet:</div><div class="r1-ms-bx">' + EB('meet', s.meet) + '</div>' : '') + '</div>' : '') +
        '<div class="r1-ms-sec"><div class="r1-ms-hd">' + whos + ' Friend Space</div>' +
        '<div class="r1-ms-fc"><b>' + who + ' has <span class="r1-ms-red">' + E('friendCount', s.friendCount) + '</span> friends.</b></div>' +
        (fr ? '<div class="r1-ms-fg">' + fr + '</div>' : '') +
        '<div class="r1-ms-va"><a>View All of ' + whos + ' Friends</a></div></div>' +
        '<div class="r1-ms-sec"><div class="r1-ms-hd">' + whos + ' Friends Comments</div>' +
        '<div class="r1-ms-disp"><b>Displaying <span class="r1-ms-red">' + cms.length + '</span> of <span class="r1-ms-red">' + E('commentCount', s.commentCount) + '</span> comments ( <a>View All</a> | <a>Add Comment</a> )</b></div>' +
        (crows ? '<table class="r1-ms-ct">' + crows + '</table>' : '') + '</div>' +
        '</div>';

      var nav = ['Home', 'Browse', 'Search', 'Invite', 'Film', 'Mail', 'Blog', 'Favorites', 'Forum', 'Groups', 'Events', 'Videos', 'Music', 'Comedy', 'Classifieds'];
      return '<div class="shot r1-ms' + (s.glitter ? ' r1-ms-gl' : '') + (dark ? ' r1-ms-dk' : '') + '" style="' + vars + '">' +
        '<div class="r1-ms-wrap">' +
        '<div class="r1-ms-top"><div class="r1-ms-logo"><svg viewBox="0 0 34 22"><circle cx="8" cy="6" r="4" fill="#fff"/><circle cx="17" cy="5" r="4.6" fill="#fff"/><circle cx="26" cy="6" r="4" fill="#fff"/>' +
        '<path d="M1 21c0-6 3-9 7-9s7 3 7 9zM9 21c0-6.5 3.5-10 8-10s8 3.5 8 10zM19 21c0-6 3-9 7-9s7 3 7 9z" fill="#fff"/></svg>' +
        '<div><div class="r1-ms-lw">myspace<span>.com</span></div><div class="r1-ms-tag">a place for friends</div></div></div>' +
        '<div class="r1-ms-srch"><div><span class="r1-ms-sl">Search:</span><span class="r1-ms-inp"></span><span class="r1-ms-go">Search</span></div>' +
        '<div class="r1-ms-rad"><i class="on"></i>The Web <i class="on2"></i>MySpace <i></i>People <i></i>Music <i></i>Blogs <span class="r1-ms-g">powered by <b>Google</b></span></div></div>' +
        '<div class="r1-ms-help">Help | SignOut</div></div>' +
        '<div class="r1-ms-nav">' + nav.map(function (n) { return '<a>' + n + '</a>'; }).join(' | ') + '</div>' +
        '<div class="r1-ms-page">' + left + right + '</div></div></div>';
    }
  });

  /* ============================== msn / aim ============================== */

  var XP_BTNS = '<span class="r1-xp-bt">' +
    '<i class="r1-xp-b"><svg viewBox="0 0 10 10"><path d="M2 7h5v2H2z" fill="#fff"/></svg></i>' +
    '<i class="r1-xp-b"><svg viewBox="0 0 10 10"><path d="M1 1h8v8H1zM2 3v5h6V3z" fill="#fff" fill-rule="evenodd"/></svg></i>' +
    '<i class="r1-xp-b r1-xp-x"><svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2L2 8" stroke="#fff" stroke-width="1.8"/></svg></i></span>';
  function xpWin(cls, icon, title, menu, inner, status) {
    return '<div class="r1-xp ' + cls + '"><div class="r1-xp-t"><span class="r1-xp-ic">' + icon + '</span><span class="r1-xp-tt">' + title + '</span>' + XP_BTNS + '</div>' +
      '<div class="r1-xp-in">' + (menu ? '<div class="r1-xp-menu">' + menu.map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>' : '') +
      inner + (status != null ? '<div class="r1-xp-st">' + status + '</div>' : '') + '</div></div>';
  }
  // the msn "buddy" person, colored by status
  function msnBuddy(status, big) {
    var c = { online: ['#4fbf3a', '#2b8a1e'], away: ['#4fbf3a', '#2b8a1e'], busy: ['#4fbf3a', '#2b8a1e'], offline: ['#b9c2cc', '#7d8792'] }[status] || ['#4fbf3a', '#2b8a1e'];
    var badge = status === 'away' ? '<circle cx="12.2" cy="12" r="3.6" fill="#fff" stroke="#d68a00"/><path d="M12.2 9.8V12h1.6" stroke="#d68a00" fill="none" stroke-width="1"/>' :
      status === 'busy' ? '<circle cx="12.2" cy="12" r="3.6" fill="#e2332a" stroke="#9b1510"/><path d="M10.4 12h3.6" stroke="#fff" stroke-width="1.2"/>' :
      status === 'offline' ? '<circle cx="12.2" cy="12" r="3.6" fill="#fff" stroke="#c0392b"/><path d="M10.6 10.4l3.2 3.2M13.8 10.4l-3.2 3.2" stroke="#c0392b"/>' : '';
    return '<svg class="r1-msn-bud' + (big ? ' big' : '') + '" viewBox="0 0 16 16"><circle cx="6.5" cy="4.4" r="3.2" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width=".8"/>' +
      '<path d="M1 15c0-4.4 2.4-6.6 5.5-6.6S12 10.6 12 15z" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width=".8"/>' +
      '<circle cx="10.5" cy="4.9" r="2.5" fill="#3a8fd8" stroke="#1d5f9e" stroke-width=".7" opacity="' + (status === 'offline' ? 0 : 1) + '"/>' + badge + '</svg>';
  }
  var AIM_MAN = '<svg class="r1-aim-man" viewBox="0 0 20 24"><circle cx="11.5" cy="3.2" r="3" fill="#ffd700" stroke="#000" stroke-width=".9"/>' +
    '<path d="M9.3 7.3c2-.6 3.6-.2 4.6 1l3 3.4-1.4 1.2-2.6-2.6-1.4 3.6 3.2 2.6.4 6.3h-2l-.6-5-3.6-2.6-2 4.2-4.4 2.1-.8-1.8 3.6-1.8 2.5-6.2-1.7.4-1.6 3.4-1.8-.9 2-4.3z" fill="#ffd700" stroke="#000" stroke-width=".9" stroke-linejoin="round"/></svg>';
  var MSN_ICON = '<svg viewBox="0 0 16 16"><circle cx="6" cy="4.3" r="3" fill="#4fbf3a" stroke="#1f6e16" stroke-width=".8"/><path d="M1 15c0-4.4 2.2-6.4 5-6.4s5 2 5 6.4z" fill="#4fbf3a" stroke="#1f6e16" stroke-width=".8"/>' +
    '<circle cx="10.6" cy="4.8" r="2.6" fill="#3a8fd8" stroke="#1d5f9e" stroke-width=".7"/><path d="M7.8 15c.2-3.6 1.4-5.6 3-5.6 2.2 0 4.2 1.6 4.2 5.6z" fill="#3a8fd8" stroke="#1d5f9e" stroke-width=".7"/></svg>';

  var MSN_TOOLS = [
    // invite
    '<circle cx="9" cy="7" r="4" fill="#4fbf3a" stroke="#1f6e16"/><path d="M2 21c0-6 3-8.5 7-8.5s7 2.5 7 8.5z" fill="#4fbf3a" stroke="#1f6e16"/><path d="M18 8v8M14 12h8" stroke="#2a7fd4" stroke-width="2.6"/>',
    // send files
    '<path d="M3 6h7l2 2h9v13H3z" fill="#f7d36b" stroke="#b08a1c"/><path d="M6 4h9l4 4v9H6z" fill="#fff" stroke="#6d7f99"/><path d="M8 11h8M8 14h6" stroke="#6d7f99"/>',
    // webcam
    '<circle cx="12" cy="10" r="7" fill="#d9e1ec" stroke="#5a6b82"/><circle cx="12" cy="10" r="3.6" fill="#1f3c66"/><circle cx="11" cy="9" r="1" fill="#fff"/><path d="M8 17l-2 5h12l-2-5" fill="#9fb0c6" stroke="#5a6b82"/>',
    // audio
    '<path d="M4 13a8 8 0 0 1 16 0" fill="none" stroke="#5a6b82" stroke-width="2"/><rect x="2.5" y="12" width="5" height="8" rx="2" fill="#2a7fd4" stroke="#174f8a"/><rect x="16.5" y="12" width="5" height="8" rx="2" fill="#2a7fd4" stroke="#174f8a"/>',
    // activities
    '<circle cx="12" cy="12" r="9" fill="#ff9c2a" stroke="#b55d00"/><path d="M12 5l2 4.4 4.7.5-3.5 3.2 1 4.6L12 15.4 7.8 17.7l1-4.6L5.3 9.9l4.7-.5z" fill="#fff4b0"/>',
    // games
    '<rect x="3" y="7" width="11" height="11" rx="2" fill="#fff" stroke="#c0392b" transform="rotate(-12 8 12)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#c0392b"/><circle cx="10" cy="14" r="1.2" fill="#c0392b"/>' +
      '<rect x="11" y="5" width="10" height="10" rx="2" fill="#fff" stroke="#2a5fbf" transform="rotate(14 16 10)"/><circle cx="16" cy="10" r="1.2" fill="#2a5fbf"/>',
    // block
    '<circle cx="9" cy="7" r="4" fill="#9aa6b5" stroke="#5a6b82"/><path d="M2 21c0-6 3-8.5 7-8.5s7 2.5 7 8.5z" fill="#9aa6b5" stroke="#5a6b82"/><circle cx="17" cy="16" r="5" fill="#fff" stroke="#d0201a" stroke-width="2"/><path d="M13.6 12.6l6.8 6.8" stroke="#d0201a" stroke-width="2"/>'
  ];

  var BUDDY_NEW = { name: '', group: '', status: 'online', msg: '' };

  TOOLS.push({
    id: 'msn',
    label: 'msn / aim',
    defaults: { app: 'msn', mode: 'chat', buddy: '', buddyId: '', buddyPic: '', buddyMsg: '', buddyStatus: 'online', me: '', myPic: '', myMsg: '', myStatus: 'online',
      msgs: [], typing: false, stamps: true, last: '', myColor: '#000000', themColor: '#000000', buddies: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'app', type: 'select', label: 'app', options: [['msn', 'msn messenger'], ['aim', 'aim']] },
        { key: 'mode', type: 'select', label: 'show', options: [['chat', 'chat window'], ['list', 'buddy list']] }
      ] },
      { type: 'head', label: 'them' },
      { type: 'row', fields: [
        { key: 'buddyPic', type: 'image', label: 'their pic', max: 300 },
        { key: 'buddy', type: 'text', label: 'their name' }
      ] },
      { type: 'row', fields: [
        { key: 'buddyId', type: 'text', label: 'email / screen name' },
        { key: 'buddyStatus', type: 'select', label: 'status', options: [['online', 'online'], ['away', 'away'], ['busy', 'busy'], ['offline', 'appear offline']] }
      ] },
      { key: 'buddyMsg', type: 'textarea', label: 'personal / away message', rows: 2 },
      { type: 'head', label: 'you' },
      { type: 'row', fields: [
        { key: 'myPic', type: 'image', label: 'your pic', max: 300 },
        { key: 'me', type: 'text', label: 'your name' }
      ] },
      { type: 'row', fields: [
        { key: 'myMsg', type: 'text', label: 'your personal message' },
        { key: 'myStatus', type: 'select', label: 'status', options: [['online', 'online'], ['away', 'away'], ['busy', 'busy'], ['offline', 'appear offline']] }
      ] },
      { type: 'head', label: 'chat' },
      { key: 'msgs', type: 'list', meKey: 'from',
        adds: [
          { label: '+ me', item: item({ from: 'me', kind: 'text', text: '', time: '' }) },
          { label: '+ them', item: item({ from: 'them', kind: 'text', text: '', time: '' }) }
        ],
        item: [
          { type: 'row', fields: [
            { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['them', 'them']] },
            { key: 'kind', type: 'select', label: 'kind', options: [['text', 'message'], ['nudge', 'nudge / warn'], ['auto', 'auto reply']] },
            { key: 'time', type: 'text', label: 'time' }
          ] },
          { key: 'text', type: 'textarea', label: 'message', rows: 2 }
        ] },
      { type: 'row', fields: [
        { key: 'typing', type: 'toggle', label: 'typing' },
        { key: 'stamps', type: 'toggle', label: 'timestamps' }
      ] },
      { key: 'last', type: 'text', label: 'last message at' },
      { type: 'row', fields: [
        { key: 'myColor', type: 'color', label: 'your text color', swatches: function () { return ['#000000', '#ff0000', '#0000ff', '#ff00ff', '#8000ff', '#008000']; } },
        { key: 'themColor', type: 'color', label: 'their text color', swatches: function () { return ['#000000', '#ff0000', '#0000ff', '#ff00ff', '#8000ff', '#008000']; } }
      ] },
      { type: 'head', label: 'buddy list' },
      { key: 'buddies', type: 'list',
        adds: [{ label: '+ buddy', item: item(BUDDY_NEW) }],
        item: [
          { type: 'row', fields: [
            { key: 'name', type: 'text', label: 'name' },
            { key: 'status', type: 'select', label: 'status', options: [['online', 'online'], ['away', 'away'], ['busy', 'busy'], ['offline', 'offline']] }
          ] },
          { type: 'row', fields: [
            { key: 'group', type: 'text', label: 'group' },
            { key: 'msg', type: 'text', label: 'message' }
          ] }
        ] }
    ],
    render: function (s) {
      var aim = s.app === 'aim';
      var them = txt(s.buddy), mine = txt(s.me);
      var themName = esc(them || (aim ? txt(s.buddyId) : '')), myName = esc(mine);

      if (s.mode === 'list') return aim ? aimList(s) : msnList(s);

      if (aim) {
        var lines = (s.msgs || []).map(function (m, i) {
          var me = m.from === 'me', p = 'msgs.' + i + '.';
          var sn = '<b class="r1-aim-sn ' + (me ? 'r1-me' : 'r1-them') + '">' + (me ? myName : themName) + '</b>';
          var ts = s.stamps && (m.time || m.time === GHOST) ? '<span class="r1-aim-ts' + (me ? ' r1-me' : '') + '"> (' + E(p + 'time', m.time) + ')</span>' : '';
          if (m.kind === 'nudge') return '<div class="r1-aim-sys">' + (me ? 'You have warned ' + themName + '.' : themName + ' has warned you. Your new warning level is 10%.') + '</div>';
          if (m.kind === 'auto') return '<div class="r1-aim-ln">' + sn + ' <span class="r1-aim-auto">&lt;AUTO-REPLY&gt;</span>' + ts + ': <span style="color:' + (me ? s.myColor : s.themColor) + '">' + EB(p + 'text', m.text) + '</span></div>';
          return '<div class="r1-aim-ln">' + sn + ts + ': <span style="color:' + (me ? s.myColor : s.themColor) + '">' + EB(p + 'text', m.text) + '</span></div>';
        }).join('');
        var fmt = '<div class="r1-aim-fmt"><span class="r1-aim-fb col"><b style="border-bottom:3px solid ' + s.myColor + '">A</b>▾</span><span class="r1-aim-fb col"><b class="hl">A</b>▾</span><span class="r1-aim-sep"></span>' +
          '<span class="r1-aim-fb sm">A</span><span class="r1-aim-fb">A</span><span class="r1-aim-fb lg">A</span><span class="r1-aim-sep"></span>' +
          '<span class="r1-aim-fb"><b>B</b></span><span class="r1-aim-fb"><i>I</i></span><span class="r1-aim-fb"><u>U</u></span><span class="r1-aim-sep"></span>' +
          '<span class="r1-aim-fb lnk">link</span><span class="r1-aim-fb">' + svg('0 0 16 16', '<rect x="1.5" y="3" width="13" height="10" fill="#cfe6ff" stroke="#3a5a80"/><path d="M2 12l4-5 3 3 2-2 3 4z" fill="#3c8f3c"/><circle cx="11.5" cy="6" r="1.3" fill="#f5c400"/>') + '</span>' +
          '<span class="r1-aim-fb">' + svg('0 0 16 16', '<circle cx="8" cy="8" r="6.5" fill="#ffd400" stroke="#9a7a00"/><circle cx="5.8" cy="6.5" r=".9"/><circle cx="10.2" cy="6.5" r=".9"/><path d="M4.8 9.4c1.6 2.4 4.8 2.4 6.4 0" fill="none" stroke="#000" stroke-width=".9"/>') + '▾</span></div>';
        var btn = function (icon, label, cls) { return '<span class="r1-aim-bb ' + (cls || '') + '">' + svg('0 0 24 24', icon) + '<span>' + label + '</span></span>'; };
        var btns = '<div class="r1-aim-btns">' +
          btn('<path d="M13 1L5 13h6l-2 10 9-13h-6z" fill="#ffd400" stroke="#8a6d00" stroke-linejoin="round"/>', 'Warn') +
          btn('<circle cx="9" cy="7" r="4" fill="#9aa6b5" stroke="#5a6b82"/><path d="M2 21c0-6 3-8.5 7-8.5s7 2.5 7 8.5z" fill="#9aa6b5" stroke="#5a6b82"/><circle cx="17" cy="16" r="5" fill="#fff" stroke="#d0201a" stroke-width="2"/><path d="M13.6 12.6l6.8 6.8" stroke="#d0201a" stroke-width="2"/>', 'Block') +
          '<span class="r1-aim-gap"></span>' +
          btn('<circle cx="12" cy="12" r="9" fill="#ffd400" stroke="#9a7a00"/><circle cx="9" cy="10" r="1.3"/><circle cx="15" cy="10" r="1.3"/><path d="M7.5 14c2.4 3.4 6.6 3.4 9 0" fill="none" stroke="#000" stroke-width="1.3"/><path d="M15 3l3-2 1 3" fill="#e2332a"/>', 'Expressions') +
          btn('<rect x="2" y="7" width="20" height="11" rx="5.5" fill="#6d7f99" stroke="#3a475a"/><path d="M7 10v5M4.5 12.5h5" stroke="#fff" stroke-width="1.6"/><circle cx="16" cy="11" r="1.3" fill="#ff5a4f"/><circle cx="18.5" cy="13.8" r="1.3" fill="#4fbf3a"/>', 'Games') +
          '<span class="r1-aim-gap"></span>' +
          btn('<rect x="2" y="7" width="14" height="11" rx="2" fill="#3a6fd8" stroke="#1d3f8a"/><path d="M16 11l6-3.5v10L16 14z" fill="#3a6fd8" stroke="#1d3f8a"/>', 'Video') +
          btn('<rect x="8" y="2" width="8" height="13" rx="4" fill="#9aa6b5" stroke="#5a6b82"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" fill="none" stroke="#5a6b82" stroke-width="1.6"/>', 'Talk') +
          '<span class="r1-aim-gap"></span>' +
          btn('<path d="M2 12L22 3l-5 18-5-6-7 3z" fill="#ffd400" stroke="#8a6d00" stroke-linejoin="round"/><path d="M12 15l10-12" stroke="#8a6d00"/>', 'Send', 'send') + '</div>';
        var status = s.typing ? '<span class="r1-aim-typ">' + svg('0 0 16 16', '<rect x="2" y="1.5" width="10" height="13" fill="#fff" stroke="#556"/><path d="M4 5h6M4 7.5h6M4 10h3" stroke="#99a"/><path d="M8.5 13.5l6-7.5 1.3 1-6 7.6-1.9.6z" fill="#ffd400" stroke="#8a6d00" stroke-width=".7"/>') + themName + ' is typing.</span>' :
          (s.last || s.last === GHOST ? 'Last message received at: ' + E('last', s.last) : '');
        var body = '<div class="r1-aim-log">' + lines + '</div>' + fmt +
          '<div class="r1-aim-bot">' + pic(s.buddyPic, 'buddyPic', 'r1-aim-dp') + '<div class="r1-aim-input"></div>' + pic(s.myPic, 'myPic', 'r1-aim-dp') + '</div>' + btns;
        return '<div class="shot r1-im r1-im-aim">' + xpWin('r1-aim-w', AIM_MAN, themName + ' - Instant Message', ['File', 'Edit', 'Insert', 'People'], '<div class="r1-aim-body">' + body + '</div>', status) + '</div>';
      }

      // msn messenger 7.5
      var log = (s.msgs || []).map(function (m, i) {
        var me = m.from === 'me', p = 'msgs.' + i + '.';
        if (m.kind === 'nudge') return '<div class="r1-msn-nudge">' + (me ? 'You have just sent a nudge.' : themName + ' has just sent you a nudge.') + '</div>';
        var ts = s.stamps && (m.time || m.time === GHOST) ? '(' + E(p + 'time', m.time) + ') ' : '';
        return '<div class="r1-msn-says">' + ts + (me ? myName : themName) + ' says' + (m.kind === 'auto' ? ' (automatic reply)' : '') + ':</div>' +
          '<div class="r1-msn-msg" style="color:' + (me ? s.myColor : s.themColor) + '">' + EB(p + 'text', m.text) + '</div>';
      }).join('');
      var stLabel = { away: ' (Away)', busy: ' (Busy)', offline: ' (Offline)' }[s.buddyStatus] || '';
      var tools = '<div class="r1-msn-tools">' + MSN_TOOLS.map(function (t, i) { return '<span class="r1-msn-tl">' + svg('0 0 24 24', t) + (i < 6 ? '<i>▾</i>' : '') + '</span>' + (i === 3 ? '<span class="r1-msn-tsep"></span>' : ''); }).join('') + '</div>';
      var fmtBar = '<div class="r1-msn-fmt"><span class="r1-msn-fb"><b class="r1-msn-a">A</b></span>' +
        '<span class="r1-msn-fb">' + svg('0 0 16 16', '<circle cx="8" cy="8" r="6.6" fill="#ffd400" stroke="#9a7a00"/><circle cx="5.8" cy="6.5" r=".9"/><circle cx="10.2" cy="6.5" r=".9"/><path d="M4.8 9.4c1.6 2.4 4.8 2.4 6.4 0" fill="none" stroke="#000" stroke-width=".9"/>') + '<i>▾</i></span>' +
        '<span class="r1-msn-fb">' + svg('0 0 16 16', '<circle cx="8" cy="8" r="6.6" fill="#7cc4ff" stroke="#2a6fb0"/><path d="M4.6 6.6h2M9.6 5.6l1.6 1.6M4.8 9.6c1.6 2 4.8 2 6.4 0" fill="none" stroke="#123" stroke-width="1"/>') + '<i>▾</i></span>' +
        '<span class="r1-msn-fb">' + svg('0 0 16 16', '<rect x="1.5" y="2.5" width="13" height="11" fill="#fff" stroke="#556b8a"/><path d="M2 13l4-5 3 3 2-2 3 4z" fill="#5aa0e0"/>') + '<i>▾</i></span>' +
        '<span class="r1-msn-fb">' + svg('0 0 16 16', '<path d="M3 3h10v8H3z" fill="#f5b0d0" stroke="#a03070"/><path d="M8 3v8M3 7h10" stroke="#a03070"/><path d="M8 3c-2-3-4 0-2 0M8 3c2-3 4 0 2 0" fill="none" stroke="#a03070"/>') + '<i>▾</i></span>' +
        '<span class="r1-msn-fb r1-msn-nb">' + svg('0 0 16 16', '<path d="M2 4l2 2-2 2M14 4l-2 2 2 2" fill="none" stroke="#e08a00" stroke-width="1.2"/><circle cx="8" cy="8" r="4" fill="#ffd400" stroke="#9a7a00"/>') + '</span>' +
        '<span class="r1-msn-vc">' + svg('0 0 16 16', '<rect x="6" y="1.5" width="4" height="8" rx="2" fill="#6d7f99"/><path d="M4 7.5a4 4 0 0 0 8 0M8 11.5v3" fill="none" stroke="#6d7f99" stroke-width="1.3"/>') + 'Voice Clip</span></div>';
      var status = s.typing ? themName + ' is typing a message.' : (s.last || s.last === GHOST ? 'Last message received at ' + E('last', s.last) + '.' : '');
      var mbody = '<div class="r1-msn-body">' + tools +
        '<div class="r1-msn-main"><div class="r1-msn-lc">' +
        '<div class="r1-msn-to">To: <b>' + E('buddy', s.buddy) + '</b>' + esc(stLabel) + ' &lt;' + E('buddyId', s.buddyId) + '&gt;' +
        (s.buddyMsg ? '<div class="r1-msn-psm">' + E('buddyMsg', s.buddyMsg) + '</div>' : '') + '</div>' +
        '<div class="r1-msn-log">' + log + '</div>' + fmtBar +
        '<div class="r1-msn-inrow"><div class="r1-msn-input"></div><div class="r1-msn-btns"><span class="r1-xpbtn">Send</span><span class="r1-xpbtn">Search</span></div></div>' +
        '<div class="r1-msn-tabs"><span class="on">' + svg('0 0 16 16', '<path d="M3 4h10M3 7h10M3 10h7" stroke="#334" stroke-width="1.4"/>') + '</span><span>' + svg('0 0 16 16', '<path d="M2 12c2-6 4 2 6-3s3 3 6-2" fill="none" stroke="#334" stroke-width="1.4"/>') + '</span></div></div>' +
        '<div class="r1-msn-rc"><div class="r1-msn-dpf">' + pic(s.buddyPic, 'buddyPic', 'r1-msn-dp') + '</div><i class="r1-msn-dpa">▾</i><div class="r1-msn-sp"></div>' +
        '<div class="r1-msn-dpf">' + pic(s.myPic, 'myPic', 'r1-msn-dp') + '</div><i class="r1-msn-dpa">▾</i></div></div></div>';
      return '<div class="shot r1-im r1-im-msn">' + xpWin('r1-msn-w', MSN_ICON, themName + ' - Conversation', ['File', 'Edit', 'Actions', 'Tools', 'Help'], mbody, status) + '</div>';
    }
  });

  function groupBuddies(list, offlineGroup) {
    var groups = [], by = {};
    (list || []).forEach(function (b, i) {
      var g = txt(b.group) || 'Buddies';
      if (offlineGroup && b.status === 'offline') g = '\u0000off';
      if (!by[g]) { by[g] = { name: g, items: [] }; groups.push(by[g]); }
      by[g].items.push({ b: b, i: i });
    });
    groups.sort(function (a, b) { return (a.name === '\u0000off') - (b.name === '\u0000off'); });
    return groups;
  }

  function msnList(s) {
    var mine = txt(s.me);
    var anyGroup = (s.buddies || []).some(function (b) { return txt(b.group); });
    var groups;
    if (anyGroup) groups = groupBuddies(s.buddies, false);
    else {
      var on = [], off = [];
      (s.buddies || []).forEach(function (b, i) { (b.status === 'offline' ? off : on).push({ b: b, i: i }); });
      groups = [{ name: 'Online', items: on, plain: true }, { name: 'Offline', items: off, plain: true }];
    }
    var rows = groups.map(function (g) {
      var online = g.items.filter(function (x) { return x.b.status !== 'offline'; }).length;
      var head = '<div class="r1-ml-g"><i class="r1-ml-tri">▾</i>' + esc(g.name) + ' (' + (g.plain ? g.items.length : online + '/' + g.items.length) + ')</div>';
      return head + g.items.map(function (x) {
        var b = x.b, p = 'buddies.' + x.i + '.';
        var st = { away: ' (Away)', busy: ' (Busy)' }[b.status] || '';
        return '<div class="r1-ml-b' + (b.status === 'offline' ? ' off' : '') + '">' + msnBuddy(b.status) + '<span class="r1-ml-n">' + E(p + 'name', b.name) + esc(st) + '</span>' +
          (b.msg ? '<span class="r1-ml-m"> - ' + E(p + 'msg', b.msg) + '</span>' : '') + '</div>';
      }).join('');
    }).join('');
    var stTxt = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Appear Offline' }[s.myStatus] || 'Online';
    var inner = '<div class="r1-ml">' +
      '<div class="r1-ml-head"><div class="r1-msn-dpf sm">' + pic(s.myPic, 'myPic', 'r1-msn-dp') + '</div><div class="r1-ml-me">' +
      '<div class="r1-ml-nm"><b>' + E('me', s.me) + '</b> <span>(' + stTxt + ')</span> <i>▾</i></div>' +
      '<div class="r1-ml-psm">' + (txt(s.myMsg) || s.myMsg === GHOST ? E('myMsg', s.myMsg) : '&lt;Type a personal message&gt;') + ' <i>▾</i></div>' +
      '<div class="r1-ml-ic">' + svg('0 0 16 12', '<rect x=".5" y=".5" width="15" height="11" fill="#fff" stroke="#4a6a9a"/><path d="M.5.5L8 7l7.5-6.5" fill="none" stroke="#4a6a9a"/>') + '<span>(0)</span>' +
      svg('0 0 16 16', '<circle cx="8" cy="8" r="6.5" fill="#ff9c2a" stroke="#b55d00"/><path d="M8 4v4l3 2" stroke="#fff" stroke-width="1.4" fill="none"/>') +
      svg('0 0 16 16', '<rect x="2" y="2" width="12" height="12" rx="2" fill="#6fb3ff" stroke="#2a6fb0"/><path d="M5 8h6M8 5v6" stroke="#fff" stroke-width="1.6"/>') + '</div></div></div>' +
      '<div class="r1-ml-find"><span class="r1-ml-fi">Find a contact...</span>' + svg('0 0 20 16', '<circle cx="7" cy="5" r="3" fill="#4fbf3a" stroke="#1f6e16"/><path d="M1.5 15c0-4.4 2.4-6 5.5-6s5.5 1.6 5.5 6z" fill="#4fbf3a" stroke="#1f6e16"/><path d="M16 4v7M12.5 7.5h7" stroke="#2a7fd4" stroke-width="2"/>') + '</div>' +
      '<div class="r1-ml-list">' + rows + '</div>' +
      '<div class="r1-ml-ad"><span class="r1-ml-fly">' + svg('0 0 24 20', '<path d="M12 10C9 2 3 0 2 3s2 7 10 7zM12 10c3-8 9-10 10-7s-2 7-10 7z" fill="#ff6a00"/><path d="M12 10c-5 0-9 3-8 6s5 1 8-6zM12 10c5 0 9 3 8 6s-5 1-8-6z" fill="#3c9b2c"/><path d="M12 10C9 4 7 3 6 4M12 10c3-6 5-7 6-6" fill="none" stroke="#1e88e5" stroke-width="1.6"/>') + '</span><b>msn</b><span class="r1-ml-tm">Messenger</span></div>' +
      '</div>';
    return '<div class="shot r1-im r1-im-ml">' + xpWin('r1-ml-w', MSN_ICON, 'MSN Messenger', ['File', 'Contacts', 'Actions', 'Tools', 'Help'], inner) + '</div>';
  }

  function aimList(s) {
    var mine = esc(txt(s.me) || txt(s.buddyId));
    var groups = groupBuddies(s.buddies, true);
    var awayIc = svg('0 0 14 14', '<path d="M2.5 1h7l2.5 2.5V13h-9.5z" fill="#fffbd0" stroke="#8a7a00"/><path d="M4.5 5h5M4.5 7.5h5M4.5 10h3.5" stroke="#8a7a00"/>', ' class="r1-al-away"');
    var rows = groups.map(function (g) {
      var off = g.name === '\u0000off';
      var online = g.items.filter(function (x) { return x.b.status !== 'offline'; }).length;
      var total = off ? g.items.length : (s.buddies || []).filter(function (b) { return (txt(b.group) || 'Buddies') === g.name; }).length;
      return '<div class="r1-al-g"><i>▾</i>' + (off ? 'Offline' : esc(g.name)) + ' (' + (off ? 0 : online) + '/' + total + ')</div>' +
        g.items.map(function (x) {
          var b = x.b, p = 'buddies.' + x.i + '.';
          return '<div class="r1-al-b ' + b.status + '"><span class="r1-al-n">' + E(p + 'name', b.name) + '</span>' + (b.status === 'away' || b.status === 'busy' ? awayIc : '') +
            (b.msg && !off ? '<span class="r1-al-m">' + E(p + 'msg', b.msg) + '</span>' : '') + '</div>';
        }).join('');
    }).join('');
    var tb = function (icon, label) { return '<span class="r1-al-tb">' + svg('0 0 24 24', icon) + '<span>' + label + '</span></span>'; };
    var inner = '<div class="r1-al">' +
      '<div class="r1-al-top"><div class="r1-al-logo">' + AIM_MAN + '<div><b>AIM</b><span>AOL Instant Messenger</span></div></div>' +
      '<div class="r1-al-today">AIM Today</div></div>' +
      '<div class="r1-al-tabs"><span class="on">Online</span><span>List Setup</span></div>' +
      '<div class="r1-al-list">' + rows + '</div>' +
      '<div class="r1-al-bar">' +
      tb('<path d="M2 4h20v12H9l-5 4v-4H2z" fill="#fff" stroke="#3a5a80" stroke-width="1.2"/><path d="M6 8h12M6 11h8" stroke="#3a5a80"/>', 'IM') +
      tb('<path d="M1 3h14v9H6l-3 3v-3H1z" fill="#ffd400" stroke="#8a6d00"/><path d="M9 9h14v9h-2v3l-3-3H9z" fill="#fff" stroke="#3a5a80"/>', 'Chat') +
      tb('<rect x="3" y="5" width="18" height="14" fill="#fff" stroke="#3a5a80" stroke-width="1.2"/><path d="M3 5l9 7 9-7" fill="none" stroke="#3a5a80" stroke-width="1.2"/>', 'Write') +
      tb('<rect x="8" y="2" width="8" height="13" rx="4" fill="#9aa6b5" stroke="#5a6b82"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4" fill="none" stroke="#5a6b82" stroke-width="1.6"/>', 'Talk') +
      tb('<circle cx="12" cy="12" r="9" fill="#3a6fd8" stroke="#1d3f8a"/><path d="M12 10v7" stroke="#fff" stroke-width="2.4"/><circle cx="12" cy="7" r="1.5" fill="#fff"/>', 'Info') +
      tb('<circle cx="12" cy="12" r="5" fill="none" stroke="#5a6b82" stroke-width="3"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5M4 4l3.5 3.5M16.5 16.5L20 20M4 20l3.5-3.5M16.5 7.5L20 4" stroke="#5a6b82" stroke-width="2.6"/>', 'Setup') +
      '</div></div>';
    return '<div class="shot r1-im r1-im-al">' + xpWin('r1-al-w', AIM_MAN, (mine ? mine + "'s " : '') + 'Buddy List Window', ['My AIM', 'People', 'Help'], inner) + '</div>';
  }

  /* ============================== flip phone ============================== */

  var FP_BODY = { silver: ['#d5d8dc', '#9aa0a8'], black: ['#2b2c30', '#0e0e10'], pink: ['#ec6fa6', '#b83a76'], babypink: ['#f7bfd6', '#d88bab'],
    blue: ['#3b5fa8', '#1d336a'], red: ['#c4202f', '#7d0e18'], purple: ['#7b4ab3', '#462570'], white: ['#f4f4f4', '#a9a9a9'], green: ['#7ac143', '#4a8a22'] };

  function fpBars(n) {
    var out = '<path d="M1 0h5L3.5 4z" />';
    out += '<rect x="3" y="3" width="1" height="8"/>';
    for (var i = 0; i < 5; i++) out += '<rect x="' + (6 + i * 3) + '" y="' + (9 - i * 2) + '" width="2" height="' + (2 + i * 2) + '"' + (i < n ? '' : ' opacity=".22"') + '/>';
    return '<svg class="r1-fp-sig" viewBox="0 0 21 11" shape-rendering="crispEdges">' + out + '</svg>';
  }
  function fpBatt(n) {
    var out = '<path d="M0 1h17v9H0zM1 2v7h15V2z" fill-rule="evenodd"/><rect x="17" y="3.5" width="2" height="4"/>';
    for (var i = 0; i < 3; i++) if (i < n) out += '<rect x="' + (2 + i * 5) + '" y="3" width="4" height="5"/>';
    return '<svg class="r1-fp-bat" viewBox="0 0 19 11" shape-rendering="crispEdges">' + out + '</svg>';
  }
  var FP_ENV = '<svg class="r1-fp-env" viewBox="0 0 22 15" shape-rendering="crispEdges"><path d="M0 0h22v15H0z" fill="#fff"/><path d="M0 0h22v15H0zM1 1v13h20V1z" fill-rule="evenodd"/><path d="M1 1l10 8 10-8" fill="none" stroke="#000"/></svg>';

  TOOLS.push({
    id: 'flipphone',
    label: 'flip phone',
    defaults: { model: 'razr', color: 'silver', frame: 'phone', font: 'pixel', mode: 'thread', ui: '#1d4fa8', contact: '', carrier: '', time: '', date: '', signal: '4', battery: '3',
      wallpaper: '', newCount: '1', msgs: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'model', type: 'select', label: 'phone', options: [['razr', 'razr'], ['flip', 'flip phone'], ['sidekick', 'sidekick']] },
        { key: 'color', type: 'select', label: 'color', options: [['silver', 'silver'], ['black', 'black'], ['pink', 'pink'], ['babypink', 'baby pink'], ['blue', 'blue'], ['red', 'red'], ['purple', 'purple'], ['white', 'white'], ['green', 'green']] }
      ] },
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'screen', options: [['thread', 'texts'], ['inbox', 'new message']] },
        { key: 'frame', type: 'select', label: 'show', options: [['phone', 'whole phone'], ['screen', 'screen only']] },
        { key: 'font', type: 'select', label: 'font', options: [['pixel', 'pixel'], ['lcd', 'lcd'], ['tiny', 'tiny caps']] }
      ] },
      { key: 'ui', type: 'color', label: 'screen color', swatches: function () { return ['#1d4fa8', '#e0388a', '#111111', '#5a2a9a', '#2f8a3a', '#c0392b']; } },
      { key: 'contact', type: 'text', label: 'contact' },
      { type: 'row', fields: [
        { key: 'time', type: 'text', label: 'time' },
        { key: 'date', type: 'text', label: 'date' },
        { key: 'carrier', type: 'text', label: 'carrier' }
      ] },
      { type: 'row', fields: [
        { key: 'signal', type: 'select', label: 'signal', options: [['0', 'none'], ['1', '1 bar'], ['2', '2 bars'], ['3', '3 bars'], ['4', '4 bars'], ['5', '5 bars']] },
        { key: 'battery', type: 'select', label: 'battery', options: [['0', 'dead'], ['1', 'low'], ['2', 'half'], ['3', 'full']] }
      ] },
      { type: 'head', label: 'new message' },
      { type: 'row', fields: [
        { key: 'newCount', type: 'text', label: 'how many' },
        { key: 'wallpaper', type: 'image', label: 'wallpaper', max: 600 }
      ] },
      { type: 'head', label: 'texts' },
      { key: 'msgs', type: 'list', meKey: 'from',
        adds: [
          { label: '+ me', item: item({ from: 'me', text: '', time: '' }) },
          { label: '+ them', item: item({ from: 'them', text: '', time: '' }) }
        ],
        item: [
          { type: 'row', fields: [
            { key: 'from', type: 'select', label: 'from', options: [['me', 'me'], ['them', 'them']] },
            { key: 'time', type: 'text', label: 'time' }
          ] },
          { key: 'text', type: 'textarea', label: 'text', rows: 2 }
        ] }
    ],
    render: function (s) {
      var m = s.model, ui = s.ui, who = esc(txt(s.contact));
      var sig = parseInt(s.signal, 10) || 0, bat = parseInt(s.battery, 10) || 0;
      var sb = '<div class="r1-fp-sb">' + fpBars(sig) + (m === 'sidekick' ? '' : '<span class="r1-fp-car">' + E('carrier', s.carrier) + '</span>') +
        '<span class="r1-fp-tm">' + E('time', s.time) + '</span>' + fpBatt(bat) + '</div>';
      var msgs = (s.msgs || []).map(function (x, i) {
        var me = x.from === 'me', p = 'msgs.' + i + '.';
        var t = (x.time || x.time === GHOST) ? '<span class="r1-fp-mt">' + E(p + 'time', x.time) + '</span>' : '';
        if (m === 'flip') return '<div class="r1-fp-bub ' + (me ? 'r1-me' : 'r1-them') + '"><div class="r1-fp-bt">' + EB(p + 'text', x.text) + '</div>' + t + '</div>';
        if (m === 'sidekick') return '<div class="r1-fp-sk ' + (me ? 'r1-me' : 'r1-them') + '"><b>' + (me ? 'Me' : who) + ':</b> ' + EB(p + 'text', x.text) + t + '</div>';
        return '<div class="r1-fp-rz ' + (me ? 'r1-me' : 'r1-them') + '"><div class="r1-fp-rh"><b>' + (me ? 'Me' : who) + '</b>' + t + '</div><div class="r1-fp-rt">' + EB(p + 'text', x.text) + '</div></div>';
      }).join('');
      var n = txt(s.newCount);
      var screen;
      if (s.mode === 'inbox') {
        var wp = s.wallpaper ? '<img class="r1-fp-wp" src="' + s.wallpaper + '"' + DI('wallpaper') + ' alt="">' : '<div class="r1-fp-wp r1-fp-wpd"' + DI('wallpaper') + '></div>';
        screen = wp + sb +
          (m === 'sidekick' ? '' : '<div class="r1-fp-idle"><div class="r1-fp-bigt">' + E('time', s.time) + '</div><div class="r1-fp-dt">' + E('date', s.date) + '</div></div>') +
          '<div class="r1-fp-pop"><div class="r1-fp-ph">' + (m === 'sidekick' ? 'New Message' : 'Messages') + '</div><div class="r1-fp-pb">' + FP_ENV +
          '<div><b>' + E('newCount', s.newCount) + ' New Message' + (n && n !== '1' ? 's' : '') + '</b>' + (who ? '<div class="r1-fp-from">' + who + '</div>' : '') + '</div></div></div>' +
          (m === 'sidekick' ? '<div class="r1-fp-skb"><span>Jump</span><span>Read</span><span>Dismiss</span></div>' : '<div class="r1-fp-soft"><span>Read</span><span class="r1-fp-mid">' + FP_ENV + '</span><span>Exit</span></div>');
      } else if (m === 'sidekick') {
        screen = '<div class="r1-fp-skt"><span class="r1-fp-ska">' + svg('0 0 12 12', '<path d="M1 2h10v7H5l-3 2.5V9H1z" fill="#fff"/>') + '</span><b>' + E('contact', s.contact) + '</b>' +
          '<span class="r1-fp-sks">' + fpBars(sig) + '<span>' + E('time', s.time) + '</span>' + fpBatt(bat) + '</span></div>' +
          '<div class="r1-fp-msgs">' + msgs + '</div><div class="r1-fp-skin"><span></span><b>Send</b></div>';
      } else {
        screen = sb + '<div class="r1-fp-ttl">' + (m === 'razr' ? FP_ENV : '') + '<span>' + E('contact', s.contact) + '</span></div>' +
          '<div class="r1-fp-msgs">' + msgs + '</div>' +
          '<div class="r1-fp-soft"><span>' + (m === 'razr' ? 'Reply' : 'Options') + '</span><span class="r1-fp-mid">' + svg('0 0 12 10', '<path d="M0 0h12v2H0zM0 4h12v2H0zM0 8h12v2H0z"/>', ' shape-rendering="crispEdges"') + '</span><span>' + (m === 'razr' ? 'Back' : 'Reply') + '</span></div>';
      }
      var scr = '<div class="r1-fp-scr" style="--fp-ui:' + ui + ';--fp-ui2:' + U.shade(ui, -0.45) + ';--fp-uil:' + U.shade(ui, 0.82) + '">' + screen + '</div>';
      var cls = 'shot r1-fp r1-fp-' + m + ' r1-fp-f-' + s.font + ' r1-fp-m-' + s.mode;
      if (s.frame === 'screen') return '<div class="' + cls + ' r1-fp-only">' + scr + '</div>';
      var c = FP_BODY[s.color] || FP_BODY.silver;
      var body = '--fp-b:' + c[0] + ';--fp-b2:' + c[1] + ';--fp-bl:' + U.shade(c[0], 0.35) + ';--fp-bd:' + U.shade(c[1], -0.35);
      if (m === 'sidekick') {
        return '<div class="' + cls + '" style="' + body + '"><div class="r1-fp-dev"><div class="r1-fp-skl"><i></i><i></i></div><div class="r1-fp-bez">' + scr + '</div>' +
          '<div class="r1-fp-skr"><span class="r1-fp-pad"><i></i></span><i class="r1-fp-skbtn"></i><i class="r1-fp-skbtn"></i></div></div></div>';
      }
      var keys = '';
      if (m === 'razr') {
        keys = '<div class="r1-fp-kp"><div class="r1-fp-krow"><span class="r1-fp-k sk"></span><span class="r1-fp-nav"><i></i></span><span class="r1-fp-k sk"></span></div>' +
          '<div class="r1-fp-krow"><span class="r1-fp-k r1-kcall">' + svg('0 0 16 16', '<path d="M4 2l2.5 3-1.5 1.5c.8 1.8 2.3 3.3 4 4l1.5-1.5 3 2.5-1.6 2.3C7 13.5 2.5 9 1.7 3.6z"/>') + '</span>' +
          '<span class="r1-fp-k r1-kc">C</span><span class="r1-fp-k r1-kend">' + svg('0 0 16 16', '<path d="M4 2l2.5 3-1.5 1.5c.8 1.8 2.3 3.3 4 4l1.5-1.5 3 2.5-1.6 2.3C7 13.5 2.5 9 1.7 3.6z"/>') + '</span></div>' +
          '<div class="r1-fp-krow num"><span>1<small>&#8734;</small></span><span>2<small>abc</small></span><span>3<small>def</small></span></div></div>';
      } else {
        keys = '<div class="r1-fp-kp"><div class="r1-fp-krow"><span class="r1-fp-k sk"></span><span class="r1-fp-nav"><i></i></span><span class="r1-fp-k sk"></span></div>' +
          '<div class="r1-fp-krow num"><span>1</span><span>2<small>ABC</small></span><span>3<small>DEF</small></span></div></div>';
      }
      return '<div class="' + cls + '" style="' + body + '"><div class="r1-fp-dev"><div class="r1-fp-top">' +
        '<div class="r1-fp-face"><div class="r1-fp-ear">' + (m === 'flip' ? '<i></i><i></i><i></i><i></i><i></i>' : '') + '</div>' +
        '<div class="r1-fp-bez">' + scr + '</div>' + (m === 'razr' ? '<div class="r1-fp-brand">MOTOROLA</div>' : '<div class="r1-fp-brand sm"></div>') + '</div></div>' +
        '<div class="r1-fp-hinge"></div><div class="r1-fp-bot">' + keys + '</div></div></div>';
    }
  });

  /* ============================== ipod ============================== */

  var IP_BODY = { white: ['#f6f6f6', '#ffffff', '#a9a9a9'], black: ['#1d1d1f', '#2c2c2e', '#8e8e8e'], silver: ['#cfd2d6', '#f2f2f2', '#a9a9a9'],
    pink: ['#f290b8', '#ffffff', '#a9a9a9'], blue: ['#5aa9e6', '#ffffff', '#a9a9a9'], green: ['#8fd14f', '#ffffff', '#a9a9a9'], red: ['#d7192e', '#ffffff', '#a9a9a9'],
    purple: ['#9b6bd6', '#ffffff', '#a9a9a9'], yellow: ['#f5d73a', '#ffffff', '#a9a9a9'], orange: ['#f5902e', '#ffffff', '#a9a9a9'] };

  TOOLS.push({
    id: 'ipod',
    label: 'ipod',
    defaults: { style: 'classic', screen: 'color', color: 'white', art: '', song: '', artist: '', album: '', now: '', left: '', track: '', of: '', playing: true, shuffle: false },
    fields: [
      { type: 'row', fields: [
        { key: 'style', type: 'select', label: 'ipod', options: [['classic', 'classic'], ['nano', 'nano']] },
        { key: 'screen', type: 'select', label: 'screen', options: [['color', 'color'], ['gray', 'grayscale']] },
        { key: 'color', type: 'select', label: 'color', options: Object.keys(IP_BODY).map(function (k) { return [k, k]; }) }
      ] },
      { key: 'art', type: 'image', label: 'album art', max: 500 },
      { key: 'song', type: 'text', label: 'song' },
      { type: 'row', fields: [
        { key: 'artist', type: 'text', label: 'artist' },
        { key: 'album', type: 'text', label: 'album' }
      ] },
      { type: 'row', fields: [
        { key: 'now', type: 'text', label: 'time', placeholder: '0:48' },
        { key: 'left', type: 'text', label: 'time left', placeholder: '2:24' }
      ] },
      { type: 'row', fields: [
        { key: 'track', type: 'text', label: 'song #' },
        { key: 'of', type: 'text', label: 'of' },
        { key: 'playing', type: 'toggle', label: 'playing' },
        { key: 'shuffle', type: 'toggle', label: 'shuffle' }
      ] }
    ],
    render: function (s) {
      var gray = s.screen === 'gray', nano = s.style === 'nano';
      var a = secs(s.now), b = secs(s.left);
      var pct = a != null && b != null && a + b > 0 ? a / (a + b) * 100 : 0;
      var c = IP_BODY[s.color] || IP_BODY.white;
      var dk = s.color === 'black';
      var play = s.playing ? '<path d="M1 1l8 5-8 5z"/>' : '<path d="M1 1h3v10H1zM6 1h3v10H6z"/>';
      var shuf = s.shuffle ? '<svg class="r1-ip-shuf" viewBox="0 0 16 12"><path d="M0 2.5h3.5l6 7H13M0 9.5h3.5l1.8-2.1M9.5 2.5H13M7.4 4.6l2.1-2.1" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 0l4 2.5L12 5zM12 7l4 2.5L12 12z"/></svg>' : '';
      var batt = '<svg class="r1-ip-bat" viewBox="0 0 22 11"><rect x=".5" y=".5" width="19" height="10" rx="1.5" fill="' + (gray ? 'none' : '#fff') + '" stroke="currentColor"/><rect x="19.5" y="3" width="2" height="5" fill="currentColor"/>' +
        '<rect x="2" y="2" width="14" height="7" rx=".5" fill="' + (gray ? 'currentColor' : 'url(#r1ipbg)') + '"/>' +
        (gray ? '' : '<defs><linearGradient id="r1ipbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8f28a"/><stop offset=".5" stop-color="#4fbf1a"/><stop offset="1" stop-color="#3a9a10"/></linearGradient></defs>') + '</svg>';
      var count = (s.track || s.of || s.track === GHOST) ? E('track', s.track) + ' of ' + E('of', s.of) : '';
      var title = '<div class="r1-ip-tb"><svg class="r1-ip-play" viewBox="0 0 10 12">' + play + '</svg><span>Now Playing</span>' + shuf + batt + '</div>';
      var times = '<div class="r1-ip-times"><span>' + E('now', s.now) + '</span><span>-' + E('left', s.left) + '</span></div>';
      var bar = '<div class="r1-ip-bar"><i style="width:' + pct.toFixed(1) + '%"></i></div>';
      var body;
      if (gray) {
        body = '<div class="r1-ip-cnt">' + count + '</div><div class="r1-ip-gt"><div class="r1-ip-s">' + E('song', s.song) + '</div><div>' + E('artist', s.artist) + '</div><div>' + E('album', s.album) + '</div></div>' + bar + times;
      } else {
        body = '<div class="r1-ip-np"><div class="r1-ip-artw">' + pic(s.art, 'art', 'r1-ip-art') + '</div>' +
          '<div class="r1-ip-meta"><div class="r1-ip-cnt">' + count + '</div><div class="r1-ip-s">' + E('song', s.song) + '</div><div class="r1-ip-ar">' + E('artist', s.artist) + '</div><div class="r1-ip-al">' + E('album', s.album) + '</div></div></div>' +
          bar + times;
      }
      var wheel = '<div class="r1-ip-wheel"><span class="r1-ip-menu">MENU</span>' +
        '<svg class="r1-ip-wl" viewBox="0 0 20 10"><path d="M0 0h2v10H0zM11 0v10L3 5zM20 0v10l-8-5z"/></svg>' +
        '<svg class="r1-ip-wr" viewBox="0 0 20 10"><path d="M18 0h2v10h-2zM9 0v10l8-5zM0 0v10l8-5z"/></svg>' +
        '<svg class="r1-ip-wp" viewBox="0 0 20 10"><path d="M0 0l8 5-8 5zM11 0h3v10h-3zM16 0h3v10h-3z"/></svg>' +
        '<span class="r1-ip-ctr"></span></div>';
      return '<div class="shot r1-ip' + (nano ? ' r1-ip-nano' : ' r1-ip-cl') + (gray ? ' r1-ip-gray' : '') + (dk ? ' r1-ip-dk' : '') + '" style="--ip-b:' + c[0] + ';--ip-w:' + (dk ? c[1] : '#ffffff') + ';--ip-wt:' + c[2] + '">' +
        '<div class="r1-ip-dev"><div class="r1-ip-glass"><div class="r1-ip-scr">' + title + '<div class="r1-ip-body">' + body + '</div></div></div>' + wheel + '</div></div>';
    }
  });
})();
