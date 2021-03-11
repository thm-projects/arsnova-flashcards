function perlin() {
  return `
#ifdef GL_ES
  precision highp float;
  #endif

  #define PI 3.14159265359;

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_xpos;
  uniform float u_ypos;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }
`;
}

const shaders = {
  cloth: {
    vertex: `

uniform float time;

varying vec3 vUv; 

${perlin()}

void main() {
	vec3 p = position;
	float e = sin(snoise(vec3(p.xy * .15, time * 0.1))  * 10.) * .5;

	p.z += e;


	vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
	vUv = p; 
	gl_Position = projectionMatrix * modelViewPosition; 
}

`,
    fragment: `

uniform vec3 camera;
uniform float time;

varying vec3 vUv;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
	float d = dot(camera, normalize(vUv)) / 3.1415;
	vec3 c = hsv2rgb(vec3(d, 1., 1.));
	c = mix(vec3(1., 0., 1.), c, .75);

	gl_FragColor = vec4(c * 0.29, 1.0);
}

` } };





const scene = new THREE.Scene(),
width = window.innerWidth,
height = window.innerHeight,
camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000),
renderer = new THREE.WebGLRenderer(),
startTime = new Date().getTime(),
timeOffset = 15;

var composer, outlinePass;

let currentTime = 0;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let CameraHolder = new THREE.Object3D();
CameraHolder.add(camera);
scene.add(CameraHolder);


composer = new THREE.EffectComposer(renderer);

var renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
composer.addPass(outlinePass);


let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height), 1.5, .4, .85);
renderer.toneMappingExposure = 1;
bloomPass.threshold = 0;
bloomPass.strength = 1.5;
bloomPass.radius = 1.5;
composer.addPass(bloomPass);

/*
let filmPass = new THREE.FilmPass(0.34, 0.025, 256, false);
composer.addPass(filmPass);

outlinePass.edgeStrength = 3
outlinePass.edgeThickness = 1
outlinePass.edgeGlow  = 0
outlinePass.visibleEdgeColor.set('#ffffff')
outlinePass.hiddenEdgeColor.set('#ffffff')
outlinePass.BlurDirectionX = new THREE.Vector2(0.0, 0.0)
outlinePass.BlurDirectionY = new THREE.Vector2(0.0, 0.0)
*/

let uniforms = {
  camera: { value: camera.position },
  time: { value: 0 } };


let length = 60,
cameraZ = 5;

var geometry = new THREE.PlaneGeometry(length * 1.2, length, 600, 600);
//var geometry = new THREE.SphereGeometry( 1, 100, 100 );
let material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  fragmentShader: shaders.cloth.fragment,
  vertexShader: shaders.cloth.vertex });

var plane = new THREE.Mesh(geometry, material);
scene.add(plane);

plane.rotation.x = Math.PI * 1.5;
plane.position.y = -6;
plane.position.z = -(length * .3);

var plane2 = new THREE.Mesh(geometry, material);
scene.add(plane2);

plane2.rotation.x = Math.PI * .15;
plane2.position.z = -length * .25;

camera.position.z = length * .5 - cameraZ / 2;

const sgeom = new THREE.SphereGeometry(3, 50, 50);
const smat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const sphere = new THREE.Mesh(sgeom, smat);
scene.add(sphere);

function animate() {
  var now = new Date().getTime();
  currentTime = (now - startTime) / 1000;
  let t = currentTime + timeOffset;

  CameraHolder.updateMatrixWorld();
  camera.updateMatrixWorld();
  var vector = camera.position.clone();
  vector.applyMatrix4(camera.matrixWorld);

  uniforms.time.value = t;
  uniforms.camera.value = vector;

  //CameraHolder.rotation.y = t * 0.1
  CameraHolder.rotation.x = -.1 + Math.cos(t * 0.15) * (Math.PI * .01);

  requestAnimationFrame(animate);
  //renderer.render(scene, camera)
  composer.render();
}
animate();