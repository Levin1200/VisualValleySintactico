import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  renderSVG, normalize, encode, decode, random, inkFor, shapePath,
  SHAPES, EXPRESSIONS, STATES, SKINS, DEFAULTS,
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
  assert.ok(!ok.includes('da-sp'), 'éxito no lleva estrellitas');
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

test('ajustes de ojos: tamaño, separación y altura', () => {
  const svg = renderSVG({ eyeSize: 1.4, eyeGap: 1.2, eyeY: -4 });
  // ojo izquierdo: 50 - 10.5 × 1.2 = 37.4 ; altura 49 - 4 = 45
  assert.ok(svg.includes('translate(37.4 45) scale(1.4)'), 'ojo izquierdo desplazado y escalado');
  assert.ok(svg.includes('translate(62.6 45) scale(1.4)'), 'ojo derecho simétrico');
  assert.ok(!renderSVG({}).includes('scale(1)'), 'sin escala cuando el tamaño es 1');
  const cheeks = renderSVG({ expression: 'shy', eyeGap: 1.2, eyeY: -4 });
  assert.ok(cheeks.includes('cx="32.9" cy="53.5"'), 'las mejillas siguen a los ojos');
});

test('los ajustes de ojos se limitan a su rango', () => {
  const c = normalize({ eyeSize: 9, eyeGap: 0, eyeY: -40 });
  assert.equal(c.eyeSize, 1.6); assert.equal(c.eyeGap, 0.5); assert.equal(c.eyeY, -8);
  assert.equal(normalize({ eyeSize: '' }).eyeSize, 1);
  assert.equal(normalize({ eyeY: 'abc' }).eyeY, 0);
});

test('el código guarda los ojos y sigue leyendo códigos antiguos', () => {
  const cfg = { shape: 'round', expression: 'neutral', state: 'idle', color: '#01A2A8', eyeSize: 1.25, eyeGap: 0.8, eyeY: -2.5 };
  assert.equal(encode(cfg), 'round.neutral.idle.01a2a8.auto.100.125.80.-25');
  assert.deepEqual(decode(encode(cfg)), normalize(cfg));
  assert.equal(encode({ eyeSize: 1.2 }), 'round.neutral.idle.01a2a8.auto.100.120');
  assert.deepEqual(decode('clover.love.asleep.6918ce.light.150'), normalize({ shape: 'clover', expression: 'love', state: 'asleep', color: '#6918CE', ink: 'light', speed: 1.5 }));
});

test('pieles: lisa, peludito y plástico', () => {
  for (const shape of Object.keys(SHAPES))
    for (const skin of Object.keys(SKINS))
      for (const state of Object.keys(STATES)) {
        const svg = renderSVG({ shape, skin, state });
        assert.ok(!/NaN|undefined/.test(svg), `${shape}/${skin}/${state}`);
        balanced(svg);
      }
  const flat = renderSVG({ skin: 'flat' });
  assert.ok(!flat.includes('<defs>'), 'la piel lisa no añade definiciones');
  const plush = renderSVG({ skin: 'plush', shape: 'blob' });
  assert.ok(plush.includes('radialGradient') && (plush.match(/stroke-linecap="round"/g) || []).length >= 5, 'peludito lleva sombreado y pelaje');
  assert.ok(!plush.includes('<animate'), 'el blob peludito no se deforma');
  const plastic = renderSVG({ skin: 'plastic', shape: 'blob' });
  assert.ok(plastic.includes('clipPath') && plastic.includes('-hl'), 'plástico lleva brillo recortado a la silueta');
  assert.equal((plastic.match(/<animate attributeName="d"/g) || []).length, 2, 'el brillo sigue al blob deformándose');
  assert.equal(renderSVG({ skin: 'plush' }), renderSVG({ skin: 'plush' }), 'el pelaje es determinista');
});

test('la piel viaja en el código compartible', () => {
  assert.equal(encode({ skin: 'plush' }), 'round.neutral.idle.01a2a8.auto.100.100.100.0.plush');
  assert.equal(decode(encode({ skin: 'plastic', eyeSize: 1.2 })).skin, 'plastic');
  assert.equal(decode('round.neutral.idle.01a2a8.auto').skin, 'flat');
  assert.equal(normalize({ skin: 'metal' }).skin, 'flat');
});
