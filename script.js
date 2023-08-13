$(() => {
  let rotateInterval;
  const intervalTimeOut = 10;
  const degree = {
    currentX: 0,
    currentY: 0,
    currentZ: 0,
    toX: 0,
    toY: 0,
    toZ: 0,
    directionX: 0,
    directionY: 0,
    directionZ: 0
  };
  let clickedFrontSide; // bool

  const cube = $(".cube");
  const everySides = $(".cube div");

  function addClickEvent() {
    everySides.addClass("hover-effect");
    everySides.removeClass("no-effect");

    everySides.each(function(index, element) {
      $(element).on("click", function(e) {
        everySides.removeClass("hover-effect");
        everySides.addClass("no-effect")
        $(this).addClass("clicked");
        everySides.off("click"); // remove click event while rotating to the clicked side
        [ degree.currentX, degree.currentY, degree.currentZ ] = getRotationAngle(document.getElementById("cube"));
        console.log(degree.currentX, degree.currentY, degree.currentZ)
        // console.log(rotationX, rotationY);
        const side = $(this).data("side");
        clickedFrontSide = side === "front";
        switch(side) {
          case "front":
            rotateTo(0, 0)
            break;
          case "back":
            rotateTo(0, 180)
            break;
          case "right":
            rotateTo(0, 270)
            break;
          case "left":
            rotateTo(0, 90)
            break;
          case "top":
            rotateTo(270, 0)
            break;
          case "bottom":
            rotateTo(90, 0)
            break;
        }
      });
    });
  }
  addClickEvent();

  function rotateTo(toX, toY, toZ = 0) {
    degree.directionX = findClosestRotateDirection(degree.currentX, toX);
    degree.directionY = findClosestRotateDirection(degree.currentY, toY);
    degree.directionZ = findClosestRotateDirection(degree.currentZ, toZ);
    // console.log(degree.directionX, degree.directionY);
    degree.toX = toX;
    degree.toY = toY;
    degree.toZ = toZ;

    console.log(degree);
    cube.css("animation", "none")

    cube.css("transform", `rotateX(${degree.currentX}deg) rotateY(${degree.currentY}deg) rotateZ(${degree.currentZ}deg)`);
    rotateInterval = setInterval(rotateAnimation, intervalTimeOut);
  }

  function rotateAnimation() {
    if(degree.currentX === degree.toX && degree.currentY === degree.toY && degree.currentZ === degree.toZ) {
      clearInterval(rotateInterval);
        $(".clicked").removeClass("clicked");
        if(!(degree.currentX === 0 && degree.currentY === 0)) {
          console.log("move back to front")
          setTimeout(() => {
            rotateTo(0, 0)
          }, 3000)
          return;
        } 
        
        if(!clickedFrontSide) {
          addClickEvent();
          cube.css("animation", "rotate 20s infinite linear");
        } else {
          setTimeout(() => {
            addClickEvent();
            cube.css("animation", "rotate 20s infinite linear");
          }, 3000)
        }
      
      return;
    }

    if(degree.currentX !== degree.toX) {
      degree.currentX += degree.directionX;
      degree.currentX %= 360;

      if(degree.currentX < 0) degree.currentX += 360;
    }

    if(degree.currentY !== degree.toY) {
      degree.currentY += degree.directionY;
      degree.currentY %= 360;

      if(degree.currentY < 0) degree.currentY += 360;
    }

    if(degree.currentZ !== degree.toZ) {
      degree.currentZ += degree.directionZ;
      degree.currentZ %= 360;

      if(degree.currentZ < 0) degree.currentZ += 360;
    }

    // console.log(degree.currentX, degree.currentY);
    cube.css("transform", `rotateX(${degree.currentX}deg) rotateY(${degree.currentY}deg) rotateZ(${degree.currentZ}deg)`);
  }
})

/**
 * 
 * @param {Number<Int16Array>} currentDegree 
 * @param {Number<Int16Array>} endPoint 
 */
function findClosestRotateDirection(currentDegree, endPoint) {
  let gap;
  if(currentDegree < endPoint) {
    gap = endPoint - currentDegree;

    return gap <= 180 ?
      1 : // increase
      -1; // decrease
  } else {
    gap = currentDegree - endPoint;

    return gap <= 180 ?
      -1 : // decrease
      1; // increase
  }
}

function getRotationAngle(target) 
{
  const obj = window.getComputedStyle(target, null);
  const matrix = obj.getPropertyValue('-webkit-transform') || 
    obj.getPropertyValue('-moz-transform') ||
    obj.getPropertyValue('-ms-transform') ||
    obj.getPropertyValue('-o-transform') ||
    obj.getPropertyValue('transform');

  let rotationX = 0, rotationY = 0, rotationZ = 0;

  if (matrix !== 'none') 
  {
    const matrixArr = matrix.split('(')[1].split(')')[0].split(',').map(e => Number(e));
    rotationX = Math.atan2(matrixArr[9], matrixArr[10]);
    rotationY = Math.atan2(-matrixArr[8], 
                            Math.sqrt(matrixArr[0] ** 2 + matrixArr[4] ** 2));
    rotationZ = Math.atan2(matrixArr[1], matrixArr[0]);
  } 

  // Convert angles to degrees and adjust to full 360-degree range
  function toDegrees(angle) {
    return (angle < 0 ? 360 + (angle * 180 / Math.PI) : angle * 180 / Math.PI);
  }

  let degreeX = Math.round(toDegrees(rotationX)) % 360;
  let degreeY = Math.round(toDegrees(rotationY)) % 360;
  let degreeZ = Math.round(toDegrees(rotationZ)) % 360;

  return [360 - degreeX, 360 - degreeY, 360 - degreeZ];
}

// setInterval(() => {
//   const cube = document.getElementById("cube");
//   [x, y, z] = getRotationAngle(cube);
//   console.log(x, y, z);
// }, 100)
