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
      "console.log"(str) {
        // assembly/index/log(~lib/string/String) => void
        str = __liftString(str >>> 0);
        console.log(str);
      },
      "draw.rect"(rect) {
        // assembly/index/drawRect(assembly/shapes/Rect) => void
        rect = __liftRecord4(rect >>> 0);
        draw.rect(rect);
      },
      "draw.text"(x, y, str, color) {
        // assembly/index/drawText(i16, i16, ~lib/string/String, ~lib/string/String | null) => void
        str = __liftString(str >>> 0);
        color = __liftString(color >>> 0);
        draw.text(x, y, str, color);
      },
      seed() {
        // ~lib/builtins/seed() => f64
        return (() => {
          // @external.js
          return Date.now() * Math.random();
        })();
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    log(str) {
      // assembly/index/log(~lib/string/String) => void
      str = __lowerString(str) || __notnull();
      exports.log(str);
    },
    drawRect(rect) {
      // assembly/index/drawRect(assembly/shapes/Rect) => void
      rect = __lowerRecord4(rect) || __notnull();
      exports.drawRect(rect);
    },
    drawText(x, y, str, color) {
      // assembly/index/drawText(i16, i16, ~lib/string/String, ~lib/string/String | null) => void
      str = __retain(__lowerString(str) || __notnull());
      color = __lowerString(color);
      try {
        exports.drawText(x, y, str, color);
      } finally {
        __release(str);
      }
    },
    onEnterFrame(dt, input) {
      // assembly/index/onEnterFrame(f32, assembly/input/Input) => void
      input = __lowerRecord5(input) || __notnull();
      exports.onEnterFrame(dt, input);
    },
  }, exports);
  function __liftRecord4(pointer) {
    // assembly/shapes/Rect
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      x: __getF32(pointer + 0),
      y: __getF32(pointer + 4),
      h: __getF32(pointer + 8),
      w: __getF32(pointer + 12),
      color: __liftString(__getU32(pointer + 16)),
    };
  }
  function __lowerRecord4(value) {
    // assembly/shapes/Rect
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(20, 4));
    __setF32(pointer + 0, value.x);
    __setF32(pointer + 4, value.y);
    __setF32(pointer + 8, value.h);
    __setF32(pointer + 12, value.w);
    __setU32(pointer + 16, __lowerString(value.color) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __lowerRecord6(value) {
    // assembly/input/KeyInput
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(2, 6));
    __setU8(pointer + 0, value.ArrowDown ? 1 : 0);
    __setU8(pointer + 1, value.ArrowUp ? 1 : 0);
    exports.__unpin(pointer);
    return pointer;
  }
  function __lowerRecord7(value) {
    // assembly/input/MouseInput
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(4, 7));
    __setU16(pointer + 0, value.x);
    __setU16(pointer + 2, value.y);
    exports.__unpin(pointer);
    return pointer;
  }
  function __lowerRecord5(value) {
    // assembly/input/Input
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(8, 5));
    __setU32(pointer + 0, __lowerRecord6(value.keys) || __notnull());
    __setU32(pointer + 4, __lowerRecord7(value.mouse) || __notnull());
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
  function __setF32(pointer, value) {
    try {
      __dataview.setFloat32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setFloat32(pointer, value, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  function __getF32(pointer) {
    try {
      return __dataview.getFloat32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getFloat32(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  log,
  drawRect,
  drawText,
  start,
  onEnterFrame,
} = await (async url => instantiate(
  await (async () => {
    try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
    catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
  })(), {
  }
))(new URL("bin.wasm", import.meta.url));
