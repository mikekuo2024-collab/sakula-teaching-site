/* =====================================================
   quiz.js — 獨立模擬測驗頁面（quiz.html?unit=單元代號）
   - 題庫來自 quizzes.js（QUIZ_BANK）
   - 對應教材連結來自 script.js（materialsWithQuiz）
   - 每次載入選項順序隨機
   ===================================================== */

(function () {
  const params = new URLSearchParams(location.search);
  const unitId = params.get("unit") || "";
  const bank = window.QUIZ_BANK || {};
  const unit = bank[unitId];

  const titleEl = document.getElementById("quizTitle");
  const metaEl = document.getElementById("quizMeta");
  const navEl = document.getElementById("quizNav");
  const form = document.getElementById("quizForm");
  const resultEl = document.getElementById("quizResult");

  /* 題目狀態：每題保存打亂後的選項順序 */
  let state = [];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function courseName(c) {
    return c === "food" ? "115-1 食在有意思" : c === "taiwanese" ? "閩南語" : "";
  }

  function coursePage(c) {
    return c === "food" ? "food.html" : "taiwanese.html";
  }

  function showError() {
    titleEl.textContent = "找不到測驗";
    document.getElementById("quizIntro").hidden = true;
    document.getElementById("quizActions").hidden = true;
    document.getElementById("quizError").hidden = false;
  }

  function buildHeader() {
    titleEl.textContent = unit.title;
    document.title = unit.title + "｜模擬測驗｜Sakula 教學檔案";
    metaEl.textContent = `${courseName(unit.course)} · 共 ${unit.questions.length} 題`;
    document.getElementById("quizTotal").textContent = unit.questions.length;

    /* 對應教材連結（同一單元可能對應多個檔案） */
    const mats = materialsWithQuiz(unit.course).filter(m => m.quiz === unitId);
    mats.forEach(m => {
      const a = document.createElement("a");
      a.href = BASE + m.dir + m.file;
      a.target = "_blank";
      a.textContent = "開啟教材：" + m.name;
      navEl.appendChild(a);
    });
    const back = document.createElement("a");
    back.href = coursePage(unit.course) + "#quiz";
    back.textContent = "← 回" + courseName(unit.course) + "測驗清單";
    navEl.appendChild(back);
  }

  function renderQuiz() {
    form.innerHTML = "";
    resultEl.hidden = true;
    state = unit.questions.map(q => {
      const order = shuffle(q.options.map((_, i) => i));
      return { q, order };
    });

    state.forEach((item, i) => {
      const box = document.createElement("div");
      box.className = "question";
      box.dataset.index = i;

      const p = document.createElement("p");
      p.textContent = `${i + 1}. ${item.q.q}`;
      box.appendChild(p);

      item.order.forEach((optIdx, j) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + i;
        input.value = optIdx;
        label.appendChild(input);
        label.appendChild(document.createTextNode(`(${"ABCD"[j]}) ${item.q.options[optIdx]}`));
        box.appendChild(label);
      });
      form.appendChild(box);
    });
    window.scrollTo({ top: 0 });
  }

  function gradeQuiz() {
    let score = 0;
    let unanswered = 0;
    state.forEach((item, i) => {
      const box = form.querySelector(`.question[data-index="${i}"]`);
      box.classList.remove("correct", "wrong");
      box.querySelectorAll(".explain").forEach(el => el.remove());
      const chosen = box.querySelector("input:checked");
      if (!chosen) unanswered++;
      const ok = chosen && Number(chosen.value) === item.q.answer;
      if (ok) score++;
      box.classList.add(ok ? "correct" : "wrong");
      const ex = document.createElement("div");
      ex.className = "explain";
      ex.textContent = `正確答案：${item.q.options[item.q.answer]}。${item.q.explain || ""}`;
      box.appendChild(ex);
      box.querySelectorAll("input").forEach(inp => inp.disabled = true);
    });
    const n = state.length;
    const pct = Math.round(score / n * 100);
    resultEl.textContent = `得分：${score} / ${n}（${pct} 分）` + (unanswered ? `，未作答 ${unanswered} 題` : "");
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!unit) { showError(); return; }
    buildHeader();
    renderQuiz();
    document.getElementById("quizSubmit").addEventListener("click", gradeQuiz);
    document.getElementById("quizReset").addEventListener("click", renderQuiz);
  });
})();
