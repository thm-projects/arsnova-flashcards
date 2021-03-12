function getCss(gridSize, is3d) {
  var doodl = `:doodle {
  @grid:${gridSize}/ 100%;
  width:100vw;
  height:100vh;
  }
  :container {
    transform-style:${is3d ? "preserve-3d" : "flat"};
  }
  :after {
    content:@p(🦋);
  } 
  @random(.15) {
    filter:hue-rotate(@r(-180deg, 180deg));
  }
  
  animation: fly @r(10s, 20s) infinite linear;
  will-change:transform;
  position:absolute;
  left:@r(100%);/*butterfly starting pos*/
  bottom:@r(75px, 250px);/*tree height is up to 250px*/
 
  @keyframes fly {
    0% {
      transform:
      translateX(@r(-20px, 20px))
      translateY(@r(-20px, 20px));
    }
    33% {
      transform:
      translateX(calc(@p(-1,1)*@r(20)*@p(1vmax)))
      translateY(calc(-1*@r(40)*1vmax))
      rotateY(@r(15turn, 25turn))
      rotateZ(@r(-.05turn, .05turn));
    }
    66% {
      transform:
      translateX(calc(@p(-1,1)*@r(20)*@p(1vmax)))
      translateY(calc(-1*@r(30,60)*1vmax))
      rotateY(@r(35turn, 45turn))
      rotateZ(@r(-.05turn, .05turn));
    }
    100% {
      transform:
      translateX(calc(@p(-1,1,1)*@r(40)*1vmax))
      translateY(calc(-100*1vmax))
      rotateY(@r(55turn, 70turn))
      rotateZ(@r(-.05turn, .05turn))
      ;
    }
  }
`;
  return doodl;
}


/*INIT*/
var body = document.querySelector("body");
var dood = document.getElementById("dood");
var forest = document.querySelector("div#forest");
body.onload = init;
window.addEventListener( 'resize', init, false ); 

/*HELPERS*/
function init() {
  
  dood.update(getCss(15, false));
  let wid = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  let density = Math.floor(wid / 10);
  forest.innerHTML = "";
  let min = -20;/*x-axis coords*/
  let max = 120;
  for (let i = 0; i < density; i++) {
    let pos = (Math.random() * (max - min + 1)) + min;
    let hei = getRandomIntInclusive(5, 250);
    forest.appendChild(generateTree(hei, pos));
  }
}

function generateTree(height, position) {
  let template = `
      <div class="tree__5"></div>
      <div class="tree__1"></div>
      <div class="tree__2"></div>
      <div class="tree__3"></div>
      <div class="tree__4" style="height:${height}px"></div>
    `;
  let el = document.createElement("div");
  el.setAttribute("class", "tree");
  el.style.left = `${position}%`;
  el.innerHTML = template;
  el.style.zIndex = Math.random() > 0.5 ? -10 : 10;
  return el;
}
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}