// Small screens: the site links fold behind a Menu button.
(function(){
  var m=document.querySelector('.menu'),nav=document.getElementById('sitenav');if(!m||!nav)return;
  function set(open){m.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)}
  m.addEventListener('click',function(){set(m.getAttribute('aria-expanded')!=='true')});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
})();

// Theme: dark (signal trace) by default, light (capability atlas) on request.
// The choice is stored under "theme", the key the embedded dashboards also read.
(function(){
  var root=document.documentElement,btn=document.querySelector('.theme');
  function tellFrames(){
    document.querySelectorAll('iframe').forEach(function(f){
      try{f.contentWindow.postMessage({type:'portfolioTheme',dark:root.dataset.theme!=='light'},'*')}catch(e){}
    });
  }
  function label(){if(btn)btn.setAttribute('aria-label',root.dataset.theme==='light'?'Switch to dark theme':'Switch to light theme')}
  if(btn)btn.addEventListener('click',function(){
    root.dataset.theme=root.dataset.theme==='light'?'dark':'light';
    try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}
    label();tellFrames();window.dispatchEvent(new Event('themechange'));
  });
  document.querySelectorAll('iframe').forEach(function(f){f.addEventListener('load',tellFrames)});
  label();
})();

// Capability atlas. A capability lights its routes and shows what it brings;
// a piece of evidence shows where it happened and where to read more.
// The panel never repeats the text already on the evidence itself.
(function(){
  var atlas=document.getElementById('atlas');if(!atlas)return;
  var H={
    1:{t:'Transformation leader',p:'Transformation that starts from a business problem and is judged by what changes in the operation.',
       b:['Transformation strategy and roadmaps','Business cases and value realisation','Cross-functional, multi-vendor delivery','Process redesign and adoption (Lean Six Sigma Green Belt)']},
    2:{t:'ERP & enterprise architect',p:'Twenty years of SAP across global programmes and in-house platforms, from process design to integration and enterprise data.',
       b:['SAP implementation and modernisation: S/4HANA, BTP','Process domains: manufacturing, supply chain, procurement, maintenance, HR','Integration and enterprise data: Integration Suite, BW, Analytics Cloud, Business Data Cloud','Solution and enterprise architecture']},
    3:{t:'AI strategy & governance',p:'Shaping enterprise AI strategy, prioritising opportunities and translating investment decisions into governed programmes and operational capabilities.',
       b:['AI roadmap and use-case portfolio','Business cases with ROI, NPV and IRR','Governance with Legal, Risk & Assurance and Finance','Vendor evaluation, deployment oversight and benefits tracking','Chief Data & AI Officer Programme, ISB · AI Strategic Advisor, Travanleo']},
    4:{t:'AI architect & builder',p:'Enough technical depth to challenge an architecture, and to build the first version when it matters.',
       b:['Enterprise AI architecture and platforms','Agentic AI integrated with SAP and enterprise APIs','Retrieval and knowledge systems','MSc Artificial Intelligence, Distinction']}
  };
  // where, role and outcome: shown only when the evidence is opened
  var WHERE=['Where','Industrial manufacturing group, Dubai'];
  var E={
    logistics:{d:[['What','Truck traffic management, scheduling and dispatch with real-time monitoring and intervention'],['Next','Weighbridge automation integrated with SAP and dispatch, in implementation'],WHERE],
      l:[['Selected work','#case-yield'],['Sample dashboard','sap-analytics.html#traffic']]},
    prodacc:{d:[['What','Statistical yield estimates replaced by automated, measurement-driven reporting across output, process losses and work-in-progress'],WHERE],
      l:[['Selected work','#case-yield'],['Sample dashboard','sap-analytics.html#yield']]},
    procure:{d:[['What','Procurement redesigned on SAP best practice, with analytics and dashboards for negotiators'],WHERE],
      l:[['Selected work','#case-yield'],['Sample dashboard','sap-analytics.html#procurement']]},
    shell:{d:[['Role','Systems Engineer, IBM'],['When','2005 to 2009']],l:[['Selected work','#work-erp']]},
    abi:{d:[['Role','SAP Technical Lead, Accenture'],['When','2009 to 2010']],l:[['Selected work','#work-erp']]},
    nike:{d:[['Role','Project and Technical Lead, Wipro'],['When','2011 to 2014']],l:[['Selected work','#work-erp']]},
    dewa:{d:[['Scope','SAP HCM (Kawader), then e-Recruitment and Learning (Kawader 2); Plant Maintenance with work clearance management'],['Role','Wipro, 2011 to 2014']],l:[['Selected work','#work-hr']]},
    gavdi:{d:[['Role','Senior Manager; Manager, Customer Innovations'],['Led','Managed Services, Centre of Excellence activities, technical pre-sales engagements and project delivery'],['Clients','ABB and Maersk; UAE-localised payroll for Spinneys'],['When','2014 to 2015']],
      l:[['Selected work','#work-hr'],['Career detail','#career']]},
    gavdilabs:{d:[['Role','Manager, Gavdi Labs'],['Work','Product design and development; regional HR localisation, smart identity management, SuccessFactors integration, SAP cloud and mobile'],['When','2014 to 2015']],
      l:[['Career detail','#career']]},
    inhouse:{d:[['Role','SAP Technical Architect from 2015, then Business Excellence, now AI & Digital Transformation'],['Now','SAP Business AI on Business Data Cloud (development); weighbridge automation integrated with SAP (implementation)']],
      l:[['Selected work','#work-erp']]},
    zaks:{d:[['What','Go gateway that implements SAP\u2019s content-server protocol on SharePoint'],['Verified','S/4HANA 2025 with SAP DMS']],
      l:[['Architecture & engineering','enterprise-ai-architecture.html#projects'],['On GitHub','https://github.com/Lamiv/zaks-drive']]},
    portfolio:{d:[['Portfolio','I own the AI roadmap and delivery portfolio'],['Forum','Investment recommendations to a CEO-chaired AI Steering Committee with Legal, Risk & Assurance and Finance'],['Controls','Privacy, cybersecurity, human oversight and performance, developed alongside the portfolio']],
      l:[['Selected work','#case-agents']]},
    agents:{d:[['Build','Designed and built in Python and LangGraph, on local inference'],['Integration','Enquiries, complaints and release orders routed into SAP through a least-privilege service user'],['Operation','Monitored after go-live for usage, accuracy and incidents']],
      l:[['Selected work','#case-agents'],['Architecture & engineering','enterprise-ai-architecture.html']]},
    pricing:{d:[['Use','Supports the commercial team\u2019s pricing decisions in B2B commodity sales']],l:[['Selected work','#case-agents']]},
    vision:{d:[['Use cases','Equipment monitoring on belts and conveyors; packaging operations; HSE, with PPE detection and incident reporting'],['Status','Validation and UAT; not yet in production']],
      l:[['Selected work','#work-vision']]},
    esgai:{d:[['What','Plain-language queries over ESG data, with reports aligned to GRI, ESRS, BRSR and VSME'],['Product','ESG Xpress, Ecodrisil']],
      l:[['Selected work','#work-products'],['ecodrisil.com','https://ecodrisil.com/']]},
    carewiz:{d:[['What','Machine-learning scheduling that matches available caregivers to staffing needs']],
      l:[['Selected work','#work-products'],['carewiz.org','https://carewiz.org/']]},
    leo:{d:[['Architecture','An agent runtime, scoped memory and shared business capabilities that new AI use cases build on'],['Status','Components at different stages; not deployed as a whole']],
      l:[['Architecture & engineering','enterprise-ai-architecture.html#projects']]}
  };
  var svg=atlas.querySelector('svg'),hats=[].slice.call(atlas.querySelectorAll('.ahat')),nodes=[].slice.call(atlas.querySelectorAll('.anode'));
  var state={hat:'1',node:null},K=document.getElementById('brief-k'),T=document.getElementById('brief-t'),P=document.getElementById('brief-p'),R=document.getElementById('brief-r');
  function el(tag,cls,text){var x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x}
  function links(n){return n.dataset.links.split(' ')}
  function panel(){
    R.textContent='';
    if(!state.node){
      var d=H[state.hat];K.textContent='Capability 0'+state.hat;T.textContent=d.t;P.textContent=d.p;P.hidden=false;
      R.appendChild(el('p','label','What I bring'));var ul=el('ul','brings');d.b.forEach(function(b){ul.appendChild(el('li','',b))});R.appendChild(ul);
      return;
    }
    var n=state.node,e=E[n.dataset.id];
    K.textContent='Evidence · '+n.querySelector('em').textContent;T.textContent=n.querySelector('b').textContent;P.hidden=true;
    var dl=el('ul','facts');e.d.forEach(function(r){var li=el('li');li.appendChild(el('span','label',r[0]));li.appendChild(el('span','',r[1]));dl.appendChild(li)});
    T.parentNode.appendChild(dl);
    var lk=el('p','golinks');e.l.forEach(function(x){var a=el('a','',x[0]+' →');a.href=x[1];lk.appendChild(a)});R.appendChild(lk);
  }
  function render(){
    var old=document.querySelector('#brief .facts');if(old)old.remove();
    // one capability is always the selection; evidence adds the other capabilities it proves
    var lit=state.node?links(state.node):[];
    hats.forEach(function(h){h.setAttribute('aria-pressed',h.dataset.hat===state.hat);h.classList.toggle('linked',lit.indexOf(h.dataset.hat)>-1)});
    nodes.forEach(function(n){
      n.classList.toggle('on',state.node?n===state.node:links(n).indexOf(state.hat)>-1);
      n.setAttribute('aria-pressed',n===state.node);
      n.parentNode.classList.toggle('off',links(n).indexOf(state.hat)<0);
    });
    [].forEach.call(atlas.querySelectorAll('.anodes .grp'),function(g){
      var x=g.nextElementSibling,any=false;
      while(x&&!x.classList.contains('grp')){if(!x.classList.contains('off'))any=true;x=x.nextElementSibling}
      g.classList.toggle('off',!any);
    });
    [].forEach.call(svg.children,function(p){p.classList.toggle('on',state.node?nodes[p.dataset.n]===state.node:p.dataset.h===state.hat)});
    atlas.classList.add('focus');panel();
  }
  function draw(){
    svg.textContent='';
    if(getComputedStyle(svg).display!=='none'){
      var m=atlas.getBoundingClientRect();
      nodes.forEach(function(n,ni){links(n).forEach(function(k){
        var a=hats[k-1].getBoundingClientRect(),b=n.getBoundingClientRect();
        var x1=a.right-m.left,y1=a.top+a.height/2-m.top,x2=b.left-m.left,y2=b.top+b.height/2-m.top,c=(x2-x1)/2;
        var p=document.createElementNS('http://www.w3.org/2000/svg','path');
        p.setAttribute('d','M'+x1+' '+y1+' C'+(x1+c)+' '+y1+' '+(x2-c)+' '+y2+' '+x2+' '+y2);
        p.dataset.h=k;p.dataset.n=ni;svg.appendChild(p);
      })});
    }
    render();
  }
  var narrow=matchMedia('(max-width:900px)');
  hats.forEach(function(h){h.addEventListener('click',function(){state={hat:h.dataset.hat,node:null};render()})});
  nodes.forEach(function(n){n.addEventListener('click',function(){
    var hat=links(n).indexOf(state.hat)>-1?state.hat:links(n)[0];
    state={hat:hat,node:state.node===n?null:n};render();
    if(narrow.matches&&state.node)document.getElementById('brief').scrollIntoView({behavior:'smooth',block:'nearest'});
  })});
  addEventListener('resize',draw);addEventListener('themechange',draw);
  if(document.fonts)document.fonts.ready.then(draw);
  draw();
})();

// Selected work: a link to an item opens it.
(function(){
  function open(){var d=location.hash&&document.querySelector('details'+location.hash);if(d)d.open=true}
  window.addEventListener('hashchange',open);open();
})();

// Hero: ledger cells on the left feed an agent graph on the right.
(function(){
  var c=document.getElementById('process');if(!c)return;
  var x=c.getContext('2d'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var col={};
  function tokens(){var css=getComputedStyle(document.documentElement);['line','mist','sodium','crystal'].forEach(function(n){col[n]=css.getPropertyValue('--'+n).trim()})}
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
  tokens();build();draw(performance.now());
  addEventListener('resize',function(){build();if(still)draw(0)});
  addEventListener('themechange',function(){tokens();if(still)draw(0)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&!still)requestAnimationFrame(draw)});
  c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();mouse={x:e.clientX-r.left,y:e.clientY-r.top}});
  c.addEventListener('pointerleave',function(){mouse=null});
})();
