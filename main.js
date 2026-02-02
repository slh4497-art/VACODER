const candidates = [
  { name: "서호", notes: "오늘의 남친으로 추천합니다." },
  { name: "세영", notes: "오늘의 남친으로 추천합니다." },
  { name: "경찬", notes: "오늘의 남친으로 추천합니다." },
  { name: "정희", notes: "오늘의 남친으로 추천합니다." },
  { name: "지호", notes: "오늘의 남친으로 추천합니다." },
  { name: "인태", notes: "오늘의 남친으로 추천합니다." },
  { name: "석준", notes: "오늘의 남친으로 추천합니다." }
];

const historyLimit = 5;
const history = [];

const recommendBtn = document.getElementById("recommendBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const resetBtn = document.getElementById("resetBtn");
const resultName = document.getElementById("resultName");
const resultDesc = document.getElementById("resultDesc");
const resultChips = document.getElementById("resultChips");
const resultReasons = document.getElementById("resultReasons");
const matchCount = document.getElementById("matchCount");
const historyList = document.getElementById("historyList");
const resultCard = document.getElementById("resultCard");
const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "vacoder-theme";
let isRolling = false;

const updateHistory = (candidate) => {
  if (!candidate) return;
  history.unshift(candidate.name);
  const unique = [...new Set(history)].slice(0, historyLimit);
  history.length = 0;
  history.push(...unique);
  historyList.innerHTML = "";
  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
};

const renderResult = (candidate, count, reasons) => {
  resultName.textContent = candidate.name;
  resultDesc.textContent = candidate.notes;
  resultChips.innerHTML = "";

  resultReasons.innerHTML = "";
  reasons.forEach((reason) => {
    const li = document.createElement("li");
    li.textContent = reason;
    resultReasons.appendChild(li);
  });

  matchCount.textContent = `${count}명 중 선택`;
  updateHistory(candidate);
};

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

const setRollingState = (rolling) => {
  isRolling = rolling;
  resultCard.classList.toggle("rolling", rolling);
  recommendBtn.disabled = rolling;
  surpriseBtn.disabled = rolling;
};

const rollPick = (onDone) => {
  if (isRolling) return;
  setRollingState(true);
  const rollDuration = 1200;
  const intervalMs = 90;
  const start = Date.now();
  const interval = setInterval(() => {
    const pick = pickRandom(candidates);
    resultName.textContent = pick.name;
    resultDesc.textContent = "고르는 중...";
    matchCount.textContent = `${candidates.length}명 중 선택`;
    if (Date.now() - start >= rollDuration) {
      clearInterval(interval);
      setRollingState(false);
      onDone();
    }
  }, intervalMs);
};

const recommend = () => {
  rollPick(() => {
    const picked = pickRandom(candidates);
    renderResult(picked, candidates.length, ["랜덤으로 한 명을 골랐어요."]);
  });
};

const surprise = () => {
  rollPick(() => {
    const picked = pickRandom(candidates);
    renderResult(picked, candidates.length, ["다시 뽑기 완료!"]);
  });
};

const reset = () => {
  matchCount.textContent = "준비 완료";
  resultName.textContent = "버튼을 눌러주세요";
  resultDesc.textContent = "오늘의 남친을 랜덤으로 추천해드려요.";
  resultChips.innerHTML = "";
  resultReasons.innerHTML = "";
};

recommendBtn.addEventListener("click", recommend);
surpriseBtn.addEventListener("click", surprise);
resetBtn.addEventListener("click", reset);

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
};

const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
};

themeToggle.addEventListener("click", () => {
  const next = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

initTheme();
