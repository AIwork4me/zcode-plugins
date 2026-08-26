<!--
PR title must follow Conventional Commits / PR 标题必须符合 Conventional Commits：
  feat(<plugin-name>): <what changed>     新增或修改插件能力
  fix(<plugin-name>): <what changed>      修复插件问题
  docs: / chore(ci): / refactor: ...      仓库级改动
The PR title becomes the squash commit on main. / PR 标题会成为 main 上的最终提交信息。
-->

## What / 改动内容

<!-- What does this PR change, and why? / 这个 PR 改了什么，为什么？ -->

## Self-check / 自查清单

<!-- For plugin changes. Delete this section for repo-level changes (docs/ci).
     插件改动必填；纯仓库级改动（docs/ci）可删除本节。 -->

- [ ] Plugin name is unique kebab-case; directory is `plugins/<name>/` / 插件名唯一且 kebab-case，目录为 `plugins/<name>/`
- [ ] `version` bumped in BOTH `plugin.json` and `marketplace.json` (artifacts are immutable) / `plugin.json` 与 `marketplace.json` 两处版本号已同步升级（制品不可变）
- [ ] `README.md` (EN) and `README_CN.md` (中文) both updated and equivalent / 中英文 README 均已更新且语义一致
- [ ] `description_i18n` has both `en` and `zh-CN` / `description_i18n` 包含 `en` 与 `zh-CN`
- [ ] No secrets, machine-specific paths, or private dependencies / 不含密钥、机器专属路径或私有依赖
- [ ] Model/API/network dependencies documented / 模型、API、网络依赖已写明
- [ ] `python3 scripts/validate.py` and `python3 scripts/build_dist.py` pass locally / 本地校验与构建均通过
