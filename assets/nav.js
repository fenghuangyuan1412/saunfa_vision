/* Saunfa Vision - 全站导航与页面框架注入
 * 用法：页面 <body data-page="sorting/bubble-sort">，并以
 *   <script src="../assets/nav.js" data-base="../"></script>
 * 引入（data-base 为该页面到站点根的相对前缀；根目录页面省略）。
 */
(function () {
  "use strict";

  var REPO_URL = "https://github.com/fenghuang1412/saunfa_vision";

  // 全站唯一导航目录。新增算法页必须在此注册，并同步 README.md 的目录表。
  var NAV = [
    { label: "首页", items: [
      { key: "home", href: "index.html", title: "欢迎来到 Saunfa Vision" }
    ]},
    { label: "排序算法", items: [
      { key: "sorting/bubble-sort", href: "sorting/bubble-sort.html", title: "冒泡排序" },
      { key: "sorting/quick-sort",  href: "sorting/quick-sort.html",  title: "快速排序" },
      { key: "sorting/merge-sort",  href: "sorting/merge-sort.html",  title: "归并排序" }
    ]},
    { label: "查找算法", items: [
      { key: "searching/binary-search", href: "searching/binary-search.html", title: "二分查找" }
    ]},
    { label: "数据结构", items: [
      { key: "data-structure/stack",        href: "data-structure/stack.html",        title: "栈" },
      { key: "data-structure/linked-list",  href: "data-structure/linked-list.html",  title: "链表" },
      { key: "data-structure/bst",          href: "data-structure/bst.html",          title: "二叉搜索树" }
    ]},
    { label: "图论基础", items: [
      { key: "graph/bfs", href: "graph/bfs.html", title: "广度优先搜索" },
      { key: "graph/dfs", href: "graph/dfs.html", title: "深度优先搜索" }
    ]}
  ];

  function findScriptBase() {
    var s = document.currentScript;
    if (s && s.getAttribute("data-base") !== null) return s.getAttribute("data-base");
    if (s) {
      var src = s.getAttribute("src") || "";
      var m = src.match(/^(.*)\/assets\/nav\.js/);
      if (m) return m[1];
    }
    return ".";
  }

  var BASE = findScriptBase();
  function url(href) { return BASE === "." ? href : BASE + "/" + href; }

  var pageKey = document.body.getAttribute("data-page") || "home";

  // 扁平化，用于上一页/下一页
  var FLAT = [];
  NAV.forEach(function (sec) {
    sec.items.forEach(function (it) { FLAT.push({ sec: sec.label, key: it.key, href: it.href, title: it.title }); });
  });

  function renderHeader() {
    var header = document.createElement("header");
    header.className = "sv-header";
    header.innerHTML =
      '<button class="sv-menu-btn" aria-label="菜单">☰</button>' +
      '<a class="sv-title" href="' + url("index.html") + '">Saunfa Vision</a>' +
      '<span class="sv-tagline">算法可视化教程 · 面向 OI/ACM 学习者</span>' +
      '<span class="sv-spacer"></span>' +
      '<a class="sv-repo" href="' + REPO_URL + '" target="_blank" rel="noopener">GitHub</a>';
    document.body.insertBefore(header, document.body.firstChild);
    header.querySelector(".sv-menu-btn").addEventListener("click", function () {
      document.body.classList.toggle("sv-nav-open");
    });
  }

  function renderSidebar() {
    var backdrop = document.createElement("div");
    backdrop.className = "sv-backdrop";
    backdrop.addEventListener("click", function () { document.body.classList.remove("sv-nav-open"); });
    document.body.appendChild(backdrop);

    var nav = document.createElement("nav");
    nav.className = "sv-sidebar";
    var html = "";
    NAV.forEach(function (sec) {
      html += '<div class="sv-nav-section"><span class="sv-nav-label">' + sec.label + "</span>";
      sec.items.forEach(function (it) {
        var cls = it.key === pageKey ? ' class="active"' : "";
        html += "<a" + cls + ' href="' + url(it.href) + '">' + it.title + "</a>";
      });
      html += "</div>";
    });
    nav.innerHTML = html;
    return nav;
  }

  function renderChrome() {
    renderHeader();

    var layout = document.createElement("div");
    layout.className = "sv-layout";
    var sidebar = renderSidebar();
    // 约定：每个页面必须自带 <main class="sv-content">（见 AGENTS.md 模板）
    var content = document.querySelector("main.sv-content");
    if (!content) { return; }
    layout.appendChild(sidebar);
    layout.appendChild(content);
    document.body.appendChild(layout);

    var idx = -1;
    FLAT.forEach(function (it, i) { if (it.key === pageKey) idx = i; });

    // 面包屑
    if (idx > 0) {
      var crumb = document.createElement("div");
      crumb.className = "sv-breadcrumb";
      crumb.innerHTML = '<a href="' + url("index.html") + '">首页</a> / ' + FLAT[idx].sec;
      content.insertBefore(crumb, content.firstChild);
    }

    // 上一页 / 下一页
    if (idx >= 0 && (idx > 0 || idx < FLAT.length - 1)) {
      var fnav = document.createElement("nav");
      fnav.className = "sv-footer-nav";
      var h = "";
      if (idx > 0) {
        var p = FLAT[idx - 1];
        h += '<a class="prev" href="' + url(p.href) + '"><span class="dir">← 上一页：' + p.sec + "</span><br><span class=\"pg\">" + p.title + "</span></a>";
      } else { h += '<span class="placeholder"></span>'; }
      if (idx < FLAT.length - 1) {
        var n = FLAT[idx + 1];
        h += '<a class="next" href="' + url(n.href) + '"><span class="dir">下一页：' + n.sec + " →</span><br><span class=\"pg\">" + n.title + "</span></a>";
      } else { h += '<span class="placeholder"></span>'; }
      fnav.innerHTML = h;
      content.appendChild(fnav);
    }

    var footer = document.createElement("div");
    footer.className = "sv-page-footer";
    footer.innerHTML = "<span>Saunfa Vision · 仿 OI-wiki 风格的静态算法教程</span>" +
      '<span><a href="' + REPO_URL + '" target="_blank" rel="noopener">在 GitHub 上编辑此页</a></span>';
    content.appendChild(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderChrome);
  } else {
    renderChrome();
  }

  window.SV = window.SV || {};
  window.SV.REPO_URL = REPO_URL;
  window.SV.url = url;
})();
