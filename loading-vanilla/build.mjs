// Empaqueta los componentes originales de loading-dev con el reemplazo de React → JS puro.
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./node_modules/loading-dev/package.json', import.meta.url)));
const banner = `/*!
 * loading-vanilla — port a HTML/CSS/JS puro (sin React) de loading-dev ${pkg.version}.
 * Spinners originales: loading-dev, de Jakub Krehel y Paul Faivret — https://loading.dev
 * Licencia MIT (ver LICENSE). Este archivo incluye el código de loading-dev y no necesita React.
 * Generado por build.mjs; no editar a mano.
 */`;
const common = {
  entryPoints: ['src/index.js'],
  bundle: true,
  alias: { 'react/jsx-runtime': './src/jsx-runtime.js', react: './src/react.js' },
  banner: { js: banner },
  legalComments: 'none',
  target: 'es2020',
  logLevel: 'warning',
};
await build({ ...common, format: 'iife', globalName: 'LoadingVanilla', outfile: 'dist/loading-vanilla.js' });
await build({ ...common, format: 'esm', outfile: 'dist/loading-vanilla.mjs' });

// CSS completo para quien prefiera no usar JavaScript en tiempo de ejecución
const lib = await import(new URL('./dist/loading-vanilla.mjs?' + Date.now(), import.meta.url));
writeFileSync('dist/loading-vanilla.css', banner.replace('Este archivo incluye el código', 'Este archivo incluye el CSS') + '\n' + lib.css() + '\n');
for (const f of ['loading-vanilla.js', 'loading-vanilla.mjs', 'loading-vanilla.css'])
  console.log(`dist/${f}: ${(readFileSync('dist/' + f).length / 1024).toFixed(1)} KB`);
console.log(`${lib.NAMES.length} spinners`);
