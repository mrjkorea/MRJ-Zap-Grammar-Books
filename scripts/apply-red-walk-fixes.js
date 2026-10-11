#!/usr/bin/env node
/** Apply global Red Walk match fixes (Korean<->English, strip right numbers, unique rights). */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const HANGUL = /[\uAC00-\uD7A3]/;

function syncAccept(pairs) {
  return pairs.map((p) => `${p.left}|${p.right}`);
}

function stripRightNum(s) {
  return s.replace(/^\d+\.\s*/, "");
}

function stripWalkFile(filePath, skipEnEnFix) {
  const d = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;
  for (const it of d.items || []) {
    if (it.type !== "match" || it.displayOnly) continue;
    const pairs = it.pairs || [];
    const newPairs = pairs.map((p) => {
      const r = stripRightNum(p.right);
      if (r !== p.right) changed = true;
      return { left: p.left, right: r };
    });
    it.pairs = newPairs;
    it.accept = syncAccept(newPairs);
  }
  if (changed) fs.writeFileSync(filePath, JSON.stringify(d, null, 2) + "\n");
}

function setItem(filePath, itemId, pairs) {
  const d = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const it = d.items.find((x) => x.id === itemId);
  if (!it) throw new Error("missing " + itemId + " in " + filePath);
  it.pairs = pairs;
  it.accept = syncAccept(pairs);
  fs.writeFileSync(filePath, JSON.stringify(d, null, 2) + "\n");
}

function dial(ko, q, a) {
  return { left: ko, right: `A: ${q} B: ${a}` };
}

// --- red1 unit04 walk A: Korean nouns <-> a/an phrases ---
setItem(path.join(REPO, "data/red1/unit04/walk.json"), "a01", [
  { left: "책", right: "a book" },
  { left: "연필", right: "a pencil" },
  { left: "컵", right: "a cup" },
  { left: "토끼", right: "a rabbit" },
  { left: "개", right: "a dog" },
]);
setItem(path.join(REPO, "data/red1/unit04/walk.json"), "a02", [
  { left: "사과", right: "an apple" },
  { left: "달걀", right: "an egg" },
  { left: "이구아나", right: "an iguana" },
  { left: "오렌지", right: "an orange" },
  { left: "우산", right: "an umbrella" },
]);

// red1 unit05: unique you / you (plural)
setItem(path.join(REPO, "data/red1/unit05/walk.json"), "a01", [
  { left: "나", right: "I" },
  { left: "너", right: "you" },
  { left: "그", right: "he" },
  { left: "그녀", right: "she" },
  { left: "그것", right: "it" },
  { left: "우리", right: "we" },
  { left: "너희", right: "you (plural)" },
]);

// red1 unit07 section A: full English sentences
const u07a = [
  ["내 다리는 길다.", "My legs are long."],
  ["네 다리는 길다.", "Your legs are long."],
  ["그것의 다리는 짧다.", "Its legs are short."],
  ["그들의 다리는 짧다.", "Their legs are short."],
  ["그의 고양이는 귀엽다.", "His cat is cute."],
  ["그녀의 고양이는 귀엽다.", "Her cat is cute."],
  ["그는 우리의 오빠이다.", "He is our brother."],
  ["그녀는 그들의 언니이다.", "She is their sister."],
  ["그들은 네 형제이다.", "They are your brothers."],
  ["그들은 그녀의 자매이다.", "They are her sisters."],
];
setItem(
  path.join(REPO, "data/red1/unit07/walk.json"),
  "a01",
  u07a.slice(0, 7).map(([l, r]) => ({ left: l.replace(/^\d+\.\s*/, ""), right: r }))
);
setItem(
  path.join(REPO, "data/red1/unit07/walk.json"),
  "a02",
  u07a.slice(7).map(([l, r]) => ({ left: l.replace(/^\d+\.\s*/, ""), right: r }))
);
setItem(path.join(REPO, "data/red1/unit07/walk.json"), "b01", [
  { left: "이것은 네 것이다.", right: "This is yours." },
  { left: "저것은 내 것이다.", right: "That is mine." },
  { left: "그 연은 그녀의 것이다.", right: "That kite is hers." },
  { left: "그 연은 그의 것이다.", right: "That kite is his." },
  { left: "이 공은 우리의 것이다.", right: "This ball is ours." },
  { left: "저 공은 그들의 것이다.", right: "That ball is theirs." },
  { left: "이 북들은 우리의 것이다.", right: "These drums are ours." },
]);
setItem(path.join(REPO, "data/red1/unit07/walk.json"), "b02", [
  { left: "저 북들은 너희의 것이다.", right: "Those drums are yours." },
  { left: "이 로봇들은 내 것이다.", right: "These robots are mine." },
  { left: "저 로봇들은 그녀의 것이다.", right: "Those robots are hers." },
]);

// red1 unit08 B: full contractions as sentences
setItem(path.join(REPO, "data/red1/unit08/walk.json"), "b01", [
  { left: "나는 학생이야.", right: "I'm a student." },
  { left: "너는 농부야.", right: "You're a farmer." },
  { left: "그는 우리 삼촌이야.", right: "He's our uncle." },
  { left: "그녀는 우리 고모야.", right: "She's our aunt." },
  { left: "우리는 친구야.", right: "We're friends." },
  { left: "너희는 선생님이야.", right: "You're teachers." },
  { left: "그들은 의사야.", right: "They're doctors." },
]);

// red1 unit09/10 dialogue sections
const u09b1 = [
  dial("당신은 조종사입니까?", "Are you a pilot?", "No, I am not."),
  dial("그는 배고프니?", "Is he hungry?", "Yes, he is."),
  dial("그녀는 목마르니?", "Is she thirsty?", "No, she isn't."),
  dial("당신들은 학생입니까?", "Are you students?", "No, we aren't."),
  dial("그들은 의사입니까?", "Are they doctors?", "Yes, they are."),
  dial("그것은 오래되었니?", "Is it old?", "Yes, it is."),
  dial("그것들은 새것이니?", "Are they new?", "No, they aren't."),
];
setItem(path.join(REPO, "data/red1/unit09/walk.json"), "b01", u09b1);
setItem(path.join(REPO, "data/red1/unit09/walk.json"), "b02", [
  dial("당신은 Jane입니까?", "Are you Jane?", "Yes, I am."),
  dial("당신들은 간호사입니까?", "Are you nurses?", "Yes, we are."),
  dial("그는 잘생겼니?", "Is he handsome?", "No, he isn't."),
]);

const u10b1 = [
  dial("이것은 오렌지입니까?", "Is this an orange?", "Yes, it is."),
  dial("저것은 이구아나입니까?", "Is that an iguana?", "No, it isn't."),
  dial("이것들은 캥거루입니까?", "Are these kangaroos?", "Yes, they are."),
  dial("저것들은 크레용입니까?", "Are those crayons?", "No, they aren't."),
  dial("이것은 네 잉크입니까?", "Is this your ink?", "No, it isn't."),
  dial("저것은 네 스카프입니까?", "Is that your scarf?", "Yes, it is."),
  dial("이것들은 네 신발입니까?", "Are these your shoes?", "No, they aren't."),
];
setItem(path.join(REPO, "data/red1/unit10/walk.json"), "b01", u10b1);
setItem(path.join(REPO, "data/red1/unit10/walk.json"), "b02", [
  dial("저것들은 네 양말입니까?", "Are those your socks?", "Yes, they are."),
  dial("저것은 네 치마입니까?", "Is that your skirt?", "No, it isn't."),
  dial("저것들은 네 바지입니까?", "Are those your pants?", "No, they aren't."),
]);

// red2 unit01: Korean <-> full English sentence
function koEnWalk(file, specs) {
  for (const [id, pairs] of Object.entries(specs)) {
    setItem(file, id, pairs);
  }
}
const r2u01 = path.join(REPO, "data/red2/unit01/walk.json");
koEnWalk(r2u01, {
  a01: [
    { left: "나는 잘 노래한다.", right: "I sing well." },
    { left: "새들은 잘 노래한다.", right: "The birds sing well." },
    { left: "너는 잘 춤춘다.", right: "You dance well." },
    { left: "원숭이들은 잘 춤춘다.", right: "The monkeys dance well." },
    { left: "우리는 잘 수영한다.", right: "We swim well." },
  ],
  a02: [
    { left: "늑대들은 잘 수영한다.", right: "The wolves swim well." },
    { left: "나는 수학을 좋아한다.", right: "I like math." },
    { left: "그들은 수학을 좋아한다.", right: "They like math." },
    { left: "소년들은 토마토를 가지고 있다.", right: "The boys have tomatoes." },
    { left: "소년들은 토마토 열 개를 가지고 있다.", right: "The boys have ten tomatoes." },
  ],
  b01: [
    { left: "그는 잘 춤춘다.", right: "He dances well." },
    { left: "그녀는 빠르게 수영한다.", right: "She swims fast." },
    { left: "오스카는 학교에 간다.", right: "Oscar goes to school." },
    { left: "그의 아버지는 수학을 가르친다.", right: "His dad teaches math." },
    { left: "그의 어머니는 자동차를 고친다.", right: "His mom fixes cars." },
  ],
  b02: [
    { left: "이 새는 빠르게 난다.", right: "This bird flies fast." },
    { left: "저 새는 잘 노래한다.", right: "That bird sings well." },
    { left: "한 소녀가 고양이를 가지고 있다.", right: "A girl has a cat." },
    { left: "고양이가 얼굴을 씻는다.", right: "The cat washes its face." },
    { left: "그것은 생선을 좋아한다.", right: "It likes fish." },
  ],
});

// red2 unit04
setItem(path.join(REPO, "data/red2/unit04/walk.json"), "a01", [
  { left: "나는 잘 춤춘다.", right: "I dance well." },
  { left: "너는 아주 잘 노래한다.", right: "You sing very well." },
  { left: "그는 아주 부지런하다.", right: "He is so diligent." },
  { left: "그녀는 행복하게 산다.", right: "She lives happily." },
  { left: "우리는 신중하게 생각한다.", right: "We think carefully." },
  { left: "수지는 천천히 말한다.", right: "Susie speaks slowly." },
  { left: "수지는 일찍 일어난다.", right: "Susie gets up early." },
]);
setItem(path.join(REPO, "data/red2/unit04/walk.json"), "a02", [
  { left: "하하는 빠르게 달린다.", right: "Haha runs fast." },
  { left: "간호사들은 열심히 공부한다.", right: "The nurses study hard." },
  { left: "간호사들은 친절하게 그를 돕는다.", right: "The nurses help him kindly." },
]);
setItem(path.join(REPO, "data/red2/unit04/walk.json"), "b01", [
  { left: "6시에", right: "at six o'clock" },
  { left: "일요일에", right: "on Sunday" },
  { left: "크리스마스에", right: "on Christmas Day" },
  { left: "10월에", right: "in October" },
  { left: "2013년에", right: "in 2013" },
  { left: "자동차 안에", right: "in the car" },
  { left: "피아노 위에", right: "on the piano" },
]);
setItem(path.join(REPO, "data/red2/unit04/walk.json"), "b02", [
  { left: "다리 아래에", right: "under the bridge" },
  { left: "병원 뒤에", right: "behind the hospital" },
  { left: "공원 옆에", right: "next to the park" },
]);

// red2 unit07 section B: Korean verb meaning <-> -ing form
setItem(path.join(REPO, "data/red2/unit07/walk.json"), "b01", [
  { left: "자다", right: "sleeping" },
  { left: "먹다", right: "eating" },
  { left: "만들다", right: "making" },
  { left: "타다", right: "riding" },
  { left: "수영하다", right: "swimming" },
  { left: "자르다", right: "cutting" },
  { left: "듣다", right: "listening" },
]);
setItem(path.join(REPO, "data/red2/unit07/walk.json"), "b02", [
  { left: "열다", right: "opening" },
  { left: "묶다", right: "tying" },
  { left: "죽다", right: "dying" },
]);

// red2 unit09 dialogue
setItem(path.join(REPO, "data/red2/unit09/walk.json"), "b01", [
  dial("골프를 칠 수 있니?", "Can you play golf?", "Yes, I can."),
  dial("그녀는 운전할 수 있니?", "Can she drive a car?", "No, she can't."),
  dial("그는 공을 찰 수 있니?", "Can he kick the ball?", "Yes, he can."),
  dial("그들은 뛸 수 있니?", "Can they jump?", "No, they can't."),
  dial("그것은 나무를 올라갈 수 있니?", "Can it climb the tree?", "Yes, it can."),
  dial("그는 셀 수 있니?", "Can he count?", "No, he can't."),
  dial("그들은 쓸 수 있니?", "Can they write?", "Yes, they can."),
]);
setItem(path.join(REPO, "data/red2/unit09/walk.json"), "b02", [
  dial("톰은 김밥을 만들 수 있니?", "Can Tom make gimbap?", "Yes, he can."),
  dial("네 여동생은 다이빙할 수 있니?", "Can your sister dive?", "No, she can't."),
  dial("아이들은 체스를 할 수 있니?", "Can the kids play chess?", "No, they can't."),
]);

// red2 unit10 section C
setItem(path.join(REPO, "data/red2/unit10/walk.json"), "c01", [
  dial("수영하러 가자.", "Let's go swimming.", "OK!"),
  dial("샌드위치를 만들자.", "Let's make sandwiches.", "Yes!"),
  dial("체스를 두자.", "Let's play chess.", "Sure."),
  dial("줄넘기를 하자.", "Let's jump rope.", "All right."),
  dial("함께 노래하자.", "Let's sing together.", "Sure. (sing)"),
]);

// Strip right-side numbers on all red walk files (after manual fixes)
for (const book of ["red1", "red2"]) {
  const base = path.join(REPO, "data", book);
  for (const u of fs.readdirSync(base)) {
    const walk = path.join(base, u, "walk.json");
    if (!fs.existsSync(walk)) continue;
    if (book === "red1" && u === "unit01") continue;
    stripWalkFile(walk, true);
    // also strip left numbers on walk match left sides where present
    const d = JSON.parse(fs.readFileSync(walk, "utf8"));
    let ch = false;
    for (const it of d.items || []) {
      if (it.type !== "match") continue;
      it.pairs = (it.pairs || []).map((p) => {
        const l = p.left.replace(/^\d+\.\s*/, "");
        if (l !== p.left) ch = true;
        return { left: l, right: p.right };
      });
      it.accept = syncAccept(it.pairs);
    }
    if (ch) fs.writeFileSync(walk, JSON.stringify(d, null, 2) + "\n");
  }
}

// red2 unit04 run a02 accept very hard
const run4 = path.join(REPO, "data/red2/unit04/run.json");
const r4 = JSON.parse(fs.readFileSync(run4, "utf8"));
const a02 = r4.items.find((x) => x.id === "a02");
if (a02 && !a02.accept.includes("very hard")) {
  a02.accept.push("very hard");
  fs.writeFileSync(run4, JSON.stringify(r4, null, 2) + "\n");
}

// red2 unit08 quiz4 q01 Korean meta accepts
const q4 = path.join(REPO, "data/red2/unit08/quiz4.json");
const q4d = JSON.parse(fs.readFileSync(q4, "utf8"));
const q01 = q4d.items.find((x) => x.id === "q01");
for (const extra of ["동사원형-ing", "동사원형+ing", "동사원형ing"]) {
  if (!q01.accept.includes(extra)) q01.accept.push(extra);
}
fs.writeFileSync(q4, JSON.stringify(q4d, null, 2) + "\n");

console.log("apply-red-walk-fixes: done");
