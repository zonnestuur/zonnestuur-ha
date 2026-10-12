// Meekijken met het scherm (alleen als de klant "Help mij" aan heeft gezet).
// Zolang dat zo is, stuurt deze pagina af en toe een kopie van wat er op het scherm staat naar de eigen Zonnestuur
// (niet naar internet); Zonnestuur geeft die alleen door als wij erom vragen. Wachtwoordvelden gaan nooit mee.
(function () {
  "use strict";
  let aan = false, laatst = "", bezig = false;
  const basis = location.pathname.replace(/[^/]*$/, "");

  function css() {
    let t = "";
    for (const s of document.styleSheets) {
      try { for (const r of s.cssRules) t += r.cssText + "\n"; } catch (e) { /* andere bron: overslaan */ }
    }
    return t;
  }
  function kopie() {
    const doc = document.documentElement.cloneNode(true);
    const echt = document.documentElement;
    // ingevulde waarden zichtbaar maken (wachtwoorden niet)
    const inE = echt.querySelectorAll("input, select, textarea"), inK = doc.querySelectorAll("input, select, textarea");
    inE.forEach((el, i) => {
      const k = inK[i]; if (!k) return;
      if (el.type === "password") { k.setAttribute("value", el.value ? "••••••" : ""); return; }
      if (el.type === "checkbox" || el.type === "radio") { if (el.checked) k.setAttribute("checked", ""); else k.removeAttribute("checked"); }
      else if (el.tagName === "SELECT") { [...k.options].forEach((o, j) => { if (el.options[j] && el.options[j].selected) o.setAttribute("selected", ""); else o.removeAttribute("selected"); }); }
      else if (el.tagName === "TEXTAREA") k.textContent = el.value;
      else k.setAttribute("value", el.value);
    });
    // open/dicht van uitklapblokken
    echt.querySelectorAll("details").forEach((d, i) => { const k = doc.querySelectorAll("details")[i]; if (k) { if (d.open) k.setAttribute("open", ""); else k.removeAttribute("open"); } });
    // grafieken (canvas) als plaatje
    echt.querySelectorAll("canvas").forEach((c, i) => {
      const k = doc.querySelectorAll("canvas")[i]; if (!k) return;
      try { const img = document.createElement("img"); img.src = c.toDataURL("image/png"); img.style.cssText = `width:${c.clientWidth}px;height:${c.clientHeight}px`; k.replaceWith(img); } catch (e) { /* leeg laten */ }
    });
    doc.querySelectorAll("script, noscript, iframe, audio, video, link[rel=stylesheet], link[rel=manifest]").forEach((n) => n.remove());
    const st = document.createElement("style"); st.textContent = css();
    const head = doc.querySelector("head"); if (head) head.appendChild(st);
    doc.setAttribute("data-theme", echt.getAttribute("data-theme") || "");
    return "<!doctype html>\n" + doc.outerHTML;
  }
  async function stuur() {
    if (!aan || bezig || document.hidden) return;
    bezig = true;
    try {
      const html = kopie();
      const sleutel = location.href + "|" + Math.round(scrollY / 50) + "|" + html.length + "|" + html.slice(-2000);
      if (sleutel !== laatst && html.length < 3000000) {
        laatst = sleutel;
        await fetch(basis + "api/hulp/scherm", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: location.pathname + location.search + location.hash, titel: document.title, html, b: innerWidth, h: innerHeight, scroll: scrollY }) });
      }
    } catch (e) { /* volgende keer opnieuw */ }
    bezig = false;
  }
  async function kijk() {
    try { const r = await (await fetch(basis + "api/hulp")).json(); aan = !!(r && r.tot > Date.now() / 1000); } catch (e) { aan = false; }
  }
  kijk().then(stuur);
  setInterval(stuur, 8000);
  setInterval(kijk, 60000);
  addEventListener("scroll", () => { clearTimeout(window.__zsMk); window.__zsMk = setTimeout(stuur, 1500); }, { passive: true });
})();
