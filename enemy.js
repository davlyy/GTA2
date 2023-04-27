import { cosBetweenTwoPoints, sinBetweenTwoPoints } from "./utilities.js";
import { Particle } from "./particle.js";

export class Enemy {
  constructor(canvasWidth, canvasHeight, context, player) {
    this.context = context; /*to draw the enemy*/
    this.player = player; //to know where the player is, so his coords

    this.radius = 15;

    const enemyType = Math.random() > 0.8 ? 2 : 1; // enemy of type 2 appears less often

    this.enemyType = enemyType;
    this.health = enemyType;
    if (Math.random() < 0.5) {
      this.x =
        Math.random() < 0.5 ? 0 - this.radius : canvasWidth + this.radius;
      //enemy appears either on the lift side or right side of the canvas
      this.y = Math.random() * canvasHeight; //player appear on a random point of the y-Achse
    } else {
      this.x = Math.random() * canvasWidth;
      this.y =
        Math.random() < 0.5
          ? 0 - this.radius
          : canvasHeight +
            this.radius; /*either on top or bottom of the canvas*/
    }

    this.image = new Image();
    this.image.src = `./img/enemy_${enemyType}.png`;
    this.imageWidth = 50;
    this.imageHeight = 60;
    this.imageTick = 0;
  }

  drawImg() {
    const imageTickLimit = 18;
    const subX =
      this.imageTick > imageTickLimit
        ? this.imageWidth
        : 0; /*equal to the width of the image if we reached the ticklimit otherwise 0;*/
    this.imageTick++;
    if (this.imageTick > imageTickLimit * 2) {
      this.imageTick = 0;
    }

    this.context.drawImage(
      this.image,
      subX,
      0,
      this.imageWidth,
      this.imageHeight,
      this.x - this.imageWidth / 2,
      this.y - this.imageHeight / 2,
      this.imageWidth,
      this.imageHeight
    );
  }

  draw() {
    this.context.save();
    let angle = Math.atan2(
      this.player.y - this.y,
      this.player.x - this.x
    ); /*same as with the player but instead of the posiot of the curosr we use the position of the player itself*/
    this.context.translate(this.x, this.y);
    this.context.rotate(angle + Math.PI / 2);
    this.context.translate(-this.x, -this.y);
    this.drawImg();
    this.context.restore();
  }

  update() {
    this.draw(); /*draw the anemies and add the velocity*/
    this.velocity = {
      x: cosBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y) * 2,
      y: sinBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y) * 2,
    };
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  createExplosion(particles) {
    //create 50 particles and push them to an array
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(this.x, this.y, this.context));
    }
  }
}
