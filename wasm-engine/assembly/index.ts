// The entry file of your WebAssembly module.
import Canvas from './canvas';
import Input from './input';
import { Rect } from './shapes';

@external("env", "console.log")
export declare function log(str: string): void;
@external("env", "draw.rect")
export declare function drawRect(rect: Rect): void;
// @external("env", "draw.text")
// export declare function drawText(x: i16, y: i16, str: string): void
@external("env", "draw.text")
export declare function drawText(x: i16, y: i16, str: string, color: string | null): void

// let CANVAS: Canvas = new Canvas;
const RECT: Rect = new Rect();
RECT.x = 50;
RECT.y = 50;
RECT.w = 100;
RECT.h = 50;
RECT.color = 'red';

export function start(): void {
  log("starting the game!");
}

export function onEnterFrame(dt: f32, input: Input): void {
  // log(dt.toString() + ' ' + RECT.toString());
  drawText(20, 40, `${(Math.round(100000 / dt) * .01).toString().slice(0, 5)} fps`, "darkgreen");
  RECT.x = (f32)(RECT.x + Math.random() * 10 * dt) % 1920
  drawRect(RECT);
}
