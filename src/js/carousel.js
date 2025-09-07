// // import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";
// // import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
// // import { EffectComposer } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/EffectComposer.js';
// // import { RenderPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/RenderPass.js';
// import { BloomPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BloomPass.js';
// // import { BokehPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BokehPass.js';
// import { OutlinePass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/OutlinePass.js';
// import { FilmPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/FilmPass.js';
// // import { ShaderPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/ShaderPass.js';
// import { mergeBufferGeometries, mergeVertices } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/utils/BufferGeometryUtils.js';
// // import { FXAAShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/shaders/FXAAShader.js';
// import { GodRaysDepthMaskShader, GodRaysGenerateShader, GodRaysCombineShader, GodRaysFakeSunShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/shaders/GodRaysShader.js';
// import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
// // import { PLYLoader } from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/PLYLoader.js';
// import { OutlineEffect } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/effects/OutlineEffect.js';
// // import { OutputPass } from 'https://cdn.skypack.dev/pin/three@v0.136.0-5VP7l7KayxPjnuc5YHYV/mode=raw/examples/jsm/postprocessing/OutputPass.js';
// // import { DepthOfFieldEffect } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/DepthOfFieldEffect.js';
// // import threeBufferGeometryUtils from 'https://cdn.jsdelivr.net/npm/three-buffer-geometry-utils@1.0.0/+esm';
// // import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
// // import geomMerge from 'https://cdn.jsdelivr.net/npm/geom-merge@3.0.0/index.min.js'
import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';



let sectionAbout = document.querySelector('.section__about');
let camera, scene, renderer, renderPass, bokehPass, composer;
// let mesh;
let textures = [
    `../img/1.png`,
    `../img/2.png`,
    `../img/3.png`,
    `../img/4.png`,
    `../img/5.png`,
    `../img/6.png`,
    `../img/7.png`,
    `../img/8.png`,
];

init();

function init() {

    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x000000, 3.2, 6);
    // scene.background = new THREE.Color(0x000000);
    // scene.background = null;
    // scene.background = new THREE.Color(0xcccccc);
    
    // camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100);
    // camera.position.set(0.2, 0.1, 1).setLength(6.5);
    // camera.lookAt(new THREE.Vector3(0, 0, 1));
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 0, 0, 6.5 );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = 'carousel';
    // sectionAbout.appendChild(renderer.domElement);
    sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

    let spotLight = new THREE.SpotLight( 0xffffff, 20 );
    spotLight.position.set( 1.5, 2, 3 );
    spotLight.target.position.set( 1.5, 0, 0 );
    scene.add( spotLight.target);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 1;
    spotLight.decay = 2;
    spotLight.distance = 0;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.focus = 1;
    spotLight.shadow.bias = - .003;
    scene.add( spotLight );

    
    const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.15 );
    scene.add( ambient );

    // let lightHelper = new THREE.SpotLightHelper( spotLight );
    // scene.add( lightHelper );


    createCarousel();

    // postEffects();

    onWindowResize();

    // const controls = new OrbitControls( camera, renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );
    sectionAbout.addEventListener( 'wheel', wheelCarousel );


    renderer.setAnimationLoop( animate );
}

function createCarousel() {

    new PLYLoader().load( '../models/Lucy100k.ply', function ( geometry ) {

        geometry.scale( 0.0024, 0.0024, 0.0024 );
        geometry.computeVertexNormals();

        const material = new THREE.MeshLambertMaterial();

        let mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.y = - Math.PI / 0.9;
        mesh.position.x = 1.5;
        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add( mesh );

    } );

}

function postEffects() {

    renderPass = new RenderPass( scene, camera );

    bokehPass = new BokehPass( scene, camera, {
        focus: 3.4,
        aperture: 0.01,
        maxblur: 0.005
    } );

    composer = new EffectComposer( renderer );
    let effectFXAA = new ShaderPass( FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    composer.addPass( effectFXAA );
    composer.addPass( renderPass );
    composer.addPass( bokehPass );

}

function onWindowResize() {

    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const dpr = renderer.getPixelRatio();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    if (scene.children[3]) scene.children[3].rotation.y += 0.002;

    renderer.render(scene, camera);
    // composer.render();

}

function wheelCarousel(event) {
    scene.children[3].rotation.y += -event.deltaX * 0.002
};
