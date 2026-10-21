/* Zonnestuur: één vaste balk met drie tabbladen op elke pagina (Vandaag, Apparaten, Meer).
   Vervangt de losse links per pagina ('← Dashboard', 'Instellingen', de onderdelen-balk van het dashboard). */
(function () {
  if (window.top !== window.self || document.querySelector(".zs-tabs")) return;    // niet in een ingesloten venster
  var pad = location.pathname.replace(/\/+$/, "").split("/").pop() || "";
  var tab = (pad === "" || pad === "index.html") ? "vandaag" : (pad === "apparaten" || pad === "koppelen") ? "apparaten" : "meer";
  var ICON = {
    vandaag: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    apparaten: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    meer: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
  };
  var TABS = [["vandaag", "./", "Vandaag"], ["apparaten", "apparaten", "Apparaten"], ["meer", "meer", "Meer"]];
  var css = document.createElement("style");
  css.textContent = [
    ".zs-tabs{position:fixed!important;margin:0!important;overflow:visible!important;flex-wrap:nowrap!important;left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom));z-index:50;display:flex;gap:4px;padding:5px;",
    "border-radius:20px;background:color-mix(in srgb,var(--zs-vlak,#fff) 88%,transparent);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);",
    "border:1px solid var(--zs-lijn,rgba(14,17,22,.10));box-shadow:0 10px 30px -12px rgba(14,17,22,.35);width:min(420px,calc(100% - 24px))}",
    ".zs-tabs a{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 4px 6px;border-radius:15px;text-decoration:none;",
    "color:var(--zs-ink2,#5c6470);font:600 12px/1.2 Inter,system-ui,sans-serif;min-height:48px;justify-content:center}",
    ".zs-tabs a svg{width:22px;height:22px}",
    ".zs-tabs a[aria-current=page]{background:var(--zs-ink,#0e1116);color:var(--zs-vlak,#fff)}",
    ".zs-tabs a:focus-visible{outline:2px solid #2f5bdb;outline-offset:2px}",
    "body.zs-met-tabs{padding-bottom:calc(84px + env(safe-area-inset-bottom))}",
    /* oude losse navigatie weg: alles loopt nu via de drie tabbladen */
    "body.zs-met-tabs #secnav,body.zs-met-tabs header.top a.link,body.zs-met-tabs header.top a.icon-btn[href],body.zs-met-tabs .naar-dash{display:none!important}",
    /* computer: een rustige balk bovenaan in het midden, naast het logo */
    "@media (min-width:900px){.zs-tabs{bottom:auto;top:38px;width:auto;padding:4px;border-radius:16px;gap:2px}",
    ".zs-tabs a{flex-direction:row;gap:8px;padding:8px 16px;min-height:40px;font-size:14px;border-radius:12px}",
    ".zs-tabs a svg{width:18px;height:18px}body.zs-met-tabs{padding-bottom:0}}",
    "@media print{.zs-tabs{display:none}body.zs-met-tabs{padding-bottom:0}}"
  ].join("");
  document.head.appendChild(css);
  var nav = document.createElement("nav");
  nav.className = "zs-tabs"; nav.setAttribute("aria-label", "Hoofdmenu");
  nav.innerHTML = TABS.map(function (t) {
    return '<a href="' + t[1] + '"' + (t[0] === tab ? ' aria-current="page"' : "") + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[t[0]] + "</svg><span>" + t[2] + "</span></a>";
  }).join("");
  function zet() {
    document.body.appendChild(nav);
    document.body.classList.add("zs-met-tabs");
    // '← Dashboard' op onderliggende pagina's: terug naar waar ze vandaan komen (Meer)
    var terug = document.querySelectorAll(".top > a[href='./'], header > a[href='./']");
    for (var i = 0; i < terug.length; i++) {
      if (/^\s*←/.test(terug[i].textContent)) { terug[i].href = "meer"; terug[i].textContent = "← Meer"; }
    }
  }
  if (document.body) zet(); else document.addEventListener("DOMContentLoaded", zet);
})();
