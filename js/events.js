import*as THREE from"https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";let textures=["../img/1.png","../img/2.png","../img/3.png","../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png"].map(e=>(new THREE.TextureLoader).load(e)),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.01,10),scene=(camera.position.z=2,new THREE.Scene),geometry=new THREE.PlaneGeometry(1,1,10,10),material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:textures[0]}},vertexShader:`
        varying vec2 vUv;
        void main(){
        vUv = uv;
        vec3 newposition = position;
        float distanceFromCenter = abs(
            (modelMatrix * vec4(position, 1.0)).x
        );
            
        // most important
        newposition.y *= 1.0 + 0.3*pow(distanceFromCenter,2.);
            
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
        }`,fragmentShader:`
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main()	{
            gl_FragColor = texture2D(uTexture,vUv);
        }
    `});for(let i=0;i<30;i++){let e=material.clone(),n=(e.uniforms.uTexture.value=textures[i%4],new THREE.Mesh(geometry,e));n.position.x=1.2*(i-15),scene.add(n)}let renderer=new THREE.WebGLRenderer({antialias:!0}),time=(renderer.setSize(window.innerWidth,window.innerHeight),renderer.setAnimationLoop(animation),document.body.appendChild(renderer.domElement),0);function animation(e){e+=.001,scene.position.x=3*Math.sin(e/2e3),renderer.render(scene,camera)}