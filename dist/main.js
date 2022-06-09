import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

var value;
// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );


// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xfffff);
scene.add(pointLight, ambientLight);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

// CAMERA
const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(3,2,0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth-10, window.innerHeight-55);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaOutput = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);
document.body.appendChild(renderer.domElement);
currentTime()
document.getElementById("userInput").addEventListener('change', function (evt, val) {
    value = evt.currentTarget.value ;
 });

 document.getElementById("start").addEventListener('click', function (evt, val) {
  
  action.getClip().duration= 60/value;
  var rate =value/60;
  
 sound.setPlaybackRate(rate);
  sound.play();
  action.play();
  
       setTimeout(function () {
           action.stop();
           sound.stop();
       }, 60000-1);
 });
document.getElementById("stop").addEventListener('click', function (evt, val) {
  action.stop();
  sound.stop();

});

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( './sound/mixkit-human-single-heart-beat-490.wav', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop(true);
	sound.setVolume(1);
    
});

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0,0.8, 0);
//orbitControls.update();


 // TEXTURES
 const textureLoader = new THREE.TextureLoader();
 const diffuseImag = textureLoader.load("./textures/material_0_diffuse.png");
 const EmissiveImag = textureLoader.load("./textures/material_0_emissive.png");
 const NormalImg = textureLoader.load("./textures/material_0_normal.png");
 const OcclusionImg = textureLoader.load("./textures/material_0_occlusion.png");
 const SpecularImg = textureLoader.load("./textures/material_0_specularGlossiness.png");
 diffuseImag.flipY = false;
 //var my_material = new THREE.MeshBasicMaterial({map: textureLoader});

var mixer;
var clock = new THREE.Clock();
var action;
var heartModel;
const gltfLoader = new GLTFLoader()
gltfLoader.load('./models/3D Research Human Heart Model File_1.glb', (gltf) => {
   const model = gltf.scene;
   heartModel = gltf.scene.children[0];
  
    model.scale.set( 1, 1, 1 );
      model.traverse( child => {
        if ((child.isMesh))
        { 
              console.log("Hi");
              child.material.map = diffuseImag;
              child.material.needsUpdate = true;
              child.receiveShadow = true
              child.castShadow = true
             child.material.map.encoding = THREE.sRGBEncoding;
        }
    } );
    mixer = new THREE.AnimationMixer( gltf.scene );
	 action = mixer.clipAction( gltf.animations[ 0 ] );


    scene.add(gltf.scene)
    // const anim = new GLTFLoader();
    //   anim.load('./models/3D Research Human Heart Model File_1.glb', (anim) => {
    //     const m = new THREE.AnimationMixer(model);
    //     //this._mixers.push(m);
    //     const idle = m.clipAction(anim.animations[0]);
    //     idle.play();
    //   });
    //   scene.add(model);
    });


function animate() {
    requestAnimationFrame(animate)
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    orbitControls.update()
    render()

}

function render() {
    renderer.render(scene, camera)
}

animate()

//display clock
function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if(hh === 0){
      hh = 12;
  }
  if(hh > 12){
      hh = hh - 12;
      session = "PM";
   }

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
   ss = (ss < 10) ? "0" + ss : ss;
    
   let time = hh + ":" + mm + ":" + ss + " " + session;

  document.getElementById("clock").innerText = time; 
  let t = setTimeout(function(){ currentTime() }, 1000);
}




  


