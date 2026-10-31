/* Zonnestuur: met je vinger (of muis) over een grafiek schuiven en per uur of kwartier de prijs zien.
   zsSchuif(box, opt): box = element met daarin de <svg>; opt = { W, H, n, x(i), y(i), tekst(i) → html, standaard? }.
   Verticaal scrollen blijft werken (touch-action: pan-y); zijwaarts bewegen toont de prijs. Ook met pijltjestoetsen. */
(function () {
  function zsSchuif(box, opt) {
    const svg = box && box.querySelector("svg");
    if (!svg || !opt || !opt.n) return;
    if (getComputedStyle(box).position === "static") box.style.position = "relative";
    svg.style.touchAction = "pan-y";
    svg.style.cursor = "crosshair"; svg.style.userSelect = "none"; svg.style.webkitUserSelect = "none";
    svg.classList.add("zs-schuif");
    svg.setAttribute("tabindex", "0");
    svg.removeAttribute("aria-hidden");                          // focusbaar = niet verborgen voor schermlezers
    if (!svg.getAttribute("role")) svg.setAttribute("role", "img");
    if (!svg.getAttribute("aria-label")) svg.setAttribute("aria-label", "Stroomprijs per uur");
    svg.setAttribute("aria-description", "Schuif met je vinger of gebruik de pijltjes om per uur de prijs te zien");
    const NS = "http://www.w3.org/2000/svg";
    const lijn = document.createElementNS(NS, "line"), stip = document.createElementNS(NS, "circle");
    lijn.setAttribute("class", "zs-schuiflijn"); stip.setAttribute("class", "zs-schuifstip"); stip.setAttribute("r", "5");
    lijn.style.display = stip.style.display = "none";
    svg.appendChild(lijn); svg.appendChild(stip);
    let tip = box.querySelector(":scope > .zs-schuiftip");
    if (!tip) { tip = document.createElement("div"); tip.className = "zs-schuiftip"; tip.setAttribute("role", "status"); box.appendChild(tip); }
    tip.hidden = true;
    const vast = box.querySelectorAll(".callout");
    let i0 = -1, weg = 0;
    function toon(i) {
      i = Math.max(0, Math.min(opt.n - 1, i)); i0 = i;
      const r = svg.getBoundingClientRect(), br = box.getBoundingClientRect();
      const sx = r.width / opt.W, sy = r.height / opt.H, X = opt.x(i), Y = opt.y(i);
      lijn.setAttribute("x1", X); lijn.setAttribute("x2", X); lijn.setAttribute("y1", opt.top ?? 0); lijn.setAttribute("y2", opt.bodem ?? opt.H);
      stip.setAttribute("cx", X); stip.setAttribute("cy", Y);
      lijn.style.display = stip.style.display = "";
      tip.innerHTML = opt.tekst(i); tip.hidden = false;
      const px = r.left - br.left + X * sx, py = r.top - br.top + Y * sy;
      const w = tip.offsetWidth || 120;
      tip.style.left = Math.max(4, Math.min(br.width - w - 4, px - w / 2)) + "px";
      tip.style.top = Math.max(0, py - tip.offsetHeight - 14) + "px";
      vast.forEach((c) => (c.style.visibility = "hidden"));
      clearTimeout(weg);
    }
    function verberg(na) {
      clearTimeout(weg);
      weg = setTimeout(() => { lijn.style.display = stip.style.display = "none"; tip.hidden = true; i0 = -1; vast.forEach((c) => (c.style.visibility = "")); }, na);
    }
    function idx(e) {
      const r = svg.getBoundingClientRect(), X = (e.clientX - r.left) / r.width * opt.W;
      let best = 0, d = Infinity;
      for (let i = 0; i < opt.n; i++) { const dd = Math.abs(opt.x(i) - X); if (dd < d) { d = dd; best = i; } }
      return best;
    }
    svg.addEventListener("dragstart", (e) => e.preventDefault());          // binnen een link: niet de link gaan slepen
    const link = box.closest("a"); if (link) link.setAttribute("draggable", "false");
    svg.addEventListener("pointerdown", (e) => toon(idx(e)));
    svg.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || e.buttons || e.pressure > 0) toon(idx(e)); });
    svg.addEventListener("pointerup", () => verberg(2500));
    svg.addEventListener("pointercancel", () => verberg(0));
    svg.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") verberg(400); });
    svg.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault(); toon((i0 < 0 ? (opt.standaard ?? 0) : i0) + (e.key === "ArrowRight" ? 1 : -1));
    });
    svg.addEventListener("blur", () => verberg(0));
  }
  // Zelfde, maar voor een rij kolommen (divs): kols = element met n kinderen naast elkaar, tekst(i) → html
  function zsSchuifKols(box, kols, tekst) {
    if (!box || !kols || !kols.children.length) return;
    if (getComputedStyle(box).position === "static") box.style.position = "relative";
    kols.style.touchAction = "pan-y"; kols.style.userSelect = "none"; kols.style.cursor = "crosshair";
    let tip = box.querySelector(":scope > .zs-schuiftip");
    if (!tip) { tip = document.createElement("div"); tip.className = "zs-schuiftip"; tip.setAttribute("role", "status"); box.appendChild(tip); }
    tip.hidden = true;
    let weg = 0, aan = null;
    const n = kols.children.length;
    function toon(e) {
      const r = kols.getBoundingClientRect(), br = box.getBoundingClientRect();
      const i = Math.max(0, Math.min(n - 1, Math.floor((e.clientX - r.left) / r.width * n)));
      if (aan) aan.classList.remove("zs-aan"); aan = kols.children[i]; aan.classList.add("zs-aan");
      tip.innerHTML = tekst(i); tip.hidden = false;
      const w = tip.offsetWidth || 140, c = r.left - br.left + (i + .5) * r.width / n;
      tip.style.left = Math.max(4, Math.min(br.width - w - 4, c - w / 2)) + "px";
      tip.style.top = Math.max(0, r.top - br.top - tip.offsetHeight - 8) + "px";
      clearTimeout(weg);
    }
    function verberg(na) { clearTimeout(weg); weg = setTimeout(() => { tip.hidden = true; if (aan) aan.classList.remove("zs-aan"); aan = null; }, na); }
    kols.addEventListener("pointerdown", toon);
    kols.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || e.buttons || e.pressure > 0) toon(e); });
    kols.addEventListener("pointerup", () => verberg(2500));
    kols.addEventListener("pointercancel", () => verberg(0));
    kols.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") verberg(400); });
  }
  window.zsSchuifKols = zsSchuifKols;
  if (!document.getElementById("zs-schuif-css")) {
    const st = document.createElement("style"); st.id = "zs-schuif-css";
    st.textContent = ".zs-schuif:focus:not(:focus-visible){outline:none}.zs-schuif text{user-select:none}.zs-schuiflijn{stroke:var(--zs-ink,#e8eef7);stroke-opacity:.55;stroke-width:1.5;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}" +
      ".zs-schuifstip{fill:var(--zs-ink,#e8eef7);stroke:var(--zs-vlak,#0b1626);stroke-width:2.5;vector-effect:non-scaling-stroke}" +
      ".zs-schuiftip{position:absolute;z-index:3;pointer-events:none;white-space:nowrap;padding:6px 11px;border-radius:12px;font:600 13px/1.3 Inter,system-ui,sans-serif;" +
      "background:var(--zs-kaart,#13233a);color:var(--zs-ink,#e8eef7);box-shadow:0 0 0 1px var(--zs-lijn,rgba(255,255,255,.14)),0 8px 20px -8px rgba(0,0,0,.6);text-align:center}" +
      ".zs-schuiftip b{display:block;font:700 16px/1.2 'Inter Tight',Inter,sans-serif;font-variant-numeric:tabular-nums}" +
      ".zs-schuiftip small{display:block;font-weight:600;font-size:11.5px;opacity:.75}.zs-aan{filter:brightness(1.35);outline:1.5px solid var(--zs-ink,#e8eef7);outline-offset:1px;border-radius:3px}";
    document.head.appendChild(st);
  }
  window.zsSchuif = zsSchuif;
})();
