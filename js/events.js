import*as THREE from"https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";let gl=document.querySelector("#gl"),textures=(gl.height=gl.clientHeight,gl.width=gl.clientWidth,["../img/1.png","../img/2.png","../img/3.png","../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png"].map(e=>(new THREE.TextureLoader).load(e))),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.01,10),scene=(camera.position.z=1.4,new THREE.Scene),geometry=new THREE.PlaneGeometry(1.5,1,10,10),material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:textures[0]},positionVlak3:{value:-3.5},transparent:!0},vertexShader:`
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

    `});for(let r=0;r<8;r++){let e=material.clone(),t=(e.uniforms.uTexture.value=textures[r%8],new THREE.Mesh(geometry,e));t.position.x=1.7*r,scene.add(t)}let renderer=new THREE.WebGLRenderer({canvas:gl,antialias:!0,alpha:!0}),start=(renderer.setSize(gl.clientWidth,gl.clientHeight),null),isDown=!1,startX;function step(e){var t;start=start||e,"number"==typeof e&&(t=e-start,scene.position.x=0,renderer.render(scene,camera),t<2e3)&&requestAnimationFrame(step),"wheel"==e.type&&(scene.position.x+=.005*-e.deltaX,renderer.render(scene,camera),console.log("Delta X:",e.deltaX)),"mousemove"==e.type&&(t=e.pageX-startX,scene.position.x+=5e-5*t,renderer.render(scene,camera))}gl.addEventListener("wheel",step),gl.addEventListener("mousedown",e=>{isDown=!0,startX=e.pageX}),gl.addEventListener("mousemove",e=>{isDown&&step(e)}),window.addEventListener("mouseup",e=>{isDown=!1,startX=0}),requestAnimationFrame(step);