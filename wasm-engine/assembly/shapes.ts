export class Rect {
    x: f32 = 0;
    y: f32 = 0;
    h: f32 = 0;
    w: f32 = 0;
    color: string = '';
    // constructor(x:f32, y:f32, w:f32, h:f32, color: string) {
    //     this.x = x;
    //     this.y = y;
    //     this.w = w;
    //     this.h = h;
    //     if(color){
    //         this.color = color;
    //     }
    // }
    toString(): string {
        return `${this.x} ${this.y} ${this.w} ${this.h} ${this.color && `color: ${this.color}`}`
    }
}