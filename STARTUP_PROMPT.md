# STARTUP_PROMPT.md

Use this only once, before Module 01.

```text
Read MASTER_SPEC.md completely.

Read DEVELOPMENT_PLAN.md.

Inspect the repository and Git configuration.

Do not attempt to build the whole application.

First produce a concise technical implementation plan covering:

- frontend architecture
- backend architecture
- Supabase architecture
- realtime strategy
- media strategy
- AI Gateway strategy
- WebRTC/SFU strategy
- Capacitor strategy
- web/PWA vs native platform boundaries
- Git/GitHub workflow
- major technical risks

Verify that the architecture is compatible with MASTER_SPEC.md.

Do not change MASTER_SPEC.md unless a requirement is technically impossible or internally contradictory.

If there is a conflict, explain it before changing anything.

Then implement MODULE 01 only, following the complete Module 01 prompt from MODULE_PROMPTS.md.

After Module 01:

- typecheck
- lint
- tests if available
- production build
- review git diff
- update DEVELOPMENT_PLAN.md
- commit
- push to GitHub
- verify push
- report results

Then STOP.
```
