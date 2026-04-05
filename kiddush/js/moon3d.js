let moonInited=false,moonScene,moonCam,moonRenderer,moonObj,moonAngle=0,moonPlaying=true,moonSpeed=3,moonContainer=null;

function initMoon3D(){
  const c=document.getElementById('scene3d');
  if(!c) return;
  // If already inited but container is same element, skip
  if(moonInited && moonContainer===c && c.querySelector('canvas')) return;
  // If container has no size yet, retry after layout
  if(c.clientWidth < 10 || c.clientHeight < 10){
    setTimeout(initMoon3D, 100);
    return;
  }
  // Clean up old canvas if re-initing
  const oldCanvas = c.querySelector('canvas');
  if(oldCanvas) oldCanvas.remove();
  if(moonRenderer){ try{moonRenderer.dispose()}catch(e){} }

  moonContainer=c;
  moonInited=true;
  const W=c.clientWidth, H=c.clientHeight;

  moonScene=new THREE.Scene();
  moonCam=new THREE.PerspectiveCamera(45,W/H,.1,500);
  moonCam.position.set(0,8,10);moonCam.lookAt(0,0,0);

  try{
    moonRenderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  }catch(e){
    c.innerHTML='<div style="padding:40px;text-align:center;color:var(--txt3)">תלת-ממד לא נתמך בדפדפן זה</div>';
    return;
  }
  moonRenderer.setSize(W,H);
  moonRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  moonRenderer.setClearColor(0x080c18);
  // Insert canvas before the info panel
  const infoEl=c.querySelector('.scene-info');
  if(infoEl) c.insertBefore(moonRenderer.domElement,infoEl);
  else c.appendChild(moonRenderer.domElement);

  // Stars
  const sg=new THREE.BufferGeometry(),sp=[];
  for(let i=0;i<600;i++) sp.push((Math.random()-.5)*80,(Math.random()-.5)*80,(Math.random()-.5)*80);
  sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
  moonScene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.12,transparent:true,opacity:.7})));

  // Sun light
  const sl=new THREE.DirectionalLight(0xfff5e0,1.8);sl.position.set(40,2,0);moonScene.add(sl);
  moonScene.add(new THREE.AmbientLight(0x111122,.04));

  // Earth
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1.2,32,32),new THREE.MeshPhongMaterial({color:0x2244aa,emissive:0x0a1530,emissiveIntensity:.15}));
  moonScene.add(earth);

  // Moon with phase shader
  moonObj=new THREE.Mesh(new THREE.SphereGeometry(.35,32,32),new THREE.ShaderMaterial({
    uniforms:{phase:{value:0}},
    vertexShader:`varying vec3 vn;void main(){vn=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform float phase;varying vec3 vn;void main(){float c=cos(phase);float x=vn.x;float s=(phase<=3.14159)?1.0:-1.0;float lit=smoothstep(-0.06,0.06,s*x-c);vec3 b=vec3(0.92,0.9,0.84)*lit;gl_FragColor=vec4(b+vec3(0.012),1.0);}`
  }));
  moonScene.add(moonObj);

  // Orbit ring
  const orb=new THREE.Mesh(new THREE.RingGeometry(3.9,4.1,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.06,side:THREE.DoubleSide}));
  orb.rotation.x=-Math.PI/2;moonScene.add(orb);

  if(!window._moonAnimRunning){window._moonAnimRunning=true;animMoon()}
}

function animMoon(){
  requestAnimationFrame(animMoon);
  if(!moonObj||!moonRenderer||!moonScene||!moonCam) return;
  // Check container still exists
  if(!document.getElementById('scene3d')){return}
  if(moonPlaying) moonAngle+=.003*moonSpeed;
  moonObj.position.set(Math.cos(moonAngle)*4, 0, Math.sin(moonAngle)*4);
  const n=((moonAngle%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
  moonObj.material.uniforms.phase.value=n;
  const pNames=['מולד','סהר עולה','רבע ראשון','מתמלאת','לבנה מלאה','חסרה','רבע אחרון','סהר אחרון'];
  const info=document.querySelector('#scene3d .scene-info');
  if(info){
    const day=Math.max(1,Math.ceil(n/(Math.PI*2)*29.5));
    info.innerHTML=`<span class="sv">יום ${day}</span>${pNames[Math.floor(n/(Math.PI/4))%8]}`;
  }
  try{moonRenderer.render(moonScene,moonCam)}catch(e){}
}

function toggleMoonPlay(){moonPlaying=!moonPlaying}

// Watch for viz elements — use delay to ensure layout is done
const vizObserver = new MutationObserver(() => {
  const s3d = document.getElementById('scene3d');
  if(s3d && (!moonInited || moonContainer !== s3d || !s3d.querySelector('canvas'))){
    moonInited=false; // force re-init
    setTimeout(initMoon3D, 150);
  }
});
vizObserver.observe(document.body, {childList: true, subtree: true});
