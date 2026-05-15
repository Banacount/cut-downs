
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
