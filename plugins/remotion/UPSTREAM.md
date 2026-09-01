# Upstream and provenance

This Marketplace package is derived from:

- Source repository: https://github.com/AIwork4me/zcode-remotion
- Source version: `0.2.5`
- Source main commit used for this submission: `2a9903c2cfc167f11cbec3009a2d7b2161b03492`

## Marketplace packaging adaptations

The official Marketplace package keeps the user-facing runtime layer and intentionally excludes repository-maintenance assets such as CI workflows, demos, verification reports, unit tests, release checks, and upstream-drift automation.

The following distribution-specific adjustments are applied without changing the product boundary:

1. Add the bilingual `description_i18n` metadata required by the official Marketplace validator.
2. Provide Marketplace-specific English and Chinese READMEs that document network access, local command execution, file writes, dependencies, side effects, and licensing.
3. Resolve bundled helper scripts from the installed plugin root instead of assuming the user's current workspace is the source repository. Workflows first resolve `ZCODE_PLUGIN_ROOT` and then invoke the packaged scripts by absolute path.
4. Remove two duplicated prose fragments from the source skill/setup text while preserving the same behavior.

## Third-party material

No Remotion Agent Skill is vendored in this package. The plugin asks the user's machine to fetch official skills from `remotion-dev/skills` using the official installer. See `NOTICE.md` for licensing details.
