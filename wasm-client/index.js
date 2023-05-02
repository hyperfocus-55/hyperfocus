import input from '@hyperfocus/wasm-client/input.js';
import * as WasmInterface from '@hyperfocus/wasm-engine/build/bin.js';
// import * as require from 'requirejs';
// console.log(require());
// require.config({
//   baseUrl: 'js/lib',
  // paths: {
  //     // the left side is the module ID,
  //     // the right side is the path to
  //     // the jQuery file, relative to baseUrl.
  //     // Also, the path should NOT include
  //     // the '.js' file extension. This example
  //     // is using jQuery 1.9.0 located at
  //     // js/lib/jquery-1.9.0.js, relative to
  //     // the HTML page.
  //     // jquery: 'jquery-1.9.0'
  // }
// });
// window.require = require;
// import * as Buffer from 'buffer';
// window.require = require;

// console.log(Buffer);
// require('buffer');
console.log(WasmInterface)

export const buildClient = async (options = {fps: 60}) => {
  const client = document.createElement('div');
  client.innerHTML = `<canvas width=1920 height=1080 class='main-client'/>`
  options.context =  client.querySelector('canvas').getContext('2d');
  options.context.fillStyle = 'red;'
  options.canvas = {
    drawRect: r => console.log('drawingRect', r) || options.context.fillRect(r.x, r.y, r.h, r.w)
  };
  const css = document.createElement('link');
  css.href='@hyperfocus/wasm-client/client.css';
  css.rel='stylesheet';
  css.type='text/css';
  document.body.appendChild(client);
  (document.head||document.documentElement).appendChild(css);
  options.fps = 1000 / options.fps
  start(options);
}

export const start = async (options) => {
  const wasm = await loadWasm(options.canvas);
  wasm.start(options.canvas);
  
  // const imageData = ctx.createImageData(1920, 1080);
  // const argb = new Uint32Array(imageData.data.buffer);
  
  startOnEnterFrame({wasm, options});
}

export const loadWasm = async (canvas, file = '@hyperfocus/wasm-engine/build/bin.wasm') => {
  const wasm = await WebAssembly
    .instantiateStreaming(fetch(file), {
      env: {
        memory: new WebAssembly.Memory({initial: 1, maximum: 1000, shared: false}),
        abort: (_msg, _file, line, column) =>
            console.error(`Abort at ${line}:${column}`),
        'console.log': n => console.log(n),
        ...canvas
      }});
    return wasm.instance.exports;
}

// function readFromWasmMem(wasm, offset, length) {
//   const wasmMem = wasm.exports.memory;
//   return new Uint8Array(Buffer.from(wasmMem.buffer, offset, length));
// }


const startOnEnterFrame = ({wasm, options}) => {
  let nextFrame = 0;
  const onEnterFrame = () => {
    const now = Date.now();
    if(now < nextFrame) {
      requestAnimationFrame(onEnterFrame);
      return
    }
    options.context.clearRect(0, 0, 1920, 1080);
    const dt = nextFrame - now || 0;
    nextFrame = now + options.fps
    wasm.onEnterFrame(dt, input);
    requestAnimationFrame(onEnterFrame);
  }
  onEnterFrame();
}

function liftString(memory, pointer) {
  if (!pointer) return null;
  const
    end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
    memoryU16 = new Uint16Array(memory.buffer);
  let
    start = pointer >>> 1,
    string = "";
  while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
  return string + String.fromCharCode(...memoryU16.subarray(start, end));
}