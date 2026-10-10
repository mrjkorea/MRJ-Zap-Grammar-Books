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
    s = String(s || "")
      .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
      .replace(/[\u201C\u201D\u201E\u2033]/g, '"');
    s = collapseSpaces(stripEndPunct(s.toLowerCase()));
    if (CONTRACTIONS[s]) return CONTRACTIONS[s];
    return s;
  }

  function hasHangul(s) {
    return /[\uAC00-\uD7A3]/.test(String(s || ""));
  }

  function normalizeKoreanPhrase(s) {
    s = String(s || "")
      .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
      .trim();
    s = collapseSpaces(stripEndPunct(s));
    return s;
  }

  function koreanEquivalent(user, expected) {
    var u = normalizeKoreanPhrase(user);
    var e = normalizeKoreanPhrase(expected);
    if (u === e) return true;
    var uBare = u.replace(/^~/, "").trim();
    var eBare = e.replace(/^~/, "").trim();
    return uBare === eBare;
  }

  function normalizePhrase(s) {
    if (hasHangul(s)) return normalizeKoreanPhrase(s);
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
    if (hasHangul(user) || hasHangul(expected)) {
      return koreanEquivalent(user, expected);
    }
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
  function permuteOk(users, exp) {
    if (users.length !== exp.length) return false;
    var used = {};
    function tryMatch(ui) {
      if (ui >= users.length) return true;
      for (var j = 0; j < exp.length; j++) {
        if (used[j]) continue;
        if (!matchOne(users[ui], exp[j])) continue;
        used[j] = true;
        if (tryMatch(ui + 1)) return true;
        used[j] = false;
      }
      return false;
    }
    return tryMatch(0);
  }

  function matchBlanks(users, acceptList, unordered) {
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
          if (unordered && permuteOk(users, exp)) return true;
        }
      }
      if (users.length === 1 && matchAccept(users[0], acceptList[i])) return true;
      if (users.length > 1 && matchAccept(users.join(" "), acceptList[i])) return true;
    }
    return false;
  }

  function matchMc(choiceValue, accept) {
    var list = Array.isArray(accept) ? accept : [accept];
    for (var i = 0; i < list.length; i++) {
      var raw = String(list[i]);
      if (hasHangul(raw) || hasHangul(choiceValue)) {
        if (koreanEquivalent(choiceValue, raw)) return true;
        continue;
      }
      var u = normalizePhrase(choiceValue);
      var a = normalizePhrase(raw);
      if (u === a) return true;
      if (/^[①②③④⑤]$/.test(raw)) {
        var n = "①②③④⑤".indexOf(raw) + 1;
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
