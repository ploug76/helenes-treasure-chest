/* ===== Helene's Treasure Chest v9: extra visuals (background, coins, confetti, callouts, shake) =====
   Everything here is decoration only: no game rules. Quality steps down automatically if the phone struggles.
   Q 2 = full, 1 = lighter (low-end phones), 0 = minimal (only if frames are still slow). */
const QS=new URLSearchParams(location.search);
let Q=QS.has('q')?Math.max(0,Math.min(2,+QS.get('q')||0)):null;
const RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
function gfxInitQ(lite){if(Q==null)Q=lite?1:2;applyQ()}
function applyQ(){LITE=Q<2;PCAP=Q>=2?360:Q===1?140:70;document.documentElement.classList.toggle('q0',Q===0);document.documentElement.classList.toggle('q1',Q===1);bgStatic=false}
const PERF={s:0,n:0,cool:3500,drops:0};
/* watch the real frame time; if it stays slow, drop one quality step (never below 0). */
function perfTick(t,dt){if(document.hidden||dt>250||QS.has('q'))return;PERF.s+=dt;PERF.n++;if(PERF.n<45)return;const avg=PERF.s/PERF.n;PERF.s=PERF.n=0;
 if(t>PERF.cool&&avg>25&&Q>0){Q--;PERF.drops++;applyQ();PERF.cool=t+3000}}
window.__htcQ=()=>({Q,drops:PERF.drops,lite:LITE,pcap:PCAP});
/* ---------- animated background (tiny low-res canvas, scaled up by the browser = soft bokeh for free) ---------- */
const bgc=document.getElementById('bg'),bgx=bgc.getContext('2d');let BGW=0,BGH=0,bgStatic=false,bgLast=0;const BK=.3;
const ORBS=[];for(let i=0;i<14;i++)ORBS.push({x:Math.random(),y:Math.random(),r:.06+Math.random()*.12,vx:(Math.random()-.5)*.00002,vy:-(.000008+Math.random()*.00002),c:['#ff6ec7','#ffd54a','#8f6bff','#45e0ff','#ff9f5a','#7dffb2'][i%6],ph:Math.random()*6});
const OSPR={};function orbSprite(c){if(OSPR[c])return OSPR[c];const k=document.createElement('canvas');k.width=k.height=48;const x=k.getContext('2d'),g=x.createRadialGradient(24,24,0,24,24,24);g.addColorStop(0,c+'cc');g.addColorStop(.5,c+'44');g.addColorStop(1,c+'00');x.fillStyle=g;x.fillRect(0,0,48,48);return OSPR[c]=k}
function gfxResize(W,H){BGW=Math.max(40,Math.ceil(W*BK));BGH=Math.max(40,Math.ceil(H*BK));bgc.width=BGW;bgc.height=BGH;bgStatic=false;fxResize(W,H)}
function drawBG(t){const step=Q>=2?80:Q===1?160:1e9;/* slow drifting light: ~12 fps is plenty and keeps low-end phones smooth */if(bgStatic||t-bgLast<step)return;bgLast=t;const x=bgx,W=BGW,H=BGH,M=Math.max(W,H);
 const g=x.createRadialGradient(W/2,H*.22,0,W/2,H*.22,M*.95);g.addColorStop(0,'#7a2a78');g.addColorStop(.45,'#3a1150');g.addColorStop(1,'#12041c');x.fillStyle=g;x.fillRect(0,0,W,H);
 /* slow golden light rays from the top */
 x.save();x.translate(W/2,-H*.08);x.rotate(Math.sin(t*.00012)*.25);x.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const a=Math.PI/2+(i-3)*.28;x.fillStyle='rgba(255,210,120,'+(.05+.03*Math.sin(t*.0009+i))+')';x.beginPath();x.moveTo(0,0);x.arc(0,0,M*1.3,a-.07,a+.07);x.closePath();x.fill()}x.restore();
 x.save();x.globalCompositeOperation='lighter';for(const o of ORBS){o.x+=o.vx*step;o.y+=o.vy*step;if(o.y<-.2){o.y=1.2;o.x=Math.random()}if(o.x<-.2)o.x=1.2;if(o.x>1.2)o.x=-.2;const R=o.r*M*(.85+.15*Math.sin(t*.0012+o.ph));x.globalAlpha=.55+.35*Math.sin(t*.0008+o.ph);x.drawImage(orbSprite(o.c),o.x*W-R,o.y*H-R,R*2,R*2)}
 /* twinkling stars */for(let i=0;i<18;i++){const a=Math.max(0,Math.sin(t*.0015+i*1.7));x.globalAlpha=a*.9;x.fillStyle='#fff';const sx=((i*.6180339)%1)*W,sy=((i*.3819)%1)*H,s=.6+a*1.2;x.fillRect(sx-s/2,sy-s/2,s,s)}x.restore();x.globalAlpha=1;
 if(Q===0)bgStatic=true}
/* ---------- overlay effects canvas: flying coins + confetti (only drawn while something is moving) ---------- */
const fxc=document.getElementById('fxc'),fxx=fxc.getContext('2d');let FXW=0,FXH=0,FXD=1,fxDirty=false,FXX=0,FXY=0,FXmode='';const coins=[],conf=[];
/* the overlay is kept as small as possible (1x pixels; only the stats+board area while playing) so it is cheap to update */
function fxResize(W,H){FXmode='';FXW=W;FXH=H;fxArea(conf.length?'full':'play')}
function fxArea(m){if(m===FXmode)return;FXmode=m;let x=0,y=0,w=LW||innerWidth,h=LH||innerHeight;
 if(m==='play'){const a=document.getElementById('top').getBoundingClientRect(),b=document.getElementById('wrap').getBoundingClientRect();if(b.width){x=Math.max(0,Math.floor(Math.min(a.left,b.left))-30);y=Math.max(0,Math.floor(Math.min(a.top,b.top))-30);w=Math.min(w-x,Math.ceil(Math.max(a.right,b.right))+30-x);h=Math.min(h-y,Math.ceil(Math.max(a.bottom,b.bottom))+30-y)}}
 FXX=x;FXY=y;fxc.style.left=x+'px';fxc.style.top=y+'px';fxc.width=Math.max(1,Math.round(w));fxc.height=Math.max(1,Math.round(h));fxc.style.width=w+'px';fxc.style.height=h+'px';fxDirty=coins.length>0||conf.length>0}
/* coins fly from a board spot (board px) to the Score box */
function spawnCoins(bx,by,n){const cap=Q>=2?28:Q===1?14:6;const r=cv.getBoundingClientRect(),s=document.getElementById('s2').getBoundingClientRect();if(!r.width)return;
 const sx=r.left+bx*(r.width/BS),sy=r.top+by*(r.height/BS),tx=s.left+s.width/2,ty=s.top+s.height/2;
 for(let i=0;i<n&&coins.length<cap;i++){const a=Math.random()*6.283,sp=20+Math.random()*30;coins.push({x0:sx+Math.cos(a)*sp*.3,y0:sy+Math.sin(a)*sp*.3,ox:Math.cos(a)*sp*1.6,oy:Math.sin(a)*sp*1.6-40,tx,ty,t:-i*55,d:620+Math.random()*180,sz:Math.max(22,cell*.5)})}fxDirty=true}
function confettiBurst(n){fxArea('full');if(RM)n=Math.ceil(n/3);n=Q>=2?n:Q===1?Math.ceil(n/2):Math.ceil(n/4);const C=['#ff4d6d','#ffd21a','#3ddc84','#3d8bff','#b44dff','#ff9f1c','#ffffff'];
 for(let i=0;i<n&&conf.length<160;i++)conf.push({x:Math.random()*FXW,y:-20-Math.random()*FXH*.6,vx:(Math.random()-.5)*.05,vy:.09+Math.random()*.12,w:8+Math.random()*8,h:5+Math.random()*6,a:Math.random()*6,va:(Math.random()-.5)*.012,f:Math.random()*6,c:C[i%C.length],t:0,life:3600+Math.random()*1400});
 /* and a fountain of coins from the middle */const m=Q>=2?14:Q===1?7:3;for(let i=0;i<m&&coins.length<40;i++){const a=-Math.PI/2+(Math.random()-.5)*1.6;coins.push({fall:1,x0:FXW/2,y0:FXH*.42,vx:Math.cos(a)*(.25+Math.random()*.3),vy:Math.sin(a)*(.45+Math.random()*.35),t:-i*40,d:1700,sz:28})}fxDirty=true}
function bumpScore(){const e=document.getElementById('s2').parentNode;e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}
function drawFX(t,dt){if(!fxDirty)return;const x=fxx;x.setTransform(1,0,0,1,-FXX,-FXY);x.clearRect(FXX,FXY,fxc.width,fxc.height);
 for(let i=conf.length-1;i>=0;i--){const p=conf[i];p.t+=dt;if(p.t>p.life||p.y>FXH+30){conf.splice(i,1);continue}p.x+=(p.vx+Math.sin(p.t*.004+p.f)*.03)*dt;p.y+=p.vy*dt;p.a+=p.va*dt;
  x.save();x.translate(p.x,p.y);x.rotate(p.a);x.scale(Math.cos(p.t*.008+p.f),1);x.globalAlpha=Math.min(1,(p.life-p.t)/500);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()}
 let hit=0;for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.t+=dt;if(c.t<0)continue;const p=Math.min(1,c.t/c.d);let X,Y,s=c.sz,al=1;
  if(c.fall){X=c.x0+c.vx*c.t;Y=c.y0+c.vy*c.t+.0006*c.t*c.t;al=Math.min(1,(c.d-c.t)/400);if(p>=1){coins.splice(i,1);continue}}
  else{const e=p*p*(3-2*p),u=1-e;/* curve: burst out, then swoop to the score */X=u*u*c.x0+2*u*e*(c.x0+c.ox)+e*e*c.tx;Y=u*u*c.y0+2*u*e*(c.y0+c.oy)+e*e*c.ty;s=c.sz*(1-.35*e);if(p>=1){coins.splice(i,1);hit=1;continue}}
  const sp=coinSprite(48),k=Math.abs(Math.cos(c.t*.012));x.globalAlpha=al;x.drawImage(sp,X-s*k/2,Y-s/2,s*Math.max(.18,k),s)}
 x.globalAlpha=1;if(hit)bumpScore();if(!coins.length&&!conf.length){x.clearRect(FXX,FXY,fxc.width,fxc.height);fxDirty=false;if(FXmode==='full')fxArea('play')}}
/* ---------- big on-screen callouts (she is hard of hearing, so feedback is visual too) ---------- */
function callout(word,sub,tone){const el=document.getElementById('callout');el.innerHTML='<span class="w"></span>'+(sub?'<span class="s"></span>':'');el.firstChild.textContent=word;if(sub)el.lastChild.textContent=sub;
 el.className='';el.classList.add(tone||'gold');el.classList.add('go');const w=el.firstChild;let f=Math.min(48,Math.max(30,BS/7));w.style.fontSize=f+'px';while(w.scrollWidth>BS*.96&&f>22){f-=2;w.style.fontSize=f+'px'}el.classList.remove('go');void el.offsetWidth;el.classList.add('go');clearTimeout(callout.t);callout.t=setTimeout(()=>{el.className=''},1250)}
/* ---------- screen shake on big moments (off for reduce-motion) ---------- */
let SHK={a:0,t0:0};function shake(a){if(RM||Q===0)return;if(a>SHK.a*(1-(performance.now()-SHK.t0)/360))SHK={a,t0:performance.now()}}
function applyShake(t){const el=document.getElementById('wrap');const p=(t-SHK.t0)/360;if(SHK.a&&p<1){const k=SHK.a*(1-p);el.style.transform='translate('+((Math.random()-.5)*2*k).toFixed(1)+'px,'+((Math.random()-.5)*2*k).toFixed(1)+'px)'}else if(SHK.a){SHK.a=0;el.style.transform=''}}
