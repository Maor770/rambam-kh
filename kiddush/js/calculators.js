const LEAPS=[3,6,8,11,14,17,19],DNAMES=['—','ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
function isLeap(y){return LEAPS.includes(y)}
function addM(d,h,p,ad,ah,ap){p+=ap;h+=Math.floor(p/1080);p%=1080;h+=ah;d+=Math.floor(h/24);h%=24;d+=ad;d=((d-1)%7)+1;return{d,h,p}}
function moladTishrei(yr){let e=yr-1,c=Math.floor(e/19),yc=(e%19)+1,d=2,h=5,p=204;for(let i=0;i<c;i++)({d,h,p}=addM(d,h,p,2,16,595));for(let y=1;y<yc;y++){if(isLeap(y))({d,h,p}=addM(d,h,p,5,21,589));else({d,h,p}=addM(d,h,p,4,8,876))}return{d,h,p}}
function moladMonth(yr,mi){let m=moladTishrei(yr);for(let i=0;i<mi;i++)m=addM(m.d,m.h,m.p,29,12,793);return m}
function fmtMolad(m){let hs=m.h<12?m.h+' בלילה':(m.h===12?'חצות':m.h-12+' ביום');return`יום ${DNAMES[m.d]}, שעה ${hs}, ${m.p} חלקים`}

function runMoladCalc(){
  const yr=+document.getElementById('mcYear').value,mi=+document.getElementById('mcMonth').value;
  if(!yr)return;const m=moladMonth(yr,mi);const e=yr-1,cn=Math.floor(e/19)+1,yc=(e%19)+1;
  document.getElementById('mcResult').innerHTML=`<div class="result-box">${fmtMolad(m)}</div><div class="calc-tool"><div class="calc-row"><span class="l">מחזור</span><span class="v">${cn}</span></div><div class="calc-row"><span class="l">שנה במחזור</span><span class="v">${yc} (${isLeap(yc)?'מעוברת':'פשוטה'})</span></div></div>`;
}

function runDechCheck(){
  const yr=+document.getElementById('dechY').value;if(!yr)return;
  const m=moladTishrei(yr);let day=m.d,reason='';const e=yr-1,yc=(e%19)+1;
  if([1,4,6].includes(day)){reason=`לא אד"ו: מולד ביום ${DNAMES[day]}`;day++;if(day>7)day=1;reason+=` ← נדחה ליום ${DNAMES[day]}`}
  else if(m.h>=18){reason=`מולד זקן: שעה ${m.h}`;day++;if(day>7)day=1;if([1,4,6].includes(day)){day++;if(day>7)day=1}reason+=` ← נדחה ליום ${DNAMES[day]}`}
  else if(!isLeap(yc)&&m.d===3&&(m.h>9||(m.h===9&&m.p>=204))){reason='גטר"ד';day=5;reason+=` ← נדחה ליום ${DNAMES[day]}`}
  else{let pv=yc-1;if(pv===0)pv=19;if(isLeap(pv)&&m.d===2&&(m.h>15||(m.h===15&&m.p>=589))){reason='בט"ו תקפ"ט';day=3;reason+=` ← נדחה ליום ${DNAMES[day]}`}else reason='אין דחייה'}
  document.getElementById('dechResult').innerHTML=`<div class="calc-tool"><div class="calc-row"><span class="l">מולד תשרי</span><span class="v">${DNAMES[m.d]} · ${m.h}h · ${m.p}p</span></div><div class="calc-row"><span class="l">תוצאה</span><span class="v">${reason}</span></div><div class="calc-row"><span class="l">ר"ה</span><span class="v" style="font-size:1.1rem">${DNAMES[day]}</span></div></div>`;
}

function runSunCalc(){
  const days=+document.getElementById('sunD').value||0;
  const md=59/60+8/3600,ms=(md*days)%360,apo=(86.756+days/(70*365.25))%360,anom=((ms-apo)+360)%360;
  const eqT=[0,20/60,40/60,58/60,1+15/60,1+29/60,1+41/60,1+51/60,1+57/60,1+59/60,1+58/60,1+53/60,1+45/60,1+33/60,1+19/60,1+1/60,42/60,20/60];
  let a=anom>180?360-anom:anom,idx=Math.floor(a/10),fr=(a-idx*10)/10;if(idx>=17)idx=16;
  const eq=eqT[idx]+(eqT[idx+1]-eqT[idx])*fr;
  const truS=anom<180?ms-eq:ms+eq;const t=((truS%360)+360)%360;
  const signs=['טלה','שור','תאומים','סרטן','אריה','בתולה','מאזניים','עקרב','קשת','גדי','דלי','דגים'];
  const si=Math.floor(t/30),inS=t-si*30;
  function dms(v){v=((v%360)+360)%360;const d=Math.floor(v),m=Math.floor((v-d)*60),s=Math.round(((v-d)*60-m)*60);return`${d}°${m}׳${s}″`}
  document.getElementById('sunResult').innerHTML=`<div class="result-box">${signs[si]} ${Math.floor(inS)}° — ${dms(t)}</div><div class="calc-tool"><div class="calc-row"><span class="l">אמצע</span><span class="v">${dms(ms)}</span></div><div class="calc-row"><span class="l">גובה</span><span class="v">${dms(apo)}</span></div><div class="calc-row"><span class="l">מסלול</span><span class="v">${dms(anom)}</span></div><div class="calc-row"><span class="l">מנה</span><span class="v">${eq.toFixed(2)}°</span></div></div>`;
}

function runVisCheck(){
  const arc=+document.getElementById('arcV').value||0,elong=+document.getElementById('elongV').value||0;
  let res,cls;
  if(arc<=9){res='לא ייראה — קשת ≤ 9°';cls='color:var(--red)'}
  else if(arc>14){res='ייראה בוודאות — קשת > 14°';cls='color:var(--green)'}
  else{const limits=[{a:10,e:13},{a:11,e:12},{a:12,e:11},{a:13,e:10},{a:14,e:9}];
    let found=false;for(const l of limits){if(arc<=l.a){if(elong>=l.e){res=`ייראה! קשת ${arc}° + אורך ${elong}° ≥ ${l.e}°`;cls='color:var(--green)'}else{res=`לא ייראה. אורך ${elong}° < ${l.e}°`;cls='color:var(--red)'}found=true;break}}
    if(!found){res='ייראה';cls='color:var(--green)'}}
  document.getElementById('visResult').innerHTML=`<div class="result-box" style="${cls}">${res}</div>`;
  // Draw sunset
  const cv=document.getElementById('sunsetViz');if(!cv)return;
  const r=cv.getBoundingClientRect();cv.width=r.width*devicePixelRatio;cv.height=r.height*devicePixelRatio;
  const ctx=cv.getContext('2d');ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  const W=r.width,H=r.height,hY=H*.78;
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#0a1628');sky.addColorStop(.4,'#1a2a4a');sky.addColorStop(.7,'#c55a2b');sky.addColorStop(.85,'#e8943a');sky.addColorStop(1,'#3a2010');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#1a0e06';ctx.fillRect(0,hY,W,H-hY);
  const sX=W*.35,sY=hY+5;ctx.fillStyle='#ffcc44';ctx.beginPath();ctx.arc(sX,sY,8,Math.PI,0);ctx.fill();
  const mArcPx=Math.min(arc/20*(hY*.65),hY*.65),mX=W*.6,mY=hY-mArcPx;
  if(arc>0){ctx.fillStyle='#e8e8e0';ctx.beginPath();ctx.arc(mX,mY,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#0a1628';ctx.beginPath();ctx.arc(mX+2.5,mY,5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(244,208,63,.3)';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(mX,hY);ctx.lineTo(mX,mY);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#f4d03f';ctx.font='10px Heebo';ctx.textAlign='right';ctx.fillText(`${arc.toFixed(1)}°`,mX-8,(hY+mY)/2)}
  ctx.strokeStyle='rgba(200,150,80,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,hY);ctx.lineTo(W,hY);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='9px Heebo';ctx.textAlign='center';ctx.fillText('אופק',W/2,hY+12);
}
