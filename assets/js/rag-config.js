// ============================================================================
//  RAG CONNECTION — the only file you need to edit to plug in your backend.
// ============================================================================
//
//  GitHub Pages is static and PUBLIC: never put an API key in this file.
//  Point `endpoint` at your own server (FastAPI, Flask, Cloud Run, a
//  Cloudflare Worker, Hugging Face Space, etc.) that holds the keys,
//  runs retrieval over Dr. Jayaraman's corpus, and returns an answer.
//  Remember to enable CORS on that server for your github.io origin.
//
//  Leave `endpoint` empty to show the page in "not connected" mode.

window.RAG_CONFIG = {
  endpoint: "",                      // e.g. "https://your-rag-api.example.com/chat"
  assistantName: "Lab AI",
  maxHistory: 10,                    // prior messages sent with each question
  suggestions: [
    "How does the bacterial signal indole affect the gut and E. coli chemotaxis?",
    "What is the role of the aryl hydrocarbon receptor in colon health?",
    "What did the indole-3-acetate study find about fatty liver?",
    "How does the lab study microbiologically influenced corrosion?",
  ],
};

// ----------------------------------------------------------------------------
//  askRag(question, history) → Promise<{ answer, sources }>
//
//    question: string
//    history:  [{ role: "user" | "assistant", content: string }, ...]
//
//  Must resolve to:
//    answer:  string (simple Markdown is rendered: **bold**, *italic*,
//             `code`, lists, [links](url), and [1]-style citations)
//    sources: optional array of { title, url?, snippet? }
//
//  The default below POSTs JSON  { question, history }  and expects JSON back
//  shaped like the above. If your API uses different field names, adapt the
//  mapping at the bottom — that's the only change usually needed.
// ----------------------------------------------------------------------------
window.askRag = async function (question, history) {
  const res = await fetch(window.RAG_CONFIG.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history }),
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  const data = await res.json();

  return {
    answer: data.answer ?? data.response ?? data.output ?? "",
    sources: (data.sources ?? data.documents ?? []).map((s) =>
      typeof s === "string" ? { title: s } : { title: s.title ?? s.source ?? "Source", url: s.url, snippet: s.snippet ?? s.text }
    ),
  };
};
