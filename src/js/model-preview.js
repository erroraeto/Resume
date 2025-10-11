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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { TransformControls, TransformControlsGizmo } from 'three/addons/controls/TransformControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { OBB } from 'three/addons/math/OBB';
// import { Value } from 'sass';

// import { pass, color, rangeFogFactor } from 'three/tsl';

// let sectionAbout = document.querySelector('.section__about');
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






















// -------------------------------TRANSITION SCENES: WORK------------------------------------------------------
// let sectionAbout = document.querySelector('.section__about');
// let phaseList = document.querySelectorAll('.section__about .radio__list input');

// let renderer;
// const model = [],
//     scenes = [];
// const transitionParams = {
// //   useTexture: true,
//     transition: 0,
//     texture: 5,
//     cycle: true,
//     animate: true,
// //   threshold: 0.3,
// };
// let i = 0,
//     j = 1;

// function getTransition({ renderer, sceneA, sceneB }) {
// // function getTransition({ renderer, scenes }) {

//     const scene = new THREE.Scene();
//     const w = window.innerWidth;
//     const h = window.innerHeight;
//     const camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -10, 10);

//     const textures = [];
//     const loader = new THREE.TextureLoader();

//     textures[0] = loader.load(`../img/texture/transition${[0]}.png`);

//     const material = new THREE.ShaderMaterial({
//         transparent: true,
//         uniforms: {
//             tDiffuse1: {
//                 value: null,
//             },
//             tDiffuse2: {
//                 value: null,
//             },
//             mixRatio: {
//                 value: 0.0,
//             },
//             threshold: {
//                 value: 0.1,
//             },
//             useTexture: {
//                 value: 1,
//             },
//             tMixTexture: {
//                 value: textures[0],
//             },
//         },
//     vertexShader: `varying vec2 vUv;
//         void main() {
//             vUv = vec2( uv.x, uv.y );
//             gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//         }`,
//     fragmentShader: `
//         uniform float mixRatio;
//         uniform sampler2D tDiffuse1;
//         uniform sampler2D tDiffuse2;
//         uniform sampler2D tMixTexture;
//         uniform int useTexture;
//         uniform float threshold;
//         varying vec2 vUv;

//         void main() {
//             vec4 texel1 = texture2D( tDiffuse1, vUv );
//             vec4 texel2 = texture2D( tDiffuse2, vUv );

//             if (useTexture == 1) {
//                 vec4 transitionTexel = texture2D( tMixTexture, vUv );
//                 float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
//                 float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);

//                 gl_FragColor = sRGBTransferOETF( mix( texel1, texel2, mixf ) );
//             } else {
//                 gl_FragColor = sRGBTransferOETF( mix( texel2, texel1, mixRatio ) );
//             }
//         }`,
//     });

//     const geometry = new THREE.PlaneGeometry(w, h);
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     material.uniforms.tDiffuse1.value = sceneA.fbo.texture;
//     material.uniforms.tDiffuse2.value = sceneB.fbo.texture;
//     // material.uniforms.tDiffuse1.value = scenes[i].fbo.texture;
//     // material.uniforms.tDiffuse2.value = scenes[j].fbo.texture;

//     new TWEEN.Tween(transitionParams)
//         .to({ transition: 1 }, 2000)
//         .repeat(Infinity)
//         .delay(2000)
//         .yoyo(true)
//         .start();

//     const render = () => {
//     // Transition animation
//         if (transitionParams.animate) TWEEN.update();

//         material.uniforms.mixRatio.value = transitionParams.transition;

//         // Prevent render both scenes when it's not necessary
//         if (transitionParams.transition === 0) {
//             sceneA.update();
//             sceneB.render(false);
//             // scenes[i].update();
//             // scenes[j].render(false);
//         } else if (transitionParams.transition === 1) {
//             sceneA.render(false);
//             sceneB.update();
//             // scenes[i].render(false);
//             // scenes[j].update();
//         } else {
//             // When 0<transition<1 render transition between two scenes
//             sceneA.render(true);
//             sceneB.render(true);
//             // scenes[i].render(true);
//             // scenes[j].render(true);

//             renderer.setRenderTarget(null); // null sets the rt to the canvas
//             renderer.render(scene, camera);
//         }
//         // transition = getTransition({ renderer, sceneA: scenes[i], sceneB: scenes[j] });
//         // i < scenes.length-1 ? i++ : i = 0;
//         // j < scenes.length-1 ? j++ : j = 0;
//     };

//     return { render };
// }

// function getFXScene({ renderer, source, material = false }) {

//     const w = window.innerWidth;
//     const h = window.innerHeight;

//     const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
//     camera.position.set( 0, 1.65, 4.5 );

//     // Setup scene
//     const scene = new THREE.Scene();

//     scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

//     new GLTFLoader().load( source, function ( gltf ) {
//         const model = gltf.scene.children[0];
//         model.material = material;
//         model.position.x = 0.4;
//         model.position.y = 1.7;
//         model.position.z = 0;
//         model.castShadow = true;
//         model.receiveShadow = true;
        
//         scene.add( model );
//     });
    
//     // function positionate(mesh) {
//     //     // mesh.rotation.y = - Math.PI / 0.9;
//     //     // mesh.position.x = 0.4;
//     //     // mesh.position.y = 1.7;
//     //     // mesh.position.z = 0;
//     //     // mesh.castShadow = true;
//     //     // mesh.receiveShadow = true;
//     //     // scene.add( mesh );
//     //     // model.push(mesh);

//     //     mesh.material = material;
//     //     mesh.position.x = 0.4;
//     //     mesh.position.y = 1.7;
//     //     mesh.position.z = 0;
//     //     mesh.castShadow = true;
//     //     mesh.receiveShadow = true;
        
//     //     scene.add( mesh );
//     //     model.push(mesh);
//     // }

//     // if (material) {
//     //     // new PLYLoader().load( source, function ( geometry ) {
//     //     //     geometry.scale( 1, 1, 1 );
//     //     //     geometry.computeVertexNormals();
//     //     //     let mesh = new THREE.Mesh( geometry, material );
//     //     //     positionate(mesh);
//     //     // });
//     //     new GLTFLoader().load( source, function ( gltf ) {
//     //         const model = gltf.scene.children[0];
//     //         model.material = material;
//     //         positionate(model);
//     //     });
//     // } else {
//     //     const texture = new THREE.TextureLoader().load( source, (loadedTexture) => {
//     //         const aspectRatio = loadedTexture.image.width / loadedTexture.image.height;
//     //         mesh.scale.set(aspectRatio, 1, 1);
//     //     });
//     //     const geometry = new THREE.PlaneGeometry( -3, 3);
//     //     const material = new THREE.MeshBasicMaterial({
//     //         map: texture,
//     //         side: THREE.DoubleSide,
//     //         transparent: true,
//     //     });
//     //     let mesh = new THREE.Mesh(geometry, material);
//     //     positionate(mesh);
//     // }



//     const fbo = new THREE.WebGLRenderTarget(w, h);

//     const update = () => {
//         if (scene.children[1]) scene.children[1].rotation.y += 0.002;
//     }

//     const render = (rtt) => {
//         update();

//         if (rtt) {
//             renderer.setRenderTarget(fbo);
//             renderer.clear();
//             renderer.render(scene, camera);
//         } else {
//             renderer.setRenderTarget(null);
//             renderer.render(scene, camera);
//         }
//     };

//   return { fbo, render, update };
// };

// const clock = new THREE.Clock();
// let transition;
// init();
// animate();

// function init() {
//     const container = sectionAbout;

//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     // const sceneA = getFXScene({
//     //     renderer,
//     //     source: '../img/Ref.png',
//     // });
//     // scenes.push(sceneA);

//     const sceneB = getFXScene({
//         renderer,
//         source: '../models/bust-topo.gltf',
//         material: new THREE.MeshLambertMaterial({ side: THREE.DoubleSide })
//     });
//     scenes.push(sceneB);

//     // const sceneC = getFXScene({
//     const sceneA = getFXScene({
//         renderer,
//         source: '../models/bust-sculpt.gltf',
//         material: new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }),
//         // material: new THREE.MeshLambertMaterial({
//         //     map: new THREE.TextureLoader().load("../img/texture/Unwrap.webp"),
//         //     transparent: true,
//         // }),
//     });
//     // scenes.push(sceneC);

//     // const sceneD = getFXScene({
//     //     renderer,
//     //     source: '../img/Unwrap.webp',
//     // });
//     // scenes.push(sceneD);

//     transition = getTransition({ renderer, sceneA, sceneB });
//     // transition = getTransition({ renderer, scenes });
// };

// function animate() {
//     requestAnimationFrame(animate);
//     transition.render(clock.getDelta());
//     // transition = getTransition({ renderer, sceneA: scenes[i], sceneB: scenes[j] });
//     // i < scenes.length-1 ? i++ : i = 0;
//     // j < scenes.length-1 ? j++ : j = 0;
// };

// sectionAbout.addEventListener( 'wheel', wheelCarousel );

// function wheelCarousel(event) {
//     for (let i = 0; i < model.length; i++) {
//         model[i].rotation.y += -event.deltaX * 0.002
//     }
// };




















































// -------------------------------CHANGE TEXTURE: WORK------------------------------------------------------
// let sectionAbout = document.querySelector('.section__about');
// let phaseList = document.querySelectorAll('.section__about .radio__list input');

// let camera, scene, renderer, model, material;

// let changingInProgress = false;

// const textures = [
//     '../img/Fast-learner.webp',
//     '../img/Problem-solving.webp',
//     '../img/texture/bust__uv.png',
//     '../img/uv_grid_opengl.jpg',
//     '../img/texture/bust__normal.webp',
//     '../img/Team-work.webp',
//     '../img/Unwrap.webp'
// ].map((t) => {
//     let texture = new THREE.TextureLoader().load( t );
//     // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     // texture.repeat.set( 1.5, 1.5 );
//     texture.flipY = false;
//     texture.colorSpace = THREE.SRGBColorSpace;
//     return texture;
//     // return new THREE.TextureLoader().load( t );
// });

// const config = {
//     texture1 : textures[0],
//     texture2 : textures[1],
//     blendFactor : 1,
// };

// function init() {

//     // CAMERA
//     camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
//     camera.position.set( 0, 1.65, 4.5 );

//     // SCENE
//     scene = new THREE.Scene();

//     // LIGHT
//     scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

//     // RENDER
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.domElement.className = 'carousel';
//     sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

//     // MODEL
//     // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//     // material = new THREE.MeshLambertMaterial({ map: textures[0] });
//     // material.onBeforeCompile = ( shader ) => {
//     //     shader.uniforms.map0 = material.userData.map0;
//     //     shader.uniforms.mixVal = material.userData.mixVal;

//     //     shader.fragmentShader = `
//     //         uniform sampler2D map0;
//     //         uniform float mixVal;
//     //         ${shader.fragmentShader}
//     //     `.replace(
//     //         `#include <map_fragment>`,
//     //         `
//     //         #ifdef USE_MAP
//     //             vec4 texelColor0 = texture2D( map0, vMapUv );
//     //             vec4 texelColor1 = texture2D( map, vMapUv );
//     //             vec4 texelColor = mix(texelColor0, texelColor1, mixVal);
//     //             diffuseColor *= texelColor;
//     //         #endif
//     //         `
//     //     );
//     // };
//     // material.userData = {
//     //     prevIdx: 0,
//     //     map0:{ value: textures[0] },
//     //     mixVal: { value: 1 },
//     // };

//     // model = new THREE.Mesh( geometry, material );
//     // model.rotation.y = - Math.PI / 0.9;
//     // model.position.x = 0.4;
//     // model.position.y = 1.7;
//     // model.position.z = 0;
//     // model.castShadow = true;
//     // model.receiveShadow = true;
//     // scene.add( model );

//     // new PLYLoader().load( '../models/Bust-HP.ply', function ( geometry ) {
//     //     geometry.scale( 1, 1, 1 );
//     //     geometry.computeVertexNormals();

//     //     material = new THREE.MeshLambertMaterial({ map: textures[0] });
//     //     material.onBeforeCompile = ( shader ) => {
//     //         shader.uniforms.map0 = material.userData.map0;
//     //         shader.uniforms.mixVal = material.userData.mixVal;

//     //         shader.fragmentShader = `
//     //             uniform sampler2D map0;
//     //             uniform float mixVal;
//     //             ${shader.fragmentShader}
//     //         `.replace(
//     //             `#include <map_fragment>`,
//     //             `
//     //             #ifdef USE_MAP
//     //                 vec4 texelColor0 = texture2D( map0, vMapUv );
//     //                 vec4 texelColor1 = texture2D( map, vMapUv );
//     //                 vec4 texelColor = mix(texelColor0, texelColor1, mixVal);
//     //                 diffuseColor *= texelColor;
//     //             #endif
//     //             `
//     //         );
//     //     };
//     //     material.userData = {
//     //         prevIdx: 0,
//     //         map0:{ value: textures[0] },
//     //         mixVal: { value: 1 },
//     //     };

//     //     model = new THREE.Mesh( geometry, material );
//     //     model.rotation.y = - Math.PI / 0.9;
//     //     model.position.x = 0.4;
//     //     model.position.y = 1.7;
//     //     model.position.z = 0;
//     //     model.castShadow = true;
//     //     model.receiveShadow = true;
//     //     scene.add( model );
//     // });

//     // FUNCTION
//     // new GLTFLoader().load( '../models/Bust.gltf', async function ( gltf ) {
//     new GLTFLoader().load( '../models/bust-topo.gltf', async function ( gltf ) {
//         // const model = gltf.scene;
//         const model = gltf.scene.children[0];

//         // await renderer.compileAsync( model, camera, scene );

//         // scene.add( model );

//         // animate();

//         material = new THREE.MeshLambertMaterial({
//             map: textures[0],
//             side: THREE.DoubleSide,
//         });
//         material.onBeforeCompile = ( shader ) => {
//             shader.uniforms.map0 = material.userData.map0;
//             shader.uniforms.mixVal = material.userData.mixVal;

//             shader.fragmentShader = `
//                 uniform sampler2D map0;
//                 uniform float mixVal;
//                 ${shader.fragmentShader}
//             `.replace(
//                 `#include <map_fragment>`,
//                 `
//                 #ifdef USE_MAP
//                     vec4 texelColor0 = texture2D( map0, vMapUv );
//                     vec4 texelColor1 = texture2D( map, vMapUv );
//                     vec4 texelColor = mix(texelColor0, texelColor1, mixVal);
//                     diffuseColor *= texelColor;
//                 #endif
//                 `
//             );
//         };
//         material.userData = {
//             prevIdx: 0,
//             map0:{ value: textures[0] },
//             mixVal: { value: 1 },
//         };


//         // const normalTexture = new THREE.TextureLoader().load('../img/texture/bust__normal.webp');
//         // normalTexture.flipY = false;
//         // material.normalMap = normalTexture
//         // material.normalMapType = THREE.TangentSpaceNormalMap;
//         // material.normalScale.set(10, 10)

//         // model = new THREE.Mesh( geometry, material );
//         model.material = material;
//         // model.rotation.y = - Math.PI / 0.9;
//         model.position.x = 0.4;
//         model.position.y = 1.7;
//         model.position.z = 0;
//         model.castShadow = true;
//         model.receiveShadow = true;

//         scene.add( model );
//     });

//     onWindowResize();
//     window.addEventListener( 'resize', onWindowResize );
//     sectionAbout.addEventListener( 'wheel', wheelCarousel );
//     renderer.setAnimationLoop( animate );
// };

// init();

// function onWindowResize() {
//     renderer.setPixelRatio(devicePixelRatio);
//     renderer.setSize( window.innerWidth, window.innerHeight );
// };

// function animate() {
//     // if (scene.children[1]) scene.children[1].rotation.y += 0.002;
//     if (scene.children[1]) scene.children[1].rotation.z += -0.002;
//     TWEEN.update();
//     renderer.render(scene, camera);
// };

// function changeTexture(idx){

//     // if (idx === material.userData.prevIdx || changingInProgress === true) return;
//     if ( changingInProgress === true ) return;
  
//     material.map = textures[idx];
//     material.userData.map0.value = textures[material.userData.prevIdx];
//     material.userData.prevIdx = idx;

//     material.userData.mixVal.value = 0;
//     new TWEEN.Tween(material.userData.mixVal)
//         .to({value: 1}, 1000)
//         .onStart(() => {changingInProgress = true;})
//         .onComplete(() => {changingInProgress = false;})
//         .start();
// };

// function wheelCarousel(event) {
//     // scene.children[1].rotation.y += -event.deltaX * 0.002;
//     scene.children[1].rotation.z += event.deltaX * 0.002;
// };

// Array.from(phaseList).forEach((radio) => {
//     radio.addEventListener("input", (event) => {
//         changeTexture(event.target.defaultValue);
//         // img.addEventListener("click", event => { changeTexture(idx);})
//         // model.material.map = new THREE.TextureLoader().load( textures[event.target.defaultValue] );
//         // model.material.needsUpdate = true;
//     });
// });









































// -------------------------------CHANGE SCENES: TRY------------------------------------------------------
// let sectionAbout = document.querySelector('.section__about');
// let phaseList = document.querySelectorAll('.section__about .radio__list input');

// let camera, scene, renderer, model, material;

// let changingInProgress = false;

// const textures = [
//     '../img/Fast-learner.webp',
//     '../img/Problem-solving.webp',
//     '../img/texture/bust__uv.png',
//     '../img/uv_grid_opengl.jpg',
//     '../img/texture/bust__normal.webp',
//     '../img/Team-work.webp',
//     '../img/Unwrap.webp'
// ].map((t) => {
//     let texture = new THREE.TextureLoader().load( t );
//     // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     // texture.repeat.set( 1.5, 1.5 );
//     texture.flipY = false;
//     texture.colorSpace = THREE.SRGBColorSpace;
//     return texture;
//     // return new THREE.TextureLoader().load( t );
// });

// const config = {
//     texture1 : textures[0],
//     texture2 : textures[1],
//     blendFactor : 1,
// };










// // let renderer;
// // const model = [],
// const scenes = [];
// const transitionParams = {
// //   useTexture: true,
//     transition: 0,
//     texture: 5,
//     cycle: true,
//     animate: true,
// //   threshold: 0.3,
// };

// const clock = new THREE.Clock();
// let transition;
// init();
// animate();


// function init() {

//     // CAMERA
//     const w = window.innerWidth;
//     const h = window.innerHeight;
//     const cameraTrnsp = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -10, 10);

//     // SCENE
//     const sceneTrnsp = new THREE.Scene();

//     // LIGHT
//     scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

//     // MESH
//     const geometryTrnsp = new THREE.PlaneGeometry(w, h);
//     const meshTrnsp = new THREE.Mesh(geometryTrnsp, materialTrnsp);
//     sceneTrnsp.add(meshTrnsp);

//     // RENDER
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

//     // TRANSITION LAYER
//     const textures = [];
//     const loader = new THREE.TextureLoader();

//     textures[0] = loader.load(`../img/texture/transition${[0]}.png`);

//     const materialTrnsp = new THREE.ShaderMaterial({
//         transparent: true,
//         uniforms: {
//             tDiffuse1: {
//                 value: null,
//             },
//             tDiffuse2: {
//                 value: null,
//             },
//             mixRatio: {
//                 value: 0.0,
//             },
//             threshold: {
//                 value: 0.1,
//             },
//             useTexture: {
//                 value: 1,
//             },
//             tMixTexture: {
//                 value: textures[0],
//             },
//         },
//     vertexShader: `varying vec2 vUv;
//         void main() {
//             vUv = vec2( uv.x, uv.y );
//             gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//         }`,
//     fragmentShader: `
//         uniform float mixRatio;
//         uniform sampler2D tDiffuse1;
//         uniform sampler2D tDiffuse2;
//         uniform sampler2D tMixTexture;
//         uniform int useTexture;
//         uniform float threshold;
//         varying vec2 vUv;

//         void main() {
//             vec4 texel1 = texture2D( tDiffuse1, vUv );
//             vec4 texel2 = texture2D( tDiffuse2, vUv );

//             if (useTexture == 1) {
//                 vec4 transitionTexel = texture2D( tMixTexture, vUv );
//                 float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
//                 float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);

//                 gl_FragColor = sRGBTransferOETF( mix( texel1, texel2, mixf ) );
//             } else {
//                 gl_FragColor = sRGBTransferOETF( mix( texel2, texel1, mixRatio ) );
//             }
//         }`,
//     });

//     materialTrnsp.uniforms.tDiffuse1.value = sceneA.fbo.texture;
//     materialTrnsp.uniforms.tDiffuse2.value = sceneB.fbo.texture;
//     // materialTrnsp.uniforms.tDiffuse1.value = scenes[i].fbo.texture;
//     // materialTrnsp.uniforms.tDiffuse2.value = scenes[j].fbo.texture;

//     new TWEEN.Tween(transitionParams)
//         .to({ transition: 1 }, 2000)
//         .repeat(Infinity)
//         .delay(2000)
//         .yoyo(true)
//         .start();

//     const render = () => {
//     // Transition animation
//         if (transitionParams.animate) TWEEN.update();

//         materialTrnsp.uniforms.mixRatio.value = transitionParams.transition;

//         // Prevent render both scenes when it's not necessary
//         if (transitionParams.transition === 0) {
//             sceneA.update();
//             sceneB.render(false);
//             // scenes[i].update();
//             // scenes[j].render(false);
//         } else if (transitionParams.transition === 1) {
//             sceneA.render(false);
//             sceneB.update();
//             // scenes[i].render(false);
//             // scenes[j].update();
//         } else {
//             // When 0<transition<1 render transition between two scenes
//             sceneA.render(true);
//             sceneB.render(true);
//             // scenes[i].render(true);
//             // scenes[j].render(true);

//             renderer.setRenderTarget(null); // null sets the rt to the canvas
//             renderer.render(scene, camera);
//         }
//         // transition = getTransition({ renderer, sceneA: scenes[i], sceneB: scenes[j] });
//         // i < scenes.length-1 ? i++ : i = 0;
//         // j < scenes.length-1 ? j++ : j = 0;
//     };

//     return { render };

//     const sceneA = getFXScene({
//         renderer,
//         source: '../models/bust-topo.gltf',
//         material: new THREE.MeshLambertMaterial({})
//     });
//     scenes.push(sceneA);

//     const sceneB = getFXScene({
//         renderer,
//         source: '../models/Bust.gltf',
//         material: new THREE.MeshLambertMaterial({})
//     });
//     scenes.push(sceneB);

//     onWindowResize();
//     window.addEventListener( 'resize', onWindowResize );
//     sectionAbout.addEventListener( 'wheel', wheelCarousel );
//     renderer.setAnimationLoop( animate );
// };

// init();

// function onWindowResize() {
//     renderer.setPixelRatio(devicePixelRatio);
//     renderer.setSize( window.innerWidth, window.innerHeight );
// };

// function animate() {
//     // if (scene.children[1]) scene.children[1].rotation.y += 0.002;
//     if (scene.children[1]) scene.children[1].rotation.z += -0.002;
//     TWEEN.update();
//     renderer.render(scene, camera);
// };

// function changeTexture(idx){

//     // if (idx === material.userData.prevIdx || changingInProgress === true) return;
//     if ( changingInProgress === true ) return;
  
//     material.map = textures[idx];
//     material.userData.map0.value = textures[material.userData.prevIdx];
//     material.userData.prevIdx = idx;

//     material.userData.mixVal.value = 0;
//     new TWEEN.Tween(material.userData.mixVal)
//         .to({value: 1}, 1000)
//         .onStart(() => {changingInProgress = true;})
//         .onComplete(() => {changingInProgress = false;})
//         .start();
// };

// function changeScene({ renderer, sceneA, sceneB }) {

//     if ( changingInProgress === true ) return;

//     material.uniforms.tDiffuse1.value = sceneA.fbo.texture;
//     material.uniforms.tDiffuse2.value = sceneB.fbo.texture;

//     new TWEEN.Tween(transitionParams)
//         .to({ transition: 1 }, 2000)
//         .onStart(() => {changingInProgress = true;})
//         .onComplete(() => {changingInProgress = false;})
//         .start();

//     // const render = () => {
//     //     if (transitionParams.animate) TWEEN.update();

//     //     material.uniforms.mixRatio.value = transitionParams.transition;

//     //     if (transitionParams.transition === 0) {
//     //         sceneA.update();
//     //         sceneB.render(false);
//     //     } else if (transitionParams.transition === 1) {
//     //         sceneA.render(false);
//     //         sceneB.update();
//     //     } else {
//     //         sceneA.render(true);
//     //         sceneB.render(true);

//     //         renderer.setRenderTarget(null); // null sets the rt to the canvas
//     //         renderer.render(scene, camera);
//     //     }
//     // };
// };

// function getFXScene({ renderer, source, material = false }) {

//     // CAMERA
//     const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
//     camera.position.set( 0, 1.65, 4.5 );

//     // SCENE
//     const scene = new THREE.Scene();
    
//     // LIGHT
//     scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

//     // MODEL
//     new GLTFLoader().load( source, function ( gltf ) {
//         const model = gltf.scene.children[0];
//         model.material = material;
//         model.material = material;
//         model.position.x = 0.4;
//         model.position.y = 1.7;
//         model.position.z = 0;
//         model.castShadow = true;
//         model.receiveShadow = true;
        
//         scene.add( model );
//     });

//     // RENDER TARGET
//     const fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );

//     // ROTATE
//     const update = () => {
//         if (scene.children[1]) scene.children[1].rotation.y += 0.002;
//     }
    
//     // RENDER
//     const render = (rtt) => {
//         update();

//         if (rtt) {
//             renderer.setRenderTarget(fbo);
//             renderer.clear();
//             renderer.render(scene, camera);
//         } else {
//             renderer.setRenderTarget(null);
//             renderer.render(scene, camera);
//         }
//     };

//   return { fbo, render, update };
// };

// function wheelCarousel(event) {
//     // scene.children[1].rotation.y += -event.deltaX * 0.002;
//     scene.children[1].rotation.z += event.deltaX * 0.002;
// };

// Array.from(phaseList).forEach((radio) => {
//     radio.addEventListener("input", (event) => {
//         // changeTexture(event.target.defaultValue);
//         changeScene(event.target.defaultValue);
//     });
// });





















































// -------------------------------CAROUSEL SCENES: TRY------------------------------------------------------
let sectionAbout = document.querySelector('.section__about');
let phaseList = document.querySelectorAll('.section__about .radio__list input');

// let camera, scene, renderer, model, material;
let camera, scene, raycaster, renderer, control, controls, composer, gimbal, material, stats, groupS;

const pointer = new THREE.Vector2();
// const radius = 5;
let INTERSECTED;
let theta = 0;

const rayMeshes = [];
const models = [];
const group = [];
const step = [];
let fogFar = { value: 12 };

let radius = 5,
    // step,
    changed = 0;

let enableSelection = false;
// let isDragging = false;
// let previousMousePosition = {
//     x: 0,
//     y: 0
// };

async function init() {

    // CAMERA
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    // camera.position.z = -.5;
    groupS = new THREE.Group();
    // groupS.position.z = -.5;
    // gimbal = new THREE.Object3D();
    // gimbal.add(camera);

    // SCENE
    scene = new THREE.Scene();
    
    // FOG
    scene.fog = new THREE.Fog(0x000000, 4, fogFar);
    // scene.fog = new THREE.FogExp2(0xcccccc, 0.01);
    // const scenePass = new Pass( scene, camera );
    // const scenePassViewZ = scenePass.getViewZNode();
    // scene.fog = new THREE.Fog( 0x4080cc, 2.7, 4 );
    // // tone-mapped scene pass
    // const scenePassTM = scenePass.toneMapping( THREE.ACESFilmicToneMapping, 1 );
    // // mix fog using fog factor and fog color
    // const compose = fogFactor.mix( scenePassTM, fogColor );
    // postProcessing = new THREE.PostProcessing( renderer );
    // postProcessing.outputColorTransform = true; // no tone mapping will be applied, only the default color space transform
    // postProcessing.outputNode = compose;
    

    // LIGHT
    scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

    // RAYCASTER
    raycaster = new THREE.Raycaster();

    // RENDER
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

    // STATS
    stats = new Stats();
    sectionAbout.appendChild(stats.dom);

    // CONTROLS
    // let controls = new OrbitControls(camera, renderer.domElement);
    // scene.add(new THREE.GridHelper(10, 10));

    // MODEL
    //          :TEXTURES
    //                    - NORMAL MAP HP
    const textureNormalHP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm-sculpt.webp');
    textureNormalHP.flipY = false;
    //                    - NORMAL MAP LP
    const textureNormalLP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm.webp');
    textureNormalLP.flipY = false;
    //                    - MATCAP
    const textureMatcap = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__matcap.webp');
    textureMatcap.encoding = THREE.SRGBColorSpace;
    //                    - UV GRID
    const textureUvGrid = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__uv-grid.webp' );
    textureUvGrid.flipY = false;
    textureUvGrid.colorSpace = THREE.SRGBColorSpace;
    //                    - PAINT
    const texturePaint = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__paint.webp' );
    texturePaint.flipY = false;
    //                    - WEIGHT
    const textureWeight = new THREE.TextureLoader().load( '../img/texture/texture__weight.webp' );
    textureWeight.flipY = false;

    //          :OBJECTS
    //                   - HP MODEL
    await new GLTFLoader().loadAsync( '../models/bust-highpoly.glb').then((gltf) => {
        const model = gltf.scene.children[0];
        models.push(model);
        rayMeshes.push(model);
    });
    //                   - LP MODEL
    await new GLTFLoader().loadAsync( '../models/bust-lowpoly.glb').then((gltf) => {
        const model = gltf.scene.children[0];
        models.push(model);
        rayMeshes.push(model);
    });
    //                   - WIREFRAME
    await new GLTFLoader().loadAsync( '../models/bust-wireframe.glb').then((gltf) => {
        const lineSeg = gltf.scene.children[0];
        lineSeg.material.transparent = true;
        lineSeg.material.opacity = 0.2;
        models.push(lineSeg);
    });
    //                   - SEAM
    await new GLTFLoader().loadAsync( '../models/bust-seam.glb').then((gltf) => {
        const lineSeg = gltf.scene.children[0];
        lineSeg.material.transparent = true;
        lineSeg.material.opacity = 0.2;
        models.push(lineSeg);
    });
    //                   - RIG
    await new GLTFLoader().loadAsync( '../models/bust-rig.glb').then((gltf) => {
        const lineSeg = gltf.scene.children[0];
        lineSeg.material.transparent = true;
        lineSeg.material.opacity = 0.4;
        models.push(lineSeg);
    });

    // GROUP
    //      :REFERENCE
    await new THREE.TextureLoader().loadAsync( '../img/texture/reference.webp').then((loadedTexture) => {
        const aspectRatio = loadedTexture.image.width / loadedTexture.image.height;
        let mesh = new THREE.Mesh(
            new THREE.PlaneGeometry( 2.5, 2.5),
            new THREE.MeshLambertMaterial({
                map: loadedTexture,
                side: THREE.DoubleSide
            })
        );
        mesh.scale.set(aspectRatio, 1, 1);
        rayMeshes.push(mesh);
        let groupRef = new THREE.Group().add(mesh);
        group.push(groupRef);
    });

    //      :SCULPT
    let groupSculpt = new THREE.Group();
    let sculpt = models[0].clone();
    sculpt.material = new THREE.MeshMatcapMaterial({
        color: new THREE.Color().setHex(0xb0b0b0),
        matcap: textureMatcap,
        normalMap: textureNormalHP,
        side: THREE.DoubleSide
    });
    groupSculpt.add(sculpt);
    group.push(groupSculpt);


    //      :TOPOLOGY
    let groupTopo = new THREE.Group();
    let modelTopo = models[1].clone();
    modelTopo.material = new THREE.MeshLambertMaterial({ normalMap: textureNormalLP, side: THREE.DoubleSide });
    groupTopo.add(modelTopo);
    let lineTopo = models[2].clone();
    groupTopo.add(lineTopo);
    group.push(groupTopo);


    //      :UNWRAP
    let groupUnwrap = new THREE.Group();
    let modelUnwrap = models[1].clone();
    modelUnwrap.material = new THREE.MeshLambertMaterial({
        map: textureUvGrid,
        side: THREE.DoubleSide
    });
    groupUnwrap.add(modelUnwrap);
    let lineUnwrap = models[3].clone();
    lineUnwrap.material = new THREE.LineBasicMaterial({
        color: 0xffff00,
        linewidth: 1,
    });
    groupUnwrap.add(lineUnwrap);
    group.push(groupUnwrap);


    //      :BAKING
    let groupBake = new THREE.Group();
    let modelBake = models[1].clone();
    modelBake.material = new THREE.MeshLambertMaterial({
        map: textureNormalLP,
        side: THREE.DoubleSide
    });
    groupBake.add(modelBake);
    let lineBake = models[2].clone();
    groupBake.add(lineBake);
    group.push(groupBake);


    //      :PAINT
    let groupPaint = new THREE.Group();
    let modelPaint = models[1].clone();
    modelPaint.material = new THREE.MeshLambertMaterial({
        // map: texturePaint,
        normalMap: textureNormalLP,
        side: THREE.DoubleSide
    });
    groupPaint.add(modelPaint);
    group.push(groupPaint);


    //      :RIGGING & SKINNING
    let groupRS = new THREE.Group();
    let modelRS = models[1].clone();
    modelRS.material = new THREE.MeshLambertMaterial({
        map: textureWeight,
        normalMap: textureNormalLP,
        normalMapType: THREE.ObjectSpaceNormalMap,
        side: THREE.DoubleSide
    });
    groupRS.add(modelRS);
    let lineRS = models[4].clone();
    groupRS.add(lineRS);
    group.push(groupRS);


    // COMPOSER
    // composer = new EffectComposer(renderer);
    // composer.addPass(new RenderPass(scene, camera));
    // composer.setSize(window.innerWidth, window.innerHeight);

    // const bokehPass = new BokehPass( scene, camera, {
    //     focus: 4.5,
    //     aperture: 0.01,
    //     maxblur: 0.01
    // } );
    // composer.addPass(bokehPass);

    // step = (360 / models.length);
    // setCircle(models);
    // step = (360 / group.length);
    // step = new Array(group.length).fill().map((g, idx) => {
    //     return 360 / group.length * idx;
    // });
    setCircle(group);

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize );
    // renderer.domElement.addEventListener( 'wheel', wheelCarousel );
    // renderer.domElement.addEventListener( 'mousemove', onPointerMove );
    // renderer.domElement.addEventListener('click', onPointerClick );
    renderer.domElement.addEventListener('dblclick', onPointerDblClick );
    // renderer.domElement.addEventListener( 'pointerdown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener('pointerdown', onPointerDown, false );

    // CONTROLS
    controls = new ArcballControls( camera, renderer.domElement, scene );
    controls.addEventListener( 'change', render );
    controls.setGizmosVisible(false);
    controls.enableFocus = false;
    controls.enableZoom = false;
    controls.enableGrid = false;
    controls.enablePan = false;
    controls.target.set( group[0].position.x, 0, group[0].position.z);
    controls.update();
    controls.enabled = false

    renderer.setAnimationLoop( animate );
    // composer.render(scene, camera);
};

function setCircle(arr) {
    new Array(arr.length).fill().map((g, idx) => {
        let angleStep = THREE.MathUtils.degToRad(360) / arr.length;
        let angle = angleStep * idx;
        arr[idx].position.set( Math.sin(angle) * radius, 0, -Math.cos(angle) * radius );
        arr[idx].lookAt(0, 0, 0);
        // if ( idx != 0 ) arr[idx].visible = false;

        // let bbox = new THREE.Box3().setFromObject(arr[idx], true);
        // const obb = new OBB();
        // obb.fromBox3(bbox);
        // obb.applyMatrix4(arr[idx].matrixWorld);
        // let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
        // scene.add(helper);

        step.push(angle);
        groupS.add(arr[idx]);
    });
    step.push( step[1] * step.length );
    step.unshift(-step[1]);
    scene.add(groupS);
};

init();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );
};

function animate() {
    // if (!drag) camera.rotation.y += ( targetRotation - camera.rotation.y ) * 0.05;
    // if (!controls.enabled) camera.rotation.y += ( targetRotation - camera.rotation.y ) * 0.05;
    // if (!controls.enabled) groupS.rotation.y += ( targetRotation - groupS.rotation.y ) * 0.05;

    TWEEN.update();
    stats.update();
    renderer.render(scene, camera);
    // composer.render(scene, camera);
};

function render() {
    // stats.update();
    renderer.render( scene, camera );
}

// EVENTS
function onPointerDblClick( event ) {
    if (event.type == 'touchstart') {
        pointer.set((event.touches[0].clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.touches[0].clientY / renderer.domElement.clientHeight) * 2 + 1);
    } else {
        pointer.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
    };
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(group);

    if (intersects.length > 0) {
        if (controls.enabled) {
            renderer.domElement.animate({
                    opacity: [1, 0, 1],
                },
                {
                    duration: 1000,
                    easing: 'ease-in-out'
                }
            );
            
            // controls.camera.rotation.set(0, 0, 0);
            // controls.camera.position.set(0, 0, 0);
            // controls.enabled = false;
            // group.forEach( gr => gr.visible = true);
            // renderer.domElement.addEventListener( 'pointerdown', onDocumentMouseDown, false );
            // renderer.domElement.animate(
            //     [
            //         { opacity: 0 },
            //         { opacity: 1 }
            //     ],
            //     {
            //         duration: 1000,
            //         easing: 'ease-in-out'
            //     }
            // );



            // let pos = {};
            // new TWEEN.Tween(camera.rotation)
            //     .to( {x: -0, y: 0, z: -0} , 1000)
            //     .easing(TWEEN.Easing.Cubic.Out)
            //     .start()
            //     .onStart(() => {
            //         pos.x = camera.rotation.x;
            //         pos.y = camera.rotation.y;
            //         pos.z = camera.rotation.z;
            //     })
            //     .onComplete(() => {
            //         new TWEEN.Tween(camera.rotation)
            //             .to( {x: pos.x, y: pos.y, z: pos.z} , 1000)
            //             .easing(TWEEN.Easing.Cubic.Out)
            //             .start()
            //         }
            //     );



            // new TWEEN.Tween(fogFar)
            //     .to( { value: 5 } , 1000)
            //     .easing(TWEEN.Easing.Quadratic.InOut)
            //     .onStart(() => controls.enabled = false)
            //     .onUpdate(() => {
            //         scene.fog = new THREE.Fog(0x000000, 4, fogFar);
            //     })
            //     .onComplete(() => {
            //         group.forEach( gr => gr.visible = true);
            //         controls.enabled = false;
            //         renderer.domElement.addEventListener( 'pointerdown', onDocumentMouseDown, false );
            //     })
            //     .start();
            // new TWEEN.Tween(controls.camera.rotation)
            //     .to( {x: -0, y: 0, z: -0} , 1000)
            //     .easing(TWEEN.Easing.Quadratic.InOut)
            //     .onStart(() => controls.enabled = false)
            //     .onComplete(() => {
            //         group.forEach( gr => gr.visible = true);
            //     })
            //     .start();
            // controls.enabled = false;
            // renderer.domElement.addEventListener( 'pointerdown', onDocumentMouseDown, false );
        } else {
            group.forEach( gr => {
                if (gr != intersects[0].object.parent) return gr.visible = false;
                gr.visible = true;
            });
            controls.enabled = true;
            renderer.domElement.removeEventListener('pointerdown', onPointerDown, false );
            // renderer.domElement.removeEventListener( 'pointerdown', onDocumentMouseDown, false );
        }
    }
};

// let targetRotation = 0;
// let targetRotationOnMouseDown = 0;
// let mouseX = 0;
// let mouseXOnMouseDown = 0;
// let windowHalfX = window.innerWidth;
// // let mousePreviousPosition = 0;
// // let drag = false;

// function onDocumentMouseDown( event ) {
//     // drag = true;
//     // mousePreviousPosition = event.clientX;
//     // targetRotation = camera.rotation.y;
//     targetRotation = groupS.rotation.y;
//     document.addEventListener( 'selectstart', () => {return false} );
//     event.preventDefault();
//     renderer.domElement.addEventListener( 'pointermove', onDocumentMouseMove, false );
//     renderer.domElement.addEventListener( 'pointerup', onPointerLeave, false );
//     renderer.domElement.addEventListener( 'pointerout', onPointerLeave, false );
//     // mouseXOnMouseDown = event.clientX - windowHalfX;
//     mouseXOnMouseDown = -event.clientX;
//     targetRotationOnMouseDown = targetRotation;
// };

// function onDocumentMouseMove( event ) {
//     // let deltaMove = event.clientX - mousePreviousPosition;
//     // camera.rotation.y += deltaMove * 0.0008;
//     // mousePreviousPosition = event.clientX;
//     // mouseX = event.clientX - windowHalfX;
//     mouseX = -event.clientX;
//     targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.002;
// };

// function onPointerLeave(event) {
//     // drag = false;
//     // mouseX = event.clientX - windowHalfX;
//     // targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.002;
//     document.removeEventListener( 'selectstart', () => {return false} );
//     renderer.domElement.removeEventListener( 'pointermove', onDocumentMouseMove, false );
//     renderer.domElement.removeEventListener( 'pointerup', onPointerLeave, false );
//     renderer.domElement.removeEventListener( 'pointerout', onPointerLeave, false );
// };






let previousMousePosition,
    startMousePosition,
    swipeStart;

// renderer.domElement.addEventListener('pointerdown', onPointerDown, false );

function onPointerDown(event) {
    swipeStart = new Date().getTime();

    startMousePosition = previousMousePosition = event.clientX * 3;
    renderer.domElement.addEventListener( 'pointermove', onPointerMove, false );
    renderer.domElement.addEventListener( 'pointerup', onPointerLeave, false );
    renderer.domElement.addEventListener( 'pointerout', onPointerLeave, false );
};

function onPointerMove(event) {
    let deltaMove = (event.clientX * 3) - previousMousePosition;
    groupS.rotation.y += -deltaMove * 0.0008;
    previousMousePosition = event.clientX * 3;
    rotato();
};

function onPointerLeave(event) {
    let setDeg = step.reduce( (prev, curr) => {return (Math.abs(curr - groupS.rotation.y) < Math.abs(prev - groupS.rotation.y) ? curr : prev)});
    let swipeEnd = new Date().getTime();
    let swipeDelay = swipeEnd - swipeStart;
    if ( (swipeDelay < 130) && (swipeDelay > 0) ) {
        if ( (event.clientX * 3) - startMousePosition < 0 ) {
            setDeg = step.reduce( (prev, curr) => { return groupS.rotation.y > prev ? curr : prev });
        } else {
            setDeg = step.reduceRight( (prev, curr) => { return groupS.rotation.y < prev ? curr : prev });
        }
    };

    new TWEEN.Tween(groupS.rotation)
        .to( {y: setDeg} , 400)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    renderer.domElement.removeEventListener( 'pointermove', onPointerMove, false );
    renderer.domElement.removeEventListener( 'pointerup', onPointerLeave, false );
    renderer.domElement.removeEventListener( 'pointerout', onPointerLeave, false );
};

let lastTouch;
renderer.domElement.addEventListener( "touchstart", (ev) => {
    let now = new Date().getTime();
    let touchDelay = now - lastTouch;
    if ( (touchDelay < 180) && (touchDelay > 0) ) {
        onPointerDblClick(ev);
    }
    lastTouch = new Date().getTime();
}, false );








function rotato() {
    if ( groupS.rotation.y > step.at(-1) ) {
        groupS.rotation.y = step.at(1);
    } else if ( groupS.rotation.y <= step.at(0) ) {
        groupS.rotation.y = step.at(-2);
    }
};







// Array.from(phaseList).forEach((radio) => {
//     radio.addEventListener("input", (event) => {
//         changed = event.target.defaultValue;
//         new TWEEN.Tween(controls.camera.position)
//             .to( {x: 0, y: 0, z: 0} , 1000)
//             .easing(TWEEN.Easing.Quadratic.InOut)
//             .onStart(() => controls.enabled = false)
//             .onComplete(() => controls.enabled = true)
//             .start();
//         new TWEEN.Tween(controls.camera.rotation)
//             .to( {x: -0, y: 0, z: -0} , 1000)
//             .easing(TWEEN.Easing.Quadratic.InOut)
//             .onStart(() => controls.enabled = false)
//             .onComplete(() => controls.enabled = true)
//             .start();
//         new TWEEN.Tween(groupS.rotation)
//             // .to( { y: THREE.MathUtils.degToRad(-step * event.target.defaultValue) } , 1000)
//             .to( { y: THREE.MathUtils.degToRad(step * event.target.defaultValue) } , 1000)
//             .easing(TWEEN.Easing.Quadratic.InOut)
//             .onStart(() => {
//                 group.forEach( gr => gr.visible = true);
//                 controls.enabled = false;
//                 controls.reset();
//             })
//             .onComplete(() => {
//                 group.forEach( gr => {
//                     if (gr != group[changed]) {
//                         return gr.visible = false;
//                     }
//                     gr.visible = true;
//                     controls.enabled = true;
//                     controls.update();
//                 });
//                 // controls = new DragControls( group, camera, renderer.domElement );
//             })
//             .delay(1000)
//             .start();
//     });
// });



// function onPointerMove( event ) {
//     pointer.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
//     raycaster.setFromCamera(pointer, camera);
//     // const intersects = raycaster.intersectObjects(rayMeshes, false);
//     // const intersects = raycaster.intersectObjects(group);

//     // if (intersects.length > 0) {
//     //     // intersects[0].object.parent;
//     //     new TWEEN.Tween(intersects[0].object.parent)
//     //         .to( {x: 0, y: 0, z: 0} , 1000)
//     //         .easing(TWEEN.Easing.Quadratic.InOut)
//     //         .onStart(() => controls.enabled = false)
//     //         .onComplete(() => controls.enabled = true)
//     //         .start();
//     // }
// }

// function onPointerClick( event ) {
//     pointer.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
//     raycaster.setFromCamera(pointer, camera);
//     // const intersects = raycaster.intersectObjects(rayMeshes, false);
//     const intersects = raycaster.intersectObjects(group);

//     if (intersects.length > 0) {
//         new TWEEN.Tween(controls.camera.position)
//             .to( {x: 0, y: 0, z: 0} , 1000)
//             .easing(TWEEN.Easing.Quadratic.InOut)
//             .onStart(() => controls.enabled = false)
//             .onComplete(() => controls.enabled = true)
//             .start();
//         new TWEEN.Tween(controls.camera.rotation)
//             .to( {x: 0, y: 0, z: 0} , 1000)
//             .easing(TWEEN.Easing.Quadratic.InOut)
//             .onStart(() => controls.enabled = false)
//             .onComplete(() => controls.enabled = true)
//             .start();
//     }
// };





























    // //          :REFERENCE
    // await new THREE.TextureLoader().loadAsync( '../img/texture/reference.webp').then((loadedTexture) => {
    //     const aspectRatio = loadedTexture.image.width / loadedTexture.image.height;
    //     let mesh = new THREE.Mesh(
    //         new THREE.PlaneGeometry( 2.5, 2.5),
    //         new THREE.MeshLambertMaterial({
    //             map: loadedTexture,
    //             side: THREE.DoubleSide
    //         })
    //     );
    //     mesh.scale.set(aspectRatio, 1, 1);
    //     let group = new THREE.Group().add(mesh);
    //     models.push(group);
    // });

    // //          :SCULPT
    // let groupSculpt = new THREE.Group();
    // let sculpt = models[0];
    // sculpt.material = new THREE.MeshMatcapMaterial({
    //     color: new THREE.Color().setHex(0xb0b0b0),
    //     matcap: textureMatcap,
    //     normalMap: textureNormalHP,
    //     side: THREE.DoubleSide
    // });
    // groupSculpt.add(sculpt);
    // group.push(groupSculpt);
    // // await new GLTFLoader().loadAsync( '../models/bust-sculpt.glb').then((gltf) => {
    // //     const model = gltf.scene.children[0];
    // //     let textureMatcap = new THREE.TextureLoader().load( '../img/texture/texture__matcap.webp' );
    // //     textureMatcap.encoding = THREE.SRGBColorSpace;
    // //     let textureNormal = new THREE.TextureLoader().load( '../img/texture/texture__norm-sculpt.webp' );
    // //     textureNormal.flipY = false;
    // //     model.material = new THREE.MeshMatcapMaterial({
    // //         color: new THREE.Color().setHex(0xb0b0b0),
    // //         matcap: textureMatcap,
    // //         normalMap: textureNormal,
    // //         side: THREE.DoubleSide
    // //     });
    // //     models.push(gltf.scene);
    // // });

    // //          :TOPOLOGY
    // let groupTopo = new THREE.Group();
    // let modelTopo = models[1];
    // modelTopo.material = new THREE.MeshLambertMaterial({ normalMap: textureNormalLP, side: THREE.DoubleSide });
    // groupTopo.add(modelTopo);

    // let lineTopo = models[2];
    // groupTopo.add(lineTopo);

    // group.push(groupTopo);

    // // await new GLTFLoader().loadAsync( '../models/bust-topo.glb').then((gltf) => {
    // //     const model = gltf.scene.children[0];
    // //     let textureNormal = new THREE.TextureLoader().load( '../img/texture/texture__norm.webp' );
    // //     textureNormal.flipY = false;
    // //     model.material = new THREE.MeshLambertMaterial({ normalMap: textureNormal, side: THREE.DoubleSide });

    // //     let group = new THREE.Group();
    // //     group.add(model);
    // //     group.add(lineSegm[0]);

    // //     models.push(group);
    // // });

    // //          :UNWRAP
    // let groupUnwrap = new THREE.Group();
    // let modelUnwrap = models[1];
    // modelUnwrap.material = new THREE.MeshLambertMaterial({
    //     map: textureUvGrid,
    //     side: THREE.DoubleSide
    // });
    // groupUnwrap.add(modelUnwrap);

    // let lineUnwrap = models[3];
    // lineUnwrap.material = new THREE.LineBasicMaterial({
    //     color: 0xffff00,
    //     linewidth: 1,
    // });
    // groupUnwrap.add(lineUnwrap);

    // group.push(groupUnwrap);

    // // await new GLTFLoader().loadAsync( '../models/bust-uv.glb').then((gltf) => {
    // //     const model = gltf.scene.children[0];
    // //     let textureTopo = new THREE.TextureLoader().load( '../img/texture/texture__uv-grid.webp' );
    // //     textureTopo.flipY = false;
    // //     textureTopo.colorSpace = THREE.SRGBColorSpace;
    // //     model.material = new THREE.MeshLambertMaterial({
    // //         map: textureTopo,
    // //         side: THREE.DoubleSide
    // //     });

    // //     const model2 = gltf.scene.children[1];
    // //     model2.material = new THREE.LineBasicMaterial({
    // //         color: 0xffff00,
    // //         linewidth: 1,
    // //     });

    // //     models.push(gltf.scene);
    // // });

    // //          :BAKING
    // let groupBake = new THREE.Group();
    // let modelBake = models[1];
    // modelBake.material = new THREE.MeshLambertMaterial({
    //     map: textureNormalLP,
    //     side: THREE.DoubleSide
    // });
    // groupBake.add(modelBake);

    // let lineBake = models[2];
    // groupBake.add(lineBake);

    // group.push(groupBake);

    // // await new GLTFLoader().loadAsync( '../models/bust-bake.glb').then((gltf) => {
    // //     const model = gltf.scene.children[1];
    // //     let textureNormal = new THREE.TextureLoader().load( '../img/texture/texture__norm.webp' );
    // //     textureNormal.flipY = false;
    // //     textureNormal.colorSpace = THREE.SRGBColorSpace;
    // //     model.material = new THREE.MeshLambertMaterial({
    // //         map: textureNormal,
    // //         side: THREE.DoubleSide
    // //     });

    // //     const model2 = gltf.scene.children[0];
    // //     model2.material.transparent = true;
    // //     model2.material.opacity = 0.2;

    // //     models.push(gltf.scene);
    // // });

    // //          :PAINT
    // let groupPaint = new THREE.Group();
    // let modelPaint = models[1];
    // modelPaint.material = new THREE.MeshLambertMaterial({
    //     // map: texturePaint,
    //     normalMap: textureNormalLP,
    //     normalMapType: THREE.ObjectSpaceNormalMap,
    //     side: THREE.DoubleSide
    // });
    // groupPaint.add(modelPaint);

    // group.push(groupPaint);

    // // await new GLTFLoader().loadAsync( '../models/bust-paint.glb').then((gltf) => {
    // //     const model = gltf.scene.children[0];
    // //     let texturePaint = new THREE.TextureLoader().load( '../img/texture/texture__paint.webp' );
    // //     texturePaint.flipY = false;
    // //     let textureNormal = new THREE.TextureLoader().load( '../img/texture/texture__norm.webp' );
    // //     textureNormal.flipY = false;
    // //     model.material = new THREE.MeshLambertMaterial({
    // //         // map: texturePaint,
    // //         normalMap: textureNormal,
    // //         normalMapType: THREE.ObjectSpaceNormalMap,
    // //         side: THREE.DoubleSide
    // //     });
    // //     models.push(gltf.scene);
    // // });

    // //          :RIGGING & SKINNING
    // let groupRS = new THREE.Group();
    // let modelRS = models[1];
    // modelRS.material = new THREE.MeshLambertMaterial({
    //         map: textureWeight,
    //         normalMap: textureNormalLP,
    //         normalMapType: THREE.ObjectSpaceNormalMap,
    //         side: THREE.DoubleSide
    //     });
    // groupRS.add(modelRS);

    // let lineRS = models[4];
    // groupRS.add(lineRS);

    // group.push(groupRS);

    // // await new GLTFLoader().loadAsync( '../models/bust-rig.glb').then((gltf) => {
    // //     const model = gltf.scene.children[1];
    // //     let textureNormal = new THREE.TextureLoader().load( '../img/texture/texture__norm.webp' );
    // //     textureNormal.flipY = false;
    // //     let textureWeight = new THREE.TextureLoader().load( '../img/texture/texture__weight.webp' );
    // //     textureWeight.flipY = false;
    // //     model.material = new THREE.MeshLambertMaterial({
    // //         map: textureWeight,
    // //         normalMap: textureNormal,
    // //         normalMapType: THREE.ObjectSpaceNormalMap,
    // //         side: THREE.DoubleSide
    // //     });

    // //     const model2 = gltf.scene.children[0];
    // //     model2.material.transparent = true;
    // //     model2.material.opacity = 0.4;

    // //     models.push(gltf.scene);
    // // });
