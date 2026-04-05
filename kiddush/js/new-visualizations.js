/* new-visualizations.js
 * New visualization templates for Rambam Hilchot Kiddush HaChodesh
 * All globals — no modules.
 *
 * === viz_map.json additions ===
 * Add these entries to kiddush/data/viz_map.json:
 *
 *   "15:1": "moonCalc",
 *   "14:2": "orbitCanvas",
 *   "16:2": "nodesAnim",
 *   "16:12": "latitudeCalc"
 *
 * Rationale:
 *   - "15:1"  -> moonCalc      (Moon true position calculator, Ch 15)
 *   - "14:2"  -> orbitCanvas    (Epicycle animation; 14:1 already has moonEpicycle)
 *   - "16:2"  -> nodesAnim      (Lunar nodes animation; 16:1 already has nodesViz)
 *   - "16:12" -> latitudeCalc   (Latitude calculator; 16:11 already has latitudeTable)
 * ===========================================
 */

window.NEW_VIZ_MAP = {

  // ============================================================
  // 1. moonCalc — Moon True Position Calculator (Chapter 15)
  // ============================================================
  moonCalc: '<div class="calc-tool">' +
    '<div style="font-size:.82rem;color:var(--purple);font-weight:600;margin-bottom:8px">' +
      '\u05D7\u05D9\u05E9\u05D5\u05D1 \u05DE\u05E7\u05D5\u05DD \u05D4\u05D9\u05E8\u05D7 \u05D4\u05D0\u05DE\u05D9\u05EA\u05D9 \u2014 \u05E4\u05E8\u05E7 \u05D8\u05F4\u05D5' +
    '</div>' +
    '<div class="inline-row">' +
      '<label>\u05D9\u05DE\u05D9\u05DD \u05DE\u05D4\u05E2\u05D9\u05E7\u05E8:</label>' +
      '<input type="number" id="moonD" value="100" min="0">' +
      '<button class="btn-calc" onclick="runMoonCalc()">\u05D7\u05E9\u05D1 \u05DE\u05E7\u05D5\u05DD \u05D9\u05E8\u05D7</button>' +
    '</div>' +
    '<div id="moonResult"></div>' +
  '</div>',

  // ============================================================
  // 2. latitudeCalc — Moon Latitude Calculator (Chapter 16)
  // ============================================================
  latitudeCalc: '<div class="calc-tool">' +
    '<div style="font-size:.82rem;color:var(--purple);font-weight:600;margin-bottom:8px">' +
      '\u05D7\u05D9\u05E9\u05D5\u05D1 \u05E8\u05D5\u05D7\u05D1 \u05D4\u05D9\u05E8\u05D7 \u2014 \u05E4\u05E8\u05E7 \u05D8\u05F4\u05D6' +
    '</div>' +
    '<div class="inline-row">' +
      '<label>\u05D9\u05DE\u05D9\u05DD \u05DE\u05D4\u05E2\u05D9\u05E7\u05E8:</label>' +
      '<input type="number" id="latD" value="100" min="0">' +
      '<button class="btn-calc" onclick="runLatitudeCalc()">\u05D7\u05E9\u05D1 \u05E8\u05D5\u05D7\u05D1</button>' +
    '</div>' +
    '<div id="latResult"></div>' +
  '</div>',

  // ============================================================
  // 3. orbitCanvas — Animated Epicycle Model (Chapter 14)
  // ============================================================
  orbitCanvas: '<div class="viz-container" id="viz-orbit">' +
    '<canvas id="orbitCvs" style="width:100%;height:320px;display:block;border-radius:12px;background:#080c18"></canvas>' +
    '<div class="scene-ctrl">' +
      '<button class="sc-btn on" id="orbitPlayBtn" onclick="toggleOrbitPlay()">\u23F8</button>' +
      '<label style="font-size:.72rem;color:var(--txt3);margin:0 6px">\u05DE\u05D4\u05D9\u05E8\u05D5\u05EA:</label>' +
      '<input type="range" min="1" max="20" value="5" id="orbitSpeedSlider" style="accent-color:var(--gold);width:100px">' +
    '</div>' +
    '<div id="orbitLabels" style="display:flex;justify-content:space-around;font-size:.72rem;color:var(--txt3);padding:4px 8px">' +
      '<span>\u05D0\u05DE\u05E6\u05E2: <span id="orbitMeanLbl" style="color:var(--sky)">0\u00B0</span></span>' +
      '<span>\u05D0\u05DE\u05D9\u05EA\u05D9: <span id="orbitTrueLbl" style="color:var(--gold)">0\u00B0</span></span>' +
      '<span>\u05DE\u05E0\u05D4: <span id="orbitEqLbl" style="color:var(--green)">0\u00B0</span></span>' +
    '</div>' +
  '</div>' +
  '<script>' +
    '(function(){' +
      'var playing=true,speed=5,raf=null,angle=0;' +
      'window.toggleOrbitPlay=function(){' +
        'playing=!playing;' +
        'document.getElementById("orbitPlayBtn").textContent=playing?"\\u23F8":"\\u25B6";' +
        'document.getElementById("orbitPlayBtn").className=playing?"sc-btn on":"sc-btn";' +
        'if(playing)startOrbitAnim();' +
      '};' +

      'function startOrbitAnim(){' +
        'if(raf)cancelAnimationFrame(raf);' +
        'function loop(){' +
          'if(!playing)return;' +
          'speed=+(document.getElementById("orbitSpeedSlider")||{value:5}).value;' +
          'angle+=speed*0.003;' +
          'drawOrbit(angle);' +
          'raf=requestAnimationFrame(loop);' +
        '}' +
        'loop();' +
      '}' +

      'function drawOrbit(t){' +
        'var cv=document.getElementById("orbitCvs");' +
        'if(!cv)return;' +
        'var rect=cv.getBoundingClientRect();' +
        'var dpr=window.devicePixelRatio||1;' +
        'cv.width=rect.width*dpr;cv.height=rect.height*dpr;' +
        'var ctx=cv.getContext("2d");' +
        'ctx.setTransform(dpr,0,0,dpr,0,0);' +
        'var W=rect.width,H=rect.height;' +
        'var cx=W/2,cy=H/2;' +
        'var R=Math.min(W,H)*0.35;' + // deferent radius
        'var r=R*0.18;' +              // epicycle radius

        // Background
        'ctx.fillStyle="#080c18";ctx.fillRect(0,0,W,H);' +

        // Stars
        'ctx.fillStyle="rgba(255,255,255,0.4)";' +
        'for(var i=0;i<60;i++){' +
          'var sx=(Math.sin(i*137.508)*0.5+0.5)*W;' +
          'var sy=(Math.cos(i*97.3)*0.5+0.5)*H;' +
          'ctx.fillRect(sx,sy,1,1);' +
        '}' +

        // Mean moon angle (on deferent)
        'var meanAngle=t*2.3;' +     // mean motion
        // Anomaly drives epicycle
        'var anomAngle=t*2.18;' +    // anomaly rate slightly different

        // Deferent center point (where epicycle center sits)
        'var dcx=cx+R*Math.cos(meanAngle);' +
        'var dcy=cy+R*Math.sin(meanAngle);' +

        // Moon on epicycle
        'var mx=dcx+r*Math.cos(anomAngle);' +
        'var my=dcy+r*Math.sin(anomAngle);' +

        // True angle from earth
        'var trueAngle=Math.atan2(my-cy,mx-cx);' +
        'var meanDeg=((meanAngle*180/Math.PI)%360+360)%360;' +
        'var trueDeg=((trueAngle*180/Math.PI)%360+360)%360;' +
        'var eqDeg=trueDeg-meanDeg;' +
        'if(eqDeg>180)eqDeg-=360;if(eqDeg<-180)eqDeg+=360;' +

        // Draw deferent circle
        'ctx.strokeStyle="rgba(135,206,235,0.15)";ctx.lineWidth=1;' +
        'ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();' +

        // Draw epicycle circle
        'ctx.strokeStyle="rgba(244,208,63,0.25)";' +
        'ctx.beginPath();ctx.arc(dcx,dcy,r,0,Math.PI*2);ctx.stroke();' +

        // Line: earth to deferent center (mean direction)
        'ctx.strokeStyle="rgba(135,206,235,0.3)";ctx.setLineDash([4,4]);' +
        'ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(dcx,dcy);ctx.stroke();' +
        'ctx.setLineDash([]);' +

        // Line: earth to moon (true direction)
        'ctx.strokeStyle="rgba(244,208,63,0.5)";ctx.lineWidth=1.5;' +
        'ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(mx,my);ctx.stroke();' +
        'ctx.lineWidth=1;' +

        // Earth
        'ctx.fillStyle="#2244aa";' +
        'ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();' +
        'ctx.fillStyle="#87CEEB";ctx.font="10px Heebo";ctx.textAlign="center";' +
        'ctx.fillText("\\u05D0\\u05E8\\u05E5",cx,cy+20);' +

        // Epicycle center dot
        'ctx.fillStyle="rgba(135,206,235,0.5)";' +
        'ctx.beginPath();ctx.arc(dcx,dcy,3,0,Math.PI*2);ctx.fill();' +

        // Moon
        'ctx.fillStyle="#e8e8d8";' +
        'ctx.beginPath();ctx.arc(mx,my,5,0,Math.PI*2);ctx.fill();' +
        'ctx.fillStyle="#f4d03f";ctx.font="10px Heebo";' +
        'ctx.fillText("\\u05D9\\u05E8\\u05D7",mx,my-10);' +

        // Mean direction indicator on deferent edge
        'var mdx=cx+R*1.15*Math.cos(meanAngle);' +
        'var mdy=cy+R*1.15*Math.sin(meanAngle);' +
        'ctx.fillStyle="rgba(135,206,235,0.5)";ctx.font="9px Heebo";' +
        'ctx.fillText("\\u05D0\\u05DE\\u05E6\\u05E2",mdx,mdy);' +

        // True direction indicator
        'var tdist=R*1.15;' +
        'var tdx=cx+tdist*Math.cos(trueAngle);' +
        'var tdy=cy+tdist*Math.sin(trueAngle);' +
        'ctx.fillStyle="rgba(244,208,63,0.6)";' +
        'ctx.fillText("\\u05D0\\u05DE\\u05D9\\u05EA\\u05D9",tdx,tdy);' +

        // Update labels
        'var ml=document.getElementById("orbitMeanLbl");' +
        'var tl=document.getElementById("orbitTrueLbl");' +
        'var el=document.getElementById("orbitEqLbl");' +
        'if(ml)ml.textContent=Math.round(meanDeg)+"\\u00B0";' +
        'if(tl)tl.textContent=Math.round(trueDeg)+"\\u00B0";' +
        'if(el)el.textContent=eqDeg.toFixed(1)+"\\u00B0";' +
      '}' +

      // Auto-start when element appears
      'function tryStart(){' +
        'if(document.getElementById("orbitCvs")){startOrbitAnim();}' +
        'else{setTimeout(tryStart,200);}' +
      '}' +
      'setTimeout(tryStart,100);' +
    '})();' +
  '<\/script>',

  // ============================================================
  // 4. nodesAnim — Lunar Nodes Animation (Chapter 16)
  // ============================================================
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
  '</div>' +
  '<script>' +
    '(function(){' +
      'var playing=true,speed=5,raf=null,time=0;' +
      'window.toggleNodesPlay=function(){' +
        'playing=!playing;' +
        'document.getElementById("nodesPlayBtn").textContent=playing?"\\u23F8":"\\u25B6";' +
        'document.getElementById("nodesPlayBtn").className=playing?"sc-btn on":"sc-btn";' +
        'if(playing)startNodesAnim();' +
      '};' +

      'function startNodesAnim(){' +
        'if(raf)cancelAnimationFrame(raf);' +
        'function loop(){' +
          'if(!playing)return;' +
          'speed=+(document.getElementById("nodesSpeedSlider")||{value:5}).value;' +
          'time+=speed*0.002;' +
          'drawNodes(time);' +
          'raf=requestAnimationFrame(loop);' +
        '}' +
        'loop();' +
      '}' +

      'function drawNodes(t){' +
        'var cv=document.getElementById("nodesCvs");' +
        'if(!cv)return;' +
        'var rect=cv.getBoundingClientRect();' +
        'var dpr=window.devicePixelRatio||1;' +
        'cv.width=rect.width*dpr;cv.height=rect.height*dpr;' +
        'var ctx=cv.getContext("2d");' +
        'ctx.setTransform(dpr,0,0,dpr,0,0);' +
        'var W=rect.width,H=rect.height;' +
        'var cx=W/2,cy=H/2;' +
        'var R=Math.min(W,H)*0.38;' +

        // Background
        'ctx.fillStyle="#080c18";ctx.fillRect(0,0,W,H);' +

        // Stars
        'ctx.fillStyle="rgba(255,255,255,0.3)";' +
        'for(var i=0;i<50;i++){' +
          'var sx=(Math.sin(i*137.508)*0.5+0.5)*W;' +
          'var sy=(Math.cos(i*97.3)*0.5+0.5)*H;' +
          'ctx.fillRect(sx,sy,1,1);' +
        '}' +

        // Inclination angle (~5 degrees, exaggerated for viz to ~15 deg)
        'var incl=0.26;' + // radians, about 15 degrees visually

        // Node regression: nodes move backward
        'var nodeAngle=-t*0.15;' + // slow retrograde

        // Ecliptic plane — a horizontal ellipse
        'ctx.strokeStyle="rgba(244,208,63,0.3)";ctx.lineWidth=1.5;' +
        'ctx.beginPath();ctx.ellipse(cx,cy,R,R*0.15,0,0,Math.PI*2);ctx.stroke();' +
        'ctx.fillStyle="rgba(244,208,63,0.15)";ctx.font="10px Heebo";ctx.textAlign="center";' +
        'ctx.fillText("\\u05DE\\u05E1\\u05DC\\u05D5\\u05DC \\u05D4\\u05E9\\u05DE\\u05E9 (\\u05D0\\u05E7\\u05DC\\u05D9\\u05E4\\u05D8\\u05D9\\u05E7\\u05D4)",cx,cy+R*0.15+18);' +

        // Moon orbital plane — tilted ellipse
        'ctx.save();' +
        'ctx.translate(cx,cy);' +
        'ctx.rotate(nodeAngle);' + // nodes rotate the tilt axis
        'ctx.strokeStyle="rgba(135,206,235,0.35)";ctx.lineWidth=1.5;' +
        'ctx.beginPath();ctx.ellipse(0,0,R,R*0.15+R*Math.sin(incl)*0.7,0,0,Math.PI*2);ctx.stroke();' +
        'ctx.restore();' +

        // Ascending node (rosh) position
        'var headX=cx+R*Math.cos(nodeAngle);' +
        'var headY=cy+R*0.15*Math.sin(nodeAngle);' +
        // Descending node (zanav) — opposite
        'var tailX=cx+R*Math.cos(nodeAngle+Math.PI);' +
        'var tailY=cy+R*0.15*Math.sin(nodeAngle+Math.PI);' +

        // Draw nodes
        // Ascending node
        'ctx.fillStyle="#f4d03f";' +
        'ctx.beginPath();ctx.arc(headX,headY,6,0,Math.PI*2);ctx.fill();' +
        'ctx.font="bold 11px Heebo";ctx.textAlign="center";' +
        'ctx.fillText("\\u05E8\\u05D0\\u05E9 \\u2191",headX,headY-12);' +
        // Descending node
        'ctx.fillStyle="#ef4444";' +
        'ctx.beginPath();ctx.arc(tailX,tailY,6,0,Math.PI*2);ctx.fill();' +
        'ctx.fillText("\\u05D6\\u05E0\\u05D1 \\u2193",tailX,tailY-12);' +

        // Earth at center
        'ctx.fillStyle="#2244aa";' +
        'ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fill();' +
        'ctx.fillStyle="#87CEEB";ctx.font="10px Heebo";' +
        'ctx.fillText("\\u05D0\\u05E8\\u05E5",cx,cy+18);' +

        // Moon moving along its tilted orbit
        'var moonOrbitAngle=t*2.5;' + // moon speed
        'var mox=R*Math.cos(moonOrbitAngle);' +
        'var moy_flat=R*0.15*Math.sin(moonOrbitAngle);' +
        // Add tilt based on distance from nodes
        'var tiltPhase=moonOrbitAngle-nodeAngle;' +
        'var moy_tilt=R*Math.sin(incl)*0.7*Math.sin(tiltPhase);' +
        // Rotate by node angle
        'var cosN=Math.cos(nodeAngle),sinN=Math.sin(nodeAngle);' +
        'var rmx=mox*cosN-(moy_flat+moy_tilt)*sinN;' +
        'var rmy=mox*sinN+(moy_flat+moy_tilt)*cosN;' +
        'var moonX=cx+rmx,moonY=cy+rmy;' +

        // Latitude = vertical displacement from ecliptic
        'var eclY=cy+R*0.15*Math.sin(Math.atan2(rmy,rmx));' +
        'var latPx=eclY-moonY;' + // positive = above = north

        // Draw latitude line
        'if(Math.abs(latPx)>2){' +
          'ctx.strokeStyle="rgba(135,206,235,0.4)";ctx.setLineDash([3,3]);' +
          'ctx.beginPath();ctx.moveTo(moonX,moonY);ctx.lineTo(moonX,moonY+latPx);ctx.stroke();' +
          'ctx.setLineDash([]);' +
          'ctx.fillStyle="rgba(135,206,235,0.6)";ctx.font="9px Heebo";ctx.textAlign="left";' +
          'ctx.fillText((latPx>0?"\\u05D3\\u05E8\\u05D5\\u05DD":"\\u05E6\\u05E4\\u05D5\\u05DF"),moonX+8,moonY+latPx/2);' +
        '}' +

        // Moon
        'ctx.fillStyle="#e8e8d8";' +
        'ctx.beginPath();ctx.arc(moonX,moonY,5,0,Math.PI*2);ctx.fill();' +
        'ctx.fillStyle="#e8e8d8";ctx.font="10px Heebo";ctx.textAlign="center";' +
        'ctx.fillText("\\u05D9\\u05E8\\u05D7",moonX,moonY-10);' +

        // Node direction arrow (retrograde indicator)
        'ctx.fillStyle="rgba(255,255,255,0.2)";ctx.font="9px Heebo";ctx.textAlign="center";' +
        'ctx.fillText("\\u2190 \\u05E0\\u05E1\\u05D9\\u05D2\\u05EA \\u05D4\\u05E8\\u05D0\\u05E9 (\\u05D0\\u05D7\\u05D5\\u05E8\\u05E0\\u05D9\\u05EA)",cx,H-10);' +

        // Update labels
        'var headDeg=(((-nodeAngle*180/Math.PI)%360)+360)%360;' +
        'var tailDeg=(headDeg+180)%360;' +
        'var latVal=Math.abs(latPx/(R*Math.sin(incl)*0.7)*5);' + // rough scale to ~5 degrees
        'if(latVal>5)latVal=5;' +
        'var hl=document.getElementById("nodesHeadLbl");' +
        'var tl=document.getElementById("nodesTailLbl");' +
        'var ll=document.getElementById("nodesLatLbl");' +
        'if(hl)hl.textContent=Math.round(headDeg)+"\\u00B0";' +
        'if(tl)tl.textContent=Math.round(tailDeg)+"\\u00B0";' +
        'if(ll)ll.textContent=latVal.toFixed(1)+"\\u00B0 "+(latPx>0?"\\u05D3\\u05E8\\u05D5\\u05DD":"\\u05E6\\u05E4\\u05D5\\u05DF");' +
      '}' +

      'function tryStart(){' +
        'if(document.getElementById("nodesCvs")){startNodesAnim();}' +
        'else{setTimeout(tryStart,200);}' +
      '}' +
      'setTimeout(tryStart,100);' +
    '})();' +
  '<\/script>'
};
