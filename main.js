import { Vec2, Rect, Queue } from "./class.js";

/*
Gregg: Explain the main concept and mechanics of the game.
Lavern: Explain how the algorithm works and how it is applied. Maybe mention some real life usage.
Valmoria: Explain how the algorithm is implemented in game and further dive in to the code.
*/

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// Assets
const player_img = {
    'stance': new Image(),
    'swing': new Image(),
    'state': null,
}
const trees_img = {
    'treeType1': new Image(),
    'treeType2': new Image(),
    'branch': new Image(),
}

player_img.stance.src = "./stance-player.png";
player_img.swing.src = "./swing-player.png";
player_img.state = player_img.stance;
trees_img.treeType1.src = "./wood-1.png";
trees_img.treeType2.src = "./wood-2.png";
trees_img.branch.src = "./branch.png";

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
let player_rect = new Rect(0, 0, 120, 100);
let isPlayerRight = false;

// Main update method
const update = (dt) => {
    if (pointer_down && !initial_down) {
        // Put one touched events here
        
        let screenCenterX = screenWidth / 2;

        player_img.state = player_img.swing;
        if (p_x > screenCenterX){
            isPlayerRight = true;
        } else {
            isPlayerRight = false;
        }
        log_queue.enqueue(Math.floor(Math.random() * 2));
        log_queue.dequeue();
        
        // Detect if player got hit
        if (log_queue.peak() == 1 && isPlayerRight) console.log("Supposed defeat.");
        else if (log_queue.peak() == 0 && !isPlayerRight) console.log("Supposed defeat.");

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
    // Calculate the center of logs in screen
    let logCenterX = (screenWidth-log_rect.width) / 2;

    // Load the logs and their rects
    for (let i = 0; i < log_size; i++) {
        // ( Optional ) to show the order of the logs for debugging.
        //if (log_queue.list[i] == 1) ctx.fillStyle = "red";
        //else ctx.fillStyle = "blue";

        let logBottomY = (screenHeight - (log_rect.height * i)) - log_rect.height;
        //ctx.fillRect(logCenterX, logBottomY, log_rect.width, log_rect.height);

        if (log_queue.list[i] == 1){
            ctx.drawImage(trees_img.branch, logCenterX+20, logBottomY, 143.6, 79.2);
            ctx.drawImage(trees_img.treeType1, logCenterX, logBottomY, log_rect.width, log_rect.height);
        }
        else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(trees_img.branch, -((logCenterX-log_rect.width) - 60) - 143.6, logBottomY, 143.6, 79.2);
            ctx.restore();

            ctx.drawImage(trees_img.treeType2, logCenterX, logBottomY, log_rect.width, log_rect.height);
        }
    }

    // Calculate the center of X and add a lil bit of offset from the center.
    let playerCenterX = (screenWidth-player_rect.width) / 2;

    // Player at the bottom
    player_rect.y = screenHeight - player_rect.height;

    // Draw player stuffs
    // Set the offset depending on the 'isPlayerRight' variable.
    if (isPlayerRight) {
        player_rect.x = playerCenterX + 50;

        ctx.drawImage(player_img.state, player_rect.x, player_rect.y, player_rect.width, player_rect.height);
    }
    else {
        player_rect.x = playerCenterX - 50;
        ctx.save();
        ctx.scale(-1, 1);

        ctx.drawImage(player_img.state, -player_rect.x - player_rect.width, player_rect.y, player_rect.width, player_rect.height);
        ctx.restore();
    }
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
    if (i > 0) log_queue.enqueue(Math.floor(Math.random() * 2));
    else log_queue.enqueue(1);
}


console.log(log_queue.list);
