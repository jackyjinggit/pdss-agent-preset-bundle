# 第三方组件声明（THIRD-PARTY NOTICES）

本仓库以 **Apache-2.0** 分发（全文见 `LICENSE`）。下列第三方内容随本仓库一同分发，
按其各自许可证的要求保留版权与许可声明。

## co-agency-integrity — 认知免疫技能包（5 个技能）

- 来源：https://github.com/jackyjinggit/co-agency-integrity
- 许可证：MIT
- 随本仓库分发的位置：`pdss/skills/` 下的 5 个技能目录
  - `audit-quantification`
  - `autoethnography-peer-review`
  - `council-method`
  - `governance-precheck`
  - `metaphor-power-audit`
- MIT 许可证全文随附于：`pdss/skills/LICENSE-co-agency-integrity`

MIT 版权行：

```
Copyright (c) 2026 Jiang Ping (蒋平) and contributors
```

MIT 与 Apache-2.0 兼容：MIT 内容按原条款再分发，Apache-2.0 项目可包含 MIT 组件。

## 相邻仓库 agent-handrail —— 未纳入本包分发

`agent-handrail`（G1-G6 红线文本，含两个技能 `handrail-core`、`handrail-runtime`）
**没有被复制进本仓库**，原因有两条，均为客观阻塞而非取舍：

1. 该仓库当前**没有 LICENSE 文件**（GitHub 许可证字段为空）→ 无授权即不可再分发；
2. 该仓库的目录名含双引号字符（`"snapshot`）→ 在 Windows 上 `git clone`
   会以 `error: invalid path` 失败、工作树无法 checkout。

G1-G6 红线已作为**文本内联**在本预设的 persona 内（见 `pdss/agent.cordis.yml`），
因此本预设不依赖该仓库即可完整工作。自行接入那两个技能的方法见 README
「可选：接入 agent-handrail 技能」。
