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
  success: { label: 'Éxito', body: 'hop', dur: 1.4, eyes: 'happy' },
  alert: { label: 'Alerta', body: 'wiggle', dur: 1.8, eyes: 'surprised', extra: 'alert' },
  error: { label: 'Error', body: 'shake', dur: 1.6, eyes: 'dizzy', extra: 'error' },
  asleep: { label: 'Dormido', body: 'snooze', dur: 4.8, eyes: 'sleepy', extra: 'zzz' },
};

export const INKS = { auto: 'Automática', dark: 'Oscura', light: 'Clara' };

/** Acabado del cuerpo. */
export const SKINS = {
  flat: { label: 'Lisa' },
  plush: { label: 'Peludito' },
  plastic: { label: 'Plástico' },
};

export const DEFAULTS = Object.freeze({
  shape: 'round',
  expression: 'neutral',
  state: 'idle',
  color: '#01A2A8',
  ink: 'auto',
  skin: 'flat',
  speed: 1,
  eyeSize: 1,
  eyeGap: 1,
  eyeY: 0,
});

/** Límites de los ajustes de ojos (útiles para construir controles). */
export const EYE_RANGES = Object.freeze({
  eyeSize: { min: 0.5, max: 1.6, step: 0.05, label: 'Tamaño' },
  eyeGap: { min: 0.5, max: 1.6, step: 0.05, label: 'Separación' },
  eyeY: { min: -8, max: 8, step: 0.5, label: 'Altura' },
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
  const range = (key) => {
    const v = cfg[key], n = Number(v), r = EYE_RANGES[key];
    if (v == null || v === '' || !Number.isFinite(n)) return DEFAULTS[key];
    return Math.round(Math.min(r.max, Math.max(r.min, n)) * 100) / 100;
  };
  return {
    shape: pick(cfg.shape, SHAPES, DEFAULTS.shape),
    expression: pick(cfg.expression, EXPRESSIONS, DEFAULTS.expression),
    state: pick(cfg.state, STATES, DEFAULTS.state),
    color: normColor(cfg.color) || DEFAULTS.color,
    ink: pick(cfg.ink, INKS, DEFAULTS.ink),
    skin: pick(cfg.skin, SKINS, DEFAULTS.skin),
    speed: Number.isFinite(speed) && speed > 0 ? Math.min(4, Math.max(0.25, speed)) : DEFAULTS.speed,
    eyeSize: range('eyeSize'),
    eyeGap: range('eyeGap'),
    eyeY: range('eyeY'),
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

/**
 * Código compacto y legible para compartir:
 * forma.expresión.estado.color.tinta[.velocidad%.tamañoOjos%.separaciónOjos%.alturaOjos×10.piel]
 * Los campos finales con su valor por defecto se omiten.
 */
export function encode(cfg) {
  const c = normalize(cfg);
  const parts = [c.shape, c.expression, c.state, c.color.slice(1).toLowerCase(), c.ink];
  const tail = [c.speed * 100, c.eyeSize * 100, c.eyeGap * 100, c.eyeY * 10].map((v) => String(Math.round(v))).concat(c.skin);
  const defaults = ['100', '100', '100', '0', 'flat'];
  let n = tail.length;
  while (n && tail[n - 1] === defaults[n - 1]) n--;
  return parts.concat(tail.slice(0, n)).join('.');
}

export function decode(code) {
  const [shape, expression, state, color, ink, speed, size, gap, y, skin] = String(code || '').split('.');
  const scaled = (v, k, d) => (v ? Number(v) / k : d);
  return normalize({
    shape, expression, state, color: color && '#' + color, ink,
    speed: scaled(speed, 100, 1),
    eyeSize: scaled(size, 100, 1),
    eyeGap: scaled(gap, 100, 1),
    eyeY: scaled(y, 10, 0),
    skin,
  });
}

/** Avatar aleatorio; con la misma semilla siempre sale el mismo. */
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function random(seed = Math.random() * 2 ** 32) {
  const rnd = prng(seed);
  const any = (arr) => arr[Math.floor(rnd() * arr.length)];
  return normalize({
    shape: any(Object.keys(SHAPES)),
    expression: any(Object.keys(EXPRESSIONS)),
    state: 'idle',
    color: any(PALETTE),
    skin: any(Object.keys(SKINS)),
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
// Pieles
// ---------------------------------------------------------------------------

/**
 * Volumen de cojín: luz interior arriba a la izquierda y sombra interior abajo a la derecha,
 * calculadas desenfocando y desplazando la propia silueta. Todo en unidades del dibujo,
 * así que se ve igual a cualquier tamaño.
 */
function volumeFx(blur, offset, shade, glow) {
  return (
    `<feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="b"/>` +
    `<feOffset in="b" dx="${-offset}" dy="${num(-offset * 1.25)}" result="bu"/>` +
    `<feComposite in="SourceAlpha" in2="bu" operator="arithmetic" k2="1" k3="-1" result="sm"/>` +
    `<feFlood flood-color="#06060C" flood-opacity="${shade}"/><feComposite in2="sm" operator="in" result="shade"/>` +
    `<feOffset in="b" dx="${offset}" dy="${num(offset * 1.25)}" result="bd"/>` +
    `<feComposite in="SourceAlpha" in2="bd" operator="arithmetic" k2="1" k3="-1" result="lm"/>` +
    `<feFlood flood-color="#FFFFFF" flood-opacity="${glow}"/><feComposite in2="lm" operator="in" result="glow"/>` +
    `<feMerge result="vol"><feMergeNode in="SourceGraphic"/><feMergeNode in="glow"/><feMergeNode in="shade"/></feMerge>`
  );
}

/** Cuerpo según la piel: color plano, peluche (pelaje con ruido fino) o plástico brillante. */
function skinBody(c, id, d, morph) {
  const flat = `<path d="${d}" fill="${c.color}">${morph}</path>`;
  if (c.skin === 'flat') return { defs: '', body: flat };

  // luz general: más clara arriba a la izquierda, más oscura en el borde
  const light =
    `<radialGradient id="${id}-sh" cx=".4" cy=".35" r=".75">` +
    `<stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/>` +
    `<stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>`;
  const layers = flat + `<path d="${d}" fill="url(#${id}-sh)">${morph}</path>`;

  if (c.skin === 'plush') {
    const fur =
      `<filter id="${id}-fur" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">` +
      volumeFx(9, 7, 0.65, 0.3) +
      // borde deshilachado: ruido fino que desplaza la silueta
      `<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="n"/>` +
      `<feDisplacementMap in="vol" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="fuzzy"/>` +
      // grano del pelo sobre todo el cuerpo
      `<feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="2" seed="11" result="g"/>` +
      `<feColorMatrix in="g" type="saturate" values="0" result="gg"/>` +
      `<feComposite in="fuzzy" in2="gg" operator="arithmetic" k1=".28" k2=".86" result="grain"/>` +
      `<feGaussianBlur in="grain" stdDeviation=".35" result="soft"/>` +
      `<feComposite in="soft" in2="fuzzy" operator="in"/></filter>`;
    return { defs: fur + light, body: `<g filter="url(#${id}-fur)">${layers}</g>` };
  }

  // plástico: volumen liso, borde más oscuro y un reflejo suave recortado a la silueta
  const gloss =
    `<filter id="${id}-gloss" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">` +
    volumeFx(6, 4, 0.55, 0.45) +
    `<feComposite in="vol" in2="SourceAlpha" operator="in"/></filter>` +
    `<filter id="${id}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>` +
    `<clipPath id="${id}-clip"><path d="${d}">${morph}</path></clipPath>`;
  return {
    defs: gloss + light,
    body:
      `<g filter="url(#${id}-gloss)">${layers}</g>` +
      `<g clip-path="url(#${id}-clip)"><ellipse cx="38" cy="33" rx="10" ry="5" transform="rotate(-30 38 33)" fill="#fff" opacity=".55" filter="url(#${id}-soft)"/></g>`,
  };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function eyeMarkup(type, side, ink, c) {
  const g = GLYPHS[type] || GLYPHS.dot;
  const dx = EYE.dx * c.eyeGap;
  const x = BODY.cx + (side === 'l' ? -dx : dx);
  const scale = c.eyeSize !== 1 ? ` scale(${num(c.eyeSize)})` : '';
  let inner = g.svg(ink, c.color);
  if (side === 'r' && g.mirror) inner = `<g transform="scale(-1 1)">${inner}</g>`;
  return `<g transform="translate(${num(x)} ${num(EYE.y + c.eyeY)})${scale}"><g class="da-eye">${inner}</g></g>`;
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

function css(id, st, speed, html = false) {
  const S = (sec) => num(sec / speed) + 's';
  const p = `.${id}`;
  // en el modo en capas el cuerpo es un <div> de 100 × 100 unidades: px del dibujo → %
  const kf = html ? BODY_KEYFRAMES[st.body].replace(/(-?[\d.]+)px/g, '$1%') : BODY_KEYFRAMES[st.body];
  const origin = html ? 'transform-origin:50% 82%' : 'transform-box:view-box;transform-origin:50px 82px';
  let out =
    `${p} .da-body{${origin};animation:${id}-body ${S(st.dur)} ease-in-out infinite}` +
    `@keyframes ${id}-body{${kf}}`;
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
  const P = parts(cfg, opts);
  const size = opts.size ? ` width="${opts.size}" height="${opts.size}"` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"${size} class="${P.id}" role="img" aria-label="${P.title}">` +
    (P.animated ? `<style>${css(P.id, P.st, P.c.speed)}</style>` : '') +
    (P.defs ? `<defs>${P.defs}</defs>` : '') +
    (opts.background ? `<rect width="100" height="100" fill="${opts.background}"/>` : '') +
    `<g class="da-body">${P.skin}${P.face}</g>` +
    P.fx +
    `</svg>`
  );
}

/** Piezas del avatar: piel (cuerpo), cara (mejillas y ojos) y adornos del estado. */
function parts(cfg, opts = {}) {
  const c = normalize(cfg);
  const st = STATES[c.state];
  const animated = opts.animated !== false;
  const id = opts.id || hashId(encode(c));
  const ink = inkFor(c);
  const expr = EXPRESSIONS[st.eyes || c.expression];
  const title = opts.title || `Avatar ${EXPRESSIONS[c.expression].label.toLowerCase()}, ${st.label.toLowerCase()}`;

  // el pelaje es costoso de recalcular, así que el blob peludito no se deforma
  const d = shapePath(c.shape, 0);
  let morph = '';
  if (animated && SHAPES[c.shape].morph && c.skin !== 'plush') {
    const frames = [0, 1, 2, 3, 4, 5, 6].map((k) => shapePath(c.shape, (k / 6) * TAU));
    morph = `<animate attributeName="d" dur="${num(7 / c.speed)}s" repeatCount="indefinite" values="${frames.join(';')}"/>`;
  }
  const skin = skinBody(c, id, d, morph);

  // las mejillas acompañan a los ojos: debajo y un poco hacia afuera
  const chX = EYE.dx * c.eyeGap + 4.5, chY = num(57.5 + c.eyeY);
  const cheeks = expr.cheeks
    ? `<g fill="#FF6B8B" opacity=".45"><ellipse cx="${num(BODY.cx - chX)}" cy="${chY}" rx="4" ry="2.4"/><ellipse cx="${num(BODY.cx + chX)}" cy="${chY}" rx="4" ry="2.4"/></g>`
    : '';
  const face = cheeks + `<g class="da-eyes">${eyeMarkup(expr.eyes[0], 'l', ink, c)}${eyeMarkup(expr.eyes[1], 'r', ink, c)}</g>`;

  return { c, st, id, animated, title, defs: skin.defs, skin: skin.body, face, fx: extraMarkup(st.extra, c.color, ink) };
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

const layer = (cls, content, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="${cls}" aria-hidden="true" ` +
  `style="position:absolute;inset:0;width:100%;height:100%;overflow:visible${extra}">${content}</svg>`;

/**
 * Avatar vivo dentro de un elemento del DOM. Se dibuja en capas: la piel va en su propia
 * capa, que se pinta una sola vez, y el movimiento del cuerpo lo hace el compositor del
 * navegador. Así las pieles con filtros (peludito, plástico) no se recalculan en cada cuadro.
 */
export class Avatar {
  constructor(el, cfg = {}, opts = {}) {
    this.el = el;
    this.opts = opts;
    this.id = `da-i${++counter}`;
    this.cfg = normalize(cfg);
    this.render();
  }
  render() {
    const P = parts(this.cfg, { ...this.opts, id: this.id });
    if (!this.root || !this.el.contains(this.root)) {
      const size = this.opts.size ? `width:${this.opts.size}px;height:${this.opts.size}px` : 'width:100%;aspect-ratio:1/1';
      this.el.innerHTML =
        `<div class="${this.id}" role="img" style="position:relative;${size}"><style></style>` +
        `<div class="da-body" style="position:absolute;inset:0"><div class="da-skin" style="position:absolute;inset:0;will-change:transform"></div>` +
        layer('da-face', '') + `</div>` + layer('da-fx', '') + `</div>`;
      this.root = this.el.firstChild;
      this.skinKey = null;
    }
    const q = (sel) => this.root.querySelector(sel);
    this.root.setAttribute('aria-label', P.title);
    const style = P.animated ? css(P.id, P.st, P.c.speed, true) : '';
    if (q('style').textContent !== style) q('style').textContent = style;
    // la piel solo se vuelve a pintar si cambia algo que la afecte
    const skinKey = [P.c.shape, P.c.skin, P.c.color, P.c.speed, P.animated].join('|');
    if (skinKey !== this.skinKey) {
      q('.da-skin').innerHTML = layer('', (P.defs ? `<defs>${P.defs}</defs>` : '') + P.skin);
      this.skinKey = skinKey;
    }
    q('.da-face').innerHTML = P.face;
    q('.da-fx').innerHTML = P.fx;
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
  destroy() { this.el.innerHTML = ''; this.root = null; }
}

export function mount(el, cfg, opts) {
  const node = typeof el === 'string' ? document.querySelector(el) : el;
  if (!node) throw new Error(`Dot Avatar: no existe el elemento ${el}`);
  return new Avatar(node, cfg, opts);
}

// atributos de la etiqueta → clave de configuración
const CFG_ATTRS = {
  shape: 'shape', expression: 'expression', state: 'state', color: 'color', ink: 'ink', skin: 'skin', speed: 'speed',
  'eye-size': 'eyeSize', 'eye-gap': 'eyeGap', 'eye-y': 'eyeY',
};
const ATTRS = [...Object.keys(CFG_ATTRS), 'size', 'code'];

/** Registra la etiqueta <dot-avatar shape="round" color="#01A2A8" state="thinking" eye-size="1.2" size="96">. */
export function defineElement(tag = 'dot-avatar') {
  if (typeof HTMLElement === 'undefined' || typeof customElements === 'undefined' || customElements.get(tag)) return;
  class DotAvatarElement extends HTMLElement {
    static get observedAttributes() { return ATTRS; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    get config() {
      const base = this.getAttribute('code') ? decode(this.getAttribute('code')) : {};
      const own = {};
      for (const [attr, key] of Object.entries(CFG_ATTRS)) if (this.hasAttribute(attr)) own[key] = this.getAttribute(attr);
      return normalize({ ...base, ...own });
    }
    render() {
      const size = parseFloat(this.getAttribute('size')) || 96;
      this.style.display = this.style.display || 'inline-block';
      this.style.width = this.style.height = size + 'px';
      if (this._avatar) this._avatar.update(this.config);
      else this._avatar = new Avatar(this, this.config);
    }
  }
  customElements.define(tag, DotAvatarElement);
}

defineElement();
