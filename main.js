import { Vec2, Rect, Queue, Button } from "./class.js";

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
let gameStarted = false;
let score = 0;
let control_enabled = false;
let failed_status = "";

// Times ( for delays )
let time_elapsed = 0;
let start_delay = 3;
let job_delay = 0.6;

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

// Menu state
const playBtnRect = new Rect(20, 500, 320, 80);
const playBtn = new Button(playBtnRect, "PLAY");

// Functions
const defeat = () => {
    gameStarted = false;
}
const start = () => {
    score = 0;
    start_delay = 3;
    job_delay = 0.6;

    log_queue.list = [];
    for (let i = 0; i < log_size; i++) {
        if (i > 0) log_queue.enqueue(Math.floor(Math.random() * 2));
        else log_queue.enqueue(1);
    }

    player_img.state = player_img.stance;
    isPlayerRight = false;
    gameStarted = true;

}

// Main update method
const update = (dt) => {
    time_elapsed += dt;

    if (!gameStarted) {
        playBtnRect.x = (screenWidth - playBtnRect.width) / 2;
    }

    if (pointer_down && !initial_down) {
        // Put one touched events here
        initial_down = true;
        
        // Handle button clicks
        if (!gameStarted) {

            if (playBtnRect.collidePoint(mouseX, mouseY)) {
                start();
                return;
            }
        }
        
        // Gameplay controls
        if (!control_enabled) return;        
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
        if (log_queue.peak() == 1 && isPlayerRight) {
            defeat();
            failed_status = "You got hit by trunk! tough luck."
        }
        else if (log_queue.peak() == 0 && !isPlayerRight) {
            defeat();
            failed_status = "You got hit by trunk! tough luck."
        }
        else if (job_delay <= 0){
            defeat();
            failed_status = "Too slow. You're fired!"
        }
        else {
            score++;
            job_delay = 2;
        }
    }

    // Start delay
    if (gameStarted && start_delay >= 0) {
        start_delay -= dt;
        control_enabled = false;
    }
    else if (start_delay <= 0) control_enabled = true;

    // Job delay
    if (gameStarted && job_delay >= 0 && start_delay <= 0) {
        job_delay -= dt;
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

    if (gameStarted) {
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
                ctx.drawImage(trees_img.branch, logCenterX+20, logBottomY, 143.6, 79.2); ctx.drawImage(trees_img.treeType1, logCenterX, logBottomY, log_rect.width, log_rect.height);
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
            ctx.save()
            ctx.scale(-1, 1);

            ctx.drawImage(player_img.state, -player_rect.x - player_rect.width, player_rect.y, player_rect.width, player_rect.height);
            ctx.restore();
        }
    } 
    // Game Menu
    else {
        // Render play button
        playBtn.display(ctx);

        // Score display
        ctx.fillStyle = "black";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";

        ctx.fillText(`Score: ${score}`, screenWidth/2, 400);

        ctx.fillStyle = "red";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";

        ctx.fillText(failed_status, screenWidth/2, 700);
    }

    if (start_delay >= 0 && gameStarted) {
        ctx.fillStyle = "red";
        ctx.font = "bold 120px Arial";
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.trunc(start_delay) + 1}`, screenWidth/2, screenHeight/2);
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
