// Genera dist/spinners.js (<script> clásico, window.Spinners) y dist/spinners.css (solo CSS).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { styles } from './src/spinners.js';

const src = readFileSync(new URL('./src/spinners.js', import.meta.url), 'utf8');
const names = [...src.matchAll(/^export (?:async function|function|const|class) ([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
const js =
  `/*! Spinners — versión global generada por build.mjs a partir de src/spinners.js. No editar a mano. */\n` +
  `(function (root) {\n'use strict';\n${src.replace(/^export /gm, '')}\nroot.Spinners = { ${names.join(', ')} };\n})(typeof globalThis !== 'undefined' ? globalThis : this);\n`;
const css = `/*! Spinners — CSS completo generado por build.mjs. No editar a mano. */\n${styles()}\n`;
mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/spinners.js', import.meta.url), js);
writeFileSync(new URL('./dist/spinners.css', import.meta.url), css);
console.log(`dist/spinners.js ${(js.length / 1024).toFixed(1)} KB · dist/spinners.css ${(css.length / 1024).toFixed(1)} KB · exporta: ${names.join(', ')}`);
