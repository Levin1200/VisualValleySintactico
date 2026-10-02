# Dot Avatar

Personajes de puntos animados en SVG para darle cara a un agente de IA: 7 formas, 3 pieles (lisa, peludito y plástico), 21 expresiones, 8 estados animados, cualquier color, y exportación a SVG animado o PNG. Sin dependencias.

- `src/dot-avatar.js`: la librería como módulo ES (`import`).
- `dist/dot-avatar.js`: la misma librería para usar con `<script>` (expone `window.DotAvatar`). Se genera con `npm run build`.
- `index.html`: **Dot Avatar Lab**, la página de desarrollo para diseñar el personaje, probar estados y exportarlo. Ábrela directamente en el navegador; no necesita servidor.

## Uso rápido

### Con la etiqueta HTML

```html
<script src="dot-avatar.js"></script>

<dot-avatar shape="blob" expression="happy" state="thinking" color="#01A2A8" size="96"></dot-avatar>
```

Para cambiar el estado desde tu código: `el.setAttribute('state', 'writing')`.

Los ojos se ajustan con `eye-size`, `eye-gap` y `eye-y`: `<dot-avatar eye-size="1.3" eye-gap="0.8" eye-y="-2"></dot-avatar>`.

También acepta el código que genera el Lab: `<dot-avatar code="blob.happy.thinking.01a2a8.auto"></dot-avatar>`.

### Con JavaScript

```js
import { mount } from './dot-avatar/src/dot-avatar.js';

const agente = mount('#avatar', { shape: 'round', color: '#01A2A8', expression: 'neutral' });

agente.setState('listening');   // el usuario habla
agente.setState('thinking');    // el modelo procesa
agente.setState('writing');     // streaming de la respuesta
agente.setState('success');     // terminó
```

### Generar archivos (también en Node)

```js
import { renderSVG, renderPNG } from './dot-avatar/src/dot-avatar.js';

const svg = renderSVG({ shape: 'star', state: 'success', color: '#6918CE' });   // texto SVG animado
const fijo = renderSVG(cfg, { animated: false, size: 256 });                    // cuadro estático
const png = await renderPNG(cfg, 512);                                          // Blob PNG (solo navegador)
```

## Configuración

| Opción | Valores | Por defecto |
|---|---|---|
| `shape` | `round`, `squircle`, `blob`, `clover`, `flower`, `pebble`, `star` | `round` |
| `expression` | `neutral`, `calm`, `happy`, `wink`, `shy`, `joyful`, `surprised`, `shocked`, `sleepy`, `focused`, `unimpressed`, `determined`, `playful`, `love`, `starstruck`, `dizzy`, `curious`, `dreamy`, `thoughtful`, `sideeye`, `positive` | `neutral` |
| `state` | `idle`, `listening`, `thinking`, `writing`, `success`, `alert`, `error`, `asleep` | `idle` |
| `color` | cualquier hex (`#01A2A8`, `#abc`) | `#01A2A8` |
| `skin` | `flat` (lisa), `plush` (peludito), `plastic` (plástico brillante) | `flat` |
| `ink` | `auto` (contraste automático), `dark`, `light` | `auto` |
| `speed` | multiplicador de velocidad, de `0.25` a `4` | `1` |
| `eyeSize` | tamaño de los ojos, de `0.5` a `1.6` | `1` |
| `eyeGap` | separación entre los ojos, de `0.5` (juntos) a `1.6` (separados) | `1` |
| `eyeY` | altura de los ojos, de `-8` (arriba) a `8` (abajo) | `0` |

Los valores no válidos vuelven al valor por defecto en lugar de fallar.

### Qué hace cada estado

| Estado | Movimiento | Ojos | Adorno |
|---|---|---|---|
| `idle` | respira | parpadea | — |
| `listening` | se balancea | parpadea | ondas de sonido |
| `thinking` | se inclina | mira arriba a los lados | burbujas de pensamiento |
| `writing` | rebota rápido | mira abajo | globo con puntos de escritura |
| `success` | salta | felices | — |
| `alert` | se sacude | sorprendidos | insignia ámbar con `!` |
| `error` | tiembla | mareados | insignia roja con `×` |
| `asleep` | respira lento | cerrados | `z z z` |

`success`, `alert`, `error` y `asleep` imponen sus propios ojos. El resto usa la expresión elegida.

## API

- `mount(elemento | selector, cfg, opts?)` → `Avatar`
- `Avatar`: `.update(patch)`, `.setState()`, `.setExpression()`, `.setShape()`, `.setColor()`, `.toSVG(opts)`, `.toPNG(size, opts)`, `.toCode()`, `.destroy()`
- `renderSVG(cfg, { animated = true, size, background, id, title })` → `string`
- `renderPNG(cfg, size = 512, { background })` → `Promise<Blob>`
- `encode(cfg)` / `decode(code)`: código compartible `forma.expresión.estado.color.tinta[.velocidad%.tamañoOjos%.separaciónOjos%.alturaOjos×10.piel]`. Los campos finales con su valor por defecto se omiten, y los códigos antiguos siguen funcionando.
- `random(seed?)`: configuración aleatoria (determinista si pasas semilla)
- `normalize(cfg)`, `inkFor(cfg)`, `shapePath(shape, fase)`
- `defineElement(tag = 'dot-avatar')`: se llama sola al cargar en el navegador
- Catálogos: `SHAPES`, `EXPRESSIONS`, `STATES`, `SKINS`, `PALETTE`, `INKS`, `DEFAULTS`, `EYE_RANGES` (límites y pasos de los ajustes de ojos)

## Detalles

- Las pieles **peludito** y **plástico** usan filtros SVG: el volumen de cojín sale de una luz y una sombra interiores calculadas sobre la silueta, el pelaje de un ruido fino que deshilacha el borde y da grano, y el plástico añade un reflejo suave. Todo se mide en unidades del dibujo, así que se ve igual a cualquier tamaño y también en el PNG exportado.
- Las formas, los ojos y los adornos son vectoriales.
- En la página (`mount()` y `<dot-avatar>`) el avatar se dibuja en capas: la piel se pinta una sola vez y el movimiento del cuerpo lo hace el compositor del navegador, así que las pieles con filtros se animan a 60 fps. Al actualizarlo, la piel solo se vuelve a pintar si cambia algo que la afecte (forma, piel, color o velocidad). El blob peludito no se deforma, para no recalcular el pelaje en cada cuadro. Las animaciones son CSS dentro del propio SVG, y la deformación del `blob` usa SMIL. Por eso el SVG exportado también se anima al usarlo en `<img>`.
- Cada avatar aísla su CSS con un prefijo propio, así que puedes tener muchos en la misma página sin conflictos.
- Respeta `prefers-reduced-motion`.
- El Lab guarda el diseño actual y tu equipo en `localStorage`, y el enlace de **Compartir** lleva el diseño en la URL (`#a=…`).

## Desarrollo

```sh
npm test         # pruebas (node --test)
npm run build    # regenera dist/dot-avatar.js desde src/
```
