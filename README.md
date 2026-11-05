# Jayaraman Research Group — website

A static redesign of [jayaraman.engr.tamu.edu](https://jayaraman.engr.tamu.edu/) for GitHub Pages, including an AI research-assistant page backed by a RAG over Dr. Jayaraman's corpus.

No build step: plain HTML, CSS, and JavaScript.

```
index.html          Home
jayaraman.html      PI biography
research.html       Research areas + searchable publications
people.html         Staff, postdocs, and students
news.html           Lab news
chat.html           "Ask the Lab AI" chatbot page
assets/css/style.css
assets/js/layout.js        Shared header/footer/nav (edit NAV here)
assets/js/publications.js  Research areas + publication data
assets/js/rag-config.js    ← RAG endpoint + adapter (the only file to edit for the chatbot)
assets/js/chat.js          Chat UI
assets/img/                Photos
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repo (e.g. `jayaraman-lab`) and push this folder to `main`.
2. In the repo: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. The site will be live at `https://<username>.github.io/jayaraman-lab/`.

## Connecting the RAG chatbot

GitHub Pages only serves static files, so the RAG must run on a separate server you control
(FastAPI/Flask, Cloud Run, Render, a Hugging Face Space, a Cloudflare Worker, …).
**Never put an API key in this repo** — everything here is public.

1. Open `assets/js/rag-config.js` and set `endpoint` to your server URL.
2. By default the page sends:

   ```http
   POST <endpoint>
   Content-Type: application/json

   { "question": "…", "history": [{ "role": "user", "content": "…" }, { "role": "assistant", "content": "…" }] }
   ```

   and expects:

   ```json
   {
     "answer": "Markdown answer text, may cite [1] …",
     "sources": [{ "title": "Ding et al. 2024, eLife", "url": "https://…", "snippet": "…" }]
   }
   ```

   `sources` is optional. If your API uses different field names, edit the mapping at the bottom of `askRag()` in the same file.
3. Allow CORS on your server for your Pages origin (`https://<username>.github.io`).

Example FastAPI wrapper around an existing RAG:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["https://<username>.github.io"],
                   allow_methods=["POST"], allow_headers=["*"])

class Ask(BaseModel):
    question: str
    history: list[dict] = []

@app.post("/chat")
def chat(req: Ask):
    answer, docs = my_rag.query(req.question, req.history)   # ← your existing pipeline
    return {"answer": answer,
            "sources": [{"title": d.title, "url": d.url, "snippet": d.text[:300]} for d in docs]}
```

Tip: link straight to a question with `chat.html?q=What+is+AhR%3F`.

## Updating content

- **Publications:** add an entry to the right area in `assets/js/publications.js` (add `doi` to link the title to the paper; otherwise it links to a Google Scholar search).
- **People / news:** edit `people.html` / `news.html` directly (copy an existing card).
- **Navigation:** edit the `NAV` list in `assets/js/layout.js`.
