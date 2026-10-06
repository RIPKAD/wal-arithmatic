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
    <p class="sub">Whole-number + − × are in. Division starts with one-digit facts.</p>
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
  const catalog =
    state.operation === "sub"
      ? SUBTRACTION_LEVELS
      : state.operation === "mul"
        ? MULTIPLICATION_LEVELS
        : state.operation === "div"
          ? DIVISION_LEVELS
          : ADDITION_LEVELS;
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
    <h1 class="title">${
      state.operation === "sub"
        ? "Subtraction level"
        : state.operation === "mul"
          ? "Multiplication level"
          : state.operation === "div"
            ? "Division level"
            : "Addition level"
    }</h1>
    <p class="sub">${
      state.operation === "sub"
        ? "Whole-number subtraction through group 4."
        : state.operation === "mul"
          ? "Whole-number multiplication through group 6."
          : state.operation === "div"
            ? "Start with one-digit ÷ one-digit, no remainder."
            : "Whole-number addition is complete through three addends."
    }</p>
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
  if (col === "thousands") return (pv.hundredthousands || 0) > 0 || pv.tenthousands > 0 || pv.thousands > 0;
  if (col === "tenthousands") return (pv.hundredthousands || 0) > 0 || pv.tenthousands > 0;
  return (pv.hundredthousands || 0) > 0;
}

function joinKeyFor(p, col) {
  const joins = p.joinSlots || p.onesJoin || {};
  return joins[col] || null;
}

function shouldShowJoin(p, joinKey, activePlace) {
  if (!joinKey) return false;
  const hideAfter = p.joinHideWhen && p.joinHideWhen[joinKey];
  if (hideAfter && state.filled[hideAfter] != null) return false;
  if (state.filled[joinKey] != null) return true;
  if (activePlace === joinKey) return true;
  const after = p.joinAfter && p.joinAfter[joinKey];
  if (after && state.filled[after] != null) return true;
  return false;
}

function renderJoinMark(joinKey, activePlace) {
  const val = state.filled[joinKey];
  const cls = [
    "borrow-mark",
    val != null ? "filled" : "",
    !state.complete && activePlace === joinKey ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<div class="${cls}" id="slot-${joinKey}">${val != null ? val : ""}</div>`;
}

function renderAddendRow(pv, op, isMinuend, activePlace) {
  const p = state.problem;
  const cells = p.columns.map((col) => {
    let show = shouldShowZero(pv, col) ? String(pv[col]) : pv[col] ? String(pv[col]) : "";
    const joinKey = isMinuend ? joinKeyFor(p, col) : null;
    const newKey = isMinuend && p.borrowFrom && p.borrowFrom[col];
    const openedThenLent =
      !!newKey &&
      state.filled[newKey] != null &&
      p.joinHideWhen &&
      joinKey &&
      p.joinHideWhen[joinKey] === newKey;
    if (openedThenLent) show = "10";
    const struck = newKey && state.filled[newKey] != null ? " struck" : "";
    const extra = openedThenLent ? " wide" : "";
    const onBorrow = p.joinOnBorrow && p.joinOnBorrow[col];
    if (joinKey && !onBorrow && shouldShowJoin(p, joinKey, activePlace)) {
      return `<div class="cell minuend-place">
        ${renderJoinMark(joinKey, activePlace)}
        <div class="digit${struck}${extra}">${show}</div>
      </div>`;
    }
    return cell(col, show, "digit" + struck + extra);
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

function renderBorrowRow(activePlace) {
  const p = state.problem;
  if (!p.showBorrow || !p.borrowSlots) return "";
  const cells = p.columns
    .map((col) => {
      const key = p.borrowSlots[col];
      if (!key) return cell(col, "", "carry-spacer");
      const joinKey = p.joinOnBorrow && p.joinOnBorrow[col];
      const inner = `<div class="slot carry ${slotClass(key, activePlace)}" id="slot-${key}">${state.filled[key] ?? ""}</div>`;
      if (!joinKey || !shouldShowJoin(p, joinKey, activePlace)) return `<div class="cell">${inner}</div>`;
      return `<div class="cell minuend-place">
        ${renderJoinMark(joinKey, activePlace)}
        ${inner}
      </div>`;
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

function renderKeyedRow(keys, activePlace, op) {
  const p = state.problem;
  const cells = p.columns
    .map((col) => {
      const key = keys && keys[col];
      if (!key) return cell(col, "", "digit");
      return `<div class="cell"><div class="slot ${slotClass(key, activePlace)}" id="slot-${key}">${state.filled[key] ?? ""}</div></div>`;
    })
    .join("");
  return `<div class="row cols-${p.columns.length}">
    <div class="op">${op || ""}</div>
    ${cells}
  </div>`;
}

function renderCarryKeyed(keys, activePlace) {
  const p = state.problem;
  if (!keys || !Object.values(keys).some(Boolean)) return "";
  const cells = p.columns
    .map((col) => {
      const key = keys[col];
      if (!key || !p.places.includes(key)) return cell(col, "", "carry-spacer");
      return `<div class="cell"><div class="slot carry ${slotClass(key, activePlace)}" id="slot-${key}">${state.filled[key] ?? ""}</div></div>`;
    })
    .join("");
  return `<div class="row cols-${p.columns.length} carry-row">
    <div class="op"></div>
    ${cells}
  </div>`;
}

function mulPartialPhase(place) {
  if (!place) return "sum";
  if (String(place).startsWith("p1")) return "p1";
  if (place === "shift0" || String(place).startsWith("p2")) return "p2";
  if (String(place).startsWith("p3")) return "p3";
  return "sum";
}

function renderMulPartials(activePlace) {
  const p = state.problem;
  const phase = mulPartialPhase(activePlace);
  const topCarry =
    phase === "p1"
      ? renderCarryKeyed(p.rowP1Carry, activePlace)
      : phase === "p2"
        ? renderCarryKeyed(p.rowP2Carry, activePlace)
        : phase === "p3"
          ? renderCarryKeyed(p.rowP3Carry, activePlace)
          : "";
  const midCarry = phase === "sum" ? renderCarryKeyed(p.rowSumCarry, activePlace) : "";
  return `
    ${renderHeaders()}
    ${topCarry}
    ${p.addendDigits
      .map((pv, i) => renderAddendRow(pv, i === p.addendDigits.length - 1 ? "×" : "", false, activePlace))
      .join("")}
    <div class="rule cols-${p.columns.length}"></div>
    ${midCarry}
    ${renderKeyedRow(p.rowP1, activePlace, "")}
    ${renderKeyedRow(p.rowP2, activePlace, "+")}
    ${p.rowP3 ? renderKeyedRow(p.rowP3, activePlace, "+") : ""}
    <div class="rule cols-${p.columns.length}"></div>
    ${renderKeyedRow(p.rowSum, activePlace, "")}
  `;
}

function divSlot(key, activePlace) {
  return `<div class="slot ${slotClass(key, activePlace)}" id="slot-${key}">${state.filled[key] ?? ""}</div>`;
}

function renderDivBoard(activePlace) {
  const p = state.problem;
  if (p.divDigits === 2) return renderDivBoard2(activePlace);
  if (p.mode53) return renderDivBoard53(activePlace);
  if (p.mode43) return renderDivBoard43(activePlace);
  if (p.shortThree) return renderDivBoard33(activePlace);
  if (p.mode42) return renderDivBoard42(activePlace);
  if (p.mode32) return renderDivBoard32(activePlace);
  if (p.divDigits === 3) return renderDivBoard3(activePlace);
  const showR = p.remainder > 0 && (state.filled.rem != null || activePlace === "sideRem");
  const extraClass = p.remainder > 0 ? " has-r" : "";
  const rCells = p.remainder > 0
    ? showR
      ? `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : `<div></div><div></div>`
    : "";
  const pad = p.remainder > 0 ? `<div></div><div></div>` : "";
  return `
    <div class="div-board${extraClass}">
      <div class="div-grid${extraClass}">
        <svg class="div-bracket" viewBox="0 0 72 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 70" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div>
        <div></div>
        <div class="div-ones">${divSlot("quot", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook" aria-hidden="true"></div>
        <div class="div-ones">
          <div class="div-n">${p.dividend}</div>
        </div>
        ${pad}
        <div></div>
        <div></div>
        <div class="div-ones div-prod-cell">
          ${divSlot("prod", activePlace)}
          <div class="div-rule"></div>
        </div>
        ${pad}
        <div></div>
        <div></div>
        <div class="div-ones div-rem-cell">${divSlot("rem", activePlace)}</div>
        ${pad}
      </div>
    </div>
  `;
}

function divFilledOrSlot(key, activePlace) {
  if (state.filled[key] == null && activePlace !== key) {
    return `<div class="div-ph"></div>`;
  }
  return divSlot(key, activePlace);
}

function renderDivBoard53(activePlace) {
  const p = state.problem;
  const lastSub = ["s3Th", "s3Huns", "s3Tens", "s3Ones"].find((k) => p.places.includes(k)) || "s3Ones";
  const remDigits = p.remainder >= 100 ? 3 : p.remainder >= 10 ? 2 : p.remainder > 0 ? 1 : 0;
  const showR = remDigits > 0 && (state.filled[lastSub] != null || String(activePlace || "").startsWith("sideRem"));
  const extra = remDigits === 3 ? " has-r has-r3" : remDigits === 2 ? " has-r has-r2" : remDigits === 1 ? " has-r" : "";
  const blanks = (n) => "<div></div>".repeat(n);
  const rCells = remDigits === 0
    ? ""
    : showR
      ? remDigits === 3
        ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemHuns", activePlace)}</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
        : remDigits === 2
          ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
          : `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : blanks(remDigits + 1);
  const pad = blanks(remDigits === 0 ? 0 : remDigits + 1);
  const cell = (key, drop) =>
    `<div class="div-ones${drop ? " div-work-prod" : ""}">${p.places.includes(key) ? divFilledOrSlot(key, activePlace) : `<div class="div-ph"></div>`}</div>`;
  const showBT = state.filled.s1Ones != null || activePlace === "bringT" || state.filled.bringT != null;
  const showBO = state.filled.s2Ones != null || activePlace === "bringO" || state.filled.bringO != null;
  const rule = (prefix, span, lead, trail) =>
    state.filled[prefix + "Ones"] != null || String(activePlace || "").startsWith("s" + prefix.slice(1))
      ? `<div></div><div></div>${blanks(lead)}<div class="div-rule-span" style="grid-column: span ${span}"></div>${blanks(trail)}${pad}`
      : "";
  return `
    <div class="div-board wide5 wide-div3${extra}">
      <div class="div-grid div-5 wide-div3${extra}">
        <svg class="div-bracket wide5" viewBox="0 0 260 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 256" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div></div><div></div>
        <div class="div-ones">${divSlot("qH", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qT", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qO", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dTt}</div></div>
        <div class="div-ones"><div class="div-n">${p.dTh}</div></div>
        <div class="div-ones"><div class="div-n">${p.dH}</div></div>
        <div class="div-ones"><div class="div-n">${p.dT}</div></div>
        <div class="div-ones"><div class="div-n">${p.dO}</div></div>
        ${pad}
        <div></div><div></div>
        ${cell("p1Huns")}
        ${cell("p1Tens")}
        ${cell("p1Ones")}
        <div></div><div></div>
        ${pad}
        ${rule("p1", 3, 0, 2)}
        <div></div><div></div>
        ${cell("s1Huns")}
        ${cell("s1Tens")}
        ${cell("s1Ones")}
        <div class="div-ones">${showBT ? divFilledOrSlot("bringT", activePlace) : `<div class="div-ph"></div>`}</div>
        <div></div>
        ${pad}
        <div></div><div></div>
        ${cell("p2Th", true)}
        ${cell("p2Huns", true)}
        ${cell("p2Tens", true)}
        ${cell("p2Ones", true)}
        <div></div>
        ${pad}
        ${rule("p2", 4, 0, 1)}
        <div></div><div></div>
        ${cell("s2Th")}
        ${cell("s2Huns")}
        ${cell("s2Tens")}
        ${cell("s2Ones")}
        <div class="div-ones">${showBO ? divFilledOrSlot("bringO", activePlace) : `<div class="div-ph"></div>`}</div>
        ${pad}
        <div></div><div></div>
        <div></div>
        ${cell("p3Th", true)}
        ${cell("p3Huns", true)}
        ${cell("p3Tens", true)}
        ${cell("p3Ones", true)}
        ${pad}
        ${rule("p3", 4, 1, 0)}
        <div></div><div></div>
        <div></div>
        ${cell("s3Th")}
        ${cell("s3Huns")}
        ${cell("s3Tens")}
        ${cell("s3Ones")}
        ${pad}
      </div>
    </div>
  `;
}

function renderDivBoard43(activePlace) {
  const p = state.problem;
  const lastSub = ["s2Th", "s2Huns", "s2Tens", "s2Ones"].find((k) => p.places.includes(k)) || "s2Ones";
  const remDigits = p.remainder >= 100 ? 3 : p.remainder >= 10 ? 2 : p.remainder > 0 ? 1 : 0;
  const showR =
    remDigits > 0 &&
    (state.filled[lastSub] != null ||
      String(activePlace || "").startsWith("sideRem"));
  const extra = remDigits === 3 ? " has-r has-r3" : remDigits === 2 ? " has-r has-r2" : remDigits === 1 ? " has-r" : "";
  const blanks = (n) => "<div></div>".repeat(n);
  const rCells = remDigits === 0
    ? ""
    : showR
      ? remDigits === 3
        ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemHuns", activePlace)}</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
        : remDigits === 2
          ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
          : `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : blanks(remDigits + 1);
  const pad = blanks(remDigits === 0 ? 0 : remDigits + 1);
  const cell = (key) =>
    `<div class="div-ones">${p.places.includes(key) ? divFilledOrSlot(key, activePlace) : `<div class="div-ph"></div>`}</div>`;
  const showBO = state.filled.s1Ones != null || activePlace === "bringO" || state.filled.bringO != null;
  const rule1 = state.filled.p1Ones != null || String(activePlace || "").startsWith("s1");
  const rule2 = state.filled.p2Ones != null || String(activePlace || "").startsWith("s2");
  return `
    <div class="div-board wide4 wide-div3${extra}">
      <div class="div-grid div-4 wide-div3${extra}">
        <svg class="div-bracket wide4" viewBox="0 0 220 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 216" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div></div><div></div>
        <div class="div-ones">${divSlot("qT", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qO", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dTh}</div></div>
        <div class="div-ones"><div class="div-n">${p.dH}</div></div>
        <div class="div-ones"><div class="div-n">${p.dT}</div></div>
        <div class="div-ones"><div class="div-n">${p.dO}</div></div>
        ${pad}
        <div></div><div></div>
        ${cell("p1Huns")}
        ${cell("p1Tens")}
        ${cell("p1Ones")}
        <div></div>
        ${pad}
        ${rule1 ? `<div></div><div></div><div class="div-rule-span" style="grid-column: span 3"></div><div></div>${pad}` : ""}
        <div></div><div></div>
        ${cell("s1Huns")}
        ${cell("s1Tens")}
        ${cell("s1Ones")}
        <div class="div-ones">${showBO ? divFilledOrSlot("bringO", activePlace) : `<div class="div-ph"></div>`}</div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones div-work-prod">${p.places.includes("p2Th") ? divFilledOrSlot("p2Th", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones div-work-prod">${p.places.includes("p2Huns") ? divFilledOrSlot("p2Huns", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones div-work-prod">${p.places.includes("p2Tens") ? divFilledOrSlot("p2Tens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones div-work-prod">${p.places.includes("p2Ones") ? divFilledOrSlot("p2Ones", activePlace) : `<div class="div-ph"></div>`}</div>
        ${pad}
        ${rule2 ? `<div></div><div></div><div class="div-rule-span" style="grid-column: span 4"></div>${pad}` : ""}
        <div></div><div></div>
        ${cell("s2Th")}
        ${cell("s2Huns")}
        ${cell("s2Tens")}
        ${cell("s2Ones")}
        ${pad}
      </div>
    </div>
  `;
}

function renderDivBoard33(activePlace) {
  const p = state.problem;
  const lastSub = p.places.includes("sWorkHuns") ? "sWorkHuns" : p.places.includes("sWorkTens") ? "sWorkTens" : "sWorkOnes";
  const remDigits = p.remainder >= 100 ? 3 : p.remainder >= 10 ? 2 : p.remainder > 0 ? 1 : 0;
  const showR =
    remDigits > 0 &&
    (state.filled[lastSub] != null ||
      activePlace === "sideRem" ||
      activePlace === "sideRemOnes" ||
      activePlace === "sideRemTens" ||
      activePlace === "sideRemHuns");
  const extra = remDigits === 3 ? " has-r has-r3" : remDigits === 2 ? " has-r has-r2" : remDigits === 1 ? " has-r" : "";
  const blanks = (n) => "<div></div>".repeat(n);
  const rCells = remDigits === 0
    ? ""
    : showR
      ? remDigits === 3
        ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemHuns", activePlace)}</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
        : remDigits === 2
          ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
          : `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : blanks(remDigits + 1);
  const pad = blanks(remDigits === 0 ? 0 : remDigits + 1);
  const showRule = state.filled.pWorkOnes != null || String(activePlace || "").startsWith("sWork");
  return `
    <div class="div-board wide3 wide-div3${extra}">
      <div class="div-grid div-3 wide-div3${extra}">
        <svg class="div-bracket wide3" viewBox="0 0 180 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 176" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div></div><div></div>
        <div class="div-ones">${divSlot("qOnes", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dH}</div></div>
        <div class="div-ones"><div class="div-n">${p.dT}</div></div>
        <div class="div-ones"><div class="div-n">${p.dO}</div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones">${p.places.includes("pWorkHuns") ? divFilledOrSlot("pWorkHuns", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${p.places.includes("pWorkTens") ? divFilledOrSlot("pWorkTens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${divFilledOrSlot("pWorkOnes", activePlace)}</div>
        ${pad}
        ${showRule ? `<div></div><div></div><div class="div-rule-span" style="grid-column: span 3"></div>${pad}` : ""}
        <div></div><div></div>
        <div class="div-ones">${p.places.includes("sWorkHuns") ? divFilledOrSlot("sWorkHuns", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${p.places.includes("sWorkTens") ? divFilledOrSlot("sWorkTens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${divFilledOrSlot("sWorkOnes", activePlace)}</div>
        ${pad}
      </div>
    </div>
  `;
}

function renderDivBoard2(activePlace) {
  const p = state.problem;
  const lastSub = p.workWide ? "sWorkOnes" : "sOnes";
  const showR = p.remainder > 0 && (state.filled[lastSub] != null || activePlace === "sideRem");
  const extra = p.remainder > 0 ? " has-r" : "";
  const rCells = p.remainder > 0
    ? showR
      ? `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : `<div></div><div></div>`
    : "";
  const pad = p.remainder > 0 ? `<div></div><div></div>` : "";
  const showBring = state.filled.sTens != null || activePlace === "bringDown" || state.filled.bringDown != null;
  if (p.shortTwo) {
    const lastSub = p.places.includes("sWorkTens") ? "sWorkTens" : "sWorkOnes";
    const showRS = p.remainder > 0 && (state.filled[lastSub] != null || activePlace === "sideRem");
    const extraS = p.remainder > 0 ? " has-r" : "";
    const rS = p.remainder > 0
      ? showRS
        ? `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
        : `<div></div><div></div>`
      : "";
    const padS = p.remainder > 0 ? `<div></div><div></div>` : "";
    return `
    <div class="div-board wide${extraS}${p.divisor >= 10 ? " wide-div" : ""}">
      <div class="div-grid div-2${extraS}${p.divisor >= 10 ? " wide-div" : ""}">
        <svg class="div-bracket wide" viewBox="0 0 128 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 124" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div></div>
        <div class="div-ones">${divSlot("qOnes", activePlace)}</div>
        ${rS}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dTens}</div></div>
        <div class="div-ones"><div class="div-n">${p.dOnes}</div></div>
        ${padS}
        <div></div><div></div>
        <div class="div-ones div-prod-cell">
          ${p.places.includes("pWorkTens") ? divFilledOrSlot("pWorkTens", activePlace) : `<div class="div-ph"></div>`}
          ${state.filled.pWorkOnes != null || String(activePlace || "").startsWith("sWork") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div class="div-ones div-prod-cell">
          ${divFilledOrSlot("pWorkOnes", activePlace)}
          ${state.filled.pWorkOnes != null || String(activePlace || "").startsWith("sWork") ? `<div class="div-rule"></div>` : ""}
        </div>
        ${padS}
        <div></div><div></div>
        <div class="div-ones">${p.places.includes("sWorkTens") ? divFilledOrSlot("sWorkTens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${divFilledOrSlot("sWorkOnes", activePlace)}</div>
        ${padS}
      </div>
    </div>`;
  }
  return `
    <div class="div-board wide${extra}${p.divisor >= 10 ? " wide-div" : ""}">
      <div class="div-grid div-2${extra}${p.divisor >= 10 ? " wide-div" : ""}">
        <svg class="div-bracket wide" viewBox="0 0 128 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 124" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div class="div-ones">${divSlot("qTens", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qOnes", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dTens}</div></div>
        <div class="div-ones"><div class="div-n">${p.dOnes}</div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones div-prod-cell">
          ${divFilledOrSlot("pTens", activePlace)}
          ${state.filled.pTens != null || activePlace === "sTens" ? `<div class="div-rule"></div>` : ""}
        </div>
        <div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones">${divFilledOrSlot("sTens", activePlace)}</div>
        <div class="div-ones">${showBring ? divFilledOrSlot("bringDown", activePlace) : `<div class="div-ph"></div>`}</div>
        ${pad}
        <div></div><div></div>
        ${
          p.workWide
            ? `<div class="div-ones div-prod-cell div-work-prod">
          ${p.places.includes("pWorkTens") ? divFilledOrSlot("pWorkTens", activePlace) : `<div class="div-ph"></div>`}
          ${state.filled.pWorkOnes != null || activePlace === "sWorkTens" || activePlace === "sWorkOnes" ? `<div class="div-rule"></div>` : ""}
        </div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${divFilledOrSlot("pWorkOnes", activePlace)}
          ${state.filled.pWorkOnes != null || activePlace === "sWorkTens" || activePlace === "sWorkOnes" ? `<div class="div-rule"></div>` : ""}
        </div>`
            : `<div></div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${divFilledOrSlot("pOnes", activePlace)}
          ${state.filled.pOnes != null || activePlace === "sOnes" ? `<div class="div-rule"></div>` : ""}
        </div>`
        }
        ${pad}
        <div></div><div></div>
        ${
          p.workWide
            ? `<div class="div-ones div-rem-cell">${p.places.includes("sWorkTens") ? divFilledOrSlot("sWorkTens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones div-rem-cell">${divFilledOrSlot("sWorkOnes", activePlace)}</div>`
            : `<div></div>
        <div class="div-ones div-rem-cell">${divFilledOrSlot("sOnes", activePlace)}</div>`
        }
        ${pad}
      </div>
    </div>
  `;
}

function renderDivBoard42(activePlace) {
  const p = state.problem;
  const lastSub = p.places.includes("s3Huns") ? "s3Huns" : p.places.includes("s3Tens") ? "s3Tens" : "s3Ones";
  const twoRem = p.remainder >= 10;
  const showR =
    p.remainder > 0 &&
    (state.filled[lastSub] != null ||
      activePlace === "sideRem" ||
      activePlace === "sideRemOnes" ||
      activePlace === "sideRemTens");
  const extra = twoRem ? " has-r has-r2" : p.remainder > 0 ? " has-r" : "";
  const rCells = p.remainder > 0
    ? showR
      ? twoRem
        ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
        : `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : twoRem
        ? `<div></div><div></div><div></div>`
        : `<div></div><div></div>`
    : "";
  const pad = twoRem ? `<div></div><div></div><div></div>` : p.remainder > 0 ? `<div></div><div></div>` : "";
  const showBT = state.filled.s1Ones != null || activePlace === "bringT" || state.filled.bringT != null;
  const showBO = state.filled.s2Ones != null || activePlace === "bringO" || state.filled.bringO != null;
  const showRule = (prefix) =>
    state.filled[prefix + "Ones"] != null || String(activePlace || "").startsWith("s" + prefix.slice(1));
  const prod = (key, prefix) =>
    `<div class="div-ones div-prod-cell${prefix === "p1" ? "" : " div-work-prod"}">
      ${p.places.includes(key) ? divFilledOrSlot(key, activePlace) : `<div class="div-ph"></div>`}
    </div>`;
  const sub = (key) =>
    `<div class="div-ones">${p.places.includes(key) ? divFilledOrSlot(key, activePlace) : `<div class="div-ph"></div>`}</div>`;
  const ruleRow = (prefix, span, leadCount) => {
    if (!showRule(prefix)) return "";
    const trail = 4 - leadCount - span;
    return `<div></div><div></div>${"<div></div>".repeat(leadCount)}<div class="div-rule-span" style="grid-column: span ${span}"></div>${"<div></div>".repeat(trail)}${pad}`;
  };
  return `
    <div class="div-board wide4 wide-div${extra}">
      <div class="div-grid div-4 wide-div${extra}">
        <svg class="div-bracket wide4" viewBox="0 0 220 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 216" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div></div>
        <div class="div-ones">${divSlot("qH", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qT", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qO", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dTh}</div></div>
        <div class="div-ones"><div class="div-n">${p.dH}</div></div>
        <div class="div-ones"><div class="div-n">${p.dT}</div></div>
        <div class="div-ones"><div class="div-n">${p.dO}</div></div>
        ${pad}
        <div></div><div></div>
        ${prod("p1Tens", "p1")}
        ${prod("p1Ones", "p1")}
        <div></div><div></div>
        ${pad}
        ${ruleRow("p1", 2, 0)}
        <div></div><div></div>
        ${sub("s1Tens")}
        ${sub("s1Ones")}
        <div class="div-ones">${showBT ? divFilledOrSlot("bringT", activePlace) : `<div class="div-ph"></div>`}</div>
        <div></div>
        ${pad}
        <div></div><div></div>
        ${prod("p2Huns", "p2")}
        ${prod("p2Tens", "p2")}
        ${prod("p2Ones", "p2")}
        <div></div>
        ${pad}
        ${ruleRow("p2", 3, 0)}
        <div></div><div></div>
        ${sub("s2Huns")}
        ${sub("s2Tens")}
        ${sub("s2Ones")}
        <div class="div-ones">${showBO ? divFilledOrSlot("bringO", activePlace) : `<div class="div-ph"></div>`}</div>
        ${pad}
        <div></div><div></div>
        <div></div>
        ${prod("p3Huns", "p3")}
        ${prod("p3Tens", "p3")}
        ${prod("p3Ones", "p3")}
        ${pad}
        ${ruleRow("p3", 3, 1)}
        <div></div><div></div>
        <div></div>
        ${sub("s3Huns")}
        ${sub("s3Tens")}
        ${sub("s3Ones")}
        ${pad}
      </div>
    </div>
  `;
}

function renderDivBoard32(activePlace) {
  const p = state.problem;
  const lastSub = p.places.includes("s2Huns") ? "s2Huns" : p.places.includes("s2Tens") ? "s2Tens" : "s2Ones";
  const twoRem = p.remainder >= 10;
  const showR =
    p.remainder > 0 &&
    (state.filled[lastSub] != null ||
      activePlace === "sideRem" ||
      activePlace === "sideRemOnes" ||
      activePlace === "sideRemTens");
  const extra = twoRem ? " has-r has-r2" : p.remainder > 0 ? " has-r" : "";
  const rCells = p.remainder > 0
    ? showR
      ? twoRem
        ? `<div class="div-r">r</div><div class="div-ones">${divFilledOrSlot("sideRemTens", activePlace)}</div><div class="div-ones">${divSlot("sideRemOnes", activePlace)}</div>`
        : `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : twoRem
        ? `<div></div><div></div><div></div>`
        : `<div></div><div></div>`
    : "";
  const pad = twoRem ? `<div></div><div></div><div></div>` : p.remainder > 0 ? `<div></div><div></div>` : "";
  const showBO = state.filled.s1Ones != null || activePlace === "bringO" || state.filled.bringO != null;
  return `
    <div class="div-board wide3 wide-div${extra}">
      <div class="div-grid div-3 wide-div${extra}">
        <svg class="div-bracket wide3" viewBox="0 0 180 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 176" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div></div>
        <div class="div-ones">${divSlot("qT", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qO", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dH}</div></div>
        <div class="div-ones"><div class="div-n">${p.dT}</div></div>
        <div class="div-ones"><div class="div-n">${p.dO}</div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones div-prod-cell">
          ${p.places.includes("p1Tens") ? divFilledOrSlot("p1Tens", activePlace) : `<div class="div-ph"></div>`}
          ${state.filled.p1Ones != null || String(activePlace || "").startsWith("s1") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div class="div-ones div-prod-cell">
          ${divFilledOrSlot("p1Ones", activePlace)}
          ${state.filled.p1Ones != null || String(activePlace || "").startsWith("s1") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones">${p.places.includes("s1Tens") ? divFilledOrSlot("s1Tens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${divFilledOrSlot("s1Ones", activePlace)}</div>
        <div class="div-ones">${showBO ? divFilledOrSlot("bringO", activePlace) : `<div class="div-ph"></div>`}</div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${p.places.includes("p2Huns") ? divFilledOrSlot("p2Huns", activePlace) : `<div class="div-ph"></div>`}
          ${state.filled.p2Ones != null || String(activePlace || "").startsWith("s2") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${p.places.includes("p2Tens") ? divFilledOrSlot("p2Tens", activePlace) : `<div class="div-ph"></div>`}
          ${state.filled.p2Ones != null || String(activePlace || "").startsWith("s2") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${divFilledOrSlot("p2Ones", activePlace)}
          ${state.filled.p2Ones != null || String(activePlace || "").startsWith("s2") ? `<div class="div-rule"></div>` : ""}
        </div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones">${p.places.includes("s2Huns") ? divFilledOrSlot("s2Huns", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${p.places.includes("s2Tens") ? divFilledOrSlot("s2Tens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${divFilledOrSlot("s2Ones", activePlace)}</div>
        ${pad}
      </div>
    </div>
  `;
}

function renderDivBoard3(activePlace) {
  const p = state.problem;
  const lastSub = p.places.includes("s2Tens") ? "s2Tens" : "s2Ones";
  const showR = p.remainder > 0 && (state.filled[lastSub] != null || activePlace === "sideRem");
  const extra = p.remainder > 0 ? " has-r" : "";
  const rCells = p.remainder > 0
    ? showR
      ? `<div class="div-r">r</div><div class="div-ones">${divSlot("sideRem", activePlace)}</div>`
      : `<div></div><div></div>`
    : "";
  const pad = p.remainder > 0 ? `<div></div><div></div>` : "";
  const showBT = state.filled.s0Ones != null || activePlace === "bringT" || state.filled.bringT != null;
  const showBO = state.filled.s1Ones != null || activePlace === "bringO" || state.filled.bringO != null;
  const ruleAfter = (key) => state.filled[key] != null || String(activePlace || "").startsWith("s");
  return `
    <div class="div-board wide3${extra}">
      <div class="div-grid div-3${extra}">
        <svg class="div-bracket wide3" viewBox="0 0 180 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 8 36 C 14 30 15 14 15 6 H 176" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div></div><div></div>
        <div class="div-ones">${divSlot("qH", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qT", activePlace)}</div>
        <div class="div-ones">${divFilledOrSlot("qO", activePlace)}</div>
        ${rCells}
        <div class="div-d">${p.divisor}</div>
        <div class="div-hook"></div>
        <div class="div-ones"><div class="div-n">${p.dH}</div></div>
        <div class="div-ones"><div class="div-n">${p.dT}</div></div>
        <div class="div-ones"><div class="div-n">${p.dO}</div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones div-prod-cell">
          ${divFilledOrSlot("p0Ones", activePlace)}
          ${state.filled.p0Ones != null || activePlace === "s0Ones" ? `<div class="div-rule"></div>` : ""}
        </div>
        <div></div><div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones">${divFilledOrSlot("s0Ones", activePlace)}</div>
        <div class="div-ones">${showBT ? divFilledOrSlot("bringT", activePlace) : `<div class="div-ph"></div>`}</div>
        <div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${p.places.includes("p1Tens") ? divFilledOrSlot("p1Tens", activePlace) : `<div class="div-ph"></div>`}
          ${state.filled.p1Ones != null || String(activePlace || "").startsWith("s1") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${divFilledOrSlot("p1Ones", activePlace)}
          ${state.filled.p1Ones != null || String(activePlace || "").startsWith("s1") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div></div>
        ${pad}
        <div></div><div></div>
        <div class="div-ones">${p.places.includes("s1Tens") ? divFilledOrSlot("s1Tens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${divFilledOrSlot("s1Ones", activePlace)}</div>
        <div class="div-ones">${showBO ? divFilledOrSlot("bringO", activePlace) : `<div class="div-ph"></div>`}</div>
        ${pad}
        <div></div><div></div>
        <div></div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${p.places.includes("p2Tens") ? divFilledOrSlot("p2Tens", activePlace) : `<div class="div-ph"></div>`}
          ${state.filled.p2Ones != null || String(activePlace || "").startsWith("s2") ? `<div class="div-rule"></div>` : ""}
        </div>
        <div class="div-ones div-prod-cell div-work-prod">
          ${divFilledOrSlot("p2Ones", activePlace)}
          ${state.filled.p2Ones != null || String(activePlace || "").startsWith("s2") ? `<div class="div-rule"></div>` : ""}
        </div>
        ${pad}
        <div></div><div></div>
        <div></div>
        <div class="div-ones">${p.places.includes("s2Tens") ? divFilledOrSlot("s2Tens", activePlace) : `<div class="div-ph"></div>`}</div>
        <div class="div-ones">${divFilledOrSlot("s2Ones", activePlace)}</div>
        ${pad}
      </div>
    </div>
  `;
}

function renderPlay() {
  const level = findLevel(state.levelId);
  const p = state.problem;
  const place = p.places[state.step];
  const prompt = state.complete ? "Problem complete." : p.prompts[place];

  const choices = state.complete
    ? `<div class="done">
         <h2>${state.misses === 0 ? "Clean." : "Got it."}</h2>
         <p>${
           p.opSymbol === "÷"
             ? p.dividend + " ÷ " + p.divisor + " = " + p.quotient + (p.remainder ? " r " + p.remainder : "")
             : p.addends.join(" " + (p.opSymbol || "+") + " ") + " = " + (p.result ?? p.sum)
         }${state.misses ? " · " + state.misses + " miss" + (state.misses === 1 ? "" : "es") : ""}</p>
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
        ${p.layout === "division" ? renderDivBoard(place) : p.layout === "partials" ? renderMulPartials(place) : `
        ${renderHeaders()}
        ${renderCarryRow(place)}
        ${renderBorrowRow(place)}
        ${p.addendDigits
          .map((pv, i) =>
            renderAddendRow(
              pv,
              i === p.addendDigits.length - 1 ? p.opSymbol || "+" : "",
              p.opSymbol === "−" && i === 0,
              place
            )
          )
          .join("")}
        <div class="rule cols-${p.columns.length}"></div>
        ${renderAnswerRow(place)}
        `}
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
