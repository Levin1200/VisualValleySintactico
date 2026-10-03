/*! Spinners — versión global generada por build.mjs a partir de src/spinners.js. No editar a mano. */
(function (root) {
'use strict';
/*!
 * Spinners — indicadores de carga ligeros, solo CSS, sin dependencias.
 * Cada spinner se personaliza con variables CSS:
 *   --sp-size (tamaño), --sp-color (color), --sp-duration (duración de un ciclo),
 *   --sp-thickness (grosor relativo al tamaño) y --sp-play (running | paused).
 * Todo lo interno se mide en `em`, así que escala con --sp-size.
 */

// CSS por bloques: `base` siempre es necesario; cada spinner añade el suyo.
const CSS = {
  base: `.sp{--sp-size:24px;--sp-color:currentColor;--sp-duration:1s;--sp-thickness:.12;--sp-d:calc(var(--sp-duration) * var(--sp-slow,1));position:relative;display:inline-block;flex:none;width:var(--sp-size);height:var(--sp-size);font-size:var(--sp-size);line-height:0;color:var(--sp-color);vertical-align:middle}
.sp *,.sp::before,.sp::after{box-sizing:border-box}
.sp,.sp *,.sp::before,.sp::after,.sp *::before,.sp *::after{animation-play-state:var(--sp-play,running)}
@keyframes sp-spin{to{transform:rotate(1turn)}}
@keyframes sp-fadeout{from{opacity:1}to{opacity:.18}}
@media (prefers-reduced-motion:reduce){.sp{--sp-slow:2.5}}`,

  ring: `.sp-ring::before{content:"";position:absolute;inset:0;border-radius:50%;border:calc(var(--sp-thickness) * 1em) solid color-mix(in srgb,currentColor 18%,transparent);border-top-color:currentColor;animation:sp-spin calc(var(--sp-d) * .8) linear infinite}`,

  arc: `.sp-arc svg{display:block;width:100%;height:100%;overflow:visible;animation:sp-spin calc(var(--sp-d) * 1.6) linear infinite}
.sp-arc circle{fill:none;stroke:currentColor;stroke-width:calc(var(--sp-thickness) * 24);stroke-linecap:round;stroke-dasharray:1 100;animation:sp-arc calc(var(--sp-d) * 1.2) ease-in-out infinite}
@keyframes sp-arc{0%{stroke-dasharray:1 100;stroke-dashoffset:0}50%{stroke-dasharray:60 100;stroke-dashoffset:-15}100%{stroke-dasharray:60 100;stroke-dashoffset:-99}}`,

  dual: `.sp-dual::before,.sp-dual::after{content:"";position:absolute;border-radius:50%;border:calc(var(--sp-thickness) * 1em) solid transparent}
.sp-dual::before{inset:0;border-top-color:currentColor;border-bottom-color:currentColor;animation:sp-spin var(--sp-d) linear infinite}
.sp-dual::after{inset:calc(var(--sp-thickness) * 2em);border-left-color:currentColor;border-right-color:currentColor;opacity:.55;animation:sp-spin calc(var(--sp-d) * .7) linear infinite reverse}`,

  bounce: `.sp-bounce{display:inline-flex;align-items:center;justify-content:space-between}
.sp-bounce i{width:.22em;height:.22em;border-radius:50%;background:currentColor;animation:sp-bounce calc(var(--sp-d) * 1.1) ease-in-out infinite}
.sp-bounce i:nth-child(2){animation-delay:calc(var(--sp-d) * .15)}
.sp-bounce i:nth-child(3){animation-delay:calc(var(--sp-d) * .3)}
@keyframes sp-bounce{0%,60%,100%{transform:translateY(.12em)}30%{transform:translateY(-.25em)}}`,

  typing: `.sp-typing{display:inline-flex;align-items:center;justify-content:space-between}
.sp-typing i{width:.22em;height:.22em;border-radius:50%;background:currentColor;opacity:.25;animation:sp-typing var(--sp-d) ease-in-out infinite}
.sp-typing i:nth-child(2){animation-delay:calc(var(--sp-d) * .18)}
.sp-typing i:nth-child(3){animation-delay:calc(var(--sp-d) * .36)}
@keyframes sp-typing{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`,

  bars: `.sp-bars{display:inline-flex;align-items:center;justify-content:space-between;padding:0 .08em}
.sp-bars i{width:calc(var(--sp-thickness) * 1.3em);height:80%;border-radius:.1em;background:currentColor;transform:scaleY(.35);animation:sp-bars var(--sp-d) ease-in-out infinite}
.sp-bars i:nth-child(2){animation-delay:calc(var(--sp-d) * .12)}
.sp-bars i:nth-child(3){animation-delay:calc(var(--sp-d) * .24)}
.sp-bars i:nth-child(4){animation-delay:calc(var(--sp-d) * .36)}
@keyframes sp-bars{0%,70%,100%{transform:scaleY(.35)}35%{transform:scaleY(1)}}`,

  wave: `.sp-wave{display:inline-flex;align-items:center;justify-content:space-between}
.sp-wave i{width:.15em;height:.15em;border-radius:50%;background:currentColor;animation:sp-wave var(--sp-d) ease-in-out infinite}
.sp-wave i:nth-child(2){animation-delay:calc(var(--sp-d) * .1)}
.sp-wave i:nth-child(3){animation-delay:calc(var(--sp-d) * .2)}
.sp-wave i:nth-child(4){animation-delay:calc(var(--sp-d) * .3)}
.sp-wave i:nth-child(5){animation-delay:calc(var(--sp-d) * .4)}
@keyframes sp-wave{0%,100%{transform:translateY(.22em)}50%{transform:translateY(-.22em)}}`,

  pulse: `.sp-pulse::before{content:"";position:absolute;inset:0;border-radius:50%;background:currentColor;animation:sp-grow calc(var(--sp-d) * 1.2) cubic-bezier(.2,.6,.4,1) infinite}
@keyframes sp-grow{0%{transform:scale(.1);opacity:1}100%{transform:scale(1);opacity:0}}`,

  ripple: `.sp-ripple::before,.sp-ripple::after{content:"";position:absolute;inset:0;border-radius:50%;border:calc(var(--sp-thickness) * .8em) solid currentColor;opacity:0;animation:sp-ripple calc(var(--sp-d) * 1.4) cubic-bezier(.2,.6,.4,1) infinite}
.sp-ripple::after{animation-delay:calc(var(--sp-d) * .7)}
@keyframes sp-ripple{0%{transform:scale(.1);opacity:1}100%{transform:scale(1);opacity:0}}`,

  orbit: `.sp-orbit::before{content:"";position:absolute;inset:.08em;border-radius:50%;border:max(1px,calc(var(--sp-thickness) * .4em)) solid color-mix(in srgb,currentColor 25%,transparent)}
.sp-orbit::after{content:"";position:absolute;left:50%;top:50%;width:.2em;height:.2em;margin:-.1em 0 0 -.1em;border-radius:50%;background:currentColor;opacity:.55}
.sp-orbit i{position:absolute;inset:0;animation:sp-spin calc(var(--sp-d) * 1.2) linear infinite}
.sp-orbit i::before{content:"";position:absolute;left:50%;top:calc(.08em + var(--sp-thickness) * .2em);width:calc(var(--sp-thickness) * 1.9em);height:calc(var(--sp-thickness) * 1.9em);border-radius:50%;background:currentColor;transform:translate(-50%,-50%)}`,

  comet: `.sp-comet i{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,transparent,currentColor);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--sp-thickness) * 1em),#000 calc(100% - var(--sp-thickness) * 1em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - var(--sp-thickness) * 1em),#000 calc(100% - var(--sp-thickness) * 1em + .5px));animation:sp-spin calc(var(--sp-d) * .9) linear infinite}
.sp-comet i::after{content:"";position:absolute;left:50%;top:0;width:calc(var(--sp-thickness) * 1em);height:calc(var(--sp-thickness) * 1em);border-radius:50%;background:currentColor;transform:translateX(-50%)}`,

  clock: `.sp-clock::before{content:"";position:absolute;inset:0;border-radius:50%;border:calc(var(--sp-thickness) * .8em) solid currentColor}
.sp-clock i{position:absolute;left:50%;bottom:50%;width:calc(var(--sp-thickness) * .8em);margin-left:calc(var(--sp-thickness) * -.4em);border-radius:1em;background:currentColor;transform-origin:50% 100%}
.sp-clock i:nth-child(1){height:.32em;animation:sp-spin var(--sp-d) linear infinite}
.sp-clock i:nth-child(2){height:.22em;animation:sp-spin calc(var(--sp-d) * 12) linear infinite}`,

  grid: `.sp-grid{display:inline-grid;grid-template-columns:repeat(3,1fr);gap:.08em;padding:.04em}
.sp-grid i{border-radius:.06em;background:currentColor;animation:sp-grid calc(var(--sp-d) * 1.3) ease-in-out infinite}
.sp-grid i:nth-child(2),.sp-grid i:nth-child(4){animation-delay:calc(var(--sp-d) * .1)}
.sp-grid i:nth-child(3),.sp-grid i:nth-child(5),.sp-grid i:nth-child(7){animation-delay:calc(var(--sp-d) * .2)}
.sp-grid i:nth-child(6),.sp-grid i:nth-child(8){animation-delay:calc(var(--sp-d) * .3)}
.sp-grid i:nth-child(9){animation-delay:calc(var(--sp-d) * .4)}
@keyframes sp-grid{0%,70%,100%{transform:scale(1);opacity:1}35%{transform:scale(.3);opacity:.3}}`,

  dots: `.sp-dots i{position:absolute;inset:0}
.sp-dots i::before{content:"";position:absolute;left:50%;top:0;width:.2em;height:.2em;margin-left:-.1em;border-radius:50%;background:currentColor;opacity:.18;animation:sp-fadeout var(--sp-d) linear infinite}
${ring(8, 'dots')}`,

  classic: `.sp-classic i{position:absolute;inset:0}
.sp-classic i::before{content:"";position:absolute;left:50%;top:.02em;width:calc(var(--sp-thickness) * .75em);height:.28em;margin-left:calc(var(--sp-thickness) * -.375em);border-radius:1em;background:currentColor;opacity:.18;animation:sp-fadeout var(--sp-d) linear infinite}
${ring(12, 'classic')}`,

  flip: `.sp-flip{perspective:3em}
.sp-flip i{position:absolute;inset:.14em;border-radius:.1em;background:currentColor;animation:sp-flip calc(var(--sp-d) * 1.6) ease-in-out infinite}
@keyframes sp-flip{0%{transform:rotateX(0) rotateY(0)}50%{transform:rotateX(-180deg) rotateY(0)}100%{transform:rotateX(-180deg) rotateY(-180deg)}}`,

  ball: `.sp-ball i{position:absolute;left:50%;top:0;width:.32em;height:.32em;margin-left:-.16em;border-radius:50%;background:currentColor;transform-origin:50% 100%;animation:sp-ball calc(var(--sp-d) * .45) cubic-bezier(.55,0,1,.45) infinite alternate}
.sp-ball::after{content:"";position:absolute;left:50%;bottom:.04em;width:.4em;height:.08em;margin-left:-.2em;border-radius:50%;background:currentColor;opacity:.2;animation:sp-shadow calc(var(--sp-d) * .45) cubic-bezier(.55,0,1,.45) infinite alternate}
@keyframes sp-ball{0%{transform:translateY(0)}85%{transform:translateY(.56em) scale(1)}100%{transform:translateY(.6em) scale(1.25,.75)}}
@keyframes sp-shadow{0%{transform:scale(.5);opacity:.08}100%{transform:scale(1.1);opacity:.3}}`,

  line: `.sp-line{width:calc(var(--sp-size) * 3);height:max(2px,calc(var(--sp-size) * var(--sp-thickness) * .8));overflow:hidden;border-radius:1em;background:color-mix(in srgb,currentColor 18%,transparent)}
.sp-line::before{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;border-radius:inherit;background:currentColor;animation:sp-line calc(var(--sp-d) * 1.4) cubic-bezier(.6,.1,.4,.9) infinite}
@keyframes sp-line{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`,

  beat: `.sp-beat::before{content:"";position:absolute;inset:.16em;border-radius:50%;background:currentColor;animation:sp-beat calc(var(--sp-d) * 1.1) ease-in-out infinite}
@keyframes sp-beat{0%,60%,100%{transform:scale(.8)}12%{transform:scale(1)}24%{transform:scale(.86)}36%{transform:scale(1)}}`,
};

/** Reglas para `n` elementos repartidos en círculo, cada uno con su giro y su retraso. */
function ring(n, name) {
  let out = '';
  for (let k = 0; k < n; k++) {
    const turn = Math.round((k / n) * 360 * 100) / 100;
    const delay = Math.round((k / n - 1) * 1000) / 1000;
    out += `.sp-${name} i:nth-child(${k + 1}){transform:rotate(${turn}deg)}.sp-${name} i:nth-child(${k + 1})::before{animation-delay:calc(var(--sp-d) * ${delay})}`;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

const dots = (n) => '<i></i>'.repeat(n);

/** Spinners disponibles: nombre visible, palabras para buscarlo y contenido interno. */
const SPINNERS = {
  ring: { label: 'Anillo', tags: 'círculo aro', inner: '' },
  arc: { label: 'Arco', tags: 'círculo material', inner: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" pathLength="100"/></svg>' },
  dual: { label: 'Doble', tags: 'círculo doble anillo', inner: '' },
  bounce: { label: 'Saltos', tags: 'puntos rebote', inner: dots(3) },
  typing: { label: 'Escribiendo', tags: 'puntos chat mensaje', inner: dots(3) },
  bars: { label: 'Barras', tags: 'ecualizador audio barras', inner: dots(4) },
  wave: { label: 'Onda', tags: 'puntos ola', inner: dots(5) },
  pulse: { label: 'Pulso', tags: 'círculo respirar', inner: '' },
  ripple: { label: 'Ondas', tags: 'círculo agua anillos', inner: '' },
  orbit: { label: 'Órbita', tags: 'círculo planeta punto', inner: dots(1) },
  comet: { label: 'Cometa', tags: 'círculo cola degradado', inner: dots(1) },
  clock: { label: 'Reloj', tags: 'tiempo espera agujas', inner: dots(2) },
  grid: { label: 'Cuadrícula', tags: 'cuadrados bloques', inner: dots(9) },
  dots: { label: 'Corona', tags: 'puntos círculo', inner: dots(8) },
  classic: { label: 'Clásico', tags: 'líneas ios rayos', inner: dots(12) },
  flip: { label: 'Giro', tags: 'cuadrado 3d voltear', inner: dots(1) },
  ball: { label: 'Pelota', tags: 'rebote punto', inner: dots(1) },
  line: { label: 'Línea', tags: 'barra progreso horizontal', inner: '' },
  beat: { label: 'Latido', tags: 'corazón círculo', inner: '' },
};

const DEFAULTS = Object.freeze({ size: 24, color: '', speed: 1, thickness: 0.12, label: 'Cargando', paused: false });
const RANGES = Object.freeze({
  size: { min: 12, max: 128 },
  speed: { min: 0.25, max: 4 },
  thickness: { min: 0.04, max: 0.25 },
});

const clamp = (v, key) => {
  const n = Number(v), r = RANGES[key];
  if (v == null || v === '' || !Number.isFinite(n)) return DEFAULTS[key];
  return Math.min(r.max, Math.max(r.min, n));
};
const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Completa y valida las opciones; lo inválido vuelve al valor por defecto. */
function normalize(opts = {}) {
  const color = typeof opts.color === 'string' && /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|hsl|oklch)a?\([^;{}]*\))$/i.test(opts.color.trim()) ? opts.color.trim() : '';
  return {
    size: clamp(opts.size, 'size'),
    color,
    speed: clamp(opts.speed, 'speed'),
    thickness: Math.round(clamp(opts.thickness, 'thickness') * 1000) / 1000,
    label: opts.label ? String(opts.label) : DEFAULTS.label,
    paused: opts.paused === true || opts.paused === 'true' || opts.paused === '',
  };
}

/** Variables CSS en línea; solo las que difieren del valor por defecto. */
function styleVars(o) {
  const v = [];
  if (o.size !== DEFAULTS.size) v.push(`--sp-size:${o.size}px`);
  if (o.color) v.push(`--sp-color:${o.color}`);
  if (o.speed !== 1) v.push(`--sp-duration:${Math.round((1 / o.speed) * 1000) / 1000}s`);
  if (o.thickness !== DEFAULTS.thickness) v.push(`--sp-thickness:${o.thickness}`);
  if (o.paused) v.push('--sp-play:paused');
  return v.join(';');
}

/** Marcado HTML de un spinner. Necesita el CSS de `styles()` en la página. */
function html(type, opts = {}) {
  const s = SPINNERS[type];
  if (!s) throw new Error(`Spinners: no existe "${type}". Opciones: ${Object.keys(SPINNERS).join(', ')}`);
  const o = normalize(opts);
  const style = styleVars(o);
  return `<span class="sp sp-${type}" role="status" aria-label="${escapeAttr(o.label)}"${style ? ` style="${style}"` : ''}>${s.inner}</span>`;
}

/** CSS completo, o solo lo necesario para un spinner (base + el suyo). */
function styles(type) {
  if (!type) return Object.values(CSS).join('\n');
  if (!CSS[type] || type === 'base') throw new Error(`Spinners: no existe "${type}"`);
  return CSS.base + '\n' + CSS[type];
}

// ---------------------------------------------------------------------------
// Navegador
// ---------------------------------------------------------------------------

/** Inserta el CSS en la página una sola vez. */
function injectStyles(doc = typeof document !== 'undefined' ? document : null) {
  if (!doc || doc.getElementById('vv-spinners-css')) return;
  const el = doc.createElement('style');
  el.id = 'vv-spinners-css';
  el.textContent = styles();
  doc.head.appendChild(el);
}

/** Crea el elemento del spinner (inserta el CSS si hace falta). */
function create(type, opts) {
  injectStyles();
  const t = document.createElement('template');
  t.innerHTML = html(type, opts);
  return t.content.firstElementChild;
}

const ATTRS = ['type', 'size', 'color', 'speed', 'thickness', 'label', 'paused'];

/** Registra <vv-spinner type="ring" size="32" color="#01A2A8" speed="1.5">. */
function defineElement(tag = 'vv-spinner') {
  if (typeof HTMLElement === 'undefined' || typeof customElements === 'undefined' || customElements.get(tag)) return;
  class SpinnerElement extends HTMLElement {
    static get observedAttributes() { return ATTRS; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      injectStyles(this.ownerDocument);
      const type = this.getAttribute('type') in SPINNERS ? this.getAttribute('type') : 'ring';
      const opts = {};
      for (const a of ATTRS.slice(1)) if (this.hasAttribute(a)) opts[a] = this.getAttribute(a);
      this.style.display = this.style.display || 'inline-flex';
      this.innerHTML = html(type, opts);
    }
  }
  customElements.define(tag, SpinnerElement);
}

defineElement();

root.Spinners = { SPINNERS, DEFAULTS, RANGES, normalize, html, styles, injectStyles, create, defineElement };
})(typeof globalThis !== 'undefined' ? globalThis : this);
