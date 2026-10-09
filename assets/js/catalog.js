/* Book → unit → exercise catalog (GreenZap / ZAP series) */
(function (root) {
  "use strict";

  var BOOKS = [
    { id: "zap-red-1", title: "ZAP Red 1", enabled: false },
    { id: "zap-red-2", title: "ZAP Red 2", enabled: false },
    { id: "zap-blue-1", title: "ZAP Blue 1", enabled: false },
    { id: "zap-blue-2", title: "ZAP Blue 2", enabled: false },
    { id: "zap-blue-3", title: "ZAP Blue 3", enabled: false },
    { id: "zap-blue-4", title: "ZAP Blue 4", enabled: false },
    { id: "zap-green-1", title: "ZAP Green 1", enabled: true, appName: "GreenZap 1", bookTitle: "ZAP Green 1" },
    { id: "zap-green-2", title: "ZAP Green 2", enabled: false },
    { id: "zap-green-3", title: "ZAP Green 3", enabled: true, appName: "GreenZap 3", bookTitle: "ZAP Green 3" },
    { id: "zap-green-4", title: "ZAP Green 4", enabled: false },
  ];

  var UNITS = {
    "zap-green-1": [
      { id: "unit-01", title: "Unit 01 — 현재 시제", enabled: true },
      { id: "unit-02", title: "Unit 02", enabled: false },
      { id: "unit-08", title: "Unit 08 — 여러 가지 문장", enabled: true },
    ],
    "zap-green-3": [
      { id: "unit-01", title: "Unit 01 — 의문사 있는 의문문 (1)", enabled: true },
      { id: "unit-02", title: "Unit 02", enabled: false },
    ],
  };

  var EXERCISES = {
    "zap-green-1:unit-01": [
      {
        slug: "walk1",
        title: "Grammar Walk — Lesson 01",
        hint: "Affirmative present · pp. 10–11",
        data: "data/green1/unit01/walk1.json",
        practiceId: "u01:walk1",
      },
      {
        slug: "walk2",
        title: "Grammar Walk — Lesson 02",
        hint: "Negatives & questions · pp. 12–13",
        data: "data/green1/unit01/walk2.json",
        practiceId: "u01:walk2",
      },
      {
        slug: "run",
        title: "Grammar Run",
        hint: "pp. 14–15",
        data: "data/green1/unit01/run.json",
        practiceId: "u01:run",
      },
      {
        slug: "jump",
        title: "Grammar Jump",
        hint: "pp. 16–17",
        data: "data/green1/unit01/jump.json",
        practiceId: "u01:jump",
      },
      {
        slug: "fly",
        title: "Grammar Fly",
        hint: "pp. 18–19",
        data: "data/green1/unit01/fly.json",
        practiceId: "u01:fly",
      },
      {
        slug: "writing",
        title: "Grammar & Writing",
        hint: "pp. 20–21",
        data: "data/green1/unit01/writing.json",
        practiceId: "u01:writing",
      },
      {
        slug: "quiz",
        title: "Unit Test 01",
        hint: "pp. 22–26",
        data: "data/green1/unit01/unit-test-01.json",
        practiceId: "u01:quiz",
      },
      {
        slug: "wrap",
        title: "Wrap Up",
        hint: "Summary · pp. 26–27",
        data: "data/green1/unit01/wrap.json",
        practiceId: "u01:wrap",
      },
      {
        slug: "checkup",
        title: "Check Up",
        hint: "Comic dialogue · p. 27",
        data: "data/green1/unit01/checkup.json",
        practiceId: "u01:checkup",
      },
    ],
    "zap-green-1:unit-08": [
      {
        slug: "walk1",
        title: "Grammar Walk — Lesson 01",
        hint: "Imperatives & exclamations · p. 163",
        data: "data/green1/unit08/walk1.json",
        practiceId: "u08:walk1",
      },
      {
        slug: "walk2",
        title: "Grammar Walk — Lesson 02",
        hint: "Tag questions · p. 165",
        data: "data/green1/unit08/walk2.json",
        practiceId: "u08:walk2",
      },
      {
        slug: "run",
        title: "Grammar Run",
        hint: "pp. 166–167",
        data: "data/green1/unit08/run.json",
        practiceId: "u08:run",
      },
      {
        slug: "jump",
        title: "Grammar Jump",
        hint: "pp. 168–169",
        data: "data/green1/unit08/jump.json",
        practiceId: "u08:jump",
      },
      {
        slug: "fly",
        title: "Grammar Fly",
        hint: "pp. 170–171",
        data: "data/green1/unit08/fly.json",
        practiceId: "u08:fly",
      },
      {
        slug: "writing",
        title: "Grammar & Writing",
        hint: "pp. 172–173",
        data: "data/green1/unit08/writing.json",
        practiceId: "u08:writing",
      },
      {
        slug: "quiz",
        title: "Unit Test 08",
        hint: "pp. 174–178",
        data: "data/green1/unit08/unit-test-08.json",
        practiceId: "u08:quiz",
      },
      {
        slug: "wrap",
        title: "Wrap Up",
        hint: "Summary · p. 179",
        data: "data/green1/unit08/wrap.json",
        practiceId: "u08:wrap",
      },
      {
        slug: "checkup",
        title: "Check Up",
        hint: "Comic dialogue · p. 179",
        data: "data/green1/unit08/checkup.json",
        practiceId: "u08:checkup",
      },
    ],
    "zap-green-3:unit-01": [
      {
        slug: "walk1",
        title: "Grammar Walk — Lesson 01",
        hint: "what, which, who · p. 11",
        data: "data/green3/unit01/walk1.json",
        practiceId: "g3:u01:walk1",
      },
      {
        slug: "walk2",
        title: "Grammar Walk — Lesson 02",
        hint: "when, where, why, how · p. 13",
        data: "data/green3/unit01/walk2.json",
        practiceId: "g3:u01:walk2",
      },
      {
        slug: "run",
        title: "Grammar Run",
        hint: "pp. 14–15",
        data: "data/green3/unit01/run.json",
        practiceId: "g3:u01:run",
      },
      {
        slug: "jump",
        title: "Grammar Jump",
        hint: "pp. 16–17",
        data: "data/green3/unit01/jump.json",
        practiceId: "g3:u01:jump",
      },
      {
        slug: "fly",
        title: "Grammar Fly",
        hint: "pp. 18–19",
        data: "data/green3/unit01/fly.json",
        practiceId: "g3:u01:fly",
      },
      {
        slug: "writing",
        title: "Grammar & Writing",
        hint: "pp. 20–21",
        data: "data/green3/unit01/writing.json",
        practiceId: "g3:u01:writing",
      },
      {
        slug: "quiz",
        title: "Unit Test 01",
        hint: "pp. 22–26",
        data: "data/green3/unit01/unit-test-01.json",
        practiceId: "g3:u01:quiz",
      },
      {
        slug: "wrap",
        title: "Wrap Up",
        hint: "Summary · p. 27",
        data: "data/green3/unit01/wrap.json",
        practiceId: "g3:u01:wrap",
      },
      {
        slug: "checkup",
        title: "Check Up",
        hint: "Comic dialogue · p. 27",
        data: "data/green3/unit01/checkup.json",
        practiceId: "g3:u01:checkup",
      },
    ],
  };

  root.MRJ_CATALOG = {
    books: BOOKS,
    units: UNITS,
    exercises: EXERCISES,
    unitKey: function (bookId, unitId) {
      return bookId + ":" + unitId;
    },
    findExercise: function (bookId, unitId, slug) {
      var list = EXERCISES[bookId + ":" + unitId] || [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].slug === slug) return list[i];
      }
      return null;
    },
    findBook: function (bookId) {
      for (var i = 0; i < BOOKS.length; i++) {
        if (BOOKS[i].id === bookId) return BOOKS[i];
      }
      return null;
    },
  };
})(window);
