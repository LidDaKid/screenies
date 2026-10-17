/* screenies — livejournal post, pictochat, cd jewel case, mixtape cassette */

(function () {
  var esc = U.esc;
  function item(defs) { return function () { return JSON.parse(JSON.stringify(defs)); }; }
  function pic(src, path, cls) { return src ? '<img class="' + cls + '" src="' + src + '"' + DI(path) + ' alt="">' : '<div class="' + cls + ' r2-ph"' + DI(path) + '></div>'; }
  function plain(v) { return String(v == null ? '' : v).replace(/​/g, ''); }

  // handwriting fonts for the tape (a crossorigin link so the png export can embed them)
  (function () {
    if (document.getElementById('r2-fonts')) return;
    var l = document.createElement('link');
    l.id = 'r2-fonts';
    l.rel = 'stylesheet';
    l.crossOrigin = 'anonymous';
    l.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Caveat:wght@500;700&family=Rock+Salt&family=Gochi+Hand&family=Reenie+Beanie&display=swap';
    document.head.appendChild(l);
  })();

  /* ============================== livejournal ============================== */

  // the little ljuser head
  var LJ_USER = '<svg class="r2lj-uh" viewBox="0 0 17 17" width="17" height="17" fill="none"><circle cx="8.5" cy="5.2" r="3.4" fill="#fff" stroke="#1d3d7a" stroke-width="1.1"/>' +
    '<path d="M2.6 15.6c0-4 2.6-6.1 5.9-6.1s5.9 2.1 5.9 6.1z" fill="#fff" stroke="#1d3d7a" stroke-width="1.1"/><path d="M5 12.5h7" stroke="#9db3dc" stroke-width="1"/></svg>';
  // classic yellow mood faces
  var LJ_MOODS = {
    none: '',
    happy: '<path d="M4.6 9.2c.8 1.6 2 2.3 3.4 2.3s2.6-.7 3.4-2.3" stroke="#000" stroke-width="1.1" fill="none"/>',
    excited: '<path d="M4.4 8.8h7.2c-.4 2-1.8 3.1-3.6 3.1S4.8 10.8 4.4 8.8z" fill="#7a0000" stroke="#000" stroke-width=".9"/>',
    sad: '<path d="M4.8 11.8c.8-1.4 1.9-2 3.2-2s2.4.6 3.2 2" stroke="#000" stroke-width="1.1" fill="none"/>',
    crying: '<path d="M4.8 11.8c.8-1.4 1.9-2 3.2-2s2.4.6 3.2 2" stroke="#000" stroke-width="1.1" fill="none"/><path d="M4.9 7.4c-.6 1.2-.9 1.8-.9 2.3a.9.9 0 0 0 1.8 0c0-.5-.3-1.1-.9-2.3z" fill="#3aa0ff"/>',
    angry: '<path d="M3.8 4.6l3 1.5M12.2 4.6l-3 1.5" stroke="#000" stroke-width="1.1"/><path d="M5 11.6h6" stroke="#000" stroke-width="1.2"/>',
    tired: '<path d="M4 6.6h2.6M9.4 6.6H12" stroke="#000" stroke-width="1.1"/><ellipse cx="8" cy="10.8" rx="1.4" ry="1.2" fill="#000"/>',
    love: '<path d="M10.6 1.4c.8-.8 2.2 0 1.8 1.1-.2.7-1.8 1.9-1.8 1.9s-1.6-1.2-1.8-1.9c-.4-1.1 1-1.9 1.8-1.1z" fill="#ff2f6e"/><path d="M4.6 9.2c.8 1.6 2 2.3 3.4 2.3s2.6-.7 3.4-2.3" stroke="#000" stroke-width="1.1" fill="none"/>',
    cheeky: '<path d="M4.6 9.4h6.8" stroke="#000" stroke-width="1.1"/><path d="M8.2 9.6h2.4v1.4a1.2 1.2 0 0 1-2.4 0z" fill="#ff5c7a" stroke="#000" stroke-width=".7"/>',
    confused: '<path d="M4.8 11c1-.9 2-.4 3-.1s2 .6 3.2-.4" stroke="#000" stroke-width="1.1" fill="none"/>',
    blank: '<path d="M5 10.6h6" stroke="#000" stroke-width="1.1"/>',
    sick: '<path d="M4.8 11.4c1-.8 2-.8 3.2-.2s2.2.6 3.2-.2" stroke="#000" stroke-width="1.1" fill="none"/>'
  };
  function ljMood(k) {
    if (!LJ_MOODS[k]) return '';
    var face = k === 'sick' ? '#b7e04a' : k === 'angry' ? '#ff7a3d' : '#ffd400';
    var eyes = '<ellipse cx="5.8" cy="6.4" rx=".9" ry="1.3" fill="#000"/><ellipse cx="10.2" cy="6.4" rx=".9" ry="1.3" fill="#000"/>';
    if (k === 'love') eyes = '<path d="M5.8 7.6s-1.6-1-1.6-2a.8.8 0 0 1 1.6-.3.8.8 0 0 1 1.6.3c0 1-1.6 2-1.6 2zM10.2 7.6s-1.6-1-1.6-2a.8.8 0 0 1 1.6-.3.8.8 0 0 1 1.6.3c0 1-1.6 2-1.6 2z" fill="#e0103c"/>';
    if (k === 'tired') eyes = '';
    return '<svg class="r2lj-mi" viewBox="0 0 16 16" width="15" height="15" fill="none"><circle cx="8" cy="8" r="7.2" fill="' + face + '" stroke="#000" stroke-width="1"/>' +
      '<circle cx="6" cy="4.4" r="2" fill="#fff" opacity=".55"/>' + eyes + LJ_MOODS[k] + '</svg>';
  }
  var LJ_LOCK = '<svg class="r2lj-sec" viewBox="0 0 14 15" width="14" height="15" fill="none"><path d="M3.6 6.6V4.6a3.4 3.4 0 0 1 6.8 0v2" stroke="#7d6a2a" stroke-width="1.6"/><rect x="1.5" y="6.4" width="11" height="7.8" rx="1" fill="#f2c430" stroke="#8a6d0f"/><rect x="6.2" y="8.6" width="1.6" height="3.2" fill="#6b4f00"/></svg>';
  var LJ_KEY = '<svg class="r2lj-sec" viewBox="0 0 16 15" width="16" height="15" fill="none"><circle cx="4.6" cy="7.5" r="3.4" fill="#f2c430" stroke="#8a6d0f"/><circle cx="3.8" cy="7.5" r="1" fill="#fff"/><path d="M7.8 6.6h7v1.8h-1.4v2h-1.6v-2H7.8z" fill="#f2c430" stroke="#8a6d0f" stroke-width=".8"/></svg>';
  var LJ_THEMES = {
    classic: { bg: '#c3cfe2', box: '#ffffff', txt: '#000000', lnk: '#2a4c8c' },
    dark: { bg: '#050305', box: '#130d12', txt: '#d9cfd6', lnk: '#ff5aa8' },
    custom: null
  };
  function ljComment(c, i) {
    var p = 'comments.' + i + '.';
    return '<div class="r2lj-cm' + (c.reply ? ' rep' : '') + '"><div class="r2lj-ch">' + pic(c.pic, p + 'pic', 'r2lj-cpic') +
      '<div class="r2lj-cw"><div class="r2lj-cs">' + E(p + 'subject', c.subject) + '</div>' +
      '<div class="r2lj-cby"><span class="r2lj-user">' + LJ_USER + '<b>' + E(p + 'user', c.user) + '</b></span></div>' +
      '<div class="r2lj-cd">' + E(p + 'date', c.date) + '</div></div></div>' +
      '<div class="r2lj-ct">' + EB(p + 'text', c.text) + '</div>' +
      '<div class="r2lj-ca">(<a>Reply</a>) (<a>Thread</a>) (<a>Link</a>)</div></div>';
  }
  TOOLS.push({
    id: 'livejournal',
    label: 'livejournal',
    defaults: { theme: 'classic', bg: '#2b1b2e', box: '#fff4fa', txt: '#2b1b2e', lnk: '#c2185b', jtitle: '', jsub: '', userpic: '', user: '', date: '', time: '',
      subject: '', body: '', security: 'public', moodIcon: 'none', mood: '', music: '', location: '', tags: '', ncom: '', comments: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'theme', type: 'select', label: 'style', options: [['classic', 'classic'], ['dark', 'dark'], ['custom', 'custom colors']] },
        { key: 'security', type: 'select', label: 'who sees it', options: [['public', 'public'], ['friends', 'friends only'], ['private', 'private']] }
      ] },
      { type: 'row', fields: [
        { key: 'bg', type: 'color', label: 'page' },
        { key: 'box', type: 'color', label: 'box' },
        { key: 'txt', type: 'color', label: 'text' },
        { key: 'lnk', type: 'color', label: 'links' }
      ] },
      { type: 'row', fields: [
        { key: 'jtitle', type: 'text', label: 'journal title' },
        { key: 'jsub', type: 'text', label: 'subtitle' }
      ] },
      { type: 'row', fields: [
        { key: 'userpic', type: 'image', label: 'userpic', max: 200 },
        { key: 'user', type: 'text', label: 'username' }
      ] },
      { type: 'row', fields: [
        { key: 'date', type: 'text', label: 'date', placeholder: 'Oct. 17th, 2006' },
        { key: 'time', type: 'text', label: 'time', placeholder: '11:43 pm' }
      ] },
      { key: 'subject', type: 'text', label: 'subject' },
      { key: 'body', type: 'textarea', label: 'entry', rows: 6 },
      { type: 'row', fields: [
        { key: 'moodIcon', type: 'select', label: 'mood face', options: Object.keys(LJ_MOODS).map(function (k) { return [k, k]; }) },
        { key: 'mood', type: 'text', label: 'mood' }
      ] },
      { key: 'music', type: 'text', label: 'music' },
      { type: 'row', fields: [
        { key: 'location', type: 'text', label: 'location' },
        { key: 'ncom', type: 'text', label: 'comments #' }
      ] },
      { key: 'tags', type: 'text', label: 'tags', placeholder: 'commas between' },
      { type: 'head', label: 'comments' },
      { key: 'comments', type: 'list', adds: [{ label: '+ comment', item: item({ pic: '', user: '', date: '', subject: '', text: '', reply: false }) }], item: [
        { type: 'row', fields: [
          { key: 'pic', type: 'image', label: 'userpic', max: 200 },
          { key: 'user', type: 'text', label: 'username' }
        ] },
        { type: 'row', fields: [
          { key: 'date', type: 'text', label: 'date', placeholder: '2006-10-17 11:52 pm (UTC)' },
          { key: 'reply', type: 'toggle', label: 'reply' }
        ] },
        { key: 'subject', type: 'text', label: 'subject' },
        { key: 'text', type: 'textarea', label: 'comment', rows: 2 }
      ] }
    ],
    render: function (s) {
      var t = LJ_THEMES[s.theme] || { bg: s.bg, box: s.box, txt: s.txt, lnk: s.lnk };
      var dk = U.lum(t.box) < 0.3;
      var vars = '--bg:' + t.bg + ';--box:' + t.box + ';--txt:' + t.txt + ';--lnk:' + t.lnk +
        ';--bd:' + (dk ? U.shade(t.lnk, -0.55) : U.shade(t.lnk, 0.45)) + ';--dt:' + (dk ? U.shade(t.box, 0.06) : U.shade(t.lnk, 0.86)) +
        ';--hd:' + (s.theme === 'dark' ? '#000' : dk ? U.shade(t.lnk, -0.7) : U.shade(t.lnk, -0.1)) + ';--hdt:' + (s.theme === 'dark' ? t.lnk : '#fff');
      var sec = s.security === 'friends' ? LJ_LOCK : s.security === 'private' ? LJ_KEY : '';
      var meta = '';
      if (s.mood || s.moodIcon !== 'none') meta += '<div class="r2lj-mt"><b>current mood:</b> ' + ljMood(s.moodIcon) + E('mood', s.mood) + '</div>';
      if (s.music) meta += '<div class="r2lj-mt"><b>current music:</b> ' + E('music', s.music) + '</div>';
      if (s.location) meta += '<div class="r2lj-mt"><b>current location:</b> ' + E('location', s.location) + '</div>';
      if (s.tags) meta += '<div class="r2lj-mt"><b>Tags:</b> ' + EW('tags', plain(s.tags).split(',').map(function (x) { return x.trim(); }).filter(Boolean)
        .map(function (x) { return '<a>' + esc(x) + '</a>'; }).join(', ')) + '</div>';
      var cl = s.comments || [];
      return '<div class="shot r2lj th-' + s.theme + '" style="' + vars + '">' +
        '<div class="r2lj-head"><div class="r2lj-jt">' + E('jtitle', s.jtitle) + '</div>' + (s.jsub ? '<div class="r2lj-js">' + E('jsub', s.jsub) + '</div>' : '') +
        '<div class="r2lj-nav"><a>Recent Entries</a><span>|</span><a>Archive</a><span>|</span><a>Friends</a><span>|</span><a>User Info</a></div></div>' +
        '<div class="r2lj-page"><div class="r2lj-date">' + E('date', s.date) + '</div>' +
        '<div class="r2lj-entry"><div class="r2lj-left">' + pic(s.userpic, 'userpic', 'r2lj-pic') +
        '<div class="r2lj-un"><span class="r2lj-user">' + LJ_USER + '<b>' + E('user', s.user) + '</b></span></div></div>' +
        '<div class="r2lj-right"><div class="r2lj-subj">' + sec + '<span class="r2lj-tm">' + E('time', s.time) + '</span>' + (s.subject ? ' - <span class="r2lj-st">' + E('subject', s.subject) + '</span>' : '') + '</div>' +
        '<div class="r2lj-body">' + EB('body', s.body) + '</div>' +
        (meta ? '<div class="r2lj-meta">' + meta + '</div>' : '') +
        '<div class="r2lj-foot">(' + (s.ncom ? '<a>' + E('ncom', s.ncom) + ' comments</a> | ' : '') + '<a>Leave a comment</a>)</div></div></div>' +
        (cl.length ? '<div class="r2lj-cms">' + cl.map(ljComment).join('') + '</div>' : '') +
        '</div></div>';
    }
  });

  /* ============================== pictochat ============================== */

  var DSC = [['gray', '#61829a'], ['brown', '#ba4900'], ['red', '#fb0018'], ['pink', '#fb8afb'], ['orange', '#fb9200'], ['yellow', '#f3e300'],
    ['lime', '#aafb00'], ['green', '#00fb00'], ['dark green', '#00a238'], ['sea green', '#49db8a'], ['turquoise', '#30baf3'], ['blue', '#0059f3'],
    ['dark blue', '#000092'], ['purple', '#8a00d3'], ['violet', '#d300eb'], ['magenta', '#fb0092']];
  function dsCol(k) { for (var i = 0; i < DSC.length; i++) if (DSC[i][0] === k) return DSC[i][1]; return DSC[0][1]; }
  var DS_OPTS = DSC.map(function (c) { return [c[0], c[0]]; });
  var PC_W = 228, PC_LINE = 16, PC_LINES = 5;
  var pcCtx = null; // the form's changed/rebuild, so the buttons on the ds work too

  function pcVars(k) {
    var c = dsCol(k);
    return '--c:' + c + ';--t:' + U.shade(c, 0.8) + ';--l:' + U.shade(c, 0.62) + ';--d:' + U.shade(c, -0.55);
  }
  // one message: name tag + text + doodle, on ruled lines in the person's color
  function pcBox(o) {
    return '<div class="r2pc-box" style="' + pcVars(o.color) + ';height:' + (o.lines * PC_LINE * 2) + 'px">' +
      '<img class="r2pc-ink" alt=""' + (o.draw ? ' src="' + o.draw + '"' : ' style="visibility:hidden"') + '>' +
      (o.drawPath ? '<canvas class="r2pc-cv" width="' + PC_W + '" height="' + (o.lines * PC_LINE) + '" data-r2draw="' + o.drawPath + '"></canvas>' : '') +
      '<div class="r2pc-txt"><span class="r2pc-tag">' + E(o.namePath, o.name) + '</span>' + EB(o.textPath, o.text) + '</div></div>';
  }
  function pcLines(text, name, draw, big) {
    if (draw || big) return PC_LINES;
    var t = plain(text), n = plain(name).length;
    var chars = Math.max(1, Math.ceil((t.length + n + 3) / 33)) + (t.match(/\n/g) || []).length;
    return Math.min(PC_LINES, Math.max(1, chars));
  }
  function pcSys(m, i, s) {
    var p = 'msgs.' + i + '.';
    return '<div class="r2pc-sys" style="' + pcVars(m.color) + '"><span class="r2pc-sy">' + (m.kind === 'leave' ? 'Now leaving:' : 'Now entering:') + '</span>' +
      '<span class="r2pc-tag">' + E(p + 'name', m.name) + '</span></div>';
  }
  var PC_IC = {
    up: '<svg viewBox="0 0 16 16" width="24" height="24"><path d="M8 3l6 8H2z"/></svg>',
    down: '<svg viewBox="0 0 16 16" width="24" height="24"><path d="M8 13l6-8H2z"/></svg>',
    pencil: '<svg viewBox="0 0 16 16" width="26" height="26"><path d="M2 14l1-4 8-8 3 3-8 8z" fill="#f6d34a" stroke="#333" stroke-width="1"/><path d="M2 14l1-4 3 3z" fill="#e8c9a0" stroke="#333" stroke-width=".8"/><path d="M2 14l.5-1.8 1.3 1.3z" fill="#333"/><path d="M11 2l3 3 1-1a1 1 0 0 0 0-1.4L13.4 1a1 1 0 0 0-1.4 0z" fill="#f78ca6" stroke="#333" stroke-width=".8"/></svg>',
    eraser: '<svg viewBox="0 0 16 16" width="26" height="26"><path d="M1.5 10.5l7-7 6 6-4 4H5z" fill="#f4f4f4" stroke="#333"/><path d="M1.5 10.5l3.5-3.5 6 6-1 0.5H5z" fill="#ff97b5" stroke="#333"/></svg>',
    thick: '<svg viewBox="0 0 16 16" width="24" height="24"><circle cx="8" cy="8" r="4.6"/></svg>',
    thin: '<svg viewBox="0 0 16 16" width="24" height="24"><circle cx="8" cy="8" r="2"/></svg>',
    smile: '<svg viewBox="0 0 16 16" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6.3"/><path d="M5 9.4c.7 1.2 1.7 1.8 3 1.8s2.3-.6 3-1.8"/><path d="M6 5.8v1.4M10 5.8v1.4" stroke-linecap="round"/></svg>'
  };
  var PC_KEYS = [
    [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['0'], ['-'], ['=']],
    [['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['←', 4]],
    [['CAPS', 3], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], ['↵', 3]],
    [['SHIFT', 4], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [','], ['.'], ['/']],
    [[';'], ['\''], ['SPACE', 16], ['['], [']']]
  ];
  function pcKeyboard() {
    return '<div class="r2pc-kb">' + PC_KEYS.map(function (row) {
      return row.map(function (k) { return '<span class="r2pc-key' + (k[0].length > 1 ? ' sm' : '') + '" style="grid-column:span ' + (k[1] || 2) + '">' + esc(k[0] === 'SPACE' ? 'SPACE' : k[0]) + '</span>'; }).join('');
    }).join('') + '</div>';
  }
  function pcTools() {
    return {
      type: 'custom', build: function (obj, ctx) {
        pcCtx = ctx;
        var box = document.createElement('div');
        box.className = 'f';
        var lab = document.createElement('span');
        lab.textContent = 'drawing';
        box.appendChild(lab);
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
        [['pencil', 'pen', 'pencil'], ['eraser', 'pen', 'eraser'], ['thick', 'size', 'thick'], ['thin', 'size', 'thin'], ['clear', null, null]].forEach(function (b) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'small' + (b[1] && obj[b[1]] === b[2] ? '' : ' ghost');
          btn.textContent = b[0];
          btn.addEventListener('click', function () {
            if (b[1]) obj[b[1]] = b[2];
            else { obj.pad = ''; obj.padText = ''; }
            ctx.rebuild();
          });
          row.appendChild(btn);
        });
        box.appendChild(row);
        return box;
      }
    };
  }

  // drawing straight on the pad / a message (pixels, like the ds)
  function pcMountDraw(shot, s, app) {
    [].forEach.call(shot.querySelectorAll('canvas[data-r2draw]'), function (cv) {
      var path = cv.getAttribute('data-r2draw'), box = cv.parentNode, img = box.querySelector('.r2pc-ink');
      var g = cv.getContext('2d'), last = null, down = false;
      function pt(e) {
        var r = cv.getBoundingClientRect();
        return { x: Math.floor((e.clientX - r.left) / r.width * cv.width), y: Math.floor((e.clientY - r.top) / r.height * cv.height) };
      }
      function dot(x, y) {
        var er = s.pen === 'eraser', n = er ? (s.size === 'thin' ? 3 : 6) : (s.size === 'thin' ? 1 : 2), o = Math.floor(n / 2);
        if (er) g.clearRect(x - o, y - o, n, n); else g.fillRect(x - o, y - o, n, n);
      }
      function line(a, b) {
        var dx = Math.abs(b.x - a.x), dy = Math.abs(b.y - a.y), sx = a.x < b.x ? 1 : -1, sy = a.y < b.y ? 1 : -1, err = dx - dy, x = a.x, y = a.y;
        for (var guard = 0; guard < 2000; guard++) {
          dot(x, y);
          if (x === b.x && y === b.y) break;
          var e2 = 2 * err;
          if (e2 > -dy) { err -= dy; x += sx; }
          if (e2 < dx) { err += dx; y += sy; }
        }
      }
      cv.addEventListener('pointerdown', function (e) {
        if (e.button) return;
        e.preventDefault();
        if (document.activeElement && box.contains(document.activeElement)) document.activeElement.blur();
        g.clearRect(0, 0, cv.width, cv.height);
        if (img.getAttribute('src')) g.drawImage(img, 0, 0, cv.width, cv.height);
        img.style.visibility = 'hidden';
        g.fillStyle = '#101010';
        down = true;
        cv.setPointerCapture(e.pointerId);
        last = pt(e);
        dot(last.x, last.y);
      });
      cv.addEventListener('pointermove', function (e) {
        if (!down) return;
        var p = pt(e);
        line(last, p);
        last = p;
      });
      function end() {
        if (!down) return;
        down = false;
        var px = g.getImageData(0, 0, cv.width, cv.height).data, any = false;
        for (var i = 3; i < px.length; i += 4) if (px[i]) { any = true; break; }
        var url = any ? cv.toDataURL('image/png') : '';
        var parts = path.split('.'), o = s;
        for (var k = 0; k < parts.length - 1; k++) o = o[parts[k]];
        o[parts[parts.length - 1]] = url;
        if (url) {
          img.onload = function () { img.style.visibility = ''; g.clearRect(0, 0, cv.width, cv.height); img.onload = null; };
          img.src = url;
        } else { img.removeAttribute('src'); g.clearRect(0, 0, cv.width, cv.height); }
        app.save();
      }
      cv.addEventListener('pointerup', end);
      cv.addEventListener('pointercancel', end);
    });
    // the ds's own buttons
    function set(k, v) { s[k] = v; if (pcCtx) pcCtx.rebuild(); }
    [].forEach.call(shot.querySelectorAll('[data-r2pc]'), function (b) {
      b.addEventListener('click', function () {
        var a = b.getAttribute('data-r2pc');
        if (a === 'pencil' || a === 'eraser') set('pen', a);
        else if (a === 'thick' || a === 'thin') set('size', a);
        else if (a === 'clear') { s.pad = ''; s.padText = ''; if (pcCtx) pcCtx.rebuild(); }
        else if (a === 'send') {
          if (!plain(s.padText) && !s.pad) return;
          (s.msgs = s.msgs || []).push({ kind: 'msg', name: s.me, color: s.color, text: s.padText, draw: s.pad, big: !!s.pad });
          s.pad = ''; s.padText = '';
          if (pcCtx) pcCtx.rebuild();
        } else if (a === 'copy') {
          var m = (s.msgs || []).filter(function (x) { return x.kind === 'msg'; }).pop();
          if (!m) return;
          s.padText = m.text; s.pad = m.draw || '';
          if (pcCtx) pcCtx.rebuild();
        }
      });
    });
  }

  TOOLS.push({
    id: 'pictochat',
    label: 'pictochat',
    defaults: { shell: 'white', room: 'A', banner: true, me: '', color: 'pink', padText: '', pad: '', pen: 'pencil', size: 'thick', msgs: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'shell', type: 'select', label: 'ds', options: [['white', 'white'], ['black', 'black'], ['pink', 'pink'], ['blue', 'ice blue'], ['red', 'red'], ['none', 'just screens']] },
        { key: 'room', type: 'select', label: 'room', options: [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']] },
        { key: 'banner', type: 'toggle', label: 'room banner' }
      ] },
      { type: 'row', fields: [
        { key: 'me', type: 'text', label: 'your name' },
        { key: 'color', type: 'select', label: 'your color', options: DS_OPTS }
      ] },
      { key: 'padText', type: 'textarea', label: 'writing on the pad', rows: 2 },
      pcTools(),
      { type: 'head', label: 'chat' },
      { key: 'msgs', type: 'list', adds: [
        { label: '+ message', item: function (s) { return { kind: 'msg', name: '', color: 'gray', text: '', draw: '', big: false }; } },
        { label: '+ someone joins', item: item({ kind: 'join', name: '', color: 'gray', text: '', draw: '', big: false }) }
      ], item: [
        { type: 'row', fields: [
          { key: 'kind', type: 'select', label: 'kind', options: [['msg', 'message'], ['join', 'now entering'], ['leave', 'now leaving']] },
          { key: 'color', type: 'select', label: 'color', options: DS_OPTS },
          { key: 'big', type: 'toggle', label: 'full size' }
        ] },
        { key: 'name', type: 'text', label: 'name' },
        { key: 'text', type: 'textarea', label: 'message', rows: 2 }
      ] }
    ],
    render: function (s) {
      var log = (s.banner ? '<div class="r2pc-room"><span class="r2pc-rl">' + esc(s.room) + '</span><span>Now entering<br>Chat Room ' + esc(s.room) + '</span></div>' : '') +
        (s.msgs || []).map(function (m, i) {
          if (m.kind !== 'msg') return pcSys(m, i, s);
          var p = 'msgs.' + i + '.';
          return pcBox({ color: m.color, name: m.name, namePath: p + 'name', text: m.text, textPath: p + 'text', draw: m.draw, drawPath: p + 'draw', lines: pcLines(m.text, m.name, m.draw, m.big) });
        }).join('');
      var top = '<div class="r2pc-scr r2pc-top"><div class="r2pc-side"><span class="r2pc-rb">' + esc(s.room) + '</span><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="r2pc-log">' + log + '</div></div>';
      function tb(a, ic, on) { return '<span class="r2pc-tb' + (on ? ' on' : '') + '" data-r2pc="' + a + '">' + ic + '</span>'; }
      var bot = '<div class="r2pc-scr r2pc-bot"><div class="r2pc-bar">' +
        tb('up', PC_IC.up) + tb('down', PC_IC.down) +
        '<span class="r2pc-gap"></span>' + tb('pencil', PC_IC.pencil, s.pen !== 'eraser') + tb('eraser', PC_IC.eraser, s.pen === 'eraser') +
        tb('thick', PC_IC.thick, s.size !== 'thin') + tb('thin', PC_IC.thin, s.size === 'thin') +
        '<span class="r2pc-gap"></span>' + tb('k1', '<b>A</b>', true) + tb('k2', '<b>&Aacute;</b>') + tb('k3', '<b>&#12354;</b>') + tb('k4', '<b>?!</b>') + tb('k5', PC_IC.smile) + '</div>' +
        '<div class="r2pc-pad">' + pcBox({ color: s.color, name: s.me, namePath: 'me', text: s.padText, textPath: 'padText', draw: s.pad, drawPath: 'pad', lines: PC_LINES }) + '</div>' +
        pcKeyboard() +
        '<div class="r2pc-btns"><span data-r2pc="send">SEND</span><span data-r2pc="copy">COPY</span><span data-r2pc="clear">CLEAR</span></div>' +
        '</div>';
      if (s.shell === 'none') return '<div class="shot r2pc r2pc-bare">' + top + '<div class="r2pc-split"></div>' + bot + '</div>';
      var dots = '';
      for (var d = 0; d < 6; d++) dots += '<i></i>';
      return '<div class="shot r2pc sh-' + s.shell + '"><div class="r2pc-lid">' +
        '<div class="r2pc-spk l">' + dots + '</div><div class="r2pc-bez">' + top + '</div><div class="r2pc-spk r">' + dots + '</div></div>' +
        '<div class="r2pc-hinge"><i></i><i></i></div>' +
        '<div class="r2pc-base"><div class="r2pc-dpad"><i class="h"></i><i class="v"></i><b></b></div>' +
        '<div class="r2pc-bez">' + bot + '</div>' +
        '<div class="r2pc-abxy"><span class="x">X</span><span class="y">Y</span><span class="a">A</span><span class="b">B</span></div>' +
        '<div class="r2pc-ss"><span><i></i>START</span><span><i></i>SELECT</span></div><div class="r2pc-led"><i></i><i></i></div></div></div>';
    },
    mount: pcMountDraw
  });

  /* ============================== cd jewel case ============================== */

  var EAN_L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
  var EAN_G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
  var EAN_P = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];
  function ean(v) {
    var d = plain(v).replace(/\D/g, '');
    if (d.length < 13) {
      var h = 7;
      for (var i = 0; i < plain(v).length; i++) h = (h * 31 + plain(v).charCodeAt(i)) >>> 0;
      while (d.length < 13) { d += String(h % 10); h = Math.floor(h / 10) || (h * 7 + 3); }
    }
    d = d.slice(0, 13);
    var bits = '101';
    for (var k = 1; k <= 6; k++) bits += (EAN_P[+d[0]][k - 1] === 'L' ? EAN_L : EAN_G)[+d[k]];
    bits += '01010';
    for (k = 7; k <= 12; k++) bits += EAN_L[+d[k]].replace(/./g, function (c) { return c === '1' ? '0' : '1'; });
    bits += '101';
    var bars = '', guard = { 0: 1, 1: 1, 2: 1, 45: 1, 46: 1, 47: 1, 48: 1, 49: 1, 92: 1, 93: 1, 94: 1 };
    for (var b = 0; b < bits.length; b++) if (bits[b] === '1') bars += '<rect x="' + (b + 9) + '" y="0" width="1" height="' + (guard[b] ? 56 : 51) + '"/>';
    return '<svg class="r2cd-bars" viewBox="0 0 113 58" fill="#000" preserveAspectRatio="none">' + bars + '</svg>';
  }
  var CD_FONTS = { sans: "'Helvetica Neue', Arial, sans-serif", serif: "Georgia, 'Times New Roman', serif", bold: "'Anton', 'Oswald', Impact, sans-serif", hand: "'Permanent Marker', cursive" };
  function cdSpine(s, side) {
    return '<div class="r2cd-spine ' + side + '" style="background:' + s.spineColor + ';color:' + s.spineText + '"><div class="r2cd-sw">' +
      '<span class="r2cd-sa">' + E('artist', s.artist) + '</span><span class="r2cd-sd"></span><span class="r2cd-sb">' + E('album', s.album) + '</span>' +
      (s.cat ? '<span class="r2cd-sc">' + E('cat', s.cat) + '</span>' : '') + '</div></div>';
  }
  function cdFront(s) {
    var txt = s.showText ? '<div class="r2cd-ov pos-' + s.textPos + '" style="color:' + s.textColor + ';font-family:' + (CD_FONTS[s.font] || CD_FONTS.sans) + '">' +
      '<div class="r2cd-oa">' + E('artist', s.artist) + '</div><div class="r2cd-ob">' + E('album', s.album) + '</div></div>' : '';
    var pa = s.advisory ? '<div class="r2cd-pa"><span class="r2cd-pa1">PARENTAL</span><span class="r2cd-pa2">ADVISORY</span><span class="r2cd-pa3">EXPLICIT CONTENT</span></div>' : '';
    return '<div class="r2cd-case r2cd-front tray-' + s.tray + '"><div class="r2cd-under"></div>' +
      '<div class="r2cd-book">' + pic(s.cover, 'cover', 'r2cd-art') + txt + pa + '<div class="r2cd-gloss"></div></div>' +
      '<div class="r2cd-hinge"><i class="k1"></i><i class="k2"></i></div><div class="r2cd-tab t1"></div><div class="r2cd-tab t2"></div>' +
      '<div class="r2cd-shine"></div><div class="r2cd-edge"></div></div>';
  }
  function cdBack(s) {
    var tr = (s.tracks || []).map(function (t, i) {
      var p = 'tracks.' + i + '.';
      return '<li><span class="r2cd-tn">' + (i + 1) + '.</span><span class="r2cd-tt">' + E(p + 'title', t.title) + '</span><span class="r2cd-td">' + E(p + 'time', t.time) + '</span></li>';
    }).join('');
    var bg = s.backArt ? '<img class="r2cd-bart" src="' + s.backArt + '"' + DI('backArt') + ' alt="">' : '<div class="r2cd-bart"' + DI('backArt') + '></div>';
    return '<div class="r2cd-case r2cd-back tray-' + s.tray + '"><div class="r2cd-ins">' + cdSpine(s, 'l') +
      '<div class="r2cd-bk" style="background:' + s.backColor + ';color:' + s.backText + '">' + bg +
      '<ol class="r2cd-tl">' + tr + '</ol>' +
      '<div class="r2cd-bot">' + (s.label ? '<div class="r2cd-lbl">' + E('label', s.label) + '</div>' : '') +
      '<div class="r2cd-legal">' + EB('legal', s.legal) + '</div>' +
      (s.barcode ? '<div class="r2cd-bc">' + ean(s.code) + '<div class="r2cd-bn">' + E('code', s.code) + '</div></div>' : '') + '</div></div>' +
      cdSpine(s, 'r') + '</div><div class="r2cd-feet"><i></i><i></i></div><div class="r2cd-shine b"></div><div class="r2cd-edge"></div></div>';
  }
  TOOLS.push({
    id: 'cdcase',
    label: 'cd case',
    defaults: { mode: 'front', bg: '#d8d4ce', tray: 'black', cover: '', artist: '', album: '', showText: false, textPos: 'top', font: 'sans', textColor: '#ffffff', advisory: false,
      backArt: '', backColor: '#ffffff', backText: '#111111', spineColor: '#ffffff', spineText: '#111111', cat: '', tracks: [], label: '', legal: '', barcode: true, code: '' },
    fields: [
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'show', options: [['front', 'front'], ['back', 'back'], ['both', 'both']] },
        { key: 'tray', type: 'select', label: 'tray', options: [['black', 'black'], ['clear', 'clear']] },
        { key: 'bg', type: 'color', label: 'background' }
      ] },
      { key: 'cover', type: 'image', label: 'cover art', max: 1200 },
      { type: 'row', fields: [
        { key: 'artist', type: 'text', label: 'artist' },
        { key: 'album', type: 'text', label: 'album' }
      ] },
      { type: 'row', fields: [
        { key: 'showText', type: 'toggle', label: 'text on cover' },
        { key: 'advisory', type: 'toggle', label: 'parental advisory' }
      ] },
      { type: 'row', fields: [
        { key: 'textPos', type: 'select', label: 'text spot', options: [['top', 'top'], ['bottom', 'bottom'], ['center', 'middle']] },
        { key: 'font', type: 'select', label: 'font', options: [['sans', 'clean'], ['serif', 'serif'], ['bold', 'bold'], ['hand', 'marker']] },
        { key: 'textColor', type: 'color', label: 'text color', swatches: function () { return ['#ffffff', '#000000', '#ff3d9a', '#e10600']; } }
      ] },
      { type: 'head', label: 'back' },
      { key: 'backArt', type: 'image', label: 'back art', max: 1200 },
      { type: 'row', fields: [
        { key: 'backColor', type: 'color', label: 'back color' },
        { key: 'backText', type: 'color', label: 'back text' },
        { key: 'spineColor', type: 'color', label: 'spine color' },
        { key: 'spineText', type: 'color', label: 'spine text' }
      ] },
      { key: 'tracks', type: 'list', adds: [{ label: '+ track', item: item({ title: '', time: '' }) }], item: [
        { type: 'row', fields: [
          { key: 'title', type: 'text', label: 'song' },
          { key: 'time', type: 'text', label: 'length', placeholder: '3:41' }
        ] }
      ] },
      { type: 'row', fields: [
        { key: 'cat', type: 'text', label: 'catalog #', placeholder: 'DGC-24425' },
        { key: 'label', type: 'text', label: 'record label' }
      ] },
      { key: 'legal', type: 'textarea', label: 'small print', rows: 2 },
      { type: 'row', fields: [
        { key: 'barcode', type: 'toggle', label: 'barcode' },
        { key: 'code', type: 'text', label: 'barcode number' }
      ] }
    ],
    render: function (s) {
      var m = s.mode;
      return '<div class="shot r2cd" style="background:' + s.bg + '">' + (m !== 'back' ? cdFront(s) : '') + (m !== 'front' ? cdBack(s) : '') + '</div>';
    }
  });

  /* ============================== mixtape cassette ============================== */

  var CS_FONTS = { marker: "'Permanent Marker'", pen: "'Caveat'", messy: "'Rock Salt'", neat: "'Gochi Hand'", thin: "'Reenie Beanie'" };
  var CS_SIZE = { marker: 1, pen: 1.3, messy: 0.82, neat: 1.12, thin: 1.45 };
  function csShell(s) {
    var c = s.shell === 'clear' ? 'rgba(226,232,238,.42)' : s.shell === 'smoke' ? 'rgba(38,36,42,.86)' : s.shellColor;
    var dark = s.shell === 'smoke' || (s.shell === 'color' && U.lum(s.shellColor) < 0.18);
    var line = s.shell === 'clear' ? 'rgba(120,130,140,.55)' : dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.22)';
    var see = s.shell === 'clear' || s.shell === 'smoke';
    var hole = see ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.55)';
    // reels: left full, right nearly empty (rewound to side A)
    var reels = see ? '<circle cx="172" cy="170" r="96" fill="#3a2418" opacity="' + (s.shell === 'smoke' ? 0.5 : 0.85) + '"/><circle cx="428" cy="170" r="62" fill="#3a2418" opacity="' + (s.shell === 'smoke' ? 0.5 : 0.85) + '"/>' : '';
    function screw(x, y) {
      return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + (dark ? '#9a9aa2' : '#c9cbd0') + '" stroke="rgba(0,0,0,.35)"/><path d="M' + (x - 5) + ' ' + y + 'h10M' + x + ' ' + (y - 5) + 'v10" stroke="rgba(0,0,0,.5)" stroke-width="2"/>';
    }
    return '<svg class="r2cs-svg" viewBox="0 0 600 384" width="600" height="384" fill="none">' +
      '<defs><linearGradient id="r2csg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>' +
      '<rect x="1" y="1" width="598" height="382" rx="18" fill="' + c + '" stroke="' + line + '" stroke-width="2"/>' +
      reels +
      '<rect x="12" y="12" width="576" height="360" rx="11" stroke="' + line + '" stroke-width="1.5"/>' +
      '<path d="M120 384 140 292h320l20 92" fill="' + (see ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)') + '" stroke="' + line + '" stroke-width="2"/>' +
      '<circle cx="182" cy="348" r="12" fill="' + hole + '"/><circle cx="418" cy="348" r="12" fill="' + hole + '"/>' +
      '<rect x="226" y="338" width="20" height="20" rx="2" fill="' + hole + '"/><rect x="354" y="338" width="20" height="20" rx="2" fill="' + hole + '"/>' +
      '<rect x="276" y="350" width="48" height="22" rx="3" fill="' + hole + '"/>' +
      '<path d="M150 384v-8M168 384v-8M432 384v-8M450 384v-8" stroke="' + line + '" stroke-width="3"/>' +
      screw(30, 30) + screw(570, 30) + screw(30, 354) + screw(570, 354) + screw(300, 318) +
      '<rect x="1" y="1" width="598" height="382" rx="18" fill="url(#r2csg)"/></svg>';
  }
  function csHub(x) {
    var teeth = '';
    for (var i = 0; i < 6; i++) {
      teeth += '<rect x="-3" y="-21" width="6" height="8" rx="1" fill="#f4f4f4" transform="rotate(' + (i * 60) + ')"/>';
    }
    return '<g transform="translate(' + x + ',170)"><circle r="27" fill="#fbfbfb" stroke="#bbb" stroke-width="1.5"/><circle r="21" fill="#2b2b2b"/>' + teeth + '</g>';
  }
  function csTape(s) {
    var font = (CS_FONTS[s.font] || CS_FONTS.marker) + ', cursive', k = CS_SIZE[s.font] || 1;
    var stripe = s.labelStyle === 'stripes' ? '<div class="r2cs-stripe"><i style="background:#e8452c"></i><i style="background:#f39a1e"></i><i style="background:#f4cf2a"></i><i style="background:#3e9f6a"></i></div>' : '';
    var win = '<svg class="r2cs-win" viewBox="0 0 600 384" width="600" height="384"><defs><clipPath id="r2cswc"><rect x="118" y="128" width="364" height="84" rx="42"/></clipPath></defs>' +
      '<rect x="118" y="128" width="364" height="84" rx="42" fill="#0e0d10"/>' +
      '<g clip-path="url(#r2cswc)"><circle cx="172" cy="170" r="118" fill="#3c2519"/><circle cx="172" cy="170" r="118" fill="url(#r2csrg)"/><circle cx="428" cy="170" r="62" fill="#3c2519"/>' +
      '<rect x="248" y="140" width="104" height="60" rx="4" fill="rgba(210,220,230,.18)" stroke="rgba(255,255,255,.25)"/>' +
      '<path d="M262 140v8M276 140v5M290 140v8M304 140v5M318 140v8M332 140v5" stroke="rgba(255,255,255,.4)"/></g>' +
      '<defs><radialGradient id="r2csrg"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>' +
      csHub(172) + csHub(428) + '<rect x="118" y="128" width="364" height="84" rx="42" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="3"/></svg>';
    return '<div class="r2cs-tape">' + csShell(s) +
      '<div class="r2cs-label' + (U.lum(s.labelColor) < 0.2 ? ' dk' : '') + '" style="background:' + s.labelColor + '">' + stripe +
      '<div class="r2cs-lines"><i></i><i></i></div>' +
      '<div class="r2cs-side">' + esc(s.side) + '</div><div class="r2cs-len">C' + esc(s.length) + '</div>' +
      '<div class="r2cs-hand" style="font-family:' + font + ';color:' + s.ink + ';font-size:' + Math.round(34 * k * Math.min(1, 22 / Math.max(1, plain(s.title).length))) + 'px">' + E('title', s.title) + '</div>' +
      '<div class="r2cs-hand2" style="font-family:' + font + ';color:' + s.ink + ';font-size:' + Math.round(22 * k) + 'px">' + E('sub', s.sub) + '</div>' +
      '<div class="r2cs-print"><span>NORMAL POSITION</span><span>TYPE I</span></div></div>' + win + '</div>';
  }
  function csJcard(s) {
    var font = (CS_FONTS[s.font] || CS_FONTS.marker) + ', cursive', k = CS_SIZE[s.font] || 1;
    var hs = 'font-family:' + font + ';color:' + s.ink;
    function side(key, letter) {
      var arr = s[key] || [], rows = '', n = Math.max(7, arr.length);
      for (var i = 0; i < n; i++) {
        rows += '<li>' + (arr[i] ? '<span class="r2cs-jt" style="' + hs + ';font-size:' + Math.round(19 * k * Math.min(1, 26 / Math.max(1, plain(arr[i].title).length))) + 'px">' + E(key + '.' + i + '.title', arr[i].title) + '</span>' : '') + '</li>';
      }
      return '<div class="r2cs-js"><div class="r2cs-jh"><b>' + letter + '</b><span>SIDE</span></div><ol>' + rows + '</ol></div>';
    }
    return '<div class="r2cs-jcard" style="background:' + s.cardColor + '">' +
      '<div class="r2cs-flap"><div class="r2cs-fl">DATE</div><div class="r2cs-fh" style="' + hs + ';font-size:' + Math.round(20 * k) + 'px">' + E('sub', s.sub) + '</div>' +
      '<div class="r2cs-fl n">NR</div><div class="r2cs-nr"><span>ON</span><span>OFF</span></div></div>' +
      '<div class="r2cs-spine"><div class="r2cs-sp" style="' + hs + ';font-size:' + Math.round(26 * k) + 'px">' + E('title', s.title) + '</div></div>' +
      '<div class="r2cs-front">' + side('tracksA', 'A') + side('tracksB', 'B') + '</div></div>';
  }
  TOOLS.push({
    id: 'cassette',
    label: 'mixtape',
    defaults: { mode: 'tape', bg: '#e9e3d8', shell: 'clear', shellColor: '#ff6fb1', labelColor: '#f7f2e4', labelStyle: 'lines', cardColor: '#fbfaf5', ink: '#1b1b1b',
      font: 'marker', side: 'A', length: '90', title: '', sub: '', tracksA: [], tracksB: [] },
    fields: [
      { type: 'row', fields: [
        { key: 'mode', type: 'select', label: 'show', options: [['tape', 'tape'], ['jcard', 'j-card'], ['both', 'both']] },
        { key: 'bg', type: 'color', label: 'background' }
      ] },
      { type: 'row', fields: [
        { key: 'shell', type: 'select', label: 'shell', options: [['clear', 'clear'], ['smoke', 'smoke'], ['color', 'color']] },
        { key: 'shellColor', type: 'color', label: 'shell color', swatches: function () { return ['#111111', '#f4f4f0', '#ff6fb1', '#e2263a', '#2f6fe0', '#f5d83a', '#8e5bd6', '#43b97f']; } }
      ] },
      { type: 'row', fields: [
        { key: 'labelColor', type: 'color', label: 'label', swatches: function () { return ['#f7f2e4', '#ffffff', '#ffd1e3', '#fff3a8', '#cfe6ff', '#1a1a1a']; } },
        { key: 'labelStyle', type: 'select', label: 'label look', options: [['lines', 'lines'], ['stripes', 'retro stripes']] },
        { key: 'cardColor', type: 'color', label: 'j-card', swatches: function () { return ['#fbfaf5', '#ffd1e3', '#fff3a8', '#cfe6ff', '#d9f2d0']; } }
      ] },
      { type: 'row', fields: [
        { key: 'font', type: 'select', label: 'handwriting', options: [['marker', 'marker'], ['pen', 'pen'], ['messy', 'messy'], ['neat', 'neat'], ['thin', 'thin']] },
        { key: 'ink', type: 'color', label: 'ink', swatches: function () { return ['#1b1b1b', '#1f3fa8', '#d1182b', '#e0338a', '#6a2bb3', '#ffffff']; } }
      ] },
      { type: 'row', fields: [
        { key: 'side', type: 'select', label: 'side', options: [['A', 'A'], ['B', 'B']] },
        { key: 'length', type: 'select', label: 'length', options: [['46', 'C46'], ['60', 'C60'], ['90', 'C90'], ['120', 'C120']] }
      ] },
      { key: 'title', type: 'text', label: 'title' },
      { key: 'sub', type: 'text', label: 'date / for', placeholder: 'for ariel 10.17.06' },
      { type: 'head', label: 'side A' },
      { key: 'tracksA', type: 'list', adds: [{ label: '+ song', item: item({ title: '' }) }], item: [{ key: 'title', type: 'text', label: 'song' }] },
      { type: 'head', label: 'side B' },
      { key: 'tracksB', type: 'list', adds: [{ label: '+ song', item: item({ title: '' }) }], item: [{ key: 'title', type: 'text', label: 'song' }] }
    ],
    render: function (s) {
      return '<div class="shot r2cs" style="background:' + s.bg + '">' + (s.mode !== 'jcard' ? csTape(s) : '') + (s.mode !== 'tape' ? csJcard(s) : '') + '</div>';
    }
  });
})();
