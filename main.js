/** 
 * @filename    main.js
 * @brief       Things that every three.js projects needs
 * @author      Sarah Rosanna Busch
 * @version     0
 * @date        17 April 2024
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let container, camera, renderer, scene, controls;
let tick = 0;

init();
function init() {
    //dom elements and event listeners
    container = document.getElementById('container');

    const width = container.clientWidth;
    const height = container.clientHeight;

    // camera
    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    camera.position.z = 5;

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;

    // listeners
    window.addEventListener( 'resize', onWindowResize );
    Object.assign( window, { scene } );

    initObjects(() => {
        console.log('scene is loaded');
        animate();
    });
}

function initObjects(callback) { 
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    callback();
}

function animate(time) { //ms
    if(time >= (tick + 16)) { //enforcing 60fps so animation is same speed on all devices
        tick = time;

        if(resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        controls.update();
        camera.updateProjectionMatrix();

        renderer.render( scene, camera );
    }    
    requestAnimationFrame( animate );
}


// *********** HELPERS **************

//return true if the canvas resolution needs to change
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
}