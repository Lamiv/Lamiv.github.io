// Dashboards read this key, so embedded samples match the page.
try{localStorage.setItem('theme','dark')}catch(e){}
document.querySelectorAll('iframe').forEach(function(f){
  f.addEventListener('load',function(){try{f.contentWindow.postMessage({type:'portfolioTheme',dark:true},'*')}catch(e){}});
});

// GitHub activity, from the snapshot written by scripts/update_stats.py.
(function(){
  var s=window.GH_STATS,box=document.getElementById('gh');if(!s||!box)return;
  document.getElementById('gh-total').textContent=s.lastYear;
  document.getElementById('gh-updated').textContent='Updated '+s.updated+'.';
  var top=Math.max.apply(null,s.years.map(function(y){return y[1]}))||1,years=document.getElementById('gh-years');
  s.years.forEach(function(y){
    var c=document.createElement('div'),n=document.createElement('b'),b=document.createElement('i'),l=document.createElement('span');
    n.textContent=y[1];l.textContent="'"+String(y[0]).slice(2);
    b.style.setProperty('--h',(y[1]/top*140)+'px');
    c.appendChild(n);c.appendChild(b);c.appendChild(l);years.appendChild(c);
  });
  box.hidden=false;
})();

// Hero: ledger cells on the left feed an agent graph on the right.
(function(){
  var c=document.getElementById('process');if(!c)return;
  var x=c.getContext('2d'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var css=getComputedStyle(document.documentElement);
  function tok(n){return css.getPropertyValue(n).trim()}
  var col={line:tok('--line'),mist:tok('--mist'),sodium:tok('--sodium'),crystal:tok('--crystal')};
  var W,H,cells=[],nodes=[],edges=[],pulses=[],mouse=null,start=performance.now();
  var hubs=[['Tools',.60,.30],['Agents',.73,.56],['Knowledge',.86,.30],['Governance',.90,.76]];
  function seeded(i){var s=Math.sin(i*12.9898)*43758.5453;return s-Math.floor(s)}
  function spawn(){return{e:Math.floor(Math.random()*edges.length),t:Math.random(),v:.006+Math.random()*.012,feed:Math.random()<.3,row:Math.random()}}
  function build(){
    var r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
    W=r.width;H=r.height;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    cells=[];nodes=[];edges=[];pulses=[];
    var cw=W<600?14:20,ch=W<600?7:9,cols=Math.floor(W*.36/(cw+4)),rows=Math.floor((H-44)/(ch+6));
    for(var a=0;a<cols;a++)for(var b=0;b<rows;b++)cells.push({x:a*(cw+4),y:34+b*(ch+6),w:cw,h:ch,a:a/cols});
    hubs.forEach(function(h,i){nodes.push({x:h[1]*W,y:h[2]*H,r:6,label:h[0],ph:seeded(i)*6})});
    var n=W<600?22:46;
    for(var i=0;i<n;i++)nodes.push({x:(.44+seeded(i+1)*.54)*W,y:(.14+seeded(i+50)*.78)*H,r:1.6+seeded(i+90)*1.6,ph:seeded(i+7)*6});
    nodes.forEach(function(p,i){
      nodes.map(function(q,j){return{j:j,d:Math.hypot(p.x-q.x,p.y-q.y)}})
        .filter(function(o){return o.j!==i}).sort(function(u,v){return u.d-v.d})
        .slice(0,i<4?5:2).forEach(function(o){edges.push([i,o.j])});
    });
    for(var k=0;k<(W<600?8:18);k++)pulses.push(spawn());
  }
  function draw(now){
    var T=still?9:(now-start)/1000,sweep=Math.min(1,T/2.2);
    x.clearRect(0,0,W,H);
    cells.forEach(function(q){
      x.fillStyle=col.line;x.globalAlpha=q.a<sweep?.5+.5*q.a:.25;x.fillRect(q.x,q.y,q.w,q.h);
    });
    x.globalAlpha=Math.max(0,Math.min(1,(T-1.2)/1.6));
    x.strokeStyle=col.line;x.lineWidth=1;
    edges.forEach(function(e){var a=nodes[e[0]],b=nodes[e[1]];x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()});
    pulses.forEach(function(p,k){
      var e=edges[p.e],a=nodes[e[0]],b=nodes[e[1]];
      if(!still)p.t+=p.v;
      if(p.t>=1){pulses[k]=spawn();return}
      var fx=p.feed?W*.36:a.x,fy=p.feed?34+p.row*(H-50):a.y;
      x.fillStyle=col.sodium;x.beginPath();x.arc(fx+(b.x-fx)*p.t,fy+(b.y-fy)*p.t,1.9,0,7);x.fill();
    });
    nodes.forEach(function(n){
      var near=mouse&&Math.hypot(mouse.x-n.x,mouse.y-n.y)<70;
      var r=n.r+(still?0:Math.sin(T*1.6+n.ph)*.4)+(near?1.6:0);
      x.fillStyle=n.label?col.sodium:near?col.crystal:col.mist;
      x.beginPath();x.arc(n.x,n.y,r,0,7);x.fill();
      if(n.label){x.fillStyle=col.crystal;x.font='500 11px "IBM Plex Mono",monospace';x.textAlign='center';x.fillText(n.label,n.x,n.y-13)}
    });
    x.globalAlpha=1;
    if(!still&&!document.hidden)requestAnimationFrame(draw);
  }
  build();draw(performance.now());
  addEventListener('resize',function(){build();if(still)draw(0)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&!still)requestAnimationFrame(draw)});
  c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();mouse={x:e.clientX-r.left,y:e.clientY-r.top}});
  c.addEventListener('pointerleave',function(){mouse=null});
})();

// Hats: one tab selected, arrow keys move between tabs, #hat-N opens one directly.
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.hat'));if(!tabs.length)return;
  function select(t,focus){
    tabs.forEach(function(x){
      var on=x===t;
      x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
      document.getElementById(x.getAttribute('aria-controls')).hidden=!on;
    });
    if(focus)t.focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t)});
    t.addEventListener('keydown',function(e){
      var n={ArrowRight:i+1,ArrowDown:i+1,ArrowLeft:i-1,ArrowUp:i-1,Home:0,End:tabs.length-1}[e.key];
      if(n===undefined)return;
      e.preventDefault();select(tabs[(n+tabs.length)%tabs.length],true);
    });
  });
  var m=location.hash.match(/^#hat-(\d)$/);
  select(tabs[m&&tabs[m[1]-1]?m[1]-1:0]);
})();

// Selected work: a link to an item opens it.
(function(){
  function open(){var d=location.hash&&document.querySelector('details'+location.hash);if(d)d.open=true}
  window.addEventListener('hashchange',open);open();
})();
