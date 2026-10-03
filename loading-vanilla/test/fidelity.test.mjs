// Comprueba que el port (sin React) produce exactamente el mismo HTML que el React real.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as original from 'loading-dev';
import * as port from '../dist/loading-vanilla.mjs';

// React deja los <style precedence> en el HTML; el port los separa. Se comparan sin ellos,
// y los identificadores de useId se normalizan (cada implementación genera los suyos).
const clean = (s) => s.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '').replace(/(id="|url\(#)[^")]+/g, '$1ID');
const reactHTML = (name, props) => clean(renderToStaticMarkup(createElement(original.SPINNERS[name], props)));

test('los 29 spinners salen idénticos a los de React', () => {
  assert.equal(port.NAMES.length, 29);
  for (const name of port.NAMES) {
    assert.equal(clean(port.render(name).html), reactHTML(name, {}), name);
  }
});

test('las opciones (tamaño, color, duración, pausa y variantes) también coinciden', () => {
  let checked = 0;
  for (const name of port.NAMES) {
    const base = { size: 36, color: '#01A2A8', duration: 900, paused: true };
    const props = { size: 36, color: '#01A2A8', duration: 900, playState: 'paused' };
    assert.equal(clean(port.render(name, base).html), reactHTML(name, props), `${name} con opciones`);
    for (const [opt, v] of Object.entries(port.VARIANTS)) {
      if (!port.supports(name, opt)) continue;
      for (const val of v.values) {
        assert.equal(clean(port.render(name, { [opt]: val }).html), reactHTML(name, { [opt]: val }), `${name} ${opt}=${val}`);
        checked++;
      }
    }
  }
  assert.ok(checked > 0, 'hay variantes comprobadas');
});

test('cada spinner trae su CSS y el CSS completo está bien formado', () => {
  for (const name of port.NAMES) assert.match(port.render(name).css, new RegExp(`\\.ld-${name}\\b`), name);
  const all = port.css();
  let depth = 0;
  for (const ch of all) { depth += ch === '{' ? 1 : ch === '}' ? -1 : 0; assert.ok(depth >= 0); }
  assert.equal(depth, 0);
});

test('html() envuelve en una región accesible y valida las opciones', () => {
  assert.match(port.html('ring'), /^<span class="ldv" role="status" aria-label="Cargando"><svg/);
  assert.ok(!port.html('ring', { label: false }).startsWith('<span'));
  assert.ok(!port.html('ring', { color: 'red;background:url(x)' }).includes('background'), 'color sospechoso descartado');
  assert.match(port.html('arc', { speed: 2 }), /--ld-duration:400ms/, 'speed 2 = mitad de la duración original (800ms)');
  assert.throws(() => port.html('nope'), /no existe/);
});
