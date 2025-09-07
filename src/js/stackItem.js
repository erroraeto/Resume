// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { GodRaysFakeSunShader, GodRaysDepthMaskShader, GodRaysCombineShader, GodRaysGenerateShader } from 'three/addons/shaders/GodRaysShader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// import { init } from 'browser-sync';
// import { GodraysPass } from 'godrays';

let sectionSoftSkills = document.querySelector('.section__soft-skills');
let camera, scene, renderer, renderPass, bokehPass, composer, spotLight, materialDepth;
let pale = 0;
const postprocessing = { enabled: true };
const godrayRenderTargetResolutionMultiplier = 1.0 / 4.0;
const sunPosition = new THREE.Vector3( 0, 1000, - 1000 );
const clipPosition = new THREE.Vector4();
const screenSpacePosition = new THREE.Vector3();
const bgColor = 0x000511;
const sunColor = 0xffee00;
// let carouselMesh;
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

    camera = new THREE.PerspectiveCamera(30, sectionSoftSkills.clientWidth / sectionSoftSkills.clientHeight, 1, 100);
    camera.position.set(0, 0, 1).setLength(5.5);

    materialDepth = new THREE.MeshDepthMaterial();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(sectionSoftSkills.clientWidth, sectionSoftSkills.clientHeight);
    renderer.domElement.className = 'stackItem';
    sectionSoftSkills.insertAdjacentElement('afterbegin' , renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;



    spotLight = new THREE.SpotLight( 0xffffff, 100 );
    spotLight.position.set( 1, 2, 1 );
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 1;
    spotLight.decay = 2;
    spotLight.distance = 0;

    const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.15 );
    scene.add( ambient );

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.focus = 1;
    spotLight.shadow.bias = - .003;
    scene.add( spotLight );

    let lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( lightHelper );



    createCarousel();

    initPostprocessing( window.innerWidth, window.innerHeight );

    onWindowResize();

    const controls = new OrbitControls( camera, renderer.domElement );
    // controls.enableZoom = false;

    window.addEventListener( 'resize', onWindowResize );
    // sectionSoftSkills.addEventListener( 'wheel', wheelItem );


    renderer.setAnimationLoop( animate );
}

function createCarousel() {

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../img/Thing.png');

    const geometry = new THREE.PlaneGeometry( 1, 1 );
    // const material = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        // alphaTest: 0.5, // Optional: for hard cutouts based on alpha threshold
        side: THREE.DoubleSide // Important for seeing both sides of the extruded mesh
    });
    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = 1.2;
    scene.add(mesh);
    // for (let i = 0; i < 5; i++) {
    //     let geometry = new THREE.BoxGeometry( 0.01, 2, 1 );
    //     let material = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
    //     let mesh = new THREE.Mesh( geometry, material );
    //     pale += mesh.position.x = i * 1.2;
    //     scene.add(mesh);
    // }
    let geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
    let material1 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    let mesh1 = new THREE.Mesh( geometry1, material1 );
    mesh1.receiveShadow = true;
    // pale += mesh1.position.x = i * 1.2;
    scene.add(mesh1);


}

function initPostprocessing( renderTargetWidth, renderTargetHeight ) {

    postprocessing.scene = new THREE.Scene();

    postprocessing.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, - 10000, 10000 );
    postprocessing.camera.position.z = 100;

    postprocessing.scene.add( postprocessing.camera );

    postprocessing.rtTextureColors = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight, { type: THREE.HalfFloatType } );

    // I would have this quarter size and use it as one of the ping-pong render
    // targets but the aliasing causes some temporal flickering

    postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight, { type: THREE.HalfFloatType } );
    postprocessing.rtTextureDepthMask = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight, { type: THREE.HalfFloatType } );

    // The ping-pong render targets can use an adjusted resolution to minimize cost

    const adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
    const adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
    postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight, { type: THREE.HalfFloatType } );
    postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight, { type: THREE.HalfFloatType } );

    // god-ray shaders

    const godraysMaskShader = GodRaysDepthMaskShader;
    postprocessing.godrayMaskUniforms = THREE.UniformsUtils.clone( godraysMaskShader.uniforms );
    postprocessing.materialGodraysDepthMask = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godrayMaskUniforms,
        vertexShader: godraysMaskShader.vertexShader,
        fragmentShader: godraysMaskShader.fragmentShader

    } );

    const godraysGenShader = GodRaysGenerateShader;
    postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone( godraysGenShader.uniforms );
    postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godrayGenUniforms,
        vertexShader: godraysGenShader.vertexShader,
        fragmentShader: godraysGenShader.fragmentShader

    } );

    const godraysCombineShader = GodRaysCombineShader;
    postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone( godraysCombineShader.uniforms );
    postprocessing.materialGodraysCombine = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godrayCombineUniforms,
        vertexShader: godraysCombineShader.vertexShader,
        fragmentShader: godraysCombineShader.fragmentShader

    } );

    const godraysFakeSunShader = GodRaysFakeSunShader;
    postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone( godraysFakeSunShader.uniforms );
    postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godraysFakeSunUniforms,
        vertexShader: godraysFakeSunShader.vertexShader,
        fragmentShader: godraysFakeSunShader.fragmentShader

    } );

    postprocessing.godraysFakeSunUniforms.bgColor.value.setHex( bgColor );
    postprocessing.godraysFakeSunUniforms.sunColor.value.setHex( sunColor );

    postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.75;

    postprocessing.quad = new THREE.Mesh(
        new THREE.PlaneGeometry( 1.0, 1.0 ),
        postprocessing.materialGodraysGenerate
    );
    postprocessing.quad.position.z = - 9900;
    postprocessing.scene.add( postprocessing.quad );

}

function filterGodRays( inputTex, renderTarget, stepSize ) {

    postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

    postprocessing.godrayGenUniforms[ 'fStepSize' ].value = stepSize;
    postprocessing.godrayGenUniforms[ 'tInput' ].value = inputTex;

    renderer.setRenderTarget( renderTarget );
    renderer.render( postprocessing.scene, postprocessing.camera );
    postprocessing.scene.overrideMaterial = null;

}

function render() {

    if ( postprocessing.enabled ) {

        clipPosition.x = sunPosition.x;
        clipPosition.y = sunPosition.y;
        clipPosition.z = sunPosition.z;
        clipPosition.w = 1;

        clipPosition.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );

        // perspective divide (produce NDC space)

        clipPosition.x /= clipPosition.w;
        clipPosition.y /= clipPosition.w;

        screenSpacePosition.x = ( clipPosition.x + 1 ) / 2; // transform from [-1,1] to [0,1]
        screenSpacePosition.y = ( clipPosition.y + 1 ) / 2; // transform from [-1,1] to [0,1]
        screenSpacePosition.z = clipPosition.z; // needs to stay in clip space for visibility checks

        // Give it to the god-ray and sun shaders

        postprocessing.godrayGenUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );
        postprocessing.godraysFakeSunUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );

        // -- Draw sky and sun --

        // Clear colors and depths, will clear to sky color

        renderer.setRenderTarget( postprocessing.rtTextureColors );
        renderer.clear( true, true, false );

        // Sun render. Runs a shader that gives a brightness based on the screen
        // space distance to the sun. Not very efficient, so i make a scissor
        // rectangle around the suns position to avoid rendering surrounding pixels.

        const sunsqH = 0.74 * window.innerHeight; // 0.74 depends on extent of sun from shader
        const sunsqW = 0.74 * window.innerHeight; // both depend on height because sun is aspect-corrected

        screenSpacePosition.x *= window.innerWidth;
        screenSpacePosition.y *= window.innerHeight;

        renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
        renderer.setScissorTest( true );

        postprocessing.godraysFakeSunUniforms[ 'fAspect' ].value = window.innerWidth / window.innerHeight;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysFakeSun;
        renderer.setRenderTarget( postprocessing.rtTextureColors );
        renderer.render( postprocessing.scene, postprocessing.camera );

        renderer.setScissorTest( false );

        // -- Draw scene objects --

        // Colors

        scene.overrideMaterial = null;
        renderer.setRenderTarget( postprocessing.rtTextureColors );
        renderer.render( scene, camera );

        // Depth

        scene.overrideMaterial = materialDepth;
        renderer.setRenderTarget( postprocessing.rtTextureDepth );
        renderer.clear();
        renderer.render( scene, camera );

        //

        postprocessing.godrayMaskUniforms[ 'tInput' ].value = postprocessing.rtTextureDepth.texture;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysDepthMask;
        renderer.setRenderTarget( postprocessing.rtTextureDepthMask );
        renderer.render( postprocessing.scene, postprocessing.camera );

        // -- Render god-rays --

        // Maximum length of god-rays (in texture space [0,1]X[0,1])

        const filterLen = 1.0;

        // Samples taken by filter

        const TAPS_PER_PASS = 6.0;

        // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
        // would start with a small filter support and grow to large. however
        // the large-to-small order produces less objectionable aliasing artifacts that
        // appear as a glimmer along the length of the beams

        // pass 1 - render into first ping-pong target
        filterGodRays( postprocessing.rtTextureDepthMask.texture, postprocessing.rtTextureGodRays2, getStepSize( filterLen, TAPS_PER_PASS, 1.0 ) );

        // pass 2 - render into second ping-pong target
        filterGodRays( postprocessing.rtTextureGodRays2.texture, postprocessing.rtTextureGodRays1, getStepSize( filterLen, TAPS_PER_PASS, 2.0 ) );

        // pass 3 - 1st RT
        filterGodRays( postprocessing.rtTextureGodRays1.texture, postprocessing.rtTextureGodRays2, getStepSize( filterLen, TAPS_PER_PASS, 3.0 ) );

        // final pass - composite god-rays onto colors

        postprocessing.godrayCombineUniforms[ 'tColors' ].value = postprocessing.rtTextureColors.texture;
        postprocessing.godrayCombineUniforms[ 'tGodRays' ].value = postprocessing.rtTextureGodRays2.texture;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;

        renderer.setRenderTarget( null );
        renderer.render( postprocessing.scene, postprocessing.camera );
        postprocessing.scene.overrideMaterial = null;

    } else {

        renderer.setRenderTarget( null );
        renderer.clear();
        renderer.render( scene, camera );
    
    }

}

function getStepSize( filterLen, tapsPerPass, pass ) {

    return filterLen * Math.pow( tapsPerPass, - pass );

}

function onWindowResize() {

    const renderTargetWidth = window.innerWidth;
    const renderTargetHeight = window.innerHeight;

    const aspect = window.innerWidth / window.innerHeight;
    // const aspect = sectionSoftSkills.clientWidth / sectionSoftSkills.clientHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const dpr = renderer.getPixelRatio();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setSize( sectionSoftSkills.clientWidth, sectionSoftSkills.clientHeight );


    postprocessing.rtTextureColors.setSize( renderTargetWidth, renderTargetHeight );
    postprocessing.rtTextureDepth.setSize( renderTargetWidth, renderTargetHeight );
    postprocessing.rtTextureDepthMask.setSize( renderTargetWidth, renderTargetHeight );

    const adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
    const adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
    postprocessing.rtTextureGodRays1.setSize( adjustedWidth, adjustedHeight );
    postprocessing.rtTextureGodRays2.setSize( adjustedWidth, adjustedHeight );

}

function animate() {

    // renderer.render(scene, camera);
    render();
    // composer.render();

}

function wheelItem(event) {

    let x = event.deltaX * 0.002;
    // let a = camera.position.x;
    camera.translateX(x);
    if (a + x < pale && a - x > 0) {
    }

};































































// let sectionSoftSkills = document.querySelector('.section__soft-skills');

// let container, stats;
// let camera, scene, renderer, materialDepth;

// let sphereMesh;

// const sunPosition = new THREE.Vector3( 0, 1000, - 1000 );
// const clipPosition = new THREE.Vector4();
// const screenSpacePosition = new THREE.Vector3();

// const postprocessing = { enabled: true };

// const orbitRadius = 200;

// const bgColor = 0x000511;
// const sunColor = 0xffee00;

// // Use a smaller size for some of the god-ray render targets for better performance.
// const godrayRenderTargetResolutionMultiplier = 1.0 / 4.0;

// init();

// function init() {

//     // container = document.createElement( 'div' );
//     // document.body.appendChild( container );

//     //

//     camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000 );
//     camera.position.z = 200;

//     scene = new THREE.Scene();

//     //

//     materialDepth = new THREE.MeshDepthMaterial();

//     // tree

//     // const loader = new OBJLoader();
//     // loader.load( 'models/obj/tree.obj', function ( object ) {

//     //     object.position.set( 0, - 150, - 150 );
//     //     object.scale.multiplyScalar( 400 );
//     //     scene.add( object );

//     // } );

//     // sphere

//     const geo = new THREE.SphereGeometry( 1, 20, 10 );
//     sphereMesh = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
//     sphereMesh.scale.multiplyScalar( 20 );
//     scene.add( sphereMesh );

//     //

//     renderer = new THREE.WebGLRenderer();
//     renderer.setClearColor( 0xffffff );
//     renderer.setPixelRatio( window.devicePixelRatio );
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     renderer.setAnimationLoop( animate );
//     sectionSoftSkills.insertAdjacentElement('afterbegin' , renderer.domElement);
//     // container.appendChild( renderer.domElement );

//     renderer.autoClear = false;

//     const controls = new OrbitControls( camera, renderer.domElement );
//     controls.minDistance = 50;
//     controls.maxDistance = 500;

//     //

//     stats = new Stats();
//     sectionSoftSkills.insertAdjacentElement('afterbegin' , stats.dom);
//     // container.appendChild( stats.dom );

//     //

//     window.addEventListener( 'resize', onWindowResize );

//     //

//     initPostprocessing( window.innerWidth, window.innerHeight );

// }

// //

// function onWindowResize() {

//     const renderTargetWidth = window.innerWidth;
//     const renderTargetHeight = window.innerHeight;

//     camera.aspect = renderTargetWidth / renderTargetHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( renderTargetWidth, renderTargetHeight );
//     postprocessing.rtTextureColors.setSize( renderTargetWidth, renderTargetHeight );
//     postprocessing.rtTextureDepth.setSize( renderTargetWidth, renderTargetHeight );
//     postprocessing.rtTextureDepthMask.setSize( renderTargetWidth, renderTargetHeight );

//     const adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
//     const adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
//     postprocessing.rtTextureGodRays1.setSize( adjustedWidth, adjustedHeight );
//     postprocessing.rtTextureGodRays2.setSize( adjustedWidth, adjustedHeight );

// }

// function initPostprocessing( renderTargetWidth, renderTargetHeight ) {

//     postprocessing.scene = new THREE.Scene();

//     postprocessing.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, - 10000, 10000 );
//     postprocessing.camera.position.z = 100;

//     postprocessing.scene.add( postprocessing.camera );

//     postprocessing.rtTextureColors = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight, { type: THREE.HalfFloatType } );

//     // I would have this quarter size and use it as one of the ping-pong render
//     // targets but the aliasing causes some temporal flickering

//     postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight, { type: THREE.HalfFloatType } );
//     postprocessing.rtTextureDepthMask = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight, { type: THREE.HalfFloatType } );

//     // The ping-pong render targets can use an adjusted resolution to minimize cost

//     const adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
//     const adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
//     postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight, { type: THREE.HalfFloatType } );
//     postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight, { type: THREE.HalfFloatType } );

//     // god-ray shaders

//     const godraysMaskShader = GodRaysDepthMaskShader;
//     postprocessing.godrayMaskUniforms = THREE.UniformsUtils.clone( godraysMaskShader.uniforms );
//     postprocessing.materialGodraysDepthMask = new THREE.ShaderMaterial( {

//         uniforms: postprocessing.godrayMaskUniforms,
//         vertexShader: godraysMaskShader.vertexShader,
//         fragmentShader: godraysMaskShader.fragmentShader

//     } );

//     const godraysGenShader = GodRaysGenerateShader;
//     postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone( godraysGenShader.uniforms );
//     postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial( {

//         uniforms: postprocessing.godrayGenUniforms,
//         vertexShader: godraysGenShader.vertexShader,
//         fragmentShader: godraysGenShader.fragmentShader

//     } );

//     const godraysCombineShader = GodRaysCombineShader;
//     postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone( godraysCombineShader.uniforms );
//     postprocessing.materialGodraysCombine = new THREE.ShaderMaterial( {

//         uniforms: postprocessing.godrayCombineUniforms,
//         vertexShader: godraysCombineShader.vertexShader,
//         fragmentShader: godraysCombineShader.fragmentShader

//     } );

//     const godraysFakeSunShader = GodRaysFakeSunShader;
//     postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone( godraysFakeSunShader.uniforms );
//     postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial( {

//         uniforms: postprocessing.godraysFakeSunUniforms,
//         vertexShader: godraysFakeSunShader.vertexShader,
//         fragmentShader: godraysFakeSunShader.fragmentShader

//     } );

//     postprocessing.godraysFakeSunUniforms.bgColor.value.setHex( bgColor );
//     postprocessing.godraysFakeSunUniforms.sunColor.value.setHex( sunColor );

//     postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.75;

//     postprocessing.quad = new THREE.Mesh(
//         new THREE.PlaneGeometry( 1.0, 1.0 ),
//         postprocessing.materialGodraysGenerate
//     );
//     postprocessing.quad.position.z = - 9900;
//     postprocessing.scene.add( postprocessing.quad );

// }

// function animate() {

//     stats.begin();
//     render();
//     stats.end();

// }

// function getStepSize( filterLen, tapsPerPass, pass ) {

//     return filterLen * Math.pow( tapsPerPass, - pass );

// }

// function filterGodRays( inputTex, renderTarget, stepSize ) {

//     postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

//     postprocessing.godrayGenUniforms[ 'fStepSize' ].value = stepSize;
//     postprocessing.godrayGenUniforms[ 'tInput' ].value = inputTex;

//     renderer.setRenderTarget( renderTarget );
//     renderer.render( postprocessing.scene, postprocessing.camera );
//     postprocessing.scene.overrideMaterial = null;

// }

// function render() {

//     const time = Date.now() / 4000;

//     sphereMesh.position.x = orbitRadius * Math.cos( time );
//     sphereMesh.position.z = orbitRadius * Math.sin( time ) - 100;

//     if ( postprocessing.enabled ) {

//         clipPosition.x = sunPosition.x;
//         clipPosition.y = sunPosition.y;
//         clipPosition.z = sunPosition.z;
//         clipPosition.w = 1;

//         clipPosition.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );

//         // perspective divide (produce NDC space)

//         clipPosition.x /= clipPosition.w;
//         clipPosition.y /= clipPosition.w;

//         screenSpacePosition.x = ( clipPosition.x + 1 ) / 2; // transform from [-1,1] to [0,1]
//         screenSpacePosition.y = ( clipPosition.y + 1 ) / 2; // transform from [-1,1] to [0,1]
//         screenSpacePosition.z = clipPosition.z; // needs to stay in clip space for visibility checks

//         // Give it to the god-ray and sun shaders

//         postprocessing.godrayGenUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );
//         postprocessing.godraysFakeSunUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );

//         // -- Draw sky and sun --

//         // Clear colors and depths, will clear to sky color

//         renderer.setRenderTarget( postprocessing.rtTextureColors );
//         renderer.clear( true, true, false );

//         // Sun render. Runs a shader that gives a brightness based on the screen
//         // space distance to the sun. Not very efficient, so i make a scissor
//         // rectangle around the suns position to avoid rendering surrounding pixels.

//         const sunsqH = 0.74 * window.innerHeight; // 0.74 depends on extent of sun from shader
//         const sunsqW = 0.74 * window.innerHeight; // both depend on height because sun is aspect-corrected

//         screenSpacePosition.x *= window.innerWidth;
//         screenSpacePosition.y *= window.innerHeight;

//         renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
//         renderer.setScissorTest( true );

//         postprocessing.godraysFakeSunUniforms[ 'fAspect' ].value = window.innerWidth / window.innerHeight;

//         postprocessing.scene.overrideMaterial = postprocessing.materialGodraysFakeSun;
//         renderer.setRenderTarget( postprocessing.rtTextureColors );
//         renderer.render( postprocessing.scene, postprocessing.camera );

//         renderer.setScissorTest( false );

//         // -- Draw scene objects --

//         // Colors

//         scene.overrideMaterial = null;
//         renderer.setRenderTarget( postprocessing.rtTextureColors );
//         renderer.render( scene, camera );

//         // Depth

//         scene.overrideMaterial = materialDepth;
//         renderer.setRenderTarget( postprocessing.rtTextureDepth );
//         renderer.clear();
//         renderer.render( scene, camera );

//         //

//         postprocessing.godrayMaskUniforms[ 'tInput' ].value = postprocessing.rtTextureDepth.texture;

//         postprocessing.scene.overrideMaterial = postprocessing.materialGodraysDepthMask;
//         renderer.setRenderTarget( postprocessing.rtTextureDepthMask );
//         renderer.render( postprocessing.scene, postprocessing.camera );

//         // -- Render god-rays --

//         // Maximum length of god-rays (in texture space [0,1]X[0,1])

//         const filterLen = 1.0;

//         // Samples taken by filter

//         const TAPS_PER_PASS = 6.0;

//         // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
//         // would start with a small filter support and grow to large. however
//         // the large-to-small order produces less objectionable aliasing artifacts that
//         // appear as a glimmer along the length of the beams

//         // pass 1 - render into first ping-pong target
//         filterGodRays( postprocessing.rtTextureDepthMask.texture, postprocessing.rtTextureGodRays2, getStepSize( filterLen, TAPS_PER_PASS, 1.0 ) );

//         // pass 2 - render into second ping-pong target
//         filterGodRays( postprocessing.rtTextureGodRays2.texture, postprocessing.rtTextureGodRays1, getStepSize( filterLen, TAPS_PER_PASS, 2.0 ) );

//         // pass 3 - 1st RT
//         filterGodRays( postprocessing.rtTextureGodRays1.texture, postprocessing.rtTextureGodRays2, getStepSize( filterLen, TAPS_PER_PASS, 3.0 ) );

//         // final pass - composite god-rays onto colors

//         postprocessing.godrayCombineUniforms[ 'tColors' ].value = postprocessing.rtTextureColors.texture;
//         postprocessing.godrayCombineUniforms[ 'tGodRays' ].value = postprocessing.rtTextureGodRays2.texture;

//         postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;

//         renderer.setRenderTarget( null );
//         renderer.render( postprocessing.scene, postprocessing.camera );
//         postprocessing.scene.overrideMaterial = null;

//     } else {

//         renderer.setRenderTarget( null );
//         renderer.clear();
//         renderer.render( scene, camera );

//     }

// }






























































// let sectionSoftSkills = document.querySelector('.section__soft-skills');
// // let scene, cameraPost, controls, time, isPlaying, baseTexture, width, height, container, renderer, camera, karasi, material, materialOrtho, scenePost;
// let scene, cameraPost, controls, time, isPlaying, baseTexture, width, height, container, renderer, camera, karasi, materialOrtho, scenePost;
// let sw = "../img/map1.7386d1e4.png";
// // let sw = "../img/Thing.png";

// function init(options) {
//     scene = new THREE.Scene();

//     container = options;
//     width = container.clienttWidth;
//     height = container.clientHeight;
//     renderer = new THREE.WebGLRenderer();
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     renderer.setSize(width, height);
//     renderer.setClearColor(0x000000, 1); 
//     renderer.physicallyCorrectLights = true;
//     renderer.outputEncoding = THREE.sRGBEncoding;

//     container.appendChild(renderer.domElement);

//     camera = new THREE.PerspectiveCamera(
//         70,
//         window.innerWidth / window.innerHeight,
//         0.001,
//         1000
//     );

//     var frustumSize = 1;
//     var aspect = 1;
//     cameraPost = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );

//     camera.position.set(0, 0, 1);
//     controls = new OrbitControls(camera, renderer.domElement);
//     time = 0;

//     let dracoLoader = new DRACOLoader();
//     // dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'); // use a full url path
//     dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/draco_decoder.js'); 
//     let gltf = new GLTFLoader();
//     gltf.setDRACOLoader(dracoLoader);

//     isPlaying = true;
//     initPost()
//     addObjects();
//     resize();
//     render();
//     setupResize();
//     // this.settings();
// }

// function settings() {
//     let that = container;
//     settings = {
//       progress: 0,
//     };
//     let gui = new GUI();
//     gui.add(settings, "progress", 0, 1, 0.01);
// }

// function setupResize() {
//     window.addEventListener("resize", resize);
// }

// function initPost() {
//     baseTexture = new THREE.WebGLRenderTarget(width, height, {
//         minFilter: THREE.LinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBAFormat
//     })

//     materialOrtho = new THREE.ShaderMaterial({
//         extensions: {
//         derivatives: "#extension GL_OES_standard_derivatives : enable"
//         },
//         side: THREE.DoubleSide,
//         uniforms: {
//         time: { value: 0 },
//         uMap: { value: null },
//         },
//         // wireframe: true,
//         // transparent: true,
//         vertexShader: `
//             uniform float time;
//             varying vec2 vUv;
//             varying vec3 vPosition;
//             uniform vec2 pixels;
//             float PI = 3.141592653589793238;
//             void main() {
//             vUv = uv;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//             }
//         `,
//         fragmentShader: `
//             uniform float time;
//             uniform float progress;
//             uniform sampler2D uMap;
//             uniform vec4 resolution;
//             varying vec2 vUv;
//             varying vec3 vPosition;
//             float PI = 3.141592653589793238;
//             float rand(vec2 co){
//                 return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
//             }
//             void main()	{

//                 vec4 c = texture2D(uMap, vUv);

//                 vec2 toCenter = vec2(0.5) - vUv;

//                 vec4 original = texture2D(uMap, vUv );

//                 vec4 color = vec4(0.0);
//                 float total = 0.0;
//                 for(float i = 0.; i < 20.; i++) {
//                     float lerp = (i + rand(vec2(gl_FragCoord.x,gl_FragCoord.y )))/20.;

//                     float weight = sin(lerp * PI);
//                     vec4 mysample = texture2D(uMap, vUv + toCenter*lerp*0.5);
//                     mysample.rgb *=mysample.a;
//                     color += mysample*weight;
//                     total +=weight;
//                 }
//                 color.a = 1.0;
//                 color.rgb /= total;


//                 vec4 finalColor = 1. - (1. - color)*(1. - original);


//                 gl_FragColor = vec4(toCenter, 0.0, 1.0);
//                 gl_FragColor = color;
//                 gl_FragColor = finalColor;
//                 // gl_FragColor = original;
//                 // gl_FragColor = vec4(
//                 // 	vec3(rand(vUv)),
//                 // 	1.
//                 // 	);
//             }
//         `,
//         side: THREE.DoubleSide
//     });

//     // let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), materialOrtho);
//     let mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialOrtho);
//     // let mesh = new THREE.Mesh(new THREE.BufferGeometry(1, 1), materialOrtho);

//     scenePost = new THREE.Scene();

//     scenePost.add(mesh);
// }

// function resize() {
//     let width = container.offsetWidth;
//     let height = container.offsetHeight;
//     renderer.setSize(width, height);
//     camera.aspect = width / height;

//     camera.updateProjectionMatrix();
// }

// function addObjects() {
//     // let tt = new THREE.TextureLoader().load(sw)
//     let tt = new THREE.TextureLoader().load('../img/map1.7386d1e4.png')

//     tt.wrapT = THREE.RepeatWrapping;
//     tt.wrapS = THREE.RepeatWrapping;
//     let material = new THREE.ShaderMaterial({
//         extensions: {
//         derivatives: "#extension GL_OES_standard_derivatives : enable"
//         },
//         side: THREE.DoubleSide,
//         uniforms: {
//         time: { value: 0 },
//         uMap: { value: tt },
//         // uMap: { value: new THREE.TextureLoader().load(circles) },
//         resolution: { value: new THREE.Vector4() },
//         },
//         // wireframe: true,
//         // transparent: true,
//         vertexShader: `
//             uniform float time;
//             varying vec2 vUv;
//             varying vec3 vPosition;
//             uniform vec2 pixels;
//             float PI = 3.141592653589793238;
//             void main() {
//             vUv = uv;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//             }
//         `,
//         fragmentShader: `
//             uniform float time;
//             uniform float progress;
//             uniform sampler2D uMap;
//             uniform vec4 resolution;
//             varying vec2 vUv;
//             varying vec3 vPosition;
//             float PI = 3.141592653589793238;
//             float hash12(vec2 p)
//             {
//                 vec3 p3  = fract(vec3(p.xyx) * .1031);
//                 p3 += dot(p3, p3.yzx + 33.33);
//                 return fract((p3.x + p3.y) * p3.z);
//             }
//             float hue2rgb(float f1, float f2, float hue) {
//                 if (hue < 0.0)
//                     hue += 1.0;
//                 else if (hue > 1.0)
//                     hue -= 1.0;
//                 float res;
//                 if ((6.0 * hue) < 1.0)
//                     res = f1 + (f2 - f1) * 6.0 * hue;
//                 else if ((2.0 * hue) < 1.0)
//                     res = f2;
//                 else if ((3.0 * hue) < 2.0)
//                     res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
//                 else
//                     res = f1;
//                 return res;
//             }

//             vec3 hsl2rgb(vec3 hsl) {
//                 vec3 rgb;
                
//                 if (hsl.y == 0.0) {
//                     rgb = vec3(hsl.z); // Luminance
//                 } else {
//                     float f2;
                    
//                     if (hsl.z < 0.5)
//                         f2 = hsl.z * (1.0 + hsl.y);
//                     else
//                         f2 = hsl.z + hsl.y - hsl.y * hsl.z;
                        
//                     float f1 = 2.0 * hsl.z - f2;
                    
//                     rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
//                     rgb.g = hue2rgb(f1, f2, hsl.x);
//                     rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
//                 }   
//                 return rgb;
//             }

//             vec3 hsl2rgb(float h, float s, float l) {
//                 return hsl2rgb(vec3(h, s, l));
//             }
//             void main()	{
//                 // vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
//                 vec3 color1 = vec3(0.997, 0.307, 0.928);
//                 vec3 color2 = vec3(0.964, 0.969, 0.287);
//                 vec3 color3 = vec3(0.209, 0.740, 0.301);
//                 vec3 finalColor;

//                 float grid = 12.;
                
//                 vec2 currentUV = 
//                         vUv*grid
//                         + vec2(mod(floor(vUv.y*grid),2.),0.)/2.
//                     ;
//                 vec2 idd = floor(currentUV);
//                 float x = hash12(vec2(idd));
//                 finalColor = color3;
//                 if(x>0.66){
//                     finalColor = color1;
//                 }
//                 if(x<0.33){
//                     finalColor = color2;
//                 }
//                 float localtime = time/8. + 0.*hash12(vec2(idd.x,idd.y +1.));
//                 finalColor = hsl2rgb(fract(x + floor(localtime)/4.), 1., 0.55);
//                 vec4 c = texture2D(uMap, fract(currentUV));
//                 gl_FragColor = vec4(vUv,0.0,1.);
//                 gl_FragColor = vec4( vec3(c.rgb)*finalColor,1.);


//                 if(
//                     abs(fract(currentUV.x))<0.1 
//                     || abs(fract(currentUV.y))<0.1 || abs(1.-fract(currentUV.x))<0.1 || abs(1.-fract(currentUV.y))<0.1
//                 ) gl_FragColor = vec4(0.,0.,0.,1.);
//                 // gl_FragColor = c;
//             }
//         `,
//     });

//     // let geometry = new THREE.SphereBufferGeometry(0.5,30,30);
//     let geometry = new THREE.SphereGeometry(0.5,30,30);
//     // let geometry = new THREE.BufferGeometry(0.5,30,30);

//     karasi = new THREE.Mesh(geometry, material);
//     scene.add(karasi);
// }

// function stop() {
//     isPlaying = false;
// }

// function play() {
//     if(!isPlaying){
//         isPlaying = true;
//         render()
//     }
// }

// function render() {
//     if (!isPlaying) return;
//     time += 0.05;
//     // karasi.rotation.y = -time/20
//     // material.uniforms.time.value = time;
//     requestAnimationFrame(render);

//     renderer.setRenderTarget(baseTexture);
//     renderer.render(scene, camera);

//     materialOrtho.uniforms.uMap.value = baseTexture.texture;
//     materialOrtho.uniforms.time.value = time;


//     renderer.setRenderTarget(null);
//     renderer.render(scenePost, cameraPost);
// }

// init(sectionSoftSkills);




























































// let sectionSoftSkills = document.querySelector('.section__soft-skills');

// var scene, camera, renderer, composer, box, pointLight,
//     occlusionComposer, occlusionRenderTarget, occlusionBox, lightSphere,
    
//     angle = 0,

//     DEFAULT_LAYER = 0,
//     OCCLUSION_LAYER = 1;

// // scene, camera, and renderer as normal for three.js
// scene = new THREE.Scene();
// camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// renderer = new THREE.WebGLRenderer();
// renderer.setPixelRatio( window.devicePixelRatio );
// renderer.setSize( window.innerWidth, window.innerHeight );
// // document.body.appendChild( renderer.domElement );
// sectionSoftSkills.insertAdjacentElement('afterbegin' , renderer.domElement);

// function setupScene(){
//     var ambientLight,
//         geometry,
//         material;
    
//     // two lights, an ambient to mimic reflected light
//     // on the back side of the box as it passes in front of the light
//     ambientLight = new THREE.AmbientLight(0x2c3e50);
//     scene.add(ambientLight);
//     // and a point light to represent the source of the light volume
//     pointLight = new THREE.PointLight(0xffffff);
//     scene.add(pointLight);
    
//     // a white sphere serves as the light in the scene used 
//     // to create the effect
//     // geometry = new THREE.SphereBufferGeometry( 1, 16, 16 );
//     geometry = new THREE.SphereGeometry( 1, 16, 16 );
//     material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
//     lightSphere = new THREE.Mesh( geometry, material );
//     lightSphere.layers.set( OCCLUSION_LAYER );
//     // layers are a newer addition to three.js ( as of r74 )
//     // they control what objects a camera is able to see. This way 
//     // only one scene needs to be used for both rendering passes
//     scene.add( lightSphere );
    
//     // the box in the scene that rotatates around the light
//     // geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
//     geometry = new THREE.BoxGeometry( 1, 1, 1 );
//     material = new THREE.MeshPhongMaterial( { color: 0xe74c3c } );
//     box = new THREE.Mesh( geometry, material );
//     box.position.z = 2;
//     scene.add( box );
    
//     // the all black second box that is used to create the occlusion 
//     material = new THREE.MeshBasicMaterial( { color:0x000000 } );
//     occlusionBox = new THREE.Mesh( geometry, material);
//     occlusionBox.position.z = 2;
//     occlusionBox.layers.set( OCCLUSION_LAYER );
//     scene.add( occlusionBox );
    
//     camera.position.z = 6;
// }

// function setupPostprocessing(){
//     var pass;
    
//     // create the occlusion render target and composer
//     // to increase performance we only render the effect at 1/2 the screen size
//     occlusionRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth * 0.5, window.innerHeight * 0.5 );
//     occlusionComposer = new EffectComposer( renderer, occlusionRenderTarget);
//     // add a scene render pass
//     occlusionComposer.addPass( new RenderPass( scene, camera ) );
//     // add the volumeteric shader pass that will automatically be applied
//     // to texture created by the scene render 
//     pass = new ShaderPass( THREE.VolumetericLightShader );
//     // since only one shader is used the front and back buffers do not need to be swapped
//     // after the shader does its work.
//     pass.needsSwap = false;
//     occlusionComposer.addPass( pass );
    
//     // a second composer and render pass for the lit scene
//     composer = new EffectComposer( renderer );
//     composer.addPass( new RenderPass( scene, camera ) );
//     // an additive blending pass that takes as a uniform
//     // the resulting texture from the volumetric light shader 
//     // pass = new ShaderPass( THREE.AdditiveBlendingShader );
//     pass = new ShaderPass( THREE.AdditiveBlending );
//     // pass.uniforms.tAdd.value = occlusionRenderTarget.texture;
//     pass.uniforms.tAdd = occlusionRenderTarget.texture;
//     composer.addPass( pass );
//     pass.renderToScreen = true;
// }
  
// function onFrame(){
//     requestAnimationFrame( onFrame );
//     update();
//     render();
// }
  
// function update(){
//     var radius = 2.5,
//         xpos = Math.sin(angle) * radius,
//         zpos = Math.cos(angle) * radius;
    
//     // each frame rotate the lit cube
//     box.position.set( xpos, 0, zpos);
//     box.rotation.x += 0.01;
//     box.rotation.y += 0.01;
    
//     // and match its position and rotation with the 
//     // occluding cube
//     occlusionBox.position.copy(box.position);
//     occlusionBox.rotation.copy(box.rotation);
    
//     angle += 0.02;
// }

// function render(){
//     // show the objects in the occlusion scene
//     camera.layers.set(OCCLUSION_LAYER);
//     // set a black background for the render
//     renderer.setClearColor(0x000000);
//     // render the occlusion scene and apply the volumetric light shader
//     occlusionComposer.render();
    
//     // show the objects in the lit scene
//     camera.layers.set(DEFAULT_LAYER);
//     // set a new background color
//     renderer.setClearColor(0x090611);
//     // render the lit scene and blend the volumetric light effect
//     composer.render();
// }
  
// setupScene();
// setupPostprocessing();
// onFrame();