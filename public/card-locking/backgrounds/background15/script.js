/*
  Johan Karlsson, 2020
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
  
  https://en.wikipedia.org/wiki/Delaunay_triangulation
  
  https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
  
  https://en.wikipedia.org/wiki/Circumscribed_circle
*/

class Triangle {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
  
  vertexes() {
    return [this.a, this.b, this.c];
  }
  
  edges() {
    return [
      [this.a, this.b],
      [this.b, this.c],
      [this.c, this.a]
    ];
  }
  
  sharesAVertexWith(triangle) {
    // TODO: optimize me please!
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        let v = this.vertexes()[i];
        let vv = triangle.vertexes()[j];
        if(v.equals(vv)) {
          return true;
        }
      }
    }
    return false;
  }

  hasEdge(edge) {
    for(let i = 0; i < 3; i++) {
      let e = this.edges()[i];
      if(e[0].equals(edge[0]) && e[1].equals(edge[1]) || 
         e[1].equals(edge[0]) && e[0].equals(edge[1])) {
        return true;
      }
    }
    return false;
  }
  
  circumcenter() {
    let d = 2 * (this.a.x * (this.b.y - this.c.y) + 
                 this.b.x * (this.c.y - this.a.y) + 
                 this.c.x * (this.a.y - this.b.y));
    
    let x = 1 / d * ((this.a.x * this.a.x + this.a.y * this.a.y) * (this.b.y - this.c.y) +
                     (this.b.x * this.b.x + this.b.y * this.b.y) * (this.c.y - this.a.y) + 
                     (this.c.x * this.c.x + this.c.y * this.c.y) * (this.a.y - this.b.y));
    
    let y = 1 / d * ((this.a.x * this.a.x + this.a.y * this.a.y) * (this.c.x - this.b.x) + 
                     (this.b.x * this.b.x + this.b.y * this.b.y) * (this.a.x - this.c.x) + 
                     (this.c.x * this.c.x + this.c.y * this.c.y) * (this.b.x - this.a.x));
    
    return new Vector(x, y);
  }
  
  get centroid() {
    if(!this._centroid) {
      this._centroid = this.a.add(this.b).add(this.c).div(3);
    }
    return this._centroid;
  }
  
  circumradius() {
    return this.circumcenter().sub(this.a).getLength();    
  }
  
  pointIsInsideCircumcircle(point) {
    let circumcenter = this.circumcenter();
    let circumradius = circumcenter.sub(this.a).getLength();
    let dist = point.sub(circumcenter).getLength();
    return dist < circumradius;
  }
  
  draw() {
    let c = this.centroid;
    ctx.save();
    let color = getColor(this.a, this.b)
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    ctx.beginPath();
    ctx.lineTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.lineTo(this.c.x, this.c.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.clip();
    
    if(image) {
      ctx.translate(c.x, c.y);
      let angle = Math.random() * Math.PI * 2;
      ctx.rotate(angle);
      let leftMargin = -image.width / 2;
      let topMargin = -image.height / 2;
      ctx.globalAlpha = 0.2;
      ctx.drawImage(image, leftMargin, topMargin); 
    }
    
    ctx.restore();
  }
}

let canvas;
let ctx;
let w, h;
let simplex;
let zoom;
let image;

function setup() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  reset();
  window.addEventListener("resize", () => {
    reset();
    draw();
  });
  canvas.addEventListener("click", draw);
  loadImage().then(img => {
    image = img;
    draw();
  });
}

function getColor(vec1, vec2) {
  let n = (simplex.noise2D(vec1.x / zoom, vec1.y / zoom) + 1) * 0.5;
  let c = 255 * n;
  let c2 = (c + 128) % 255; 
  
  var gradient = ctx.createLinearGradient(vec1.x, vec1.y, vec2.x, vec2.y);
  let color1= `rgb(${c}, ${c}, ${c})`;
  let color2= `rgb(${c2}, ${c2}, ${c2})`;
  
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  return gradient;
}

function loadImage() {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.crossOrigin = "anonymous";
    image.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/254249/wall-2828302_1280.jpg";
    image.onload = () => {
      resolve(image);
    };
    image.onerror = error => {
      reject(error.srcElement.src);
    }
  });
}

function reset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function getRandomPoints() {
  let extra = 40;
  let pointList = [
    new Vector(-extra, -extra),
    new Vector(-extra, h + extra),
    new Vector(w + extra, -extra),
    new Vector(w + extra, h + extra)
  ];
  
  let rStep = Math.random() * 2.5 + 0.9;
  let aStep = Math.random() + 0.1;
  let r = 1;
  let angle = 0;
  let center = new Vector(w / 2, h / 2);
  for(let i = 0; i < 700; i++) {
    let d = Math.random() * 2 + 9;
    let extraR = Math.sin(i/d) * 0.15 + 1;
    let x = Math.cos(angle) * r * extraR;
    let y = Math.sin(angle) * r * extraR;
    let point = new Vector(x, y);
    if(point.distanceTo(center) > w * 2) {
      break;
    }
    pointList.push(point.add(center));
    r += rStep;
    angle += aStep;
  }
  return pointList;
}

function bowyerWatson (superTriangle, pointList) {
  // pointList is a set of coordinates defining the 
  // points to be triangulated
  let triangulation = [];

  // add super-triangle to triangulation 
  // must be large enough to completely contain all 
  // the points in pointList
  triangulation.push(superTriangle);

  // add all the points one at a time to the triangulation
  pointList.forEach(point => {
    let badTriangles = [];
    
    // first find all the triangles that are no 
    // longer valid due to the insertion
    triangulation.forEach(triangle => { 
      if(triangle.pointIsInsideCircumcircle(point)) {
        badTriangles.push(triangle); 
      }
    });
    let polygon = [];
    
    // find the boundary of the polygonal hole
    badTriangles.forEach(triangle => {
      triangle.edges().forEach(edge => {
        let edgeIsShared = false;
        badTriangles.forEach(otherTriangle => {
          if(triangle !== otherTriangle &&  otherTriangle.hasEdge(edge)) {
            edgeIsShared = true;
          }
        });
        if(!edgeIsShared) {
          //edge is not shared by any other 
          // triangles in badTriangles
          polygon.push(edge);
        }
      });
    });
    
    // remove them from the data structure
    badTriangles.forEach(triangle => {
      let index = triangulation.indexOf(triangle);
      if (index > -1) {
        triangulation.splice(index, 1);
      }
    });
    
    // re-triangulate the polygonal hole
    polygon.forEach(edge => {
      //form a triangle from edge to point
      let newTri = new Triangle(edge[0], edge[1], point);
      triangulation.push(newTri);
    });
  });
  
  // done inserting points, now clean up
  let i = triangulation.length;
  while(i--) {
    let triangle = triangulation[i];
    if(triangle.sharesAVertexWith(superTriangle)) {
      //remove triangle from triangulation
      let index = triangulation.indexOf(triangle);
      if (index > -1) {
        triangulation.splice(index, 1);
      }
    }  
  }
  
  return triangulation;
}

function draw() {
  simplex = new SimplexNoise();
  zoom = Math.random() * 1000 + 400;
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  
  let superTriangle = new Triangle(
    new Vector(-w * 10, h * 10),
    new Vector(w * 10, h * 10),
    new Vector(w / 2, -h * 10)
  );
  
  let pointList = getRandomPoints();
  let triangles = bowyerWatson(superTriangle, pointList);
  triangles.forEach(t => t.draw());
}

setup();