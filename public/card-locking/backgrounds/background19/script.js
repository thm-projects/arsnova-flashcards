////////////////////////////////////////////////////////
//                       //                           //
//   -~=Manoylov AC=~-   //        Hexagon Tiling     //
//                       //                           //
////////////////////////////////////////////////////////
//                                                    //
// Controls:                                          //
//  mouse                                             //
//    move mouse : rotate hovered hexagon             //
//    mouse click: generate new hexagon variant       //
//                                                    //
//  keyboard                                          //
//   1-7: switch between different hexagon patterns   //
//   'c': generate different colors and size          //
//   'h': show contours of hexagons                   //
//    any others: regenerate hexagons                 //
////////////////////////////////////////////////////////
//                                                    //
// Contacts:                                          //
//    https://codepen.io/Manoylov/                    //
//    https://www.instagram.com/manoylov_ac/          //
//    https://www.openprocessing.org/user/23616/      //
//    https://twitter.com/ManoylovAC                  //
//    https://www.facebook.com/epistolariy            //
//    https://manoylov.tumblr.com/                    //
////////////////////////////////////////////////////////
//                                                    //
// inspired by hexagon patterns                       //
////////////////////////////////////////////////////////

let radius   = 70;
let hexagons = [];
let lineWidth    = radius;
let colorPalette = [];
let linesWidth   = [];
let isShowHexagonShape = !true;
let patternSchema      = 1;
let isAnyUserAction    = false;

const colorSchemas = [
  {
    lineColors  : ['#000', '#003333', '#5dd38e', '#007a6c', '#002c2c'],
    widthFactors: [1, .9, .85, .55, .2]
  }, {
    lineColors  : ['#366f69', '#49B8A9', '#e7e6c2', '#393939'],
    widthFactors: [1, .8, .5, .2]
  }, {
    lineColors  : ['#000000', '#e8edec', '#116979', '#39b8b6', '#0e3e4b'],
    widthFactors: [1, .8, .5, .2]
  }, {
    lineColors  : ['#000000', '#f1f1f1'],
    widthFactors: [1, .95]
  }, {
    lineColors  : ['#03141a', '#002c2c', '#366f69'],
    widthFactors: [1, .9, .5]
  }, {
    lineColors  : ['#292837', '#42413E', '#879366', '#C8C37B'],
    widthFactors: [1, .8, .5, .2]
  }, {
    lineColors  : ['#F3F2DB', '#79C3A7', '#668065', '#4B3331'],
    widthFactors: [1, .8, .5, .2]
  }, {
    lineColors  : [ '#0F4155', '#288791', '#83c8a7'],
    widthFactors: [1, .8, .4]
  }, {
    lineColors  : ['black', '#004b51', '#bcd381', '#3f9076', '#ecf5e5', '#86bbb3', 'black'],
    widthFactors: [1, .96, .85, .5, .2]
  }, {
    lineColors  : ['#fff', '#856c8b',  '#d4ebd0', '#a4c5c6', '#ffeb99'],
    widthFactors: [1, .85, .5, .2]
  }, {
    lineColors  : ['#000', '#f1f2f2', '#dee0e1', '#333334', '#6d6e71'],
    widthFactors: [1, .96, .85, .5, .2]
  }, {
    lineColors  : ['#000', '#301305', '#496b4a', '#ecefe6', '#e2e2d8', '#38424e', '#000'],
    widthFactors: [1, .96, .85, .5, .1]
  }, {
    lineColors  : ['black', '#856c8b', '#d4ebd0', '#a4c5c6', '#ffeb99'],
    widthFactors: [1, .96, .85, .5, .2]
  }, {
    lineColors  : ['#000', '#38424e', '#dc6600', '#ecefe6', '#496b4a', '#301305'],
    widthFactors: [1, .9, .8, .6, .2]
  }
];


function setup() {
  createCanvas(windowWidth, windowHeight);
  setColorSchemaAndLinesWeight(1);
  generateHexagonsArray(radius, linesWidth, colorPalette, isShowHexagonShape);
  document.body.oncontextmenu = () => false;
}

function setColorSchemaAndLinesWeight(cSchema) {
  const colorSchema = cSchema || ~~random(colorSchemas.length);

  radius       = ~~random(45, 80);
  lineWidth    = radius * random (.7, 1);

  if (colorSchema === 3) {
    radius     = ~~random(30, 50);
    lineWidth  = radius * random (.7, .9);
  }

  colorPalette = colorSchemas[colorSchema].lineColors;
  linesWidth   = colorSchemas[colorSchema].widthFactors.map(factor => lineWidth * factor);
}

function setSidesConnectionsOrder(segmentType = 0) {
  let sideNumsOrder = [];

  if (segmentType === 0 || segmentType === 1) {       // random
    sideNumsOrder = shuffle([0, 1, 2, 3, 4, 5]);
  } else if (segmentType === 2) {                // 3 arcs
    sideNumsOrder = [].concat(...shuffle([[0, 1], [2, 3], [4, 5]]));
  } else if (segmentType === 3) {                // 2 arcs 1 line
    sideNumsOrder = [1, 2, 4, 5, 0, 3];
  } else if (segmentType === 4) {                // 2 arcs 1 line
    sideNumsOrder = [1, 2, 0, 3, 4, 5];
  } else if (segmentType === 5) {                // 2 arches 1 line
    sideNumsOrder = [].concat(...shuffle([[0, 3], [1, 5], [2, 4]]));
  } else if (segmentType === 6) {                // 3 strait lines
    sideNumsOrder = [0, 3, 1, 4, 2, 5];
  } else if (segmentType === 7) {                // 2 arches 1 arc
    sideNumsOrder = [].concat(...shuffle([[0, 2], [1, 3], [4, 5]]));
  }

  return sideNumsOrder;
}

function generateHexagonsArray(radius, linesWidth, colorPalette, isShowHexagonShape) {
  const hexagonMask  = Hexagon.createHexagonMask(radius);
  const hexagonWidth = Math.sqrt(3)/2 * radius;
  let bgColor = '#fff';
  hexagons    = [];

  if (random() > .3) {
    bgColor   = colorPalette[~~random(1, colorPalette.length)];
  }

  for (let y = hexagonWidth ; y <= height + hexagonWidth * 2; y += hexagonWidth * 2){
    for (let x = radius, col = 0; x <= width + radius*2; x += radius * 1.5, ++col){
      const sideNumsOrder = setSidesConnectionsOrder(patternSchema);
      const startAngle    = radians(60 * ~~(random(6)));
      const targetAngle   = random() < .08 ? startAngle + radians(60 * ~~(random(6))) : startAngle;

      const tempHexagon   = new Hexagon(
        {
          x: x,
          y: y + (col % 2 === 0 ? hexagonWidth : 0),
          radius       : radius,
          startAngle   : startAngle,
          targetAngle  : targetAngle,
          hexagonMask  : hexagonMask,
          colorPalette : colorPalette,
          linesWidth   : linesWidth,
          sideNumsOrder: sideNumsOrder,
          bgColor      : bgColor,
          isShowShape  : isShowHexagonShape
        }
      );

      // tempHexagon.targetAngle = TWO_PI / 6 * floor(random(6));
      hexagons.push(tempHexagon);
    }
  }
}

function draw() {
  background(colorPalette[1]);
  hexagons.forEach((hexagon) => {
    push();
    translate(hexagon.xPos, hexagon.yPos);
    hexagon.draw(0, 0);
    pop();
  });

  if (!isAnyUserAction && frameCount % 600 === 0) {
    patternSchema = ~~random(6);
    setColorSchemaAndLinesWeight();
    generateHexagonsArray(radius, linesWidth, colorPalette, isShowHexagonShape);
  }
}

function findClosestHexagon(){
  let closestHexagon  = hexagons[0];
  let closestDistance = Infinity;

  hexagons.forEach((hexagon) => {
    let d = dist(
      mouseX, mouseY,
      hexagon.xPos - hexagon.radius,
      hexagon.yPos - hexagon.radius
    );

    if (d < closestDistance) {
      closestDistance = d;
      closestHexagon = hexagon;
    }
  });

  return closestHexagon;
}

function mousePressed() {
  isAnyUserAction = true;
  const closestHexagon = findClosestHexagon();

  if (closestHexagon) {
    closestHexagon.drawHexagonTile(setSidesConnectionsOrder());
  }
}

function mouseMoved() {
  const closestHexagon = findClosestHexagon();

  if (abs(closestHexagon.targetAngle - closestHexagon.currAngle) < .2){
    closestHexagon.targetAngle += TWO_PI / 6;
  }
}

function keyPressed() {
  isAnyUserAction = true;

  if (keyCode === 67) {
    setColorSchemaAndLinesWeight();
  } else if (['0', '1', '2', '3', '4', '5', '6', '7'].includes(key)) {
    patternSchema = parseInt(key);
  } else if (key === ' ') {
    patternSchema = ~~random(6);
  } else if (key === 'h') {
    isShowHexagonShape = !isShowHexagonShape;
  }

  generateHexagonsArray(radius, linesWidth, colorPalette, isShowHexagonShape);
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateHexagonsArray(radius, linesWidth, colorPalette, isShowHexagonShape);
}

///////////////////////////////////////////////////////////

class Hexagon {
  constructor({x, y, radius, startAngle, hexagonMask, linesWidth, colorPalette, sideNumsOrder, bgColor, targetAngle, isShowShape}) {
    this.xPos          = x;
    this.yPos          = y;
    this.width         = Math.sqrt(3)/2 * radius;
    this.radius        = radius;
    this.currAngle     = startAngle || 0;
    this.targetAngle   = targetAngle || startAngle || 0;
    this.hexagonMask   = hexagonMask;
    this.colorPalette  = colorPalette;
    this.sideNumsOrder = sideNumsOrder;
    this.bgColor       = bgColor || '#fff';
    this.linesWidth    = linesWidth;
    this.isShowShape   = isShowShape || false;
    this.graphics      = createGraphics(radius*2, radius*2);
    this.graphics      = Hexagon.drawHexagonTile(this.graphics, radius, hexagonMask, sideNumsOrder, linesWidth, colorPalette, bgColor, isShowShape);
  }

  drawHexagonTile(sideNumsOrder = this.sideNumsOrder) {
    Hexagon.drawHexagonTile(this.graphics, radius, this.hexagonMask, sideNumsOrder, this.linesWidth, this.colorPalette, this.bgColor, this.isShowShape);
  }

  draw(x, y) {
    push();
    translate(x - this.radius, y - this.radius);
    rotate(this.currAngle);
    image(this.graphics, -this.radius, -this.radius);
    pop();

    // prevention of extra calculations for rotate
    if(this.currAngle !== this.targetAngle) {
      // rotate easing
      this.currAngle += (this.targetAngle - this.currAngle) * 0.12;

      if (Math.abs(this.currAngle - this.targetAngle) < .0001) {
        this.currAngle = this.targetAngle;
      }
    }
  }
}

Hexagon.drawHexagonShape = (ctx, radius, {strokeColor = 'black', strokeW = 1, isFilled = false, fillColor = 'black'} = {}) => {
  const diameter   = radius * 2;
  const sidesNum   = 6;
  const angleStep  = 360 / sidesNum;
  const centerXpos = diameter/2;
  const centerYpos = diameter/2;

  ctx.push();
  ctx.beginShape();

  if (isFilled) {
    ctx.fill(fillColor);
  } else {
    ctx.noFill();
  }

  ctx.stroke(strokeColor);
  ctx.strokeWeight(strokeW);

  for (let a = 0; a <= 360; a += angleStep) {
    let x = (radius + .5) * cos(radians(a)) + centerXpos;
    let y = (radius + .5) * sin(radians(a)) + centerYpos;

    ctx.vertex(x, y);
  }
  ctx.endShape();
  ctx.pop();
};

Hexagon.createHexagonMask = (radius) => {
  const hexagonMask = createGraphics(radius * 2, radius * 2);
  Hexagon.drawHexagonShape(hexagonMask, radius, {strokeColor: 'black', strokeW: 1, isFilled: true});

  return hexagonMask;
};

Hexagon.drawHexagonTile = (ctx, radius, maskForCtx, sideNumsOrder, linesWidth, colorPalette, bgColor = '#fff', isShowHexagonShape = false) => {
  ctx.drawingContext.globalCompositeOperation = 'source-over';
  const angleStep = TWO_PI / 6;

  ctx.noFill();
  ctx.strokeWeight(lineWidth);
  ctx.background(bgColor);

  for (let i = 0; i < sideNumsOrder.length; i += 2) {
    let firstRndSideNum  = sideNumsOrder[i];
    let secondRndSideNum = sideNumsOrder[i + 1];

    if (firstRndSideNum > secondRndSideNum) {
      // a swap of values so that the second side is after the first
      // just to simplify future calculations
      [firstRndSideNum, secondRndSideNum] = [secondRndSideNum, firstRndSideNum];
    }

    const startDrawPoint = Hexagon._getMiddlePointBetweenVertexes(secondRndSideNum, secondRndSideNum + 1, angleStep);
    const endDrawPoint   = Hexagon._getMiddlePointBetweenVertexes(firstRndSideNum, firstRndSideNum + 1, angleStep);
    const diff           = Math.abs(secondRndSideNum - firstRndSideNum);

    switch (diff) {
      // neighbor sides - arc or 1/3 of circle
      case 5: secondRndSideNum = 6; // convert 0 pos to 6
      case 1: {
        for (let j = 0; j < linesWidth.length; j++) {
          Hexagon.drawArc(ctx, radius, secondRndSideNum, angleStep, linesWidth[j], colorPalette[j]);
        }
        break;
      }
      // sides through one - curve or oval segment
      case 4: [firstRndSideNum, secondRndSideNum] = [secondRndSideNum, firstRndSideNum];
      case 2: {
        for (let j = 0; j < linesWidth.length; j++) {
          Hexagon.drawArch(ctx, radius, firstRndSideNum, angleStep, linesWidth[j], colorPalette[j]);
        }
        break;
      }
      // opposite - strait line
      case 3: {
        for (let j = 0; j < linesWidth.length; j++) {
          Hexagon.drawLine(ctx, startDrawPoint, endDrawPoint, linesWidth[j], colorPalette[j]);
        }
        break;
      }
    }
  }

  if (isShowHexagonShape) {
    Hexagon.drawHexagonShape(ctx, radius);
  }

  ctx.drawingContext.globalCompositeOperation ="destination-in";
  ctx.image(maskForCtx, 0, 0);

  return ctx;
};


Hexagon._getVertexPos = (vertexNum, angleStep) => {
  const vertexAngle = vertexNum * angleStep;

  return {
    x: cos(vertexAngle) * radius + radius,
    y: sin(vertexAngle) * radius + radius
  };
};

Hexagon._getMiddlePointBetweenVertexes = (vertexNum1, vertexNum2, angleStep) => {
  const firstVertexPos = Hexagon._getVertexPos(vertexNum1, angleStep);
  const nextVertexPos  = Hexagon._getVertexPos(vertexNum2, angleStep);

  return {
    x: lerp(firstVertexPos.x, nextVertexPos.x, .5),
    y: lerp(firstVertexPos.y, nextVertexPos.y, .5)
  };
};



// drawing strait line for opposite sides of hexagon
Hexagon.drawLine = (ctx, startDrawPoint, endDrawPoint, lineWidth, color = 'black') => {
  ctx.push();
  ctx.stroke(color);
  ctx.strokeWeight(lineWidth);
  ctx.line(startDrawPoint.x, startDrawPoint.y, endDrawPoint.x, endDrawPoint.y);
  ctx.pop();
};

// drawing arc for neighbor sides of hexagon - 1/3 of circle
 Hexagon.drawArc = (ctx, radius, startDrawSideNum, angleStep, lineWidth, color = 'black') => {
  const middleVertex  = Hexagon._getVertexPos(startDrawSideNum, angleStep);
  const startArcAngle = radians(120);

  ctx.push();
  ctx.translate(middleVertex.x, middleVertex.y);
  ctx.rotate(radians(startDrawSideNum * 60));
  ctx.strokeWeight(lineWidth);
  ctx.stroke(color);
  ctx.arc(0, 0, radius, radius, startArcAngle, startArcAngle + radians(120));
  ctx.pop();
};

// drawing arc between sides through one - curve or oval segment
Hexagon.drawArch = (ctx, radius, firstSideNum, angleStep, lineWidth, color = 'black') => {
  const startArcAngle    = radians(240);
  const ellipseRadius    = radius * 3;

  ctx.push();
  ctx.stroke(color);
  ctx.strokeWeight(lineWidth);
  ctx.translate(radius, radius);
  ctx.rotate(radians( firstSideNum * 60));
  ctx.translate(0, radius * 1.7315);
  ctx.arc(0, 0, ellipseRadius, ellipseRadius , startArcAngle, startArcAngle + radians(60));
  ctx.pop();
};