# Teacher PIN (`study_teacher_check`) verification

Client: `assets/js/zap-teacher.js` posts to `MRJ_AUTH.ENDPOINT` with:

```json
{ "action": "study_teacher_check", "pin": "<teacher pin>", "id": "<student id>", "token": "<session token>" }
```

Backend (mrj-signin `Code.gs`, already in GitHub `main`):

- Route: `if (action === "study_teacher_check") return json_(studyTeacherCheck_(body));`
- Handler: compares trimmed lowercase PIN to script property **`STUDY_TEACHER_PIN`**
- Does **not** validate student token (PIN-only gate for in-room teacher unlock)

## If PIN “does not work” in production

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| UI: “Teacher check is not on the deployed auth backend yet…” (`bad_action`) | Apps Script web app deployment is **older** than repo `Code.gs` | Redeploy mrj-signin web app from current `Code.gs` (see `SERVER_REDEPLOY.md`) |
| “Teacher PIN is not set on the server.” | Missing `STUDY_TEACHER_PIN` script property | Set property in Apps Script → Project settings → Script properties |
| “Wrong PIN.” | PIN mismatch | Set/update `STUDY_TEACHER_PIN`; PIN compare is case-insensitive |
| “Too many tries. Wait 10 minutes.” | Rate limit cache | Wait 10 minutes or clear `study_teacher_fail` cache server-side |
| “Unexpected server response.” / “Network error.” | Non-JSON HTML, CORS, or offline | Check browser Network tab on POST to exec URL |

## CoS / Grammar smoke test (after student sign-in)

1. Open Grammar Zap hub with a signed-in student (chip visible).
2. Click **Teacher** → enter known PIN → expect **Teacher ✓** and teacher menu (start point UI).
3. DevTools → Network: POST body `action: study_teacher_check`; response JSON `{ "ok": true }`.
4. Wrong PIN once: `{ "ok": false, "message": "Wrong PIN." }` (not `bad_action`).

No hardcoded PIN in this repo — PIN lives only in Apps Script `STUDY_TEACHER_PIN`.
