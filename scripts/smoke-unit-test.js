/* Smoke-grade Unit Test 01 answers (no browser). */
const fs = require("fs");
const path = require("path");

// Minimal normalize (mirror browser logic)
function normalizePhrase(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchOne(user, expected) {
  return normalizePhrase(user) === normalizePhrase(expected);
}

function matchAccept(user, accept) {
  const list = Array.isArray(accept) ? accept : [accept];
  const u = normalizePhrase(user);
  for (const a of list) {
    if (String(a).includes("|")) {
      const parts = String(a).split("|");
      const userParts = u.split(" ");
      if (parts.length === userParts.length && parts.every((p, i) => matchOne(userParts[i], p))) return true;
      if (matchOne(u, parts.join(" "))) return true;
    } else if (matchOne(u, a)) return true;
  }
  return false;
}

function matchBlanks(users, acceptList) {
  for (const pattern of acceptList) {
    if (String(pattern).includes("|") && users.length > 1) {
      const exp = String(pattern).split("|");
      if (exp.length === users.length && exp.every((p, i) => matchOne(users[i], p))) return true;
    }
    if (users.length === 1 && matchAccept(users[0], pattern)) return true;
  }
  return false;
}

function gradeItem(item, response) {
  if (item.type === "mc") {
    const idx = item.choices.indexOf(response.value);
    if (idx >= 0) {
      const num = String(idx + 1);
      if (matchAccept(num, item.accept)) return true;
    }
    return matchAccept(response.value, item.accept);
  }
  if (item.blanks > 1 && response.parts) {
    if (matchBlanks(response.parts, item.accept)) return true;
    if (matchAccept(response.parts.join(" "), item.accept)) return true;
    return false;
  }
  return matchAccept(response.value, item.accept);
}

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/green1/unit01/unit-test-01.json"), "utf8")
);

const answers = {
  q01: { value: data.items[0].choices[2] },
  q02: { value: data.items[1].choices[0] },
  q03: { value: data.items[2].choices[2] },
  q04: { value: data.items[3].choices[0] },
  q05: { value: data.items[4].choices[2] },
  q06: { value: data.items[5].choices[1] },
  q07: { value: data.items[6].choices[3] },
  q08: { value: data.items[7].choices[3] },
  q09: { value: data.items[8].choices[2] },
  q10: { value: data.items[9].choices[3] },
  q11: { value: data.items[10].choices[2] },
  q12: { value: data.items[11].choices[3] },
  q13: { value: data.items[12].choices[4] },
  q14: { value: data.items[13].choices[1] },
  q15: { value: data.items[14].choices[3] },
  q16: { value: data.items[15].choices[4] },
  q17: { value: data.items[16].choices[1] },
  q18: { parts: ["I", "don't"], value: "I don't" },
  q19: { parts: ["she", "does"], value: "she does" },
  q20: { parts: ["Are", "No"], value: "Are No" },
  q21: { value: "brushes" },
  q22: { value: "don't exercise" },
  q23: { value: "isn't from" },
  q24: { parts: ["Is", "delicious"], value: "Is delicious" },
  q25: { value: "Do you want" },
};

let ok = 0;
data.items.forEach((item) => {
  const resp = answers[item.id];
  const good = gradeItem(item, resp);
  if (!good) console.error("FAIL", item.id);
  else ok++;
});
console.log("Unit Test smoke:", ok, "/", data.items.length);
if (ok !== data.items.length) process.exit(1);
