// Chat UI. Talks to the backend only through window.askRag (see rag-config.js).
document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.RAG_CONFIG;
  const connected = Boolean(cfg.endpoint);
  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");
  const status = document.getElementById("rag-status");
  const history = [];
  let busy = false;

  status.textContent = connected ? "Connected to research corpus" : "Not connected yet";
  status.classList.add(connected ? "ok" : "off");

  // ---- Suggestions ----
  const sugHost = document.getElementById("suggestions");
  cfg.suggestions.forEach((q) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "suggestion";
    b.textContent = q;
    b.addEventListener("click", () => ask(q));
    sugHost.append(b);
  });

  // ---- Minimal, safe Markdown ----
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inline = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const markdown = (text) =>
    text.trim().split(/\n{2,}/).map((block) => {
      const lines = block.split("\n");
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    }).join("");

  // ---- Rendering ----
  const clearEmpty = () => document.getElementById("chat-empty")?.remove();
  const scroll = () => (log.scrollTop = log.scrollHeight);

  const addUser = (text) => {
    clearEmpty();
    const el = document.createElement("div");
    el.className = "msg user";
    el.innerHTML = `<div class="bubble">${esc(text)}</div>`;
    log.append(el);
    scroll();
  };

  const addBot = () => {
    const el = document.createElement("div");
    el.className = "msg bot";
    el.innerHTML = `<div class="avatar" aria-hidden="true">J</div><div class="bubble"><span class="typing" aria-label="Thinking"><i></i><i></i><i></i></span></div>`;
    log.append(el);
    scroll();
    return el.querySelector(".bubble");
  };

  const sourcesHTML = (sources) => {
    if (!sources?.length) return "";
    const items = sources.map((s, i) => {
      const title = s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title);
      const snip = s.snippet ? `<div class="muted" style="font-size:0.78rem">${esc(s.snippet.slice(0, 220))}${s.snippet.length > 220 ? "…" : ""}</div>` : "";
      return `<div class="source"><span class="n">${i + 1}</span><div>${title}${snip}</div></div>`;
    }).join("");
    return `<div class="sources"><b>Sources</b>${items}</div>`;
  };

  // ---- Ask ----
  async function ask(question) {
    question = question.trim();
    if (!question || busy) return;
    busy = true;
    send.disabled = true;
    input.value = "";
    autosize();
    addUser(question);
    const bubble = addBot();

    try {
      if (!connected) {
        await new Promise((r) => setTimeout(r, 500));
        throw Object.assign(new Error("not-connected"), { quiet: true });
      }
      const { answer, sources } = await window.askRag(question, history.slice(-cfg.maxHistory));
      bubble.innerHTML = markdown(answer || "_No answer returned._") + sourcesHTML(sources);
      history.push({ role: "user", content: question }, { role: "assistant", content: answer });
    } catch (err) {
      bubble.classList.add("error");
      bubble.innerHTML = err.quiet
        ? "<p>The research assistant isn't connected to its knowledge base yet. Once the RAG endpoint is configured in <code>assets/js/rag-config.js</code>, answers grounded in Dr. Jayaraman's publications will appear here.</p>"
        : `<p>Sorry — something went wrong reaching the assistant (${esc(err.message)}). Please try again.</p>`;
    } finally {
      busy = false;
      send.disabled = !input.value.trim();
      scroll();
      input.focus();
    }
  }

  // ---- Composer ----
  const autosize = () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 180) + "px";
  };
  input.addEventListener("input", () => { autosize(); send.disabled = busy || !input.value.trim(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); }
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });

  const preset = new URLSearchParams(location.search).get("q");
  if (preset) ask(preset);
});
