// import * as THREE from 'three';
// import * as TWEEN from 'three/addons/libs/tween.module.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { ArcballControls } from 'three/addons/controls/ArcballControls.js';


// let sectionAbout = document.querySelector('.section__about');
// let canvasContainer = document.querySelector('.canvas-phase');

// let camera, scene, raycaster, renderer, controls, groupS;

// const pointer = new THREE.Vector2();

// const models = [];
// const group = [];
// const step = [];

// let radius = 5;

// function init( group ) {

//     // CAMERA
//     camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
//     // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );

//     // SCENE
//     scene = new THREE.Scene();

//     // LIGHT
//     scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

//     // ELEMENTS
//     group.position.set( 0, 0, -5 );
//     scene.add(group);

//     // RAYCASTER
//     // raycaster = new THREE.Raycaster();

//     // RENDER
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     observerCanvasContainer.observe(renderer.domElement);
//     canvasContainer.append(renderer.domElement);

//     onWindowResize();
//     window.addEventListener( 'load', onWindowResize );
//     // window.addEventListener( 'resize', onWindowResize );
//     // sectionAbout.addEventListener('dblclick', onPointerDblClick );
//     // sectionAbout.addEventListener('pointerdown', onPointerDown, false );

//     // CONTROLS
//     controls = new ArcballControls( camera, renderer.domElement, scene );
//     controls.addEventListener( 'change', render );
//     controls.setGizmosVisible(false);
//     controls.enableFocus = false;
//     controls.enableZoom = false;
//     controls.enableGrid = false;
//     controls.enablePan = false;
//     // controls.target.set( group[0].position.x, 0, group[0].position.z);
//     controls.update();
//     controls.enabled = false

//     renderer.setAnimationLoop( animate );
// };

// function onWindowResize() {
//     camera.aspect = (canvasContainer.clientWidth / 2) / canvasContainer.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setPixelRatio(devicePixelRatio);
//     renderer.setSize((canvasContainer.clientWidth / 2), canvasContainer.clientHeight);
// };

// function animate() {
//     TWEEN.update();
//     renderer.render(scene, camera);
// };

// function render() {
//     renderer.render( scene, camera );
// };

// const observerCanvasContainer = new IntersectionObserver( (entries) => {
//     entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//             entry.target.style.scale = '';

//             // if (entry.target == canvasContainer.children[1]) {
//             //     canvasContainer.children[[canvasContainer.children.length - 1]].scrollIntoView({ block: "center", inline: "center", container: "nearest" });
//             // } else if (entry.target == canvasContainer.children[canvasContainer.children.length - 1]) {
//             //     // canvasContainer.children[1].scrollIntoView({ block: "center", inline: "center", container: "nearest" });
//             // }
//         } else {
//             entry.target.style.scale = '0.8';
//         }
//     })
// }, {
//     root: canvasContainer,
//     threshold: [0.95, 1],
// });






// // MODEL
// //          :TEXTURES
// //                    - IMAGE REF
// const imageReference = await new THREE.TextureLoader().loadAsync( '../img/texture/reference.webp', (src) => {
//     src.flipY = false;
// });
// //                    - NORMAL MAP HP
// const textureNormalHP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm-sculpt.webp', (src) => {
//     src.flipY = false;
// });
// //                    - NORMAL MAP LP
// const textureNormalLP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm.webp', (src) => {
//     src.flipY = false;
// });
// //                    - MATCAP
// const textureMatcap = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__matcap.webp', (src) => {
//     src.encoding = THREE.SRGBColorSpace;
// });
// //                    - UV GRID
// const textureUvGrid = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__uv-grid.webp', (src) => {
//     src.flipY = false;
//     src.colorSpace = THREE.SRGBColorSpace;
// });
// //                    - PAINT
// const texturePaint = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__paint.webp', (src) => {
//     src.flipY = false;
// });
// //                    - WEIGHT
// const textureWeight = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__weight.webp', (src) => {
//     src.flipY = false;
// });

// //          :OBJECTS
// //                   - HP MODEL
// await new GLTFLoader().loadAsync( '../models/bust-highpoly.glb').then( (gltf) => {
//     const model = gltf.scene.children[0];
//     models.push(model);
// });
// //                   - LP MODEL
// await new GLTFLoader().loadAsync( '../models/bust-lowpoly.glb').then( (gltf) => {
//     const model = gltf.scene.children[0];
//     models.push(model);
// });
// //                   - WIREFRAME
// await new GLTFLoader().loadAsync( '../models/bust-wireframe.glb').then( (gltf) => {
//     const lineSeg = gltf.scene.children[0];
//     lineSeg.material.transparent = true;
//     lineSeg.material.opacity = 0.2;
//     models.push(lineSeg);
// });
// //                   - SEAM
// await new GLTFLoader().loadAsync( '../models/bust-seam.glb').then( (gltf) => {
//     const lineSeg = gltf.scene.children[0];
//     lineSeg.material.transparent = true;
//     lineSeg.material.opacity = 0.2;
//     models.push(lineSeg);
// });
// //                   - RIG
// await new GLTFLoader().loadAsync( '../models/bust-rig.glb').then( (gltf) => {
//     const lineSeg = gltf.scene.children[0];
//     lineSeg.material.transparent = true;
//     lineSeg.material.opacity = 0.4;
//     models.push(lineSeg);
// });

// // GROUP
// //      :REFERENCE
// (function() {
//     let groupRef = new THREE.Group();
//     const aspectRatio = imageReference.image.width / imageReference.image.height;
//     let mesh = new THREE.Mesh(
//     new THREE.PlaneGeometry( 2.5, 2.5),
//     new THREE.MeshLambertMaterial({
//         map: imageReference,
//         side: THREE.DoubleSide
//     })
//     );
//     mesh.scale.set(aspectRatio, 1, 1);
//     groupRef.add(mesh);
//     init(groupRef);
// })();


// //      :SCULPT
// (function() {
//     let groupSculpt = new THREE.Group();
//     let sculpt = models[0].clone();
//     sculpt.material = new THREE.MeshMatcapMaterial({
//         color: new THREE.Color().setHex(0xb0b0b0),
//         matcap: textureMatcap,
//         normalMap: textureNormalHP,
//         side: THREE.DoubleSide
//     });
//     groupSculpt.add(sculpt);
//     init(groupSculpt);
// })();


// //      :TOPOLOGY
// (function() {
//     let groupTopo = new THREE.Group();
//     let modelTopo = models[1].clone();
//     modelTopo.material = new THREE.MeshLambertMaterial({ normalMap: textureNormalLP, side: THREE.DoubleSide });
//     groupTopo.add(modelTopo);
//     let lineTopo = models[2].clone();
//     groupTopo.add(lineTopo);
//     init(groupTopo);
// })();


// //      :UNWRAP
// (function() {
//     let groupUnwrap = new THREE.Group();
//     let modelUnwrap = models[1].clone();
//     modelUnwrap.material = new THREE.MeshLambertMaterial({
//         map: textureUvGrid,
//         side: THREE.DoubleSide
//     });
//     groupUnwrap.add(modelUnwrap);
//     let lineUnwrap = models[3].clone();
//     lineUnwrap.material = new THREE.LineBasicMaterial({
//         color: 0xffff00,
//         linewidth: 1,
//     });
//     groupUnwrap.add(lineUnwrap);
//     init(groupUnwrap);
// })();


// //      :BAKING
// (function() {
//     let groupBake = new THREE.Group();
//     let modelBake = models[1].clone();
//     modelBake.material = new THREE.MeshLambertMaterial({
//         map: textureNormalLP,
//         normalMap: textureNormalLP,
//         side: THREE.DoubleSide
//     });
//     groupBake.add(modelBake);
//     init(groupBake);
// })();


// //      :PAINT
// (function() {
//     let groupPaint = new THREE.Group();
//     let modelPaint = models[1].clone();
//     modelPaint.material = new THREE.MeshLambertMaterial({
//         map: texturePaint,
//         normalMap: textureNormalLP,
//         side: THREE.DoubleSide
//     });
//     groupPaint.add(modelPaint);
//     init(groupPaint);
// })();


// //      :RIGGING & SKINNING
// (function() {
//     let groupRS = new THREE.Group();
//     let modelRS = models[1].clone();
//     modelRS.material = new THREE.MeshLambertMaterial({
//         map: textureWeight,
//         normalMap: textureNormalLP,
//         side: THREE.DoubleSide
//     });
//     groupRS.add(modelRS);
//     let lineRS = models[4].clone();
//     groupRS.add(lineRS);
//     init(groupRS);
// })();





































































// import * as THREE from 'three';
// import * as TWEEN from 'three/addons/libs/tween.module.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { ArcballControls } from 'three/addons/controls/ArcballControls.js';


// let sectionAbout = document.querySelector('.section__about');
// let phaseListArr = Array.from( document.querySelectorAll('.section__about .list-phase .list-phase__details') );

// let camera, scene, raycaster, renderer, controls, groupS;

// const pointer = new THREE.Vector2();

// const rayMeshes = [];
// const models = [];
// const group = [];
// const step = [];

// let radius = 5;

// async function init() {

//     // CAMERA
//     camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
//     // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
//     groupS = new THREE.Group();

//     // SCENE
//     scene = new THREE.Scene();

//     // LIGHT
//     scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

//     // RAYCASTER
//     raycaster = new THREE.Raycaster();

//     // RENDER
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

//     // MODEL
//     //          :TEXTURES
//     //                    - IMAGE REF
//     const imageReference = await new THREE.TextureLoader().loadAsync( '../img/texture/reference.webp', (src) => {
//         src.flipY = false;
//     });
//     //                    - NORMAL MAP HP
//     const textureNormalHP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm-sculpt.webp', (src) => {
//         src.flipY = false;
//     });
//     //                    - NORMAL MAP LP
//     const textureNormalLP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm.webp', (src) => {
//         src.flipY = false;
//     });
//     //                    - MATCAP
//     const textureMatcap = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__matcap.webp', (src) => {
//         src.encoding = THREE.SRGBColorSpace;
//     });
//     //                    - UV GRID
//     const textureUvGrid = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__uv-grid.webp', (src) => {
//         src.flipY = false;
//         src.colorSpace = THREE.SRGBColorSpace;
//     });
//     //                    - PAINT
//     const texturePaint = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__paint.webp', (src) => {
//         src.flipY = false;
//     });
//     //                    - WEIGHT
//     const textureWeight = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__weight.webp', (src) => {
//         src.flipY = false;
//     });

//     //          :OBJECTS
//     //                   - HP MODEL
//     await new GLTFLoader().loadAsync( '../models/bust-highpoly.glb').then( (gltf) => {
//         const model = gltf.scene.children[0];
//         models.push(model);
//     });
//     //                   - LP MODEL
//     await new GLTFLoader().loadAsync( '../models/bust-lowpoly.glb').then( (gltf) => {
//         const model = gltf.scene.children[0];
//         models.push(model);
//     });
//     //                   - WIREFRAME
//     await new GLTFLoader().loadAsync( '../models/bust-wireframe.glb').then( (gltf) => {
//         const lineSeg = gltf.scene.children[0];
//         lineSeg.material.transparent = true;
//         lineSeg.material.opacity = 0.2;
//         models.push(lineSeg);
//     });
//     //                   - SEAM
//     await new GLTFLoader().loadAsync( '../models/bust-seam.glb').then( (gltf) => {
//         const lineSeg = gltf.scene.children[0];
//         lineSeg.material.transparent = true;
//         lineSeg.material.opacity = 0.2;
//         models.push(lineSeg);
//     });
//     //                   - RIG
//     await new GLTFLoader().loadAsync( '../models/bust-rig.glb').then( (gltf) => {
//         const lineSeg = gltf.scene.children[0];
//         lineSeg.material.transparent = true;
//         lineSeg.material.opacity = 0.4;
//         models.push(lineSeg);
//     });

//     // GROUP
//     //      :REFERENCE
//     (function() {
//         let groupRef = new THREE.Group();
//         const aspectRatio = imageReference.image.width / imageReference.image.height;
//         let mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry( 2.5, 2.5),
//         new THREE.MeshLambertMaterial({
//             map: imageReference,
//             side: THREE.DoubleSide
//         })
//         );
//         mesh.scale.set(aspectRatio, 1, 1);
//         groupRef.add(mesh);
//         group.push(groupRef);
//     })();


//     //      :SCULPT
//     (function() {
//         let groupSculpt = new THREE.Group();
//         let sculpt = models[0].clone();
//         sculpt.material = new THREE.MeshMatcapMaterial({
//             color: new THREE.Color().setHex(0xb0b0b0),
//             matcap: textureMatcap,
//             normalMap: textureNormalHP,
//             side: THREE.DoubleSide
//         });
//         groupSculpt.add(sculpt);
//         group.push(groupSculpt);
//     })();


//     //      :TOPOLOGY
//     (function() {
//         let groupTopo = new THREE.Group();
//         let modelTopo = models[1].clone();
//         modelTopo.material = new THREE.MeshLambertMaterial({ normalMap: textureNormalLP, side: THREE.DoubleSide });
//         groupTopo.add(modelTopo);
//         let lineTopo = models[2].clone();
//         groupTopo.add(lineTopo);
//         group.push(groupTopo);
//     })();


//     //      :UNWRAP
//     (function() {
//         let groupUnwrap = new THREE.Group();
//         let modelUnwrap = models[1].clone();
//         modelUnwrap.material = new THREE.MeshLambertMaterial({
//             map: textureUvGrid,
//             side: THREE.DoubleSide
//         });
//         groupUnwrap.add(modelUnwrap);
//         let lineUnwrap = models[3].clone();
//         lineUnwrap.material = new THREE.LineBasicMaterial({
//             color: 0xffff00,
//             linewidth: 1,
//         });
//         groupUnwrap.add(lineUnwrap);
//         group.push(groupUnwrap);
//     })();


//     //      :BAKING
//     (function() {
//         let groupBake = new THREE.Group();
//         let modelBake = models[1].clone();
//         modelBake.material = new THREE.MeshLambertMaterial({
//             map: textureNormalLP,
//             normalMap: textureNormalLP,
//             side: THREE.DoubleSide
//         });
//         groupBake.add(modelBake);
//         group.push(groupBake);
//     })();


//     //      :PAINT
//     (function() {
//         let groupPaint = new THREE.Group();
//         let modelPaint = models[1].clone();
//         modelPaint.material = new THREE.MeshLambertMaterial({
//             map: texturePaint,
//             normalMap: textureNormalLP,
//             side: THREE.DoubleSide
//         });
//         groupPaint.add(modelPaint);
//         group.push(groupPaint);
//     })();


//     //      :RIGGING & SKINNING
//     (function() {
//         let groupRS = new THREE.Group();
//         let modelRS = models[1].clone();
//         modelRS.material = new THREE.MeshLambertMaterial({
//             map: textureWeight,
//             normalMap: textureNormalLP,
//             side: THREE.DoubleSide
//         });
//         groupRS.add(modelRS);
//         let lineRS = models[4].clone();
//         groupRS.add(lineRS);
//         group.push(groupRS);
//     })();


//     setCircle(group);

//     onWindowResize();
//     window.addEventListener( 'load', onWindowResize );
//     // window.addEventListener( 'resize', onWindowResize );
//     // sectionAbout.addEventListener('dblclick', onPointerDblClick );
//     // sectionAbout.addEventListener('pointerdown', onPointerDown, false );

//     // CONTROLS
//     controls = new ArcballControls( camera, renderer.domElement, scene );
//     controls.addEventListener( 'change', render );
//     controls.setGizmosVisible(false);
//     controls.enableFocus = false;
//     controls.enableZoom = false;
//     controls.enableGrid = false;
//     controls.enablePan = false;
//     controls.target.set( group[0].position.x, 0, group[0].position.z);
//     controls.update();
//     controls.enabled = false

//     renderer.setAnimationLoop( animate );
// };

// function setCircle(arr) {
//     new Array(arr.length).fill().map((g, idx) => {
//         let angleStep = THREE.MathUtils.degToRad(360) / arr.length;
//         let angle = angleStep * idx;
//         arr[idx].position.set( Math.sin(angle) * radius, 0, -Math.cos(angle) * radius );
//         arr[idx].lookAt(0, 0, 0);
//         // if ( idx != 0 ) arr[idx].visible = false;

//         // let bbox = new THREE.Box3().setFromObject(arr[idx], true);
//         // const obb = new OBB();
//         // obb.fromBox3(bbox);
//         // obb.applyMatrix4(arr[idx].matrixWorld);
//         // let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
//         // scene.add(helper);
//         arr[idx].scale.set( .9, .9, .9 );

//         step.push(angle);
//         groupS.add(arr[idx]);
//     });
//     step.push( step[1] * step.length );
//     step.unshift(-step[1]);
//     scene.add(groupS);
// };

// init();

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize( window.innerWidth, window.innerHeight );
// };

// function animate() {
//     TWEEN.update();
//     renderer.render(scene, camera);
// };

// function render() {
//     renderer.render( scene, camera );
// }









































import * as THREE from 'three';
import * as TWEEN from 'three/addons/libs/tween.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



let sectionAbout = document.querySelector('.section__about');
let progressiveBlur = document.querySelector('.progressive-blur');

let canvas, renderer;

const scenes = [];
const models = [];
const texture = [];
const group = [];
const title = [
    'CONCEPT DESIGN',
    'SCULPTING',
    'RETOPOLOGY',
    'UNWRAP',
    'BAKING',
    'TEXTURING',
    'RIGGING & SKINNING',
];
const description = [
    "- is an early phase of the design process, in which the broad outlines of function and form of something are articulated.",
    "- manipulate a digital object as if it were made of a real-life substance such as clay.",
    "- is the process of creating a new, cleaner polygonal mesh for a 3D model while preserving its original shape.",
    "- projecting a 3D model's surface to a 2D image for texture mapping.",
    "- is the process of saving complex details, like lighting, shadows, and surface irregularities, from a high-polygon model or scene into a flat, 2D texture map.",
    "- is the process of applying images or other data (textures) to a 3D model to give it a realistic appearance, color, and other surface properties.",
    "- rigging is creating a virtual skeleton (a rig) for a 3D model, while skinning is the process of binding the 3D model's surface (the 'skin') to that skeleton.",
];

init();

async function init() {

    canvas = document.getElementById( 'c' );

    const content = document.getElementById( 'content' );

    // MODEL
    //          :TEXTURES
    //                    - IMAGE REF
    await new THREE.TextureLoader().loadAsync( '../img/texture/reference.webp').then( (src) => {
        texture.push(src);
    });
    //                    - NORMAL MAP HP
    await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm-sculpt.webp').then( (src) => {
        src.flipY = false;
        texture.push(src);
    });
    //                    - NORMAL MAP LP
    await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm.webp').then( (src) => {
        src.flipY = false;
        texture.push(src);
    });
    //                    - MATCAP
    await new THREE.TextureLoader().loadAsync( '../img/texture/texture__matcap.webp').then( (src) => {
        src.encoding = THREE.SRGBColorSpace;
        texture.push(src);
    });
    //                    - UV GRID
    await new THREE.TextureLoader().loadAsync( '../img/texture/texture__uv-grid.webp').then( (src) => {
        src.flipY = false;
        src.colorSpace = THREE.SRGBColorSpace;
        texture.push(src);
    });
    //                    - PAINT
    await new THREE.TextureLoader().loadAsync( '../img/texture/texture__paint.webp').then( (src) => {
        src.flipY = false;
        texture.push(src);
    });
    //                    - WEIGHT
    await new THREE.TextureLoader().loadAsync( '../img/texture/texture__weight.webp').then( (src) => {
        src.flipY = false;
        texture.push(src);
    });

    //          :OBJECTS
    //                   - HP MODEL
    await new GLTFLoader().loadAsync( '../models/bust-highpoly.glb').then( (gltf) => {
        const model = gltf.scene.children[0];
        models.push(model);
    });
    //                   - LP MODEL
    await new GLTFLoader().loadAsync( '../models/bust-lowpoly.glb').then( (gltf) => {
        const model = gltf.scene.children[0];
        models.push(model);
    });
    //                   - WIREFRAME
    await new GLTFLoader().loadAsync( '../models/bust-wireframe.glb').then( (gltf) => {
        const lineSeg = gltf.scene.children[0];
        lineSeg.material.transparent = true;
        lineSeg.material.opacity = 0.2;
        models.push(lineSeg);
    });
    //                   - SEAM
    await new GLTFLoader().loadAsync( '../models/bust-seam.glb').then( (gltf) => {
        const lineSeg = gltf.scene.children[0];
        lineSeg.material.transparent = true;
        lineSeg.material.opacity = 0.2;
        models.push(lineSeg);
    });
    //                   - RIG
    await new GLTFLoader().loadAsync( '../models/bust-rig.glb').then( (gltf) => {
        const lineSeg = gltf.scene.children[0];
        lineSeg.material.transparent = true;
        lineSeg.material.opacity = 0.4;
        models.push(lineSeg);
    });

    // GROUP
    //      :DUPLICATE!!! RIGGING & SKINNING
    // (function() {
    //     let groupRS = new THREE.Group();
    //     let modelRS = models[1].clone();
    //     modelRS.material = new THREE.MeshLambertMaterial({
    //         map: texture[6],
    //         normalMap: texture[2],
    //         side: THREE.DoubleSide
    //     });
    //     groupRS.add(modelRS);
    //     let lineRS = models[4].clone();
    //     groupRS.add(lineRS);
    //     group.push(groupRS);
    // })();
    //      :REFERENCE
    (function() {
        let groupRef = new THREE.Group();
        const aspectRatio = texture[0].image.width / texture[0].image.height;
        let mesh = new THREE.Mesh(
        new THREE.PlaneGeometry( 2.5, 2.5),
        new THREE.MeshLambertMaterial({
            map: texture[0],
            side: THREE.DoubleSide
        })
        );
        mesh.scale.set(aspectRatio, 1, 1);
        groupRef.add(mesh);
        group.push(groupRef);
    })();
    //      :SCULPT
    (function() {
        let groupSculpt = new THREE.Group();
        let sculpt = models[0].clone();
        sculpt.material = new THREE.MeshMatcapMaterial({
            color: new THREE.Color().setHex(0xb0b0b0),
            matcap: texture[3],
            normalMap: texture[1],
            side: THREE.DoubleSide
        });
        groupSculpt.add(sculpt);
        group.push(groupSculpt);
    })();
    //      :TOPOLOGY
    (function() {
        let groupTopo = new THREE.Group();
        let modelTopo = models[1].clone();
        modelTopo.material = new THREE.MeshLambertMaterial({ normalMap: texture[2], side: THREE.DoubleSide });
        groupTopo.add(modelTopo);
        let lineTopo = models[2].clone();
        groupTopo.add(lineTopo);
        group.push(groupTopo);
    })();
    //      :UNWRAP
    (function() {
        let groupUnwrap = new THREE.Group();
        let modelUnwrap = models[1].clone();
        modelUnwrap.material = new THREE.MeshLambertMaterial({
            map: texture[4],
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
    })();
    //      :BAKING
    (function() {
        let groupBake = new THREE.Group();
        let modelBake = models[1].clone();
        modelBake.material = new THREE.MeshLambertMaterial({
            map: texture[2],
            normalMap: texture[2],
            side: THREE.DoubleSide
        });
        groupBake.add(modelBake);
        group.push(groupBake);
    })();
    //      :PAINT
    (function() {
        let groupPaint = new THREE.Group();
        let modelPaint = models[1].clone();
        modelPaint.material = new THREE.MeshLambertMaterial({
            map: texture[5],
            normalMap: texture[2],
            side: THREE.DoubleSide
        });
        groupPaint.add(modelPaint);
        group.push(groupPaint);
    })();
    //      :RIGGING & SKINNING
    (function() {
        let groupRS = new THREE.Group();
        let modelRS = models[1].clone();
        modelRS.material = new THREE.MeshLambertMaterial({
            map: texture[6],
            normalMap: texture[2],
            side: THREE.DoubleSide
        });
        groupRS.add(modelRS);
        let lineRS = models[4].clone();
        groupRS.add(lineRS);
        group.push(groupRS);
    })();
    //      :DUPLICATE!!! REFERENCE
    // (function() {
    //     let groupRef = new THREE.Group();
    //     const aspectRatio = texture[0].image.width / texture[0].image.height;
    //     let mesh = new THREE.Mesh(
    //     new THREE.PlaneGeometry( 2.5, 2.5),
    //     new THREE.MeshLambertMaterial({
    //         map: texture[0],
    //         side: THREE.DoubleSide
    //     })
    //     );
    //     mesh.scale.set(aspectRatio, 1, 1);
    //     groupRef.add(mesh);
    //     group.push(groupRef);
    // })();

    for ( let i = 0; i < group.length; i ++ ) {

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x7b7b7b3c);

        // make a list item
        const element = document.createElement( 'div' );
        element.className = 'list-item';
        observerCanvasContainer.observe(element);

        const sceneElement = document.createElement( 'div' );
        sceneElement.className = 'preview';
        element.appendChild( sceneElement );


        const attentElement = document.createElement( 'div' );
        attentElement.className = 'attention';
        element.appendChild( attentElement );

        const attentElementBlur = progressiveBlur.cloneNode(true);
        attentElement.appendChild( attentElementBlur );

        const titleElement = document.createElement( 'h2' );
        titleElement.innerText = title[i];
        // element.appendChild( titleElement );
        // sceneElement.appendChild( titleElement );
        attentElement.appendChild( titleElement );

        const descElement = document.createElement( 'p' );
        descElement.innerText = description[i];
        // element.appendChild( descElement );
        attentElement.appendChild( descElement );


        const showElement = document.createElement( 'h3' );
        showElement.innerText = '⛶';
        element.appendChild( showElement );
        // sceneElement.appendChild( showElement );

        // the element that represents the area we want to render the scene
        scene.userData.element = sceneElement;
        content.appendChild( element );

        const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
        camera.position.z = 2;
        scene.userData.camera = camera;

        // CONTROLS
        // const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
        // controls.minDistance = 2;
        // controls.maxDistance = 5;
        // controls.enablePan = false;
        // controls.enableZoom = false;
        // scene.userData.controls = controls;
        // controls.enabled = false;

        // controls = new ArcballControls( scene.userData.camera, renderer.domElement, scene.userData.element );
        // controls.addEventListener( 'change', render );
        // controls.setGizmosVisible(false);
        // controls.enableFocus = false;
        // controls.enableZoom = false;
        // controls.enableGrid = false;
        // controls.enablePan = false;
        // controls.enabled = false
        // controls.update();
        


        // add one random mesh to each scene
        group[i].scale.set(0.5, 0.5, 0.5);
        group[i].rotation.y = -0.2;
        scene.add(group[i]);

        scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444, 3 ) );

        // const light = new THREE.DirectionalLight( 0xffffff, 1.5 );
        // light.position.set( 1, 1, 1 );
        // scene.add( light );

        scenes.push( scene );

    }

    // content.children[1].scrollIntoView({ block: "center", inline: "center", container: "nearest" });
    // scrollLast = content.scrollLeft;
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
    // renderer.setClearColor( 0x7b7b7b3c );
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setAnimationLoop( animate );
    updateSize();

}

function updateSize() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height !== height ) {

        renderer.setSize( width, height, false );
        // renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.setSize( window.innerWidth, window.innerHeight );
    }

}

function animate() {

    updateSize();

    canvas.style.transform = `translateX(${content.scrollLeft}px)`;

    renderer.setScissorTest( false );
    renderer.clear();
    renderer.setScissorTest( true );

    scenes.forEach( function ( scene ) {

        // get the element that is a place holder for where we want to
        // draw the scene
        const element = scene.userData.element;
        const elementCont = element.offsetParent;

        // get its position relative to the page's viewport
        const rect = {
            left: elementCont.offsetLeft + element.offsetLeft - content.scrollLeft,
            top: elementCont.offsetTop + element.offsetTop - content.scrollTop,
            right: elementCont.offsetLeft + element.offsetLeft + element.clientWidth - content.scrollLeft,
            bottom: elementCont.offsetTop + element.offsetTop + element.clientHeight - content.scrollTop,
        };

        // check if it's offscreen. If so skip it
        // if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
        //         rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {

        //     return; // it's off screen

        // }

        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );

        const camera = scene.userData.camera;
        camera.aspect = element.clientWidth / element.clientHeight;
        camera.updateProjectionMatrix();

        renderer.render( scene, camera );

    } );

};













const observerCanvasContainer = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio == 1) {
            // entry.target.style.scale = '';
        } else {
            // entry.target.style.scale = '0.8';
        }
    })
}, {
    root: content,
    // threshold: [0.95, 1],
    // threshold: 1,
    threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    // rootMargin: '0% -5%',
});

// let scrollLast = 0;
// content.addEventListener('scroll', (e) => {
//     if (e.target.scrollLeft >= e.target.scrollWidth - e.target.clientWidth && scrollLast < e.target.scrollLeft) {
//         e.target.scrollLeft += -e.target.scrollWidth;
//         // e.target.scrollLeft += -e.target.scrollWidth + e.target.clientWidth * 2;
//         // e.target.scrollTo(e.target.clientWidth, 0);
//     } else if (e.target.scrollLeft <= 0 && scrollLast > e.target.scrollLeft) {
//         e.target.scrollLeft += e.target.scrollWidth;
//         // e.target.scrollLeft += e.target.scrollWidth - e.target.clientWidth * 2;
//         // e.target.scrollTo(e.target.scrollWidth - e.target.clientWidth * 2, 0);
//     }

//     scrollLast = e.target.scrollLeft;
// });




































































// import * as THREE from 'three';
// import * as TWEEN from 'three/addons/libs/tween.module.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { ArcballControls } from 'three/addons/controls/ArcballControls.js';


// let sectionAbout = document.querySelector('.section__about');
// let phaseListArr = Array.from( document.querySelectorAll('.section__about .list-phase .list-phase__details') );

// let camera, scene, raycaster, renderer, controls, groupS;

// const pointer = new THREE.Vector2();

// const rayMeshes = [];
// const models = [];
// const group = [];
// const step = [];

// let radius = 5;

// async function init() {

//     // CAMERA
//     camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
//     // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
//     groupS = new THREE.Group();

//     // SCENE
//     scene = new THREE.Scene();

//     // LIGHT
//     scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));

//     // RAYCASTER
//     raycaster = new THREE.Raycaster();

//     // RENDER
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     sectionAbout.insertAdjacentElement('afterbegin' , renderer.domElement);

//     // MODEL
//     //          :TEXTURES
//     //                    - NORMAL MAP HP
//     const textureNormalHP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm-sculpt.webp');
//     textureNormalHP.flipY = false;
//     //                    - NORMAL MAP LP
//     const textureNormalLP = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__norm.webp');
//     textureNormalLP.flipY = false;
//     //                    - MATCAP
//     const textureMatcap = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__matcap.webp');
//     textureMatcap.encoding = THREE.SRGBColorSpace;
//     //                    - UV GRID
//     const textureUvGrid = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__uv-grid.webp' );
//     textureUvGrid.flipY = false;
//     textureUvGrid.colorSpace = THREE.SRGBColorSpace;
//     //                    - PAINT
//     const texturePaint = await new THREE.TextureLoader().loadAsync( '../img/texture/texture__paint.webp' );
//     texturePaint.flipY = false;
//     //                    - WEIGHT
//     const textureWeight = new THREE.TextureLoader().load( '../img/texture/texture__weight.webp' );
//     textureWeight.flipY = false;

//     //          :OBJECTS
//     //                   - HP MODEL
//     await new GLTFLoader().loadAsync( '../models/bust-highpoly.glb').then((gltf) => {
//         const model = gltf.scene.children[0];
//         models.push(model);
//         rayMeshes.push(model);
//     });
//     //                   - LP MODEL
//     await new GLTFLoader().loadAsync( '../models/bust-lowpoly.glb').then((gltf) => {
//         const model = gltf.scene.children[0];
//         models.push(model);
//         rayMeshes.push(model);
//     });
//     //                   - WIREFRAME
//     await new GLTFLoader().loadAsync( '../models/bust-wireframe.glb').then((gltf) => {
//         const lineSeg = gltf.scene.children[0];
//         lineSeg.material.transparent = true;
//         lineSeg.material.opacity = 0.2;
//         models.push(lineSeg);
//     });
//     //                   - SEAM
//     await new GLTFLoader().loadAsync( '../models/bust-seam.glb').then((gltf) => {
//         const lineSeg = gltf.scene.children[0];
//         lineSeg.material.transparent = true;
//         lineSeg.material.opacity = 0.2;
//         models.push(lineSeg);
//     });
//     //                   - RIG
//     await new GLTFLoader().loadAsync( '../models/bust-rig.glb').then((gltf) => {
//         const lineSeg = gltf.scene.children[0];
//         lineSeg.material.transparent = true;
//         lineSeg.material.opacity = 0.4;
//         models.push(lineSeg);
//     });

//     // GROUP
//     //      :REFERENCE
//     await new THREE.TextureLoader().loadAsync( '../img/texture/reference.webp').then((loadedTexture) => {
//         const aspectRatio = loadedTexture.image.width / loadedTexture.image.height;
//         let mesh = new THREE.Mesh(
//             new THREE.PlaneGeometry( 2.5, 2.5),
//             new THREE.MeshLambertMaterial({
//                 map: loadedTexture,
//                 side: THREE.DoubleSide
//             })
//         );
//         mesh.scale.set(aspectRatio, 1, 1);
//         rayMeshes.push(mesh);
//         let groupRef = new THREE.Group().add(mesh);
//         group.push(groupRef);
//     });

//     //      :SCULPT
//     let groupSculpt = new THREE.Group();
//     let sculpt = models[0].clone();
//     sculpt.material = new THREE.MeshMatcapMaterial({
//         color: new THREE.Color().setHex(0xb0b0b0),
//         matcap: textureMatcap,
//         normalMap: textureNormalHP,
//         side: THREE.DoubleSide
//     });
//     groupSculpt.add(sculpt);
//     group.push(groupSculpt);


//     //      :TOPOLOGY
//     let groupTopo = new THREE.Group();
//     let modelTopo = models[1].clone();
//     modelTopo.material = new THREE.MeshLambertMaterial({ normalMap: textureNormalLP, side: THREE.DoubleSide });
//     groupTopo.add(modelTopo);
//     let lineTopo = models[2].clone();
//     groupTopo.add(lineTopo);
//     group.push(groupTopo);


//     //      :UNWRAP
//     let groupUnwrap = new THREE.Group();
//     let modelUnwrap = models[1].clone();
//     modelUnwrap.material = new THREE.MeshLambertMaterial({
//         map: textureUvGrid,
//         side: THREE.DoubleSide
//     });
//     groupUnwrap.add(modelUnwrap);
//     let lineUnwrap = models[3].clone();
//     lineUnwrap.material = new THREE.LineBasicMaterial({
//         color: 0xffff00,
//         linewidth: 1,
//     });
//     groupUnwrap.add(lineUnwrap);
//     group.push(groupUnwrap);


//     //      :BAKING
//     let groupBake = new THREE.Group();
//     let modelBake = models[1].clone();
//     modelBake.material = new THREE.MeshLambertMaterial({
//         map: textureNormalLP,
//         normalMap: textureNormalLP,
//         side: THREE.DoubleSide
//     });
//     groupBake.add(modelBake);
//     // let lineBake = models[2].clone();
//     // groupBake.add(lineBake);
//     group.push(groupBake);


//     //      :PAINT
//     let groupPaint = new THREE.Group();
//     let modelPaint = models[1].clone();
//     modelPaint.material = new THREE.MeshLambertMaterial({
//         map: texturePaint,
//         normalMap: textureNormalLP,
//         side: THREE.DoubleSide
//     });
//     groupPaint.add(modelPaint);
//     group.push(groupPaint);


//     //      :RIGGING & SKINNING
//     let groupRS = new THREE.Group();
//     let modelRS = models[1].clone();
//     modelRS.material = new THREE.MeshLambertMaterial({
//         map: textureWeight,
//         normalMap: textureNormalLP,
//         side: THREE.DoubleSide
//     });
//     groupRS.add(modelRS);
//     let lineRS = models[4].clone();
//     groupRS.add(lineRS);
//     group.push(groupRS);


//     setCircle(group);

//     onWindowResize();
//     window.addEventListener( 'load', onWindowResize );
//     // window.addEventListener( 'resize', onWindowResize );
//     sectionAbout.addEventListener('dblclick', onPointerDblClick );
//     sectionAbout.addEventListener('pointerdown', onPointerDown, false );

//     // CONTROLS
//     controls = new ArcballControls( camera, renderer.domElement, scene );
//     controls.addEventListener( 'change', render );
//     controls.setGizmosVisible(false);
//     controls.enableFocus = false;
//     controls.enableZoom = false;
//     controls.enableGrid = false;
//     controls.enablePan = false;
//     controls.target.set( group[0].position.x, 0, group[0].position.z);
//     controls.update();
//     controls.enabled = false

//     renderer.setAnimationLoop( animate );
// };

// function setCircle(arr) {
//     new Array(arr.length).fill().map((g, idx) => {
//         let angleStep = THREE.MathUtils.degToRad(360) / arr.length;
//         let angle = angleStep * idx;
//         arr[idx].position.set( Math.sin(angle) * radius, 0, -Math.cos(angle) * radius );
//         arr[idx].lookAt(0, 0, 0);
//         // if ( idx != 0 ) arr[idx].visible = false;

//         // let bbox = new THREE.Box3().setFromObject(arr[idx], true);
//         // const obb = new OBB();
//         // obb.fromBox3(bbox);
//         // obb.applyMatrix4(arr[idx].matrixWorld);
//         // let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
//         // scene.add(helper);
//         arr[idx].scale.set( .9, .9, .9 );

//         step.push(angle);
//         groupS.add(arr[idx]);
//     });
//     step.push( step[1] * step.length );
//     step.unshift(-step[1]);
//     scene.add(groupS);
// };

// init();

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize( window.innerWidth, window.innerHeight );
// };

// function animate() {
//     TWEEN.update();
//     renderer.render(scene, camera);
// };

// function render() {
//     renderer.render( scene, camera );
// }

// // EVENTS
// function onPointerDblClick( event ) {
//     if (event.type == 'touchstart') {
//         pointer.set((event.touches[0].clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.touches[0].clientY / renderer.domElement.clientHeight) * 2 + 1);
//     } else {
//         pointer.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
//     };
//     raycaster.setFromCamera(pointer, camera);
//     const intersects = raycaster.intersectObjects(group);

//     if (intersects.length > 0) {
//         if (controls.enabled) {

//             let start = renderer.domElement.animate(
//                 { opacity: [1, 0] },
//                 { duration: 300, }
//             );
//             phaseListArr.forEach( item => item.open = false );
//             start.onfinish = (event) => {
//                 controls.enabled = false;
//                 controls.camera.rotation.set( 0, 0, 0 );
//                 controls.camera.position.set( 0, 0, 0 );
//                 intersects[0].object.parent.scale.set( .9, .9, .9 );
//                 group.forEach( (gr) => gr.visible = true);

//                 renderer.domElement.animate(
//                     { opacity: [0, 1] },
//                     { duration: 300, }
//                 );
//             };

//             sectionAbout.addEventListener( 'pointerdown', onPointerDown, false );
//             document.body.style = '';
//         } else {
//             new TWEEN.Tween(intersects[0].object.parent.scale)
//                 .to( {x: 1, y: 1, z: 1} , 250)
//                 .easing(TWEEN.Easing.Quadratic.InOut)
//                 .onStart(() => controls.enabled = false)
//                 .onComplete(() => controls.enabled = true)
//                 .start();
//             group.forEach( (gr, idx) => {
//                 if (gr != intersects[0].object.parent) return gr.visible = false;
//                 gr.visible = true;
//                 phaseListArr.slice(1, -1)[idx].open = true;
//             });
//             controls.enabled = true;
//             sectionAbout.removeEventListener('pointerdown', onPointerDown, false );
//             document.body.style = 'user-select: none';
//         }
//     }
// };

// let previousMousePosition,
//     startMousePosition,
//     swipeStart;

// function onPointerDown(event) {
//     swipeStart = new Date().getTime();
//     document.body.style = 'user-select: none';

//     startMousePosition = previousMousePosition = event.clientX;
//     window.addEventListener( 'pointermove', onPointerMove, false );
//     window.addEventListener( 'pointerup', onPointerLeave, false );
//     window.addEventListener( 'pointerout', onPointerLeave, false );
// };

// function onPointerMove(event) {
//     let deltaMove = event.clientX - previousMousePosition;
//     groupS.rotation.y += -deltaMove * 0.0008;
//     previousMousePosition = event.clientX;

//     if ( groupS.rotation.y > step.at(-1) ) {
//         groupS.rotation.y = step.at(1);
//     } else if ( groupS.rotation.y <= step.at(0) ) {
//         groupS.rotation.y = step.at(-2);
//     };

// };

// function onPointerLeave(event) {
//     if (event.relatedTarget && event.relatedTarget.closest('.section__about') && event.pressure != 0) return;
//     let setDeg = step.reduce( (prev, curr) => {return (Math.abs(curr - groupS.rotation.y) < Math.abs(prev - groupS.rotation.y) ? curr : prev)});
//     let swipeEnd = new Date().getTime();
//     let swipeDelay = swipeEnd - swipeStart;

//     if ( (swipeDelay < 130) && (swipeDelay > 60) ) {
//         if ( event.clientX - startMousePosition < -100 ) {
//             setDeg = step.reduce( (prev, curr) => { return groupS.rotation.y > prev ? curr : prev });
//         } else if ( event.clientX - startMousePosition > 100 ) {
//             setDeg = step.reduceRight( (prev, curr) => { return groupS.rotation.y < prev ? curr : prev });
//         }
//     };

//     phaseListArr.forEach( (it, idx) => {
//         if ( idx == step.findIndex(number => number == setDeg) ) {
//             it.classList.add('visible');
//         } else {
//             it.classList.remove('visible');
//         }
//     });
//     new TWEEN.Tween(groupS.rotation)
//         .to( {y: setDeg} , 400)
//         .easing(TWEEN.Easing.Cubic.Out)
//         .start();

//     document.body.style = '';
//     window.removeEventListener( 'pointermove', onPointerMove, false );
//     window.removeEventListener( 'pointerup', onPointerLeave, false );
//     window.removeEventListener( 'pointerout', onPointerLeave, false );
// };

// let lastTouch;
// sectionAbout.addEventListener( "touchstart", (ev) => {
//     let now = new Date().getTime();
//     let touchDelay = now - lastTouch;
//     if ( (touchDelay < 180) && (touchDelay > 0) ) {
//         onPointerDblClick(ev);
//     }
//     lastTouch = new Date().getTime();
// }, false );

// phaseListArr.forEach((item) => {
//     item.addEventListener("toggle", (event) => {
//         if (event.target.dataset.twin) {
//             phaseListArr.filter( item => item.dataset.twin == event.target.dataset.twin).forEach( item => item.open = event.target.open);
//         }
//     });
// });