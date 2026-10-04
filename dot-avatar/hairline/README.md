# Capas: Dot Avatar en Hairline

Una figura interactiva, hecha con la habilidad [hairline-create](https://hairline.lucasmarkes.com/skill) de [Hairline](https://hairline.lucasmarkes.com/docs), que muestra cómo se arma un Dot Avatar: el personaje desarmado en las capas con que la librería lo dibuja.

Abre `hairline-capas.html` en el navegador. No necesita servidor ni instalar nada.

- **Mover el puntero a lo ancho** separa las capas: a la izquierda casi juntas, a la derecha bien abiertas.
- **Mover el puntero a lo alto** elige una capa, que toma el trazo oscuro. La esquina dice cuál: `01 · fondo`, `02 · cuerpo`, `03 · ojos` o `04 · adorno`.
- **En reposo** brillan los ojos, que es donde se mira primero a un personaje.
- **La barra «intensity»** cambia la separación máxima entre capas (de 8 a 24 unidades).

## Qué representa cada capa

Todo está en las coordenadas reales de `dot-avatar.js`, su cuadro de 100 × 100: es el SVG del avatar separado en alturas.

| Capa | En la figura | En Dot Avatar |
|---|---|---|
| 01 · fondo | la placa cuadrada redondeada | el cuadro donde vive el personaje |
| 02 · cuerpo | el disco, con el reflejo de la piel de plástico | la forma (`shape`) con su piel (`skin`); centro 50, 52 y radio 30 |
| 03 · ojos | dos píldoras altas | los ojos de la expresión, con `eyeSize`, `eyeStretch` y `eyeGap` |
| 04 · adorno | tres burbujas | el adorno del estado `thinking` |

Las líneas punteadas bajan de cada pieza a la capa que tiene justo debajo: los ojos al cuerpo y las burbujas al fondo.

## Archivos

| Archivo | Para qué |
|---|---|
| `capas.js` | La figura. Es lo único escrito a mano; el motor y la página son los de Hairline, sin cambios. |
| `hairline-capas.html` | La página lista para abrir: motor de Hairline + página de prueba + figura. |
| `LICENSE-hairline` | Licencia MIT de Hairline (Lucas Marques), cuyo motor va dentro de la página. |

## Volver a generarla

Con la habilidad instalada (`npx skills add lucasmarkes/hairline`) o con una copia de su carpeta:

```sh
node <carpeta de la habilidad>/build.mjs capas.js        # escribe hairline-capas.html
node <carpeta de la habilidad>/look.mjs capas.js --answer 50,72,18 --edge 90,10,3 --edge 90,10,3
```

`look.mjs` valida las diez reglas de Hairline y toma ocho capturas: en reposo, respondiendo, a 240 px, en tema claro y oscuro y en los dos extremos de la barra. Esta figura pasa todas.
