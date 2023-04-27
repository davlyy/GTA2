export function cosBetweenTwoPoints(x1, y1, x2, y2) {
  //divide delta of the points on the x-Achis to the distance between these points;
  const xDiff = x1 - x2;
  return xDiff / distanceBetweenTwoPoints(x1, y1, x2, y2);
}

export function sinBetweenTwoPoints(x1, y1, x2, y2) {
  const yDiff = y1 - y2;
  return yDiff / distanceBetweenTwoPoints(x1, y1, x2, y2);
}
// distance aka hypothen
export function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  //the distance between two points is equal to the hypothenuses
  // diffrence btween x-Achse and y-Achse is equal to the Kathete
  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  return Math.hypot(xDiff, yDiff);
}
