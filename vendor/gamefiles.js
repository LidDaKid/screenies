/* screenies — reads sprites + fonts out of the games on YOUR computer (nothing from the games is hosted on the site).
   GameMaker data.win (undertale / deltarune): face sprites + dialogue fonts.
   Stardew is read with xnb.js (portraits + the dialogue font). */

var GameFiles = (function () {
  function GMReader(buf) {
    var dv = new DataView(buf), u8 = new Uint8Array(buf);
    if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== 'FORM') throw new Error('not a GameMaker data.win');
    var chunks = {}, p = 8, end = 8 + dv.getUint32(4, true);
    while (p < end) {
      var name = String.fromCharCode(u8[p], u8[p + 1], u8[p + 2], u8[p + 3]), len = dv.getUint32(p + 4, true);
      chunks[name] = { start: p + 8, len: len };
      p += 8 + len;
    }
    function u32(o) { return dv.getUint32(o, true); }
    function i32(o) { return dv.getInt32(o, true); }
    function u16(o) { return dv.getUint16(o, true); }
    function i16(o) { return dv.getInt16(o, true); }
    function str(ptr) { // pointer goes to the characters; length sits just before
      if (!ptr) return '';
      var n = u32(ptr - 4), s = '';
      for (var i = 0; i < n && i < 400; i++) s += String.fromCharCode(u8[ptr + i]);
      return s;
    }
    function list(chunk) {
      var c = chunks[chunk];
      if (!c) return [];
      var n = u32(c.start), out = [];
      for (var i = 0; i < n; i++) out.push(u32(c.start + 4 + i * 4));
      return out;
    }

    // texture pages: embedded PNGs (find each one's length by walking its chunks)
    var pages = list('TXTR').map(function (ptr) {
      // GMS1: [scaled, pngOffset]; GMS2: [scaled, generatedMips, pngOffset] (+ more in newer); take the first field that points at a PNG
      for (var k = 1; k <= 4; k++) {
        var off = u32(ptr + k * 4);
        if (off > 0 && off + 8 < u8.length && u8[off] === 0x89 && u8[off + 1] === 0x50 && u8[off + 2] === 0x4e && u8[off + 3] === 0x47) return { off: off };
      }
      return { off: 0 };
    });
    pages.forEach(function (pg) {
      if (!pg.off) return;
      var q = pg.off + 8;
      while (q < u8.length) {
        var l = (u8[q] << 24 | u8[q + 1] << 16 | u8[q + 2] << 8 | u8[q + 3]) >>> 0;
        var t = String.fromCharCode(u8[q + 4], u8[q + 5], u8[q + 6], u8[q + 7]);
        q += 12 + l;
        if (t === 'IEND') break;
      }
      pg.len = q - pg.off;
    });

    function tpag(ptr) {
      return { sx: u16(ptr), sy: u16(ptr + 2), sw: u16(ptr + 4), sh: u16(ptr + 6), tx: u16(ptr + 8), ty: u16(ptr + 10),
        tw: u16(ptr + 12), th: u16(ptr + 14), bw: u16(ptr + 16), bh: u16(ptr + 18), page: u16(ptr + 20) };
    }

    function sprites(filter) {
      var out = [];
      list('SPRT').forEach(function (ptr) {
        var name = str(u32(ptr));
        if (filter && !filter(name)) return;
        var w = u32(ptr + 4), h = u32(ptr + 8);
        var q = ptr + 56; // after name,w,h,margins(4),transparent,smooth,preload,bboxMode,sepMasks,originX,originY
        if (i32(q) === -1) { // GMS2 sprite: -1, version, type, [playback speed...]
          var ver = u32(q + 4);
          q += 12;
          if (ver >= 2) q += 8; // playback speed + type
          if (ver >= 3) q += 4; // sequence offset
        }
        var n = u32(q), frames = [];
        if (n > 0 && n < 400) for (var i = 0; i < n; i++) frames.push(tpag(u32(q + 4 + i * 4)));
        out.push({ name: name, w: w, h: h, frames: frames });
      });
      return out;
    }

    function fonts(filter) {
      var out = [];
      list('FONT').forEach(function (ptr) {
        var name = str(u32(ptr));
        if (filter && !filter(name)) return;
        var size = u32(ptr + 8);
        var q = ptr + 28;
        var tp = tpag(u32(q));
        q += 12; // tpag ptr, scaleX, scaleY
        // newer GameMaker adds ascenderOffset (+ascender, sdf spread, line height...) before the glyph list
        var glyphs = null;
        for (var extra = 0; extra <= 24 && !glyphs; extra += 4) {
          var n = u32(q + extra);
          if (n < 1 || n > 2000) continue;
          var first = u32(q + extra + 4);
          if (first > ptr && first < u8.length && u16(first) < 0x3000) {
            glyphs = [];
            for (var i = 0; i < n; i++) {
              var g = u32(q + extra + 4 + i * 4);
              glyphs.push({ c: u16(g), x: u16(g + 2), y: u16(g + 4), w: u16(g + 6), h: u16(g + 8), shift: i16(g + 10), off: i16(g + 12) });
            }
          }
        }
        out.push({ name: name, size: size, tpag: tp, glyphs: glyphs || [] });
      });
      return out;
    }

    function pagePng(i) {
      var pg = pages[i];
      return pg && pg.off ? new Blob([u8.subarray(pg.off, pg.off + pg.len)], { type: 'image/png' }) : null;
    }

    return { sprites: sprites, fonts: fonts, pagePng: pagePng, pageCount: pages.length };
  }

  function loadUrl(url) {
    return new Promise(function (ok, bad) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = bad; im.src = url; });
  }
  function loadImg(blob) {
    return new Promise(function (ok, bad) {
      var url = URL.createObjectURL(blob), im = new Image();
      im.onload = function () { ok(im); };
      im.onerror = bad;
      im.src = url;
    });
  }

  // every letter as its own small (pre-scaled, crisp) png, plus where it sits and how far to move after it
  function sliceGlyphs(img, list, scale) {
    var out = {};
    list.forEach(function (g) {
      if (!g.w || !g.h) { out[g.c] = { u: '', w: 0, h: 0, adv: g.adv * scale, ox: 0, oy: 0 }; return; }
      var c = document.createElement('canvas');
      c.width = g.w * scale;
      c.height = g.h * scale;
      var x = c.getContext('2d');
      x.imageSmoothingEnabled = false;
      x.drawImage(img, g.x, g.y, g.w, g.h, 0, 0, g.w * scale, g.h * scale);
      out[g.c] = { u: c.toDataURL('image/png'), w: g.w * scale, h: g.h * scale, adv: g.adv * scale, ox: g.ox * scale, oy: g.oy * scale };
    });
    return out;
  }

  // cut frames out of the texture pages into small png data urls
  function cutter(gm) {
    var cache = {};
    function page(i) { return cache[i] || (cache[i] = loadImg(gm.pagePng(i))); }
    return function (fr, fullW, fullH) {
      return page(fr.page).then(function (im) {
        var c = document.createElement('canvas');
        c.width = fullW || fr.bw || fr.sw;
        c.height = fullH || fr.bh || fr.sh;
        c.getContext('2d').drawImage(im, fr.sx, fr.sy, fr.sw, fr.sh, fr.tx, fr.ty, fr.sw, fr.sh);
        return c.toDataURL('image/png');
      });
    };
  }

  /* undertale / deltarune: every face sprite + the dialogue fonts */
  function readGameMaker(file, isFace, fontNames) {
    return file.arrayBuffer().then(function (buf) {
      var gm = GMReader(buf), cut = cutter(gm);
      var faces = gm.sprites(isFace).filter(function (s) { return s.frames.length; });
      var jobs = [];
      var chars = {};
      faces.forEach(function (s) {
        var who = s.name.replace(/^spr_face_?/, '').replace(/^spr_/, '');
        s.frames.forEach(function (fr, i) {
          jobs.push(cut(fr, s.w, s.h).then(function (url) {
            (chars[who] = chars[who] || []).push({ i: i, url: url, w: s.w, h: s.h });
          }));
        });
      });
      var fonts = {};
      gm.fonts(function (n) { return n in fontNames; }).forEach(function (f) {
        var t = f.tpag;
        jobs.push(cut({ sx: t.sx, sy: t.sy, sw: t.sw, sh: t.sh, tx: 0, ty: 0, page: t.page }, t.sw, t.sh).then(loadUrl).then(function (im) {
          var list = f.glyphs.map(function (g) { return { c: g.c, x: g.x, y: g.y, w: g.w, h: g.h, adv: g.shift, ox: g.off, oy: 0 }; });
          var lineH = Math.max.apply(null, f.glyphs.map(function (g) { return g.h; }).concat([1]));
          var k = fontNames[f.name];
          fonts[f.name] = { glyphs: sliceGlyphs(im, list, k), lineH: lineH * k };
        }));
      });
      return Promise.all(jobs).then(function () {
        Object.keys(chars).forEach(function (k) { chars[k].sort(function (a, b) { return a.i - b.i; }); });
        return { chars: chars, fonts: fonts };
      });
    });
  }

  /* stardew: Content/Portraits/*.xnb -> 64x64 expressions; Content/Fonts/SpriteFont1.xnb -> the dialogue font */
  function readStardew(files) {
    // xnb reader (LGPL, vendor/xnb.module.js) only loads when someone actually imports stardew
    return import(new URL('xnb.module.js', SELF || location.href.replace(/[^/]*$/, 'vendor/')).href)
      .then(function (X) { return readStardewWith(X, files); });
  }
  var SELF = document.currentScript && document.currentScript.src;

  function readStardewWith(X, files) {
    // portraits = xnb files inside a Portraits folder (or loose xnb files if picked one by one), minus translated copies
    var portraits = files.filter(function (f) {
      var path = f.webkitRelativePath || '';
      if (!/\.xnb$/i.test(f.name) || /\.[a-z]{2}-[A-Z]{2}\.xnb$/.test(f.name) || /^(SpriteFont1|Cursors)[.]/i.test(f.name)) return false;
      return path ? /(^|[\\/])Portraits[\\/][^\\/]+$/i.test(path) : true;
    });
    var fontFile = files.filter(function (f) { return /(^|[\\/])SpriteFont1\.xnb$/i.test(f.webkitRelativePath || f.name); })[0];
    var chars = {}, fonts = {};
    function unpack(f) {
      return f.arrayBuffer().then(function (ab) {
        var data = X.bufferToXnb(ab);
        return X.xnbDataToFiles(data, { fileName: 'x' });
      });
    }
    var jobs = portraits.map(function (f) {
      var who = f.name.replace(/\.xnb$/i, '');
      return unpack(f).then(function (blobs) {
        var png = blobs.filter(function (b) { return b.extension === 'png'; })[0];
        return png && loadImg(png.data).then(function (im) {
          var list = [];
          for (var y = 0; y + 64 <= im.height; y += 64) {
            for (var x = 0; x + 64 <= im.width; x += 64) {
              var c = document.createElement('canvas');
              c.width = c.height = 64;
              var g = c.getContext('2d');
              g.drawImage(im, x, y, 64, 64, 0, 0, 64, 64);
              var px = g.getImageData(0, 0, 64, 64).data, any = false;
              for (var k = 3; k < px.length; k += 4) if (px[k]) { any = true; break; }
              if (any) list.push({ i: list.length, url: c.toDataURL('image/png'), w: 64, h: 64 });
            }
          }
          if (list.length) chars[who] = list;
        });
      }).catch(function () { /* skip odd files */ });
    });
    if (fontFile) {
      jobs.push(unpack(fontFile).then(function (blobs) {
        var png = blobs.filter(function (b) { return b.extension === 'png'; })[0];
        var json = blobs.filter(function (b) { return b.extension === 'json'; })[0];
        return Promise.all([png && loadImg(png.data), json && json.data.text()]).then(function (r) {
          if (!r[0] || !r[1]) return;
          var info = JSON.parse(r[1]).content;
          var glyphs = info.glyphs, crop = info.cropping, cmap = info.characterMap, kern = info.kerning;
          var list = cmap.map(function (ch, i) {
            var gl = glyphs[i], cr = crop[i], ke = kern[i];
            return { c: ch.charCodeAt(0), x: gl.x, y: gl.y, w: gl.width, h: gl.height,
              adv: ke.x + ke.y + ke.z + (info.horizontalSpacing || 0), ox: ke.x + cr.x + (info.horizontalSpacing || 0), oy: cr.y };
          });
          fonts.SpriteFont1 = { glyphs: sliceGlyphs(r[0], list, 1), lineH: info.verticalLineSpacing };
        });
      }).catch(function () {}));
    }
    // the dialogue box itself: stardew draws it from these spots on LooseSprites/Cursors (all at 4x)
    var ui = null;
    var cursorsFile = files.filter(function (f) { return /(^|[\/])Cursors\.xnb$/i.test(f.webkitRelativePath || f.name); })[0];
    var PIECES = {
      bg: [306, 320, 16, 16], top: [275, 313, 1, 6], bottom: [275, 328, 1, 8], left: [264, 325, 8, 1], right: [293, 324, 7, 1],
      tl: [261, 311, 14, 13], tr: [291, 311, 12, 11], br: [291, 326, 12, 12], bl: [261, 327, 14, 11],
      div: [278, 324, 9, 1], divTop: [278, 313, 10, 7], divBottom: [278, 328, 10, 8], planks: [583, 411, 115, 97]
    };
    if (cursorsFile) {
      jobs.push(unpack(cursorsFile).then(function (blobs) {
        var png = blobs.filter(function (b) { return b.extension === 'png'; })[0];
        return png && loadImg(png.data).then(function (im) {
          ui = {};
          Object.keys(PIECES).forEach(function (k) {
            var r = PIECES[k], c = document.createElement('canvas');
            c.width = r[2] * 4;
            c.height = r[3] * 4;
            var g = c.getContext('2d');
            g.imageSmoothingEnabled = false;
            g.drawImage(im, r[0], r[1], r[2], r[3], 0, 0, c.width, c.height);
            ui[k] = { u: c.toDataURL('image/png'), w: c.width, h: c.height };
          });
        });
      }).catch(function () {}));
    }
    return Promise.all(jobs).then(function () { return { chars: chars, fonts: fonts, ui: ui }; });
  }

  return { GMReader: GMReader, readGameMaker: readGameMaker, readStardew: readStardew };
})();
