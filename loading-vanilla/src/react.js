// Lo único de "react" que usan los spinners: useId, para identificar un degradado SVG.
let n = 0;
export function useId() { return 'ldv-' + (++n).toString(36); }
export default { useId };
