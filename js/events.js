import*as THREE from"https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";import{OrbitControls}from"https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";let gl=document.querySelector("#gl");var cameraPosition=new THREE.Vector3(0,0,100),cameraTarget=new THREE.Vector3(0,0,0),cameraFocalDistance=49.19,bokehStrength=.025,exposure=.0019,distanceAttenuation=0,focalPowerFunction=0,minimumLineSize=.015,drawCallsPerFrame=50,quadsTexturePath="assets/textures/texture1.png",motionBlurFrames=1,useLengthSampling=!0,pointsPerLine=500,pointsPerQuad=500,pointsPerFrame=5e4,quadPointsPerFrame=5e4,millisecondsPerFrame=1/0,framesCount=200,captureFrames=!1,useBokehTexture=!1,bokehTexturePath="assets/bokeh/c1.png",backgroundColor=[21/255,16/255,16/255];let samples=0;function permute(e){var o=new THREE.Vector4;return o.x=(34*e.x+1)*e.x%289,o.y=(34*e.y+1)*e.y%289,o.z=(34*e.z+1)*e.z%289,o.w=(34*e.w+1)*e.w%289,o}function taylorInvSqrt(e){var o=new THREE.Vector4;return o.x=.9391081930484501*e.x,o.y=.9391081930484501*e.y,o.z=.9391081930484501*e.z,o.w=.9391081930484501*e.w,o}function vec3step(e,o){var t=new THREE.Vector3(0,0,0);return t.x=o.x<e.x?0:1,t.y=o.y<e.y?0:1,t.z=o.z<e.z?0:1,t}function vec4step(e,o){var t=new THREE.Vector4(0,0,0,0);return t.x=o.x<e.x?0:1,t.y=o.y<e.y?0:1,t.z=o.z<e.z?0:1,t.w=o.w<e.w?0:1,t}function vec3min(e,o){var t=new THREE.Vector3(0,0,0);return t.x=(e.x<o.x?e:o).x,t.y=(e.y<o.y?e:o).y,t.z=(e.z<o.z?e:o).z,t}function vec3max(e,o){var t=new THREE.Vector3(0,0,0);return t.x=(e.x>o.x?e:o).x,t.y=(o.y<e.y?e:o).y,t.z=(o.z<e.z?e:o).z,t}function vec3mod(e,o){var t=new THREE.Vector3(0,0,0);return t.x=e.x%o,t.y=e.y%o,t.z=e.z%o,t}function snoise(e){var o=new THREE.Vector2(1/6,1/3),t=new THREE.Vector4(0,.5,1,2);let n=new THREE.Vector3(e.x,e.y,e.z);n.addScalar(n.dot(new THREE.Vector3(o.y,o.y,o.y))),n.x=Math.floor(n.x),n.y=Math.floor(n.y),n.z=Math.floor(n.z),n.w=Math.floor(n.w);var e=new THREE.Vector3(e.x,e.y,e.z),a=(e.sub(n),e.addScalar(n.dot(new THREE.Vector3(o.x,o.x,o.x))),new THREE.Vector3(0,0,0),vec3step(new THREE.Vector3(e.y,e.z,e.x),new THREE.Vector3(e.x,e.y,e.z))),r=new THREE.Vector3(1,1,1),i=(r.sub(a),vec3min(a,new THREE.Vector3(r.z,r.x,r.y))),a=vec3max(a,new THREE.Vector3(r.z,r.x,r.y)),r=new THREE.Vector3,c=(r.add(e),r.sub(i),r.addScalar(o.x),new THREE.Vector3),u=(c.add(e),c.sub(a),c.addScalar(2*o.x),new THREE.Vector3),o=(u.add(e),u.subScalar(1),u.addScalar(3*o.x),n=vec3mod(n,289),new THREE.Vector4,permute(permute(permute(new THREE.Vector4(n.z+n.y+n.x,n.z+n.y+n.x+i.z+i.y+i.x,n.z+n.y+n.x+a.z+a.y+a.x,n.z+n.y+n.x+1,1,1))))),i=new THREE.Vector3(1/7,1/7,1/7),a=(i.x=i.x*t.w-t.x,i.y=i.y*t.y-t.z,i.z=i.z*t.z-t.x,new THREE.Vector4),t=(a.x=o.x-49*Math.floor(o.x*i.z*i.z),a.y=o.y-49*Math.floor(o.y*i.z*i.z),a.z=o.z-49*Math.floor(o.z*i.z*i.z),a.w=o.w-49*Math.floor(o.w*i.z*i.z),new THREE.Vector4),o=(t.x=Math.floor(a.x*i.z),t.y=Math.floor(a.y*i.z),t.z=Math.floor(a.z*i.z),t.w=Math.floor(a.w*i.z),new THREE.Vector4),a=(o.x=Math.floor(a.x-7*t.x),o.y=Math.floor(a.y-7*t.y),o.z=Math.floor(a.z-7*t.z),o.w=Math.floor(a.w-7*t.w),new THREE.Vector4),t=(a.x=t.x*i.x+i.y,a.y=t.y*i.x+i.y,a.z=t.z*i.x+i.y,a.w=t.w*i.x+i.y,new THREE.Vector4),o=(t.x=o.x*i.x+i.y,t.y=o.y*i.x+i.y,t.z=o.z*i.x+i.y,t.w=o.w*i.x+i.y,new THREE.Vector4),i=(o.x=1-Math.abs(a.x)-Math.abs(t.x),o.y=1-Math.abs(a.y)-Math.abs(t.y),o.z=1-Math.abs(a.z)-Math.abs(t.z),o.w=1-Math.abs(a.w)-Math.abs(t.w),new THREE.Vector4(a.x,a.y,t.x,t.y)),a=new THREE.Vector4(a.z,a.w,t.z,t.w),t=new THREE.Vector4,l=(t.x=2*Math.floor(i.x)+1,t.y=2*Math.floor(i.y)+1,t.z=2*Math.floor(i.z)+1,t.w=2*Math.floor(i.w)+1,new THREE.Vector4),d=(l.x=2*Math.floor(a.x)+1,l.y=2*Math.floor(a.y)+1,l.z=2*Math.floor(a.z)+1,l.w=2*Math.floor(a.w)+1,new THREE.Vector4,vec4step(o,new THREE.Vector4(0,0,0,0)).multiplyScalar(-1)),s=new THREE.Vector4,i=(s.x=i.x+t.x*d.x,s.y=i.z+t.z*d.x,s.z=i.y+t.y*d.y,s.w=i.w+t.w*d.y,new THREE.Vector4),t=(i.x=a.x+l.x*d.z,i.y=a.z+l.z*d.z,i.z=a.y+l.y*d.w,i.w=a.w+l.w*d.w,new THREE.Vector3(s.x,s.y,o.x)),a=new THREE.Vector3(s.z,s.w,o.y),l=new THREE.Vector3(i.x,i.y,o.z),d=new THREE.Vector3(i.z,i.w,o.w),s=taylorInvSqrt(new THREE.Vector4(t.dot(t),a.dot(a),l.dot(l),d.dot(d))),i=(t.multiplyScalar(s.x),a.multiplyScalar(s.y),l.multiplyScalar(s.z),d.multiplyScalar(s.w),new THREE.Vector4(e.dot(e),r.dot(r),c.dot(c),u.dot(u))),o=(i.multiplyScalar(-1),i.addScalar(.6),i.x=Math.max(i.x,0),i.y=Math.max(i.y,0),i.z=Math.max(i.z,0),i.w=Math.max(i.w,0),new THREE.Vector4(i.x*i.x,i.y*i.y,i.z*i.z,i.w*i.w));return 42*new THREE.Vector4(o.x*o.x,o.y*o.y,o.z*o.z,o.w*o.w).dot(new THREE.Vector4(t.dot(e),a.dot(r),l.dot(c),d.dot(u)))}function snoiseVec3(e){var o=snoise(new THREE.Vector3(e.x,e.y,e.z)),t=snoise(new THREE.Vector3(e.y-19.1,e.z+33.4,e.x+47.2)),e=snoise(new THREE.Vector3(e.z+74.2,e.x-124.5,e.y+99.4));return new THREE.Vector3(o,t,e)}function pnoisev3(e,o,t){var n=new THREE.Vector3,a=noise.simplex3(e,o,t),r=noise.simplex3(e-129825,o,t+1230951),e=noise.simplex3(e,o-321523,t+1523512);return n.x=a,n.y=r,n.z=e,n}function initCurlNoise(){noise.seed(Utils.getSeed())}function curlNoise(e){var o=new THREE.Vector3(.1,0,0),t=new THREE.Vector3(0,.1,0),n=new THREE.Vector3(0,0,.1),a=pnoisev3(e.x-o.x,e.y-o.y,e.z-o.z),o=pnoisev3(e.x+o.x,e.y+o.y,e.z+o.z),r=pnoisev3(e.x-t.x,e.y-t.y,e.z-t.z),t=pnoisev3(e.x+t.x,e.y+t.y,e.z+t.z),i=pnoisev3(e.x-n.x,e.y-n.y,e.z-n.z),e=pnoisev3(e.x+n.x,e.y+n.y,e.z+n.z),n=t.z-r.z-e.y+i.y,e=e.x-i.x-o.z+a.z,i=o.y-a.y-t.x+r.x,o=new THREE.Vector3(n,e,i);return o.multiplyScalar(5),o.normalize(),o}let postprocv=`

varying vec2 vUv;

void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
    
    vUv = uv;
}`,postprocf=`

uniform sampler2D texture;
uniform float uSamples;
uniform float uExposure;
uniform vec3 uBackgroundColor;
uniform vec3 uResolution;
uniform vec3 uCameraPosition;

varying vec2 vUv;


void main() {

    float chromaticAberrationStrength = 0.0;
    // uncomment if you want CA
    // chromaticAberrationStrength = length(vec2(0.5, 0.5) - vUv) * 0.0015;
    
    vec4 color = vec4(
        texture2D(texture, vUv + vec2(chromaticAberrationStrength, 0.0)).r,
        texture2D(texture, vUv).g,
        texture2D(texture, vUv + vec2(-chromaticAberrationStrength, 0.0)).b,
        1.0
    );

    if(color.x < 0.0) color.x = 0.0;
    if(color.y < 0.0) color.y = 0.0;
    if(color.z < 0.0) color.z = 0.0;

    const float gamma = 1.0; //2.2;
    vec3 hdrColor = (color.rgb) / (uSamples * uExposure);

  

    // reinhard tone mapping
    vec3 mapped = hdrColor / (hdrColor + vec3(1.0));

    // gamma correction 
    mapped = pow(mapped, vec3(1.0 / gamma));


    gl_FragColor = vec4(uBackgroundColor + mapped, 1.0);
}`,shaderpassv=`
varying vec2 vUv;

void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
    
    vUv = uv;
}`,shaderpassf="",linev=`
attribute vec3 position1;
attribute vec3 color1;
attribute vec3 color2;
attribute vec4 aSeed;

uniform float uRandom;
uniform vec4  uRandomVec4;
uniform float uFocalDepth;
uniform float uBokehStrength;
uniform float uMinimumLineSize;
uniform float uFocalPowerFunction;
uniform float uTime;
uniform float uDistanceAttenuation;

uniform sampler2D uBokehTexture;

varying vec3 vColor;






//  the function below is hash12 from https://www.shadertoy.com/view/4djSRW - I just renamed it nrand()
//  sin based random functions wont work
float nrand(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float n1rand( vec2 n )
{
	float t = fract( uTime );
	float nrnd0 = nrand( n + 0.7*t );
	return nrnd0;
}


void main() {

    // Uncomment these and comment the ones below and have fun with the result you'll get
    // float o1 = n1rand( vec2(uRandom + aSeed.x, uRandomVec4.x) );
    // float o2 = n1rand( vec2(uRandom + aSeed.x, uRandomVec4.x) );
    // float o3 = n1rand( vec2(uRandom + aSeed.x, uRandomVec4.x) );
    // float o4 = n1rand( vec2(uRandom + aSeed.x, uRandomVec4.x) );
    // float o5 = n1rand( vec2(uRandom + aSeed.x, uRandomVec4.w) );

    float o1 = n1rand( vec2(uRandom + aSeed.x, uRandomVec4.x) );
    float o2 = n1rand( vec2(uRandom + aSeed.y, uRandomVec4.y) );
    float o3 = n1rand( vec2(uRandom + aSeed.z, uRandomVec4.z) );
    float o4 = n1rand( vec2(uRandom + aSeed.w, uRandomVec4.w) );
    float o5 = n1rand( vec2(uRandom + aSeed.w, uRandomVec4.w) );






    float t = o1; 
    vec3 positiont = position * (1.0 - t) + position1 * t;
    vec3 viewSpacePositionT = (modelViewMatrix * vec4(positiont, 1.0)).xyz;
    vColor = color1 * (1.0 - t) + color2 * t;

	float distanceFromFocalPoint = abs(viewSpacePositionT.z - (-uFocalDepth));
	if(uFocalPowerFunction > 0.5) {
		distanceFromFocalPoint = pow(distanceFromFocalPoint, 1.5);
	}


    float bokehStrength = distanceFromFocalPoint * uBokehStrength;
	bokehStrength = max(bokehStrength, uMinimumLineSize);








    #if USE_BOKEH_TEXTURE 
        vec4 randNumbers = vec4( o2, o3, o4, o5 );
        float ux = randNumbers.x;
        float uy = randNumbers.y;

        float x  = (ux * 2.0 - 1.0) * bokehStrength;
        float y  = (uy * 2.0 - 1.0) * bokehStrength;

        vec3 bokehVal = texture2D(uBokehTexture, vec2(ux, uy)).xyz;
        viewSpacePositionT += vec3(x, y, 0.0);
        vColor *= bokehVal;
    #else
        // if we're not using a bokeh texture we'll randomly displace points
        // in a sphere

        vec4 randNumbers = vec4( o2, o3, o4, o5 );

        float lambda = randNumbers.x;
        float u      = randNumbers.y * 2.0 - 1.0;
        float phi    = randNumbers.z * 6.28;
        float R      = bokehStrength;

        float x = R * pow(lambda, 0.33333) * sqrt(1.0 - u * u) * cos(phi);
        float y = R * pow(lambda, 0.33333) * sqrt(1.0 - u * u) * sin(phi);
        float z = R * pow(lambda, 0.33333) * u;

        viewSpacePositionT += vec3(x, y, z); 
    #endif















	// two different functions for color attenuation if you need it

	vColor = vec3(
		vColor.r * exp(-distanceFromFocalPoint * uDistanceAttenuation),
		vColor.g * exp(-distanceFromFocalPoint * uDistanceAttenuation),
		vColor.b * exp(-distanceFromFocalPoint * uDistanceAttenuation)	
	);

	// vColor = vec3(
	//	vColor.r / (1.0 + pow(distanceFromFocalPoint * 0.015, 2.71828)),
	// 	vColor.g / (1.0 + pow(distanceFromFocalPoint * 0.015, 2.71828)),
	// 	vColor.b / (1.0 + pow(distanceFromFocalPoint * 0.015, 2.71828))	
	// );


    // vec4 projectedPosition = projectionMatrix * modelViewMatrix * vec4(positiont, 1.0);
    vec4 projectedPosition = projectionMatrix * vec4(viewSpacePositionT, 1.0);
    gl_Position = projectedPosition;

    gl_PointSize = 1.0;
}`,linef=`
varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0);
}`,quadv=`
attribute vec3 position1;
attribute vec3 position2;
attribute vec3 uv1;
attribute vec3 uv2;
attribute vec3 color;
attribute vec4 aSeeds;

uniform sampler2D uTexture;
uniform sampler2D uNormalMap;
uniform sampler2D uBokehTexture;

uniform float uRandom;
uniform vec4  uRandomVec4;
uniform float uFocalDepth;
uniform float uBokehStrength;
uniform float uMinimumLineSize;
uniform float uFocalPowerFunction;
uniform float uTime;
uniform float uDistanceAttenuation;

varying vec3 vColor;


//  the function below is hash12 from https://www.shadertoy.com/view/4djSRW - I just renamed it nrand()
//  sin based random functions wont work
float nrand(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float n1rand( vec2 n )
{
	float t = fract( uTime );
	float nrnd0 = nrand( n + 0.7*t );
	return nrnd0;
}


void main() {

    // Uncomment these and comment the ones below and have fun with the result you'll get
    // float o1 = n1rand( vec2(uRandom + aSeeds.x, uRandomVec4.x) );
    // float o2 = n1rand( vec2(uRandom + aSeeds.x, uRandomVec4.x) );
    // float o3 = n1rand( vec2(uRandom + aSeeds.x, uRandomVec4.x) );
    // float o4 = n1rand( vec2(uRandom + aSeeds.x, uRandomVec4.x) );
    // float o5 = n1rand( vec2(uRandom + aSeeds.x, uRandomVec4.w) );

    float o1 = n1rand( vec2(uRandom + aSeeds.x, uRandomVec4.x) );
    float o2 = n1rand( vec2(uRandom + aSeeds.y, uRandomVec4.y) );
    float o3 = n1rand( vec2(uRandom + aSeeds.z, uRandomVec4.z) );
    float o4 = n1rand( vec2(uRandom + aSeeds.w, uRandomVec4.w) );
    float o5 = n1rand( vec2(uRandom + aSeeds.w, uRandomVec4.w) );






    float uu = fract(o1 + uRandomVec4.x + aSeeds.z); 
    float vv = fract(o2 + uRandomVec4.y + aSeeds.w);
    vec3 positiont = position + uu * (position1 - position) + vv * (position2 - position);
    vec3 viewSpacePositionT = (modelViewMatrix * vec4(positiont, 1.0)).xyz;

    // ******** texture coordinates calculation
    float ud = uv2.x - uv1.x;
    float vd = uv2.y - uv1.y;
    float ut = uv1.x + fract(o1 + uRandomVec4.x + aSeeds.z) * ud; 
    float vt = uv1.y + fract(o2 + uRandomVec4.y + aSeeds.w) * vd;
    // ******** texture coordinates calculation - END

    vColor = color * (texture2D(uTexture, vec2(ut, vt)).rgb);
    vColor = pow(vColor, vec3(2.0));






	float distanceFromFocalPoint = abs(viewSpacePositionT.z - (-uFocalDepth));
	if(uFocalPowerFunction > 0.5) {
		distanceFromFocalPoint = pow(distanceFromFocalPoint, 1.5);
	}


    float bokehStrength = distanceFromFocalPoint * uBokehStrength;
	bokehStrength = max(bokehStrength, 0.0);  //uMinimumLineSize);








    

    #if USE_BOKEH_TEXTURE 
        vec4 randNumbers = vec4( o2, o3, o4, o5 );
        float ux = randNumbers.x;
        float uy = randNumbers.y;

        float x  = (ux * 2.0 - 1.0) * bokehStrength;
        float y  = (uy * 2.0 - 1.0) * bokehStrength;

        float bokehVal = texture2D(uBokehTexture, vec2(ux, uy)).x;
        viewSpacePositionT += vec3(x, y, 0.0);
        vColor *= bokehVal;
    #else
        // if we're not using a bokeh texture we'll randomly displace points
        // in a sphere

        vec4 randNumbers = vec4( o2, o3, o4, o5 );

        float lambda = randNumbers.x;
        float u      = randNumbers.y * 2.0 - 1.0;
        float phi    = randNumbers.z * 6.28;
        float R      = bokehStrength;

        float x = R * pow(lambda, 0.33333) * sqrt(1.0 - u * u) * cos(phi);
        float y = R * pow(lambda, 0.33333) * sqrt(1.0 - u * u) * sin(phi);
        float z = R * pow(lambda, 0.33333) * u;

        viewSpacePositionT += vec3(x, y, z); 
    #endif













	// two different functions for color attenuation if you need it

	vColor = vec3(
		vColor.r * exp(-distanceFromFocalPoint * uDistanceAttenuation * 0.5),
		vColor.g * exp(-distanceFromFocalPoint * uDistanceAttenuation * 0.5),
		vColor.b * exp(-distanceFromFocalPoint * uDistanceAttenuation * 0.5)	
	);

	// vColor = vec3(
	// 	vColor.r / (1.0 + pow(distanceFromFocalPoint * 0.05, 2.71828)),
	// 	vColor.g / (1.0 + pow(distanceFromFocalPoint * 0.05, 2.71828)),
	// 	vColor.b / (1.0 + pow(distanceFromFocalPoint * 0.05, 2.71828))	
	// );


    vec4 projectedPosition = projectionMatrix * vec4(viewSpacePositionT, 1.0);
    gl_Position = projectedPosition;

    gl_PointSize = 1.0;
}`,quadf=`

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0);
}`;function createLinesWrapper(e){lines=[],scene.remove(scene.getObjectByName("points")),quads=[],scene.remove(scene.getObjectByName("quad-points")),createScene(e),createLinesGeometry();e=new THREE.Points(linesGeometry,linesMaterial),e.name="points",scene.add(e),createQuadsGeometry(),e=new THREE.Points(quadsGeometry,quadsMaterial);e.name="quad-points",scene.add(e)}function init(){var e=new THREE.WebGLRenderer({}),o=(e.setPixelRatio(window.devicePixelRatio),e.setSize(innerWidth,innerHeight),e.autoClear=!1,document.body.appendChild(e.domElement),e.domElement,new THREE.Scene,new THREE.Scene),t=new THREE.Scene,n=new THREE.PerspectiveCamera(20,innerWidth/innerHeight,2,2e3);n.position.set(cameraPosition.x,cameraPosition.y,cameraPosition.z);new THREE.PerspectiveCamera(20,innerWidth/innerHeight,2,2e3).position.set(0,0,10);n=new OrbitControls(n,e.domElement),n.target.set(cameraTarget.x,cameraTarget.y,cameraTarget.z),n.rotateSpeed=1,n.minAzimuthAngle=-1/0,n.maxAzimuthAngle=1/0,n.minPolarAngle=0,n.maxPolarAngle=+Math.PI,n.addEventListener("change",function(){preventOnControlsChangeReset||resetCanvas()}),e=new THREE.WebGLRenderTarget(innerWidth,innerHeight,{stencilBuffer:!1,depthBuffer:!1,type:THREE.FloatType}),n=new THREE.PlaneGeometry(2,2),e=new THREE.ShaderMaterial({vertexShader:postprocv,fragmentShader:postprocf,uniforms:{texture:{type:"t",value:e.texture},uSamples:{value:samples},uExposure:{value:exposure},uBackgroundColor:new THREE.Uniform(new THREE.Vector3(backgroundColor[0],backgroundColor[1],backgroundColor[2])),uResolution:new THREE.Uniform(new THREE.Vector2(innerWidth,innerHeight)),uCameraPosition:new THREE.Uniform(new THREE.Vector3(0,0,0))},side:THREE.DoubleSide}),o.add(new THREE.Mesh(n,e)),o=new THREE.PlaneGeometry(2,2),n=new THREE.ShaderMaterial({vertexShader:shaderpassv,fragmentShader:shaderpassf,uniforms:{uTime:{value:0},uResolution:new THREE.Uniform(new THREE.Vector2(innerWidth,innerHeight)),uCameraPosition:new THREE.Uniform(new THREE.Vector3(0,0,0)),uRandoms:new THREE.Uniform(new THREE.Vector4(0,0,0,0)),uBokehStrength:{value:0}},side:THREE.DoubleSide,depthTest:!1,blending:THREE.CustomBlending,blendEquation:THREE.AddEquation,blendSrc:THREE.OneFactor,blendSrcAlpha:THREE.OneFactor,blendDst:THREE.OneFactor,blendDstAlpha:THREE.OneFactor});t.add(new THREE.Mesh(o,n)),new THREE.ShaderMaterial({vertexShader:linev,fragmentShader:linef,uniforms:{uTime:{value:0},uRandom:{value:0},uRandomVec4:new THREE.Uniform(new THREE.Vector4(0,0,0,0)),uFocalDepth:{value:cameraFocalDistance},uBokehStrength:{value:bokehStrength},uMinimumLineSize:{value:minimumLineSize},uFocalPowerFunction:{value:focalPowerFunction},uBokehTexture:{type:"t",value:(new THREE.TextureLoader).load(bokehTexturePath)},uDistanceAttenuation:{value:distanceAttenuation}},defines:{USE_BOKEH_TEXTURE:useBokehTexture?1:0},side:THREE.DoubleSide,depthTest:!1,blending:THREE.CustomBlending,blendEquation:THREE.AddEquation,blendSrc:THREE.OneFactor,blendSrcAlpha:THREE.OneFactor,blendDst:THREE.OneFactor,blendDstAlpha:THREE.OneFactor}),new THREE.ShaderMaterial({vertexShader:quadv,fragmentShader:quadf,uniforms:{uTexture:{type:"t",value:(new THREE.TextureLoader).load(quadsTexturePath)},uTime:{value:0},uRandom:{value:0},uRandomVec4:new THREE.Uniform(new THREE.Vector4(0,0,0,0)),uFocalDepth:{value:cameraFocalDistance},uBokehStrength:{value:bokehStrength},uMinimumLineSize:{value:minimumLineSize},uFocalPowerFunction:{value:focalPowerFunction},uBokehTexture:{type:"t",value:(new THREE.TextureLoader).load(bokehTexturePath)},uDistanceAttenuation:{value:distanceAttenuation}},defines:{USE_BOKEH_TEXTURE:useBokehTexture?1:0},side:THREE.DoubleSide,depthTest:!1,blending:THREE.CustomBlending,blendEquation:THREE.AddEquation,blendSrc:THREE.OneFactor,blendSrcAlpha:THREE.OneFactor,blendDst:THREE.OneFactor,blendDstAlpha:THREE.OneFactor});createLinesWrapper(frames/motionBlurFrames),buildControls(),render()}window.addEventListener("load",init);