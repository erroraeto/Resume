import*as THREE from"three";import{PLYLoader}from"three/addons/loaders/PLYLoader.js";import{EffectComposer}from"three/addons/postprocessing/EffectComposer.js";import{RenderPass}from"three/addons/postprocessing/RenderPass.js";import{BokehPass}from"three/addons/postprocessing/BokehPass.js";import{ShaderPass}from"three/addons/postprocessing/ShaderPass.js";import{FXAAShader}from"three/addons/shaders/FXAAShader.js";import{RenderTransitionPass}from"three/addons/postprocessing/RenderTransitionPass.js";import{OutputPass}from"three/addons/postprocessing/OutputPass.js";import{Pass}from"three/addons/postprocessing/Pass.js";import{OBJLoader}from"three/addons/loaders/OBJLoader.js";import{GUI}from"three/addons/libs/lil-gui.module.min.js";import*as TWEEN from"three/addons/libs/tween.module.js";import{OrbitControls}from"three/addons/controls/OrbitControls.js";let sectionAbout=document.querySelector(".section__about"),renderer,model=[],scenes=[],transitionParams={transition:0,texture:5,cycle:!0,animate:!0},i=0,j=1;function getTransition({renderer:e,sceneA:r,sceneB:t}){let n=new THREE.Scene;var i=window.innerWidth,o=window.innerHeight;let s=new THREE.OrthographicCamera(i/-2,i/2,o/2,o/-2,-10,10);var a=[],d=new THREE.TextureLoader;a[0]=d.load(`../img/texture/transition${[0]}.png`);let l=new THREE.ShaderMaterial({transparent:!0,uniforms:{tDiffuse1:{value:null},tDiffuse2:{value:null},mixRatio:{value:0},threshold:{value:.1},useTexture:{value:1},tMixTexture:{value:a[0]}},vertexShader:`varying vec2 vUv;
        void main() {
            vUv = vec2( uv.x, uv.y );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,fragmentShader:`
        uniform float mixRatio;
        uniform sampler2D tDiffuse1;
        uniform sampler2D tDiffuse2;
        uniform sampler2D tMixTexture;
        uniform int useTexture;
        uniform float threshold;
        varying vec2 vUv;

        void main() {
            vec4 texel1 = texture2D( tDiffuse1, vUv );
            vec4 texel2 = texture2D( tDiffuse2, vUv );

            if (useTexture == 1) {
                vec4 transitionTexel = texture2D( tMixTexture, vUv );
                float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
                float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);

                gl_FragColor = sRGBTransferOETF( mix( texel1, texel2, mixf ) );
            } else {
                gl_FragColor = sRGBTransferOETF( mix( texel2, texel1, mixRatio ) );
            }
        }`});d=new THREE.PlaneGeometry(i,o),a=new THREE.Mesh(d,l);n.add(a),l.uniforms.tDiffuse1.value=r.fbo.texture,l.uniforms.tDiffuse2.value=t.fbo.texture,new TWEEN.Tween(transitionParams).to({transition:1},4500).repeat(1/0).delay(5e3).yoyo(!0).start();return{render:()=>{transitionParams.animate&&TWEEN.update(),l.uniforms.mixRatio.value=transitionParams.transition,0===transitionParams.transition?(r.update(),t.render(!1)):1===transitionParams.transition?(r.render(!1),t.update()):(r.render(!0),t.render(!0),e.setRenderTarget(null),e.render(n,s))}}}function getFXScene({renderer:r,source:t,material:n=!1}){var e=window.innerWidth,i=window.innerHeight;let o=new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,100),s=(o.position.set(0,1.8,6.5),new THREE.Scene);function a(e){e.rotation.y=-Math.PI/.9,e.position.x=1.5,e.position.y=1.7,e.position.z=0,e.castShadow=!0,e.receiveShadow=!0,s.add(e),model.push(e)}if(s.add(new THREE.HemisphereLight(16777215,5592405,1)),n)(new PLYLoader).load(t,function(e){e.scale(1,1,1),e.computeVertexNormals(),a(new THREE.Mesh(e,n))});else{var t=(new THREE.TextureLoader).load(t,e=>{e=e.image.width/e.image.height;r.scale.set(e,1,1)}),d=new THREE.PlaneGeometry(-3,3);let e=new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide,transparent:!0}),r=new THREE.Mesh(d,e);a(r)}let l=new THREE.WebGLRenderTarget(e,i),m=()=>{s.children[1]&&(s.children[1].rotation.y+=.002)};return{fbo:l,render:e=>{m(),e?(r.setRenderTarget(l),r.clear()):r.setRenderTarget(null),r.render(s,o)},update:m}}let clock=new THREE.Clock,transition;function init(){var e=sectionAbout,e=((renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0})).setPixelRatio(window.devicePixelRatio),renderer.setSize(window.innerWidth,window.innerHeight),e.appendChild(renderer.domElement),getFXScene({renderer:renderer,source:"../img/Ref.png"})),r=(scenes.push(e),getFXScene({renderer:renderer,source:"../models/Bust-HP.ply",material:new THREE.MeshLambertMaterial({})})),t=(scenes.push(r),getFXScene({renderer:renderer,source:"../models/Bust.ply",material:new THREE.MeshLambertMaterial({map:(new THREE.TextureLoader).load("../img/texture/Unwrap.webp"),transparent:!0})})),t=(scenes.push(t),getFXScene({renderer:renderer,source:"../img/Unwrap.webp"}));scenes.push(t),transition=getTransition({renderer:renderer,sceneA:e,sceneB:r})}function animate(){requestAnimationFrame(animate),transition.render(clock.getDelta())}function wheelCarousel(r){for(let e=0;e<model.length;e++)model[e].rotation.y+=.002*-r.deltaX}init(),animate(),sectionAbout.addEventListener("wheel",wheelCarousel);