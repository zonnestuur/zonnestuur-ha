/* Zonnestuur: één vaste balk met vijf tabbladen op elke pagina (Home, Apparaten, Tarieven, Inzichten, Meer).
   Op de telefoon onderin over de hele breedte, op een groot scherm in de kopregel naast het logo.
   Werkt ook binnen de app van de koppelmotor (ingesloten venster); niet in een voorbeeld binnen een eigen pagina. */
(function () {
  if (document.querySelector(".zs-tabs")) return;
  try { if (window.top !== window.self && window.parent.document.querySelector(".zs-tabs")) return; } catch (e) {}
  if (/[?&](kaal|voorbeeld)=1/.test(location.search)) return;
  var pad = location.pathname.replace(/\/+$/, "").split("/").pop() || "";
  var zoek = location.search;
  var tab = (pad === "" || pad === "index.html") ? "home"
    : (pad === "apparaten" || pad === "koppelen" || pad === "apparaat" || pad === "verwarming" || (pad === "instellingen" && /[?&](apparaat|onderdeel)=/.test(zoek) && !/[?&]van=inst/.test(zoek))) ? "apparaten"
    : /^(tarieven|sturing)$/.test(pad) ? "tarieven"
    : /^(inzicht|opbrengst|rapport|vergelijk|laadtijdlijn)$/.test(pad) ? "inzicht" : "meer";
  var ICON = {
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    apparaten: '<rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    tarieven: '<path d="M4 18l5-6 4 3 7-8"/><path d="M15 7h5v5"/><path d="M4 21h16"/>',
    inzicht: '<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>',
    meer: '<circle cx="5.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.5" cy="12" r="1.5"/>'
  };
  var TABS = [["home", "./", "Home"], ["apparaten", "apparaten", "Apparaten"], ["tarieven", "tarieven", "Tarieven"], ["inzicht", "inzicht", "Inzichten"], ["meer", "meer", "Meer"]];
  var css = document.createElement("style");
  css.textContent = [
    ".zs-tabs{position:fixed!important;margin:0!important;overflow:visible!important;flex-wrap:nowrap!important;left:0;right:0;bottom:0;z-index:50;display:flex;",
    "padding:6px 6px calc(6px + env(safe-area-inset-bottom));background:color-mix(in srgb,var(--zs-dag,#08111f) 90%,transparent);",
    "backdrop-filter:blur(16px) saturate(1.3);-webkit-backdrop-filter:blur(16px) saturate(1.3);border-top:1px solid var(--zs-lijn,rgba(140,172,220,.15))}",
    ".zs-tabs a{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px 4px;border-radius:12px;text-decoration:none;",
    "color:var(--zs-ink3,#8597ae);font:600 11.5px/1.2 Inter,system-ui,sans-serif;min-height:50px;justify-content:center;position:relative}",
    ".zs-tabs a svg{width:24px;height:24px}",
    ".zs-tabs a[aria-current=page]{color:var(--zs-accent,#60a5fa)}",
    ".zs-tabs a[aria-current=page]::before{content:'';position:absolute;top:-7px;left:30%;right:30%;height:3px;border-radius:0 0 3px 3px;background:var(--zs-accent,#60a5fa)}",
    ".zs-tabs a:focus-visible{outline:2px solid var(--zs-knop,#2f7cf6);outline-offset:-2px}",
    "body.zs-met-tabs{padding-bottom:calc(76px + env(safe-area-inset-bottom))}",
    /* oude losse navigatie weg: alles loopt nu via de tabbladen */
    "body.zs-met-tabs #secnav,body.zs-met-tabs header.top a.link,body.zs-met-tabs header.top a.icon-btn[href]:not(.blijf),body.zs-met-tabs .naar-dash{display:none!important}",
    /* computer: in de kopregel */
    ".zs-tabs.in-kop{position:static!important;margin:0 auto!important;padding:4px;width:auto;border:1px solid var(--zs-lijn,rgba(140,172,220,.15));border-radius:16px;gap:2px;",
    "background:color-mix(in srgb,var(--zs-vlak,#0f1c2f) 92%,transparent)}",
    ".zs-tabs.in-kop a{flex-direction:row;gap:8px;padding:8px 14px;min-height:40px;font-size:14px;border-radius:12px}",
    ".zs-tabs.in-kop a svg{width:18px;height:18px}",
    ".zs-tabs.in-kop a[aria-current=page]{background:var(--zs-knop,#2f7cf6);color:var(--zs-knop-ink,#fff)}",
    ".zs-tabs.in-kop a[aria-current=page]::before{display:none}",
    "@media (min-width:900px){body.zs-met-tabs{padding-bottom:0}}",
    "@media print{.zs-tabs{display:none}body.zs-met-tabs{padding-bottom:0}}"
  ].join("");
  document.head.appendChild(css);
  var nav = document.createElement("nav");
  nav.className = "zs-tabs"; nav.setAttribute("aria-label", "Hoofdmenu");
  nav.innerHTML = TABS.map(function (t) {
    return '<a href="' + t[1] + '"' + (t[0] === tab ? ' aria-current="page"' : "") + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[t[0]] + "</svg><span>" + t[2] + "</span></a>";
  }).join("");
  var mq = window.matchMedia ? window.matchMedia("(min-width: 900px)") : null;
  function plaats() {
    var kop = document.querySelector("main > header.top, main > .top, header.top");
    var merk = kop && kop.querySelector(".brand");
    if (mq && mq.matches && kop) { nav.classList.add("in-kop"); if (merk && merk.nextSibling !== nav) merk.after(nav); else if (!merk) kop.appendChild(nav); }
    else { nav.classList.remove("in-kop"); if (nav.parentNode !== document.body) document.body.appendChild(nav); }
  }
  function zet() {
    document.body.appendChild(nav); plaats();
    if (mq) { if (mq.addEventListener) mq.addEventListener("change", plaats); else if (mq.addListener) mq.addListener(plaats); }
    document.body.classList.add("zs-met-tabs");
    // '← Dashboard' op onderliggende pagina's: terug naar het tabblad waar ze bij horen
    var terug = document.querySelectorAll(".top > a[href='./'], header > a[href='./']");
    for (var i = 0; i < terug.length; i++) {
      if (/^\s*←/.test(terug[i].textContent)) {
        var naar = tab === "inzicht" ? ["inzicht", "Inzichten"] : tab === "apparaten" ? ["apparaten", "Apparaten"] : tab === "tarieven" ? ["tarieven", "Tarieven"] : ["meer", "Meer"];
        terug[i].href = naar[0]; terug[i].textContent = "← " + naar[1];
      }
    }
  }
  if (document.body) zet(); else document.addEventListener("DOMContentLoaded", zet);
})();
