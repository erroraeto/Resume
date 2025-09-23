import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RenderTransitionPass } from 'three/addons/postprocessing/RenderTransitionPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as TWEEN from 'three/addons/libs/tween.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



let sectionAbout = document.querySelector('.section__about');
// let camera, scene, renderer, renderPass, bokehPass, composer;
// // let mesh;
// let textures = [
//     `../img/1.png`,
//     `../img/2.png`,
//     `../img/3.png`,
//     `../img/4.png`,
//     `../img/5.png`,
//     `../img/6.png`,
//     `../img/7.png`,
//     `../img/8.png`,
// ];

// init();

// function init() {

//     // scene = new THREE.Scene();

//     // camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
//     // camera.position.set( 0, 1.8, 6.5 );

//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.domElement.className = 'carousel';
//     // sectionAbout.appendChild(renderer.domElement);
//     sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

//     // let spotLight = new THREE.SpotLight( 0xffffff, 20 );
//     // spotLight.position.set( 1.5, 6, 3 );
//     // spotLight.target.position.set( 1.5, 0, 0 );
//     // scene.add( spotLight.target);
//     // spotLight.angle = Math.PI / 6;
//     // spotLight.penumbra = 1;
//     // spotLight.decay = 2;
//     // spotLight.distance = 0;
//     // spotLight.castShadow = true;
//     // spotLight.shadow.mapSize.width = 1024;
//     // spotLight.shadow.mapSize.height = 1024;
//     // spotLight.shadow.camera.near = 1;
//     // spotLight.shadow.camera.far = 10;
//     // spotLight.shadow.focus = 1;
//     // spotLight.shadow.bias = - .003;
//     // scene.add( spotLight );

    
//     // const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.15 );
//     // scene.add( ambient );

//     // let lightHelper = new THREE.SpotLightHelper( spotLight );
//     // scene.add( lightHelper );


//     // createCarousel();

//     // postEffects();

//     onWindowResize();

//     // const controls = new OrbitControls( camera, renderer.domElement );

//     window.addEventListener( 'resize', onWindowResize );
//     sectionAbout.addEventListener( 'wheel', wheelCarousel );


//     renderer.setAnimationLoop( animate );
// }

// function createCarousel() {

//     // new PLYLoader().load( '../models/Bust-HP.ply', function ( geometry ) {
//     //     geometry.scale( 1, 1, 1 );
//     //     geometry.computeVertexNormals();

//     //     const material = new THREE.MeshLambertMaterial({});

//     //     let mesh = new THREE.Mesh( geometry, material );
//     //     mesh.rotation.y = - Math.PI / 0.9;
//     //     mesh.position.x = 1.5;
//     //     mesh.position.y = 1.7;
//     //     mesh.position.z = 0;
//     //     mesh.castShadow = true;
//     //     mesh.receiveShadow = true;
//     //     scene.add( mesh );

//     // } );


//     // new PLYLoader().load( '../models/Lucy100k.ply', function ( geometry ) {
//     // new OBJLoader().load( '../models/Bust.obj', function ( group ) {
//     new PLYLoader().load( '../models/Bust.ply', function ( geometry ) {

//         // geometry.scale( 0.0024, 0.0024, 0.0024 );
//         geometry.scale( 1, 1, 1 );
//         geometry.computeVertexNormals();

//         const normalMapTexture = new THREE.TextureLoader().load('../models/texture/normal-map.png');
//         const displacementMapTexture = new THREE.TextureLoader().load('../models/texture/displacement.jpg');
//         const texture = new THREE.TextureLoader().load('../models/texture/color.jpg');


//         const material = new THREE.MeshLambertMaterial({
//             map: texture,
//             // normalMap: normalMapTexture,
//             // normalScale: new THREE.Vector2(-.4, -.4),
//             // displacementMap: displacementMapTexture,
//             // displacement: .01,
//             // wireframe: true,
//         });

//         let mesh = new THREE.Mesh( geometry, material );
//         // mesh.rotation.x = 90;
//         mesh.rotation.y = - Math.PI / 0.9;
//         mesh.position.x = 1.5;
//         mesh.position.y = 1.7;
//         mesh.position.z = 0;
//         mesh.castShadow = true;
//         mesh.receiveShadow = true;
//         scene.add( mesh );

//     } );

// }

// function postEffects() {

//     renderPass = new RenderPass( scene, camera );

//     bokehPass = new BokehPass( scene, camera, {
//         focus: 3.4,
//         aperture: 0.01,
//         maxblur: 0.005
//     } );

//     composer = new EffectComposer( renderer );
//     let effectFXAA = new ShaderPass( FXAAShader );
//     effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
//     effectFXAA.renderToScreen = true;
//     composer.addPass( effectFXAA );
//     composer.addPass( renderPass );
//     composer.addPass( bokehPass );

// }

// function onWindowResize() {

//     // const aspect = window.innerWidth / window.innerHeight;
//     // camera.aspect = aspect;
//     // camera.updateProjectionMatrix();

//     const dpr = renderer.getPixelRatio();
//     renderer.setSize( window.innerWidth, window.innerHeight );

// }

// function animate() {

//     // if (scene.children[3]) scene.children[3].rotation.y += 0.002;

//     renderer.render(scene, camera);
//     // composer.render();

// }

// function wheelCarousel(event) {
//     scene.children[3].rotation.y += -event.deltaX * 0.002
// };























let renderer;
const model = [],
    scenes = [];
const transitionParams = {
//   useTexture: true,
    transition: 0,
    texture: 5,
    cycle: true,
    animate: true,
//   threshold: 0.3,
};
let i = 0,
    j = 1;

function getTransition({ renderer, sceneA, sceneB }) {
// function getTransition({ renderer, scenes }) {

    const scene = new THREE.Scene();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -10, 10);

    const textures = [];
    const loader = new THREE.TextureLoader();

    textures[0] = loader.load(`../img/texture/transition${[0]}.png`);

    const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            tDiffuse1: {
                value: null,
            },
            tDiffuse2: {
                value: null,
            },
            mixRatio: {
                value: 0.0,
            },
            threshold: {
                value: 0.1,
            },
            useTexture: {
                value: 1,
            },
            tMixTexture: {
                value: textures[0],
            },
        },
    vertexShader: `varying vec2 vUv;
        void main() {
            vUv = vec2( uv.x, uv.y );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
    fragmentShader: `
        uniform float mixRatio;
        uniform sampler2D tDiffuse1;
        uniform sampler2D tDiffuse2;
        uniform sampler2D tMixTexture;
        uniform int useTexture;
        uniform float threshold;
        varying vec2 vUv;

        void main() {
            vec4 texel1 = texture2D( tDiffuse1, vUv );
            vec4 texel2 = texture2D( tDiffuse2, vUv );

            if (useTexture == 1) {
                vec4 transitionTexel = texture2D( tMixTexture, vUv );
                float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
                float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);

                gl_FragColor = sRGBTransferOETF( mix( texel1, texel2, mixf ) );
            } else {
                gl_FragColor = sRGBTransferOETF( mix( texel2, texel1, mixRatio ) );
            }
        }`,
    });

    const geometry = new THREE.PlaneGeometry(w, h);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    material.uniforms.tDiffuse1.value = sceneA.fbo.texture;
    material.uniforms.tDiffuse2.value = sceneB.fbo.texture;
    // material.uniforms.tDiffuse1.value = scenes[i].fbo.texture;
    // material.uniforms.tDiffuse2.value = scenes[j].fbo.texture;

    new TWEEN.Tween(transitionParams)
        .to({ transition: 1 }, 2000)
        .repeat(Infinity)
        .delay(2000)
        .yoyo(true)
        .start();

    const render = () => {
    // Transition animation
        if (transitionParams.animate) TWEEN.update();

        material.uniforms.mixRatio.value = transitionParams.transition;

        // Prevent render both scenes when it's not necessary
        if (transitionParams.transition === 0) {
            sceneA.update();
            sceneB.render(false);
            // scenes[i].update();
            // scenes[j].render(false);
        } else if (transitionParams.transition === 1) {
            sceneA.render(false);
            sceneB.update();
            // scenes[i].render(false);
            // scenes[j].update();
        } else {
            // When 0<transition<1 render transition between two scenes
            sceneA.render(true);
            sceneB.render(true);
            // scenes[i].render(true);
            // scenes[j].render(true);

            renderer.setRenderTarget(null); // null sets the rt to the canvas
            renderer.render(scene, camera);
        }
        // transition = getTransition({ renderer, sceneA: scenes[i], sceneB: scenes[j] });
        // i < scenes.length-1 ? i++ : i = 0;
        // j < scenes.length-1 ? j++ : j = 0;
    };

    return { render };
}

function getFXScene({ renderer, source, material = false }) {

    const w = window.innerWidth;
    const h = window.innerHeight;

    const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 0, 1.8, 6.5 );

    // Setup scene
    const scene = new THREE.Scene();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

    
    function positionate(mesh) {
        mesh.rotation.y = - Math.PI / 0.9;
        mesh.position.x = 1.5;
        mesh.position.y = 1.7;
        mesh.position.z = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add( mesh );
        model.push(mesh);
    }

    if (material) {
        new PLYLoader().load( source, function ( geometry ) {
            geometry.scale( 1, 1, 1 );
            geometry.computeVertexNormals();
            let mesh = new THREE.Mesh( geometry, material );
            positionate(mesh);
        });
    } else {
        const texture = new THREE.TextureLoader().load( source, (loadedTexture) => {
            const aspectRatio = loadedTexture.image.width / loadedTexture.image.height;
            mesh.scale.set(aspectRatio, 1, 1);
        });
        const geometry = new THREE.PlaneGeometry( -3, 3);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        let mesh = new THREE.Mesh(geometry, material);
        positionate(mesh);
    }



    const fbo = new THREE.WebGLRenderTarget(w, h);

    const update = () => {
        if (scene.children[1]) scene.children[1].rotation.y += 0.002;
    }

    const render = (rtt) => {
        update();

        if (rtt) {
            renderer.setRenderTarget(fbo);
            renderer.clear();
            renderer.render(scene, camera);
        } else {
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
        }
    };

  return { fbo, render, update };
};

const clock = new THREE.Clock();
let transition;
init();
animate();

function init() {
    const container = sectionAbout;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const sceneA = getFXScene({
        renderer,
        source: '../img/Ref.png',
    });
    scenes.push(sceneA);

    const sceneB = getFXScene({
        renderer,
        source: '../models/Bust-HP.ply',
        material: new THREE.MeshLambertMaterial({})
    });
    scenes.push(sceneB);

    const sceneC = getFXScene({
        renderer,
        source: '../models/Bust.ply',
        material: new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load("../img/texture/Unwrap.webp"),
            transparent: true,
        }),
    });
    scenes.push(sceneC);

    const sceneD = getFXScene({
        renderer,
        source: '../img/Unwrap.webp',
    });
    scenes.push(sceneD);

    transition = getTransition({ renderer, sceneA, sceneB });
    // transition = getTransition({ renderer, scenes });
};

function animate() {
    requestAnimationFrame(animate);
    transition.render(clock.getDelta());
    // transition = getTransition({ renderer, sceneA: scenes[i], sceneB: scenes[j] });
    // i < scenes.length-1 ? i++ : i = 0;
    // j < scenes.length-1 ? j++ : j = 0;
};

sectionAbout.addEventListener( 'wheel', wheelCarousel );

function wheelCarousel(event) {
    for (let i = 0; i < model.length; i++) {
        model[i].rotation.y += -event.deltaX * 0.002
    }
};