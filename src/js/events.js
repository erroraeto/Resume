// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { EffectComposer } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BloomPass.js';
import { BokehPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BokehPass.js';
import { OutlinePass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/OutlinePass.js';
import { FilmPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/ShaderPass.js';
import { mergeBufferGeometries } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/utils/BufferGeometryUtils.js';
import { FXAAShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/shaders/FXAAShader.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
// import {OutputPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r153/examples/jsm/postprocessing/OutputPass.js';
// import threeBufferGeometryUtils from 'https://cdn.jsdelivr.net/npm/three-buffer-geometry-utils@1.0.0/+esm';
// import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
// import geomMerge from 'https://cdn.jsdelivr.net/npm/geom-merge@3.0.0/index.min.js'




// // init
// let gl = document.querySelector('#gl');
// gl.height = gl.clientHeight;
// gl.width = gl.clientWidth;

// let textures = [
// `../img/1.png`,
// `../img/2.png`,
// `../img/3.png`,
// `../img/4.png`,
// `../img/5.png`,
// `../img/6.png`,
// `../img/7.png`,
// `../img/8.png`,].
// map(url => new THREE.TextureLoader().load(url));

// const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10);

// camera.position.z = 1.4;
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();
// // const mouse = new THREE.Vector2(1.5, 1);
// // const mouse = new THREE.Vector3(0, 0, 0);
// // const mouse = new THREE.PlaneGeometry(1.5, 1, 20, 20);








// const scene = new THREE.Scene();
// const geometry = new THREE.PlaneGeometry(1.5, 1, 20, 20);
// // planeCurve(geometry, 0.5);
// const material = new THREE.ShaderMaterial({
//     uniforms: {
//         uTexture: { value: textures[0] },
//         opacity: { value: 1.0 },
//         blend: { value: 0.8 },

//         tMap: { value: textures[0] },
//         uPlaneSize: { value: [0, 0] },
//         uImageSize: { value: [0, 0] },
//         uViewportSize: { value: [window.innerWidth, window.innerHeight] },
//         uTime: { value: 100 * Math.random() },
//         uBlurStrength: { value: 0.1 },
//     },
//     depthTest: false,
//     depthWrite: false,
//     transparent: true,
//     vertexShader: `
//         varying vec2 vUv;

//         void main() {
//             vUv = uv;

//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }




//         // varying vec2 vUv;
//         // void main(){
//         // vUv = uv;
//         // vec3 newposition = position;
//         // float distanceFromCenter = abs(
//         //     (modelMatrix * vec4(position, 1.0)).x
//         // );

//         // // most important
//         // newposition.y *= 1.0 + 0.1*pow(distanceFromCenter,2.);
//         // // newposition.y *= 1.0 + 0.05*pow(distanceFromCenter,2.);

//         // gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
//         // }


//         `,
//     fragmentShader: `
//         uniform sampler2D uTexture;
//         uniform float opacity;
//         uniform float blend;

//         varying vec2 vUv;

//         float getFadeInWeight(vec2 uv) {
//             float edge = 0.4 * abs(sin(0.5));
//             return smoothstep(0., edge, uv.x) * smoothstep(0., edge, 1.-uv.x) * smoothstep(0., edge, uv.y) * smoothstep(0., edge, 1.-uv.y);
//         }

//         void main() {
//             vec4 texelColor = texture2D(uTexture, vUv);
//             float alpha = getFadeInWeight(vUv);
//             // gl_FragColor = vec4(texelColor.rgb, texelColor.a * alpha);
            
            
//             vec4 res = vec4(texelColor.rgb, texelColor.a * alpha);
//             // vec3 finalColor = mix(alpha, uTexture, 1.0);
//             // gl_FragColor = vec4(finalColor, 1.0);

//             gl_FragColor = mix(texelColor, res, blend);
//         }
//     `,
//     // fragmentShader: `
//     //     uniform sampler2D uTexture;
//     //     varying vec2 vUv;
//     //     void main()	{
//     //         gl_FragColor = texture2D(uTexture,vUv);
//     //     }
//     // `
//     // fragmentShader: `
//     //     precision highp float;

//     //     uniform vec2 uImageSize;
//     //     uniform vec2 uPlaneSize;
//     //     uniform vec2 uViewportSize;
//     //     uniform float uBlurStrength;
//     //     uniform float uTime;
//     //     uniform sampler2D tMap;

//     //     varying vec2 vUv;

//     //     /*
//     //     by @arthurstammet
//     //     https://shadertoy.com/view/tdXXRM
//     //     */
//     //     float tvNoise (vec2 p, float ta, float tb) {
//     //         return fract(sin(p.x * ta + p.y * tb) * 5678.);
//     //     }
//     //     vec3 draw(sampler2D image, vec2 uv) {
//     //         return texture2D(image,vec2(uv.x, uv.y)).rgb;   
//     //     }
//     //     float rand(vec2 co){
//     //         return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
//     //     }
//     //     /*
//     //     inspired by https://www.shadertoy.com/view/4tSyzy
//     //     @anastadunbar
//     //     */
//     //     vec3 blur(vec2 uv, sampler2D image, float blurAmount){
//     //     vec3 blurredImage = vec3(0.);
//     //     float gradient = smoothstep(0.8, 0.0, 3.4 - (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength + smoothstep(0.8, 0.0, (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength;
//     //     #define repeats 40.
//     //     for (float i = 0.; i < repeats; i++) { 
//     //             vec2 q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i, uv.x + uv.y)) + blurAmount); 
//     //             vec2 uv2 = uv + (q * blurAmount * gradient);
//     //             blurredImage += draw(image, uv2) / 2.;
//     //             q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i + 2., uv.x + uv.y + 24.)) + blurAmount); 
//     //             uv2 = uv + (q * blurAmount * gradient);
//     //             blurredImage += draw(image, uv2) / 2.;
//     //         }
//     //         return blurredImage / repeats;
//     //     }

//     //     void main() {
//     //         vec2 ratio = vec2(
//     //             min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
//     //             min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
//     //         );

//     //         vec2 uv = vec2(
//     //             vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
//     //             vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
//     //         );

//     //         float t = uTime + 123.0;
//     //         float ta = t * 0.654321;
//     //         float tb = t * (ta * 0.123456);
//     //         vec4 noise = vec4(1. - tvNoise(uv, ta, tb));
            
//     //         vec4 final = vec4(blur(uv, tMap, 0.08), 1.);

//     //         final = final - noise * 0.08;

//     //         gl_FragColor = final;
//     //     }
//     // `,
// });

// for (let i = 0; i < 8; i++) {
//     let m = material.clone();
//     m.uniforms.uTexture.value = textures[i % 8];
//     let mesh = new THREE.Mesh(geometry, m);
//     // mesh.position.x = (i - 15) * 1.7;
//     mesh.position.x = i * 1.7;
//     scene.add(mesh);
// }


// const renderer = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true });
// renderer.setSize(gl.clientWidth, gl.clientHeight);
// renderer.setPixelRatio(devicePixelRatio);
// // renderer.setAnimationLoop(animation);
// // function render() {
// //   requestAnimationFrame(render);
// //   renderer.render(scene, camera);
// // }
// // render();

// const composer = new EffectComposer(renderer);
// composer.addPass(new RenderPass(scene, camera));
// composer.setSize(window.innerWidth, window.innerHeight);
// const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
// outlinePass.edgeStrength = 3;
// outlinePass.edgeThickness = 1;
// outlinePass.visibleEdgeColor.set('#ffffff');
// outlinePass.hiddenEdgeColor.set("#1abaff");
// outlinePass.BlurDirectionX = new THREE.Vector2(0.0, 0.0);
// outlinePass.BlurDirectionY = new THREE.Vector2(0.0, 0.0);
// outlinePass.depthMaterial.morphTargets = true;
// outlinePass.prepareMaskMaterial.morphTargets = true;
// outlinePass.usePatternTexture = false;
// composer.addPass(outlinePass);
// // outlinePass.selectedObjects = [scene.children[0]];
// let effectFXAA;
// effectFXAA = new ShaderPass( FXAAShader );
// effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
// effectFXAA.renderToScreen = true;
// composer.addPass( effectFXAA );

// gl.style.touchAction = 'none';



// let start = null,
// isDown = false,
// startX;

// function step(arg) {

//     if (!start) start = arg;

//     if (typeof arg === 'number') {
//         let progress = arg - start;
//         scene.position.x = 0;
//         renderer.render(scene, camera);
        
//         if (progress < 2000) {
//             requestAnimationFrame(step);
//         }
//     };

//     if (arg.type == 'wheel') {
//         scene.position.x += -arg.deltaX * 0.005;
//         renderer.render(scene, camera);
//         console.log('Delta X:', arg.deltaX);
//         onPointerMove(arg);
//     };

//     // if (arg.type == 'mousemove') {
//     //     const x = arg.pageX;
//     //     const walkX = x - startX;
//     //     scene.position.x += walkX * 0.00005;
//     //     renderer.render(scene, camera);
//     // };


//     // const composer = new EffectComposer(renderer);
//     // composer.addPass(new RenderPass(scene, camera));

//     // const filmPass = new FilmPass(
//     //     0.35,   //интенсивность шума
//     //     0.025,  // интенсивность сканирования
//     //     648,    // количество строк сканирования
//     //     false,  // оттенки серого
//     // );
//     // filmPass.renderToScreen = true;
//     // composer.addPass(filmPass);

//     // const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
//     // composer.addPass(outlinePass);
//     // outlinePass.edgeStrength = 3;
//     // outlinePass.edgeThickness = 1;
//     // outlinePass.visibleEdgeColor.set('#ffffff');
//     // outlinePass.BlurDirectionX = new THREE.Vector2(0.0, 0.0);
//     // outlinePass.BlurDirectionY = new THREE.Vector2(0.0, 0.0);
//     // outlinePass.depthMaterial.morphTargets = true;
//     // outlinePass.prepareMaskMaterial.morphTargets = true;
//     // outlinePass.selectedObjects = [scene.children[0]];
    
//     // composer.addPass( outlinePass );

//     // const bokehPass = new BokehPass( scene, camera, {
//     //     focus: 1.3998,
//     //     aperture: 10.0,
//     //     maxblur: 0.01
//     // } );
//     // composer.addPass(bokehPass);

//     // composer.setSize(window.innerWidth, window.innerHeight);
//     // // composer.render(deltaTime);

//     // let selectedObjects = [];
//     // let effectFXAA;

//     // effectFXAA = new ShaderPass( FXAAShader );
//     // effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
//     // composer.addPass( effectFXAA );

//     // gl.style.touchAction = 'none';
//     // function addSelectedObject( object ) {
//     //     selectedObjects = [];
//     //     selectedObjects.push( object );
//     // }
    

    
//     // gl.addEventListener( 'pointermove', onPointerMove );
    
//     // function onPointerMove( event ) {

//     //     if ( event.isPrimary === false ) return;

//     //     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     //     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//     //     checkIntersection();

//     // }

//     // function checkIntersection() {

//     //     raycaster.setFromCamera( mouse, camera );

//     //     const intersects = raycaster.intersectObject( scene, true );

//     //     if ( intersects.length > 0 ) {

//     //         const selectedObject = intersects[ 0 ].object;
//     //         // addSelectedObject( selectedObject );
//     //         outlinePass.selectedObjects = [selectedObjects[0]];

//     //     } else {

//     //         // outlinePass.selectedObjects = [];

//     //     }

//     // }
//     // requestAnimationFrame(step);
//     composer.render(scene, camera);

// };
// gl.addEventListener('wheel', step);

// // gl.addEventListener("mousemove", (event) => {
// gl.addEventListener( 'pointermove', onPointerMove );

// function onPointerMove( event ) {

//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//     raycaster.setFromCamera( mouse, camera );

//     const intersects = raycaster.intersectObject( scene, true );

//     if ( intersects.length > 0 ) {
//         const selectedObject = intersects[ 0 ].object;
//         // outlinePass.selectedObjects = selectedObjects;
//         outlinePass.selectedObjects = [selectedObject];
//     } else {
//         outlinePass.selectedObjects = [];
//     }
//     composer.render(scene, camera);

// };
// // gl.addEventListener("mousedown", (event) => {
// //     isDown = true;
// //     startX = event.pageX;
// // });
// // gl.addEventListener("mousemove", (event) => {
// //     if (isDown) step(event);
// // });
// // window.addEventListener("mouseup", (event) => {
// //     isDown = false,
// //     startX = 0;
// // });
// requestAnimationFrame(step);





// // let division = { x: 5, y: 5 };
// // let totalAmount = division.x * division.y;

// // let len = totalAmount * 1.1;
// // let r = len / (Math.PI * 2);
// // let segAngle = (Math.PI * 2) / len / 1.1;

// // let seg = new THREE.CylinderGeometry(r, r, 1, 10, 1, true, 0, segAngle);
// // let gs = [];

// // for (let i = 0; i < totalAmount; i++) {
// //   let x = i % division.x;
// //   let y = Math.floor(i / division.x);

// //   let g = seg.clone();
// //   let gUV = g.attributes.uv;
// //   for (let j = 0; j < gUV.count; j++) {
// //     let u = (gUV.getX(j) + x) / division.x;
// //     let v = (gUV.getY(j) + y) / division.y;
// //     gUV.setXY(j, u, v);
// //   }
// //   g.rotateY(((Math.PI * 2) / totalAmount) * i);
// //   gs.push(g);
// // }

// // let g = mergeBufferGeometries(gs);
// // let m = new THREE.MeshBasicMaterial({
// //   side: THREE.DoubleSide,
// // //   wireframe: true,
// // //   map: [
// // //     `../img/1.png`,
// // //     `../img/2.png`,
// // //     `../img/3.png`,
// // //     `../img/4.png`,
// // //     `../img/5.png`,
// // //     `../img/6.png`,
// // //     `../img/7.png`,
// // //     `../img/8.png`,].
// // //     map(url => new THREE.TextureLoader().load(url, (tex) => {
// // //         tex.colorSpace = "srgb";
// // //         tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
// // //     }))
// //   map: new THREE.TextureLoader().load(
// //     "../img/1.png",
// //     (tex) => {
// //       tex.colorSpace = "srgb";
// //       tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
// //     }
// //   )
// // });
// // let carousel = new THREE.Mesh(g, m);
// // scene.add(carousel);



















let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 100);
camera.position.set(0, 0, 1).setLength(1);
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
let carousels = document.querySelector('.carousel');
carousels.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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

window.addEventListener("resize", (event) => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

// let controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

let division = { x: 3, y: 3 };
// let totalAmount = division.x * division.y;
let totalAmount = 7;

let len = totalAmount * 1.1;
let r = len / (Math.PI * 2);
let segAngle = (Math.PI * 2) / len / 1.1;

let seg = new THREE.CylinderGeometry(r, r, 0.5, 10, 1, true, 0, segAngle);
let gs = [];
for (let i = 0; i < totalAmount; i++) {
    let x = i % division.x;
    let y = Math.floor(i / division.x);

    let g = seg.clone();
    let gUV = g.attributes.uv;
    for (let j = 0; j < gUV.count; j++) {
        let u = (gUV.getX(j) + x) / division.x;
        let v = (gUV.getY(j) + y) / division.y;
        gUV.setXY(j, u, v);
    }
    g.rotateY(((Math.PI * 2) / totalAmount) * i);
    gs.push(g);
}

let g = mergeBufferGeometries(gs);
let m = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    //wireframe: true,
    map: drawCarouselTexture(totalAmount)
});
let carousel = new THREE.Mesh(g, m);
scene.add(carousel);

renderer.setAnimationLoop(() => {
    // controls.update();
    renderer.render(scene, camera);
});

function drawCarouselTexture( totalImages = 8, resolution = 512) {
    const gridSize = Math.ceil(Math.sqrt(totalImages));
    const canvasSize = gridSize * resolution;
    
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    Array(totalImages).fill(0).map((_, index) => {
        const image = document.createElement("img");
        image.crossOrigin = "anonymous";
        image.onload = () => drawImageAtIndex(image, index);
        // image.onerror = (error) => console.error(error);
        // image.src = `https://picsum.photos/seed/${Math.random()}/${resolution}/${resolution + 100}`;
        // drawImageAtIndex(image, index);
        image.src = `${textures[index]}`;
    });

    function drawImageAtIndex(img, index) {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = col * resolution;
        const y = row * resolution;
        
        const scale = Math.max(
            resolution / img.width,
            resolution / img.height
        );
        
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        const offsetX = (scaledWidth - resolution) / 2;
        const offsetY = (scaledHeight - resolution) / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, resolution, resolution);
        ctx.clip();
        
        ctx.drawImage(
            img,
            x - offsetX,
            y - offsetY,
            scaledWidth,
            scaledHeight
        );
        // ctx.drawImage(
        //     img,
        //     0,
        //     0,
        //     scaledWidth,
        //     scaledHeight
        // );
        
        ctx.restore();

        texture.needsUpdate = true;
    }
    
    return texture;
}


carousels.addEventListener('wheel', (event) => {
    carousel.rotateY(THREE.MathUtils.degToRad(event.deltaX * 0.05)); 
});

var faceIdx1 = -1,
    faceIdx2 = -1;
var baseColor = new THREE.Color("white");
var selectionColor = new THREE.Color("red");
var intersects = [];

carousels.addEventListener( 'pointermove', (event) => {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    // const intersects = raycaster.intersectObject( scene.children[0], true );

    // if (intersects.length > 0) {
    //     const intersectedObject = intersects[0].object;
    //     // Check if the intersected object has a MeshBasicMaterial
    //     if (intersectedObject.material instanceof THREE.MeshBasicMaterial) {
    //         // Change color or perform other actions
    //         intersectedObject.material.color.set(0xff0000); // Example: change to red
    //     } else {
    //         intersectedObject.material.color.set(0x000000); // Example: change to red
    //     }
    // }

    // intersects = raycaster.intersectObject(box);
    intersects = raycaster.intersectObject( scene.children[0], true );
    if (intersects.length === 0) return;

    // set previously selected faces to white
    setFaceColor(faceIdx1, baseColor);
    setFaceColor(faceIdx2, baseColor);

    // find the new indices of faces
    faceIdx1 = intersects[0].faceIndex;
    faceIdx2 = faceIdx1 % 2 === 0 ? faceIdx1 + 1: faceIdx1 - 1;

    // set newly selected faces to red
    setFaceColor(faceIdx1, selectionColor);
    setFaceColor(faceIdx2, selectionColor);

    // if ( intersects.length > 0 ) {
    //     const selectedObject = intersects[ 0 ].object;
    //     // outlinePass.selectedObjects = selectedObjects;
    //     outlinePass.selectedObjects = [selectedObject];
    // } else {
    //     outlinePass.selectedObjects = [];
    // }
    // composer.render(scene, camera);

});


function setFaceColor(idx, color){
    if (idx === -1) return;
    carousel.geometry.faces[idx].color.copy(color);
    carousel.geometry.colorsNeedUpdate = true;
}



































// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
// import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/EffectComposer.js';
// import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/RenderPass.js';
// import {BloomPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BloomPass.js';
// import {BokehPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BokehPass.js';
// import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/FilmPass.js';

// function main() {
//   const canvas = document.querySelector('#gl');
//   const renderer = new THREE.WebGLRenderer({canvas});

//   const fov = 75;
//   const aspect = 2;  // холст по умолчанию
//   const near = 0.1;
//   const far = 5;
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//   camera.position.z = 2;

//   const scene = new THREE.Scene();

//   {
//     const color = 0xFFFFFF;
//     const intensity = 2;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);
//   }

//   const boxWidth = 1;
//   const boxHeight = 1;
//   const boxDepth = 1;
//   const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

//   function makeInstance(geometry, color, x) {
//     const material = new THREE.MeshPhongMaterial({color});

//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     cube.position.x = x;

//     return cube;
//   }

//   const cubes = [
//     makeInstance(geometry, 0x44aa88,  0),
//     makeInstance(geometry, 0x8844aa, -2),
//     makeInstance(geometry, 0xaa8844,  2),
//   ];

//   const composer = new EffectComposer(renderer);
//   composer.addPass(new RenderPass(scene, camera));

//   const filmPass = new FilmPass(
//       0.35,   //интенсивность шума
//       0.025,  // интенсивность сканирования
//       648,    // количество строк сканирования
//       false,  // оттенки серого
//   );
//   filmPass.renderToScreen = true;
//   composer.addPass(filmPass);

//     const bokehPass = new BokehPass( scene, camera, {
//         focus: 1.5,
//         aperture: 0.05,
//         maxblur: 0.01
//     } );
//     composer.addPass(bokehPass);

    
// //   const bloomPass = new BloomPass(
// //       1,    // сила
// //       25,   // размер ядра
// //       4,    // sigma ?
// //       256,  // целевое разрешение рендеринга размытия
// //   );
// //   composer.addPass(bloomPass);


//   function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//       renderer.setSize(width, height, false);
//     }
//     return needResize;
//   }

//   let then = 0;
//   function render(now) {
//     now *= 0.001;  //конвертировать в секунды
//     const deltaTime = now - then;
//     then = now;

//     if (resizeRendererToDisplaySize(renderer)) {
//       const canvas = renderer.domElement;
//       camera.aspect = canvas.clientWidth / canvas.clientHeight;
//       camera.updateProjectionMatrix();
//       composer.setSize(canvas.width, canvas.height);
//     }

//     cubes.forEach((cube, ndx) => {
//       const speed = 1 + ndx * .1;
//       const rot = now * speed;
//       cube.rotation.x = rot;
//       cube.rotation.y = rot;
//     });

//     composer.render(deltaTime);

//     requestAnimationFrame(render);
//   }

//   requestAnimationFrame(render);
// }

// main();
