/*
These calm spikes are here to brighten your day
*/

// Helper functions
const SphereCoordToCartesian = function (r, phi, theta) {
  
  let x = Math.cos(phi) * Math.sin(theta) * r;
  let y = Math.sin(phi) * Math.sin(theta) * r;
  let z = Math.cos(theta) * r;
  return new THREE.Vector3(x, y, z);
  
}

const UVSphere = function (radius, stacks, slices) {
  
  const geometry = new THREE.Geometry();
  let theta1, theta2, ph1, ph2;
  let vert1, vert2, vert3, vert4;
  let index = 0;

  for (let t = 0; t < stacks; t++) {

    theta1 = (t / stacks) * Math.PI;
    theta2 = ((t + 1) / stacks) * Math.PI;

    for (let p = 0; p < slices; p++) {
        ph1 = (p / slices) * 2 * Math.PI;
        ph2 = ((p + 1) / slices) * 2 * Math.PI;

        vert1 = SphereCoordToCartesian(radius, ph1, theta1);
        vert3 = SphereCoordToCartesian(radius, ph2, theta1);
        vert2 = SphereCoordToCartesian(radius, ph2, theta2);
        vert4 = SphereCoordToCartesian(radius, ph1, theta2);

        geometry.vertices.push(vert1, vert2, vert3, vert4);

        if (t == 0) {

          geometry.faces.push(new THREE.Face3(0 + index, 1 + index, 3 + index));
          
        }
        else if (t + 1 == stacks) {

          geometry.faces.push(new THREE.Face3(1 + index, 0 + index, 2 + index));
          
        }
        else {

          geometry.faces.push(new THREE.Face3(0 + index, 2 + index, 3 + index));
          geometry.faces.push(new THREE.Face3(2 + index, 1 + index, 3 + index));
          
        }

        index += 4;

    }

  }

  geometry.mergeVertices();
  geometry.normalize();
  geometry.computeFaceNormals();
  geometry.computeVertexNormals(true);

  return geometry;
  
}

window.onload = () => { 

 init();
  
}

const isMobile = /(Android|iPhone|iOS|iPod|iPad)/i.test(navigator.userAgent);

let renderer, container, scene, camera, cactus, cactus2;

let mouseX = 1;
let mouseY = 1;

function init() {
        
  container = document.querySelector("#container_3d");
  scene = new THREE.Scene(); 
  createCamera();
  createLight();
  createCactus();
  createRenderer();
  createControls();
    
  const render = function () {

    update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();

  };
  
  const update = function() {

    cactus.rotation.z += 0.005 * mouseX;
    cactus2.rotation.z += 0.0025 * mouseX;
    cactus2.rotation.y += 0.0005 * mouseY;

  }

  render();

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove, false);
  
}

function setGradient(geometry, colors, axis, reverse) {

  geometry.computeBoundingBox();

  const bbox = geometry.boundingBox;
  const size = new THREE.Vector3().subVectors(bbox.max, bbox.min);

  const vertexIndices = ['a', 'b', 'c'];
  
  let face, vertex, normalized = new THREE.Vector3();
  let normalizedAxis = 0;

  for (let c = 0; c < colors.length - 1; c++) {

    let colorDiff = colors[c + 1].stop - colors[c].stop;

    for (let i = 0; i < geometry.faces.length; i++) {
      
      face = geometry.faces[i];
      
      for (let v = 0; v < 3; v++) {
        
        vertex = geometry.vertices[face[vertexIndices[v]]];
        normalizedAxis = normalized.subVectors(vertex, bbox.min).divide(size)[axis];
        
        if (reverse) {
          normalizedAxis = 1 - normalizedAxis;
        }
        if (normalizedAxis >= colors[c].stop && normalizedAxis <= colors[c + 1].stop) {
          let localNormalizedAxis = (normalizedAxis - colors[c].stop) / colorDiff;
          face.vertexColors[v] = colors[c].color.clone().lerp(colors[c + 1].color, localNormalizedAxis);
        }
      }
    }
  }
}

function createCamera() {

  camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    100
  );
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.set(0, 0, 15);
  const cameraZ = 15;
  
  if (camera.aspect < 1 && camera.aspect > 0.75) {

    camera.position.set(0, 0, cameraZ * 1.5);

  } else if (camera.aspect < 0.75) {

    camera.position.set(0, 0, cameraZ * 2.0);

  } else {

    camera.position.set(0, 0, cameraZ);

  }
  
}

function createLight() {
  
  const ambient = new THREE.AmbientLight(0xeeeeee); 

  const dirLight = new THREE.DirectionalLight(0xfffffff);
  dirLight.intensity = 0.5;
  dirLight.position.set(50, 120, -100);
  dirLight.target.position.set(0, 0, 0);

  scene.add(ambient, dirLight, dirLight.target);
  
}

function createCactus() {
  
    const horBands = 120; 
    const vertBands = 120; 
    const radius = 5.5;
  
    const cactusGeometry = UVSphere(radius, vertBands, horBands);

    const spines = 2;
    // Also pretty!
    // spines = 3; 
    let amount = radius;
    let mod = 0; 
    let y = 0; 
    let knots = 4;
    let spikeVerts = [];
    let verti;
  
    for (let i = 0; i < cactusGeometry.vertices.length; i++) {
      
        verti = cactusGeometry.vertices[i];
        verti.negate();
      
        if (i > vertBands * 10) {
          
            amount += mod;
            amount += (Math.random() * 2 - 1) * 0.0005;

            if (((y < (verti.y + .01)) && (y > (verti.y - .01)))) {
                // modif the shape
                if (Math.random() * 20 > 10 || y < 0) {
                  
                    mod = 0.00016;
                  
                } else {
                // IMPO: mod= -0.00016
                    mod = -0.00075;
                  
                }
            }
        }
      
        if ((i + 1) % knots == 0) {
          
            verti.setLength(amount + .005);
            cactusGeometry.colors[i] = new THREE.Color(0xcc91a3);
          
        }
      
        else if ((i - 1) % knots == 0) {
          
            verti.setLength(amount + .005);
            cactusGeometry.colors[i] = new THREE.Color(0xcc91a3);

        }
      
        else if (i % knots == 0) {
          
            verti.setLength(amount + 0.0075);
            cactusGeometry.colors[i] = new THREE.Color(0xe6c1cc);
          
            if ((Math.floor(i / horBands) % spines) == 0) {
                
                if (i > vertBands * 2) {
                // IMPO: amount + 0.23
                  cactusGeometry.vertices[i].setLength(amount + 0.105);
                  spikeVerts.push(i);
              
                }
            }
          
            else if ((Math.floor((i + horBands) / horBands) % spines) == 0 || (Math.floor((i - horBands) / horBands) % spines) == 0) {
              
                verti.setLength(amount + 1);
              
            }
          
            else if ((Math.floor((i + horBands * 2) / horBands) % spines) == 0 || (Math.floor((i - horBands * 2) / horBands) % spines) == 0) {
              
                verti.setLength(amount + .115);
              
            }
        }
      
        else {
          
            cactusGeometry.colors[i] = new THREE.Color(0xb87287);
            verti.setLength(amount);
          
        }

    }
    console.log('Spikes number: ' + spikeVerts.length);
  
    const faceIndices = ['a', 'b', 'c', 'd'];

    // Vertices coloring
    for ( let i = 0; i < cactusGeometry.faces.length; i++ ) {
        
        let face = cactusGeometry.faces[i];
        let numberOfSides = 3;
      
        for ( let j = 0; j < numberOfSides; j++ ) {
          
            vertexIndex = face[faceIndices[j]];
            face.vertexColors[j] = cactusGeometry.colors[vertexIndex];
          
        }
    }
  
    const cactusMaterial = new THREE.MeshLambertMaterial();
    cactusMaterial.vertexColors = THREE.VertexColors;
    cactusMaterial.side = THREE.DoubleSide;

    cactus = new THREE.Mesh(cactusGeometry, cactusMaterial);
    cactus.scale.set(1.3, 1.3, 1.3);
    cactus.position.set(0, 0, 0);
  
    cactus2 = cactus.clone();
    cactus2.position.set(6, -1.5, 0);
    
    cactus.rotateX(Math.PI / 1.9);
  
    scene.add(cactus, cactus2);
  
}

function createRenderer() {
  
  
    renderer = new THREE.WebGLRenderer({ 
      
        canvas: container,
        antialias: false,
        alpha: true
      
    });
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio (isMobile ? Math.min(1.75, window.devicePixelRatio) : 2 );
    renderer.gammaFactor = 2.2;
  
    document.body.appendChild( renderer.domElement );
  
}

function createControls() {
  
    controls = new THREE.OrbitControls( camera, container );
    controls.enabled = true;
  
}

function onWindowResize() {
  
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  
}

function onMouseMove( event ) {
  
    mouseX = ( event.clientX / window.innerWidth ) * 3.5 - 1;
    mouseY = - ( event.clientY / window.innerHeight ) * 3.5 + 1;

}