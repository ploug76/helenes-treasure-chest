import asyncio,json
from playwright.async_api import async_playwright
URL='http://127.0.0.1:18431/index.html'
BASE="(()=>{const a=[];for(let r=0;r<8;r++){a[r]=[];for(let c=0;c<8;c++)a[r][c]=(c+2*r)%6}return a})()"
async def scenario(pg,name,setup,swap,shot=None,wait=2600):
  await pg.evaluate(f"""(()=>{{NC=7;const C={BASE},S=[...Array(8)].map(()=>Array(8).fill(0));{setup};__htc.setBoard(C,S);window.__htcLog=[]}})()""")
  s0=await pg.evaluate('__htc.G.score')
  p=pg.evaluate(f"__htc.trySwap({{r:{swap[0]},c:{swap[1]}}},{{r:{swap[2]},c:{swap[3]}}})")
  if shot:
    await pg.wait_for_timeout(330);await pg.screenshot(path=shot)
  await p;await pg.wait_for_timeout(200)
  log=await pg.evaluate('window.__htcLog');s1=await pg.evaluate('__htc.G.score')
  sp=await pg.evaluate("__htc.B.flat().filter(g=>g.s).map(g=>g.s).join('')")
  print(f'{name}: score {s0}->{s1}; steps',json.dumps(log[:3]),'specials on board now:',sp or '-')
  return log
async def run():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for (w,h,tag) in [(412,915,'portrait'),(915,412,'landscape')]:
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2.625,is_mobile=True,has_touch=True)
      pg=await ctx.new_page();errs=[]
      pg.on('console',lambda m:errs.append(m.type+': '+m.text) if m.type in('error','warning') and 'icon' not in m.text else None)
      pg.on('pageerror',lambda e:errs.append('PAGEERROR '+str(e)))
      pg.on('requestfailed',lambda r:errs.append('REQFAIL '+r.url))
      pg.on('response',lambda r:errs.append('HTTP%d %s'%(r.status,r.url)) if r.status>=400 else None)
      await pg.goto(URL);await pg.wait_for_timeout(900)
      await pg.click('#zenBtn');await pg.wait_for_timeout(1300)
      print('=====',tag,await pg.evaluate('__htc.layoutInfo()'))
      L=await scenario(pg,'match-4 -> Line gem',"[[7,0],[7,1],[7,3],[6,2]].forEach(([r,c])=>C[r][c]=6)",(6,2,7,2),f'/workspace/htc-shots/{tag}-4-match4.png')
      assert L[0]['cre']==['h'],L
      L=await scenario(pg,'L shape -> Burst gem',"[[7,0],[7,1],[7,3],[5,2],[6,2]].forEach(([r,c])=>C[r][c]=6)",(7,2,7,3))
      assert L[0]['cre']==['b'],L
      L=await scenario(pg,'match-5 -> Treasure Star',"[[7,0],[7,1],[7,3],[7,4],[6,2]].forEach(([r,c])=>C[r][c]=6)",(6,2,7,2))
      assert L[0]['cre']==['x'],L
      L=await scenario(pg,'Line gem matched -> clears row',"[[7,0],[7,1],[6,2]].forEach(([r,c])=>C[r][c]=6);S[7][1]='h'",(6,2,7,2),f'/workspace/htc-shots/{tag}-5-lineblast.png')
      assert 'h' in L[0]['fx'] and L[0]['n']>=8,L
      L=await scenario(pg,'Burst gem matched -> 3x3',"[[4,0],[4,1],[3,2]].forEach(([r,c])=>C[r][c]=6);S[4][1]='b'",(3,2,4,2),f'/workspace/htc-shots/{tag}-6-burst.png')
      assert 'b' in L[0]['fx'] and L[0]['n']>=9,L
      L=await scenario(pg,'Treasure Star swapped with a gem',"C[3][3]=-1;S[3][3]='x'",(3,3,3,4),f'/workspace/htc-shots/{tag}-7-star.png')
      assert 'x' in L[0]['fx'] and L[0]['n']>=9,L
      L=await scenario(pg,'Line + Line swap -> cross',"S[2][2]='h';S[2][3]='v'",(2,2,2,3))
      assert 'h' in L[0]['fx'] and 'v' in L[0]['fx'] and L[0]['n']>=15,L
      L=await scenario(pg,'Star + Star -> whole board',"C[2][2]=-1;S[2][2]='x';C[2][3]=-1;S[2][3]='x'",(2,2,2,3))
      assert L[0]['n']==64,L
      # invalid swap bounce on base board (no moves at all) -> moves unchanged, no score
      await pg.evaluate(f"(()=>{{__htc.setBoard({BASE});window.__htcLog=[]}})()");s0=await pg.evaluate('__htc.G.score')
      await pg.evaluate("__htc.trySwap({r:0,c:0},{r:0,c:1})");print('invalid swap: score unchanged',s0==await pg.evaluate('__htc.G.score'),'log empty',await pg.evaluate('window.__htcLog.length==0'))
      # reshuffle: no-move board then settle
      await pg.evaluate(f"__htc.setBoard({BASE})");print('moves before',await pg.evaluate('allMoves(__htc.B).length'))
      sp=pg.evaluate('__htc.settle()');await pg.wait_for_timeout(450);await pg.screenshot(path=f'/workspace/htc-shots/{tag}-8-shuffle.png');await sp;await pg.wait_for_timeout(300)
      print('reshuffle: moves after',await pg.evaluate('allMoves(__htc.B).length'),'matches after',await pg.evaluate('findGroups(__htc.B).length'))
      # cascades: random play 12 moves, count combos
      combos=0;n=0
      for i in range(12):
        await pg.evaluate("window.__htcLog=[]");mv=await pg.evaluate('__htc.findMove()')
        await pg.evaluate(f"__htc.trySwap({json.dumps(mv[0])},{json.dumps(mv[1])})")
        lg=await pg.evaluate('window.__htcLog');n+=1;combos=max(combos,max(x['combo'] for x in lg))
        assert await pg.evaluate('findGroups(__htc.B).length')==0
      print('random play 12 moves: biggest cascade combo',combos,'board settled ok')
      # zen level up
      await pg.evaluate('__htc.G.units=__htc.G.goal-1');mv=await pg.evaluate('__htc.findMove()');await pg.evaluate(f"__htc.trySwap({json.dumps(mv[0])},{json.dumps(mv[1])})")
      print('zen level now',await pg.evaluate('__htc.G.level'),'state',await pg.evaluate('__htc.state'))
      # classic: level up
      await pg.click('#pauseBtn');await pg.wait_for_timeout(300);await pg.screenshot(path=f'/workspace/htc-shots/{tag}-9-pause.png');await pg.click('#menuBtn');await pg.wait_for_timeout(400)
      await pg.screenshot(path=f'/workspace/htc-shots/{tag}-10-title-continue.png')
      pg.on('dialog',lambda d:asyncio.ensure_future(d.accept()))
      await pg.click('#classicBtn');await pg.wait_for_timeout(1200)
      await pg.evaluate('__htc.G.units=__htc.G.goal-1');mv=await pg.evaluate('__htc.findMove()');await pg.evaluate(f"__htc.trySwap({json.dumps(mv[0])},{json.dumps(mv[1])})")
      await pg.wait_for_timeout(400);print('classic after goal: state',await pg.evaluate('__htc.state'),'level',await pg.evaluate('__htc.G.level'))
      await pg.screenshot(path=f'/workspace/htc-shots/{tag}-11-levelup.png')
      await pg.click('#nextBtn');await pg.wait_for_timeout(1300);await pg.screenshot(path=f'/workspace/htc-shots/{tag}-12-level2.png')
      # out of moves
      await pg.evaluate('__htc.G.moves=1');mv=await pg.evaluate('__htc.findMove()');await pg.evaluate(f"__htc.trySwap({json.dumps(mv[0])},{json.dumps(mv[1])})")
      await pg.wait_for_timeout(1500);print('out of moves: state',await pg.evaluate('__htc.state'),'lb panel open',await pg.evaluate('!!(window.PALB&&PALB.isOpen())'))
      await pg.screenshot(path=f'/workspace/htc-shots/{tag}-13-over.png')
      await pg.evaluate('PALB.close()');await pg.click('#againBtn');await pg.wait_for_timeout(900);print('retry: level',await pg.evaluate('__htc.G.level'),'moves',await pg.evaluate('__htc.G.moves'),'state',await pg.evaluate('__htc.state'))
      # how to play
      await pg.click('#pauseBtn');await pg.click('#pHowBtn');await pg.wait_for_timeout(300);await pg.screenshot(path=f'/workspace/htc-shots/{tag}-14-howto.png');await pg.click('#howClose');await pg.click('#menuBtn')
      # rush
      await pg.click('#rushBtn');await pg.wait_for_timeout(1500);await pg.screenshot(path=f'/workspace/htc-shots/{tag}-15-rush.png')
      await pg.evaluate('__htc.G.time=0.5');await pg.wait_for_timeout(1500);print('rush timeout: state',await pg.evaluate('__htc.state'))
      await pg.evaluate('PALB.isOpen()&&PALB.close()')
      # saved progress persisted
      print('saved:',await pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('htc_save_v1')))"),await pg.evaluate("JSON.parse(localStorage.getItem('htc_save_v1')).best"))
      print(tag,'ERRORS:',errs)
      await ctx.close()
    await b.close()
asyncio.run(run())
