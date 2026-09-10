# PDSS Agent Preset · 治理层预设（v0.2.0）

> 把 PDSS 治理协议层以 **Agent Preset（用户预设）** 形态接入 DeepSeek Harness。
> **装一个目录即用**：preset（治理 persona + G1-G6 红线全文内联）+ 认知免疫技能包（5 个技能随预设一起分发）。
> 不需要 profile patch、不需要 bundle、不需要 `dsh plugin add`、不需要重启。

## 三层架构

| 层 | 来源 | 进 preset 的形态 | 回答什么问题 |
|---|---|---|---|
| 关系层 | PDSS covenant + 四维保护闸 | persona 注入（内置） | 谁拍板？AI 偏航谁出声？ |
| 红线层 | `jackyjinggit/agent-handrail`（G1–G6） | persona 内联 G1–G6（**文本自包含**，不依赖该仓库） | 动作前怎么分级？输出怎么脱敏？ |
| 免疫层 | `jackyjinggit/co-agency-integrity`（5 skill，MIT） | `pdss/skills/` 随预设分发 + 自动挂载 | AI 变 yes-man 了吗？隐喻劫持了吗？ |
| 终裁闸 | harness 原生 | plan-mode + ask-user（保留原生） | 执行前审批 + 决策权归属 |

## 快速开始

安装目标 = **DSH 用户预设根**：`<DSH_HOME 或 ~/.dsh>/.agent-presets/pdss/`
（`DSH_HOME` 为空或未设时用 `~/.dsh`，与 harness 自身的解析口径一致。）

### 方式 A：本仓库自带安装器（跨平台，无依赖）

```bash
git clone https://github.com/jackyjinggit/pdss-agent-preset-bundle
node pdss-agent-preset-bundle/install.mjs            # 已存在时加 --force 替换
node pdss-agent-preset-bundle/install.mjs --dry-run  # 只看会写到哪里
node pdss-agent-preset-bundle/verify.mjs             # 装完自验（见「验收」）
```

### 方式 B：手工复制

```bash
# bash / macOS / Linux
dst="${DSH_HOME:-$HOME/.dsh}/.agent-presets/pdss"
mkdir -p "$(dirname "$dst")" && cp -r pdss "$dst"
```

```powershell
# Windows PowerShell
$root = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME '.dsh' }
$dst  = Join-Path $root '.agent-presets\pdss'
New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
Copy-Item .\pdss -Destination $dst -Recurse -Force
```

### 方式 C：npm（**尚未发布**，发布后可用）

```bash
npx -p pdss-agent-preset-bundle pdss-preset-install
```

## 验收（装完怎么确认它真的生效）

先跑自带自检——它拿 harness **自己的代码**判定，不是念清单：

```bash
node pdss-agent-preset-bundle/verify.mjs           # 验已安装的那一份
node pdss-agent-preset-bundle/verify.mjs --source  # 验仓库里的载荷
```

| # | 检查 | 由谁判定 | 期望 |
|---|---|---|---|
| 1 | 载荷齐备 | 直接看盘 | `agent.cordis.yml` + `preset.yml` + `skills/*/SKILL.md` 共 5 件 |
| 2 | `customSkillDirs` 真解析到**本预设的** `skills/` | 按加载器同式求值（`baseUrl = new URL('.', pathToFileURL(composition)).href`，即 `vendor/include/src/index.ts` 原文；**尾斜杠是承重的**——少了它 `new URL('skills/', …)` 会把预设目录那一段顶掉） | 结果 = `<预设目录>/skills/` 且确实存在 |
| 3 | 名册认它且不判为 broken | 调用已安装的 `discoverPresets(roots, harnessBase)`——选择器读的就是它 | `id=pdss name=PDSS 治理模式 order=90`，且**不带 `broken` 键**（健康行不带该键，带键 = 组合不成立、开不了会话） |

自检**替你确认不了**的那一步，需要真开一次会话：

| # | 检查 | 期望 |
|---|---|---|
| 4 | 预设选择器 | 出现 **「PDSS 治理模式」**（缺 `pdss/preset.yml` 时只会显示裸 id `pdss`） |
| 5 | 技能是否真进模型可见目录 | 选它开一个会话，问一句「列出你可用的技能」→ 必须看到那 5 个治理技能。**技能加载失败是静默的**（目录在不在都不报错），必须实问一次 |
| 6 | 是否抢了别的技能 | 不应抢：`customSkillDirs` 是**追加项**，用户/项目/内置技能根照旧，装前那批技能应一个不少 |

> 预设名册**每次读取都重扫根目录**，装完即时生效，无需重启任何 GUI。
> 但预设的**挂载**只发生在 web / desktop 会话路径：`--profile headless` 的一次性会话不走预设——实测即使把 `agent-presets` 行 insert 进去，会话的模型可见内容与 `standard` 逐字节等价（20 事件 / 61410 字符一致）。别拿 headless 验收。

## 目录结构

```
pdss-agent-preset-bundle/
├── pdss/
│   ├── agent.cordis.yml                 # 组合文件（agent-plane）：治理 persona + G1-G6 + 工具集 + 技能挂载
│   ├── preset.yml                       # 元数据：选择器显示名 / 描述 / 排序
│   └── skills/                          # 随预设分发，路径由 baseUrl 解析（MIT，见 THIRD-PARTY-NOTICES.md）
│       ├── audit-quantification/        # 量化审计（IPOE 逻辑模型 + 0-4 门槛，防系统性超额计入）
│       ├── autoethnography-peer-review/ # 人机共制产出的异质盲评（反谄媚回声 / 自我闭合）
│       ├── council-method/              # 多人/多 agent 议会通用 SOP（含魔鬼代言人义务）
│       ├── governance-precheck/         # 议会前置闸：成员齐备性 + 议题路由
│       ├── metaphor-power-audit/        # 权力隐喻审计（指挥官/父子/师徒式框定）
│       └── LICENSE-co-agency-integrity  # 上述 5 个技能的 MIT 许可全文
├── install.mjs                          # 跨平台安装器（bin: pdss-preset-install）
├── verify.mjs                           # 自检：载荷 / customSkillDirs 求值 / 名册判定（bin: pdss-preset-verify）
├── package.json
├── LICENSE                              # Apache-2.0（本仓库全文）
├── NOTICE
└── THIRD-PARTY-NOTICES.md
```

## 为什么没有 bundle / patch 层（v0.1.0 的做法为什么行不通）

v0.1.0 试图用 `bundle/cordis.patch.yml` 把 `pdss/` 注册进 `agent-presets` 名册。这条路在 DSH 源码层面**三重堵死**，故 v0.2.0 删掉了整个 `bundle/`：

| # | 源码事实 | 后果 |
|---|---|---|
| 1 | 补丁按 **`id`** 匹配条目（`vendor/include/src/index.ts`，补丁语义段）：匹配不上即 `warn('patch: entry %C not found')` 并**跳过** | v0.1.0 补丁的 id 是 `pdss-preset-roster`，真实条目 id 是 **`agent-presets`** → 自始至终是一次**静默空操作** |
| 2 | 匹配上了也是**整体替换**该行的 `config`（同一处 `target[key] = value`，不是深合并；`packages/bundle/base/README.md` 亦逐字写明 "a patch replaces a row's whole `config`"） | `agent-presets` 的 config 含必填项（如 `default`）；只给 `roots` 会把必填项一起抹掉 → boot 直接报错 |
| 3 | `agent-presets` 的 `roots` 还有一道**最终覆盖**（`apps/cli/src/profile-boot.ts`）：先组合 `[bundlePatches, profile.patches, homePatches, overlays]`，**最后**再追加一条 `{id: 'agent-presets', config: {...原有, roots: [出厂预设根]}}`，注释说明这是为了「让永远走不到该补丁的 launcher 也能找到人自己的预设」 | 即使补丁写得完全正确，第三方 `roots` 也会被这条覆盖 → 仍是空操作 |

**正解是 DSH 官方给「人自己写的预设」留的位置**：用户预设根 `${DSH_HOME:-~/.dsh}/.agent-presets/<id>/`。它由 `dsh-agent-presets` 自身追加（`includeUserRoot` 默认 `true`），出厂 `cordis` 预设的 persona 里也把这里写成预设的授权编写位置。所以本包不需要补丁层、不需要 bundle 能力，也不需要把文件塞进 harness 安装目录（塞进去还会被升级覆盖）。

## 技能为什么能跟着预设走

挂载用出厂 `cordis` 预设携带自带技能的**同一写法**：

```yaml
- id: skill-filesystem
  name: '@deepseek-ai/dsh-skill-filesystem'
  config:
    customSkillDirs:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('skills/', baseUrl))"
```

- `baseUrl` 是 harness 为**组合文件所在目录**设定的基准 URL（`Include` 的既定行为，对用户根预设同样成立）→ 预设被复制到哪个根，都能解析到**自己带的** `skills/`；
- `customSkillDirs` 是**追加**项（项目根 → custom → 用户技能根 → bundled），只加不减 → 不会顶掉部署或用户已有的技能根；
- 技能目录的 frontmatter 必须是**合法 YAML**：非法即对严格加载器**完全不可见**，且通常没有报错。本包内 5 个技能均已通过 frontmatter 审计。

## 工具集（与 `standard` 预设等同，不是最小集）

shell（bash/pwsh 按平台二选一）、文件读写与检索、联网检索、技能目录、计划模式、目标、子代理（spawn/fork）+ 工作流 + Ralph、后台任务、上下文压缩。

这是**必需**而非冗余：persona 声明的 G6「事实主张先核验」需要联网工具才可执行；长程任务的「漂移自检」需要压缩能力才可执行——少任何一项，红线就只是文本。
`tool-web` 默认 `fetch: false`（仅搜索，与 standard 口径一致）；需要抓取全文时改 `pdss/agent.cordis.yml` 的该行。

## 可选：接入 agent-handrail 技能

`agent-handrail` 的两个技能（`handrail-core`、`handrail-runtime`）**未随本包分发**，因为该仓库当前：① 没有 LICENSE 文件（无授权即不可再分发）；② 目录名含双引号字符（`"snapshot`），在 Windows 上 `git clone` 会以 `error: invalid path` 失败。

G1–G6 红线**已作为文本内联**在 persona 内，所以本预设不依赖该仓库即可完整工作。若那两个技能就绪，把它按自己的路径加入即可（无需改本包文件）：

```yaml
# pdss/agent.cordis.yml 的 skill-filesystem 行，改成绝对路径列表
    customSkillDirs:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('skills/', baseUrl))"
      - /你的路径/agent-handrail/skills
```

## 待 harness 侧新插件（本包不实现，仅留接口注释）

1. `dsh-tool-fee-guard` —— FEE 运行时守卫（检测「复读用户偏好」的运行时钩子）
2. `dsh-track-peer-audit` —— peer_audit 副轨（append-only 轨迹旁的 peer 校验通道）
3. `dsh-tool-meta-report` —— 元审直报通道（元层结果不经业务缓冲直报用户）

## 卸载

删除那一个目录即可：`.agent-presets/pdss/`（不影响任何其他预设或配置）。

## 许可

本仓库内容以 **Apache-2.0** 分发（`LICENSE`），随附第三方 MIT 组件声明见 `THIRD-PARTY-NOTICES.md`。

---

*创建 2026-08-20 · v1.0.0 三件套首发（covenant preset + agent-handrail G1-G6 + co-agency-integrity 免疫层）*
*v0.2.0 2026-09-10：删除行不通的 bundle/patch 层，改为用户预设根安装；补齐 standard 同级工具集；技能随预设分发（挂载写法修正）；新增 preset.yml / LICENSE / NOTICE / 安装器 / 验收章节*
