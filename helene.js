/* Helene cheers you on: her caricature sits beside the board (in free space only, never over the jewels),
   bounces and says something kind on every GREAT!/COMBO callout and when a level is complete. */
(()=>{const $=id=>document.getElementById(id),app=$('app');if(!app)return;
const st=document.createElement('style');st.textContent=`
#helBud{position:absolute;z-index:12;pointer-events:none;display:none;align-items:flex-end;gap:6px}
#helBud img{display:block;height:100%;width:auto;filter:drop-shadow(0 4px 6px rgba(0,0,0,.55));transform-origin:50% 100%;animation:hbIdle 3.2s ease-in-out infinite}
#helBud.face .hb{font-size:17px;padding:5px 10px;white-space:nowrap}
#helBud.cheer img{animation:hbCheer .7s cubic-bezier(.2,1.6,.4,1) 2}
#helBud .hb{align-self:center;max-width:170px;padding:8px 12px;border-radius:18px;background:#fffaf0;border:3px solid #f4c34d;color:#4a1767;font:800 19px/1.15 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 3px 0 #6b3a00;opacity:0;transform:scale(.6);transition:opacity .2s,transform .25s cubic-bezier(.2,1.6,.4,1);position:relative}
#helBud .hb::before{content:"";position:absolute;left:-11px;top:50%;margin-top:-8px;border:8px solid transparent;border-right:10px solid #f4c34d;border-left:0}
#helBud.say .hb{opacity:1;transform:scale(1)}
@keyframes hbIdle{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3px) rotate(-1.5deg)}}
@keyframes hbCheer{0%{transform:translateY(0) scale(1)}40%{transform:translateY(-14px) scale(1.06) rotate(-4deg)}100%{transform:translateY(0) scale(1)}}
html.q0 #helBud img{animation:none!important}
@media (prefers-reduced-motion:reduce){#helBud img{animation:none!important}}
#lvlH::before,#ttl .a::before{content:"";display:inline-block;width:1.9em;height:1.9em;margin-right:.3em;vertical-align:middle;background:url(helene-face.png) center/contain no-repeat;filter:none}
#ttl .a::before{width:2.2em;height:2.2em}`;document.head.appendChild(st);
const el=document.createElement('div');el.id='helBud';el.setAttribute('aria-hidden','true');
el.innerHTML='<div class="hb"></div>';const im=new Image();im.src='helene.png';im.alt='';im.width=215;im.height=380;el.insertBefore(im,el.firstChild);
const fx=$('fxc');app.insertBefore(el,fx||null);
const R=e=>e.getBoundingClientRect(),tt=$('titleOv');let key='';
function place(){const ctl=$('ctl'),top=$('top'),wrap=$('wrap');if(!ctl||!wrap)return;const A=R(app),c=R(ctl),t=R(top),w=R(wrap);
 const land=app.classList.contains('land'),H=A.height,W=A.width;let x0,x1,y0,y1;
 if(tt&&tt.classList.contains('on')){el.style.display='none';key='title';return}
 const below=[land?c.left:0,land?c.right:W,c.bottom+6,H-8],mid=[t.left,t.right,t.bottom+6,c.top-6],above=[land?t.left:0,land?t.right:W,8,t.top-6];
 const C=land?[mid,below,above]:[below,above];const pick=C.find(b=>b[3]-b[2]>=84)||C.find(b=>b[3]-b[2]>=40);
 const k=pick?pick.map(Math.round).join(','):'none';if(k===key)return;key=k;
 if(!pick){el.style.display='none';return}
 [x0,x1,y0,y1]=pick;const face=y1-y0<84,h=Math.round(Math.min(y1-y0,face?64:190)),iw=face?h:Math.round(h*215/380),bw=Math.min(face?150:170,Math.max(0,x1-x0-iw-24));
 const src=face?'helene-face.png':'helene.png';if(!im.src.endsWith(src))im.src=src;el.classList.toggle('face',face);
 el.style.display='flex';el.style.height=h+'px';el.style.top=Math.round(y0+(y1-y0-h)/2)+'px';
 el.querySelector('.hb').style.display=bw>=90?'':'none';el.querySelector('.hb').style.maxWidth=bw+'px';
 const tw=iw+(bw>=90?bw+6:0);el.style.left=Math.round(x0+Math.max(0,(x1-x0-tw)/2))+'px'}
const LINES=['Wonderful!','Ooh, sparkly!','Beautiful!','Look at that!','Keep it up!','What a treasure!','Lovely match!','You\u2019re a natural!','So pretty!'];
let tS,tC,last=-1;
function say(msg,ms){const b=el.querySelector('.hb');b.textContent=msg;el.classList.add('say');clearTimeout(tS);tS=setTimeout(()=>el.classList.remove('say'),ms||1700);
 el.classList.remove('cheer');void el.offsetWidth;el.classList.add('cheer');clearTimeout(tC);tC=setTimeout(()=>el.classList.remove('cheer'),1500)}
function pickLine(){let i;do{i=Math.floor(Math.random()*LINES.length)}while(i===last&&LINES.length>1);last=i;return LINES[i]}
const orig=window.callout;if(typeof orig==='function'){window.callout=function(w,s,tn){const r=orig.apply(this,arguments);try{say(s&&/COMBO/i.test(s)?'Wow, a combo!':pickLine())}catch(e){}return r}}
const lv=$('lvlOv');let wasLv=false,wasT=true;
new MutationObserver(()=>{const on=lv.classList.contains('on');if(on&&!wasLv)say('You filled my chest!',2600);let z='';if(on){const cd=lv.querySelector('.card');if(cd){const a=R(cd),b=R(el);if(!(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom))z='21'}}el.style.zIndex=z;wasLv=on}).observe(lv,{attributes:true,attributeFilter:['class']});
if(tt)new MutationObserver(()=>{const on=tt.classList.contains('on');key='';place();if(!on&&wasT){setTimeout(()=>say('Let\u2019s find some treasure!',2200),500)}wasT=on}).observe(tt,{attributes:true,attributeFilter:['class']});
const rp=()=>{key='';place()};addEventListener('resize',()=>setTimeout(rp,60));addEventListener('orientationchange',()=>[120,400,900].forEach(t=>setTimeout(rp,t)));
if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(rp,60));
setInterval(place,1000);setTimeout(rp,50);
window.HELENE={say,place:rp};
})();
