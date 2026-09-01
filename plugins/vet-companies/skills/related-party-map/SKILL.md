---
name: related-party-map
description: Map a company's related parties — shareholders, outbound investments, brother companies, supply-chain counterparties (suppliers/customers), and funding-chain links — into a structured relationship map. Triggers on "关联方", "股权穿透", "关联企业", "supply chain map", "上下游客户供应商", "实控人", "股权结构".
---

# Related-Party & Relationship Map

Build the relationship graph around a target company, one hop at a time, with every edge sourced.

## Workflow

### Step 1: Resolve the anchor entity

Exact legal entity first (see entity-resolution discipline in `dd-report`). All queries use the resolved full legal name / ID.

### Step 2: Pull the relationship layers

Primary tool: 天眼查 (capability-list tools via the gateway protocol). Pull each dimension separately and label it.

**The tool names below are illustrative, not guaranteed.** The capability list is returned **per company** and varies — a sample on one large listed entity (2026-08-07) offered only `get_shareholder_info`, `get_external_investments`, `get_company_registration_info`, `get_judicial_case`, `get_annual_reports`, `get_branches`, `get_change_records`, `get_historical_registration`. So: anchor with `search_companies` and take the candidate's `id` — `get_company_capabilities` **requires** `company_id` and will not resolve a bare name (verified 2026-08-17: passing `keyword`/`company_name` alone returns `company_id is required for get_company_capabilities; call search_companies first`). Then run `get_company_capabilities` with that id, copy `tool_name` **verbatim** from what it returns, and where a dimension below has no tool on this company's list, record that dimension as `源不可用` naming what it would have covered. **Never call a name from this page that the capability list did not offer.** Every dimension here is exploratory tracing, so keep each call single-step (`call_tool`, never `call_tools_batch`) and pull a fresh `get_company_capabilities` for each new subject the map uncovers.

1. **股权链 — 向上**: shareholders with percentages (cross-check 天眼查 `get_shareholder_info`); iterate up to the actual controller (实控人 — `get_actual_controller` returns the resolved terminal, `get_equity_ratio` the control path, `get_beneficial_owners` the UBO under 央行 rules) or a natural person/SOE terminal. Note pledge status on major holdings (`get_equity_pledge_info` / `get_stock_pledge_info`).
2. **股权链 — 向下**: outbound investments (对外投资, cross-check 天眼查 `get_external_investments`; `get_equity_tree` for the layered structure, `get_controlled_companies` for the down-pierced list) with percentages; flag 100% shells and recently created vehicles.
3. **兄弟公司**: same-controller entities — the usual channel for related-party transactions. 天眼查 `get_group_info` identifies the group and its `groupUUID`; `get_company_group_profile` then returns members, group-level outbound investments and investors. `get_relation_graph` / `get_relation_path` expose the edges between two named subjects.
4. **供应链**: suppliers and customers with data vintage; flag concentration (any counterparty appearing as both supplier and customer is a `🔴 高` finding — resolve before deciding).
5. **资金链**: funding/transaction relationships where the data source exposes them.

For listed targets, cross-check controller and major-holder data against announcements (万得 `wind-docs.get_company_announcements`: 权益变动、质押公告).

### Step 3: Structure the map

Short-form is Markdown in-session, per the house formatting policy. If the user asked for a document, the map goes to PDF via the `report-render` skill — never hand-rolled with weasyprint, wkhtmltopdf, pandoc, or a bare reportlab script, because those do not emit `[n]` as PDF link annotations and the citations arrive unclickable. A wide relationship roster goes to `.xlsx` via `xlsx-author`. Word is the answer only when the user asks for it or the reader will edit the file — `report-render`'s `DocxReport` builds it with the same calls; unspecified long-form stays PDF (the house formatting policy). **要出 Word 就先载入 `report-render` 技能，再动手建。** `DocxReport` 与 `Report` 同一套调用；手搓 python-docx / docx-js 会丢掉标签配色、`[n]` 跳转与封面页，机制与实测记录在那个技能里，不在这里重述。

Output as a table per layer plus a compact tree for ownership:

```
实控人: [名称] [披露] [n]
  └─ [中间层] xx%
       └─ 目标公司
            ├─ 子公司A xx%
            └─ 子公司B xx%

关联维度表:
| 关系 | 对手方 | 强度/份额 | 报告期/数据时点 | 检索于 | 源 [n] |
```

Every retrieved edge is `[披露]`. A share you summed or netted across layers (穿透持股比例) is `[测算]` and states the arithmetic. Percentages that cannot be retrieved stay blank with a note — never estimated.

### Step 4: Flag patterns

Call out (as hypotheses, labeled `[推断]`, each with the concrete evidence that triggered it):

- 环形/交叉持股, 高比例质押的控制链, 频繁变更的股东结构
- 供应商=客户 重叠, 单一客户依赖 (>30% where shares are known)
- 新设壳公司集中出现, 注册地址/电话/人员重合(如数据可见)

### Step 5: Provenance and limits

Every edge carries an `[n]` marker naming the source system and the query date. The map closes with the coverage block — the dimensions are the check items, and the hop depth actually traversed is part of the scope:

```
## 覆盖范围与局限
检索于: [timestamp] · 口径/委托用途: [用途] · 股权向上穿透至第 [N] 层

| 检查项 | 结论 | 源 | 检索于 |
|---|---|---|---|
| 股权链—向上(至实控人) | 有记录(N 层) [n] / 检索范围内未发现 / 源不可用 | [系统名] | [date] |
| 股权链—向下(对外投资) |  |  |  |
| 兄弟公司 |  |  |  |
| 供应链(供应商/客户) |  |  |  |
| 资金链 |  |  |  |
| 股权质押 |  |  |  |

本次未能覆盖: [源未覆盖或未返回的维度,以及它们本应揭示的关系]
数据滞后性: [登记变更公示滞后;供应链数据时点与更新频率]

## 来源
[n] 〔一手|二手〕发布主体 · 文档或系统名 · 日期(发布日; 检索于) · URL
```

A dimension the source does not cover for this entity type is `源不可用`, not `检索范围内未发现` — and neither means "no such relationships exist". `〔一手|二手〕` is mandatory on every entry; a `二手` entry names what it relays. The count of distinct `[n]` markers equals the number of entries.
