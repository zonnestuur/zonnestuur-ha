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
  // Klusje: een poppetje dat iets doet dat bij het weer en het uur past (maaien, panelen poetsen, auto wassen,
  // paraplu, sneeuwpop; 's nachts slaapt hij boven). Elk uur kan hij iets anders kiezen.
  var POP_CSS = "@keyframes hzPopHeen{0%{transform:translateX(0) scaleX(1)}47%{transform:translateX(var(--ver)) scaleX(1)}50%{transform:translateX(var(--ver)) scaleX(-1)}97%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(0) scaleX(1)}}" +
    "@keyframes hzPopStap{from{transform:translateY(0)}to{transform:translateY(-1.2px)}}" +
    "@keyframes hzPopPoets{from{transform:rotate(-28deg)}to{transform:rotate(22deg)}}" +
    "@keyframes hzPopBel{0%{transform:translateY(0) scale(.6);opacity:0}30%{opacity:.9}100%{transform:translateY(-16px) scale(1.1);opacity:0}}" +
    "@keyframes hzPopZ{0%{transform:translate(0,0);opacity:0}30%{opacity:.85}100%{transform:translate(8px,-18px);opacity:0}}" +
    "@keyframes hzPopGras{0%{transform:translate(0,0);opacity:.9}100%{transform:translate(-7px,-5px);opacity:0}}" +
    ".hz .hz-pop-heen{transform-box:fill-box;transform-origin:center;animation:hzPopHeen 16s linear infinite}" +
    ".hz .hz-pop-stap{animation:hzPopStap .35s ease-in-out infinite alternate}" +
    ".hz .hz-pop-arm{transform-box:fill-box;transform-origin:0 0;animation:hzPopPoets .5s ease-in-out infinite alternate}" +
    ".hz .hz-pop-bel{transform-box:fill-box;transform-origin:center;animation:hzPopBel 2.2s ease-out infinite}" +
    ".hz .hz-pop-z{animation:hzPopZ 3s ease-out infinite}.hz .hz-pop-gras{animation:hzPopGras .7s linear infinite}" +
    "@keyframes hzPopDans{0%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-3px) rotate(8deg)}100%{transform:translateY(0) rotate(-8deg)}}" +
    "@keyframes hzPopZeg{0%,55%{opacity:0;transform:translateY(3px)}62%,92%{opacity:1;transform:translateY(0)}100%{opacity:0}}" +
    ".hz .hz-pop-dans{transform-box:fill-box;transform-origin:50% 100%;animation:hzPopDans .6s ease-in-out infinite}" +
    ".hz .hz-pop-zeg{animation:hzPopZeg 9s ease-in-out infinite}.hz .pyjama rect{fill:#b18cff}.hz svg.hz,.hz{cursor:pointer}" +
    "@keyframes hzPopZwaai{from{transform:rotate(-10deg)}to{transform:rotate(12deg)}}@keyframes hzPopStuit{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}" +
    "@keyframes hzPopVal{0%{transform:translate(0,0) rotate(0);opacity:0}15%{opacity:1}100%{transform:translate(14px,70px) rotate(220deg);opacity:0}}" +
    "@keyframes hzPopDrup{0%{transform:translate(0,0);opacity:1}100%{transform:translate(3px,10px);opacity:0}}@keyframes hzPopFlits{0%,86%,100%{opacity:0}90%{opacity:1}}" +
    "@keyframes hzPopHup{0%,60%,100%{transform:translateY(0)}70%{transform:translateY(-4px)}80%{transform:translateY(0)}88%{transform:translateY(-3px)}}" +
    "@keyframes hzPopJong{0%{transform:translate(0,0)}25%{transform:translate(4px,-16px)}50%{transform:translate(8px,0)}75%{transform:translate(4px,-6px)}100%{transform:translate(0,0)}}" +
    "@keyframes hzPopFlik{0%{opacity:.9}20%{opacity:.4}40%{opacity:1}60%{opacity:.6}80%{opacity:.95}100%{opacity:.5}}@keyframes hzPopVuur{from{transform:scale(.85,.8)}to{transform:scale(1.08,1.15)}}" +
    "@keyframes hzPopGooi{0%{transform:translate(0,0);opacity:1}100%{transform:translate(60px,-6px);opacity:0}}@keyframes hzPopKnipper{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}" +
    "@keyframes hzPopSpring{0%,100%{transform:translateY(0)}40%{transform:translateY(-9px)}}@keyframes hzPopSpat{0%{transform:translate(0,0);opacity:0}30%{opacity:1}100%{transform:translate(var(--dx),-9px);opacity:0}}" +
    "@keyframes hzPopRij{0%{transform:translateX(0) scaleX(1)}48%{transform:translateX(var(--ver)) scaleX(1)}50%{transform:translateX(var(--ver)) scaleX(-1)}98%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(0) scaleX(1)}}" +
    ".hz .hz-pop-zwaai{transform-box:fill-box;transform-origin:50% 100%;animation:hzPopZwaai 1.6s ease-in-out infinite alternate}.hz .hz-pop-stuit{animation:hzPopStuit .8s cubic-bezier(.3,0,.7,1) infinite}" +
    ".hz .hz-pop-val{animation:hzPopVal 4s linear infinite}.hz .hz-pop-drup{animation:hzPopDrup .6s linear infinite}.hz .hz-pop-flits{animation:hzPopFlits 3s linear infinite}" +
    ".hz .hz-pop-hup{animation:hzPopHup 2s ease-in-out infinite}.hz .hz-pop-jong{animation:hzPopJong 1.2s linear infinite}.hz .hz-pop-flik{animation:hzPopFlik 1.4s steps(5) infinite}" +
    ".hz .hz-pop-vuur{transform-box:fill-box;transform-origin:50% 100%;animation:hzPopVuur .35s ease-in-out infinite alternate}.hz .hz-pop-gooi{animation:hzPopGooi 1.4s ease-out infinite}" +
    ".hz .hz-pop-knip{transform-box:fill-box;transform-origin:center;animation:hzPopKnipper 3s linear infinite}.hz .hz-pop-spring{animation:hzPopSpring .9s ease-in-out infinite}" +
    ".hz .hz-pop-spat{animation:hzPopSpat .9s ease-out infinite}.hz .hz-pop-rij{transform-box:fill-box;transform-origin:center;animation:hzPopRij 14s linear infinite}" +
    "@keyframes hzPopVolg{0%{transform:translateX(0)}47%,50%{transform:translateX(var(--ver))}97%,100%{transform:translateX(0)}}.hz .hz-pop-volg{animation:hzPopVolg 16s linear infinite}" +
    "@media (prefers-reduced-motion: reduce){.hz [class*=hz-pop]{animation:none!important}}";

  var ALLE = ["maaien", "panelen", "auto", "zwaaien", "dansen", "hol", "vlieger", "harken", "gieter", "zonnen", "bbq", "hond", "voetbal", "fiets",
    "vogels", "jongleren", "selfie", "meter", "knuffel", "dak", "handstand", "stekker", "duur", "paraplu", "plassen", "eendje", "sneeuwpop", "sneeuwbal",
    "scheppen", "slapen", "sterren", "slaapwandelen", "tv", "zaklamp", "kampvuur", "uil"];
  var ZEG = {
    maaien: ["Gras kort, stroom goedkoop!", "Nog één baantje…", "Strak hè, die streepjes?"],
    panelen: ["Schone panelen = meer zon", "Niet naar beneden kijken…", "Glimmen moeten ze!"],
    auto: ["Blinkt als nieuw!", "Straks laden als het goedkoop is", "Wie heeft hier in de modder gereden?"],
    zwaaien: ["Hoi!", "Goed bezig met je stroom!", "Zie je mij?"],
    dansen: ["Goedkope stroom, feestje!", "Dit is mijn stroomdansje", "Laat de wasmachine maar draaien!"],
    hol: ["Hé, wacht even!", "Hij heeft te veel zonne-energie!", "Remmen! Waar zit de rem?"],
    vlieger: ["Wind = goedkope stroom!", "Hoger, hoger!", "Die molens draaien ook lekker"],
    harken: ["Herfst, hè", "Nog 3 miljoen blaadjes", "Bladeren op de panelen? Niet bij mij!"],
    gieter: ["Ook planten houden van zon", "Water geven, niet te veel", "Groeien jullie!"],
    zonnen: ["Even opladen…", "De panelen werken, ik niet", "Zon voor mij én het dak"],
    bbq: ["Wie wil er een worstje?", "Op houtskool, dus gratis stroom", "Bijna gaar!"],
    hond: ["Kom, Wattje!", "Hij snuffelt aan de laadpaal", "Even een rondje"],
    voetbal: ["Hoge bal!", "Hij is binnen!", "Niet tegen de panelen…"],
    fiets: ["Mijn eigen dynamo!", "Rondje om het huis", "Kijk, zonder handen! Eh, nee."],
    vogels: ["Piep piep!", "Wat kijk jij nou?", "Voor jullie, vogeltjes"],
    jongleren: ["Drie ballen, nul stroom", "Kijk mij nou!", "Oei, bijna…"],
    selfie: ["#zonnestuur", "Even met het huis op de foto", "Lach eens, huis!"],
    meter: ["Even de meter checken", "Alles klopt, keurig!", "Hmm, wie heeft er zoveel gebruikt?"],
    knuffel: ["Lieve warmtepomp ♥", "Wat ben je weer zuinig!", "Jij houdt ons warm"],
    dak: ["Wat een uitzicht!", "Ik zie je panelen al werken", "Hallo daar beneden!"],
    handstand: ["Alles op z'n kop!", "Kijk, ik sta op mijn handen", "Duizelig…"],
    stekker: ["Stekker erin, het is goedkoop!", "Nu laden!", "Zware stekker, hoor"],
    duur: ["Sst… stroom is nu duur", "Even niks aanzetten", "Daar gaat het geld!"],
    paraplu: ["Lekker weertje…", "Goed voor de planten", "Regen spoelt de panelen schoon"],
    plassen: ["Splash!", "Laarzen aan, dus het mag!", "Nog een plas!"],
    eendje: ["Kwak!", "Die eend heeft het wel naar zijn zin", "Eendjesweer!"],
    sneeuwpop: ["Hij heet Watt", "Een wortel als neus!", "Brrr, koud hè"],
    sneeuwbal: ["Raak!", "Sneeuwballengevecht!", "Pas op!"],
    scheppen: ["Sneeuw ruimen…", "De panelen zijn ook wit", "Pfff, zwaar werk"],
    slapen: ["Zonnestuur let wel op", "zzz… goedkope stroom… zzz", "Morgen weer"],
    sterren: ["Morgen weer zon?", "Kijk, een vallende ster!", "Ik zoek de zonnepanelen-ster"],
    slaapwandelen: ["Was ik de vaatwasser vergeten?", "Waar is de koelkast…", "Is het al goedkoop?"],
    tv: ["Nog één aflevering", "Tv op stroom van vanmiddag", "Spannend!"],
    zaklamp: ["Wie is daar?", "Even rondkijken", "Was dat een kat?"],
    kampvuur: ["Marshmallows!", "Lekker warm zo", "Vuurtje stoken zonder stroom"],
    uil: ["Oehoe!", "Oehoe… alles rustig", "Ik let op, hoor"]
  };
  function hussel(lijst, zaad) {
    var a = lijst.slice(), x = zaad % 2147483647 || 7;
    for (var i = a.length - 1; i > 0; i--) { x = (x * 48271) % 2147483647; var j = x % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // poppetje met de voeten op (0,0), ± 26 hoog; arm = de rechterarm (getekend vanaf de schouder)
  function poppetje(inkt, arm, stap) {
    var b = '<g' + (stap ? ' class="hz-pop-stap"' : "") + '>' +
      '<path d="M-2.5 0v-8M2.5 0v-8" stroke="' + inkt + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<rect x="-5" y="-18" width="10" height="11" rx="3" fill="#2659c4" stroke="' + inkt + '" stroke-width="1.2"/>' +
      '<path d="M-3 -15h6" stroke="#ffb224" stroke-width="1.6"/>' +
      '<path d="M-4.5 -15l-3 6" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="0" cy="-22.5" r="4.4" fill="#f4c9a4" stroke="' + inkt + '" stroke-width="1.2"/>' +
      '<path d="M-4.6 -23.4a4.6 4.6 0 0 1 9.2 0h2.6" fill="#ffb224" stroke="' + inkt + '" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<circle cx="1.8" cy="-21.8" r=".7" fill="' + inkt + '"/>';
    return b + (arm || '<path d="M4.5 -15l4 5" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>') + "</g>";
  }
  function klusje(o) {
    var inkt = o.inkt, GRd = o.gr, nu = new Date(), uur = nu.getHours(), maand = nu.getMonth() + 1, keus = [];
    var warm = o.t == null || o.t >= 6;
    if (o.fase === "nacht") keus = ["slapen", "sterren", "slaapwandelen", "tv", "zaklamp", "kampvuur", "uil"];
    else if (o.sneeuw) keus = ["sneeuwpop", "sneeuwbal", "scheppen"];
    else if (o.nat) keus = ["paraplu", "plassen", "eendje"];
    else {
      keus = ["zwaaien", "hol", "vlieger", "gieter", "hond", "voetbal", "fiets", "vogels", "jongleren", "selfie", "dak", "handstand"];
      if (warm) keus.push("maaien");
      if (o.panelen && !o.links) keus.push("panelen");          // ladder alleen als er geen auto voor staat
      if (o.auto != null) keus.push("auto");
      if (o.goedkoop) keus.push("dansen", "stekker");            // goedkope stroom: feestje
      if (o.duur) keus.push("duur");
      if (maand >= 9 && maand <= 11) keus.push("harken");
      if (o.t != null && o.t >= 18) keus.push("zonnen");
      if (uur >= 16 && uur <= 21 && (o.t == null || o.t >= 10)) keus.push("bbq");
      if (o.wp != null) keus.push("knuffel");
      if (!o.twee) keus.push("meter");
    }
    // elke 3 minuten iets anders; per dag een andere volgorde, en eerst alles één keer voordat iets terugkomt.
    // Tik op het huis = het volgende (om alles te zien).
    var slot = Math.floor(nu.getTime() / 180000), dag = Math.floor(nu.getTime() / 86400000);
    var k = o.forceer != null ? ALLE[o.forceer % ALLE.length] : hussel(keus, dag * 31 + keus.length)[slot % keus.length];
    var zinnen = ZEG[k] || [""], zeg = zinnen[(o.forceer != null ? o.forceer : Math.floor(slot / keus.length)) % zinnen.length];
    var Z = o.schaal || 1.7, h = "", y = GRd + 11, S = " scale(" + Z + ")", M = " scale(-" + Z + " " + Z + ")", bx = null, by = null;
    var L = function (d, w, kl) { return '<path d="' + d + '" stroke="' + (kl || inkt) + '" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'; };
    var arm = function (d) { return L(d); };
    var lx0 = null, ly0 = null;
    var plek = function (x, inhoud, spiegel, yy) { lx0 = x; ly0 = yy == null ? y : yy; return '<g transform="translate(' + x + " " + (yy == null ? y : yy) + ")" + (spiegel ? M : S) + '">' + inhoud + "</g>"; };
    if (k === "slapen") {
      h = '<g transform="translate(214 ' + (o.dakY + 34) + ')" fill="' + inkt + '" font-weight="800">' +
        '<text class="hz-pop-z" x="0" y="0" style="font: 800 11px Inter, system-ui, sans-serif">z</text><text class="hz-pop-z" x="8" y="-6" style="font: 800 14px Inter, system-ui, sans-serif; animation-delay:1s">z</text>' +
        '<text class="hz-pop-z" x="17" y="-12" style="font: 800 17px Inter, system-ui, sans-serif; animation-delay:2s">Z</text></g>';
    } else if (k === "maaien") {
      // heen en weer over het gazon voor het huis, met de grasmaaier voor zich uit
      var maaier = '<path d="M6 -14l9 9" stroke="' + inkt + '" stroke-width="1.6" stroke-linecap="round"/>' +
        '<rect x="12" y="-7" width="13" height="6" rx="2" fill="#2fbf71" stroke="' + inkt + '" stroke-width="1.2"/>' +
        '<circle cx="15" cy="0" r="2.2" fill="' + inkt + '"/><circle cx="23" cy="0" r="2.2" fill="' + inkt + '"/>' +
        '<g fill="#5fae4a"><rect class="hz-pop-gras" x="11" y="-3" width="2" height="2"/><rect class="hz-pop-gras" x="10" y="-5" width="2" height="2" style="animation-delay:.3s"/></g>';
      h = '<g transform="translate(112 ' + y + ')' + S + '"><g class="hz-pop-heen" style="--ver:86px">' +
        poppetje(inkt, '<path d="M4.5 -15l3 3" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>', true) + maaier + "</g></g>";
    } else if (k === "panelen") {
      // op een ladder tegen de dakrand, met een wisser over de panelen
      var lx = o.links ? 66 : 300, tx = o.links ? 86 : 282, dir = o.links ? 1 : -1;
      h = '<g stroke="' + inkt + '" stroke-width="1.4" stroke-linecap="round"><path d="M' + lx + " " + GRd + "L" + tx + " " + (o.dakY - 2) + "M" + (lx + 7 * dir) + " " + GRd + "L" + (tx + 7 * dir) + " " + (o.dakY - 2) + '"/>';
      for (var r = 1; r < 6; r++) {
        var f = r / 6, ax = lx + (tx - lx) * f, ay = GRd + (o.dakY - 2 - GRd) * f;
        h += '<path d="M' + ax.toFixed(1) + " " + ay.toFixed(1) + "h" + 7 * dir + '"/>';
      }
      h += "</g>";
      var px = lx + (tx - lx) * 0.72 + 3 * dir, py = GRd + (o.dakY - 2 - GRd) * 0.72;
      var wisser = '<g class="hz-pop-arm" transform="translate(' + (4.5 * dir) + ' -15)"><path d="M0 0l' + 6 * dir + ' -6" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M' + 6 * dir + ' -6l' + 5 * dir + ' -5M' + 8 * dir + ' -13l' + 7 * dir + ' 3" stroke="' + inkt + '" stroke-width="1.6" stroke-linecap="round"/></g>';
      h += '<g transform="translate(' + px.toFixed(1) + " " + py.toFixed(1) + ")" + (o.links ? S : M) + '">' + poppetje(inkt, wisser) + "</g>";
      h += '<g transform="translate(' + (o.links ? 50 : 318) + " " + GRd + ')"><path d="M-5 0l1 -8h8l1 8z" fill="#8ab4e8" stroke="' + inkt + '" stroke-width="1.2"/></g>';
    } else if (k === "auto") {
      // met een spons voor de auto langs, met zeepbellen
      var cx = (o.auto != null ? o.auto : 290) + 30;
      var spons = '<g class="hz-pop-arm" transform="translate(4.5 -15)"><path d="M0 0l6 -4" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>' +
        '<rect x="5" y="-8" width="6" height="4" rx="1.4" fill="#ffd34d" stroke="' + inkt + '" stroke-width="1"/></g>';
      h = '<g transform="translate(' + cx + " " + GRd + ')' + M + '">' + poppetje(inkt, spons) +
        '<path d="M-14 0l1 -8h8l1 8z" fill="#8ab4e8" stroke="' + inkt + '" stroke-width="1.2"/>' +
        '<g fill="#fff" stroke="#8ab4e8" stroke-width=".8"><circle class="hz-pop-bel" cx="12" cy="-24" r="2.2"/><circle class="hz-pop-bel" cx="17" cy="-20" r="1.6" style="animation-delay:.7s"/>' +
        '<circle class="hz-pop-bel" cx="9" cy="-30" r="1.4" style="animation-delay:1.4s"/></g></g>';
    } else if (k === "paraplu") {
      var scherm = '<path d="M4.5 -15l3 -2" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/><path d="M7 -17v-15" stroke="' + inkt + '" stroke-width="1.3"/>' +
        '<path d="M-6 -31a13 9 0 0 1 26 0q-3.3 -2 -6.5 0q-3.2 -2 -6.5 0q-3.3 -2 -6.5 0q-3.2 -2 -6.5 0z" fill="#e8553d" stroke="' + inkt + '" stroke-width="1.2" stroke-linejoin="round"/>';
      h = '<g transform="translate(112 ' + y + ')' + S + '"><g class="hz-pop-heen" style="--ver:86px;animation-duration:24s">' + poppetje(inkt, scherm, true) + "</g></g>";
    } else if (k === "sneeuwpop") {
      h = '<g transform="translate(320 ' + y + ')' + S + '">' + poppetje(inkt, '<path d="M4.5 -15l5 2" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>') +
        '<g transform="translate(22 0)" fill="#fff" stroke="' + inkt + '" stroke-width="1.2"><circle cx="0" cy="-7" r="7"/><circle cx="0" cy="-18" r="5"/>' +
        '<path d="M0 -18l4 1-4 1z" fill="#ff9a3d" stroke="none"/><circle cx="-1.5" cy="-19.5" r=".7" fill="' + inkt + '" stroke="none"/></g></g>';
    }
    if (k === "sterren") {
      // met een telescoop naar de sterren
      var kijker = '<path d="M4.5 -15l5 -3" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>';
      h = '<g transform="translate(330 ' + y + ')' + S + '">' + poppetje(inkt, kijker) +
        '<g stroke="' + inkt + '" stroke-width="1.2"><path d="M14 0l4 -12l4 12M18 -12v12" fill="none"/>' +
        '<rect x="6" y="-25" width="20" height="5" rx="2" transform="rotate(-30 16 -22)" fill="#8ab4e8"/></g>' +
        '<circle class="hz-pop-bel" cx="30" cy="-40" r="1.6" fill="#fff3cf" stroke="none"/></g>';
    } else if (k === "slaapwandelen") {
      // in pyjama, armen vooruit, met slaapmuts
      var armen = '<path d="M4.5 -15h8M-4.5 -15l-1 0" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>';
      h = '<g transform="translate(120 ' + y + ')' + S + '"><g class="hz-pop-heen" style="--ver:80px;animation-duration:30s"><g class="pyjama">' + poppetje(inkt, armen, true) + '</g>' +
        '<path d="M-4.6 -23.4l7 -8l3 6" fill="#e8553d" stroke="' + inkt + '" stroke-width="1"/><circle cx="2.4" cy="-31.4" r="1.6" fill="#fff"/>' +
        '<text class="hz-pop-z" x="6" y="-30" style="font: 800 8px Inter, system-ui, sans-serif" fill="' + inkt + '">z</text></g></g>';
    } else if (k === "dansen") {
      var dans = '<g class="hz-pop-arm"><path d="M4.5 -15l5 -7" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/></g>';
      h = '<g transform="translate(150 ' + y + ')' + S + '"><g class="hz-pop-dans">' + poppetje(inkt, dans) + '</g>' +
        '<g fill="' + inkt + '"><g class="hz-pop-z"><circle cx="10" cy="-26" r="1.8"/><path d="M11.6 -26v-7l3 1.5" fill="none" stroke="' + inkt + '" stroke-width="1"/></g><g class="hz-pop-z" style="animation-delay:1.5s"><circle cx="-13" cy="-22" r="1.8"/><path d="M-11.4 -22v-7l3 1.5" fill="none" stroke="' + inkt + '" stroke-width="1"/></g></g></g>';
    } else if (k === "zwaaien") {
      var zwaai = '<g class="hz-pop-arm" transform="translate(4.5 -15)"><path d="M0 0l5 -8" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>' +
        '<circle cx="5.4" cy="-8.8" r="1.6" fill="#f4c9a4" stroke="' + inkt + '" stroke-width=".8"/></g>';
      h = '<g transform="translate(150 ' + y + ')' + S + '">' + poppetje(inkt, zwaai) + "</g>";
    } else if (k === "hol") {
      // de maaier is op hol geslagen: hij hangt er achteraan
      var mee = '<path d="M4.5 -15l8 2" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/>';
      var maai = '<g transform="translate(-1 0)"><rect x="12" y="-7" width="13" height="6" rx="2" fill="#2fbf71" stroke="' + inkt + '" stroke-width="1.2"/>' +
        '<path d="M12 -13l2 6" stroke="' + inkt + '" stroke-width="1.6" stroke-linecap="round"/>' +
        '<circle cx="15" cy="0" r="2.2" fill="' + inkt + '"/><circle cx="23" cy="0" r="2.2" fill="' + inkt + '"/></g>';
      h = '<g transform="translate(112 ' + y + ')' + S + '"><g class="hz-pop-heen" style="--ver:86px;animation-duration:5s"><g transform="rotate(18)">' +
        poppetje(inkt, mee, true) + '</g>' + maai + '<path d="M-8 -6h-6M-8 -2h-9M-8 2h-5" stroke="' + inkt + '" stroke-width="1" stroke-opacity=".5" stroke-linecap="round"/></g></g>';
    }
    var vx = o.leeg ? 330 : 150;                                 // vrije plek: voor het huis, of op de oprit zonder auto's
    if (k === "vlieger") {
      h = plek(150, poppetje(inkt, arm("M4.5 -15l4 -8")) + '<g class="hz-pop-zwaai">' + L("M9 -24C20 -50 30 -60 38 -78", 0.8) +
        '<path d="M38 -88l7 9l-7 9l-7 -9z" fill="#e8553d" stroke="' + inkt + '" stroke-width="1"/>' + L("M38 -70q-3 6 1 9q-4 4 0 8", 0.8) + "</g>");
      bx = 150;
    } else if (k === "harken") {
      h = plek(150, poppetje(inkt, arm("M4.5 -15l5 4")) + L("M2 -22l14 22", 1.4) + L("M12 0h8M13 0l-1 2M16 0v2M19 0l1 2", 1) +
        '<path d="M20 0q6 -9 12 0z" fill="#d9822b" stroke="' + inkt + '" stroke-width="1"/>');
      h += '<g fill="#d9822b"><path class="hz-pop-val" d="M24 190l4 -2l-1 4z"/><path class="hz-pop-val" style="animation-delay:1.3s" d="M36 196l4 -2l-1 4z" fill="#c8553d"/>' +
        '<path class="hz-pop-val" style="animation-delay:2.6s" d="M18 200l4 -2l-1 4z"/></g>';
      bx = 160;
    } else if (k === "gieter") {
      h = plek(vx, poppetje(inkt, arm("M4.5 -15l5 1")) + '<path d="M8 -16h7v6h-7z" fill="#8ab4e8" stroke="' + inkt + '" stroke-width="1"/>' + L("M15 -15l5 -3", 1.2) +
        '<g fill="#5b9dff"><circle class="hz-pop-drup" cx="20" cy="-16" r=".9"/><circle class="hz-pop-drup" style="animation-delay:.2s" cx="21" cy="-15" r=".9"/><circle class="hz-pop-drup" style="animation-delay:.4s" cx="19.5" cy="-14" r=".9"/></g>' +
        L("M22 0v-7M27 0v-9", 1, "#3f8f3a") + '<circle cx="22" cy="-8" r="2.2" fill="#ff7ab8" stroke="' + inkt + '" stroke-width=".8"/><circle cx="27" cy="-10" r="2.2" fill="#ffd34d" stroke="' + inkt + '" stroke-width=".8"/>');
      bx = vx;
    } else if (k === "zonnen") {
      h = '<g transform="translate(' + vx + " " + y + ')' + S + '"><path d="M-12 0l6 -8h18l3 8" stroke="' + inkt + '" stroke-width="1.2" fill="none"/><path d="M-6 -8l-6 -10" stroke="' + inkt + '" stroke-width="1.2"/>' +
        '<path d="M-10 -9h22v-3h-20z" fill="#ff7ab8" stroke="' + inkt + '" stroke-width="1"/>' +
        '<g transform="translate(2 -11) rotate(-75)">' + poppetje(inkt, arm("M4.5 -15l-2 -6")) + '</g><path d="M-16.5 -12.5h4" stroke="' + inkt + '" stroke-width="2"/></g>';
      bx = vx;
    } else if (k === "bbq") {
      h = plek(vx, poppetje(inkt, '<g class="hz-pop-arm" transform="translate(4.5 -15)">' + L("M0 0l6 2l5 -2") + "</g>") +
        '<path d="M12 -12h14a7 6 0 0 1 -14 0z" fill="' + inkt + '"/>' + L("M15 -7l-3 7M23 -7l3 7", 1.2) + '<path d="M14 -13h3M19 -13h3" stroke="#c8553d" stroke-width="2" stroke-linecap="round"/>' +
        '<g fill="#cfd6df"><circle class="hz-pop-bel" cx="17" cy="-18" r="2"/><circle class="hz-pop-bel" style="animation-delay:.8s" cx="21" cy="-20" r="2.4"/></g>');
      bx = vx;
    } else if (k === "hond") {
      var hond = '<g transform="translate(18 0)"><g class="hz-pop-stap"><ellipse cx="0" cy="-6" rx="6" ry="3.4" fill="#b07a4a" stroke="' + inkt + '" stroke-width="1"/>' +
        '<circle cx="6" cy="-9" r="3" fill="#b07a4a" stroke="' + inkt + '" stroke-width="1"/><path d="M5 -12l1 -3l2 3" fill="#7a4f2a"/>' + L("M-4 -3v3M4 -3v3", 1.2) +
        '<g class="hz-pop-zwaai">' + L("M-6 -7l-4 -4", 1.2) + "</g></g></g>";
      h = '<g transform="translate(112 ' + y + ')' + S + '"><g class="hz-pop-heen" style="--ver:80px;animation-duration:20s">' + poppetje(inkt, arm("M4.5 -15l4 3"), true) + L("M8.5 -12q5 4 13 1", .8) + hond + "</g></g>";
      bx = 160;
    } else if (k === "voetbal") {
      h = plek(150, poppetje(inkt, arm("M4.5 -15l4 5")) + '<g class="hz-pop-stuit"><circle cx="14" cy="-3" r="3" fill="#fff" stroke="' + inkt + '" stroke-width="1"/><path d="M14 -4.5l1.3 1l-.5 1.5h-1.6l-.5 -1.5z" fill="' + inkt + '"/></g>');
      bx = 160;
    } else if (k === "fiets") {
      var fiets = '<circle cx="-8" cy="-5" r="5" fill="none" stroke="' + inkt + '" stroke-width="1.3"/><circle cx="10" cy="-5" r="5" fill="none" stroke="' + inkt + '" stroke-width="1.3"/>' +
        L("M-8 -5l6 -9h10l2 9M-2 -14l4 9h6M-3 -16h3M8 -14l1 -4h3", 1.3, "#e8553d");
      h = '<g transform="translate(110 ' + y + ')' + S + '"><g class="hz-pop-rij" style="--ver:90px">' + fiets + '<g transform="translate(0 -8)">' + poppetje(inkt, arm("M4.5 -15l5 1")) + "</g></g></g>";
      bx = 170;
    } else if (k === "vogels") {
      var vogel = function (x, d) { return '<g class="hz-pop-hup" style="animation-delay:' + d + 's"><path d="M' + x + ' -1a3 2.4 0 1 1 5 0z" fill="#5b7fa8" stroke="' + inkt + '" stroke-width=".8"/><path d="M' + (x + 5) + ' -2.5l2 .6l-2 .6z" fill="#ff9a3d"/></g>'; };
      h = plek(150, poppetje(inkt, arm("M4.5 -15l5 4")) + '<g fill="#d9b26a"><circle cx="11" cy="-.5" r=".7"/><circle cx="14" cy="-.4" r=".7"/><circle cx="17" cy="-.6" r=".7"/></g>' + vogel(12, 0) + vogel(19, .7));
      bx = 160;
    } else if (k === "jongleren") {
      var bal = function (kl, d) { return '<g class="hz-pop-jong" style="animation-delay:' + d + 's"><circle cx="-4" cy="-30" r="2" fill="' + kl + '" stroke="' + inkt + '" stroke-width=".8"/></g>'; };
      h = plek(150, poppetje(inkt, arm("M4.5 -15l4 -4")) + L("M-4.5 -15l-3 -3") + bal("#e8553d", 0) + bal("#ffd34d", .4) + bal("#2fbf71", .8));
      bx = 160;
    } else if (k === "selfie") {
      h = plek(150, poppetje(inkt, arm("M4.5 -15l6 -9")) + '<rect x="9" y="-29" width="4" height="7" rx="1" fill="' + inkt + '"/>' +
        '<circle class="hz-pop-flits" cx="11" cy="-27" r="9" fill="#fff"/>');
      bx = 160;
    } else if (k === "meter") {
      h = plek(400, poppetje(inkt, arm("M4.5 -15l5 2")) + '<rect x="8" y="-19" width="6" height="8" rx="1" fill="#fff" stroke="' + inkt + '" stroke-width="1" transform="rotate(10 11 -15)"/>' +
        L("M9.5 -16h3M9.5 -14h3", .6), false);
      bx = 380;
    } else if (k === "knuffel") {
      var wx = o.wp != null ? o.wp : 76;
      h = plek(wx + 24, poppetje(inkt, arm("M4.5 -15l5 1")) + L("M-4.5 -15l5 1") +
        '<g fill="#ff5d7a"><path class="hz-pop-bel" d="M10 -28c-2 -3 -5 0 0 4c5 -4 2 -7 0 -4z"/><path class="hz-pop-bel" style="animation-delay:1.1s" d="M14 -32c-1.5 -2.4 -4 0 0 3c4 -3 1.5 -5.4 0 -3z"/></g>', true);
      bx = wx + 24;
    } else if (k === "dak") {
      h = plek(196, '<g class="hz-pop-spring">' + poppetje(inkt, arm("M4.5 -15l4 -8")) + L("M-4.5 -15l-4 -8") + "</g>", false, o.nok);
      bx = 196; by = o.nok - 66;
    } else if (k === "handstand") {
      h = '<g transform="translate(150 ' + y + ')' + S + '"><g class="hz-pop-zwaai"><g transform="rotate(180 0 -13.6)">' + poppetje(inkt, arm("M4.5 -15l1 9")) + L("M-4.5 -15l-1 9") + "</g></g></g>";
      bx = 150; by = y - 72;
    } else if (k === "stekker") {
      h = '<g transform="translate(112 ' + y + ')' + S + '"><g class="hz-pop-heen" style="--ver:86px;animation-duration:12s">' + poppetje(inkt, arm("M4.5 -15l6 -2"), true) +
        '<rect x="10" y="-22" width="9" height="11" rx="2.5" fill="#2fbf71" stroke="' + inkt + '" stroke-width="1"/>' + L("M13 -22v-4M16.5 -22v-4", 1.4) + L("M14.5 -11q-4 10 -26 11", 1.2) + "</g></g>";
      bx = 160;
    } else if (k === "duur") {
      h = plek(150, poppetje(inkt, arm("M4.5 -15l-2.5 -6")) +
        '<g class="hz-pop-bel"><text x="10" y="-28" style="font: 800 9px Inter, system-ui, sans-serif; fill: #e8553d">€</text></g>' +
        '<g class="hz-pop-bel" style="animation-delay:1s"><text x="15" y="-22" style="font: 800 7px Inter, system-ui, sans-serif; fill: #e8553d">€</text></g>');
      bx = 160;
    } else if (k === "plassen") {
      var spat = function (dx, d) { return '<circle class="hz-pop-spat" style="--dx:' + dx + 'px;animation-delay:' + d + 's" cx="0" cy="0" r="1" fill="#5b9dff"/>'; };
      h = plek(150, '<ellipse cx="0" cy="1" rx="13" ry="2.4" fill="#5b7fa8" opacity=".6"/><g class="hz-pop-spring">' + poppetje(inkt, arm("M4.5 -15l5 -5")) +
        '<path d="M-4.5 -2h4v2h-4zM.5 -2h4v2h-4z" fill="#ffd34d"/></g>' + spat(-8, 0) + spat(7, .1) + spat(-4, .2) + spat(10, .3));
      bx = 160;
    } else if (k === "eendje") {
      h = plek(150, poppetje(inkt, '<path d="M4.5 -15l3 -2" stroke="' + inkt + '" stroke-width="1.8" stroke-linecap="round"/><path d="M7 -17v-15" stroke="' + inkt + '" stroke-width="1.3"/>' +
        '<path d="M-6 -31a13 9 0 0 1 26 0z" fill="#2659c4" stroke="' + inkt + '" stroke-width="1.2"/>') +
        '<ellipse cx="22" cy="1" rx="11" ry="2.4" fill="#5b7fa8" opacity=".6"/><g class="hz-pop-zwaai"><path d="M18 -1a4 3 0 0 1 8 0z" fill="#ffd34d" stroke="' + inkt + '" stroke-width=".8"/>' +
        '<circle cx="25" cy="-3.5" r="2" fill="#ffd34d" stroke="' + inkt + '" stroke-width=".8"/><path d="M27 -3.6l2 .5l-2 .6z" fill="#ff9a3d"/></g>');
      bx = 170;
    } else if (k === "sneeuwbal") {
      h = plek(150, poppetje(inkt, '<g class="hz-pop-arm" transform="translate(4.5 -15)">' + L("M0 0l5 -6") + "</g>") +
        '<g class="hz-pop-gooi"><circle cx="10" cy="-22" r="2.2" fill="#fff" stroke="' + inkt + '" stroke-width=".8"/></g>');
      bx = 160;
    } else if (k === "scheppen") {
      h = plek(150, poppetje(inkt, arm("M4.5 -15l5 5")) + L("M0 -20l12 18", 1.3) + '<path d="M10 -2l6 -2l1 4h-6z" fill="#8ab4e8" stroke="' + inkt + '" stroke-width=".9"/>' +
        '<path d="M18 0q6 -10 13 0z" fill="#fff" stroke="' + inkt + '" stroke-width=".9"/>');
      bx = 160;
    } else if (k === "tv") {
      // binnen, beneden rechts: op de bank voor de tv
      var bank = '<path d="M-9 -2h18v-6h-18z" fill="#b18cff" stroke="' + inkt + '" stroke-width="1"/>';
      h = '<g transform="translate(206 ' + (GRd - 1) + ')' + S + '">' + bank + '<g transform="translate(0 -4)">' + poppetje(inkt, arm("M4.5 -15l5 3")) + "</g>" + bank.replace("-8h", "-5h") +
        '<rect x="20" y="-22" width="12" height="9" rx="1" fill="' + inkt + '"/><rect class="hz-pop-flik" x="21" y="-21" width="10" height="7" fill="#8fd0ff"/>' + L("M26 -13v4M22 -9h8", 1.2) + "</g>";
      bx = 214; by = o.dakY + 14;
    } else if (k === "zaklamp") {
      h = '<g transform="translate(112 ' + y + ')' + S + '"><g class="hz-pop-heen" style="--ver:86px;animation-duration:22s">' + poppetje(inkt, arm("M4.5 -15l5 1"), true) +
        '<path d="M9 -15l30 -10v20z" fill="#fff3cf" opacity=".45"/><rect x="7" y="-16.5" width="4" height="3" fill="#cfd6df" stroke="' + inkt + '" stroke-width=".6"/></g></g>';
      bx = 160;
    } else if (k === "kampvuur") {
      h = plek(vx, poppetje(inkt, arm("M4.5 -15l12 -3")) + L("M16 -18l3 -1", 1, "#fff") +
        '<path d="M14 0l10 -3M14 -3l10 3" stroke="#7a4f2a" stroke-width="2" stroke-linecap="round"/>' +
        '<g class="hz-pop-vuur"><path d="M19 -2c-5 -4 -2 -9 0 -12c1 4 5 5 3 10q-1 2 -3 2z" fill="#ff9a3d"/><path d="M19 -2c-2 -2 -1 -5 0 -6c1 2 2 4 0 6z" fill="#ffd34d"/></g>' +
        '<circle cx="19" cy="-8" r="12" fill="#ff9a3d" opacity=".12"/>');
      bx = vx;
    } else if (k === "uil") {
      // een uil in de boom; de klusjesman slaapt
      h = '<g transform="translate(30 ' + (GRd - 52) + ')' + S + '"><ellipse cx="0" cy="0" rx="5" ry="6.5" fill="#8a6a4a" stroke="' + inkt + '" stroke-width="1"/>' +
        '<path d="M-4 -5l1 -4l2 3M4 -5l-1 -4l-2 3" fill="#8a6a4a" stroke="' + inkt + '" stroke-width=".8"/><g class="hz-pop-knip"><circle cx="-2" cy="-2" r="1.8" fill="#ffd34d"/><circle cx="2" cy="-2" r="1.8" fill="#ffd34d"/>' +
        '<circle cx="-2" cy="-2" r=".7" fill="' + inkt + '"/><circle cx="2" cy="-2" r=".7" fill="' + inkt + '"/></g><path d="M-1 0l1 2l1 -2z" fill="#ff9a3d"/></g>';
      bx = 60; by = GRd - 100;
    }
    if (h && zeg) {
      // tekstwolkje boven het hoofd: [x, y van de voeten, hoe ver hij loopt, in hoeveel seconden, hoogte boven de voeten]
      var kop = 27 * Z, F;
      var LOOP = { maaien: [112, y, 86, 16], hol: [112, y, 86, 5], paraplu: [112, y, 86, 24], slaapwandelen: [120, y, 80, 30], hond: [112, y, 80, 20],
        fiets: [110, y - 8 * Z, 90, 14], stekker: [112, y, 86, 12], zaklamp: [112, y, 86, 22] };
      var VAST = { panelen: [typeof px === "number" ? px : 250, typeof py === "number" ? py : o.dakY], auto: [typeof cx === "number" ? cx : 320, GRd],
        sneeuwpop: [320, y], sterren: [330, y], dansen: [150, y - 3 * Z], zwaaien: [150, y], zonnen: [vx - 8 * Z, y, 0, 0, 14 * Z],
        tv: [206, GRd - 1 - 4 * Z], handstand: [150, y], uil: [30, GRd - 52, 0, 0, 8 * Z], slapen: [226, o.dakY + 30, 0, 0, 0] };
      F = LOOP[k] || VAST[k] || (lx0 != null ? [lx0, ly0] : [200, y]);
      var ver = (F[2] || 0) * Z, duur = F[3] || 0, boven = F[4] != null ? F[4] : kop;
      var bw = 12 + zeg.length * 6.4;
      var links = clamp(F[0] - bw / 2, 6, W - bw - 6 - ver), staart = clamp(F[0] - links, 12, bw - 12);
      var top = F[1] - boven - 27;
      h += '<g transform="translate(' + links.toFixed(1) + " " + top.toFixed(1) + ')">' + (ver ? '<g class="hz-pop-volg" style="--ver:' + ver.toFixed(1) + 'px;animation-duration:' + duur + 's">' : "<g>") +
        '<g class="hz-pop-zeg"><rect width="' + bw + '" height="20" rx="10" fill="#fff" stroke="' + inkt + '" stroke-width="1.1"/>' +
        '<path d="M' + (staart - 4) + ' 19.4l4 5l3 -5.4" fill="#fff" stroke="' + inkt + '" stroke-width="1.1" stroke-linejoin="round"/>' +
        '<text x="' + bw / 2 + '" y="14" text-anchor="middle" style="font: 700 12px Inter, system-ui, sans-serif; fill: ' + inkt + ' !important">' + esc(zeg) + "</text></g></g></g>";
    }
    return h ? '<style>' + POP_CSS + '</style><g class="hz-pop" aria-hidden="true">' + h + "</g>" : "";
  }

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

    if (s.poppetje !== false)
      h += klusje({ inkt: inkt, gr: GR, dakY: dakY, fase: fase, nat: nat, sneeuw: nat && wr.t != null && wr.t <= 1, t: wr.t,
        panelen: !!s.has_panels, auto: autos.length === 1 ? AX[0] + 44 : null, links: autos.length > 0,
        goedkoop: pr.niveau === "goedkoop", duur: pr.niveau === "duur", forceer: svg._klus, schaal: parseFloat(svg.getAttribute && svg.getAttribute("data-pop")) || 1.7, twee: autos.length > 1, leeg: autos.length === 0,
        wp: buiten ? (bat ? 58 : 76) : null, nok: nokY });
    // tik op het huis: de klusjesman doet iets anders (en na een minuut weer wat bij het moment past)
    if (!svg._klik && svg.addEventListener) {
      svg._klik = true;
      svg.addEventListener("click", function (ev) {
        ev.stopPropagation();
        svg._klus = svg._klus == null ? 0 : svg._klus + 1;
        clearTimeout(svg._klusT); svg._klusT = setTimeout(function () { svg._klus = null; if (svg._s) teken(svg, svg._s[0], svg._s[1]); }, 60000);
        if (svg._s) teken(svg, svg._s[0], svg._s[1]);
      });
    }
    svg._s = [s, onder];
    // elke 3 minuten iets anders, ook als er niets aan de status verandert
    if (!svg._klusI && window.setInterval) svg._klusI = setInterval(function () { if (svg.isConnected && svg._s) teken(svg, svg._s[0], svg._s[1]); }, 30000);
    h += "</g>";
    if (!los) h += '<rect x=".5" y=".5" width="' + (W - 1) + '" height="' + (H - 1) + '" rx="22" fill="none" stroke="#13202b" stroke-opacity=".12"/>';
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
    if (g != null) h += chip(kx + 2, GR + 32, (g < -30 ? "Terug " : "Net ") + kw(g) + " kW", g < -30 ? "#d6f5e3" : "#e3ecff", "end", "net");
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
  var CSS = ".hz { width: 100%; height: auto; border-radius: 22px; } .hz .hz-labels text { fill: #13202b !important; } .hz .hz-labels .hz-naam text { fill: #ffffff !important; } .hz text { font: 600 11.5px \"Inter\", system-ui, sans-serif; fill: #13202b; } .hz .hz-wolk { animation: hzDrijf 50s ease-in-out infinite alternate; } .hz .hz-boom { animation: hzWuif 3s ease-in-out infinite alternate; } .hz .hz-ster { animation: hzTwinkel 4s ease-in-out infinite alternate; } .hz .hz-regen { stroke: #5b7fa8; stroke-width: 1.4; stroke-linecap: round; opacity: .75; animation: hzVal .9s linear infinite; } .hz .hz-regen.sneeuw { fill: #fff; stroke: none; animation-duration: 5s; } .hz .hz-gloed { animation: hzGloed 4s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; } .hz .hz-stroom { fill: none; stroke-width: 3.2; stroke-linecap: round; stroke-dasharray: 2 12; animation: dash 1s linear infinite; } .hz .hz-stroom.zon { stroke: #ffb224; } .hz .hz-stroom.in { stroke: #2659c4; } .hz .hz-stroom.uit { stroke: #2fbf71; } .hz .hz-stroom.laad { stroke: #2bb673; } .hz .hz-straal { stroke: #ffd56b; stroke-width: 10; stroke-linecap: round; stroke-opacity: .35; fill: none; } .hz .hz-paneel.aan path { fill: #2d5a9e; animation: hzGlans 3s ease-in-out infinite alternate; } .hz .hz-aan { fill: #ffd27a; opacity: .45; animation: hzAan 1.6s ease-in-out infinite alternate; } .hz .hz-aan.bat { fill: #8fe0b5; } .hz .hz-fan { animation: hzDraai 1s linear infinite; } .hz .hz-trommel { animation: hzDraai 1.4s linear infinite; transform-box: view-box; transform-origin: 0 -11px; } .hz .hz-damp { opacity: .6; animation: hzDamp 2.4s ease-in-out infinite; } @keyframes hzDrijf { from { transform: translateX(-22px); } to { transform: translateX(26px); } } @keyframes hzWuif { from { transform: rotate(calc(var(--a) * -1)); } to { transform: rotate(var(--a)); } } @keyframes hzTwinkel { from { opacity: .25; } to { opacity: 1; } } @keyframes hzVal { from { transform: translateY(0); } to { transform: translateY(40px); } } @keyframes hzGloed { from { transform: scale(.92); } to { transform: scale(1.08); } } @keyframes hzGlans { from { fill: #23406e; } to { fill: #3b6fbf; } } @keyframes hzAan { from { opacity: .2; } to { opacity: .55; } } @keyframes hzDraai { to { transform: rotate(360deg); } } @keyframes hzDamp { 0% { transform: translateY(2px); opacity: 0; } 50% { opacity: .6; } 100% { transform: translateY(-6px); opacity: 0; } } @media (prefers-reduced-motion: reduce) { .hz * { animation: none !important; } } @keyframes dash { to { stroke-dashoffset: -16; } }";
  window.zsHuis = { teken: teken, soortVan: soortVan, css: CSS };
})();
