---
name: risk-scan
description: Fast risk-record screen for one company or a batch — 失信被执行, 终本案件, 限制高消费, 司法涉诉, 行政处罚, 股权质押与冻结, 对外担保, 破产重整与司法拍卖, plus adverse media — with severity ranking. Triggers on "风险排查", "有没有失信", "涉诉情况", "被限高了吗", "有没有破产重整", "黑名单筛查", "risk screen", "批量排查供应商".
---

# Company Risk Scan

The fast screen: disclosed risk records + adverse media, ranked. Use standalone or as Step 5 of `dd-report`.

## Workflow

### Step 1: Scope

One company or a batch list. For batches, run identical checks per company and output one ranked table; note that depth per name is shallower than a full DD. Each name is its own subject on 天眼查 — anchor and pull a capability list per company, and never carry one company's capability list over to the next.

### Step 2: Record checks (per company)

Query in this order, recording per check exactly one of `有记录` / `检索范围内未发现` / `源不可用`, plus the source and `检索于` date. These rows become the coverage table in Step 4. A retrieved record is `[披露]`; a ratio you computed from one (质押比例、担保/净资产) is `[测算]`.

天眼查 reaches these records through a capability list, not by calling a tool name directly. Once per subject: `search_companies` → `get_company_capabilities` (with that `company_id`) → then `call_tool` per check below, copying `tool_name` verbatim from the list and passing `company_name` as the subject. **Take `company_id` from the candidate table's 企业ID column, not from the widest number in the row** — the 统一社会信用代码 is longer and ids are not a fixed width, so picking by length lands on the wrong entity. List tools need explicit `page`/`page_size`. `call_tools_batch` takes at most 3 independent checks — use it for plain list pulls that stand alone (2, 3 and 5, or 6's pledge tool and 7), never for a drill-down the vendor marks 建议单独调用 (`get_lawsuit_detail` under 4, `get_judicial_assistance` under 6) and never for the exploratory anchoring calls.

`get_risk_overview` gives a 自身/周边/预警 triage in one call and needs no capability list. Use it to triage only: the per-check queries below still populate the coverage table, and a zero triage count is not a substitute for running a check you intend to report on.

**A check whose tool is absent from this company's capability list is `检索范围内未发现`, not `源不可用`** — the list is generated per company, and 「当前未查询到记录的维度」 means this company has no such record under that tool. Reserve `源不可用` for a failed or unauthorized call. Never retry a guessed synonym to get around an absent dimension.

**The list is record-driven, so absence is the answer and not a reason to call anyway.** A risk tool appears only for a company that has records under it. Observed directly on 2026-08-18: `get_terminated_cases` / `get_high_consumption_restriction` / `get_judicial_auction` were all present on a distressed property issuer's list and all absent on a healthy same-sector peer's; `get_bankruptcy_reorganization` was absent for both and present only for a subject that had actually entered 重整. So the presence of these tools is itself a distress signal, their absence is the `检索范围内未发现` for that check, and you record that verdict from the list rather than spending a call to rediscover it.

1. **失信被执行 / 被执行人** — `get_default_event_info` (covers both 失信被执行人 and 被执行人, with 执行案号/法院/标的). The single most decisive record; a hit is always `🔴 高`.
2. **终本案件** — `get_terminated_cases` — 案号, 执行法院, 立案/终本日期, 执行标的, and **未履行金额**. 终本 means the court closed this round of enforcement having found no executable property, so it is strictly stronger evidence than an open 被执行 record, and 未履行金额 is the balance that went unpaid. Report the record count and the summed 未履行金额 (`[测算]`, state how many rows the sum covers and whether you paged through all of them — a distressed issuer can return thousands of rows, so an unstated first page is a material understatement). A material 未履行金额 is `🔴 高`.
3. **限制高消费** — `get_high_consumption_restriction` — 案号, 申请人, 发布/立案日期, and `restrictedPerson`, the natural person restricted. Read `restrictedPerson` back and tie it to Step 3 of `dd-report`: it is usually the 法定代表人 or an 实际控制人, which links a company record to a named individual. A live 限高 on the current legal representative is `🔴 高`.
4. **司法涉诉** — `get_case_filing_info` (未结立案) + `get_judicial_documents` (裁判文书; full text via `get_lawsuit_detail`) — case counts, roles (原告/被告), amounts and status where exposed. `get_judicial_case` adds 案件身份与审理程序 where needed. Repeated 被告 in 借款/买卖合同纠纷 is a credit signal `[推断]`.
5. **行政处罚** — `get_administrative_penalty` — regulator, ground, amount, date. Do not substitute `get_administrative_license`, which is 行政许可, not 处罚.
6. **股权质押与冻结** — two different encumbrances, both reported on this row. `get_equity_pledge_info` (登记出质) or `get_stock_pledge_info` (listed only — verified absent from a non-listed subject's list and present for a listed one) gives pledge ratio on the company's shares or its holders' stakes; >50% controller pledge is `🟡 中`, near-full pledge `🔴 高`. `get_judicial_assistance` gives **股权冻结** — 执行法院, `equityCompany` (whose equity is frozen), 股权数额, 公示日期, 状态 (冻结/解除冻结/续行). A freeze is a court act on the way to disposal, not a financing choice like a pledge; report the two separately and never merge their counts. An active 冻结 on a material holding is `🔴 高`.
7. **对外担保** — `get_guarantee_info` — 担保方, 被担保方, 担保方式, 担保金额, `guaranteeEndDate`, `fulfilled`. Two reads that are easy to get wrong and were both observed on the verification run:
   - **Check `guaranteeEndDate` against today before counting anything as outstanding.** The tool returns the historical record, not the live book: on one verification run a distressed issuer's rows all carried 到期日 several years in the past with `fulfilled=否`, i.e. already expired as of retrieval. Summing them yields a current exposure that does not exist. State the 到期日 per row and total only what is still live, saying how many rows you excluded as expired.
   - **Check whether 担保方 and 被担保方 are the same entity.** Where they are, the row is the entity's guarantee of its own obligation (typically a bond), not third-party exposure — a different fact, and it does not belong in a 对外担保 total.
   - 担保/净资产 is `[测算]`: state the denominator and its 报告期. The tool is documented as 上市公司对外担保 but is **not** limited to listed subjects — verified returning records for a non-listed bond issuer, so do not record `不适用` on the strength of that description alone.
8. **舆情** — 万得 `wind-docs.get_financial_news` (公司名 + 违约/被查/纠纷/爆雷 keywords, trailing 12-24 months; no date parameters (only `query` / `top_k`) — put the window in the `query` text and filter after retrieval). Findings with no corroborating record are `[媒体]` and stay `[媒体]` until a record confirms them.

### Step 2.5: 破产重整与司法拍卖 — dedicated dimensions first, `search_bids` only for what they miss

These are counterparty-risk records that none of the Step 2 checks return, and each has its **own capability-list tool**. Use those; keyword-searching the tender tool for them finds less and cannot support a clean `检索范围内未发现`.

1. **破产重整** — `get_bankruptcy_reorganization` — 案号, 申请人, 被申请人, 案件类型 (破产案件 / 破产审查案件), 状态, 提交时间. Verified against a subject that had entered 重整 — it returned multiple records. **Read 申请人 vs 被申请人**: the entity as 被申请人 is its own distress; the entity as 申请人 is it petitioning against someone else, which is a different fact.
2. **司法拍卖** — `get_judicial_auction` — 拍卖标题, 起拍价, 评估价, 拍卖时间, 处置单位, plus the 拍卖公告 URL. Verified against a distressed property issuer — it returned multiple records. The title states what is being sold; a **债权** auction means someone is selling a claim *against* this entity, which is distress, while an asset auction is its property being disposed of.

Both tools are record-driven like the rest of the capability list: absent from the list means this company has no such record — that is the `检索范围内未发现` for the check, and it is read off the list rather than called.

**A 破产重整 or 司法拍卖 record on the entity, its controller, or a material guarantor is a 🔴 finding**, graded on the finding, never as a rating of the entity. Every hit is a record, so `[披露]` with the 公告链接 — not `[媒体]`.

`search_bids` (the static entry point; the same dimension appears as `get_bidding_info` inside a capability list) still covers what the two tools above do not: **重整投资人招募公告、重整投资人资格、管理人公告、资产处置公告**, and 中标 records. Run it as a supplementary channel with `publish_start_time`/`publish_end_time` and the vendor's documented terms (`重整` / `招募` / `竞买` / `投资人资格` / `资产处置`), and record it as its own line in the coverage table — a miss here is `检索范围内未发现` **for that channel**, which is not the same statement as the two dedicated dimensions returning nothing. Distinguish the entity's **role** here too: subject of the 重整/拍卖 versus 竞买人/投资人 buying distressed assets, which is not a red flag by itself. Say which.

### Step 3: Severity

Grade findings, never the entity — this skill issues no rating. Cap the front of the list at three `🔴`.

- `🔴 高`(决策前须澄清): 失信记录、被执行大额、终本案件未履行金额大、现任法定代表人被限高、破产重整/清算、司法拍卖、重大股权冻结、立案调查、控制人近全额质押、违约
- `🟡 中`(记录并跟踪): 多起未决涉诉、高质押、局部或已解除的股权冻结、大额在保担保、近期处罚、密集负面舆情
- `⚪ 低·信息`: 少量历史小额记录、已结案且无后续、已到期的历史担保

### Step 4: Output

Single company — short report with the check-by-check coverage table below. Batch:

```
| 公司 | 结果 | 失信 | 终本·限高 | 涉诉 | 处罚 | 质押·冻结 | 担保 | 破产·拍卖 | 舆情 | 备注 |
|      | 🔴 高/🟡 中/⚪ 低·信息 | ... 每格: 记录数 [n]、未发现、或 源不可用 |
```

Short-form stays Markdown in-session. If the user asked for a file: a batch scan goes to `.xlsx` via `xlsx-author` (the roster is tabular and the reader will filter it — it is that skill's **Class B** case, so the `来源` worksheet plus a `来源编号` column per row carries the provenance, not a comment per cell); a single-subject written scan goes to PDF via the `report-render` skill — never hand-rolled with weasyprint, wkhtmltopdf, pandoc, or a bare reportlab script, because those do not emit `[n]` as PDF link annotations and the citations arrive unclickable. Word is the answer only when the user asks for it or the reader will edit the file — `report-render`'s `DocxReport` builds it with the same calls; unspecified long-form stays PDF (the house formatting policy). **要出 Word 就先载入 `report-render` 技能，再动手建。** `DocxReport` 与 `Report` 同一套调用；手搓 python-docx / docx-js 会丢掉标签配色、`[n]` 跳转与封面页，机制与实测记录在那个技能里，不在这里重述。

Both forms close with:

```
## 覆盖范围与局限
检索于: [timestamp] · 口径/委托用途: [用途,如供应商准入/授信]

| 检查项 | 结论 | 源 | 检索于 |
|---|---|---|---|
| 失信被执行 | 有记录(N 项) [n] / 检索范围内未发现 / 源不可用 | [系统名] | [date] |
| 终本案件 | 有记录(N 项,未履行合计 X) |  |  |
| 限制高消费 | 有记录(N 项,被限高人 …) |  |  |
| 司法涉诉 |  |  |  |
| 行政处罚 |  |  |  |
| 股权质押 |  |  |  |
| 股权冻结 |  |  |  |
| 对外担保 | 有记录(N 项,其中在保 M 项) |  |  |
| 破产重整 |  |  |  |
| 司法拍卖 |  |  |  |
| 招募/资产处置公告 |  |  |  |
| 舆情 |  |  |  |

本次未能覆盖: [本次不可用的源,以及它们本应覆盖的检查项]
数据滞后性: [判决上网、处罚传输、登记公示的已知滞后]
"检索范围内未发现"仅指上述源在本次检索范围内无记录,不构成无风险、无此事或通过的结论。

## 来源
[n] 〔一手|二手〕发布主体 · 文档或系统名 · 日期(发布日; 检索于) · URL
```

For a batch, the coverage table is per-source rather than per-company (the matrix above already carries the per-company detail), and the batch header states that depth per name is shallower than a full DD. A source that failed for only some names says which. Every `[n]` marker maps to exactly one entry — a database query with no publication date carries `检索于 [date]` alone, e.g. `[3] 一手 · 天眼查 · 股权质押登记 · [date](登记); 检索于 [date]`.
