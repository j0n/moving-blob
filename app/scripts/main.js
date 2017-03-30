import {setup} from './lib/setup';
const fps = require('fps');
var ticker = fps({
    every: 10   // update every 10 frames
});

var THREE = require('three');

// var Help = require('./lib/draw');
// var CurveLines = require('./lib/curveLine');
// var mouseCircle = require('./lib/mouseCircle');
var moved = 50;
var movingDirection = 'out';
var rounds = 0;
var opacityStrength = 0.1;
var thresholds = {
    max: 9,
    min: 0.5
}

var stpos = {
    x : 0,
    y : 0,
};
var yo = {
    x: 0,
    y: 0
}
var zIndex = 15;
var stop = false;


// THREE.js setup
var renderer = new THREE.WebGLRenderer({
    precision: "mediump", devicePixelRatio:window.devicePixelRatio, antialias:true });
document.body.appendChild( renderer.domElement );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = zIndex;
renderer.setClearColor( 0xf0f0f0);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

//var raycaster = new THREE.Raycaster();
//var mouseVector = new THREE.Vector3();


window.s = scene;

// mouseCircle.init(scene);

var mouseDist = 1;
var angle = 0;
var color = 0x000000;
var opacity = 0.15;
CurveLines.addLine({x: 20, y: 0}, scene);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var fade = false;
var steps = 0;
var linesToFadeout = 0;
var stepping = false;
var steppingDist = 0;

function animate() {
    moved++;

    ticker.tick()
    if (!stop) {
        CurveLines.replaceLastPosition(yo);
        CurveLines.draw();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


document.addEventListener('touchstart', function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    var pos = {
        x : ev.pageX,
        y : ev.pageY
    };
    return false;
});
document.addEventListener('touchmove', function(ev) {
    moved = 0;
    var pos = {
        x : (zIndex ) * ((ev.pageX / window.innerWidth ) * 2 - 1),
        y : (zIndex ) * (-(ev.pageY / window.innerHeight ) * 2 + 1)
    };
    mouseDist = Help.dist(stpos, pos);
});

document.addEventListener('mousedown', function(ev) {
     stop = !stop;
     if (!stop) {
        animate();
     }
});
window.addEventListener( 'resize', onWindowResize, false );


// fps fixer for devices with low cpus
var lowFpsCounter = 0;
var lowFpsThreshold = 40;
ticker.on('data', function(fps) {
    if (fps < lowFpsThreshold) {
        lowFpsCounter++;
        if (lowFpsCounter > 4) {
            if (lowFpsThreshold > 7) {
                lowFpsThreshold -= 5;
            }
            if (lowFpsThreshold < 30) {
                opacityStrength = 0.2;
            }
            lowFpsCounter = 0;
            CurveLines.lesserSegements();
        }
    }
});

// Start animating
animate();
