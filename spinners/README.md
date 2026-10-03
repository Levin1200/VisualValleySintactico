# Spinners

19 indicadores de carga ligeros: solo CSS, sin dependencias y accesibles. Se personalizan con variables CSS y escalan con el tamaño.

- `index.html`: la galería. Elige un spinner, ajusta color, tamaño, velocidad y grosor, y copia el código. Ábrela directamente en el navegador; no necesita servidor.
- `dist/spinners.css`: todo el CSS, para usar sin JavaScript.
- `dist/spinners.js`: la librería para `<script>` (expone `window.Spinners` y la etiqueta `<vv-spinner>`). Inserta el CSS por sí sola.
- `src/spinners.js`: la misma librería como módulo ES (`import`).

## Uso

### Con la etiqueta (lo más simple)

```html
<script src="spinners.js"></script>

<vv-spinner type="ring" size="32" color="#01A2A8"></vv-spinner>
```

Atributos: `type`, `size` (px), `color`, `speed` (multiplicador, 1 = normal), `thickness` (0.04–0.25), `label` (texto accesible, por defecto «Cargando») y `paused`.

### Solo CSS

```html
<link rel="stylesheet" href="spinners.css">

<span class="sp sp-ring" role="status" aria-label="Cargando" style="--sp-size:32px;--sp-color:#01A2A8"></span>
```

Algunos spinners llevan elementos internos (`<i></i>`). La galería te da el HTML exacto de cada uno, o lo puedes generar con `Spinners.html(type)`. Si solo usas uno, la pestaña **CSS** de la galería te da únicamente el CSS de ese spinner.

### Con JavaScript

```js
import { create } from './spinners/src/spinners.js';

const spinner = create('bars', { size: 40, color: '#6918CE', speed: 1.5 });
document.querySelector('#carga').append(spinner);
// al terminar:
spinner.remove();
```

## Spinners

`ring` (Anillo), `arc` (Arco), `dual` (Doble), `bounce` (Saltos), `typing` (Escribiendo), `bars` (Barras), `wave` (Onda), `pulse` (Pulso), `ripple` (Ondas), `orbit` (Órbita), `comet` (Cometa), `clock` (Reloj), `grid` (Cuadrícula), `dots` (Corona), `classic` (Clásico), `flip` (Giro), `ball` (Pelota), `line` (Línea) y `beat` (Latido).

## Variables CSS

| Variable | Qué controla | Por defecto |
|---|---|---|
| `--sp-size` | tamaño | `24px` |
| `--sp-color` | color | `currentColor` (el color del texto) |
| `--sp-duration` | duración de un ciclo | `1s` |
| `--sp-thickness` | grosor, relativo al tamaño | `.12` |
| `--sp-play` | `running` o `paused` | `running` |

## API

- `html(type, opciones)` → `string`: el marcado del spinner.
- `create(type, opciones)` → elemento listo para insertar.
- `styles(type?)` → CSS completo, o solo el de un spinner.
- `injectStyles()`: añade el CSS a la página una vez.
- `normalize(opciones)`, `defineElement(tag = 'vv-spinner')`.
- Catálogos: `SPINNERS`, `DEFAULTS`, `RANGES`.

Las opciones son `size`, `color`, `speed`, `thickness`, `label` y `paused`. Lo inválido vuelve al valor por defecto, y los colores que no parecen un color se descartan.

## Accesibilidad

Cada spinner usa `role="status"` con una etiqueta (`aria-label`). Con *reducir movimiento* activado en el sistema, los spinners van 2,5 veces más lentos en lugar de detenerse, para que sigan indicando que algo está cargando.

## Desarrollo

```sh
npm test         # pruebas (node --test)
npm run build    # regenera dist/ desde src/
```
