/* Het professortje van Zonnestuur: staat bij elk apparaat dat zelf leert en slim gestuurd wordt.
   Eigen figuur (wit warrig haar, ronde bril, snor, labjas met strikje, lampje als hij iets bedenkt).
   zsProf({grootte, lamp, label}) geeft een svg; zsProfBadge(slim) een klein labeltje met de figuur. */
(function () {
  const CSS = `
.zs-prof{display:inline-block;flex:none;vertical-align:middle;overflow:visible}
.zs-prof .oog{transform-box:fill-box;transform-origin:center;animation:zsProfKnip 6s infinite}
.zs-prof .lamp{transform-box:fill-box;transform-origin:50% 100%;animation:zsProfLamp 2.8s ease-in-out infinite}
.zs-prof .straal{animation:zsProfStraal 2.8s ease-in-out infinite}
.zs-prof .kop{transform-box:view-box;transform-origin:32px 46px;animation:zsProfKop 7s ease-in-out infinite}
@keyframes zsProfKnip{0%,93%,100%{transform:scaleY(1)}95%{transform:scaleY(.12)}}
@keyframes zsProfLamp{0%,100%{opacity:.75;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}
@keyframes zsProfStraal{0%,100%{opacity:0}45%,60%{opacity:1}}
@keyframes zsProfKop{0%,100%{transform:rotate(0)}30%{transform:rotate(-4deg)}60%{transform:rotate(3deg)}}
@media (prefers-reduced-motion:reduce){.zs-prof *{animation:none!important}}
.zs-slim{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:1px 9px 1px 3px;border-radius:999px;
  background:color-mix(in srgb,var(--zs-amber,#f59e0b) 16%,transparent);color:var(--ink,inherit);font-size:12px;font-weight:600;
  line-height:20px;vertical-align:middle;white-space:nowrap}
.zs-slim .zs-prof{margin:-3px 0 -2px}
.zs-slim.klein{padding:0 3px;margin-left:6px}
.zs-slim.klein span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
`;
  function stijl() {
    if (document.getElementById("zsProfCss")) return;
    const s = document.createElement("style");
    s.id = "zsProfCss"; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  const INKT = "#2b2f36", HAAR = "#f6f5f1", HAARL = "#a3abb5", HUID = "#f2cba4";
  function svg(o) {
    o = o || {};
    const g = o.grootte || 40, lamp = o.lamp !== false;
    const label = o.label || "Slim: Zonnestuur leert en stuurt dit zelf";
    return `<svg class="zs-prof" width="${g}" height="${g}" viewBox="0 0 64 64" role="img" aria-label="${label}">
<path d="M29.2 41h5.6v8h-5.6z" fill="${HUID}" stroke="${INKT}" stroke-width="1.2"/>
<path d="M13 64c0-11 8-17 19-17s19 6 19 17z" fill="#fbfbfd" stroke="${INKT}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M27 47.5l5 8 5-8" fill="none" stroke="${INKT}" stroke-width="1.3" stroke-linejoin="round"/>
<path d="M28 50.3l4 1.7-4 1.7zM36 50.3l-4 1.7 4 1.7z" fill="#f59e0b" stroke="${INKT}" stroke-width=".9" stroke-linejoin="round"/>
<path d="M22.5 58.5h5" stroke="${INKT}" stroke-width="1.1" stroke-linecap="round"/>
<g class="kop">
<path d="M16.5 24.5l-9-4.5 5.6 7.4-6.4-.6 7.6 5M47.5 24.5l9-4.5-5.6 7.4 6.4-.6-7.6 5M30 8.5l-1.6-6.5 4.1 5.2 3-5.6-.4 7" fill="${HAAR}" stroke="${HAARL}" stroke-width="1.2" stroke-linejoin="round"/>
<path d="M17.5 31c-6-3.5-5.2-11.8.3-12.6-.6-6.4 6.6-9.6 9.6-6.2 1.6-6.4 9.8-6.3 10.8-.9 4.2-3.8 11.3.4 8.8 5.6 6.3.8 6.9 9.3.8 11.4 4.7 4 1.4 9.3-2.6 7.6l-1.2-5.9H20.2l-.9 6c-4 1.4-6.8-3.7-1.8-5z" fill="${HAAR}" stroke="${HAARL}" stroke-width="1.2" stroke-linejoin="round"/>
<circle cx="20" cy="33" r="2.6" fill="${HUID}" stroke="${INKT}" stroke-width="1.2"/>
<circle cx="44" cy="33" r="2.6" fill="${HUID}" stroke="${INKT}" stroke-width="1.2"/>
<circle cx="32" cy="32" r="12" fill="${HUID}" stroke="${INKT}" stroke-width="1.5"/>
<path d="M21.5 23.5c3-3 6.5-2 8-3.6M42.5 23.5c-3-3-6.5-2-8-3.6" fill="none" stroke="${HAARL}" stroke-width="1.6" stroke-linecap="round"/>
<path d="M23.3 27.4c1.5-1.4 3.8-1.6 5.6-.7M40.7 27.4c-1.5-1.4-3.8-1.6-5.6-.7" fill="none" stroke="${HAAR}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M23.3 27.4c1.5-1.4 3.8-1.6 5.6-.7M40.7 27.4c-1.5-1.4-3.8-1.6-5.6-.7" fill="none" stroke="${HAARL}" stroke-width=".7" stroke-linecap="round"/>
<circle cx="27" cy="32" r="4.3" fill="#fff" fill-opacity=".55" stroke="${INKT}" stroke-width="1.4"/>
<circle cx="37" cy="32" r="4.3" fill="#fff" fill-opacity=".55" stroke="${INKT}" stroke-width="1.4"/>
<path d="M31.3 31.6c.5-.5 1-.5 1.4 0" fill="none" stroke="${INKT}" stroke-width="1.3" stroke-linecap="round"/>
<circle class="oog" cx="27.3" cy="32.4" r="1.35" fill="${INKT}"/>
<circle class="oog" cx="37.3" cy="32.4" r="1.35" fill="${INKT}"/>
<path d="M24.6 30.2l1.4-1.4M34.6 30.2l1.4-1.4" stroke="#fff" stroke-width="1" stroke-linecap="round"/>
<path d="M32 33.5c1.7 1.6 1.8 3.3.1 4.3" fill="none" stroke="${INKT}" stroke-width="1.1" stroke-linecap="round"/>
<path d="M25.4 40.2c2.4-2.9 5.3-1.7 6.6-.6 1.3-1.1 4.2-2.3 6.6.6-2.3 1.6-4.8 1.2-6.6.4-1.8.8-4.3 1.2-6.6-.4z" fill="${HAAR}" stroke="${HAARL}" stroke-width="1" stroke-linejoin="round"/>
<path d="M29.6 42.6c1.5 1 3.3 1 4.8 0" fill="none" stroke="${INKT}" stroke-width="1.1" stroke-linecap="round"/>
</g>
${lamp ? `<g class="straal" stroke="#f59e0b" stroke-width="1.4" stroke-linecap="round"><path d="M55 2.5v2.4M61.5 8.5h-2.4M48.5 8.5h2.4M59.6 3.9l-1.6 1.6M50.4 3.9l1.6 1.6"/></g>
<g class="lamp"><circle cx="55" cy="10" r="4.4" fill="#fcd34d" stroke="${INKT}" stroke-width="1.3"/><path d="M53.2 14.3h3.6v2.6h-3.6z" fill="#d1d5db" stroke="${INKT}" stroke-width="1.1" stroke-linejoin="round"/><path d="M53.6 9.4l1.4 1.8 1.4-1.8" fill="none" stroke="#b45309" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/></g>` : ""}
</svg>`;
  }
  window.zsProf = function (o) { stijl(); return svg(o); };
  window.zsProfBadge = function (slim, klein) {
    if (!slim || !slim.aan) return "";
    stijl();
    const titel = (slim.leert || []).length ? "Slim gestuurd. Zonnestuur " + slim.leert.join(", ") + "." : "Slim gestuurd door Zonnestuur.";
    return `<span class="zs-slim${klein ? " klein" : ""}" title="${titel.replace(/"/g, "&quot;")}">${svg({ grootte: 22, lamp: false, label: "Slim" })}<span>Slim</span></span>`;
  };
})();
