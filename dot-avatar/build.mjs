// Genera dist/dot-avatar.js: la misma librería como <script> clásico (window.DotAvatar).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync(new URL('./src/dot-avatar.js', import.meta.url), 'utf8');
const names = [...src.matchAll(/^export (?:async function|function|const|class) ([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
const body = src.replace(/^export /gm, '');
const out =
  `/*! Dot Avatar — versión global generada por build.mjs a partir de src/dot-avatar.js. No editar a mano. */\n` +
  `(function (root) {\n'use strict';\n${body}\nroot.DotAvatar = { ${names.join(', ')} };\n})(typeof globalThis !== 'undefined' ? globalThis : this);\n`;
mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/dot-avatar.js', import.meta.url), out);
console.log(`dist/dot-avatar.js · ${(out.length / 1024).toFixed(1)} KB · exporta: ${names.join(', ')}`);
