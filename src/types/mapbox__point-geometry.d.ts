// Shim for @types/mapbox__point-geometry stub (deprecated, no .d.ts)
declare module '@mapbox/point-geometry' {
  export default class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
  }
}
