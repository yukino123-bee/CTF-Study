const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let sections=[], current=0, tutorialCurrent=0, readerMode='topic', query='', activeCategory='Forensics';
const icons=['🗂','⌕','01','ⓘ','▣','📦','◆','◈','▧','♫','⌁','◉','▤','↺','▦','PDF','DOC','⊞','▥','▣','◎','✉','#','🔐','↔','QR','</>','▯','◷','✦'];
const categories=['Forensics','General Skills','Cryptography','Web Exploitation','Networking','Reverse Engineering','Binary Exploitation'];
const categoryTopics={
  'Forensics':Array.from({length:30},(_,i)=>i+1),
  'General Skills':[],
  'Cryptography':[],
  'Web Exploitation':[31,32],
  'Networking':[],
  'Reverse Engineering':[],
  'Binary Exploitation':[]
};
const state={done:JSON.parse(localStorage.getItem('forensics-done')||'[]'),theme:localStorage.getItem('forensics-theme')||'dark'};
const webExploitationTopics=[
  {
    i:-1,num:31,kind:'commands',title:'COMMON COMMANDS',tools:'curl, wget, grep, base64, xxd, openssl, dig, nslookup, host, netcat, nmap, python3',
    entries:[
      ['curl','A command-line HTTP client that exposes request and response details without requiring a browser.','Inspect response headers, test an endpoint, send form or JSON data, and reproduce a request.','curl -i https://example.com','HTTP/2 200\ncontent-type: text/html; charset=UTF-8\ncontent-length: 1256\n\n<!doctype html>...'],
      ['wget','A non-interactive downloader that saves remote pages and files locally.','Download a file for offline inspection or mirror public site content during an authorized assessment.','wget https://example.com/robots.txt','--2026-08-10--  https://example.com/robots.txt\nHTTP request sent, awaiting response... 200 OK\nSaving to: ‘robots.txt’\nrobots.txt saved [42/42]'],
      ['grep','A text-search utility that finds matching strings or patterns in files and piped output.','Locate URLs, API keys, comments, error messages, or other indicators in downloaded source.','grep -Rni "api" ./site','./site/app.js:18:const apiUrl = "/api/v1/users";\n./site/index.html:44:<!-- API documentation -->'],
      ['base64','Encodes binary data as text or decodes Base64 text back to its original bytes. It is encoding, not encryption.','Decode tokens and parameters or prepare binary data for transport.','printf "%s" "SGVsbG8=" | base64 -d','Hello'],
      ['xxd','Creates a hexadecimal view of data and can reverse a hex dump into bytes.','Inspect magic bytes, reveal non-printable characters, or decode hexadecimal input.','printf "%s" "48656c6c6f0a" | xxd -r -p','Hello'],
      ['openssl','A cryptographic toolkit for inspecting TLS connections, certificates, hashes, and encoded data.','Review a server certificate, test a TLS handshake, or calculate a digest.','openssl s_client -connect example.com:443 -servername example.com','CONNECTED(00000003)\ndepth=2 C = US, O = Internet Security Research Group\nVerify return code: 0 (ok)'],
      ['dig','A detailed DNS query tool that displays answers, record types, TTL values, and responding servers.','Inspect A, AAAA, MX, TXT, CNAME, or NS records while mapping an authorized target.','dig example.com A +short','93.184.216.34'],
      ['nslookup','An interactive and non-interactive utility for resolving DNS names and addresses.','Quickly verify how a hostname resolves through the configured DNS server.','nslookup example.com','Server:  192.168.1.1\nAddress: 192.168.1.1#53\n\nName: example.com\nAddress: 93.184.216.34'],
      ['host','A concise DNS lookup utility for names, addresses, and mail servers.','Perform a quick forward, reverse, or record-specific DNS check.','host example.com','example.com has address 93.184.216.34\nexample.com has IPv6 address 2606:2800:220:1:248:1893:25c8:1946'],
      ['nc / netcat','A raw TCP/UDP client and listener useful for seeing exactly what a network service sends and receives.','Manually connect to an authorized HTTP service and send a basic protocol request.','printf "GET / HTTP/1.0\\r\\nHost: example.com\\r\\n\\r\\n" | nc example.com 80','HTTP/1.0 200 OK\nContent-Type: text/html\nContent-Length: 1256\n\n<!doctype html>...'],
      ['nmap','A network mapper that identifies reachable hosts, open ports, and probable service versions.','Discover the exposed services on systems you own or have explicit permission to test.','nmap -sV scanme.nmap.org','PORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 6.6.1p1\n80/tcp   open  http    Apache httpd 2.4.7'],
      ['python3','A scripting runtime with standard libraries for quick parsing, automation, and HTTP requests.','Write a small repeatable request or transform response data when shell tools become cumbersome.','python3 -c "import urllib.request; print(urllib.request.urlopen(\'https://example.com\').status)"','200']
    ]
  },
  {
    i:-1,num:32,kind:'tools',title:'WEB EXPLOITATION TOOLS',tools:'Burp Suite, OWASP ZAP, DevTools, Gobuster, ffuf, Nikto, SQLmap, WhatWeb, Wappalyzer, CyberChef, Postman, JWT',
    entries:[
      ['Burp Suite','An intercepting proxy that places the tester between a browser and a web application.','Capture, inspect, edit, replay, and compare authorized HTTP requests using Proxy and Repeater.','Proxy → HTTP history → select GET /account','GET /account HTTP/2\nHost: lab.example\nCookie: session=...\n\nHTTP/2 200 OK\nContent-Type: text/html'],
      ['OWASP ZAP','An open-source intercepting proxy and web vulnerability scanner.','Explore an authorized application manually, passively identify issues, and run scoped active scans.','Quick Start → Automated Scan → https://lab.example','Alerts: 3\nMedium: Content Security Policy Header Not Set\nLow: Cookie Without SameSite Attribute'],
      ['Browser DevTools','Built-in browser panels for the DOM, JavaScript, cookies, storage, console, and network traffic.','Understand client-side behavior and inspect the exact requests made by a page.','DevTools → Network → Fetch/XHR → select request','Request URL: https://lab.example/api/profile\nStatus Code: 200\nContent-Type: application/json'],
      ['Nmap','A service-discovery scanner that reports reachable ports and probable software versions.','Map the web-facing services of hosts included in an authorized scope.','nmap -sV -p 80,443 lab.example','PORT    STATE SERVICE  VERSION\n80/tcp  open  http     nginx 1.24.0\n443/tcp open  ssl/http nginx 1.24.0'],
      ['Gobuster','A wordlist-driven discovery tool for web paths, files, virtual hosts, and DNS names.','Find unlinked content on an authorized site, then verify each result manually.','gobuster dir -u https://lab.example -w words.txt','/admin                (Status: 302) [Size: 0]\n/assets               (Status: 301) [Size: 169]\n/robots.txt           (Status: 200) [Size: 42]'],
      ['ffuf','A fast web fuzzer that substitutes FUZZ in a URL, header, or request body.','Discover content or test input locations within an authorized application using response filters.','ffuf -w words.txt -u https://lab.example/FUZZ -fc 404','admin                  [Status: 302, Size: 0, Words: 1]\napi                    [Status: 301, Size: 169, Words: 5]'],
      ['Nikto','A web-server scanner that checks for risky files, headers, and known configuration problems.','Perform an initial authorized server review and manually validate reported findings.','nikto -h https://lab.example','+ Server: nginx/1.24.0\n+ The X-Content-Type-Options header is not set.\n+ 1 host(s) tested'],
      ['SQLmap','An automated SQL injection testing tool with detection and database-enumeration features.','Confirm suspected SQL injection only on systems where explicit testing permission covers exploitation.','sqlmap -u "https://lab.example/item?id=1" --batch','[INFO] testing connection to the target URL\n[INFO] testing if GET parameter \'id\' is dynamic\n[WARNING] parameter \'id\' does not appear to be injectable'],
      ['WhatWeb','A command-line fingerprinting tool that recognizes frameworks, servers, CMS products, and libraries.','Build a quick technology profile to guide later manual investigation.','whatweb https://example.com','https://example.com [200 OK] Country[UNITED STATES], HTML5, HTTPServer[ECS], Title[Example Domain]'],
      ['Wappalyzer','A browser extension and service that identifies technologies visible in a site response.','Identify likely frameworks, analytics, servers, and libraries while browsing an authorized target.','Open Wappalyzer while viewing the target','Web frameworks: Next.js\nJavaScript libraries: React\nCDN: Cloudflare'],
      ['CyberChef','A visual data-transformation workspace that chains operations such as decoding, decompression, hashing, and parsing.','Explore unfamiliar encoded values while keeping each transformation visible and repeatable.','Recipe: From Base64 → input SGVsbG8=','Output\nHello'],
      ['Postman','An API client for composing requests, organizing collections, handling variables, and inspecting responses.','Exercise documented API endpoints and preserve repeatable authorized test cases.','GET {{baseUrl}}/api/v1/profile','Status: 200 OK   Time: 184 ms\n{\n  "id": 42,\n  "role": "user"\n}'],
      ['JWT tooling','Utilities such as jwt.io or local JWT decoders that split and inspect token headers, claims, and signatures.','Review algorithms, expiry, issuer, audience, and authorization claims without treating decoded data as verified.','Decode JWT payload','{\n  "sub": "42",\n  "role": "user",\n  "exp": 1786377600\n}\nSignature: verification required']
    ]
  }
];
webExploitationTopics.forEach(topic=>{topic.lines=topic.entries.flatMap(entry=>entry.slice(0,3))});
const webToolInstallations={
  'Burp Suite':'Download Burp Suite Community Edition from the official PortSwigger website and run its platform installer.',
  'OWASP ZAP':'sudo apt install zaproxy, or install the official package from zaproxy.org.',
  'Browser DevTools':'Included with Chrome, Chromium, Firefox, and Edge; press F12 or Ctrl+Shift+I.',
  'Nmap':'sudo apt install nmap',
  'Gobuster':'sudo apt install gobuster',
  'ffuf':'sudo apt install ffuf',
  'Nikto':'sudo apt install nikto',
  'SQLmap':'sudo apt install sqlmap',
  'WhatWeb':'sudo apt install whatweb',
  'Wappalyzer':'Install the official Wappalyzer extension from your browser extension store.',
  'CyberChef':'Use the hosted version or download the official GitHub release for offline use.',
  'Postman':'Install the official Postman package for your platform or use its web client.',
  'JWT tooling':'python3 -m pip install --user jwt-tool, preferably inside a virtual environment.'
};

async function boot(){
  document.body.classList.toggle('light',state.theme==='light');
  try{const text=await fetch('data/study.txt').then(r=>{if(!r.ok)throw Error(r.status);return r.text()});parse(text);render();}
  catch(e){$('#topicGrid').innerHTML='<div class="empty">Could not load the study notes. Start the app with <b>Launch CTF Study</b> on your Desktop.</div>';}
}
function parse(text){
  const lines=text.split(/\r?\n/), starts=[];
  lines.forEach((line,i)=>{const m=line.match(/^(\d+)\. (.+?) — (.+)$/);if(m)starts.push({i,num:+m[1],title:m[2],tools:m[3]})});
  sections=starts.map((s,n)=>({...s,lines:lines.slice(s.i+2,starts[n+1]?.i??lines.findIndex((x,i)=>i>s.i&&x==='QUICK TRIAGE WORKFLOW'))}));
  sections.push(...webExploitationTopics);
  addCurriculumTopics();
  addReferenceTopics();
}
function addCurriculumTopics(){
  let num=Math.max(...sections.map(s=>s.num))+1;
  Object.entries(curriculumBlueprint).forEach(([category,topics])=>topics.forEach(([title,summary,learn,practice,tools])=>{
    const topic={i:-1,num:num++,title:title.toUpperCase(),tools,lines:[`${title} — ${summary}`,`Learn: ${learn}`,`Practice: ${practice}`,`Recommended tools: ${tools}`]};
    sections.push(topic);(categoryTopics[category]??=[]).push(topic.num);
  }));
}
function addReferenceTopics(){
  let num=Math.max(...sections.map(s=>s.num))+1;
  Object.entries(categoryReferences).forEach(([category,groups])=>{
    for(const kind of ['commands','tools']){
      const entries=groups[kind];if(!entries?.length)continue;
      const title=kind==='commands'?'COMMAND REFERENCE':'TOOL INSTALLATION & USAGE';
      const topic={i:-1,num:num++,kind,title,tools:entries.map(x=>x[0]).join(', '),entries,lines:entries.flatMap(x=>x.slice(0,3))};
      sections.push(topic);(categoryTopics[category]??=[]).push(topic.num);
    }
  });
}
function render(){
  $('#topicCount').textContent=sections.length;
  renderCategories(); renderSidebar(); filter(); updateProgress(); bind();
}
function topicsFor(category){return sections.filter(s=>(categoryTopics[category]||[]).includes(s.num))}
function topicSequence(){return topicsFor(activeCategory)}
function isUnlocked(topic){const list=topicSequence(),position=list.findIndex(s=>s.num===topic.num);return position<=0||state.done.includes(list[position-1].num)}
function renderCategories(){
  $('#categorySelect').innerHTML=categories.map(name=>`<option value="${attr(name)}" ${name===activeCategory?'selected':''}>${esc(name)} (${topicsFor(name).length})</option>`).join('');
}
function renderSidebar(){
  const allowed=new Set(topicsFor(activeCategory).map(s=>s.num));
  const grouped=sections.map((s,i)=>({s,i})).filter(({s})=>allowed.has(s.num));
  const group=(label,kind,open=false)=>{const items=grouped.filter(({s})=>kind==='topics'?!s.kind:s.kind===kind);if(!items.length)return'';return `<details class="nav-group" ${open?'open':''}><summary>${esc(label)}<span>${items.length}</span></summary>${items.map(({s,i})=>{const locked=!isUnlocked(s);return `<button data-index="${i}" ${locked?'disabled':''}>${locked?'🔒':String(s.num).padStart(2,'0')} &nbsp; ${esc(s.title)}</button>`}).join('')}</details>`};
  $('#topics').innerHTML='<button class="active" data-home>⌂ &nbsp; Overview</button>'+group('Study Topics','topics',true)+group('Commands','commands',true)+group('Tools','tools',true)+'<div class="nav-label">PRACTICAL TUTORIALS</div>'+tutorials.map((t,i)=>`<button data-tutorial="${i}">▸ &nbsp; ${esc(t.name)}</button>`).join('');
}
function filter(){
  const allowed=new Set(topicsFor(activeCategory).map(s=>s.num));
  const matches=sections.map((s,i)=>({s,i})).filter(({s})=>allowed.has(s.num)&&(s.title+' '+s.tools+' '+s.lines.join(' ')).toLowerCase().includes(query));
  $('#filterStatus').textContent=query?`${matches.length} result${matches.length!==1?'s':''}`:`${matches.length} topic${matches.length!==1?'s':''}`;
  $('#topicGrid').innerHTML=matches.length?matches.map(({s,i})=>{const locked=!isUnlocked(s);return `<article class="topic-card ${state.done.includes(s.num)?'done':''} ${locked?'locked':''}" data-index="${i}" aria-disabled="${locked}"><span class="num">${locked?'🔒 LOCKED':`${icons[i]||'•'} &nbsp; TOPIC ${String(s.num).padStart(2,'0')}`}</span><h3>${esc(s.title)}</h3><p>${locked?'Complete the previous topic to unlock this lesson.':esc(s.tools)}</p></article>`}).join(''):'<div class="empty">No matching tools or commands. Try another search.</div>';
  $$('.topic-card:not(.locked)').forEach(x=>x.onclick=()=>openTopic(+x.dataset.index));
  const labs=tutorials.map((t,i)=>({t,i})).filter(({t})=>(t.name+' '+t.use+' '+t.steps.flat().join(' ')).toLowerCase().includes(query));
  $('#tutorialGrid').innerHTML=labs.length?labs.map(({t,i})=>`<article class="topic-card lab-card" data-tutorial="${i}"><span class="num">PRACTICAL LAB · ${esc(t.level.toUpperCase())}</span><h3>${esc(t.name)}</h3><p>${esc(t.use)} · ${t.steps.length} guided steps</p></article>`).join(''):'<div class="empty">No matching tutorials.</div>';
  $$('.lab-card').forEach(x=>x.onclick=()=>openTutorial(+x.dataset.tutorial));
}
function openTopic(i){
  readerMode='topic';
  $('#completeCheck').parentElement.style.display='';
  current=Math.max(0,Math.min(i,sections.length-1)); const s=sections[current];if(!isUnlocked(s)){toast('Complete the previous topic first');showHome();return}
  $('#home').classList.remove('active');$('#reader').classList.add('active');
  $('#readerNumber').textContent=`TOPIC ${String(s.num).padStart(2,'0')} · ${s.tools}`;
  $('#readerTitle').textContent=s.title;$('#crumb').textContent=s.title;$('#completeCheck').checked=state.done.includes(s.num);
  $('#readerBody').innerHTML=s.entries?formatReferenceEntries(s.entries):format(s.lines);updateTopicNavigation();
  $$('#topics button').forEach(x=>x.classList.toggle('active',+x.dataset.index===current));
  $$('.copy').forEach(b=>b.onclick=()=>copyText(b.parentElement.dataset.command));
  window.scrollTo(0,0);document.body.classList.remove('menu-open');
}
function openTutorial(i){
  readerMode='tutorial';tutorialCurrent=Math.max(0,Math.min(i,tutorials.length-1));const t=tutorials[tutorialCurrent];
  $('#home').classList.remove('active');$('#reader').classList.add('active');
  $('#readerNumber').textContent=`HANDS-ON LAB ${String(tutorialCurrent+1).padStart(2,'0')} · ${t.level.toUpperCase()}`;
  $('#readerTitle').textContent=t.name;$('#crumb').textContent=`TUTORIAL / ${t.name}`;$('#completeCheck').parentElement.style.display='none';
  $('#readerBody').innerHTML=`<div class="tutorial-intro"><b>Used for</b><p>${esc(t.use)}</p><b>Before you begin</b><p>${esc(t.setup)}</p><div class="output-warning">Outputs below are realistic training examples. Your filenames, hashes, timestamps, counts, offsets, addresses, and versions will differ.</div></div>`+t.steps.map((s,n)=>`<article class="tutorial-step"><div class="step-number">${n+1}</div><div><h3>${esc(s[0])}</h3><div class="command" data-command="${attr(s[1])}">${esc(s[1])}<button class="copy" title="Copy command or action">Copy</button></div><div class="sample-output"><span>ACTUAL-STYLE SAMPLE OUTPUT</span><pre>${esc(s[2])}</pre></div><p class="interpret"><b>What it means:</b> ${esc(s[3])}</p></div></article>`).join('');
  $('#prevButton').disabled=tutorialCurrent===0;$('#nextButton').textContent=tutorialCurrent===tutorials.length-1?'Back to overview':'Next tutorial →';
  $$('#topics button').forEach(x=>x.classList.toggle('active',+x.dataset.tutorial===tutorialCurrent&&x.hasAttribute('data-tutorial')));
  $$('.copy').forEach(b=>b.onclick=()=>copyText(b.parentElement.dataset.command));window.scrollTo(0,0);document.body.classList.remove('menu-open');
}
function format(lines){
  let html='', block=false;
  const close=()=>{if(block){html+='</div>';block=false}};
  for(const raw of lines){const line=raw.trimEnd();if(!line.trim())continue;
    const tool=line.match(/^([^—]+) — (.+)$/);
    const command=/^  \S/.test(raw)&&(/<[^>]+>|\s-{1,2}\w|\| | > |^[ ]{2}[.a-zA-Z]/).test(raw);
    if(tool){close();html+=`<div class="study-block"><h3>${esc(tool[1].trim())}</h3><p>${esc(tool[2])}</p>`;block=true}
    else if(command){const cmd=line.trim(),copy=cmd.split(/\s{2,}/)[0],sample=getSample(copy);html+=`<div class="command" data-command="${attr(copy)}">${esc(cmd)}<button class="copy" title="Copy command">Copy</button></div>${sample?`<div class="sample-output"><span>SAMPLE OUTPUT · ILLUSTRATIVE</span><pre>${esc(sample)}</pre></div>`:''}`}
    else {if(!block){html+='<div class="study-block">';block=true} const cls=/^(Note|Tip|Caution|Security|Important|Recovery|Offset)/i.test(line)?'note':'';html+=`<p class="${cls}">${esc(line)}</p>`}
  } close(); return html;
}
function formatReferenceEntries(entries){
  const topic=sections[current],isTools=topic.kind==='tools';
  return `<div class="reference-notice">Install commands target Debian, Ubuntu, or Kali unless noted. Confirm packages for your operating system. Use security tools only on systems you own or have permission to assess.</div>`+entries.map(entry=>{
    let [name,explanation,use,a,b,c]=entry,install='',command=a,output=b;
    if(isTools){install=entry.length===6?a:(webToolInstallations[name]||'Use the official project documentation for your platform.');command=entry.length===6?b:a;output=entry.length===6?c:b}
    return `<article class="study-block reference-entry"><h3>${esc(name)}</h3><p>${esc(explanation)}</p><p><b>Use:</b> ${esc(use)}</p>${isTools?`<p class="install-label"><b>Install:</b></p><div class="command" data-command="${attr(install)}">${esc(install)}<button class="copy" title="Copy installation command">Copy</button></div><p class="use-label"><b>First use:</b></p>`:''}<div class="command" data-command="${attr(command)}">${esc(command)}<button class="copy" title="Copy command or action">Copy</button></div><div class="sample-output"><span>SAMPLE OUTPUT · ILLUSTRATIVE</span><pre>${esc(output||'Command completed successfully.')}</pre></div></article>`
  }).join('');
}
function showHome(){
  $('#reader').classList.remove('active');$('#home').classList.add('active');$('#crumb').textContent='HOME';
  $('#completeCheck').parentElement.style.display='';
  $$('#topics button').forEach(x=>x.classList.toggle('active',x.hasAttribute('data-home')));filter();window.scrollTo(0,0);document.body.classList.remove('menu-open');
}
function updateTopicNavigation(){
  const list=topicSequence(),position=list.findIndex(s=>s.num===sections[current].num),hasNext=position>=0&&position<list.length-1;
  $('#prevButton').disabled=position<=0;
  $('#nextButton').disabled=hasNext&&!state.done.includes(sections[current].num);
  $('#nextButton').textContent=hasNext?'Next topic →':'Back to overview';
}
function toggleDone(){const n=sections[current].num;if($('#completeCheck').checked&&!state.done.includes(n))state.done.push(n);else if(!$('#completeCheck').checked)state.done=state.done.filter(x=>x!==n);localStorage.setItem('forensics-done',JSON.stringify(state.done));updateProgress();renderSidebar();filter();updateTopicNavigation()}
function updateProgress(){const n=state.done.length,total=sections.length||30;$('#progressText').textContent=`${n} / ${total}`;$('#progressBar').style.width=`${n/total*100}%`}
function bind(){
  $('#topics').onclick=e=>{const b=e.target.closest('button');if(!b)return;b.hasAttribute('data-home')?showHome():b.hasAttribute('data-tutorial')?openTutorial(+b.dataset.tutorial):openTopic(+b.dataset.index)};
  $('#search').oninput=e=>{query=e.target.value.toLowerCase().trim();showHome()};
  $('#categorySelect').onchange=e=>{activeCategory=e.target.value;renderSidebar();showHome()};
  document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();$('#search').focus()}if(e.key==='Escape'){$('#search').value='';query='';showHome()}});
  $('#continueButton').onclick=()=>{const list=topicSequence(),target=list.find(s=>!state.done.includes(s.num))||list[0];if(target)openTopic(sections.indexOf(target))};
  $('#randomButton').onclick=()=>{const available=topicSequence().filter(isUnlocked);if(available.length){const target=available[Math.floor(Math.random()*available.length)];openTopic(sections.indexOf(target))}};$('#backButton').onclick=showHome;
  $('#prevButton').onclick=()=>{if(readerMode==='tutorial')return openTutorial(tutorialCurrent-1);const list=topicSequence(),position=list.findIndex(s=>s.num===sections[current].num);position>0&&openTopic(sections.indexOf(list[position-1]))};
  $('#nextButton').onclick=()=>{if(readerMode==='tutorial')return tutorialCurrent===tutorials.length-1?showHome():openTutorial(tutorialCurrent+1);const list=topicSequence(),position=list.findIndex(s=>s.num===sections[current].num);position===list.length-1?showHome():state.done.includes(sections[current].num)&&openTopic(sections.indexOf(list[position+1]))};
  $('#completeCheck').onchange=toggleDone;$('#menuButton').onclick=()=>document.body.classList.toggle('menu-open');
  $('#themeButton').onclick=()=>{document.body.classList.toggle('light');state.theme=document.body.classList.contains('light')?'light':'dark';localStorage.setItem('forensics-theme',state.theme)};
  $('#resetProgress').onclick=()=>{if(confirm('Reset all study progress?')){state.done=[];localStorage.removeItem('forensics-done');updateProgress();renderSidebar();filter()}};
}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Command copied')}catch{toast('Select and copy the command manually')}}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1300)}
function getSample(command){const key=Object.keys(sampleOutputs).sort((a,b)=>b.length-a.length).find(k=>command.toLowerCase().startsWith(k.toLowerCase()));return key?sampleOutputs[key]:''}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function attr(s){return esc(s).replace(/`/g,'&#96;')}
boot();
