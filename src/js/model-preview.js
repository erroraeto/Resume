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




let sectionAbout = document.querySelector('.section__about');
let phaseList = document.querySelector('.section__about .list-phase');
let phaseListArr = Array.from(phaseList.children);

let camera, scene, raycaster, renderer, control, controls, composer, gimbal, material, stats, groupS;

const pointer = new THREE.Vector2();

const rayMeshes = [];
const models = [];
const group = [];
const step = [];

let radius = 5;

async function init() {

    // CAMERA
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    groupS = new THREE.Group();

    // SCENE
    scene = new THREE.Scene();

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


    setCircle(group);

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize );
    renderer.domElement.addEventListener('dblclick', onPointerDblClick );
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
    TWEEN.update();
    stats.update();
    renderer.render(scene, camera);
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

            new TWEEN.Tween(controls.camera.rotation)
                .to( {x: 0, y: 0, z: 0} , 500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() => controls.enabled = false)
                .onComplete(() => {
                    group.forEach( gr => gr.visible = true);
                })
                .start();
            new TWEEN.Tween(controls.camera.position)
                .to( {x: 0, y: 0, z: 0} , 500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() => controls.enabled = false)
                .onComplete(() => {
                    group.forEach( gr => gr.visible = true);
                    new TWEEN.Tween(intersects[0].object.parent.scale)
                        .to( {x: 1, y: 1, z: 1} , 250)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onStart(() => controls.enabled = false)
                        .onComplete(() => {
                            group.forEach( gr => gr.visible = true);
                            phaseListArr.forEach( item => item.open = false );
                        })
                        .start();
                })
                .start();

            renderer.domElement.addEventListener( 'pointerdown', onPointerDown, false );
        } else {
            new TWEEN.Tween(intersects[0].object.parent.scale)
                .to( {x: 1.1, y: 1.1, z: 1.1} , 250)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() => controls.enabled = false)
                .onComplete(() => controls.enabled = true)
                .start();
            group.forEach( (gr, idx) => {
                if (gr != intersects[0].object.parent) return gr.visible = false;
                gr.visible = true;
                phaseListArr.slice(1, -1)[idx].open = true;
            });
            controls.enabled = true;
            renderer.domElement.removeEventListener('pointerdown', onPointerDown, false );
        }
    }
};

let previousMousePosition,
    startMousePosition,
    swipeStart;

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

    if ( groupS.rotation.y > step.at(-1) ) {
        groupS.rotation.y = step.at(1);
    } else if ( groupS.rotation.y <= step.at(0) ) {
        groupS.rotation.y = step.at(-2);
    };

    phaseList.classList.remove('scroll-snap-type__x-mandatory', 'scroll-behavior__smooth');
    phaseList.scrollLeft += -deltaMove / 3;
};

function onPointerLeave(event) {
    phaseList.classList.add('scroll-snap-type__x-mandatory', 'scroll-behavior__smooth');
    let setDeg = step.reduce( (prev, curr) => {return (Math.abs(curr - groupS.rotation.y) < Math.abs(prev - groupS.rotation.y) ? curr : prev)});
    let swipeEnd = new Date().getTime();
    let swipeDelay = swipeEnd - swipeStart;

    if ( (swipeDelay < 130) && (swipeDelay > 0) ) {
        phaseList.classList.add('scroll-snap-type__x-mandatory', 'scroll-behavior__smooth');
        if ( (event.clientX * 3) - startMousePosition < -100 ) {
            setDeg = step.reduce( (prev, curr) => { return groupS.rotation.y > prev ? curr : prev });
            phaseList.scrollLeft += phaseList.clientWidth;
        } else if ( (event.clientX * 3) - startMousePosition > 100 ) {
            setDeg = step.reduceRight( (prev, curr) => { return groupS.rotation.y < prev ? curr : prev });
            phaseList.scrollLeft += -phaseList.clientWidth;
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

const observer = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            phaseList.classList.remove('scroll-snap-type__x-mandatory', 'scroll-behavior__smooth');
            if (entry.target == phaseList.children[0] && entry.isIntersecting) {
                phaseList.children[phaseListArr.length - 2].scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else if (entry.target == phaseList.children[phaseListArr.length - 1] && entry.isIntersecting) {
                phaseList.children[1].scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
            phaseList.classList.add('scroll-snap-type__x-mandatory', 'scroll-behavior__smooth');
        }
    })
    }, {
        root: phaseList,
        threshold: 1.0,
    }
);

phaseListArr.forEach((item) => {
    observer.observe(item)
    item.addEventListener("toggle", (event) => {
        if (event.target.dataset.twin) {
            phaseListArr.filter( item => item.dataset.twin == event.target.dataset.twin).forEach( item => item.open = true);
        }
    });
});