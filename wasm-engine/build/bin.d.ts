/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/log
 * @param str `~lib/string/String`
 */
export declare function log(str: string): void;
/**
 * assembly/index/drawRect
 * @param rect `assembly/shapes/Rect`
 */
export declare function drawRect(rect: __Record4<undefined>): void;
/**
 * assembly/index/drawText
 * @param x `i16`
 * @param y `i16`
 * @param str `~lib/string/String`
 * @param color `~lib/string/String | null`
 */
export declare function drawText(x: number, y: number, str: string, color: string | null): void;
/**
 * assembly/index/start
 */
export declare function start(): void;
/**
 * assembly/index/onEnterFrame
 * @param dt `f32`
 * @param input `assembly/input/Input`
 */
export declare function onEnterFrame(dt: number, input: __Record5<undefined>): void;
/** assembly/shapes/Rect */
declare interface __Record4<TOmittable> {
  /** @type `f32` */
  x: number | TOmittable;
  /** @type `f32` */
  y: number | TOmittable;
  /** @type `f32` */
  h: number | TOmittable;
  /** @type `f32` */
  w: number | TOmittable;
  /** @type `~lib/string/String` */
  color: string;
}
/** assembly/input/KeyInput */
declare interface __Record6<TOmittable> {
  /** @type `bool` */
  ArrowDown: boolean | TOmittable;
  /** @type `bool` */
  ArrowUp: boolean | TOmittable;
}
/** assembly/input/MouseInput */
declare interface __Record7<TOmittable> {
  /** @type `i16` */
  x: number | TOmittable;
  /** @type `i16` */
  y: number | TOmittable;
}
/** assembly/input/Input */
declare interface __Record5<TOmittable> {
  /** @type `assembly/input/KeyInput` */
  keys: __Record6<undefined>;
  /** @type `assembly/input/MouseInput` */
  mouse: __Record7<undefined>;
}
