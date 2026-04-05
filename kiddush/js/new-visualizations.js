/* new-visualizations.js — New visualization templates + Canvas animations */

window.NEW_VIZ_MAP = {

  moonCalc: '<div class="calc-tool">' +
    '<div style="font-size:.82rem;color:var(--purple);font-weight:600;margin-bottom:8px">\u05D7\u05D9\u05E9\u05D5\u05D1 \u05DE\u05E7\u05D5\u05DD \u05D4\u05D9\u05E8\u05D7 \u05D4\u05D0\u05DE\u05D9\u05EA\u05D9 \u2014 \u05E4\u05E8\u05E7 \u05D8\u05F4\u05D5</div>' +
    '<div class="inline-row">' +
      '<label>\u05D9\u05DE\u05D9\u05DD \u05DE\u05D4\u05E2\u05D9\u05E7\u05E8:</label>' +
      '<input type="number" id="moonD" value="100" min="0">' +
      '<button class="btn-calc" onclick="runMoonCalc()">\u05D7\u05E9\u05D1 \u05DE\u05E7\u05D5\u05DD \u05D9\u05E8\u05D7</button>' +
    '</div>' +
    '<div id="moonResult"></div>' +
  '</div>',

  latitudeCalc: '<div class="calc-tool">' +
    '<div style="font-size:.82rem;color:var(--purple);font-weight:600;margin-bottom:8px">\u05D7\u05D9\u05E9\u05D5\u05D1 \u05E8\u05D5\u05D7\u05D1 \u05D4\u05D9\u05E8\u05D7 \u2014 \u05E4\u05E8\u05E7 \u05D8\u05F4\u05D6</div>' +
    '<div class="inline-row">' +
      '<label>\u05D9\u05DE\u05D9\u05DD \u05DE\u05D4\u05E2\u05D9\u05E7\u05E8:</label>' +
      '<input type="number" id="latD" value="100" min="0">' +
      '<button class="btn-calc" onclick="runLatitudeCalc()">\u05D7\u05E9\u05D1 \u05E8\u05D5\u05D7\u05D1</button>' +
    '</div>' +
    '<div id="latResult"></div>' +
  '</div>',

  orbitCanvas: '<div class="viz-container" id="viz-orbit">' +
    '<canvas id="orbitCvs" style="width:100%;height:320px;display:block;border-radius:12px;background:#080c18"></canvas>' +
    '<div class="scene-ctrl">' +
      '<button class="sc-btn on" id="orbitPlayBtn" onclick="toggleOrbitPlay()">\u23F8</button>' +
      '<label style="font-size:.72rem;color:var(--txt3);margin:0 6px">\u05DE\u05D4\u05D9\u05E8\u05D5\u05EA:</label>' +
      '<input type="range" min="1" max="20" value="5" id="orbitSpeedSlider" style="accent-color:var(--gold);width:100px">' +
    '</div>' +
    '<div style="display:flex;justify-content:space-around;font-size:.72rem;color:var(--txt3);padding:4px 8px">' +
      '<span>\u05D0\u05DE\u05E6\u05E2: <span id="orbitMeanLbl" style="color:var(--sky)">0\u00B0</span></span>' +
      '<span>\u05D0\u05DE\u05D9\u05EA\u05D9: <span id="orbitTrueLbl" style="color:var(--gold)">0\u00B0</span></span>' +
      '<span>\u05DE\u05E0\u05D4: <span id="orbitEqLbl" style="color:var(--green)">0\u00B0</span></span>' +
    '</div>' +
  '</div>',

  nodesAnim: '<div class="viz-container" id="viz-nodes">' +
    '<canvas id="nodesCvs" style="width:100%;height:300px;display:block;border-radius:12px;background:#080c18"></canvas>' +
    '<div class="scene-ctrl">' +
      '<button class="sc-btn on" id="nodesPlayBtn" onclick="toggleNodesPlay()">\u23F8</button>' +
      '<label style="font-size:.72rem;color:var(--txt3);margin:0 6px">\u05DE\u05D4\u05D9\u05E8\u05D5\u05EA:</label>' +
      '<input type="range" min="1" max="20" value="5" id="nodesSpeedSlider" style="accent-color:var(--gold);width:100px">' +
    '</div>' +
    '<div style="display:flex;justify-content:space-around;font-size:.72rem;color:var(--txt3);padding:4px 8px">' +
      '<span>\u05E8\u05D0\u05E9: <span id="nodesHeadLbl" style="color:var(--gold)">0\u00B0</span></span>' +
      '<span>\u05D6\u05E0\u05D1: <span id="nodesTailLbl" style="color:var(--red)">180\u00B0</span></span>' +
      '<span>\u05E8\u05D5\u05D7\u05D1: <span id="nodesLatLbl" style="color:var(--sky)">0\u00B0</span></span>' +
    '</div>' +
  '</div>'
};

// =============================================
// ORBIT CANVAS ANIMATION (Epicycle Model)
// =============================================
var _orbitPlaying = false, _orbitRaf = null, _orbitAngle = 0, _orbitUserPaused = false, _orbitInited = false;

window.toggleOrbitPlay = function(){
  _orbitPlaying = !_orbitPlaying;
  _orbitUserPaused = !_orbitPlaying;
  var btn = document.getElementById('orbitPlayBtn');
  if(btn){ btn.textContent = _orbitPlaying ? '\u23F8' : '\u25B6'; btn.className = _orbitPlaying ? 'sc-btn on' : 'sc-btn'; }
  if(_orbitPlaying) _runOrbitLoop();
  else if(_orbitRaf){ cancelAnimationFrame(_orbitRaf); _orbitRaf = null; }
};

function _runOrbitLoop(){
  if(_orbitRaf) cancelAnimationFrame(_orbitRaf);
  (function loop(){
    if(!_orbitPlaying) return;
    var spd = +(document.getElementById('orbitSpeedSlider')||{value:5}).value;
    _orbitAngle += spd * 0.003;
    _drawOrbit(_orbitAngle);
    _orbitRaf = requestAnimationFrame(loop);
  })();
}

function _drawOrbit(t){
  var cv = document.getElementById('orbitCvs');
  if(!cv) return;
  var rect = cv.getBoundingClientRect();
  var dpr = window.devicePixelRatio||1;
  cv.width = rect.width*dpr; cv.height = rect.height*dpr;
  var ctx = cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  var W=rect.width, H=rect.height, cx=W/2, cy=H/2;
  var R = Math.min(W,H)*0.35, r = R*0.18;

  ctx.fillStyle='#080c18'; ctx.fillRect(0,0,W,H);

  // Stars
  ctx.fillStyle='rgba(255,255,255,0.4)';
  for(var i=0;i<60;i++){
    ctx.fillRect((Math.sin(i*137.508)*0.5+0.5)*W, (Math.cos(i*97.3)*0.5+0.5)*H, 1, 1);
  }

  var meanAngle = t*2.3, anomAngle = t*2.18;
  var dcx = cx+R*Math.cos(meanAngle), dcy = cy+R*Math.sin(meanAngle);
  var mx = dcx+r*Math.cos(anomAngle), my = dcy+r*Math.sin(anomAngle);
  var trueAngle = Math.atan2(my-cy, mx-cx);
  var meanDeg = ((meanAngle*180/Math.PI)%360+360)%360;
  var trueDeg = ((trueAngle*180/Math.PI)%360+360)%360;
  var eqDeg = trueDeg-meanDeg; if(eqDeg>180)eqDeg-=360; if(eqDeg<-180)eqDeg+=360;

  // Deferent
  ctx.strokeStyle='rgba(135,206,235,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();

  // Epicycle
  ctx.strokeStyle='rgba(244,208,63,0.25)';
  ctx.beginPath(); ctx.arc(dcx,dcy,r,0,Math.PI*2); ctx.stroke();

  // Mean direction (dashed)
  ctx.strokeStyle='rgba(135,206,235,0.3)'; ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(dcx,dcy); ctx.stroke(); ctx.setLineDash([]);

  // True direction
  ctx.strokeStyle='rgba(244,208,63,0.5)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(mx,my); ctx.stroke(); ctx.lineWidth=1;

  // Earth
  ctx.fillStyle='#2244aa'; ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#87CEEB'; ctx.font='10px Heebo'; ctx.textAlign='center'; ctx.fillText('\u05D0\u05E8\u05E5',cx,cy+20);

  // Epicycle center
  ctx.fillStyle='rgba(135,206,235,0.5)'; ctx.beginPath(); ctx.arc(dcx,dcy,3,0,Math.PI*2); ctx.fill();

  // Moon
  ctx.fillStyle='#e8e8d8'; ctx.beginPath(); ctx.arc(mx,my,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f4d03f'; ctx.font='10px Heebo'; ctx.fillText('\u05D9\u05E8\u05D7',mx,my-10);

  // Labels on circle
  ctx.fillStyle='rgba(135,206,235,0.5)'; ctx.font='9px Heebo';
  ctx.fillText('\u05D0\u05DE\u05E6\u05E2', cx+R*1.15*Math.cos(meanAngle), cy+R*1.15*Math.sin(meanAngle));
  ctx.fillStyle='rgba(244,208,63,0.6)';
  ctx.fillText('\u05D0\u05DE\u05D9\u05EA\u05D9', cx+R*1.15*Math.cos(trueAngle), cy+R*1.15*Math.sin(trueAngle));

  // Update readouts
  var ml=document.getElementById('orbitMeanLbl'), tl=document.getElementById('orbitTrueLbl'), el=document.getElementById('orbitEqLbl');
  if(ml) ml.textContent=Math.round(meanDeg)+'\u00B0';
  if(tl) tl.textContent=Math.round(trueDeg)+'\u00B0';
  if(el) el.textContent=eqDeg.toFixed(1)+'\u00B0';
}

// =============================================
// NODES CANVAS ANIMATION (Lunar Nodes)
// =============================================
var _nodesPlaying = false, _nodesRaf = null, _nodesTime = 0, _nodesUserPaused = false, _nodesInited = false;

window.toggleNodesPlay = function(){
  _nodesPlaying = !_nodesPlaying;
  _nodesUserPaused = !_nodesPlaying;
  var btn = document.getElementById('nodesPlayBtn');
  if(btn){ btn.textContent = _nodesPlaying ? '\u23F8' : '\u25B6'; btn.className = _nodesPlaying ? 'sc-btn on' : 'sc-btn'; }
  if(_nodesPlaying) _runNodesLoop();
  else if(_nodesRaf){ cancelAnimationFrame(_nodesRaf); _nodesRaf = null; }
};

function _runNodesLoop(){
  if(_nodesRaf) cancelAnimationFrame(_nodesRaf);
  (function loop(){
    if(!_nodesPlaying) return;
    var spd = +(document.getElementById('nodesSpeedSlider')||{value:5}).value;
    _nodesTime += spd * 0.002;
    _drawNodes(_nodesTime);
    _nodesRaf = requestAnimationFrame(loop);
  })();
}

function _drawNodes(t){
  var cv = document.getElementById('nodesCvs');
  if(!cv) return;
  var rect = cv.getBoundingClientRect();
  var dpr = window.devicePixelRatio||1;
  cv.width = rect.width*dpr; cv.height = rect.height*dpr;
  var ctx = cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  var W=rect.width, H=rect.height, cx=W/2, cy=H/2;
  var R = Math.min(W,H)*0.38;
  var incl = 0.26; // ~15deg visual exaggeration

  ctx.fillStyle='#080c18'; ctx.fillRect(0,0,W,H);

  // Stars
  ctx.fillStyle='rgba(255,255,255,0.3)';
  for(var i=0;i<50;i++){
    ctx.fillRect((Math.sin(i*137.508)*0.5+0.5)*W, (Math.cos(i*97.3)*0.5+0.5)*H, 1, 1);
  }

  var nodeAngle = -t*0.15; // retrograde

  // Ecliptic
  ctx.strokeStyle='rgba(244,208,63,0.3)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.ellipse(cx,cy,R,R*0.15,0,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(244,208,63,0.15)'; ctx.font='10px Heebo'; ctx.textAlign='center';
  ctx.fillText('\u05DE\u05E1\u05DC\u05D5\u05DC \u05D4\u05E9\u05DE\u05E9 (\u05D0\u05E7\u05DC\u05D9\u05E4\u05D8\u05D9\u05E7\u05D4)',cx,cy+R*0.15+18);

  // Moon orbit (tilted)
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(nodeAngle);
  ctx.strokeStyle='rgba(135,206,235,0.35)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.ellipse(0,0,R,R*0.15+R*Math.sin(incl)*0.7,0,0,Math.PI*2); ctx.stroke();
  ctx.restore();

  // Nodes
  var headX=cx+R*Math.cos(nodeAngle), headY=cy+R*0.15*Math.sin(nodeAngle);
  var tailX=cx+R*Math.cos(nodeAngle+Math.PI), tailY=cy+R*0.15*Math.sin(nodeAngle+Math.PI);

  ctx.fillStyle='#f4d03f'; ctx.beginPath(); ctx.arc(headX,headY,6,0,Math.PI*2); ctx.fill();
  ctx.font='bold 11px Heebo'; ctx.textAlign='center'; ctx.fillText('\u05E8\u05D0\u05E9 \u2191',headX,headY-12);

  ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(tailX,tailY,6,0,Math.PI*2); ctx.fill();
  ctx.fillText('\u05D6\u05E0\u05D1 \u2193',tailX,tailY-12);

  // Earth
  ctx.fillStyle='#2244aa'; ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#87CEEB'; ctx.font='10px Heebo'; ctx.fillText('\u05D0\u05E8\u05E5',cx,cy+18);

  // Moon
  var mAngle = t*2.5;
  var mox = R*Math.cos(mAngle), moy_flat = R*0.15*Math.sin(mAngle);
  var tiltPhase = mAngle - nodeAngle;
  var moy_tilt = R*Math.sin(incl)*0.7*Math.sin(tiltPhase);
  var cosN=Math.cos(nodeAngle), sinN=Math.sin(nodeAngle);
  var rmx = mox*cosN - (moy_flat+moy_tilt)*sinN;
  var rmy = mox*sinN + (moy_flat+moy_tilt)*cosN;
  var moonX = cx+rmx, moonY = cy+rmy;

  // Latitude line
  var eclY = cy + R*0.15*Math.sin(Math.atan2(rmy,rmx));
  var latPx = eclY - moonY;
  if(Math.abs(latPx)>2){
    ctx.strokeStyle='rgba(135,206,235,0.4)'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(moonX,moonY); ctx.lineTo(moonX,moonY+latPx); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle='rgba(135,206,235,0.6)'; ctx.font='9px Heebo'; ctx.textAlign='left';
    ctx.fillText(latPx>0?'\u05D3\u05E8\u05D5\u05DD':'\u05E6\u05E4\u05D5\u05DF', moonX+8, moonY+latPx/2);
  }

  ctx.fillStyle='#e8e8d8'; ctx.beginPath(); ctx.arc(moonX,moonY,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#e8e8d8'; ctx.font='10px Heebo'; ctx.textAlign='center'; ctx.fillText('\u05D9\u05E8\u05D7',moonX,moonY-10);

  ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='9px Heebo';
  ctx.fillText('\u2190 \u05E0\u05E1\u05D9\u05D2\u05EA \u05D4\u05E8\u05D0\u05E9 (\u05D0\u05D7\u05D5\u05E8\u05E0\u05D9\u05EA)',cx,H-10);

  // Labels
  var headDeg = (((-nodeAngle*180/Math.PI)%360)+360)%360;
  var tailDeg = (headDeg+180)%360;
  var latVal = Math.abs(latPx/(R*Math.sin(incl)*0.7)*5); if(latVal>5)latVal=5;
  var hl=document.getElementById('nodesHeadLbl'), tl2=document.getElementById('nodesTailLbl'), ll=document.getElementById('nodesLatLbl');
  if(hl) hl.textContent=Math.round(headDeg)+'\u00B0';
  if(tl2) tl2.textContent=Math.round(tailDeg)+'\u00B0';
  if(ll) ll.textContent=latVal.toFixed(1)+'\u00B0 '+(latPx>0?'\u05D3\u05E8\u05D5\u05DD':'\u05E6\u05E4\u05D5\u05DF');
}

// =============================================
// MUTATION OBSERVER — start animations when canvas appears
// =============================================
var _vizCanvasObserver = new MutationObserver(function(){
  var orbitCv = document.getElementById('orbitCvs');
  if(orbitCv && !_orbitPlaying && !_orbitUserPaused){
    _orbitInited = true; _orbitPlaying = true; _orbitAngle = 0; _runOrbitLoop();
  }
  if(!orbitCv && _orbitInited){
    _orbitInited = false; _orbitPlaying = false; _orbitUserPaused = false;
    if(_orbitRaf){ cancelAnimationFrame(_orbitRaf); _orbitRaf = null; }
  }
  var nodesCv = document.getElementById('nodesCvs');
  if(nodesCv && !_nodesPlaying && !_nodesUserPaused){
    _nodesInited = true; _nodesPlaying = true; _nodesTime = 0; _runNodesLoop();
  }
  if(!nodesCv && _nodesInited){
    _nodesInited = false; _nodesPlaying = false; _nodesUserPaused = false;
    if(_nodesRaf){ cancelAnimationFrame(_nodesRaf); _nodesRaf = null; }
  }
});
_vizCanvasObserver.observe(document.body, {childList: true, subtree: true});
