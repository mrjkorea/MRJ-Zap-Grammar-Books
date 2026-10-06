/* Answer normalization — contractions, spacing, case (GreenZap 1) */
(function (root) {
  "use strict";

  var CONTRACTIONS = {
    "i am": "i'm",
    "i'm": "i'm",
    "you are": "you're",
    "you're": "you're",
    "we are": "we're",
    "we're": "we're",
    "they are": "they're",
    "they're": "they're",
    "he is": "he's",
    "he's": "he's",
    "she is": "she's",
    "she's": "she's",
    "it is": "it's",
    "it's": "it's",
    "is not": "isn't",
    "isn't": "isn't",
    "are not": "aren't",
    "aren't": "aren't",
    "am not": "am not",
    "do not": "don't",
    "don't": "don't",
    "does not": "doesn't",
    "doesn't": "doesn't",
    "can not": "can't",
    "cannot": "can't",
    "will not": "won't",
    "i have": "i've",
    "i've": "i've",
    "we have": "we've",
    "we've": "we've",
  };

  function stripEndPunct(s) {
    return s.replace(/[.!?]+$/g, "").trim();
  }

  function collapseSpaces(s) {
    return s.replace(/\s+/g, " ").trim();
  }

  function normalizeToken(s) {
    s = collapseSpaces(stripEndPunct(String(s || "").toLowerCase()));
    if (CONTRACTIONS[s]) return CONTRACTIONS[s];
    return s;
  }

  function normalizePhrase(s) {
    return normalizeToken(s);
  }

  function variants(phrase) {
    var out = {};
    var base = normalizePhrase(phrase);
    out[base] = true;
    Object.keys(CONTRACTIONS).forEach(function (key) {
      if (CONTRACTIONS[key] === base) out[normalizePhrase(key)] = true;
      if (key === base) out[normalizePhrase(CONTRACTIONS[key])] = true;
    });
    if (base.indexOf(" ") > -1) {
      var parts = base.split(" ");
      if (parts.length === 2 && CONTRACTIONS[parts.join(" ")]) {
        out[CONTRACTIONS[parts.join(" ")]] = true;
      }
    }
    return Object.keys(out);
  }

  function matchOne(user, expected) {
    var u = normalizePhrase(user);
    if (!u && !expected) return true;
    var ok = variants(expected);
    for (var i = 0; i < ok.length; i++) {
      if (u === ok[i]) return true;
    }
    return u === normalizePhrase(expected);
  }

  /** accept: string or string[]; pipe in string = alternate full answers */
  function matchAccept(user, accept) {
    if (accept == null) return false;
    var list = Array.isArray(accept) ? accept : [accept];
    var u = normalizePhrase(user);
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (String(a).indexOf("|") >= 0) {
        var parts = String(a).split("|").map(normalizePhrase);
        var userParts = collapseSpaces(u).split(" ");
        if (parts.length === 1) {
          if (matchOne(u, parts[0])) return true;
        } else if (userParts.length >= parts.length) {
          var all = true;
          for (var p = 0; p < parts.length; p++) {
            if (!matchOne(userParts[p], parts[p])) all = false;
          }
          if (all) return true;
        }
        if (matchOne(u, parts.join(" "))) return true;
      } else if (matchOne(u, a)) return true;
    }
    return false;
  }

  /** Multi-blank: users[] and accept entry like "are|no" or full phrase */
  function matchBlanks(users, acceptList) {
    users = users || [];
    if (!acceptList || !acceptList.length) return false;
    for (var i = 0; i < acceptList.length; i++) {
      var pattern = String(acceptList[i]);
      if (pattern.indexOf("|") >= 0 && users.length > 1) {
        var exp = pattern.split("|");
        if (exp.length === users.length) {
          var ok = true;
          for (var b = 0; b < exp.length; b++) {
            if (!matchOne(users[b], exp[b])) ok = false;
          }
          if (ok) return true;
        }
      }
      if (users.length === 1 && matchAccept(users[0], acceptList[i])) return true;
      if (users.length > 1 && matchAccept(users.join(" "), acceptList[i])) return true;
    }
    return false;
  }

  function matchMc(choiceValue, accept) {
    var u = normalizePhrase(choiceValue);
    var list = Array.isArray(accept) ? accept : [accept];
    for (var i = 0; i < list.length; i++) {
      var a = normalizePhrase(String(list[i]));
      if (u === a) return true;
      if (/^[①②③④⑤]$/.test(list[i])) {
        var n = "①②③④⑤".indexOf(list[i]) + 1;
        if (u === String(n)) return true;
      }
    }
    return false;
  }

  root.MRJ_NORMALIZE = {
    normalizePhrase: normalizePhrase,
    matchAccept: matchAccept,
    matchBlanks: matchBlanks,
    matchMc: matchMc,
  };
})(window);
