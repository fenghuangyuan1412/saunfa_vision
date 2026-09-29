/* Saunfa Vision - 可视化步骤播放器
 * 规范：算法页面先计算出离散的 steps 数组，每个 step 是完整状态快照
 * { msg: "中文步骤说明", ...页面自定义字段 }，由页面提供 render(step, index)
 * 负责画到 DOM。本文件只提供播放/暂停/单步/回退/速度/重置的通用控制。
 *
 * 用法：
 *   var runner = SV.runner({ stepsEl: 控件挂载点, steps: [...] , render: fn });
 *   runner.setSteps(newSteps)  // 重新生成演示后重置
 */
(function () {
  "use strict";
  window.SV = window.SV || {};

  SV.runner = function (cfg) {
    var host = cfg.host; // 控件容器元素
    var steps = cfg.steps || [];
    var render = cfg.render;
    var i = -1;
    var timer = null;
    var playing = false;

    host.innerHTML =
      '<div class="viz-controls">' +
      '<button data-act="reset" title="重置">⟲ 重置</button>' +
      '<button data-act="back" title="上一步">⏮ 上一步</button>' +
      '<button data-act="play" class="primary">▶ 播放</button>' +
      '<button data-act="next" title="下一步">下一步 ⏭</button>' +
      '<label>速度 <input type="range" min="1" max="10" value="6" data-act="speed"></label>' +
      '<span class="viz-step-indicator"></span>' +
      "</div>";

    var btnPlay = host.querySelector('[data-act="play"]');
    var btnNext = host.querySelector('[data-act="next"]');
    var btnBack = host.querySelector('[data-act="back"]');
    var btnReset = host.querySelector('[data-act="reset"]');
    var speedInput = host.querySelector('[data-act="speed"]');
    var indicator = host.querySelector(".viz-step-indicator");

    function delay() { return 720 - Number(speedInput.value) * 62; } // 100~660ms

    function paint() {
      if (i >= 0 && i < steps.length) render(steps[i], i);
      indicator.textContent = "步骤 " + (steps.length ? i + 1 : 0) + " / " + steps.length;
      btnBack.disabled = i <= 0;
      btnNext.disabled = i >= steps.length - 1;
    }

    function showMsg(step) {
      var msgEl = cfg.msgEl;
      if (!msgEl) return;
      if (step && step.msg !== undefined) { msgEl.innerHTML = step.msg; return; }
      if (steps.length && steps[0].msg !== undefined) { msgEl.innerHTML = steps[0].msg; return; }
      msgEl.innerHTML = "点击「播放」或「下一步」开始演示。";
    }

    function stop() {
      playing = false;
      if (timer) { clearTimeout(timer); timer = null; }
      btnPlay.textContent = "▶ 播放";
      btnPlay.classList.add("primary");
    }

    function go(n) {
      i = Math.max(-1, Math.min(steps.length - 1, n));
      if (i >= 0) { paint(); showMsg(steps[i]); }
      else { render(null, -1); showMsg(null); indicator.textContent = "步骤 0 / " + steps.length; btnBack.disabled = true; btnNext.disabled = steps.length === 0; }
      if (i >= steps.length - 1) stop();
    }

    function tick() {
      if (!playing) return;
      if (i >= steps.length - 1) { stop(); return; }
      go(i + 1);
      timer = setTimeout(tick, delay());
    }

    btnPlay.addEventListener("click", function () {
      if (playing) { stop(); return; }
      if (i >= steps.length - 1) go(-1);
      playing = true;
      btnPlay.textContent = "⏸ 暂停";
      timer = setTimeout(tick, 60);
    });
    btnNext.addEventListener("click", function () { stop(); go(i + 1); });
    btnBack.addEventListener("click", function () { stop(); go(i - 1); });
    btnReset.addEventListener("click", function () { stop(); go(-1); });

    go(-1);

    return {
      setSteps: function (next) { stop(); steps = next || []; i = -1; render(null, -1); showMsg(null); indicator.textContent = "步骤 0 / " + steps.length; btnNext.disabled = steps.length === 0; btnBack.disabled = true; },
      go: go
    };
  };

  // 小工具
  SV.randInt = function (lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); };
  SV.randPermutation = function (n, lo, hi) {
    var a = [];
    for (var v = lo; v <= hi; v++) a.push(v);
    for (var j = a.length - 1; j > 0; j--) {
      var k = SV.randInt(0, j);
      var t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return a.slice(0, n);
  };
  SV.esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
})();
