const input = {
    mouse: {},
    keys: {}
};
export default input;

document.body.addEventListener('mousemove', e => {
    input.mouse.x = e.target.clientX * 1920 / document.body.clientWidth;
    input.mouse.y = e.target.clientY * 1080 / document.body.clientHeight;
});

document.body.addEventListener('keydown', e => input.keys[e.key] = true);
document.body.addEventListener('keyup', e => input.keys[e.key] = false);