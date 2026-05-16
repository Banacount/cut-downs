
export class Vec2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.objId = 0;
    }
}

export class Rect {
    constructor (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.objId = 1;
    }

    collideRect (other_rect) {
        return (
            this.x < other_rect.x + other_rect.width &&
            this.x + this.width > other_rect.x &&
            this.y < other_rect.y + other_rect.height &&
            this.y + this.height > other_rect.y
        );
    }

    collidePoint (px, py) {
        return (
            px >= this.x &&               // Point is past the left edge
            px <= this.x + this.width &&  // Point is before the right edge
            py >= this.y &&               // Point is below the top edge
            py <= this.y + this.height    // Point is above the bottom edge
        );
    }
}

export class Queue {
    constructor () {
        this.list = [];
    }

    enqueue (data) {
        this.list.push(data);
    }

    dequeue () {
        if (this.list.length <= 0) return -1;
        this.list = this.list.toSpliced(0, 1)
    }

    peak () {
        if (this.list.length <= 0) return -1;
        return this.list[0];
    }
}

export class Button {
    constructor (rect_base, text) {
        this.rect = rect_base;
        this.text = text;
    }

    display (ctx) {
        ctx.fillStyle = "#c9c9c9";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 6;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        ctx.fillStyle = "black";
        ctx.font = "bold 36px Arial";
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";

        ctx.fillText(this.text, this.rect.x + 70, this.rect.y + (this.rect.height - 30));
    }
} 
