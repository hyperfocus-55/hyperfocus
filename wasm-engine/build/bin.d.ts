/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/log
 * @param s `~lib/string/String`
 */
export declare function log(s: string): void;
/**
 * assembly/index/drawRect
 * @param rect `assembly/shapes/Rect`
 */
export declare function drawRect(rect: __Internref4): void;
/**
 * assembly/index/start
 * @param canvas `assembly/canvas/Canvas`
 */
export declare function start(canvas: __Record5<undefined>): void;
/**
 * assembly/index/onEnterFrame
 * @param dt `f32`
 * @param input `assembly/input/Input`
 */
export declare function onEnterFrame(dt: number, input: __Record6<undefined>): void;
/** assembly/shapes/Rect */
declare class __Internref4 extends Number {
  private __nominal4: symbol;
  private __nominal0: symbol;
}
/** assembly/canvas/Canvas */
declare interface __Record5<TOmittable> {
}
/** assembly/input/KeyInput */
declare interface __Record7<TOmittable> {
  /** @type `bool` */
  ArrowDown: boolean | TOmittable;
  /** @type `bool` */
  ArrowUp: boolean | TOmittable;
}
/** assembly/input/MouseInput */
declare interface __Record8<TOmittable> {
  /** @type `i16` */
  x: number | TOmittable;
  /** @type `i16` */
  y: number | TOmittable;
}
/** assembly/input/Input */
declare interface __Record6<TOmittable> {
  /** @type `assembly/input/KeyInput` */
  keys: __Record7<undefined>;
  /** @type `assembly/input/MouseInput` */
  mouse: __Record8<undefined>;
}
