async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      "console.log"(s) {
        // assembly/index/log(~lib/string/String) => void
        s = __liftString(s >>> 0);
        console.log(s);
      },
      drawRect(rect) {
        // assembly/index/drawRect(assembly/shapes/Rect) => void
        rect = __liftInternref(rect >>> 0);
        drawRect(rect);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    log(s) {
      // assembly/index/log(~lib/string/String) => void
      s = __lowerString(s) || __notnull();
      exports.log(s);
    },
    drawRect(rect) {
      // assembly/index/drawRect(assembly/shapes/Rect) => void
      rect = __lowerInternref(rect) || __notnull();
      exports.drawRect(rect);
    },
    start(canvas) {
      // assembly/index/start(assembly/canvas/Canvas) => void
      canvas = __lowerRecord5(canvas) || __notnull();
      exports.start(canvas);
    },
    onEnterFrame(dt, input) {
      // assembly/index/onEnterFrame(f32, assembly/input/Input) => void
      input = __lowerRecord6(input) || __notnull();
      exports.onEnterFrame(dt, input);
    },
  }, exports);
  function __lowerRecord5(value) {
    // assembly/canvas/Canvas
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(0, 5));
    exports.__unpin(pointer);
    return pointer;
  }
  function __lowerRecord7(value) {
    // assembly/input/KeyInput
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(2, 7));
    __setU8(pointer + 0, value.ArrowDown ? 1 : 0);
    __setU8(pointer + 1, value.ArrowUp ? 1 : 0);
    exports.__unpin(pointer);
    return pointer;
  }
  function __lowerRecord8(value) {
    // assembly/input/MouseInput
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(4, 8));
    __setU16(pointer + 0, value.x);
    __setU16(pointer + 2, value.y);
    exports.__unpin(pointer);
    return pointer;
  }
  function __lowerRecord6(value) {
    // assembly/input/Input
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(8, 6));
    __setU32(pointer + 0, __lowerRecord7(value.keys) || __notnull());
    __setU32(pointer + 4, __lowerRecord8(value.mouse) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftString(pointer) {
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
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length,
      pointer = exports.__new(length << 1, 2) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  class Internref extends Number {}
  const registry = new FinalizationRegistry(__release);
  function __liftInternref(pointer) {
    if (!pointer) return null;
    const sentinel = new Internref(__retain(pointer));
    registry.register(sentinel, pointer);
    return sentinel;
  }
  function __lowerInternref(value) {
    if (value == null) return 0;
    if (value instanceof Internref) return value.valueOf();
    throw TypeError("internref expected");
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU8(pointer, value) {
    try {
      __dataview.setUint8(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint8(pointer, value, true);
    }
  }
  function __setU16(pointer, value) {
    try {
      __dataview.setUint16(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint16(pointer, value, true);
    }
  }
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  log,
  drawRect,
  start,
  onEnterFrame,
} = await (async url => instantiate(
  await (async () => {
    try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
    catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
  })(), {
  }
))(new URL("bin.wasm", import.meta.url));
