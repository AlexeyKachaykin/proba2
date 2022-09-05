let MyGame;
let dir;
let speed = 0;
let dirWasChanged = false;

let box = 32;
let hiScore = 0;
let score = 0;
let count = 0;

let snake = [];
let food;
let food2;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";
const pizzaImg = new Image();
pizzaImg.src = "img/pizza.png";
const hamurgerImg = new Image();
hamurgerImg.src = "img/hamburg.png";

// first draw
const initialDraw = () => {
  ctx.font = "50px Arial";
  ctx.fillStyle = "rgba(76, 175, 80,1)";
  ctx.rect(0, 0, 608, 608);
  ctx.fill();
  ctx.fillStyle = "red";
  ctx.fillText("PRESS START", 130, 300);
  ctx.fillText("BUTTON", 200, 400);
};

// generate new food exclude points for snake
const generateFood = (currentSnake) => {
 
  let newFood = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  };

  if (currentSnake) {
    // generate new food in "free box"
    while (
      snake.some(
        (snakePart) => snakePart.x === newFood.x && snakePart.y === newFood.y
      )
    ) {
      // generate food in random position
      newFood = generateFood();
    
    }
  }

  return newFood;
};

const resetGame = () => {
  snake = [
    {
      x: 9 * box,
      y: 10 * box,
    },
  ];
  food = generateFood(snake);
  food2 = generateFood(snake);
};

function gameover() {
  const button = document.getElementById("btn");
  window.cancelAnimationFrame(MyGame);

  ctx.font = "36px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Game Over", box * 6, box * 10);

  if (hiScore < score) {
    hiScore = score;
  }

  score = 0;
  button.disabled = false;
  document.removeEventListener("keydown", findDir);
}

function getSpeedValue() {
  const inp = document.getElementsByName("speed");
  for (let i = 0; i < inp.length; i++) {
    if (inp[i].type === "radio" && inp[i].checked) {
      return inp[i].value;
    }
  }
}

function findDir(event) {
  console.log(dirWasChanged,"dirwas")
  // change dir only 1 time per frame
  if (!dirWasChanged) {
    if ([37, 65].includes(event.keyCode) && dir !== "right") {
      dir = "left";
      dirWasChanged = true;
      console.log(dirWasChanged, "dirwas1");
    } else if ([38, 87].includes(event.keyCode) && dir !== "down") {
      dir = "up";
      dirWasChanged = true;
    } else if ([39, 68].includes(event.keyCode) && dir !== "left") {
      dir = "right";
      dirWasChanged = true;
    } else if ([40, 83].includes(event.keyCode) && dir !== "up") {
      dir = "down";
      dirWasChanged = true;
    }
  }
}
function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (checkFoodWasEaten(head, snake[i])) {
      gameover();
    }
  }
}

const checkFoodWasEaten = (snakesHead, food) =>
  snakesHead.x === food.x && snakesHead.y === food.y;

const updateCanvas = () => {
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
};

function start() {
  // reset all variables
  resetGame();

  const button = document.getElementById("btn");
  document.addEventListener("keydown", findDir);

  dir = undefined;
  button.disabled = true;

  MyGame = window.requestAnimationFrame(game);
  speed = getSpeedValue();
console.log(speed,"speed")
  function game() {
    // save head position in snakesHead variable and save link on it
    const snakesHead = snake[0];
    MyGame = window.requestAnimationFrame(game);

    if (++count > speed) {
      dirWasChanged = false;
      count = 0;

      if (checkFoodWasEaten(snakesHead, food)) {
        score++;
        food = generateFood(snake);
      } else if (checkFoodWasEaten(snakesHead, food2)) {
        score++;
        food2 = generateFood(snake);
      } else {
        // delete tail
        snake.pop();
      }

      // game over flow
      if (
        snakesHead.x - box / 2 < box ||
        snakesHead.x - box / 2 > box * 17 ||
        snakesHead.y - box / 2 < 3 * box ||
        snakesHead.y - box / 2 > box * 17
      ) {
        gameover();

        return;
      }

      // create new object "snakesHead"
      const newHead = { ...snakesHead };

      switch (dir) {
        case "left":
          newHead.x -= box;
          break;
        case "right":
          newHead.x += box;
          break;
        case "up":
          newHead.y -= box;
          break;
        case "down":
          newHead.y += box;
          break;
      }

      eatTail(newHead, snake);

      snake.unshift(newHead);

      // update canvas in the end of func
      updateCanvas();
    }
  }
}

initialDraw();
