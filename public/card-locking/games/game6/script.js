// Relax and enjoy 💖

// scene basics
let container, scene, camera, renderer;
let matcap = null;
let isTextureLoaded = false;

// global meshes
let ball, ball2, torus, torus2, disc2;
let boxes = [];

// hairy lines
let sphere = new THREE.Group();
let radius = 25;
let lines = 56;
let dots = 35;

// mouse interactions
let mouseX = 0;
let mouseY = 0;
let hasEnteredRight = false;
const factor = 1.57;

const isMobile = /(Android|iPhone|iOS|iPod|iPad)/i.test(navigator.userAgent);

const colors = [
  
  0xffffff, // white
  0xffee94, // vanilla
  0xffc0dd, // cotton candy
  0xff8ac0, // cotton candy darker
  0xbffbcb, // green pastel
  0x9ae3a9, // green pastel dark
  0x8fcbea, // blue pastel
  0xa3a3a3, // grey
  0x222222, // black
  0x010101 // black
  
];

function init() {
  
  loadTexture();

  container = document.querySelector("#scene");
  scene = new THREE.Scene();
  createCamera();
  createLights();
  createGeometries();
  createMaterials();
  createMeshes();
  createRenderer();
  createLines();

  requestAnimationFrame(render);

  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("touchmove", onTouch);
  document.addEventListener("touchstart", onTouch);
  window.addEventListener("resize", onResize);
  
}

init();

function loadTexture() {
  
  const textureLoader = new THREE.TextureLoader();
  matcap = textureLoader.load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/911157/matcap_gold_small_optimized.jpg",
    function() {
      isTextureLoaded = true;
    }
  );
  
}

function createCamera() {
  
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 35, 120);
  camera.lookAt(0, 29, 0);
  camera.aspect = window.innerWidth / window.innerHeight;
  const cameraZ = 120;

  if (camera.aspect < 1 && camera.aspect > 0.75) {
    
    camera.position.z = cameraZ * 1.5;
    
  } else if (camera.aspect < 0.75) {
    
    camera.position.z = cameraZ * 2.5;
    
  } else {
    
    camera.position.z = cameraZ;
    
  }
  
}

function createLights() {
  
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 3.25);
  ambientLight.position.set(-10, 200, 1000);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
  mainLight.position.set(-50, 100, 10);

  const mainLight2 = new THREE.DirectionalLight(0xff002d, 15);
  mainLight2.position.set(-50, 10, -10);

  scene.add(ambientLight, mainLight, mainLight2);
  
}

function createGeometries() {
  
  const torus = new THREE.TorusGeometry(18, 5.9, 24, 90);
  const torusThin = new THREE.TorusBufferGeometry(8, 1.25, 20, 90);
  const cylinder = new THREE.CylinderBufferGeometry(2, 2, 25, 32);
  cylinder.applyMatrix(new THREE.Matrix4().makeTranslation(0, 12.5, 0));
  const cylinderBig = new THREE.CylinderGeometry(10, 10, 6, 40, 6);
  cylinderBig.applyMatrix(new THREE.Matrix4().makeTranslation(0, 3, 0));
  const disc = new THREE.CylinderBufferGeometry(10, 10, 1.5, 32);
  disc.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.75, 0));
  const ball = new THREE.SphereBufferGeometry(5.5, 32, 32);
  const cone = new THREE.ConeBufferGeometry(8, 26, 32, 32);
  cone.applyMatrix(new THREE.Matrix4().makeTranslation(0, 15, 0));
  const cone2 = new THREE.ConeBufferGeometry(8, 17, 32);
  cone2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 8.5, 0));
  const box = new THREE.BoxBufferGeometry(17, 1.5, 17);
  box.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));

  return {
    
    torus,
    torusThin,
    cylinder,
    disc,
    ball,
    cone,
    cone2,
    cylinderBig,
    box
    
  };
  
}

function createMaterials() {
  
  const white = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.2,
    flatShading: false
  });
  white.color.convertSRGBToLinear();

  const black = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: 0.2,
    metalness: 0.5,
    flatShading: false
  });
  black.color.convertSRGBToLinear();

  const blackBasic = new THREE.MeshLambertMaterial({ color: 0x000000 });
  blackBasic.color.convertSRGBToLinear();

  const blue = new THREE.MeshStandardMaterial({
    color: 0xa8daff,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: false
  });
  blue.color.convertSRGBToLinear();

  const matcapGold = new THREE.ShaderMaterial({
    transparent: false,
    side: THREE.DoubleSide,
    uniforms: {
      tMatCap: {
        type: "t",
        value: matcap
      }
    },
    vertexShader: document.querySelector("#matcap-vs").textContent,
    fragmentShader: document.querySelector("#matcap-fs").textContent,
    flatShading: false
  });

  return {
    
    white,
    black,
    blackBasic,
    blue,
    matcapGold
    
  };
  
}

function createMeshes() {
  
  const geometries = createGeometries();
  const materials = createMaterials();

  const cylinder = new THREE.Mesh(geometries.cylinder, materials.blackBasic);

  const cylinderBig = new THREE.Mesh(
    geometries.cylinderBig,
    materials.blackBasic
  );
  cylinderBig.position.set(0, -6, 0);

  const disc = new THREE.Mesh(geometries.disc, materials.matcapGold);
  disc.position.set(0, 0, 0);

  ballSmall = new THREE.Mesh(geometries.ball, materials.matcapGold);
  ballSmall.scale.set(0.3, 0.3, 0.3);
  ballSmall.position.set(45, 32, 0);

  disc2 = new THREE.Mesh(geometries.disc, materials.white);
  disc2.scale.set(0.675, 0.675, 0.675);
  disc2.position.set(-45, -1, 0);

  ball = new THREE.Mesh(geometries.ball, materials.black);
  ball.position.set(-45, 39, 0);

  ball2 = new THREE.Mesh(geometries.ball, materials.white);
  ball2.position.set(45, 39, 0);

  torus = new THREE.Mesh(
    geometries.torus,
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      roughness: 0.1,
      metalness: 0.25,
      vertexColors: THREE.FaceColors // CHANGED
    })
  );
  torus.position.set(0, 40, 0);
  colorVertices(geometries.torus, colors);

  torus2 = new THREE.Mesh(geometries.torusThin, materials.white);
  torus2.rotation.y = Math.PI / 2;
  torus2.position.set(-45, -1, 0);

  const torus3 = new THREE.Mesh(geometries.torusThin, materials.black);
  torus3.position.set(45, 12.5, 0);

  const cone = new THREE.Mesh(geometries.cone, materials.black);
  cone.position.set(45, 1, 0);

  const cone2 = new THREE.Mesh(geometries.cone2, materials.white);
  cone2.position.set(-45, 16.75, 0);

  const cone3 = new THREE.Mesh(geometries.cone2, materials.matcapGold);
  cone3.scale.set(1, 0.5, 1);
  cone3.position.set(-45, 16.75, 0);
  cone3.rotation.set(Math.PI, 0, 0);

  box = new THREE.Mesh(geometries.box, materials.blue);
  box.position.set(45, 0, 0);

  let boxCount = 6;
  let step = -1.5;

  for (let i = 0; i < boxCount; i++) {
    let box1 = box.clone();
    box1.position.y = step * i;

    if (i % 2) {
      box1.material = materials.black;
    } else {
      box1.material = materials.blue;
    }

    boxes.push(box1);
    scene.add(box1);
  }

  scene.add(cylinder, cylinderBig, cone, cone2, cone3, disc, torus3);
  scene.add(torus, ball, ball2, torus2, disc2, ballSmall);
  
}

function createRenderer() {
  
  renderer = new THREE.WebGLRenderer({
    
    canvas: container,
    antialias: true,
    alpha: true
    
  });

  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;
  
}

function createLines() {
  
  sphere.position.set(0, 10.5, 0);
  scene.add( sphere );

  const hotpink = new THREE.LineBasicMaterial({ color: 0xff1493 });
  const pink = new THREE.LineBasicMaterial({ color: 0xff69ba });

  for ( let i = 0; i < lines; i++ ) {
    
    let geometry = new THREE.Geometry();
    let line = new THREE.Line( geometry, Math.random() > 0.3 ? hotpink : pink );
    line.speed = Math.random() * 200 + 520;
    line.wave = Math.random();
    line.radius = Math.floor(radius + (Math.random() - 0.5) * (radius * 0.2));

    for ( let j = 0; j < dots; j++ ) {
      
      let x = (j / dots) * line.radius * 2 - line.radius;
      let vector = new THREE.Vector3(x, 0, 0);
      geometry.vertices.push(vector);
      
    }

    line.rotation.x = Math.PI;
    line.rotation.y = Math.random() * Math.PI;
    line.rotation.z = Math.PI;
    sphere.add( line );
    
  }
  
}

function updateDots(a) {
  
  let i, j, line, vector, y;

  for (i = 0; i < lines; i++) {
    
    line = sphere.children[i];

    for (j = 0; j < dots; j++) {
      
      vector = sphere.children[i].geometry.vertices[j];
      let ratio = 1 - (line.radius - Math.abs(vector.x)) / line.radius;
      y = Math.sin(a / line.speed + j * 0.15) * 8 * ratio;
      vector.y = y;
      
    }

    line.geometry.verticesNeedUpdate = true;
    
  }
  
}

function render(a) {
  
  update();
  requestAnimationFrame(render);
  updateDots(a);
  renderer.render(scene, camera);
  
}

function update() {
  
  if ( torus && torus2 && disc2 ) {
    
    torus.rotation.y = factor * mouseX;
    torus2.rotation.y = -factor * mouseX + 1.57;
    torus2.rotation.z = factor * mouseX + 1.57;
    disc2.rotation.y = -factor * mouseX;
    disc2.rotation.z = factor * mouseX;
    
  }

  boxes.forEach((box, i) => {
    box.scale.x = 1 + 0.06 * i * factor * mouseX;
  });

  if (mouseX > 0.5 && !hasEnteredRight) {
    
    hasEnteredRight = true;
    startAnimationRight();
    
  } else if (mouseX < -0.5 && hasEnteredRight) {
    
    hasEnteredRight = false;
    startAnimationLeft();
    
  } else {
    
    return;
    
  }
}

function onResize() {
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
}

function onMouseMove(event) {
  
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
}

function onTouch(e) {
  
  if (e.targetTouches && e.targetTouches[0]) {
    
    e.preventDefault();
    pointerEvent = e.targetTouches[0];
    mouseX = (pointerEvent.pageX / window.innerWidth) * 2 - 1;
    
  } else {
    
    return;
    
  }
  
}

function randomValue(arr) {
  
  let random = arr[Math.floor(Math.random() * arr.length)];
  return random;
  
}

function startAnimationRight() {
  
  const masterTLRight = gsap.timeline({ paused: true });

  masterTLRight
    .add("startBall")
    .to(ball.position, 1.9, { x: 45, ease: "elastic.out(1, 0.5)" }, "startBall")
    .to(
      ball2.position,
      1.9,
      { x: -45, ease: "elastic.out(1, 0.5)" },
      "startBall"
    );

  masterTLRight.play();
  
}

function startAnimationLeft() {
  
  const masterTLLeft = gsap.timeline({ paused: true });

  masterTLLeft
    .add("ballStart")
    .to(
      ball.position,
      1.9,
      { x: -45, ease: "elastic.out(1, 0.5)" },
      "ballStart"
    )
    .to(
      ball2.position,
      1.9,
      { x: 45, ease: "elastic.out(1, 0.5)" },
      "ballStart"
    );

  masterTLLeft.play();
  
}

function colorVertices(geom, colorsArr) {
  
  let sharedColor = false;
  let randomCol;

  for (let i = 0; i < geom.faces.length; i++) {
    f = geom.faces[i];

    if (sharedColor) {
      f.color.set(randomCol);
      sharedColor = !sharedColor;
    } else {
      randomCol = randomValue(colorsArr);
      f.color.set(randomCol);
      sharedColor = !sharedColor;
    }
    // f.color.setRGB(Math.random(), Math.random(), Math.random()); // CHANGED
  }
  
}