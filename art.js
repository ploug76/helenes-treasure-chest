/* ===== Helene's Treasure Chest: original procedural art (no image files) ===== */
const GEM_NAMES=['Ruby','Topaz','Citrine','Emerald','Sapphire','Amethyst','Pearl'];
const PAL=[['#ffb3bf','#e8213f','#6e0416'],['#ffd7a6','#ff8a1a','#7a3200'],['#fffbb8','#ffd21a','#8a6500'],['#b6ffc6','#1cc552','#04501b'],['#b8dcff','#2b7bff','#0a2477'],['#f3c2ff','#b043f2','#45086a'],['#ffffff','#efe6f6','#9b8aad']];
function poly(n,rot,rx,ry){const p=[];for(let i=0;i<n;i++){const a=rot+i*2*Math.PI/n;p.push([Math.cos(a)*rx,Math.sin(a)*(ry||rx)])}return p}
function SHAPES(i){switch(i){
 case 0:{const p=[];for(let k=0;k<16;k++){const a=k/16*2*Math.PI,X=16*Math.pow(Math.sin(a),3),Y=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a));p.push([X/17*.98,(Y+2.5)/17*.98])}return p}/* v9: Ruby is a heart so it never looks like the round Pearl */
 case 1:return poly(6,-Math.PI/2,.95,.95);
 case 2:return[[0,-.98],[.78,0],[0,.98],[-.78,0]];
 case 3:{const a=.86,b=.62,c=.5;return[[-c,-a],[c,-a],[b+.24,-c+.08],[b+.24,c-.08],[c,a],[-c,a],[-b-.24,c-.08],[-b-.24,-c+.08]]}
 case 4:return[[0,-.95],[.95,.72],[-.95,.72]].map(([x,y])=>[x,y+.06]);
 case 5:return poly(5,-Math.PI/2,.97);
 default:return null}}
function mix(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const r=((A>>16)*(1-t)+(B>>16)*t)|0,g=(((A>>8)&255)*(1-t)+((B>>8)&255)*t)|0,bl=((A&255)*(1-t)+(B&255)*t)|0;return'rgb('+r+','+g+','+bl+')'}
function star4(x,cx,cy,r,w){x.beginPath();x.moveTo(cx,cy-r);x.quadraticCurveTo(cx+w,cy-w,cx+r,cy);x.quadraticCurveTo(cx+w,cy+w,cx,cy+r);x.quadraticCurveTo(cx-w,cy+w,cx-r,cy);x.quadraticCurveTo(cx-w,cy-w,cx,cy-r);x.fill()}
/* draws gem i centred at (cx,cy) with radius R */
function drawGemShape(x,i,cx,cy,R,noHalo){const [L,M,D]=PAL[i];x.save();x.translate(cx,cy);
 if(!noHalo){const hg=x.createRadialGradient(0,0,R*.55,0,0,R*1.12);hg.addColorStop(0,M+'80');hg.addColorStop(1,M+'00');x.fillStyle=hg;x.beginPath();x.arc(0,0,R*1.12,0,7);x.fill()}
 x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(R*.06,R*.9,R*.7,R*.16,0,0,7);x.fill();
 const P=SHAPES(i);
 if(!P){/* pearl */const g=x.createRadialGradient(-R*.35,-R*.4,R*.05,0,0,R*.95);g.addColorStop(0,'#ffffff');g.addColorStop(.45,'#f6eefb');g.addColorStop(.8,'#d8c8e6');g.addColorStop(1,'#a690bb');
  x.fillStyle=g;x.beginPath();x.arc(0,0,R*.86,0,7);x.fill();x.lineWidth=Math.max(1,R*.06);x.strokeStyle='#7d6a92';x.stroke();
  const h=x.createRadialGradient(R*.3,R*.35,0,R*.3,R*.35,R*.5);h.addColorStop(0,'rgba(255,190,230,.55)');h.addColorStop(1,'rgba(255,190,230,0)');x.fillStyle=h;x.beginPath();x.arc(0,0,R*.86,0,7);x.fill();
  x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.ellipse(-R*.3,-R*.38,R*.2,R*.12,-.6,0,7);x.fill();x.fillStyle='rgba(255,255,255,.9)';star4(x,-R*.3,-R*.38,R*.26,R*.04);x.restore();return}
 const o=P.map(([a,b])=>[a*R,b*R]),inn=P.map(([a,b])=>[a*R*.52-R*.05,b*R*.52-R*.07]);
 const g=x.createLinearGradient(-R,-R,R,R);g.addColorStop(0,L);g.addColorStop(.5,M);g.addColorStop(1,D);
 x.beginPath();o.forEach((p,j)=>j?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle=g;x.fill();
 for(let j=0;j<o.length;j++){const a=o[j],b=o[(j+1)%o.length],c=inn[(j+1)%o.length],d=inn[j];
  const nx=(a[1]+b[1])/2,ny=-(a[0]+b[0])/2;/* not used directly */const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,len=Math.hypot(mx,my)||1;const lit=(-mx/len*.7-my/len*.7+1)/2;
  x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.lineTo(c[0],c[1]);x.lineTo(d[0],d[1]);x.closePath();x.fillStyle=lit>.5?mix(M,L,(lit-.5)*1.6):mix(D,M,lit*1.7);x.fill();
  if(i){x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=Math.max(.5,R*.02);x.stroke()}}
 const t=x.createLinearGradient(-R*.5,-R*.6,R*.4,R*.4);t.addColorStop(0,L);t.addColorStop(1,M);
 x.beginPath();inn.forEach((p,j)=>j?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle=t;x.fill();
 x.beginPath();o.forEach((p,j)=>j?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.lineJoin='round';x.lineWidth=Math.max(1,R*.07);x.strokeStyle=D;x.stroke();
 {const rg=x.createLinearGradient(0,R*.2,0,R);rg.addColorStop(0,'rgba(255,255,255,0)');rg.addColorStop(1,'rgba(255,255,255,.28)');x.save();x.beginPath();o.forEach((p,j)=>j?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.clip();x.fillStyle=rg;x.fillRect(-R,R*.2,R*2,R);x.restore()}
 x.beginPath();o.forEach((p,j)=>j?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.lineWidth=Math.max(.6,R*.03);x.strokeStyle='rgba(255,255,255,.55)';x.stroke();
 x.fillStyle='rgba(255,255,255,.95)';star4(x,-R*.32,-R*.36,R*.3,R*.045);x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.ellipse(-R*.1,-R*.2,R*.16,R*.07,-.6,0,7);x.fill();
 x.restore()}
const SPR={};
function gemSprite(i,px){const k=i+':'+px;if(SPR[k])return SPR[k];const c=document.createElement('canvas');c.width=c.height=px;drawGemShape(c.getContext('2d'),i,px/2,px/2,px*.445);return SPR[k]=c}
function clearSprites(){for(const k in SPR)delete SPR[k]}
/* Treasure Star (colour bomb) */
function drawStarGem(x,cx,cy,R,t){x.save();x.translate(cx,cy);
 const gl=x.createRadialGradient(0,0,R*.3,0,0,R*1.1);gl.addColorStop(0,'rgba(255,255,255,.6)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.beginPath();x.arc(0,0,R*1.1,0,7);x.fill();
 x.rotate(t*.0012);let g;if(x.createConicGradient){g=x.createConicGradient(0,0,0);['#ff4d6d','#ff9f1c','#ffe14a','#3ddc84','#3d8bff','#b44dff','#ff4d6d'].forEach((c,i)=>g.addColorStop(i/6,c))}else{g=x.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,'#fff');g.addColorStop(1,'#b44dff')}
 x.fillStyle=g;x.beginPath();x.arc(0,0,R*.8,0,7);x.fill();x.lineWidth=Math.max(1,R*.08);x.strokeStyle='#fff';x.stroke();
 x.fillStyle='#fff';x.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?R*.26:R*.62;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.fill();
 x.strokeStyle='rgba(120,60,0,.5)';x.lineWidth=Math.max(1,R*.03);x.stroke();x.restore()}
function drawSpecialOver(x,g,cx,cy,cell,t){const R=cell*.43,p=.5+.5*Math.sin(t*.006+g.id);
 if(g.s==='h'||g.s==='v'){x.save();x.translate(cx,cy);if(g.s==='v')x.rotate(Math.PI/2);
  x.globalAlpha=.55+.35*p;x.fillStyle='#fff';x.fillRect(-R*.95,-R*.11,R*1.9,R*.22);
  x.globalAlpha=1;x.lineWidth=Math.max(1,R*.06);x.strokeStyle='#3a1650';
  for(const s of[-1,1]){x.beginPath();x.moveTo(s*R*1.02,0);x.lineTo(s*R*.62,-R*.3);x.lineTo(s*R*.62,R*.3);x.closePath();x.fillStyle='#fff';x.fill();x.stroke()}
  x.restore()}
 else if(g.s==='b'){x.save();x.translate(cx,cy);x.rotate(t*.002);x.fillStyle='#fff6b0';for(let i=0;i<6;i++){const a=i*Math.PI/3;star4(x,Math.cos(a)*R*.98,Math.sin(a)*R*.98,R*(.16+.08*p),R*.03)}x.restore()}}
function drawSpecialUnder(x,g,cx,cy,cell,t){if(g.s!=='b')return;const R=cell*.5,p=.5+.5*Math.sin(t*.008+g.id);const gl=x.createRadialGradient(cx,cy,R*.2,cx,cy,R);gl.addColorStop(0,'rgba(255,200,60,'+(.75*p+.25)+')');gl.addColorStop(1,'rgba(255,120,0,0)');x.fillStyle=gl;x.fillRect(cx-R,cy-R,R*2,R*2)}
/* treasure chest drawn in a w x h box. op = how open the lid is (0 closed .. 1 open); rays = sunburst behind */
function drawChest(x,w,h,t,op,rays){if(op==null)op=1;x.save();const cx=w/2,bw=Math.min(w*.8,h*1.35),bh=bw*.42,by=h*.95-bh,lx=cx-bw/2;
 const oa=Math.max(0,Math.min(1,(op-.3)/.7));
 if(rays&&oa>0){x.save();x.translate(cx,by-bh*.2);x.rotate(t*.00035);x.globalAlpha=oa*.9;const L=Math.max(w,h);for(let i=0;i<12;i++){x.fillStyle=i%2?'rgba(255,225,130,.22)':'rgba(255,170,220,.16)';x.beginPath();x.moveTo(0,0);x.arc(0,0,L,i*Math.PI/6,i*Math.PI/6+Math.PI/12);x.closePath();x.fill()}x.restore()}
 const glow=x.createRadialGradient(cx,by,bw*.05,cx,by,bw*.7);glow.addColorStop(0,'rgba(255,230,140,'+(.25+.65*oa)+')');glow.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=glow;x.fillRect(0,0,w,h);
 const lidPath=()=>{x.beginPath();x.moveTo(lx+bw*.04,by);x.lineTo(lx+bw*.1,by-bh*.95);x.quadraticCurveTo(cx,by-bh*1.35,lx+bw*.9,by-bh*.95);x.lineTo(lx+bw*.96,by);x.closePath()};
 if(op>.45){const k=(op-.45)/.55;x.save();x.translate(0,by);x.scale(1,k);x.translate(0,-by);
  x.fillStyle='#6b3410';lidPath();x.fill();
  x.fillStyle='#3a1a06';x.beginPath();x.moveTo(lx+bw*.1,by-bh*.08);x.lineTo(lx+bw*.15,by-bh*.82);x.quadraticCurveTo(cx,by-bh*1.15,lx+bw*.85,by-bh*.82);x.lineTo(lx+bw*.9,by-bh*.08);x.closePath();x.fill();
  x.strokeStyle='#f4c34d';x.lineWidth=bw*.025;lidPath();x.stroke();x.restore()}
 if(oa>0){/* gem pile rises as the lid opens */const pile=[[.2,0,0,.13],[.35,-.12,3,.14],[.5,-.2,6,.15],[.65,-.1,4,.14],[.8,0,1,.13],[.28,.02,5,.12],[.44,-.03,2,.13],[.58,-.04,0,.13],[.72,.02,3,.12],[.5,.0,5,.12]];
  x.save();x.beginPath();x.rect(0,0,w,by+bh*.2);x.clip();const rise=(1-oa)*bh*.5;for(const [px,py,i,s] of pile)drawGemShape(x,i,lx+bw*px,by+rise+bh*py*1.2,bw*s*.5,1);x.restore()}
 /* box */const bg=x.createLinearGradient(0,by,0,by+bh);bg.addColorStop(0,'#a95e24');bg.addColorStop(1,'#5a2a0a');x.fillStyle=bg;x.beginPath();x.roundRect?x.roundRect(lx,by,bw,bh,bw*.03):x.rect(lx,by,bw,bh);x.fill();
 x.strokeStyle='rgba(40,15,0,.45)';x.lineWidth=bw*.008;for(let i=1;i<4;i++){x.beginPath();x.moveTo(lx,by+bh*i/4);x.lineTo(lx+bw,by+bh*i/4);x.stroke()}
 const gg=x.createLinearGradient(0,by,0,by+bh);gg.addColorStop(0,'#fff0a0');gg.addColorStop(.5,'#f4c34d');gg.addColorStop(1,'#b97d12');x.fillStyle=gg;
 x.fillRect(lx,by,bw,bh*.1);x.fillRect(lx,by+bh*.9,bw,bh*.1);x.fillRect(lx+bw*.12,by,bw*.06,bh);x.fillRect(lx+bw*.82,by,bw*.06,bh);
 x.fillStyle='#ffe58a';x.beginPath();x.roundRect?x.roundRect(cx-bw*.07,by+bh*.25,bw*.14,bh*.42,bw*.02):x.rect(cx-bw*.07,by+bh*.25,bw*.14,bh*.42);x.fill();x.fillStyle='#5a2a0a';x.beginPath();x.arc(cx,by+bh*.42,bw*.022,0,7);x.fill();x.fillRect(cx-bw*.009,by+bh*.42,bw*.018,bh*.14);
 if(op<.45){/* closed lid, folding back as it opens */const k=1-op/.45,lh=bh*.55*k;x.save();
  const lg=x.createLinearGradient(0,by-lh,0,by);lg.addColorStop(0,'#b86a2c');lg.addColorStop(1,'#6b3410');x.fillStyle=lg;
  x.beginPath();x.moveTo(lx-bw*.01,by+bh*.02);x.lineTo(lx-bw*.01,by-lh*.45);x.quadraticCurveTo(cx,by-lh*1.55,lx+bw*1.01,by-lh*.45);x.lineTo(lx+bw*1.01,by+bh*.02);x.closePath();x.fill();
  x.strokeStyle='#f4c34d';x.lineWidth=bw*.03;x.stroke();x.fillStyle=gg;x.fillRect(lx+bw*.12,by-lh*.95,bw*.06,lh*.95+bh*.02);x.fillRect(lx+bw*.82,by-lh*.95,bw*.06,lh*.95+bh*.02);
  x.fillStyle='#ffe58a';x.beginPath();x.roundRect?x.roundRect(cx-bw*.07,by-lh*.3,bw*.14,lh*.3+bh*.45,bw*.02):x.rect(cx-bw*.07,by-lh*.3,bw*.14,lh*.3+bh*.45);x.fill();x.fillStyle='#5a2a0a';x.beginPath();x.arc(cx,by+bh*.1,bw*.024,0,7);x.fill();x.fillRect(cx-bw*.009,by+bh*.1,bw*.018,bh*.14);x.restore()}
 /* sparkles */for(let i=0;i<9;i++){const ph=(t*.0011+i*.37)%1,a=Math.sin(ph*Math.PI)*Math.max(.25,oa);const sx=lx+bw*(.12+.76*((i*.618)%1)),sy=by-bh*(.25+.9*((i*.41)%1));x.fillStyle='rgba(255,255,255,'+a+')';star4(x,sx,sy,bw*.035*(.5+a),bw*.006)}
 x.restore()}
/* gold coin (cached) */
const CSPR={};function coinSprite(px){if(CSPR[px])return CSPR[px];const c=document.createElement('canvas');c.width=c.height=px;const x=c.getContext('2d'),r=px*.46,m=px/2;
 const g=x.createRadialGradient(m-r*.35,m-r*.4,r*.1,m,m,r);g.addColorStop(0,'#fff7c2');g.addColorStop(.5,'#ffd43b');g.addColorStop(1,'#c47f00');x.fillStyle=g;x.beginPath();x.arc(m,m,r,0,7);x.fill();
 x.lineWidth=px*.06;x.strokeStyle='#8a5200';x.stroke();x.lineWidth=px*.035;x.strokeStyle='rgba(255,240,170,.9)';x.beginPath();x.arc(m,m,r*.72,0,7);x.stroke();
 x.fillStyle='#b87100';x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.22:r*.5;x.lineTo(m+Math.cos(a)*rr,m+Math.sin(a)*rr)}x.closePath();x.fill();
 x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.ellipse(m-r*.38,m-r*.45,r*.22,r*.12,-.7,0,7);x.fill();return CSPR[px]=c}
/* soft glow blob in a gem colour (cached), for match flashes */
const GSPR={};function glowSprite(i){const k=i;if(GSPR[k])return GSPR[k];const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const col=i>=0?PAL[i]:['#ffffff','#fff3b0','#ffd21a'];
 const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.25,col[0]);g.addColorStop(.6,col[1]+'66');g.addColorStop(1,col[1]+'00');x.fillStyle=g;x.fillRect(0,0,64,64);return GSPR[k]=c}
