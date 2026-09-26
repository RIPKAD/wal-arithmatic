/* Addition progression — WAL Arithmetic
   Playable shells grow one row at a time.
   status: "ready" | "queued"
*/

const NUMBER_TYPES = [
  { id: "whole", label: "Whole numbers", enabled: true },
  { id: "fractions", label: "Fractions", enabled: false },
  { id: "decimals", label: "Decimals", enabled: false },
  { id: "integers", label: "Integers", enabled: false },
];

const OPERATIONS = [
  { id: "add", label: "Addition", symbol: "+", enabled: true },
  { id: "sub", label: "Subtraction", symbol: "−", enabled: true },
  { id: "mul", label: "Multiplication", symbol: "×", enabled: false },
  { id: "div", label: "Division", symbol: "÷", enabled: false },
];

const ADDITION_LEVELS = [
  {
    group: "1. Single-digit + single-digit",
    items: [
      {
        id: "add-1a",
        title: "Sums less than 10",
        blurb: "No regrouping. 4 + 3, 6 + 2",
        status: "ready",
      },
      {
        id: "add-1b",
        title: "Sums 10 or more",
        blurb: "Regroup 10 ones as 1 ten. 8 + 7, 9 + 5",
        status: "ready",
      },
    ],
  },
  {
    group: "2. One-digit + two-digit",
    items: [
      {
        id: "add-2a",
        title: "Ones sum less than 10",
        blurb: "23 + 4, 51 + 6",
        status: "ready",
      },
      {
        id: "add-2b",
        title: "Carry 1 ten",
        blurb: "27 + 8, 49 + 5",
        status: "ready",
      },
      {
        id: "add-2c",
        title: "Carry makes a new hundred",
        blurb: "91 + 9, 99 + 6",
        status: "ready",
      },
    ],
  },
  {
    group: "3. Two-digit + two-digit",
    items: [
      { id: "add-3a", title: "No regrouping", blurb: "32 + 45, 21 + 53", status: "ready" },
      { id: "add-3b", title: "Regroup ones only", blurb: "37 + 48, 26 + 59", status: "ready" },
      { id: "add-3c", title: "Regroup tens only", blurb: "73 + 51, 84 + 62", status: "ready" },
      { id: "add-3d", title: "Regroup both columns", blurb: "58 + 67, 79 + 46", status: "ready" },
    ],
  },
  {
    group: "4. Two-digit + three-digit",
    items: [
      { id: "add-4a", title: "No regrouping", blurb: "732 + 45, 221 + 53", status: "ready" },
      { id: "add-4b", title: "Regroup ones or tens only", blurb: "237 + 48 or 273 + 51", status: "ready" },
      { id: "add-4c", title: "Regroup both columns", blurb: "458 + 67, 279 + 46", status: "ready" },
    ],
  },
  {
    group: "5. Three-digit + three-digit",
    items: [
      { id: "add-5a", title: "No regrouping", blurb: "213 + 425", status: "ready" },
      { id: "add-5b", title: "Regroup in exactly one place", blurb: "Ones, tens, or hundreds", status: "ready" },
      { id: "add-5c", title: "Regroup in two places", blurb: "Any two columns", status: "ready" },
      { id: "add-5d", title: "Regroup in all three places", blurb: "Carry through ones, tens, hundreds", status: "ready" },
      { id: "add-5e", title: "Chain of 9s, new thousand", blurb: "999 + 1, 598 + 407", status: "ready" },
    ],
  },
  {
    group: "6. Four-digit + four-digit",
    items: [
      { id: "add-6a", title: "No regrouping", blurb: "Four-digit, no carries", status: "ready" },
      { id: "add-6b", title: "Exactly one place", blurb: "Ones, tens, hundreds, or thousands", status: "ready" },
      { id: "add-6c", title: "Two places", blurb: "Any two columns", status: "ready" },
      { id: "add-6d", title: "Three places", blurb: "Any three columns", status: "ready" },
      { id: "add-6e", title: "All four places", blurb: "New ten-thousands place", status: "ready" },
      { id: "add-6f", title: "Chain of 9s", blurb: "9999 + 1, 5099 + 901", status: "ready" },
    ],
  },
  {
    group: "7. More than two addends",
    items: [
      { id: "add-7a", title: "Three 2-digit numbers", blurb: "Column addition; carry may be 1 or 2", status: "ready" },
      { id: "add-7b", title: "Three mixed lengths", blurb: "2- and 3-digit addends together", status: "ready" },
    ],
  },
];

const PLACE_LABEL = {
  ones: "1s",
  tens: "10s",
  hundreds: "100s",
  thousands: "1000s",
  tenthousands: "10000s",
};

const SUBTRACTION_LEVELS = [
  {
    group: "1. Single-digit − single-digit",
    items: [
      { id: "sub-1a", title: "Minuend ≥ subtrahend", blurb: "8 − 3, 9 − 5", status: "ready" },
    ],
  },
  {
    group: "2. Two-digit − one- or two-digit",
    items: [
      { id: "sub-2a", title: "No regrouping", blurb: "48 − 5, 86 − 42", status: "ready" },
      { id: "sub-2b", title: "Regroup tens → ones", blurb: "42 − 15, 31 − 8", status: "queued" },
      { id: "sub-2c", title: "Fewer digits in the result", blurb: "22 − 15, 11 − 8", status: "queued" },
    ],
  },
  {
    group: "3. Three-digit − two- or three-digit",
    items: [
      { id: "sub-3a", title: "No regrouping", blurb: "586 − 243", status: "queued" },
      { id: "sub-3b", title: "Regroup ones only", blurb: "452 − 128", status: "queued" },
      { id: "sub-3c", title: "Regroup tens only", blurb: "640 − 215", status: "queued" },
      { id: "sub-3d", title: "Regroup two places", blurb: "523 − 167", status: "queued" },
      { id: "sub-3e", title: "Across one zero", blurb: "503 − 27, 406 − 158", status: "queued" },
      { id: "sub-3f", title: "Across two zeros", blurb: "500 − 27, 400 − 163", status: "queued" },
      { id: "sub-3g", title: "Fewer digits in the result", blurb: "201 − 198", status: "queued" },
    ],
  },
  {
    group: "4. Four-digit and mixed lengths",
    items: [
      { id: "sub-4a", title: "No regrouping", blurb: "3586 − 2243", status: "queued" },
      { id: "sub-4b", title: "Regroup one place", blurb: "Ones, tens, or hundreds", status: "queued" },
      { id: "sub-4c", title: "Regroup two places", blurb: "Any two columns", status: "queued" },
      { id: "sub-4d", title: "Regroup three places", blurb: "Walk left three times", status: "queued" },
      { id: "sub-4e", title: "Across zeros", blurb: "One, two, or three zeros", status: "queued" },
      { id: "sub-4f", title: "Fewer digits in the result", blurb: "Leading zero in the difference", status: "queued" },
    ],
  },
];

function findLevel(id) {
  for (const catalog of [ADDITION_LEVELS, SUBTRACTION_LEVELS]) {
    for (const group of catalog) {
      const item = group.items.find((x) => x.id === id);
      if (item) return { ...item, group: group.group };
    }
  }
  return null;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickDistinct(count, min, max, banned) {
  const out = [];
  let guard = 0;
  while (out.length < count && guard < 80) {
    const n = randInt(min, max);
    if (!banned.has(n) && !out.includes(n)) out.push(n);
    guard += 1;
  }
  return out;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractorsFor(correct, hints) {
  const banned = new Set([correct]);
  const preferred = [];
  const plus = (correct + 1) % 10;
  const minus = (correct + 9) % 10;
  if (!banned.has(plus)) preferred.push(plus);
  if (!banned.has(minus)) preferred.push(minus);
  for (const h of hints) {
    if (Number.isInteger(h) && h >= 0 && h <= 9 && !banned.has(h) && !preferred.includes(h)) {
      preferred.push(h);
    }
  }
  const picked = [];
  for (const p of preferred) {
    if (picked.length >= 3) break;
    picked.push(p);
    banned.add(p);
  }
  picked.push(...pickDistinct(3 - picked.length, 0, 9, banned));
  return picked.slice(0, 3);
}

function placeValue(n) {
  return {
    ones: n % 10,
    tens: Math.floor(n / 10) % 10,
    hundreds: Math.floor(n / 100) % 10,
    thousands: Math.floor(n / 1000) % 10,
    tenthousands: Math.floor(n / 10000) % 10,
  };
}

function buildAddProblem(addends, opts) {
  const showCarry = !!opts.showCarry;
  const pvs = addends.map(placeValue);
  const sum = addends.reduce((s, n) => s + n, 0);
  const chain = [
    { col: "ones", carryKey: "carryTens" },
    { col: "tens", carryKey: "carryHundreds" },
    { col: "hundreds", carryKey: "carryThousands" },
    { col: "thousands", carryKey: "carryTenThousands" },
    { col: "tenthousands", carryKey: null },
  ];
  const written = {};
  const carryInto = { ones: 0, tens: 0, hundreds: 0, thousands: 0, tenthousands: 0 };
  const carryVal = {};
  let cin = 0;
  for (const step of chain) {
    carryInto[step.col] = cin;
    const colSum = pvs.reduce((s, pv) => s + (pv[step.col] || 0), 0) + cin;
    written[step.col] = colSum % 10;
    const cout = Math.floor(colSum / 10);
    if (step.carryKey) carryVal[step.carryKey] = cout;
    cin = cout;
  }

  const order = ["tenthousands", "thousands", "hundreds", "tens", "ones"];
  let start = order.length - 1;
  for (let i = 0; i < order.length; i++) {
    const col = order[i];
    const hasDigit = pvs.some((pv) => pv[col] > 0) || written[col] > 0 || carryInto[col] > 0;
    if (hasDigit) {
      start = i;
      break;
    }
  }
  const columns = order.slice(start);

  const places = [];
  const answers = {};
  const afterCarry = {
    ones: "carryTens",
    tens: "carryHundreds",
    hundreds: "carryThousands",
    thousands: "carryTenThousands",
  };
  for (const col of ["ones", "tens", "hundreds", "thousands", "tenthousands"]) {
    if (!columns.includes(col)) continue;
    places.push(col);
    answers[col] = written[col];
    const ck = afterCarry[col];
    if (showCarry && ck && carryVal[ck] > 0 && (columns.includes(nextCol(col)) || carryVal[ck] > 0)) {
      const next = nextCol(col);
      if (next && (columns.includes(next) || carryVal[ck] > 0)) {
        if (!columns.includes(next) && written[next] > 0) {
          /* opened by carry */
        }
        places.push(ck);
        answers[ck] = carryVal[ck];
      }
    }
  }

  function nextCol(col) {
    return { ones: "tens", tens: "hundreds", hundreds: "thousands", thousands: "tenthousands" }[col];
  }

  // If a carry created a new leading column, ensure that column is present and in places.
  for (const col of order) {
    if ((written[col] > 0 || carryInto[col] > 0) && !columns.includes(col)) {
      columns.unshift(col);
    }
  }
  for (const col of ["ones", "tens", "hundreds", "thousands", "tenthousands"]) {
    if (columns.includes(col) && !places.includes(col)) {
      const ck = afterCarry[prevOf(col)];
      const idx = ck && places.includes(ck) ? places.indexOf(ck) + 1 : places.length;
      places.splice(idx, 0, col);
      answers[col] = written[col];
    }
  }
  function prevOf(col) {
    return { tens: "ones", hundreds: "tens", thousands: "hundreds", tenthousands: "thousands" }[col];
  }

  // Rebuild places in algorithm order to avoid duplicates / misses.
  const places2 = [];
  const answers2 = {};
  for (const col of ["ones", "tens", "hundreds", "thousands", "tenthousands"]) {
    if (!columns.includes(col)) continue;
    places2.push(col);
    answers2[col] = written[col];
    const ck = afterCarry[col];
    if (showCarry && ck && carryVal[ck] > 0) {
      places2.push(ck);
      answers2[ck] = carryVal[ck];
      const nxt = nextCol(col);
      if (nxt && !columns.includes(nxt) && (written[nxt] > 0 || carryVal[ck] > 0)) {
        columns.unshift(nxt);
      }
    }
  }
  for (const col of ["ones", "tens", "hundreds", "thousands", "tenthousands"]) {
    if (columns.includes(col) && !places2.includes(col)) {
      const ck = afterCarry[prevOf(col)];
      const at = ck && places2.includes(ck) ? places2.indexOf(ck) + 1 : places2.length;
      places2.splice(at, 0, col);
      answers2[col] = written[col];
    }
  }

  const hints = [];
  for (const pv of pvs) hints.push(pv.ones, pv.tens, pv.hundreds, pv.thousands);
  hints.push(...Object.values(answers2));
  const choices = {};
  for (const place of places2) {
    choices[place] = shuffle([answers2[place], ...distractorsFor(answers2[place], hints)]);
  }

  const anyCarry = Object.values(carryVal).some((n) => n > 0);
  const prompts = {
    ones: anyCarry && showCarry ? "Ones place first. What digit stays in the ones?" : columns.length === 1 ? "What is the sum?" : "Ones place. Add the ones.",
    carryTens: carryVal.carryTens === 2 ? "Carry 2. Write it above the 10s." : "Carry 1. Write it above the 10s.",
    tens: showCarry && carryVal.carryTens ? "10s — add the tens and the carry." : "10s place.",
    carryHundreds: carryVal.carryHundreds === 2 ? "Carry 2. Write it above the 100s." : "Carry 1. Write it above the 100s.",
    hundreds: showCarry && carryVal.carryHundreds ? "100s — add the hundreds and the carry." : "100s place.",
    carryThousands: carryVal.carryThousands === 2 ? "Carry 2. Write it above the 1000s." : "Carry 1. Write it above the 1000s.",
    thousands: showCarry && carryVal.carryThousands ? "1000s — add the thousands and the carry." : "1000s place.",
    carryTenThousands: "Carry 1. Write it above the 10000s.",
    tenthousands: "10000s — the new ten-thousand.",
  };

  return {
    levelId: opts.levelId,
    addends: addends.slice(),
    opSymbol: "+",
    sum,
    result: sum,
    columns,
    showCarry,
    addendDigits: pvs,
    places: places2,
    answers: answers2,
    choices,
    prompts,
    carryTens: carryVal.carryTens || 0,
    carryHundreds: carryVal.carryHundreds || 0,
    carryThousands: carryVal.carryThousands || 0,
    carryTenThousands: carryVal.carryTenThousands || 0,
  };
}

function buildColumnProblem(a, b, opts) {
  return buildAddProblem([a, b], opts);
}

function generateAdd1a() {
  let a = randInt(1, 8);
  let b = randInt(1, 9 - a);
  if (Math.random() < 0.5) [a, b] = [b, a];
  return buildColumnProblem(a, b, { levelId: "add-1a", showCarry: false });
}

function generateAdd1b() {
  let a = randInt(2, 9);
  let b = randInt(Math.max(1, 10 - a), 9);
  if (Math.random() < 0.5) [a, b] = [b, a];
  return buildColumnProblem(a, b, { levelId: "add-1b", showCarry: false });
}

function generateAdd2a() {
  const ones = randInt(0, 8);
  const add = randInt(1, 9 - ones);
  const tens = randInt(1, 9);
  const a = tens * 10 + ones;
  return buildColumnProblem(a, add, { levelId: "add-2a", showCarry: false });
}

function generateAdd2b() {
  const ones = randInt(1, 9);
  const add = randInt(10 - ones, 9);
  const tens = randInt(1, 8);
  const a = tens * 10 + ones;
  return buildColumnProblem(a, add, { levelId: "add-2b", showCarry: true });
}

function generateAdd2c() {
  const ones = randInt(1, 9);
  const add = randInt(10 - ones, 9);
  const a = 90 + ones;
  return buildColumnProblem(a, add, { levelId: "add-2c", showCarry: true });
}

function twoDigit(tens, ones) {
  return tens * 10 + ones;
}

function maybeSwap(a, b) {
  return Math.random() < 0.5 ? [b, a] : [a, b];
}

function generateAdd3a() {
  const onesA = randInt(0, 8);
  const onesB = randInt(0, 9 - onesA);
  const tensA = randInt(1, 8);
  const tensB = randInt(1, 9 - tensA);
  const [a, b] = maybeSwap(twoDigit(tensA, onesA), twoDigit(tensB, onesB));
  return buildColumnProblem(a, b, { levelId: "add-3a", showCarry: false });
}

function generateAdd3b() {
  const onesA = randInt(1, 9);
  const onesB = randInt(10 - onesA, 9);
  const tensA = randInt(1, 7);
  const tensB = randInt(1, 8 - tensA);
  const [a, b] = maybeSwap(twoDigit(tensA, onesA), twoDigit(tensB, onesB));
  return buildColumnProblem(a, b, { levelId: "add-3b", showCarry: true });
}

function generateAdd3c() {
  const onesA = randInt(0, 8);
  const onesB = randInt(0, 9 - onesA);
  const tensA = randInt(1, 9);
  const tensB = randInt(Math.max(1, 10 - tensA), 9);
  const [a, b] = maybeSwap(twoDigit(tensA, onesA), twoDigit(tensB, onesB));
  return buildColumnProblem(a, b, { levelId: "add-3c", showCarry: true });
}

function pickTensPair(minSum, maxSum) {
  const pairs = [];
  for (let t = 1; t <= 9; t++) {
    for (let u = 1; u <= 9; u++) {
      if (t + u >= minSum && t + u <= maxSum) pairs.push([t, u]);
    }
  }
  return pairs[randInt(0, pairs.length - 1)];
}

function onesRegroupPair() {
  const onesA = randInt(1, 9);
  const onesB = randInt(10 - onesA, 9);
  return [onesA, onesB];
}

function generateAdd3d() {
  const [onesA, onesB] = onesRegroupPair();
  const [tensA, tensB] = pickTensPair(9, 12);
  const [a, b] = maybeSwap(twoDigit(tensA, onesA), twoDigit(tensB, onesB));
  return buildColumnProblem(a, b, { levelId: "add-3d", showCarry: true });
}

function threeDigit(h, t, o) {
  return h * 100 + t * 10 + o;
}

function generateAdd4a() {
  const ones3 = randInt(0, 8);
  const ones2 = randInt(0, 9 - ones3);
  const tens3 = randInt(0, 8);
  const tens2 = randInt(1, 9 - tens3);
  const hundreds = randInt(1, 9);
  return buildColumnProblem(
    threeDigit(hundreds, tens3, ones3),
    twoDigit(tens2, ones2),
    { levelId: "add-4a", showCarry: false }
  );
}

function generateAdd4b() {
  const onesOnly = Math.random() < 0.5;
  if (onesOnly) {
    const [ones3, ones2] = onesRegroupPair();
    const tens3 = randInt(0, 7);
    const tens2 = randInt(1, 8 - tens3);
    const hundreds = randInt(1, 9);
    return buildColumnProblem(
      threeDigit(hundreds, tens3, ones3),
      twoDigit(tens2, ones2),
      { levelId: "add-4b", showCarry: true }
    );
  }
  const ones3 = randInt(0, 8);
  const ones2 = randInt(0, 9 - ones3);
  const tens3 = randInt(1, 9);
  const tens2 = randInt(Math.max(1, 10 - tens3), 9);
  const hundreds = randInt(1, 8);
  return buildColumnProblem(
    threeDigit(hundreds, tens3, ones3),
    twoDigit(tens2, ones2),
    { levelId: "add-4b", showCarry: true }
  );
}

function onesNoRegroupPair() {
  const onesA = randInt(0, 8);
  const onesB = randInt(0, 9 - onesA);
  return [onesA, onesB];
}

function pairBelow(maxSum) {
  const a = randInt(0, Math.min(9, maxSum));
  const b = randInt(0, Math.min(9, maxSum - a));
  return [a, b];
}

function pairAtLeast(minSum) {
  const a = randInt(Math.max(0, minSum - 9), 9);
  const b = randInt(Math.max(0, minSum - a), 9);
  return [a, b];
}

function generateAdd5a() {
  const [oA, oB] = onesNoRegroupPair();
  const tA = randInt(0, 9);
  const tB = randInt(0, 9 - tA);
  const h1 = randInt(1, 8);
  const h2 = randInt(1, 9 - h1);
  return buildColumnProblem(threeDigit(h1, tA, oA), threeDigit(h2, tB, oB), { levelId: "add-5a", showCarry: false });
}

function generateAdd5b() {
  const flavor = ["ones", "tens", "hundreds"][randInt(0, 2)];
  if (flavor === "ones") {
    const [oA, oB] = onesRegroupPair();
    const tA = randInt(0, 8);
    const tB = randInt(0, 8 - tA);
    const h1 = randInt(1, 8);
    const h2 = randInt(1, 9 - h1);
    return buildColumnProblem(threeDigit(h1, tA, oA), threeDigit(h2, tB, oB), { levelId: "add-5b", showCarry: true });
  }
  if (flavor === "tens") {
    const [oA, oB] = onesNoRegroupPair();
    const tA = randInt(1, 9);
    const tB = randInt(Math.max(0, 10 - tA), 9);
    const h1 = randInt(1, 7);
    const h2 = randInt(1, 8 - h1);
    return buildColumnProblem(threeDigit(h1, tA, oA), threeDigit(h2, tB, oB), { levelId: "add-5b", showCarry: true });
  }
  const [oA, oB] = onesNoRegroupPair();
  const [tA, tB] = pairBelow(9);
  const hA = randInt(1, 9);
  const hB = randInt(Math.max(1, 10 - hA), 9);
  return buildColumnProblem(threeDigit(hA, tA, oA), threeDigit(hB, tB, oB), { levelId: "add-5b", showCarry: true });
}

function generateAdd5c() {
  const flavor = ["ot", "oh", "th"][randInt(0, 2)];
  if (flavor === "ot") {
    const [oA, oB] = onesRegroupPair();
    const tA = randInt(0, 9);
    const tB = randInt(Math.max(0, 9 - tA), 9);
    const h1 = randInt(1, 7);
    const h2 = randInt(1, 8 - h1);
    return buildColumnProblem(threeDigit(h1, tA, oA), threeDigit(h2, tB, oB), { levelId: "add-5c", showCarry: true });
  }
  if (flavor === "oh") {
    const [oA, oB] = onesRegroupPair();
    const tA = randInt(0, 8);
    const tB = randInt(0, 8 - tA);
    const hA = randInt(1, 9);
    const hB = randInt(Math.max(1, 10 - hA), 9);
    return buildColumnProblem(threeDigit(hA, tA, oA), threeDigit(hB, tB, oB), { levelId: "add-5c", showCarry: true });
  }
  const [oA, oB] = onesNoRegroupPair();
  const tA = randInt(1, 9);
  const tB = randInt(Math.max(0, 10 - tA), 9);
  const hA = randInt(1, 9);
  const hB = randInt(Math.max(1, 9 - hA), 9);
  return buildColumnProblem(threeDigit(hA, tA, oA), threeDigit(hB, tB, oB), { levelId: "add-5c", showCarry: true });
}

function generateAdd5d() {
  const [oA, oB] = onesRegroupPair();
  const tA = randInt(0, 9);
  const tB = randInt(Math.max(0, 9 - tA), 9);
  const hA = randInt(1, 9);
  const hB = randInt(Math.max(1, 9 - hA), 9);
  return buildColumnProblem(threeDigit(hA, tA, oA), threeDigit(hB, tB, oB), { levelId: "add-5d", showCarry: true });
}

function fourDigit(th, h, t, o) {
  return th * 1000 + h * 100 + t * 10 + o;
}

function pickTwoDigits(minSum, maxSum, lead) {
  const lo = lead ? 1 : 0;
  const pairs = [];
  for (let a = lo; a <= 9; a++) {
    for (let b = lo; b <= 9; b++) {
      const s = a + b;
      if (s >= minSum && s <= maxSum) pairs.push([a, b]);
    }
  }
  if (!pairs.length) throw new Error("no digit pair " + minSum + ".." + maxSum + " lead=" + lead);
  return pairs[randInt(0, pairs.length - 1)];
}

function buildFourByFlags(flags, levelId, showCarry) {
  let cin = 0;
  const da = [];
  const db = [];
  for (let i = 0; i < 4; i++) {
    const lead = i === 3;
    const want = flags[i];
    const minSum = want ? 10 - cin : lead ? 2 : 0;
    const maxSum = want ? 18 : 9 - cin;
    const [a, b] = pickTwoDigits(minSum, maxSum, lead);
    da.push(a);
    db.push(b);
    cin = Math.floor((a + b + cin) / 10);
  }
  return buildColumnProblem(
    fourDigit(da[3], da[2], da[1], da[0]),
    fourDigit(db[3], db[2], db[1], db[0]),
    { levelId, showCarry }
  );
}

function randomFlags(count) {
  const idx = [0, 1, 2, 3];
  const flags = [false, false, false, false];
  for (let n = 0; n < count; n++) {
    const j = randInt(0, idx.length - 1);
    flags[idx.splice(j, 1)[0]] = true;
  }
  return flags;
}

function generateAdd6a() {
  return buildFourByFlags([false, false, false, false], "add-6a", false);
}

function generateAdd6b() {
  return buildFourByFlags(randomFlags(1), "add-6b", true);
}

function generateAdd6c() {
  return buildFourByFlags(randomFlags(2), "add-6c", true);
}

function generateAdd6d() {
  return buildFourByFlags(randomFlags(3), "add-6d", true);
}

function generateAdd6e() {
  return buildFourByFlags([true, true, true, true], "add-6e", true);
}

function generateAdd7a() {
  let nums;
  for (let i = 0; i < 40; i++) {
    nums = [randInt(10, 99), randInt(10, 99), randInt(10, 99)];
    const ones = nums.reduce((s, n) => s + (n % 10), 0);
    if (ones >= 10 || Math.random() < 0.25) break;
  }
  nums.sort((a, b) => b - a);
  return buildAddProblem(nums, { levelId: "add-7a", showCarry: true });
}

function generateAdd7b() {
  const patterns = [
    [3, 3, 2],
    [3, 2, 2],
    [3, 3, 2],
    [3, 2, 3],
  ];
  const pat = patterns[randInt(0, patterns.length - 1)];
  const nums = pat.map((d) => (d === 2 ? randInt(10, 99) : randInt(100, 999)));
  nums.sort((a, b) => String(b).length - String(a).length || b - a);
  return buildAddProblem(nums, { levelId: "add-7b", showCarry: true });
}

function generateAdd6f() {
  if (Math.random() < 0.4) {
    return buildColumnProblem(9999, randInt(1, 9), { levelId: "add-6f", showCarry: true });
  }
  const [oA, oB] = onesRegroupPair();
  const tA = 9;
  const tB = randInt(0, 2);
  const hA = 9;
  const hB = randInt(0, 2);
  const thA = randInt(1, 9);
  const thB = randInt(Math.max(1, 9 - thA), 9);
  return buildColumnProblem(fourDigit(thA, hA, tA, oA), fourDigit(thB, hB, tB, oB), {
    levelId: "add-6f",
    showCarry: true,
  });
}

function generateAdd5e() {
  if (Math.random() < 0.45) {
    return buildColumnProblem(999, randInt(1, 9), { levelId: "add-5e", showCarry: true });
  }
  const [oA, oB] = onesRegroupPair();
  const tA = 9;
  const tB = randInt(0, 2);
  const hA = randInt(1, 9);
  const hB = randInt(Math.max(1, 9 - hA), 9);
  return buildColumnProblem(threeDigit(hA, tA, oA), threeDigit(hB, tB, oB), { levelId: "add-5e", showCarry: true });
}

function generateAdd4c() {
  const [ones3, ones2] = onesRegroupPair();
  const tens3 = randInt(0, 9);
  const minTens2 = Math.max(1, 9 - tens3);
  const tens2 = randInt(minTens2, 9);
  const hundreds = randInt(1, 8);
  return buildColumnProblem(
    threeDigit(hundreds, tens3, ones3),
    twoDigit(tens2, ones2),
    { levelId: "add-4c", showCarry: true }
  );
}

function buildSubNoRegroup(minuend, subtrahend, levelId) {
  const result = minuend - subtrahend;
  const pvM = placeValue(minuend);
  const pvS = placeValue(subtrahend);
  const pvR = placeValue(result);
  const columns = [];
  if (pvM.hundreds || pvS.hundreds || pvR.hundreds) columns.push("hundreds");
  if (pvM.tens || pvS.tens || pvR.tens || columns.includes("hundreds")) columns.push("tens");
  columns.push("ones");

  const places = [];
  const answers = {};
  for (const col of ["ones", "tens", "hundreds", "thousands"]) {
    if (!columns.includes(col)) continue;
    places.push(col);
    answers[col] = pvR[col];
  }

  const hints = [pvM.ones, pvS.ones, pvM.tens, pvS.tens, pvR.ones, pvR.tens];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }

  const prompts = {
    ones: columns.length === 1 ? "What is the difference?" : "Ones place. Subtract the ones.",
    tens: "Tens place. Subtract the tens.",
    hundreds: "Hundreds place. Subtract the hundreds.",
  };

  return {
    levelId,
    addends: [minuend, subtrahend],
    opSymbol: "−",
    sum: result,
    result,
    columns,
    showCarry: false,
    addendDigits: [pvM, pvS],
    places,
    answers,
    choices,
    prompts,
  };
}

function generateSub1a() {
  const a = randInt(1, 9);
  const b = randInt(0, a);
  return buildSubNoRegroup(a, b, "sub-1a");
}

function generateSub2a() {
  if (Math.random() < 0.45) {
    const onesM = randInt(1, 9);
    const onesS = randInt(1, onesM);
    const tens = randInt(1, 9);
    return buildSubNoRegroup(tens * 10 + onesM, onesS, "sub-2a");
  }
  const onesM = randInt(0, 9);
  const onesS = randInt(0, onesM);
  const tensS = randInt(1, 8);
  const tensM = randInt(tensS + 1, 9);
  return buildSubNoRegroup(tensM * 10 + onesM, tensS * 10 + onesS, "sub-2a");
}

function generateProblem(levelId) {
  const fn = {
    "add-1a": generateAdd1a,
    "add-1b": generateAdd1b,
    "add-2a": generateAdd2a,
    "add-2b": generateAdd2b,
    "add-2c": generateAdd2c,
    "add-3a": generateAdd3a,
    "add-3b": generateAdd3b,
    "add-3c": generateAdd3c,
    "add-3d": generateAdd3d,
    "add-4a": generateAdd4a,
    "add-4b": generateAdd4b,
    "add-4c": generateAdd4c,
    "add-5a": generateAdd5a,
    "add-5b": generateAdd5b,
    "add-5c": generateAdd5c,
    "add-5d": generateAdd5d,
    "add-5e": generateAdd5e,
    "add-6a": generateAdd6a,
    "add-6b": generateAdd6b,
    "add-6c": generateAdd6c,
    "add-6d": generateAdd6d,
    "add-6e": generateAdd6e,
    "add-6f": generateAdd6f,
    "add-7a": generateAdd7a,
    "add-7b": generateAdd7b,
    "sub-1a": generateSub1a,
    "sub-2a": generateSub2a,
  }[levelId];
  if (!fn) throw new Error("Level not implemented: " + levelId);
  return fn();
}
