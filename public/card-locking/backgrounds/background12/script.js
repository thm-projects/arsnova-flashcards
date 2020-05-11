const Colors = (() => {
  // main
  const main = {
    primary: "#ff3388",
    secondary: "#33bbff"
  };

  // original
  const original = {
    primary: "#ff3fa6",
    secondary: "#f2ff7f"
  };

  // pg
  const pg = {
    primary: "#FF3388",
    secondary: "#33FFAA"
  };

  // goldBlue
  const goldBlue = {
    primary: "#465CFA",
    secondary: "#FAE446"
  };

  // pink
  const pink = {
    primary: "#DC1A93",
    secondary: "#E841A9"
  };

  let color = main;
  const rand = Math.floor(Math.random() * 1000);
  const colorVariantToRange = new Map([
    [original, [0, 5]],
    [pg, [5, 8]],
    [goldBlue, [8, 80]],
    [pink, [80, 82]]
  ]);
  for (let [variant, range] of colorVariantToRange) {
    if (rand >= range[0] && rand < range[1]) color = variant;
  }

  return {
    bg: "#000000",
    loadingColor: "#424242",
    ...color
  };
})();

class Point2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  scale(s) {
    return new Point2D(this.x * s, this.y * s);
  }

  unit() {
    return this.scale(1 / this.mag());
  }

  add(p2) {
    return new Point2D(this.x + p2.x, this.y + p2.y);
  }

  sub(p2) {
    return new Point2D(this.x - p2.x, this.y - p2.y);
  }

  norm() {
    return new Point2D(-this.y, this.x);
  }

  dot(p2) {
    return this.x * p2.x + this.y * p2.y;
  }
}

class ContainerBox {
  constructor(ptsIn, flippy = 0) {
    let indices = [0, 1, 2, 3];
    switch (flippy) {
      case 1:
        indices = [1, 2, 3, 0];
        break;
      case 2:
        indices = [2, 3, 0, 1];
        break;
      case 3:
        indices = [3, 0, 1, 2];
        break;
      default:
        indices = [0, 1, 2, 3];
    }
    this.points = indices.map(i => ptsIn[i]);
    this.xAx = this.points[3].sub(this.points[0]);
    this.xAxUnit = this.xAx.unit();
    this.wid = this.xAx.mag();
    this.yAx = this.points[1].sub(this.points[0]);
    this.yAxUnit = this.yAx.unit();
    this.hei = this.yAx.mag();
    this.up = this.getUp();
    this.r = this.getRotation();
  }

  makeRandomPoint(padding = 1) {
    const xs = Math.random() * (this.wid - padding * 2);
    const ys = Math.random() * (this.hei - padding * 2);
    return this.xAxUnit
      .scale(xs)
      .add(this.yAxUnit.scale(ys))
      .add(this.points[0]);
  }

  makeRandomPointAtBottom(padding = 1) {
    const xs = Math.random() * (this.wid * 1.1);
    const ys = 0.99 * this.hei + padding;
    return this.xAxUnit
      .scale(xs)
      .add(this.yAxUnit.scale(ys))
      .add(this.points[0]);
  }

  getUp() {
    return this.points[0].sub(this.points[1]).unit();
  }

  aboveBox(p) {
    const i = 3;
    const j = 0;
    const vNorm = this.points[j]
      .sub(this.points[i])
      .unit()
      .norm();
    const x = p.sub(this.points[i]);
    const y = x.dot(vNorm);
    return y > 0;
  }

  getRotation() {
    return Math.atan2(this.xAx.y, this.xAx.x);
  }
}

function darken(hexColor, scalar = 0.5, opacity) {
  const col = {
    r: parseInt(hexColor.substring(1, 3), 16),
    g: parseInt(hexColor.substring(3, 5), 16),
    b: parseInt(hexColor.substring(5), 16),
    a: opacity !== undefined ? opacity : 1
  };
  return `rgba(${col.r * scalar}, ${col.g * scalar}, ${col.b * scalar}, ${
    col.a
  })`;
}

function randomColor(minV, opacity) {
  const r = Math.random() * (255 - minV) + minV;
  const g = Math.random() * (255 - minV) + minV;
  const b = Math.random() * (255 - minV) + minV;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function svgPolyElementToPointsList(polyElement) {
  const rv = [];
  const list = polyElement
    .getAttribute("points")
    .split(" ")
    .map(Number);
  for (let i = 0; i < list.length; i += 2) {
    rv.push(new Point2D(list[i], list[i + 1]));
  }
  return rv;
}

function createSvgElement(type, attributes) {
  const svgUrl = "http://www.w3.org/2000/svg";
  const element = document.createElementNS(svgUrl, type);
  Object.keys(attributes).forEach(k =>
    element.setAttributeNS(null, k, attributes[k])
  );
  return element;
}

function watchSize() {
  const svg = document.querySelector("#woman");

  function setOptimalSize() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    // original viewBox = 0 0 1189.68 1549
    // console.log(`WH: ${Math.round(W*100/H)}`);
    if (W < H) {
      const topLeft = new Point2D(83, 50);
      const size = new Point2D(418, 630).sub(topLeft);
      const heightAdjust = H / W;
      size.y = heightAdjust * size.x;
      const midY = size.y / 2;
      topLeft.y = (630 - 50) / 1.5 - midY;

      svg.style.width = "100vw";
      svg.style.height = "auto";
      svg.setAttribute(
        "viewBox",
        `${topLeft.x} ${topLeft.y} ${size.x} ${size.y}`
      );
    } else {
      const topLeft = new Point2D(0, 146);
      const size = new Point2D(505, 629).sub(topLeft);
      const widthAdjust = W / H;
      size.x = widthAdjust * size.y;
      const midX = size.x / 2;
      topLeft.x = 505 / 2 - midX;
      svg.style.width = "auto";
      svg.style.height = "100vh";
      svg.setAttribute(
        "viewBox",
        `${topLeft.x} ${topLeft.y} ${size.x} ${size.y}`
      );
    }
  }

  setOptimalSize();
  window.onresize = setOptimalSize;
}

watchSize();

const PATTERN_MAPS = new Map();
const SK_INC = 2;

async function chessPattern(w, h, { color = red, size = 8 }) {
  const SK = window.devicePixelRatio * 1;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const W = Math.ceil(w * SK);
  const H = Math.ceil(h * SK);
  canvas.width = Math.ceil(W);
  canvas.height = Math.ceil(H * 2);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H * 2);

  const sqSize = size * 5 * SK;

  for (let i = 0; i < Math.round(W / sqSize); i++) {
    const cols =
      i % 2 === 0 ? [color, darken(color, 0.9)] : [darken(color, 0.9), color];
    for (let j = 0; j < Math.floor(H / sqSize) + 1; j++) {
      const x = sqSize * i;
      const y = sqSize * j;
      const width = sqSize;
      const height = sqSize;
      ctx.fillStyle = cols[j % 2];
      ctx.fillRect(x, y, width, height);
      ctx.fillRect(x, y + H, width, height);
    }
  }

  return {
    canvas
  };
}

function chunkUpRects(rects, chunkWidth, spacing, H, variation) {
  const out = [];
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    let m = rect.x;
    const endX = rect.x + rect.width;
    while (m < endX) {
      let distLeft = endX - m;
      const randScalar = 1 + (Math.random() - 0.5) * variation;
      const len = randScalar * chunkWidth;
      const word = {
        x: m,
        y: rect.y,
        width: len
      };
      out.push(word);
      out.push({ ...word, y: word.y + H });

      m = m + word.width + spacing;
      distLeft = endX - m;

      if (distLeft < chunkWidth) {
        break;
      }
    }
  }
  return out;
}

async function glowTextPattern(
  w,
  h,
  { N = 300, color = "red", size = 4, seed }
) {
  const SK = window.devicePixelRatio + SK_INC;
  const height = 10 * SK;
  const chunkWidth = 30 * SK;
  const gap = 2 * SK;
  const totalSize = height + gap;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const W = Math.ceil(w * SK);
  const H = Math.ceil(h * SK);
  canvas.width = Math.ceil(W);
  canvas.height = Math.ceil(H * 2);

  const bgColor = darken(color, 0.6);

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H * 2);

  const key = `textPattern-${seed || ""}`;
  const radius = height / 2;

  let rects = [];
  if (seed && PATTERN_MAPS.has(key)) {
    rects = PATTERN_MAPS.get(key);
  } else {
    for (let j = 0; j < Math.floor(H / totalSize); j++) {
      const x =
        Math.random() < 0.8 ? Math.floor(Math.random() * 4) * 10 * SK : 0;
      const y = totalSize * j;
      const width = W - (x + radius * 2);
      rects.push({ x, y, width });
      if (Math.random() < 0.14) j += 1;
    }
    rects = chunkUpRects(rects, chunkWidth, radius / 2, H, 0.8);
    if (seed) {
      PATTERN_MAPS.set(key, rects);
    }
  }

  const glowFillPerc = 0.05;

  ctx.fillStyle = color;
  for (let i = 0; i < rects.length; i++) {
    const { x, y, width } = rects[i];

    const c1 = new Point2D(x + radius, y + radius);
    const radialGrad1 = ctx.createRadialGradient(
      c1.x,
      c1.y,
      0,
      c1.x,
      c1.y,
      radius
    );
    radialGrad1.addColorStop(0, color);
    radialGrad1.addColorStop(glowFillPerc / 2, color);
    radialGrad1.addColorStop(1, darken(color, 1, 0));
    ctx.fillStyle = radialGrad1;
    ctx.fillRect(x, y, radius * 2, radius * 2);
    ctx.fillStyle = bgColor;
    ctx.fillRect(x + radius, y, radius, radius * 2);

    const c2 = new Point2D(x + width - radius, y + radius);
    const radialGrad2 = ctx.createRadialGradient(
      c2.x,
      c2.y,
      0,
      c2.x,
      c2.y,
      radius
    );
    radialGrad2.addColorStop(0, color);
    radialGrad2.addColorStop(glowFillPerc / 2, color);
    radialGrad2.addColorStop(1, darken(color, 1, 0));
    ctx.fillStyle = radialGrad2;
    ctx.fillRect(x + width - radius * 2, y, radius * 2, radius * 2);
    ctx.fillStyle = bgColor;
    ctx.fillRect(x + width - radius * 2, y, radius, radius * 2);

    const linearGradient = ctx.createLinearGradient(0, y, 0, y + height);
    linearGradient.addColorStop(0, darken(color, 1, 0));
    linearGradient.addColorStop(0.5 - glowFillPerc, color);
    linearGradient.addColorStop(0.5 + glowFillPerc, color);
    linearGradient.addColorStop(1, darken(color, 1, 0));

    ctx.fillStyle = linearGradient;
    ctx.fillRect(x + radius, y, width - radius * 2, height);
    ctx.fillStyle = "white";
    ctx.fillRect(x + radius, y + height / 2 - 1, width - radius * 2, 1);
  }

  return {
    canvas
  };
}

async function textPattern(w, h, { N = 300, color = "red", size = 4, seed }) {
  const SK = window.devicePixelRatio * 1; // todo(luke): draw fast v then slow v
  const height = 7 * SK;
  const gap = 2 * SK;
  const totalSize = height + gap;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const W = Math.ceil(w * SK);
  const H = Math.ceil(h * SK);
  canvas.width = Math.ceil(W);
  canvas.height = Math.ceil(H * 2);

  ctx.fillStyle = darken(color, 0.8);
  ctx.fillRect(0, 0, W, H * 2);

  const key = `textPattern-${seed || ""}`;

  let rects = [];
  if (seed && PATTERN_MAPS.has(key)) {
    rects = PATTERN_MAPS.get(key);
  } else {
    for (let j = 0; j < Math.floor(H / totalSize) + 1; j++) {
      const x =
        Math.random() < 0.8 ? Math.floor(Math.random() * 4) * 10 * SK : 0;
      const y = totalSize * j;
      const width = W - x;
      rects.push({ x, y, width });
      if (Math.random() < 0.4) j += 2;
    }
    if (seed) {
      PATTERN_MAPS.set(key, rects);
    }
  }

  ctx.fillStyle = color;
  for (let i = 0; i < rects.length; i++) {
    const { x, y, width } = rects[i];
    ctx.fillRect(x, y, width, height);
    ctx.fillRect(x, y + H, width, height);
  }

  return {
    canvas
  };
}

async function layeredBubbles(w, h, { N = 300, color = "red", size = 4 }) {
  const SK = window.devicePixelRatio + SK_INC;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const W = Math.ceil(w * SK);
  const H = Math.ceil(h * SK);
  canvas.width = Math.ceil(W);
  canvas.height = Math.ceil(H * 2);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H * 2);

  for (let i = 0; i < N * 6; i++) {
    const r = (size * SK) / 1;
    const cy = Math.random() * (H + r);
    const cx = Math.random() * (W + r);
    const fill = darken(color, Math.random() * 0.4 + 1);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + H, r, 0, 2 * Math.PI);
    ctx.fill();
  }
  return {
    canvas
  };
}

async function coloredBubbles(
  w,
  h,
  { N = 300, color = "#ff0000", size = 4, secondaryColor = "#00ff00" }
) {
  const SK = window.devicePixelRatio * 1;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const W = Math.ceil(w * SK);
  const H = Math.ceil(h * SK);
  canvas.width = Math.ceil(W);
  canvas.height = Math.ceil(H * 2);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H * 2);

  for (let i = 0; i < N * 6; i++) {
    const r = size * SK;
    const cy = Math.random() * (H + r);
    const cx = Math.random() * (W + r);
    let fill = Math.random() < 0.8 ? color : secondaryColor;
    fill = darken(fill, Math.random() * 0.4 + 1, Math.random() * 0.2 + 0.1);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + H, r, 0, 2 * Math.PI);
    ctx.fill();
  }
  return {
    canvas
  };
}

const svg = document.querySelector("#woman");
const svgUrl = "http://www.w3.org/2000/svg";

//color socials
function colorSocials() {
  try {
    const color = Colors.secondary;
    document.querySelector("#twitter-icon").style.stroke = color;
    document.querySelector("#insta-rect").style.stroke = color;
    document.querySelector("#insta-circ").style.stroke = color;
    document.querySelector("#insta-circ-2").style.stroke = color;
    [1, 2, 3].forEach(
      i => (document.querySelector(`#code-pen-${i}`).style.stroke = color)
    );
  } catch (e) {}
}
colorSocials();

async function createAnimationObjects({ shapeId, boxId, flippy = 0, options }) {
  const boundsRect = document.querySelector(`#${boxId}`);
  if (!boundsRect) {
    console.log("cant find", boxId);
    return () => {};
  }
  // grab bounds points
  const boundsPoints = svgPolyElementToPointsList(boundsRect);
  const containerBox = new ContainerBox(boundsPoints, flippy);
  const vector = containerBox.getUp();
  boundsRect.style.opacity = "0";
  const angle = Math.atan2(vector.y, vector.x) * 57.3;

  const patternHolder = createSvgElement("g", {});
  const canvasImgElement = createSvgElement("image", {
    width: containerBox.wid,
    height: containerBox.hei * 2,
    href: ""
  });
  patternHolder.appendChild(canvasImgElement);

  // insert this group right after
  const mainPath = document.querySelector(`#${shapeId}`);
  mainPath.style.opacity = 0;
  const g = createSvgElement("g", {});
  mainPath.parentNode.insertBefore(g, mainPath.nextElementSibling);

  const clipId = `mange-` + Math.floor(Math.random() * 200000);
  const clipPath = createSvgElement("clipPath", {});
  clipPath.id = clipId;
  clipPath.innerHTML = `<path d=${mainPath.getAttribute("d")}></path>`;
  g.appendChild(clipPath);
  g.setAttribute("clip-path", `url(#${clipId})`);
  if (mainPath.getAttribute("transform"))
    g.setAttribute("transform", mainPath.getAttribute("transform"));
  g.appendChild(patternHolder);

  const topLeftCorner = containerBox.points[0];
  patternHolder.style.transform = `translate(${topLeftCorner.x}px, ${
    topLeftCorner.y
  }px) rotateZ(${angle + 90}deg) translate(0px, 0px)`;

  return {
    step: (offset = 0) => {
      const Y = -offset % containerBox.hei;
      patternHolder.style.transform = `translate(${topLeftCorner.x}px, ${
        topLeftCorner.y
      }px) rotateZ(${angle + 90}deg) translate(0px, ${Y}px)`;
    },
    imgElement: canvasImgElement,
    options,
    patternSpec: {
      width: containerBox.wid,
      height: containerBox.hei
    },
    originalShape: mainPath
  };
}

const pathsToGo = [
  {
    shapeId: "pink-face",
    boxId: "pink-face-box",
    options: {
      N: 800 * 0.7,
      color: Colors.primary,
      secondaryColor: Colors.secondary,
      size: 8
    }
  },
  {
    shapeId: "highlighted-yellow-top",
    boxId: "shirt-box",
    options: {
      N: 1200 * 0.7,
      color: Colors.secondary,
      secondaryColor: Colors.primary,
      size: 8,
      seed: "shirt"
    }
  },
  {
    shapeId: "highlighted-pink-top",
    boxId: "shirt-box",
    options: {
      N: 1200 * 0.7,
      color: Colors.primary,
      secondaryColor: Colors.secondary,
      size: 8,
      seed: "shirt"
    }
  },
  {
    shapeId: "right-ear-section",
    boxId: "right-ear-section-box",
    options: {
      N: 400 * 0.7,
      color: Colors.secondary,
      secondaryColor: Colors.primary,
      size: 8
    }
  },
  {
    shapeId: "face-shadow",
    boxId: "face-shadow-box",
    options: {
      N: 400 * 0.7,
      color: Colors.secondary,
      secondaryColor: Colors.primary,
      size: 8
    }
  },
  {
    shapeId: "bottom-right-pink-hair",
    boxId: "bottom-right-pink-hair-box",
    options: {
      N: 200 * 0.7,
      color: Colors.primary,
      secondaryColor: Colors.secondary,
      size: 8
    }
  },
  {
    shapeId: "bottom-right-yellow-hair",
    boxId: "bottom-right-yellow-hair-box",
    options: {
      N: 200 * 0.7,
      color: Colors.secondary,
      secondaryColor: Colors.primary,
      size: 8
    }
  },
  {
    shapeId: "right-center-hair-line",
    boxId: "right-center-hair-line-box",
    options: {
      N: 50 * 0.7,
      color: Colors.secondary,
      secondaryColor: Colors.primary,
      size: 8
    },
    flippy: 3
  },
  {
    shapeId: "pink-top-hair-line",
    boxId: "pink-top-haiir-line-box",
    options: {
      N: 20 * 0.7,
      color: Colors.primary,
      secondaryColor: Colors.secondary,
      size: 8
    },
    flippy: 3
  },
  {
    shapeId: "medium-left-pink",
    boxId: "medium-left-pink-box",
    options: {
      N: 20 * 0.7,
      color: Colors.primary,
      secondaryColor: Colors.secondary,
      size: 8
    },
    flippy: 1
  },
  {
    shapeId: "bottom-left-yellow",
    boxId: "bottom-left-yellow-box",
    options: {
      N: 20 * 0.7,
      color: Colors.secondary,
      secondaryColor: Colors.primary,
      size: 8
    }
  },
  {
    shapeId: "safari-clip",
    boxId: "safari-box",
    options: {
      N: 13 * 0.7,
      color: Colors.secondary,
      secondaryColor: Colors.primary,
      size: 8
    }
  }
];

const items = [
  { id: "dark-top", fill: Colors.bg, stroke: Colors.secondary },
  { id: "highlighted-yellow-top", fill: Colors.secondary },
  { id: "highlighted-pink-top", fill: Colors.primary },
  { id: "left-arm", fill: Colors.bg, stroke: Colors.secondary },
  { id: "arm-crease", stroke: Colors.secondary },
  { id: "left-sleeve-outline", stroke: Colors.secondary },
  { id: "left-sleeve-outline", stroke: Colors.secondary },
  { id: "black-hair-bg", fill: Colors.primary },
  { id: "black-hair", fill: Colors.bg, stroke: Colors.secondary },
  { id: "bottom-right-yellow-hair", fill: Colors.secondary },
  { id: "bottom-right-pink-hair", fill: Colors.primary },
  { id: "right-center-hair-line", fill: Colors.secondary },
  { id: "pink-top-hair-line", fill: Colors.primary },
  { id: "left-hair-line-top", stroke: Colors.secondary },
  { id: "medium-left-pink", fill: Colors.primary },
  { id: "bottom-left-yellow", fill: Colors.secondary },
  { id: "pink-face", fill: Colors.primary },
  { id: "face-shadow", fill: Colors.secondary },
  { id: "right-ear-section", fill: Colors.secondary },
  { id: "left-hand", fill: Colors.bg, stroke: Colors.secondary },
  { id: "right-arm", fill: Colors.bg, stroke: Colors.secondary },
  { id: "back", fill: Colors.bg, stroke: Colors.secondary },
  { id: "front", fill: Colors.bg, stroke: Colors.secondary },
  { id: "phone-p1", fill: Colors.bg, stroke: Colors.secondary },
  { id: "phone-p2", fill: Colors.bg, stroke: Colors.secondary }
];

pathsToGo.forEach(i => (document.getElementById(i.boxId).style.opacity = 0));
function updateColors(isLoading = false) {
  items.forEach(item => {
    const e = document.getElementById(item.id);
    if (!e) {
      console.log("could not find", item.id);
      return;
    }
    if (item.stroke)
      e.style.stroke = isLoading ? Colors.loadingColor : item.stroke;
    if (item.fill) e.style.fill = isLoading ? "black" : item.fill;
  });
}
updateColors(true);
svg.style.animationName = "loading";
var togglePattern = () => {};

async function start() {
  const animationObjects = await Promise.all(
    pathsToGo.map(p => createAnimationObjects(p))
  );
  let isChanging = false;
  function redraw(offset) {
    animationObjects.forEach(x => x.step(offset));
  }

  function setLoading() {
    updateColors(true);
    svg.style.animationName = "loading";
    for (let obj of animationObjects) {
      obj.imgElement.style.opacity = 0;
      obj.originalShape.style.opacity = 1;
    }
  }

  async function changePatterns(patternFn) {
    if (isChanging) return false;
    isChanging = true;
    updateColors(true);
    svg.style.animationName = "loading";
    setLoading();
    await new Promise(r => setTimeout(r, 50));
    const animationObjectToPattern = new Map();
    for (let obj of animationObjects) {
      const pattern = await patternFn(
        obj.patternSpec.width,
        obj.patternSpec.height,
        obj.options
      );
      animationObjectToPattern.set(obj, pattern.canvas.toDataURL());
    }
    for ([obj, pattern] of animationObjectToPattern) {
      obj.imgElement.setAttribute("href", pattern);
    }
    await new Promise(r => setTimeout(r, 50));
    animationObjects.forEach(obj => {
      obj.imgElement.style.opacity = 1;
      obj.originalShape.style.opacity = 0;
    });
    svg.style.animationName = "none";
    svg.style.opacity = 1;
    updateColors(false);

    isChanging = false;
    return true;
  }
  changePatterns(layeredBubbles);
  let isLayeredBubbles = true;
  togglePattern = async () => {
    if (isLayeredBubbles) {
      const changed = await changePatterns(glowTextPattern);
      if (changed) isLayeredBubbles = false;
    } else {
      const changed = await changePatterns(layeredBubbles);
      if (changed) isLayeredBubbles = true;
    }
  };

  let offset = 0;
  const useScroll = window.location.search.includes("scroll");
  if (useScroll) {
    addEventListener("scroll", () => {
      offset = window.scrollY;
    });
    document.body.style.height = "77000px";
  }

  let lastRedraw = 0;
  let lastDelta = 0;
  function step(delta) {
    const timePassed = delta - lastDelta;
    const scalar = timePassed / 16;
    if (lastRedraw !== offset) redraw(offset * 0.1);
    lastRedraw = offset;
    if (!useScroll) offset += 4 * scalar;
    lastDelta = delta;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
setTimeout(start, 20);