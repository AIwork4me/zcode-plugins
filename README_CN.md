# ZCode 插件市场

[English](./README.md)

[ZCode](https://zcode.z.ai) 官方插件市场，收录由 ZCode 维护的插件和社区贡献插件。

你可以在这里浏览插件、在兼容客户端中添加市场源，也可以通过 GitHub Pull Request 提交新插件或改进建议。

## 文档

- [贡献指南](./CONTRIBUTING_CN.md)（[English](./CONTRIBUTING.md)）
- [分发格式](./docs/distribution_CN.md)（[English](./docs/distribution.md)）
- [插件开发教程](./docs/PLUGIN_DEVELOPMENT_CN.md)（[English](./docs/PLUGIN_DEVELOPMENT.md)）

## 插件列表

| 插件 | 分类 | 说明 |
| --- | --- | --- |
| [**cloudbase-skills**](./plugins/cloudbase-skills) | `developer-tools` | 腾讯云 CloudBase 开发技能与 MCP 集成，覆盖 Web、小程序、数据库、云函数、云托管、云存储和 AI 项目。 |
| [**mimosa**](./plugins/mimosa) | `developer-tools` | 本地优先的代码安全防线，提供写入前 Hook、复查与 Git 门禁、安全命令和可选密封深扫。 |
| [**github**](./plugins/github) | `developer-tools` | 基于 GitHub CLI 的工作流，覆盖提交、Pull Request、Issue、Release、Actions、仓库和 Codespaces。 |
| [**video2code**](./plugins/video2code) | `productivity` | 从网页录屏或 URL 复刻网页：内置 WebView 录制、逐帧观察、脚手架 React 项目，并与源视频对照验证。 |
| [**example-plugin**](./plugins/example-plugin) | `template` | 推荐插件结构模板，可以复制它开始开发新插件。 |

## 插件市场分类

根目录 [`marketplace.json`](./marketplace.json) 中的 `category` 用于统一检索和展示：

| 分类 | 适用范围 | 当前插件 |
| --- | --- | --- |
| `developer-tools` | 开发、代码质量、Git、CI 和工程工作流 | `cloudbase-skills`、`mimosa`、`github` |
| `productivity` | 计划、知识工作和个人工作流自动化 | `video2code` |
| `utilities` | 不属于其他分类的通用工具 | — |
| `finance` | 金融领域工作流：行情、财务、风险与金融科技集成 | — |
| `guides` | 文档、学习和参考类插件 | — |
| `template` | 用于复制的起始模板和示例插件 | `example-plugin` |
| `other` | 不适合以上分类的插件 | — |

## 安装方式

### 在 ZCode 中

ZCode 已内置官方插件市场。打开插件管理器，选择需要的插件并直接安装即可。

## 社区

插件用着有问题，或者自己在做插件想找人聊聊？扫码加入 ZCode 插件市场开发者群 —— 我们在群里答疑、同步进展、发布市场更新。

<a href="https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=a7bke6cf-4442-4f0b-923e-42c07f705a88&qr_code=true">
  <img src="./docs/images/community-feishu.png" alt="扫码加入 ZCode 插件市场开发者交流群" width="360">
</a>

海外开发者请加入我们的 [Discord](https://discord.gg/rhdRRNPqhh)。

## 贡献插件

欢迎社区开发者参与贡献：

1. 将 [`plugins/example-plugin/`](./plugins/example-plugin) 复制到 `plugins/<你的插件名>/`，并阅读[插件开发教程](./docs/PLUGIN_DEVELOPMENT_CN.md)。
2. 在 [`marketplace.json`](./marketplace.json) 中注册插件并填写分类。
3. 提供语义一致的中英文说明。
4. 在本地运行检查：

```shell
python3 scripts/validate.py
python3 scripts/build_dist.py
```

5. 提交 GitHub Pull Request，并完成贡献自查清单。

维护者会从质量、安全性、兼容性和许可证等方面审核提交。被接受的改动将进入官方发布流程，发布完成后会在 Pull Request 中同步结果。

完整要求请阅读[贡献指南](./CONTRIBUTING_CN.md)。

## 许可证

Apache License 2.0
