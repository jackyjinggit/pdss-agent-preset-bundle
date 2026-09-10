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

## agent-handrail — `handrail-core`（1 个技能，同作者仓库）

- 来源：https://github.com/jackyjinggit/agent-handrail
- 取自 commit：`f1f1300e7cde96e602d4011bea6ec72cc98e948c`（HEAD，取证日 2026-09-10）
- 随本仓库分发的位置：`pdss/skills/handrail-core/SKILL.md`，**逐字节复制**，未作任何改写
  - 原文 SHA256：`4C64B187163D909B389C0F1055672DD016E58E0F5110D196AC2992A0C56B472F`
  - 原文大小：1954 字节（40 行）
- 版权与许可：**与本仓库同作者**（Copyright (c) 2026 Jiang Ping (蒋平)），随本仓库以 Apache-2.0 分发。
  该上游仓库当前**未附 LICENSE 文件**（GitHub 许可证字段为空）——此处不构成第三方许可问题
  （同一版权人），但**是该上游仓库对外的独立缺陷**，本声明不改变其状态。

漂移检测：上游若更新该技能，可用上面的 SHA256 与 commit 号比对；不一致即说明本包内副本已落后，按需重新同步。

未纳入：同仓库的 `handrail-runtime`。它在原仓库中是**包内导航技能**，正文写明「只指向 `runtime/INDEX.md`」，
离开原仓库会退化成指向不存在文件的指针（技能能加载、却指不到东西）——收入反而制造静默失效，故不收。

## 相邻仓库的两个客观事实（不影响本包）

1. `agent-handrail` 无 LICENSE 文件 → 对**第三方**而言「无授权即不可复用」；
2. 该仓库目录名首字符是双引号（`"snapshot`）→ Windows 上 `git clone` 的 checkout 必失败
   （`error: invalid path '"snapshot/…"'`）。绕法见 README「关于 agent-handrail」节。

G1–G6 红线已作为**文本内联**在本预设的 persona 内（见 `pdss/agent.cordis.yml`），
因此本预设不依赖该仓库即可完整工作。
