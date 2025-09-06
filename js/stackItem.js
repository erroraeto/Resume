import*as THREE from"three";import{EffectComposer}from"three/addons/postprocessing/EffectComposer.js";import{RenderPass}from"three/addons/postprocessing/RenderPass.js";import{BokehPass}from"three/addons/postprocessing/BokehPass.js";import{FXAAShader}from"three/addons/shaders/FXAAShader.js";import{GodRaysFakeSunShader,GodRaysDepthMaskShader,GodRaysCombineShader,GodRaysGenerateShader}from"three/addons/shaders/GodRaysShader.js";import{OrbitControls}from"three/addons/controls/OrbitControls.js";import Stats from"three/addons/libs/stats.module.js";import{DRACOLoader}from"three/addons/loaders/DRACOLoader.js";import{GLTFLoader}from"three/addons/loaders/GLTFLoader.js";let sectionSoftSkills=document.querySelector(".section__soft-skills"),scene,cameraPost,controls,time,isPlaying,baseTexture,width,height,container,renderer,camera,karasi,material,materialOrtho,scenePost,sw="../img/Thing.png";function init(e){scene=new THREE.Scene,container=e,width=container.clienttWidth,height=container.clientHeight,(renderer=new THREE.WebGLRenderer).setPixelRatio(Math.min(window.devicePixelRatio,2)),renderer.setSize(width,height),renderer.setClearColor(0,1),renderer.physicallyCorrectLights=!0,renderer.outputEncoding=THREE.sRGBEncoding,container.appendChild(renderer.domElement),camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.001,1e3);cameraPost=new THREE.OrthographicCamera(-.5,.5,.5,-.5,-1e3,1e3),camera.position.set(0,0,1),controls=new OrbitControls(camera,renderer.domElement),time=0;e=new DRACOLoader;e.setDecoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/draco_decoder.js"),(new GLTFLoader).setDRACOLoader(e),isPlaying=!0,initPost(),addObjects(),resize(),render(),setupResize()}function setupResize(){window.addEventListener("resize",resize)}function initPost(){baseTexture=new THREE.WebGLRenderTarget(width,height,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat}),materialOrtho=new THREE.ShaderMaterial({extensions:{derivatives:"#extension GL_OES_standard_derivatives : enable"},side:THREE.DoubleSide,side:THREE.DoubleSide,uniforms:{time:{value:0},uMap:{value:null}},vertexShader:`
            uniform float time;
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform vec2 pixels;
            float PI = 3.141592653589793238;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,fragmentShader:`
            uniform float time;
            uniform float progress;
            uniform sampler2D uMap;
            uniform vec4 resolution;
            varying vec2 vUv;
            varying vec3 vPosition;
            float PI = 3.141592653589793238;
            float rand(vec2 co){
                return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
            }
            void main()	{

                vec4 c = texture2D(uMap, vUv);

                vec2 toCenter = vec2(0.5) - vUv;

                vec4 original = texture2D(uMap, vUv );

                vec4 color = vec4(0.0);
                float total = 0.0;
                for(float i = 0.; i < 20.; i++) {
                    float lerp = (i + rand(vec2(gl_FragCoord.x,gl_FragCoord.y )))/20.;

                    float weight = sin(lerp * PI);
                    vec4 mysample = texture2D(uMap, vUv + toCenter*lerp*0.5);
                    mysample.rgb *=mysample.a;
                    color += mysample*weight;
                    total +=weight;
                }
                color.a = 1.0;
                color.rgb /= total;


                vec4 finalColor = 1. - (1. - color)*(1. - original);


                gl_FragColor = vec4(toCenter, 0.0, 1.0);
                gl_FragColor = color;
                gl_FragColor = finalColor;
                // gl_FragColor = original;
                // gl_FragColor = vec4(
                // 	vec3(rand(vUv)),
                // 	1.
                // 	);
            }
        `});var e=new THREE.Mesh(new THREE.PlaneGeometry(1,1),materialOrtho);(scenePost=new THREE.Scene).add(e)}function resize(){var e=container.offsetWidth,r=container.offsetHeight;renderer.setSize(e,r),camera.aspect=e/r,camera.updateProjectionMatrix()}function addObjects(){var e=(new THREE.TextureLoader).load(sw),e=(e.wrapT=THREE.RepeatWrapping,e.wrapS=THREE.RepeatWrapping,material=new THREE.ShaderMaterial({extensions:{derivatives:"#extension GL_OES_standard_derivatives : enable"},side:THREE.DoubleSide,uniforms:{time:{value:0},uMap:{value:e},resolution:{value:new THREE.Vector4}},vertexShader:`
            uniform float time;
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform vec2 pixels;
            float PI = 3.141592653589793238;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,fragmentShader:`
            uniform float time;
            uniform float progress;
            uniform sampler2D uMap;
            uniform vec4 resolution;
            varying vec2 vUv;
            varying vec3 vPosition;
            float PI = 3.141592653589793238;
            float rand(vec2 co){
                return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
            }
            void main()	{

                vec4 c = texture2D(uMap, vUv);

                vec2 toCenter = vec2(0.5) - vUv;

                vec4 original = texture2D(uMap, vUv );

                vec4 color = vec4(0.0);
                float total = 0.0;
                for(float i = 0.; i < 20.; i++) {
                    float lerp = (i + rand(vec2(gl_FragCoord.x,gl_FragCoord.y )))/20.;

                    float weight = sin(lerp * PI);
                    vec4 mysample = texture2D(uMap, vUv + toCenter*lerp*0.5);
                    mysample.rgb *=mysample.a;
                    color += mysample*weight;
                    total +=weight;
                }
                color.a = 1.0;
                color.rgb /= total;


                vec4 finalColor = 1. - (1. - color)*(1. - original);


                gl_FragColor = vec4(toCenter, 0.0, 1.0);
                gl_FragColor = color;
                gl_FragColor = finalColor;
                // gl_FragColor = original;
                // gl_FragColor = vec4(
                // 	vec3(rand(vUv)),
                // 	1.
                // 	);
            }
        `}),new THREE.SphereGeometry(.5,30,30));karasi=new THREE.Mesh(e,material),scene.add(karasi)}function stop(){isPlaying=!1}function play(){isPlaying||(isPlaying=!0,render())}function render(){isPlaying&&(time+=.05,karasi.rotation.y=-time/20,material.uniforms.time.value=time,requestAnimationFrame(render),renderer.setRenderTarget(baseTexture),renderer.render(scene,camera),materialOrtho.uniforms.uMap.value=baseTexture.texture,materialOrtho.uniforms.time.value=time,renderer.setRenderTarget(null),renderer.render(scenePost,cameraPost))}init(sectionSoftSkills);