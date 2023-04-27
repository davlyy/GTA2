import { cosBetweenTwoPoints, sinBetweenTwoPoints } from "./utilities.js";

export class Projectile {
  constructor(x, y, targetX, targetY, context) {
    //save inside the class the values from the args
    this.x = x;
    this.y = y;
    this.context = context;
    this.radius = 4; // bullet will be round
    this.color = "#81000";
    this.velocity = {
      //? direction of flight
      x: cosBetweenTwoPoints(targetX, targetY, x, y) * 6, //offset in x direction is equal to the cosinus between the angle of two points * 5
      y: sinBetweenTwoPoints(targetX, targetY, x, y) * 6, //offset in Y direction is equal to the sinus of the angle between two points *5

      /*x and y is the point where the bullet is shot and target x/y is the place where we click, these 2 build our points*/
    };
  }

  //draw the bullet
  draw() {
    this.context.beginPath(); /* method of the Canvas 2D API starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.  */

    //draw the circle
    this.context.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    ); /* x and y is the center of the circle, then comes the radius,
    corners of the begin and end of the render of the cirle huh*/

    this.context.fillStyle = this.color;
    this.context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
