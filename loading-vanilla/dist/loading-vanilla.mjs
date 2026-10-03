/*!
 * loading-vanilla — port a HTML/CSS/JS puro (sin React) de loading-dev 0.3.5.
 * Spinners originales: loading-dev, de Jakub Krehel y Paul Faivret — https://loading.dev
 * Licencia MIT (ver LICENSE). Este archivo incluye el código de loading-dev y no necesita React.
 * Generado por build.mjs; no editar a mano.
 */

// node_modules/loading-dev/dist/chunk-OMNMMKI7.js
var DURATION_VAR = "--ld-duration";
var PLAY_STATE_VAR = "--ld-play-state";
var SIZE_VAR = "--ld-size";
var STEP_VAR = "--ld-step";
var DEFAULT_SIZE = 20;
var SIZE = `var(${SIZE_VAR}, ${DEFAULT_SIZE}px)`;
var SPINNER_MOTION = {
  arc: 800,
  atom: 1e3,
  blocks: 1300,
  "bouncing-dots": 500,
  cascade: 1500,
  "circular-dots": 800,
  classic: 1200,
  "classic-v2": 800,
  clock: 1200,
  comet: 700,
  compass: 500,
  dual: 1e3,
  eclipse: 1200,
  flip: 1200,
  gather: 1600,
  leap: 1800,
  "linear-dots": 900,
  loading: 1e3,
  morph: 1200,
  orbit: 750,
  pulse: 1200,
  radar: 1500,
  ring: 800,
  ripple: 1200,
  slide: 2400,
  snake: 1400,
  swirl: 1200,
  trace: 1200,
  wave: 900
};
function duration(name) {
  return `var(${DURATION_VAR}, ${SPINNER_MOTION[name]}ms)`;
}
function stagger(name, count) {
  return `calc(${duration(name)} * (var(${STEP_VAR}) - ${count}) / ${count})`;
}
var PLAY_STATE = `var(${PLAY_STATE_VAR}, running)`;
function animation(name, keyframes, timing) {
  const runs = [keyframes].flat().map((frames) => `${frames} ${duration(name)} ${timing} infinite`);
  return `animation: ${runs.join(", ")};
  animation-play-state: ${PLAY_STATE};`;
}

// node_modules/loading-dev/dist/chunk-PVVWLDIS.js
function fadeCss(name, element, count, { dim, rest }) {
  return `
.ld-${name}-${element} {
  ${animation(name, `ld-${name}-fade`, "linear")}
  animation-delay: ${stagger(name, count)};
}

@keyframes ld-${name}-fade {
  from {
    opacity: 1;
  }
  to {
    opacity: ${dim};
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-${name}-${element} {
    opacity: ${rest};
  }
}
`;
}

// src/jsx-runtime.js
var Fragment = Symbol.for("loading-vanilla.fragment");
var styles = /* @__PURE__ */ new Map();
var collecting = null;
function beginCollect() {
  collecting = /* @__PURE__ */ new Set();
}
function endCollect() {
  const used = collecting;
  collecting = null;
  return used;
}
function styleFor(href) {
  return styles.get(href) || "";
}
var KEEP_CASE = /* @__PURE__ */ new Set([
  "viewBox",
  "gradientUnits",
  "gradientTransform",
  "pathLength",
  "preserveAspectRatio",
  "patternUnits",
  "patternContentUnits",
  "maskUnits",
  "maskContentUnits",
  "clipPathUnits",
  "spreadMethod",
  "stdDeviation",
  "baseFrequency",
  "numOctaves",
  "keyTimes",
  "keySplines",
  "calcMode",
  "repeatCount",
  "attributeName",
  "markerWidth",
  "markerHeight",
  "refX",
  "refY",
  "startOffset",
  "textLength"
]);
var UNITLESS = /* @__PURE__ */ new Set([
  "opacity",
  "zIndex",
  "flex",
  "flexGrow",
  "flexShrink",
  "order",
  "lineHeight",
  "fontWeight",
  "fillOpacity",
  "strokeOpacity",
  "strokeWidth",
  "strokeDashoffset",
  "stopOpacity",
  "scale"
]);
var VOID = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
var kebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
var esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var escAttr = (s) => esc(s).replace(/"/g, "&quot;");
function styleText(obj) {
  return Object.entries(obj).filter(([, v]) => v != null && v !== false && v !== "").map(([k, v]) => {
    const prop = k.startsWith("--") ? k : kebab(k);
    const val = typeof v === "number" && !k.startsWith("--") && !UNITLESS.has(k) && v !== 0 ? v + "px" : v;
    return `${prop}:${val}`;
  }).join(";");
}
function attrs(props) {
  let out = "";
  for (const [k, v] of Object.entries(props)) {
    if (k === "children" || k === "key" || k === "ref" || k === "dangerouslySetInnerHTML") continue;
    if (v == null || v === false) continue;
    let name = k === "className" ? "class" : k === "htmlFor" ? "for" : k === "xlinkHref" ? "xlink:href" : k;
    if (!KEEP_CASE.has(name) && !name.includes("-")) name = kebab(name);
    if (k === "style" && typeof v === "object") {
      const s = styleText(v);
      if (s) out += ` style="${escAttr(s)}"`;
      continue;
    }
    out += v === true && !name.startsWith("aria-") && !name.startsWith("data-") ? ` ${name}` : ` ${name}="${escAttr(v)}"`;
  }
  return out;
}
function children(c, raw = false) {
  if (c == null || c === false || c === true) return "";
  if (Array.isArray(c)) return c.map((x) => children(x, raw)).join("");
  if (typeof c === "object" && c.__html !== void 0) return c.__html;
  return raw ? String(c) : typeof c === "string" && c.startsWith("\0") ? c.slice(1) : esc(c);
}
var html = (s) => "\0" + s;
function jsx(type, props = {}) {
  if (type === Fragment) return html(children(props.children));
  if (typeof type === "function") return type(props);
  if (type === "style" && props.precedence) {
    const css31 = children(props.children, true);
    styles.set(props.href, css31);
    if (collecting) collecting.add(props.href);
    return html("");
  }
  const inner = props.dangerouslySetInnerHTML ? props.dangerouslySetInnerHTML.__html : children(props.children, type === "style" || type === "script");
  return html(VOID.has(type) ? `<${type}${attrs(props)}/>` : `<${type}${attrs(props)}>${inner}</${type}>`);
}
var jsxs = jsx;
var toHTML = (node) => typeof node === "string" && node.startsWith("\0") ? node.slice(1) : children(node);

// node_modules/loading-dev/dist/chunk-UAO52LUL.js
function SpinnerStyle({
  children: children2,
  name
}) {
  return /* @__PURE__ */ jsx("style", { href: `ld-${name}`, precedence: "loading-dev", children: `${children2}
@media (prefers-reduced-motion: reduce) {
  .ld-${name},
  .ld-${name} * {
    animation: none;
  }
}
` });
}
function cssVars(vars) {
  return vars;
}
function step(index) {
  return cssVars({ [STEP_VAR]: index });
}
function spinnerRoot(name, { className, color, duration: duration2, playState, size = DEFAULT_SIZE }) {
  return {
    "aria-hidden": true,
    className: [`ld-${name}`, className].filter(Boolean).join(" "),
    style: cssVars({
      [SIZE_VAR]: `${size}px`,
      ...color === void 0 ? null : { color },
      ...duration2 === void 0 ? null : { [DURATION_VAR]: `${duration2}ms` },
      ...playState === void 0 ? null : { [PLAY_STATE_VAR]: playState }
    })
  };
}

// node_modules/loading-dev/dist/chunk-SUUR5WMA.js
var RING = [0, 1, 2, 7, null, 3, 6, 5, 4];
var PLACES = RING.filter((place) => place !== null).length;
var css = `
.ld-swirl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: calc(${SIZE} * 0.15625);
  box-sizing: border-box;
  width: ${SIZE};
  height: ${SIZE};
  padding: calc(${SIZE} * 0.0625);
}

.ld-swirl-cell {
  background: currentColor;
  border-radius: calc(${SIZE} * 0.0625);
}
${fadeCss("swirl", "cell", PLACES, { dim: 0.2, rest: 0.6 })}
`;
function Swirl(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "swirl", children: css }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("swirl", props), children: RING.map(
      (place, index) => place === null ? /* @__PURE__ */ jsx("div", {}, index) : /* @__PURE__ */ jsx("div", { className: "ld-swirl-cell", style: step(place) }, index)
    ) })
  ] });
}

// node_modules/loading-dev/dist/chunk-A2PZBHTA.js
var DEFAULT_EASING = "linear";
function spinClass(name, easing = DEFAULT_EASING) {
  const base = `ld-${name}-spin`;
  return easing === "linear" ? base : `${base} ${base}-${easing}`;
}
var ROTATE = `to {
    transform: rotate(360deg);
  }`;
function rotationCss(name, turn = ROTATE) {
  return `
.ld-${name}-spin {
  transform-origin: center;
  ${animation(name, `ld-${name}-rotate`, "linear")}
}

.ld-${name}-spin-ease-in-out {
  animation-timing-function: ease-in-out;
}

.ld-${name}-spin-stacked {
  animation-name: ld-${name}-rotate, ld-${name}-rotate;
  animation-timing-function: linear, ease-in-out;
  animation-composition: add;
}

@keyframes ld-${name}-rotate {
  ${turn}
}
`;
}

// node_modules/loading-dev/dist/chunk-JNR4T6LZ.js
var DEFAULT_CAP = "round";
function linecap(cap = DEFAULT_CAP) {
  return cap === "flat" ? "butt" : "round";
}

// node_modules/loading-dev/dist/chunk-KAZ5BTXC.js
var VIEW = 20;
var SIDE = 17.5;
var RADIUS = 4;
var PERIMETER = 4 * (SIDE - 2 * RADIUS) + 2 * Math.PI * RADIUS;
var DASH = 16;
var RECT = {
  height: SIDE,
  rx: RADIUS,
  width: SIDE,
  x: (VIEW - SIDE) / 2,
  y: (VIEW - SIDE) / 2
};
var css2 = `
.ld-trace {
  width: ${SIZE};
  height: ${SIZE};
}

${rotationCss(
  "trace",
  `to {
    stroke-dashoffset: ${-PERIMETER};
  }`
)}
`;
function Trace({ cap, easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "trace", children: css2 }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        ...spinnerRoot("trace", rest),
        fill: "none",
        role: "presentation",
        stroke: "currentColor",
        strokeWidth: "2.5",
        viewBox: `0 0 ${VIEW} ${VIEW}`,
        children: [
          /* @__PURE__ */ jsx("rect", { ...RECT, opacity: "0.2" }),
          /* @__PURE__ */ jsx(
            "rect",
            {
              ...RECT,
              className: spinClass("trace", easing),
              strokeDasharray: `${DASH} ${PERIMETER - DASH}`,
              strokeLinecap: linecap(cap)
            }
          )
        ]
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-DKYEZLIN.js
var DEFAULT_WAVE_ORIGIN = "center";
var BARS = Array.from({ length: 5 }, (_, index) => index);
var css3 = `
.ld-wave {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-wave-bar {
  width: calc(${SIZE} * 0.12);
  height: 100%;
  background: currentColor;
  border-radius: 9999px;
  ${animation("wave", "ld-wave-rise", "ease-in-out")}
  animation-delay: ${stagger("wave", BARS.length)};
}

.ld-wave-bar-bottom {
  align-self: flex-end;
}

@keyframes ld-wave-rise {
  0%,
  100% {
    height: 30%;
  }
  50% {
    height: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-wave-bar {
    height: calc((0.4 + var(${STEP_VAR}) * 0.15) * 100%);
  }
}
`;
function Wave({ origin = DEFAULT_WAVE_ORIGIN, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "wave", children: css3 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("wave", rest), children: BARS.map((index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `ld-wave-bar ld-wave-bar-${origin}`,
        style: step(index)
      },
      index
    )) })
  ] });
}

// node_modules/loading-dev/dist/chunk-LDXBT62V.js
var css4 = `
.ld-orbit {
  --ld-orbit-stroke: calc(${SIZE} * 0.0625);
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-orbit-track {
  position: absolute;
  inset: 8%;
  border-radius: 9999px;
  background: conic-gradient(from 180deg, transparent 0deg, currentColor 180deg, transparent 180deg);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--ld-orbit-stroke)), #000 0);
  mask: radial-gradient(farthest-side, transparent calc(100% - var(--ld-orbit-stroke)), #000 0);
}

.ld-orbit-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25%;
  height: 25%;
  background: currentColor;
  border-radius: 9999px;
  transform: translate(-50%, -50%);
}

${rotationCss("orbit")}
`;
function Orbit({ easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "orbit", children: css4 }),
    /* @__PURE__ */ jsxs("div", { ...spinnerRoot("orbit", rest), children: [
      /* @__PURE__ */ jsx("div", { className: "ld-orbit-dot" }),
      /* @__PURE__ */ jsx("div", { className: `ld-orbit-track ${spinClass("orbit", easing)}` })
    ] })
  ] });
}

// node_modules/loading-dev/dist/chunk-PM6DU637.js
var css5 = `
.ld-pulse {
  width: ${SIZE};
  height: ${SIZE};
}

.ld-pulse-ring {
  transform-origin: center;
  ${animation("pulse", "ld-pulse-ripple", "ease-out")}
}

@keyframes ld-pulse-ripple {
  from {
    opacity: 0.4;
    transform: scale(0.25);
  }
  to {
    opacity: 0;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-pulse-ring {
    opacity: 0.2;
  }
}
`;
function Pulse(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "pulse", children: css5 }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        ...spinnerRoot("pulse", props),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 16 16",
        children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              className: "ld-pulse-ring",
              cx: "8",
              cy: "8",
              fill: "currentColor",
              r: "8"
            }
          ),
          /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", fill: "currentColor", r: "2" })
        ]
      }
    )
  ] });
}

// src/react.js
var n = 0;
function useId() {
  return "ldv-" + (++n).toString(36);
}

// node_modules/loading-dev/dist/chunk-2OX27TAE.js
var css6 = `
.ld-radar {
  width: ${SIZE};
  height: ${SIZE};
}

${rotationCss("radar")}
`;
function Radar({ easing, ...rest }) {
  const beamGradient = useId();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "radar", children: css6 }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        ...spinnerRoot("radar", rest),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 16 16",
        children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
            "radialGradient",
            {
              cx: "8",
              cy: "8",
              gradientUnits: "userSpaceOnUse",
              id: beamGradient,
              r: "8",
              children: [
                /* @__PURE__ */ jsx("stop", { offset: "0.3334", stopColor: "currentColor" }),
                /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "currentColor", stopOpacity: "0" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", fill: "currentColor", opacity: "0.2", r: "8" }),
          /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", opacity: "0.2", r: "5.5", stroke: "currentColor" }),
          /* @__PURE__ */ jsx(
            "path",
            {
              className: spinClass("radar", easing),
              d: "M8 0C9.50657 0 10.9824 0.425672 12.2578 1.22754C13.5333 2.02953 14.557 3.17533 15.21 4.5332C15.8629 5.89107 16.1193 7.40626 15.9492 8.90332C15.7791 10.4001 15.1896 11.8184 14.249 12.9951L10.4707 9.69922C10.8037 9.21598 11 8.63123 11 8C11 6.34315 9.65685 5 8 5V0Z",
              fill: `url(#${beamGradient})`
            }
          ),
          /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", fill: "currentColor", r: "2" })
        ]
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-L2DUMHO4.js
var css7 = `
.ld-ring {
  width: ${SIZE};
  height: ${SIZE};
}

${rotationCss("ring")}
`;
function Ring({ cap, easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "ring", children: css7 }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        ...spinnerRoot("ring", rest),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 24 24",
        children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: "12",
              cy: "12",
              opacity: "0.2",
              r: "10",
              stroke: "currentColor",
              strokeWidth: "2.5"
            }
          ),
          /* @__PURE__ */ jsx(
            "circle",
            {
              className: spinClass("ring", easing),
              cx: "12",
              cy: "12",
              r: "10",
              stroke: "currentColor",
              strokeDasharray: "16 46.8",
              strokeLinecap: linecap(cap),
              strokeWidth: "2.5"
            }
          )
        ]
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-FQ2U2M7F.js
var DEFAULT_RIPPLE_DIRECTION = "out";
var RINGS = Array.from({ length: 3 }, (_, index) => index);
var css8 = `
.ld-ripple {
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-ripple-ring {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border: calc(${SIZE} * 0.08) solid currentColor;
  border-radius: 9999px;
  ${animation("ripple", "ld-ripple-spread", "ease-out")}
  animation-delay: ${stagger("ripple", RINGS.length)};
}

.ld-ripple-ring-in {
  animation-direction: reverse;
}

@keyframes ld-ripple-spread {
  from {
    opacity: 1;
    transform: scale(0);
  }
  to {
    opacity: 0;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-ripple-ring {
    opacity: 0.4;
    transform: scale(calc((var(${STEP_VAR}) + 1) / ${RINGS.length}));
  }
}
`;
function Ripple({
  direction = DEFAULT_RIPPLE_DIRECTION,
  ...rest
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "ripple", children: css8 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("ripple", rest), children: RINGS.map((index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `ld-ripple-ring ld-ripple-ring-${direction}`,
        style: step(index)
      },
      index
    )) })
  ] });
}

// node_modules/loading-dev/dist/chunk-BCIAMPLU.js
var DOT = 34;
var GAP = 20;
var MARGIN = (100 - 2 * DOT - GAP) / 2;
var FAR = `${((DOT + GAP) / DOT * 100).toFixed(1)}%`;
var RESTS = [
  `translate(${FAR}, 0)`,
  "translate(0, 0)",
  `translate(0, ${FAR})`
];
var css9 = `
.ld-slide {
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-slide-dot {
  position: absolute;
  top: ${MARGIN}%;
  left: ${MARGIN}%;
  width: ${DOT}%;
  height: ${DOT}%;
  background: currentColor;
  border-radius: 50%;
  ${animation("slide", "ld-slide-walk", "ease-in-out")}
  animation-delay: ${stagger("slide", RESTS.length)};
}

@keyframes ld-slide-walk {
  0% {
    transform: translate(${FAR}, 0);
  }
  8.33%,
  25% {
    transform: translate(${FAR}, ${FAR});
  }
  33.33%,
  50% {
    transform: translate(0, ${FAR});
  }
  58.33%,
  75% {
    transform: translate(0, 0);
  }
  83.33%,
  100% {
    transform: translate(${FAR}, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-slide-dot {
    transform: var(--ld-slide-rest);
  }
}
`;
function Slide(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "slide", children: css9 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("slide", props), children: RESTS.map((rest, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "ld-slide-dot",
        style: cssVars({ ...step(index), "--ld-slide-rest": rest })
      },
      rest
    )) })
  ] });
}

// node_modules/loading-dev/dist/chunk-UOXB5QOZ.js
var css10 = `
.ld-snake {
  width: ${SIZE};
  height: ${SIZE};
}

${rotationCss("snake")}

.ld-snake-dash {
  ${animation("snake", "ld-snake-stretch", "ease-in-out")}
}

@keyframes ld-snake-stretch {
  0% {
    stroke-dasharray: 1 100;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 45 100;
    stroke-dashoffset: -17;
  }
  100% {
    stroke-dasharray: 45 100;
    stroke-dashoffset: -62;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-snake-dash {
    stroke-dasharray: 18 100;
  }
}
`;
function Snake({ cap, easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "snake", children: css10 }),
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...spinnerRoot("snake", rest),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsx("g", { className: spinClass("snake", easing), children: /* @__PURE__ */ jsx(
          "circle",
          {
            className: "ld-snake-dash",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeLinecap: linecap(cap),
            strokeWidth: "2.5"
          }
        ) })
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-YIB63EKJ.js
var css11 = `
.ld-flip {
  width: ${SIZE};
  height: ${SIZE};
  perspective: calc(${SIZE} * 3);
}

.ld-flip-face {
  width: 64%;
  height: 64%;
  margin: 18%;
  background: currentColor;
  border-radius: calc(${SIZE} * 0.06);
  ${animation("flip", "ld-flip-turn", "ease-in-out")}
}

@keyframes ld-flip-turn {
  0% {
    transform: rotateX(0) rotateY(0);
  }
  50% {
    transform: rotateX(-180deg) rotateY(0);
  }
  100% {
    transform: rotateX(-180deg) rotateY(-180deg);
  }
}
`;
function Flip(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "flip", children: css11 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("flip", props), children: /* @__PURE__ */ jsx("div", { className: "ld-flip-face" }) })
  ] });
}

// node_modules/loading-dev/dist/chunk-JKLL7YYG.js
var BLOCKS = [
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 }
];
var GAP2 = 24;
var GAP_IN = 8;
var BLOCK = (100 - GAP2) / 2;
var PULL = `${((GAP2 - GAP_IN) / 2 / BLOCK * 100).toFixed(1)}%`;
var css12 = `
.ld-gather {
  width: ${SIZE};
  height: ${SIZE};
}

.ld-gather-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${GAP2}%;
  width: 100%;
  height: 100%;
  ${animation("gather", "ld-gather-turn", "ease-in-out")}
}

.ld-gather-block {
  background: currentColor;
  border-radius: calc(${SIZE} * 0.14);
  ${animation("gather", "ld-gather-pull", "ease-in-out")}
}

@keyframes ld-gather-pull {
  0%,
  100% {
    transform: translate(0, 0);
  }
  30%,
  60% {
    transform: translate(
      calc(var(--ld-gather-x) * ${PULL}),
      calc(var(--ld-gather-y) * ${PULL})
    );
  }
}

@keyframes ld-gather-turn {
  0%,
  30% {
    transform: rotate(0);
  }
  60%,
  100% {
    transform: rotate(90deg);
  }
}
`;
function Gather(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "gather", children: css12 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("gather", props), children: /* @__PURE__ */ jsx("div", { className: "ld-gather-group", children: BLOCKS.map(({ x, y }) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "ld-gather-block",
        style: cssVars({ "--ld-gather-x": x, "--ld-gather-y": y })
      },
      `${x}${y}`
    )) }) })
  ] });
}

// node_modules/loading-dev/dist/chunk-4O4ADYWE.js
var DOTS = Array.from({ length: 3 }, (_, index) => index);
var css13 = `
.ld-leap {
  --ld-leap-dot: round(calc(${SIZE} * 0.22), 1px);
  --ld-leap-gap: round(down, calc((${SIZE} - var(--ld-leap-dot)) / 2), 1px);
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-leap-wrapper {
  position: absolute;
  top: round(calc((${SIZE} - var(--ld-leap-dot)) / 2), 1px);
  left: calc(${SIZE} - var(--ld-leap-dot) - var(--ld-leap-gap) * 2);
  width: calc(var(--ld-leap-gap) * 2 + var(--ld-leap-dot));
  height: var(--ld-leap-dot);
  ${animation("leap", "ld-leap-hop", "ease-in-out")}
  animation-delay: ${stagger("leap", DOTS.length)};
}

.ld-leap-dot {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--ld-leap-dot);
  background: currentColor;
  border-radius: 50%;
}

@keyframes ld-leap-hop {
  0% {
    transform: translateX(0) rotate(0);
  }
  33.33% {
    transform: translateX(0) rotate(180deg);
  }
  66.66% {
    transform: translateX(calc(var(--ld-leap-gap) * -1)) rotate(180deg);
  }
  100% {
    transform: translateX(calc(var(--ld-leap-gap) * -2)) rotate(180deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-leap-wrapper {
    transform: translateX(calc(var(${STEP_VAR}) * var(--ld-leap-gap)));
  }
}
`;
function Leap(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "leap", children: css13 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("leap", props), children: DOTS.map((index) => /* @__PURE__ */ jsx("div", { className: "ld-leap-wrapper", style: step(index), children: /* @__PURE__ */ jsx("div", { className: "ld-leap-dot" }) }, index)) })
  ] });
}

// node_modules/loading-dev/dist/chunk-FWH6VWVK.js
var DOTS2 = Array.from({ length: 3 }, (_, index) => index);
var css14 = `
.ld-linear-dots {
  display: flex;
  align-items: center;
  gap: calc(${SIZE} * 0.1875);
  height: ${SIZE};
}

.ld-linear-dots-dot {
  width: calc(${SIZE} * 0.1875);
  height: calc(${SIZE} * 0.1875);
  background: currentColor;
  border-radius: 9999px;
  ${animation("linear-dots", "ld-linear-dots-fade", "linear")}
  animation-delay: ${stagger("linear-dots", DOTS2.length)};
}

@keyframes ld-linear-dots-fade {
  0% {
    opacity: 1;
  }
  66.67% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-linear-dots-dot {
    opacity: 0.75;
  }
}
`;
function LinearDots(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "linear-dots", children: css14 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("linear-dots", props), children: DOTS2.map((dot) => /* @__PURE__ */ jsx("div", { className: "ld-linear-dots-dot", style: step(dot) }, dot)) })
  ] });
}

// node_modules/loading-dev/dist/chunk-RAHAQ7XK.js
var BLOCK2 = "M0 0h1v1H0zM2 0h1v1H2zM0 2h1v1H0zM2 2h1v1H2z";
var SEGMENTS = [
  { x: 12, y: 6 },
  { x: 10, y: 10 },
  { x: 6, y: 12 },
  { x: 2, y: 10 },
  { x: 0, y: 6 },
  { x: 2, y: 2 },
  { x: 6, y: 0 },
  { x: 10, y: 2 }
];
var css15 = `
.ld-loading {
  width: ${SIZE};
  height: ${SIZE};
}

${fadeCss("loading", "segment", SEGMENTS.length, { dim: 0.2, rest: 0.6 })}
`;
function Loading(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "loading", children: css15 }),
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...spinnerRoot("loading", props),
        fill: "currentColor",
        role: "presentation",
        viewBox: "0 0 15 15",
        children: SEGMENTS.map(({ x, y }, segment) => /* @__PURE__ */ jsx(
          "path",
          {
            className: "ld-loading-segment",
            d: BLOCK2,
            style: step(segment),
            transform: `translate(${x} ${y})`
          },
          `${x}-${y}`
        ))
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-P4BSSDSY.js
var css16 = `
.ld-morph {
  width: ${SIZE};
  height: ${SIZE};
}

.ld-morph-shape {
  width: 64%;
  height: 64%;
  margin: 18%;
  background: currentColor;
  border-radius: calc(${SIZE} * 0.08);
  ${animation("morph", "ld-morph-round", "ease-in-out")}
}

@keyframes ld-morph-round {
  0% {
    border-radius: calc(${SIZE} * 0.08);
    transform: rotate(0);
  }
  50% {
    border-radius: 50%;
    transform: rotate(45deg);
  }
  100% {
    border-radius: calc(${SIZE} * 0.08);
    transform: rotate(90deg);
  }
}
`;
function Morph(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "morph", children: css16 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("morph", props), children: /* @__PURE__ */ jsx("div", { className: "ld-morph-shape" }) })
  ] });
}

// node_modules/loading-dev/dist/chunk-IJJULNRU.js
var BARS2 = Array.from({ length: 12 }, (_, index) => index);
var css17 = `
.ld-classic {
  width: ${SIZE};
  height: ${SIZE};
}

.ld-classic-inner {
  position: relative;
  top: 50%;
  left: 50%;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-classic-bar {
  position: absolute;
  top: -3.9%;
  left: -10%;
  width: 24%;
  height: 8%;
  background: currentColor;
  border-radius: 6px;
  transform: rotate(calc(var(${STEP_VAR}) * 30deg)) translate(146%);
}

${fadeCss("classic", "bar", BARS2.length, { dim: 0.15, rest: 0.5 })}
`;
function Classic(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "classic", children: css17 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("classic", props), children: /* @__PURE__ */ jsx("div", { className: "ld-classic-inner", children: BARS2.map((bar) => /* @__PURE__ */ jsx("div", { className: "ld-classic-bar", style: step(bar) }, bar)) }) })
  ] });
}

// node_modules/loading-dev/dist/chunk-2TYML5J2.js
var css18 = `
.ld-clock {
  width: ${SIZE};
  height: ${SIZE};
}

${rotationCss("clock")}
`;
function Clock({ easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "clock", children: css18 }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        ...spinnerRoot("clock", rest),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 16 16",
        children: [
          /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", fill: "currentColor", opacity: "0.1", r: "8" }),
          /* @__PURE__ */ jsx(
            "path",
            {
              className: spinClass("clock", easing),
              d: "M11.1937 2.92061C10.5206 2.49739 9.77304 2.21397 8.9954 2.08314C8.45076 1.99151 8 2.44772 8 3V7.20324C8 7.49211 8.12492 7.76686 8.34259 7.95677L11.8999 11.0603C12.3287 11.4344 12.9913 11.378 13.2643 10.8787C13.6356 10.1998 13.8736 9.45248 13.9617 8.67713C14.0892 7.55433 13.8971 6.41834 13.4074 5.39993C12.9177 4.38152 12.1503 3.5221 11.1937 2.92061Z",
              fill: "currentColor"
            }
          )
        ]
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-UXTZTFNZ.js
var css19 = `
.ld-comet {
  --ld-comet-stroke: calc(${SIZE} * 0.12);
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-comet-spin {
  position: absolute;
  inset: 0;
}

.ld-comet-tail {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: conic-gradient(from 0deg, transparent, currentColor);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--ld-comet-stroke)), #000 0);
  mask: radial-gradient(farthest-side, transparent calc(100% - var(--ld-comet-stroke)), #000 0);
}

.ld-comet-head {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--ld-comet-stroke);
  height: var(--ld-comet-stroke);
  background: currentColor;
  border-radius: 9999px;
  transform: translateX(-50%);
}

${rotationCss("comet")}
`;
function Comet({ easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "comet", children: css19 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("comet", rest), children: /* @__PURE__ */ jsxs("div", { className: spinClass("comet", easing), children: [
      /* @__PURE__ */ jsx("div", { className: "ld-comet-tail" }),
      /* @__PURE__ */ jsx("div", { className: "ld-comet-head" })
    ] }) })
  ] });
}

// node_modules/loading-dev/dist/chunk-JQNF5GYA.js
var css20 = `
.ld-compass {
  width: ${SIZE};
  height: ${SIZE};
}

.ld-compass-ticks {
  transform-origin: center;
  ${animation("compass", "ld-compass-turn", "ease-in-out")}
}

@keyframes ld-compass-turn {
  to {
    transform: rotate(90deg);
  }
}
`;
function Compass(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "compass", children: css20 }),
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...spinnerRoot("compass", props),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 16 16",
        children: /* @__PURE__ */ jsxs("g", { className: "ld-compass-ticks", fill: "currentColor", children: [
          /* @__PURE__ */ jsx("path", { d: "M7.33334 0.666667C7.33334 0.298477 7.63181 0 8 0C8.36819 0 8.66667 0.298477 8.66667 0.666667V3.33333C8.66667 3.70152 8.36819 4 8 4C7.63181 4 7.33334 3.70152 7.33334 3.33333V0.666667Z" }),
          /* @__PURE__ */ jsx("path", { d: "M12.6667 8.66667C12.2985 8.66667 12 8.3682 12 8.00001C12 7.63182 12.2985 7.33334 12.6667 7.33334H15.3333C15.7015 7.33334 16 7.63182 16 8.00001C16 8.3682 15.7015 8.66667 15.3333 8.66667H12.6667Z" }),
          /* @__PURE__ */ jsx("path", { d: "M7.33333 12.6667C7.33333 12.2985 7.63181 12 8 12C8.36819 12 8.66667 12.2985 8.66667 12.6667V15.3333C8.66667 15.7015 8.36819 16 8 16C7.63181 16 7.33333 15.7015 7.33333 15.3333V12.6667Z" }),
          /* @__PURE__ */ jsx("path", { d: "M0.666667 8.66667C0.298477 8.66667 1.60941e-08 8.3682 0 8.00001C-1.60941e-08 7.63182 0.298477 7.33334 0.666667 7.33334H3.33333C3.70152 7.33334 4 7.63182 4 8.00001C4 8.3682 3.70152 8.66667 3.33333 8.66667H0.666667Z" })
        ] })
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-5UAEBEER.js
var css21 = `
.ld-dual {
  width: ${SIZE};
  height: ${SIZE};
}

${rotationCss("dual")}

.ld-dual-inner {
  animation-direction: reverse;
}

@media (prefers-reduced-motion: reduce) {
  .ld-dual-inner {
    transform: rotate(180deg);
  }
}
`;
function Dual({ cap, easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "dual", children: css21 }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        ...spinnerRoot("dual", rest),
        fill: "none",
        role: "presentation",
        stroke: "currentColor",
        strokeLinecap: linecap(cap),
        strokeWidth: "2.5",
        viewBox: "0 0 24 24",
        children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              className: spinClass("dual", easing),
              cx: "12",
              cy: "12",
              r: "10",
              strokeDasharray: "18 44.8"
            }
          ),
          /* @__PURE__ */ jsx(
            "circle",
            {
              className: `ld-dual-inner ${spinClass("dual", easing)}`,
              cx: "12",
              cy: "12",
              r: "5.5",
              strokeDasharray: "10 24.6"
            }
          )
        ]
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-2LMGBBRJ.js
var DOTS3 = [0, 1];
var css22 = `
.ld-eclipse {
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-eclipse-dot {
  position: absolute;
  top: 30%;
  left: 30%;
  width: 40%;
  height: 40%;
  background: currentColor;
  border-radius: 50%;
  ${animation("eclipse", ["ld-eclipse-slide", "ld-eclipse-depth"], "ease-in-out")}
  animation-delay: ${stagger("eclipse", DOTS3.length)};
}

@keyframes ld-eclipse-slide {
  0%,
  100% {
    translate: 75% 0;
  }
  50% {
    translate: -75% 0;
  }
}

@keyframes ld-eclipse-depth {
  0%,
  50%,
  100% {
    opacity: 0.75;
    scale: 1;
  }
  25% {
    opacity: 1;
    scale: 1.3;
  }
  75% {
    opacity: 0.5;
    scale: 0.7;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-eclipse-dot {
    translate: calc(var(${STEP_VAR}) * 150% - 75%) 0;
  }
}
`;
function Eclipse(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "eclipse", children: css22 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("eclipse", props), children: DOTS3.map((index) => /* @__PURE__ */ jsx("div", { className: "ld-eclipse-dot", style: step(index) }, index)) })
  ] });
}

// node_modules/loading-dev/dist/chunk-MAKBZTL3.js
var css23 = `
.ld-arc {
  width: ${SIZE};
  height: ${SIZE};
}

${rotationCss("arc")}
`;
function Arc({ cap, easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "arc", children: css23 }),
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...spinnerRoot("arc", rest),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsx(
          "circle",
          {
            className: spinClass("arc", easing),
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeDasharray: "18 44.8",
            strokeLinecap: linecap(cap),
            strokeWidth: "2.5"
          }
        )
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-BAVSTTWG.js
var ORBITS = Array.from({ length: 3 }, (_, index) => index);
var TILT = 180 / ORBITS.length;
var STROKE = `calc(${SIZE} * 0.055)`;
var INNER_STROKE = `calc(${SIZE} * 0.045)`;
var css24 = `
.ld-atom {
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
}

.ld-atom-shell {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border: ${STROKE} solid currentColor;
  border-radius: 9999px;
}

.ld-atom-orbit {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotate(var(--ld-atom-tilt)) rotateX(90deg);
}

.ld-atom-ring {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border: ${INNER_STROKE} solid currentColor;
  border-radius: 9999px;
  transform: rotateX(90deg);
}

${rotationCss("atom")}

.ld-atom-spin {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation-delay: ${stagger("atom", ORBITS.length)};
}

@media (prefers-reduced-motion: reduce) {
  .ld-atom-spin {
    transform: rotate(${TILT}deg);
  }
}
`;
function Atom({ easing, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "atom", children: css24 }),
    /* @__PURE__ */ jsxs("div", { ...spinnerRoot("atom", rest), children: [
      /* @__PURE__ */ jsx("div", { className: "ld-atom-shell" }),
      ORBITS.map((index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "ld-atom-orbit",
          style: cssVars({ "--ld-atom-tilt": `${index * TILT}deg` }),
          children: /* @__PURE__ */ jsx("div", { className: spinClass("atom", easing), style: step(index), children: /* @__PURE__ */ jsx("div", { className: "ld-atom-ring" }) })
        },
        index
      ))
    ] })
  ] });
}

// node_modules/loading-dev/dist/chunk-VZX7APSS.js
var DEFAULT_BLOCKS_SWEEP = "diagonal";
var SIDE2 = 3;
var CELLS = Array.from({ length: SIDE2 * SIDE2 }, (_, index) => ({
  col: index % SIDE2,
  row: Math.floor(index / SIDE2)
}));
var SWEEPS = {
  columns: { count: SIDE2, place: ({ col }) => col },
  diagonal: { count: SIDE2 * 2 - 1, place: ({ col, row }) => row + col },
  rows: { count: SIDE2, place: ({ row }) => row }
};
var css25 = `
.ld-blocks {
  display: grid;
  grid-template-columns: repeat(${SIDE2}, 1fr);
  grid-template-rows: repeat(${SIDE2}, 1fr);
  gap: calc(${SIZE} * 0.1);
  width: ${SIZE};
  height: ${SIZE};
}

.ld-blocks-cell {
  background: currentColor;
  border-radius: calc(${SIZE} * 0.0625);
  ${animation("blocks", "ld-blocks-sweep", "ease-in-out")}
}
${Object.entries(SWEEPS).map(
  ([sweep, { count }]) => `
.ld-blocks-cell-${sweep} {
  animation-delay: ${stagger("blocks", count)};
}
`
).join("")}
@keyframes ld-blocks-sweep {
  0%,
  70%,
  100% {
    transform: scale(1);
  }
  35% {
    transform: scale(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ld-blocks-cell {
    transform: scale(0.8);
  }
}
`;
function Blocks({ sweep = DEFAULT_BLOCKS_SWEEP, ...rest }) {
  const { place } = SWEEPS[sweep];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "blocks", children: css25 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("blocks", rest), children: CELLS.map((cell) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `ld-blocks-cell ld-blocks-cell-${sweep}`,
        style: step(place(cell))
      },
      `${cell.col}-${cell.row}`
    )) })
  ] });
}

// node_modules/loading-dev/dist/chunk-ULWRXY3A.js
var DOTS4 = Array.from({ length: 3 }, (_, index) => index);
var css26 = `
.ld-bouncing-dots {
  display: flex;
  align-items: center;
  gap: calc(${SIZE} * 0.2);
  height: ${SIZE};
}

.ld-bouncing-dots-dot {
  width: calc(${SIZE} * 0.25);
  height: calc(${SIZE} * 0.25);
  background: currentColor;
  border-radius: 9999px;
  ${animation("bouncing-dots", "ld-bouncing-dots-bounce", "ease-in-out alternate")}
  animation-delay: ${stagger("bouncing-dots", DOTS4.length)};
}

@keyframes ld-bouncing-dots-bounce {
  from {
    transform: translateY(28%);
  }
  to {
    transform: translateY(-72%);
  }
}
`;
function BouncingDots(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "bouncing-dots", children: css26 }),
    /* @__PURE__ */ jsx("div", { ...spinnerRoot("bouncing-dots", props), children: DOTS4.map((dot) => /* @__PURE__ */ jsx("div", { className: "ld-bouncing-dots-dot", style: step(dot) }, dot)) })
  ] });
}

// node_modules/loading-dev/dist/chunk-KOYM24WV.js
var RADII = [10.5, 7, 3.5];
var SLOTS = 24;
var css27 = `
.ld-cascade {
  width: ${SIZE};
  height: ${SIZE};
}

.ld-cascade-arc {
  transform-origin: center;
  ${animation("cascade", "ld-cascade-turn", "cubic-bezier(0.68, -0.75, 0.265, 1.75)")}
  animation-delay: ${stagger("cascade", SLOTS)};
}

@keyframes ld-cascade-turn {
  to {
    transform: rotate(360deg);
  }
}
`;
function Cascade({ cap, ...rest }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "cascade", children: css27 }),
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...spinnerRoot("cascade", rest),
        fill: "none",
        role: "presentation",
        stroke: "currentColor",
        strokeLinecap: linecap(cap),
        strokeWidth: "2",
        viewBox: "0 0 24 24",
        children: RADII.map((r, index) => {
          const circumference = 2 * Math.PI * r;
          return /* @__PURE__ */ jsx(
            "circle",
            {
              className: "ld-cascade-arc",
              cx: "12",
              cy: "12",
              r,
              strokeDasharray: `${circumference / 4} ${circumference * 3 / 4}`,
              style: step(index)
            },
            r
          );
        })
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-3WMZVDPS.js
var DOTS5 = [
  [8, 1.5],
  [12.5962, 3.4038],
  [14.5, 8],
  [12.5962, 12.5962],
  [8, 14.5],
  [3.4038, 12.5962],
  [1.5, 8],
  [3.4038, 3.4038]
];
var css28 = `
.ld-circular-dots {
  width: ${SIZE};
  height: ${SIZE};
}

${fadeCss("circular-dots", "dot", DOTS5.length, { dim: 0.2, rest: 0.6 })}
`;
function CircularDots(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "circular-dots", children: css28 }),
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...spinnerRoot("circular-dots", props),
        fill: "currentColor",
        role: "presentation",
        viewBox: "0 0 16 16",
        children: DOTS5.map(([cx, cy], index) => /* @__PURE__ */ jsx(
          "circle",
          {
            className: "ld-circular-dots-dot",
            cx,
            cy,
            r: "1.5",
            style: step(index)
          },
          `${cx}-${cy}`
        ))
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-R5ZDKN3Z.js
var TICKS = [
  "M7.33334 0.666667C7.33334 0.298477 7.63181 0 8 0C8.36819 0 8.66667 0.298477 8.66667 0.666667V3.33333C8.66667 3.70152 8.36819 4 8 4C7.63181 4 7.33334 3.70152 7.33334 3.33333V0.666667Z",
  "M11.7712 5.17154C11.5109 5.43189 11.0888 5.43189 10.8284 5.17154C10.5681 4.91119 10.5681 4.48908 10.8284 4.22873L12.714 2.34311C12.9744 2.08276 13.3965 2.08276 13.6568 2.34311C13.9172 2.60346 13.9172 3.02557 13.6568 3.28592L11.7712 5.17154Z",
  "M12.6667 8.66667C12.2985 8.66667 12 8.36819 12 8.00001C12 7.63182 12.2985 7.33334 12.6667 7.33334H15.3333C15.7015 7.33334 16 7.63182 16 8.00001C16 8.36819 15.7015 8.66667 15.3333 8.66667H12.6667Z",
  "M10.8284 11.7713C10.5681 11.5109 10.5681 11.0888 10.8284 10.8284C11.0888 10.5681 11.5109 10.5681 11.7712 10.8284L13.6568 12.7141C13.9172 12.9744 13.9172 13.3965 13.6568 13.6569C13.3965 13.9172 12.9744 13.9172 12.714 13.6569L10.8284 11.7713Z",
  "M7.33333 12.6667C7.33333 12.2985 7.63181 12 8 12C8.36819 12 8.66667 12.2985 8.66667 12.6667V15.3333C8.66667 15.7015 8.36819 16 8 16C7.63181 16 7.33333 15.7015 7.33333 15.3333V12.6667Z",
  "M3.28594 13.6569C3.02559 13.9172 2.60348 13.9172 2.34313 13.6569C2.08278 13.3965 2.08278 12.9744 2.34313 12.714L4.22875 10.8284C4.4891 10.5681 4.91121 10.5681 5.17156 10.8284C5.43191 11.0888 5.43191 11.5109 5.17156 11.7712L3.28594 13.6569Z",
  "M0.666667 8.66667C0.298477 8.66667 1.60941e-08 8.36819 0 8.00001C-1.60941e-08 7.63182 0.298477 7.33334 0.666667 7.33334H3.33333C3.70152 7.33334 4 7.63182 4 8.00001C4 8.36819 3.70152 8.66667 3.33333 8.66667H0.666667Z",
  "M2.34315 3.28594C2.0828 3.02559 2.0828 2.60348 2.34315 2.34314C2.6035 2.08279 3.02561 2.08279 3.28596 2.34313L5.17158 4.22875C5.43193 4.4891 5.43193 4.91121 5.17158 5.17156C4.91123 5.43191 4.48912 5.43191 4.22877 5.17156L2.34315 3.28594Z"
];
var css29 = `
.ld-classic-v2 {
  width: ${SIZE};
  height: ${SIZE};
}

${fadeCss("classic-v2", "tick", TICKS.length, { dim: 0.4, rest: 0.5 })}
`;
function ClassicV2(props) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SpinnerStyle, { name: "classic-v2", children: css29 }),
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...spinnerRoot("classic-v2", props),
        fill: "none",
        role: "presentation",
        viewBox: "0 0 16 16",
        children: /* @__PURE__ */ jsx("g", { fill: "currentColor", children: TICKS.map((d, tick) => /* @__PURE__ */ jsx(
          "path",
          {
            className: "ld-classic-v2-tick",
            d,
            style: step(tick)
          },
          d
        )) })
      }
    )
  ] });
}

// node_modules/loading-dev/dist/chunk-HL7TIIDB.js
var SPINNERS = {
  arc: Arc,
  atom: Atom,
  blocks: Blocks,
  "bouncing-dots": BouncingDots,
  cascade: Cascade,
  "circular-dots": CircularDots,
  classic: Classic,
  "classic-v2": ClassicV2,
  clock: Clock,
  comet: Comet,
  compass: Compass,
  dual: Dual,
  eclipse: Eclipse,
  flip: Flip,
  gather: Gather,
  leap: Leap,
  "linear-dots": LinearDots,
  loading: Loading,
  morph: Morph,
  orbit: Orbit,
  pulse: Pulse,
  radar: Radar,
  ring: Ring,
  ripple: Ripple,
  slide: Slide,
  snake: Snake,
  swirl: Swirl,
  trace: Trace,
  wave: Wave
};

// src/index.js
var NAMES = Object.keys(SPINNERS);
var LABELS = {
  arc: "Arco",
  atom: "\xC1tomo",
  blocks: "Bloques",
  "bouncing-dots": "Puntos que rebotan",
  cascade: "Cascada",
  "circular-dots": "Puntos en c\xEDrculo",
  classic: "Cl\xE1sico",
  "classic-v2": "Cl\xE1sico v2",
  clock: "Reloj",
  comet: "Cometa",
  compass: "Br\xFAjula",
  dual: "Doble",
  eclipse: "Eclipse",
  flip: "Giro",
  gather: "Reuni\xF3n",
  leap: "Salto",
  "linear-dots": "Puntos en l\xEDnea",
  loading: "Cargando",
  morph: "Metamorfosis",
  orbit: "\xD3rbita",
  pulse: "Pulso",
  radar: "Radar",
  ring: "Anillo",
  ripple: "Ondas",
  slide: "Deslizar",
  snake: "Serpiente",
  swirl: "Remolino",
  trace: "Trazo",
  wave: "Onda"
};
var DURATIONS = { ...SPINNER_MOTION };
var VARIANTS = {
  cap: { label: "Extremos", values: ["flat", "round"], default: DEFAULT_CAP },
  easing: { label: "Movimiento", values: ["linear", "ease-in-out", "stacked"], default: DEFAULT_EASING },
  sweep: { label: "Barrido", values: ["columns", "diagonal", "rows"], default: DEFAULT_BLOCKS_SWEEP },
  direction: { label: "Direcci\xF3n", values: ["in", "out"], default: DEFAULT_RIPPLE_DIRECTION },
  origin: { label: "Origen", values: ["bottom", "center"], default: DEFAULT_WAVE_ORIGIN }
};
var DEFAULTS = Object.freeze({ size: 20, label: "Cargando" });
var BASE_CSS = ".ldv{display:inline-flex;vertical-align:middle;line-height:0}";
var COLOR = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|hsl|oklch|oklab|lab|lch)a?\([^;{}"]*\)|color-mix\([^;{}"]*\))$/i;
var clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
var escAttr2 = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function check(name) {
  if (!SPINNERS[name]) throw new Error(`loading-vanilla: no existe "${name}". Opciones: ${NAMES.join(", ")}`);
}
function toProps(name, o = {}) {
  const p = {};
  const size = Number(o.size);
  if (Number.isFinite(size) && size > 0) p.size = clamp(size, 8, 512);
  if (typeof o.color === "string" && COLOR.test(o.color.trim())) p.color = o.color.trim();
  const speed = Number(o.speed), duration2 = Number(o.duration);
  if (Number.isFinite(duration2) && duration2 > 0) p.duration = clamp(Math.round(duration2), 50, 6e4);
  else if (Number.isFinite(speed) && speed > 0 && speed !== 1) p.duration = Math.round(DURATIONS[name] / clamp(speed, 0.1, 10));
  if (o.paused === true || o.paused === "" || o.paused === "true") p.playState = "paused";
  if (typeof o.className === "string" && o.className) p.className = o.className;
  for (const [k, v] of Object.entries(VARIANTS)) if (v.values.includes(o[k])) p[k] = o[k];
  return p;
}
function render(name, options) {
  check(name);
  beginCollect();
  const markup = toHTML(jsx(SPINNERS[name], toProps(name, options)));
  const used = endCollect();
  return { html: markup, css: [...used].map(styleFor).join("\n") };
}
function html2(name, options = {}) {
  const { html: markup } = render(name, options);
  const label = options.label === void 0 ? DEFAULTS.label : options.label;
  return label === false || label === "" ? markup : `<span class="ldv" role="status" aria-label="${escAttr2(label)}">${markup}</span>`;
}
function css30(names = NAMES) {
  const list = [names].flat();
  const parts = /* @__PURE__ */ new Set([BASE_CSS]);
  for (const n2 of list) parts.add(render(n2).css);
  return [...parts].join("\n");
}
var support = /* @__PURE__ */ new Map();
function supports(name, option) {
  check(name);
  const key = name + "|" + option;
  if (!support.has(key)) {
    const v = VARIANTS[option];
    const outs = v ? v.values.map((val) => render(name, { [option]: val }).html) : [];
    support.set(key, outs.some((o) => o !== outs[0]));
  }
  return support.get(key);
}
function injectStyles(names = NAMES, doc = typeof document !== "undefined" ? document : null) {
  if (!doc) return;
  const add = (id, text) => {
    if (doc.querySelector(`style[data-ldv="${id}"]`)) return;
    const el = doc.createElement("style");
    el.dataset.ldv = id;
    el.textContent = text;
    doc.head.appendChild(el);
  };
  add("base", BASE_CSS);
  for (const n2 of [names].flat()) add(n2, render(n2).css);
}
function create(name, options) {
  injectStyles(name);
  const t = document.createElement("template");
  t.innerHTML = html2(name, options);
  return t.content.firstElementChild;
}
var ATTRS = ["type", "size", "color", "duration", "speed", "paused", "label", ...Object.keys(VARIANTS)];
function defineElement(tag = "ld-spinner") {
  if (typeof HTMLElement === "undefined" || typeof customElements === "undefined" || customElements.get(tag)) return;
  class LdSpinner extends HTMLElement {
    static get observedAttributes() {
      return ATTRS;
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }
    render() {
      const type = NAMES.includes(this.getAttribute("type")) ? this.getAttribute("type") : "ring";
      const o = {};
      for (const a of ATTRS.slice(1)) if (this.hasAttribute(a)) o[a] = this.getAttribute(a);
      injectStyles(type, this.ownerDocument);
      this.style.display = this.style.display || "inline-flex";
      this.innerHTML = html2(type, o);
    }
  }
  customElements.define(tag, LdSpinner);
}
defineElement();
export {
  DEFAULTS,
  DURATIONS,
  LABELS,
  NAMES,
  VARIANTS,
  create,
  css30 as css,
  defineElement,
  html2 as html,
  injectStyles,
  render,
  supports
};
