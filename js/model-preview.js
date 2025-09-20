import*as THREE from"three";import{PLYLoader}from"three/addons/loaders/PLYLoader.js";import{EffectComposer}from"three/addons/postprocessing/EffectComposer.js";import{RenderPass}from"three/addons/postprocessing/RenderPass.js";import{BokehPass}from"three/addons/postprocessing/BokehPass.js";import{ShaderPass}from"three/addons/postprocessing/ShaderPass.js";import{FXAAShader}from"three/addons/shaders/FXAAShader.js";import{RenderTransitionPass}from"three/addons/postprocessing/RenderTransitionPass.js";import{OutputPass}from"three/addons/postprocessing/OutputPass.js";import{Pass}from"three/addons/postprocessing/Pass.js";import{OBJLoader}from"three/addons/loaders/OBJLoader.js";import{GUI}from"three/addons/libs/lil-gui.module.min.js";import*as TWEEN from"three/addons/libs/tween.module.js";import{OrbitControls}from"three/addons/controls/OrbitControls.js";let sectionAbout=document.querySelector(".section__about"),transitionParams={transition:0,texture:5,cycle:!0,animate:!0};function getTransition({renderer:t,sceneA:r,sceneB:o}){let n=new THREE.Scene;var e=window.innerWidth,a=window.innerHeight;let i=new THREE.OrthographicCamera(e/-2,e/2,a/2,a/-2,-10,10),s=[];var d=new THREE.TextureLoader;for(let e=0;e<3;e++)s[e]=d.load(`./img/transition${e}.png`);let l=new THREE.ShaderMaterial({uniforms:{tDiffuse1:{value:null},tDiffuse2:{value:null},mixRatio:{value:0},threshold:{value:.1},useTexture:{value:1},tMixTexture:{value:s[0]}},vertexShader:`varying vec2 vUv;
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

      		gl_FragColor = mix( texel1, texel2, mixf );
      	} else {
      		gl_FragColor = mix( texel2, texel1, mixRatio );
      	}
      }`});e=new THREE.PlaneGeometry(e,a),a=new THREE.Mesh(e,l);n.add(a),l.uniforms.tDiffuse1.value=r.fbo.texture,l.uniforms.tDiffuse2.value=o.fbo.texture,new TWEEN.Tween(transitionParams).to({transition:1},4500).repeat(1/0).delay(2e3).yoyo(!0).start();let m=!1;return{render:e=>{transitionParams.animate&&(TWEEN.update(),transitionParams.cycle&&(0==transitionParams.transition||1==transitionParams.transition)?m&&(transitionParams.texture=(transitionParams.texture+1)%s.length,l.uniforms.tMixTexture.value=s[transitionParams.texture],m=!1):m=!0),l.uniforms.mixRatio.value=transitionParams.transition,0===transitionParams.transition?(r.update(e),o.render(e,!1)):1===transitionParams.transition?(r.render(e,!1),o.update(e)):(r.render(e,!0),o.render(e,!0),t.setRenderTarget(null),t.render(n,i))}}}let objCount=5e3;function getMeshProps(){var t=[];for(let e=0;e<objCount;e+=1)t.push({position:{x:1e4*Math.random()-5e3,y:6e3*Math.random()-3e3,z:8e3*Math.random()-4e3},rotation:{x:2*Math.random()*Math.PI,y:2*Math.random()*Math.PI,z:2*Math.random()*Math.PI},scale:200*Math.random()+100});return t}let dummyProps=getMeshProps();function getMesh(e,t=!1){var r,o=new THREE.IcosahedronGeometry(.25,1),n=new THREE.InstancedMesh(o,e,objCount),a=new THREE.Object3D,i=new THREE.Color;for(let e=0;e<objCount;e++)r=dummyProps[e],a.position.x=r.position.x,a.position.y=r.position.y,a.position.z=r.position.z,a.rotation.x=r.rotation.x,a.rotation.y=r.rotation.y,a.rotation.z=r.rotation.z,a.scale.set(r.scale,r.scale,r.scale),a.updateMatrix(),n.setMatrixAt(e,a.matrix),t&&n.setColorAt(e,i.setScalar(.1+.9*Math.random()));return n}function getFXScene({renderer:r,material:t,clearColor:o,needsAnimatedColor:n=!1}){var e=window.innerWidth,a=window.innerHeight;let i=new THREE.PerspectiveCamera(50,e/a,1,1e4),s=(i.position.z=2e3,new THREE.Scene),d=(s.fog=new THREE.FogExp2(o,2e-4),s.add(new THREE.HemisphereLight(16777215,5592405,1)),getMesh(t,n)),l=(s.add(d),new THREE.WebGLRenderTarget(e,a)),m=new THREE.Vector3(.1,-.2,.15),u=e=>{d.rotation.x+=e*m.x,d.rotation.y+=e*m.y,d.rotation.z+=e*m.z,n&&t.color.setHSL(.1+.5*Math.sin(2e-4*Date.now()),1,.5)};return{fbo:l,render:(e,t)=>{u(e),r.setClearColor(o),t?(r.setRenderTarget(l),r.clear()):r.setRenderTarget(null),r.render(s,i)},update:u}}let clock=new THREE.Clock,transition;function init(){var e=sectionAbout,t=new THREE.WebGLRenderer({antialias:!0}),e=(t.setPixelRatio(window.devicePixelRatio),t.setSize(window.innerWidth,window.innerHeight),e.appendChild(t.domElement),new THREE.MeshBasicMaterial({color:65280,wireframe:!0})),r=new THREE.MeshStandardMaterial({color:16750848,flatShading:!0}),e=getFXScene({renderer:t,material:e,clearColor:0}),r=getFXScene({renderer:t,material:r,clearColor:0,needsAnimatedColor:!0});transition=getTransition({renderer:t,sceneA:e,sceneB:r})}function animate(){requestAnimationFrame(animate),transition.render(clock.getDelta())}init(),animate();