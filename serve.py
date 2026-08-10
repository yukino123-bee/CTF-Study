#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

APP = Path(__file__).resolve().parent
os.chdir(APP)
server = ThreadingHTTPServer(("127.0.0.1", 8765), SimpleHTTPRequestHandler)
print("CTF Study: http://127.0.0.1:8765")
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
