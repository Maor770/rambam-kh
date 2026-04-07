/* observatory-scene.js – Three.js 3D astronomical model for Hilchot Kiddush HaChodesh */

(function(){
'use strict';

/* ── Constants ── */
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const MOON_ORBIT_R = 5;       // Moon orbit radius
const SUN_ORBIT_R = 14;       // Sun orbit radius
const ZODIAC_R = 18;          // Zodiac ring radius
const NODE_ORBIT_R = MOON_ORBIT_R;
const EPICYCLE_R = 1.5;        // Epicycle circle radius
const DEFERENT_R = SUN_ORBIT_R; // Deferent = sun orbit
const ECLIPTIC_TILT = 23.5 * DEG;
const MOON_TILT = 5.15 * DEG; // Moon orbit tilt to ecliptic

/* ── Zodiac sign names ── */
const ZODIAC_NAMES = [
  {he:'טלה',   en:'Aries',       symbol:'♈'},
  {he:'שור',   en:'Taurus',      symbol:'♉'},
  {he:'תאומים', en:'Gemini',      symbol:'♊'},
  {he:'סרטן',  en:'Cancer',      symbol:'♋'},
  {he:'אריה',  en:'Leo',         symbol:'♌'},
  {he:'בתולה', en:'Virgo',       symbol:'♍'},
  {he:'מאזניים',en:'Libra',       symbol:'♎'},
  {he:'עקרב',  en:'Scorpio',     symbol:'♏'},
  {he:'קשת',   en:'Sagittarius', symbol:'♐'},
  {he:'גדי',   en:'Capricorn',   symbol:'♑'},
  {he:'דלי',   en:'Aquarius',    symbol:'♒'},
  {he:'דגים',  en:'Pisces',      symbol:'♓'}
];

/* ── State ── */
let scene, camera, renderer, controls;
let container;
let earthMesh, moonMesh, sunMesh;
let moonOrbitGroup, sunOrbitGroup, zodiacGroup, nodesGroup;
let deferentLine, epicycleLine, epicycleCenter;
let ascNodeMesh, descNodeMesh;
let horizonPlane, elongationLine;
let moonOrbitLine;
let layerVisibility = {1:true, 2:true, 3:true, 4:true};
let highlightedObject = null;
let highlightOrigColor = null;
let animating = true;

/* Time state – exposed to timeline.js */
window.obsTime = {
  day: 0,         // days elapsed
  speed: 1,       // days per frame (at 60fps)
  playing: false  // paused by default
};

/* ── Initialization ── */
window.initObservatoryScene = function(){
  container = document.getElementById('obs-canvas');
  if(!container) return;
  if(container.clientWidth < 10){
    setTimeout(window.initObservatoryScene, 100);
    return;
  }

  const W = container.clientWidth, H = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050810, 0.008);

  // Camera
  camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 500);
  camera.position.set(0, 20, 25);
  camera.lookAt(0, 0, 0);

  // Renderer
  try {
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
  } catch(e){
    container.innerHTML = '<div style="padding:40px;text-align:center;color:#aaa">WebGL לא נתמך</div>';
    return;
  }
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050810);
  container.appendChild(renderer.domElement);

  // Simple mouse orbit (no OrbitControls dependency)
  initMouseControls();

  // Build the scene
  createStars();
  createEarth();
  createMoon();
  createSun();
  createZodiac();
  createNodes();
  createDeferentEpicycle();
  createHorizon();
  createElongationArc();
  createMoonOrbitPlane();

  // Lighting
  const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.5);
  sunLight.position.set(40, 10, 0);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x222244, 0.3));

  // Start animation
  animate();

  // Resize handler
  window.addEventListener('resize', onResize);
};

/* ── Stars ── */
function createStars(){
  const geo = new THREE.BufferGeometry();
  const pts = [];
  for(let i=0; i<1200; i++){
    const r = 60 + Math.random()*80;
    const th = Math.random()*TAU;
    const ph = Math.acos(2*Math.random()-1);
    pts.push(r*Math.sin(ph)*Math.cos(th), r*Math.cos(ph), r*Math.sin(ph)*Math.sin(th));
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const mat = new THREE.PointsMaterial({color:0xffffff, size:0.15, transparent:true, opacity:0.7});
  scene.add(new THREE.Points(geo, mat));
}

/* ── Earth ── */
function createEarth(){
  const geo = new THREE.SphereGeometry(1.5, 48, 48);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x2255cc,
    emissive: 0x0a1540,
    emissiveIntensity: 0.15,
    shininess: 30
  });
  earthMesh = new THREE.Mesh(geo, mat);
  earthMesh.userData = {conceptId:'earth', layer:1};
  scene.add(earthMesh);

  // Jerusalem marker (small gold dot)
  const jGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const jMat = new THREE.MeshBasicMaterial({color:0xf4d03f});
  const jMesh = new THREE.Mesh(jGeo, jMat);
  // Jerusalem: ~32°N, ~35°E
  const lat = 32*DEG, lon = 35*DEG;
  jMesh.position.set(
    1.52*Math.cos(lat)*Math.cos(lon),
    1.52*Math.sin(lat),
    -1.52*Math.cos(lat)*Math.sin(lon)
  );
  earthMesh.add(jMesh);

  // Earth label
  addLabel('🌍 ארץ', 0, -2.2, 0);
}

/* ── Moon ── */
function createMoon(){
  moonOrbitGroup = new THREE.Group();
  moonOrbitGroup.userData = {layer:1};
  scene.add(moonOrbitGroup);

  // Moon orbit ring
  const ringGeo = new THREE.RingGeometry(MOON_ORBIT_R-0.04, MOON_ORBIT_R+0.04, 96);
  const ringMat = new THREE.MeshBasicMaterial({color:0x87CEEB, transparent:true, opacity:0.15, side:THREE.DoubleSide});
  moonOrbitLine = new THREE.Mesh(ringGeo, ringMat);
  moonOrbitLine.rotation.x = -Math.PI/2;
  moonOrbitGroup.add(moonOrbitLine);

  // Moon sphere with phase shader
  const moonGeo = new THREE.SphereGeometry(0.4, 32, 32);
  const moonMat = new THREE.ShaderMaterial({
    uniforms: {phase:{value:0}},
    vertexShader: `varying vec3 vn;
      void main(){
        vn = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`,
    fragmentShader: `uniform float phase; varying vec3 vn;
      void main(){
        float c = cos(phase);
        float x = vn.x;
        float s = (phase <= 3.14159) ? 1.0 : -1.0;
        float lit = smoothstep(-0.06, 0.06, s*x - c);
        vec3 b = vec3(0.92, 0.9, 0.84) * lit;
        gl_FragColor = vec4(b + vec3(0.012), 1.0);
      }`
  });
  moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.userData = {conceptId:'moon', layer:1};
  moonOrbitGroup.add(moonMesh);

  // Apply moon orbit tilt
  moonOrbitGroup.rotation.x = MOON_TILT;
}

/* ── Sun ── */
function createSun(){
  sunOrbitGroup = new THREE.Group();
  sunOrbitGroup.userData = {layer:3};
  scene.add(sunOrbitGroup);

  // Sun orbit ring (ecliptic)
  const ringGeo = new THREE.RingGeometry(SUN_ORBIT_R-0.05, SUN_ORBIT_R+0.05, 128);
  const ringMat = new THREE.MeshBasicMaterial({color:0xff9933, transparent:true, opacity:0.1, side:THREE.DoubleSide});
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI/2;
  sunOrbitGroup.add(ring);

  // Sun sphere with glow
  const sunGeo = new THREE.SphereGeometry(1.0, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({color:0xffcc44});
  sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.userData = {conceptId:'sun', layer:3};
  sunOrbitGroup.add(sunMesh);

  // (no glow sprite — clean sun sphere)
}

/* ── Zodiac Ring ── */
function createZodiac(){
  zodiacGroup = new THREE.Group();
  zodiacGroup.userData = {conceptId:'zodiacRing', layer:3};
  scene.add(zodiacGroup);

  // Main ring
  const ringGeo = new THREE.RingGeometry(ZODIAC_R-0.4, ZODIAC_R+0.4, 128);
  const ringMat = new THREE.MeshBasicMaterial({color:0x8b5cf6, transparent:true, opacity:0.06, side:THREE.DoubleSide});
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI/2;
  zodiacGroup.add(ring);

  // 12 zodiac sign markers
  for(let i=0; i<12; i++){
    const angle = (i * 30) * DEG;
    const x = Math.cos(angle) * ZODIAC_R;
    const z = -Math.sin(angle) * ZODIAC_R;

    // Marker dot
    const dotGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({color:0x8b5cf6});
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(x, 0, z);
    dot.userData = {conceptId:'zodiacSigns', signIndex:i, layer:3};
    zodiacGroup.add(dot);

    // 30° sector divider line
    const nextAngle = ((i+1)*30)*DEG;
    const pts = [
      new THREE.Vector3(Math.cos(nextAngle)*(ZODIAC_R-0.5), 0, -Math.sin(nextAngle)*(ZODIAC_R-0.5)),
      new THREE.Vector3(Math.cos(nextAngle)*(ZODIAC_R+0.5), 0, -Math.sin(nextAngle)*(ZODIAC_R+0.5))
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const lineMat = new THREE.LineBasicMaterial({color:0x8b5cf6, transparent:true, opacity:0.2});
    zodiacGroup.add(new THREE.Line(lineGeo, lineMat));
  }
}

/* ── Lunar Nodes (Ascending/Descending) ── */
function createNodes(){
  nodesGroup = new THREE.Group();
  nodesGroup.userData = {layer:4};
  scene.add(nodesGroup);

  // Ascending node (ראש התלי) - green marker on moon orbit
  const ascGeo = new THREE.OctahedronGeometry(0.25);
  const ascMat = new THREE.MeshBasicMaterial({color:0x34d399});
  ascNodeMesh = new THREE.Mesh(ascGeo, ascMat);
  ascNodeMesh.userData = {conceptId:'ascendingNode', layer:4};
  nodesGroup.add(ascNodeMesh);

  // Descending node (זנב התלי) - red marker
  const descGeo = new THREE.OctahedronGeometry(0.25);
  const descMat = new THREE.MeshBasicMaterial({color:0xef4444});
  descNodeMesh = new THREE.Mesh(descGeo, descMat);
  descNodeMesh.userData = {conceptId:'descendingNode', layer:4};
  nodesGroup.add(descNodeMesh);

  // Line connecting nodes
  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0) // updated in animate
  ]);
  const lineMat = new THREE.LineBasicMaterial({color:0x34d399, transparent:true, opacity:0.3});
  nodesGroup.add(new THREE.Line(lineGeo, lineMat));
}

/* ── Deferent & Epicycle visualization ── */
function createDeferentEpicycle(){
  // Deferent circle (same as sun orbit but drawn differently)
  const defPts = [];
  for(let i=0; i<=128; i++){
    const a = (i/128)*TAU;
    defPts.push(new THREE.Vector3(Math.cos(a)*DEFERENT_R, 0, -Math.sin(a)*DEFERENT_R));
  }
  const defGeo = new THREE.BufferGeometry().setFromPoints(defPts);
  const defMat = new THREE.LineBasicMaterial({color:0xff9933, transparent:true, opacity:0.08});
  deferentLine = new THREE.Line(defGeo, defMat);
  deferentLine.userData = {conceptId:'deferent', layer:3};
  scene.add(deferentLine);

  // Epicycle circle - will be positioned dynamically
  const epiPts = [];
  for(let i=0; i<=64; i++){
    const a = (i/64)*TAU;
    epiPts.push(new THREE.Vector3(Math.cos(a)*EPICYCLE_R, 0, -Math.sin(a)*EPICYCLE_R));
  }
  const epiGeo = new THREE.BufferGeometry().setFromPoints(epiPts);
  const epiMat = new THREE.LineBasicMaterial({color:0xffcc44, transparent:true, opacity:0.25});
  epicycleLine = new THREE.Line(epiGeo, epiMat);
  epicycleLine.userData = {conceptId:'epicycle', layer:3};
  scene.add(epicycleLine);

  // Epicycle center marker
  const cGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const cMat = new THREE.MeshBasicMaterial({color:0xff9933, transparent:true, opacity:0.5});
  epicycleCenter = new THREE.Mesh(cGeo, cMat);
  scene.add(epicycleCenter);
}

/* ── Horizon plane (for arc of vision) ── */
function createHorizon(){
  const geo = new THREE.PlaneGeometry(40, 40);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x1a3a5c,
    transparent: true,
    opacity: 0.05,
    side: THREE.DoubleSide
  });
  horizonPlane = new THREE.Mesh(geo, mat);
  horizonPlane.rotation.x = -Math.PI/2;
  horizonPlane.position.y = -1.5;
  horizonPlane.userData = {conceptId:'horizon', layer:4};
  scene.add(horizonPlane);
}

/* ── Elongation arc ── */
function createElongationArc(){
  const pts = [];
  for(let i=0; i<=32; i++){
    pts.push(new THREE.Vector3(0,0,0)); // placeholder
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({color:0xf4d03f, transparent:true, opacity:0.5});
  elongationLine = new THREE.Line(geo, mat);
  elongationLine.userData = {conceptId:'elongationArc', layer:4};
  scene.add(elongationLine);
}

/* ── Moon orbit tilted plane indicator ── */
function createMoonOrbitPlane(){
  const geo = new THREE.RingGeometry(MOON_ORBIT_R-1.5, MOON_ORBIT_R+0.5, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x87CEEB,
    transparent: true,
    opacity: 0.03,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI/2;
  mesh.userData = {conceptId:'moonOrbitPlane', layer:4};
  moonOrbitGroup.add(mesh);
}

/* ── Text Labels (using sprites) ── */
function addLabel(text, x, y, z){
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 28px Heebo, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({map:tex, transparent:true, opacity:0.6});
  const sprite = new THREE.Sprite(mat);
  sprite.position.set(x, y, z);
  sprite.scale.set(3, 0.75, 1);
  scene.add(sprite);
  return sprite;
}

/* ── Mouse Controls (simple orbit) ── */
function initMouseControls(){
  let isDragging = false;
  let prevMouse = {x:0, y:0};
  let cameraAngleH = 0;  // horizontal angle
  let cameraAngleV = 0.6; // vertical angle (radians from horizontal)
  let cameraDistance = 30;

  function updateCamera(){
    camera.position.set(
      cameraDistance * Math.cos(cameraAngleV) * Math.sin(cameraAngleH),
      cameraDistance * Math.sin(cameraAngleV),
      cameraDistance * Math.cos(cameraAngleV) * Math.cos(cameraAngleH)
    );
    camera.lookAt(0, 0, 0);
  }
  updateCamera();

  const el = renderer.domElement;

  el.addEventListener('pointerdown', e => {
    isDragging = true;
    prevMouse = {x:e.clientX, y:e.clientY};
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', e => {
    if(!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    cameraAngleH -= dx * 0.005;
    cameraAngleV = Math.max(0.1, Math.min(1.4, cameraAngleV + dy*0.005));
    prevMouse = {x:e.clientX, y:e.clientY};
    updateCamera();
  });

  el.addEventListener('pointerup', () => { isDragging = false; });

  el.addEventListener('wheel', e => {
    e.preventDefault();
    cameraDistance = Math.max(10, Math.min(70, cameraDistance + e.deltaY*0.03));
    updateCamera();
  }, {passive:false});

  // Touch pinch zoom
  let lastPinchDist = 0;
  el.addEventListener('touchstart', e => {
    if(e.touches.length === 2){
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist = Math.sqrt(dx*dx+dy*dy);
    }
  });
  el.addEventListener('touchmove', e => {
    if(e.touches.length === 2){
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx+dy*dy);
      cameraDistance = Math.max(10, Math.min(70, cameraDistance - (dist-lastPinchDist)*0.05));
      lastPinchDist = dist;
      updateCamera();
    }
  });

  // Click to select object
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  el.addEventListener('click', e => {
    const rect = el.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left)/rect.width)*2 - 1;
    mouse.y = -((e.clientY - rect.top)/rect.height)*2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    for(const hit of intersects){
      let obj = hit.object;
      while(obj && !obj.userData.conceptId) obj = obj.parent;
      if(obj && obj.userData.conceptId){
        window.obsSelectConcept(obj.userData.conceptId);
        return;
      }
    }
  });
}

/* ── Animation Loop ── */
function animate(){
  requestAnimationFrame(animate);
  if(!renderer || !scene || !camera) return;

  const t = window.obsTime;
  if(t.playing) t.day += t.speed / 60; // 60fps

  const day = t.day;

  // ── Moon position (13.176° per day) ──
  const moonAngle = (day * 13.176 * DEG) % TAU;
  if(moonMesh){
    moonMesh.position.set(
      Math.cos(moonAngle) * MOON_ORBIT_R,
      0,
      -Math.sin(moonAngle) * MOON_ORBIT_R
    );
    // Phase based on elongation from sun
    const sunAngle = (day * 0.9856 * DEG) % TAU;
    const elongAngle = ((moonAngle - sunAngle) % TAU + TAU) % TAU;
    moonMesh.material.uniforms.phase.value = elongAngle;
  }

  // ── Sun position (0.9856° per day) ──
  const sunAngle = (day * 0.9856 * DEG) % TAU;
  if(sunMesh){
    sunMesh.position.set(
      Math.cos(sunAngle) * SUN_ORBIT_R,
      0,
      -Math.sin(sunAngle) * SUN_ORBIT_R
    );
  }

  // ── Lunar nodes (retrograde -0.0529° per day) ──
  const nodeAngle = (-day * 0.0529 * DEG) % TAU;
  if(ascNodeMesh){
    ascNodeMesh.position.set(
      Math.cos(nodeAngle) * NODE_ORBIT_R,
      0,
      -Math.sin(nodeAngle) * NODE_ORBIT_R
    );
    descNodeMesh.position.set(
      Math.cos(nodeAngle + Math.PI) * NODE_ORBIT_R,
      0,
      -Math.sin(nodeAngle + Math.PI) * NODE_ORBIT_R
    );
    // Update connecting line
    const line = nodesGroup.children[2];
    if(line && line.geometry){
      const pos = line.geometry.attributes.position;
      if(pos){
        pos.setXYZ(0, ascNodeMesh.position.x, ascNodeMesh.position.y, ascNodeMesh.position.z);
        pos.setXYZ(1, descNodeMesh.position.x, descNodeMesh.position.y, descNodeMesh.position.z);
        pos.needsUpdate = true;
      }
    }
  }

  // ── Epicycle center follows mean sun on deferent ──
  if(epicycleLine && epicycleCenter){
    const meanSunAngle = sunAngle;
    const cx = Math.cos(meanSunAngle) * DEFERENT_R;
    const cz = -Math.sin(meanSunAngle) * DEFERENT_R;
    epicycleLine.position.set(cx, 0, cz);
    epicycleCenter.position.set(cx, 0, cz);
  }

  // ── Elongation arc (line from earth to sun to moon) ──
  if(elongationLine && moonMesh && sunMesh){
    const positions = elongationLine.geometry.attributes.position;
    if(positions){
      // Draw arc from sun direction to moon direction
      const sunA = Math.atan2(-sunMesh.position.z, sunMesh.position.x);
      const moonA = Math.atan2(-moonMesh.position.z, moonMesh.position.x);
      const arcR = 3;
      for(let i=0; i<=32; i++){
        const frac = i/32;
        const a = sunA + (moonA - sunA) * frac;
        positions.setXYZ(i, Math.cos(a)*arcR, 0, -Math.sin(a)*arcR);
      }
      positions.needsUpdate = true;
    }
  }

  // ── Earth rotation ──
  if(earthMesh) earthMesh.rotation.y = day * 0.01;

  // ── Rotate ascending/descending node markers ──
  if(ascNodeMesh) ascNodeMesh.rotation.y += 0.02;
  if(descNodeMesh) descNodeMesh.rotation.y += 0.02;

  // ── Apply layer visibility ──
  applyLayerVisibility();

  // ── Update info panel ──
  updateInfoPanel(day);

  // ── Highlight pulsing ──
  if(highlightedObject && highlightedObject.material){
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.005);
    if(highlightedObject.material.emissive){
      highlightedObject.material.emissive.setHex(0xffd700);
      highlightedObject.material.emissiveIntensity = pulse * 0.5;
    } else if(highlightedObject.material.opacity !== undefined){
      highlightedObject.material.opacity = 0.3 + pulse * 0.5;
    }
  }

  renderer.render(scene, camera);
}

/* ── Apply visibility by layer ── */
function applyLayerVisibility(){
  scene.traverse(obj => {
    const layer = obj.userData.layer;
    if(layer && layerVisibility[layer] !== undefined){
      obj.visible = layerVisibility[layer];
    }
  });
  // Earth is always visible
  if(earthMesh) earthMesh.visible = true;
}

/* ── Update info display ── */
function updateInfoPanel(day){
  const el = document.getElementById('obs-day-info');
  if(!el) return;

  const lunarDay = ((day % 29.53) + 29.53) % 29.53;
  const lunarDayNum = Math.max(1, Math.ceil(lunarDay));
  const pNames = ['מולד','סהר עולה','רבע ראשון','מתמלאת','לבנה מלאה','חסרה','רבע אחרון','סהר אחרון'];
  const phaseIdx = Math.floor((lunarDay / 29.53) * 8) % 8;

  // Sun zodiac
  const sunDeg = ((day * 0.9856) % 360 + 360) % 360;
  const signIdx = Math.floor(sunDeg / 30) % 12;
  const signDeg = (sunDeg % 30).toFixed(1);

  el.innerHTML = `<span class="info-chip">יום ${Math.floor(day)}</span>` +
    `<span class="info-chip moon-chip">${pNames[phaseIdx]} · יום ${lunarDayNum}/29</span>` +
    `<span class="info-chip sun-chip">☀ ${ZODIAC_NAMES[signIdx].he} ${signDeg}°</span>`;
}

/* ── Layer toggle ── */
window.obsToggleLayer = function(layerId){
  layerVisibility[layerId] = !layerVisibility[layerId];
  return layerVisibility[layerId];
};

window.obsGetLayerVisibility = function(){
  return {...layerVisibility};
};

/* ── Highlight object by concept ID ── */
window.obsHighlightObject = function(conceptId){
  // Remove previous highlight
  if(highlightedObject && highlightOrigColor !== null){
    if(highlightedObject.material && highlightedObject.material.emissive){
      highlightedObject.material.emissive.setHex(highlightOrigColor);
      highlightedObject.material.emissiveIntensity = 0.15;
    }
    highlightedObject = null;
    highlightOrigColor = null;
  }

  if(!conceptId) return;

  // Find object with matching conceptId
  let found = null;
  scene.traverse(obj => {
    if(obj.userData.conceptId === conceptId && !found) found = obj;
  });

  // Map concept IDs to 3D objects
  const objMap = {
    'moon': moonMesh,
    'sun': sunMesh,
    'earth': earthMesh,
    'ascNode': ascNodeMesh,
    'descNode': descNodeMesh,
    'zodiacRing': zodiacGroup,
    'deferent': deferentLine,
    'epicycle': epicycleLine,
    'horizon': horizonPlane,
    'elongationArc': elongationLine,
    'moonOrbitPlane': moonOrbitLine
  };

  const target = found || objMap[conceptId];
  if(!target) return;

  highlightedObject = target;
  if(target.material && target.material.emissive){
    highlightOrigColor = target.material.emissive.getHex();
  } else {
    highlightOrigColor = 0;
  }
};

/* ── Resize ── */
function onResize(){
  if(!container || !camera || !renderer) return;
  const W = container.clientWidth, H = container.clientHeight;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
}

/* ── Camera presets for "story mode" ── */
window.obsCameraPreset = function(preset){
  const presets = {
    overview:  {x:0, y:20, z:25},
    moonClose: {x:0, y:5, z:8},
    sunOrbit:  {x:0, y:12, z:20},
    zodiacWide:{x:0, y:30, z:35},
    horizon:   {x:8, y:2, z:8},
    top:       {x:0, y:40, z:0.1},
    sideView:  {x:25, y:2, z:0}
  };
  const p = presets[preset] || presets.overview;
  // Simple lerp animation
  const start = {x:camera.position.x, y:camera.position.y, z:camera.position.z};
  const dur = 60; // frames
  let frame = 0;
  function lerpCam(){
    frame++;
    const t = Math.min(frame/dur, 1);
    const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; // easeInOutQuad
    camera.position.set(
      start.x + (p.x-start.x)*ease,
      start.y + (p.y-start.y)*ease,
      start.z + (p.z-start.z)*ease
    );
    camera.lookAt(0,0,0);
    if(t < 1) requestAnimationFrame(lerpCam);
  }
  lerpCam();
};

/* ── Visualization modes for story steps ── */
let vizOverlayEl = null;
let activeVizMode = null;

function getVizOverlay(){
  if(!vizOverlayEl){
    vizOverlayEl = document.createElement('div');
    vizOverlayEl.id = 'viz-overlay';
    vizOverlayEl.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:4;';
    const wrap = document.querySelector('.obs-3d-model') || document.querySelector('.obs-canvas-wrap');
    if(wrap) wrap.appendChild(vizOverlayEl);
  }
  return vizOverlayEl;
}

/* Helper: small annotation label positioned on the 3D canvas */
function annotation(text, pos, color){
  color = color || '#f4d03f';
  const positions = {
    topRight:  'top:12px;right:12px',
    topLeft:   'top:12px;left:12px',
    bottomCenter: 'bottom:12px;left:50%;transform:translateX(-50%)',
    center:    'top:50%;left:50%;transform:translate(-50%,-50%)',
    right:     'top:50%;right:12px;transform:translateY(-50%)',
    left:      'top:50%;left:12px;transform:translateY(-50%)'
  };
  return `<div style="position:absolute;${positions[pos] || positions.bottomCenter};
    background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;
    border:1px solid rgba(255,255,255,0.1);color:${color};font-size:0.72rem;
    font-family:var(--font-body);text-align:right;direction:rtl;max-width:220px;line-height:1.5">
    ${text}</div>`;
}

window.obsSetVizMode = function(mode){
  activeVizMode = mode;
  const ov = getVizOverlay();
  ov.innerHTML = '';

  if(!mode) return;

  // Also control animation for this step
  const t = window.obsTime;

  switch(mode){

    /* ── Steps using 3D scene directly ── */

    case 'sideView':
      // Camera already at sideView - just add small annotation
      ov.innerHTML = annotation('שמש → אור → ירח → עין (ארץ)<br><span style="color:#999;font-size:0.6rem">הצד שפונה לשמש = מואר</span>', 'bottomCenter');
      break;

    case 'conjunction':
      // Position moon at conjunction (day=0), keep paused
      t.day = 0; t.playing = false;
      ov.innerHTML = annotation('⬤ המולד — הירח בין ארץ לשמש<br><span style="color:#999;font-size:0.6rem">הירח חשוך לגמרי</span>', 'bottomCenter');
      break;

    case 'crescentHighlight':
      // Advance to day 2, show thin crescent
      t.day = 2; t.playing = false;
      ov.innerHTML = `<div style="position:absolute;top:40%;right:35%;color:#f4d03f;font-size:0.9rem;font-family:var(--font-body);
        animation:pulse 1.5s ease-in-out infinite;text-shadow:0 0 10px rgba(244,208,63,0.5)">
        ← הסהר!</div>
        <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}</style>`;
      break;

    case 'showPhases':
      // Run animation fast to show all phases
      t.day = 0; t.playing = true; t.speed = 8;
      break;

    case 'gapMarker':
      // Show both orbits - annotation only
      ov.innerHTML = annotation(
        '☀ שנת חמה: <b>365</b> ימים<br>🌙 שנת לבנה: <b>354</b> ימים<br><span style="color:#ef4444;font-weight:700">הפרש: 11 ימים!</span>',
        'topRight');
      break;

    case 'cycle19':
      // Small 19-year cycle diagram as annotation
      ov.innerHTML = annotation(
        'מחזור 19 שנה<br><span style="color:#f4d03f">◉ מעוברת: 3,6,8,11,14,17,19</span><br><span style="color:#999;font-size:0.6rem">7 שנים מתוך 19</span>',
        'center', '#f4d03f');
      break;

    case 'clock1080':
      ov.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;
        background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:16px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.1)">
        <div style="font-size:2.5rem;font-weight:700;color:#f4d03f;font-family:var(--font-hal)">1,080</div>
        <div style="font-size:0.8rem;color:#ccc;margin-bottom:8px;font-family:var(--font-body)">חלקים בשעה</div>
        <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap">
          ${[2,3,4,5,6,8,9,10].map(n => `<span style="padding:2px 6px;border-radius:6px;background:rgba(244,208,63,0.1);border:1px solid rgba(244,208,63,0.15);font-size:0.6rem;color:#f4d03f">÷${n}=${1080/n}</span>`).join('')}
        </div></div>`;
      break;

    case 'timeline':
      ov.innerHTML = `<div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:4px;direction:rtl;
        background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1)">
        <span style="color:#f4d03f;font-size:0.65rem;font-family:var(--font-body);font-weight:700">בה"ד</span>
        ${[1,2,3].map(() => `<span style="color:#555">→</span><span style="color:#87CEEB;font-size:0.5rem">+29d12h793p</span><span style="width:4px;height:4px;border-radius:50%;background:#87CEEB;display:inline-block"></span>`).join('')}
        <span style="color:#555">→...</span></div>`;
      break;

    case 'weekDays':
      const days = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
      const forbidden = [0,3,5];
      ov.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;gap:4px;direction:rtl;
        background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.1)">
        ${days.map((d,i) => `<div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;font-family:var(--font-body);
          ${forbidden.includes(i) ? 'background:rgba(239,68,68,0.25);border:1.5px solid #ef4444;color:#ef4444' : 'background:rgba(52,211,153,0.15);border:1.5px solid #34d399;color:#34d399'}">${d}</div>`).join('')}
      </div>`;
      break;

    case 'monthBars':
      const months = ['תשרי','חשון','כסלו','טבת','שבט','אדר','ניסן','אייר','סיון','תמוז','אב','אלול'];
      const full =   [true,  null,  null,  false,true, false,true, false,true, false,true, false];
      ov.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;gap:2px;align-items:flex-end;direction:rtl;
        background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);padding:8px;border-radius:10px;border:1px solid rgba(255,255,255,0.1)">
        ${months.map((m,i) => {
          const f = full[i]; const h = f===null?28:(f?32:24); const c = f===null?'#888':(f?'#34d399':'#87CEEB'); const l = f===null?'?':(f?'30':'29');
          return `<div style="text-align:center"><div style="width:22px;height:${h}px;background:${c}22;border:1px solid ${c};border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:${c}">${l}</div>
          <div style="font-size:0.38rem;color:#888;margin-top:1px;font-family:var(--font-body)">${m}</div></div>`;
        }).join('')}</div>`;
      break;

    case 'zodiacLabels':
      // 3D zodiac ring is already visible - start slow animation
      t.playing = true; t.speed = 3;
      break;

    case 'epicycleExplain':
      // Show epicycle in 3D with annotation
      t.playing = true; t.speed = 2;
      ov.innerHTML = annotation(
        '<span style="color:#ff9933;font-weight:700">גלגל גדול</span> <span style="color:#999">— מרכזו מוזז</span><br>' +
        '<span style="color:#ffcc44;font-weight:700">גלגל קטן</span> <span style="color:#999">— עליו השמש בפועל</span>',
        'topRight');
      break;

    case 'equationArrow':
    case 'equationArrowMoon': {
      const isMoon = mode === 'equationArrowMoon';
      const name = isMoon ? 'ירח' : 'שמש';
      const max = isMoon ? '5° 8\'' : '~2°';
      ov.innerHTML = annotation(
        `<span style="color:#ff9933">${name} אמצעי</span> → <span style="color:#f4d03f;font-weight:700">תיקון (עד ${max})</span> → <span style="color:#f4d03f">${name} אמיתי</span>`,
        'bottomCenter');
      break;
    }

    case 'dualSpeed':
      // Run animation to show speed difference
      t.playing = true; t.speed = 3;
      ov.innerHTML = annotation(
        '🌙 ירח: <b style="color:#87CEEB">13° ביום</b><br>☀ שמש: <b style="color:#ffcc44">1° ביום</b>',
        'topRight');
      break;

    case 'moonEpicycle':
      ov.innerHTML = annotation(
        '<span style="color:#87CEEB;font-weight:700">גלגל קטן של הירח</span><br>' +
        '<span style="color:#999;font-size:0.6rem">קרוב = מהיר · רחוק = איטי</span><br>' +
        '<span style="color:#f4d03f">מנת חריגה</span> <span style="color:#999;font-size:0.6rem">= מרחק מהשיא</span>',
        'topRight');
      break;

    case 'nodesExplain':
      ov.innerHTML = annotation(
        '<span style="color:#34d399">◆ ראש</span> — נקודת חיתוך עולה<br>' +
        '<span style="color:#ef4444">◆ זנב</span> — נקודת חיתוך יורדת<br>' +
        '<span style="color:#888;font-size:0.6rem">← זזות לאחור</span>',
        'topRight');
      break;

    case 'elongationExplain':
      // Show elongation arc in 3D
      ov.innerHTML = annotation(
        'הזווית בין ☀ שמש ל-🌙 ירח<br>' +
        '<span style="color:#999;font-size:0.6rem">0° = מולד · 180° = ירח מלא</span>',
        'bottomCenter');
      break;

    case 'parallaxLines':
      ov.innerHTML = annotation(
        '<span style="color:#888">- - - ממרכז הארץ</span><br>' +
        '<span style="color:#f4d03f">—— מירושלים</span><br>' +
        '<span style="color:#ef4444;font-size:0.6rem">← הפרש ראייה →</span>',
        'topRight');
      break;

    case 'arcZones':
      ov.innerHTML = `<div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:260px;height:60px;border-radius:130px 130px 0 0;overflow:hidden;border:1px solid rgba(255,255,255,0.15)">
        <div style="position:absolute;bottom:0;left:0;right:0;height:30%;background:rgba(239,68,68,0.25);display:flex;align-items:center;justify-content:center;color:#ef4444;font-size:0.55rem;font-family:var(--font-body)">&lt;9° בלתי נראה</div>
        <div style="position:absolute;bottom:30%;left:0;right:0;height:30%;background:rgba(255,150,50,0.2);display:flex;align-items:center;justify-content:center;color:#ff9933;font-size:0.55rem;font-family:var(--font-body)">9°-14° תלוי</div>
        <div style="position:absolute;bottom:60%;left:0;right:0;height:40%;background:rgba(52,211,153,0.12);display:flex;align-items:center;justify-content:center;color:#34d399;font-size:0.55rem;font-family:var(--font-body)">&gt;14° נראה</div>
      </div>`;
      break;

    case 'allLayers':
      for(let i=1; i<=4; i++){
        if(!window.obsGetLayerVisibility()[i]) window.obsToggleLayer(i);
      }
      t.playing = true; t.speed = 5;
      break;

    case 'summary':
      ov.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;font-family:var(--font-hal)">
        <div style="font-size:2.5rem;color:#f4d03f;text-shadow:0 0 30px rgba(244,208,63,0.5);animation:glow 2s ease-in-out infinite">מקודש!</div>
      </div><style>@keyframes glow{0%,100%{text-shadow:0 0 30px rgba(244,208,63,0.5)}50%{text-shadow:0 0 60px rgba(244,208,63,0.8)}}</style>`;
      break;
  }
};

})();

