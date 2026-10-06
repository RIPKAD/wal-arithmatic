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
  { id: "mul", label: "Multiplication", symbol: "×", enabled: true },
  { id: "div", label: "Division", symbol: "÷", enabled: true },
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
  hundredthousands: "100000s",
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
      { id: "sub-2b", title: "Regroup tens → ones", blurb: "42 − 15, 31 − 8", status: "ready" },
      { id: "sub-2c", title: "Fewer digits in the result", blurb: "22 − 15, 11 − 8", status: "ready" },
    ],
  },
  {
    group: "3. Three-digit − two- or three-digit",
    items: [
      { id: "sub-3a", title: "No regrouping", blurb: "586 − 243", status: "ready" },
      { id: "sub-3b", title: "Regroup ones only", blurb: "452 − 128", status: "ready" },
      { id: "sub-3c", title: "Regroup tens only", blurb: "654 − 271", status: "ready" },
      { id: "sub-3d", title: "Regroup two places", blurb: "523 − 167", status: "ready" },
      { id: "sub-3e", title: "Across one zero", blurb: "503 − 27, 406 − 158", status: "ready" },
      { id: "sub-3f", title: "Across two zeros", blurb: "500 − 27, 400 − 163", status: "ready" },
      { id: "sub-3g", title: "Fewer digits in the result", blurb: "201 − 198", status: "ready" },
    ],
  },
  {
    group: "4. Four-digit and mixed lengths",
    items: [
      { id: "sub-4a", title: "No regrouping", blurb: "3586 − 2243", status: "ready" },
      { id: "sub-4b", title: "Regroup one place", blurb: "Ones, tens, or hundreds", status: "ready" },
      { id: "sub-4c", title: "Regroup two places", blurb: "Any two columns", status: "ready" },
      { id: "sub-4d", title: "Regroup three places", blurb: "Walk left three times", status: "ready" },
      { id: "sub-4e", title: "Across zeros", blurb: "One, two, or three zeros", status: "ready" },
      { id: "sub-4f", title: "Fewer digits in the result", blurb: "Leading zero in the difference", status: "ready" },
    ],
  },
];

const MULTIPLICATION_LEVELS = [
  {
    group: "1. Single-digit × single-digit",
    items: [{ id: "mul-1", title: "Times-table facts", blurb: "8 × 3, 9 × 7", status: "ready" }],
  },
  {
    group: "2. Single-digit × two-digit",
    items: [
      { id: "mul-2a", title: "No regrouping", blurb: "2 × 34, 3 × 21", status: "ready" },
      { id: "mul-2b", title: "Regroup ones only", blurb: "Tens product still < 10", status: "ready" },
      { id: "mul-2c", title: "Regroup both places", blurb: "Ones and tens both carry", status: "ready" },
      { id: "mul-2d", title: "New hundreds place", blurb: "9 × 99, 8 × 75", status: "ready" },
    ],
  },
  {
    group: "3. Single-digit × three-digit",
    items: [
      { id: "mul-3a", title: "No regrouping", blurb: "2 × 314", status: "ready" },
      { id: "mul-3b", title: "Regroup ones or tens only", blurb: "One carry", status: "ready" },
      { id: "mul-3c", title: "Regroup two places", blurb: "Two carries", status: "ready" },
      { id: "mul-3d", title: "Zero in ones or tens", blurb: "6 × 205, 4 × 370", status: "ready" },
      { id: "mul-3e", title: "Chain of 9s", blurb: "7 × 999, 8 × 496", status: "ready" },
    ],
  },
  {
    group: "4. Two-digit × two-digit",
    items: [
      { id: "mul-4a", title: "No regrouping anywhere", blurb: "Placeholder 0, then add", status: "ready" },
      { id: "mul-4b", title: "Regroup in ones-partial only", blurb: "Second line still clean", status: "ready" },
      { id: "mul-4c", title: "Regroup in tens-partial only", blurb: "First line still clean", status: "ready" },
      { id: "mul-4d", title: "Regroup only when adding", blurb: "Partials clean, sum regroups", status: "ready" },
      { id: "mul-4e", title: "Regroup in partials and the sum", blurb: "Both layers", status: "ready" },
      { id: "mul-4f", title: "Zeros", blurb: "20 × 34 — still write the 0", status: "ready" },
    ],
  },
  {
    group: "5. Two-digit × three-digit",
    items: [
      { id: "mul-5a", title: "Regroup in one partial", blurb: "Ones or tens line", status: "ready" },
      { id: "mul-5b", title: "Regroup in both partials", blurb: "Each line carries", status: "ready" },
      { id: "mul-5c", title: "Regroup only when adding", blurb: "Partials clean", status: "ready" },
      { id: "mul-5d", title: "Regroup in partials and the sum", blurb: "Both layers", status: "ready" },
      { id: "mul-5e", title: "Zeros", blurb: "200 × 34 — write the placeholder", status: "ready" },
      { id: "mul-5f", title: "Chain of 9s", blurb: "72 × 999, 38 × 496", status: "ready" },
    ],
  },
  {
    group: "6. Three-digit × three-digit",
    items: [
      { id: "mul-6a", title: "One partial regroups", blurb: "Two placeholder zeros on the third line", status: "ready" },
      { id: "mul-6b", title: "Two partials regroup", blurb: "Third line still later", status: "ready" },
      { id: "mul-6c", title: "Regroup only when adding", blurb: "Partials clean", status: "ready" },
      { id: "mul-6d", title: "Partials and the sum", blurb: "Both layers", status: "ready" },
      { id: "mul-6e", title: "Zeros", blurb: "200 × 134 — write the placeholders", status: "ready" },
      { id: "mul-6f", title: "Chain of 9s", blurb: "725 × 999, 387 × 496", status: "ready" },
    ],
  },
];

const DIVISION_LEVELS = [
  {
    group: "1. One-digit divisor",
    items: [
      { id: "div-1a", title: "One-digit, no remainder", blurb: "8 ÷ 2 = 4", status: "ready" },
      { id: "div-1b", title: "One-digit, with remainder", blurb: "7 ÷ 2 = 3 r 1", status: "ready" },
      { id: "div-1c", title: "Two-digit, no regrouping", blurb: "With or without remainder", status: "ready" },
      { id: "div-1d", title: "Two-digit, regrouping", blurb: "With or without remainder", status: "ready" },
      { id: "div-1e", title: "First digit smaller than divisor", blurb: "Two-digit dividend", status: "ready" },
      { id: "div-1f", title: "Three-digit, no regrouping", blurb: "With or without remainder", status: "ready" },
      { id: "div-1g", title: "Three-digit, regroup once", blurb: "With or without remainder", status: "ready" },
      { id: "div-1h", title: "Three-digit, regroup twice", blurb: "With or without remainder", status: "ready" },
      { id: "div-1i", title: "First digit smaller than divisor", blurb: "Three-digit dividend", status: "ready" },
    ],
  },
  {
    group: "2. Two-digit divisor",
    items: [
      { id: "div-2a", title: "Two-digit dividend", blurb: "With or without remainder", status: "ready" },
      { id: "div-2b", title: "Three-digit, no regrouping", blurb: "With or without remainder", status: "ready" },
      { id: "div-2c", title: "Three-digit, regrouping", blurb: "With or without remainder", status: "ready" },
      { id: "div-2d", title: "Four-digit, regroup once", blurb: "With or without remainder", status: "ready" },
      { id: "div-2e", title: "Four-digit, regroup more than once", blurb: "With or without remainder", status: "ready" },
      { id: "div-2f", title: "Leading digits smaller than divisor", blurb: "3- or 4-digit dividend", status: "ready" },
      { id: "div-2g", title: "Zero in the quotient", blurb: "Middle or end", status: "ready" },
    ],
  },
  {
    group: "3. Three-digit divisor",
    items: [
      { id: "div-3a", title: "Three-digit dividend", blurb: "With or without remainder", status: "ready" },
      { id: "div-3b", title: "Four-digit, no regrouping", blurb: "With or without remainder", status: "ready" },
      { id: "div-3c", title: "Four-digit, regrouping", blurb: "With or without remainder", status: "ready" },
      { id: "div-3d", title: "Five-digit, regroup once", blurb: "With or without remainder", status: "ready" },
      { id: "div-3e", title: "Five-digit, regroup more than once", blurb: "With or without remainder", status: "ready" },
      { id: "div-3f", title: "Leading digits smaller than divisor", blurb: "4- or 5-digit dividend", status: "ready" },
      { id: "div-3g", title: "Zero in the quotient", blurb: "Middle or end", status: "ready" },
    ],
  },
];

function findLevel(id) {
  for (const catalog of [ADDITION_LEVELS, SUBTRACTION_LEVELS, MULTIPLICATION_LEVELS, DIVISION_LEVELS]) {
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
    hundredthousands: Math.floor(n / 100000) % 10,
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
  if (pvM.thousands || pvS.thousands || pvR.thousands) columns.push("thousands");
  if (pvM.hundreds || pvS.hundreds || pvR.hundreds || columns.includes("thousands")) columns.push("hundreds");
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
    thousands: "1000s place. Subtract the thousands.",
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

function generateSub2b() {
  if (Math.random() < 0.45) {
    const onesM = randInt(0, 8);
    const onesS = randInt(onesM + 1, 9);
    const tensM = randInt(2, 9);
    return buildSub2b(tensM * 10 + onesM, onesS, "sub-2b");
  }
  const onesM = randInt(0, 8);
  const onesS = randInt(onesM + 1, 9);
  const tensS = randInt(1, 7);
  const tensM = randInt(tensS + 2, 9);
  return buildSub2b(tensM * 10 + onesM, tensS * 10 + onesS, "sub-2b");
}

function generateSub2c() {
  if (Math.random() < 0.45) {
    const onesM = randInt(0, 8);
    const onesS = randInt(onesM + 1, 9);
    return buildSub2b(10 + onesM, onesS, "sub-2c");
  }
  const onesM = randInt(0, 8);
  const onesS = randInt(onesM + 1, 9);
  const tensS = randInt(1, 8);
  const tensM = tensS + 1;
  return buildSub2b(tensM * 10 + onesM, tensS * 10 + onesS, "sub-2c");
}

function buildSub2b(minuend, subtrahend, levelId) {
  const result = minuend - subtrahend;
  const pvM = placeValue(minuend);
  const pvS = placeValue(subtrahend);
  const pvR = placeValue(result);
  const tensNew = pvM.tens - 1;
  const onesDiff = pvM.ones + 10 - pvS.ones;
  const tensDiff = tensNew - pvS.tens;
  const hundredsDiff = pvM.hundreds - pvS.hundreds;
  const hasHundreds = pvM.hundreds > 0 || pvS.hundreds > 0 || hundredsDiff > 0;

  const places = ["tensNew", "onesTen", "ones", "tens"];
  const answers = {
    tensNew,
    onesTen: 1,
    ones: onesDiff,
    tens: tensDiff,
  };
  if (hasHundreds) {
    places.push("hundreds");
    answers.hundreds = hundredsDiff;
  }
  const hints = [pvM.ones, pvS.ones, pvM.tens, pvS.tens, pvM.hundreds, tensNew, onesDiff, tensDiff];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }

  return {
    levelId: levelId || "sub-2b",
    addends: [minuend, subtrahend],
    opSymbol: "−",
    sum: result,
    result,
    columns: hasHundreds ? ["hundreds", "tens", "ones"] : ["tens", "ones"],
    showCarry: false,
    showBorrow: true,
    borrowSlots: { tens: "tensNew" },
    borrowFrom: { tens: "tensNew" },
    onesJoin: { ones: "onesTen" },
    joinSlots: { ones: "onesTen" },
    joinAfter: { onesTen: "tensNew" },
    addendDigits: [pvM, pvS],
    places,
    answers,
    choices,
    prompts: {
      tensNew: "Ones need more. Write the new 10s digit.",
      onesTen: "Write 1 next to the ones digit.",
      ones: "Now subtract the ones.",
      tens: tensDiff === 0 ? "10s place — nothing left. Write 0." : "10s place. Subtract the tens.",
      hundreds: "100s place. Subtract the hundreds.",
    },
  };
}

function generateSub3c() {
  const onesM = randInt(0, 9);
  const onesS = randInt(0, onesM);
  const tensM = randInt(0, 8);
  const tensS = randInt(tensM + 1, 9);
  if (Math.random() < 0.4) {
    const hundreds = randInt(1, 9);
    return buildSub3c(hundreds * 100 + tensM * 10 + onesM, tensS * 10 + onesS);
  }
  const hundredsS = randInt(1, 8);
  const hundredsM = randInt(hundredsS + 1, 9);
  return buildSub3c(
    hundredsM * 100 + tensM * 10 + onesM,
    hundredsS * 100 + tensS * 10 + onesS
  );
}

function buildSub3c(minuend, subtrahend) {
  const result = minuend - subtrahend;
  const pvM = placeValue(minuend);
  const pvS = placeValue(subtrahend);
  const hundredsNew = pvM.hundreds - 1;
  const onesDiff = pvM.ones - pvS.ones;
  const tensDiff = pvM.tens + 10 - pvS.tens;
  const hundredsDiff = hundredsNew - pvS.hundreds;
  const places = ["ones", "hundredsNew", "tensTen", "tens", "hundreds"];
  const answers = {
    ones: onesDiff,
    hundredsNew,
    tensTen: 1,
    tens: tensDiff,
    hundreds: hundredsDiff,
  };
  const choices = {};
  const hints = [pvM.ones, pvS.ones, pvM.tens, pvS.tens, pvM.hundreds, onesDiff, tensDiff, hundredsNew];
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }
  return {
    levelId: "sub-3c",
    addends: [minuend, subtrahend],
    opSymbol: "−",
    sum: result,
    result,
    columns: ["hundreds", "tens", "ones"],
    showCarry: false,
    showBorrow: true,
    borrowSlots: { hundreds: "hundredsNew" },
    borrowFrom: { hundreds: "hundredsNew" },
    joinSlots: { tens: "tensTen" },
    joinAfter: { tensTen: "hundredsNew" },
    addendDigits: [pvM, pvS],
    places,
    answers,
    choices,
    prompts: {
      ones: "Ones place. Subtract the ones.",
      hundredsNew: "10s need more. Write the new 100s digit.",
      tensTen: "Write 1 next to the 10s digit.",
      tens: "Now subtract the tens.",
      hundreds: "100s place. Subtract the hundreds.",
    },
  };
}

function generateSub3d() {
  const onesM = randInt(0, 8);
  const onesS = randInt(onesM + 1, 9);
  const tensM = randInt(1, 8);
  const tensS = randInt(tensM, 9);
  const hundredsS = Math.random() < 0.35 ? 0 : randInt(1, 7);
  const hundredsM = randInt(Math.max(1, hundredsS + 1), 9);
  const minuend = hundredsM * 100 + tensM * 10 + onesM;
  const subtrahend = hundredsS * 100 + tensS * 10 + onesS;
  return buildSub3d(minuend, subtrahend);
}

function buildSub3d(minuend, subtrahend) {
  const result = minuend - subtrahend;
  const pvM = placeValue(minuend);
  const pvS = placeValue(subtrahend);
  const tensNew = pvM.tens - 1;
  const hundredsNew = pvM.hundreds - 1;
  const onesDiff = pvM.ones + 10 - pvS.ones;
  const tensDiff = tensNew + 10 - pvS.tens;
  const hundredsDiff = hundredsNew - pvS.hundreds;
  const places = ["tensNew", "onesTen", "ones", "hundredsNew", "tensTen", "tens", "hundreds"];
  const answers = {
    tensNew,
    onesTen: 1,
    ones: onesDiff,
    hundredsNew,
    tensTen: 1,
    tens: tensDiff,
    hundreds: hundredsDiff,
  };
  const hints = [pvM.ones, pvS.ones, pvM.tens, pvS.tens, pvM.hundreds, tensNew, hundredsNew, onesDiff, tensDiff];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }
  return {
    levelId: "sub-3d",
    addends: [minuend, subtrahend],
    opSymbol: "−",
    sum: result,
    result,
    columns: ["hundreds", "tens", "ones"],
    showCarry: false,
    showBorrow: true,
    borrowSlots: { tens: "tensNew", hundreds: "hundredsNew" },
    borrowFrom: { tens: "tensNew", hundreds: "hundredsNew" },
    joinSlots: { ones: "onesTen", tens: "tensTen" },
    joinOnBorrow: { tens: "tensTen" },
    joinAfter: { onesTen: "tensNew", tensTen: "hundredsNew" },
    addendDigits: [pvM, pvS],
    places,
    answers,
    choices,
    prompts: {
      tensNew: "Ones need more. Write the new 10s digit.",
      onesTen: "Write 1 next to the ones digit.",
      ones: "Now subtract the ones.",
      hundredsNew: "10s still need more. Write the new 100s digit.",
      tensTen: "Write 1 next to the new 10s digit.",
      tens: "Now subtract the tens.",
      hundreds: "100s place. Subtract the hundreds.",
    },
  };
}

function generateSub3e() {
  const onesM = randInt(0, 8);
  const onesS = randInt(onesM + 1, 9);
  const tensS = randInt(0, 9);
  if (Math.random() < 0.45) {
    const hundreds = randInt(1, 9);
    return buildSub3e(hundreds * 100 + onesM, tensS * 10 + onesS, "sub-3e");
  }
  const hundredsS = randInt(1, 8);
  const hundredsM = randInt(hundredsS + 1, 9);
  return buildSub3e(hundredsM * 100 + onesM, hundredsS * 100 + tensS * 10 + onesS, "sub-3e");
}

function generateSub3f() {
  const onesS = randInt(1, 9);
  const tensS = randInt(0, 9);
  if (Math.random() < 0.45) {
    const hundreds = randInt(1, 9);
    return buildSub3e(hundreds * 100, tensS * 10 + onesS, "sub-3f");
  }
  const hundredsS = randInt(1, 8);
  const hundredsM = randInt(hundredsS + 1, 9);
  return buildSub3e(hundredsM * 100, hundredsS * 100 + tensS * 10 + onesS, "sub-3f");
}

function generateSub3g() {
  const onesM = randInt(0, 8);
  const onesS = randInt(onesM + 1, 9);
  const tensS = randInt(0, 9);
  const hundredsS = randInt(1, 8);
  const hundredsM = hundredsS + 1;
  return buildSub3e(hundredsM * 100 + onesM, hundredsS * 100 + tensS * 10 + onesS, "sub-3g");
}

function buildSub3e(minuend, subtrahend, levelId) {
  const result = minuend - subtrahend;
  const pvM = placeValue(minuend);
  const pvS = placeValue(subtrahend);
  const hundredsNew = pvM.hundreds - 1;
  const onesDiff = pvM.ones + 10 - pvS.ones;
  const tensDiff = 9 - pvS.tens;
  const hundredsDiff = hundredsNew - pvS.hundreds;
  const places = ["hundredsNew", "tensTen", "tensNew", "onesTen", "ones", "tens", "hundreds"];
  const answers = {
    hundredsNew,
    tensTen: 1,
    tensNew: 9,
    onesTen: 1,
    ones: onesDiff,
    tens: tensDiff,
    hundreds: hundredsDiff,
  };
  const hints = [pvM.ones, pvS.ones, pvS.tens, pvM.hundreds, hundredsNew, onesDiff, tensDiff];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }
  return {
    levelId: levelId || "sub-3e",
    addends: [minuend, subtrahend],
    opSymbol: "−",
    sum: result,
    result,
    columns: ["hundreds", "tens", "ones"],
    showCarry: false,
    showBorrow: true,
    borrowSlots: { hundreds: "hundredsNew", tens: "tensNew" },
    borrowFrom: { hundreds: "hundredsNew", tens: "tensNew" },
    joinSlots: { tens: "tensTen", ones: "onesTen" },
    joinAfter: { tensTen: "hundredsNew", onesTen: "tensNew" },
    joinHideWhen: { tensTen: "tensNew" },
    addendDigits: [pvM, pvS],
    places,
    answers,
    choices,
    prompts: {
      hundredsNew:
        pvM.ones === 0 && pvM.tens === 0
          ? "Ones and tens are 0. Write the new 100s digit."
          : "Tens is 0. Write the new 100s digit.",
      tensTen: "Open the 0. Write 1 next to the 10s.",
      tensNew: "That 10 lends. Write 9 above the 10s.",
      onesTen: pvM.ones === 0 ? "Ones is 0. Write 1 next to it." : "Write 1 next to the ones digit.",
      ones: "Now subtract the ones.",
      tens: tensDiff === 0 ? "10s place — nothing left. Write 0." : "10s place. Subtract the tens.",
      hundreds: hundredsDiff === 0 ? "100s place — nothing left. Write 0." : "100s place. Subtract the hundreds.",
    },
  };
}

function generateSub3a() {
  if (Math.random() < 0.4) {
    const onesM = randInt(0, 9);
    const onesS = randInt(0, onesM);
    const tensM = randInt(1, 9);
    const tensS = randInt(1, tensM);
    const hundreds = randInt(1, 9);
    return buildSubNoRegroup(hundreds * 100 + tensM * 10 + onesM, tensS * 10 + onesS, "sub-3a");
  }
  const onesM = randInt(0, 9);
  const onesS = randInt(0, onesM);
  const tensM = randInt(0, 9);
  const tensS = randInt(0, tensM);
  const hundredsS = randInt(1, 8);
  const hundredsM = randInt(hundredsS + 1, 9);
  return buildSubNoRegroup(
    hundredsM * 100 + tensM * 10 + onesM,
    hundredsS * 100 + tensS * 10 + onesS,
    "sub-3a"
  );
}

function generateSub3b() {
  if (Math.random() < 0.4) {
    const onesM = randInt(0, 8);
    const onesS = randInt(onesM + 1, 9);
    const tensS = randInt(0, 8);
    const tensM = randInt(tensS + 1, 9);
    const hundreds = randInt(1, 9);
    return buildSub2b(hundreds * 100 + tensM * 10 + onesM, tensS * 10 + onesS, "sub-3b");
  }
  const onesM = randInt(0, 8);
  const onesS = randInt(onesM + 1, 9);
  const tensS = randInt(0, 8);
  const tensM = randInt(tensS + 1, 9);
  const hundredsS = randInt(1, 8);
  const hundredsM = randInt(hundredsS + 1, 9);
  return buildSub2b(
    hundredsM * 100 + tensM * 10 + onesM,
    hundredsS * 100 + tensS * 10 + onesS,
    "sub-3b"
  );
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

function subNewKey(col) {
  return { tens: "tensNew", hundreds: "hundredsNew", thousands: "thousandsNew" }[col] || null;
}
function subTenKey(col) {
  return { ones: "onesTen", tens: "tensTen", hundreds: "hundredsTen" }[col] || null;
}
function subLeft(col) {
  return { ones: "tens", tens: "hundreds", hundreds: "thousands" }[col] || null;
}

function buildSubWalk(minuend, subtrahend, levelId) {
  const result = minuend - subtrahend;
  const pvM = placeValue(minuend);
  const pvS = placeValue(subtrahend);
  const work = {
    ones: pvM.ones,
    tens: pvM.tens,
    hundreds: pvM.hundreds,
    thousands: pvM.thousands,
  };
  const take = {
    ones: pvS.ones,
    tens: pvS.tens,
    hundreds: pvS.hundreds,
    thousands: pvS.thousands,
  };
  const columns = [];
  if (pvM.thousands || pvS.thousands || result >= 1000) columns.push("thousands");
  if (pvM.hundreds || pvS.hundreds || result >= 100 || columns.includes("thousands")) columns.push("hundreds");
  if (pvM.tens || pvS.tens || result >= 10 || columns.includes("hundreds")) columns.push("tens");
  columns.push("ones");

  const places = [];
  const answers = {};
  const borrowSlots = {};
  const borrowFrom = {};
  const joinSlots = {};
  const joinAfter = {};
  const joinHideWhen = {};
  const joinOnBorrow = {};

  for (const col of ["ones", "tens", "hundreds", "thousands"]) {
    if (!columns.includes(col)) continue;
    if (work[col] >= take[col]) {
      places.push(col);
      answers[col] = work[col] - take[col];
      continue;
    }
    const zeros = [];
    let donor = subLeft(col);
    while (donor && work[donor] === 0) {
      zeros.push(donor);
      donor = subLeft(donor);
    }
    if (!donor || work[donor] <= 0) {
      throw new Error("Cannot regroup " + minuend + " − " + subtrahend);
    }
    const dk = subNewKey(donor);
    places.push(dk);
    answers[dk] = work[donor] - 1;
    work[donor] -= 1;
    borrowSlots[donor] = dk;
    borrowFrom[donor] = dk;

    let prev = dk;
    for (const z of zeros.slice().reverse()) {
      const tk = subTenKey(z);
      const zk = subNewKey(z);
      places.push(tk);
      answers[tk] = 1;
      joinSlots[z] = tk;
      joinAfter[tk] = prev;
      places.push(zk);
      answers[zk] = 9;
      work[z] = 9;
      borrowSlots[z] = zk;
      borrowFrom[z] = zk;
      joinHideWhen[tk] = zk;
      prev = zk;
    }

    const rk = subTenKey(col);
    places.push(rk);
    answers[rk] = 1;
    work[col] += 10;
    joinSlots[col] = rk;
    joinAfter[rk] = prev;
    if (borrowSlots[col] && borrowSlots[col] !== rk) joinOnBorrow[col] = rk;

    places.push(col);
    answers[col] = work[col] - take[col];
    work[col] -= take[col];
  }

  const hints = [pvM.ones, pvS.ones, pvM.tens, pvS.tens, pvM.hundreds, pvM.thousands, result % 10];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }

  const prompts = {
    ones: "Ones place. Subtract the ones.",
    tens: answers.tens === 0 ? "10s place — write 0." : "10s place. Subtract the tens.",
    hundreds: answers.hundreds === 0 ? "100s place — write 0." : "100s place. Subtract the hundreds.",
    thousands: answers.thousands === 0 ? "1000s place — write 0." : "1000s place. Subtract the thousands.",
    onesTen: "Write 1 next to the ones digit.",
    tensTen: "Write 1 next to the 10s digit.",
    hundredsTen: "Write 1 next to the 100s digit.",
    tensNew: answers.tensNew === 9 ? "That 10 lends. Write 9 above the 10s." : "Write the new 10s digit.",
    hundredsNew: answers.hundredsNew === 9 ? "That 10 lends. Write 9 above the 100s." : "Write the new 100s digit.",
    thousandsNew: "Write the new 1000s digit.",
  };

  return {
    levelId,
    addends: [minuend, subtrahend],
    opSymbol: "−",
    sum: result,
    result,
    columns,
    showCarry: false,
    showBorrow: Object.keys(borrowSlots).length > 0,
    borrowSlots,
    borrowFrom,
    joinSlots,
    joinAfter,
    joinHideWhen,
    joinOnBorrow,
    addendDigits: [pvM, pvS],
    places,
    answers,
    choices,
    prompts,
  };
}

function fourNum(th, h, t, o) {
  return th * 1000 + h * 100 + t * 10 + o;
}

function generateSub4a() {
  const pick = Math.random();
  if (pick < 0.34) {
    const oM = randInt(0, 9), oS = randInt(0, oM);
    const tM = randInt(0, 9), tS = randInt(0, tM);
    const hM = randInt(0, 9), hS = randInt(0, hM);
    const thS = randInt(1, 8), thM = randInt(thS + 1, 9);
    return buildSubNoRegroup(fourNum(thM, hM, tM, oM), fourNum(thS, hS, tS, oS), "sub-4a");
  }
  if (pick < 0.67) {
    const oM = randInt(0, 9), oS = randInt(0, oM);
    const tM = randInt(0, 9), tS = randInt(0, tM);
    const hM = randInt(0, 9), hS = randInt(0, hM);
    const thM = randInt(1, 9);
    return buildSubNoRegroup(fourNum(thM, hM, tM, oM), hS * 100 + tS * 10 + oS, "sub-4a");
  }
  const oM = randInt(0, 9), oS = randInt(0, oM);
  const tM = randInt(1, 9), tS = randInt(1, tM);
  const thM = randInt(1, 9), hM = randInt(0, 9);
  return buildSubNoRegroup(fourNum(thM, hM, tM, oM), tS * 10 + oS, "sub-4a");
}

function generateSub4b() {
  const kind = randInt(0, 2);
  const thM = randInt(1, 9);
  const thS = randInt(0, thM);
  if (kind === 0) {
    const oM = randInt(0, 8), oS = randInt(oM + 1, 9);
    const tS = randInt(0, 8), tM = randInt(tS + 1, 9);
    const hS = randInt(0, 9), hM = randInt(hS, 9);
    return buildSubWalk(fourNum(thM, hM, tM, oM), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4b");
  }
  if (kind === 1) {
    const oM = randInt(0, 9), oS = randInt(0, oM);
    const tM = randInt(0, 8), tS = randInt(tM + 1, 9);
    const hS = randInt(0, 8), hM = randInt(hS + 1, 9);
    return buildSubWalk(fourNum(thM, hM, tM, oM), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4b");
  }
  const oM = randInt(0, 9), oS = randInt(0, oM);
  const tM = randInt(0, 9), tS = randInt(0, tM);
  const hM = randInt(0, 8), hS = randInt(hM + 1, 9);
  const thS2 = randInt(0, thM - 1);
  return buildSubWalk(fourNum(thM, hM, tM, oM), thS2 * 1000 + hS * 100 + tS * 10 + oS, "sub-4b");
}

function generateSub4c() {
  const kind = randInt(0, 2);
  const thM = randInt(1, 9);
  if (kind === 0) {
    const oM = randInt(0, 8), oS = randInt(oM + 1, 9);
    const tM = randInt(1, 8), tS = randInt(tM, 9);
    const hS = randInt(0, 8), hM = randInt(hS + 1, 9);
    const thS = randInt(0, thM);
    return buildSubWalk(fourNum(thM, hM, tM, oM), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4c");
  }
  if (kind === 1) {
    const oM = randInt(0, 8), oS = randInt(oM + 1, 9);
    const tS = randInt(0, 8), tM = randInt(tS + 1, 9);
    const hM = randInt(0, 8), hS = randInt(hM + 1, 9);
    const thS = randInt(0, thM - 1);
    return buildSubWalk(fourNum(thM, hM, tM, oM), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4c");
  }
  const oM = randInt(0, 9), oS = randInt(0, oM);
  const tM = randInt(0, 8), tS = randInt(tM + 1, 9);
  const hM = randInt(1, 8), hS = randInt(hM, 9);
  const thS = randInt(0, thM - 1);
  return buildSubWalk(fourNum(thM, hM, tM, oM), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4c");
}

function generateSub4d() {
  const oM = randInt(0, 8), oS = randInt(oM + 1, 9);
  const tM = randInt(1, 8), tS = randInt(tM, 9);
  const hM = randInt(1, 8), hS = randInt(hM, 9);
  const thM = randInt(1, 9), thS = randInt(0, thM - 1);
  return buildSubWalk(fourNum(thM, hM, tM, oM), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4d");
}

function generateSub4e() {
  const kind = randInt(1, 3);
  const oM = kind === 3 ? 0 : randInt(0, 8);
  const oS = randInt(Math.max(1, oM + 1), 9);
  const tS = randInt(0, 9);
  const hS = randInt(0, 9);
  if (kind === 1) {
    const thM = randInt(1, 9), hM = randInt(1, 9);
    const thS = randInt(0, thM);
    const hS2 = randInt(0, hM - 1);
    return buildSubWalk(fourNum(thM, hM, 0, oM), thS * 1000 + hS2 * 100 + tS * 10 + oS, "sub-4e");
  }
  if (kind === 2) {
    const thM = randInt(1, 9);
    const thS = randInt(0, thM - 1);
    return buildSubWalk(fourNum(thM, 0, 0, oM), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4e");
  }
  const thM = randInt(1, 9);
  const thS = randInt(0, thM - 1);
  return buildSubWalk(fourNum(thM, 0, 0, 0), thS * 1000 + hS * 100 + tS * 10 + oS, "sub-4e");
}

function generateSub4f() {
  if (Math.random() < 0.5) {
    const oM = randInt(0, 8), oS = randInt(oM + 1, 9);
    const tS = randInt(0, 9);
    const hS = randInt(0, 9);
    const thS = randInt(1, 8);
    const thM = thS + 1;
    return buildSubWalk(fourNum(thM, 0, 0, oM), fourNum(thS, hS, tS, oS), "sub-4f");
  }
  const oM = randInt(0, 8), oS = randInt(oM + 1, 9);
  const tS = randInt(0, 8), tM = randInt(tS + 1, 9);
  const hS = randInt(0, 9), hM = randInt(hS, 9);
  const th = randInt(1, 9);
  return buildSubWalk(fourNum(th, hM, tM, oM), fourNum(th, hS, tS, oS), "sub-4f");
}

function flagsOf(n, m) {
  const p = buildMulTwoByTwo(n, m, "tmp");
  return p;
}

function generateMul4b() {
  for (let i = 0; i < 200; i++) {
    const n = randInt(11, 79);
    const m = randInt(12, 59);
    const p = buildMulTwoByTwo(n, m, "mul-4b");
    if (p.p1HasCarry && !p.p2HasCarry && !p.sumHasCarry) return p;
  }
  return buildMulTwoByTwo(23, 15, "mul-4b");
}

function generateMul4c() {
  for (let i = 0; i < 200; i++) {
    const n = randInt(11, 79);
    const m = randInt(12, 59);
    const p = buildMulTwoByTwo(n, m, "mul-4c");
    if (!p.p1HasCarry && p.p2HasCarry && !p.sumHasCarry) return p;
  }
  return buildMulTwoByTwo(23, 41, "mul-4c");
}

function generateMul4d() {
  for (let i = 0; i < 200; i++) {
    const n = randInt(11, 44);
    const m = randInt(12, 44);
    const p = buildMulTwoByTwo(n, m, "mul-4d");
    if (!p.p1HasCarry && !p.p2HasCarry && p.sumHasCarry) return p;
  }
  return buildMulTwoByTwo(22, 14, "mul-4d");
}

function generateMul4e() {
  for (let i = 0; i < 250; i++) {
    const n = randInt(15, 89);
    const m = randInt(15, 89);
    const p = buildMulTwoByTwo(n, m, "mul-4e");
    if (p.p1HasCarry && p.p2HasCarry && p.sumHasCarry) return p;
  }
  return buildMulTwoByTwo(27, 49, "mul-4e");
}

function generateMul4f() {
  const pool = [
    [20, 34], [20, 13], [20, 22], [30, 12], [40, 12],
    [15, 30], [12, 30], [21, 30], [40, 50], [20, 50],
    [25, 20], [16, 20], [34, 20], [18, 40], [22, 40],
  ];
  const [n, m] = pool[randInt(0, pool.length - 1)];
  return buildMulTwoByTwo(n, m, "mul-4f");
}

const MUL_COLS = ["ones", "tens", "hundreds", "thousands", "tenthousands", "hundredthousands"];

function buildMulLong(n, m, levelId) {
  const product = n * m;
  const pvN = placeValue(n);
  const pvM = placeValue(m);
  const factors = [{ k: 1, d: m % 10, shift: 0 }];
  if (m >= 10) factors.push({ k: 2, d: Math.floor(m / 10) % 10, shift: 1 });
  if (m >= 100) factors.push({ k: 3, d: Math.floor(m / 100) % 10, shift: 2 });

  const works = factors.map((f) => ({ ...f, work: mulByDigitWork(n, f.d) }));
  const empty = () => {
    const o = {};
    MUL_COLS.forEach((c) => (o[c] = 0));
    return o;
  };
  const rows = works.map(({ work, shift }) => {
    const grid = empty();
    const src = ["ones", "tens", "hundreds", "thousands"];
    src.forEach((c, i) => {
      const dest = MUL_COLS[i + shift];
      if (dest) grid[dest] = work.written[c] || 0;
    });
    return grid;
  });

  const sumDig = empty();
  const sumCarry = empty();
  let cin = 0;
  for (const col of MUL_COLS) {
    const s = rows.reduce((acc, r) => acc + (r[col] || 0), 0) + cin;
    sumDig[col] = s % 10;
    cin = Math.floor(s / 10);
    const idx = MUL_COLS.indexOf(col);
    if (MUL_COLS[idx + 1]) sumCarry[MUL_COLS[idx + 1]] = cin;
  }

  const columns = [];
  for (const col of [...MUL_COLS].reverse()) {
    const used =
      sumDig[col] ||
      sumCarry[col] ||
      rows.some((r) => r[col]) ||
      (col === "hundreds" && n >= 100) ||
      (col === "tens" && n >= 10);
    if (used || columns.length) columns.push(col);
  }
  if (!columns.includes("ones")) columns.push("ones");

  const places = [];
  const answers = {};
  const add = (k, v) => {
    places.push(k);
    answers[k] = v;
  };

  const rowMaps = [];
  const carryMaps = [];
  const hasFlags = [];

  works.forEach((f, idx) => {
    const prefix = "p" + f.k;
    const cmap = {};
    const rmap = {};
    if (f.shift >= 1) {
      add(f.k === 2 ? "shift0" : prefix + "shiftOnes", 0);
      rmap.ones = f.k === 2 ? "shift0" : prefix + "shiftOnes";
    }
    if (f.shift >= 2) {
      add(prefix + "shiftTens", 0);
      rmap.tens = prefix + "shiftTens";
    }
    const src = ["ones", "tens", "hundreds", "thousands"];
    src.forEach((c, i) => {
      const dest = MUL_COLS[i + f.shift];
      if (!dest || !columns.includes(dest)) return;
      const writeKey = prefix + dest.charAt(0).toUpperCase() + dest.slice(1);
      add(writeKey, rows[idx][dest]);
      rmap[dest] = writeKey;
      const nextProb = MUL_COLS[i + 1];
      const carryAmt = f.work.carry[nextProb] || 0;
      if (carryAmt) {
        const carryKey = prefix + "carry" + nextProb.charAt(0).toUpperCase() + nextProb.slice(1);
        add(carryKey, carryAmt);
        cmap[nextProb] = carryKey;
      }
    });
    rowMaps.push(rmap);
    carryMaps.push(cmap);
    hasFlags.push(f.work.hasCarry);
  });

  add("sumOnes", sumDig.ones);
  if (sumCarry.tens) add("sumCarryTens", sumCarry.tens);
  add("sumTens", sumDig.tens);
  if (sumCarry.hundreds) add("sumCarryHundreds", sumCarry.hundreds);
  if (columns.includes("hundreds")) add("sumHundreds", sumDig.hundreds);
  if (sumCarry.thousands) add("sumCarryThousands", sumCarry.thousands);
  if (columns.includes("thousands")) add("sumThousands", sumDig.thousands);
  if (sumCarry.tenthousands) add("sumCarryTenThousands", sumCarry.tenthousands);
  if (columns.includes("tenthousands")) add("sumTenThousands", sumDig.tenthousands);
  if (sumCarry.hundredthousands) add("sumCarryHundredThousands", sumCarry.hundredthousands);
  if (columns.includes("hundredthousands")) add("sumHundredThousands", sumDig.hundredthousands);

  const hints = [n % 10, Math.floor(n / 10) % 10, m % 10, Math.floor(m / 10) % 10];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }
  const sumHasCarry = MUL_COLS.some((c) => sumCarry[c] > 0);

  const prompts = {
    p1ones: "First line. Multiply by the ones digit.",
    p1tens: "First line. Tens.",
    p1hundreds: "First line. Hundreds.",
    p1thousands: "First line. Thousands.",
    p1carryTens: "First line. Carry above the 10s.",
    p1carryHundreds: "First line. Carry above the 100s.",
    p1carryThousands: "First line. Carry above the 1000s.",
    shift0: "Second line. Put 0 in the ones.",
    p2tens: "Second line. Multiply by the tens digit.",
    p2hundreds: "Second line. Next place.",
    p2thousands: "Second line. Next place.",
    p2tenthousands: "Second line. Next place.",
    p2carryTens: "Second line. Carry above the 10s.",
    p2carryHundreds: "Second line. Carry above the 100s.",
    p2carryThousands: "Second line. Carry above the 1000s.",
    p3shiftOnes: "Third line. Put 0 in the ones.",
    p3shiftTens: "Third line. Put 0 in the tens.",
    p3hundreds: "Third line. Multiply by the hundreds digit.",
    p3thousands: "Third line. Next place.",
    p3tenthousands: "Third line. Next place.",
    p3hundredthousands: "Third line. Next place.",
    p3carryTens: "Third line. Carry above the 10s.",
    p3carryHundreds: "Third line. Carry above the 100s.",
    p3carryThousands: "Third line. Carry above the 1000s.",
    sumOnes: "Add the ones.",
    sumCarryTens: "Sum. Carry above the 10s.",
    sumTens: "Add the tens.",
    sumCarryHundreds: "Sum. Carry above the 100s.",
    sumHundreds: "Add the hundreds.",
    sumCarryThousands: "Sum. Carry above the 1000s.",
    sumThousands: "Add the thousands.",
    sumCarryTenThousands: "Sum. Carry above the 10000s.",
    sumTenThousands: "Add the ten-thousands.",
    sumHundredThousands: "Add the hundred-thousands.",
  };

  return {
    levelId,
    layout: "partials",
    addends: [n, m],
    opSymbol: "×",
    sum: product,
    result: product,
    columns,
    showCarry: hasFlags.some(Boolean) || sumHasCarry,
    addendDigits: [pvN, pvM],
    places,
    answers,
    choices,
    prompts,
    p1HasCarry: !!hasFlags[0],
    p2HasCarry: !!hasFlags[1],
    p3HasCarry: !!hasFlags[2],
    sumHasCarry,
    partialCarryCount: hasFlags.filter(Boolean).length,
    rowP1Carry: carryMaps[0] || {},
    rowP1: rowMaps[0] || {},
    rowP2Carry: carryMaps[1] || {},
    rowP2: rowMaps[1] || {},
    rowP3Carry: carryMaps[2] || null,
    rowP3: rowMaps[2] || null,
    rowSumCarry: {
      tens: sumCarry.tens ? "sumCarryTens" : null,
      hundreds: sumCarry.hundreds ? "sumCarryHundreds" : null,
      thousands: sumCarry.thousands ? "sumCarryThousands" : null,
      tenthousands: sumCarry.tenthousands ? "sumCarryTenThousands" : null,
      hundredthousands: sumCarry.hundredthousands ? "sumCarryHundredThousands" : null,
    },
    rowSum: {
      ones: "sumOnes",
      tens: "sumTens",
      hundreds: columns.includes("hundreds") ? "sumHundreds" : null,
      thousands: columns.includes("thousands") ? "sumThousands" : null,
      tenthousands: columns.includes("tenthousands") ? "sumTenThousands" : null,
      hundredthousands: columns.includes("hundredthousands") ? "sumHundredThousands" : null,
    },
  };
}

function pickMul(id, pred, loN, hiN, loM, hiM, fallbackN, fallbackM) {
  for (let i = 0; i < 250; i++) {
    const n = randInt(loN, hiN);
    const m = randInt(loM, hiM);
    const p = buildMulLong(n, m, id);
    if (pred(p)) return p;
  }
  return buildMulLong(fallbackN, fallbackM, id);
}

function generateMul5a() {
  return pickMul("mul-5a", (p) => p.partialCarryCount === 1 && !p.sumHasCarry, 101, 498, 12, 48, 205, 13);
}
function generateMul5b() {
  return pickMul("mul-5b", (p) => p.p1HasCarry && p.p2HasCarry && !p.sumHasCarry, 115, 680, 15, 68, 125, 24);
}
function generateMul5c() {
  return pickMul("mul-5c", (p) => p.partialCarryCount === 0 && p.sumHasCarry, 111, 244, 12, 34, 134, 22);
}
function generateMul5d() {
  return pickMul("mul-5d", (p) => p.partialCarryCount >= 1 && p.sumHasCarry, 125, 780, 15, 79, 256, 34);
}
function generateMul5e() {
  const pool = [
    [200, 34], [200, 13], [150, 30], [400, 50], [300, 12],
    [205, 20], [370, 20], [108, 30], [250, 40], [120, 30],
  ];
  const [n, m] = pool[randInt(0, pool.length - 1)];
  return buildMulLong(n, m, "mul-5e");
}
function generateMul5f() {
  const pool = [
    [999, 72], [999, 38], [496, 38], [496, 72], [998, 46],
    [989, 37], [899, 56], [995, 28],
  ];
  const [n, m] = pool[randInt(0, pool.length - 1)];
  return buildMulLong(n, m, "mul-5f");
}
function generateMul6a() {
  return pickMul("mul-6a", (p) => p.partialCarryCount === 1 && !p.sumHasCarry, 101, 340, 101, 240, 111, 102);
}
function generateMul6b() {
  return pickMul("mul-6b", (p) => p.partialCarryCount === 2 && !p.sumHasCarry, 112, 450, 112, 350, 125, 124);
}
function generateMul6c() {
  return pickMul("mul-6c", (p) => p.partialCarryCount === 0 && p.sumHasCarry, 101, 222, 101, 222, 122, 122);
}
function generateMul6d() {
  return pickMul("mul-6d", (p) => p.partialCarryCount >= 1 && p.sumHasCarry, 125, 680, 125, 580, 256, 134);
}
function generateMul6e() {
  const pool = [
    [200, 134], [150, 300], [400, 500], [200, 111], [300, 120],
    [105, 200], [250, 200], [108, 300],
  ];
  const [n, m] = pool[randInt(0, pool.length - 1)];
  return buildMulLong(n, m, "mul-6e");
}
function generateMul6f() {
  const pool = [
    [999, 725], [496, 387], [999, 387], [496, 725], [998, 456],
    [989, 376], [899, 528],
  ];
  const [n, m] = pool[randInt(0, pool.length - 1)];
  return buildMulLong(n, m, "mul-6f");
}

function generateMul4a() {
  for (let i = 0; i < 120; i++) {
    const nT = randInt(1, 4);
    const nO = randInt(0, 4);
    const mT = randInt(1, 4);
    const mO = randInt(2, 4);
    if (mO * nO >= 10 || mO * nT >= 10 || mT * nO >= 10 || mT * nT >= 10) continue;
    const n = nT * 10 + nO;
    const m = mT * 10 + mO;
    const p1 = mO * n;
    const p2 = mT * n;
    const tensAdd = Math.floor(p1 / 10) % 10 + (p2 % 10);
    const hunAdd = Math.floor(p1 / 100) + Math.floor(p2 / 10) % 10;
    if (tensAdd >= 10 || hunAdd >= 10) continue;
    return buildMulTwoByTwo(n, m, "mul-4a");
  }
  return buildMulTwoByTwo(31, 12, "mul-4a");
}

function mulByDigitWork(n, d) {
  const pv = placeValue(n);
  const written = { ones: 0, tens: 0, hundreds: 0, thousands: 0 };
  const carry = { tens: 0, hundreds: 0, thousands: 0 };
  let cin = 0;
  const chain = [
    ["ones", "tens"],
    ["tens", "hundreds"],
    ["hundreds", "thousands"],
  ];
  for (const [col, next] of chain) {
    const prod = d * (pv[col] || 0) + cin;
    written[col] = prod % 10;
    cin = Math.floor(prod / 10);
    carry[next] = cin;
  }
  written.thousands = cin;
  return {
    written,
    carry,
    value: n * d,
    hasCarry: carry.tens > 0 || carry.hundreds > 0 || carry.thousands > 0,
  };
}

function buildMulTwoByTwo(n, m, levelId) {
  const product = n * m;
  const mO = m % 10;
  const mT = Math.floor(m / 10) % 10;
  const w1 = mulByDigitWork(n, mO);
  const w2 = mulByDigitWork(n, mT);
  const pvN = placeValue(n);
  const pvM = placeValue(m);

  const p1 = { ones: w1.written.ones, tens: w1.written.tens, hundreds: w1.written.hundreds, thousands: w1.written.thousands };
  const p2 = {
    ones: 0,
    tens: w2.written.ones,
    hundreds: w2.written.tens,
    thousands: w2.written.hundreds,
    tenthousands: w2.written.thousands,
  };

  const sumDig = {};
  const sumCarry = { tens: 0, hundreds: 0, thousands: 0, tenthousands: 0 };
  let cin = 0;
  for (const col of ["ones", "tens", "hundreds", "thousands", "tenthousands"]) {
    const s = (p1[col] || 0) + (p2[col] || 0) + cin;
    sumDig[col] = s % 10;
    cin = Math.floor(s / 10);
    const next = { ones: "tens", tens: "hundreds", hundreds: "thousands", thousands: "tenthousands" }[col];
    if (next) sumCarry[next] = cin;
  }

  const columns = [];
  if (sumDig.tenthousands || p2.tenthousands) columns.push("tenthousands");
  if (sumDig.thousands || p1.thousands || p2.thousands || columns.includes("tenthousands")) columns.push("thousands");
  if (sumDig.hundreds || p1.hundreds || p2.hundreds || columns.includes("thousands")) columns.push("hundreds");
  columns.push("tens", "ones");

  const places = [];
  const answers = {};
  function addPlace(key, val) {
    places.push(key);
    answers[key] = val;
  }

  addPlace("p1ones", p1.ones);
  if (w1.carry.tens) addPlace("p1carryTens", w1.carry.tens);
  addPlace("p1tens", p1.tens);
  if (w1.carry.hundreds) addPlace("p1carryHundreds", w1.carry.hundreds);
  if (columns.includes("hundreds") && (p1.hundreds || w1.carry.hundreds)) addPlace("p1hundreds", p1.hundreds);
  if (w1.carry.thousands) addPlace("p1carryThousands", w1.carry.thousands);
  if (p1.thousands) addPlace("p1thousands", p1.thousands);

  addPlace("shift0", 0);
  addPlace("p2tens", p2.tens);
  if (w2.carry.tens) addPlace("p2carryTens", w2.carry.tens);
  if (columns.includes("hundreds")) addPlace("p2hundreds", p2.hundreds);
  if (w2.carry.hundreds) addPlace("p2carryHundreds", w2.carry.hundreds);
  if (p2.thousands || columns.includes("thousands")) addPlace("p2thousands", p2.thousands);

  addPlace("sumOnes", sumDig.ones);
  if (sumCarry.tens) addPlace("sumCarryTens", sumCarry.tens);
  addPlace("sumTens", sumDig.tens);
  if (sumCarry.hundreds) addPlace("sumCarryHundreds", sumCarry.hundreds);
  if (columns.includes("hundreds")) addPlace("sumHundreds", sumDig.hundreds);
  if (sumCarry.thousands) addPlace("sumCarryThousands", sumCarry.thousands);
  if (columns.includes("thousands")) addPlace("sumThousands", sumDig.thousands);

  const hints = [mO, mT, n % 10, Math.floor(n / 10) % 10, p1.ones, p1.tens, p2.tens];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }

  const sumHasCarry = !!(sumCarry.tens || sumCarry.hundreds || sumCarry.thousands);

  return {
    levelId,
    layout: "partials",
    addends: [n, m],
    opSymbol: "×",
    sum: product,
    result: product,
    columns,
    showCarry: w1.hasCarry || w2.hasCarry || sumHasCarry,
    addendDigits: [pvN, pvM],
    places,
    answers,
    choices,
    p1HasCarry: w1.hasCarry,
    p2HasCarry: w2.hasCarry,
    sumHasCarry,
    rowP1Carry: {
      tens: w1.carry.tens ? "p1carryTens" : null,
      hundreds: w1.carry.hundreds ? "p1carryHundreds" : null,
      thousands: w1.carry.thousands ? "p1carryThousands" : null,
    },
    rowP1: {
      ones: "p1ones",
      tens: "p1tens",
      hundreds: answers.p1hundreds != null ? "p1hundreds" : null,
      thousands: answers.p1thousands != null ? "p1thousands" : null,
    },
    rowP2Carry: {
      tens: w2.carry.tens ? "p2carryTens" : null,
      hundreds: w2.carry.hundreds ? "p2carryHundreds" : null,
      thousands: w2.carry.thousands ? "p2carryThousands" : null,
    },
    rowP2: {
      ones: "shift0",
      tens: "p2tens",
      hundreds: answers.p2hundreds != null ? "p2hundreds" : null,
      thousands: answers.p2thousands != null ? "p2thousands" : null,
    },
    rowSumCarry: {
      tens: sumCarry.tens ? "sumCarryTens" : null,
      hundreds: sumCarry.hundreds ? "sumCarryHundreds" : null,
      thousands: sumCarry.thousands ? "sumCarryThousands" : null,
    },
    rowSum: {
      ones: "sumOnes",
      tens: "sumTens",
      hundreds: columns.includes("hundreds") ? "sumHundreds" : null,
      thousands: columns.includes("thousands") ? "sumThousands" : null,
    },
    prompts: {
      p1ones: w1.carry.tens ? "First line. Multiply by the ones. Digit that stays?" : "First line. Multiply by the ones digit.",
      p1carryTens: "First line. Carry above the 10s.",
      p1tens: w1.carry.tens ? "First line. Multiply the tens and add the carry." : "First line. Tens.",
      p1carryHundreds: "First line. Carry above the 100s.",
      p1hundreds: "First line. Hundreds.",
      p1carryThousands: "First line. Carry above the 1000s.",
      p1thousands: "First line. Thousands.",
      shift0: "Second line. Put 0 in the ones.",
      p2carryTens: "Second line. Carry above the 10s.",
      p2tens: w2.carry.tens ? "Second line. Multiply. Digit that stays?" : "Second line. Multiply by the tens digit.",
      p2carryHundreds: "Second line. Carry above the 100s.",
      p2hundreds: w2.carry.tens ? "Second line. Multiply and add the carry." : "Second line. Tens of that product.",
      p2carryThousands: "Second line. Carry above the 1000s.",
      p2thousands: "Second line. Hundreds of that product.",
      sumOnes: "Add the ones.",
      sumCarryTens: "Sum. Carry above the 10s.",
      sumTens: sumCarry.tens ? "Add the tens and the carry." : "Add the tens.",
      sumCarryHundreds: "Sum. Carry above the 100s.",
      sumHundreds: sumCarry.hundreds ? "Add the hundreds and the carry." : "Add the hundreds.",
      sumCarryThousands: "Sum. Carry above the 1000s.",
      sumThousands: "Add the thousands.",
    },
  };
}

function generateMul3a() {
  const m = randInt(2, 3);
  const cap = Math.floor(9 / m);
  const ones = randInt(0, cap);
  const tens = randInt(0, cap);
  const hundreds = randInt(1, cap);
  return buildMulNoCarry(hundreds * 100 + tens * 10 + ones, m, "mul-3a");
}

function generateMul3b() {
  if (Math.random() < 0.5) {
    for (let i = 0; i < 60; i++) {
      const m = randInt(3, 8);
      const ones = randInt(Math.ceil(10 / m), 9);
      const cT = Math.floor((m * ones) / 10);
      const maxT = Math.floor((9 - cT) / m);
      if (maxT < 0) continue;
      const tens = randInt(0, maxT);
      const maxH = Math.floor(9 / m);
      if (maxH < 1) continue;
      const hundreds = randInt(1, maxH);
      return buildMulTimes(hundreds * 100 + tens * 10 + ones, m, "mul-3b");
    }
  }
  for (let i = 0; i < 60; i++) {
    const m = randInt(3, 8);
    const maxO = Math.floor(9 / m);
    const ones = randInt(0, maxO);
    const tens = randInt(Math.ceil(10 / m), 9);
    const cH = Math.floor((m * tens) / 10);
    const maxH = Math.floor((9 - cH) / m);
    if (maxH < 1) continue;
    const hundreds = randInt(1, maxH);
    return buildMulTimes(hundreds * 100 + tens * 10 + ones, m, "mul-3b");
  }
  return buildMulTimes(214, 3, "mul-3b");
}

function generateMul3c() {
  for (let i = 0; i < 80; i++) {
    const m = randInt(3, 9);
    const ones = randInt(Math.ceil(10 / m), 9);
    const cT = Math.floor((m * ones) / 10);
    const minT = Math.ceil((10 - cT) / m);
    if (minT > 9) continue;
    const tens = randInt(Math.max(0, minT), 9);
    const cH = Math.floor((m * tens + cT) / 10);
    const hundreds = randInt(1, 9);
    const p = buildMulTimes(hundreds * 100 + tens * 10 + ones, m, "mul-3c");
    const carries = [p.answers.carryTens, p.answers.carryHundreds, p.answers.carryThousands].filter((x) => x);
    if (carries.length >= 2) return p;
  }
  return buildMulTimes(258, 4, "mul-3c");
}

function generateMul3d() {
  const pool = [
    [205, 6], [205, 4], [205, 7], [208, 6], [201, 9],
    [370, 4], [370, 3], [380, 4], [250, 6], [410, 5],
    [108, 9], [108, 7], [102, 8], [109, 6], [107, 5],
    [306, 5], [407, 6], [501, 8], [609, 4],
  ];
  const [n, m] = pool[randInt(0, pool.length - 1)];
  return buildMulTimes(n, m, "mul-3d");
}

function generateMul3e() {
  const pool = [
    [999, 7], [999, 8], [999, 6], [999, 9],
    [496, 8], [496, 7], [498, 6], [499, 8],
    [995, 7], [989, 6], [899, 7], [998, 5],
  ];
  const [n, m] = pool[randInt(0, pool.length - 1)];
  return buildMulTimes(n, m, "mul-3e");
}

function generateMul2b() {
  for (let i = 0; i < 80; i++) {
    const m = randInt(3, 9);
    const ones = randInt(Math.ceil(10 / m), 9);
    const carry = Math.floor((m * ones) / 10);
    const maxTens = Math.floor((9 - carry) / m);
    if (maxTens < 1) continue;
    const tens = randInt(1, maxTens);
    return buildMulTimes(tens * 10 + ones, m, "mul-2b");
  }
  return buildMulTimes(24, 3, "mul-2b");
}

function generateMul2c() {
  for (let i = 0; i < 80; i++) {
    const m = randInt(3, 9);
    const ones = randInt(Math.ceil(10 / m), 9);
    const carry = Math.floor((m * ones) / 10);
    const minTens = Math.ceil((10 - carry) / m);
    if (minTens > 9 || minTens < 1) continue;
    const tens = randInt(minTens, 9);
    return buildMulTimes(tens * 10 + ones, m, "mul-2c");
  }
  return buildMulTimes(28, 4, "mul-2c");
}

function generateMul2d() {
  const pairs = [
    [99, 9], [99, 8], [99, 7], [88, 9], [88, 8],
    [75, 8], [75, 9], [86, 8], [96, 7], [85, 9],
    [79, 8], [98, 6], [87, 9], [76, 8],
  ];
  const [n, m] = pairs[randInt(0, pairs.length - 1)];
  return buildMulTimes(n, m, "mul-2d");
}

function buildMulTimes(n, m, levelId) {
  const product = n * m;
  const pvN = placeValue(n);
  const pvM = placeValue(m);
  const onesProd = m * pvN.ones;
  const carryTens = Math.floor(onesProd / 10);
  const onesDigit = onesProd % 10;
  const tensProd = m * pvN.tens + carryTens;
  const carryHundreds = Math.floor(tensProd / 10);
  const tensDigit = tensProd % 10;
  const hundredsProd = m * (pvN.hundreds || 0) + carryHundreds;
  const carryThousands = Math.floor(hundredsProd / 10);
  const hundredsDigit = hundredsProd % 10;
  const thousandsDigit = m * (pvN.thousands || 0) + carryThousands;

  const columns = [];
  if (thousandsDigit > 0 || pvN.thousands) columns.push("thousands");
  if (hundredsDigit > 0 || pvN.hundreds || carryHundreds || columns.includes("thousands")) columns.push("hundreds");
  if (tensDigit > 0 || pvN.tens || carryTens || columns.includes("hundreds")) columns.push("tens");
  columns.push("ones");

  const showCarry = carryTens > 0 || carryHundreds > 0 || carryThousands > 0;
  const places = ["ones"];
  const answers = { ones: onesDigit };
  if (showCarry && carryTens) {
    places.push("carryTens");
    answers.carryTens = carryTens;
  }
  if (columns.includes("tens")) {
    places.push("tens");
    answers.tens = tensDigit;
  }
  if (showCarry && carryHundreds) {
    places.push("carryHundreds");
    answers.carryHundreds = carryHundreds;
  }
  if (columns.includes("hundreds")) {
    places.push("hundreds");
    answers.hundreds = hundredsDigit;
  }
  if (showCarry && carryThousands) {
    places.push("carryThousands");
    answers.carryThousands = carryThousands;
  }
  if (columns.includes("thousands")) {
    places.push("thousands");
    answers.thousands = thousandsDigit % 10;
  }

  const hints = [pvN.ones, pvN.tens, m, onesDigit, tensDigit, carryTens, carryHundreds];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }

  return {
    levelId,
    addends: [n, m],
    opSymbol: "×",
    sum: product,
    result: product,
    columns,
    showCarry,
    addendDigits: [pvN, pvM],
    places,
    answers,
    choices,
    prompts: {
      ones: carryTens ? "Ones. Multiply. What digit stays?" : "Ones. Multiply the ones.",
      carryTens: carryTens === 1 ? "Carry 1. Write it above the 10s." : "Carry. Write it above the 10s.",
      tens: carryTens ? "Tens. Multiply and add the carry." : "Tens. Multiply the tens.",
      carryHundreds: "Carry. Write it above the 100s.",
      hundreds: carryHundreds ? "100s. Multiply and add the carry." : "Hundreds. Multiply the hundreds.",
      carryThousands: "Carry. Write it above the 1000s.",
      thousands: "1000s — the new thousand.",
    },
  };
}

function generateMul2a() {
  const m = randInt(2, 4);
  const ones = randInt(0, Math.floor(9 / m));
  const tens = randInt(1, Math.floor(9 / m));
  const n = tens * 10 + ones;
  return buildMulNoCarry(n, m, "mul-2a");
}

function buildMulNoCarry(n, m, levelId) {
  const product = n * m;
  const pvN = placeValue(n);
  const pvM = placeValue(m);
  const pvP = placeValue(product);
  const columns = [];
  if (pvP.hundreds || pvN.hundreds) columns.push("hundreds");
  if (pvP.tens || pvN.tens || columns.includes("hundreds")) columns.push("tens");
  columns.push("ones");
  const places = [];
  const answers = {};
  for (const col of ["ones", "tens", "hundreds"]) {
    if (!columns.includes(col)) continue;
    places.push(col);
    answers[col] = pvP[col];
  }
  const hints = [pvN.ones, pvN.tens, m, pvP.ones, pvP.tens];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }
  return {
    levelId,
    addends: [n, m],
    opSymbol: "×",
    sum: product,
    result: product,
    columns,
    showCarry: false,
    addendDigits: [pvN, pvM],
    places,
    answers,
    choices,
    prompts: {
      ones: "Ones. Multiply the ones.",
      tens: "Tens. Multiply the tens.",
      hundreds: "Hundreds. Multiply the hundreds.",
    },
  };
}

function generateMul1() {
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const product = a * b;
  const pvA = placeValue(a);
  const pvB = placeValue(b);
  const pvP = placeValue(product);
  const columns = product >= 10 ? ["tens", "ones"] : ["ones"];
  const places = ["ones"];
  const answers = { ones: pvP.ones };
  if (product >= 10) {
    places.push("tens");
    answers.tens = pvP.tens;
  }
  const hints = [a, b, pvP.ones, pvP.tens];
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...distractorsFor(answers[place], hints)]);
  }
  return {
    levelId: "mul-1",
    addends: [a, b],
    opSymbol: "×",
    sum: product,
    result: product,
    columns,
    showCarry: false,
    addendDigits: [pvA, pvB],
    places,
    answers,
    choices,
    prompts: {
      ones: product >= 10 ? "Ones place of the product." : "What is the product?",
      tens: "Tens place of the product.",
    },
  };
}

function divDigitSteps(dividend, divisor) {
  const digits = String(dividend).split("").map(Number);
  let incoming = 0;
  return digits.map((digit, i) => {
    const work = incoming * 10 + digit;
    const q = Math.floor(work / divisor);
    const prod = q * divisor;
    const rem = work - prod;
    const step = { i, digit, incoming, work, q, prod, rem };
    incoming = rem;
    return step;
  });
}

function buildDivThree(dividend, divisor, levelId) {
  const steps = divDigitSteps(dividend, divisor);
  const [h, t, o] = steps;
  const places = [];
  const answers = {};
  const prompts = {};
  function add(key, val, prompt) {
    places.push(key);
    answers[key] = val;
    prompts[key] = prompt;
  }
  function addProd(prefix, prod, q, workLabel) {
    const ones = prod % 10;
    const tens = Math.floor(prod / 10);
    add(prefix + "Ones", ones, tens ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + q + "?");
    if (tens) add(prefix + "Tens", tens, "Tens digit of that product.");
  }
  function addSub(prefix, rem, work) {
    add(prefix + "Ones", rem % 10, "Subtract the ones. What is left?");
    if (work >= 10) add(prefix + "Tens", Math.floor(rem / 10), "Subtract the tens. What is left?");
  }

  add("qH", h.q, "Hundreds. How many times does " + divisor + " go into " + h.work + "?");
  addProd("p0", h.prod, h.q);
  addSub("s0", h.rem, h.work);
  add("bringT", t.digit, "Bring down the tens.");
  add("qT", t.q, "How many times does " + divisor + " go into " + t.work + "?");
  addProd("p1", t.prod, t.q);
  addSub("s1", t.rem, t.work);
  add("bringO", o.digit, "Bring down the ones.");
  add("qO", o.q, "How many times does " + divisor + " go into " + o.work + "?");
  addProd("p2", o.prod, o.q);
  addSub("s2", o.rem, o.work);
  if (o.rem > 0) add("sideRem", o.rem, "What is the remainder?");

  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  const quot = h.q * 100 + t.q * 10 + o.q;
  return {
    levelId,
    layout: "division",
    divDigits: 3,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: o.rem,
    dividend,
    divisor,
    dH: h.digit,
    dT: t.digit,
    dO: o.digit,
    steps,
    places,
    answers,
    choices,
    prompts,
  };
}

function countRegroups(dividend, divisor) {
  const steps = divDigitSteps(dividend, divisor);
  return (steps[0].rem > 0 ? 1 : 0) + (steps[1].rem > 0 ? 1 : 0);
}

function generateDiv1f() {
  for (let i = 0; i < 80; i++) {
    const d = randInt(2, 4);
    const qH = randInt(1, Math.floor(9 / d));
    const qT = randInt(0, Math.floor(9 / d));
    const qO = randInt(0, Math.floor(9 / d));
    const rem = Math.random() < 0.4 ? randInt(1, d - 1) : 0;
    const n = qH * d * 100 + qT * d * 10 + qO * d + rem;
    if (n < 100 || n > 999) continue;
    if (countRegroups(n, d) !== 0) continue;
    return buildDivThree(n, d, "div-1f");
  }
  return buildDivThree(848, 2, "div-1f");
}

function generateDiv1g() {
  for (let i = 0; i < 120; i++) {
    const d = randInt(2, 8);
    const n = randInt(100, 999);
    if (Math.floor(n / 100) < d) continue;
    if (countRegroups(n, d) !== 1) continue;
    return buildDivThree(n, d, "div-1g");
  }
  return buildDivThree(486, 3, "div-1g");
}

function generateDiv1h() {
  for (let i = 0; i < 120; i++) {
    const d = randInt(2, 8);
    const n = randInt(100, 999);
    if (Math.floor(n / 100) < d) continue;
    if (countRegroups(n, d) !== 2) continue;
    return buildDivThree(n, d, "div-1h");
  }
  return buildDivThree(835, 3, "div-1h");
}

function generateDiv1i() {
  for (let i = 0; i < 80; i++) {
    const d = randInt(3, 9);
    const n = randInt(100, 999);
    if (Math.floor(n / 100) >= d) continue;
    if (n < d) continue;
    return buildDivThree(n, d, "div-1i");
  }
  return buildDivThree(248, 5, "div-1i");
}

function buildDiv32(dividend, divisor, levelId) {
  const dH = Math.floor(dividend / 100);
  const dT = Math.floor(dividend / 10) % 10;
  const dO = dividend % 10;
  const firstTwo = dH * 10 + dT;
  const qT = Math.floor(firstTwo / divisor);
  const p1 = qT * divisor;
  const s1 = firstTwo - p1;
  const work2 = s1 * 10 + dO;
  const qO = Math.floor(work2 / divisor);
  const p2 = qO * divisor;
  const s2 = work2 - p2;
  const places = ["qT"];
  const answers = {
    qT,
    p1Ones: p1 % 10,
    p1Tens: Math.floor(p1 / 10) % 10,
    s1Ones: s1 % 10,
    s1Tens: Math.floor(s1 / 10),
    bringO: dO,
    qO,
    p2Ones: p2 % 10,
    p2Tens: Math.floor(p2 / 10) % 10,
    p2Huns: Math.floor(p2 / 100) % 10,
    s2Ones: s2 % 10,
    s2Tens: Math.floor(s2 / 10) % 10,
    s2Huns: Math.floor(s2 / 100) % 10,
    sideRemOnes: s2 % 10,
    sideRemTens: Math.floor(s2 / 10) % 10,
  };
  const prompts = {
    qT: "How many times does " + divisor + " go into " + firstTwo + "?",
    p1Ones: p1 >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + qT + "?",
    p1Tens: "Tens digit of that product.",
    s1Ones: "Subtract the ones. What is left?",
    s1Tens: "Subtract the tens. What is left?",
    bringO: "Bring down the ones.",
    qO: "How many times does " + divisor + " go into " + work2 + "?",
    p2Ones: p2 >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + qO + "?",
    p2Tens: "Tens digit of that product.",
    p2Huns: "Hundreds digit of that product.",
    s2Ones: "Subtract the ones. What is left?",
    s2Tens: "Subtract the tens. What is left?",
    s2Huns: "Subtract the hundreds. What is left?",
    sideRem: "What is the remainder?",
    sideRemOnes: "Remainder. Ones digit.",
    sideRemTens: "Remainder. Tens digit.",
  };
  places.push("p1Ones");
  if (p1 >= 10) places.push("p1Tens");
  places.push("s1Ones");
  if (firstTwo >= 10) places.push("s1Tens");
  places.push("bringO", "qO", "p2Ones");
  if (p2 >= 10) places.push("p2Tens");
  if (p2 >= 100) places.push("p2Huns");
  places.push("s2Ones");
  if (work2 >= 10) places.push("s2Tens");
  if (work2 >= 100) places.push("s2Huns");
  if (s2 > 0 && s2 < 10) {
    places.push("sideRem");
    answers.sideRem = s2;
  } else if (s2 >= 10) {
    places.push("sideRemOnes", "sideRemTens");
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  const quot = qT * 10 + qO;
  return {
    levelId,
    layout: "division",
    divDigits: 3,
    mode32: true,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: s2,
    dividend,
    divisor,
    dH,
    dT,
    dO,
    firstTwo,
    work2,
    places,
    answers,
    choices,
    prompts,
  };
}

function generateDiv2b() {
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(11, 24);
    const qT = randInt(2, 8);
    const firstTwo = divisor * qT;
    if (firstTwo < 10 || firstTwo > 99) continue;
    const dO = randInt(0, 9);
    const n = firstTwo * 10 + dO;
    if (n < 100 || n > 999) continue;
    return buildDiv32(n, divisor, "div-2b");
  }
  return buildDiv32(248, 12, "div-2b");
}

function generateDiv2c() {
  for (let i = 0; i < 100; i++) {
    const divisor = randInt(11, 24);
    const n = randInt(120, 999);
    const firstTwo = Math.floor(n / 10);
    if (firstTwo < divisor) continue;
    const s1 = firstTwo % divisor;
    if (s1 === 0) continue;
    return buildDiv32(n, divisor, "div-2c");
  }
  return buildDiv32(288, 12, "div-2c");
}

function addDivProd(places, answers, prompts, prefix, prod, divisor, q) {
  places.push(prefix + "Ones");
  answers[prefix + "Ones"] = prod % 10;
  prompts[prefix + "Ones"] = prod >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + q + "?";
  if (prod >= 10) {
    places.push(prefix + "Tens");
    answers[prefix + "Tens"] = Math.floor(prod / 10) % 10;
    prompts[prefix + "Tens"] = "Tens digit of that product.";
  }
  if (prod >= 100) {
    places.push(prefix + "Huns");
    answers[prefix + "Huns"] = Math.floor(prod / 100) % 10;
    prompts[prefix + "Huns"] = "Hundreds digit of that product.";
  }
}

function addDivSub(places, answers, prompts, prefix, rem, work) {
  places.push(prefix + "Ones");
  answers[prefix + "Ones"] = rem % 10;
  prompts[prefix + "Ones"] = "Subtract the ones. What is left?";
  if (work >= 10) {
    places.push(prefix + "Tens");
    answers[prefix + "Tens"] = Math.floor(rem / 10) % 10;
    prompts[prefix + "Tens"] = "Subtract the tens. What is left?";
  }
  if (work >= 100) {
    places.push(prefix + "Huns");
    answers[prefix + "Huns"] = Math.floor(rem / 100) % 10;
    prompts[prefix + "Huns"] = "Subtract the hundreds. What is left?";
  }
}

function buildDiv42(dividend, divisor, levelId) {
  const dTh = Math.floor(dividend / 1000);
  const dH = Math.floor(dividend / 100) % 10;
  const dT = Math.floor(dividend / 10) % 10;
  const dO = dividend % 10;
  const firstTwo = dTh * 10 + dH;
  const qH = Math.floor(firstTwo / divisor);
  const p1 = qH * divisor;
  const s1 = firstTwo - p1;
  const work2 = s1 * 10 + dT;
  const qT = Math.floor(work2 / divisor);
  const p2 = qT * divisor;
  const s2 = work2 - p2;
  const work3 = s2 * 10 + dO;
  const qO = Math.floor(work3 / divisor);
  const p3 = qO * divisor;
  const s3 = work3 - p3;
  const places = ["qH"];
  const answers = { qH, bringT: dT, qT, bringO: dO, qO };
  const prompts = {
    qH: "How many times does " + divisor + " go into " + firstTwo + "?",
    bringT: "Bring down the tens.",
    qT: "How many times does " + divisor + " go into " + work2 + "?",
    bringO: "Bring down the ones.",
    qO: "How many times does " + divisor + " go into " + work3 + "?",
  };
  addDivProd(places, answers, prompts, "p1", p1, divisor, qH);
  addDivSub(places, answers, prompts, "s1", s1, firstTwo);
  places.push("bringT", "qT");
  addDivProd(places, answers, prompts, "p2", p2, divisor, qT);
  addDivSub(places, answers, prompts, "s2", s2, work2);
  places.push("bringO", "qO");
  addDivProd(places, answers, prompts, "p3", p3, divisor, qO);
  addDivSub(places, answers, prompts, "s3", s3, work3);
  if (s3 > 0 && s3 < 10) {
    places.push("sideRem");
    answers.sideRem = s3;
    prompts.sideRem = "What is the remainder?";
  } else if (s3 >= 10) {
    places.push("sideRemOnes", "sideRemTens");
    answers.sideRemOnes = s3 % 10;
    answers.sideRemTens = Math.floor(s3 / 10);
    prompts.sideRemOnes = "Remainder. Ones digit.";
    prompts.sideRemTens = "Remainder. Tens digit.";
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  const quot = qH * 100 + qT * 10 + qO;
  return {
    levelId,
    layout: "division",
    divDigits: 4,
    mode42: true,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: s3,
    dividend,
    divisor,
    dTh,
    dH,
    dT,
    dO,
    firstTwo,
    work2,
    work3,
    places,
    answers,
    choices,
    prompts,
  };
}

function regroupCount42(n, d) {
  const first = Math.floor(n / 100);
  const s1 = first % d;
  const dT = Math.floor(n / 10) % 10;
  const s2 = (s1 * 10 + dT) % d;
  return (s1 > 0 ? 1 : 0) + (s2 > 0 ? 1 : 0);
}

function generateDiv2d() {
  for (let i = 0; i < 250; i++) {
    const divisor = randInt(12, 24);
    const n = randInt(1000, 9999);
    if (Math.floor(n / 100) < divisor) continue;
    if (regroupCount42(n, divisor) !== 1) continue;
    return buildDiv42(n, divisor, "div-2d");
  }
  return buildDiv42(1448, 12, "div-2d");
}

function generateDiv2e() {
  for (let i = 0; i < 250; i++) {
    const divisor = randInt(12, 24);
    const n = randInt(1000, 9999);
    if (Math.floor(n / 100) < divisor) continue;
    if (regroupCount42(n, divisor) < 2) continue;
    return buildDiv42(n, divisor, "div-2e");
  }
  return buildDiv42(1572, 12, "div-2e");
}

function generateDiv2f() {
  if (Math.random() < 0.5) {
    for (let i = 0; i < 80; i++) {
      const divisor = randInt(15, 40);
      const firstTwo = randInt(10, divisor - 1);
      const ones = randInt(0, 9);
      const n = firstTwo * 10 + ones;
      if (n < divisor) continue;
      return buildDiv32(n, divisor, "div-2f");
    }
    return buildDiv32(184, 23, "div-2f");
  }
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(15, 40);
    const firstTwo = randInt(10, Math.min(99, divisor - 1));
    const rest = randInt(0, 99);
    const n = firstTwo * 100 + rest;
    if (n < divisor) continue;
    return buildDiv42(n, divisor, "div-2f");
  }
  return buildDiv42(1848, 23, "div-2f");
}

function generateDiv2g() {
  if (Math.random() < 0.45) {
    for (let i = 0; i < 100; i++) {
      const divisor = randInt(12, 24);
      const qT = randInt(1, 8);
      const firstTwo = divisor * qT + randInt(0, divisor - 1);
      if (firstTwo < divisor || firstTwo > 99) continue;
      const ones = randInt(0, divisor - 1);
      const n = firstTwo * 10 + ones;
      const qO = Math.floor((firstTwo % divisor * 10 + ones) / divisor);
      if (qO !== 0) continue;
      return buildDiv32(n, divisor, "div-2g");
    }
    return buildDiv32(360, 12, "div-2g");
  }
  const middle = Math.random() < 0.5;
  for (let i = 0; i < 150; i++) {
    const divisor = randInt(12, 24);
    const n = randInt(1000, 9999);
    const first = Math.floor(n / 100);
    if (first < divisor) continue;
    const qH = Math.floor(first / divisor);
    if (qH < 1) continue;
    const s1 = first % divisor;
    const dT = Math.floor(n / 10) % 10;
    const dO = n % 10;
    const work2 = s1 * 10 + dT;
    const qT = Math.floor(work2 / divisor);
    const work3 = (work2 % divisor) * 10 + dO;
    const qO = Math.floor(work3 / divisor);
    if (middle) {
      if (qT !== 0 || qO === 0) continue;
    } else if (qO !== 0) continue;
    return buildDiv42(n, divisor, "div-2g");
  }
  return buildDiv42(middle ? 2412 : 1440, 12, "div-2g");
}

function buildDivShortThree(dividend, divisor, levelId) {
  const quot = Math.floor(dividend / divisor);
  const rem = dividend % divisor;
  const prod = quot * divisor;
  const dH = Math.floor(dividend / 100);
  const dT = Math.floor(dividend / 10) % 10;
  const dO = dividend % 10;
  const places = ["qOnes"];
  const answers = { qOnes: quot };
  const prompts = {
    qOnes: "How many times does " + divisor + " go into " + dividend + "?",
    pWorkOnes: prod >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + quot + "?",
    pWorkTens: "Tens digit of that product.",
    pWorkHuns: "Hundreds digit of that product.",
    sWorkOnes: "Subtract the ones. What is left?",
    sWorkTens: "Subtract the tens. What is left?",
    sWorkHuns: "Subtract the hundreds. What is left?",
    sideRem: "What is the remainder?",
    sideRemOnes: "Remainder. Ones digit.",
    sideRemTens: "Remainder. Tens digit.",
    sideRemHuns: "Remainder. Hundreds digit.",
  };
  places.push("pWorkOnes");
  answers.pWorkOnes = prod % 10;
  if (prod >= 10) {
    places.push("pWorkTens");
    answers.pWorkTens = Math.floor(prod / 10) % 10;
  }
  if (prod >= 100) {
    places.push("pWorkHuns");
    answers.pWorkHuns = Math.floor(prod / 100);
  }
  places.push("sWorkOnes");
  answers.sWorkOnes = rem % 10;
  if (dividend >= 10) {
    places.push("sWorkTens");
    answers.sWorkTens = Math.floor(rem / 10) % 10;
  }
  if (dividend >= 100) {
    places.push("sWorkHuns");
    answers.sWorkHuns = Math.floor(rem / 100);
  }
  if (rem > 0 && rem < 10) {
    places.push("sideRem");
    answers.sideRem = rem;
  } else if (rem >= 10 && rem < 100) {
    places.push("sideRemOnes", "sideRemTens");
    answers.sideRemOnes = rem % 10;
    answers.sideRemTens = Math.floor(rem / 10);
  } else if (rem >= 100) {
    places.push("sideRemOnes", "sideRemTens", "sideRemHuns");
    answers.sideRemOnes = rem % 10;
    answers.sideRemTens = Math.floor(rem / 10) % 10;
    answers.sideRemHuns = Math.floor(rem / 100);
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  return {
    levelId,
    layout: "division",
    divDigits: 3,
    shortThree: true,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: rem,
    dividend,
    divisor,
    dH,
    dT,
    dO,
    places,
    answers,
    choices,
    prompts,
  };
}

function pushDivDigit(places, answers, prompts, key, val, prompt) {
  places.push(key);
  answers[key] = val;
  prompts[key] = prompt;
}

function buildDiv43(dividend, divisor, levelId) {
  const dTh = Math.floor(dividend / 1000);
  const dH = Math.floor(dividend / 100) % 10;
  const dT = Math.floor(dividend / 10) % 10;
  const dO = dividend % 10;
  const firstThree = Math.floor(dividend / 10);
  const qT = Math.floor(firstThree / divisor);
  const p1 = qT * divisor;
  const s1 = firstThree - p1;
  const work2 = s1 * 10 + dO;
  const qO = Math.floor(work2 / divisor);
  const p2 = qO * divisor;
  const s2 = work2 - p2;
  const places = ["qT"];
  const answers = { qT, bringO: dO, qO };
  const prompts = {
    qT: "How many times does " + divisor + " go into " + firstThree + "?",
    bringO: "Bring down the ones.",
    qO: "How many times does " + divisor + " go into " + work2 + "?",
  };
  function addProd(prefix, prod, q) {
    pushDivDigit(places, answers, prompts, prefix + "Ones", prod % 10, prod >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + q + "?");
    if (prod >= 10) pushDivDigit(places, answers, prompts, prefix + "Tens", Math.floor(prod / 10) % 10, "Tens digit of that product.");
    if (prod >= 100) pushDivDigit(places, answers, prompts, prefix + "Huns", Math.floor(prod / 100) % 10, "Hundreds digit of that product.");
    if (prod >= 1000) pushDivDigit(places, answers, prompts, prefix + "Th", Math.floor(prod / 1000) % 10, "Thousands digit of that product.");
  }
  function addSub(prefix, rem, work) {
    pushDivDigit(places, answers, prompts, prefix + "Ones", rem % 10, "Subtract the ones. What is left?");
    if (work >= 10) pushDivDigit(places, answers, prompts, prefix + "Tens", Math.floor(rem / 10) % 10, "Subtract the tens. What is left?");
    if (work >= 100) pushDivDigit(places, answers, prompts, prefix + "Huns", Math.floor(rem / 100) % 10, "Subtract the hundreds. What is left?");
    if (work >= 1000) pushDivDigit(places, answers, prompts, prefix + "Th", Math.floor(rem / 1000) % 10, "Subtract the thousands. What is left?");
  }
  addProd("p1", p1, qT);
  addSub("s1", s1, firstThree);
  places.push("bringO", "qO");
  addProd("p2", p2, qO);
  addSub("s2", s2, work2);
  if (s2 > 0 && s2 < 10) {
    places.push("sideRem");
    answers.sideRem = s2;
    prompts.sideRem = "What is the remainder?";
  } else if (s2 >= 10 && s2 < 100) {
    places.push("sideRemOnes", "sideRemTens");
    answers.sideRemOnes = s2 % 10;
    answers.sideRemTens = Math.floor(s2 / 10);
    prompts.sideRemOnes = "Remainder. Ones digit.";
    prompts.sideRemTens = "Remainder. Tens digit.";
  } else if (s2 >= 100) {
    places.push("sideRemOnes", "sideRemTens", "sideRemHuns");
    answers.sideRemOnes = s2 % 10;
    answers.sideRemTens = Math.floor(s2 / 10) % 10;
    answers.sideRemHuns = Math.floor(s2 / 100);
    prompts.sideRemOnes = "Remainder. Ones digit.";
    prompts.sideRemTens = "Remainder. Tens digit.";
    prompts.sideRemHuns = "Remainder. Hundreds digit.";
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  const quot = qT * 10 + qO;
  return {
    levelId,
    layout: "division",
    divDigits: 4,
    mode43: true,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: s2,
    dividend,
    divisor,
    dTh,
    dH,
    dT,
    dO,
    firstThree,
    work2,
    places,
    answers,
    choices,
    prompts,
  };
}

function generateDiv3b() {
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(100, 240);
    const qT = randInt(1, Math.floor(999 / divisor));
    const first = divisor * qT;
    if (first < 100 || first > 999) continue;
    const ones = randInt(0, 9);
    return buildDiv43(first * 10 + ones, divisor, "div-3b");
  }
  return buildDiv43(2504, 125, "div-3b");
}

function generateDiv3c() {
  for (let i = 0; i < 120; i++) {
    const divisor = randInt(100, 240);
    const n = randInt(1000, 9999);
    const first = Math.floor(n / 10);
    if (first < divisor || first % divisor === 0) continue;
    return buildDiv43(n, divisor, "div-3c");
  }
  return buildDiv43(2625, 125, "div-3c");
}

function buildDiv53(dividend, divisor, levelId) {
  const dTt = Math.floor(dividend / 10000);
  const dTh = Math.floor(dividend / 1000) % 10;
  const dH = Math.floor(dividend / 100) % 10;
  const dT = Math.floor(dividend / 10) % 10;
  const dO = dividend % 10;
  const firstThree = Math.floor(dividend / 100);
  const qH = Math.floor(firstThree / divisor);
  const p1 = qH * divisor;
  const s1 = firstThree - p1;
  const work2 = s1 * 10 + dT;
  const qT = Math.floor(work2 / divisor);
  const p2 = qT * divisor;
  const s2 = work2 - p2;
  const work3 = s2 * 10 + dO;
  const qO = Math.floor(work3 / divisor);
  const p3 = qO * divisor;
  const s3 = work3 - p3;
  const places = ["qH"];
  const answers = { qH, bringT: dT, qT, bringO: dO, qO };
  const prompts = {
    qH: "How many times does " + divisor + " go into " + firstThree + "?",
    bringT: "Bring down the tens.",
    qT: "How many times does " + divisor + " go into " + work2 + "?",
    bringO: "Bring down the ones.",
    qO: "How many times does " + divisor + " go into " + work3 + "?",
  };
  function addProd(prefix, prod, q) {
    pushDivDigit(places, answers, prompts, prefix + "Ones", prod % 10, prod >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + q + "?");
    if (prod >= 10) pushDivDigit(places, answers, prompts, prefix + "Tens", Math.floor(prod / 10) % 10, "Tens digit of that product.");
    if (prod >= 100) pushDivDigit(places, answers, prompts, prefix + "Huns", Math.floor(prod / 100) % 10, "Hundreds digit of that product.");
    if (prod >= 1000) pushDivDigit(places, answers, prompts, prefix + "Th", Math.floor(prod / 1000) % 10, "Thousands digit of that product.");
  }
  function addSub(prefix, rem, work) {
    pushDivDigit(places, answers, prompts, prefix + "Ones", rem % 10, "Subtract the ones. What is left?");
    if (work >= 10) pushDivDigit(places, answers, prompts, prefix + "Tens", Math.floor(rem / 10) % 10, "Subtract the tens. What is left?");
    if (work >= 100) pushDivDigit(places, answers, prompts, prefix + "Huns", Math.floor(rem / 100) % 10, "Subtract the hundreds. What is left?");
    if (work >= 1000) pushDivDigit(places, answers, prompts, prefix + "Th", Math.floor(rem / 1000) % 10, "Subtract the thousands. What is left?");
  }
  addProd("p1", p1, qH);
  addSub("s1", s1, firstThree);
  places.push("bringT", "qT");
  addProd("p2", p2, qT);
  addSub("s2", s2, work2);
  places.push("bringO", "qO");
  addProd("p3", p3, qO);
  addSub("s3", s3, work3);
  if (s3 > 0 && s3 < 10) {
    places.push("sideRem");
    answers.sideRem = s3;
    prompts.sideRem = "What is the remainder?";
  } else if (s3 >= 10 && s3 < 100) {
    places.push("sideRemOnes", "sideRemTens");
    answers.sideRemOnes = s3 % 10;
    answers.sideRemTens = Math.floor(s3 / 10);
    prompts.sideRemOnes = "Remainder. Ones digit.";
    prompts.sideRemTens = "Remainder. Tens digit.";
  } else if (s3 >= 100) {
    places.push("sideRemOnes", "sideRemTens", "sideRemHuns");
    answers.sideRemOnes = s3 % 10;
    answers.sideRemTens = Math.floor(s3 / 10) % 10;
    answers.sideRemHuns = Math.floor(s3 / 100);
    prompts.sideRemOnes = "Remainder. Ones digit.";
    prompts.sideRemTens = "Remainder. Tens digit.";
    prompts.sideRemHuns = "Remainder. Hundreds digit.";
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  const quot = qH * 100 + qT * 10 + qO;
  return {
    levelId,
    layout: "division",
    divDigits: 5,
    mode53: true,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: s3,
    dividend,
    divisor,
    dTt,
    dTh,
    dH,
    dT,
    dO,
    firstThree,
    work2,
    work3,
    places,
    answers,
    choices,
    prompts,
  };
}

function regroupCount53(n, d) {
  const first = Math.floor(n / 100);
  const s1 = first % d;
  const dT = Math.floor(n / 10) % 10;
  const s2 = (s1 * 10 + dT) % d;
  return (s1 > 0 ? 1 : 0) + (s2 > 0 ? 1 : 0);
}

function generateDiv3d() {
  for (let i = 0; i < 250; i++) {
    const divisor = randInt(100, 240);
    const n = randInt(10000, 99999);
    if (Math.floor(n / 100) < divisor) continue;
    if (regroupCount53(n, divisor) !== 1) continue;
    return buildDiv53(n, divisor, "div-3d");
  }
  return buildDiv53(25048, 125, "div-3d");
}

function generateDiv3e() {
  for (let i = 0; i < 250; i++) {
    const divisor = randInt(100, 240);
    const n = randInt(10000, 99999);
    if (Math.floor(n / 100) < divisor) continue;
    if (regroupCount53(n, divisor) < 2) continue;
    return buildDiv53(n, divisor, "div-3e");
  }
  return buildDiv53(26248, 125, "div-3e");
}

function generateDiv3f() {
  if (Math.random() < 0.5) {
    for (let i = 0; i < 80; i++) {
      const divisor = randInt(150, 400);
      const firstThree = randInt(100, divisor - 1);
      const ones = randInt(0, 9);
      const n = firstThree * 10 + ones;
      if (n < divisor) continue;
      return buildDiv43(n, divisor, "div-3f");
    }
    return buildDiv43(1848, 250, "div-3f");
  }
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(150, 400);
    const firstThree = randInt(100, Math.min(999, divisor - 1));
    const rest = randInt(0, 99);
    const n = firstThree * 100 + rest;
    if (n < divisor) continue;
    return buildDiv53(n, divisor, "div-3f");
  }
  return buildDiv53(18480, 250, "div-3f");
}

function generateDiv3g() {
  if (Math.random() < 0.45) {
    for (let i = 0; i < 120; i++) {
      const divisor = randInt(100, 240);
      const n = randInt(1000, 9999);
      const first = Math.floor(n / 10);
      if (first < divisor) continue;
      const qT = Math.floor(first / divisor);
      const qO = Math.floor((first % divisor) * 10 + (n % 10)) / divisor;
      if (qT < 1 || Math.floor(qO) !== 0) continue;
      return buildDiv43(n, divisor, "div-3g");
    }
    return buildDiv43(2504, 125, "div-3g");
  }
  const middle = Math.random() < 0.5;
  for (let i = 0; i < 180; i++) {
    const divisor = randInt(100, 240);
    const n = randInt(10000, 99999);
    const first = Math.floor(n / 100);
    if (first < divisor) continue;
    const qH = Math.floor(first / divisor);
    if (qH < 1) continue;
    const s1 = first % divisor;
    const dT = Math.floor(n / 10) % 10;
    const dO = n % 10;
    const work2 = s1 * 10 + dT;
    const qT = Math.floor(work2 / divisor);
    const qO = Math.floor((work2 % divisor) * 10 + dO) / divisor;
    if (middle) {
      if (qT !== 0 || Math.floor(qO) === 0) continue;
    } else if (Math.floor(qO) !== 0) continue;
    return buildDiv53(n, divisor, "div-3g");
  }
  return buildDiv53(middle ? 25048 : 25120, 125, "div-3g");
}

function generateDiv3a() {
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(100, 250);
    const quot = randInt(1, Math.min(8, Math.floor(999 / divisor)));
    const rem = Math.random() < 0.6 ? randInt(1, divisor - 1) : 0;
    const dividend = divisor * quot + rem;
    if (dividend < 100 || dividend > 999) continue;
    return buildDivShortThree(dividend, divisor, "div-3a");
  }
  return buildDivShortThree(486, 125, "div-3a");
}

function generateDiv2a() {
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(11, 28);
    const quot = randInt(1, 8);
    const rem = Math.random() < 0.45 ? randInt(1, Math.min(9, divisor - 1)) : 0;
    const dividend = divisor * quot + rem;
    if (dividend < 10 || dividend > 99) continue;
    return buildDivShortTwo(dividend, divisor, "div-2a");
  }
  return buildDivShortTwo(84, 12, "div-2a");
}

function buildDivShortTwo(dividend, divisor, levelId) {
  const quot = Math.floor(dividend / divisor);
  const rem = dividend % divisor;
  const prod = quot * divisor;
  const dTens = Math.floor(dividend / 10);
  const dOnes = dividend % 10;
  const places = ["qOnes"];
  const answers = { qOnes: quot, pWorkOnes: prod % 10, sWorkOnes: rem % 10 };
  const prompts = {
    qOnes: "How many times does " + divisor + " go into " + dividend + "?",
    pWorkOnes: prod >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + quot + "?",
    pWorkTens: "Tens digit of that product.",
    sWorkOnes: "Subtract the ones. What is left?",
    sWorkTens: "Subtract the tens. What is left?",
    sideRem: "What is the remainder?",
  };
  places.push("pWorkOnes");
  if (prod >= 10) {
    places.push("pWorkTens");
    answers.pWorkTens = Math.floor(prod / 10);
  }
  places.push("sWorkOnes");
  if (dividend >= 10) {
    places.push("sWorkTens");
    answers.sWorkTens = Math.floor(rem / 10);
  }
  if (rem > 0) {
    places.push("sideRem");
    answers.sideRem = rem;
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  return {
    levelId,
    layout: "division",
    divDigits: 2,
    shortTwo: true,
    workWide: true,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: rem,
    dividend,
    divisor,
    dTens,
    dOnes,
    places,
    answers,
    choices,
    prompts,
  };
}

function generateDiv1d() {
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(2, 8);
    const qTens = randInt(1, Math.floor(9 / divisor));
    const sTens = randInt(1, divisor - 1);
    const dTens = qTens * divisor + sTens;
    if (dTens > 9) continue;
    const dOnes = randInt(0, 9);
    const work = sTens * 10 + dOnes;
    const qOnes = Math.floor(work / divisor);
    if (qOnes > 9) continue;
    return buildDivTwoWork(dTens * 10 + dOnes, divisor, "div-1d");
  }
  return buildDivTwoWork(75, 3, "div-1d");
}

function generateDiv1e() {
  for (let i = 0; i < 80; i++) {
    const divisor = randInt(3, 9);
    const dTens = randInt(1, divisor - 1);
    const dOnes = randInt(0, 9);
    const dividend = dTens * 10 + dOnes;
    if (dividend < divisor) continue;
    return buildDivTwoWork(dividend, divisor, "div-1e");
  }
  return buildDivTwoWork(17, 5, "div-1e");
}

function buildDivTwoWork(dividend, divisor, levelId) {
  const dTens = Math.floor(dividend / 10);
  const dOnes = dividend % 10;
  const qTens = Math.floor(dTens / divisor);
  const pTens = qTens * divisor;
  const sTens = dTens - pTens;
  const work = sTens * 10 + dOnes;
  const qOnes = Math.floor(work / divisor);
  const pWork = qOnes * divisor;
  const pWorkTens = Math.floor(pWork / 10);
  const pWorkOnes = pWork % 10;
  const sWork = work - pWork;
  const sWorkTens = Math.floor(sWork / 10);
  const sWorkOnes = sWork % 10;
  const places = ["qTens", "pTens", "sTens", "bringDown", "qOnes"];
  const answers = { qTens, pTens, sTens, bringDown: dOnes, qOnes, pWorkTens, pWorkOnes, sWorkTens, sWorkOnes };
  places.push("pWorkOnes");
  if (pWork >= 10) places.push("pWorkTens");
  places.push("sWorkOnes");
  if (work >= 10) places.push("sWorkTens");
  if (sWork > 0) {
    places.push("sideRem");
    answers.sideRem = sWork;
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  return {
    levelId,
    layout: "division",
    divDigits: 2,
    workWide: true,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: qTens * 10 + qOnes,
    result: qTens * 10 + qOnes,
    quotient: qTens * 10 + qOnes,
    remainder: sWork,
    dividend,
    divisor,
    dTens,
    dOnes,
    work,
    places,
    answers,
    choices,
    prompts: {
      qTens: "Tens. How many times does " + divisor + " go into " + dTens + "?",
      pTens: "Multiply. " + divisor + " × " + qTens + "?",
      sTens: "Subtract. What is left?",
      bringDown: "Bring down the ones.",
      qOnes: "How many times does " + divisor + " go into " + work + "?",
      pWorkOnes: pWork >= 10 ? "Multiply. What digit stays in the ones?" : "Multiply. " + divisor + " × " + qOnes + "?",
      pWorkTens: "Tens digit of that product.",
      sWorkOnes: "Subtract the ones. What is left?",
      sWorkTens: "Subtract the tens. What is left?",
      sideRem: "What is the remainder?",
    },
  };
}

function generateDiv1c() {
  const divisor = randInt(2, 4);
  const qTens = randInt(1, Math.floor(9 / divisor));
  const dTens = qTens * divisor;
  const qOnes = randInt(0, Math.floor(9 / divisor));
  const rem = Math.random() < 0.45 ? randInt(1, divisor - 1) : 0;
  const maxOnes = qOnes * divisor + rem;
  if (maxOnes > 9) return generateDiv1c();
  const dOnes = qOnes * divisor + rem;
  const dividend = dTens * 10 + dOnes;
  return buildDivTwoNoRegroup(dividend, divisor, "div-1c");
}

function buildDivTwoNoRegroup(dividend, divisor, levelId) {
  const dTens = Math.floor(dividend / 10);
  const dOnes = dividend % 10;
  const qTens = Math.floor(dTens / divisor);
  const pTens = qTens * divisor;
  const sTens = dTens - pTens;
  const qOnes = Math.floor(dOnes / divisor);
  const pOnes = qOnes * divisor;
  const sOnes = dOnes - pOnes;
  const places = ["qTens", "pTens", "sTens", "bringDown", "qOnes", "pOnes", "sOnes"];
  const answers = { qTens, pTens, sTens, bringDown: dOnes, qOnes, pOnes, sOnes };
  if (sOnes > 0) {
    places.push("sideRem");
    answers.sideRem = sOnes;
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  return {
    levelId,
    layout: "division",
    divDigits: 2,
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: qTens * 10 + qOnes,
    result: qTens * 10 + qOnes,
    quotient: qTens * 10 + qOnes,
    remainder: sOnes,
    dividend,
    divisor,
    dTens,
    dOnes,
    places,
    answers,
    choices,
    prompts: {
      qTens: "Tens. How many times does " + divisor + " go into " + dTens + "?",
      pTens: "Multiply. " + divisor + " × " + qTens + "?",
      sTens: "Subtract. What is left?",
      bringDown: "Bring down the ones.",
      qOnes: "Ones. How many times does " + divisor + " go into " + dOnes + "?",
      pOnes: "Multiply. " + divisor + " × " + qOnes + "?",
      sOnes: "Subtract. What is left?",
      sideRem: "What is the remainder?",
    },
  };
}

function generateDiv1b() {
  for (let i = 0; i < 40; i++) {
    const divisor = randInt(2, 8);
    const quot = randInt(1, 8);
    const rem = randInt(1, divisor - 1);
    const dividend = divisor * quot + rem;
    if (dividend <= 9) return buildDivFact(dividend, divisor, "div-1b");
  }
  return buildDivFact(7, 2, "div-1b");
}

function generateDiv1a() {
  const divisor = randInt(2, 9);
  const quot = randInt(1, 9);
  const dividend = divisor * quot;
  if (dividend > 9) return generateDiv1a();
  return buildDivFact(dividend, divisor, "div-1a");
}

function buildDivFact(dividend, divisor, levelId) {
  const quot = Math.floor(dividend / divisor);
  const rem = dividend % divisor;
  const prod = divisor * quot;
  const places = ["quot", "prod", "rem"];
  const answers = { quot, prod, rem };
  if (rem > 0) {
    places.push("sideRem");
    answers.sideRem = rem;
  }
  const choices = {};
  for (const place of places) {
    choices[place] = shuffle([answers[place], ...pickDistinct(3, 0, 9, new Set([answers[place]]))]);
  }
  return {
    levelId,
    layout: "division",
    addends: [dividend, divisor],
    opSymbol: "÷",
    sum: quot,
    result: quot,
    quotient: quot,
    remainder: rem,
    dividend,
    divisor,
    places,
    answers,
    choices,
    prompts: {
      quot: "How many times does " + divisor + " go into " + dividend + "?",
      prod: "Multiply. " + divisor + " × " + quot + "?",
      rem: "Subtract. What is left?",
      sideRem: "What is the remainder?",
    },
  };
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
    "sub-2b": generateSub2b,
    "sub-2c": generateSub2c,
    "sub-3a": generateSub3a,
    "sub-3b": generateSub3b,
    "sub-3c": generateSub3c,
    "sub-3d": generateSub3d,
    "sub-3e": generateSub3e,
    "sub-3f": generateSub3f,
    "sub-3g": generateSub3g,
    "sub-4a": generateSub4a,
    "sub-4b": generateSub4b,
    "sub-4c": generateSub4c,
    "sub-4d": generateSub4d,
    "sub-4e": generateSub4e,
    "sub-4f": generateSub4f,
    "mul-1": generateMul1,
    "mul-2a": generateMul2a,
    "mul-2b": generateMul2b,
    "mul-2c": generateMul2c,
    "mul-2d": generateMul2d,
    "mul-3a": generateMul3a,
    "mul-3b": generateMul3b,
    "mul-3c": generateMul3c,
    "mul-3d": generateMul3d,
    "mul-3e": generateMul3e,
    "mul-4a": generateMul4a,
    "mul-4b": generateMul4b,
    "mul-4c": generateMul4c,
    "mul-4d": generateMul4d,
    "mul-4e": generateMul4e,
    "mul-4f": generateMul4f,
    "mul-5a": generateMul5a,
    "mul-5b": generateMul5b,
    "mul-5c": generateMul5c,
    "mul-5d": generateMul5d,
    "mul-5e": generateMul5e,
    "mul-5f": generateMul5f,
    "mul-6a": generateMul6a,
    "mul-6b": generateMul6b,
    "mul-6c": generateMul6c,
    "mul-6d": generateMul6d,
    "mul-6e": generateMul6e,
    "mul-6f": generateMul6f,
    "div-1a": generateDiv1a,
    "div-1b": generateDiv1b,
    "div-1c": generateDiv1c,
    "div-1d": generateDiv1d,
    "div-1e": generateDiv1e,
    "div-1f": generateDiv1f,
    "div-1g": generateDiv1g,
    "div-1h": generateDiv1h,
    "div-1i": generateDiv1i,
    "div-2a": generateDiv2a,
    "div-2b": generateDiv2b,
    "div-2c": generateDiv2c,
    "div-2d": generateDiv2d,
    "div-2e": generateDiv2e,
    "div-2f": generateDiv2f,
    "div-2g": generateDiv2g,
    "div-3a": generateDiv3a,
    "div-3b": generateDiv3b,
    "div-3c": generateDiv3c,
    "div-3d": generateDiv3d,
    "div-3e": generateDiv3e,
    "div-3f": generateDiv3f,
    "div-3g": generateDiv3g,
  }[levelId];
  if (!fn) throw new Error("Level not implemented: " + levelId);
  return fn();
}
