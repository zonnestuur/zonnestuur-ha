/* Interactieve tekening per apparaat (0.121). Eigen platte stijl met inktlijn, zoals het huis.
   zsBeeld.html(d, s, {groot}) geeft de tekening; zsBeeld.bind(el, d, s, {mode}) maakt de onderdelen aantikbaar:
   een tik op een onderdeel (buitenunit, vat, display, trommel, stekker …) toont wat er nu gebeurt, met een knop om bij te sturen.
   De tekening beweegt mee met het echte apparaat: ventilator draait, water stroomt, trommel draait, stroom loopt door de kabel. */
(function () {
  const CSS = `
.zb{position:relative;width:100%;max-width:520px;margin:0 auto;-webkit-tap-highlight-color:transparent}
.zb svg{display:block;width:100%;height:auto;overflow:visible}
.zb .ink{stroke:var(--zs-ink,#1f2937);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.zb .romp{fill:var(--zs-kaart,#fff)} .zb .romp2{fill:var(--zs-vlak2,#eef1f4)} .zb .zacht{fill:var(--zs-vlak2,#eef1f4);stroke:none}
.zb .grond{stroke:var(--zs-ink,#1f2937);stroke-opacity:.25;stroke-width:2;stroke-linecap:round}
.zb .schaduw{fill:var(--zs-ink,#1f2937);opacity:.07}
.zb .warm{stroke:#f97316} .zb .koud{stroke:#38bdf8} .zb .vloei{fill:none;stroke-width:4;stroke-linecap:round;stroke-dasharray:2 12;opacity:0}
.zb.aan .vloei{opacity:.9;animation:zbVloei 1.1s linear infinite}
.zb .blad{transform-box:fill-box;transform-origin:center}
.zb.aan .blad{animation:zbDraai var(--zb-snel,1.4s) linear infinite}
.zb.aan .trommel{transform-box:fill-box;transform-origin:center;animation:zbDraai 2.4s linear infinite}
.zb .gloei{opacity:.12;transition:opacity .6s} .zb.aan .gloei{opacity:1;animation:zbGloei 1.8s ease-in-out infinite}
.zb .damp{opacity:0} .zb.aan .damp{animation:zbDamp 3s ease-in infinite} .zb.aan .damp.b{animation-delay:1s} .zb.aan .damp.c{animation-delay:2s}
.zb .vonk{opacity:0} .zb.aan .vonk{opacity:1;animation:zbVonk 1.6s linear infinite}
.zb .lucht{opacity:0} .zb.aan .lucht{animation:zbLucht 2.2s ease-in-out infinite} .zb.aan .lucht.b{animation-delay:.7s} .zb.aan .lucht.c{animation-delay:1.4s}
.zb .golf{transform-box:fill-box;animation:zbGolf 6s linear infinite} .zb:not(.aan) .golf{animation-duration:14s}
.zb .disp{fill:#0f172a} .zb .disptekst{fill:#a7f3d0;font:700 13px/1 "Inter Tight",Inter,system-ui,sans-serif;letter-spacing:.02em}
.zb .label{font:700 15px/1 "Inter Tight",Inter,system-ui,sans-serif;fill:var(--zs-ink,#1f2937)}
.zb .label.wit{fill:#fff;paint-order:stroke;stroke:rgba(0,0,0,.25);stroke-width:3px}
.zb .klein{font:600 11px/1 Inter,system-ui,sans-serif;fill:var(--zs-ink2,#475569)}
.zb .hot{cursor:pointer;outline:none}
.zb .hot .ring{fill:var(--zs-amber,#f59e0b);opacity:.95} .zb .hot .puls{fill:none;stroke:var(--zs-amber,#f59e0b);stroke-width:2;transform-box:fill-box;transform-origin:center;animation:zbHint 2.4s ease-out infinite}
.zb .hot:hover .ring,.zb .hot:focus-visible .ring{opacity:1;filter:drop-shadow(0 0 4px var(--zs-amber,#f59e0b))}
.zb .hot.open .ring{fill:var(--zs-ink,#1f2937)}
.zb-bel{position:absolute;z-index:5;max-width:min(300px,86%);padding:12px 14px 12px;border-radius:16px;background:var(--zs-kaart,#fff);color:var(--zs-ink,#1f2937);
  box-shadow:0 12px 34px -12px rgba(15,23,42,.45),0 0 0 1px var(--zs-lijn,rgba(0,0,0,.08));font-size:14px;line-height:1.4;animation:zbIn .22s cubic-bezier(.2,.9,.3,1.2)}
.zb-bel b{display:block;font-size:15px;margin-bottom:3px}
.zb-bel .zb-knoppen{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.zb-bel button{font:600 13px Inter,system-ui,sans-serif;padding:7px 11px;border-radius:99px;border:0;background:var(--zs-vlak2,#eef1f4);color:inherit;cursor:pointer}
.zb-bel button.hoofd{background:var(--zs-knop,#f59e0b);color:var(--zs-knop-tekst,#1f1300)}
.zb-bel .dicht{position:absolute;top:6px;right:8px;background:none;padding:4px 6px;font-size:16px;line-height:1}
.zb-hint{position:absolute;left:50%;bottom:-16px;translate:-50% 0;font-size:12px;color:var(--zs-ink2,#475569);white-space:nowrap;pointer-events:none;opacity:.85}
@keyframes zbDraai{to{transform:rotate(360deg)}}
@keyframes zbVloei{to{stroke-dashoffset:-14}}
@keyframes zbGloei{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes zbDamp{0%{opacity:0;transform:translateY(6px)}30%{opacity:.7}100%{opacity:0;transform:translateY(-18px)}}
@keyframes zbVonk{0%{offset-distance:0%}100%{offset-distance:100%}}
@keyframes zbLucht{0%{opacity:0;transform:translateY(-4px)}40%{opacity:.8}100%{opacity:0;transform:translateY(14px)}}
@keyframes zbGolf{to{transform:translateX(-40px)}}
@keyframes zbHint{0%{transform:scale(1);opacity:.8}70%,100%{transform:scale(2.3);opacity:0}}
@keyframes zbIn{from{opacity:0;transform:translateY(6px) scale(.97)}}
.zb .lak{fill:color-mix(in srgb,var(--e-auto,#8b5cf6) 52%,var(--zs-kaart,#fff))} .zb .ruit{fill:color-mix(in srgb,#7dd3fc 45%,var(--zs-kaart,#fff))}
.zb .wiel{fill:var(--zs-ink,#1f2937)} .zb .naaf{fill:var(--zs-vlak2,#e5e7eb)}
.zb .accu-bg{fill:var(--zs-vlak2,#eef1f4);stroke:var(--zs-ink,#1f2937);stroke-width:1.5}
.zb .accu-vol{fill:var(--e-auto,#8b5cf6)} .zb.aan .accu-vol{animation:zbGloei 2.2s ease-in-out infinite}
.zb .accu-bij{fill:url(#zbArc);opacity:.6}
.zb .led{fill:#94a3b8} .zb.erin .led{fill:#38bdf8} .zb.aan .led{fill:#22c55e;animation:zbGloei 1.4s ease-in-out infinite}
.zb .bliksem{opacity:0} .zb.aan .bliksem{opacity:1;animation:zbGloei 1.4s ease-in-out infinite}
.zb .lamp-v{fill:#fde68a;opacity:.25} .zb.aan .lamp-v{opacity:.9}
@media (prefers-reduced-motion:reduce){.zb *,.zb-bel{animation:none!important}}
`;
  function stijl() {
    if (document.getElementById("zsBeeldCss")) return;
    const s = document.createElement("style");
    s.id = "zsBeeldCss"; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nl = (v, n = 0) => Number(v).toLocaleString("nl-NL", { minimumFractionDigits: n, maximumFractionDigits: n });
  const tijd = (iso) => (iso ? String(iso).slice(11, 16) : "");
  const hoofd = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "");

  function soortVan(d) {
    const n = (d.name || "").toLowerCase();
    if (d.kind === "heatpump") return "warmtepomp";
    if (d.kind === "boiler" || /boiler|warm water|water/.test(n)) return "boiler";
    if (/droog|droger/.test(n)) return "droger";
    if (/vaat/.test(n)) return "vaat";
    if (/was/.test(n)) return "was";
    if (/airco|koel/.test(n)) return "airco";
    return "stekker";
  }
  // kleur van het water: koel blauw → heet oranje
  function waterKleur(t) {                // koel blauw, lauw geel, heet oranje (nooit groen)
    t = t == null ? 45 : t;
    if (t < 36) return "#7dd3fc";
    const f = Math.max(0, Math.min(1, (t - 36) / 26)), a = [252, 211, 77], b = [249, 115, 22];
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(",")})`;
  }
  function hot(id, x, y, label) {
    return `<g class="hot" data-hot="${id}" tabindex="0" role="button" aria-label="${esc(label)}"><circle class="puls" cx="${x}" cy="${y}" r="7"/><circle class="ring" cx="${x}" cy="${y}" r="7"/><path d="M${x - 2.6} ${y}h5.2M${x} ${y - 2.6}v5.2" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>`;
  }
  function grond(x1, x2) { return `<ellipse class="schaduw" cx="${(x1 + x2) / 2}" cy="146" rx="${(x2 - x1) / 2}" ry="5"/><path class="grond" d="M8 146H312"/>`; }

  // ---------- teksten bij de onderdelen ----------
  function info(d, s) {
    const aan = !!(d.on && (d.power_w || 0) > 30) || !!d.on;
    const kw = (d.power_w || 0) / 1000;
    const nu = aan ? (kw > 0.05 ? `Gebruikt nu ${nl(kw, 1)} kW.` : "Staat aan.") : "Staat nu uit.";
    const reden = d.reason ? hoofd(d.reason) + "." : "";
    const klaar = d.next_ready ? `Klaar om ${tijd(d.next_ready)}${d.next_ready_ok ? " (gelukt)" : ""}.` : "";
    const slim = d.slim || {};
    const plan = slim.zin || (d.best_hours && d.best_hours.length ? `Gepland in de goedkoopste uren: ${d.best_hours.slice(0, 3).map((h) => String(h).padStart(2, "0") + ":00").join(", ")}.` : "");
    const weer = s && s.huis && s.huis.weer, buiten = weer && weer.t != null ? weer.t : null;
    return { aan, kw, nu, reden, klaar, plan, buiten };
  }
  function delen(d, s) {
    const i = info(d, s), soort = soortVan(d), w = d.water_c, doel = d.doel_c || (d.opwarm && d.opwarm.doel);
    const o = d.opwarm;
    const water = w != null ? `Het water is ${nl(w)} °C${doel ? `, doel ${nl(doel)} °C` : ""}.` : "De watertemperatuur meet Zonnestuur hier niet.";
    const opw = o ? (o.need_min > 0 ? ` Nog ± ${o.need_min >= 90 ? nl(o.need_min / 60, 1) + " uur" : o.need_min + " min"} opwarmen.` : " Warm genoeg.") : "";
    const L = d.legionella;
    const leg = L ? (L.laatst ? `Wekelijks heet gehaald: ${nl(L.temp || L.doel)} °C.` : `Wekelijks gaat hij één keer naar ${nl(L.doel)} °C tegen legionella.`) : "";
    const knoppen = [["Terug naar slim", "auto", null, true], ["2 uur uit", "off", 2]];
    if (d.kind !== "heatpump" && d.kind !== "ev") knoppen.push(["1 uur aan", "on", 1]);
    const k = {
      warmtepomp: {
        unit: ["Buitenunit", `${i.nu} ${i.reden}${i.buiten != null ? ` Buiten is het ${nl(i.buiten)} °C: hoe kouder, hoe meer stroom per beetje warmte.` : ""}`, knoppen],
        vat: ["Het vat", water + opw, null],
        pijp: ["Wat hij van plan is", i.plan || i.klaar || "Zonnestuur kiest zelf de goedkoopste uren om bij te warmen.", null],
      },
      boiler: {
        vat: ["De boiler", water + opw + (i.klaar ? " " + i.klaar : ""), null],
        element: ["Verwarming", `${i.nu} ${i.reden}`, knoppen],
        kraan: ["Wekelijks heet", leg || "Zonnestuur warmt bij in de goedkoopste uren of met eigen zonnestroom.", null],
        plan: ["Wat hij van plan is", i.plan || "Zonnestuur kiest zelf het beste moment.", null],
      },
      machine: {
        display: ["Wanneer hij start", (d.next_ready ? `Moet klaar zijn om ${tijd(d.next_ready)}. ` : "") + (i.plan || "Zet hem klaar en kies 'Start op afstand'; Zonnestuur start hem op het goedkoopste moment."), null],
        deur: [soort === "vaat" ? "Vaatwasser" : soort === "droger" ? "Trommel" : "Trommel", `${i.nu} ${i.reden}`, knoppen],
        stekker: ["Stroom", i.aan ? `Gebruikt nu ${nl(i.kw, 2)} kW.` : "Gebruikt nu geen stroom.", null],
      },
      airco: {
        unit: ["Airco", `${i.nu} ${i.reden}`, knoppen],
        plan: ["Wat hij van plan is", i.plan || "Zonnestuur kiest zelf het beste moment.", null],
      },
      stekker: {
        stekker: ["Stopcontact", `${i.nu} ${i.reden}`, knoppen],
        apparaat: ["Wat hij van plan is", i.plan || i.klaar || "Zonnestuur zet hem aan bij eigen zonnestroom of in de goedkoopste uren.", null],
      },
    };
    return k[soort === "was" || soort === "droger" || soort === "vaat" ? "machine" : soort];
  }

  // ---------- tekeningen (viewBox 320×160, grond op 146) ----------
  function warmtepomp(d, s) {
    const i = info(d, s), w = d.water_c, f = w != null ? Math.max(.12, Math.min(.95, (w - 15) / 45)) : .55;
    const vy = 30, vh = 112, wy = vy + vh * (1 - f), kleur = waterKleur(w);
    const snel = i.kw > 0.1 ? Math.max(.35, 1.6 - i.kw * .35) : 1.4;
    return `<svg viewBox="0 0 320 160" style="--zb-snel:${snel.toFixed(2)}s">
${grond(14, 290)}
<defs><clipPath id="zbVat${d.id}"><rect x="208" y="${vy}" width="74" height="${vh}" rx="30"/></clipPath></defs>
<!-- leidingen -->
<path class="ink" d="M124 84H170Q182 84 182 96V118Q182 128 194 128H208" fill="none" stroke-width="9" stroke="var(--zs-ink,#1f2937)"/>
<path d="M124 84H170Q182 84 182 96V118Q182 128 194 128H208" fill="none" stroke="#fb923c" stroke-width="5"/>
<path class="vloei warm" d="M124 84H170Q182 84 182 96V118Q182 128 194 128H208"/>
<path class="ink" d="M124 112H160Q168 112 168 104V64Q168 52 180 52H208" fill="none" stroke-width="9" stroke="var(--zs-ink,#1f2937)"/>
<path d="M124 112H160Q168 112 168 104V64Q168 52 180 52H208" fill="none" stroke="#7dd3fc" stroke-width="5"/>
<path class="vloei koud" d="M208 52H180Q168 52 168 64V104Q168 112 160 112H124"/>
<!-- buitenunit -->
<rect class="romp ink" x="18" y="56" width="108" height="86" rx="14"/>
<path class="ink" d="M26 142v4M118 142v4"/>
<circle class="romp2 ink" cx="66" cy="99" r="32"/>
<g class="blad"><path d="M66 99c-3-16 6-26 14-24-2 10-6 17-14 24zM66 99c14 8 15 22 7 25-6-8-8-16-7-25zM66 99c-13 8-27 3-27-5 10-2 18 0 27 5z" fill="var(--zs-ink2,#64748b)" opacity=".85"/><circle cx="66" cy="99" r="5" class="romp ink"/></g>
<path d="M38 99a28 28 0 0 1 56 0M42 99a24 24 0 0 0 48 0" fill="none" stroke="var(--zs-ink,#1f2937)" stroke-opacity=".18" stroke-width="1.5"/>
<rect class="zacht" x="102" y="66" width="16" height="66" rx="5"/>
${[74, 84, 94, 104, 114, 124].map((y) => `<path d="M105 ${y}h10" stroke="var(--zs-ink,#1f2937)" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>`).join("")}
${i.buiten != null ? `<g><path d="M30 34a8 8 0 0 1 15-4 7 7 0 0 1 11 6H30z" class="romp ink" stroke-width="1.6"/><text class="klein" x="62" y="38">${nl(i.buiten)} °C buiten</text></g>` : ""}
<!-- vat -->
<rect class="romp ink" x="208" y="${vy}" width="74" height="${vh}" rx="30"/>
<g clip-path="url(#zbVat${d.id})">
  <g class="golf"><path d="M200 ${wy}q10-6 20 0t20 0t20 0t20 0t20 0t20 0V150H200z" fill="${kleur}"/></g>
</g>
<rect x="208" y="${vy}" width="74" height="${vh}" rx="30" fill="none" class="ink"/>
<path d="M222 46v40" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
<text class="label${f > .55 ? " wit" : ""}" x="245" y="${Math.min(vy + vh - 14, Math.max(wy + 22, 70))}" text-anchor="middle">${w != null ? nl(w) + "°" : "?"}</text>
<path class="damp" d="M236 22q-4-6 0-11t0-11" fill="none" stroke="var(--zs-ink2,#94a3b8)" stroke-width="2" stroke-linecap="round"/>
<path class="damp b" d="M248 22q-4-6 0-11t0-11" fill="none" stroke="var(--zs-ink2,#94a3b8)" stroke-width="2" stroke-linecap="round"/>
<path class="damp c" d="M260 22q-4-6 0-11t0-11" fill="none" stroke="var(--zs-ink2,#94a3b8)" stroke-width="2" stroke-linecap="round"/>
${hot("unit", 26, 64, "Buitenunit")}${hot("vat", 276, 38, "Het vat")}${hot("pijp", 182, 108, "Wat hij van plan is")}
</svg>`;
  }

  function boiler(d, s) {
    const i = info(d, s), w = d.water_c, f = w != null ? Math.max(.12, Math.min(.95, (w - 15) / 50)) : .6;
    const vy = 14, vh = 128, wy = vy + vh * (1 - f), kleur = waterKleur(w);
    const zon = /zon/.test(d.reason || "");
    return `<svg viewBox="0 0 320 160">
${grond(110, 230)}
<defs><clipPath id="zbBoil${d.id}"><rect x="128" y="${vy}" width="84" height="${vh}" rx="34"/></clipPath></defs>
<rect class="romp ink" x="128" y="${vy}" width="84" height="${vh}" rx="34"/>
<g clip-path="url(#zbBoil${d.id})"><g class="golf"><path d="M118 ${wy}q10-6 20 0t20 0t20 0t20 0t20 0t20 0V150H118z" fill="${kleur}"/></g></g>
<rect x="128" y="${vy}" width="84" height="${vh}" rx="34" fill="none" class="ink"/>
<path d="M142 34v50" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
<path class="gloei" d="M146 128l8-8 8 8 8-8 8 8 8-8 8 8" fill="none" stroke="#f97316" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<text class="label${f > .45 ? " wit" : ""}" x="170" y="${Math.min(vy + vh - 26, Math.max(wy + 24, 60))}" text-anchor="middle">${w != null ? nl(w) + "°" : ""}</text>
<path class="ink" d="M212 34h34v-8" fill="none" stroke-width="6" stroke="var(--zs-ink,#1f2937)"/><path d="M212 34h34v-8" fill="none" stroke="#e2e8f0" stroke-width="3"/>
<path class="romp ink" d="M238 18h22v8h-22z"/><path class="damp" d="M250 46q-3 5 0 9" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
<!-- stroom: zon of stekker -->
${zon ? `<g><circle cx="58" cy="44" r="16" fill="#fcd34d" class="ink"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = a * Math.PI / 180; return `<path d="M${(58 + Math.cos(r) * 22).toFixed(1)} ${(44 + Math.sin(r) * 22).toFixed(1)}L${(58 + Math.cos(r) * 29).toFixed(1)} ${(44 + Math.sin(r) * 29).toFixed(1)}" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>`; }).join("")}</g>`
      : `<g><rect class="romp ink" x="40" y="96" width="34" height="42" rx="8"/><circle cx="51" cy="113" r="2.5" fill="var(--zs-ink,#1f2937)"/><circle cx="63" cy="113" r="2.5" fill="var(--zs-ink,#1f2937)"/></g>`}
<path id="zbKab${d.id}" d="${zon ? "M74 54Q110 70 128 112" : "M74 118Q104 118 128 122"}" fill="none" stroke="var(--zs-ink,#1f2937)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${zon ? "4 7" : "0"}"/>
<circle class="vonk" r="4" fill="#facc15" style="offset-path:path('${zon ? "M74 54Q110 70 128 112" : "M74 118Q104 118 128 122"}')"/>
${hot("vat", 204, 24, "De boiler")}${hot("element", 194, 128, "Verwarming")}${hot("kraan", 260, 22, "Wekelijks heet")}${hot("plan", 58, zon ? 76 : 90, "Wat hij van plan is")}
</svg>`;
  }

  function machine(d, s) {
    const i = info(d, s), soort = soortVan(d);
    const disp = i.aan ? "AAN" : d.next_ready ? tijd(d.next_ready) : "KLAAR?";
    const vaat = soort === "vaat";
    return `<svg viewBox="0 0 320 160">
${grond(96, 224)}
<rect class="romp ink" x="102" y="14" width="116" height="128" rx="14"/>
<path class="ink" d="M102 42H218" fill="none"/>
<rect class="disp" x="140" y="21" width="52" height="15" rx="4"/><text class="disptekst" x="166" y="33" text-anchor="middle">${esc(disp)}</text>
<circle class="romp2 ink" cx="118" cy="28" r="6"/><circle cx="204" cy="28" r="3" fill="${i.aan ? "#22c55e" : "var(--zs-ink2,#94a3b8)"}"/>
${vaat ? `<rect class="romp2 ink" x="114" y="52" width="92" height="80" rx="8"/><path class="ink" d="M126 62h68" fill="none"/>
  <g class="lucht"><path d="M134 80v14M150 76v18M166 80v14M182 76v18" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/></g>
  <g class="lucht b"><path d="M142 98v14M158 94v18M174 98v14M190 94v14" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/></g>`
      : `<circle class="romp2 ink" cx="160" cy="92" r="38"/><circle cx="160" cy="92" r="29" fill="${soort === "droger" ? "#fde68a" : "#bae6fd"}" class="ink" stroke-width="1.5"/>
  <g class="trommel"><circle cx="160" cy="92" r="29" fill="none"/><path d="M146 84q6-8 14-2t12 8q-6 8-14 4t-12-10z" fill="${soort === "droger" ? "#f472b6" : "#818cf8"}" opacity=".9"/><path d="M152 104q8-2 12 2t10 0q-2 8-10 6t-12-8z" fill="${soort === "droger" ? "#34d399" : "#f472b6"}" opacity=".9"/></g>
  <path d="M140 74a26 26 0 0 1 22-10" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="4" stroke-linecap="round"/>
  ${soort === "droger" ? `<path class="damp" d="M232 60q-4-6 0-11t0-11" fill="none" stroke="var(--zs-ink2,#94a3b8)" stroke-width="2" stroke-linecap="round"/><path class="damp b" d="M244 60q-4-6 0-11t0-11" fill="none" stroke="var(--zs-ink2,#94a3b8)" stroke-width="2" stroke-linecap="round"/>` : ""}`}
<path d="M218 120Q250 120 258 134" fill="none" stroke="var(--zs-ink,#1f2937)" stroke-width="3" stroke-linecap="round"/>
<rect class="romp ink" x="252" y="112" width="30" height="34" rx="7"/><circle cx="262" cy="127" r="2.3" fill="var(--zs-ink,#1f2937)"/><circle cx="272" cy="127" r="2.3" fill="var(--zs-ink,#1f2937)"/>
<circle class="vonk" r="3.5" fill="#facc15" style="offset-path:path('M258 134Q250 120 218 120')"/>
${hot("display", 196, 28, "Wanneer hij start")}${hot("deur", vaat ? 200 : 190, vaat ? 58 : 64, "Het apparaat")}${hot("stekker", 282, 112, "Stroom")}
</svg>`;
  }

  function airco(d, s) {
    return `<svg viewBox="0 0 320 160">
<path class="grond" d="M8 146H312"/>
<rect class="romp ink" x="70" y="26" width="180" height="56" rx="16"/><path class="ink" d="M84 66H236" fill="none"/>
<path class="ink" d="M90 74H230" fill="none" stroke-width="3"/>
<circle cx="230" cy="44" r="3" fill="${d.on ? "#22c55e" : "var(--zs-ink2,#94a3b8)"}"/>
<g class="lucht"><path d="M110 92q-6 12 0 24M150 92q-6 12 0 24M190 92q-6 12 0 24M230 92q-6 12 0 24" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/></g>
<g class="lucht b"><path d="M130 96q-6 12 0 24M170 96q-6 12 0 24M210 96q-6 12 0 24" fill="none" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round"/></g>
${hot("unit", 242, 30, "Airco")}${hot("plan", 78, 30, "Wat hij van plan is")}
</svg>`;
  }

  function stekker(d, s) {
    const i = info(d, s);
    return `<svg viewBox="0 0 320 160">
${grond(40, 290)}
<rect class="romp ink" x="34" y="56" width="58" height="66" rx="14"/><circle class="romp2 ink" cx="63" cy="89" r="20"/>
<circle cx="56" cy="89" r="3" fill="var(--zs-ink,#1f2937)"/><circle cx="70" cy="89" r="3" fill="var(--zs-ink,#1f2937)"/>
<rect class="romp ink" x="88" y="78" width="26" height="22" rx="6"/>
<path id="zbSt${d.id}" d="M114 89C160 89 160 124 206 124" fill="none" stroke="var(--zs-ink,#1f2937)" stroke-width="3.5" stroke-linecap="round"/>
<circle class="vonk" r="4" fill="#facc15" style="offset-path:path('M114 89C160 89 160 124 206 124')"/>
<circle class="vonk" r="4" fill="#facc15" style="offset-path:path('M114 89C160 89 160 124 206 124');animation-delay:.8s"/>
<rect class="romp ink" x="206" y="66" width="88" height="76" rx="16"/>
<path d="M255 82l-14 22h11l-4 18 15-24h-11z" fill="${i.aan ? "#facc15" : "var(--zs-vlak2,#e2e8f0)"}" class="ink" stroke-width="1.6"/>
<text class="klein" x="250" y="60" text-anchor="middle">${i.aan ? nl(i.kw, 2) + " kW" : "uit"}</text>
${hot("stekker", 86, 60, "Stopcontact")}${hot("apparaat", 288, 72, "Wat hij van plan is")}
</svg>`;
  }

  // ---------- de auto met laadpaal (viewBox 400×160, past in het laadbeeld) ----------
  // i = {naam, soc, doel, km, laadt, erin, kw, klaar, plan[], need_kwh, prijs, zon, wie}
  function auto(i) {
    const soc = i.soc != null ? Math.max(0, Math.min(100, i.soc)) : null, doel = i.doel != null ? Math.max(0, Math.min(100, i.doel)) : null;
    const kabel = i.erin ? "M58 90C82 146 102 128 112 98" : "M58 90C70 126 44 132 44 108";
    return `<svg viewBox="0 0 400 160">
<defs><pattern id="zbArc" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="6" fill="var(--e-auto,#8b5cf6)"/></pattern></defs>
<ellipse class="schaduw" cx="242" cy="147" rx="146" ry="6"/><path class="grond" d="M8 147H392"/>
<!-- laadpaal -->
${i.zon ? `<g><circle cx="44" cy="20" r="10" fill="#fcd34d" class="ink" stroke-width="1.5"/>${[0, 60, 120, 180, 240, 300].map((a) => { const r = a * Math.PI / 180; return `<path d="M${(44 + Math.cos(r) * 14).toFixed(1)} ${(20 + Math.sin(r) * 14).toFixed(1)}L${(44 + Math.cos(r) * 19).toFixed(1)} ${(20 + Math.sin(r) * 19).toFixed(1)}" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>`; }).join("")}</g>` : ""}
<rect class="romp ink" x="26" y="42" width="36" height="104" rx="11"/>
<rect class="disp" x="32" y="52" width="24" height="15" rx="4"/><circle class="led" cx="44" cy="59.5" r="3.6"/>
<path class="bliksem" d="M46 73l-6 9h5l-3 8 8-11h-5z" fill="#facc15" stroke="var(--zs-ink,#1f2937)" stroke-width=".8"/>
<rect class="zacht" x="34" y="120" width="20" height="18" rx="5"/>
<!-- kabel -->
<path d="${kabel}" fill="none" stroke="var(--zs-ink,#1f2937)" stroke-width="4.5" stroke-linecap="round"/>
<path d="${kabel}" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
${i.erin ? "" : `<rect x="38" y="100" width="12" height="9" rx="2.5" class="romp ink" stroke-width="1.5"/>`}
<circle class="vonk" r="3.6" fill="#facc15" style="offset-path:path('${kabel}')"/>
<circle class="vonk" r="3.6" fill="#facc15" style="offset-path:path('${kabel}');animation-delay:.55s"/>
<circle class="vonk" r="3.6" fill="#facc15" style="offset-path:path('${kabel}');animation-delay:1.1s"/>
<!-- auto -->
<path class="lak ink" d="M104 126V104Q106 92 120 89L170 84Q186 66 210 58Q226 52 262 52H300Q322 53 338 66L362 86Q378 90 381 102L382 122Q382 128 375 128H342A22 22 0 0 0 298 128H184A22 22 0 0 0 140 128H112Q104 128 104 126Z"/>
<path class="ruit ink" stroke-width="1.6" d="M186 84Q198 69 214 63Q228 59 254 59V84Z"/><path class="ruit ink" stroke-width="1.6" d="M262 59H296Q316 60 330 72L343 84H262Z"/>
<path class="ink" d="M258 60V100" fill="none" stroke-width="1.6"/><path class="ink" d="M236 92h10M274 92h10" stroke-width="2.4"/>
<rect x="368" y="94" width="12" height="8" rx="3" class="lamp-v ink" stroke-width="1.2"/><rect x="104" y="98" width="7" height="10" rx="2" fill="#f87171" class="ink" stroke-width="1.2"/>
<rect x="110" y="93" width="8" height="9" rx="2" class="romp ink" stroke-width="1.3"/>
<g transform="translate(196 96)"><rect class="romp ink" x="0" y="0" width="34" height="17" rx="4" stroke-width="1.5"/><rect class="ink" x="34" y="5" width="3.5" height="7" rx="1" fill="var(--zs-ink,#1f2937)"/>
${soc != null ? `<rect class="accu-vol" x="3" y="3" width="${(28 * soc / 100).toFixed(1)}" height="11" rx="2"/>` : ""}<path class="bliksem" d="M19 2l-6 8h4l-2 6 7-9h-4z" fill="#facc15" stroke="var(--zs-ink,#1f2937)" stroke-width=".7"/></g>
<circle class="wiel" cx="162" cy="128" r="18"/><circle class="naaf" cx="162" cy="128" r="7"/>
<circle class="wiel" cx="320" cy="128" r="18"/><circle class="naaf" cx="320" cy="128" r="7"/>
${hot("auto", 300, 50, "De auto")}${hot("accu", 214, 104, "De accu")}${hot("paal", 62, 46, "De laadpaal")}${hot("plan", 88, 132, "Wanneer hij laadt")}
</svg>`;
  }
  function autoDelen(i) {
    const nlp = (v) => Math.round(v) + "%";
    const plan = (i.plan || []).length ? `Laadt in de goedkoopste uren: ${i.plan.length > 2 ? i.plan[0] + " tot " + i.plan[i.plan.length - 1] : i.plan.join(" en ")}.` : "";
    const stuurt = i.wie ? `${i.wie} stuurt het laden; Zonnestuur kijkt mee en rekent uit wat het zelf had gedaan.` : "";
    return {
      auto: [i.naam || "De auto", (i.soc != null ? `De accu is ${nlp(i.soc)} vol` + (i.km ? `, genoeg voor ± ${Math.round(i.km)} km.` : ".") : "Het percentage van de accu is niet bekend.")
        + (i.doel != null && i.klaar ? ` Doel: ${nlp(i.doel)} om ${i.klaar}.` : ""), null],
      accu: ["De accu", i.doel != null && i.soc != null && i.doel > i.soc
        ? `Het gestreepte stuk moet er nog bij: van ${nlp(i.soc)} naar ${nlp(i.doel)}${i.need_kwh ? `, ± ${nl(i.need_kwh, 1)} kWh` : ""}. Het streepje is het doel.`
        : i.soc != null ? "Vol genoeg voor je volgende rit." : "Zodra de auto zijn percentage doorgeeft, staat het hier.", null],
      paal: ["De laadpaal", i.laadt ? `Laadt nu met ${nl(i.kw || 0, 1)} kW${i.zon ? " op je eigen zonnestroom" : ""}.` + (i.prijs != null ? ` Stroom kost nu ${nl(i.prijs * 100, 0)} cent per kWh.` : "")
        : i.erin ? "De stekker zit erin. Hij wacht op een goedkoop uur of op zon." : "De stekker zit er niet in.", null],
      plan: ["Wanneer hij laadt", stuurt || plan || (i.klaar ? `Zonnestuur zorgt dat hij om ${i.klaar} vol genoeg is, in de goedkoopste uren of met zon.` : "Zeg wanneer je wegrijdt; Zonnestuur zorgt dat hij dan vol genoeg is."), null],
    };
  }
  function autoHtml(i, o) {
    stijl();
    o = o || {};
    let hint = "";
    try { if (o.hint !== false && !localStorage.getItem("zs_zb_hint")) hint = `<div class="zb-hint">Tik op een bolletje</div>`; } catch (e) { /* geen opslag */ }
    return `<div class="zb auto${i.laadt ? " aan" : ""}${i.erin ? " erin" : ""}" role="group" aria-label="Tekening van ${esc(i.naam || "de auto")} bij de laadpaal">${auto(i)}${hint}</div>`;
  }
  function bindAuto(root, i) { bind(root, { id: "auto", name: i.naam }, null, { delen: autoDelen(i) }); }

  function html(d, s, o) {
    stijl();
    o = o || {};
    const soort = soortVan(d);
    const svg = soort === "warmtepomp" ? warmtepomp(d, s) : soort === "boiler" ? boiler(d, s)
      : soort === "airco" ? airco(d, s) : soort === "stekker" ? stekker(d, s) : machine(d, s);
    const aan = !!d.on;
    let hint = "";
    try { if (o.hint !== false && !localStorage.getItem("zs_zb_hint")) hint = `<div class="zb-hint">Tik op een bolletje</div>`; } catch (e) { /* geen opslag */ }
    return `<div class="zb${aan ? " aan" : ""}${o.groot ? " groot" : ""}" data-zb="${esc(d.id)}" role="group" aria-label="Tekening van ${esc(d.name)}">${svg}${hint}</div>`;
  }

  function bind(root, d, s, opts) {
    opts = opts || {};
    const el = root.matches && root.matches(".zb") ? root : root.querySelector(".zb");
    if (!el || el._zb) return;
    el._zb = true;
    const dl = opts.delen || delen(d, s) || {};
    const sluit = () => { el.querySelectorAll(".zb-bel").forEach((b) => b.remove()); el.querySelectorAll(".hot.open").forEach((h) => h.classList.remove("open")); };
    const open = (h) => {
      const was = h.classList.contains("open");
      sluit();
      if (was) return;
      const deel = dl[h.dataset.hot];
      if (!deel) return;
      try { localStorage.setItem("zs_zb_hint", "1"); } catch (e) { /* geen opslag */ }
      const hint = el.querySelector(".zb-hint"); if (hint) hint.remove();
      h.classList.add("open");
      const [titel, tekst, knoppen] = deel;
      const bel = document.createElement("div");
      bel.className = "zb-bel"; bel.setAttribute("role", "dialog"); bel.setAttribute("aria-label", titel);
      bel.innerHTML = `<button class="dicht" aria-label="Sluiten">×</button><b>${esc(titel)}</b>${esc(tekst)}` +
        (knoppen && opts.mode ? `<div class="zb-knoppen">${knoppen.map(([t, m, u, h1]) => `<button data-m="${m}" data-u="${u || ""}" class="${h1 && d.mode !== "auto" ? "hoofd" : ""}">${esc(t)}</button>`).join("")}</div>` : "");
      el.appendChild(bel);
      // plaats bij het bolletje, binnen de tekening
      const r = el.getBoundingClientRect(), c = h.querySelector(".ring").getBoundingClientRect();
      const bw = bel.offsetWidth, bh = bel.offsetHeight;
      let x = c.left - r.left + c.width / 2 - bw / 2, y = c.top - r.top + c.height + 8;
      x = Math.max(0, Math.min(r.width - bw, x));
      if (y + bh > r.height + 40) y = Math.max(0, c.top - r.top - bh - 8);
      bel.style.left = x + "px"; bel.style.top = y + "px";
      bel.querySelector(".dicht").onclick = (e) => { e.stopPropagation(); sluit(); };
      bel.querySelectorAll("[data-m]").forEach((b) => b.onclick = async (e) => {
        e.stopPropagation();
        b.disabled = true;
        try { await opts.mode(b.dataset.m, b.dataset.u ? Number(b.dataset.u) : null); } finally { sluit(); }
      });
    };
    el.addEventListener("click", (e) => {
      const h = e.target.closest(".hot");
      if (h) { e.stopPropagation(); open(h); }
      else if (!e.target.closest(".zb-bel")) sluit();
    });
    el.addEventListener("keydown", (e) => {
      const h = e.target.closest && e.target.closest(".hot");
      if (h && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(h); }
      if (e.key === "Escape") sluit();
    });
  }

  window.zsBeeld = { html, bind, soortVan, autoHtml, bindAuto };
})();
