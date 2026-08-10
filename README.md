# CTF Study

An offline study reference for preparing for CTF-style cybersecurity competitions.

## Project structure

```text
CTF Study/
├── index.html              # Application shell and page structure
├── serve.py                # Local development server
├── assets/
│   ├── css/
│   │   ├── styles.css      # Global layout and component styles
│   │   ├── outputs.css     # Sample-output presentation
│   │   └── tutorials.css   # Guided-tutorial presentation
│   └── js/
│       ├── app.js          # Application state, rendering and interaction
│       ├── outputs.js      # Command sample-output library
│       └── tutorials.js    # Hands-on tutorial content
└── data/
    ├── curriculum.js       # CTF category and topic curriculum
    ├── reference-guides.js # Per-category command and tool guides
    └── study.txt           # Original forensic study reference
```

## Run locally

```bash
python3 serve.py
```

Then open `http://127.0.0.1:8765`.

The HTTP server is required because browsers do not allow the application to fetch its study data reliably when `index.html` is opened directly from disk.

## Where to make changes

- Add or revise CTF curriculum topics in `data/curriculum.js`.
- Add commands, installation steps, and tool usage in `data/reference-guides.js`.
- Add guided labs in `assets/js/tutorials.js`.
- Add illustrative command output in `assets/js/outputs.js`.
- Change application behavior in `assets/js/app.js`.
- Change the visual system in `assets/css/styles.css`.
