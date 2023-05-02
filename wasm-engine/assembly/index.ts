// The entry file of your WebAssembly module.
import Canvas from './canvas';
import Input from './input';
import { Rect } from './shapes';

@external("env", "console.log")
export declare function log(s: string): void;
@external("env", "drawRect")
export declare function drawRect(rect: Rect): void;

// let CANVAS: Canvas = new Canvas;
const RECT: Rect = new Rect();
RECT.x = 50;
RECT.y = 50;
RECT.w = 100;
RECT.h = 50;

export function start(canvas: Canvas): void {
  log("starting the game!");
}

export function onEnterFrame(dt: f32, input: Input): void {
  drawRect(RECT);
}
