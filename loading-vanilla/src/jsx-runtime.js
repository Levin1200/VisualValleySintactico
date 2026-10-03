// Reemplazo mínimo de "react/jsx-runtime": en lugar de un árbol de React, devuelve HTML como texto.
// Los componentes de loading-dev solo producen SVG/HTML estático con animaciones CSS, así que basta.
// Los <style precedence> (React 19 los sube al <head>) se guardan aparte para insertarlos una sola vez.

export const Fragment = Symbol.for('loading-vanilla.fragment');

const styles = new Map(); // href → CSS
let collecting = null;    // hrefs usados durante el render en curso

export function beginCollect() { collecting = new Set(); }
export function endCollect() { const used = collecting; collecting = null; return used; }
export function styleFor(href) { return styles.get(href) || ''; }

// atributos SVG que conservan mayúsculas internas; el resto de camelCase pasa a guiones
const KEEP_CASE = new Set(['viewBox', 'gradientUnits', 'gradientTransform', 'pathLength', 'preserveAspectRatio',
  'patternUnits', 'patternContentUnits', 'maskUnits', 'maskContentUnits', 'clipPathUnits', 'spreadMethod',
  'stdDeviation', 'baseFrequency', 'numOctaves', 'keyTimes', 'keySplines', 'calcMode', 'repeatCount',
  'attributeName', 'markerWidth', 'markerHeight', 'refX', 'refY', 'startOffset', 'textLength']);
// propiedades de estilo que React deja sin "px" cuando son números
const UNITLESS = new Set(['opacity', 'zIndex', 'flex', 'flexGrow', 'flexShrink', 'order', 'lineHeight',
  'fontWeight', 'fillOpacity', 'strokeOpacity', 'strokeWidth', 'strokeDashoffset', 'stopOpacity', 'scale']);

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

function styleText(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v != null && v !== false && v !== '')
    .map(([k, v]) => {
      const prop = k.startsWith('--') ? k : kebab(k);
      const val = typeof v === 'number' && !k.startsWith('--') && !UNITLESS.has(k) && v !== 0 ? v + 'px' : v;
      return `${prop}:${val}`;
    })
    .join(';');
}

function attrs(props) {
  let out = '';
  for (const [k, v] of Object.entries(props)) {
    if (k === 'children' || k === 'key' || k === 'ref' || k === 'dangerouslySetInnerHTML') continue;
    if (v == null || v === false) continue;
    let name = k === 'className' ? 'class' : k === 'htmlFor' ? 'for' : k === 'xlinkHref' ? 'xlink:href' : k;
    if (!KEEP_CASE.has(name) && !name.includes('-')) name = kebab(name);
    if (k === 'style' && typeof v === 'object') {
      const s = styleText(v);
      if (s) out += ` style="${escAttr(s)}"`;
      continue;
    }
    out += v === true && !name.startsWith('aria-') && !name.startsWith('data-') ? ` ${name}` : ` ${name}="${escAttr(v)}"`;
  }
  return out;
}

function children(c, raw = false) {
  if (c == null || c === false || c === true) return '';
  if (Array.isArray(c)) return c.map((x) => children(x, raw)).join('');
  if (typeof c === 'object' && c.__html !== undefined) return c.__html;
  return raw ? String(c) : typeof c === 'string' && c.startsWith('\u0000') ? c.slice(1) : esc(c);
}

// el HTML ya generado viaja marcado para no escaparlo dos veces
const html = (s) => '\u0000' + s;

export function jsx(type, props = {}) {
  if (type === Fragment) return html(children(props.children));
  if (typeof type === 'function') return type(props);
  if (type === 'style' && props.precedence) {
    const css = children(props.children, true);
    styles.set(props.href, css);
    if (collecting) collecting.add(props.href);
    return html('');
  }
  const inner = props.dangerouslySetInnerHTML ? props.dangerouslySetInnerHTML.__html : children(props.children, type === 'style' || type === 'script');
  // como React: solo los elementos vacíos de HTML se cierran solos; el resto lleva cierre explícito
  return html(VOID.has(type) ? `<${type}${attrs(props)}/>` : `<${type}${attrs(props)}>${inner}</${type}>`);
}
export const jsxs = jsx;
export const jsxDEV = jsx;

/** Convierte el resultado de un componente en HTML final. */
export const toHTML = (node) => (typeof node === 'string' && node.startsWith('\u0000') ? node.slice(1) : children(node));
