// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/RenderPass.js';
import {BloomPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BloomPass.js';
import {BokehPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BokehPass.js';
import {OutlinePass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/OutlinePass.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/FilmPass.js';


// // init
let gl = document.querySelector('#gl');
gl.height = gl.clientHeight;
gl.width = gl.clientWidth;

let textures = [
`../img/1.png`,
`../img/2.png`,
`../img/3.png`,
`../img/4.png`,
`../img/5.png`,
`../img/6.png`,
`../img/7.png`,
`../img/8.png`,].
map(url => new THREE.TextureLoader().load(url));

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10);

camera.position.z = 1.4;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


const scene = new THREE.Scene();
const geometry = new THREE.PlaneGeometry(1.5, 1, 20, 20);
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: textures[0] },
        opacity: { value: 1.0 },
        blend: { value: 0.8 },

        tMap: { value: textures[0] },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uViewportSize: { value: [window.innerWidth, window.innerHeight] },
        uTime: { value: 100 * Math.random() },
        uBlurStrength: { value: 0.1 },
    },
    depthTest: false,
    depthWrite: false,
    transparent: true,
    vertexShader: `
        varying vec2 vUv;
        void main(){
        vUv = uv;
        vec3 newposition = position;
        float distanceFromCenter = abs(
            (modelMatrix * vec4(position, 1.0)).x
        );

        // most important
        newposition.y *= 1.0 + 0.1*pow(distanceFromCenter,2.);
        // newposition.y *= 1.0 + 0.05*pow(distanceFromCenter,2.);

        gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
        }`,
    fragmentShader: `
        uniform sampler2D uTexture;
        uniform float opacity;
        uniform float blend;

        varying vec2 vUv;

        float getFadeInWeight(vec2 uv) {
            float edge = 0.4 * abs(sin(0.5));
            return smoothstep(0., edge, uv.x) * smoothstep(0., edge, 1.-uv.x) * smoothstep(0., edge, uv.y) * smoothstep(0., edge, 1.-uv.y);
        }

        void main() {
            vec4 texelColor = texture2D(uTexture, vUv);
            float alpha = getFadeInWeight(vUv);
            // gl_FragColor = vec4(texelColor.rgb, texelColor.a * alpha);
            
            
            vec4 res = vec4(texelColor.rgb, texelColor.a * alpha);
            // vec3 finalColor = mix(alpha, uTexture, 1.0);
            // gl_FragColor = vec4(finalColor, 1.0);

            gl_FragColor = mix(texelColor, res, blend);
        }
    `,
    // fragmentShader: `
    //     uniform sampler2D uTexture;
    //     varying vec2 vUv;
    //     void main()	{
    //         gl_FragColor = texture2D(uTexture,vUv);
    //     }
    // `
    // fragmentShader: `
    //     precision highp float;

    //     uniform vec2 uImageSize;
    //     uniform vec2 uPlaneSize;
    //     uniform vec2 uViewportSize;
    //     uniform float uBlurStrength;
    //     uniform float uTime;
    //     uniform sampler2D tMap;

    //     varying vec2 vUv;

    //     /*
    //     by @arthurstammet
    //     https://shadertoy.com/view/tdXXRM
    //     */
    //     float tvNoise (vec2 p, float ta, float tb) {
    //         return fract(sin(p.x * ta + p.y * tb) * 5678.);
    //     }
    //     vec3 draw(sampler2D image, vec2 uv) {
    //         return texture2D(image,vec2(uv.x, uv.y)).rgb;   
    //     }
    //     float rand(vec2 co){
    //         return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    //     }
    //     /*
    //     inspired by https://www.shadertoy.com/view/4tSyzy
    //     @anastadunbar
    //     */
    //     vec3 blur(vec2 uv, sampler2D image, float blurAmount){
    //     vec3 blurredImage = vec3(0.);
    //     float gradient = smoothstep(0.8, 0.0, 3.4 - (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength + smoothstep(0.8, 0.0, (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength;
    //     #define repeats 40.
    //     for (float i = 0.; i < repeats; i++) { 
    //             vec2 q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i, uv.x + uv.y)) + blurAmount); 
    //             vec2 uv2 = uv + (q * blurAmount * gradient);
    //             blurredImage += draw(image, uv2) / 2.;
    //             q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i + 2., uv.x + uv.y + 24.)) + blurAmount); 
    //             uv2 = uv + (q * blurAmount * gradient);
    //             blurredImage += draw(image, uv2) / 2.;
    //         }
    //         return blurredImage / repeats;
    //     }

    //     void main() {
    //         vec2 ratio = vec2(
    //             min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
    //             min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
    //         );

    //         vec2 uv = vec2(
    //             vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    //             vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    //         );

    //         float t = uTime + 123.0;
    //         float ta = t * 0.654321;
    //         float tb = t * (ta * 0.123456);
    //         vec4 noise = vec4(1. - tvNoise(uv, ta, tb));
            
    //         vec4 final = vec4(blur(uv, tMap, 0.08), 1.);

    //         final = final - noise * 0.08;

    //         gl_FragColor = final;
    //     }
    // `,
});

for (let i = 0; i < 8; i++) {
    let m = material.clone();
    m.uniforms.uTexture.value = textures[i % 8];
    let mesh = new THREE.Mesh(geometry, m);
    // mesh.position.x = (i - 15) * 1.7;
    mesh.position.x = i * 1.7;
    scene.add(mesh);
}


const renderer = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true });
renderer.setSize(gl.clientWidth, gl.clientHeight);
// renderer.setAnimationLoop(animation);
// function render() {
//   requestAnimationFrame(render);
//   renderer.render(scene, camera);
// }
// render();
let start = null,
isDown = false,
startX;

function step(arg) {

    if (!start) start = arg;

    if (typeof arg === 'number') {
        let progress = arg - start;
        scene.position.x = 0;
        renderer.render(scene, camera);
        
        if (progress < 2000) {
            requestAnimationFrame(step);
        }
    };

    if (arg.type == 'wheel') {
        scene.position.x += -arg.deltaX * 0.005;
        renderer.render(scene, camera);
        console.log('Delta X:', arg.deltaX);
    };

    if (arg.type == 'mousemove') {
        const x = arg.pageX;
        const walkX = x - startX;
        scene.position.x += walkX * 0.00005;
        renderer.render(scene, camera);
    };


    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // const filmPass = new FilmPass(
    //     0.35,   //интенсивность шума
    //     0.025,  // интенсивность сканирования
    //     648,    // количество строк сканирования
    //     false,  // оттенки серого
    // );
    // filmPass.renderToScreen = true;
    // composer.addPass(filmPass);

    const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
    outlinePass.edgeStrength = 10.0;
    outlinePass.edgeGlow = 0.0;
    outlinePass.edgeThickness = 1.0;
    outlinePass.pulsePeriod = 5.0;
    outlinePass.visibleEdgeColor = '#ffffff';
    outlinePass.hiddenEdgeColor = '#190a05';
    composer.addPass( outlinePass );

    // const bokehPass = new BokehPass( scene, camera, {
    //     focus: 1.3998,
    //     aperture: 10.0,
    //     maxblur: 0.01
    // } );
    // composer.addPass(bokehPass);

    composer.setSize(window.innerWidth, window.innerHeight);

    // composer.render(deltaTime);

    gl.addEventListener("mousemove", (event) => {

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        const intersects = raycaster.intersectObject( scene, true );

        if ( intersects.length > 0 ) {
            const selectedObject = intersects[ 0 ].object;
            addSelectedObject( selectedObject );
            outlinePass.selectedObjects = selectedObjects;
        }

    });
    // requestAnimationFrame(step);
    composer.render(scene, camera);

};
gl.addEventListener('wheel', step);
gl.addEventListener("mousedown", (event) => {
    isDown = true;
    startX = event.pageX;
});
let selectedObjects = [];
function addSelectedObject( object ) {
    selectedObjects = [];
    selectedObjects.push( object );
}
gl.addEventListener("mousemove", (event) => {
    if (isDown) step(event);

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObject( scene, true );

    if ( intersects.length > 0 ) {
        const selectedObject = intersects[ 0 ].object;
        addSelectedObject( selectedObject );
        outlinePass.selectedObjects = selectedObjects;
    }

});
window.addEventListener("mouseup", (event) => {
    isDown = false,
    startX = 0;
});
requestAnimationFrame(step);



















































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
