# Loading · JS puro

Los 29 spinners de [loading.dev](https://loading.dev) en **HTML, CSS y JavaScript puro, sin React**.

> **Créditos:** los spinners son de **loading-dev**, de Jakub Krehel y Paul Faivret, publicados con licencia MIT (paquete npm `loading-dev` 0.3.5). Este proyecto no los redibuja: ejecuta los componentes originales con un reemplazo mínimo de React, así que el resultado es idéntico. Ver [`LICENSE`](LICENSE).

- `index.html`: la galería. Elige un spinner, ajusta color, tamaño, velocidad y sus opciones propias, y copia el código. Ábrela directamente en el navegador; no necesita servidor.
- `dist/loading-vanilla.js`: para `<script>` (expone `window.LoadingVanilla` y la etiqueta `<ld-spinner>`).
- `dist/loading-vanilla.mjs`: el mismo código como módulo ES (`import`).
- `dist/loading-vanilla.css`: todo el CSS, para usar el HTML estático sin JavaScript.

## Uso

### Con la etiqueta

```html
<script src="loading-vanilla.js"></script>

<ld-spinner type="arc" size="24" color="#01A2A8"></ld-spinner>
```

Atributos: `type`, `size` (px), `color`, `speed` (multiplicador, 1 = velocidad original) o `duration` (ms), `paused`, `label` (texto accesible, por defecto «Cargando») y las opciones propias de cada spinner: `cap`, `easing`, `sweep`, `direction` y `origin`.

### Con JavaScript

```js
import { create } from './loading-vanilla/dist/loading-vanilla.mjs';

const spinner = create('blocks', { size: 32, color: '#6918CE', sweep: 'rows' });
document.querySelector('#carga').append(spinner);
// al terminar:
spinner.remove();
```

### Solo HTML y CSS

Copia el HTML de un spinner desde la galería (o con `LoadingVanilla.html(nombre, opciones)`) e incluye `loading-vanilla.css`, o solo el CSS de ese spinner (pestaña **CSS** de la galería).

## Spinners

`arc`, `atom`, `blocks`, `bouncing-dots`, `cascade`, `circular-dots`, `classic`, `classic-v2`, `clock`, `comet`, `compass`, `dual`, `eclipse`, `flip`, `gather`, `leap`, `linear-dots`, `loading`, `morph`, `orbit`, `pulse`, `radar`, `ring`, `ripple`, `slide`, `snake`, `swirl`, `trace` y `wave`.

### Opciones propias

| Opción | Valores | Dónde aplica |
|---|---|---|
| `cap` | `flat`, `round` | spinners de trazo, como `ring` o `arc` |
| `easing` | `linear`, `ease-in-out`, `stacked` | spinners que giran |
| `sweep` | `columns`, `diagonal`, `rows` | `blocks` |
| `direction` | `in`, `out` | `ripple` |
| `origin` | `bottom`, `center` | `wave` |

`supports(nombre, opción)` te dice si un spinner usa una opción. La galería solo muestra las que aplican.

## API

- `html(nombre, opciones)` → HTML listo para pegar (dentro de una región accesible, salvo `label: false`).
- `create(nombre, opciones)` → elemento listo para insertar (incluye su CSS).
- `render(nombre, opciones)` → `{ html, css }` del componente original, sin envoltorio.
- `css(nombres?)` → CSS de uno, varios o todos los spinners.
- `injectStyles(nombres?)`, `supports(nombre, opción)`, `defineElement(tag = 'ld-spinner')`.
- Catálogos: `NAMES`, `LABELS` (nombres en español), `DURATIONS` (ms originales), `VARIANTS`, `DEFAULTS`.

## Diferencias con el original

- No necesita React.
- `html()` y `create()` envuelven el spinner en `<span role="status" aria-label="Cargando">`. El original lo marca como decorativo (`aria-hidden`); así un lector de pantalla anuncia que algo está cargando. Usa `label: false` para el comportamiento original.
- Se añade `speed` (multiplicador) además de `duration` en ms.
- Con *reducir movimiento* activado, los spinners se detienen, igual que en el original.

## Cómo funciona

Los componentes de loading-dev solo generan SVG y HTML estático con animaciones CSS. `src/jsx-runtime.js` reemplaza a React y convierte sus elementos en HTML de texto. Los `<style>` que React subiría al `<head>` se guardan aparte para insertarlos una sola vez. `src/react.js` aporta `useId`, lo único más que usan. `build.mjs` empaqueta todo con esbuild.

La prueba `test/fidelity.test.mjs` renderiza los 29 spinners, con opciones y variantes, con el React real y con este port, y comprueba que el HTML sea idéntico.

## Desarrollo

```sh
npm install      # instala loading-dev y esbuild
npm run build    # genera dist/
npm test         # compara contra React y valida el CSS
```

Para actualizar a una versión nueva de loading-dev: cambia la versión en `package.json`, ejecuta `npm install`, `npm run build` y `npm test`.
