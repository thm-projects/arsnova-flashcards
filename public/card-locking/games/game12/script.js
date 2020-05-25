const speed = 5,
      fish = document.querySelector('.fish'),
      counter = document.querySelector('.counter');

let   count = 0,
      vw = window.innerWidth * .97,
      vh = window.innerHeight * .97;

function getAngle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range [-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range [-180, 180]
  theta += 90; // set 0 as top, range [-90, 270]
  if (theta > 180) theta = theta - 360; // range [-180, 180]
  theta = Math.floor(theta);
  return theta;
}

function setPos(el, x, y) {
  // old coords
  const a = window.scrollX + el.getBoundingClientRect().left;
  const b = window.scrollY + el.getBoundingClientRect().top;
  // distance
  const ax = Math.abs(a - x);
  const by = Math.abs(b - y);
  const dur = Math.floor(Math.sqrt((ax*ax) + (by*by))) * speed;
  // set new coords
  el.style.left = x + 'px';
  el.style.top = y + 'px';  
  // set duration
  el.style.transitionDuration = dur + 'ms';
  // set angle
  el.style.transform = 'rotate(' + getAngle(a, b, x, y) + 'deg)';
  setTimeout(function() {
    setRandomPos(el);
  }, dur);  
}

function setRandomPos(el) {  
  const randomX = Math.floor(Math.random() * vw);
  const randomY = Math.floor(Math.random() * vh);
  setPos(el, randomX, randomY);
}

function updateCount() {
  counter.textContent = count;
}

function createFish() {
  const fish = document.createElement('a');
  fish.setAttribute('href','#');
  fish.className = 'fish';
  fish.textContent = '=';
  fish.style.filter = 'hue-rotate(' + Math.floor(Math.random() * 360) + 'deg)';
  document.body.appendChild(fish);
  setRandomPos(fish);
  fish.addEventListener('click', createFish);
  count++;
  updateCount();
}

window.onresize = function() {
  vw = window.innerWidth * .97;
  vh = window.innerHeight * .97;
}

createFish();