# zcode-remotion Marketplace E2E Acceptance — Evidence Index
Test date: 2026-09-02 · Tester: ZCode agent (separate session) · All files in this directory.

- backups/                          — pre-install copies of all modified ZCode registry files
- install-marketplace.mjs           — marketplace/plugin registration actually executed (schemas read from engine)
- setup-cli-auth.mjs / exchange-api-key.mjs — headless CLI auth harness (official login flow replicated; tokens never printed)
- phase4-discovery.log              — engine `plugins list` / `skills list` / `commands list` outputs
- phase6-remotion-setup.log         — full /remotion-setup session transcript (12/12 COMPLETE)
- phase6-7-skills-summary.log       — skill install + visibility summary
- phase8-remotion-doctor.log        — full /remotion-doctor report (5/8 PASS + 3 N/A)
- phase9-prompt.txt                 — the EXACT one-prompt E2E prompt (verbatim from test plan)
- phase9-oneprompt.log / phase9-step-trace.txt / phase9-run1-analysis.log — run 1 (harness model glm-5.1 text-only)
- phase9-oneprompt-run2.log         — run 2 final message (definitive run)
- phase9-run2-trace.txt             — run 2 chronological tool trace (31 turns)
- mp4-frame-5s.png / mp4-frame-8.5s.png — frames extracted by tester from the FINAL MP4 (independent visual check)
- analyze/extract/trace/inspect *.mjs — transcript analysis tooling

Final artifact: C:\Users\rocm\Desktop\zcode-remotion-marketplace-e2e-run2\zcode-promo\out\ZCode-Remotion-Plugin-Promo.mp4
  3,493,835 bytes · ffprobe: video 1920x1080 H.264 + audio, duration 10.048s
Run-1 artifact (superseded, still valid): C:\Users\rocm\Desktop\zcode-remotion-marketplace-e2e\promo\out\zcode-remotion-promo.mp4
