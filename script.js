const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const box = 20;
const canvasSize = 400;

let snake;
let food;
let direction;
let nextDirection;

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;

let gameRunning = false;
let gameLoop;

highScoreText.textContent = highScore;


// Bắt đầu game
startBtn.addEventListener("click", startGame);

function startGame() {

    clearInterval(gameLoop);

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "right";
    nextDirection = "right";

    score = 0;
    scoreText.textContent = score;

    createFood();

    gameRunning = true;

    message.textContent = "Ăn mồi để tăng điểm!";

    startBtn.textContent = "🔄 CHƠI LẠI";

    gameLoop = setInterval(updateGame, 120);
}


// Tạo thức ăn
function createFood() {

    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };

    // Không để thức ăn xuất hiện trên thân rắn
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            createFood();
            return;
        }
    }
}


// Điều khiển
document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp") {
        changeDirection("up");
    }

    if (event.key === "ArrowDown") {
        changeDirection("down");
    }

    if (event.key === "ArrowLeft") {
        changeDirection("left");
    }

    if (event.key === "ArrowRight") {
        changeDirection("right");
    }
});


function changeDirection(newDirection) {

    if (!gameRunning) return;

    // Không cho rắn quay đầu 180 độ
    if (
        newDirection === "up" &&
        direction !== "down"
    ) {
        nextDirection = "up";
    }

    if (
        newDirection === "down" &&
        direction !== "up"
    ) {
        nextDirection = "down";
    }

    if (
        newDirection === "left" &&
        direction !== "right"
    ) {
        nextDirection = "left";
    }

    if (
        newDirection === "right" &&
        direction !== "left"
    ) {
        nextDirection = "right";
    }
}


// Game chính
function updateGame() {

    direction = nextDirection;

    const head = {
        x: snake[0].x,
        y: snake[0].y
    };


    // Di chuyển
    if (direction === "up") {
        head.y -= box;
    }

    if (direction === "down") {
        head.y += box;
    }

    if (direction === "left") {
        head.x -= box;
    }

    if (direction === "right") {
        head.x += box;
    }


    // Kiểm tra đâm tường
    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize
    ) {
        gameOver();
        return;
    }


    // Kiểm tra đâm vào thân
    for (let part of snake) {

        if (
            head.x === part.x &&
            head.y === part.y
        ) {
            gameOver();
            return;
        }
    }


    snake.unshift(head);


    // Ăn thức ăn
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        scoreText.textContent = score;

        if (score > highScore) {
            highScore = score;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );

            highScoreText.textContent = highScore;
        }

        createFood();

    } else {

        snake.pop();

    }


    drawGame();
}


// Vẽ game
function drawGame() {

    // Xóa màn hình
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Vẽ lưới
    ctx.strokeStyle = "#151515";

    for (let i = 0; i < canvasSize; i += box) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
    }


    // Vẽ thức ăn
    ctx.fillStyle = "#ff304f";

    ctx.beginPath();

    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Vẽ rắn
    snake.forEach((part, index) => {

        if (index === 0) {
            ctx.fillStyle = "#7cff00";
        } else {
            ctx.fillStyle = "#22c55e";
        }

        ctx.fillRect(
            part.x + 1,
            part.y + 1,
            box - 2,
            box - 2
        );
    });


    // Mắt rắn
    const head = snake[0];

    ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.arc(
        head.x + 6,
        head.y + 6,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        head.x + 14,
        head.y + 6,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// Game Over
function gameOver() {

    clearInterval(gameLoop);

    gameRunning = false;

    message.textContent =
        "💀 Game Over! Điểm của bạn: " + score;

    startBtn.textContent = "🔄 CHƠI LẠI";

    drawGame();

    // Hiển thị chữ Game Over
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "#ff4055";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvasSize / 2,
        canvasSize / 2
    );

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        "Điểm: " + score,
        canvasSize / 2,
        canvasSize / 2 + 40
    );
}


// Vẽ màn hình ban đầu
function initialScreen() {

    ctx.fillStyle = "#0b0b0b";

    ctx.fillRect(
        0,
        0,
        canvasSize,
        canvasSize
    );

    ctx.fillStyle = "#4cff72";

    ctx.font = "bold 28px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "🐍 RẮN SĂN MỒI",
        canvasSize / 2,
        canvasSize / 2 - 10
    );

    ctx.fillStyle = "#aaa";

    ctx.font = "16px Arial";

    ctx.fillText(
        "Nhấn BẮT ĐẦU để chơi",
        canvasSize / 2,
        canvasSize / 2 + 30
    );
}

initialScreen();