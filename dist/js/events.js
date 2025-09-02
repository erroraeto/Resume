import*as THREE from"https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";import{EffectComposer}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/EffectComposer.js";import{RenderPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/RenderPass.js";import{BloomPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BloomPass.js";import{BokehPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/BokehPass.js";import{OutlinePass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/OutlinePass.js";import{FilmPass}from"https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/postprocessing/FilmPass.js";let gl=document.querySelector("#gl"),textures=(gl.height=gl.clientHeight,gl.width=gl.clientWidth,["../img/1.png","../img/2.png","../img/3.png","../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png"].map(e=>(new THREE.TextureLoader).load(e))),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.01,10),raycaster=(camera.position.z=1.4,new THREE.Raycaster),mouse=new THREE.Vector2,scene=new THREE.Scene,geometry=new THREE.PlaneGeometry(1.5,1,20,20),material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:textures[0]},opacity:{value:1},blend:{value:.8},tMap:{value:textures[0]},uPlaneSize:{value:[0,0]},uImageSize:{value:[0,0]},uViewportSize:{value:[window.innerWidth,window.innerHeight]},uTime:{value:100*Math.random()},uBlurStrength:{value:.1}},depthTest:!1,depthWrite:!1,transparent:!0,vertexShader:`
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
    `});for(let r=0;r<8;r++){let e=material.clone(),t=(e.uniforms.uTexture.value=textures[r%8],new THREE.Mesh(geometry,e));t.position.x=1.7*r,scene.add(t)}let renderer=new THREE.WebGLRenderer({canvas:gl,antialias:!0,alpha:!0}),start=(renderer.setSize(gl.clientWidth,gl.clientHeight),null),isDown=!1,startX;function step(e){start=start||e,"number"==typeof e&&(t=e-start,scene.position.x=0,renderer.render(scene,camera),t<2e3)&&requestAnimationFrame(step),"wheel"==e.type&&(scene.position.x+=.005*-e.deltaX,renderer.render(scene,camera),console.log("Delta X:",e.deltaX)),"mousemove"==e.type&&(t=e.pageX-startX,scene.position.x+=5e-5*t,renderer.render(scene,camera));var t,e=new EffectComposer(renderer);e.addPass(new RenderPass(scene,camera));let r=new OutlinePass(new THREE.Vector2(window.innerWidth,window.innerHeight),scene,camera);r.edgeStrength=10,r.edgeGlow=0,r.edgeThickness=1,r.pulsePeriod=5,r.visibleEdgeColor="#ffffff",r.hiddenEdgeColor="#190a05",e.addPass(r),e.setSize(window.innerWidth,window.innerHeight),gl.addEventListener("mousemove",e=>{mouse.x=e.clientX/window.innerWidth*2-1,mouse.y=-e.clientY/window.innerHeight*2+1,raycaster.setFromCamera(mouse,camera);e=raycaster.intersectObject(scene,!0);0<e.length&&(addSelectedObject(e[0].object),r.selectedObjects=selectedObjects)}),e.render(scene,camera)}gl.addEventListener("wheel",step),gl.addEventListener("mousedown",e=>{isDown=!0,startX=e.pageX});let selectedObjects=[];function addSelectedObject(e){(selectedObjects=[]).push(e)}gl.addEventListener("mousemove",e=>{isDown&&step(e),mouse.x=e.clientX/window.innerWidth*2-1,mouse.y=-e.clientY/window.innerHeight*2+1,raycaster.setFromCamera(mouse,camera);e=raycaster.intersectObject(scene,!0);0<e.length&&(addSelectedObject(e[0].object),outlinePass.selectedObjects=selectedObjects)}),window.addEventListener("mouseup",e=>{isDown=!1,startX=0}),requestAnimationFrame(step);