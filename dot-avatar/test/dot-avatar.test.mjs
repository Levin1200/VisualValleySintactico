import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  renderSVG, normalize, encode, decode, random, inkFor, shapePath,
  SHAPES, EXPRESSIONS, STATES, DEFAULTS,
} from '../src/dot-avatar.js';

const balanced = (svg) => {
  // comprueba que cada etiqueta abierta se cierre en orden (XML bien formado a grandes rasgos)
  const stack = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    if (m[3]) continue;
    if (m[1]) assert.equal(stack.pop(), m[2], `cierre inesperado </${m[2]}>`);
    else stack.push(m[2]);
  }
  assert.equal(stack.length, 0, `sin cerrar: ${stack.join(',')}`);
};

test('todas las combinaciones generan SVG bien formado', () => {
  for (const shape of Object.keys(SHAPES))
    for (const expression of Object.keys(EXPRESSIONS))
      for (const state of Object.keys(STATES)) {
        const svg = renderSVG({ shape, expression, state, color: '#01A2A8' });
        assert.match(svg, /^<svg [^>]*viewBox="0 0 100 100"/);
        assert.ok(!/NaN|undefined/.test(svg), `${shape}/${expression}/${state}`);
        balanced(svg);
      }
});

test('modo estático sin animaciones', () => {
  const svg = renderSVG({ shape: 'blob', state: 'thinking' }, { animated: false, size: 64 });
  assert.ok(!svg.includes('<style>') && !svg.includes('<animate'));
  assert.match(svg, /width="64" height="64"/);
});

test('el blob se deforma con SMIL y el resto no', () => {
  assert.ok(renderSVG({ shape: 'blob' }).includes('<animate attributeName="d"'));
  assert.ok(!renderSVG({ shape: 'round' }).includes('<animate'));
});

test('los estados fuerzan sus ojos', () => {
  const ok = renderSVG({ expression: 'neutral', state: 'success' });
  assert.ok(ok.includes('Q0-4 4.2 2'), 'éxito usa ojos felices');
  assert.ok(renderSVG({ state: 'error' }).includes('#E5484D'), 'error muestra la insignia roja');
});

test('normalize corrige valores inválidos', () => {
  assert.deepEqual(normalize({ shape: 'x', color: 'nope', speed: -3 }), { ...DEFAULTS });
  assert.equal(normalize({ color: '#abc' }).color, '#AABBCC');
  assert.equal(normalize({ speed: 99 }).speed, 4);
});

test('encode / decode ida y vuelta', () => {
  const cfg = { shape: 'clover', expression: 'love', state: 'asleep', color: '#6918CE', ink: 'light', speed: 1.5 };
  assert.equal(encode(cfg), 'clover.love.asleep.6918ce.light.150');
  assert.deepEqual(decode(encode(cfg)), normalize(cfg));
  assert.deepEqual(decode(''), { ...DEFAULTS });
});

test('random es determinista con semilla', () => {
  assert.deepEqual(random(42), random(42));
  assert.ok(Object.keys(SHAPES).includes(random(7).shape));
});

test('tinta automática contrasta con el cuerpo', () => {
  assert.equal(inkFor({ color: '#FFC21A' }), '#1E1E24');
  assert.equal(inkFor({ color: '#01A2A8' }), '#FFFFFF');
  assert.equal(inkFor({ color: '#FFC21A', ink: 'light' }), '#FFFFFF');
});

test('ids distintos aíslan el CSS de cada avatar', () => {
  const a = renderSVG({ state: 'idle' }), b = renderSVG({ state: 'writing' });
  const id = (s) => s.match(/class="(da[a-z0-9]+)"/)[1];
  assert.notEqual(id(a), id(b));
  assert.ok(shapePath('star').startsWith('M') && shapePath('star').endsWith('Z'));
});
