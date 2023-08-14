$(() => {
  let rotateInterval;
  const intervalTimeOut = 70;
  const intervalTimeOutWhenClicked = 5;
  let degreeX = 0, degreeY = 0;

  rotateInterval = setInterval(rotateAnimation, intervalTimeOut);

  const cube = $(".cube");
  const everySides = $(".cube div");
  
  function rotateAnimation() {
    degreeX += 1;
    degreeY += 1;
    degreeX %= 360;
    degreeY %= 360;
    cube.css("transform", `rotateX(${degreeX}deg) rotateY(${degreeY}deg)`);
  }

  function addClickEvent() {
    everySides.addClass("hover-effect");
    everySides.removeClass("no-effect");

    everySides.each(function(index, element) {
      $(element).on("click", function(e) {
        clearInterval(rotateInterval);
        everySides.removeClass("hover-effect");
        everySides.addClass("no-effect");
        $(this).addClass("clicked");
        everySides.off("click");

        const side = $(this).data("side");
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
          default: 
            console.error('Forget to add the "data-side" to each side of the cube, or name the side correctly.');
            rotateTo(0, 0);
        }
      });
    });
  }
  addClickEvent();

  function rotateTo(x, y, running = false, directionX = null, directionY = null) {
    if(!running) {
      const info = makeInfoTable(
        [degreeX, degreeY], [x, y]
      );
      console.table(info);
      rotateInterval = setInterval(() => {
        rotateTo(x, y, true);
      }, intervalTimeOutWhenClicked);
      return;
    } else if(degreeX === x && degreeY === y) {
      clearInterval(rotateInterval);
      everySides.removeClass("clicked");
      setTimeout(() => { 
        rotateInterval = setInterval(rotateAnimation, intervalTimeOut) ;
        addClickEvent();
      }, 3000);
      return;
    }

    if(!directionX) {
      directionX = findClosestDirection(degreeX, x);
    }
    if(!directionY) {
      directionY = findClosestDirection(degreeY, y);
    }
    // console.log(directionX, directionY);
    degreeX = degreeX === x ? degreeX : (
      (degreeX + directionX) % 360
    );
    degreeX = degreeX < 0 ? (degreeX + 360) : degreeX;
    
    degreeY = degreeY === y ? degreeY : (
      (degreeY + directionY) % 360
    );
    degreeY = degreeY < 0 ? (degreeY + 360) : degreeY;

    cube.css("transform", `rotateX(${degreeX}deg) rotateY(${degreeY}deg)`);
  }

  function findClosestDirection(currentDegree, endPoint) {
    currentDegree = currentDegree < 0 ? (currentDegree + 360) : currentDegree;
    endPoint = endPoint < 0 ? (endPoint + 360) : endPoint;

    let gap = 0;
    if(currentDegree < endPoint) {
      gap = currentDegree - endPoint;
      return gap <= 180 ?
        1 : // increase
        -1; // decrease
    } else {
      gap = endPoint - currentDegree;

      return gap <= 180 ?
        -1 : // decrease
        1; // increase
    }
  }

  function makeInfoTable([currentX, currentY], [toX, toY]) {
    return {
      x: {
        now: currentX,
        to: toX,
        direction: findClosestDirection(currentX, toX) === 1 ? "increase" : "decrease"
      },
      y: {
        now: currentY,
        to: toY,
        direction: findClosestDirection(currentY, toY) === 1 ? "increase" : "decrease"
      }
    };
  }
})
