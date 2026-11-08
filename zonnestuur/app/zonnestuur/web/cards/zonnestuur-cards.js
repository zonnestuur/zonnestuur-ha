/*
 * Zonnestuur-kaarten voor het dashboard.
 *
 * Alle kaarten lezen sensor.zonnestuur (die Zonnestuur elke paar minuten bijwerkt) en volgen het thema van
 * het dashboard (licht of donker). Tik op een kaart om Zonnestuur te openen.
 *
 *   type: custom:zonnestuur-card            Nu: oordeel, besparing en tips
 *   type: custom:zonnestuur-besparing-card  Alleen de besparing (klein)
 *   type: custom:zonnestuur-prijs-card      Prijs per uur en wat er gepland is
 *   type: custom:zonnestuur-auto-card       Laadkaart van de auto (optioneel: device: <id>)
 *   type: custom:zonnestuur-apparaten-card  Wat elk apparaat nu doet
 *
 * Optioneel bij elke kaart: entity: sensor.zonnestuur
 */
const ZS_VERSION = "1.12.0";
// Waar dit bestand vandaan kwam (bij het laden uit de foutmelding-stapel gelezen: werkt ook als script-module)
const ZS_SRC = (() => { try { throw new Error("zs"); } catch (e) { const m = String(e.stack || "").match(/(https?:\/\/[^\s)"']*?zonnestuur-cards\.js)/); return m ? m[1] : ""; } })();

const ZS_CSS = `
  :host { --zs-sun: #ffb000; --zs-save: #08654a; --zs-cheap: #16733e; --zs-dear: #e34948; --zs-mid: #8a9199; --zs-warn: #c2410c;
          --zs-ink: var(--primary-text-color, #0e151c); --zs-ink2: var(--secondary-text-color, #47525e);
          --zs-line: var(--divider-color, rgba(0,0,0,.08)); --zs-chip: color-mix(in srgb, var(--zs-ink) 6%, transparent); }
  :host(.dark) { --zs-save: #3ddc97; --zs-warn: #fb923c; --zs-cheap: #34d399; --zs-dear: #e66767; --zs-mid: #6a7280; }
  ha-card { padding: 18px 18px 16px; cursor: pointer; overflow: hidden; height: 100%; box-sizing: border-box; }
  * { box-sizing: border-box; }
  .num { font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
  .title { font-size: 15px; font-weight: 600; color: var(--zs-ink); letter-spacing: -.01em; }
  .brand { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--zs-ink2); }
  .brand i { width: 8px; height: 8px; border-radius: 50%; background: var(--zs-sun); }
  .verdict { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 9px; border-radius: 999px; font-weight: 600; font-size: 14px; }
  .verdict svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .goed { background: color-mix(in srgb, var(--zs-save) 15%, transparent); color: var(--zs-save); }
  .neutraal { background: var(--zs-chip); color: var(--zs-ink2); }
  .wachten { background: color-mix(in srgb, var(--zs-warn) 14%, transparent); color: var(--zs-warn); }
  .why { color: var(--zs-ink2); font-size: 13.5px; margin: 8px 0 0; line-height: 1.4; }
  .big { font-size: 40px; font-weight: 650; letter-spacing: -.04em; line-height: 1; color: var(--zs-save); }
  .lbl { color: var(--zs-ink2); font-size: 13px; margin-top: 4px; }
  .row3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--zs-line); }
  .row3 span { display: block; font-size: 11.5px; color: var(--zs-ink2); }
  .row3 b { font-size: 15px; font-weight: 600; color: var(--zs-ink); }
  .save { margin-top: 14px; }
  .tips { display: grid; gap: 6px; margin-top: 12px; }
  .tip { display: grid; grid-template-columns: 26px 1fr auto; gap: 10px; align-items: center; padding: 9px 10px; border-radius: 12px; background: var(--zs-chip); font-size: 13.5px; color: var(--zs-ink); }
  .tip .ic { width: 26px; height: 26px; border-radius: 8px; display: grid; place-items: center; background: color-mix(in srgb, var(--zs-sun) 22%, transparent); }
  .tip .ic svg { width: 15px; height: 15px; fill: none; stroke: var(--zs-ink); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .tip .g { color: var(--zs-save); font-weight: 600; font-size: 12.5px; white-space: nowrap; }
  .bars { position: relative; display: flex; align-items: flex-end; gap: 2px; height: 86px; margin-top: 4px; }
  .bars i { flex: 1; border-radius: 3px 3px 1px 1px; min-height: 3px; background: var(--zs-mid); opacity: .9; }
  .bars i.cheap { background: var(--zs-cheap); } .bars i.dear { background: var(--zs-dear); background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.4) 0 2px, transparent 2px 5px); }
  .bars i.past { opacity: .35; } .bars i.now { outline: 2px solid var(--zs-ink); outline-offset: 1px; }
  .bars i.pl { box-shadow: inset 0 -5px 0 var(--zs-sun); }
  .axis { position: relative; height: 16px; font-size: 11px; color: var(--zs-ink2); margin-top: 4px; }
  .axis span { position: absolute; transform: translateX(-50%); white-space: nowrap; } .axis span.d { font-weight: 600; color: var(--zs-ink); transform: none; }
  .pnow { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; }
  .pnow b { font-size: 26px; font-weight: 650; letter-spacing: -.03em; color: var(--zs-ink); }
  .pnow span { font-size: 12.5px; color: var(--zs-ink2); }
  .plan { display: grid; gap: 0; margin-top: 10px; }
  .plan div { display: grid; grid-template-columns: 88px 1fr auto; gap: 8px; padding: 7px 0; border-top: 1px solid var(--zs-line); font-size: 13px; color: var(--zs-ink); }
  .plan div:first-child { border-top: 0; }
  .plan .t { color: var(--zs-ink2); font-variant-numeric: tabular-nums; }
  .plan .c { color: var(--zs-ink2); font-variant-numeric: tabular-nums; }
  .plan .nw { color: var(--zs-save); font-weight: 600; }
  .devs { display: grid; gap: 0; }
  .dev { display: grid; grid-template-columns: 34px 1fr auto; gap: 12px; align-items: center; padding: 9px 0; border-top: 1px solid var(--zs-line); }
  .dev:first-child { border-top: 0; padding-top: 2px; }
  .dev .ic { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; background: var(--zs-chip); color: var(--zs-ink); }
  .dev.on .ic { background: color-mix(in srgb, var(--zs-sun) 26%, transparent); }
  .dev .ic svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .dev b { display: block; font-size: 14px; font-weight: 600; color: var(--zs-ink); }
  .dev span { display: block; font-size: 12.5px; color: var(--zs-ink2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dev .kw { font-size: 15px; font-weight: 600; color: var(--zs-ink); font-variant-numeric: tabular-nums; }
  .empty { color: var(--zs-ink2); font-size: 13.5px; padding: 6px 0; }
  /* laadkaart (lijntekening) */
  .ev svg { width: 100%; height: auto; display: block; overflow: visible; }
  .ev .ln { fill: none; stroke: var(--zs-ink); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .ev .thin { stroke-width: 1.1; opacity: .7; } .ev .ground { stroke-width: 1.2; opacity: .45; }
  .ev .hub { fill: var(--zs-ink); } .ev .tl { fill: none; stroke: #d93d3d; stroke-width: 2; stroke-linecap: round; }
  .ev .cable { fill: none; stroke: var(--zs-ink); stroke-width: 1.6; stroke-linecap: round; }
  .ev .dots { fill: none; stroke: var(--zs-sun); stroke-width: 3.4; stroke-linecap: round; stroke-dasharray: 0 9; opacity: 0; }
  .ev .port { fill: var(--card-background-color, #fff); stroke: var(--zs-ink); stroke-width: 1.4; }
  .ev .led { fill: var(--zs-ink2); }
  .ev .sbg { stroke: color-mix(in srgb, var(--zs-ink) 16%, transparent); stroke-width: 2.6; stroke-linecap: round; }
  .ev .sfg { stroke: var(--zs-save); stroke-width: 2.6; stroke-linecap: round; }
  .ev .mk { stroke-width: 1.3; stroke-linecap: round; } .ev .tgt { stroke: var(--zs-ink); } .ev .mn { stroke: var(--zs-warn); }
  .ev.plugged .cable { stroke: var(--zs-sun); stroke-width: 2; } .ev.plugged .dots { opacity: 1; filter: drop-shadow(0 0 2.5px var(--zs-sun)); }
  .ev.plugged .port { stroke: var(--zs-sun); fill: color-mix(in srgb, var(--zs-sun) 20%, transparent); } .ev.plugged .led { fill: var(--zs-sun); }
  .ev.charging .dots { animation: zsflow .7s linear infinite; } .ev.charging .sfg { stroke: var(--zs-sun); filter: drop-shadow(0 0 3px var(--zs-sun)); }
  .ev.charging .led { animation: zsblink 1.4s ease-in-out infinite; }
  @keyframes zsflow { to { stroke-dashoffset: -9; } } @keyframes zsblink { 50% { opacity: .35; } }
  @media (prefers-reduced-motion: reduce) { .ev .dots, .ev .led { animation: none !important; } }
  .evst { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 6px; }
  .evst .pct { font-size: 32px; font-weight: 650; letter-spacing: -.04em; color: var(--zs-ink); }
  .evst .pct small { font-size: 14px; color: var(--zs-ink2); font-weight: 500; letter-spacing: 0; margin-left: 6px; }
  .evst .st { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--zs-ink2); }
  .evst .st i { width: 8px; height: 8px; border-radius: 50%; background: var(--zs-ink2); }
  .evst .st.on i { background: var(--zs-sun); box-shadow: 0 0 0 4px color-mix(in srgb, var(--zs-sun) 25%, transparent); }
  .evplan { font-size: 13px; color: var(--zs-ink2); margin-top: 4px; }
  .evplan b { color: var(--zs-ink); font-weight: 600; }
`;

const ZS_ICON = {
  goed: '<path d="M5 12.5l4.2 4.2L19 7"/>', neutraal: '<path d="M6 12h12"/>', wachten: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  zon: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  prijs: '<path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/>', weer: '<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"/>',
  tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  boiler: '<path d="M12 2.5c3 4 6.5 7.5 6.5 11.5a6.5 6.5 0 0 1-13 0c0-4 3.5-7.5 6.5-11.5z"/>',
  ev: '<path d="M5 16V11l2-5h10l2 5v5M3.5 16h17M7 16v2M17 16v2M6 11h12"/>',
  heatpump: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="10" cy="12" r="4"/><path d="M17 9v6"/>',
  generic: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><circle cx="12" cy="13" r="4.5"/><path d="M8 6.5h2"/>',
  batt: '<rect x="6" y="5" width="12" height="16" rx="2.5"/><path d="M10 3h4M12 9l-2 4h4l-2 4"/>',
};

const zsEur = (v) => v == null ? "–" : (v < -0.004 ? "−" : "") + "€\u00a0" + Math.abs(v).toFixed(2).replace(".", ",");
const zsEsc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const zsKw = (w) => (Math.abs(w || 0) / 1000).toFixed(1).replace(".", ",");

class ZonnestuurBase extends HTMLElement {
  setConfig(config) { this._config = Object.assign({ entity: "sensor.zonnestuur" }, config || {}); this._key = null; }
  set hass(hass) {
    this._hass = hass;
    const st = hass.states[this._config.entity];
    const key = st ? st.last_updated + (hass.themes && hass.themes.darkMode) : "none";
    if (key === this._key) return;
    this._key = key;
    this.classList.toggle("dark", !!(hass.themes && hass.themes.darkMode));
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (e) => { if (!e.target.closest("[data-noopen]")) this._open(); });
    }
    const a = st ? st.attributes : null;
    this.shadowRoot.innerHTML = `<style>${ZS_CSS}</style><ha-card>${a && a.moment ? this.render(a) : `<div class="empty">Zonnestuur is nog niet bereikbaar. Staat de add-on aan?</div>`}</ha-card>`;
  }
  _open() {
    const a = this._hass && this._hass.states[this._config.entity];
    const url = (a && a.attributes.url) || "";
    if (!url) return;
    history.pushState(null, "", url);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }
  getCardSize() { return 4; }
  static getStubConfig() { return { entity: "sensor.zonnestuur" }; }
}

class ZonnestuurCard extends ZonnestuurBase {
  render(a) {
    const m = a.moment || {}, lvl = m.level || "neutraal", S = a.save || {};
    const tips = (a.tips || []).map((t) => `<div class="tip"><span class="ic"><svg viewBox="0 0 24 24">${ZS_ICON[t.kind] || ZS_ICON.tip}</svg></span><span>${zsEsc(t.t)}</span>${t.eur_year ? `<span class="g">+ € ${Math.round(t.eur_year)}/jaar</span>` : "<span></span>"}</div>`).join("");
    return `<div class="head"><span class="verdict ${lvl}"><svg viewBox="0 0 24 24">${ZS_ICON[lvl] || ZS_ICON.neutraal}</svg>${zsEsc(m.word || "")}</span><span class="brand"><i></i>Zonnestuur</span></div>
      ${m.text ? `<p class="why">${zsEsc(m.text)}</p>` : ""}
      ${this._config.besparing === false ? "" : `<div class="save"><div class="big num">${zsEur(S.month)}</div><div class="lbl">bespaard deze maand${S.pace ? ` · in dit tempo ± € ${S.pace} per jaar` : ""}</div>
      <div class="row3"><div><span>Vandaag</span><b class="num">${zsEur(S.today)}</b></div><div><span>Dit jaar</span><b class="num">${zsEur(S.year)}</b></div><div><span>Totaal</span><b class="num">${zsEur(S.total)}</b></div></div></div>`}
      ${this._config.tips === false || !tips ? "" : `<div class="tips">${tips}</div>`}`;
  }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }
}

class ZonnestuurBesparingCard extends ZonnestuurBase {
  render(a) {
    const S = a.save || {};
    return `<div class="head"><span class="title">Bespaard</span><span class="brand"><i></i>Zonnestuur</span></div>
      <div class="big num">${zsEur(S.month)}</div><div class="lbl">deze maand · vandaag ${zsEur(S.today)}</div>`;
  }
  getCardSize() { return 2; }
  getGridOptions() { return { columns: 6, rows: 2, min_columns: 3 }; }
}

class ZonnestuurPrijsCard extends ZonnestuurBase {
  render(a) {
    const P = a.price || {}, H = P.h || [];
    if (!H.length) return `<div class="head"><span class="title">Stroomprijs</span></div><div class="empty">Geen prijzen (vast contract of nog niet opgehaald).</div>`;
    const now = Date.now() / 1000, ps = H.map((r) => r[1] || 0), hi = Math.max(0.05, ...ps), lo = Math.min(0, ...ps);
    const bars = H.map((r) => {
      const h = Math.max(4, ((r[1] - lo) / (hi - lo)) * 100);
      const cls = [r[2], r[0] + 3600 <= now ? "past" : "", now >= r[0] && now < r[0] + 3600 ? "now" : "", r[3] ? "pl" : ""].join(" ");
      return `<i class="${cls}" style="height:${h.toFixed(0)}%" title="${new Date(r[0] * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} ${zsEur(r[1])}"></i>`;
    }).join("");
    const hh = (ts) => new Date(ts * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    const plan = (a.plan || []).map((p) => `<div><span class="t">${zsEsc(p.s)}–${zsEsc(p.e)}${p.day ? " " + p.day : ""}</span><span>${p.now ? '<span class="nw">nu</span> ' : ""}<b>${zsEsc(p.n)}</b> ${zsEsc(p.w)}</span><span class="c">${p.eur ? "± " + zsEur(p.eur) : ""}</span></div>`).join("");
    return `<div class="head"><span class="title">Stroomprijs en planning</span><span class="brand"><i></i>Zonnestuur</span></div>
      <div class="pnow"><b class="num">${zsEur(P.now).replace(/(\d),(\d\d)$/, "$1,$2")}</b><span>per kWh nu${P.avg ? ` · gemiddeld ${zsEur(P.avg)}` : ""}</span></div>
      <div class="bars" role="img" aria-label="Stroomprijs per uur">${bars}</div>
      <div class="axis">${H.map((r, i) => { const h = new Date(r[0] * 1000).getHours(); const left = (i / H.length * 100).toFixed(1);
        return h === 0 ? `<span class="d" style="left:${left}%">${i === 0 ? "vandaag" : "morgen"}</span>` : h === 12 || h === 18 ? `<span style="left:${left}%">${h}:00</span>` : ""; }).join("")}</div>
      ${this._config.planning === false ? "" : plan ? `<div class="plan">${plan}</div>` : `<div class="empty" style="margin-top:8px">Niets gepland de komende 24 uur.</div>`}`;
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }
}

function zsCar(ev, charging) {
  const plugged = ev.plug === true || (ev.plug == null && charging), x0 = 160, w = 96, f = Math.max(0, Math.min(100, ev.soc ?? 0)) / 100;
  const cable = plugged ? "M34 90 C34 124 74 128 94 114 S114 92 119 86" : "M34 90 C34 116 46 122 58 118";
  const mx = (x0 + w * (ev.min || 20) / 100).toFixed(1), tx = (x0 + w * (ev.target || 80) / 100).toFixed(1);
  return `<div class="ev ${plugged ? "plugged" : ""} ${charging ? "charging" : ""}"><svg viewBox="0 0 360 140" role="img" aria-label="${zsEsc(ev.car)} ${ev.soc ?? "?"}%">
    <path class="ln ground" d="M8 127.5 H352"/>
    <path class="ln" d="M24 34 h20 a10 10 0 0 1 10 10 v36 a10 10 0 0 1 -10 10 h-20 a10 10 0 0 1 -10 -10 v-36 a10 10 0 0 1 10 -10 z M26 44 h16"/><circle class="led" cx="34" cy="62" r="2.6"/>
    <path class="cable" d="${cable}"/><path class="dots" d="${cable}"/>
    ${plugged ? "" : `<path class="ln" d="M58 113.5 h9 a3.5 3.5 0 0 1 3.5 3.5 v3 a3.5 3.5 0 0 1 -3.5 3.5 h-9 z M70.5 116 h6 M70.5 121 h6"/>`}
    <path class="ln" d="M108 108 C100 108 97 104 97 98 L97 88 C97 82 100 79 106 77 L118 74 C130 62 146 52 166 48 C190 43 218 42 236 44 C252 46 266 56 280 64 C300 66 321 69 332 74 C338 77 341 82 341 90 L341 100 C341 105 338 108 333 108 L304 108 A22 22 0 0 0 260 108 L152 108 A22 22 0 0 0 108 108 Z"/>
    <path class="ln thin" d="M148 64 C158 55.5 177 50.5 200 49.5 L237 50 C249 52 259 57.5 267 64 Z M204 49.8 L202 64 M201 67 C203 82 203 95 201 107 M150 67 L147 103 M120 76 C170 72 260 70 330 75 M180 72 h9 M228 72 h9"/>
    <path class="ln" d="M323 74 C331 74.5 336 77 339 81"/><path class="tl" d="M99 82 L109 80"/>
    <circle class="ln" cx="130" cy="108" r="18.5"/><circle class="ln thin" cx="130" cy="108" r="8"/><circle class="hub" cx="130" cy="108" r="1.8"/>
    <circle class="ln" cx="282" cy="108" r="18.5"/><circle class="ln thin" cx="282" cy="108" r="8"/><circle class="hub" cx="282" cy="108" r="1.8"/>
    <circle class="port" cx="119" cy="86" r="3.4"/>
    <path class="sbg" d="M${x0} 101 H${x0 + w}"/>
    ${ev.soc != null ? `<path class="sfg" d="M${x0} 101 H${(x0 + w * f).toFixed(1)}"/><path class="mk mn" d="M${mx} 98 V104"/><path class="mk tgt" d="M${tx} 97 V105"/>` : ""}
  </svg></div>`;
}

class ZonnestuurAutoCard extends ZonnestuurBase {
  render(a) {
    const d = (a.devices || []).find((x) => x.ev && (!this._config.device || x.id === this._config.device));
    if (!d) return `<div class="head"><span class="title">Auto laden</span><span class="brand"><i></i>Zonnestuur</span></div><div class="empty">Nog geen auto gekoppeld. Koppel hem in Zonnestuur.</div>`;
    const e = d.ev, charging = d.on && d.w > 50, plugged = e.plug === true || (e.plug == null && d.on);
    const st = charging ? `Laadt · ${zsKw(d.w)} kW` : plugged ? "Stekker erin" : e.plug === false ? "Stekker eruit" : "Wacht";
    return `<div class="head"><span class="title">${zsEsc(d.name)}</span><span class="brand"><i></i>Zonnestuur</span></div>
      ${zsCar(e, charging)}
      <div class="evst"><span class="pct num">${e.soc != null ? e.soc + "%" : "–"}<small>${zsEsc(e.car)}${e.km != null ? ` · ${e.km} km` : ""}</small></span><span class="st ${plugged ? "on" : ""}"><i></i>${st}</span></div>
      <div class="evplan">${e.plan ? `Gepland <b>${zsEsc(e.plan)}</b>${e.eur ? ` · <b>${zsEur(e.eur)}</b>` : ""} · tot ${e.target}%` : `Doel ${e.target}% · minimum ${e.min}%`}</div>`;
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }
}

class ZonnestuurApparatenCard extends ZonnestuurBase {
  render(a) {
    const rows = (a.devices || []).map((d) => `<div class="dev ${d.on ? "on" : ""}"><span class="ic"><svg viewBox="0 0 24 24">${ZS_ICON[d.kind] || ZS_ICON.generic}</svg></span>
      <span><b>${zsEsc(d.name)}</b><span>${d.on ? "Aan" : "Uit"} · ${zsEsc(d.why || "")}</span></span><span class="kw">${d.on && d.w ? zsKw(d.w) + " kW" : ""}</span></div>`);
    for (const b of a.batteries || []) rows.push(`<div class="dev ${Math.abs(b.w) > 30 ? "on" : ""}"><span class="ic"><svg viewBox="0 0 24 24">${ZS_ICON.batt}</svg></span>
      <span><b>${zsEsc(b.name || "Thuisbatterij")}</b><span>${b.soc != null ? b.soc + "%" : ""}${b.action ? " · " + zsEsc({ auto: "zelf gebruiken", save: "vasthouden", charge: "laden van het net", export: "verkopen aan het net" }[b.action] || b.action) : ""}</span></span><span class="kw">${b.w ? zsKw(b.w) + " kW" : ""}</span></div>`);
    return `<div class="head"><span class="title">Apparaten</span><span class="brand"><i></i>Zonnestuur</span></div>
      <div class="devs">${rows.join("") || '<div class="empty">Nog geen apparaten.</div>'}</div>`;
  }
  getCardSize() { return 4; }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }
}

// ------------------------------------------------------------------ Nest Hub / wandscherm: groot en rustig, leesbaar van de bank
const ZS_HUB_CSS = `
  /* ===== Zonnestuur op de Nest Hub: Daglicht (kaarten 1.11, Zonnestuur 0.102.0) =====
     Overdag licht papier, na zonsondergang warm zwart, 's nachts gedimd en warm. Eén hoofdboodschap groot in een eigen vlak;
     de rest rustig. Basis werkt op de oude Cast-browser (Chrome 90): vaste kleuren en vh. Waar het kan: container queries. */
  :host { display: block; }
  .hub { --u: 1vh; --w: 1vw;
    --bg: #f3efe7; --vlak: #fffdf9; --vlak2: #f1ebe0; --ink: #17140f; --ink2: #57524a; --ink3: #77716a; --lijn: rgba(40,30,10,.10);
    --schaduw: 0 1px 2px rgba(40,30,10,.06), 0 14px 30px -22px rgba(40,30,10,.38);
    --zon: #f2a024; --knop: #f2a024; --knop-ink: #1a1203; --groen: #11774a; --rood: #b4301f; --net: #2e62c9; --bat: #0f7d74; --auto: #6d4bd8;
    --held: #fffdf9; --held-ink: #17140f; --held-acc: #11774a;
    --bar: rgba(40,30,10,.13); --bar-ch: #7cc4a0; --bar-blk: #11774a; --bar-dr: #e3998c;
    --lucht-a: #8ec9f0; --lucht-b: #dcefff;
    position: relative; overflow: hidden; box-sizing: border-box; height: var(--zs-hub-h, 100vh); min-height: 360px;
    background: var(--bg); color: var(--ink); font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    padding: 4.4vh 4.6vw 3.8vh; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; grid-template-columns: minmax(0, 1fr); gap: 2.2vh;
    -webkit-font-smoothing: antialiased; transition: background-color 1.2s ease, color 1.2s ease; }
  @supports (height: 1cqh) { .hub { container-type: size; --u: 1cqh; --w: 1cqw; } }
  .hub.donker { --bg: #0b0d11; --vlak: #15181e; --vlak2: #1d2129; --ink: #f3efe8; --ink2: #b1b5bb; --ink3: #8f949b; --lijn: rgba(255,255,255,.08);
    --schaduw: inset 0 1px 0 rgba(255,255,255,.04), 0 18px 40px -28px rgba(0,0,0,.9);
    --zon: #ffb547; --knop: #ffb547; --groen: #45d69a; --rood: #ff7a66; --net: #8bbcff; --bat: #4fd1c5; --auto: #b9a3ff;
    --held: #15181e; --held-ink: #f3efe8; --held-acc: #45d69a;
    --bar: rgba(255,255,255,.12); --bar-ch: #2f8f63; --bar-blk: #45d69a; --bar-dr: #9b4136; --lucht-a: #1d2d57; --lucht-b: #0e1630; }
  .hub.f-schemer { --lucht-a: #3b3f78; --lucht-b: #e39a6b; }
  .hub.f-bewolkt { --lucht-a: #9fb0be; --lucht-b: #dfe6ec; }
  /* de toestand bepaalt het hoofdvlak: goedkoop = groen, duur = rood, wachten = rustig */
  .hub.goed { --held: #dff1e6; --held-ink: #0d3a25; --held-acc: #11774a; }
  .hub.piek { --held: #f9e2dc; --held-ink: #4a1209; --held-acc: #b4301f; }
  .hub.donker.goed { --held: #10281d; --held-ink: #e6f7ee; --held-acc: #45d69a; }
  .hub.donker.piek { --held: #2b1612; --held-ink: #fbe9e5; --held-acc: #ff7a66; }
  .hub > * { position: relative; min-width: 0; }
  .num, .clock, .h, .prijs b { font-variant-numeric: tabular-nums; }

  /* kopregel */
  .top { display: flex; justify-content: space-between; align-items: center; gap: 2vw; z-index: 3; font-size: 2.9vh; font-size: calc(2.9 * var(--u)); }
  .brand { display: inline-flex; align-items: center; gap: .55em; font: 700 1em/1 "Inter Tight", Inter, sans-serif; letter-spacing: -.01em; color: var(--ink); min-width: 0; white-space: nowrap; }
  .brand .logo { width: 1.55em; height: 1.55em; flex: none; }
  .brand .sv { font: 600 .82em/1 Inter, sans-serif; color: var(--groen); background: rgba(17,119,74,.11); padding: .45em .8em; border-radius: 99px; margin-left: .3em; }
  .hub.donker .brand .sv { background: rgba(69,214,154,.13); }
  .groet { color: var(--ink); }
  .tr { display: flex; align-items: center; gap: 1.4vw; }
  .clock { font: 650 1.25em/1 "Inter Tight", Inter, sans-serif; letter-spacing: -.02em; color: var(--ink); }
  .rknop { display: inline-flex; align-items: center; gap: .5em; min-height: 48px; padding: 0 1.05em; border-radius: 99px; border: 0; font: 650 .9em/1 Inter, sans-serif;
    cursor: pointer; -webkit-tap-highlight-color: transparent; transition: transform .15s ease; }
  .rknop.aan { background: var(--vlak); color: var(--ink); box-shadow: var(--schaduw), 0 0 0 1px var(--lijn); }
  .rknop.aan svg { color: var(--zon); }
  .rknop.uit { background: var(--vlak2); color: var(--ink); }
  .rknop:active { transform: scale(.95); }
  .rknop svg { width: 1em; height: 1em; }
  .radio { display: inline-flex; align-items: center; gap: .55em; padding: .45em .9em; border-radius: 99px; background: var(--vlak2); color: var(--ink); font-size: .85em; font-weight: 600; }
  .radio.tik { background: var(--knop); color: var(--knop-ink); cursor: pointer; }
  .eq { display: inline-flex; align-items: flex-end; gap: 2px; height: .9em; }
  .eq i { width: 3px; height: 35%; border-radius: 1px; background: var(--zon); }
  .radio.tik .eq i { background: var(--knop-ink); }
  .radio.speelt .eq i { animation: zseq 1.1s ease-in-out infinite; }
  .radio.speelt .eq i:nth-child(2) { animation-delay: -.4s; } .radio.speelt .eq i:nth-child(3) { animation-delay: -.8s; }
  @keyframes zseq { 0%, 100% { height: 30%; } 50% { height: 100%; } }
  .rv { position: fixed; right: 0; bottom: 0; width: 4px; height: 4px; opacity: .02; pointer-events: none; }

  /* midden: links de boodschap, rechts het huis in de lucht van nu */
  .mid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 52%); gap: 3vw; align-items: stretch; min-height: 0; }
  .mid.zonder-huis { grid-template-columns: minmax(0, 1fr); }
  .links { display: flex; flex-direction: column; justify-content: center; gap: 1.6vh; gap: calc(1.6 * var(--u)); min-height: 0; }
  .held { background: var(--held); color: var(--held-ink); border-radius: 26px; padding: 2.8vh 2.6vw 3vh; padding: calc(2.8 * var(--u)) calc(2.6 * var(--w)) calc(3 * var(--u));
    box-shadow: var(--schaduw); transition: background-color 1s ease; min-width: 0; }
  .status { display: flex; align-items: center; gap: .5em; font-size: 2.9vh; font-size: calc(2.9 * var(--u)); font-weight: 650; color: var(--held-acc); }
  .status i { width: .62em; height: .62em; border-radius: 50%; background: currentColor; flex: none; }
  .hub.goed:not(.lite) .status i { animation: zspuls 2.4s ease-in-out infinite; }
  @keyframes zspuls { 0%, 100% { box-shadow: 0 0 0 0 rgba(17,119,74,.45); } 50% { box-shadow: 0 0 0 .45em rgba(17,119,74,0); } }
  .h { font: 780 12.5vh/.92 "Inter Tight", Inter, sans-serif; font-size: calc(12.5 * var(--u)); letter-spacing: -.05em; margin-top: .9vh; white-space: nowrap; }
  .sub { margin-top: 1vh; font-size: 3.2vh; font-size: calc(3.2 * var(--u)); font-weight: 600; opacity: .78; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prijs { margin-top: 1.8vh; display: flex; align-items: baseline; flex-wrap: wrap; gap: .25em .55em; font-size: 2.6vh; font-size: calc(2.6 * var(--u)); }
  .prijs b { font: 700 1.6em/1 "Inter Tight", Inter, sans-serif; letter-spacing: -.03em; }
  .prijs span { opacity: .75; }
  .prijs em { font-style: normal; font-weight: 650; font-size: .9em; padding: .3em .7em; border-radius: 99px; background: rgba(17,119,74,.13); color: var(--groen); }
  .hub.donker .prijs em { background: rgba(69,214,154,.14); }
  .prijs em.duur { background: rgba(180,48,31,.12); color: var(--rood); }
  .hub.donker .prijs em.duur { background: rgba(255,122,102,.14); }
  .do { display: flex; align-items: center; gap: .6em; font-size: 2.7vh; font-size: calc(2.7 * var(--u)); color: var(--ink); font-weight: 550; }
  .do span { display: inline-grid; place-items: center; width: 1.8em; height: 1.8em; border-radius: 30%; background: var(--vlak); box-shadow: var(--schaduw); color: var(--groen); flex: none; }
  .do svg, .status svg { width: 1em; height: 1em; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .regelt { font-size: 2.5vh; font-size: calc(2.5 * var(--u)); color: var(--ink2); display: flex; gap: .45em 1.1em; flex-wrap: wrap; overflow: hidden; max-height: 1.5em; line-height: 1.5; }
  .regelt b { color: var(--ink); font-weight: 650; margin-right: .3em; font-variant-numeric: tabular-nums; }
  .regelt .pl { color: var(--ink3); }
  .regelt span { white-space: nowrap; }

  .hubhuis { position: relative; min-height: 0; display: flex; align-items: flex-end; justify-content: flex-end; }
  /* de lucht van het moment, zonder kader: loopt naar alle kanten weg in de achtergrond */
  .hubhuis::before { content: ""; position: absolute; inset: -6% -8% 2% -4%; pointer-events: none; border-radius: 50%;
    background: radial-gradient(closest-side, var(--lucht-b), rgba(220,239,255,0)); opacity: .9; }
  .hub.donker .hubhuis::before { background: radial-gradient(closest-side, var(--lucht-a), rgba(29,45,87,0)); opacity: .85; }
  .hub.f-schemer .hubhuis::before { background: radial-gradient(closest-side, rgba(227,154,107,.55), rgba(59,63,120,0)); }
  .hstage { position: relative; height: 100%; max-height: 100%; aspect-ratio: 436 / 204; max-width: 100%; }
  .hstage .hz { width: 100%; height: 100%; display: block; overflow: visible;
    -webkit-mask-image: linear-gradient(180deg, #000 82%, transparent); mask-image: linear-gradient(180deg, #000 82%, transparent); }
  .hstage .hz .hz-labels, .hstage .hz > rect[fill="none"] { display: none; }
  .hch { position: absolute; display: flex; align-items: center; gap: .45em; padding: .32em .75em .32em .32em; border-radius: 14px; background: var(--vlak); color: var(--ink);
    box-shadow: var(--schaduw), 0 0 0 1px var(--lijn); font-size: 2.1vh; font-size: calc(2.1 * var(--u)); line-height: 1.15; z-index: 2; }
  .hch .i { width: 1.9em; height: 1.9em; border-radius: 10px; display: grid; place-items: center; background: var(--vlak2); color: var(--k); }
  .hch .i svg { width: 1.15em; height: 1.15em; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .hch small { display: block; font-size: .78em; color: var(--ink2); font-weight: 550; }
  .hch b { display: block; font: 700 1em/1.1 "Inter Tight", Inter, sans-serif; white-space: nowrap; }
  .hch.zon { --k: var(--zon); left: 2%; top: 4%; } .hch.bat { --k: var(--bat); left: 2%; top: 30%; }
  .hch.net { --k: var(--net); left: 2%; bottom: 6%; } .hch.net.terug { --k: var(--groen); } .hch.auto { --k: var(--auto); right: 2%; bottom: 6%; }

  /* onder: tegels, prijs per uur, nieuws */
  .onder { display: flex; flex-direction: column; gap: 1.6vh; gap: calc(1.6 * var(--u)); min-width: 0; }
  .mid, .onder { zoom: var(--zs-zoom, 1); }
  .info { display: flex; gap: 1.4vw; flex-wrap: wrap; overflow: hidden; height: 9.6vh; height: calc(9.6 * var(--u)); }
  .chip { height: 100%; box-sizing: border-box; white-space: nowrap; display: flex; align-items: center; gap: .7em; padding: 0 1.1em 0 .8em; border-radius: 18px;
    background: var(--vlak); box-shadow: var(--schaduw), 0 0 0 1px var(--lijn); font-size: 2.3vh; font-size: calc(2.3 * var(--u)); }
  .chip b { display: block; font-size: 1.08em; font-weight: 680; letter-spacing: -.01em; line-height: 1.15; }
  .chip span { display: block; color: var(--ink2); font-size: .9em; line-height: 1.2; }
  .chip.nu { box-shadow: var(--schaduw), inset 0 0 0 2px var(--bin, var(--zon)); }
  .chip.nu span { color: var(--ink); }
  .bin { width: 1.7em; height: auto; flex: none; }
  .wx { width: 1.8em; height: 1.8em; flex: none; fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .wx .sun { stroke: var(--zon); } .wx .rain { stroke: var(--net); }

  .strip { position: relative; display: flex; align-items: flex-end; gap: .35vw; height: 9.5vh; height: calc(9.5 * var(--u)); }
  .strip.met-label { margin-top: 3.4vh; margin-top: calc(3.4 * var(--u)); }
  .strip i { flex: 1; border-radius: 5px 5px 2px 2px; background: var(--bar); min-height: 4px; transition: height .6s ease; }
  .strip i.ch { background: var(--bar-ch); }
  .strip i.blk { background: var(--bar-blk); }
  .strip i.dr { background: var(--bar-dr); }
  .strip i.past { opacity: .35; }
  .strip i.now { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--ink); }
  .blklab { position: absolute; top: -.5em; transform: translate(-50%, -100%); white-space: nowrap; font-size: 2vh; font-size: calc(2 * var(--u)); font-weight: 680;
    color: #fff; background: var(--bar-blk); padding: .25em .7em; border-radius: 99px; }
  .hub.donker .blklab { color: #06150e; }
  .ax { position: relative; height: 1.3em; color: var(--ink3); font-size: 1.9vh; font-size: calc(1.9 * var(--u)); margin-top: -.4vh; font-variant-numeric: tabular-nums; }
  .ax span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
  .ax span.d { transform: none; color: var(--ink2); font-weight: 650; }
  .plijn { position: relative; height: 9vh; }
  .plijn svg { width: 100%; height: 100%; display: block; overflow: visible; }
  .plijn path[stroke] { stroke: var(--groen); } .plijn stop { stop-color: var(--groen); }
  .plijn .nu { position: absolute; top: 0; bottom: 0; width: 0; border-left: 2px dashed var(--ink3); }
  .plijn .nu i { position: absolute; left: -7px; width: 12px; height: 12px; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 3px var(--bg); transform: translateY(-50%); }
  .plijn .blkl { position: absolute; top: 0; bottom: 0; border-radius: 10px; background: rgba(17,119,74,.12); }
  .plijn .blkl b { position: absolute; top: -.2em; left: 50%; transform: translate(-50%, -100%); white-space: nowrap; font-size: 1.9vh; color: #fff; font-weight: 650; background: var(--bar-blk); padding: .2em .6em; border-radius: 99px; }

  .news { position: relative; overflow: hidden; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 1.6vw;
    padding: 1.4vh 1.6vw; border-radius: 18px; background: var(--vlak); box-shadow: var(--schaduw), 0 0 0 1px var(--lijn); }
  .news .src { display: grid; justify-items: start; gap: 4px; }
  .news .src b { font-size: 1.9vh; font-size: calc(1.9 * var(--u)); font-weight: 800; letter-spacing: .06em; color: var(--bg); background: var(--nc, var(--ink)); padding: .25em .6em; border-radius: 7px; }
  .news .src time { font-size: 1.8vh; font-size: calc(1.8 * var(--u)); color: var(--ink3); white-space: nowrap; }
  .news .kop { font: 620 3vh/1.25 "Inter Tight", Inter, sans-serif; font-size: calc(3 * var(--u)); letter-spacing: -.01em; color: var(--ink);
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  .news .kop.in { animation: zsfade .9s ease; }
  .news .np { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: var(--zon); opacity: .7; transform-origin: left; animation: zsnp 15s linear forwards; }
  @keyframes zsnp { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes zsfade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
  .empty { align-self: center; font-size: 22px; color: var(--ink2); }

  /* dichtbij: na een tik 30 seconden meer (wat Zonnestuur regelt, per apparaat), daarna weer rustig */
  .meer { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2vh 1.4vw; }
  .meer .rij { display: flex; align-items: center; gap: .8em; padding: 1.3vh 1.2vw; border-radius: 18px; background: var(--vlak); box-shadow: var(--schaduw), 0 0 0 1px var(--lijn);
    font-size: 2.4vh; font-size: calc(2.4 * var(--u)); }
  .meer .rij b { font: 700 1.15em/1 "Inter Tight", Inter, sans-serif; font-variant-numeric: tabular-nums; min-width: 3.2em; }
  .meer .rij span { color: var(--ink2); } .meer .rij strong { color: var(--ink); font-weight: 650; display: block; }
  .meer .rij.nu b { color: var(--groen); }
  .meer-kop { display: flex; justify-content: space-between; align-items: baseline; font-size: 2.4vh; font-size: calc(2.4 * var(--u)); color: var(--ink2); }
  .meer-kop b { color: var(--ink); font-weight: 700; }
  .hub.dicht .meer { animation: zsfade .4s ease; }

  /* nacht: gedimd en warm, alleen de klok en wanneer het goedkoop is (zoals een nachtklok) */
  .hub.nacht { --bg: #000; --ink: #c0553a; --ink2: #8a3e2b; --vlak2: #140806; --knop: #5a2416; --knop-ink: #f1b8a3; }
  .nmid { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .nklok { font: 300 26vh/1 "Inter Tight", Inter, system-ui, sans-serif; letter-spacing: -.04em; font-variant-numeric: tabular-nums; color: var(--ink); }
  .nreg { margin-top: 2vh; font-size: 3.4vh; color: var(--ink2); }
  .hub.nacht .brand, .hub.nacht .clock { color: var(--ink2); } .hub.nacht .brand .logo { opacity: .5; }

  /* kleinere schermen (Nest Hub 1024×600) en staand */
  @media (max-height: 640px) { .brand .sv { display: none; } }
  @container (max-height: 640px) { .brand .sv { display: none; } }
  @container (max-width: 760px) { .mid { grid-template-columns: minmax(0, 1fr); } .hubhuis { display: none; } }
  @media (max-aspect-ratio: 1/1) { .mid { grid-template-columns: minmax(0, 1fr); } .hubhuis { display: none; } }
  /* Licht (Nest Hub, oud tablet): geen bewegende dingen; een te zware pagina laat de Hub vallen */
  .lite .radio.speelt .eq i { animation: none; height: 70%; }
  .lite .news .np, .lite .kop.in, .hub.lite.dicht .meer { animation: none; }
  .lite .news .np { display: none; }
  @media (prefers-reduced-motion: reduce) { .hub *, .hub { animation: none !important; transition: none !important; } }
  @supports (text-wrap: balance) { .news .kop { text-wrap: balance; } }

  /* Sfeerbeeld (1.12): een getekend landschap met het huis bovenin, dat met de zon meegaat (dag, zonsondergang, nacht).
     Het loopt naar links en naar onderen weg in de achtergrond; de tegels, prijzen en het nieuws staan op een rustige band. */
  .sfeerbeeld { position: absolute; z-index: 0; top: 0; right: 0; width: 82%; height: 72%; background-size: cover; background-position: right center;
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 38%), linear-gradient(0deg, transparent 0, #000 22%);
    -webkit-mask-composite: source-in; mask-image: linear-gradient(90deg, transparent 0, #000 38%), linear-gradient(0deg, transparent 0, #000 22%);
    mask-composite: intersect; pointer-events: none; }
  .hub.sfeer > *:not(.sfeerbeeld) { z-index: 1; }
  .hub.sfeer .hubhuis::before { display: none; }
  .hub.sfeer .hubhuis .hz { visibility: hidden; }
  .hub.sfeer .onder { background: var(--bg); margin: 0 -4.6vw -3.8vh; padding: 2vh 4.6vw 3.8vh; border-radius: 28px 28px 0 0;
    box-shadow: 0 -18px 40px -26px rgba(40,30,10,.45); }
  .hub.sfeer.donker .onder { box-shadow: 0 -18px 40px -22px rgba(0,0,0,.9); }
  .hub.sfeer .regelt { text-shadow: 0 0 12px var(--bg), 0 0 4px var(--bg); }
  .hub.sfeer .brand, .hub.sfeer .clock { text-shadow: 0 0 14px var(--bg), 0 0 4px var(--bg); }
  .hub.sfeer.dicht .sfeerbeeld { height: 62%; }
`;
const ZS_HUB_ICON = {
  bolt: '<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6l1-8z"/>',
  wait: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  wash: '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13" r="4.5"/><path d="M8 6.5h2"/>',
};

const ZS_BIN_KLEUR = { gft: "#3f9b3a", groente: "#3f9b3a", papier: "#2f6fe0", pmd: "#f08c00", plastic: "#f08c00", restafval: "#8b95a3", rest: "#8b95a3", glas: "#14a38b", textiel: "#9b5de5" };
const ZS_BIN_NAAM = { gft: "GFT", groente: "GFT", papier: "Papier", pmd: "PMD", plastic: "Plastic", restafval: "Restafval", rest: "Restafval", glas: "Glas", textiel: "Textiel" };
function zsBin(c) {
  return `<svg class="bin" viewBox="0 0 40 48" aria-hidden="true"><path d="M7 12h26l-2.6 29a3 3 0 0 1-3 2.7H12.6a3 3 0 0 1-3-2.7z" fill="${c}"/>
    <path d="M7 12h26l-.4 4.5H7.4z" fill="#000" opacity=".18"/><rect x="4" y="7" width="32" height="6" rx="2" fill="${c}"/><rect x="4" y="7" width="32" height="6" rx="2" fill="#000" opacity=".28"/>
    <rect x="15" y="4" width="10" height="4" rx="1.5" fill="${c}"/><path d="M14 20v17M20 20v17M26 20v17" stroke="#000" stroke-opacity=".16" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="44" r="3.4" fill="#1b1f24" stroke="#fff" stroke-opacity=".35"/></svg>`;
}
const ZS_WX = {
  sunny: '<circle class="sun" cx="12" cy="12" r="4.2"/><path class="sun" d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
  partlycloudy: '<circle class="sun" cx="9" cy="9" r="3.4"/><path class="sun" d="M9 2.5v1.6M2.5 9h1.6M4.4 4.4l1.1 1.1M13.6 4.4l-1.1 1.1"/><path d="M8.5 19.5h9a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.4 1.6A2.7 2.7 0 0 0 8.5 19.5z"/>',
  cloudy: '<path d="M7 18.5h10a4 4 0 0 0 0-8 6 6 0 0 0-11.4 1.8A3.1 3.1 0 0 0 7 18.5z"/>',
  rainy: '<path d="M7 15h10a4 4 0 0 0 0-8 6 6 0 0 0-11.4 1.8A3.1 3.1 0 0 0 7 15z"/><path class="rain" d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5"/>',
  night: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
};
ZS_WX.pouring = ZS_WX.rainy; ZS_WX.lightning = ZS_WX["lightning-rainy"] = ZS_WX.rainy; ZS_WX.snowy = ZS_WX["snowy-rainy"] = ZS_WX.rainy; ZS_WX.fog = ZS_WX.windy = ZS_WX["windy-variant"] = ZS_WX.cloudy; ZS_WX["clear-night"] = ZS_WX.night;
const ZS_WX_NL = { sunny: "zonnig", "clear-night": "helder", partlycloudy: "half bewolkt", cloudy: "bewolkt", rainy: "regen", pouring: "flinke regen", lightning: "onweer", "lightning-rainy": "onweer", snowy: "sneeuw", "snowy-rainy": "natte sneeuw", fog: "mist", windy: "veel wind", "windy-variant": "veel wind", hail: "hagel" };

// sensor.zonnestuur (compact) → wat de huistekening verwacht (zoals /api/status)
function zsHuisStatus(a) {
  const h = a.huis || {};
  return {
    huis: h.z, huis_naam: h.naam, contract: h.contract, has_panels: a.panels, inverter: { pv_w: h.pv }, grid_w: h.net,
    devices: (a.devices || []).map((d) => ({ name: d.name, kind: d.kind, on: d.on, power_w: d.w, ev: d.ev ? { soc: d.ev.soc, plug: d.ev.plug } : null })),
    batteries: (a.batteries || []).map((b) => ({ soc: b.soc, power_w: b.w })),
    waarnemen: (a.waarnemen || []).map((w) => ({ naam: w.name, power_w: w.w, soc: w.soc, wie: w.wie, plug: w.plug })),
  };
}

class ZonnestuurHubCard extends HTMLElement {
  setConfig(config) { this._config = Object.assign({ entity: "sensor.zonnestuur", tip: "Zet nu de was of vaatwasser aan", radio_cast_only: true }, config || {}); this._key = null; }
  set hass(hass) {
    this._hass = hass;
    this._radioSync();
    const st = hass.states[this._config.entity];
    const slot = Math.floor(Date.now() / 15000);
    const dicht = this._dicht && Date.now() < this._dicht;
    const key = (st ? st.last_updated : "none") + new Date().getMinutes() + this._radioState() + (dicht ? "d" : "");
    if (key === this._key) {
      // Alleen de nieuwskop wisselt: dan alleen die balk vervangen, niet het hele scherm opnieuw opbouwen.
      if (slot !== this._nslot && this._c) {
        this._nslot = slot;
        const old = this._c.querySelector(".news"), html = this._nieuws();
        if (old && html) { const t = document.createElement("div"); t.innerHTML = html; old.replaceWith(t.firstElementChild); }
      }
      return;
    }
    this._key = key; this._nslot = slot;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (e) => {
        const k = e.target.closest("[data-radio]");
        if (k) { this._radioKnop(k.dataset.radio === "aan"); return; }
        if (e.target.closest(".radio") && this._audio) { this._audio.play().catch(() => {}); return; }
        // Dichtbij: een tik ergens op het scherm toont 30 seconden meer; nog een tik = weer rustig
        this._dicht = this._dicht && Date.now() < this._dicht ? 0 : Date.now() + 30000;
        this._key = null; this._hass && (this.hass = this._hass);
      });
      zsLettertypen();
      zsMeldBrowser(hass);
      this._t = setInterval(() => { this._hass && (this.hass = this._hass); }, 5000);
    }
    if (!this._c) {
      this.shadowRoot.innerHTML = `<style>${ZS_HUB_CSS}</style><div id="c"></div>`;
      this._c = this.shadowRoot.getElementById("c");
      if (this._audio) this.shadowRoot.appendChild(this._audio);
    }
    const html = st && st.attributes.moment ? this.render(st.attributes) : `<div class="hub"><div></div><div class="empty">Zonnestuur is nog niet bereikbaar.</div><div></div></div>`;
    const teken = () => {
      this._c.innerHTML = html;
      const hz = this._c.querySelector(".hubhuis svg");
      if (hz && window.zsHuis) {
        if (!this.shadowRoot.getElementById("hzcss")) {
          const c = document.createElement("style"); c.id = "hzcss"; c.textContent = window.zsHuis.css; this.shadowRoot.appendChild(c);
        }
        try { window.zsHuis.teken(hz, zsHuisStatus(st.attributes), null); } catch (e) { console.warn("zonnestuur huis", e); }
      }
      if (this._config.height) this._c.querySelector(".hub").style.setProperty("--zs-hub-h", this._config.height);
    };
    // Wisselt de toestand (goedkoop/duur, dag/avond, tik voor meer), dan zacht overvloeien met View Transitions als de browser dat kan
    const toestand = (html.match(/class="(hub[^"]*)"/) || [])[1] || "";
    const wissel = this._toestand && this._toestand !== toestand && document.startViewTransition && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    this._toestand = toestand;
    if (wissel) { try { document.startViewTransition(teken); } catch (e) { teken(); } } else teken();
  }
  // Radio in het scherm: zo speelt de muziek door terwijl het scherm in beeld is (een Nest Hub draait maar één cast-app).
  // radio_entity: een input_text met een stream-URL (of een Music Assistant-id "builtin://radio/<url>"); leeg = geen radio.
  _radioUrl() {
    const c = this._config, h = this._hass;
    let u = c.radio || "";
    if (c.radio_entity && h) { const st = h.states[c.radio_entity]; u = st && !["unknown", "unavailable", ""].includes(st.state) ? st.state : ""; }
    // net op "Radio aan" getikt en de koppelmotor heeft het nog niet doorgegeven
    if (this._wacht && Date.now() < this._wacht.tot && !/^(https?|builtin):/.test(u)) u = this._wacht.u;
    u = u.replace(/^builtin:\/\/radio\//, "");
    if (!/^https?:\/\//.test(u)) return "";
    if (c.radio_cast_only && !/CrKey/i.test(navigator.userAgent)) return "";
    return u;
  }
  _radioSync() {
    const u = this._radioUrl();
    if (!u) { if (this._audio && this._audio.src) { this._audio.pause(); this._audio.removeAttribute("src"); this._audio.dataset.u = ""; this._audio.load(); this._rs = ""; } return; }
    if (!this._audio) {
      // Als <video> en zichtbaar in de pagina: een Nest Hub zet bij alleen geluid na een paar minuten de fotolijst eroverheen.
      const a = this._audio = document.createElement(this._config.radio_als_video === false ? "audio" : "video");
      a.preload = "none"; a.playsInline = true; a.setAttribute("playsinline", ""); a.className = "rv";
      if (this.shadowRoot) this.shadowRoot.appendChild(a);
      const upd = (st) => { if (this._rs !== st) { this._rs = st; this._key = null; this._hass && (this.hass = this._hass); } };
      a.addEventListener("playing", () => {
        upd("speelt");
        // Zacht laten opkomen: nooit in één keer hard.
        const doel = Math.max(0, Math.min(1, +(this._config.radio_volume ?? 1))), t0 = Date.now();
        clearInterval(this._fade);
        this._fade = setInterval(() => { const f = Math.min(1, (Date.now() - t0) / 6000); a.volume = doel * f * f; if (f >= 1) clearInterval(this._fade); }, 100);
      });
      a.addEventListener("pause", () => upd(this._audio.src ? "pauze" : ""));
      const retry = () => { upd("laden"); clearTimeout(this._rt); this._rt = setTimeout(() => { if (this._audio.src) { this._audio.volume = 0; this._audio.load(); this._audio.play().catch(() => upd("tik")); } }, 5000); };
      a.addEventListener("error", retry); a.addEventListener("stalled", retry); a.addEventListener("ended", retry);
    }
    if (this._audio.dataset.u !== u) {
      this._laatste = u; try { localStorage.setItem("zs_radio_laatst", u); } catch (e) {}
      this._audio.dataset.u = u; this._audio.volume = 0; this._audio.src = u; this._rs = "laden";
      this._audio.play().catch(() => { this._rs = "tik"; this._key = null; });
    }
  }
  _radioState() { return (this._rs || "") + (this._radioAan() ? "1" : "0"); }
  // Staat de radio aan volgens de koppelmotor? (los van of dit scherm hem zelf afspeelt)
  _radioAan() {
    const c = this._config, h = this._hass;
    if (!c.radio_entity || !h) return !!this._radioUrl();
    const st = h.states[c.radio_entity], v = st ? st.state : "";
    if (this._wacht && Date.now() < this._wacht.tot) return true;
    return /^(https?:\/\/|builtin:\/\/radio\/)/.test(v);
  }
  // Knop: uit zet de input_text op "uit" (dan start een automatisering hem die dag niet vanzelf opnieuw),
  // aan zet de zender terug. De zender komt uit radio_stream, anders de laatst gespeelde.
  _radioKnop(aan) {
    const c = this._config, h = this._hass;
    if (!c.radio_entity || !h) return;
    if (aan) {
      const u = c.radio_stream || this._laatste || (() => { try { return localStorage.getItem("zs_radio_laatst"); } catch (e) { return ""; } })();
      if (!u) return;
      h.callService("input_text", "set_value", { entity_id: c.radio_entity, value: u });
      // Tik = gebruikersgebaar: meteen hier starten (dan mag afspelen ook zonder autoplay), niet wachten op de koppelmotor.
      this._wacht = { u, tot: Date.now() + 8000 };
      this._radioSync();
    } else {
      this._wacht = null;
      h.callService("input_text", "set_value", { entity_id: c.radio_entity, value: "uit" });
      if (this._audio) this._audio.pause();
    }
    this._key = null;
  }
  _radioKnopHtml() {
    const c = this._config;
    if (!c.radio_entity || c.radio_knop === false) return "";
    const aan = this._radioAan();
    const heeftZender = c.radio_stream || this._laatste || (() => { try { return localStorage.getItem("zs_radio_laatst"); } catch (e) { return ""; } })();
    if (!aan && !heeftZender) return "";
    return aan
      ? `<button class="rknop uit" data-radio="uit" aria-label="Radio uit"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>Radio uit</button>`
      : `<button class="rknop aan" data-radio="aan" aria-label="Radio aan"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>Radio aan</button>`;
  }
  _radioName() {
    if (this._config.radio_name) return this._config.radio_name;
    try { const h = new URL(this._audio.dataset.u).hostname.split(".").filter((x) => !["stream", "streams", "icecast", "www", "live", "nl", "com", "net", "fm"].includes(x)); return h.length ? h[0].charAt(0).toUpperCase() + h[0].slice(1) : "Radio"; } catch (e) { return "Radio"; }
  }
  _radioPill() {
    if (!this._rs) return "";
    const txt = this._rs === "tik" ? "Tik voor de radio" : this._rs === "laden" ? `${zsEsc(this._radioName())} · laden` : zsEsc(this._radioName());
    return `<span class="radio ${this._rs}"><span class="eq"><i></i><i></i><i></i></span>${txt}</span>`;
  }
  disconnectedCallback() { if (this._fcSub) { this._fcSub.then((u) => u && u()).catch(() => {}); this._fcSub = null; } clearInterval(this._t); this._t = null; this._key = null; if (this._audio) { this._audio.pause(); this._audio.removeAttribute("src"); this._audio.dataset.u = ""; this._rs = ""; } }
  connectedCallback() { if (!this._t && this._hass) { this._t = setInterval(() => { this.hass = this._hass; }, 5000); this._key = null; this.hass = this._hass; } }
  // Afval: welke container deze week aan de weg moet. Vindt zelf de sensoren van "Afvalbeheer" (…_gft, …_papier, …_pmd, …_restafval),
  // of geef ze op: afval: [{ entity, naam, kleur }]. afval: false zet het uit.
  _afval() {
    const c = this._config, h = this._hass;
    if (c.afval === false || !h) return [];
    let list = Array.isArray(c.afval) ? c.afval : Object.keys(h.states).filter((e) => /^sensor\..*afval.*_(gft|groente|papier|pmd|plastic|restafval|rest|glas|textiel)$/.test(e)).map((entity) => ({ entity }));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const out = [];
    for (const x of list) {
      const st = h.states[x.entity]; if (!st) continue;
      const m = String(st.state).match(/(\d{1,2})-(\d{1,2})-(\d{4})/) || String(st.state).match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (!m) continue;
      const d = m[1].length === 4 ? new Date(+m[1], m[2] - 1, +m[3]) : new Date(+m[3], m[2] - 1, +m[1]);
      const days = Math.round((d - today) / 864e5);
      if (days < 0 || days > (c.afval_dagen ?? 7)) continue;
      const k = (x.entity.match(/_([a-z]+)$/) || [])[1] || "";
      out.push({ days, naam: x.naam || ZS_BIN_NAAM[k] || (st.attributes.friendly_name || k), kleur: x.kleur || ZS_BIN_KLEUR[k] || "#8a93a0",
                 wd: d.toLocaleDateString("nl-NL", { weekday: "long" }) });
    }
    return out.sort((p, q) => p.days - q.days).slice(0, 3);
  }
  // Nieuws: koppen van een RSS-feed (integratie Feedreader, event.*). nieuws: event.x of [event.x, event.y]. Wisselt elke 15 s.
  // Nieuws: koppen van nieuwsfeeds (integratie Feedreader, event.*). nieuws: event.x, [event.x, event.y] of [{entity, label}]. Wisselt elke 15 s.
  _nieuws() {
    const c = this._config, h = this._hass;
    if (!c.nieuws || !h) return "";
    const src = [].concat(c.nieuws).map((x) => typeof x === "string" ? { entity: x, label: c.nieuws_label } : x);
    const lab = (x) => x.label || ((h.states[x.entity] || {}).attributes || {}).friendly_name || "Nieuws";
    this._news = this._news || [];
    for (const x of src) {
      const st = h.states[x.entity]; const t = st && st.attributes.title;
      if (t && !this._news.some((n) => n.t === t)) this._news.unshift({ t, l: lab(x), ts: Date.parse(st.state) || Date.now() });
    }
    if (!this._newsHist && h.callWS) {
      this._newsHist = true;
      h.callWS({ type: "history/history_during_period", start_time: new Date(Date.now() - 12 * 3600e3).toISOString(), entity_ids: src.map((x) => x.entity),
                 minimal_response: false, no_attributes: false, significant_changes_only: false })
        .then((r) => { for (const x of src) for (const y of (r && r[x.entity]) || []) { const t = y.a && y.a.title; if (t && !this._news.some((n) => n.t === t)) this._news.push({ t, l: lab(x), ts: (y.lu || 0) * 1000 }); }
                       this._news.sort((p, q) => q.ts - p.ts); this._key = null; })
        .catch(() => {});
    }
    this._news.sort((p, q) => q.ts - p.ts);
    this._news = this._news.slice(0, c.nieuws_aantal || 12);
    if (!this._news.length) return "";
    const slot = Math.floor(Date.now() / 15000), n = this._news[slot % this._news.length];
    const nieuw = this._slot !== slot; this._slot = slot;
    const min = Math.round((Date.now() - n.ts) / 60e3);
    const ago = !n.ts || min < 0 ? "" : min < 2 ? "net binnen" : min < 60 ? `${min} min geleden` : min < 24 * 60 ? `${Math.round(min / 60)} uur geleden` : "";
    const kleur = (src.find((x) => (x.label || "") === n.l) || {}).kleur;
    return `<div class="news" ${kleur ? `style="--nc:${zsEsc(kleur)}"` : ""}><div class="src"><b>${zsEsc(n.l)}</b>${ago ? `<time>${ago}</time>` : ""}</div>
      <div class="kop ${nieuw ? "in" : ""}">${zsEsc(n.t)}</div>${this._news.length > 1 ? `<i class="np" style="animation-delay:-${((Date.now() % 15000) / 1000).toFixed(1)}s"></i>` : ""}</div>`;
  }
  _weerId() {
    const c = this._config, h = this._hass;
    return c.weer || Object.keys(h.states).filter((e) => e.startsWith("weather.")).sort((p, q) => /forecast|home|thuis/.test(q) - /forecast|home|thuis/.test(p))[0];
  }
  _weer() {
    const c = this._config, h = this._hass;
    if (c.weer === false || !h) return null;
    const id = this._weerId(), st = id && h.states[id];
    if (!st || st.attributes.temperature == null) return null;
    // Verwachting per uur (voor "droog tot …"): één abonnement, de koppelmotor stuurt updates zelf.
    if (!this._fcSub && h.connection && h.connection.subscribeMessage) {
      this._fcSub = h.connection.subscribeMessage((m) => { this._fc = (m && m.forecast) || []; }, { type: "weather/subscribe_forecast", entity_id: id, forecast_type: "hourly" })
        .catch(() => {});
    }
    return { t: Math.round(st.attributes.temperature), s: st.state, regen: this._regen(st.state) };
  }
  _regen(nu) {
    const fc = (this._fc || []).filter((f) => Date.parse(f.datetime) > Date.now() - 3600e3).slice(0, 12);
    if (!fc.length) return null;
    const nat = (f) => (f.precipitation || 0) >= 0.3 || ["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(f.condition);
    const hm = (f) => new Date(f.datetime).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    const nuNat = ["rainy", "pouring", "lightning-rainy"].includes(nu) || nat(fc[0]);
    const i = fc.findIndex((f) => nat(f) !== nuNat);
    if (nuNat) return { nat: true, t: i < 0 ? "nog uren regen" : `regen tot ${hm(fc[i])}` };
    return { nat: false, t: i < 0 ? "komende uren droog" : `droog tot ${hm(fc[i])}` };
  }
  // Witgoed: "klaar om 17:39" tijdens het programma, "Was is klaar" (oplichtend) als hij klaar is. Werkt met Miele en andere
  // integraties die een status (in_use / program_ended) en een eindtijd of resterende tijd geven. witgoed: [sensor.x] of false.
  _witgoed() {
    const c = this._config, h = this._hass;
    if (c.witgoed === false || !h) return [];
    const ids = Array.isArray(c.witgoed) ? c.witgoed : ["sensor.wasmachine", "sensor.droger", "sensor.wasdroger", "sensor.vaatwasser"].filter((e) => h.states[e]);
    const out = [];
    for (const x of ids) {
      const id = typeof x === "string" ? x : x.entity, st = h.states[id]; if (!st) continue;
      const v = String(st.state).toLowerCase(), naam = (typeof x === "object" && x.naam) || (st.attributes.friendly_name || id).replace(/ status$/i, "");
      const was = /was/i.test(id) && !/droog|droger/i.test(id) ? "Was" : /vaat/i.test(id) ? "Vaat" : naam;
      if (/program_ended|finished|end|klaar|done/.test(v)) out.push({ nu: true, b: `${was} is klaar`, s: "even uitruimen" });
      else if (/in_use|running|run|bezig|drying|rinsing|spinning/.test(v)) {
        const fin = h.states[id + "_finish"] || h.states[id + "_eindtijd"], rest = h.states[id + "_remaining_time"];
        let t = fin && Date.parse(fin.state) ? new Date(Date.parse(fin.state)) : rest && !isNaN(+rest.state) ? new Date(Date.now() + +rest.state * 60e3) : null;
        out.push({ nu: false, b: naam, s: t ? `klaar om ${t.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}` : "draait" });
      }
    }
    return out;
  }
  // Agenda: de eerstvolgende afspraak van vandaag. agenda: [calendar.x] of false; standaard alle agenda's behalve afval.
  _agenda() {
    const c = this._config, h = this._hass;
    if (c.agenda === false || !h || !h.callApi) return null;
    const ids = Array.isArray(c.agenda) ? c.agenda : Object.keys(h.states).filter((e) => e.startsWith("calendar.") && !/afval|waste|twentemilieu|cyclus|rova|hvc/i.test(e));
    if (!ids.length) return null;
    if (!this._agT || Date.now() - this._agT > 10 * 60e3) {
      this._agT = Date.now();
      const s0 = new Date(), e0 = new Date(); e0.setHours(23, 59, 59, 0);
      Promise.all(ids.map((id) => h.callApi("GET", `calendars/${id}?start=${encodeURIComponent(s0.toISOString())}&end=${encodeURIComponent(e0.toISOString())}`).catch(() => [])))
        .then((r) => { this._ag = r.flat().map((e) => ({ t: e.summary, s: Date.parse(e.start.dateTime || e.start.date), allday: !e.start.dateTime, e: Date.parse(e.end.dateTime || e.end.date) }))
                         .filter((e) => e.t && e.e > Date.now()).sort((p, q) => p.s - q.s); this._key = null; });
    }
    const e = (this._ag || []).find((x) => x.e > Date.now());
    if (!e) return null;
    const hm = new Date(e.s).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    return { b: e.t, s: e.allday ? "vandaag" : e.s <= Date.now() ? "nu bezig" : `vandaag ${hm}`, nu: !e.allday && e.s - Date.now() < 3600e3 };
  }
  _info(a) {
    const chips = [];
    const icon = (d) => `<svg class="wx" viewBox="0 0 24 24">${d}</svg>`;
    for (const w of this._witgoed()) chips.push({ p: w.nu ? 0 : 3, h: `<div class="chip ${w.nu ? "nu" : ""}" style="--bin:#3ee08f">${icon('<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13" r="4.5"/><path d="M8 6.5h2"/>')}<div><b>${zsEsc(w.b)}</b><span>${zsEsc(w.s)}</span></div></div>` });
    for (const b of this._afval()) {
      const when = b.days === 0 ? "vandaag opgehaald" : b.days === 1 ? (new Date().getHours() >= 12 ? "vanavond buiten zetten" : "morgen opgehaald") : `${b.wd} aan de weg`;
      chips.push({ p: b.days <= 1 ? 1 : 5, h: `<div class="chip ${b.days <= 1 ? "nu" : ""}" style="--bin:${b.kleur}">${zsBin(b.kleur)}<div><b>${zsEsc(b.naam)}</b><span>${when}</span></div></div>` });
    }
    const ag = this._agenda();
    if (ag) chips.push({ p: ag.nu ? 2 : 4.5, h: `<div class="chip ${ag.nu ? "nu" : ""}" style="--bin:#7aa7ff">${icon('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>')}<div><b>${zsEsc(ag.b)}</b><span>${zsEsc(ag.s)}</span></div></div>` });
    const w = this._weer();
    if (w) chips.push({ p: 4, h: `<div class="chip">${icon(ZS_WX[w.s] || ZS_WX.cloudy)}<div><b class="num">${w.t}°</b><span>${w.regen ? w.regen.t : ZS_WX_NL[w.s] || "buiten"}</span></div></div>` });
    for (const d of (this._config.auto === false ? [] : (a.devices || []).filter((x) => x.ev))) {
      const e = d.ev, laadt = d.on && d.w > 50, plug = e.plug === true || (e.plug == null && d.on);
      chips.push({ p: laadt ? 3 : 7, h: `<div class="chip">${icon('<path d="M5 16V11l2-5h10l2 5v5M3.5 16h17M7 16v2M17 16v2M6 11h12"/>')}<div><b class="num">${zsEsc(e.car)}${e.soc != null ? ` · ${e.soc}%` : ""}</b><span>${laadt ? "laadt nu" + (e.target ? " tot " + e.target + "%" : "") : e.plan ? "laadt vanaf " + zsEsc(String(e.plan).split(/[–-]/)[0]) + (e.target ? " tot " + e.target + "%" : "") : plug ? "stekker erin" : "niet aan de stekker"}</span></div></div>` });
    }
    // Wat er nu draait: apparaten die Zonnestuur aanzet, de thuisbatterij, en laden dat een leverancier doet.
    const kwT = (w) => (w / 1000).toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " kW";
    for (const d of (a.devices || []).filter((x) => !x.ev && x.on && x.w >= 100))
      chips.push({ p: 2.5, h: `<div class="chip nu" style="--bin:#ffb224">${icon(ZS_ICON[d.kind] || ZS_ICON.generic)}<div><b>${zsEsc(d.name)}</b><span>aan · ${kwT(d.w)}</span></div></div>` });
    for (const w of a.waarnemen || []) {
      const laadt = w.w >= 300;
      chips.push({ p: laadt ? 2.6 : 7, h: `<div class="chip ${laadt ? "nu" : ""}" style="--bin:#3ee08f">${icon('<path d="M5 16V11l2-5h10l2 5v5M3.5 16h17M7 16v2M17 16v2M6 11h12"/>')}<div><b class="num">${zsEsc(w.name)}${w.soc != null ? ` · ${w.soc}%` : ""}</b><span>${laadt ? "laadt " + kwT(w.w) : w.plug === false ? "niet aan de stekker" : "laadt niet"}</span></div></div>` });
    }
    for (const b of a.batteries || []) {
      if (b.soc == null) continue;
      const t = b.w >= 100 ? "laadt " + kwT(b.w) : b.w <= -100 ? "levert " + kwT(-b.w) : "in rust";
      chips.push({ p: Math.abs(b.w) >= 100 ? 2.7 : 8, h: `<div class="chip" style="--bin:#7aa7ff">${icon('<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9.5 1.5h5M12 8.5l-2.5 4h5L12 16.5"/>')}<div><b class="num">Batterij · ${b.soc}%</b><span>${t}</span></div></div>` });
    }
    // Eigen tegels: wat jij op het scherm wilt zien (temperatuur boven, luchtvochtigheid, een lamp, …)
    for (const t of (Array.isArray(this._config.tegels) ? this._config.tegels : []).slice(0, 4)) {
      const st = this._hass && this._hass.states[t.entity]; if (!st) continue;
      const u = st.attributes.unit_of_measurement || "", n = t.naam || st.attributes.friendly_name || t.entity;
      let v = st.state;
      if (v === "on") v = "aan"; else if (v === "off") v = "uit";
      else if (!isNaN(+v) && v !== "") v = (+v).toLocaleString("nl-NL", { maximumFractionDigits: Math.abs(+v) >= 100 ? 0 : 1 });
      chips.push({ p: 6, h: `<div class="chip" style="--bin:var(--g)">${icon(/°|K$/.test(u) ? '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0zM12 9v7"/>' : /^light\./.test(t.entity) ? '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>' : u === "%" ? '<path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/>' : '<path d="M4 16a8 8 0 0 1 16 0M12 16l4-5"/>')}<div><b class="num">${zsEsc(v)}${u ? " " + zsEsc(u) : ""}</b><span>${zsEsc(n)}</span></div></div>` });
    }
    // 's Avonds: wanneer is het morgen het goedkoopst? (handig om de was te plannen)
    const tm = (a.tips || []).find((t) => t.kind === "prijs" && /morgen/i.test(t.t || ""));
    if (tm && new Date().getHours() >= 17) {
      const tijd = (String(tm.t).match(/\d{1,2}:\d\d\s*[–-]\s*\d{1,2}:\d\d/) || [""])[0];
      if (tijd) chips.push({ p: 4.2, h: `<div class="chip" style="--bin:var(--g)">${icon(ZS_WX.sunny)}<div><b class="num">${zsEsc(tijd.replace(/\s/g, ""))}</b><span>morgen goedkoopst</span></div></div>` });
    }
    chips.sort((p, q) => p.p - q.p);
    return chips.length ? `<div class="info">${chips.map((x) => x.h).join("")}</div>` : "";
  }
  render(a) {
    const C = a.cheap || {}, P = a.price || {}, H = P.h || [], now = Date.now() / 1000;
    const on = !!C.on;
    // Geen 'goedkoop' blok (alle uren boven het gemiddelde van vandaag)? Dan toch het goedkoopste blok van 3 uur dat nog komt
    let nx = C.next;
    if (!on && !nx) {
      const kom = H.filter((r) => r[0] + 3600 > now);
      let best = null;
      for (let i = 0; i + 3 <= kom.length; i++) { const g = (kom[i][1] + kom[i + 1][1] + kom[i + 2][1]) / 3; if (!best || g < best.g - 1e-6) best = { g, i }; }
      if (best) {
        const v = new Date(kom[best.i][0] * 1000), t = new Date((kom[best.i + 2][0] + 3600) * 1000), hm = (d) => d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
        nx = { from: hm(v), until: hm(t), from_ts: kom[best.i][0], until_ts: kom[best.i + 2][0] + 3600, min: Math.min(kom[best.i][1], kom[best.i + 1][1], kom[best.i + 2][1]),
               day: v.toDateString() !== new Date().toDateString(), zelf: true };
      }
    }
    const clock = new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    const pnow = C.price ?? P.now;
    const under = on && C.avg ? Math.round((1 - pnow / C.avg) * 100) : null;
    const blkFrom = on ? C.from_ts : nx && nx.from_ts, blkTo = on ? C.until_ts : nx && nx.until_ts;
    const ps = H.map((r) => r[1] || 0), hi = Math.max(0.05, ...ps), lo = Math.min(0, ...ps);
    const bars = H.map((r) => {
      const h = Math.max(5, ((r[1] - lo) / (hi - lo)) * 100);
      const cls = [r[0] >= blkFrom && r[0] < blkTo ? "blk" : r[2] === "cheap" ? "ch" : r[2] === "dear" ? "dr" : "", r[0] + 3600 <= now ? "past" : "", now >= r[0] && now < r[0] + 3600 ? "now" : ""].join(" ");
      return `<i class="${cls}" style="height:${h.toFixed(0)}%"></i>`;
    }).join("");
    const ax = H.length && this._config.prijs !== false ? `<div class="ax">${H.map((r, i) => { const h = new Date(r[0] * 1000).getHours(), l = ((i + 0.5) / H.length * 100).toFixed(2);
      return h === 0 ? `<span class="d" style="left:${(i / H.length * 100).toFixed(2)}%">${i === 0 ? "vandaag" : "morgen"}</span>` : h % 6 === 0 ? `<span style="left:${l}%">${h}:00</span>` : ""; }).join("")}</div>` : "";
    const uurNu = new Date().getHours();
    const nuRij = H.find((r) => now >= r[0] && now < r[0] + 3600), piek = !on && nuRij && nuRij[2] === "dear";
    // Advies: alleen als het past bij het uur (geen wasmachine midden in de nacht)
    const tip = uurNu < 6 ? "" : uurNu >= 22 ? "Start de vaatwasser voor je gaat slapen" : this._config.tip;
    const cf = this._config, lite = cf.licht ?? /CrKey|Fuchsia/i.test(navigator.userAgent);
    const dicht = this._dicht && Date.now() < this._dicht;
    // Hoofdvlak: één boodschap groot (goedkoop tot / goedkoop vanaf / wachten), met de prijs van nu erbij
    let status, groot, sub;
    if (on) { status = "Stroom is nu goedkoop"; groot = `tot ${zsEsc(C.until)}`; sub = zsHubLeft(C.until_ts - now); }
    else if (nx) {
      // In gewone woorden: "Goedkope stroom vandaag / 10:00 / van 10:00 tot 13:00 / dan € 0,34 per kWh, nu € 0,40"
      status = piek ? `Nu duur · ${nx.zelf ? "goedkoopste uren" : "goedkope stroom"}${nx.day ? " morgen" : " vandaag"}`
        : (nx.zelf ? "Goedkoopste uren" : "Goedkope stroom") + (nx.day ? " morgen" : " vandaag");
      groot = zsEsc(nx.from); sub = `van ${zsEsc(nx.from)} tot ${zsEsc(nx.until)}`;
    } else { status = piek ? "Stroom is nu duur" : "Nog even wachten"; groot = "Wacht even"; sub = "De prijzen van morgen komen rond 13:00"; }
    const avg = C.avg || P.avg, over = !on && avg && pnow ? Math.round((pnow / avg - 1) * 100) : null;
    const prijsHtml = !on && nx && nx.min != null
      ? `<div class="prijs"><b>${zsEur(nx.min)}</b><span>per kWh dan, nu ${zsEur(pnow)}</span></div>`
      : `<div class="prijs"><b>${zsEur(pnow)}</b><span>per kWh${on ? "" : " nu"}</span>${under != null && under > 0 ? `<em>${under}% onder gemiddeld</em>`
      : over != null && over >= 10 ? `<em class="duur">${over}% boven gemiddeld</em>` : ""}</div>`;
    const held = `<div class="held"><div class="status"><i></i>${status}</div><div class="h">${groot}</div><div class="sub">${sub}</div>${prijsHtml}</div>`;
    const doTip = on && !this._witgoed().some((w) => !w.nu) && tip ? `<div class="do"><span><svg viewBox="0 0 24 24">${ZS_HUB_ICON.wash}</svg></span>${zsEsc(tip)}</div>` : "";
    // Wat Zonnestuur straks doet (per apparaat de eerste keer), zodat je ziet dat het geregeld is
    const gezien = new Set(), plan = (a.plan || []).filter((x) => !gezien.has(x.n) && gezien.add(x.n));
    const wanneer = (x) => x.now ? "nu" : (x.day ? "morgen " : "") + zsEsc(x.s);
    const regelt = plan.length && cf.plan !== false && !doTip ? `<div class="regelt"><span class="pl">Zonnestuur regelt</span>${plan.slice(0, 2).map((x) =>
      `<span><b>${wanneer(x)}</b>${zsEsc(x.n)} ${zsEsc(x.w)}</span>`).join("")}</div>` : "";
    // Thema: volgt de zon (zoals de app), tenzij vast gekozen
    const z = (a.huis || {}).z || {}, fase = (z.zon || {}).fase || (uurNu >= 8 && uurNu < 17 ? "dag" : "nacht"), wolken = (z.weer || {}).wolken;
    const donker = cf.thema === "donker" || (cf.thema !== "licht" && fase !== "dag");
    const acc = ZS_ACCENT[cf.accent] && on ? ZS_ACCENT[cf.accent] : null;
    const stijl = [acc ? `--held-acc:${acc[0]}` : "", `--zs-zoom:${({ groot: 1.15, extra: 1.3 })[cf.tekst] || 1}`].filter(Boolean).join(";");
    const sfeerLaag = (k) => k ? `<div class="sfeerbeeld" style="background-image:url('${zsBase()}img/hub/${beeld}.webp')" aria-hidden="true"></div>` : "";
    // Sfeerbeeld bovenin (dag, zonsondergang, nacht), met de prijzen op een rustige band eronder; uit met sfeer: false
    const sfeer = cf.sfeer !== false && cf.huis !== false && (cf.thema !== "licht" || fase === "dag") && (cf.thema !== "donker" || fase !== "dag");
    const beeld = fase === "dag" ? "dag" : fase === "schemer" ? "schemer" : "nacht";
    const klas = ["hub", donker ? "donker" : "licht", on ? "goed" : piek ? "piek" : "wacht", "f-" + (fase === "dag" && wolken >= 75 ? "bewolkt" : fase),
      sfeer ? "sfeer" : "", lite ? "lite" : "", dicht ? "dicht" : ""].filter(Boolean).join(" ");
    const uur = new Date().getHours();
    const groet = cf.begroeting ? `<span class="groet">${uur < 6 ? "Goedenacht" : uur < 12 ? "Goedemorgen" : uur < 18 ? "Goedemiddag" : "Goedenavond"}${cf.wie ? ", " + zsEsc(cf.wie) : ""}</span>` : "";
    const logo = `<svg class="logo" viewBox="0 0 48 48" fill="none" stroke="#f2a024" stroke-width="3.4" stroke-linecap="round" aria-hidden="true"><path d="M11 33a13 13 0 0 1 26 0"/><path d="M24 7v5M8.5 13.5l3.5 3.5M39.5 13.5 36 17M3 33h5M40 33h5"/><path d="M7 39h34" stroke-opacity=".55"/></svg>`;
    const top = `<div class="top"><span class="brand">${logo}${groet || "Zonnestuur"}${(a.save || {}).month > 0.5 && cf.besparing !== false ? `<em class="sv">${zsEur(a.save.month)} bespaard deze maand</em>` : ""}</span><span class="tr">${this._radioPill()}${this._radioKnopHtml()}<span class="clock">${clock}</span></span></div>`;
    if (zsNacht(cf.nacht_van, cf.nacht_tot)) {
      // Nachtstand: gedimd en warm, alleen de klok en wanneer het goedkoop is.
      return `<div class="hub donker nacht${lite ? " lite" : ""}" style="${stijl}">${top}
        <div class="mid nmid"><div class="nklok">${clock}</div><div class="nreg">${on ? `Goedkoop tot ${zsEsc(C.until)} · ${zsEur(pnow)}` : nx ? `Goedkope stroom ${nx.day ? "morgen " : ""}van ${zsEsc(nx.from)} tot ${zsEsc(nx.until)}` : ""}</div></div><div></div></div>`;
    }
    const metLabel = !!blkFrom && H.some((r) => r[0] >= blkFrom);
    const prijsDeel = bars && cf.prijs !== false ? (cf.prijs_stijl === "lijn" ? zsPrijsLijn(H, now, blkFrom, blkTo) : `<div class="strip${metLabel ? " met-label" : ""}" role="img" aria-label="Stroomprijs per uur">${zsBlokLabel(H, blkFrom, blkTo)}${bars}</div>`) + ax : "";
    let onder;
    if (dicht) {
      // Dichtbij: alles wat Zonnestuur vandaag regelt, per apparaat, en wat de rest doet
      const rijen = plan.slice(0, 6).map((x) => `<div class="rij${x.now ? " nu" : ""}"><b>${wanneer(x)}</b><div><strong>${zsEsc(x.n)}</strong><span>${zsEsc(x.w)}</span></div></div>`);
      for (const d of (a.devices || []).filter((d) => !gezien.has(d.name)).slice(0, Math.max(0, 6 - rijen.length)))
        rijen.push(`<div class="rij${d.on ? " nu" : ""}"><b>${d.on ? "aan" : "uit"}</b><div><strong>${zsEsc(d.name)}</strong><span>${zsEsc(d.why || (d.on ? "draait" : "wacht"))}</span></div></div>`);
      onder = `<div class="meer-kop"><b>Wat Zonnestuur regelt</b><span>tik om te sluiten</span></div><div class="meer">${rijen.join("") || `<div class="rij"><b>—</b><div><strong>Niets gepland</strong><span>Zonnestuur wacht op zon of een goedkoop moment</span></div></div>`}</div>${prijsDeel}`;
    } else {
      const delen = { info: this._info(a), prijs: prijsDeel, nieuws: this._nieuws() };
      const volg = (Array.isArray(cf.volgorde) && cf.volgorde.length ? cf.volgorde : ["info", "prijs", "nieuws"]).filter((k) => k in delen);
      for (const k of ["info", "prijs", "nieuws"]) if (!volg.includes(k)) volg.push(k);
      onder = volg.map((k) => delen[k]).join("");
    }
    // Het huis van nu (dezelfde tekening als op Vandaag), vrij in de lucht van het moment
    const huis = cf.huis !== false && a.huis && a.huis.z && window.zsHuis;
    return `<div class="${klas}" style="${stijl}">${sfeerLaag(sfeer && huis)}${top}
      <div class="mid${huis ? "" : " zonder-huis"}"><div class="links">${held}${doTip}${regelt}</div>
        ${huis ? `<div class="hubhuis"><div class="hstage"><svg class="hz" data-los="1" data-pop="2.3" viewBox="4 66 436 204" role="img" aria-label="Je huis"></svg>${zsHubChips(a)}</div></div>` : ""}</div>
      <div class="onder">${onder}</div>
    </div>`;
  }
  getCardSize() { return 12; }
  getGridOptions() { return { columns: 12, rows: "auto" }; }
  static getStubConfig() { return { entity: "sensor.zonnestuur" }; }
}
// Prijs per uur als vloeiende lijn (zoals in de app), met het goedkoopste blok en een stip op nu
function zsPrijsLijn(H, now, van, tot) {
  if (!H.length) return "";
  const W = 1000, Hh = 100, ps = H.map((r) => r[1] || 0), hi = Math.max(...ps) + 0.01, lo = Math.min(0, ...ps);
  const x = (i) => (i + 0.5) / H.length * W, y = (v) => 6 + (Hh - 10) * (1 - (v - lo) / (hi - lo));
  const pts = H.map((r, i) => [x(i), y(r[1] || 0)]);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`; }
  const ni = H.findIndex((r) => now >= r[0] && now < r[0] + 3600);
  const bi = van ? H.findIndex((r) => r[0] >= van) : -1, be = tot ? H.findIndex((r) => r[0] >= tot) : -1;
  const pct = (i) => (i / H.length * 100).toFixed(2);
  const hm = (t) => new Date(t * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  return `<div class="plijn" role="img" aria-label="Stroomprijs per uur">
    ${bi >= 0 ? `<span class="blkl" style="left:${pct(bi)}%;width:${(((be < 0 ? H.length : be) - bi) / H.length * 100).toFixed(2)}%"><b>goedkoop ${hm(van)}–${hm(tot)}</b></span>` : ""}
    <svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="zsplv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2dd4bf" stop-opacity=".4"/><stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/></linearGradient></defs>
      <path d="${d} L${pts[pts.length - 1][0].toFixed(1)},${Hh} L${pts[0][0].toFixed(1)},${Hh} Z" fill="url(#zsplv)"/>
      <path d="${d}" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
    ${ni >= 0 ? `<span class="nu" style="left:${(x(ni) / W * 100).toFixed(2)}%"><i style="top:${(y(H[ni][1] || 0) / Hh * 100).toFixed(1)}%"></i></span>` : ""}</div>`;
}
// Label boven het goedkoopste blok in de prijsblokjes
function zsBlokLabel(H, van, tot) {
  if (!van || !H.length) return "";
  const bi = H.findIndex((r) => r[0] >= van), be = H.findIndex((r) => r[0] >= tot);
  if (bi < 0) return "";
  const e = be < 0 ? H.length : be, hm = (t) => new Date(t * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  return `<span class="blklab" style="left:${((bi + e) / 2 / H.length * 100).toFixed(2)}%">goedkoop ${hm(van)}–${hm(tot)}</span>`;
}
function zsLucht(z) {
  const f = (z && z.zon && z.zon.fase) || "dag";
  return f === "nacht" ? "#0b1630" : f === "schemer" ? "#3a4a7a" : "#9fd0f0";
}
// Zwevende labels bij het huis: zon, net, batterij en auto
function zsHubChips(a) {
  const h = a.huis || {}, out = [], kw = (w) => (Math.abs(w || 0) / 1000).toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " kW";
  const ic = { zon: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    net: '<path d="M12 2.5 7 21.5M12 2.5l5 19M5 8.5h14M4 14.5h16M9 2.5h6"/>', bat: '<rect x="7" y="4.5" width="10" height="16" rx="2.5"/><path d="M10 2.5h4"/><path d="M12.5 8.5l-2 4h3l-2 4"/>',
    auto: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3.5 16h17v3h-17z"/><path d="M6 11h12"/>' };
  const c = (k, l, v) => `<div class="hch ${k}"><span class="i"><svg viewBox="0 0 24 24">${ic[k.split(" ")[0]]}</svg></span><span><small>${zsEsc(l)}</small><b>${zsEsc(v)}</b></span></div>`;
  const nacht = h.z && h.z.zon && h.z.zon.fase === "nacht";
  if (a.panels && h.pv != null && (h.pv > 50 || !nacht)) out.push(c("zon", "Zonnepanelen", kw(h.pv)));
  const b = (a.batteries || [])[0];
  if (b && b.soc != null) out.push(c("bat", "Batterij", Math.abs(b.w || 0) >= 100 ? (b.w > 0 ? "+" : "−") + kw(b.w) : b.soc + "%"));
  if (h.net != null) out.push(c(h.net < -30 ? "net terug" : "net", h.net < -30 ? "Terugleveren" : "Van het net", kw(h.net)));
  const ev = (a.devices || []).find((d) => d.ev), w = (a.waarnemen || [])[0];
  if (ev && ev.on && ev.w > 300) out.push(c("auto", "Auto laden", kw(ev.w)));
  else if (w && w.w >= 300) out.push(c("auto", (w.name || "Auto") + " laadt", kw(w.w)));
  else if (ev && ev.ev && ev.ev.soc != null) out.push(c("auto", ev.ev.car || "Auto", ev.ev.soc + "%"));
  else if (w && w.soc != null) out.push(c("auto", w.name || "Auto", w.soc + "%"));
  return out.join("");
}
const ZS_ACCENT = { groen: ["#3ee08f", "#0f5f3b"], blauw: ["#5b9dff", "#173a7a"], oranje: ["#ff9a3c", "#6a3200"], paars: ["#b18cff", "#3d2577"], roze: ["#ff7ab8", "#6d1f47"] };
// Valt nu binnen de nachtstand (bijv. 23:00 tot 06:30, ook over middernacht)?
function zsNacht(van, tot) {
  if (!/^\d\d:\d\d$/.test(van || "") || !/^\d\d:\d\d$/.test(tot || "")) return false;
  const d = new Date(), m = d.getHours() * 60 + d.getMinutes(), a = +van.slice(0, 2) * 60 + +van.slice(3), b = +tot.slice(0, 2) * 60 + +tot.slice(3);
  return a <= b ? m >= a && m < b : m >= a || m < b;
}
// Inter en Inter Tight (zoals de app) vanaf dezelfde plek als dit bestand: /local/zonnestuur/fonts of de Box /cards/fonts
// De map waar dit bestand vandaan kwam (/local/zonnestuur/ of de Box /cards/): lettertypen en sfeerbeelden staan ernaast
function zsBase() {
  if (window.__zsBase) return window.__zsBase;
  let src = ZS_SRC;
  try { src = src || (performance.getEntriesByType("resource").map((x) => x.name).find((n) => /zonnestuur-cards\.js/.test(n))) || ""; } catch (e) {}
  return (window.__zsBase = src ? src.replace(/zonnestuur-cards\.js.*$/, "") : "/local/zonnestuur/");
}
function zsLettertypen() {
  if (window.__zsFont || !window.FontFace || !document.fonts) return;
  window.__zsFont = 1;
  const base = zsBase();
  for (const [fam, f] of [["Inter", "inter.woff2"], ["Inter Tight", "inter-tight.woff2"]]) {
    try { new FontFace(fam, `url(${base}fonts/${f})`, { weight: "100 900", display: "swap" }).load().then((x) => document.fonts.add(x)).catch(() => {}); } catch (e) {}
  }
}
// Eén keer per kaartversie in het logboek van de koppelmotor: welke browser dit scherm heeft (zo weten we welke techniek er echt
// draait). Als waarschuwing, want gewone meldingen bewaart de koppelmotor standaard niet.
function zsMeldBrowser(hass) {
  try {
    const dag = ZS_VERSION;
    if (!hass || !hass.callService || localStorage.getItem("zs_hub_ua") === dag) return;
    localStorage.setItem("zs_hub_ua", dag);
    const kan = (p, v) => { try { return CSS.supports(p, v) ? 1 : 0; } catch (e) { return 0; } };
    const msg = `Zonnestuur-scherm ${ZS_VERSION}: ${navigator.userAgent} | ${innerWidth}x${innerHeight} | cq=${kan("container-type", "size")} mix=${kan("color", "color-mix(in srgb, red, blue)")} vt=${document.startViewTransition ? 1 : 0}`;
    hass.callService("system_log", "write", { message: msg, level: "warning", logger: "zonnestuur.hub" }).catch(() => {});
  } catch (e) {}
}
function zsHubLeft(sec) {
  const m = Math.max(0, Math.round(sec / 60));
  if (m < 60) return `nog ${m} minuten`;
  const h = Math.floor(m / 60), r = m % 60;
  return `nog ${h} uur${r >= 10 ? ` en ${r} min` : ""}`;
}

const ZS_CARDS = [
  ["zonnestuur-card", ZonnestuurCard, "Zonnestuur: nu", "Is dit een goed moment, wat Zonnestuur bespaarde en de tips van vandaag."],
  ["zonnestuur-besparing-card", ZonnestuurBesparingCard, "Zonnestuur: besparing", "Wat Zonnestuur deze maand bespaarde (klein)."],
  ["zonnestuur-prijs-card", ZonnestuurPrijsCard, "Zonnestuur: prijs en planning", "Stroomprijs per uur en wat er de komende 24 uur gepland is."],
  ["zonnestuur-auto-card", ZonnestuurAutoCard, "Zonnestuur: auto laden", "Laadkaart: stekker, laden en accu van je auto."],
  ["zonnestuur-apparaten-card", ZonnestuurApparatenCard, "Zonnestuur: apparaten", "Wat elk apparaat en de thuisbatterij nu doen, en waarom."],
  ["zonnestuur-hub-card", ZonnestuurHubCard, "Zonnestuur: groot scherm", "Schermvullend voor een Nest Hub of wandtablet: is stroom nu goedkoop, tot wanneer, en de prijs per uur."],
];
window.customCards = window.customCards || [];
for (const [tag, cls, name, description] of ZS_CARDS) {
  if (!customElements.get(tag)) customElements.define(tag, cls);
  if (!window.customCards.some((c) => c.type === tag)) window.customCards.push({ type: tag, name, description, preview: true, documentationURL: "https://github.com/zonnestuur/zonnestuur-ha" });
}
console.info(`%c ZONNESTUUR %c kaarten ${ZS_VERSION} `, "background:#ffb000;color:#1b1200;font-weight:700", "background:#0e151c;color:#fff");
