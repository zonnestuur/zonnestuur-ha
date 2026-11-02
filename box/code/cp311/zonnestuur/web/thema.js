/* Daglicht (0.99): het thema volgt de zon. Overdag licht, na zonsondergang donker. Een vaste keuze (Meer → Weergave)
   staat in localStorage zs_thema_vast ("light" | "dark"); zs_theme krijgt altijd het thema van nu, zodat oudere
   pagina-scripts die zs_theme lezen hetzelfde doen. Zonstijden: van de Box (zs_zon, vandaag) of een tabel voor Nederland. */
(function () {
  var TABEL = [["08:45", "16:45"], ["08:15", "17:35"], ["07:15", "18:25"], ["07:05", "20:15"], ["06:05", "21:00"], ["05:20", "21:50"],
    ["05:35", "21:55"], ["06:25", "21:05"], ["07:15", "20:00"], ["08:05", "18:55"], ["07:50", "17:00"], ["08:35", "16:30"]];
  function min(t) { var p = String(t || "").split(":"); return (+p[0]) * 60 + (+p[1] || 0); }
  function zonNu() {
    var d = new Date(), v = null;
    try { var z = JSON.parse(localStorage.getItem("zs_zon") || "null"); if (z && z.dag === d.toDateString() && z.op && z.onder) v = [z.op, z.onder]; } catch (e) {}
    if (!v) v = TABEL[d.getMonth()];
    var nu = d.getHours() * 60 + d.getMinutes();
    return nu >= min(v[0]) && nu < min(v[1]) ? "light" : "dark";
  }
  function bepaal() {
    var vast = null;
    try { vast = localStorage.getItem("zs_thema_vast"); } catch (e) {}
    return vast === "light" || vast === "dark" ? vast : zonNu();
  }
  function zet() {
    var t = bepaal();
    if (document.documentElement.dataset.theme !== t) document.documentElement.dataset.theme = t;
    try { localStorage.setItem("zs_theme", t); } catch (e) {}
    return t;
  }
  zet();
  setInterval(zet, 5 * 60 * 1000);                      // gaat de zon onder terwijl de pagina open staat: mee wisselen
  window.zsThema = {
    zet: zet, bepaal: bepaal,
    vast: function (w) { try { if (w) localStorage.setItem("zs_thema_vast", w); else localStorage.removeItem("zs_thema_vast"); } catch (e) {} return zet(); },
    stand: function () { try { return localStorage.getItem("zs_thema_vast") || "zon"; } catch (e) { return "zon"; } },
    zon: function (op, onder) { try { localStorage.setItem("zs_zon", JSON.stringify({ dag: new Date().toDateString(), op: op, onder: onder })); } catch (e) {} return zet(); }
  };
})();

/* 0.99.2: een geweigerd verzoek (HTTP 401). Alleen als Zonnestuur zelf om het wachtwoord vraagt ('token vereist') mag de pagina
   ernaar vragen, hoogstens 2 keer. Een 401 van de koppelmotor-app (toegang verlopen terwijl de app op de achtergrond stond) is
   geen wachtwoordvraag: dan de pagina na 3 s opnieuw laden (hoogstens 1× per minuut). */
window.zsEigen401 = async function (r) {
  var eigen = false;
  try { var j = await r.clone().json(); eigen = !!(j && j.error === "token vereist"); } catch (e) {}
  if (!eigen) {
    var t = 0;
    try { t = +sessionStorage.getItem("zs_herlaad") || 0; } catch (e) {}
    if (Date.now() - t > 60000) {
      try { sessionStorage.setItem("zs_herlaad", String(Date.now())); } catch (e) {}
      setTimeout(function () { location.reload(); }, 3000);
    }
    throw new Error("Verbinding even weg: de pagina wordt opnieuw geladen");
  }
  window.__zsVraag = (window.__zsVraag || 0) + 1;
  if (window.__zsVraag > 2) throw new Error("Geen wachtwoord ingevuld");
  return true;
};
