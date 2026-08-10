const categoryReferences={
  'General Skills':{
    commands:[
      ['find','Search directory trees by name, type, size, owner, or time.','Locate challenge files even when their names are misleading.','find . -type f -iname "*flag*"','./backup/.flag.txt'],
      ['grep / rg','Search files or piped output for text and regular-expression patterns.','Find flags, secrets, URLs, errors, or code references quickly.','rg -ni "flag|password|secret" .','src/config.js:12:const secret = "training-only";'],
      ['awk and cut','Select fields and transform line-oriented data.','Extract columns from logs, CSV-like files, and command results.','awk -F: \'{print $1}\' /etc/passwd | head','root\nbin\ndaemon'],
      ['sort and uniq','Order data and count or remove repeated lines.','Summarize repeated indicators, usernames, hosts, or values.','sort access.log | uniq -c | sort -nr | head','42 192.0.2.10\n17 192.0.2.25'],
      ['base64 and xxd','Convert Base64, hexadecimal, and raw byte representations.','Peel common encoding layers in beginner CTF challenges.','printf "%s" "4354460a" | xxd -r -p','CTF'],
      ['python3','Run quick scripts for decoding, parsing, requests, and automation.','Automate any repetitive operation and preserve a reproducible solution.','python3 -c "print(bytes.fromhex(\'435446\').decode())"','CTF']
    ],
    tools:[
      ['Git','Version-control system used to inspect source history and recover deleted content.','Review commits, branches, diffs, and repository objects.','sudo apt install git','git log --oneline --all','a1b2c3d (HEAD -> main) Remove debug secret'],
      ['Visual Studio Code','Editor with integrated terminal, search, debugging, and extensions.','Organize challenge files and search large source trees.','sudo snap install code --classic','code ./challenge','Opening workspace: challenge'],
      ['CyberChef','Visual pipeline for encoding, decoding, compression, hashes, and byte transformations.','Test reversible transformations while keeping a visible recipe.','Use the hosted version or download the release from the official CyberChef repository.','From Hex → input 435446','CTF'],
      ['tmux','Terminal multiplexer that keeps multiple shells and long-running tasks organized.','Maintain separate panes for notes, listeners, debuggers, and scripts.','sudo apt install tmux','tmux new -s ctf','[ctf] 0:bash*']
    ]
  },
  'Cryptography':{
    commands:[
      ['openssl dgst','Calculate and verify cryptographic file digests.','Confirm integrity or identify expected hash results.','openssl dgst -sha256 message.txt','SHA2-256(message.txt)= 185f8d...'],
      ['openssl enc','Encrypt or decrypt data using supported symmetric ciphers.','Reproduce AES operations when the key, IV, and mode are known.','openssl enc -d -aes-256-cbc -in secret.bin -out plain.txt -K <hex-key> -iv <hex-iv>',''],
      ['openssl s_client','Inspect a remote TLS handshake and certificate chain.','Collect certificate fields and negotiated TLS parameters.','openssl s_client -connect example.com:443 -servername example.com','Protocol: TLSv1.3\nVerify return code: 0 (ok)'],
      ['hashid','Estimate a hash algorithm from digest format and length.','Narrow the candidates before using a cracking tool.','hashid 5d41402abc4b2a76b9719d911017c592','[+] MD5'],
      ['john','Test supplied hashes or protected files against candidate passwords.','Recover intentionally weak challenge passwords with an authorized wordlist.','john --wordlist=words.txt hashes.txt','1g 0:00:00:00 DONE'],
      ['hashcat','Run optimized dictionary, mask, and rule attacks against known hash modes.','Test an authorized challenge hash after identifying its exact format.','hashcat -m 0 hashes.txt words.txt','Status...........: Cracked']
    ],
    tools:[
      ['OpenSSL','General cryptographic and TLS command-line toolkit.','Inspect certificates, calculate hashes, and reproduce cipher operations.','sudo apt install openssl','openssl version','OpenSSL 3.x.x'],
      ['John the Ripper','Password-auditing suite with converters for many protected formats.','Convert a challenge archive or document to a hash and test candidates.','sudo apt install john','john --list=formats | head','descrypt, bsdicrypt, md5crypt, ...'],
      ['Hashcat','GPU-capable password-recovery and hash-testing tool.','Run fast authorized attacks when the hash mode is known.','sudo apt install hashcat','hashcat --example-hashes | head','MODE: 0  TYPE: MD5'],
      ['RsaCtfTool','Collection of attacks against deliberately weak RSA keys and parameters.','Automate checks for common RSA mistakes in CTF inputs.','pipx install git+https://github.com/RsaCtfTool/RsaCtfTool','RsaCtfTool --publickey key.pem --private','Testing key key.pem...'],
      ['SageMath','Mathematics environment with finite fields, number theory, and algebra.','Implement modular, RSA, discrete-log, and elliptic-curve solvers.','sudo apt install sagemath','sage -c "print(inverse_mod(3, 11))"','4']
    ]
  },
  'Networking':{
    commands:[
      ['ip','Inspect interfaces, addresses, routes, and neighbors on Linux.','Understand the local network context before analyzing connectivity.','ip -brief address','lo UNKNOWN 127.0.0.1/8\neth0 UP 192.0.2.20/24'],
      ['dig','Query specific DNS record types with detailed control.','Investigate A, AAAA, MX, NS, TXT, and CNAME clues.','dig example.com TXT +short','"v=spf1 -all"'],
      ['nc / netcat','Open raw TCP/UDP connections or listeners.','Interact manually with text-based challenge services.','nc challenge.example 31337','Welcome. Send the decoded token:'],
      ['tcpdump','Capture or inspect packets from the command line.','Triage a PCAP or record scoped lab traffic without a GUI.','tcpdump -nn -r capture.pcap port 53','12:00:01 IP 192.0.2.5.53000 > 192.0.2.53.53: A? example.com'],
      ['tshark','Use Wireshark dissectors and filters in scripts.','Extract fields or conversations repeatedly from packet captures.','tshark -r capture.pcap -Y dns -T fields -e dns.qry.name','example.com'],
      ['nmap','Discover hosts, ports, services, and versions within an authorized scope.','Build the initial service inventory for a network challenge.','nmap -sV -p- scanme.nmap.org','22/tcp open ssh\n80/tcp open http']
    ],
    tools:[
      ['Wireshark','Graphical packet analyzer with protocol dissection and stream reconstruction.','Filter PCAPs, follow streams, inspect fields, and export transferred objects.','sudo apt install wireshark','wireshark capture.pcap','Frame 1: Ethernet II → IPv4 → TCP'],
      ['Nmap','Network discovery and service-enumeration scanner.','Identify exposed services on authorized hosts.','sudo apt install nmap','nmap -sV scanme.nmap.org','PORT STATE SERVICE VERSION'],
      ['Zeek','Network-analysis framework that converts traffic into structured activity logs.','Create searchable connection, DNS, HTTP, TLS, and file records from a PCAP.','sudo apt install zeek','zeek -r capture.pcap','conn.log  dns.log  http.log'],
      ['NetworkMiner','Graphical network-forensics tool focused on hosts, sessions, files, and credentials.','Quickly extract artifacts and reconstruct sessions from a training PCAP.','Download the release from the official NetworkMiner site; Linux use requires Mono.','NetworkMiner.exe capture.pcap','Hosts: 4  Sessions: 12  Files: 3']
    ]
  },
  'Reverse Engineering':{
    commands:[
      ['file','Identify executable format, architecture, linking, and stripping status.','Perform the first triage step before choosing analysis tools.','file challenge','challenge: ELF 64-bit LSB pie executable, x86-64, dynamically linked'],
      ['strings','Extract printable sequences from binary data.','Find messages, filenames, URLs, keys, and obvious validation text.','strings -n 6 challenge | head','Correct!\nTry again'],
      ['readelf','Inspect ELF headers, sections, symbols, relocations, and dynamic metadata.','Understand executable structure without running it.','readelf -h challenge','Class: ELF64\nMachine: Advanced Micro Devices X86-64'],
      ['objdump','Disassemble code and display executable metadata.','Review machine instructions and function boundaries from the terminal.','objdump -d -M intel challenge | less','0000000000001139 <main>:'],
      ['ltrace','Record calls to dynamically linked library functions.','Reveal comparisons, string operations, and library behavior quickly.','ltrace ./challenge','strcmp("guess", "secret") = -12'],
      ['strace','Record system calls, signals, and file interactions.','Discover files, subprocesses, network calls, and runtime failures.','strace -f ./challenge','openat(AT_FDCWD, "config.dat", O_RDONLY) = 3']
    ],
    tools:[
      ['Ghidra','Decompiler and static-analysis suite for many architectures and formats.','Recover functions, cross-references, control flow, and approximate high-level logic.','sudo apt install ghidra, or download the official release and run ghidraRun.','ghidraRun','Ghidra project window opened'],
      ['GDB','Native debugger for breakpoints, stepping, registers, and memory.','Confirm static-analysis hypotheses while a binary executes.','sudo apt install gdb','gdb ./challenge','Reading symbols from ./challenge...'],
      ['pwndbg','GDB enhancement with exploitation-focused context and commands.','Improve register, stack, heap, disassembly, and address inspection.','Clone the official pwndbg repository, then run its setup.sh installer.','gdb ./challenge','pwndbg> context'],
      ['radare2','Command-line reverse-engineering framework with analysis and patching features.','Inspect functions, strings, graphs, and bytes in a terminal workflow.','sudo apt install radare2','r2 -A ./challenge','[0x00001050]> afl'],
      ['Detect It Easy','File-type, compiler, packer, and protector identification utility.','Recognize packed or unusual binaries before deeper analysis.','Install the official Detect It Easy package or release for your platform.','diec challenge','ELF64 | Compiler: GCC']
    ]
  },
  'Binary Exploitation':{
    commands:[
      ['checksec','Report executable mitigations such as NX, PIE, canaries, and RELRO.','Choose an exploitation strategy appropriate to the binary protections.','checksec --file=./challenge','RELRO: Partial RELRO\nCanary: No canary found\nNX: Enabled\nPIE: No PIE'],
      ['cyclic','Generate and search unique patterns for exact crash offsets.','Measure how many bytes reach a saved control value.','pwn cyclic 100','aaaabaaacaaadaaae...'],
      ['gdb run and info registers','Execute a crashing binary and inspect its processor state.','Confirm control and understand where invalid data was used.','gdb -q ./challenge','Program received signal SIGSEGV'],
      ['readelf symbols','Locate functions and imported symbols in an ELF file.','Find candidate ret2win functions and understand linkage.','readelf -s challenge | rg " win| main"','34: 0000000000401166 42 FUNC GLOBAL DEFAULT 14 win'],
      ['ROPgadget','Search executable regions for short instruction sequences ending in return.','Build ROP chains when injected code cannot execute.','ROPgadget --binary challenge --only "pop|ret"','0x0000000000401233 : pop rdi ; ret'],
      ['pwn template','Generate a pwntools exploit-script starting point.','Start with consistent local/remote handling and ELF metadata.','pwn template ./challenge > exploit.py','']
    ],
    tools:[
      ['pwntools','Python framework for processes, sockets, packing, ELF parsing, assembly, and ROP.','Build repeatable local and remote exploit scripts.','python3 -m pip install --user pwntools, preferably inside a virtual environment.','python3 -c "from pwn import *; print(context.arch)"','i386'],
      ['GDB','Debugger used to reproduce crashes and inspect control flow and memory.','Determine offsets, addresses, arguments, and runtime behavior.','sudo apt install gdb','gdb -q ./challenge','Reading symbols from ./challenge...'],
      ['pwndbg','Exploitation-focused GDB interface with stack, heap, ROP, and mapping helpers.','Accelerate binary triage and crash investigation.','Clone the official pwndbg repository, then run setup.sh.','gdb ./challenge','pwndbg> checksec'],
      ['GEF','Single-script GDB enhancement for architecture, memory, heap, and exploit analysis.','Use as a lightweight alternative to pwndbg.','Download gef.py from the official GEF repository and source it from ~/.gdbinit.','gdb ./challenge','gef➤  checksec'],
      ['ROPgadget','Gadget finder supporting common executable formats and architectures.','Locate instruction sequences for return-oriented programming.','python3 -m pip install --user ROPgadget','ROPgadget --binary challenge | head','0x000000000040101a : ret'],
      ['Ghidra','Static-analysis suite useful for recovering vulnerable program logic.','Understand buffer sizes, function calls, and hidden target functions.','sudo apt install ghidra, or install the official release.','ghidraRun','Ghidra project window opened']
    ]
  },
  'Forensics':{
    commands:[
      ['sha256sum','Calculate a strong digest for evidence integrity checks.','Record a baseline before analysis and verify copies afterward.','sha256sum evidence.img','8f14e45f...  evidence.img'],
      ['file and stat','Identify content and inspect filesystem metadata without trusting extensions.','Triage unknown files and record timestamps, size, and permissions.','file suspect.bin && stat suspect.bin','suspect.bin: PNG image data\nSize: 8421'],
      ['strings','Extract printable text from files, images, and memory dumps.','Find URLs, commands, usernames, messages, and flag fragments.','strings -a -n 6 evidence.bin | head','user@example.test\nflag{...}'],
      ['exiftool','Read and write metadata across many media and document formats.','Recover timestamps, software names, GPS fields, comments, and embedded previews.','exiftool image.jpg','File Type: JPEG\nCreate Date: 2026:08:10 12:00:00'],
      ['binwalk','Detect signatures and embedded objects inside binary files.','Find appended archives, firmware sections, and hidden payloads.','binwalk evidence.bin','DECIMAL HEXADECIMAL DESCRIPTION\n1024 0x400 Zip archive data'],
      ['tshark','Extract protocol fields and conversations from packet captures.','Automate network-forensics triage and build timelines.','tshark -r traffic.pcap -q -z io,phs','Protocol Hierarchy Statistics']
    ],
    tools:[
      ['ExifTool','Metadata parser supporting images, documents, audio, video, and many specialist formats.','Inspect timestamps, software, location, comments, and embedded metadata.','sudo apt install libimage-exiftool-perl','exiftool evidence.jpg','File Type: JPEG\nMIME Type: image/jpeg'],
      ['The Sleuth Kit','Command-line filesystem-forensics collection for images and partitions.','List deleted entries, inspect filesystems, and extract artifacts by metadata address.','sudo apt install sleuthkit','fls -r evidence.img | head','r/r 4: $AttrDef\nr/r 5: $Boot'],
      ['Autopsy','Graphical case-management and disk-forensics application built around ingest modules.','Analyze disk images, timelines, web artifacts, hashes, and deleted files.','Install the official Autopsy release; Linux users may use the packaged version where available.','autopsy','Autopsy Forensic Browser started'],
      ['Volatility 3','Memory-forensics framework for Windows, Linux, and macOS images.','Enumerate processes, network state, modules, handles, and other volatile artifacts.','python3 -m pip install --user volatility3, preferably inside a virtual environment.','vol -f memory.raw windows.info','Variable Value\nKernel Base 0xf800...'],
      ['Wireshark','Graphical packet-analysis and network-forensics application.','Reconstruct sessions, filter protocols, and export transferred objects.','sudo apt install wireshark','wireshark traffic.pcap','Packets: 1248  Displayed: 1248'],
      ['Binwalk','Signature scanner and extraction assistant for embedded data and firmware.','Locate nested or appended files in suspicious binary containers.','sudo apt install binwalk','binwalk evidence.bin','1024 0x400 Zip archive data']
    ]
  }
};
