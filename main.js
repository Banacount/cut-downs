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
    'leaves': new Image(),
}

player_img.stance.src = "./stance-player.png";
player_img.swing.src = "./swing-player.png";
player_img.state = player_img.stance;
trees_img.treeType1.src = "./wood-1.png";
trees_img.treeType2.src = "./wood-2.png";
trees_img.branch.src = "./branch.png";
trees_img.leaves.src = "./tree-leaves.png";

// Game properties
let log_queue = new Queue();
let gameStarted = false;
let score = 0;
let control_enabled = false;
let firstClick = false;
let failed_status = "";

// Times ( for delays )
let time_elapsed = 0;
let start_delay = 3;
let job_delay = 0.6;
// Structure [Title, Delay, Offset]
const diffTimes = [
    ['DANG EASY', 1, 125],
    ['EASY', 0.7, 70],
    ['MEDIUM', 0.5, 100],
    ['HARD', 0.25, 70],
    ['ROCKSTAR', 0.15, 120],
];
let diff_time_index = 1; 
let job_delay_time = diffTimes[diff_time_index][1];

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
const playBtnRect = new Rect(20, 350, 320, 80);
const playBtn = new Button(playBtnRect, "PLAY");
const difficultyBtnRect = new Rect(20, 490, 320, 80);
const difficultyBtn = new Button(difficultyBtnRect, diffTimes[diff_time_index][0]);

// Functions
const defeat = () => {
    gameStarted = false;
    control_enabled = false;
    firstClick = false;
}
const start = () => {
    score = 0;
    start_delay = 3;
    job_delay = 2;

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
let atk_offset = 0;
let tree_offset = 0;
const update = (dt) => {
    time_elapsed += dt;

    if (!gameStarted) {
        playBtnRect.x = (screenWidth - playBtnRect.width) / 2;
        difficultyBtnRect.x = (screenWidth - playBtnRect.width) / 2;
    }

    if ((pointer_down && !initial_down) || (arr_right_rep || arr_left_rep)) {
        // Put one touched events here
        initial_down = true;
        
        // Handle button clicks or Menu logics
        if (!gameStarted) {

            if (playBtnRect.collidePoint(mouseX, mouseY)) {
                start();
                return;
            }
            if (difficultyBtnRect.collidePoint(mouseX, mouseY)) {
                if (diff_time_index <= 3) diff_time_index++;
                else diff_time_index = 0;
                job_delay_time = diffTimes[diff_time_index][1];

                return;
            }
        }
        
        // Gameplay controls
        if (!control_enabled) return;        
        firstClick = true;
        let screenCenterX = screenWidth / 2;

        // When click happens after gameStarted
        player_img.state = player_img.stance;
        if (p_x > screenCenterX || arr_right_rep){
            isPlayerRight = true;
            atk_offset = 12;
            tree_offset = 50;
        } else {
            isPlayerRight = false;
            atk_offset = 12;
            tree_offset = 50;
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
            job_delay = job_delay_time;
            console.log(job_delay_time);
        }
    }

    // Start delay
    if (gameStarted && start_delay >= 0) {
        start_delay -= dt;
        control_enabled = false;
    }
    else if (start_delay <= 0 && gameStarted) control_enabled = true;

    // Job delay
    if (gameStarted && job_delay >= 0 && start_delay <= 0) {
        job_delay -= dt;
    }
    if (job_delay <= 0){
        player_img.state = player_img.stance;
    }

    if (!pointer_down) {
        initial_down = false;
    }

    // Slide anim after atk
    if (atk_offset > 0){
        atk_offset -= (dt * 100);
    } else if (firstClick && job_delay > 0) {
        player_img.state = player_img.swing;
    }
    if (tree_offset > 0){
        tree_offset -= (dt * 60);
    }
}

// Main draw method
const draw = (dt) => {
    // Background
    ctx.fillStyle = "#82C8E5";
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    ctx.fillStyle = "#c2913a";
    ctx.fillRect(0, screenHeight * 0.94, screenWidth, screenHeight * 0.06);

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
            player_rect.x = (playerCenterX + 50) + atk_offset;

            ctx.drawImage(player_img.state, player_rect.x, player_rect.y, player_rect.width, player_rect.height);
        }
        else {
            player_rect.x = (playerCenterX - 50) - atk_offset;
            ctx.save()
            ctx.scale(-1, 1);

            ctx.drawImage(player_img.state, -player_rect.x - player_rect.width, player_rect.y, player_rect.width, player_rect.height);
            ctx.restore();
        }

        // Draw Tree
        ctx.drawImage(trees_img.leaves, ((screenWidth - 884 * 0.8) / 2), 
                                        (screenHeight - 900) + tree_offset, 
                                        884 * 0.8, 
                                        489 * 0.8);
    } 
    // Game Menu
    else {
        // Render play button
        playBtn.display(ctx);
        difficultyBtn.display(ctx, diffTimes[diff_time_index][2]);
        difficultyBtn.text = diffTimes[diff_time_index][0];

        // Difficulty text
        ctx.fillStyle = "black";
        ctx.font = "bold 25px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Difficulty:", (screenWidth/2)-100, 480);

        // Score display
        ctx.fillStyle = "black";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";

        ctx.fillText(`Score: ${score}`, (screenWidth/2), 200);

        // Status display
        ctx.fillStyle = "red";
        ctx.font = `bold ${Math.min(screenWidth * 0.06, 40)}px Arial`;
        ctx.textAlign = "center";

        ctx.fillText(failed_status, screenWidth/2, 100);
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
// keyboard control
/*
document.addEventListener('keydown', (e) => {
    if (!control_enabled) return;
    else if (e.key == 'ArrowLeft') {
        arr_left_rep = true;
    }
    else if (e.key == 'ArrowRight') {
        arr_right_rep = true;
    }
});
*/

document.addEventListener('keydown', (e) => {

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
