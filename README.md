# PDSS Agent Preset + Bundle · 治理层插件包（v0.2 三合一）

> 把 PDSS 治理协议层以 **Agent Preset + Bundle** 形态接入 DeepSeek Harness。
> **v0.2 三合一**：preset（治理 persona）+ **agent-handrail**（G1–G6 红线扶手）+ **co-agency-integrity**（认知免疫：FEE 盲评/隐喻审计/议会预检）——三层叠加 = 治理闭环。

## 三层架构（配合两个开源仓库）

| 层 | 来源 | 进 preset 的形态 | 回答什么问题 |
|---|---|---|---|
| 关系层 | PDSS covenant + 四维保护闸 | persona/instructions 注入（内置） | 谁拍板？AI 偏航谁出声？ |
| **红线层** | `jackyjinggit/agent-handrail`（G1–G6） | persona 内联 G1–G6 + skills/handrail-* 挂载 | 动作前怎么分级？输出怎么脱敏？ |
| **免疫层** | `jackyjinggit/co-agency-integrity`（5 skill） | skills/ 挂载：peer-review（FEE）/ metaphor-audit / governance-precheck | AI 变 yes-man 了吗？隐喻劫持了吗？ |
| 终裁闸 | harness 原生 | plan-mode + ask-user（保留） | 执行前审批 + 决策权归属 |

## 目录结构

```
PDSS  Agent Preset + Bundle/
├── pdss/
│   ├── agent.cordis.yml      # PDSS 治理 preset（covenant + G1-G6 内联 + 免疫层 skill 挂载）
│   └── skills/               # 【部署时 clone 进来】← 两个仓库
│       ├── autoethnography-peer-review/   (co-agency-integrity)
│       ├── metaphor-power-audit/          (co-agency-integrity)
│       ├── governance-precheck/           (co-agency-integrity)
│       ├── handrail-core/                 (agent-handrail)
│       └── handrail-runtime/              (agent-handrail)
├── bundle/
│   ├── package.json          # manifest：dsh.bundle.patch → ./cordis.patch.yml
│   └── cordis.patch.yml      # patch 层：把 pdss/ 注册进 agent-presets roster
└── README.md                 # 本文件
```

## 安装

```bash
# 1. 安装本 bundle
dsh plugin --profile <name> add @pdss/agent-preset-bundle

# 2. 拉两个配套仓库进 skills/（三合一的关键一步）
git clone https://github.com/jackyjinggit/co-agency-integrity  pdss/skills/co-agency-integrity
git clone https://github.com/jackyjinggit/agent-handrail       pdss/skills/agent-handrail
# （然后按 agent.cordis.yml 的 skill-pdss-immune 段把对应 skill 目录就位）

# 3. 新会话在 preset 选择器里选 `pdss`
```

> 或部署侧复制：`cp -r pdss/ <harness>/apps/cli/config/agent-presets/pdss/`（含 skills/）。

## 自我过闸清单（发布前必过）

| # | 检查项 | 状态 |
|---|---|---|
| G1 | `agent.cordis.yml` 为合法 Cordis 组合（行 id 唯一、包名 `@deepseek-ai/dsh-*` 可解析） | ✅ 参照 standard preset 结构 |
| G2 | 服务行均在 `isolate` realm group 内；未发布进 root service realm | ✅（planning/delegation 两组） |
| G3 | 模型路由未进 preset（LlmTarget 仍在 host 平面） | ✅ 未引用 llm 相关行 |
| G4 | 不重写 preset 文件（无 EntryTree.write 风险） | ✅ 纯配置无自处置插件 |
| G5 | 插件均持有自身 registration（不重读全局注册表） | ✅ 仅用 shipped 插件（persona/plan-mode/ask-user 等） |
| G6 | 包名解析：预设内相对路径自带、包名走 host base | ✅ 未引入树外新包 |
| G7 | 底牌封存：无家庭/私人关系/FEE 实证细节外泄 | ✅ 仅协议层文本 |
| G8 | 版本纪律：bundle 1.0.0 + Apache-2.0 声明 | ✅ |

## 待 harness 侧新插件（本包 1.0 不实现，留接口注释）

1. `dsh-tool-fee-guard` —— FEE 运行时守卫（检测复读用户偏好）
2. `dsh-track-peer-audit` —— peer_audit 副轨（append-only 轨迹旁 peer 校验）
3. `dsh-tool-meta-report` —— 元审直报通道

---
*创建：2026-08-20 · v1.0.0 三件套联合首发（covenant preset + agent-handrail G1-G6 + co-agency-integrity 免疫层）· 自我过闸 G1–G8 通过（设计层验证）*
*配套：jackyjinggit/agent-handrail · jackyjinggit/co-agency-integrity（均为本地已有开源仓库）*
