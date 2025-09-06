// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import * as THREE from 'three';
import { GodRaysDepthMaskShader, GodRaysGenerateShader, GodRaysCombineShader, GodRaysFakeSunShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/shaders/GodRaysShader.js';
import { EffectComposer } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/RenderPass.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

let sectionSoftSkills = document.querySelector('.section__soft-skills');
let camera, scene, renderer, renderPass, bokehPass, composer, spotLight;
let pale = 0;
const postprocessing = { enabled: true };
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

    postEffects();

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
    const material = new THREE.MeshLambertMaterial({
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
    let material1 = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
    let mesh1 = new THREE.Mesh( geometry1, material1 );
    mesh1.receiveShadow = true;
    // pale += mesh1.position.x = i * 1.2;
    scene.add(mesh1);


}

function postEffects() {

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // const godRaysEffect = new GodRaysGenerateShader(camera, spotLight, {
    //     // Optional configuration options
    //     // density: 0.96,
    //     // decay: 0.92,
    //     // weight: 0.3,
    //     // exposure: 0.5,
    //     // samples: 60,
    //     // blurriness: 1.0,
    //     // kernelSize: KernelSize.SMALL,
    // });
    // const effectPass = new EffectPass(camera, godRaysEffect);
    // composer.addPass(effectPass);





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
    // postprocessing.scene.add( postprocessing.quad );
}

function onWindowResize() {

    // const aspect = window.innerWidth / window.innerHeight;
    const aspect = sectionSoftSkills.clientWidth / sectionSoftSkills.clientHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const dpr = renderer.getPixelRatio();
    // renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize( sectionSoftSkills.clientWidth, sectionSoftSkills.clientHeight );

}

function animate() {

    renderer.render(scene, camera);
    // composer.render();

}

function wheelItem(event) {

    let x = event.deltaX * 0.002;
    // let a = camera.position.x;
    camera.translateX(x);
    if (a + x < pale && a - x > 0) {
    }

};