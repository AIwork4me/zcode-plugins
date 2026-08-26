# Shared assets (icons, ...)

[中文](README_CN.md)

Files in this directory are synced to OSS/CDN by the publish pipeline on
every merge to main, keeping the same layout:

```
assets/<plugin-name>/icon.png
  -> https://cdn-zcode.z.ai/zcode/official-plugin/assets/<plugin-name>/icon.png
```

Reference the CDN URL from the client / marketplace entry, e.g.:

```
icon: "https://cdn-zcode.z.ai/zcode/official-plugin/assets/android-emulator/icon.png"
```

Conventions:

- One subdirectory per plugin, named after the plugin (kebab-case).
- Icons: `icon.png`, square, ideally 256×256 (or larger power of two).
- Keep icon backgrounds transparent and preserve the authored Figma colors.
  The client supplies the theme-aware rounded container and centers the glyph
  at two-thirds of the container size.
- Assets are **mutable**: re-committing a file with new content re-uploads it
  in place and refreshes its CDN cache (browser caches expire within 1 hour).
- Deleting a file here does **not** delete it from OSS; clean up manually if
  ever needed.
- Dot-files and these READMEs are not uploaded.
