const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const setCrumb=value=>{const element=$('#crumb');if(element)element.textContent=value};
let sections=[], commands=[], current=0, tutorialCurrent=0, readerMode='topic', query='', activeCategory='All Commands', activeDifficulty='All Levels', activeCommandGroup='All Command Categories';
const icons=['🗂','⌕','01','ⓘ','▣','📦','◆','◈','▧','♫','⌁','◉','▤','↺','▦','PDF','DOC','⊞','▥','▣','◎','✉','#','🔐','↔','QR','</>','▯','◷','✦'];
const categories=['All Commands','Forensics','General Skills','Cryptography','Web Exploitation','Networking','Reverse Engineering','Binary Exploitation'];
const categoryDescriptions={
  'Forensics':'Inspect files, disks, memory, metadata, network captures, and recovered artifacts.',
  'General Skills':'Build confidence with Linux, Python, archives, text processing, and everyday utilities.',
  'Cryptography':'Work with encodings, hashes, classical ciphers, encryption, and password challenges.',
  'Web Exploitation':'Inspect HTTP traffic and test authorized web applications, APIs, and input handling.',
  'Networking':'Explore hosts, ports, services, DNS, packets, and network communications.',
  'Reverse Engineering':'Examine compiled programs with disassemblers, decompilers, and debuggers.',
  'Binary Exploitation':'Study program protections, memory corruption, ROP, and exploit-development workflows.'
};
const categoryTopics={
  'Forensics':Array.from({length:30},(_,i)=>i+1),
  'General Skills':[],
  'Cryptography':[],
  'Web Exploitation':[31,32],
  'Networking':[],
  'Reverse Engineering':[],
  'Binary Exploitation':[]
};
const tutorialCategories={
  Wireshark:'Networking',TShark:'Networking',Ghidra:'Reverse Engineering',
  'John the Ripper':'Cryptography',Hashcat:'Cryptography',CyberChef:'Cryptography',
  '7-Zip':'General Skills'
};
const intermediateTools=new Set(['awk and cut','binwalk','foremost','sleuth kit','testdisk','tshark','john the ripper','stegseek','zsteg','ffuf','gobuster','nikto','sqlmap','nmap','openssl','pwntools','objdump','radare2','gdb']);
const advancedTools=new Set(['volatility 3','hashcat','ghidra','ropgadget','ropper','checksec','angr','ida','binary ninja']);
function difficultyFor(name,command=''){
  const normalized=searchable(name);
  if([...advancedTools].some(tool=>normalized.includes(tool)))return 'Advanced';
  if([...intermediateTools].some(tool=>normalized.includes(tool)))return 'Intermediate';
  const syntax=String(command);
  if(/\b(?:--?script|--?data|--?request|-exec|subprocess|hashlib|socket|struct)\b|[|].*[|]|&&.*&&/.test(syntax))return 'Intermediate';
  return 'Beginner';
}
function matchesDifficulty(item){return activeDifficulty==='All Levels'||item.difficulty===activeDifficulty}
function commandGroupFor(category,name,command='',use=''){
  const text=searchable(`${name} ${command} ${use}`);
  const has=pattern=>pattern.test(text);
  if(category==='Forensics'){
    if(has(/volatility|memory|memproc|process|ram/))return 'Memory Forensics';
    if(has(/wireshark|tshark|pcap|packet|network|tcp|dns/))return 'Network Forensics';
    if(has(/exif|metadata|timestamp/))return 'Metadata & Timelines';
    if(has(/steg|zsteg|image|png|audio|spectro/))return 'Steganography & Media';
    if(has(/foremost|photorec|testdisk|sleuth|autopsy|fls|icat|disk|carv|recover/))return 'Disk & Recovery';
    if(has(/strings|file|xxd|hex|binwalk|signature|archive|7z|unzip/))return 'File Triage & Extraction';
    return 'Artifact Analysis';
  }
  if(category==='Cryptography'){
    if(has(/john|hashcat|password|crack|wordlist/))return 'Password Recovery';
    if(has(/hash|md5|sha|digest/))return 'Hashing';
    if(has(/base64|base32|hex|encode|decode|cyberchef/))return 'Encoding & Decoding';
    if(has(/openssl|encrypt|decrypt|aes|rsa|key|certificate|tls/))return 'Encryption & Keys';
    return 'Ciphers & Analysis';
  }
  if(category==='Web Exploitation'){
    if(has(/gobuster|ffuf|dirsearch|hidden|directory|path/))return 'Content Discovery';
    if(has(/sqlmap|sql|injection|xss|idor|traversal|upload/))return 'Vulnerability Testing';
    if(has(/postman|api|jwt|json/))return 'API & Token Testing';
    if(has(/nmap|nikto|whatweb|wappalyzer|fingerprint|scan/))return 'Reconnaissance';
    if(has(/curl|wget|burp|zap|http|browser|devtools/))return 'HTTP Inspection';
    return 'Web Utilities';
  }
  if(category==='Networking'){
    if(has(/dig|nslookup|host|dns/))return 'DNS';
    if(has(/wireshark|tshark|tcpdump|pcap|packet/))return 'Packet Analysis';
    if(has(/nmap|port|service|scan/))return 'Host & Service Discovery';
    if(has(/nc|netcat|curl|wget|ssh|transfer|socket/))return 'Connections & Transfer';
    return 'Network Utilities';
  }
  if(category==='Reverse Engineering'){
    if(has(/gdb|debug|ltrace|strace|dynamic/))return 'Dynamic Analysis';
    if(has(/ghidra|ida|binary ninja|radare|objdump|disassembl|decompil/))return 'Static Analysis';
    if(has(/strings|file|readelf|nm|hexdump|xxd/))return 'Binary Triage';
    return 'Code & Binary Analysis';
  }
  if(category==='Binary Exploitation'){
    if(has(/rop|gadget|ropper/))return 'ROP & Gadgets';
    if(has(/gdb|pwndbg|gef|debug/))return 'Debugging';
    if(has(/checksec|readelf|elf|protection/))return 'Protections & ELF Triage';
    if(has(/pwntools|python|socket|pack|unpack/))return 'Exploit Scripting';
    return 'Memory Exploitation';
  }
  if(has(/python|pip|subprocess|hashlib/))return 'Python & Scripting';
  if(has(/grep| rg |awk|cut|sed|sort|head|tail|cat|less/))return 'Text Processing';
  if(has(/zip|unzip|tar|gzip|archive|7z/))return 'Archives & Compression';
  if(has(/curl|wget|nmap|nc|netcat|ssh|network/))return 'Networking';
  if(has(/pwd| ls | cd |mkdir|touch|cp |mv |rm |chmod|find/))return 'Files & Navigation';
  return 'Core Utilities';
}
const toolSetupGuides={
  linux:{label:'Linux',subtitle:'Native Linux workstation',intro:'Install terminal-first CTF utilities from your distribution package manager. These commands target Ubuntu, Debian, and Kali Linux.',groups:[
    {title:'Core command-line toolkit',description:'File inspection, archives, text processing, networking, metadata, and Python.',command:'sudo apt update && sudo apt install -y file binutils ripgrep unzip zip p7zip-full tar gzip bzip2 xz-utils curl wget git openssl python3 python3-pip netcat-openbsd nmap exiftool binwalk'},
    {title:'Password and steganography tools',description:'Common utilities for authorized CTF challenges.',command:'sudo apt install -y john hashcat steghide pngcheck'},
    {title:'Optional desktop capture tool',description:'Install Wireshark on a full Linux desktop. On headless systems or WSL, keep the GUI on your host computer.',command:'sudo apt install -y wireshark'}
  ],note:'Package names can differ outside Debian-based distributions. Use dnf on Fedora or pacman on Arch and confirm each package name.'},
  windows:{label:'Windows',subtitle:'Native Windows applications',intro:'Install graphical tools and Windows-native utilities on the Windows host. This is the right location for Burp Suite, Wireshark/Npcap, Ghidra, editors, and archive applications.',groups:[
    {title:'Core applications with WinGet',description:'Terminal, PowerShell, Git, Python, VS Code, 7-Zip, Nmap, and Wireshark. Run in PowerShell.',command:'winget install --id Microsoft.WindowsTerminal -e; winget install --id Microsoft.PowerShell -e; winget install --id Git.Git -e; winget install --id Python.Python.3.13 -e; winget install --id Microsoft.VisualStudioCode -e; winget install --id 7zip.7zip -e; winget install --id Insecure.Nmap -e; winget install --id WiresharkFoundation.Wireshark -e'},
    {title:'Burp Suite Community Edition',description:'Download the native Windows installer from PortSwigger, run it, then choose a temporary project and the default configuration.',link:'https://portswigger.net/burp/communitydownload',linkLabel:'Download Burp Suite'},
    {title:'Ghidra',description:'Download the official release, extract it to a tools folder, and launch ghidraRun.bat. A supported Java runtime is required.',link:'https://github.com/NationalSecurityAgency/ghidra/releases',linkLabel:'Download Ghidra'},
    {title:'Verify the terminal tools',description:'Open a new PowerShell terminal after installation and verify the commands.',command:'git --version; py --version; 7z; nmap --version'}
  ],note:'Install Wireshark with Npcap when prompted. Run unknown challenge executables only in Windows Sandbox or a disposable virtual machine.'},
  wsl:{label:'WSL',subtitle:'Linux terminal tools on Windows',intro:'Install Linux command-line tools inside Ubuntu or Kali WSL. Keep heavy GUI applications such as Burp Suite and Wireshark installed natively on Windows.',groups:[
    {title:'Update WSL Linux',description:'Run this inside the Ubuntu or Kali terminal.',command:'sudo apt update && sudo apt upgrade -y'},
    {title:'Install the CTF terminal toolkit',description:'Covers the majority of commands searchable in this hub.',command:'sudo apt install -y file binutils ripgrep unzip zip p7zip-full tar gzip bzip2 xz-utils curl wget git openssl python3 python3-pip netcat-openbsd nmap exiftool binwalk john hashcat steghide pngcheck'},
    {title:'Use Windows GUI tools alongside WSL',description:'Install Burp Suite, Wireshark, Ghidra, VS Code, and 7-Zip in Windows. Access Windows challenge files from WSL through /mnt/c.',command:'cd /mnt/c/Users'},
    {title:'Confirm the setup',description:'Check several representative tools inside WSL.',command:'file --version && python3 --version && nmap --version && unzip -v'}
  ],note:'WSL is suitable for ordinary CTF commands, but native Windows Wireshark/Npcap is better for packet capture. Wi-Fi monitor mode and direct hardware access remain limited.'}
};
const state={theme:localStorage.getItem('forensics-theme')||'dark'};
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
    const topic={i:-1,num:num++,category,title:title.toUpperCase(),tools,lesson:{title,summary,learn,practice,tools},lines:[`${title} — ${summary}`,`Learn: ${learn}`,`Practice: ${practice}`,`Recommended tools: ${tools}`]};
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
  commands=buildCommandIndex();
  $('#commandCount').textContent=commands.length;
  filter(); bind();
}
function topicsFor(category){return category==='All Commands'?sections:sections.filter(s=>(categoryTopics[category]||[]).includes(s.num))}
function topicSequence(){return topicsFor(activeCategory)}
function categoryFor(topic){return Object.entries(categoryTopics).find(([,numbers])=>numbers.includes(topic.num))?.[0]||'Forensics'}
function tutorialCategory(tutorial){return tutorialCategories[tutorial.name]||'Forensics'}
function buildCommandIndex(){
  const records=[];
  sections.forEach((topic,topicIndex)=>{
    const category=categoryFor(topic);
    if(topic.entries){
      topic.entries.forEach(entry=>{
        const [name,description,use,a,b,c]=entry,isTool=topic.kind==='tools';
        const command=isTool?(entry.length===6?b:a):a;
        records.push({name,description,use,command,output:isTool?(entry.length===6?c:b):b,category,topicIndex,difficulty:difficultyFor(name,command),commandGroup:commandGroupFor(category,name,command,use)});
      });
      return;
    }
    let tool=topic.title,description=`Command from ${topic.title}.`;
    topic.lines.forEach(raw=>{
      const heading=raw.match(/^([^—]+) — (.+)$/);
      if(heading){tool=heading[1].trim();description=heading[2].trim();return}
      const command=/^  \S/.test(raw)&&(/<[^>]+>|\s-{1,2}\w|\| | > |^[ ]{2}[.a-zA-Z]/).test(raw);
      if(!command)return;
      const text=raw.trim(),syntax=text.split(/\s{2,}/)[0];
      const use=`Use in ${topic.title.toLowerCase()} workflows.`;
      records.push({name:tool,description,use,command:syntax,output:getSample(syntax),category,topicIndex,difficulty:difficultyFor(tool,syntax),commandGroup:commandGroupFor(category,tool,syntax,use)});
    });
  });
  return records;
}
function searchable(value){return String(value).toLowerCase().replace(/[^a-z0-9+./_-]+/g,' ').trim()}
function exactSearchMatch(value){
  const needle=searchable(query);
  if(!needle)return true;
  const haystack=` ${searchable(value)} `;
  return needle.includes(' ')?haystack.includes(` ${needle} `):haystack.split(' ').includes(needle);
}
function groupCommandMatches(matches){
  const groups=new Map();
  matches.forEach(command=>{
    const key=`${command.category}|${searchable(command.name)}`;
    if(!groups.has(key))groups.set(key,{...command,sourceIndex:commands.indexOf(command),variants:[]});
    const group=groups.get(key);
    if(!group.variants.some(item=>item.command===command.command))group.variants.push(command);
  });
  return [...groups.values()];
}
function commandCard(c){
  return `<article class="command-result ${query?'search-match':''}" data-command-index="${c.sourceIndex}"><div class="command-result-head"><div><span class="num">${esc(c.category.toUpperCase())} · ${esc(c.difficulty.toUpperCase())}</span><h3>${esc(c.name)}</h3></div><button class="secondary open-reference" type="button">Full reference →</button></div><p><b>Description:</b> ${esc(c.description)}</p><p class="command-use"><b>Use it to:</b> ${esc(c.use)}</p><p class="command-label"><b>${c.variants.length===1?'Command':'Command variants'}:</b></p><div class="command-variants">${c.variants.map((variant,index)=>`<div class="command-variant"><span>${c.variants.length>1?`${index+1}. `:''}${esc(variant.use)}</span><div class="command" data-command="${attr(variant.command)}">${esc(variant.command)}<button class="copy" title="Copy command only">Copy</button></div>${variant.output?`<details class="variant-output"><summary>View sample output</summary><div class="sample-output"><span>SAMPLE OUTPUT · ILLUSTRATIVE</span><pre>${esc(variant.output)}</pre></div></details>`:''}</div>`).join('')}</div></article>`;
}
function filter(){
  const categoryFilters=$('#categoryCommandFilters'),categorySelected=activeCategory!=='All Commands';
  categoryFilters.hidden=!categorySelected;
  if(categorySelected){
    $('#categoryFilterTitle').textContent=activeCategory;
    $('#inlineDifficultySelect').value=activeDifficulty;
    const commandGroups=[...new Set(commands.filter(command=>command.category===activeCategory).map(command=>command.commandGroup))].sort();
    if(activeCommandGroup!=='All Command Categories'&&!commandGroups.includes(activeCommandGroup))activeCommandGroup='All Command Categories';
    $('#commandGroupSelect').innerHTML=['All Command Categories',...commandGroups].map(group=>`<option value="${attr(group)}" ${group===activeCommandGroup?'selected':''}>${esc(group)}</option>`).join('');
    if($('#categoryCommandSearch').value!==query)$('#categoryCommandSearch').value=query;
  }
  const matches=commands.filter(c=>(activeCategory==='All Commands'||c.category===activeCategory)&&matchesDifficulty(c)&&(activeCommandGroup==='All Command Categories'||c.commandGroup===activeCommandGroup)&&exactSearchMatch(`${c.name} ${c.command}`));
  const commandGroups=query?groupCommandMatches(matches):matches.map(command=>({...command,sourceIndex:commands.indexOf(command),variants:[command]}));
  const topicMatches=query?sections.map((s,i)=>({s,i,category:categoryFor(s)})).filter(({s,category})=>(activeCategory==='All Commands'||category===activeCategory)&&exactSearchMatch(s.title)):[];
  $('#filterStatus').textContent=query?`${topicMatches.length} topic${topicMatches.length!==1?'s':''} · ${commandGroups.length} tool${commandGroups.length!==1?'s':''} · ${matches.length} command${matches.length!==1?'s':''}`:`${matches.length} command${matches.length!==1?'s':''}`;
  const topicHtml=topicMatches.map(({s,i,category})=>`<article class="topic-card topic-search-result search-match" data-topic-index="${i}"><span class="num">${esc(category.toUpperCase())} · TOPIC ${String(s.num).padStart(2,'0')}</span><h3>${esc(s.title)}</h3><p>${esc(s.tools)}</p><span class="topic-open-label">Open topic →</span></article>`).join('');
  const categoryHtml=!query&&activeCategory==='All Commands'?categories.slice(1).map(category=>{
    const categoryCommands=commands.filter(command=>command.category===category);
    const levels=['Beginner','Intermediate','Advanced'].map(level=>`${categoryCommands.filter(command=>command.difficulty===level).length} ${level}`).join(' · ');
    return `<article class="topic-card category-card" data-category="${attr(category)}"><span class="num">CTF CATEGORY · ${categoryCommands.length} COMMANDS</span><h3>${esc(category)}</h3><p>${esc(categoryDescriptions[category])}</p><span class="category-levels">${esc(levels)}</span><span class="topic-open-label">Open category →</span></article>`;
  }).join(''):'';
  const commandHtml=categoryHtml?'':activeCategory!=='All Commands'?['Beginner','Intermediate','Advanced'].filter(level=>activeDifficulty==='All Levels'||level===activeDifficulty).map(level=>{
    const levelCommands=commandGroups.filter(command=>command.difficulty===level);
    if(!levelCommands.length)return '';
    const groups=[...new Set(levelCommands.map(command=>command.commandGroup))].sort();
    return `<div class="difficulty-heading"><span>${esc(level.toUpperCase())}</span><h3>${level} commands</h3><p>${levelCommands.length} command example${levelCommands.length!==1?'s':''} across ${groups.length} command categor${groups.length===1?'y':'ies'}</p></div>${groups.map(group=>{const groupedCommands=levelCommands.filter(command=>command.commandGroup===group);return `<div class="command-group-heading"><span>COMMAND CATEGORY</span><h4>${esc(group)}</h4><b>${groupedCommands.length}</b></div>${groupedCommands.map(commandCard).join('')}`}).join('')}`;
  }).join(''):commandGroups.map(commandCard).join('');
  $('#topicGrid').innerHTML=topicHtml+categoryHtml+commandHtml||'<div class="empty">No matching topics or commands. Try another name, task, tool, or keyword.</div>';
  $$('.category-card').forEach(card=>card.onclick=()=>{activeCategory=card.dataset.category;activeDifficulty='All Levels';activeCommandGroup='All Command Categories';filter();window.scrollTo({top:$('#topicGrid').offsetTop-90,behavior:'smooth'})});
  $$('.topic-search-result').forEach(card=>card.onclick=()=>openTopic(+card.dataset.topicIndex));
  $$('.command-result .copy').forEach(b=>b.onclick=e=>{e.stopPropagation();copyText(b.parentElement.dataset.command)});
  $$('.command-result .open-reference').forEach(b=>b.onclick=()=>openTopic(commands[+b.closest('.command-result').dataset.commandIndex].topicIndex));
  const labs=tutorials.map((t,i)=>({t,i})).filter(({t})=>(activeCategory==='All Commands'||tutorialCategory(t)===activeCategory)&&(activeDifficulty==='All Levels'||t.level===activeDifficulty)&&(t.name+' '+t.use+' '+t.steps.flat().join(' ')).toLowerCase().includes(query));
  $('#tutorialCount').textContent=`${labs.length} guided walkthrough${labs.length!==1?'s':''}`;
  $('.tutorial-heading').hidden=!labs.length;$('#tutorialGrid').hidden=!labs.length;
  $('#tutorialGrid').innerHTML=labs.map(({t,i})=>`<article class="topic-card lab-card" data-tutorial="${i}"><span class="num">PRACTICAL LAB · ${esc(t.level.toUpperCase())}</span><h3>${esc(t.name)}</h3><p>${esc(t.use)} · ${t.steps.length} guided steps</p></article>`).join('');
  $$('.lab-card').forEach(x=>x.onclick=()=>openTutorial(+x.dataset.tutorial));
}
function openTopic(i){
  readerMode='topic';
  current=Math.max(0,Math.min(i,sections.length-1)); const s=sections[current];
  $('#home').classList.remove('active');$('#wslGuide').classList.remove('active');$('#toolsGuide').classList.remove('active');$('#reader').classList.add('active');
  $('#readerNumber').textContent=`TOPIC ${String(s.num).padStart(2,'0')} · ${s.tools}`;
  $('#readerTitle').textContent=s.title;setCrumb(s.title);
  $('#readerBody').innerHTML=s.lesson?formatLesson(s):s.entries?formatReferenceEntries(s.entries):format(s.lines);updateTopicNavigation();
  $$('.copy').forEach(b=>b.onclick=()=>copyText(b.parentElement.dataset.command));
  window.scrollTo(0,0);document.body.classList.remove('menu-open');
}
function lessonCommands(topic){
  const wanted=topic.tools.split(',').map(searchable).filter(Boolean);
  const found=commands.filter(command=>wanted.some(tool=>exactToolMatch(command.name,tool))).filter((command,index,list)=>list.findIndex(item=>item.command===command.command)===index);
  return found.slice(0,6);
}
function exactToolMatch(name,tool){const a=searchable(name),b=searchable(tool);return a===b||a.split(' ').includes(b)||b.split(' ').includes(a)}
function lessonInstall(topic){
  const packages={pwd:'coreutils',ls:'coreutils',cd:'bash',find:'findutils',stat:'coreutils',grep:'grep',rg:'ripgrep',locate:'plocate',cut:'coreutils',sort:'coreutils',uniq:'coreutils',tr:'coreutils',awk:'gawk',sed:'sed',base64:'coreutils',xxd:'xxd',file:'file',unzip:'unzip','7z':'p7zip-full',tar:'tar',gzip:'gzip',python3:'python3',python:'python3',requests:'python3-requests',bash:'bash',shellcheck:'shellcheck',jq:'jq',xmllint:'libxml2-utils',git:'git',ssh:'openssh-client',nc:'netcat-openbsd',curl:'curl',wget:'wget',sha256sum:'coreutils',tmux:'tmux',openssl:'openssl',nmap:'nmap',exiftool:'libimage-exiftool-perl',binwalk:'binwalk',john:'john',hashcat:'hashcat',gdb:'gdb',objdump:'binutils',readelf:'binutils',strings:'binutils',strace:'strace',ltrace:'ltrace',gcc:'gcc',nasm:'nasm',ffuf:'ffuf',gobuster:'gobuster',dirsearch:'dirsearch',sqlmap:'sqlmap'};
  const names=topic.tools.split(',').map(searchable),selected=[...new Set(names.map(name=>packages[name]).filter(Boolean))];
  return selected.length?`sudo apt update && sudo apt install -y ${selected.join(' ')}`:'';
}
function formatLesson(topic){
  const lesson=topic.lesson,examples=lessonCommands(topic),install=lessonInstall(topic);
  const commandBlock=command=>`<div class="lesson-command"><h3>${esc(command.name)}</h3><p><b>Description:</b> ${esc(command.description)}</p><p><b>Use:</b> ${esc(command.use)}</p><div class="command" data-command="${attr(command.command)}">${esc(command.command)}<button class="copy" title="Copy command only">Copy</button></div>${command.output?`<div class="sample-output"><span>SAMPLE OUTPUT · ILLUSTRATIVE</span><pre>${esc(command.output)}</pre></div>`:''}</div>`;
  return `<div class="lesson-banner"><span>GUIDED TUTORIAL</span><h2>${esc(lesson.summary)}</h2><p>Designed for Ubuntu WSL and Debian-based Linux. Commands also work on Kali unless a package name differs.</p></div><section class="lesson-section"><div class="lesson-section-title"><span>01</span><div><h2>Learning objectives</h2><p>Understand the concepts before running tools.</p></div></div><ul class="lesson-objectives">${lesson.learn.split(',').map(item=>`<li>${esc(item.trim())}</li>`).join('')}</ul></section><section class="lesson-section"><div class="lesson-section-title"><span>02</span><div><h2>Prepare your environment</h2><p>Create an isolated workspace and preserve the original challenge files.</p></div></div><div class="command" data-command="mkdir -p ~/ctf/${attr(lesson.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))} &amp;&amp; cd ~/ctf/${attr(lesson.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))}">mkdir -p ~/ctf/${esc(lesson.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))} &amp;&amp; cd ~/ctf/${esc(lesson.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))}<button class="copy" title="Copy command only">Copy</button></div>${install?`<p class="command-label"><b>Install terminal tools:</b></p><div class="command" data-command="${attr(install)}">${esc(install)}<button class="copy" title="Copy command only">Copy</button></div>`:''}<div class="wsl-tip"><b>WSL users:</b> Windows files are under <code>/mnt/c</code>. Prefer working in <code>~/ctf</code> for better Linux tool performance, and copy challenge files into it first. Install GUI tools such as Burp Suite and Wireshark on Windows through Tools Setup.</div></section><section class="lesson-section"><div class="lesson-section-title"><span>03</span><div><h2>Commands and workflow</h2><p>Run these examples against copied files or authorized CTF targets. Replace every placeholder with your real value.</p></div></div>${examples.length?examples.map(commandBlock).join(''):`<div class="reference-notice">This lesson is concept-led. Use the recommended tools—${esc(lesson.tools)}—and consult their matching command references in the hub before beginning the exercise.</div>`}</section>${topic.category==='Web Exploitation'?formatWebInspectionGuide():''}<section class="lesson-section"><div class="lesson-section-title"><span>04</span><div><h2>Practice challenge</h2><p>Apply the workflow rather than memorizing a single command.</p></div></div><div class="practice-card"><b>Your task</b><p>${esc(lesson.practice)}</p><ol><li>Record the input files, target, and initial observations.</li><li>Choose the least invasive relevant command and save its output.</li><li>Validate the result with a second method or tool.</li><li>Write the exact commands and explain what each result means.</li></ol></div></section><section class="lesson-section"><div class="lesson-section-title"><span>05</span><div><h2>Completion checklist</h2><p>The tutorial is complete when you can reproduce and explain the result.</p></div></div><ul class="lesson-checklist"><li>□ I can explain: ${esc(lesson.learn)}.</li><li>□ I used only copied files or an authorized CTF target.</li><li>□ I replaced placeholders and understood every option.</li><li>□ I validated the result and recorded reproducible commands.</li><li>□ I can describe when the recommended tools are appropriate.</li></ul></section>`;
}
function formatWebInspectionGuide(){
  const steps=[
    ['Confirm scope','Write down the exact CTF hostname, allowed accounts and prohibited actions. Do not scan neighboring hosts or third-party services.','printf "Target: https://lab.example\nScope: lab.example only\n" > notes.txt'],
    ['Inspect the browser','Open DevTools. Check Elements and page source for comments; Sources for JavaScript and source maps; Application for cookies, local/session storage; and Network for XHR/fetch requests, parameters and responses.','Browser → F12 → Elements, Sources, Application, Network'],
    ['Save the initial response','Preserve headers and body so later findings are reproducible. Use the real authorized lab URL.','curl -sS -D headers.txt https://lab.example/ -o index.html'],
    ['Search downloaded source','Look for common flag shapes, comments, secrets, routes, API names and suspicious filenames. Adjust the flag prefix to the event format.','rg -ni "flag\\{|ctf\\{|secret|token|api|admin|backup|sourceMappingURL" index.html *.js'],
    ['Collect referenced JavaScript','List script URLs in DevTools or source, download only same-scope resources, then inspect readable strings and endpoints.',`rg -o 'src="[^"]+\\.js' index.html`],
    ['Inspect requests and responses','In Network, reload the page, filter Fetch/XHR, open each relevant request, and review URL, method, parameters, cookies, response and initiator. Use Copy as cURL for a reproducible baseline.','DevTools → Network → Fetch/XHR → request → Copy as cURL'],
    ['Replay safely with Burp','Proxy the authorized lab, send one request to Repeater, change one value at a time, and compare status, length, headers and body. Keep automatic active scanning off unless the rules permit it.','Burp → Proxy → HTTP history → Send to Repeater'],
    ['Discover content carefully','Use a small approved wordlist, conservative rate and explicit match/filter settings. Manually verify results; redirects and custom 404 pages cause false positives.','ffuf -w words.txt -u https://lab.example/FUZZ -rate 10 -fc 404'],
    ['Validate the flag','A candidate is not final until it matches the event format and came from the authorized challenge. Record its source and reproduce the minimal steps.','rg -o "[A-Za-z0-9_]+\\{[^}]+\\}" index.html *.js notes.txt'],
    ['Write the solve log','Record target, timestamp, observation, request or command, meaningful response difference and final flag location. Remove session tokens before sharing notes.','printf "Finding:\nCommand/request:\nEvidence:\nFlag location:\n" >> notes.txt']
  ];
  return `<section class="lesson-section web-inspection-guide"><div class="lesson-section-title"><span>WEB</span><div><h2>Tool usage and flag-inspection workflow</h2><p>A repeatable process for authorized web CTF challenges.</p></div></div><div class="web-workflow">${steps.map(([title,description,command],index)=>`<article><div class="web-workflow-number">${String(index+1).padStart(2,'0')}</div><div><h3>${esc(title)}</h3><p>${esc(description)}</p><div class="command" data-command="${attr(command)}">${esc(command)}<button class="copy" title="Copy command or UI path">Copy</button></div></div></article>`).join('')}</div><div class="reference-notice"><b>Where flags commonly appear:</b> HTML comments, JavaScript strings, source maps, JSON/API responses, hidden but in-scope routes, cookies or storage in intentionally vulnerable labs, response headers, downloaded files, and server responses revealed after solving the intended weakness. Never treat unrelated credentials or third-party data as a flag.</div></section>`;
}
function openTutorial(i){
  readerMode='tutorial';tutorialCurrent=Math.max(0,Math.min(i,tutorials.length-1));const t=tutorials[tutorialCurrent];
  $('#home').classList.remove('active');$('#wslGuide').classList.remove('active');$('#toolsGuide').classList.remove('active');$('#reader').classList.add('active');
  $('#readerNumber').textContent=`HANDS-ON LAB ${String(tutorialCurrent+1).padStart(2,'0')} · ${t.level.toUpperCase()}`;
  $('#readerTitle').textContent=t.name;setCrumb(`TUTORIAL / ${t.name}`);
  $('#readerBody').innerHTML=`<div class="tutorial-intro"><b>Used for</b><p>${esc(t.use)}</p><b>Before you begin</b><p>${esc(t.setup)}</p><div class="output-warning">Outputs below are realistic training examples. Your filenames, hashes, timestamps, counts, offsets, addresses, and versions will differ.</div></div>`+t.steps.map((s,n)=>`<article class="tutorial-step"><div class="step-number">${n+1}</div><div><h3>${esc(s[0])}</h3><p class="interpret"><b>Description:</b> ${esc(s[3])}</p><p class="command-label"><b>Command:</b></p><div class="command" data-command="${attr(s[1])}">${esc(s[1])}<button class="copy" title="Copy command only">Copy</button></div><div class="sample-output"><span>ACTUAL-STYLE SAMPLE OUTPUT</span><pre>${esc(s[2])}</pre></div></div></article>`).join('');
  $('#prevButton').disabled=tutorialCurrent===0;$('#nextButton').textContent=tutorialCurrent===tutorials.length-1?'Back to overview':'Next tutorial →';
  $$('.copy').forEach(b=>b.onclick=()=>copyText(b.parentElement.dataset.command));window.scrollTo(0,0);document.body.classList.remove('menu-open');
}
function format(lines){
  let html='', block=false;
  const close=()=>{if(block){html+='</div>';block=false}};
  for(const raw of lines){const line=raw.trimEnd();if(!line.trim())continue;
    const tool=line.match(/^([^—]+) — (.+)$/);
    const command=/^  \S/.test(raw)&&(/<[^>]+>|\s-{1,2}\w|\| | > |^[ ]{2}[.a-zA-Z]/).test(raw);
    if(tool){close();html+=`<div class="study-block"><h3>${esc(tool[1].trim())}</h3><p>${esc(tool[2])}</p>`;block=true}
    else if(command){const parts=line.trim().split(/\s{2,}/),copy=parts.shift(),description=parts.join(' ').trim(),sample=getSample(copy);html+=`${description?`<p class="command-description"><b>Description:</b> ${esc(description)}</p>`:''}<p class="command-label"><b>Command:</b></p><div class="command" data-command="${attr(copy)}">${esc(copy)}<button class="copy" title="Copy command only">Copy</button></div>${sample?`<div class="sample-output"><span>SAMPLE OUTPUT · ILLUSTRATIVE</span><pre>${esc(sample)}</pre></div>`:''}`}
    else {if(!block){html+='<div class="study-block">';block=true} const cls=/^(Note|Tip|Caution|Security|Important|Recovery|Offset)/i.test(line)?'note':'';html+=`<p class="${cls}">${esc(line)}</p>`}
  } close(); return html;
}
function formatReferenceEntries(entries){
  const topic=sections[current],isTools=topic.kind==='tools';
  return `<div class="reference-notice">Install commands target Debian, Ubuntu, or Kali unless noted. Confirm packages for your operating system. Use security tools only on systems you own or have permission to assess.</div>`+entries.map(entry=>{
    let [name,explanation,use,a,b,c]=entry,install='',command=a,output=b;
    if(isTools){install=entry.length===6?a:(webToolInstallations[name]||'Use the official project documentation for your platform.');command=entry.length===6?b:a;output=entry.length===6?c:b}
    return `<article class="study-block reference-entry"><h3>${esc(name)}</h3><p><b>Description:</b> ${esc(explanation)}</p><p><b>Use:</b> ${esc(use)}</p>${isTools?`<p class="install-label"><b>Install:</b></p><div class="command" data-command="${attr(install)}">${esc(install)}<button class="copy" title="Copy installation command only">Copy</button></div><p class="use-label"><b>Command:</b></p>`:'<p class="command-label"><b>Command:</b></p>'}<div class="command" data-command="${attr(command)}">${esc(command)}<button class="copy" title="Copy command only">Copy</button></div><div class="sample-output"><span>SAMPLE OUTPUT · ILLUSTRATIVE</span><pre>${esc(output||'Command completed successfully.')}</pre></div></article>`
  }).join('');
}
function showHome(){
  $('#reader').classList.remove('active');$('#wslGuide').classList.remove('active');$('#toolsGuide').classList.remove('active');$('#home').classList.add('active');setCrumb('HOME');
  filter();window.scrollTo(0,0);
}
function showWslGuide(){
  closeMobilePanels();$('#home').classList.remove('active');$('#reader').classList.remove('active');$('#toolsGuide').classList.remove('active');$('#wslGuide').classList.add('active');setCrumb('WSL SETUP');
  $$('#wslGuide .copy').forEach(button=>button.onclick=()=>copyText(button.parentElement.dataset.command));
  window.scrollTo(0,0);setMobileNav('home');
}
function showToolsGuide(platform){
  const guide=toolSetupGuides[platform];if(!guide)return;
  closeMobilePanels();$('#toolsSetupMenu').open=false;$('#home').classList.remove('active');$('#reader').classList.remove('active');$('#wslGuide').classList.remove('active');$('#toolsGuide').classList.add('active');setCrumb(`TOOLS / ${guide.label.toUpperCase()}`);
  $('#toolsGuideBody').innerHTML=`<div class="tools-guide-hero"><p class="eyebrow">TOOLS SETUP · ${esc(guide.label.toUpperCase())}</p><h1>${esc(guide.label)} CTF setup</h1><h2>${esc(guide.subtitle)}</h2><p>${esc(guide.intro)}</p></div><div class="platform-tabs">${Object.entries(toolSetupGuides).map(([key,item])=>`<button class="${key===platform?'active':''}" data-guide-tab="${key}">${esc(item.label)}</button>`).join('')}</div><div class="tool-setup-grid">${guide.groups.map((group,index)=>`<article class="tool-setup-card"><span class="num">SETUP ${String(index+1).padStart(2,'0')}</span><h2>${esc(group.title)}</h2><p>${esc(group.description)}</p>${group.command?`<div class="command" data-command="${attr(group.command)}">${esc(group.command)}<button class="copy" title="Copy command only">Copy</button></div>`:''}${group.link?`<a class="primary setup-link" href="${attr(group.link)}" target="_blank" rel="noopener noreferrer">${esc(group.linkLabel)} ↗</a>`:''}</article>`).join('')}</div><div class="reference-notice"><b>Important:</b> ${esc(guide.note)}</div>`;
  $$('#toolsGuide .copy').forEach(button=>button.onclick=()=>copyText(button.parentElement.dataset.command));
  $$('#toolsGuide [data-guide-tab]').forEach(button=>button.onclick=()=>showToolsGuide(button.dataset.guideTab));window.scrollTo(0,0);setMobileNav('home');
}
function closeMobilePanels(){document.body.classList.remove('menu-open','mobile-search-open')}
function setMobileNav(){}
function updateTopicNavigation(){
  const list=topicSequence(),position=list.findIndex(s=>s.num===sections[current].num),hasNext=position>=0&&position<list.length-1;
  $('#prevButton').disabled=position<=0;
  $('#nextButton').disabled=false;
  $('#nextButton').textContent=hasNext?'Next topic →':'Back to overview';
}
function bind(){
  $('#homeBrandButton').onclick=()=>{activeCategory='All Commands';activeDifficulty='All Levels';activeCommandGroup='All Command Categories';query='';$('#search').value='';$('#categoryCommandSearch').value='';showHome()};
  $('#search').oninput=e=>{
    query=e.target.value.toLowerCase().trim();
    $('#reader').classList.remove('active');$('#wslGuide').classList.remove('active');$('#toolsGuide').classList.remove('active');$('#home').classList.add('active');setCrumb('HOME');
    filter();
    if(query)requestAnimationFrame(()=>$('#topicGrid').scrollIntoView({block:'start'}));
    else window.scrollTo(0,0);
  };
  $('#search').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();closeMobilePanels();setMobileNav('search');$('#search').blur();requestAnimationFrame(()=>$('#topicGrid').scrollIntoView({behavior:'smooth',block:'start'}))}};
  $('#inlineDifficultySelect').onchange=e=>{activeDifficulty=e.target.value;filter()};
  $('#commandGroupSelect').onchange=e=>{activeCommandGroup=e.target.value;filter()};
  $('#categoryCommandSearch').oninput=e=>{query=e.target.value.toLowerCase().trim();$('#search').value=e.target.value;filter()};
  $('#allCategoriesButton').onclick=()=>{activeCategory='All Commands';activeDifficulty='All Levels';activeCommandGroup='All Command Categories';query='';$('#search').value='';$('#categoryCommandSearch').value='';filter();window.scrollTo({top:$('#topicGrid').offsetTop-90,behavior:'smooth'})};
  document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();$('#search').focus()}if(e.key==='Escape'){$('#search').value='';query='';showHome()}});
  $('#browseCommandsButton').onclick=()=>{$('#search').focus();$('#topicGrid').scrollIntoView({behavior:'smooth',block:'start'})};
  $('#wslGuideButton').onclick=showWslGuide;$('#wslBackButton').onclick=showHome;$('#toolsBackButton').onclick=showHome;
  $('#toolsSetupMenu').onclick=e=>{const button=e.target.closest('[data-tools-platform]');if(button)showToolsGuide(button.dataset.toolsPlatform)};
  $('#randomButton').onclick=()=>{const available=commands.filter(c=>(activeCategory==='All Commands'||c.category===activeCategory)&&matchesDifficulty(c));if(available.length){const target=available[Math.floor(Math.random()*available.length)];query=target.name.toLowerCase();$('#search').value=target.name;filter();$('#topicGrid').scrollIntoView({behavior:'smooth',block:'start'})}};$('#backButton').onclick=showHome;
  $('#prevButton').onclick=()=>{if(readerMode==='tutorial')return openTutorial(tutorialCurrent-1);const list=topicSequence(),position=list.findIndex(s=>s.num===sections[current].num);position>0&&openTopic(sections.indexOf(list[position-1]))};
  $('#nextButton').onclick=()=>{if(readerMode==='tutorial')return tutorialCurrent===tutorials.length-1?showHome():openTutorial(tutorialCurrent+1);const list=topicSequence(),position=list.findIndex(s=>s.num===sections[current].num);position===list.length-1?showHome():openTopic(sections.indexOf(list[position+1]))};
  $('#themeButton').onclick=()=>{document.body.classList.toggle('light');state.theme=document.body.classList.contains('light')?'light':'dark';localStorage.setItem('forensics-theme',state.theme)};
}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Command copied')}catch{toast('Select and copy the command manually')}}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1300)}
function getSample(command){const key=Object.keys(sampleOutputs).sort((a,b)=>b.length-a.length).find(k=>command.toLowerCase().startsWith(k.toLowerCase()));return key?sampleOutputs[key]:''}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function attr(s){return esc(s).replace(/`/g,'&#96;')}
boot();
