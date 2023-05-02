export default class Input {
    keys: KeyInput = new KeyInput;
    mouse: MouseInput = new MouseInput;
}

class KeyInput {
    ArrowDown: bool = false;
    ArrowUp: bool = false;
}

class MouseInput {
    x: i16 = 0;
    y: i16 = 0;
}