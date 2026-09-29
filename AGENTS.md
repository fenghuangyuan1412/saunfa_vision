# AGENTS.md — Saunfa Vision 网站开发规范

本文件是维护本站点（包括 AI 代理）必须遵守的规范。新增或修改页面前请先读完本文件，并参考示范页 `sorting/bubble-sort.html`。

## 项目定位

Saunfa Vision 是一个**仿 OI-wiki 风格**的静态算法讲解网站，面向 OI/ACM 学习者与算法入门者。每个算法一页，包含：文字讲解 + 伪代码 + **可交互的分步可视化演示** + 复杂度分析。

## 硬性技术约束

1. **纯静态**：只有 HTML / CSS / 原生 JavaScript。**禁止**引入构建工具、npm 依赖、外部 CDN、框架、字体下载。
2. **file:// 直开**：站点必须在不经服务器的情况下双击 `index.html` 就能完整工作。因此：
   - 页面内所有资源引用一律使用**相对路径**；
   - 位于分类目录下的页面（如 `sorting/xxx.html`）引用根资源时写 `../assets/...`，且注入 nav.js 时必须带 `data-base="../"`：
     `<script src="../assets/nav.js" data-base="../"></script>`。
3. **GitHub Pages 兼容**：仓库推上去后开启 Pages（根目录）即可直接访问，无需任何构建配置。
4. 中文内容；代码标识符、文件名用英文。语言风格：简洁的说明文，避免口语化。

## 目录结构

```
/ (站点根)
├── index.html                 # 首页（算法卡片导航）
├── README.md                  # 仓库说明 + 可视化页面直达链接表（必须与 NAV 同步）
├── AGENTS.md                  # 本规范
├── assets/
│   ├── style.css              # 全站主题（仿 Material for MkDocs / OI-wiki）
│   ├── nav.js                 # 导航数据 NAV + 页面框架注入（顶栏/侧栏/翻页条）
│   └── viz.js                 # SV.runner 步骤播放器 + 小工具
├── sorting/                   # 排序算法
├── searching/                 # 查找算法
├── data-structure/            # 数据结构
└── graph/                     # 图论
```

新增分类：新建小写连字符英文目录，并在 `assets/nav.js` 的 `NAV` 中加一节。

## 页面模板（必须严格遵守）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{页面标题} - Saunfa Vision</title>
<link rel="stylesheet" href="../assets/style.css">
</head>
<body data-page="{与 NAV 中 key 一致，如 sorting/quick-sort}">
<main class="sv-content">
  <h1>{页面标题}</h1>
  <p>一段导语…</p>
  <h2>算法原理</h2>   <!-- 正文 + <pre><code> 伪代码，可配 admonition -->
  <h2>可视化演示</h2>  <!-- 见下节规范 -->
  <h2>复杂度分析</h2>  <!-- 必须有 <table>：最优/平均/最坏时间、空间、稳定性等 -->
  <h2>应用与局限</h2>
  <div class="admonition info">
    <div class="admonition-title">参考</div> …
  </div>
</main>
<script src="../assets/nav.js" data-base="../"></script>
<script src="../assets/viz.js"></script>
<script>
(function () { /* 演示逻辑 */ })();
</script>
</body>
</html>
```

- 顶栏、侧栏、面包屑、上一页/下一页、页脚由 `nav.js` 自动注入，页面**不要**自己写这些。
- `nav.js` 必须先于 `viz.js` 与页内脚本加载，都放在 `</main>` 之后、body 末尾。
- `<h2>` 顺序与标题措辞保持一致：算法原理 / 可视化演示 / 复杂度分析 / 应用与局限 / 参考(admonition)。

## 可视化演示规范

### 结构

```html
<div class="viz-panel">
  <div class="viz-stage"><!-- 画布 DOM（条形/单元格/SVG/网格等） --></div>
  <div class="viz-msg" id="msg"></div>          <!-- 步骤中文说明，runner 自动写入 -->
  <div class="viz-legend">                       <!-- 图例，配色必须用下述语义色 -->
    <span class="chip"><span class="sw" style="background:var(--viz-xxx)"></span>语义名</span>
  </div>
  <div id="runner"></div>                        <!-- SV.runner 挂载点 -->
  <div class="viz-controls"><!-- 页面自定义按钮，如「随机新数组」 --></div>
</div>
```

### SV.runner API（assets/viz.js）

```js
var runner = SV.runner({
  host:   document.getElementById("runner"), // 控件挂载点
  msgEl:  document.getElementById("msg"),    // 说明行元素
  steps:  stepsArray,                        // 预计算的步骤数组
  render: draw                               // function draw(step, idx)
});
runner.setSteps(newSteps); // 重新生成演示（自定义按钮里调用，之后手动 draw(null)）
```

- **steps 是预计算的离散数组**：每个 step 是一个**完整状态快照**对象，至少含 `msg`（中文一句话说明，允许 HTML，播放器会自动填入 `#msg`）。回退/跳转因此天然支持，禁止依赖增量 diff。
- **`render(step, idx)` 约定**：`step === null` 表示重置，必须画「无高亮基态」（通常即 `steps[0]` 的数据）。播放器提供：重置 / 上一步 / 播放暂停 / 下一步 / 速度滑块 / 步骤计数，页面不要自造这些控件。
- 数据重生成函数放页面内（如「随机新数组」按钮 → `buildSteps()` → `runner.setSteps()`）。
- 小工具：`SV.randInt(lo, hi)`、`SV.randPermutation(n, lo, hi)`（无重复随机数组）、`SV.esc(str)`。

### 颜色语义（CSS 变量，必须按含义使用）

| 变量 | 色值 | 语义 |
|---|---|---|
| `--viz-default` | `#c5cae9` | 未参与/未排序 |
| `--viz-comparing` | `#ff9800` 橙 | 正在比较/访问中 |
| `--viz-swapping` | `#ef5350` 红 | 正在交换/冲突/删除 |
| `--viz-active` | `#4051b5` 蓝 | 当前指针/枢轴/栈顶等操作焦点 |
| `--viz-done` | `#43a047` 绿 | 已就位/命中/成功 |
| `--viz-eliminated` | `#cfd8dc` 灰 | 已排除/不可达/弹出销毁 |

现成元素类：条形图 `.bar` + 状态类 `.comparing .swapping .done .active`（内含 `.bar-val` 数值、`.bar-idx` 下标）；数组单元 `.cell` + `.comparing .active .done .eliminated`（内含 `.idx` 下标、`.ptr` 顶部指针标注）。自定义绘制（树、网格、链表）也应复用这些颜色变量。

### 质量要求

- 每个演示必须能完整跑通一遍算法流程，最后一步给出结果确认。
- 步骤文案具体（带下标/数值），不要「进行中…」这种空话。
- 数据规模控制在一屏能看清：数组类 10~16 个元素；网格 ≤ 10×10；树/图节点 ≤ 12。
- 页面加载即渲染基态，不允许空白画布。

## 其他约定

- 伪代码块用 `<pre><code>`，HTML 中 `>` `<` 需转义为 `&gt;` `&lt;`。
- 提示框类：`admonition` + `note|info|tip|warning|danger|example`，内部第一个子元素为 `<div class="admonition-title">标题</div>`。
- 复杂度表至少包含：最优/平均/最坏时间复杂度、空间复杂度、稳定性（不适用可省）。
- 新增页面必须同步三处：`assets/nav.js` 的 `NAV`、`README.md` 的直达链接表、（如合适）`index.html` 卡片。

## 验证清单（提交前逐项检查）

1. 双击用浏览器打开新页面：顶栏/侧栏/翻页条正常，侧栏高亮正确。
2. 控制台无报错；播放/暂停/单步/回退/速度/重置全部可用。
3. 从 `index.html` 与相邻页翻页链接可达该页（路径拼写正确）。
4. 所有 `<h2>` 段落齐全，复杂度表存在。
