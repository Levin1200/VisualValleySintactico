/*!
 * loading-vanilla — los spinners de loading-dev (MIT, Jakub Krehel y Paul Faivret) en HTML/CSS/JS puro.
 * Usa los componentes originales del paquete npm "loading-dev" sin React: un reemplazo mínimo de
 * "react/jsx-runtime" los convierte en HTML. Las animaciones son 100 % CSS.
 */
import {
  SPINNERS, SPINNER_MOTION, DEFAULT_CAP, DEFAULT_EASING, DEFAULT_BLOCKS_SWEEP,
  DEFAULT_RIPPLE_DIRECTION, DEFAULT_WAVE_ORIGIN,
} from 'loading-dev';
import { jsx, toHTML, beginCollect, endCollect, styleFor } from './jsx-runtime.js';

export const NAMES = Object.keys(SPINNERS);

export const LABELS = {
  arc: 'Arco', atom: 'Átomo', blocks: 'Bloques', 'bouncing-dots': 'Puntos que rebotan', cascade: 'Cascada',
  'circular-dots': 'Puntos en círculo', classic: 'Clásico', 'classic-v2': 'Clásico v2', clock: 'Reloj',
  comet: 'Cometa', compass: 'Brújula', dual: 'Doble', eclipse: 'Eclipse', flip: 'Giro', gather: 'Reunión',
  leap: 'Salto', 'linear-dots': 'Puntos en línea', loading: 'Cargando', morph: 'Metamorfosis', orbit: 'Órbita',
  pulse: 'Pulso', radar: 'Radar', ring: 'Anillo', ripple: 'Ondas', slide: 'Deslizar', snake: 'Serpiente',
  swirl: 'Remolino', trace: 'Trazo', wave: 'Onda',
};

/** Duración original de un ciclo de cada spinner, en ms. */
export const DURATIONS = { ...SPINNER_MOTION };

/** Opciones propias de algunos spinners. `supports(nombre, opción)` dice cuáles las usan. */
export const VARIANTS = {
  cap: { label: 'Extremos', values: ['flat', 'round'], default: DEFAULT_CAP },
  easing: { label: 'Movimiento', values: ['linear', 'ease-in-out', 'stacked'], default: DEFAULT_EASING },
  sweep: { label: 'Barrido', values: ['columns', 'diagonal', 'rows'], default: DEFAULT_BLOCKS_SWEEP },
  direction: { label: 'Dirección', values: ['in', 'out'], default: DEFAULT_RIPPLE_DIRECTION },
  origin: { label: 'Origen', values: ['bottom', 'center'], default: DEFAULT_WAVE_ORIGIN },
};

export const DEFAULTS = Object.freeze({ size: 20, label: 'Cargando' });

const BASE_CSS = '.ldv{display:inline-flex;vertical-align:middle;line-height:0}';
const COLOR = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|hsl|oklch|oklab|lab|lch)a?\([^;{}"]*\)|color-mix\([^;{}"]*\))$/i;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function check(name) {
  if (!SPINNERS[name]) throw new Error(`loading-vanilla: no existe "${name}". Opciones: ${NAMES.join(', ')}`);
}

/** Opciones en español/HTML → props del componente original. */
function toProps(name, o = {}) {
  const p = {};
  const size = Number(o.size);
  if (Number.isFinite(size) && size > 0) p.size = clamp(size, 8, 512);
  if (typeof o.color === 'string' && COLOR.test(o.color.trim())) p.color = o.color.trim();
  const speed = Number(o.speed), duration = Number(o.duration);
  if (Number.isFinite(duration) && duration > 0) p.duration = clamp(Math.round(duration), 50, 60000);
  else if (Number.isFinite(speed) && speed > 0 && speed !== 1) p.duration = Math.round(DURATIONS[name] / clamp(speed, 0.1, 10));
  if (o.paused === true || o.paused === '' || o.paused === 'true') p.playState = 'paused';
  if (typeof o.className === 'string' && o.className) p.className = o.className;
  for (const [k, v] of Object.entries(VARIANTS)) if (v.values.includes(o[k])) p[k] = o[k];
  return p;
}

/** Render del componente original: { html, css } (css = solo lo que usa este spinner). */
export function render(name, options) {
  check(name);
  beginCollect();
  const markup = toHTML(jsx(SPINNERS[name], toProps(name, options)));
  const used = endCollect();
  return { html: markup, css: [...used].map(styleFor).join('\n') };
}

/** HTML listo para pegar. Va envuelto en una región accesible (role="status") salvo que label sea false. */
export function html(name, options = {}) {
  const { html: markup } = render(name, options);
  const label = options.label === undefined ? DEFAULTS.label : options.label;
  return label === false || label === '' ? markup : `<span class="ldv" role="status" aria-label="${escAttr(label)}">${markup}</span>`;
}

/** CSS de un spinner, de varios o de todos. */
export function css(names = NAMES) {
  const list = [names].flat();
  const parts = new Set([BASE_CSS]);
  for (const n of list) parts.add(render(n).css);
  return [...parts].join('\n');
}

const support = new Map();
/** ¿Este spinner usa la opción? (se comprueba comparando el resultado de dos valores) */
export function supports(name, option) {
  check(name);
  const key = name + '|' + option;
  if (!support.has(key)) {
    const v = VARIANTS[option];
    const outs = v ? v.values.map((val) => render(name, { [option]: val }).html) : [];
    support.set(key, outs.some((o) => o !== outs[0]));
  }
  return support.get(key);
}

// ---------------------------------------------------------------------------
// Navegador
// ---------------------------------------------------------------------------

/** Inserta en la página el CSS de los spinners indicados (o de todos), una sola vez cada uno. */
export function injectStyles(names = NAMES, doc = typeof document !== 'undefined' ? document : null) {
  if (!doc) return;
  const add = (id, text) => {
    if (doc.querySelector(`style[data-ldv="${id}"]`)) return;
    const el = doc.createElement('style');
    el.dataset.ldv = id;
    el.textContent = text;
    doc.head.appendChild(el);
  };
  add('base', BASE_CSS);
  for (const n of [names].flat()) add(n, render(n).css);
}

/** Crea el elemento del spinner e inserta su CSS si hace falta. */
export function create(name, options) {
  injectStyles(name);
  const t = document.createElement('template');
  t.innerHTML = html(name, options);
  return t.content.firstElementChild;
}

const ATTRS = ['type', 'size', 'color', 'duration', 'speed', 'paused', 'label', ...Object.keys(VARIANTS)];

/** Registra <ld-spinner type="arc" size="24" color="#01A2A8" speed="1.5">. */
export function defineElement(tag = 'ld-spinner') {
  if (typeof HTMLElement === 'undefined' || typeof customElements === 'undefined' || customElements.get(tag)) return;
  class LdSpinner extends HTMLElement {
    static get observedAttributes() { return ATTRS; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      const type = NAMES.includes(this.getAttribute('type')) ? this.getAttribute('type') : 'ring';
      const o = {};
      for (const a of ATTRS.slice(1)) if (this.hasAttribute(a)) o[a] = this.getAttribute(a);
      injectStyles(type, this.ownerDocument);
      this.style.display = this.style.display || 'inline-flex';
      this.innerHTML = html(type, o);
    }
  }
  customElements.define(tag, LdSpinner);
}

defineElement();
