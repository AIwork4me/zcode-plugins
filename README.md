# ZCode Plugins Marketplace

[中文文档](./README_CN.md)

The official plugins marketplace for [ZCode](https://zcode.z.ai), featuring plugins maintained by ZCode and contributions from the community.

Use this repository to browse available plugins, install the marketplace in compatible clients, or propose a new plugin through a GitHub pull request.

## Documentation

- [Contributing guide](./CONTRIBUTING.md) ([中文](./CONTRIBUTING_CN.md))
- [Distribution format](./docs/distribution.md) ([中文](./docs/distribution_CN.md))
- [Plugin development tutorial](./docs/PLUGIN_DEVELOPMENT.md) ([中文](./docs/PLUGIN_DEVELOPMENT_CN.md))

## Available Plugins

| Plugin | Category | Description |
| --- | --- | --- |
| [**cloudbase-skills**](./plugins/cloudbase-skills) | `developer-tools` | CloudBase development skills and MCP integration for Web, Mini Program, database, cloud functions, CloudRun, storage, and AI projects. |
| [**mimosa**](./plugins/mimosa) | `developer-tools` | Local-first security guardrails with pre-write hooks, review and Git gates, security commands, and optional sealed deep scans. |
| [**github**](./plugins/github) | `developer-tools` | GitHub CLI workflows for commits, pull requests, issues, releases, Actions, repositories, and Codespaces. |
| [**example-plugin**](./plugins/example-plugin) | `template` | Template demonstrating the recommended plugin structure. Copy it to start a new plugin. |

## Marketplace categories

The `category` field in [`marketplace.json`](./marketplace.json) keeps discovery consistent:

| Category | Use it for | Current plugins |
| --- | --- | --- |
| `developer-tools` | Development, code quality, Git, CI, and engineering workflows | `cloudbase-skills`, `mimosa`, `github` |
| `productivity` | Planning, knowledge work, and personal workflow automation | — |
| `utilities` | General-purpose helpers that do not fit another category | — |
| `finance` | Finance-domain workflows: markets, accounting, risk, and fintech integrations | — |
| `guides` | Documentation, learning, and reference-only plugins | — |
| `template` | Starter plugins and examples intended to be copied | `example-plugin` |
| `other` | A plugin that does not fit the categories above | — |

## Installation

### In ZCode

ZCode includes the official marketplace. Open the plugin manager, choose a plugin, and install it directly.

## Community

Have a question about a plugin, or building one of your own? Join the ZCode plugin developers on Discord — that is where we answer questions, share work in progress, and announce marketplace releases.

<a href="https://discord.gg/rhdRRNPqhh">
  <img src="./docs/images/community-discord.png" alt="Join the ZCode plugin developer community on Discord" width="360">
</a>

Developers in mainland China can join our Feishu group instead — see the [中文文档](./README_CN.md#社区).

## Contributing

Community contributions are welcome:

1. Copy [`plugins/example-plugin/`](./plugins/example-plugin) to `plugins/<your-plugin-name>/` and follow the [development tutorial](./docs/PLUGIN_DEVELOPMENT.md).
2. Register the plugin in [`marketplace.json`](./marketplace.json), including its category.
3. Provide equivalent English and Chinese documentation.
4. Run the local checks:

```shell
python3 scripts/validate.py
python3 scripts/build_dist.py
```

5. Open a GitHub pull request and complete the contribution checklist.

Maintainers review submissions for quality, security, compatibility, and licensing. Accepted changes are published through the official release process, and the pull request receives a status update when publication is complete.

See the [contributing guide](./CONTRIBUTING.md) for the complete requirements.

## License

Apache License 2.0
