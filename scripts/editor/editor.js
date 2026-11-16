/* ---------------------------------------------------------------------------
   Portfolio content editor (client).

   Vanilla JS, no framework. Loads the content from the local server, renders a
   form per content type, and writes changes back. Two-step publishing: Save
   writes app/content/site.json on disk; Publish commits that plus any uploaded
   images and pushes, so Vercel rebuilds the live site.

   Typing updates the in-memory model only (no re-render), so focus is never
   lost mid-field; structural changes (add / remove / move / upload) re-render.
--------------------------------------------------------------------------- */

let state = null;
let active = "profile";
let dirty = false;

/* ---- tiny DOM helper ---- */
function h(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : String(v));
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return e;
}

const api = async (path, method = "GET", body) => {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
};

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

/* ---- status + dirty tracking ---- */
function setStatus(text, kind = "") {
  const el = document.getElementById("status");
  el.textContent = text;
  el.dataset.kind = kind;
}
function markDirty() {
  dirty = true;
  setStatus("Unsaved changes. Click Save.", "dirty");
  document.getElementById("publish").disabled = true;
}

/* ---- field builders ---- */
function textField(label, value, oninput, opts = {}) {
  const input = h(opts.textarea ? "textarea" : "input", { type: opts.type || "text" });
  input.value = value ?? "";
  if (opts.placeholder) input.placeholder = opts.placeholder;
  input.addEventListener("input", () => oninput(input.value));
  return h("div", { class: "field" }, h("label", {}, label), input);
}

function selectField(label, value, options, onchange) {
  const sel = h("select");
  for (const o of options) {
    const opt = h("option", { value: o.value }, o.label);
    if (o.value === value) opt.selected = true;
    sel.append(opt);
  }
  sel.addEventListener("change", () => onchange(sel.value));
  return h("div", { class: "field" }, h("label", {}, label), sel);
}

function monthField(label, value, oninput, opts = {}) {
  const input = h("input", { type: "month" });
  input.value = value || "";
  if (opts.disabled) input.disabled = true;
  input.addEventListener("input", () => oninput(input.value));
  return h("div", { class: "field" }, h("label", {}, label), input);
}

function checkboxRow(label, checked, onchange) {
  const cb = h("input", { type: "checkbox" });
  cb.checked = !!checked;
  cb.addEventListener("change", () => onchange(cb.checked));
  return h("label", { class: "check" }, cb, h("span", {}, label));
}

function imageField(label, kind, current, onset) {
  const preview = current
    ? h("img", { src: current, alt: "" })
    : h("div", { class: "thumb__none" }, "no image");
  const file = h("input", { type: "file", accept: kind === "resume" ? "application/pdf" : "image/*" });
  file.style.display = "none";
  file.addEventListener("change", async () => {
    const f = file.files[0];
    if (!f) return;
    setStatus("Uploading " + f.name + "…");
    try {
      const dataUrl = await readAsDataURL(f);
      const r = await api("/api/upload", "POST", { kind, name: f.name, dataUrl });
      if (r.ok) {
        onset(r.path);
        markDirty();
        render();
        setStatus("Uploaded to " + r.path + ". Remember to Save.", "dirty");
      } else {
        setStatus(r.error || "Upload failed", "err");
      }
    } catch (err) {
      setStatus(String(err), "err");
    }
  });
  const pick = h("button", { class: "btn btn--small", onclick: () => file.click() }, current ? "Replace" : "Upload");
  const clear = current
    ? h("button", { class: "btn btn--small btn--danger", onclick: () => { onset(""); markDirty(); render(); } }, "Remove")
    : null;
  return h("div", { class: "field" }, h("label", {}, label), h("div", { class: "thumb" }, preview, pick, clear, file));
}

/* A removable, addable chip list (stack items, tools). */
function chipList(items, { onRemove, onAdd, placeholder }) {
  const box = h("div", { class: "chips" });
  items.forEach((label, i) =>
    box.append(
      h("span", { class: "chip" }, label, h("button", { title: "Remove", onclick: () => { onRemove(i); markDirty(); render(); } }, "×")),
    ),
  );
  const input = h("input", { type: "text", placeholder: placeholder || "Add…" });
  input.style.maxWidth = "180px";
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      onAdd(input.value.trim());
      markDirty();
      render();
    }
  });
  box.append(input);
  return box;
}

/* Up/down controls for an item at index i within array arr. */
function reorder(arr, i) {
  return {
    onUp: () => { if (i > 0) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; markDirty(); render(); } },
    onDown: () => { if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; markDirty(); render(); } },
    upDisabled: i === 0,
    downDisabled: i === arr.length - 1,
  };
}

function cardShell(opts, ...body) {
  const { title, onRemove, move } = opts;
  const actions = h("div", { class: "card__actions" });
  if (move) {
    actions.append(
      h("button", { class: "btn btn--small", disabled: move.upDisabled, title: "Move up", onclick: move.onUp }, "↑"),
      h("button", { class: "btn btn--small", disabled: move.downDisabled, title: "Move down", onclick: move.onDown }, "↓"),
    );
  }
  if (onRemove) actions.append(h("button", { class: "btn btn--small btn--danger", onclick: onRemove }, "Take down"));
  return h(
    "div",
    { class: "card" },
    h("div", { class: "card__row" }, h("span", { class: "card__title" }, title), actions),
    ...body,
  );
}

function panelHead(title, desc) {
  return h("div", { class: "panel__head" }, h("h1", {}, title), desc ? h("p", {}, desc) : null);
}

function addButton(label, onclick) {
  return h("button", { class: "btn btn--add", onclick }, "+ " + label);
}

/* ---- per-tab renderers ---- */
function renderProfile(panel) {
  const p = state.profile;
  panel.append(panelHead("Profile", "Your name, handles, resume, and the links in the Contact section."));

  panel.append(
    h("div", { class: "card" },
      h("div", { class: "grid2" },
        textField("Name", p.name, (v) => { p.name = v; markDirty(); }),
        textField("Handle", p.handle, (v) => { p.handle = v; markDirty(); }),
        textField("Email", p.email, (v) => { p.email = v; markDirty(); }, { type: "email" }),
        textField("Location", p.location, (v) => { p.location = v; markDirty(); }),
        textField("Blog URL", p.blog, (v) => { p.blog = v; markDirty(); }, { type: "url" }),
        textField("Resume path", p.resume, (v) => { p.resume = v; markDirty(); }, { placeholder: "/resume-....pdf" }),
      ),
      imageField("Resume PDF", "resume", p.resume, (path) => { p.resume = path; }),
    ),
  );

  panel.append(h("div", { class: "sectionlabel" }, "Links"));
  p.links.forEach((l, i) => {
    panel.append(
      cardShell({ title: l.label || "Link", onRemove: () => { p.links.splice(i, 1); markDirty(); render(); }, move: reorder(p.links, i) },
        h("div", { class: "grid2" },
          textField("Label", l.label, (v) => { l.label = v; markDirty(); }),
          textField("Handle shown", l.handle, (v) => { l.handle = v; markDirty(); }),
        ),
        textField("URL", l.href, (v) => { l.href = v; markDirty(); }, { type: "url" }),
        l.icon ? null : h("p", { class: "hint" }, "No logo for this link (new links show without an icon)."),
      ),
    );
  });
  panel.append(addButton("Add link", () => { p.links.push({ label: "", handle: "", href: "", icon: "" }); markDirty(); render(); }));
}

function renderExperience(panel) {
  panel.append(panelHead("Experience", "Roles you held. Pick start and end months; tick Current for an ongoing role (shows “to present”)."));
  state.experience.forEach((e, i) => {
    panel.append(
      cardShell({ title: e.role || "Role", onRemove: () => { state.experience.splice(i, 1); markDirty(); render(); }, move: reorder(state.experience, i) },
        h("div", { class: "grid2" },
          textField("Role", e.role, (v) => { e.role = v; markDirty(); }),
          textField("Organisation", e.org, (v) => { e.org = v; markDirty(); }),
        ),
        h("div", { class: "grid2" },
          monthField("Start (month / year)", e.start, (v) => { e.start = v; markDirty(); }),
          e.current
            ? h("div", { class: "field" }, h("label", {}, "End"), h("div", { class: "muted" }, "present"))
            : monthField("End (month / year)", e.end, (v) => { e.end = v; markDirty(); }),
        ),
        checkboxRow("Current role (show “to present”)", e.current, (v) => { e.current = v; if (v) e.end = ""; markDirty(); render(); }),
        textField("Note", e.note, (v) => { e.note = v; markDirty(); }, { textarea: true }),
      ),
    );
  });
  panel.append(addButton("Add experience", () => { state.experience.push({ role: "", org: "", start: "", end: "", current: false, note: "" }); markDirty(); render(); }));
}

function renderProjects(panel) {
  panel.append(panelHead("Projects", 'Mark a project "Shipped" to flag it as complete; "In progress" shows a quieter badge.'));
  state.projects.forEach((pr, i) => {
    const linksBox = h("div", {});
    pr.links.forEach((l, li) => {
      linksBox.append(
        h("div", { class: "card__row" },
          textField("Link label", l.label, (v) => { l.label = v; markDirty(); }),
          textField("Link URL", l.href, (v) => { l.href = v; markDirty(); }, { type: "url" }),
          h("button", { class: "btn btn--small btn--danger", onclick: () => { pr.links.splice(li, 1); markDirty(); render(); } }, "×"),
        ),
      );
    });

    panel.append(
      cardShell({ title: pr.title || "Project", onRemove: () => { state.projects.splice(i, 1); markDirty(); render(); }, move: reorder(state.projects, i) },
        h("div", { class: "grid2" },
          textField("Title", pr.title, (v) => { pr.title = v; markDirty(); }),
          textField("Index", pr.index, (v) => { pr.index = v; markDirty(); }, { placeholder: "P.01" }),
          textField("Kind", pr.kind, (v) => { pr.kind = v; markDirty(); }, { placeholder: "Tool / Advisory…" }),
          selectField("Status", pr.status, [
            { value: "Shipped", label: "Shipped (complete)" },
            { value: "In progress", label: "In progress" },
          ], (v) => { pr.status = v; markDirty(); }),
        ),
        textField("Summary (one line)", pr.summary, (v) => { pr.summary = v; markDirty(); }),
        textField("Detail", pr.detail, (v) => { pr.detail = v; markDirty(); }, { textarea: true }),
        h("div", { class: "field" }, h("label", {}, "Stack"),
          chipList(pr.stack, {
            onRemove: (k) => pr.stack.splice(k, 1),
            onAdd: (v) => pr.stack.push(v),
            placeholder: "Add tool, Enter",
          }),
        ),
        h("div", { class: "field" }, h("label", {}, "Links"), linksBox,
          h("button", { class: "btn btn--small", onclick: () => { pr.links.push({ label: "", href: "" }); markDirty(); render(); } }, "+ Add link"),
        ),
        imageField("Preview image", "work", pr.image, (path) => { pr.image = path; }),
      ),
    );
  });
  panel.append(addButton("Add project", () => {
    state.projects.push({ index: "", title: "", kind: "", status: "In progress", summary: "", detail: "", stack: [], links: [], image: "" });
    markDirty(); render();
  }));
}

/* Toolbox chips: shows each tool's logo when it has one, and when you add a
   tool it asks the server to resolve a logo automatically. */
function skillChips(group) {
  const box = h("div", { class: "chips" });
  group.skills.forEach((s, i) => {
    const chip = h("span", { class: "chip" + (s.icon ? " chip--icon" : "") });
    if (s.icon) {
      const NS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("width", "13");
      svg.setAttribute("height", "13");
      svg.setAttribute("fill", "currentColor");
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", s.icon);
      svg.append(p);
      chip.append(svg);
    }
    chip.append(document.createTextNode(s.label));
    chip.append(h("button", { title: "Remove", onclick: () => { group.skills.splice(i, 1); markDirty(); render(); } }, "×"));
    box.append(chip);
  });
  const input = h("input", { type: "text", placeholder: "Add tool, Enter" });
  input.style.maxWidth = "200px";
  input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter" || !input.value.trim()) return;
    const label = input.value.trim();
    input.disabled = true;
    setStatus("Looking up a logo for " + label + "…");
    let icon = null;
    try {
      const r = await api("/api/resolve-icon", "POST", { label });
      if (r.ok && r.icon) icon = r.icon;
    } catch { /* stays a chip */ }
    group.skills.push(icon ? { label, icon } : { label });
    markDirty();
    render();
    setStatus(icon ? `Added ${label} with its logo.` : `Added ${label} as a text chip (no logo exists for it).`, "dirty");
  });
  box.append(input);
  return box;
}

function renderToolbox(panel) {
  panel.append(panelHead("Toolbox", "Tools grouped by what you do with them. New tools show as a plain chip (no logo) by design."));
  state.skills.forEach((g, gi) => {
    panel.append(
      cardShell({ title: g.heading || "Group", onRemove: () => { state.skills.splice(gi, 1); markDirty(); render(); }, move: reorder(state.skills, gi) },
        h("div", { class: "grid2" },
          textField("Heading", g.heading, (v) => { g.heading = v; markDirty(); }),
          textField("Blurb", g.blurb, (v) => { g.blurb = v; markDirty(); }),
        ),
        h("div", { class: "field" }, h("label", {}, "Tools"),
          skillChips(g),
          h("p", { class: "hint" }, "Add a tool and its logo is fetched automatically when the brand exists; otherwise it shows as a clean text chip (no invented logos). Removing a tool takes it off the site."),
        ),
      ),
    );
  });
  panel.append(addButton("Add group", () => { state.skills.push({ heading: "", blurb: "", skills: [] }); markDirty(); render(); }));
}

const CERT_BUCKETS = [
  { key: "held", label: "Held (complete)" },
  { key: "inProgress", label: "In progress" },
  { key: "planned", label: "Planned" },
];

function renderCerts(panel) {
  panel.append(panelHead("Certifications", 'Change "Status" to move a cert between columns. "Held" is the complete/earned column.'));
  for (const bucket of CERT_BUCKETS) {
    panel.append(h("div", { class: "sectionlabel" }, bucket.label));
    state.certs[bucket.key].forEach((c, i) => {
      panel.append(
        cardShell({ title: c.name || "Certificate", onRemove: () => { state.certs[bucket.key].splice(i, 1); markDirty(); render(); }, move: reorder(state.certs[bucket.key], i) },
          h("div", { class: "grid2" },
            textField("Name", c.name, (v) => { c.name = v; markDirty(); }),
            textField("Issuer", c.issuer, (v) => { c.issuer = v; markDirty(); }),
          ),
          selectField("Status", bucket.key, CERT_BUCKETS.map((b) => ({ value: b.key, label: b.label })), (v) => {
            if (v === bucket.key) return;
            state.certs[bucket.key].splice(i, 1);
            state.certs[v].push(c);
            markDirty(); render();
          }),
          imageField("Certificate image", "certs", c.image, (path) => { c.image = path; }),
        ),
      );
    });
    panel.append(addButton("Add to " + bucket.label.split(" (")[0], () => { state.certs[bucket.key].push({ name: "", issuer: "", image: "" }); markDirty(); render(); }));
  }
}

function renderWriting(panel) {
  panel.append(panelHead("Writing", 'Set a post to "Published" to make it live and linkable. Paste the direct post URL into Link.'));
  state.posts.forEach((p, i) => {
    panel.append(
      cardShell({ title: p.title || "Post", onRemove: () => { state.posts.splice(i, 1); markDirty(); render(); }, move: reorder(state.posts, i) },
        textField("Title", p.title, (v) => { p.title = v; markDirty(); }),
        textField("Note", p.note, (v) => { p.note = v; markDirty(); }, { textarea: true }),
        h("div", { class: "grid2" },
          selectField("Status", p.status, [
            { value: "Published", label: "Published (complete)" },
            { value: "In progress", label: "In progress" },
            { value: "Planned", label: "Planned" },
          ], (v) => { p.status = v; markDirty(); }),
          textField("Link (direct post URL)", p.href, (v) => { p.href = v; markDirty(); }, { type: "url", placeholder: "https://0xK4M1.hashnode.dev/…" }),
        ),
      ),
    );
  });
  panel.append(addButton("Add post", () => { state.posts.push({ title: "", note: "", status: "Planned", href: "", image: "" }); markDirty(); render(); }));
}

const TABS = [
  { id: "profile", label: "Profile", render: renderProfile },
  { id: "experience", label: "Experience", render: renderExperience },
  { id: "projects", label: "Projects", render: renderProjects },
  { id: "toolbox", label: "Toolbox", render: renderToolbox },
  { id: "certs", label: "Certifications", render: renderCerts },
  { id: "writing", label: "Writing", render: renderWriting },
];

function renderTabs() {
  const nav = document.getElementById("tabs");
  nav.innerHTML = "";
  for (const t of TABS) {
    nav.append(
      h("button", {
        class: "tab",
        "aria-selected": t.id === active ? "true" : "false",
        onclick: () => { active = t.id; render(); },
      }, t.label),
    );
  }
}

function render() {
  renderTabs();
  const panel = document.getElementById("panel");
  panel.innerHTML = "";
  TABS.find((t) => t.id === active).render(panel);
  window.scrollTo({ top: 0 });
}

/* ---- save / publish ---- */
async function refreshPublish() {
  const r = await api("/api/git-status");
  const btn = document.getElementById("publish");
  btn.disabled = !(r.ok && r.pending);
}

async function save() {
  setStatus("Saving…");
  const r = await api("/api/save", "POST", state);
  if (r.ok) {
    dirty = false;
    setStatus("Saved to site.json", "ok");
    await refreshPublish();
  } else {
    setStatus(r.error || "Save failed", "err");
  }
}

async function publish() {
  if (dirty && !confirm("You have unsaved changes. Publish will ship the last SAVED version. Continue?")) return;
  if (!confirm("Publish commits your content and images and pushes to GitHub. Vercel will rebuild the live site. Continue?")) return;
  setStatus("Publishing…");
  const r = await api("/api/publish", "POST", {});
  if (r.ok) {
    setStatus("Published. Vercel is rebuilding, live in about a minute.", "ok");
    document.getElementById("publish").disabled = true;
  } else if (r.step === "nothing") {
    setStatus("Nothing to publish. Save a change first.", "dirty");
  } else {
    setStatus("Publish failed at " + r.step + ": " + (r.out || "").split("\n")[0], "err");
    console.warn(r.out);
  }
}

async function boot() {
  try {
    state = await api("/api/content");
  } catch {
    setStatus("Could not load content. Is the editor server running?", "err");
    return;
  }
  render();
  setStatus("Loaded.");
  await refreshPublish();
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("publish").addEventListener("click", publish);
  window.addEventListener("beforeunload", (e) => {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });
}

boot();
