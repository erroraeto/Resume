import*as THREE from"https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";let gl=document.querySelector("#gl"),textures=(gl.height=gl.clientHeight,gl.width=gl.clientWidth,["../img/1.png","../img/2.png","../img/3.png","../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png"].map(e=>(new THREE.TextureLoader).load(e))),alphaMapTexture=(new THREE.TextureLoader).load("../img/AlphaMap.png"),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.01,10),scene=(camera.position.z=1.4,new THREE.Scene),vMouse=new THREE.Vector2,vMouseDamp=new THREE.Vector2,vResolution=new THREE.Vector2,onPointerMove=e=>{vMouse.set(e.pageX,e.pageY)},geometry=(document.addEventListener("mousemove",onPointerMove),document.addEventListener("pointermove",onPointerMove),document.body.addEventListener("touchmove",function(e){e.preventDefault()},{passive:!1}),new THREE.PlaneGeometry(1.5,1,20,20)),material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:textures[0]},opacity:{value:1},blend:{value:.8},tMap:{value:textures[0]},uPlaneSize:{value:[0,0]},uImageSize:{value:[0,0]},uViewportSize:{value:[window.innerWidth,window.innerHeight]},uTime:{value:100*Math.random()},uBlurStrength:{value:.1},u_mouse:{value:vMouseDamp},u_resolution:{value:vResolution},u_pixelRatio:{value:2}},depthTest:!1,depthWrite:!1,transparent:!0,vertexShader:`
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
        }`,fragmentShader:`
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
    `});for(let o=0;o<8;o++){let e=material.clone(),t=(e.uniforms.uTexture.value=textures[o%8],new THREE.Mesh(geometry,e));t.position.x=1.7*o,scene.add(t)}let renderer=new THREE.WebGLRenderer({canvas:gl,antialias:!0,alpha:!0}),start=(renderer.setSize(gl.clientWidth,gl.clientHeight),null),isDown=!1,startX;function step(e){var t;start=start||e,"number"==typeof e&&(t=e-start,scene.position.x=0,renderer.render(scene,camera),t<2e3)&&requestAnimationFrame(step),"wheel"==e.type&&(scene.position.x+=.005*-e.deltaX,renderer.render(scene,camera),console.log("Delta X:",e.deltaX)),"mousemove"==e.type&&(t=e.pageX-startX,scene.position.x+=5e-5*t,renderer.render(scene,camera))}gl.addEventListener("wheel",step),gl.addEventListener("mousedown",e=>{isDown=!0,startX=e.pageX}),gl.addEventListener("mousemove",e=>{isDown&&step(e)}),window.addEventListener("mouseup",e=>{isDown=!1,startX=0}),requestAnimationFrame(step);