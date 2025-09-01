import*as THREE from"https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";let gl=document.querySelector("#gl"),textures=(gl.height=gl.clientHeight,gl.width=gl.clientWidth,["../img/1.png","../img/2.png","../img/3.png","../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png"].map(e=>(new THREE.TextureLoader).load(e))),alphaMapTexture=(new THREE.TextureLoader).load("../img/AlphaMap.png"),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.01,10),scene=(camera.position.z=1.4,new THREE.Scene),geometry=new THREE.PlaneGeometry(1.5,1,20,20),material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:textures[0]},intensity:{value:.86},spread:{value:97.554},alphaMap:{value:alphaMapTexture},opacity:{value:1},color:{value:new THREE.Color("red")},color1:{value:new THREE.Color("red")},color2:{value:new THREE.Color("white")},transparent:!0},vertexShader:`
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
        // precision highp float;
        // precision highp int;
        
        // uniform sampler2D uTexture;
        // uniform vec3 color;
        // uniform float intensity;
        // uniform float spread;

        // varying vec2 vUv;
        
        // void main() {
        //     float vignette = vUv.y * vUv.x * (1.-vUv.x) * (1.-vUv.y) * spread;
        //     vec3 multiplier = 1.0 - ( vignette * color * intensity ); 
        //     gl_FragColor =  vec4( clamp( color * multiplier, 0.0, 1.0 ), 1.0 );
        // }






        // #define PI 3.1415926
        // #define TWO_PI PI*2.

        uniform sampler2D uTexture;
        uniform sampler2D alphaMap;
        uniform float opacity;

        uniform vec3 color1;
        uniform vec3 color2;
    
        varying vec2 vUv;
        
        // void main() {
        
        // vec2 uv = vUv * 2. - 1.;
        
        // float a = atan(uv.x,uv.y)+PI;
        // float r = TWO_PI/4.;
        // float d = cos(floor(.5+a/r)*r-a)*length(uv);
        
        // gl_FragColor = vec4(mix(color1, color2, d), 1.0);
        // }


        void main() {



            vec4 texelColor = texture2D(uTexture, vUv);
            float alpha = texture2D(alphaMap, vUv).r * opacity; // Use red channel for alpha
            gl_FragColor = vec4(texelColor.rgb, texelColor.a * alpha);




            // vec3 c;
            // vec4 Ca = texture2D(uTexture, vUv);
            // vec4 Cb = vec4(vUv.x, vUv.x, vUv.x, 0.0);
            // // vec4 Cb = texture2D(tSec, vUv);


            // // c = Ca.rgb * Ca.a + Cb.rgb * Cb.a * (1.0 - Ca.a);  // blending equation
            // // gl_FragColor= vec4(c, 1.0);
            // // gl_FragColor = vec4(mix(color1, color2, colorMix), alpha);

            // float strength = vUv.x * 0.5;
            // float grad = vec4(vec3(strength), 0.0);

            // diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;


            // // // y < 0 = transparent, > 1 = opaque
            // // float alpha = smoothstep(0.0, 1.0, vUv.y);
            // // // y < 1 = color1, > 2 = color2
            // // float colorMix = smoothstep(1.0, 2.0, vUv.y);
            // // gl_FragColor = vec4(mix(color1, color2, colorMix), alpha);
        }



        // diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
    `});for(let o=0;o<8;o++){let e=material.clone(),r=(e.uniforms.uTexture.value=textures[o%8],new THREE.Mesh(geometry,e));r.position.x=1.7*o,scene.add(r)}let renderer=new THREE.WebGLRenderer({canvas:gl,antialias:!0,alpha:!0}),start=(renderer.setSize(gl.clientWidth,gl.clientHeight),null),isDown=!1,startX;function step(e){var r;start=start||e,"number"==typeof e&&(r=e-start,scene.position.x=0,renderer.render(scene,camera),r<2e3)&&requestAnimationFrame(step),"wheel"==e.type&&(scene.position.x+=.005*-e.deltaX,renderer.render(scene,camera),console.log("Delta X:",e.deltaX)),"mousemove"==e.type&&(r=e.pageX-startX,scene.position.x+=5e-5*r,renderer.render(scene,camera))}gl.addEventListener("wheel",step),gl.addEventListener("mousedown",e=>{isDown=!0,startX=e.pageX}),gl.addEventListener("mousemove",e=>{isDown&&step(e)}),window.addEventListener("mouseup",e=>{isDown=!1,startX=0}),requestAnimationFrame(step);