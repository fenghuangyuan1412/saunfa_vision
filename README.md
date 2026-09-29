# Saunfa Vision

仿 [OI-wiki](https://oi-wiki.org) 风格的**开源算法可视化教程站点**。面向 OI / ACM 学习者与算法入门者：每个算法一页，包含文字讲解、伪代码、**可交互的分步可视化演示**（播放 / 暂停 / 单步 / 回退 / 调速）与复杂度分析。

站点是**纯静态**的 HTML / CSS / 原生 JavaScript，没有构建步骤：

- 在线访问：<https://fenghuangyuan1412.github.io/saunfa_vision/>
- 本地使用：下载仓库后直接双击 `index.html` 即可在浏览器中完整运行。

## 算法可视化直达

| 分类 | 算法 | 在线演示 | 仓库源码 |
|---|---|---|---|
| 排序 | 冒泡排序 | <https://fenghuangyuan1412.github.io/saunfa_vision/sorting/bubble-sort.html> | [sorting/bubble-sort.html](sorting/bubble-sort.html) |
| 排序 | 快速排序 | <https://fenghuangyuan1412.github.io/saunfa_vision/sorting/quick-sort.html> | [sorting/quick-sort.html](sorting/quick-sort.html) |
| 排序 | 归并排序 | <https://fenghuangyuan1412.github.io/saunfa_vision/sorting/merge-sort.html> | [sorting/merge-sort.html](sorting/merge-sort.html) |
| 查找 | 二分查找 | <https://fenghuangyuan1412.github.io/saunfa_vision/searching/binary-search.html> | [searching/binary-search.html](searching/binary-search.html) |
| 数据结构 | 栈 | <https://fenghuangyuan1412.github.io/saunfa_vision/data-structure/stack.html> | [data-structure/stack.html](data-structure/stack.html) |
| 数据结构 | 链表 | <https://fenghuangyuan1412.github.io/saunfa_vision/data-structure/linked-list.html> | [data-structure/linked-list.html](data-structure/linked-list.html) |
| 数据结构 | 二叉搜索树 | <https://fenghuangyuan1412.github.io/saunfa_vision/data-structure/bst.html> | [data-structure/bst.html](data-structure/bst.html) |
| 图论 | 广度优先搜索 | <https://fenghuangyuan1412.github.io/saunfa_vision/graph/bfs.html> | [graph/bfs.html](graph/bfs.html) |
| 图论 | 深度优先搜索 | <https://fenghuangyuan1412.github.io/saunfa_vision/graph/dfs.html> | [graph/dfs.html](graph/dfs.html) |

> 提示：GitHub 网页上直接点开 `.html` 源码链接只渲染静态内容、不执行脚本；要看可交互动画请使用上表的「在线演示」链接，或在本地打开文件。

## 目录结构

```
.
├── index.html          # 首页：全部算法卡片导航
├── README.md           # 本文件
├── AGENTS.md           # 站点开发规范（新增算法页必读）
├── assets/
│   ├── style.css       # 全站主题（仿 Material for MkDocs / OI-wiki）
│   ├── nav.js          # 导航目录 NAV + 顶栏/侧栏/翻页条注入
│   └── viz.js          # SV.runner 分步演示播放器
├── sorting/            # 排序算法
├── searching/          # 查找算法
├── data-structure/     # 数据结构
└── graph/              # 图论
```

## 可视化原理

每个演示先把算法执行过程录制成**离散步的完整状态快照数组**（`buildSteps`），再由通用播放器 `SV.runner` 负责播放 / 暂停 / 单步 / 回退 / 调速 / 重置，页面只需提供「把一个快照画到 DOM」的 `render` 函数。这样任何算法都能精确逐帧研究，且天然支持回退。统一的颜色语义（比较=橙、交换=红、焦点=蓝、就位=绿、排除=灰）贯穿全站。

## 如何新增一个算法页

1. 阅读 [AGENTS.md](AGENTS.md)，按页面模板与可视化规范新建 `<分类>/<算法>.html`；
2. 参考示范页 [sorting/bubble-sort.html](sorting/bubble-sort.html)；
3. 在 `assets/nav.js` 的 `NAV` 中注册，并同步本 README 的直达链接表与 `index.html` 卡片；
4. 按 AGENTS.md 末尾的验证清单自查后提交。

## 部署

仓库推送到 GitHub 后，在 **Settings → Pages** 中选择 *Deploy from a branch*，分支 `main`、目录 `/ (root)`，即可得到上表的在线演示地址。无需构建、无依赖。
