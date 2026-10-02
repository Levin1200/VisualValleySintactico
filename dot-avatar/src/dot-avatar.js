/*!
 * Dot Avatar — personajes de puntos animados en SVG para agentes de IA.
 * Sin dependencias. En Node genera el SVG como texto; en el navegador además
 * monta avatares vivos, define la etiqueta <dot-avatar> y exporta a PNG.
 */

const TAU = Math.PI * 2;
const BODY = { cx: 50, cy: 52, r: 30 };   // todo se dibuja en un viewBox de 100 × 100
const EYE = { dx: 10.5, y: 49 };
const SW = 3;                              // grosor de los trazos de los ojos

const num = (v) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? '0' : String(r);
};

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------

export const PALETTE = ['#01A2A8', '#6918CE', '#FF7A2E', '#FFC21A', '#FF5C8A', '#2F7BFF', '#22B573', '#2B2B33'];

/** Formas del cuerpo: radio relativo en función del ángulo (y de la fase, si se deforma). */
export const SHAPES = {
  round: { label: 'Redonda', r: () => 1 },
  squircle: {
    label: 'Squircle',
    r: (t) => 0.93 / Math.pow(Math.abs(Math.cos(t)) ** 4 + Math.abs(Math.sin(t)) ** 4, 0.25),
  },
  blob: {
    label: 'Blob',
    r: (t, p) => 1 + 0.07 * Math.sin(3 * t + p) + 0.045 * Math.sin(5 * t - 2 * p + 1),
    morph: true,
  },
  clover: { label: 'Trébol', r: (t) => 0.84 + 0.18 * Math.pow(Math.abs(Math.cos(2 * t)), 0.7) },
  flower: { label: 'Flor', r: (t) => 0.9 + 0.1 * Math.cos(6 * t) },
  pebble: {
    label: 'Guijarro',
    r: (t) => {
      const a = 1.1, b = 0.88, u = t + 0.2;
      return (a * b) / Math.hypot(b * Math.cos(u), a * Math.sin(u));
    },
  },
  star: { label: 'Estrella', r: (t) => 0.88 + 0.13 * Math.cos(5 * t + Math.PI / 2) },
};

const stroke = (ink) =>
  `fill="none" stroke="${ink}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"`;

/** Ojos: cada uno se dibuja alrededor de (0, 0). `mirror` lo refleja en el ojo derecho. */
const GLYPHS = {
  dot: { svg: (k) => `<circle r="3.6" fill="${k}"/>` },
  tiny: { svg: (k) => `<circle r="2.4" fill="${k}"/>` },
  oval: { svg: (k) => `<ellipse rx="3" ry="4.8" fill="${k}"/>` },
  ring: { svg: (k) => `<circle r="3.6" ${stroke(k)}/>` },
  shocked: { svg: (k) => `<circle r="4.6" ${stroke(k)}/><circle r="1.6" fill="${k}"/>` },
  happy: { svg: (k) => `<path d="M-4.2 2Q0-4 4.2 2" ${stroke(k)}/>` },
  closed: { svg: (k) => `<path d="M-4.2-1Q0 4 4.2-1" ${stroke(k)}/>` },
  line: { svg: (k) => `<path d="M-4.2 0H4.2" ${stroke(k)}/>` },
  half: { svg: (k) => `<path d="M-4.4-.5A4.4 4.4 0 0 0 4.4-.5Z" fill="${k}"/><path d="M-5-.5H5" ${stroke(k)}/>` },
  angry: { svg: (k) => `<circle r="3.4" cy="1.2" fill="${k}"/><path d="M-5-6.2L3.6-3.4" ${stroke(k)}/>`, mirror: true },
  chev: { svg: (k) => `<path d="M-3-4L3 0-3 4" ${stroke(k)}/>`, mirror: true },
  plus: { svg: (k) => `<path d="M-4 0H4M0-4V4" ${stroke(k)}/>` },
  cross: { svg: (k) => `<path d="M-3.4-3.4L3.4 3.4M3.4-3.4L-3.4 3.4" ${stroke(k)}/>` },
  heart: {
    svg: (k) =>
      `<path fill="${k}" d="M0 4.8C-1 3.9-5.4 1.1-5.4-1.8C-5.4-3.8-3.9-5.2-2.3-5.2C-1.2-5.2-.4-4.6 0-3.8C.4-4.6 1.2-5.2 2.3-5.2C3.9-5.2 5.4-3.8 5.4-1.8C5.4 1.1 1 3.9 0 4.8Z"/>`,
  },
  star: { svg: (k) => `<path fill="${k}" d="M0-5.4L1.5-1.5 5.4 0 1.5 1.5 0 5.4-1.5 1.5-5.4 0-1.5-1.5Z"/>` },
  shine: { svg: (k, body) => `<circle r="4.4" fill="${k}"/><circle r="1.4" cx="1.5" cy="-1.5" fill="${body}"/>` },
  up: { svg: (k) => `<circle r="3.6" cy="-1.6" fill="${k}"/>` },
  side: { svg: (k) => `<circle r="3.6" cx="-1.8" fill="${k}"/>` },
};

export const EXPRESSIONS = {
  neutral: { label: 'Neutral', eyes: ['dot', 'dot'] },
  calm: { label: 'Tranquilo', eyes: ['oval', 'oval'] },
  happy: { label: 'Feliz', eyes: ['happy', 'happy'] },
  wink: { label: 'Guiño', eyes: ['dot', 'happy'] },
  shy: { label: 'Tímido', eyes: ['tiny', 'tiny'], cheeks: true },
  joyful: { label: 'Alegre', eyes: ['happy', 'happy'], cheeks: true },
  surprised: { label: 'Sorprendido', eyes: ['ring', 'ring'] },
  shocked: { label: 'Impactado', eyes: ['shocked', 'shocked'] },
  sleepy: { label: 'Somnoliento', eyes: ['closed', 'closed'] },
  focused: { label: 'Concentrado', eyes: ['line', 'line'] },
  unimpressed: { label: 'Indiferente', eyes: ['half', 'half'] },
  determined: { label: 'Decidido', eyes: ['angry', 'angry'] },
  playful: { label: 'Travieso', eyes: ['chev', 'chev'] },
  love: { label: 'Enamorado', eyes: ['heart', 'heart'] },
  starstruck: { label: 'Deslumbrado', eyes: ['star', 'star'] },
  dizzy: { label: 'Mareado', eyes: ['cross', 'cross'] },
  curious: { label: 'Curioso', eyes: ['shine', 'tiny'] },
  dreamy: { label: 'Soñador', eyes: ['shine', 'shine'] },
  thoughtful: { label: 'Pensativo', eyes: ['up', 'up'] },
  sideeye: { label: 'De reojo', eyes: ['side', 'side'] },
  positive: { label: 'Positivo', eyes: ['plus', 'plus'] },
};

/** Estados del agente: movimiento del cuerpo, mirada, ojos forzados y adornos. */
export const STATES = {
  idle: { label: 'Reposo', body: 'breathe', dur: 3.6, blink: true },
  listening: { label: 'Escuchando', body: 'sway', dur: 2.4, blink: true, extra: 'waves' },
  thinking: { label: 'Pensando', body: 'ponder', dur: 4, blink: true, look: 'think', extra: 'thought' },
  writing: { label: 'Escribiendo', body: 'bob', dur: 0.7, blink: true, look: 'write', extra: 'typing' },
  success: { label: 'Éxito', body: 'hop', dur: 1.4, eyes: 'happy', extra: 'sparkles' },
  alert: { label: 'Alerta', body: 'wiggle', dur: 1.8, eyes: 'surprised', extra: 'alert' },
  error: { label: 'Error', body: 'shake', dur: 1.6, eyes: 'dizzy', extra: 'error' },
  asleep: { label: 'Dormido', body: 'snooze', dur: 4.8, eyes: 'sleepy', extra: 'zzz' },
};

export const INKS = { auto: 'Automática', dark: 'Oscura', light: 'Clara' };

export const DEFAULTS = Object.freeze({
  shape: 'round',
  expression: 'neutral',
  state: 'idle',
  color: '#01A2A8',
  ink: 'auto',
  speed: 1,
});

const BODY_KEYFRAMES = {
  breathe: '0%,100%{transform:scale(1,1)}50%{transform:scale(1.03,.97)}',
  sway: '0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}',
  ponder: '0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(-2.5deg) translateY(-1px)}',
  bob: '0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}',
  hop:
    '0%,100%{transform:translateY(0) scale(1,1)}15%{transform:translateY(0) scale(1.08,.9)}' +
    '38%{transform:translateY(-11px) scale(.95,1.06)}58%{transform:translateY(0) scale(1.07,.93)}' +
    '72%{transform:translateY(0) scale(.98,1.02)}84%{transform:translateY(0) scale(1,1)}',
  wiggle:
    '0%,45%,100%{transform:rotate(0)}6%{transform:rotate(-8deg)}12%{transform:rotate(7deg)}' +
    '18%{transform:rotate(-6deg)}24%{transform:rotate(4deg)}30%{transform:rotate(-2deg)}36%{transform:rotate(0)}',
  shake:
    '0%,45%,100%{transform:translateX(0)}5%{transform:translateX(-3px)}10%{transform:translateX(3px)}' +
    '15%{transform:translateX(-3px)}20%{transform:translateX(3px)}25%{transform:translateX(-2px)}' +
    '30%{transform:translateX(1px)}35%{transform:translateX(0)}',
  snooze: '0%,100%{transform:scale(1,1)}50%{transform:scale(1.045,.955)}',
};

const LOOK_KEYFRAMES = {
  think: { dur: 4, kf: '0%,100%{transform:translate(0,0)}20%,45%{transform:translate(2.2px,-2.2px)}60%,85%{transform:translate(-2.2px,-1.6px)}' },
  write: { dur: 1.6, kf: '0%,100%{transform:translate(-1.6px,2px)}50%{transform:translate(1.6px,2px)}' },
};

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

function normColor(c) {
  if (typeof c !== 'string') return null;
  let h = c.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map((x) => x + x).join('');
  return /^[0-9a-f]{6}$/i.test(h) ? '#' + h.toUpperCase() : null;
}

/** Completa y valida una configuración; lo desconocido vuelve al valor por defecto. */
export function normalize(cfg = {}) {
  const pick = (v, table, d) => (v in table ? v : d);
  const speed = Number(cfg.speed);
  return {
    shape: pick(cfg.shape, SHAPES, DEFAULTS.shape),
    expression: pick(cfg.expression, EXPRESSIONS, DEFAULTS.expression),
    state: pick(cfg.state, STATES, DEFAULTS.state),
    color: normColor(cfg.color) || DEFAULTS.color,
    ink: pick(cfg.ink, INKS, DEFAULTS.ink),
    speed: Number.isFinite(speed) && speed > 0 ? Math.min(4, Math.max(0.25, speed)) : DEFAULTS.speed,
  };
}

function luminance(hex) {
  const lin = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}

/** Color de los ojos: el que contrasta con el cuerpo, o el elegido. */
export function inkFor(cfg) {
  const c = normalize(cfg);
  if (c.ink === 'dark') return '#1E1E24';
  if (c.ink === 'light') return '#FFFFFF';
  return luminance(c.color) > 0.4 ? '#1E1E24' : '#FFFFFF';
}

/** Código compacto y legible para compartir: forma.expresión.estado.color.tinta[.velocidad en %] */
export function encode(cfg) {
  const c = normalize(cfg);
  const parts = [c.shape, c.expression, c.state, c.color.slice(1).toLowerCase(), c.ink];
  if (c.speed !== 1) parts.push(String(Math.round(c.speed * 100)));
  return parts.join('.');
}

export function decode(code) {
  const [shape, expression, state, color, ink, speed] = String(code || '').split('.');
  return normalize({ shape, expression, state, color: color && '#' + color, ink, speed: speed ? Number(speed) / 100 : 1 });
}

/** Avatar aleatorio; con la misma semilla siempre sale el mismo. */
export function random(seed = Math.random() * 2 ** 32) {
  let a = seed >>> 0;
  const rnd = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const any = (arr) => arr[Math.floor(rnd() * arr.length)];
  return normalize({
    shape: any(Object.keys(SHAPES)),
    expression: any(Object.keys(EXPRESSIONS)),
    state: 'idle',
    color: any(PALETTE),
  });
}

function hashId(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return 'da' + (h >>> 0).toString(36);
}

// ---------------------------------------------------------------------------
// Geometría
// ---------------------------------------------------------------------------

function smoothClosed(p) {
  const n = p.length;
  let d = `M${num(p[0][0])} ${num(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    d +=
      `C${num(p1[0] + (p2[0] - p0[0]) / 6)} ${num(p1[1] + (p2[1] - p0[1]) / 6)} ` +
      `${num(p2[0] - (p3[0] - p1[0]) / 6)} ${num(p2[1] - (p3[1] - p1[1]) / 6)} ${num(p2[0])} ${num(p2[1])}`;
  }
  return d + 'Z';
}

/** Contorno del cuerpo como trazado SVG suave. */
export function shapePath(shape, phase = 0) {
  const fn = (SHAPES[shape] || SHAPES.round).r;
  const n = 64, pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU - Math.PI / 2;
    const r = BODY.r * fn(t, phase);
    pts.push([BODY.cx + r * Math.cos(t), BODY.cy + r * Math.sin(t)]);
  }
  return smoothClosed(pts);
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function eyeMarkup(type, side, ink, body) {
  const g = GLYPHS[type] || GLYPHS.dot;
  const x = BODY.cx + (side === 'l' ? -EYE.dx : EYE.dx);
  let inner = g.svg(ink, body);
  if (side === 'r' && g.mirror) inner = `<g transform="scale(-1 1)">${inner}</g>`;
  return `<g transform="translate(${num(x)} ${EYE.y})"><g class="da-eye">${inner}</g></g>`;
}

function extraMarkup(kind, accent, ink) {
  const s = `fill="none" stroke="${accent}" stroke-width="2.6" stroke-linecap="round"`;
  switch (kind) {
    case 'waves':
      return (
        `<g class="da-w"><path d="M15 44Q10 52 15 60" ${s}/><path d="M85 44Q90 52 85 60" ${s}/></g>` +
        `<g class="da-w da-w2"><path d="M9 39Q2 52 9 65" ${s}/><path d="M91 39Q98 52 91 65" ${s}/></g>`
      );
    case 'thought':
      return [[73, 21, 1.8], [79.5, 14, 2.6], [87.5, 7, 3.4]]
        .map(([x, y, r], i) => `<circle class="da-t da-t${i}" cx="${x}" cy="${y}" r="${r}" fill="${accent}"/>`)
        .join('');
    case 'typing':
      return (
        `<rect x="60" y="84" width="28" height="12" rx="6" fill="${accent}"/>` +
        [67, 74, 81].map((x, i) => `<circle class="da-d da-d${i}" cx="${x}" cy="90" r="1.8" fill="${ink}"/>`).join('')
      );
    case 'sparkles':
      return [[17, 24, 1], [85, 28, 0.8], [14, 70, 0.7], [87, 68, 1]]
        .map(
          ([x, y, k], i) =>
            `<g transform="translate(${x} ${y}) scale(${k})"><path class="da-sp da-sp${i}" fill="${accent}" d="M0-5L1.3-1.3 5 0 1.3 1.3 0 5-1.3 1.3-5 0-1.3-1.3Z"/></g>`
        )
        .join('');
    case 'alert':
    case 'error': {
      const fill = kind === 'alert' ? '#F5A524' : '#E5484D';
      const mark =
        kind === 'alert'
          ? `<path d="M0-4.2V.8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cy="4" r="1.5" fill="#fff"/>`
          : `<path d="M-3-3L3 3M3-3L-3 3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
      return `<g transform="translate(79 25)"><g class="da-bd"><circle r="8" fill="${fill}"/>${mark}</g></g>`;
    }
    case 'zzz':
      return [[70, 23, 0.8], [78, 15, 1], [87, 7, 1.25]]
        .map(
          ([x, y, k], i) =>
            `<g transform="translate(${x} ${y}) scale(${k})"><path class="da-z da-z${i}" d="M-3-3H3L-3 3H3" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`
        )
        .join('');
    default:
      return '';
  }
}

function css(id, st, speed) {
  const S = (sec) => num(sec / speed) + 's';
  const p = `.${id}`;
  let out =
    `${p} .da-body{transform-box:view-box;transform-origin:50px 82px;animation:${id}-body ${S(st.dur)} ease-in-out infinite}` +
    `@keyframes ${id}-body{${BODY_KEYFRAMES[st.body]}}`;
  if (st.blink) {
    out +=
      `${p} .da-eye{transform-box:fill-box;transform-origin:center;animation:${id}-blink ${S(4.6)} infinite}` +
      `@keyframes ${id}-blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}`;
  }
  if (st.look) {
    const L = LOOK_KEYFRAMES[st.look];
    out += `${p} .da-eyes{animation:${id}-look ${S(L.dur)} ease-in-out infinite}@keyframes ${id}-look{${L.kf}}`;
  }
  const fb = 'transform-box:fill-box;transform-origin:center';
  switch (st.extra) {
    case 'waves':
      out +=
        `${p} .da-w{opacity:0;animation:${id}-wave ${S(1.6)} ease-out infinite}${p} .da-w2{animation-delay:${S(0.3)}}` +
        `@keyframes ${id}-wave{0%{opacity:0}30%{opacity:1}100%{opacity:0}}`;
      break;
    case 'thought':
      out +=
        `${p} .da-t{${fb};opacity:0;animation:${id}-th ${S(2.4)} ease-in-out infinite}` +
        `${p} .da-t1{animation-delay:${S(0.3)}}${p} .da-t2{animation-delay:${S(0.6)}}` +
        `@keyframes ${id}-th{0%,100%{opacity:0;transform:scale(.4)}25%,70%{opacity:1;transform:scale(1)}}`;
      break;
    case 'typing':
      out +=
        `${p} .da-d{animation:${id}-dot ${S(1)} ease-in-out infinite}` +
        `${p} .da-d1{animation-delay:${S(0.15)}}${p} .da-d2{animation-delay:${S(0.3)}}` +
        `@keyframes ${id}-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-2px)}}`;
      break;
    case 'sparkles':
      out +=
        `${p} .da-sp{${fb};opacity:0;animation:${id}-sp ${S(st.dur)} ease-out infinite}` +
        [1, 2, 3].map((i) => `${p} .da-sp${i}{animation-delay:${S(0.12 * i)}}`).join('') +
        `@keyframes ${id}-sp{0%,100%{transform:scale(0);opacity:0}30%{transform:scale(1.1);opacity:1}60%{transform:scale(.9);opacity:1}80%{transform:scale(0);opacity:0}}`;
      break;
    case 'alert':
    case 'error':
      out +=
        `${p} .da-bd{${fb};animation:${id}-bd ${S(st.dur)} ease-in-out infinite}` +
        `@keyframes ${id}-bd{0%,50%,100%{transform:scale(1)}20%{transform:scale(1.18)}}`;
      break;
    case 'zzz':
      out +=
        `${p} .da-z{${fb};opacity:0;animation:${id}-z ${S(3)} ease-out infinite}` +
        `${p} .da-z1{animation-delay:${S(1)}}${p} .da-z2{animation-delay:${S(2)}}` +
        `@keyframes ${id}-z{0%{opacity:0;transform:translate(0,4px) scale(.6)}30%{opacity:1}100%{opacity:0;transform:translate(3px,-6px) scale(1)}}`;
      break;
  }
  return out + `@media (prefers-reduced-motion:reduce){${p} *{animation:none!important}}`;
}

/**
 * Genera el avatar como texto SVG.
 * @param {object} cfg  forma, expresión, estado, color, tinta, velocidad
 * @param {object} [opts]
 * @param {boolean} [opts.animated=true]  incluir las animaciones (CSS + SMIL)
 * @param {number}  [opts.size]           ancho y alto en px (si no, escala al contenedor)
 * @param {string}  [opts.background]     color de fondo; por defecto transparente
 * @param {string}  [opts.id]             prefijo para aislar el CSS de cada avatar
 * @param {string}  [opts.title]          texto accesible
 */
export function renderSVG(cfg, opts = {}) {
  const c = normalize(cfg);
  const st = STATES[c.state];
  const animated = opts.animated !== false;
  const id = opts.id || hashId(encode(c));
  const ink = inkFor(c);
  const expr = EXPRESSIONS[st.eyes || c.expression];
  const size = opts.size ? ` width="${opts.size}" height="${opts.size}"` : '';
  const title = opts.title || `Avatar ${EXPRESSIONS[c.expression].label.toLowerCase()}, ${st.label.toLowerCase()}`;

  let shape = `<path d="${shapePath(c.shape, 0)}" fill="${c.color}">`;
  if (animated && SHAPES[c.shape].morph) {
    const frames = [0, 1, 2, 3, 4, 5, 6].map((k) => shapePath(c.shape, (k / 6) * TAU));
    shape += `<animate attributeName="d" dur="${num(7 / c.speed)}s" repeatCount="indefinite" values="${frames.join(';')}"/>`;
  }
  shape += '</path>';

  const cheeks = expr.cheeks
    ? `<g fill="#FF6B8B" opacity=".45"><ellipse cx="${BODY.cx - 15}" cy="57.5" rx="4" ry="2.4"/><ellipse cx="${BODY.cx + 15}" cy="57.5" rx="4" ry="2.4"/></g>`
    : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"${size} class="${id}" role="img" aria-label="${title}">` +
    (animated ? `<style>${css(id, st, c.speed)}</style>` : '') +
    (opts.background ? `<rect width="100" height="100" fill="${opts.background}"/>` : '') +
    `<g class="da-body">${shape}${cheeks}<g class="da-eyes">` +
    eyeMarkup(expr.eyes[0], 'l', ink, c.color) +
    eyeMarkup(expr.eyes[1], 'r', ink, c.color) +
    `</g></g>` +
    extraMarkup(st.extra, c.color, ink) +
    `</svg>`
  );
}

// ---------------------------------------------------------------------------
// Navegador
// ---------------------------------------------------------------------------

/** Rasteriza el avatar (cuadro estático) y devuelve un Blob PNG. Solo en navegador. */
export async function renderPNG(cfg, size = 512, opts = {}) {
  const svg = renderSVG(cfg, { animated: false, size, background: opts.background });
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    canvas.getContext('2d').drawImage(img, 0, 0, size, size);
    return await new Promise((ok, fail) =>
      canvas.toBlob((b) => (b ? ok(b) : fail(new Error('No se pudo generar el PNG'))), 'image/png')
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

let counter = 0;

/** Avatar vivo dentro de un elemento del DOM. */
export class Avatar {
  constructor(el, cfg = {}, opts = {}) {
    this.el = el;
    this.opts = opts;
    this.id = `da-i${++counter}`;
    this.cfg = normalize(cfg);
    this.render();
  }
  render() {
    this.el.innerHTML = renderSVG(this.cfg, { ...this.opts, id: this.id });
    return this;
  }
  update(patch) {
    this.cfg = normalize({ ...this.cfg, ...patch });
    return this.render();
  }
  setState(state) { return this.update({ state }); }
  setExpression(expression) { return this.update({ expression }); }
  setShape(shape) { return this.update({ shape }); }
  setColor(color) { return this.update({ color }); }
  toSVG(opts) { return renderSVG(this.cfg, opts); }
  toPNG(size, opts) { return renderPNG(this.cfg, size, opts); }
  toCode() { return encode(this.cfg); }
  destroy() { this.el.innerHTML = ''; }
}

export function mount(el, cfg, opts) {
  const node = typeof el === 'string' ? document.querySelector(el) : el;
  if (!node) throw new Error(`Dot Avatar: no existe el elemento ${el}`);
  return new Avatar(node, cfg, opts);
}

const ATTRS = ['shape', 'expression', 'state', 'color', 'ink', 'speed', 'size', 'code'];

/** Registra la etiqueta <dot-avatar shape="round" color="#01A2A8" state="thinking" size="96">. */
export function defineElement(tag = 'dot-avatar') {
  if (typeof HTMLElement === 'undefined' || typeof customElements === 'undefined' || customElements.get(tag)) return;
  class DotAvatarElement extends HTMLElement {
    static get observedAttributes() { return ATTRS; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    get config() {
      const base = this.getAttribute('code') ? decode(this.getAttribute('code')) : {};
      const own = {};
      for (const a of ATTRS.slice(0, 6)) if (this.hasAttribute(a)) own[a] = this.getAttribute(a);
      return normalize({ ...base, ...own });
    }
    render() {
      if (!this._id) this._id = `da-e${++counter}`;
      const size = parseFloat(this.getAttribute('size')) || 96;
      this.style.display = this.style.display || 'inline-block';
      this.style.width = this.style.height = size + 'px';
      this.innerHTML = renderSVG(this.config, { id: this._id, size });
    }
  }
  customElements.define(tag, DotAvatarElement);
}

defineElement();
