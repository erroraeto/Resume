import*as THREE from"three";import{PLYLoader}from"three/addons/loaders/PLYLoader.js";import{EffectComposer}from"three/addons/postprocessing/EffectComposer.js";import{RenderPass}from"three/addons/postprocessing/RenderPass.js";import{BokehPass}from"three/addons/postprocessing/BokehPass.js";import{ShaderPass}from"three/addons/postprocessing/ShaderPass.js";import{FXAAShader}from"three/addons/shaders/FXAAShader.js";import{RenderTransitionPass}from"three/addons/postprocessing/RenderTransitionPass.js";import{OutputPass}from"three/addons/postprocessing/OutputPass.js";import{Pass}from"three/addons/postprocessing/Pass.js";import{OBJLoader}from"three/addons/loaders/OBJLoader.js";import{GUI}from"three/addons/libs/lil-gui.module.min.js";import*as TWEEN from"three/addons/libs/tween.module.js";import{OrbitControls}from"three/addons/controls/OrbitControls.js";let sectionAbout=document.querySelector(".section__about"),model=[],transitionParams={transition:0,texture:5,cycle:!0,animate:!0};function getTransition({renderer:e,sceneA:t,sceneB:r}){let n=new THREE.Scene;var i=window.innerWidth,o=window.innerHeight;let a=new THREE.OrthographicCamera(i/-2,i/2,o/2,o/-2,-10,10),s=[];var d=new THREE.TextureLoader;s[0]=d.load(`../img/texture/transition${[0]}.png`);let l=new THREE.ShaderMaterial({transparent:!0,uniforms:{tDiffuse1:{value:null},tDiffuse2:{value:null},mixRatio:{value:0},threshold:{value:.1},useTexture:{value:1},tMixTexture:{value:s[0]}},vertexShader:`varying vec2 vUv;
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
        }`});d=new THREE.PlaneGeometry(i,o),i=new THREE.Mesh(d,l);n.add(i),l.uniforms.tDiffuse1.value=t.fbo.texture,l.uniforms.tDiffuse2.value=r.fbo.texture,new TWEEN.Tween(transitionParams).to({transition:1},4500).repeat(1/0).delay(5e3).yoyo(!0).start();let m=!1;return{render:()=>{transitionParams.animate&&(TWEEN.update(),transitionParams.cycle&&(0==transitionParams.transition||1==transitionParams.transition)?m&&(transitionParams.texture=(transitionParams.texture+1)%s.length,l.uniforms.tMixTexture.value=s[transitionParams.texture],m=!1):m=!0),l.uniforms.mixRatio.value=transitionParams.transition,0===transitionParams.transition?(t.update(),r.render(!1)):1===transitionParams.transition?(t.render(!1),r.update()):(t.render(!0),r.render(!0),e.setRenderTarget(null),e.render(n,a))}}}function getFXScene({renderer:t,source:e,material:r}){var n=window.innerWidth,i=window.innerHeight;let o=new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,100),a=(o.position.set(0,1.8,6.5),new THREE.Scene),s=(a.add(new THREE.HemisphereLight(16777215,5592405,1)),(new PLYLoader).load(e,function(e){e.scale(1,1,1),e.computeVertexNormals();e=new THREE.Mesh(e,r);e.rotation.y=-Math.PI/.9,e.position.x=1.5,e.position.y=1.7,e.position.z=0,e.castShadow=!0,e.receiveShadow=!0,a.add(e),model.push(e)}),new THREE.WebGLRenderTarget(n,i)),d=()=>{a.children[1]&&(a.children[1].rotation.y+=.002)};return{fbo:s,render:e=>{d(),e?(t.setRenderTarget(s),t.clear()):t.setRenderTarget(null),t.render(a,o)},update:d}}let clock=new THREE.Clock,transition;function init(){var e=sectionAbout,t=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),e=(t.setPixelRatio(window.devicePixelRatio),t.setSize(window.innerWidth,window.innerHeight),e.appendChild(t.domElement),getFXScene({renderer:t,source:"../models/Bust.ply",material:new THREE.MeshLambertMaterial({map:(new THREE.TextureLoader).load("../img/texture/Unwrap.webp")}),edges:!0})),r=getFXScene({renderer:t,source:"../models/Bust-HP.ply",material:new THREE.MeshLambertMaterial({})});transition=getTransition({renderer:t,sceneA:e,sceneB:r})}function animate(){requestAnimationFrame(animate),transition.render(clock.getDelta())}function wheelCarousel(t){for(let e=0;e<model.length;e++)model[e].rotation.y+=.002*-t.deltaX}init(),animate(),sectionAbout.addEventListener("wheel",wheelCarousel);