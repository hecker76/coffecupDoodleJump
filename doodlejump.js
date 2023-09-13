// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// doodle guy
let doodleWidth = 46;
let doodleHeight = 46;
let doodleX = boardWidth/2 - doodleWidth/2
let doodleY = boardHeight*7/8 - doodleHeight
let doodleRight;
let doodleLeft;

let doodler = {
    img : null,
    x : doodleX,
    y : doodleY,
    width : doodleWidth,
    height : doodleHeight
}

// game
let velocityX = 0;
let velocityY = 0;
let initvelY = -6; // start velY
let gravity = 0.4;


//platforms
let platformArray = [];
let platWidth = 60;
let platHeight = 18;
let platimg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d") // draws stuff

    // draw the doodler
    //context.fillStyle = "green"
    //context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

    // load img
    doodleRight = new Image();
    doodleRight.src = "./doodler-right.png";
    doodler.img = doodleRight;
    doodleRight.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodleLeft = new Image();
    doodleLeft.src = "./doodler-left.png";

    platimg = new Image();
    platimg.src = "./platform.png"

    velocityY = initvelY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // draw plats
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initvelY;
        }
        if (collisions(doodler, platform) && velocityY >= 0) {
            velocityY = initvelY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear plats
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();
        newPlats();
    }

    // score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("You Fell! Press 'space' to restart", boardWidth/7, boardHeight*7/8)
    }

}

function moveDoodler(e) {
    if (e.code === "ArrowRight" || e.code === "KeyD") { // right
        velocityX = 5;
        doodler.img = doodleRight;
    }
    else if (e.code === "ArrowLeft" || e.code === "KeyA") { // left
        velocityX = -5;
        doodler.img = doodleLeft;
    }
    else if (e.code === "Space" && gameOver) {
        //reset
        doodler = {
            img : doodleRight,
            x : doodleX,
            y : doodleY,
            width : doodleWidth,
            height : doodleHeight
        }

        velocityX = 0;
        velocityY = initvelY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    // start plats
    let platform = {
        img : platimg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platWidth,
        height : platHeight
    }

    platformArray.push(platform);

//    platform = {
//         img : platimg,
//         x : boardWidth/2,
//         y : boardHeight - 150,
//         width : platWidth,
//         height : platHeight
//     }
//
//     platformArray.push(platform);
//     platform = {
//         img : platimg,
//         x : boardWidth/2,
//         y : boardHeight - 250,
//         width : platWidth,
//         height : platHeight
//     }
//
//     platformArray.push(platform);

    for(let i =0; i<6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            img : platimg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platWidth,
            height : platHeight
        }

        platformArray.push(platform);
    }
}

function newPlats() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platimg,
        x : randomX,
        y : -platHeight,
        width : platWidth,
        height : platHeight
    }

    platformArray.push(platform);
}

function collisions(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function updateScore() {
    let points = Math.floor(50*Math.random());
    if (velocityY < 0) {
        maxScore += points;
        if (score < maxScore) {
            score = maxScore
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}