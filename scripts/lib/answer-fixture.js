/* Build gradeItem fixtures for smoke tests, including O/X, multi-select, and parts. */
function createFixtures(E) {
  const CIRC = "①②③④⑤⑥⑦⑧⑨⑩";

  function choiceFromToken(it, token) {
    const raw = String(token || "").trim();
    const choices = it.choices || [];
    let i = CIRC.indexOf(raw);
    if (i < 0 && /^\d+$/.test(raw)) i = Number(raw) - 1;
    if (i < 0) i = choices.indexOf(raw);
    if (i < 0 || i >= choices.length) return null;
    return choices[i];
  }

  function respFor(it, acc) {
    if (it.type === "ox") {
      const key = String(acc || (it.accept || [])[0] || "").trim().toUpperCase();
      const picked = key === "O" || key === "○" ? "O" : "X";
      const rw = picked === "X" && it.rewriteAccept && it.rewriteAccept.length ? it.rewriteAccept[0] : "";
      return { value: picked, rewrite: rw };
    }
    if (it.type === "parts") {
      const p = String(acc).split("|");
      return { parts: p, value: p.join(" ") };
    }
    if (it.type === "match") {
      const links = {};
      for (const line of (it.accept || []).length ? it.accept : [acc]) {
        const [left, right] = String(line).split("|");
        if (left != null && right != null && right !== "") links[left.trim()] = right.trim();
      }
      if (!Object.keys(links).length && (it.pairs || []).length) {
        for (const p of it.pairs) links[p.left] = p.right;
      }
      return { links };
    }
    if (it.type === "mc" && it.select === "multi") {
      const values = String(acc)
        .split("|")
        .map((tok) => choiceFromToken(it, tok))
        .filter(Boolean);
      if (!values.length) return null;
      return { values, value: values.join("|") };
    }
    if (it.type === "mc") {
      const value = choiceFromToken(it, acc);
      return value == null ? null : { value };
    }
    if ((it.blanks || 1) > 1 || String(acc).includes("|")) {
      const p = String(acc).split("|");
      return { parts: p, value: p.join(" ") };
    }
    return { value: acc };
  }

  function wrongFor(it) {
    if (it.type === "ox") {
      const key = String((it.accept || [])[0] || "").trim().toUpperCase();
      if (key === "O" || key === "○") return { value: "X", rewrite: "" };
      return { value: "X", rewrite: "__WRONG_REWRITE__" };
    }
    if (it.type === "parts") {
      const p = String((it.accept || ["x|y"])[0]).split("|");
      p[p.length - 1] = "__WRONG_PART__";
      return { parts: p, value: p.join(" ") };
    }
    if (it.type === "match") {
      const links = {};
      for (const p of it.pairs || []) {
        links[p.left] = p.right === "2형식" ? "5형식" : "2형식";
      }
      return { links };
    }
    if (it.type === "mc" && it.select === "multi") {
      return { values: ["__WRONG_MC__"], value: "__WRONG_MC__" };
    }
    if (it.type === "mc") {
      for (const ch of it.choices || []) {
        if (E && !E.gradeItem(it, { value: ch })) return { value: ch };
      }
      return { value: "__WRONG_MC__" };
    }
    if ((it.blanks || 1) > 1 || String((it.accept || [""])[0]).includes("|")) {
      const p = String(it.accept[0]).split("|");
      p[p.length - 1] = "__WRONG_PART__";
      return { parts: p, value: p.join(" ") };
    }
    return { value: "__WRONG_ANSWER__" };
  }

  return { respFor, wrongFor };
}

module.exports = { createFixtures };
