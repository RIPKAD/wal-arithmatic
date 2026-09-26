const app = document.getElementById("app");

const state = {
  screen: "type", // type | op | level | play
  numberType: null,
  operation: null,
  levelId: null,
  problem: null,
  step: 0,
  filled: {},
  complete: false,
  firstTry: true,
  misses: 0,
  session: 0,
  streak: 0,
};

function resetPlay() {
  state.problem = generateProblem(state.levelId);
  state.step = 0;
  state.filled = {};
  state.complete = false;
  state.firstTry = true;
  state.misses = 0;
}

function go(screen) {
  state.screen = screen;
  render();
}

function render() {
  if (state.screen === "type") renderType();
  else if (state.screen === "op") renderOp();
  else if (state.screen === "level") renderLevel();
  else renderPlay();
}

function shell(inner) {
  app.innerHTML = inner;
}

function renderType() {
  shell(`
    <div class="top">
      <div class="brand">WAL Arithmetic</div>
    </div>
    <p class="eyebrow">Step 1 of 3</p>
    <h1 class="title">What kind of numbers?</h1>
    <p class="sub">Start with whole numbers. The other systems unlock after the addition spine is solid.</p>
    <div class="stack" style="margin-top:18px">
      ${NUMBER_TYPES.map((t) => card(t.label, t.enabled ? "Available now" : "Coming later", t.enabled, () => {})).join("")}
    </div>
  `);
  bindCards(NUMBER_TYPES, (t) => {
    state.numberType = t.id;
    go("op");
  });
}

function renderOp() {
  shell(`
    <div class="top">
      <button class="ghost" id="back">← Numbers</button>
      <div class="brand">WAL Arithmetic</div>
    </div>
    <p class="eyebrow">Step 2 of 3</p>
    <h1 class="title">Which operation?</h1>
    <p class="sub">Addition is complete. Subtraction starts with no regrouping.</p>
    <div class="stack" style="margin-top:18px">
      ${OPERATIONS.map((t) => card(t.label, t.enabled ? "Whole-number progression" : "Queued", t.enabled)).join("")}
    </div>
  `);
  document.getElementById("back").onclick = () => go("type");
  bindCards(OPERATIONS, (t) => {
    state.operation = t.id;
    go("level");
  });
}

function renderLevel() {
  const catalog = state.operation === "sub" ? SUBTRACTION_LEVELS : ADDITION_LEVELS;
  const groups = catalog.map((g) => {
    const items = g.items
      .map((item) => {
        const ready = item.status === "ready";
        return `
          <button class="card-btn" data-id="${item.id}" ${ready ? "" : "disabled"}>
            <div class="label">${item.title}</div>
            <div class="hint">${item.blurb}</div>
            <span class="badge ${ready ? "ready" : ""}">${ready ? "Play" : "Next to build"}</span>
          </button>`;
      })
      .join("");
    return `<div class="group-label">${g.group}</div><div class="stack">${items}</div>`;
  }).join("");

  shell(`
    <div class="top">
      <button class="ghost" id="back">← Operation</button>
      <div class="brand">WAL Arithmetic</div>
    </div>
    <p class="eyebrow">Step 3 of 3</p>
    <h1 class="title">${state.operation === "sub" ? "Subtraction level" : "Addition level"}</h1>
    <p class="sub">${state.operation === "sub" ? "1a and 2a are live — no regrouping yet." : "Whole-number addition is complete through three addends."}</p>
    ${groups}
  `);
  document.getElementById("back").onclick = () => go("op");
  app.querySelectorAll(".card-btn[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.levelId = btn.getAttribute("data-id");
      state.session = 0;
      state.streak = 0;
      resetPlay();
      go("play");
    });
  });
}

function card(label, hint, enabled) {
  return `
    <button class="card-btn" ${enabled ? "" : "disabled"}>
      <div class="label">${label}</div>
      <div class="hint">${hint}</div>
      ${enabled ? "" : '<span class="badge">Locked</span>'}
    </button>`;
}

function bindCards(items, onPick) {
  const buttons = app.querySelectorAll(".card-btn");
  items.forEach((item, i) => {
    if (!item.enabled) return;
    buttons[i].addEventListener("click", () => onPick(item));
  });
}

function cell(col, content, extraClass = "") {
  return `<div class="cell ${extraClass}">${content}</div>`;
}

function shouldShowZero(pv, col) {
  if (col === "ones") return true;
  if (col === "tens") return pv.tenthousands > 0 || pv.thousands > 0 || pv.hundreds > 0 || pv.tens > 0;
  if (col === "hundreds") return pv.tenthousands > 0 || pv.thousands > 0 || pv.hundreds > 0;
  if (col === "thousands") return pv.tenthousands > 0 || pv.thousands > 0;
  return pv.tenthousands > 0;
}

function renderAddendRow(pv, op) {
  const p = state.problem;
  const cells = p.columns.map((col) => {
    const show = shouldShowZero(pv, col) ? String(pv[col]) : pv[col] ? String(pv[col]) : "";
    return cell(col, show, "digit");
  }).join("");
  return `<div class="row cols-${p.columns.length}">
    <div class="op">${op}</div>
    ${cells}
  </div>`;
}

function renderCarryRow(activePlace) {
  const p = state.problem;
  if (!p.showCarry) return "";
  const cells = p.columns
    .map((col) => {
      const key =
        col === "tens"
          ? "carryTens"
          : col === "hundreds"
            ? "carryHundreds"
            : col === "thousands"
              ? "carryThousands"
              : col === "tenthousands"
                ? "carryTenThousands"
                : null;
      if (!key || !p.places.includes(key)) return cell(col, "", "carry-spacer");
      return `<div class="cell"><div class="slot carry ${slotClass(key, activePlace)}" id="slot-${key}">${state.filled[key] ?? ""}</div></div>`;
    })
    .join("");
  return `<div class="row cols-${p.columns.length} carry-row">
    <div class="op"></div>
    ${cells}
  </div>`;
}

function renderAnswerRow(activePlace) {
  const p = state.problem;
  const cells = p.columns
    .map((col) => {
      if (!p.places.includes(col)) return cell(col, "", "digit");
      return `<div class="cell"><div class="slot ${slotClass(col, activePlace)}" id="slot-${col}">${state.filled[col] ?? ""}</div></div>`;
    })
    .join("");
  return `<div class="row cols-${p.columns.length}">
    <div class="op"></div>
    ${cells}
  </div>`;
}

function renderHeaders() {
  const p = state.problem;
  if (p.columns.length === 1) return "";
  const cells = p.columns.map((col) => cell(col, PLACE_LABEL[col], "hdr")).join("");
  return `<div class="row cols-${p.columns.length} headers">
    <div class="op"></div>
    ${cells}
  </div>`;
}

function renderPlay() {
  const level = findLevel(state.levelId);
  const p = state.problem;
  const place = p.places[state.step];
  const prompt = state.complete ? "Problem complete." : p.prompts[place];

  const choices = state.complete
    ? `<div class="done">
         <h2>${state.misses === 0 ? "Clean." : "Got it."}</h2>
         <p>${p.addends.join(" " + (p.opSymbol || "+") + " ")} = ${p.result ?? p.sum}${state.misses ? " · " + state.misses + " miss" + (state.misses === 1 ? "" : "es") : ""}</p>
         <div class="actions">
           <button class="secondary" id="menu">Menu</button>
           <button class="primary" id="next">Next problem</button>
         </div>
       </div>`
    : `<div class="choices">
         ${p.choices[place].map((n) => `<button class="choice" data-n="${n}">${n}</button>`).join("")}
       </div>`;

  shell(`
    <div class="problem-head">
      <button class="ghost" id="menuTop">← Menu</button>
      <div class="level-chip">${level.title}</div>
    </div>
    <div class="board">
      <div class="prompt" id="prompt">${prompt}</div>
      <div class="column">
        ${renderHeaders()}
        ${renderCarryRow(place)}
        ${p.addendDigits
          .map((pv, i) => renderAddendRow(pv, i === p.addendDigits.length - 1 ? (p.opSymbol || "+") : ""))
          .join("")}
        <div class="rule cols-${p.columns.length}"></div>
        ${renderAnswerRow(place)}
      </div>
    </div>
    ${choices}
    <div class="meta">Problem ${state.session + 1} · streak ${state.streak}</div>
  `);

  const back = () => {
    go("level");
  };
  const menuTop = document.getElementById("menuTop");
  if (menuTop) menuTop.onclick = back;
  const menu = document.getElementById("menu");
  if (menu) menu.onclick = back;
  const next = document.getElementById("next");
  if (next) {
    next.onclick = () => {
      state.session += 1;
      resetPlay();
      render();
    };
  }
  app.querySelectorAll(".choice").forEach((btn) => {
    btn.addEventListener("click", () => onChoice(Number(btn.dataset.n), btn));
  });
}

function slotClass(name, activePlace) {
  if (state.filled[name] != null) return "filled pop";
  if (!state.complete && name === activePlace) return "active";
  return "";
}

function onChoice(n, btn) {
  const p = state.problem;
  const place = p.places[state.step];
  const correct = p.answers[place];
  if (n !== correct) {
    state.firstTry = false;
    state.misses += 1;
    btn.classList.add("wrong");
    const slot = document.getElementById("slot-" + place);
    if (slot) {
      slot.classList.add("shake");
      setTimeout(() => slot.classList.remove("shake"), 400);
    }
    document.getElementById("prompt").textContent = "Not that digit. Try again.";
    setTimeout(() => btn.classList.remove("wrong"), 400);
    return;
  }

  state.filled[place] = n;
  if (state.step < p.places.length - 1) {
    state.step += 1;
    render();
    return;
  }
  state.complete = true;
  if (state.misses === 0) state.streak += 1;
  else state.streak = 0;
  render();
}

render();
