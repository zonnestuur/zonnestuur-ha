/* Zonnestuur — vaktermen uitgelegd in gewone taal (B1).
 * De eerste keer dat een woord op de pagina staat, krijgt het een stippellijn; tik erop voor de uitleg.
 * Waarom: 1 op de 5 Nederlanders heeft moeite met lezen of digitale vaardigheden (Stichting Lezen en Schrijven 2024),
 * en energie-apps worden beter begrepen als ze de woorden zelf uitleggen (Eiting & Staudt, AMCIS 2025). */
(function () {
  "use strict";
  var W = [
    ["kWh", "Kilowattuur: de eenheid op je energierekening. Een wasbeurt gebruikt ongeveer 1 kWh.", true],
    ["kWp", "Kilowattpiek: hoeveel stroom al je zonnepanelen samen maximaal maken. Het staat op de factuur van de panelen.", true],
    ["kW", "Kilowatt: hoeveel stroom iets op dit moment gebruikt. Een waterkoker gebruikt ongeveer 2 kW.", true],
    ["P1-poort", "Het kleine poortje onder aan je slimme meter. Daar kan een kastje of kabel in die je verbruik doorgeeft.", true],
    ["P1", "Het kleine poortje onder aan je slimme meter (de P1-poort). Daar kan een kastje of kabel in die je verbruik doorgeeft.", true],
    ["DSMR", "De norm van Nederlandse slimme meters. Het nummer staat op de meter zelf.", true],
    ["OCPP", "Een taal waarmee laadpalen met andere systemen praten. Veel laadpalen kunnen dit; je zet het aan in de app van de laadpaal.", true],
    ["Modbus", "Een taal waarmee omvormers, batterijen en warmtepompen via je netwerk met andere systemen praten.", true],
    ["MQTT", "Een manier waarop slimme apparaten berichtjes aan elkaar doorgeven. Alleen nodig als je zelf iets bouwt.", true],
    ["API", "Een aansluiting waarmee programma's gegevens met elkaar uitwisselen.", true],
    ["IP-adres", "Het 'huisnummer' van een apparaat in je wifi, bijvoorbeeld 192.168.1.20. Je vindt het in de app van je modem of met de gratis app Fing.", false],
    ["SG-ready", "Twee aansluitdraden op een warmtepomp. Daarmee geef je hem een seintje: nu is de stroom goedkoop of van de zon.", false],
    ["dynamisch contract", "Een energiecontract waarbij de stroomprijs elk uur (of elk kwartier) anders is.", false],
    ["dynamische prijzen", "Stroomprijzen die elk uur (of elk kwartier) anders zijn.", false],
    ["salderen", "Teruggeleverde stroom wegstrepen tegen stroom die je gebruikt. Dat stopt op 1 januari 2027.", false],
    ["terugleverkosten", "Geld dat je energieleverancier vraagt voor stroom die je aan het net teruggeeft.", false],
    ["omvormer", "Het kastje bij je zonnepanelen dat de stroom geschikt maakt voor je huis. Het merk staat op het kastje.", false],
    ["koppelmotor", "Het deel van Zonnestuur dat met de apps en apparaten van andere merken praat.", false]
  ];
  var NIET = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|BUTTON|A|LABEL|SUMMARY|CODE|H1|H2|H3|B|STRONG|PRE|SVG|TITLE|NOSCRIPT)$/;
  var RE = W.map(function (w) {
    var t = w[0].replace(/[-]/g, "\\-");
    return new RegExp("(^|[^A-Za-zÀ-ÿ0-9-])(" + t + ")(?![A-Za-zÀ-ÿ0-9-])", w[2] ? "" : "i");
  });
  var blad = null, open = null;

  function stijl() {
    if (document.getElementById("wb-stijl")) return;
    var s = document.createElement("style");
    s.id = "wb-stijl";
    s.textContent = ".wb{all:unset;cursor:help;border-bottom:1.5px dotted currentColor;font:inherit;color:inherit}" +
      ".wb:focus-visible{outline:2px solid var(--zs-zon,#e8a317);outline-offset:2px;border-radius:2px}" +
      "#wb-blad{position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom));max-width:440px;margin:0 auto;z-index:9999;" +
      "background:var(--zs-vlak,#fff);color:var(--zs-ink,#16202a);border:1px solid var(--zs-lijn,#d6dde3);border-radius:16px;padding:14px 16px;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.18);font-size:15px;line-height:1.45}" +
      "#wb-blad b{display:block;margin-bottom:2px}#wb-blad button{float:right;margin:-4px -6px 0 8px;min-width:32px;min-height:32px;border:0;" +
      "background:none;color:inherit;font-size:20px;cursor:pointer}";
    document.head.appendChild(s);
  }
  function sluit() {
    if (blad) { blad.remove(); blad = null; }
    if (open) { open.setAttribute("aria-expanded", "false"); open.focus(); open = null; }
  }
  function toon(knop) {
    var w = W[+knop.dataset.w];
    sluit();
    blad = document.createElement("div");
    blad.id = "wb-blad"; blad.setAttribute("role", "dialog"); blad.setAttribute("aria-label", "Uitleg: " + w[0]);
    var x = document.createElement("button"); x.type = "button"; x.setAttribute("aria-label", "Sluiten"); x.textContent = "×"; x.onclick = sluit;
    var b = document.createElement("b"); b.textContent = w[2] ? w[0] : w[0].charAt(0).toUpperCase() + w[0].slice(1);
    var p = document.createElement("span"); p.textContent = w[1];
    blad.appendChild(x); blad.appendChild(b); blad.appendChild(p);
    document.body.appendChild(blad);
    open = knop; knop.setAttribute("aria-expanded", "true");
    x.focus();
  }
  function bezig() {
    var al = {};
    document.querySelectorAll(".wb").forEach(function (e) { al[e.dataset.w] = 1; });
    var nodig = W.map(function (_, i) { return !al[i]; });
    if (!nodig.some(Boolean)) return;
    var root = document.querySelector("main") || document.body;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        for (var e = n.parentNode; e && e !== root; e = e.parentNode) {
          if (NIET.test(e.nodeName.toUpperCase()) || e.hidden || (e.classList && (e.classList.contains("wb") || e.classList.contains("tag") ||
              e.classList.contains("num"))) || (e.dataset && "geenUitleg" in e.dataset)) return NodeFilter.FILTER_REJECT;
        }
        return n.nodeValue.length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var lijst = [], n;
    while ((n = tw.nextNode())) lijst.push(n);
    for (var i = 0; i < W.length; i++) {
      if (!nodig[i]) continue;
      for (var j = 0; j < lijst.length; j++) {
        var t = lijst[j], m = RE[i].exec(t.nodeValue);
        if (!m || !t.parentNode) continue;
        var start = m.index + m[1].length, rest = t.splitText(start);
        rest.nodeValue = rest.nodeValue.slice(m[2].length);
        var k = document.createElement("button");
        k.type = "button"; k.className = "wb"; k.dataset.w = String(i); k.textContent = m[2];
        k.setAttribute("aria-expanded", "false"); k.title = "Wat is dit?";
        t.parentNode.insertBefore(k, rest);
        lijst.splice(j + 1, 0, rest);
        break;
      }
    }
  }
  var timer = null;
  function later() { clearTimeout(timer); timer = setTimeout(bezig, 400); }
  function start() {
    stijl(); bezig();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", function (e) {
      var k = e.target.closest && e.target.closest(".wb");
      if (k) { e.preventDefault(); e.stopPropagation(); if (open === k) sluit(); else toon(k); return; }
      if (blad && !blad.contains(e.target)) sluit();
    }, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && blad) sluit(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
