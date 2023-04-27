const MOVE_UP_KEY_CODES = ["ArrowUp", "KeyW"];
const MOVE_DOWN_KEYS_CODES = ["ArrowDown", "KeyS"];
const MOVE_LEFT_KEYS_CODES = ["ArrowLeft", "KeyA"];
const MOVE_RIGHT_KEYS_CODES = ["ArrowRight", "KeyD"];
const ALL_MOVE_KEY_CODES = [
  ...MOVE_UP_KEY_CODES,
  ...MOVE_DOWN_KEYS_CODES,
  ...MOVE_LEFT_KEYS_CODES,
  ...MOVE_RIGHT_KEYS_CODES,
];

export class Player {
  constructor(x, y, context, movementLimits) {
    this.x = x;
    this.y = y;
    //movement speed
    this.velocity = 3;
    //needed for border limits
    this.radius = 15;

    this.health = 3;

    this.context = context;

    //movement Limits
    this.movementLimits = {
      minX: movementLimits.minX + this.radius,
      maxX: movementLimits.maxX - this.radius,
      minY: movementLimits.minY + this.radius,
      maxY: movementLimits.maxY - this.radius,
    };

    //cursor position
    this.cursorPosition = {
      x: 0,
      y: 0,
    };
    document.addEventListener("mousemove", (e) => {
      this.cursorPosition.x = e.clientX;
      this.cursorPosition.y = e.clientY;
    });

    /* log/save pressed keys*/
    this.keyMap = new Map();
    document.addEventListener("keydown", (e) =>
      this.keyMap.set(e.code, true)
    ); /*The KeyboardEvent.code property represents a physical key on the keyboard */
    document.addEventListener("keyup", (e) => this.keyMap.delete(e.code));

    /*Picture with the player*/
    this.image = new Image();
    this.image.src = "./img/player.png";
    this.imageWidth = 50; /*size of the displayed part of the image*/
    this.imageHeight = 60; /* in this case the first pos of the player since the src image has 3 positions*/
    this.isMoving = false; /*needed to render a static player*/
    this.imageTick = 0; /*count the frames between the change of the pic for the legs animation*/
  }

  drawImg() {
    const imageTickLimit = 18; /*change the posiotn of the legs each 18 ticks*/
    let subX = 0; /*position of the beginning on the image with the player*/

    if (!this.isMoving) {
      subX = 0; /*if player not moving position to 0 so that the first pos from the image is rendered and reset imageTick */
      this.imageTick = 0;
    } else {
      subX =
        this.imageTick > imageTickLimit
          ? this.imageWidth * 2
          : this
              .imageWidth; /*player starts moving, we set subX first to the width, so to the 2nd pic then to the double width, so to the 3rd pic*/
      this
        .imageTick++; /*increase on each frame because of requestAnimationFrame*/
    }

    if (this.imageTick > imageTickLimit * 2) {
      this.imageTick = 0; /*reset the imageTick after some time so that the animation can restart/continue*/
    }

    this.context.drawImage(
      this.image /*instance of the source image*/,
      subX /*coords where our imgae should start to render*/,
      0 /* not position on the canva, position on the image itself*/,
      this
        .imageWidth /*height and width of the image depending on the coords above */,
      this.imageHeight,
      this.x -
        this.imageWidth /
          2 /*position on the canva where the image should be placed*/,
      this.y - this.imageHeight / 2,
      this.imageWidth /*height and widht of the image on the canva*/,
      this.imageHeight
    ); /*canvas method*/
  }

  /*display the image in the right angle so that the player always looks at the cursor*/
  draw() {
    this.context.save(); /*save the current state of the canvas so that we can return to it later*/
    let angle = Math.atan2(
      this.cursorPosition.y - this.y,
      this.cursorPosition.x - this.x
    ); /*You give it two numbers: the distance between you and the target, and the difference between the height of the target and your own height. Math.atan2() uses those two numbers to give you the angle you need to throw the ball at to hit the target. */
    this.context.translate(
      this.x,
      this.y
    ); /*canvas rotates in relation to 0, 0 we have to translate it to the values of x and y*/
    this.context.rotate(
      angle + Math.PI / 2
    ); /* here we rotate it|  in radians PI/2 is 90degrees*/
    this.context.translate(
      -this.x,
      -this.y
    ); /* then we return it to the initial pos*/
    this.drawImg();
    this.context.restore();
  }
  /*draw the player then change the coords for the next render*/
  update() {
    this.draw();
    this.isMoving =
      this.shouldMove(
        ALL_MOVE_KEY_CODES
      ); /*if atleast one key is pressed, isMoving is set to true and animation of the legs starts*/
    this.updatePosition();
    this.checkPositionLimitAndUpdate();
  }

  //movement & change the coords for the update() method
  updatePosition() {
    if (this.shouldMove(MOVE_UP_KEY_CODES))
      this.y -=
        this.velocity; /*since canvas' coords are inversed we substract for upwards movement*/
    if (this.shouldMove(MOVE_DOWN_KEYS_CODES)) this.y += this.velocity;
    if (this.shouldMove(MOVE_RIGHT_KEYS_CODES)) this.x += this.velocity;
    if (this.shouldMove(MOVE_LEFT_KEYS_CODES)) this.x -= this.velocity;
  }

  checkPositionLimitAndUpdate() {
    if (this.y < this.movementLimits.minY) this.y = this.movementLimits.minY;
    if (this.y > this.movementLimits.maxY) this.y = this.movementLimits.maxY;
    if (this.x < this.movementLimits.minX) this.x = this.movementLimits.minX;
    if (this.x > this.movementLimits.maxX) this.x = this.movementLimits.maxX;

    /* check if playerd has reached the limits, if so change the coords to the limits, this way the player will not be able to leave the playground*/
  }

  /*true if atleast one the the passed keys exists */
  shouldMove(keys) {
    return keys.some((key) => this.keyMap.get(key));
  }
}
