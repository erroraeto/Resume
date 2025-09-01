import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";
// https://www.shadertoy.com/view/t3XGzM
// init
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

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(1.5, 1, 10, 10);
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: textures[0] },
        positionVlak3: {value: -3.5},
        transparent: true,
    },

    vertexShader: `
        varying vec2 vUv;
        void main(){
        vUv = uv;
        vec3 newposition = position;
        float distanceFromCenter = abs(
            (modelMatrix * vec4(position, 1.0)).x
        );
            
        // most important
        newposition.y *= 1.0 + 0.05*pow(distanceFromCenter,2.);
            
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
        }`,
    // fragmentShader: `
    //     uniform sampler2D uTexture;
    //     varying vec2 vUv;
    //     void main()	{
    //         gl_FragColor = texture2D(uTexture,vUv);
    //     }
    // `
    fragmentShader: `
        // uniform sampler2D uTexture;
        // varying vec2 vUv;

        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uRes;
        uniform vec2 uImageRes;

        varying vec2 vUv;

        #include ../includes/perlin3dNoise.glsl
        #include ../includes/coverUV.glsl

        void main()
        {
            // New UV to prevent image stretching on fullscreen mode
            vec2 newUv = CoverUV(vUv, uRes, uImageRes);

            // Displace the UV
            vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));

            // Perlin noise
            float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2 ));

            // Radial gradient
            float radialGradient = distance(vUv, vec2(0.5)) * 12.5 - 7.0 * uProgress;
            strength += radialGradient;

            // Clamp the value from 0 to 1 & invert it
            strength = clamp(strength, 0.0, 1.0);
            strength = 1.0 - strength;

            // Apply texture
            vec3 textureColor = texture2D(uTexture, newUv).rgb;

            // Opacity animation
            float opacityProgress = smoothstep(0.0, 0.7, uProgress);

            // FINAL COLOR
            gl_FragColor = vec4(textureColor, strength * opacityProgress);
        }

    `


    // fragmentShader: `
    //     uniform sampler2D uTexture;
    //     varying vec3 vWorldDirection;
    //     void main() {
    //         vec3 direction = normalize( vWorldDirection );
    //         vec2 sampleUV = equirectUv( direction );
    //         gl_FragColor = texture2D( uTexture, sampleUV );
    //     }
    // `
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

};
gl.addEventListener('wheel', step);
gl.addEventListener("mousedown", (event) => {
    isDown = true;
    startX = event.pageX;
});
gl.addEventListener("mousemove", (event) => {
    if (isDown) step(event);
});
window.addEventListener("mouseup", (event) => {
    isDown = false,
    startX = 0;
});
requestAnimationFrame(step);



// const width = window.innerWidth, height = window.innerHeight;

// // init

// const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
// camera.position.z = 1;

// const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

// const renderer = new THREE.WebGLRenderer( { antialias: true } );
// renderer.setSize( width, height );
// renderer.setAnimationLoop( animate );
// document.body.appendChild( renderer.domElement );

// // animation

// function animate( time ) {

// 	mesh.rotation.x = time / 2000;
// 	mesh.rotation.y = time / 1000;

// 	renderer.render( scene, camera );

// }










// // let example = document.querySelector('canvas'),
// // ctx = example.getContext('2d'),
// // pic = new Image();
// // example.height = example.parentElement.clientHeight;
// // example.width = example.parentElement.clientWidth;
// // pic.src = './img/1.png';

// // pic.onload = function () {
// //     // Иллюстрация для пример №1
// //     ctx.drawImage(pic, 0, 0);
// //     // Иллюстрация для пример №2
// //     // ctx.drawImage(pic, 0, 130, 300, 150);
// //     // Иллюстрация для пример №3
// //     // ctx.drawImage(pic, 25, 42, 85, 55, 0, 300, 170, 110);
// // }



// let bg = document.getElementById('bg'),
// c = document.getElementById('c'),
// ctx = c.getContext('2d'),
// src = "./img/1.png";

// var img = new Image();
// img.crossOrigin = "Anonymous";
// img.onload = function() {
//     var w = bg.parentElement.clientWidth,
//         h = bg.parentElement.clientHeight;
    
//     bg.width = w;
//     bg.height = h;
//     // bg.style.marginLeft = -w/2 + 'px';  
//     // bg.style.marginTop = -h/2 + 'px';

//     bg.getContext('2d').drawImage(img, 0, 0, w, h);
    
//     window.addEventListener("mousemove", distortion);
//     window.addEventListener("touchmove", distortion);
// }
// img.src = src;

// function distortion(e) {
//     var cx = (e.touches ? e.touches[0].clientX : e.clientX),
//         cy = (e.touches ? e.touches[0].clientY : e.clientY),
//         size = 400,
//         zoom = 1.85;
    
//     c.width = size;
//     c.height = size;
//     c.style.left = cx - size / 2 + 'px';
//     c.style.top = cy - size / 2 + 'px';
   
//     ctx.fillStyle = '#000';
//     ctx.fillRect(0, 0, size, size);
//     ctx.drawImage(
//         bg, 
//         cx - bg.offsetLeft - .5 * size / zoom, 
//         cy - bg.offsetTop - .5 * size / zoom,
//         size / zoom,
//         size / zoom, 
//         0,
//         0,
//         size,
//         size
//     );
    
//     var imgData = ctx.getImageData(0, 0, size, size);
//         pixels = imgData.data,
//         pixelsCopy = [], index = 0, h = size, w = size;
    
//     for (var i = 0; i <= pixels.length; i+=4) {
//         pixelsCopy[index] = [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];
//         index++;
//     }
    
//     var result = fisheye(pixelsCopy, w, h);
    
//     for(var i = 0; i < result.length; i++) {
//         index = 4*i;
//         if (result[i] != undefined) {
//             pixels[index + 0] = result[i][0];
//             pixels[index + 1] = result[i][1];
//             pixels[index + 2] = result[i][2]; 
//             pixels[index + 3] = result[i][3];
//         }
//     }
    
//     ctx.putImageData(imgData, 0, 0);
// }

// function fisheye(srcpixels, w, h) {

//     var dstpixels = srcpixels.slice();

//     for (var y = 0; y < h; y++) {

//         var ny = ((2*y)/h)-1;
//         var ny2 = ny*ny;

//         for (var x = 0; x < w; x++) {

//             var nx = ((2*x)/w)-1;
//             var nx2 = nx*nx;
//             var r = Math.sqrt(nx2+ny2);

//             if (0.0 <= r && r <= 1.0) {
//                 var nr = Math.sqrt(1.0-r*r);
//                 nr = (r + (1.0-nr)) / 2.0;

//                 if (nr <= 1.0) {

//                     var theta = Math.atan2(ny,nx);
//                     var nxn = nr*Math.cos(theta);
//                     var nyn = nr*Math.sin(theta);
//                     var x2 = parseInt(((nxn+1)*w)/2);
//                     var y2 = parseInt(((nyn+1)*h)/2);
//                     var srcpos = parseInt(y2*w+x2);
//                     if (srcpos >= 0 & srcpos < w*h) {
//                         dstpixels[parseInt(y*w+x)] = srcpixels[srcpos];
//                     }
//                 }
//             }
//         }
//     }
//     return dstpixels;
// } 