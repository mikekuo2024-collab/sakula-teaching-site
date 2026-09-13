/* =====================================================
   Sakula 教學檔案網站 script.js
   - 教材清單資料直接寫在此檔（避免 file:// 下 fetch JSON 的 CORS 限制）
   - 路徑相對於 site/ 資料夾，指向上層資料夾內的原始檔案
   - 首頁 index.html 只用到頁尾年份與選單
   - food.html / taiwanese.html 依 <body data-course="..."> 顯示該課程的
     教材、模擬測驗清單與資源
   - quiz.html?unit=代號 顯示單一學習單元的模擬測驗（題庫在 quizzes.js）
   - 教材的 quiz 欄位對應 quizzes.js 的單元代號；沒有 quiz 欄位的檔案
     （空白表單、純圖片 PPT、掃描檔）不提供測驗
   ===================================================== */

const BASE = "../";

/* ---------- 教材資料 ---------- */
const materialGroups = [
  {
    course: "food",
    title: "115-1 食在有意思",
    dir: "114-1食在有意思/",
    subgroups: [
      {
        title: "教學計畫與進度",
        files: [
          { name: "114-1 教學計畫－食在有意思", file: "114-1教學計畫-食在有意思.docx", quiz: "food-plan" },
          { name: "114-1 教學計畫－食在有意思 B", file: "114-1教學計畫-食在有意思B.docx .docx", quiz: "food-plan" },
          { name: "2. 食在有意思－教學進度安排（數據解讀台灣飲食現況）", file: "2.食在有意思-教學進度安排.pptx", quiz: "food-trend" }
        ]
      },
      {
        title: "主題 PPT 教材",
        files: [
          { name: "1. 相見歡－小測試（114-1）", file: "1.相見歡-小測試.pptx" },
          { name: "1. 相見歡－小測試（114-2）", file: "114-2-1.相見歡-小測試.pptx" },
          { name: "3. 我的餐盤", file: "3.我的餐盤.pptx" },
          { name: "4. 《珍奶＋楊枝甘露》", file: "4.《珍奶+楊枝甘露》.pptx", quiz: "food-mango" },
          { name: "4. 《開放式三明治》", file: "4.《開放式三明治》.pptx", quiz: "food-sandwich" },
          { name: "5. 《炒泡麵》", file: "5.《炒泡麵》.pptx", quiz: "food-noodle" },
          { name: "6. 《雪Q餅》", file: "6.《雪Q餅》.pptx", quiz: "food-snowq" }
        ]
      },
      {
        title: "學習單",
        files: [
          { name: "114-2 學習單 01 相見歡", file: "114-2『食在有意思』學習單01相見歡_.docx" },
          { name: "114-1 學習單 3 我的餐盤", file: "114-1  _食在有意思_  學習單3.docx" },
          { name: "114-1 學習單 4 高顏值開放式三明治", file: "114-1  _食在有意思_  學習單4高顏值開放式三明治.docx", quiz: "food-sandwich" }
        ]
      }
    ]
  },
  {
    course: "taiwanese",
    title: "閩南語",
    dir: "閩南語/",
    subgroups: [
      {
        title: "高中閩南語 第 1 冊 PPT",
        files: [
          { name: "B1 L1 斑芝花", file: "111上高中閩南語B1L1_20220902_0902114619.pptx", quiz: "tw-b1l1" },
          { name: "B1 L3 種電", file: "111上高中閩南語B1L3_20221025_1025174745.pptx", quiz: "tw-b1l3" },
          { name: "B1 L5 茫茫渺渺的未來", file: "高中閩南語B1L5_20221006_1006171048.pptx", quiz: "tw-b1l5" },
          { name: "B1 語文天地（一）按怎使用教育部辭典", file: "111上高中閩南語B1語文天地(一)_20220817_0901175835.pptx", quiz: "tw-b1wt1" },
          { name: "B1 語文天地（二）輕聲", file: "111上高中閩南語B1語文天地(二)_20221026_1026091011.pptx", quiz: "tw-b1wt2" },
          { name: "B1 附錄（一）（二）古典詩", file: "111上高中閩南語B1附錄(一)(二)__20221020_1020161824.pptx", quiz: "tw-b1app" }
        ]
      },
      {
        title: "整理表與學習單（高中）",
        files: [
          { name: "第 1 冊 語詞整理表", file: "【高中閩南語】第1冊_語詞整理表.docx", quiz: "tw-words1" },
          { name: "第 1 冊 俗諺整理表", file: "【高中閩南語】第1冊_俗諺整理表.docx", quiz: "tw-prov1" },
          { name: "第 2 冊 俗諺整理表", file: "【高中閩南語】第2冊_俗諺整理表.docx", quiz: "tw-prov2" },
          { name: "第 1 冊 學習單（壓縮檔）", file: "【高中閩南語】第1冊學習單.zip" }
        ]
      },
      {
        title: "磐石 115 閩南語 學習單與作業",
        files: [
          { name: "115-1 國七 學習單 第 1 課", file: "磐石115閩南語學習單/115-1國七 閩南語學習單  _第1課  _  _.docx", quiz: "tw-j7l1" },
          { name: "115-1 國八 學習單 第 1 課 泅過日月潭", file: "磐石115閩南語學習單/115-1國八 閩南語學習單  _第1課  泅過日月潭_ _.docx", quiz: "tw-j8l1" },
          { name: "115-1 高一 學習單 第 1 課 白翎鷥之歌", file: "磐石115閩南語學習單/115-1高一 閩南語學習單  _第1課  _   _.docx", quiz: "tw-h1l1" },
          { name: "國七 第 3 課 工作犬 學習單", file: "磐石115閩南語學習單/國七  閩南語 第3課  工作犬  學習單.docx", quiz: "tw-dog" },
          { name: "國七 遊台灣 學習單", file: "磐石115閩南語學習單/國七  閩南語 遊台灣  學習單  _.docx", quiz: "tw-travel" },
          { name: "國八 第 6 課 風聲水影日月潭 學習單", file: "磐石115閩南語學習單/國八  閩南語 第6課 風聲水影日月潭  學習單 _.docx", quiz: "tw-lake" },
          { name: "高一 學習單－講好話 115", file: "磐石115閩南語學習單/高一   閩南語   學習單-講好話    115.docx", quiz: "tw-goodwords" },
          { name: "高一 學習單－講好話 115（答案）", file: "磐石115閩南語學習單/高一   閩南語   學習單-講好話    115 答案.docx", quiz: "tw-goodwords" },
          { name: "114-2 閩 台語吉祥話與俗諺", file: "磐石115閩南語學習單/114-2閩.docx", quiz: "tw-lucky" },
          { name: "114-1 閩南語重補修作業 1", file: "磐石115閩南語學習單/114-1 閩南語重補修作業1.docx" },
          { name: "114-1 閩南語重補修作業 2", file: "磐石115閩南語學習單/114-1 閩南語重補修作業2.docx" }
        ]
      },
      {
        title: "閩南語認證考試 講義與題本",
        files: [
          { name: "閩南語語言能力認證考試簡章（20220330）", file: "閩南語語言能力認證考試簡章(20220330).pdf", quiz: "tw-guide" },
          { name: "01. 教育部臺語認證考試聽寫測驗的鋩角講義", file: "01.教育部臺語認證考試聽寫測驗的鋩角講義.pdf", quiz: "tw-dictation" },
          { name: "01. 臺語認證考試語句書寫文章寫作講義", file: "01.臺語認證考試語句書寫文章寫作講義1111217下晡.pdf", quiz: "tw-writing" },
          { name: "01. 臺語認證考試語句書寫文章寫作講義－上課筆記", file: "01.臺語認證考試語句書寫文章寫作講義1111217下晡上課筆記.pdf", quiz: "tw-writing" },
          { name: "02. 臺語音常用詞辭典推薦用字總檔（111 年）", file: "02.臺語音常用詞辭典推薦用字總檔111年.pdf", quiz: "tw-wordlist" },
          { name: "03. 教育部閩南語常用推薦用字、常用詞佮常用句型", file: "03.教育部閩南語常用推薦用字、常用詞佮常用句型.pdf", quiz: "tw-common" },
          { name: "臺語認證 ABC：口語（曾偉旻）", file: "臺語認證ABC：⼝語-曾偉旻.pdf", quiz: "tw-oralabc" },
          { name: "語法語詞彙模擬試題（蘇彥德）", file: "蘇彥德語法語詞彙-.pdf", quiz: "tw-grammar" },
          { name: "閱讀測驗（夏玉華）", file: "閱讀測驗-夏玉華1110706.pdf", quiz: "tw-reading" },
          { name: "看圖講話和文章朗讀（魏俊陽）", file: "看圖講話和文章朗讀1211.pdf", quiz: "tw-picture" },
          { name: "口語 B 題本（20220328）", file: "口語B題本(20220328).pdf", quiz: "tw-oralB" },
          { name: "口語 C 題本（20220328）", file: "口語C題本(20220328).pdf", quiz: "tw-oralC" },
          { name: "書寫 B 題本（20220328）", file: "書寫B題本(20220328).pdf", quiz: "tw-writeB" },
          { name: "書寫 C 題本（20220328）", file: "書寫C題本(20220328).pdf", quiz: "tw-writeC" },
          { name: "B 試題補充說明（20200325）", file: "B試題補充說明(20200325).pdf", quiz: "tw-bguide" },
          { name: "B 卷範例完整檔（壓縮檔）", file: "B_example_full.zip" },
          { name: "107 閩南語字音字形", file: "107閩南語字音字形.pdf" },
          { name: "108 閩南語字音字形", file: "108閩南語字音字形.pdf" },
          { name: "109 閩南語字音字形", file: "109閩南語字音字形.pdf" }
        ]
      },
      {
        title: "其他參考",
        files: [
          { name: "閩南語現代詩 社會組第二名〈月光情批〉", file: "03_閩南語_閩南語現代詩社會組第二名.pdf", quiz: "tw-poem" },
          { name: "閩南語散文 社會組第一名〈樓頂樓跤〉", file: "12_閩南語_閩南語散文社會組第一名.pdf", quiz: "tw-essay" },
          { name: "臺中市獎勵本土語言認證考試績優教育人員要點及附件", file: "臺中市_勵本土語言認證考試績優教育人員要點及附件(1050712訂定).doc" }
        ]
      }
    ]
  }
];

/* 電子報《閱讀閩客》期數（檔名有規則，以程式產生） */
const newsletterIssues = [];
for (let i = 155; i <= 188; i++) newsletterIssues.push(i);
for (let i = 191; i <= 256; i++) newsletterIssues.push(i);
for (let i = 411; i <= 447; i++) newsletterIssues.push(i);
function newsletterFile(n) {
  // 166 期原檔名多一個空白
  return n === 166 ? "電子報_閱讀閩客166期(閩) .pdf" : `電子報_閱讀閩客${n}期(閩).pdf`;
}

/* ---------- 學習資源連結 ---------- */
const resources = [
  { course: "taiwanese", name: "教育部臺灣台語常用詞辭典", url: "https://sutian.moe.edu.tw/", desc: "查詢閩南語用字、臺羅拼音與例句的官方辭典。" },
  { course: "taiwanese", name: "閩南語語言能力認證考試", url: "https://blgjts.moe.edu.tw/", desc: "教育部認證考試簡章、報名、歷屆試題與成績查詢。" },
  { course: "taiwanese", name: "教育部本土語言資源網", url: "https://mhi.moe.edu.tw/", desc: "本土語言教材、教學資源與各項活動資訊。" },
  { course: "taiwanese", name: "iTaigi 愛台語", url: "https://itaigi.tw/", desc: "由社群共同貢獻的台語詞彙查詢與發音平台。" },
  { course: "food", name: "衛生福利部國民健康署", url: "https://www.hpa.gov.tw/", desc: "「我的餐盤」均衡飲食指南與健康飲食資訊。" },
  { course: "food", name: "勞動部勞動力發展署技能檢定中心", url: "https://www.wdasec.gov.tw/", desc: "中餐烹調、烘焙、中式麵食等技能檢定資訊與試題。" }
];

/* =====================================================
   以下為頁面行為
   ===================================================== */

const CURRENT_COURSE = document.body.dataset.course || "";
const IS_COURSE_PAGE = document.body.dataset.page === "course";

function ext(file) {
  return file.split(".").pop().toLowerCase();
}

function fileLink(dir, file, label) {
  const a = document.createElement("a");
  a.href = BASE + dir + file;
  a.textContent = label;
  a.target = "_blank";
  return a;
}

function quizLink(quizId, label) {
  const a = document.createElement("a");
  a.href = "quiz.html?unit=" + encodeURIComponent(quizId);
  a.className = "quiz-btn";
  a.textContent = label || "模擬測驗";
  return a;
}

/* 依課程整理出「教材 → 測驗」的對照（供 quiz.html 與測驗清單使用） */
function materialsWithQuiz(course) {
  const list = [];
  materialGroups.filter(g => !course || g.course === course).forEach(group => {
    group.subgroups.forEach(sub => {
      sub.files.forEach(f => {
        if (f.quiz) list.push({ course: group.course, dir: group.dir, subgroup: sub.title, ...f });
      });
    });
  });
  return list;
}

/* 教材清單（課程頁） */
function renderMaterials(keyword) {
  const root = document.getElementById("materialList");
  root.innerHTML = "";
  const kw = (keyword || "").trim().toLowerCase();
  let total = 0;

  materialGroups.filter(g => g.course === CURRENT_COURSE).forEach(group => {
    const groupEl = document.createElement("div");
    groupEl.className = "material-group";
    const h3 = document.createElement("h3");
    h3.textContent = group.title;
    groupEl.appendChild(h3);
    let groupCount = 0;

    group.subgroups.forEach(sub => {
      const files = sub.files.filter(f =>
        !kw || f.name.toLowerCase().includes(kw) || f.file.toLowerCase().includes(kw) || sub.title.toLowerCase().includes(kw)
      );
      if (!files.length) return;
      groupCount += files.length;

      const h4 = document.createElement("h4");
      h4.textContent = sub.title;
      groupEl.appendChild(h4);

      const ul = document.createElement("ul");
      ul.className = "file-list";
      files.forEach(f => {
        const li = document.createElement("li");
        const badge = document.createElement("span");
        const e = ext(f.file);
        badge.className = "badge " + e;
        badge.textContent = e.toUpperCase();
        li.appendChild(badge);
        li.appendChild(fileLink(group.dir, f.file, f.name));
        if (f.quiz) {
          li.appendChild(quizLink(f.quiz));
        } else {
          const none = document.createElement("span");
          none.className = "no-quiz";
          none.textContent = "無測驗";
          li.appendChild(none);
        }
        ul.appendChild(li);
      });
      groupEl.appendChild(ul);
    });

    /* 閩南語電子報（獨立收合） */
    if (group.dir === "閩南語/") {
      const issues = newsletterIssues.filter(n => !kw || "電子報 閱讀閩客".includes(kw) || String(n).includes(kw));
      if (issues.length) {
        groupCount += issues.length;
        const details = document.createElement("details");
        details.className = "newsletter";
        const summary = document.createElement("summary");
        summary.textContent = `電子報《閱讀閩客》（共 ${issues.length} 期，不提供測驗）`;
        details.appendChild(summary);
        const grid = document.createElement("div");
        grid.className = "newsletter-grid";
        issues.forEach(n => grid.appendChild(fileLink(group.dir, newsletterFile(n), `${n} 期`)));
        details.appendChild(grid);
        groupEl.appendChild(details);
      }
    }

    if (groupCount) {
      total += groupCount;
      root.appendChild(groupEl);
    }
  });

  if (!total) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "找不到符合的教材。";
    root.appendChild(p);
  }
}

/* 模擬測驗清單（課程頁） */
function renderQuizIndex() {
  const root = document.getElementById("quizIndex");
  if (!root) return;
  root.innerHTML = "";
  const bank = window.QUIZ_BANK || {};
  const seen = new Set();
  const list = materialsWithQuiz(CURRENT_COURSE).filter(m => {
    if (seen.has(m.quiz)) return false;
    seen.add(m.quiz);
    return true;
  });

  list.forEach(m => {
    const unit = bank[m.quiz];
    const card = document.createElement("div");
    card.className = "card quiz-card";
    const h3 = document.createElement("h3");
    h3.textContent = unit ? unit.title : m.name;
    card.appendChild(h3);
    const p = document.createElement("p");
    p.className = "meta";
    p.textContent = (unit ? `${unit.questions.length} 題` : "") + " · 對應教材：" + m.name;
    card.appendChild(p);
    const actions = document.createElement("div");
    actions.className = "quiz-card-actions";
    actions.appendChild(quizLink(m.quiz, "開始測驗 →"));
    actions.appendChild(fileLink(m.dir, m.file, "開啟教材"));
    card.appendChild(actions);
    root.appendChild(card);
  });

  const count = document.getElementById("quizCount");
  if (count) count.textContent = list.length;
}

/* 學習資源（課程頁） */
function renderResources() {
  const root = document.getElementById("resourceList");
  if (!root) return;
  resources.filter(r => r.course === CURRENT_COURSE).forEach(r => {
    const card = document.createElement("div");
    card.className = "card resource";
    const a = document.createElement("a");
    a.href = r.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = r.name;
    const p = document.createElement("p");
    p.textContent = r.desc;
    card.appendChild(a);
    card.appendChild(p);
    root.appendChild(card);
  });
}

/* 初始化 */
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  if (IS_COURSE_PAGE) {
    renderMaterials("");
    renderQuizIndex();
    renderResources();
    document.getElementById("materialSearch").addEventListener("input", e => renderMaterials(e.target.value));
  }

  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
});
