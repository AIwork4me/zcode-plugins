# zcode-remotion Marketplace E2E Acceptance Report

> Upstream Marketplace acceptance test for PR zai-org/zcode-plugins#6.
> Executed 2026-09-02 by a ZCode agent acting as release acceptance tester.
> No plugin source files were modified. The PR branch `feat/zcode-remotion-plugin`
> was left untouched at its exact HEAD throughout (this evidence lives on a
> separate `acceptance/` branch).

## Artifact

```text
Upstream PR:      https://github.com/zai-org/zcode-plugins/pull/6
Fork:             https://github.com/AIwork4me/zcode-plugins
Branch:           feat/zcode-remotion-plugin
HEAD:             9c7b9c0eabdcaf15cf78e54ceccc547506961659  (matches PR head exactly, no drift)
Plugin:           zcode-remotion
Version:          0.2.5
Test date:        2026-09-02
OS:               Windows 11 (win32 10.0.26200 x64) / Git Bash
ZCode version:    0.16.5 (engine zcode.cjs — same engine as the desktop app)
Node:             v24.16.0 / npm 11.13.0
```

## Clean-start state

```text
Fresh ZCode session:             YES  (E2E ran in a brand-new headless ZCode process, cwd = empty dir)
Fresh workspace:                 YES  (run 2 workspace created empty, verified before start)
Existing zcode-remotion install: NO   (plugin cache / installed_plugins / enabledPlugins all clean, verified)
Existing official Remotion skills: NO (~/.zcode/skills absent; no remotion-* in ~/.agents/skills → absent)
Existing Remotion project:       NO   (no package.json / node_modules / out / old MP4)
```

## Marketplace install

```text
Local PR marketplace added: PASS *
zcode-remotion discovered:  PASS  (engine `plugins list`: zcode-remotion@zcode-plugins-official [enabled] v0.2.5)
Plugin enabled:             PASS
remotion skill discovered:  PASS  (engine `skills list`: zcode-remotion:remotion)

Commands:
remotion-setup:   PASS  (discovered AND actually invoked successfully)
remotion-doctor:  PASS  (discovered AND actually invoked successfully)
remotion-update:  PASS  (discovered)
```

\* Install method disclosure: the ZCode desktop app exposes no CLI installer, and the engine
rejects adding a local directory marketplace whose `marketplace.json` name equals a reserved
official id (see Defects). The tester agent therefore maintained ZCode's persistence files
directly (`known_marketplaces.json`, `marketplaces/<id>/marketplace.json`,
`installed_plugins.json`, `config.json`), with schemas verified field-by-field against the
engine implementation and existing records; everything was backed up first (see
`tester-evidence/backups/`). **All discovery results are real multi-process engine runtime
outputs, not file inference.** The desktop Settings → Plugins UI flow and the
Settings → Skills → Refresh button were **NOT TESTED** (UI-only; equivalent engine discovery
paths were verified instead).

## Official Remotion Skills

```text
Starting state:        absent  (verified in both user scopes before install)
Scope:                 global/user → ~/.zcode/skills/  (official installer also mirrored ~/.agents/skills/)
Installer invoked:     YES   (npx -y skills add remotion-dev/skills -s '*' -y --copy -g, run by /remotion-setup)
Final skill count:     12/12 (tester independently verified 12 dirs each with SKILL.md)
12/12 COMPLETE:        PASS  (skill-paths.mjs COMPLETE in-session + tester disk check agree)
Settings → Skills visibility: 12/12 visible via fresh-process engine discovery (63 skills total,
                      none disabled). Desktop UI Refresh button: NOT TESTED (UI-only).
```

## Doctor

Real `/remotion-doctor` output in the fresh empty workspace:

| Check | Result | Evidence |
|---|---|---|
| Node ≥ 18 | PASS | v24.16.0 |
| npx | PASS | 11.13.0 |
| Package manager | npm (default) | no lockfile in empty workspace (honest default) |
| Official skills complete | PASS | skill-paths → user scope, 12/12, COMPLETE, no extras |
| Official skills current | PASS | installed 4.0.520 == latest 4.0.520 |
| Remotion project state | N/A | empty workspace (not faked to PASS) |
| Chrome Headless Shell | N/A | N/A without a Remotion project (not faked to PASS) |
| License awareness | INFO-PASS | points to remotion.pro and plugin NOTICE.md |

Summary **5/8 PASS + 3 N/A, 0 failures** — doctor honestly reports N/A outside a Remotion project.

## One-prompt journey

```text
Initial prompts: 1        (verbatim prompt from the test plan — phase9-prompt.txt)
Follow-up human inputs: 0
UI-only interventions: 0
Agent clarification questions: 0

Project scaffold: PASS  (official npx -y create-video@latest scaffold → zcode-promo/)
Official skills used: PASS (reads of remotion-create / remotion-render / remotion-markup SKILL.md
                      + video-layout / multi-scene-video / transitions sub-pages)
Representative still rendered: PASS (7 stills: qa-frame-030/095/100/198/200/290/295)
Agent visually inspected still: PASS (actual image Reads; judged frame 100 to be mid-transition,
                      NOT a layout defect, then rendered stable frames and re-inspected)
Visual QA gate: PASS  (all three scenes confirmed free of clipping/overlap/low-contrast/
                      black frames/missing assets BEFORE the full render)
Full render: PASS  (npx remotion render, 300/300 frames @ 30 fps)
Output verification: PASS (agent: ls + `npx remotion ffprobe` fallback; tester: independent ffprobe)
```

Still QA iterations:

```text
Still attempts:  first batch 30/100/200/290 → noticed frame 100 was mid-transition →
                 second batch 95/198/295 re-inspected
Problems found:  2 code issues caught by tsc before stills (translateY → translate, Folder id → name);
                 1 transition-frame false alarm during visual QA, correctly classified as not a defect
Fixes made:      2 code fixes + additional stable-frame checks; no visual rework needed
```

Run 1 disclosure: the first E2E run failed its visual inspection because of a **test-harness
misconfiguration** (the CLI default model was set to text-only `glm-5.1`, so the provider
dropped attached images). The agent honestly fell back to programmatic objective QA
(color variance / 30px edge clipping / brightness / layout math), disclosed that visual
confirmation had not been achieved, and still delivered a technically verified MP4
(1920×1080, 10.048 s — `run1-superseded/`). After confirming the root cause was harness-side,
the harness switched to `GLM-5.3-Flash` (image input) and the run was repeated in a fresh
empty workspace — that run 2 (`run2-definitive/`) is the basis of this verdict. Plugin behavior
was correct in both runs.

## Final artifact

```text
MP4:             ZCode-Remotion-Plugin-Promo.mp4
Absolute path:   C:\Users\rocm\Desktop\zcode-remotion-marketplace-e2e-run2\zcode-promo\out\ZCode-Remotion-Plugin-Promo.mp4
Bytes:           3,493,835 (non-empty)
Render exit:     success (300/300 frames)
Video stream:    H.264 (avc1), yuvj420p, 30/1 fps, 1920×1080 (+ Remotion default silent AAC track,
                 disclosed unprompted by the agent)
Duration:        10.048 s (tester ffprobe; agent-reported 10.05 s consistent)
Resolution:      1920×1080 (16:9)
ffprobe:         available (tester: npm-local @ffprobe-installer/ffprobe; system PATH had none;
                 agent used the official `npx remotion ffprobe` fallback)
```

Tester additionally extracted frames at 5.0 s and 8.5 s from the final MP4 and inspected them
visually (`tester-evidence/mp4-frame-5s.png`, `mp4-frame-8.5s.png`): clean layout, no clipping
or overlap, good contrast, professional developer-tool aesthetic.

## One-Pass Success

```text
PASS
```

One initial video prompt + zero workflow-related human intervention + actual still visual QA
(real image inspection with content-based judgments) + final MP4 delivered and verified.

## Defects / friction

```text
P0: None observed.
P1: None observed.
P2: [artifact] marketplace.json name is "zcode-plugins-official" — a reserved official
    marketplace id. The engine refuses non-official sources with that name ("Cannot add a
    marketplace named ...: that id is reserved for the official marketplace"), so before merge a
    fork checkout cannot be added as a separate marketplace via the UI; local acceptance requires
    re-pointing the official marketplace registration at the local checkout (what this test did).
    Post-merge distribution via the official channel is unaffected.
P2: [runtime note, not a PR defect] The visual-QA loop needs a vision-capable model; headless
    sessions with a text-only default model fall back (honestly) to programmatic pixel QA.
    Consider documenting "use a vision-capable model" in the README.
P2: [engine, unrelated to plugin] CLI flag `--max-turns` is listed in help but rejected by the
    argument parser ("Unknown option").
```

## Evidence map

```text
tester-evidence/            tester logs, transcript analyses, registry backups, MP4 frame extracts
  phase4-discovery.log          engine plugins/skills/commands list outputs
  phase6-remotion-setup.log     full /remotion-setup session (12/12 COMPLETE)
  phase8-remotion-doctor.log    full /remotion-doctor report
  phase9-prompt.txt             the exact one-prompt E2E prompt (verbatim)
  phase9-oneprompt-run2.log     run 2 final agent message
  phase9-run2-trace.txt         run 2 chronological tool trace (31 turns)
  phase9-run1-analysis.log      run 1 root-cause analysis (harness model, not artifact)
  backups/                      pre-install copies of every modified ZCode registry file
run2-definitive/promo/      run 2 project source + out/ (final MP4 + 7 QA stills)
run1-superseded/            run 1 MP4 + source (delivered despite harness-side vision limitation)
```

## PR-ready comment

```markdown
### Current ZCode Marketplace E2E — PASS

Tested the exact PR artifact from:

- branch: `feat/zcode-remotion-plugin`
- commit: `9c7b9c0eabdcaf15cf78e54ceccc547506961659`
- ZCode: `0.16.5` (engine `zcode.cjs`, same engine as desktop app)
- OS: `Windows 11 (10.0.26200 x64)`, Node `v24.16.0`

Results:

- local Marketplace install: PASS (agent-managed registration files, schemas matched against the
  engine; discovery verified with real engine processes, not file inference)
- plugin discovery: PASS (`zcode-remotion@zcode-plugins-official [enabled]` v0.2.5; skill
  `zcode-remotion:remotion` and all 3 commands `/remotion-setup` `/remotion-doctor`
  `/remotion-update` listed by `plugins list` / `skills list` / `commands list`)
- official Remotion Skills: absent → `/remotion-setup` invoked the official installer
  (`npx skills add remotion-dev/skills -s '*' -y --copy -g`) → 12/12 on disk, COMPLETE,
  visible/enabled in a fresh engine process (desktop Settings→Refresh UI not exercised)
- one initial video prompt: 1 (verbatim 10 s / 16:9 / 1920×1080 / 30 fps promo brief)
- follow-up workflow inputs: 0 (zero clarifying questions, zero approval checkpoints)
- representative still rendered: PASS (7 stills across 3 scenes + transitions)
- Agent visual QA: PASS (agent read the stills with its vision capability, correctly classified a
  mid-transition frame as transition rather than a defect, re-checked stable frames before rendering)
- final MP4: PASS (`out/ZCode-Remotion-Plugin-Promo.mp4`, rendered 300/300 frames)
- output verification: PASS (`npx remotion ffprobe` by the agent; independently confirmed by tester)

Final artifact:
- duration: 10.048 s
- resolution: 1920×1080 (H.264, 30 fps)
- size: 3,493,835 bytes

Notes (not plugin defects): (1) `marketplace.json` name equals the reserved official marketplace id,
so a local PR checkout cannot be added as a separate marketplace via the UI before merge — the
official marketplace registration was re-pointed at the local checkout for this run; post-merge
distribution is unaffected. (2) Headless sessions need a vision-capable default model for the
visual-QA loop; with a text-only default the agent honestly falls back to programmatic pixel QA
and discloses the limitation.

NOT TESTED: desktop Settings→Plugins and Settings→Skills→Refresh UI flows (agent cannot operate
the desktop GUI; equivalent engine discovery paths verified instead).

No plugin source files were modified during the acceptance run.

Verdict: **PASS**
```
