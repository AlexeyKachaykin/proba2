let hiScore = 0;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.font = "50px Arial";
ctx.fillStyle = "rgba(76, 175, 80,1)";
ctx.rect(0, 0, 608, 608);
ctx.fill();
ctx.fillStyle = "red";
ctx.fillText("PRESS START", 130, 300);
ctx.fillText("BUTTON", 200, 400);
if(document.getElementById("speed1").checked){speed=200}
console.log()
function start() {
  const button = document.getElementById("btn");
  button.disabled = true;

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const ground = new Image();
  ground.src = "img/ground.png";

  const pizzaImg = new Image();
  pizzaImg.src = "img/pizza.png";
  const hamurgerImg = new Image();
  hamurgerImg.src = "img/hamburg.png";
  let box = 32;

  let score = 0;

  let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  };
  let food2 = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  };

  let snake = [];
  snake[0] = {
    x: 9 * box,
    y: 10 * box,
  };

  document.addEventListener("keydown", direction);

  let dir;

  function gameover() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", box * 6, box * 10);
  }

  function direction(event) {
    if (event.keyCode == 37 && dir != "right") {
      dir = "left";
    } else if (event.keyCode == 65 && dir != "right") {
      dir = "left";
    } else if (event.keyCode == 38 && dir != "down") {
      dir = "up";
    } else if (event.keyCode == 87 && dir != "down") {
      dir = "up";
    } else if (event.keyCode == 39 && dir != "left") {
      dir = "right";
    } else if (event.keyCode == 68 && dir != "left") {
      dir = "right";
    } else if (event.keyCode == 40 && dir != "up") {
      dir = "down";
    } else if (event.keyCode == 83 && dir != "up") {
      dir = "down";
    }
  }

  function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (head.x == arr[i].x && head.y == arr[i].y) {
        clearInterval(game);
        gameover();
        if (hiScore < score) {
          hiScore = score;
        }
        button.disabled = false;
      }
    }
  }

  function drawGame() {
    ctx.drawImage(ground, 0, 0);

    ctx.drawImage(pizzaImg, food.x, food.y);
    ctx.drawImage(hamurgerImg, food2.x, food2.y);
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i == 0 ? "rgba(225,0,0,1)" : "rgba(59, 117, 12,0.7)";

      ctx.beginPath();
      ctx.arc(snake[i].x + 16, snake[i].y + 16, 16, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }

    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(score, box * 2.5, box * 1.7);
    ctx.font = "25px Arial";
    ctx.fillText("hiscore:", box * 13, box * 1.7);
    ctx.fillText(hiScore, box * 16, box * 1.7);
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX == food.x && snakeY == food.y) {
      score++;
      let mathFoodX = Math.floor(Math.random() * 17 + 1) * box;
      let mathFoodY = Math.floor(Math.random() * 15 + 3) * box;

      if (
        food2.x == mathFoodX &&
        food2.y == mathFoodY &&
        mathFoodX !== 9 * box &&
        mathFoodY !== 10 * box
      ) {
        mathFoodX = 9 * box;
        mathFoodY = 10 * box;
      } else {
        food = {
          x: mathFoodX,
          y: mathFoodY,
        };
      }
    } else if (snakeX == food2.x && snakeY == food2.y) {
      score++;
      let mathFood2X = Math.floor(Math.random() * 17 + 1) * box;
      let mathFood2Y = Math.floor(Math.random() * 15 + 3) * box;
      if (
        food.x == mathFood2X &&
        food.y == mathFood2Y &&
        mathFoodX !== 9 * box &&
        mathFoodY !== 10 * box
      ) {
        mathFood2X = 9 * box;
        mathFood2Y = 10 * box;
      } else {
        food2 = {
          x: mathFood2X,
          y: mathFood2Y,
        };
      }
    } else {
      snake.pop();
    }

    if (
      snakeX - box / 2 < box ||
      snakeX - box / 2 > box * 17 ||
      snakeY - box / 2 < 3 * box ||
      snakeY - box / 2 > box * 17
    ) {
      clearInterval(game);
      gameover();
      if (hiScore < score) {
        hiScore = score;
      }
      button.disabled = false;
    }

    if (dir == "left") {
      snakeX -= box;
    }
    if (dir == "right") {
      snakeX += box;
    }
    if (dir == "up") {
      snakeY -= box;
    }
    if (dir == "down") {
      snakeY += box;
    }

    let newHead = {
      x: snakeX,
      y: snakeY,
    };

    eatTail(newHead, snake);

    snake.unshift(newHead);
  }

  let game = setInterval(drawGame, speed);
}
