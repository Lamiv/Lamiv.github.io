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
// a piece of evidence shows where it happened, what it proves and where to read more.
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
  var E={
    ops:{d:[['Logistics','Traffic management, scheduling and dispatch: 24% truck turnaround improvement'],['Production accounting','Estimates replaced by measurement: ~$7M annual product value brought into accurate accounting'],['Procurement','SAP process redesign and negotiation analytics: ~AED 2M savings delivered by the negotiating teams'],['Where','Industrial manufacturing group, Dubai · 2015 onward']],
         l:[['Selected work','#case-yield'],['Sample dashboards','sap-analytics.html']]},
    consult:{d:[['Gavdi · 2014–15','Led Managed Services, Centre of Excellence activities, technical pre-sales engagements and project delivery'],['Gavdi Labs','Product ownership, design and development of SAP-based HCM products'],['Clients','ABB and Maersk; UAE-localised payroll for Spinneys']],
         l:[['Selected work','#work-hr'],['Career detail','#career']]},
    erp:{d:[['IBM · 2005–09','Systems Engineer, Shell GSAP (Downstream One)'],['Accenture · 2009–10','SAP Technical Lead, AB InBev global ERP rollout to Canada (Labatt)'],['Wipro · 2011–14','Project and Technical Lead: Nike and Converse upgrade and rollout for about 5,000 users; DEWA']],
         l:[['Selected work','#work-erp']]},
    hr:{d:[['DEWA · Wipro','SAP HCM (Kawader), e-Recruitment and Learning (Kawader 2), Plant Maintenance with work clearance management'],['Gavdi','SAP HR and SuccessFactors for ABB, Maersk and Spinneys'],['In-house','HR transformation and Plant Maintenance on the ongoing SAP programme']],
         l:[['Selected work','#work-hr']]},
    gov:{d:[['Portfolio','I own the AI roadmap and delivery portfolio: agents and pricing AI in production; vision AI in validation; agentic delivery coordination and SAP Business AI in development'],['Forum','Investment recommendations to a CEO-chaired AI Steering Committee with Legal, Risk & Assurance and Finance'],['Controls','Privacy, cybersecurity, human oversight and performance, developed alongside the portfolio']],
         l:[['Selected work','#case-agents']]},
    agents:{d:[['Build','Designed and built in Python and LangGraph, on local inference'],['Integration','Enquiries, complaints and release orders routed into SAP through a least-privilege service user'],['Operation','Monitored after go-live for usage, accuracy and incidents; pricing AI serves the same commercial team']],
         l:[['Selected work','#case-agents'],['Architecture & engineering','enterprise-ai-architecture.html']]},
    vision:{d:[['Use cases','Equipment monitoring on belts and conveyors; packaging operations; HSE, with PPE detection and incident reporting'],['Status','Validation and UAT; not yet in production']],
         l:[['Selected work','#work-vision']]},
    products:{d:[['ESGAI','Plain-language queries over ESG data, with reports aligned to GRI, ESRS, BRSR and VSME'],['CareWiz AI','Machine-learning scheduling that matches caregivers to staffing needs']],
         l:[['Selected work','#work-products'],['ecodrisil.com','https://ecodrisil.com/']]},
    platform:{d:[['ZAKS Drive','Open-source Go gateway that lets SAP store documents in SharePoint; verified on S/4HANA 2025'],['LEO','Enterprise AI orchestration and memory architecture; components at different stages']],
         l:[['Architecture & engineering','enterprise-ai-architecture.html#projects'],['ZAKS Drive on GitHub','https://github.com/Lamiv/zaks-drive']]}
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
    R.appendChild(el('p','label','Proves'));
    var pr=el('div','proves');links(n).forEach(function(k){var b=el('button','chip','0'+k+' '+H[k].t);b.type='button';b.addEventListener('click',function(){state={hat:k,node:null};render()});pr.appendChild(b)});R.appendChild(pr);
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
