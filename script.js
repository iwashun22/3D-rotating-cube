$(() => {
  let rotateInterval;
  const intervalTimeOut = 50;
  let degreeX = 0, degreeY = 0;

  rotateInterval = setInterval(rotateAnimation, intervalTimeOut);

  const cube = $(".cube");
  
  function rotateAnimation() {
    degreeX += 1;
    degreeY += 1;
    degreeX %= 360;
    degreeY %= 360;
    cube.css("transform", `rotateX(${degreeX}deg) rotateY(${degreeY}deg)`);
  }

  function addClickEvent() {
    $(".cube div").each(function(index, element) {
      $(element).on("click", function(e) {
        clearInterval(rotateInterval);
        $(".cube div").off("click");
        if($(this).hasClass("front")) {
          rotateTo(0, 0);
          return;
        }
        if($(this).hasClass("back")) {
          rotateTo(0, 180);
          return;
        }
        if($(this).hasClass("right")) {
          rotateTo(0, 270);
          return;
        }
        if($(this).hasClass("left")) {
          rotateTo(0, 90);
          return;
        }
        if($(this).hasClass("top")) {
          rotateTo(270, 0);
          return;
        }
        if($(this).hasClass("bottom")) {
          rotateTo(90, 0)
          return;
        }
      });
    });
  }
  addClickEvent();

  function rotateTo(x, y, directionX, directionY, stopX, stopY) {
    if(!directionX) {
      let gap = Math.abs(degreeX - x);
      directionX = ((x > degreeX && gap < 180) || (x < degreeX && gap > 180)) ? 1 : -1;
    }
    if(!directionY) {
      let gap = Math.abs(degreeY - y);
      directionY = ((y > degreeY && gap < 180) || (y < degreeY && gap > 180)) ? 1 : -1;
    }
    // console.log(directionX, directionY);
    if(!stopX) {
      degreeX += directionX;
      degreeX %= 360;
    }
    if(!stopY) {
      degreeY += directionY;
      degreeY %= 360;
    }
    cube.css("transform", `rotateX(${degreeX}deg) rotateY(${degreeY}deg)`);
    let sameX = degreeX < 0 ? (degreeX + 360) == x : degreeX == x;
    let sameY = degreeY < 0 ? (degreeY + 360) == y : degreeY == y;
    if(!sameX || !sameY) {
      // console.log(degreeX, x);
      // console.log(degreeY, y, sameY, directionY);
      setTimeout(() => { rotateTo(x, y, directionX, directionY, sameX, sameY) }, 10)
    }
    else {
      setTimeout(() => { 
        rotateInterval = setInterval(rotateAnimation, intervalTimeOut) ;
        addClickEvent();
      }, 3000);
    }
  }
})
