import { Vec2, Rect, Queue } from "./class.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// Game properties
let log_queue = new Queue();

// Times ( for delays )

// Controls properties
let screenWidth = 500, screenHeight = 500;
let mouseX = 0, mouseY = 0;
let pointer_down = false;
let initial_down = false;

// General variables
let p_x = 0, p_y = 0;
let lastTime = 0;

let log_rect = new Rect(0, 0, 50, 100);
let log_size = 7;
// Player properties
let player_rect = new Rect(0, 0, 80, 60);
let isPlayerRight = false;

// Main update method
const update = (dt) => {
    if (pointer_down && !initial_down) {
        // Put one touched events here
        
        let screenCenterX = screenWidth / 2;

        if (p_x > screenCenterX){
            isPlayerRight = true;
        } else {
            isPlayerRight = false;
        }
        log_queue.enqueue(Math.floor(Math.random() * 2));
        log_queue.dequeue();
        console.log(log_queue.list)

        initial_down = true;
    }

    if (!pointer_down) {
        initial_down = false;
    }
}

// Main draw method
const draw = (dt) => {
    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    ctx.fillStyle = "red";
    let logCenterX = (screenWidth-log_rect.width) / 2;

    for (let i = 0; i < log_size; i++) {
        if (log_queue.list[i] == 1) ctx.fillStyle = "red";
        else ctx.fillStyle = "blue";

        let logBottomY = (screenHeight - (log_rect.height * i)) - log_rect.height;
        ctx.fillRect(logCenterX, logBottomY, log_rect.width, log_rect.height);
    }

    let playerCenterX = (screenWidth-player_rect.width) / 2;

    if (isPlayerRight) player_rect.x = playerCenterX + 50;
    else player_rect.x = playerCenterX - 50;

    player_rect.y = screenHeight - player_rect.height;

    ctx.fillStyle = "green";
    ctx.fillRect(player_rect.x, player_rect.y, player_rect.width, player_rect.height);
}

const loop = (timestamp) => {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt);
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop)

// Pointer events
// down
canvas.addEventListener("pointerdown", (e) => {
    mouseX = e.clientX, mouseY = e.clientY;
    pointer_down = true;

    p_x = mouseX;
    p_y = mouseY;
});
// up
canvas.addEventListener("pointerup", (e) => {
    mouseX = e.clientX, mouseY = e.clientY;
    pointer_down = false;
});
// down
canvas.addEventListener("pointermove", (e) => {
    mouseX = e.clientX, mouseY = e.clientY;
});
//key
window.addEventListener("keyup", (e) => {
});

// Resize screen
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Initializing objects
for (let i = 0; i < log_size; i++) {
    log_queue.enqueue(Math.floor(Math.random() * 2));
}


console.log(log_queue.list);
