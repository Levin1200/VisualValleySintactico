/**
 * Capas: un Dot Avatar desarmado en las capas con que la librería lo dibuja.
 * Abajo el fondo; encima el cuerpo, con el reflejo de su piel de plástico;
 * luego los dos ojos alargados y arriba el adorno del estado «pensando».
 * Todo está en las coordenadas del propio avatar, su cuadro de 100 × 100: es
 * el SVG separado en alturas. La x del puntero separa las capas con un
 * resorte; su y elige una, que toma el trazo brillante. En reposo brillan los
 * ojos, que es donde se mira primero a un personaje. El deslizador es la
 * separación máxima entre capas.
 *
 * El patrón es «scrub and pick», como Exploded: la elección se prueba contra
 * la separación objetivo y no contra la que está en pantalla, y la guía
 * discontinua de cada capa se pinta antes que la capa.
 */
const {
  Cam, clamp, extremes, facing, fit, hull, open, prism, proj, ringAt, rrect, seg,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

// Cada pieza es un contorno redondeado en coordenadas del avatar: x0, y0, x1, y1, radio.
// El cuerpo es el de dot-avatar.js (centro 50, 52 y radio 30); los ojos, dos
// píldoras altas; el adorno, las tres burbujas del estado «pensando».
const LAY = [
  { name: "fondo", tk: 3, parts: [[0, 0, 100, 100, 18]] },
  { name: "cuerpo", tk: 8, parts: [[20, 22, 80, 82, 30]], gloss: true },
  { name: "ojos", tk: 2.5, parts: [[34, 40, 45, 58, 5.5], [55, 40, 66, 58, 5.5]] },
  { name: "adorno", tk: 2.5, parts: [[65, 23, 71.4, 29.4, 3.2], [73.6, 11.6, 82.4, 20.4, 4.4], [84.4, 0.4, 95.6, 11.6, 5.6]] },
];
const REST_MARK = 2;          // en reposo brillan los ojos
const REST = 0.4;             // la separación en reposo, como parte de la máxima: ya se ve que son capas
const TOP = LAY.reduce((s, L) => s + L.tk, 0);

/** El contorno y su pliegue. Las curvas grandes llevan más pasos (regla 09). */
function ringsOf([x0, y0, x1, y1, r]) {
  const n = r >= 12 ? 14 : 4, b = Math.min(1.4, r * 0.35);
  return [rrect(x0, y0, x1, y1, r, n), rrect(x0 + b, y0 + b, x1 - b, y1 - b, r - b, n)];
}

/** Si el punto del suelo (x, y) cae dentro de la pieza redondeada. */
function over([x0, y0, x1, y1, r], x, y) {
  const dx = Math.max(x0 + r - x, 0, x - (x1 - r)), dy = Math.max(y0 + r - y, 0, y - (y1 - r));
  return x >= x0 && x <= x1 && y >= y0 && y <= y1 && dx * dx + dy * dy <= r * r;
}

/** Punto dentro de polígono, par-impar. */
function inside(pt, pg) {
  let c = false;
  for (let i = 0, j = pg.length - 1; i < pg.length; j = i++) {
    const [xi, yi] = pg[i], [xj, yj] = pg[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let GAP = value, act, lastP = null, drawn = NaN;
  const e = spring(REST, { eps: 0.002 });
  const C = Cam(45, 0.5, 2);
  const far = TOP + (LAY.length - 1) * 24;   // la pose más alta, con el deslizador al máximo
  fit(C, [[0, 0, 0], [100, 100, 0], [100, 0, 0], [0, 100, 0], [0, 0, far], [100, 0, far], [0, 100, far]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // Capa por capa, de abajo arriba; dentro de cada una, de atrás adelante (x + y creciente).
  let base = 0;
  const els = LAY.map((L, i) => {
    const guide = i > 0 ? mk("path", { class: "nf dash" }, g) : null;
    const parts = L.parts.map((p) => {
      const [ring, inner] = ringsOf(p);
      // la guía baja hasta la capa que de verdad está debajo: las burbujas, al fondo; los ojos, al cuerpo
      const cx = (p[0] + p[2]) / 2, cy = (p[1] + p[3]) / 2;
      let under = 0;
      for (let j = i - 1; j > 0; j--) if (LAY[j].parts.some((q) => over(q, cx, cy))) { under = j; break; }
      return { ring, inner, under, ext: extremes(P, ring), el: solid(g) };
    });
    const gloss = L.gloss ? mk("path", { class: "nf lo" }, parts[0].el.g) : null;
    const E = { base, guide, parts, gloss };
    base += L.tk;
    return E;
  });

  const zOf = (i, s) => els[i].base + i * GAP * s;   // el piso de la capa i con la separación s

  /** La capa más alta bajo el puntero, con las capas donde van a quedar (objetivo del resorte). */
  function pick(p) {
    if (!p) return null;
    for (let i = LAY.length - 1; i >= 0; i--) {
      const z0 = zOf(i, e.t), z1 = z0 + LAY[i].tk;
      if (els[i].parts.some((q) => inside(p, hull(ringAt(P, q.ring, z0).concat(ringAt(P, q.ring, z1)))))) return i;
    }
    return null;
  }
  /** El brillo va a la capa elegida; si no hay ninguna, vuelve a los ojos. */
  function setAct(a) {
    if (a === act) return;
    act = a;
    const lit = a == null ? REST_MARK : a;
    els.forEach((E, i) => E.parts.forEach((q) => q.el.sil.classList.toggle("hi", i === lit)));
    read.textContent = a == null ? "rest" : `0${a + 1} · ${LAY[a].name}`;
  }

  // El reflejo de la piel: un arco junto al borde superior izquierdo del cuerpo.
  const arc = (z) => {
    const pts = [];
    for (let k = 0; k <= 8; k++) {
      const t = ((200 + (k * 55) / 8) * Math.PI) / 180;
      pts.push(P(50 + 22 * Math.cos(t), 52 + 22 * Math.sin(t), z));
    }
    return open(pts);
  };

  const B = register(stage, (dt) => {
    const m = stepS(e, dt);
    if (e.x !== drawn) {
      drawn = e.x;
      LAY.forEach((L, i) => {
        const E = els[i], z0 = zOf(i, e.x), z1 = z0 + L.tk;
        E.parts.forEach((q) => put(q.el, prism(P, front, q.ring, q.inner, z0, z1)));
        if (E.gloss) E.gloss.setAttribute("d", arc(z1));
        if (E.guide) E.guide.setAttribute("d", E.parts.map((q) => {
          const below = zOf(q.under, e.x) + LAY[q.under].tk;
          return q.ext.map((s) => seg(P(s.u, s.v, z0), P(s.u, s.v, below))).join("");
        }).join(""));
      });
    }
    return m;
  });
  bag.add(B.unregister);

  setAct(null);
  bag.add(pointer(stage, {
    move: (p) => {
      lastP = p;
      e.t = REST + (1 - REST) * clamp((p[0] - 60) / 280, 0, 1);
      setAct(pick(p));
      B.wake();
    },
    leave: () => { lastP = null; e.t = REST; setAct(null); B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { GAP = v; drawn = NaN; if (lastP) setAct(pick(lastP)); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "capas",
  means: "Un Dot Avatar desarmado en sus capas: fondo, cuerpo, ojos y adorno. A lo ancho se separan; a lo alto eliges una.",
  rules: [1, 4, 5, 6],
  range: [8, 16, 24],
  mount,
});
