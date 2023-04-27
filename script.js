import { Player } from "./player.js";
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { distanceBetweenTwoPoints } from "./utilities.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const wastedElement = document.querySelector(".wasted");
const scoreEl = document.querySelector("#score");
const restartBtn = document.querySelector(".restart");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let player;
let projectiles = []; //store the bullets for the shooting mechanics
let enemies = []; //store the enemies
let particles = []; // store the particles
let animationID; //returned by the requestAnimation function
let spawnIntervalID;
let countIntervalID;
let score = 0;

//start the game
startGame();

function startGame() {
  init(); //create new player with the mov limits and also start the shooting mechanics
  animate(); // draw the player
  spawnEnemies(); //spawn enemies
}

function init() {
  const movementLimits = {
    minX: 0,
    maxX: canvas.width,
    minY: 0,
    maxY: canvas.height,
  };
  //create a new instance of the player and set it in the center
  player = new Player(
    canvas.width / 2,
    canvas.height / 2,
    context,
    movementLimits
  );
  addEventListener("click", createProjectile); // shooting mechanics
}

//spawning the enemies
function spawnEnemies() {
  let countOfEnemies = 1; //initial count of enemies

  countIntervalID = setInterval(
    () => countOfEnemies++,
    30000
  ); /*increase the count of enemies every 30 seconds*/
  spawnIntervalID = setInterval(
    () => spawnCountEnemies(countOfEnemies),
    1000
  ); /* spawn new enemies every second*/

  spawnCountEnemies(countOfEnemies);
}

function spawnCountEnemies(count) {
  //create the needed count of enemies with a for loop
  for (let i = 0; i < count; i++) {
    enemies.push(new Enemy(canvas.width, canvas.height, context, player));
  }
}

//shooting mechanics
function createProjectile(event) {
  //event from the addEventListener

  projectiles.push(
    new Projectile(player.x, player.y, event.clientX, event.clientY, context) // (coords of the shot, coords of the shooting target)
  );
}

function animate() {
  animationID = requestAnimationFrame(animate); /*draw on the next frame*/
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  ); /*clear the canvas before each rendering*/

  /*filter unnecessary object*/

  //delete particle with low opacity
  particles = particles.filter((particle) => particle.alpha > 0);
  //delete projectile from the array when it leaves the movLimits
  projectiles = projectiles.filter(projectileInsideWindow);

  //chech if the enemy was hit if so we reduce the health by -1;
  enemies.forEach((enemy) => checkHittingEnemy(enemy));
  //leave only the enemies that have more than one healthPoint
  enemies = enemies.filter((enemy) => enemy.health > 0);

  //check if the enemy hit the player
  const isGameOver = enemies.some(checkHittingPlayer);
  if (isGameOver) {
    wastedElement.style.display = "block";
    clearInterval(countIntervalID);
    clearInterval(spawnIntervalID); //stops the spawn of the enemies
    cancelAnimationFrame(animationID); //opposite of the requstAnimation;
    restartBtn.style.display = "block";
    restartBtn.addEventListener("click", restartGame);
  }

  //go through each particle nad update it
  particles.forEach((particles) => particles.update());
  //go through each bullet and call update() for each of them
  projectiles.forEach((projectile) => projectile.update());
  player.update();
  enemies.forEach((enemy) => enemy.update());
}

//check if the enemy was hit by the projectile;
function checkHittingEnemy(enemy) {
  projectiles.some((projectile, index) => {
    const distance = distanceBetweenTwoPoints(
      projectile.x,
      projectile.y,
      enemy.x,
      enemy.y
    ); /* check the distance between the center of the bullet and the center of the enemy*/
    if (distance - enemy.radius - projectile.radius > 0) return false;
    removeProjectileByIndex(index);
    enemy.health--;

    //if the enemy is ded, create an explosion
    if (enemy.health < 1) {
      console.log(enemy.radius);
      increaseScore(enemy);
      enemy.createExplosion(particles);
    }

    return true;
  });
}

function increaseScore(enemy) {
  enemy.enemyType === 1 ? (score += 250) : (score += 500);
  scoreEl.innerHTML = score;
}

function checkHittingPlayer(enemy) {
  const distance = distanceBetweenTwoPoints(
    player.x,
    player.y,
    enemy.x,
    enemy.y
  );
  return distance - enemy.radius - player.radius < 0;
}

function removeProjectileByIndex(index) {
  projectiles.splice(index, 1); /*delete one element by the index*/
}

function projectileInsideWindow(projectile) {
  //returns true if the projectile is visible on the screen
  return (
    projectile.x + projectile.radius > 0 && //check that the projectile has not left he left side of the screen
    projectile.x - projectile.radius < canvas.width &&
    projectile.y + projectile.radius > 0 &&
    projectile.y - projectile.radius < canvas.height
  );
}

function restartGame() {
  score = 0;
  scoreEl.innerHTML = score;
  wastedElement.style.display = "none";
  projectiles = [];
  enemies = [];
  particles = [];
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;

  animate();
  spawnEnemies();
  restartBtn.style.display = "none";
}
