import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";
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
const alphaMapTexture = new THREE.TextureLoader().load('../img/AlphaMap.png');

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10);

camera.position.z = 1.4;

const scene = new THREE.Scene();
// --------------------------------------------------------------------------------------------------------------------------------------------------
const vMouse = new THREE.Vector2();
const vMouseDamp = new THREE.Vector2();
const vResolution = new THREE.Vector2();

const onPointerMove = (e) => { vMouse.set(e.pageX, e.pageY) }
document.addEventListener('mousemove', onPointerMove);
document.addEventListener('pointermove', onPointerMove);
document.body.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });

// --------------------------------------------------------------------------------------------------------------------------------------------------

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

        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: 2 }
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
    // fragmentShader: `
    //     uniform sampler2D uTexture;
    //     uniform float opacity;
    //     uniform float blend;

    //     varying vec2 vUv;

    //     float getFadeInWeight(vec2 uv) {
    //         float edge = 0.4 * abs(sin(0.5));
    //         return smoothstep(0., edge, uv.x) * smoothstep(0., edge, 1.-uv.x) * smoothstep(0., edge, uv.y) * smoothstep(0., edge, 1.-uv.y);
    //     }

    //     void main() {
    //         vec4 texelColor = texture2D(uTexture, vUv);
    //         float alpha = getFadeInWeight(vUv);
    //         // gl_FragColor = vec4(texelColor.rgb, texelColor.a * alpha);
            
            
    //         vec4 res = vec4(texelColor.rgb, texelColor.a * alpha);
    //         // vec3 finalColor = mix(alpha, uTexture, 1.0);
    //         // gl_FragColor = vec4(finalColor, 1.0);

    //         gl_FragColor = mix(texelColor, res, blend);
    //     }
    // `,
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
        fragmentShader: `
        varying vec2 v_texcoord;

        uniform vec2 u_mouse;
        uniform vec2 u_resolution;
        uniform float u_pixelRatio;

        /* common constants */
        #ifndef PI
        #define PI 3.1415926535897932384626433832795
        #endif
        #ifndef TWO_PI
        #define TWO_PI 6.2831853071795864769252867665590
        #endif

        /* variation constant */
        #ifndef VAR
        #define VAR 0
        #endif

        /* Coordinate and unit utils */
        #ifndef FNC_COORD
        #define FNC_COORD
        vec2 coord(in vec2 p) {
            p = p / u_resolution.xy;
            // correct aspect ratio
            if (u_resolution.x > u_resolution.y) {
                p.x *= u_resolution.x / u_resolution.y;
                p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
            } else {
                p.y *= u_resolution.y / u_resolution.x;
                p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
            }
            // centering
            p -= 0.5;
            p *= vec2(-1.0, 1.0);
            return p;
        }
        #endif

        #define st0 coord(gl_FragCoord.xy)
        #define mx coord(u_mouse * u_pixelRatio)

        /* signed distance functions */
        float sdRoundRect(vec2 p, vec2 b, float r) {
            vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
            return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
        }
        float sdCircle(in vec2 st, in vec2 center) {
            return length(st - center) * 2.0;
        }
        float sdPoly(in vec2 p, in float w, in int sides) {
            float a = atan(p.x, p.y) + PI;
            float r = TWO_PI / float(sides);
            float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
            return d * 2.0 - w;
        }

        /* antialiased step function */
        float aastep(float threshold, float value) {
            float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
            return smoothstep(threshold - afwidth, threshold + afwidth, value);
        }
        /* Signed distance drawing methods */
        float fill(in float x) { return 1.0 - aastep(0.0, x); }
        float fill(float x, float size, float edge) {
            return 1.0 - smoothstep(size - edge, size + edge, x);
        }

        float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
        float stroke(float x, float size, float w, float edge) {
            float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
            return clamp(d, 0.0, 1.0);
        }

        void main() {
            vec2 pixel = 1.0 / u_resolution.xy;
            vec2 st = st0 + 0.5;
            vec2 posMouse = mx * vec2(1., -1.) + 0.5;
            
            /* sdf (Round Rect) params */
            float size = 1.2;
            float roundness = 0.4;
            float borderSize = 0.05;
            
            /* sdf Circle params */
            float circleSize = 0.3;
            float circleEdge = 0.5;
            
            /* sdf Circle */
            float sdfCircle = fill(
                sdCircle(st, posMouse),
                circleSize,
                circleEdge
            );
            
            float sdf;
            if (VAR == 0) {
                /* sdf round rectangle with stroke param adjusted by sdf circle */
                sdf = sdRoundRect(st, vec2(size), roundness);
                sdf = stroke(sdf, 0.0, borderSize, sdfCircle) * 4.0;
            } else if (VAR == 1) {
                /* sdf circle with fill param adjusted by sdf circle */
                sdf = sdCircle(st, vec2(0.5));
                sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
            } else if (VAR == 2) {
                /* sdf circle with stroke param adjusted by sdf circle */
                sdf = sdCircle(st, vec2(0.5));
                sdf = stroke(sdf, 0.58, 0.02, sdfCircle) * 4.0;
            } else if (VAR == 3) {
                /* sdf circle with fill param adjusted by sdf circle */
                sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
                sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
            }
            
            vec3 color = vec3(sdf);
            gl_FragColor = vec4(color.rgb, 1.0);
        }
    `,
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