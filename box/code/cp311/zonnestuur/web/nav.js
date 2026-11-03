/* Zonnestuur: één vaste balk met vijf tabbladen op elke pagina (Home, Apparaten, Planning, Inzichten, Meer).
   Op de telefoon onderin over de hele breedte, op een groot scherm in de kopregel naast het logo.
   Werkt ook binnen de app van de koppelmotor (ingesloten venster); niet in een voorbeeld binnen een eigen pagina. */
(function () {
  if (document.querySelector(".zs-tabs")) return;
  try { if (window.top !== window.self && window.parent.document.querySelector(".zs-tabs")) return; } catch (e) {}
  if (/[?&](kaal|voorbeeld)=1/.test(location.search)) return;
  // in de app van de koppelmotor staat er '/api/hassio_ingress/<sleutel>' voor: dat is Home, niet de paginanaam
  var pad = location.pathname.replace(/^.*\/hassio_ingress\/[^/]+/, "").replace(/\/+$/, "").split("/").pop() || "";
  var zoek = location.search;
  var tab = (pad === "" || pad === "index.html") ? "home"
    : (pad === "apparaten" || pad === "koppelen" || pad === "apparaat" || pad === "verwarming" || pad === "warmtepomp" || (pad === "instellingen" && /[?&](apparaat|onderdeel)=/.test(zoek) && !/[?&]van=inst/.test(zoek))) ? "apparaten"
    : /^(planning|tarieven|sturing)$/.test(pad) ? "tarieven"
    : /^(inzicht|opbrengst|rapport|vergelijk|laadtijdlijn|brein|besluiten|benchmark)$/.test(pad) ? "inzicht" : "meer";
  var ICON = {
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    apparaten: '<rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    tarieven: '<path d="M4 18l5-6 4 3 7-8"/><path d="M15 7h5v5"/><path d="M4 21h16"/>',
    inzicht: '<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>',
    meer: '<circle cx="5.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.5" cy="12" r="1.5"/>'
  };
  var TABS = [["home", "./", "Home"], ["apparaten", "apparaten", "Apparaten"], ["tarieven", "planning", "Planning"], ["inzicht", "inzicht", "Inzichten"], ["meer", "meer", "Meer"]];
  var css = document.createElement("style");
  css.textContent = [
    /* 2027: zwevende balk van glas (alleen de navigatie is glas; de inhoud blijft effen en goed leesbaar) */
    ".zs-tabs{position:fixed!important;margin:0!important;overflow:visible!important;flex-wrap:nowrap!important;left:12px;right:12px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:50;display:flex;",
    "padding:6px;border-radius:28px;background:color-mix(in srgb,var(--zs-vlak,#0f1c2f) 72%,transparent);",
    "backdrop-filter:blur(22px) saturate(1.6);-webkit-backdrop-filter:blur(22px) saturate(1.6);",
    "box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 0 1px var(--zs-lijn,rgba(140,172,220,.18)),0 18px 40px -16px rgba(0,0,0,.6)}",
    "@media (prefers-reduced-transparency:reduce){.zs-tabs{background:var(--zs-vlak,#0f1c2f);backdrop-filter:none;-webkit-backdrop-filter:none}}",
    ".zs-tabs a{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 2px 5px;border-radius:22px;text-decoration:none;",
    "color:var(--zs-ink2,#a6b5ca);font:600 11px/1.2 Inter,system-ui,sans-serif;min-height:52px;justify-content:center;position:relative;transition:background .2s ease,color .2s ease}",
    ".zs-tabs a svg{width:23px;height:23px}",
    ".zs-tabs a[aria-current=page]{color:var(--zs-ink,#eef3fa)}",
    /* 0.98: het gekozen tabblad is een losse pil, zodat hij bij het wisselen van pagina naar zijn nieuwe plek glijdt */
    ".zs-tabs .zs-pil{position:absolute;inset:0;border-radius:inherit;z-index:-1;background:color-mix(in srgb,var(--zs-knop,#ffb547) 20%,transparent);",
    "box-shadow:inset 0 1px 0 rgba(255,255,255,.07)}",
    ".zs-tabs a{isolation:isolate}",
    ".zs-tabs a:active svg{scale:.88}.zs-tabs a svg{transition:scale .4s var(--zs-veer,ease)}",
    /* glas met een lichtrand: bovenkant vangt licht, onderkant iets donkerder (Liquid Glass, maar rustig) */
    ".zs-tabs:not(.in-kop)::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;",
    "background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,0) 38%,rgba(0,0,0,0) 70%,rgba(0,0,0,.10));mix-blend-mode:soft-light}",
    "@media (prefers-reduced-transparency:reduce){.zs-tabs::before{display:none}}",
    ".zs-tabs a[aria-current=page] svg{color:var(--zs-accent,#ffb547)}",
    ".zs-tabs a:focus-visible{outline:2px solid var(--zs-knop,#2f7cf6);outline-offset:-2px}",
    "body.zs-met-tabs{padding-bottom:calc(96px + env(safe-area-inset-bottom))}",
    /* oude losse navigatie weg: alles loopt nu via de tabbladen */
    "body.zs-met-tabs #secnav,body.zs-met-tabs header.top a.link,body.zs-met-tabs header.top a.icon-btn[href]:not(.blijf),body.zs-met-tabs .naar-dash{display:none!important}",
    /* Daglicht (0.99) — computer: vaste menubalk aan de zijkant met logo, de vijf onderdelen en onderaan hulp */
    ".zs-tabs.rail{position:fixed!important;left:0;top:0;bottom:0;right:auto;width:248px;flex-direction:column;align-items:stretch;gap:4px;padding:26px 16px 22px;border-radius:0;",
    "background:var(--zs-dag,#0b0d11);box-shadow:1px 0 0 var(--zs-lijn,rgba(255,255,255,.08));backdrop-filter:none;-webkit-backdrop-filter:none}",
    ".zs-tabs.rail::before{display:none}",
    ".zs-tabs.rail .zs-merk{display:flex;align-items:center;gap:10px;margin:0 10px 26px;font:750 19px/1 'Inter Tight',Inter,sans-serif;letter-spacing:-.02em;color:var(--zs-ink,#f3efe8);text-decoration:none}",
    ".zs-tabs.rail .zs-merk img{width:28px;height:28px}",
    ".zs-tabs.rail a{flex:none;flex-direction:row;justify-content:flex-start;gap:12px;padding:11px 12px;min-height:44px;font-size:15px;font-weight:560;border-radius:14px}",
    ".zs-tabs.rail a svg{width:21px;height:21px}",
    ".zs-tabs.rail .zs-pil{background:var(--zs-vlak2,#1b1f27);box-shadow:none}",
    ".zs-tabs.rail a:hover:not([aria-current]){background:var(--zs-zacht,rgba(255,255,255,.05))}",
    ".zs-tabs.rail .zs-onder{margin-top:auto;display:flex;flex-direction:column;gap:2px}",
    ".zs-tabs.rail .zs-onder a{color:var(--zs-ink2,#a9adb4)}",
    ".zs-tabs:not(.rail) .zs-merk,.zs-tabs:not(.rail) .zs-onder{display:none}",
    "@media (min-width:1000px){body.zs-met-tabs{padding-bottom:0!important;padding-left:248px!important}",
    "body.zs-met-tabs header.top .brand,body.zs-met-tabs .top>.brand,body.zs-met-tabs .kop .brand{display:none!important}",
    ".testfase{margin-left:-248px;padding-left:calc(248px + 16px)!important}}",
    "@media print{.zs-tabs{display:none}body.zs-met-tabs{padding-bottom:0}}"
  ].join("");
  document.head.appendChild(css);
  var nav = document.createElement("nav");
  nav.className = "zs-tabs"; nav.setAttribute("aria-label", "Hoofdmenu");
  nav.innerHTML = '<a class="zs-merk" href="./" aria-label="Zonnestuur, naar Home"><img src="zon.svg" alt="">Zonnestuur</a>' + TABS.map(function (t) {
    return '<a href="' + t[1] + '"' + (t[0] === tab ? ' aria-current="page"' : "") + '>' + (t[0] === tab ? '<span class="zs-pil" aria-hidden="true"></span>' : "") + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[t[0]] + "</svg><span>" + t[2] + "</span></a>";
  }).join("") + '<div class="zs-onder"><a href="hulp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg><span>Hulp</span></a></div>';
  var mq = window.matchMedia ? window.matchMedia("(min-width: 1000px)") : null;
  function plaats() {
    var kop = document.querySelector("main > header.top, main > .top, header.top");
    var merk = kop && kop.querySelector(".brand");
    // Daglicht: op de computer altijd de zijbalk (ook zonder kopregel); op de telefoon de zwevende balk onderin
    if (nav.parentNode !== document.body) document.body.appendChild(nav);
    nav.classList.toggle("rail", !!(mq && mq.matches));
  }
  function zet() {
    document.body.appendChild(nav); plaats();
    if (mq) { if (mq.addEventListener) mq.addEventListener("change", plaats); else if (mq.addListener) mq.addListener(plaats); }
    document.body.classList.add("zs-met-tabs");
    // '← Dashboard' op onderliggende pagina's: terug naar het tabblad waar ze bij horen
    var terug = document.querySelectorAll(".top > a[href='./'], header > a[href='./']");
    for (var i = 0; i < terug.length; i++) {
      if (/^\s*←/.test(terug[i].textContent)) {
        var naar = tab === "inzicht" ? ["inzicht", "Inzichten"] : tab === "apparaten" ? ["apparaten", "Apparaten"] : tab === "tarieven" ? ["planning", "Planning"] : ["meer", "Meer"];
        terug[i].href = naar[0]; terug[i].textContent = "← " + naar[1];
      }
    }
  }
  if (document.body) zet(); else document.addEventListener("DOMContentLoaded", zet);

  // 0.98: kleur van de statusbalk van de telefoon gelijk aan het gekozen thema (niet aan dat van de telefoon)
  function statusbalk() {
    try {
      var kleur = getComputedStyle(document.body).backgroundColor;
      var metas = document.querySelectorAll('meta[name="theme-color"]');
      for (var i = 0; i < metas.length; i++) metas[i].remove();
      var m = document.createElement("meta"); m.name = "theme-color"; m.content = kleur; document.head.appendChild(m);
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", statusbalk); else statusbalk();
  try { new MutationObserver(statusbalk).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] }); } catch (e) {}

  // 0.98: een tabblad alvast ophalen zodra je het aanraakt of erboven zweeft: de pagina staat er dan meteen
  try {
    if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) {
      var sr = document.createElement("script"); sr.type = "speculationrules";
      sr.textContent = JSON.stringify({ prefetch: [{ where: { selector_matches: ".zs-tabs a" }, eagerness: "moderate" }] });
      document.head.appendChild(sr);
    }
  } catch (e) {}

  // 0.98: een kort tikje voelen bij schakelaars en tabbladen (alleen telefoons die trillen ondersteunen; niet bij 'minder beweging')
  var stil = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tik(ms) { if (!stil && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }
  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t && t.type === "checkbox" && t.closest && t.closest("label.check-row, .schakel, .sw")) tik(8);
  }, true);
  nav.addEventListener("click", function (ev) { var a = ev.target.closest && ev.target.closest("a"); if (a && !a.hasAttribute("aria-current")) tik(5); });
})();
