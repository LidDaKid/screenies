/* screenies — sprites + fonts loaded from the games on your computer (kept in this browser only),
   and drawing text with a game's real letters. */

var GA = (function () {
  var data = {}; // { stardew: { chars: {name: [{url,w,h}]}, fonts: {...} }, undertale: ..., deltarune: ... }
  var listeners = [];
  var dbp = null;

  function db() {
    if (!dbp) {
      dbp = new Promise(function (ok, bad) {
        var r = indexedDB.open('screenies-games', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('games'); };
        r.onsuccess = function () { ok(r.result); };
        r.onerror = function () { bad(r.error); };
      });
    }
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (ok, bad) {
        var t = d.transaction('games', mode), req = fn(t.objectStore('games'));
        t.oncomplete = function () { ok(req && req.result); };
        t.onerror = function () { bad(t.error); };
      });
    });
  }

  function changed() { listeners.forEach(function (f) { f(); }); }

  // bring back whatever was loaded before
  var ready = tx('readonly', function (os) { return os.getAll(); }).then(function (all) {
    return tx('readonly', function (os) { return os.getAllKeys(); }).then(function (keys) {
      keys.forEach(function (k, i) { data[k] = all[i]; });
      changed();
    });
  }).catch(function () {});

  function put(game, v) {
    data[game] = v;
    changed();
    return tx('readwrite', function (os) { return os.put(v, game); }).catch(function () {});
  }

  // pick the game's folder -> read what we need out of it
  var FACE = {
    undertale: function (n) { return /^spr_face/.test(n); },
    deltarune: function (n) { return /^spr_face/.test(n) || /^spr_(susie|ralsei|lancer|noelle|kris|berdly|queen|rouxls|toriel|sans|alphys|undyne|asgore)_?face/i.test(n); }
  };
  // font name -> how much to blow it up (undertale draws at 2x, deltarune's big font is already screen size)
  var FONTS = {
    undertale: { fnt_maintext: 2, fnt_comicsans: 2, fnt_papyrus: 2 },
    deltarune: { fnt_mainbig: 1, fnt_main: 2, fnt_comicsans: 2, fnt_papyrus: 2 }
  };

  function load(game, files) {
    files = [].slice.call(files);
    if (game === 'stardew') {
      return GameFiles.readStardew(files).then(function (r) {
        if (!Object.keys(r.chars).length) throw new Error("couldn't find stardew's Portraits folder in there");
        return put(game, r);
      });
    }
    var wins = files.filter(function (f) { return /(^|[\\/])data\.win$/i.test(f.webkitRelativePath || f.name) || /^data\.win$/i.test(f.name); });
    if (!wins.length) return Promise.reject(new Error("couldn't find data.win in there"));
    // deltarune has one data.win per chapter; read them all and merge
    return wins.reduce(function (p, f) {
      return p.then(function (acc) {
        return GameFiles.readGameMaker(f, FACE[game], FONTS[game]).then(function (r) {
          Object.keys(r.chars).forEach(function (k) { if (!acc.chars[k]) acc.chars[k] = r.chars[k]; });
          Object.keys(r.fonts).forEach(function (k) { if (!acc.fonts[k]) acc.fonts[k] = r.fonts[k]; });
          return acc;
        });
      });
    }, Promise.resolve({ chars: {}, fonts: {} })).then(function (r) {
      if (!Object.keys(r.chars).length) throw new Error('no faces found in that data.win');
      return put(game, r);
    });
  }

  function forget(game) {
    delete data[game];
    changed();
    return tx('readwrite', function (os) { return os.delete(game); }).catch(function () {});
  }

  /* text in a game's own letters. white letters get tinted with color (css mask), shadow = [color, dx, dy]. */
  function text(font, str, color, opts) {
    opts = opts || {};
    var g = font.glyphs, lh = opts.lineH || font.lineH;
    function glyph(ch) {
      var d = g[ch.charCodeAt(0)] || g[63]; // unknown -> '?'
      if (!d) return '';
      if (!d.u) return '<i class="gl" style="width:' + d.adv + 'px;height:' + lh + 'px"></i>';
      var m = 'url(' + d.u + ')';
      return '<i class="gl" style="width:' + d.adv + 'px;height:' + lh + 'px"><b style="left:' + d.ox + 'px;top:' + d.oy + 'px;width:' + d.w +
        'px;height:' + d.h + 'px;background:' + color + ';-webkit-mask-image:' + m + ';mask-image:' + m + '"></b></i>';
    }
    return String(str || '').split('\n').map(function (line) {
      // words stay together so lines wrap between words
      return '<span class="gl-line" style="min-height:' + lh + 'px">' + line.split(/( +)/).map(function (w) {
        if (!w) return '';
        var html = w.split('').map(glyph).join('');
        return /^ +$/.test(w) ? html : '<span class="gl-word">' + html + '</span>';
      }).join('') + '</span>';
    }).join('');
  }

  return {
    get: function (game) { return data[game]; },
    load: load,
    forget: forget,
    text: text,
    ready: ready,
    onChange: function (f) { listeners.push(f); }
  };
})();
