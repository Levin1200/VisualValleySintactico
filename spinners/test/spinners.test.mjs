import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPINNERS, DEFAULTS, html, styles, normalize } from '../src/spinners.js';

const keyframesDefined = (css) => new Set([...css.matchAll(/@keyframes ([\w-]+)/g)].map((m) => m[1]));
const keyframesUsed = (css) => new Set([...css.matchAll(/animation:\s*([\w-]+)/g)].map((m) => m[1]));
const balanced = (css) => {
  let depth = 0;
  for (const ch of css) { if (ch === '{') depth++; if (ch === '}') depth--; assert.ok(depth >= 0, 'llave de cierre sin abrir'); }
  assert.equal(depth, 0, 'llaves sin cerrar');
};

test('cada spinner tiene CSS propio, completo y bien formado', () => {
  for (const type of Object.keys(SPINNERS)) {
    const css = styles(type);
    balanced(css);
    assert.ok(css.includes(`.sp-${type}`), `${type}: falta su CSS`);
    const defined = keyframesDefined(css);
    for (const k of keyframesUsed(css)) assert.ok(defined.has(k), `${type}: usa @keyframes ${k} sin definirla`);
    assert.ok(!/undefined|NaN/.test(css), `${type}: valores inválidos`);
  }
  balanced(styles());
});

test('el marcado es accesible y lleva los elementos internos correctos', () => {
  for (const [type, s] of Object.entries(SPINNERS)) {
    const out = html(type);
    assert.match(out, new RegExp(`^<span class="sp sp-${type}" role="status" aria-label="Cargando">`));
    assert.ok(out.endsWith('</span>') && out.includes(s.inner));
  }
  assert.equal(html('ring'), '<span class="sp sp-ring" role="status" aria-label="Cargando"></span>', 'sin estilo si todo es por defecto');
  assert.throws(() => html('nope'), /no existe/);
});

test('las opciones se traducen a variables CSS', () => {
  const out = html('bars', { size: 40, color: '#01A2A8', speed: 2, thickness: 0.2, paused: true, label: 'Guardando "datos"' });
  assert.ok(out.includes('style="--sp-size:40px;--sp-color:#01A2A8;--sp-duration:0.5s;--sp-thickness:0.2;--sp-play:paused"'));
  assert.ok(out.includes('aria-label="Guardando &quot;datos&quot;"'), 'la etiqueta se escapa');
});

test('normalize limita rangos y rechaza colores sospechosos', () => {
  const o = normalize({ size: 999, speed: 0, thickness: 9, color: 'red;}body{display:none' });
  assert.equal(o.size, 128); assert.equal(o.speed, 0.25); assert.equal(o.thickness, 0.25); assert.equal(o.color, '');
  assert.equal(normalize({ color: 'rgb(1, 162, 168)' }).color, 'rgb(1, 162, 168)');
  assert.deepEqual(normalize({}), { ...DEFAULTS });
});
