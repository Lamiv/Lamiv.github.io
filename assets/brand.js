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

// Capabilities: the trace (dark) and the atlas (light) drive one shared brief.
(function(){
  var brief=document.getElementById('brief');if(!brief)return;
  var H={
    1:{t:'Transformation leader',p:'Transformation that starts from a business problem and is judged by what changes in the operation.',
       b:['Transformation strategy and roadmaps','Business cases and value realisation','Cross-functional, multi-vendor delivery','Process redesign and adoption (Lean Six Sigma Green Belt)'],
       e:[['Operational transformation','#case-yield','24% truck turnaround improvement · ~$7M made traceable · ~AED 2M savings'],
          ['Consulting and product leadership','#work-hr','At Gavdi, led Managed Services, Centre of Excellence activities, technical pre-sales engagements and project delivery, alongside product ownership of SAP-based HCM solutions at Gavdi Labs.'],
          ['From architecture to business excellence','#career','In-house progression from SAP Technical Architect to Business Excellence, then AI & Digital Transformation.']]},
    2:{t:'ERP & enterprise architect',p:'Twenty years of SAP across global programmes and in-house platforms, from process design to integration and enterprise data.',
       b:['SAP implementation and modernisation: S/4HANA, BTP','Process domains: manufacturing, supply chain, procurement, maintenance, HR','Integration and enterprise data: Integration Suite, BW, Analytics Cloud, Business Data Cloud','Solution and enterprise architecture'],
       e:[['Global ERP implementation and rollout','#work-erp','Shell GSAP (Downstream One) at IBM; AB InBev’s global ERP rollout to Canada at Accenture; the Nike and Converse SAP upgrade and rollout, for about 5,000 users, at Wipro.'],
          ['HR and asset management on SAP','#work-hr','DEWA SAP HCM (Kawader), e-Recruitment and Learning (Kawader 2) and Plant Maintenance with WCM; SuccessFactors, UAE-localised payroll for Spinneys and SAP HCM products at Gavdi.'],
          ['In-house ERP and modernisation','#work-erp','SAP Technical Architect for a Dubai manufacturing group from 2015, on an ongoing programme that includes HR transformation and Plant Maintenance. Now: SAP Business AI on Business Data Cloud (development) and weighbridge automation integrated with SAP (implementation).']]},
    3:{t:'AI strategy & governance',p:'Shaping enterprise AI strategy, prioritising opportunities and translating investment decisions into governed programmes and operational capabilities.',
       b:['AI roadmap and use-case portfolio','Business cases with ROI, NPV and IRR','Governance with Legal, Risk & Assurance and Finance','Vendor evaluation, deployment oversight and benefits tracking','Chief Data & AI Officer Programme, ISB · AI Strategic Advisor, Travanleo'],
       e:[['AI roadmap and portfolio','#case-agents','I own the AI roadmap and delivery portfolio. Customer-operations agents and pricing AI are in production; industrial vision AI is in validation; agentic delivery coordination and SAP Business AI are in development.'],
          ['Investment governance','','Investment recommendations taken to a CEO-chaired AI Steering Committee with Legal, Risk & Assurance and Finance.'],
          ['Responsible AI','','Controls for privacy, cybersecurity, human oversight and performance, developed alongside the portfolio, with status, risks and benefits reported to governance forums.']]},
    4:{t:'AI architect & builder',p:'Enough technical depth to challenge an architecture, and to build the first version when it matters.',
       b:['Enterprise AI architecture and platforms','Agentic AI integrated with SAP and enterprise APIs','Retrieval and knowledge systems','MSc Artificial Intelligence, Distinction'],
       e:[['ERP-integrated AI agents','#case-agents','Multi-agent system routing customer enquiries, complaints and release orders into SAP, through a least-privilege service user. Production.'],
          ['Commercial AI products','#work-products','ESGAI for sustainability reporting; CareWiz AI for homecare scheduling. In market.'],
          ['ZAKS Drive · LEO','enterprise-ai-architecture.html#projects','Open-source SAP-to-SharePoint gateway; enterprise AI orchestration and memory architecture. Pre-release · engineering in progress.']]}
  };
  function el(tag,text){var x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x}
  function item(title,href,desc){
    var li=el('li'),t=href?el('a',title):el('b',title);if(href)t.href=href;
    li.appendChild(t);li.appendChild(el('span',desc));return li;
  }
  function fill(kicker,title,prop,brings,items){
    document.getElementById('brief-k').textContent=kicker;
    document.getElementById('brief-t').textContent=title;
    document.getElementById('brief-p').textContent=prop;
    var b=document.getElementById('brief-b'),e=document.getElementById('brief-e');
    b.textContent='';(brings||[]).forEach(function(x){b.appendChild(el('li',x))});b.hidden=!brings;
    e.textContent='';items.forEach(function(x){e.appendChild(item(x[0],x[1],x[2]))});
  }
  var lanes=[].slice.call(document.querySelectorAll('.lane')),sigs=[].slice.call(document.querySelectorAll('.sig'));
  var ahats=[].slice.call(document.querySelectorAll('.ahat')),nodes=[].slice.call(document.querySelectorAll('.anode'));
  var trace=document.getElementById('trace'),atlas=document.getElementById('atlas'),svg=atlas&&atlas.querySelector('svg');
  var state={hat:'1',sig:null,node:null};

  function render(){
    var h=state.hat,d=H[h];
    lanes.forEach(function(l){l.setAttribute('aria-pressed',l.dataset.hat===h)});
    sigs.forEach(function(s){s.classList.toggle('on',state.sig?s===state.sig:s.dataset.hat===h);s.setAttribute('aria-pressed',s===state.sig)});
    if(trace)trace.classList.add('focus');
    var linked=state.node?state.node.dataset.links.split(' '):null;
    ahats.forEach(function(a){a.setAttribute('aria-pressed',linked?linked.indexOf(a.dataset.hat)>-1:a.dataset.hat===h)});
    nodes.forEach(function(n){var on=state.node?n===state.node:n.dataset.links.split(' ').indexOf(h)>-1;n.classList.toggle('on',on);n.setAttribute('aria-pressed',n===state.node)});
    if(svg)[].forEach.call(svg.children,function(p){p.classList.toggle('on',state.node?nodes[p.dataset.n]===state.node:p.dataset.h===h)});
    if(atlas)atlas.classList.add('focus');
    if(state.sig){var s=state.sig;fill(s.dataset.when+' · Capability 0'+s.dataset.hat,s.textContent,s.dataset.d,null,[[d.t,'',d.p],['Open the detail',s.dataset.href,'']]);}
    else if(state.node){var n=state.node;fill('Evidence',n.querySelector('b').textContent,n.querySelector('small').textContent,null,
      linked.map(function(k){return ['Proves 0'+k+' · '+H[k].t,'',H[k].p]}).concat([['Open the detail',n.dataset.href,'']]));}
    else fill('Capability 0'+h,d.t,d.p,d.b,d.e);
  }
  function draw(){
    if(!svg)return;svg.textContent='';
    if(getComputedStyle(atlas).display==='none'||getComputedStyle(svg).display==='none'){render();return}
    var m=atlas.getBoundingClientRect();
    nodes.forEach(function(n,ni){n.dataset.links.split(' ').forEach(function(k){
      var a=ahats[k-1].getBoundingClientRect(),b=n.getBoundingClientRect();
      var x1=a.right-m.left,y1=a.top+a.height/2-m.top,x2=b.left-m.left,y2=b.top+b.height/2-m.top,c=(x2-x1)/2;
      var p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d','M'+x1+' '+y1+' C'+(x1+c)+' '+y1+' '+(x2-c)+' '+y2+' '+x2+' '+y2);
      p.dataset.h=k;p.dataset.n=ni;svg.appendChild(p);
    })});
    render();
  }
  lanes.concat(ahats).forEach(function(b){b.addEventListener('click',function(){state={hat:b.dataset.hat,sig:null,node:null};render()})});
  sigs.forEach(function(s){s.addEventListener('click',function(){state={hat:s.dataset.hat,sig:s,node:null};render()})});
  nodes.forEach(function(n){n.addEventListener('click',function(){state={hat:state.hat,sig:null,node:n};render()})});
  window.addEventListener('resize',draw);window.addEventListener('themechange',draw);
  if(document.fonts)document.fonts.ready.then(draw);
  draw();
})();

// Selected work: a link to an item opens it.
(function(){
  function open(){var d=location.hash&&document.querySelector('details'+location.hash);if(d)d.open=true}
  window.addEventListener('hashchange',open);open();
})();
