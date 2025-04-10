let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = (tileSize * columns) / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};

let shipImage;
let shipVelocityX = tileSize;

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;

let alienImage;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVeloCityX = 1;

//bulltes
let bulletArray = [];
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  //   context.fillStyle = "green";
  //   context.fillRect(ship.x, ship.y, ship.width, ship.height);
  shipImage = new Image();
  shipImage.src = "./ship.png";
  shipImage.onload = function () {
    context.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
  };

  alienImage = new Image();
  alienImage.src = "./alien.png";

  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shoot);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
  //aliens
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVeloCityX;

      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVeloCityX *= -1;
        alien.x += alienVeloCityX * 2;
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }

      context.drawImage(alienImage, alien.x, alien.y, alien.width, alien.height);
      if (alien.y >= ship.y) {
        context.fillStyle = "red";
        context.font = "25px arial";
        context.fillText("Game Over", 200, 200);
        context.fillText(`Your final score is ${score}`, 300, 200);
        gameOver = true;
      }
    }
  }

  //bullets
  for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.fillStyle = "white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    //bullet clliusion
    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienCount--;
        score += 100;
      }
    }
  }

  while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
    bulletArray.shift();
  }

  //next level
  if (alienCount == 0) {
    alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
    alienRows = Math.min(alienRows + 1, rows - 4);
    alienVeloCityX += 0.2;
    alienArray = [];
    bulletArray = [];
    createAliens();
  }

  //score
  context.fillStyle = "white";
  context.font = "16px arial";
  context.fillText(score, 5, 20);
}

function moveShip(e) {
  if (gameOver) {
    return;
  }
  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX;
  } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
    ship.x += shipVelocityX;
  }
}

function createAliens() {
  for (let i = 0; i < alienColumns; i++) {
    for (let j = 0; j < alienRows; j++) {
      let alien = {
        img: alienImage,
        x: alienX + i * alienWidth,
        y: alienY + j * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };
      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}

function shoot(e) {
  if (gameOver) {
    return;
  }
  if (e.code == "Space") {
    let bullet = {
      x: ship.x + (shipWidth * 15) / 32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false,
    };
    bulletArray.push(bullet);
  }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
