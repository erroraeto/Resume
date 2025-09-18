import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';



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
    camera.position.set( 0, 1.8, 6.5 );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = 'carousel';
    // sectionAbout.appendChild(renderer.domElement);
    sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

    let spotLight = new THREE.SpotLight( 0xffffff, 20 );
    spotLight.position.set( 1.5, 6, 3 );
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
        mesh.position.y = 1.7;
        mesh.position.z = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add( mesh );

    } );


    // new OBJLoader().load( '../models/Engel.obj', function ( object ) {
    //     object.scale.setScalar( 1.7, 1.7, 1.7 );
    //     // object.rotation.y = Math.PI / 0.12;
    //     object.position.x = 1.5;
    //     object.position.y = 0;
    //     object.position.z = 0;
    //     object.castShadow = true;
    //     object.receiveShadow = true;

    //     object.traverse(function (child) {
    //         if (child instanceof THREE.Mesh) {
    //             child.material = new THREE.MeshLambertMaterial();
    //             child.geometry.computeVertexNormals();
    //         }
    //     });
    //     scene.add(object);
    // } );


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
