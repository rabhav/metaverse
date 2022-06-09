import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);
//this._mixers = [];

// LIGHTS

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xfffff);
scene.add(pointLight, ambientLight);

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper)

// CAMERA
const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;


const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.set(5, 2, 0);




// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth - 200, window.innerHeight - 200);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaOutput = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);
document.body.appendChild(renderer.domElement);
currentTime()



document.getElementById("start").addEventListener('click', function (evt, val) {

    if(animationAction[0].isRunning()){
        animationAction[0].stop();
    }
    if(sound.isPlaying){
        sound.stop();
    }
    var inpValue = document.getElementById("userInput").value;
    animationAction[0]._clip.duration = 60 / inpValue;
    //sound.duration = 60/inpValue;
    var rate = inpValue / 60;

    console.log("rate" + rate);

    if (inpValue < 50) {
        sound.setVolume(10);
    }else {
        sound.setVolume(0.5);
    }
    sound.setPlaybackRate(rate);
    // mixer.addEventListener( 'loop', function( e ) { 
    //     console.log('loop');
    //     sound.play();
        
    // } );
   
    
    animationAction[0].play();
    sound.play();
    setTimeout(function () {
        console.log("test");
        animationAction[0].stop();
        sound.stop();
    }, 60000 - 1);

});

document.getElementById("stop").addEventListener('click', function (evt, val) {
    animationAction[0].stop();
    sound.stop();
});


// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load('./mixkit-human-single-heart-beat-490.wav', function (buffer) {
    sound.setBuffer(buffer);
   // sound.setLoop(true);
    sound.setVolume(0.5);

});




// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0, 1, 0);

var mixer;
var heartmodel;
var modelReady = false
var animationAction = [];
var clock = new THREE.Clock();
const gltfLoader = new GLTFLoader()
gltfLoader.load('./3D Research Human Heart Model File_1.glb', (gltf) => {

    const model = gltf.scene;
    heartmodel = model;
    model.scale.set(1, 1, 1);
    model.traverse(child => {
        if (child.material) child.material.metalness = 1.17;
    });

    model.overrideMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
    mixer = new THREE.AnimationMixer(gltf.scene);
    var action = mixer.clipAction(gltf.animations[0]);
    animationAction.push(action);

    gltfLoader.load('./3D Research Model File_superfastanimation.glb', (gltf) => {
        var action = mixer.clipAction(gltf.animations[0]);
        animationAction.push(action);
    });

    gltfLoader.load('./3D Research Model File_Slow.glb', (gltf) => {
        var action = mixer.clipAction(gltf.animations[0]);
        animationAction.push(action);
    });


    scene.add(gltf.scene)

});


function animate() {
    requestAnimationFrame(animate)
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    orbitControls.update()

    render()

}

function render() {
    renderer.render(scene, camera)
}



animate()

function currentTime() {
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let session = "AM";

    if (hh === 0) {
        hh = 12;
    }
    if (hh > 12) {
        hh = hh - 12;
        session = "PM";
    }

    hh = (hh < 10) ? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;
    ss = (ss < 10) ? "0" + ss : ss;

    let time = hh + ":" + mm + ":" + ss + " " + session;

    document.getElementById("clock").innerText = time;
    let t = setTimeout(function () { currentTime() }, 1000);
}
