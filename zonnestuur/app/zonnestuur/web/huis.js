/* Zonnestuur huis — een tekening van jouw huis van nu: het weer, de zon of de maan op de echte plek,
 * en binnen de apparaten die Zonnestuur kent. Een doorsnede zoals een bouwtekening (plat, met inktlijn),
 * met een groen netkastje in de straat: zo gaat stroom in Nederland onder de grond naar je huis.
 * Gebruik: zsHuis.teken(svgElement, status, onderschriftElement). */
(function () {
  "use strict";
  var W = 440, H = 300, GR = 236;          // breedte, hoogte, grondlijn

  function nl(x, d) { return Number(x).toLocaleString("nl-NL", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function kw(w) { return nl(Math.abs(w || 0) / 1000, Math.abs(w || 0) >= 10000 ? 0 : 1); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------- kleuren per moment van de dag ----------
  var KLEUR = {
    dag:     { lucht: ["#9fd0f0", "#e4f2fb"], grond: "#bfd3a6", grond2: "#a9c28e", inkt: "#13202b", muur: "#fbf7ef", kamer: "#f3ede2", licht: "#f3ede2", wolk: "#ffffff", ster: 0 },
    grijs:   { lucht: ["#b8c4ce", "#e2e8ec"], grond: "#b4c2a3", grond2: "#9fb08c", inkt: "#13202b", muur: "#f6f3ec", kamer: "#ece7dd", licht: "#f3e6c8", wolk: "#f1f4f6", ster: 0 },
    schemer: { lucht: ["#3a4a7a", "#f2a66e"], grond: "#7f8f6c", grond2: "#6d7c5c", inkt: "#13202b", muur: "#efe6d8", kamer: "#e5d9c4", licht: "#ffd58a", wolk: "#d9c3c6", ster: 0.4 },
    nacht:   { lucht: ["#0b1630", "#26375f"], grond: "#2b3b33", grond2: "#24322b", inkt: "#0a111c", muur: "#c9cdd6", kamer: "#3a4458", licht: "#ffcf6e", wolk: "#55627a", ster: 1 }
  };

  function soortVan(d) {
    var n = (d.name || "").toLowerCase();
    if (d.kind === "ev") return "auto";
    if (d.kind === "heatpump") return "warmtepomp";
    if (d.kind === "boiler" || /boiler|water/.test(n)) return "boiler";
    if (/droog/.test(n)) return "droger";
    if (/vaat/.test(n)) return "vaat";
    if (/was/.test(n)) return "was";
    if (/airco|koel/.test(n)) return "airco";
    return "stekker";
  }

  // ---------- onderdelen ----------
  function wolk(x, y, s, kleur, inkt, i) {
    var d = "M" + (x - 34 * s) + " " + y + "a" + 14 * s + " " + 14 * s + " 0 0 1 " + 16 * s + " -" + 13 * s +
      "a" + 19 * s + " " + 19 * s + " 0 0 1 " + 34 * s + " -" + 4 * s + "a" + 13 * s + " " + 13 * s + " 0 0 1 " + 18 * s + " " + 17 * s + "z";
    return '<g class="hz-wolk" style="animation-duration:' + (46 + i * 13) + 's;animation-delay:-' + (i * 9) + 's"><path d="' + d +
      '" fill="' + kleur + '" stroke="' + inkt + '" stroke-opacity=".35" stroke-width="1.2" stroke-linejoin="round"/></g>';
  }
  function boom(x, s, inkt, kleur, wind, i) {
    var a = clamp((wind || 0) / 9, 0.6, 5);
    return '<g class="hz-boom" style="transform-origin:' + x + 'px ' + GR + 'px;--a:' + a.toFixed(1) + 'deg;animation-duration:' + (2.6 + i * .7) + 's">' +
      '<path d="M' + x + ' ' + GR + 'V' + (GR - 26 * s) + '" stroke="' + inkt + '" stroke-width="' + 2.4 * s + '" stroke-linecap="round"/>' +
      '<circle cx="' + x + '" cy="' + (GR - 38 * s) + '" r="' + 17 * s + '" fill="' + kleur + '" stroke="' + inkt + '" stroke-width="1.4"/>' +
      '<circle cx="' + (x - 9 * s) + '" cy="' + (GR - 30 * s) + '" r="' + 10 * s + '" fill="' + kleur + '" stroke="' + inkt + '" stroke-width="1.4"/></g>';
  }
  function maan(x, y, fase, inkt) {
    // verlicht deel: 0 nieuw, 0,5 vol
    var r = 11, k = Math.cos(fase * 2 * Math.PI), rechts = fase < 0.5;
    var rx = Math.abs(k) * r, sweep = k > 0 ? (rechts ? 0 : 1) : (rechts ? 1 : 0);
    var d = "M" + x + " " + (y - r) + "A" + r + " " + r + " 0 0 " + (rechts ? 1 : 0) + " " + x + " " + (y + r) +
      "A" + rx.toFixed(2) + " " + r + " 0 0 " + sweep + " " + x + " " + (y - r) + "z";
    return '<g><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#ffffff" opacity=".10"/>' +
      (fase > 0.03 && fase < 0.97 ? '<path d="' + d + '" fill="#fff3cf"/>' : "") + "</g>";
  }
  function sterren(n, op) {
    var h = "", x = 17;
    for (var i = 0; i < n; i++) {
      x = (x * 73 + 41) % 997;
      var sx = 12 + (x % 416), sy = 10 + ((x * 7) % 150);
      h += '<circle class="hz-ster" cx="' + sx + '" cy="' + sy + '" r="' + (i % 3 ? .9 : 1.4) + '" fill="#fff" opacity="' + op +
        '" style="animation-delay:-' + (i % 7) + 's"/>';
    }
    return h;
  }
  function regen(n, wind, sneeuw) {
    var h = '<g class="hz-regen' + (sneeuw ? " sneeuw" : "") + '"><g transform="skewX(' + (-clamp((wind || 0) / 2, 0, 24)).toFixed(0) + ')">', x = 5;
    for (var i = 0; i < n; i++) {
      x = (x * 61 + 29) % 991;
      var rx = 10 + (x % 470), ry = -40 + ((x * 3) % 260);
      h += sneeuw ? '<circle cx="' + rx + '" cy="' + ry + '" r="1.6"/>' : '<path d="M' + rx + " " + ry + 'v9"/>';
    }
    return h + "</g></g>";
  }

  // icoontjes in de kamers (getekend op 0,0 = midden onder)
  function icoon(soort, aan, inkt, extra) {
    var st = 'stroke="' + inkt + '" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    var vul = aan ? "#ffd27a" : "#ffffff";
    switch (soort) {
      case "boiler": {
        var lvl = aan ? 0.6 : 0.85;
        return '<rect x="-10" y="-40" width="20" height="38" rx="9" fill="#fff" stroke="' + inkt + '" stroke-width="1.5"/>' +
          '<rect x="-6" y="' + (-36 + 30 * (1 - lvl)) + '" width="12" height="' + (30 * lvl) + '" rx="5" fill="' + (aan ? "#ff8a3d" : "#7fb3e6") + '" opacity=".85"/>' +
          (aan ? '<path class="hz-damp" d="M-4 -46c-3-4 3-6 0-10M4 -46c-3-4 3-6 0-10" ' + st + '/>' : "") +
          '<path d="M-5 -2v3M5 -2v3" ' + st + "/>";
      }
      case "was": case "droger": case "vaat":
        return '<rect x="-13" y="-28" width="26" height="28" rx="3" fill="' + vul + '" stroke="' + inkt + '" stroke-width="1.5"/>' +
          '<path d="M-13 -22h26" ' + st + "/>" +
          (soort === "vaat" ? '<path d="M-7 -14h14M-7 -9h14" ' + st + "/>" :
            '<circle cx="0" cy="-11" r="7" fill="#fff" stroke="' + inkt + '" stroke-width="1.5"/>' +
            '<g class="' + (aan ? "hz-trommel" : "") + '"><path d="M-4 -11a4 4 0 0 1 8 0" ' + st + '/></g>');
      case "warmtepomp":
        return '<rect x="-17" y="-24" width="34" height="24" rx="3" fill="#fff" stroke="' + inkt + '" stroke-width="1.5"/>' +
          '<circle cx="-4" cy="-12" r="8" fill="#eef3f6" stroke="' + inkt + '" stroke-width="1.3"/>' +
          '<g class="' + (aan ? "hz-fan" : "") + '" style="transform-origin:-4px -12px"><path d="M-4 -19v14M-11 -12h14" ' + st + '/></g>' +
          '<path d="M8 -18v12M12 -18v12" ' + st + "/>";
      case "batterij": {
        var soc = clamp(extra == null ? 50 : extra, 0, 100);
        return '<rect x="-9" y="-36" width="18" height="34" rx="4" fill="#fff" stroke="' + inkt + '" stroke-width="1.5"/>' +
          '<rect x="-5" y="' + (-32 + 26 * (1 - soc / 100)) + '" width="10" height="' + (26 * soc / 100) + '" rx="2" fill="#2bb673"/>' +
          '<path d="M-4 -39h8" ' + st + "/>";
      }
      case "airco":
        return '<rect x="-16" y="-14" width="32" height="12" rx="4" fill="' + vul + '" stroke="' + inkt + '" stroke-width="1.5"/>';
      default:
        return '<rect x="-8" y="-22" width="16" height="20" rx="4" fill="' + vul + '" stroke="' + inkt + '" stroke-width="1.5"/>' +
          '<path d="M-3 -16v5M3 -16v5" ' + st + "/>";
    }
  }
  function auto(x, kleur, inkt) {
    // plat zijaanzicht, neus naar links; 72 breed, staat op de grond
    var y = GR - 2;
    return '<g transform="translate(' + x + ' ' + (GR * 0.12).toFixed(1) + ') scale(.88)">' +
      '<path d="M2 ' + (y - 8) + 'q0-12 12-14l10-11q4-4 10-4h16q7 0 11 6l7 9q8 1 8 10v4z" fill="' + kleur + '" stroke="' + inkt + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M26 ' + (y - 22) + 'l7-8h15l7 8z" fill="#dfe9f1" stroke="' + inkt + '" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<circle cx="18" cy="' + (y - 6) + '" r="7" fill="#26313b" stroke="' + inkt + '" stroke-width="1.4"/><circle cx="18" cy="' + (y - 6) + '" r="2.6" fill="#cfd6dc"/>' +
      '<circle cx="58" cy="' + (y - 6) + '" r="7" fill="#26313b" stroke="' + inkt + '" stroke-width="1.4"/><circle cx="58" cy="' + (y - 6) + '" r="2.6" fill="#cfd6dc"/>' +
      "</g>";
  }
  function chip(x, y, tekst, kleur, anker, id) {
    var w = Math.max(30, tekst.length * 6.3 + 16), x0 = anker === "end" ? x - w : anker === "middle" ? x - w / 2 : x;
    return '<g class="hz-chip"' + (id ? ' data-chip="' + id + '"' : "") + '><rect x="' + x0.toFixed(1) + '" y="' + (y - 13) + '" width="' + w.toFixed(1) +
      '" height="20" rx="10" fill="' + (kleur || "#ffffff") + '" fill-opacity=".94" stroke="#13202b" stroke-opacity=".14"/>' +
      '<text x="' + (x0 + w / 2).toFixed(1) + '" y="' + (y + 1) + '" text-anchor="middle">' + esc(tekst) + "</text></g>";
  }

  // ---------- de tekening ----------
  function teken(svg, s, onder) {
    if (!svg || !s) return;
    var hz = s.huis || {}, zon = hz.zon || {}, wr = hz.weer || {}, pr = hz.prijs || {};
    var fase = zon.fase || "dag";
    var wolken = wr.wolken == null ? 30 : wr.wolken, nat = (wr.regen || 0) >= 0.1;
    var thema = fase === "dag" && (wolken >= 75 || nat) ? "grijs" : fase;
    var K = KLEUR[thema], inkt = K.inkt;
    var bat = (s.batteries || [])[0];
    var pv = s.inverter && s.inverter.pv_w != null ? s.inverter.pv_w : s.forecast_now_w;
    var g = s.grid_w;
    var devs = (s.devices || []).filter(function (d) { return d.kind !== "ev"; });
    var autos = [];
    (s.devices || []).forEach(function (d) {
      if (d.kind !== "ev") return;
      var ev = d.ev || {};
      autos.push({ naam: d.name, laadt: (d.power_w || 0) > 300, w: d.power_w, soc: ev.soc != null ? ev.soc : (ev.car && ev.car.soc), wie: "Zonnestuur", plug: ev.plug });
    });
    (s.waarnemen || []).forEach(function (w) {
      autos.push({ naam: w.naam, laadt: (w.power_w || 0) > 300, w: w.power_w, soc: w.soc, wie: w.wie, plug: w.plug });
    });
    // een auto staat er als hij laadt of aan de laadpaal hangt; is de stekker eruit, dan laten we hem weg
    autos = autos.filter(function (a) { return a.laadt || a.plug !== false; }).slice(0, 2);

    // plekken in het huis: boven links/rechts, beneden links/rechts
    var binnen = [], buiten = null;
    devs.forEach(function (d) {
      var so = soortVan(d);
      var item = { naam: d.name, soort: so, aan: (d.power_w || 0) > 40 || !!d.on, w: d.power_w };
      if (so === "warmtepomp" && !buiten) buiten = item; else binnen.push(item);
    });
    binnen.sort(function (a, b) { return (a.soort === "boiler" ? 0 : 1) - (b.soort === "boiler" ? 0 : 1); });
    var PLEK = [[148, 192], [206, 192], [134, 236], [178, 236], [222, 236]];
    binnen = binnen.slice(0, PLEK.length);

    var u = svg.id || "hz", h = "";
    h += '<defs><linearGradient id="' + u + 'L" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + K.lucht[0] + '"/><stop offset="1" stop-color="' + K.lucht[1] + '"/></linearGradient>' +
      '<radialGradient id="' + u + 'Z"><stop offset="0" stop-color="#fff2b3"/><stop offset=".55" stop-color="#ffb224"/><stop offset="1" stop-color="#ffb224" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + u + 'G" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + K.grond + '" stop-opacity="0"/><stop offset=".18" stop-color="' + K.grond + '"/>' +
      '<stop offset=".82" stop-color="' + K.grond + '"/><stop offset="1" stop-color="' + K.grond + '" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="' + u + 'R"><rect width="' + W + '" height="' + H + '" rx="' + (svg.getAttribute && svg.getAttribute("data-los") === "1" ? 0 : 22) + '"/></clipPath></defs>';
    // vrijstaand (bijv. op de Nest Hub): geen eigen lucht en rand, de achtergrond van het scherm is de lucht
    var los = svg.getAttribute && svg.getAttribute("data-los") === "1";
    h += '<g clip-path="url(#' + u + 'R)">';
    if (!los) h += '<rect width="' + W + '" height="' + GR + '" fill="url(#' + u + 'L)"/>';
    if (K.ster) h += sterren(28, K.ster * (wolken > 80 ? .25 : 1));

    // zon of maan
    var zx = null, zy = null;
    if (zon.hoogte != null && zon.hoogte > -3) {
      zx = clamp(20 + ((zon.azimut || 180) - 90) / 180 * 400, 18, W - 18);
      zy = clamp(GR - 10 - zon.hoogte * 5.6, 26, GR - 4);
      var dek = wolken >= 85 || nat ? .35 : wolken >= 50 ? .7 : 1;
      h += '<g opacity="' + dek + '"><circle cx="' + zx.toFixed(0) + '" cy="' + zy.toFixed(0) + '" r="34" fill="url(#' + u + 'Z)" class="hz-gloed"/>' +
        '<circle cx="' + zx.toFixed(0) + '" cy="' + zy.toFixed(0) + '" r="13" fill="' + (zon.hoogte < 8 ? "#ff9a3d" : "#ffc53d") + '" stroke="' + inkt + '" stroke-opacity=".25"/></g>';
    } else if (hz.maan != null) {
      h += maan(372, 48, hz.maan, inkt);
    }
    // wolken (na de zon: ze schuiven ervoor langs)
    var nW = wolken < 12 ? 0 : wolken < 40 ? 1 : wolken < 70 ? 2 : wolken < 90 ? 3 : 4;
    if (nat) nW = Math.max(nW, 3);
    var WP = [[300, 58, 1], [92, 40, .8], [205, 30, .9], [380, 92, .7], [40, 96, .75]];
    for (var i = 0; i < nW; i++) h += wolk(WP[i][0], WP[i][1], WP[i][2], nat ? (fase === "nacht" ? "#48546b" : "#d3dae0") : K.wolk, inkt, i);

    if (nat) h += regen(Math.round(clamp(18 + (wr.regen || 0) * 14, 18, 70)), wr.wind, wr.t != null && wr.t <= 1);
    // grond, straat en bomen
    if (los) {                                   // een strook grond die aan de zijkanten en onderaan wegloopt
      h += '<path d="M0 ' + GR + 'H' + W + 'V' + (GR + 46) + 'H0z" fill="url(#' + u + 'G)"/>';
      h += '<path d="M40 ' + GR + 'H' + (W - 40) + '" stroke="' + inkt + '" stroke-width="1.6" stroke-opacity=".7"/>';
    } else {
      h += '<path d="M0 ' + GR + 'H' + W + 'V' + H + 'H0z" fill="' + K.grond + '"/>';
      h += '<path d="M0 ' + (GR + 30) + 'H' + W + 'V' + H + 'H0z" fill="' + K.grond2 + '"/>';
      h += '<path d="M0 ' + GR + 'H' + W + '" stroke="' + inkt + '" stroke-width="1.6"/>';
    }
    h += boom(28, 1.05, inkt, fase === "nacht" ? "#36503f" : "#8db36e", wr.wind, 0);
    if (!buiten && !bat) h += boom(70, .72, inkt, fase === "nacht" ? "#2f4637" : "#9cc07d", wr.wind, 1);

    // netkastje (groen, in de straat) en de kabel onder de grond
    var kx = 428;
    h += '<g><rect x="' + (kx - 8) + '" y="' + (GR - 30) + '" width="16" height="30" rx="2" fill="#4f7f5a" stroke="' + inkt + '" stroke-width="1.5"/>' +
      '<path d="M' + (kx + 1) + " " + (GR - 24) + "l-3 7h5l-4 8" + '" stroke="#ffd34d" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>';
    var kabel = "M268 " + (GR + 1) + "V" + (GR + 16) + "H" + kx + "V" + GR;
    h += '<path d="' + kabel + '" stroke="' + inkt + '" stroke-opacity=".35" stroke-width="2" fill="none" stroke-dasharray="1 4" stroke-linecap="round"/>';
    if (g != null && Math.abs(g) > 30)
      h += '<path class="hz-stroom ' + (g < 0 ? "uit" : "in") + '" d="' + (g < 0 ? kabel : "M" + kx + " " + GR + "V" + (GR + 16) + "H268V" + (GR + 1)) +
        '" style="animation-duration:' + (Math.abs(g) > 2500 ? .5 : Math.abs(g) > 1000 ? .8 : 1.2) + 's"/>';

    // het huis: doorsnede met twee verdiepingen onder een zadeldak
    var dakL = 84, dakR = 284, dakY = 148, nokL = 122, nokR = 246, nokY = 90;
    h += '<path d="M228 ' + (nokY + 6) + 'v-26h14v40" fill="' + K.muur + '" stroke="' + inkt + '" stroke-width="1.6" stroke-linejoin="round"/>';
    h += '<rect x="100" y="' + dakY + '" width="168" height="' + (GR - dakY) + '" fill="' + K.muur + '" stroke="' + inkt + '" stroke-width="1.8"/>';
    var lamp = fase !== "dag";
    h += '<rect x="106" y="' + (dakY + 4) + '" width="156" height="38" fill="' + (lamp ? K.licht : K.kamer) + '" stroke="' + inkt + '" stroke-width="1.2"/>';
    h += '<rect x="106" y="' + (dakY + 48) + '" width="156" height="' + (GR - dakY - 48) + '" fill="' + (lamp ? K.licht : K.kamer) + '" stroke="' + inkt + '" stroke-width="1.2"/>';
    h += '<path d="M184 ' + (dakY + 4) + 'v38M184 ' + (dakY + 48) + 'V' + GR + '" stroke="' + inkt + '" stroke-width="1.2"/>';
    h += '<path d="M' + dakL + " " + dakY + "L" + nokL + " " + nokY + "H" + nokR + "L" + dakR + " " + dakY + 'z" fill="#c8553d" stroke="' + inkt + '" stroke-width="1.8" stroke-linejoin="round"/>';
    h += '<path d="M' + (dakL + 10) + " " + (dakY - 5) + "H" + (dakR - 10) + '" stroke="' + inkt + '" stroke-opacity=".25" stroke-width="1"/>';
    // zonnepanelen op het dak
    if (s.has_panels) {
      var zonAan = pv != null && pv > 50;
      var pp = "";
      for (var r = 0; r < 2; r++) for (var c = 0; c < 5; c++) {
        var y0 = nokY + 7 + r * 23, x0 = 128 + c * 23 - r * 2;
        pp += '<path d="M' + x0 + " " + y0 + "h20l1.5 20h-23z" + '" />';
      }
      h += '<g class="hz-paneel' + (zonAan ? " aan" : "") + '" fill="#23406e" stroke="' + inkt + '" stroke-width="1.1" stroke-linejoin="round">' + pp + "</g>";
      if (zonAan) h += '<path class="hz-stroom zon" d="M190 ' + (nokY + 48) + "V" + (dakY + 2) + '" style="animation-duration:' + (pv > 2500 ? .5 : pv > 1000 ? .8 : 1.2) + 's"/>';
    }
    // apparaten binnen
    binnen.forEach(function (d, i) {
      var p = PLEK[i];
      h += '<g transform="translate(' + p[0] + " " + (p[1] - 1) + ')">' + (d.aan ? '<circle class="hz-aan" cx="0" cy="-16" r="21"/>' : "") + icoon(d.soort, d.aan, inkt) + "</g>";
    });
    if (bat) {
      var bA = Math.abs(bat.power_w || 0) > 30;
      // aan de buitenmuur, links naast het huis
      h += '<g transform="translate(' + (buiten ? 88 : 90) + ' ' + (GR - 8) + ')">' + (bA ? '<circle class="hz-aan bat" cx="0" cy="-18" r="20"/>' : "") +
        icoon("batterij", bA, inkt, bat.soc) + '<path d="M9 -20h3" stroke="' + inkt + '" stroke-width="1.5"/></g>';
    }
    if (buiten) h += '<g transform="translate(' + (bat ? 58 : 76) + ' ' + GR + ')">' + icoon("warmtepomp", buiten.aan, inkt) + "</g>";

    // oprit met auto's en laadpaal tegen de gevel
    var AX = [280, 350];
    autos.forEach(function (a, i) {
      var ax = AX[i];
      h += auto(ax, i === 0 ? "#f4f6f8" : "#ffcf57", inkt);
      var px = 268, py = GR - 30;
      if (i === 0) h += '<rect x="' + (px - 1) + '" y="' + (py - 8) + '" width="7" height="16" rx="2" fill="#fff" stroke="' + inkt + '" stroke-width="1.3"/>';
      if (a.laadt || a.plug) {
        var kab = i === 0 ? "M274 " + py + "C" + (ax + 6) + " " + (py + 10) + " " + (ax + 58) + " " + (GR - 30) + " " + (ax + 58) + " " + (GR - 14)
          : "M274 " + (py + 4) + "C300 " + (GR + 2) + " " + (ax + 54) + " " + (GR + 4) + " " + (ax + 58) + " " + (GR - 14);
        h += '<path d="' + kab + '" stroke="' + inkt + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
        if (a.laadt) h += '<path class="hz-stroom laad" d="' + kab + '" style="animation-duration:' + ((a.w || 0) > 7000 ? .5 : .8) + 's"/>';
      }
    });

    h += "</g>";
    h += '<rect x=".5" y=".5" width="' + (W - 1) + '" height="' + (H - 1) + '" rx="22" fill="none" stroke="#13202b" stroke-opacity=".12"/>';
    var basis = h;
    // labels (los van de tekening, zodat bewegende wolken niet opnieuw beginnen als een getal verandert)
    h = "";
    var weer = [];
    if (wr.t != null) weer.push(nl(wr.t, Math.abs(wr.t) < 10 ? 1 : 0) + " °C");
    if (wr.woord) weer.push(wr.woord);
    if (weer.length) h += chip(14, 24, weer.join(" · "), "#ffffff", "start", "weer");
    if (pr.niveau && s.contract === "dynamic" && !los)
      h += chip(W - 14, 24, "Stroom " + pr.niveau + (pr.nu != null ? " · " + nl(pr.nu * 100) + " ct" : ""),
        pr.niveau === "goedkoop" ? "#d8e6ff" : pr.niveau === "duur" ? "#ffd9d2" : "#ffffff", "end", "prijs");
    if (s.has_panels && pv != null && (pv > 50 || fase === "dag")) h += chip(184, nokY - 12, "Zon " + kw(pv) + " kW", pv > 50 ? "#fff1c4" : "#ffffff", "middle", "zon");
    if (g != null) h += chip(kx + 2, GR + 32, (g < -30 ? "Terug " : "Net ") + kw(g) + " kW", g < -30 ? "#fff1c4" : "#e3ecff", "end", "net");
    if (s.huis_naam) h += '<g class="hz-naam">' + chip(184, GR + 32, s.huis_naam.slice(0, 28), "#13202b", "middle", "naam") + "</g>";
    autos.forEach(function (a, i) {
      var t = (a.naam || "Auto") + (a.soc != null ? " " + Math.round(a.soc) + "%" : "");
      h += chip(AX[i] + 36, GR - 50, t, a.laadt ? "#fff1c4" : "#ffffff", "middle", "auto" + i);
    });

    var zin = zinVan(s, hz, pv, g, binnen, buiten, autos, bat);
    svg.setAttribute("aria-label", zin);
    if (svg._hz !== basis) { svg.innerHTML = basis + '<g class="hz-labels"></g>'; svg._hz = basis; }
    var lg = svg.querySelector(".hz-labels");
    if (lg && lg._h !== h) { lg.innerHTML = h; lg._h = h; }
    if (onder) onder.textContent = zin;
  }

  function zinVan(s, hz, pv, g, binnen, buiten, autos, bat) {
    var wr = hz.weer || {}, zon = hz.zon || {}, d = [];
    var buitenZin = [];
    if (wr.woord) buitenZin.push(wr.woord.charAt(0).toUpperCase() + wr.woord.slice(1));
    if (wr.t != null) buitenZin.push(nl(wr.t, Math.abs(wr.t) < 10 ? 1 : 0) + " °C");
    if (buitenZin.length) d.push(buitenZin.join(", ") + (zon.fase === "nacht" && zon.op ? " (zon op om " + zon.op + ")" : zon.fase !== "nacht" && zon.onder && zon.hoogte > 0 ? " (zon onder om " + zon.onder + ")" : "") + ".");
    if (s.has_panels && pv != null) d.push(pv > 50 ? "Je panelen leveren " + kw(pv) + " kW." : "Je panelen leveren nu niets.");
    var aan = binnen.concat(buiten ? [buiten] : []).filter(function (x) { return x.aan; }).map(function (x) { return x.naam; });
    if (aan.length) d.push((aan.length === 1 ? aan[0] + " staat aan" : aan.slice(0, -1).join(", ") + " en " + aan[aan.length - 1] + " staan aan") + ".");
    autos.forEach(function (a) {
      if (a.laadt) d.push(a.naam + " laadt" + (a.wie && a.wie !== "Zonnestuur" ? " via " + a.wie : "") + (a.soc != null ? " (" + Math.round(a.soc) + "%)" : "") + ".");
    });
    if (bat && Math.abs(bat.power_w || 0) > 30) d.push("De batterij " + (bat.power_w > 0 ? "laadt" : "levert stroom") + (bat.soc != null ? " (" + Math.round(bat.soc) + "%)" : "") + ".");
    if (g != null) d.push(g < -30 ? "Je levert " + kw(g) + " kW terug aan het net." : g > 30 ? "Je haalt " + kw(g) + " kW van het net." : "Je meter staat op nul.");
    return d.join(" ");
  }

  // stijl van de tekening (ook voor de Nest Hub-kaart, die in een eigen schaduw-DOM tekent)
  var CSS = ".hz { width: 100%; height: auto; border-radius: 22px; } .hz .hz-labels text { fill: #13202b !important; } .hz .hz-labels .hz-naam text { fill: #ffffff !important; } .hz text { font: 600 11.5px \"Inter\", system-ui, sans-serif; fill: #13202b; } .hz .hz-wolk { animation: hzDrijf 50s ease-in-out infinite alternate; } .hz .hz-boom { animation: hzWuif 3s ease-in-out infinite alternate; } .hz .hz-ster { animation: hzTwinkel 4s ease-in-out infinite alternate; } .hz .hz-regen { stroke: #5b7fa8; stroke-width: 1.4; stroke-linecap: round; opacity: .75; animation: hzVal .9s linear infinite; } .hz .hz-regen.sneeuw { fill: #fff; stroke: none; animation-duration: 5s; } .hz .hz-gloed { animation: hzGloed 4s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; } .hz .hz-stroom { fill: none; stroke-width: 3.2; stroke-linecap: round; stroke-dasharray: 2 12; animation: dash 1s linear infinite; } .hz .hz-stroom.zon { stroke: #ffb224; } .hz .hz-stroom.in { stroke: #2659c4; } .hz .hz-stroom.uit { stroke: #ffb224; } .hz .hz-stroom.laad { stroke: #2bb673; } .hz .hz-straal { stroke: #ffd56b; stroke-width: 10; stroke-linecap: round; stroke-opacity: .35; fill: none; } .hz .hz-paneel.aan path { fill: #2d5a9e; animation: hzGlans 3s ease-in-out infinite alternate; } .hz .hz-aan { fill: #ffd27a; opacity: .45; animation: hzAan 1.6s ease-in-out infinite alternate; } .hz .hz-aan.bat { fill: #8fe0b5; } .hz .hz-fan { animation: hzDraai 1s linear infinite; } .hz .hz-trommel { animation: hzDraai 1.4s linear infinite; transform-box: view-box; transform-origin: 0 -11px; } .hz .hz-damp { opacity: .6; animation: hzDamp 2.4s ease-in-out infinite; } @keyframes hzDrijf { from { transform: translateX(-22px); } to { transform: translateX(26px); } } @keyframes hzWuif { from { transform: rotate(calc(var(--a) * -1)); } to { transform: rotate(var(--a)); } } @keyframes hzTwinkel { from { opacity: .25; } to { opacity: 1; } } @keyframes hzVal { from { transform: translateY(0); } to { transform: translateY(40px); } } @keyframes hzGloed { from { transform: scale(.92); } to { transform: scale(1.08); } } @keyframes hzGlans { from { fill: #23406e; } to { fill: #3b6fbf; } } @keyframes hzAan { from { opacity: .2; } to { opacity: .55; } } @keyframes hzDraai { to { transform: rotate(360deg); } } @keyframes hzDamp { 0% { transform: translateY(2px); opacity: 0; } 50% { opacity: .6; } 100% { transform: translateY(-6px); opacity: 0; } } @media (prefers-reduced-motion: reduce) { .hz * { animation: none !important; } } @keyframes dash { to { stroke-dashoffset: -16; } }";
  window.zsHuis = { teken: teken, soortVan: soortVan, css: CSS };
})();
