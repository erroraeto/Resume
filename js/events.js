import*as THREE from"https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";let gl=document.querySelector("#gl"),textures=(gl.height=gl.clientHeight,gl.width=gl.clientWidth,["../img/1.png","../img/2.png","../img/3.png","../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png"].map(e=>(new THREE.TextureLoader).load(e))),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.01,10),scene=(camera.position.z=1.4,new THREE.Scene),geometry=new THREE.PlaneGeometry(1.5,1,10,10),material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:textures[0]}},vertexShader:`
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
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main()	{
            gl_FragColor = texture2D(uTexture,vUv);
        }
    `});for(let n=0;n<8;n++){let e=material.clone(),t=(e.uniforms.uTexture.value=textures[n%8],new THREE.Mesh(geometry,e));t.position.x=1.7*n,scene.add(t)}let renderer=new THREE.WebGLRenderer({canvas:gl,antialias:!0,alpha:!0}),start=(renderer.setSize(gl.clientWidth,gl.clientHeight),null),isDown=!1,startX;function step(e){var t;start=start||e,"number"==typeof e&&(t=e-start,scene.position.x=0,renderer.render(scene,camera),t<2e3)&&requestAnimationFrame(step),"wheel"==e.type&&(scene.position.x+=.005*-e.deltaX,renderer.render(scene,camera),console.log("Delta X:",e.deltaX)),"mousemove"==e.type&&(t=e.pageX-startX,scene.position.x+=5e-5*t,renderer.render(scene,camera))}gl.addEventListener("wheel",step),gl.addEventListener("mousedown",e=>{isDown=!0,startX=e.pageX}),gl.addEventListener("mousemove",e=>{isDown&&step(e)}),window.addEventListener("mouseup",e=>{isDown=!1,startX=0}),requestAnimationFrame(step);