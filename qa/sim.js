const L=require('../logic.js');
function play(nc,moves){L.setNC(nc);let B=L.newBoard(),units=0,sp={h:0,v:0,b:0,x:0},shuf=0;
 for(let m=0;m<moves;m++){let mv=L.findMove(B);if(!mv){L.shuffleBoard(B);shuf++;mv=L.findMove(B)}const[a,b]=mv;
  L.swapCells(B,a,b);const pre=L.swapPre(B,b,a);let combo=0,p=pre,pref=[L.K(a.r,a.c),L.K(b.r,b.c)];
  for(let i=0;i<100;i++){const st=L.computeStep(B,pref,p);p=null;pref=[];if(!st)break;combo++;units+=st.clear.size*combo;st.cre.forEach(c=>sp[c.s]++);L.applyClear(B,st);L.applyGravity(B)}
  if(combo===0)throw 'invalid move';if(L.findGroups(B).length)throw 'unsettled'}
 return{units,sp,shuf}}
for(const nc of [6,7]){const R=[];let S={h:0,v:0,b:0,x:0},sh=0;for(let i=0;i<300;i++){const r=play(nc,30);R.push(r.units);for(const k in S)S[k]+=r.sp[k];sh+=r.shuf}R.sort((a,b)=>a-b);
 console.log('NC',nc,'30 moves units: p10',R[30],'p50',R[150],'p90',R[270],'specials/game',JSON.stringify(Object.fromEntries(Object.entries(S).map(([k,v])=>[k,(v/300).toFixed(1)]))),'shuffles/game',(sh/300).toFixed(2))}
