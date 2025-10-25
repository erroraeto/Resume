import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



let buttonListMod = document.querySelectorAll('.list-model__button');
let progressiveBlur = document.querySelector('.progressive-blur');
let canvas = document.querySelector( '.list-model__canvas' );
const content = document.querySelector( '.list-model__content' );

let renderer;

const scenes = [];
const models = [];
const texture = [];
const group = [];
const iconSrc = [
    '../icons/draw.svg',
    '../icons/sculpt.svg',
    '../icons/retopo.svg',
    '../icons/uv.svg',
    '../icons/bake.svg',
    '../icons/t-paint.svg',
    '../icons/w-paint.svg',
];
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




const observerCanvasContainer = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if ( entry.isIntersecting ) {
            entry.target;
        };
        // if (entry.isIntersecting && entry.intersectionRatio == 1) {
        //     // entry.target.style.scale = '';
        // } else {
        //     // entry.target.style.scale = '0.8';
        // }
    })
}, {
    root: content,
    threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
});

init();

async function init() {

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

    for ( let i = 0; i < group.length; i ++ ) {

        const scene = new THREE.Scene();

        const element = document.createElement( 'div' );
        element.className = 'list-item';
        observerCanvasContainer.observe(element);

        const sceneElement = document.createElement( 'div' );
        sceneElement.className = 'preview';
        element.appendChild( sceneElement );


        const specificationEl = document.createElement( 'div' );
        specificationEl.className = 'specification';
        element.appendChild( specificationEl );

            const progressiveBlurEl = progressiveBlur.cloneNode(true);
            specificationEl.appendChild( progressiveBlurEl );

            const specificationTitleEl = document.createElement( 'div' );
            specificationTitleEl.className = 'specification__title';
            specificationEl.appendChild( specificationTitleEl );

                const iconEl = document.createElement( 'img' );
                iconEl.src = iconSrc[i];
                specificationTitleEl.appendChild( iconEl );

                const titleEl = document.createElement( 'h2' );
                titleEl.innerText = title[i];
                specificationTitleEl.appendChild( titleEl );

            const specificationDescEl = document.createElement( 'p' );
            specificationDescEl.className = 'specification__content';
            specificationDescEl.innerText = description[i];
            specificationEl.appendChild( specificationDescEl );


        const showElement = iconEl.cloneNode(true);
        showElement.addEventListener('click', listControl);
        showElement.className = 'list-item__gimbal';
        showElement.src = '../icons/gimbal.svg';
        showElement.dataset.current = i;
        element.appendChild( showElement );

        scene.userData.element = sceneElement;
        content.appendChild( element );

        const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
        camera.position.z = 2;
        scene.userData.camera = camera;

        // CONTROLS
        const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
        controls.minDistance = 2;
        controls.maxDistance = 5;
        controls.enablePan = false;
        controls.enableZoom = false;
        scene.userData.controls = controls;
        controls.enabled = false;

        group[i].scale.set(0.5, 0.5, 0.5);
        group[i].rotation.y = -0.2;
        scene.add(group[i]);
        scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444, 3 ) );
        scenes.push( scene );

    }

    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    updateSize();
    renderer.setAnimationLoop( animate );
    setTimeout(() => {
        renderer.setAnimationLoop( null );
    }, 600)

}

function updateSize() {
    renderer.setSize( content.scrollWidth, content.scrollHeight );
    renderer.setPixelRatio(window.devicePixelRatio);
}

function animate() {

    updateSize();

    renderer.setScissorTest( false );
    renderer.clear();
    renderer.setScissorTest( true );

    scenes.forEach( function ( scene ) {

        const element = scene.userData.element;
        const elementCont = element.offsetParent;

        const rect = {
            left: elementCont.offsetLeft + element.offsetLeft,
            top: elementCont.offsetTop + element.offsetTop,
            right: elementCont.offsetLeft + element.offsetLeft + element.clientWidth,
            bottom: elementCont.offsetTop + element.offsetTop + element.clientHeight,
        };

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




// EVENTS

buttonListMod.forEach((btn) => {
    btn.addEventListener('click', listMove);
});

function listMove(e) {
    if (e.target.closest('button').name == 'prev') {
        content.scrollTo({ left: content.scrollLeft - content.children[0].clientWidth, behavior: "smooth"});
    } else if (e.target.closest('button').name == 'next') {
        content.scrollTo({ left: content.scrollLeft + content.children[0].clientWidth, behavior: "smooth"});
    };
};

content.addEventListener('scroll', (e) => {
    if (content.scrollLeft - content.children[0].clientWidth <= 0) {
        buttonListMod[0].style.opacity = 0;
    } else {
        buttonListMod[0].style.opacity = '';
    }

    if (content.scrollLeft + content.clientWidth + content.children[0].clientWidth >= content.scrollWidth) {
        buttonListMod[1].style.opacity = 0;
    } else {
        buttonListMod[1].style.opacity = '';
    }

});


function listControl(e) {
    let i = e.target.dataset.current;
    let element = scenes[i].userData.element.offsetParent;
    element.classList.toggle('open');
    let control = scenes[i].userData.controls;
    if (control.enabled != true) {
        control.enabled = true;
        renderer.setAnimationLoop( animate );
    } else {
        control.enabled = false;
        setTimeout(() => {
            renderer.setAnimationLoop( null );
        }, 600)
    }
};