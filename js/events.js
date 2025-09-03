import*as THREE from"https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";import{EffectComposer}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/EffectComposer.js";import{RenderPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/RenderPass.js";import{BloomPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BloomPass.js";import{BokehPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BokehPass.js";import{OutlinePass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/OutlinePass.js";import{FilmPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/FilmPass.js";import{ShaderPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/ShaderPass.js";import{FXAAShader}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/shaders/FXAAShader.js";let gl=document.querySelector("#gl"),textures=(gl.height=gl.clientHeight,gl.width=gl.clientWidth,["../img/1.png","../img/2.png","../img/3.png","../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png"].map(e=>(new THREE.TextureLoader).load(e))),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.01,10),raycaster=(camera.position.z=1.4,new THREE.Raycaster),mouse=new THREE.Vector2,scene=new THREE.Scene,geometry=new THREE.PlaneGeometry(1.5,1,20,20),material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:textures[0]},opacity:{value:1},blend:{value:.8},tMap:{value:textures[0]},uPlaneSize:{value:[0,0]},uImageSize:{value:[0,0]},uViewportSize:{value:[window.innerWidth,window.innerHeight]},uTime:{value:100*Math.random()},uBlurStrength:{value:.1}},depthTest:!1,depthWrite:!1,transparent:!0,vertexShader:`
        varying vec2 vUv;
        void main(){
        vUv = uv;
        vec3 newposition = position;
        float distanceFromCenter = abs(
            (modelMatrix * vec4(position, 1.0)).x
        );

        // most important
        newposition.y *= 1.0 + 0.1*pow(distanceFromCenter,2.);
        // newposition.y *= 1.0 + 0.05*pow(distanceFromCenter,2.);

        gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
        }`,fragmentShader:`
        uniform sampler2D uTexture;
        uniform float opacity;
        uniform float blend;

        varying vec2 vUv;

        float getFadeInWeight(vec2 uv) {
            float edge = 0.4 * abs(sin(0.5));
            return smoothstep(0., edge, uv.x) * smoothstep(0., edge, 1.-uv.x) * smoothstep(0., edge, uv.y) * smoothstep(0., edge, 1.-uv.y);
        }

        void main() {
            vec4 texelColor = texture2D(uTexture, vUv);
            float alpha = getFadeInWeight(vUv);
            // gl_FragColor = vec4(texelColor.rgb, texelColor.a * alpha);
            
            
            vec4 res = vec4(texelColor.rgb, texelColor.a * alpha);
            // vec3 finalColor = mix(alpha, uTexture, 1.0);
            // gl_FragColor = vec4(finalColor, 1.0);

            gl_FragColor = mix(texelColor, res, blend);
        }
    `});for(let r=0;r<8;r++){let e=material.clone(),t=(e.uniforms.uTexture.value=textures[r%8],new THREE.Mesh(geometry,e));t.position.x=1.7*r,scene.add(t)}let renderer=new THREE.WebGLRenderer({canvas:gl,antialias:!0,alpha:!0}),composer=(renderer.setSize(gl.clientWidth,gl.clientHeight),new EffectComposer(renderer)),outlinePass=(composer.addPass(new RenderPass(scene,camera)),composer.setSize(window.innerWidth,window.innerHeight),new OutlinePass(new THREE.Vector2(window.innerWidth,window.innerHeight),scene,camera));composer.addPass(outlinePass),outlinePass.edgeStrength=3,outlinePass.edgeThickness=1,outlinePass.visibleEdgeColor.set("#ffffff"),outlinePass.BlurDirectionX=new THREE.Vector2(0,0),outlinePass.BlurDirectionY=new THREE.Vector2(0,0),outlinePass.depthMaterial.morphTargets=!0,outlinePass.prepareMaskMaterial.morphTargets=!0;let effectFXAA,start=((effectFXAA=new ShaderPass(FXAAShader)).uniforms.resolution.value.set(1/window.innerWidth,1/window.innerHeight),composer.addPass(effectFXAA),gl.style.touchAction="none",null),isDown=!1,startX;function step(e){var t;start=start||e,"number"==typeof e&&(t=e-start,scene.position.x=0,renderer.render(scene,camera),t<2e3)&&requestAnimationFrame(step),"wheel"==e.type&&(scene.position.x+=.005*-e.deltaX,renderer.render(scene,camera),console.log("Delta X:",e.deltaX),onPointerMove(e)),composer.render(scene,camera)}function onPointerMove(e){mouse.x=e.clientX/window.innerWidth*2-1,mouse.y=-e.clientY/window.innerHeight*2+1,raycaster.setFromCamera(mouse,camera);var e=raycaster.intersectObject(scene,!0);0<e.length?(e=e[0].object,outlinePass.selectedObjects=[e]):outlinePass.selectedObjects=[],composer.render(scene,camera)}gl.addEventListener("wheel",step),gl.addEventListener("pointermove",onPointerMove),requestAnimationFrame(step);