const preload = () => {

  const manager = new THREE.LoadingManager();
  manager.onLoad = function() { 

    const environment = new Environment( texture, sound, sound2 );
  }

  const texture = new THREE.TextureLoader(manager).load( 'https://res.cloudinary.com/dydre7amr/image/upload/v1614177581/donutCool_vsn6dj.jpg');
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 3, 1 );

  const listener = new THREE.AudioListener();
  const sound = new THREE.Audio( listener )
  const audioLoader = new THREE.AudioLoader( manager );

  audioLoader.load( 'https://res.cloudinary.com/dydre7amr/video/upload/v1614098506/oh_n2uhmg.mp3' , function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( false );
      sound.setVolume( 0.1 );
  });

  const listener2 = new THREE.AudioListener();
  const sound2 = new THREE.Audio( listener2 )
  const audioLoader2 = new THREE.AudioLoader( manager );

  audioLoader2.load( 'https://res.cloudinary.com/dydre7amr/video/upload/v1614098507/bonus_z8ky30.mp3', function( buffer ) {
      sound2.setBuffer( buffer );
      sound2.setLoop( false );
      sound2.setVolume( 0.1 );
  });
}

if ( document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)
)
  preload ();
else
  document.addEventListener("DOMContentLoaded", preload ); 

class Environment {

  constructor( textures, sound, sound2 ){
    
    console.log( textures, sound, sound2 )

    this.textures = textures;
    this.sound = sound;
    this.sound2 = sound2;
    this.container = document.querySelector( '#magic' );
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xFFFFFF)
    this.mouse =  new THREE.Vector2();
    this.currentPosition = new THREE.Vector3();
    this.shot = false;
    this.deep = 40;
    this.cont = 0;
    this.theWall = false;
    this.moviola = 1;
    this.durationDonut = 35;
    this.score = 0;

    this.createCamera();
    this.createRenderer();
    this.setup()
    this.bindEvents();
  }
  
  setup(){ 

    //ligths

    this.ambientLight = new THREE.AmbientLight( 0xf5f7d4, .6 )
    this.directionLight = new THREE.DirectionalLight( 0xFFFFFF, .5)
    this.directionLight.position.set( 4, 5, 2)

    this.scene.add( this.ambientLight, this.directionLight )

    //Material donut

    this.geometryDonut = new THREE.TorusGeometry( 2, 1, 10, 80 );
    this.materialDonut = new THREE.MeshStandardMaterial( { color: 0xFFFFFF, map: this.textures, roughness: .5 } );

    // Homer

    this.homer = new THREE.Group();
    this.scene.add( this.homer )
    this.homer.visible = false;

      //face

      const geometry = new THREE.CylinderGeometry( 5, 5, 9, 64 );
      const material = new THREE.MeshStandardMaterial( {color: 0xffff00} );

      const geometrySphere = new THREE.SphereGeometry( 5, 64, 64 );
      geometrySphere.translate( 0, 4.5, 0 )

      const geometrySphere2 = new THREE.SphereGeometry( 5, 64, 64 );
      geometrySphere2.translate( 0, -4.5, 0 )

      const mergeGeo = THREE.BufferGeometryUtils.mergeBufferGeometries([ geometry, geometrySphere, geometrySphere2 ], false);
      const face = new THREE.Mesh( mergeGeo, material )
      face.rotation.x = Math.PI * - .05;
      this.homer.add( face )

      //eyes

      const geometryEye1 = new THREE.SphereGeometry( 1.9, 32, 32 );
      const materialEye1 = new THREE.MeshStandardMaterial( {color: 0xffffff } );
      const eye1  = new THREE.Mesh( geometryEye1, materialEye1 );
      eye1.name = 'eye1';
      this.homer.add( eye1 )

      eye1.position.set( 1.8, 1.5, 4 )

      const geometryPupil1 = new THREE.SphereGeometry( .5, 32, 32 );
      const materialPupil1 = new THREE.MeshStandardMaterial( {color: 0x000000 } );
      const pupil1  = new THREE.Mesh( geometryPupil1, materialPupil1 );
      pupil1.name = 'pupil1';
      eye1.add( pupil1 );

      pupil1.position.set( 0, 0, 1.5 )

      const geometryEye2 = new THREE.SphereGeometry( 1.9, 32, 32 );
      const eye2  = new THREE.Mesh( geometryEye2, materialEye1 );
      eye2.name = 'eye2';
      this.homer.add( eye2 )

      eye2.position.set( -1.8, 1.5, 4 )

      const geometryPupil2 = new THREE.SphereGeometry( .5, 32, 32 );
      const pupil2  = new THREE.Mesh( geometryPupil2, materialPupil1 );
      pupil2.name = 'pupil2'
      eye2.add( pupil2 );

      pupil2.position.set( 0, 0, 1.5 )

      //nose

      const nose = new THREE.Mesh( mergeGeo, material )
      nose.scale.set( .15, .15, .15 )
      nose.position.set( 0, -.3, 5 );
      nose.rotation.x = (Math.PI * .5) + Math.PI * - .05;
      this.homer.add( nose )

      //beard

      const geometryBeard = new THREE.SphereGeometry( 5.2, 32, 32 );
      const materialBeard = new THREE.MeshStandardMaterial( {color: 0xd0b37b } );
      const beard  = new THREE.Mesh( geometryBeard, materialBeard );
      this.homer.add( beard )

      beard.scale.set( .9, .77, .9 )
      beard.position.set( 0, -4, 2.2 )

      //hair

      const geometryHair = this.bendTheCone( .07, .07, 2.5, THREE.Math.degToRad(180), 50);
      const hair1 = new THREE.Mesh(geometryHair, materialPupil1);
      this.homer.add( hair1 )
     
      hair1.scale.set( 1.3,1,1)
      hair1.position.set( 0, 7.8  , -.8 )
      hair1.rotation.x = Math.PI * - .05;

      const hair2 = new THREE.Mesh();
      hair2.copy( hair1 )
      this.homer.add( hair2 )
      hair2.position.set( 0, 7.5, -2.5 )

      //pin

      const geometryHair3 = new THREE.CylinderGeometry( .15, .15, 6, 32 );
      geometryHair3.rotateX( Math.PI * - .15 );
      geometryHair3.translate( 10, 0, 0 )

      const geometryHair4 = new THREE.CylinderGeometry( .15, .15, 6, 32 );
      geometryHair4.rotateX( Math.PI * .15 );
      geometryHair4.translate( 10, 0, -2.55 )

      const geometryHair5 = new THREE.CylinderGeometry( .15, .15, 6, 32 );
      geometryHair5.rotateX( Math.PI * -.15 );
      geometryHair5.translate( 10, 0, -5.1 )

      const geometryHair6 = new THREE.CylinderGeometry( .15, .15, 6, 32 );
      geometryHair6.rotateX( Math.PI * .15 );
      geometryHair6.translate( 10, 0, -7.65 )

      const mergePin = THREE.BufferGeometryUtils.mergeBufferGeometries([ geometryHair3, geometryHair4, geometryHair5, geometryHair6 ], false);
      const pin1 = new THREE.Mesh( mergePin, materialPupil1 )

      this.homer.add( pin1 )
      pin1.scale.set( .4, .4, .4)
      pin1.position.set( 1, 1.8, 1)
      pin1.rotation.x = Math.PI * -.05 

      const pin2 = new THREE.Mesh();
      pin2.copy( pin1 )
      this.homer.add( pin2 )
      pin2.position.set( -9, 1.8, 1)

      //ears

      const geometryEar1 = new THREE.SphereGeometry( 1.5, 32, 32 );
      const ear1 = new THREE.Mesh( geometryEar1, material )
      ear1.scale.set( 1, 1, .3)
      this.homer.add( ear1 )
      ear1.position.set ( 4.8, -1, 0)
      ear1.rotation.x = Math.PI * - .05;

      const ear2 = new THREE.Mesh()
      ear2.copy( ear1 )
      this.homer.add( ear2 )
      ear2.position.set ( -4.8, -1, 0)
      ear2.rotation.x = Math.PI * - .05;

      //mouth

      const geometryMouth = this.bendTheCone( .11, .11, 2.5, THREE.Math.degToRad(180), 50);
      const mouth = new THREE.Mesh( geometryMouth, materialPupil1 )
      this.homer.add( mouth )
      mouth.position.set( 0, -3.7, 4.55)
      mouth.scale.set( 1.3,1,1)
      mouth.rotation.x = Math.PI * .6;

    this.widthCanvas = this.visibleWidthAtZDepth( 10, this.camera )
    this.heightCanvas = this.visibleHeightAtZDepth( 10, this.camera )

    //Homer animations

    this.timeline = gsap.timeline();
      this.timeline.fromTo( this.homer.children[1].rotation ,{ x: Math.PI * -.1, y: Math.PI * -.15 },{ x: Math.PI * .1 ,y: Math.PI * .15 , duration: 6,  repeat: -1, yoyo: true  },0);
      this.timeline.fromTo( this.homer.children[2].rotation ,{ x: Math.PI * -.1, y: Math.PI * -.15 },{ x: Math.PI * .1 ,y: Math.PI * .15 , duration: 6, repeat: -1, yoyo: true  },0);
      this.timeline.fromTo( this.homer.children[11].scale ,{ x: 1.1 , y: .95 , z: .95  },{  x: 1.3 , y: 1, z: 1, duration: 2, repeat: -1, yoyo: true  },0);
      this.timeline.fromTo( this.homer.position, { x: this.widthCanvas/2},{ x: -this.widthCanvas/2, ease: "sine.inOut", duration: 12 , repeat: -1, yoyo: true }, 0)
      this.timeline.fromTo( this.homer.position, { y: this.heightCanvas/2.5},{ y: -this.heightCanvas/2.5, ease: "sine.inOut", duration: 2, repeat: -1, yoyo: true }, 0)

  }

  bindEvents(){

    window.addEventListener( 'resize', this.onWindowResize.bind( this ) );
    document.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
    document.addEventListener( 'mouseup', this.onMouseUp.bind( this ) );
    document.querySelector('.playground').addEventListener( 'click', this.onClick.bind( this ) );
    
  }

  onClick(){

    document.querySelector('.playground').style.display = 'none';
    this.homer.visible = true;

  }

  onMouseMove(){

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    const vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5);
    vector.unproject( this.camera );
    const dir = vector.sub( this.camera.position ).normalize();
    const distance = - this.camera.position.z / dir.z;
    this.currentPosition = this.camera.position.clone().add( dir.multiplyScalar( distance ) );

  }

  onMouseUp(){

    if( !this.shot ){

      this.cont = 0;
      this.shot = true;

      this.durationDonut = this.durationDonut - .25;
      if( this.durationDonut <= 3.5 ) this.durationDonut = 3.5;

      const donut = new THREE.Mesh( this.geometryDonut, this.materialDonut );
      this.scene.add( donut );

      gsap.fromTo( donut.position , 
        { x : this.currentPosition.x, y: this.currentPosition.y, z: 30 },
        { z : -100, duration: this.durationDonut,
        onUpdate: this.runGsap,
        onUpdateParams: [ donut, this ],
      });

      gsap.to( donut.rotation, { x: Math.PI * (Math.random() * 4 - 2), y: Math.PI * (Math.random() * 2 - 1), z: Math.PI * (Math.random() * 4 - 2) , duration: 4} )

    }
  }

  runGsap( donut, self ){ 

    if( this.time() > self.durationDonut/2){

        donut.visible = false;
    }

    const d = this.targets()[0].distanceToSquared( self.homer.position );

    if( d <= 55 ){

      if (!self.theWall){

        self.sound.play();
        self.theWall = true;

        self.homer.children[1].children[0].visible = false;
        self.homer.children[2].children[0].visible = false;
        self.homer.children[2].material.color.set( 0xffff00 )

        gsap.fromTo( self.homer.rotation, { y: 0 },{  y: Math.PI * 2 , duration: 2,
          onComplete: self.finishGsap,
          onCompleteParams: [ self ],
        } );
        gsap.fromTo( self.homer.position, { z: 0  }, {  z: 20, repeat:1, yoyo: true, duration: 1 } );
        gsap.fromTo( self.homer.children[11].rotation ,{ x: Math.PI * .6 },{  x: Math.PI * .8 , repeat:1, yoyo: true, duration: 1});

      }
    }
  }

  finishGsap( self ){

    self.homer.children[1].children[0].visible = true;
    self.homer.children[2].children[0].visible = true;
    self.homer.children[2].material.color.set( 0xFFFFFF )
    self.homer.rotation.set(0,0,0)

    self.moviola = self.moviola + .25 ;

    self.timeline.timeScale( self.moviola );
    self.score = self.score + 5000

    document.getElementById("count").innerHTML = self.score;
    self.sound2.play()

    self.theWall = false;

  }

  render() {

    this.cont++;

    if( this.shot ) if( this.cont%40 == 0) this.shot = false;

    this.renderer.render( this.scene, this.camera )
  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera( 65, this.container.clientWidth / this.container.clientHeight, 1, 1000 );
    this.camera.position.set( 0,0, this.deep );

  }

  createRenderer() {

    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
    this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild( this.renderer.domElement );

    this.renderer.setAnimationLoop(() => { this.render() })
  }

  onWindowResize(){

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
  }

  bendTheCone(r1, r2, rMain, theta, segments){

    var geom = new THREE.CylinderGeometry(r1, r2, theta, 16, segments);
    geom.translate(rMain, theta / 2 ,0);
    
    let pos = geom.attributes.position;
    let v = new THREE.Vector3();
    for(let i = 0; i < pos.count; i++){

      v.fromBufferAttribute(pos, i);
      
      pos.setXY(i, Math.cos(v.y) * v.x, Math.sin(v.y) * v.x);
    }

    geom.computeVertexNormals();
    
    return geom;
  }

  visibleHeightAtZDepth ( depth, camera ) {

    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;

    const vFOV = camera.fov * Math.PI / 180; 

    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
  }

  visibleWidthAtZDepth( depth, camera ) {

    const height = this.visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;

  }
}
