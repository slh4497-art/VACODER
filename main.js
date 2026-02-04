const MAX_ENTRIES = 50;
const STORAGE_KEY = "selfie-vibe-entries";

const startCamBtn = document.getElementById("startCamBtn");
const stopCamBtn = document.getElementById("stopCamBtn");
const livenessBtn = document.getElementById("livenessBtn");
const captureBtn = document.getElementById("captureBtn");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const submitForm = document.getElementById("submitForm");

const cameraWrap = document.getElementById("cameraWrap");
const livenessStatus = document.getElementById("livenessStatus");
const challengeText = document.getElementById("challengeText");
const livenessHint = document.getElementById("livenessHint");

const scopeSelect = document.getElementById("scopeSelect");
const selfGender = document.getElementById("selfGender");
const targetGender = document.getElementById("targetGender");
const selfContinentWrap = document.getElementById("selfContinentWrap");
const selfCountryWrap = document.getElementById("selfCountryWrap");
const targetContinentWrap = document.getElementById("targetContinentWrap");
const targetCountryWrap = document.getElementById("targetCountryWrap");
const selfContinent = document.getElementById("selfContinent");
const selfCountry = document.getElementById("selfCountry");
const targetContinent = document.getElementById("targetContinent");
const targetCountry = document.getElementById("targetCountry");

const resultCard = document.getElementById("resultCard");
const resultPhoto = document.getElementById("resultPhoto");
const resultMeta = document.getElementById("resultMeta");
const historyList = document.getElementById("historyList");

let stream = null;
let videoEl = null;
let livenessPassed = false;
let captureDataUrl = "";
let captureFeature = null;
let challengeIssuedAt = 0;

const DEFAULT_HINT = "랜덤 동작을 수행하고 3초 내에 인증을 완료하세요.";

const CHALLENGES = [
  "고개를 좌우로 흔들어 주세요",
  "손을 한 번 흔들어 주세요",
  "눈을 빠르게 두 번 깜빡여 주세요",
  "살짝 웃어 주세요"
];

const CONTINENTS = [
  { value: "africa", label: "아프리카" },
  { value: "asia", label: "아시아" },
  { value: "europe", label: "유럽" },
  { value: "north-america", label: "북아메리카" },
  { value: "south-america", label: "남아메리카" },
  { value: "oceania", label: "오세아니아" }
];

const COUNTRIES = [
  { value: "kr", label: "대한민국", continent: "asia" },
  { value: "jp", label: "일본", continent: "asia" },
  { value: "cn", label: "중국", continent: "asia" },
  { value: "sg", label: "싱가포르", continent: "asia" },
  { value: "th", label: "태국", continent: "asia" },
  { value: "vn", label: "베트남", continent: "asia" },
  { value: "ph", label: "필리핀", continent: "asia" },
  { value: "in", label: "인도", continent: "asia" },
  { value: "au", label: "호주", continent: "oceania" },
  { value: "nz", label: "뉴질랜드", continent: "oceania" },
  { value: "us", label: "미국", continent: "north-america" },
  { value: "ca", label: "캐나다", continent: "north-america" },
  { value: "mx", label: "멕시코", continent: "north-america" },
  { value: "br", label: "브라질", continent: "south-america" },
  { value: "ar", label: "아르헨티나", continent: "south-america" },
  { value: "cl", label: "칠레", continent: "south-america" },
  { value: "co", label: "콜롬비아", continent: "south-america" },
  { value: "gb", label: "영국", continent: "europe" },
  { value: "fr", label: "프랑스", continent: "europe" },
  { value: "de", label: "독일", continent: "europe" },
  { value: "it", label: "이탈리아", continent: "europe" },
  { value: "es", label: "스페인", continent: "europe" },
  { value: "nl", label: "네덜란드", continent: "europe" },
  { value: "se", label: "스웨덴", continent: "europe" },
  { value: "za", label: "남아프리카공화국", continent: "africa" },
  { value: "eg", label: "이집트", continent: "africa" },
  { value: "ng", label: "나이지리아", continent: "africa" },
  { value: "ma", label: "모로코", continent: "africa" },
  { value: "ke", label: "케냐", continent: "africa" }
];

const videoCanvas = document.createElement("canvas");
const videoCtx = videoCanvas.getContext("2d", { willReadFrequently: true });

const toTitle = (value) => {
  if (!value) return "-";
  const continent = CONTINENTS.find((item) => item.value === value);
  if (continent) return continent.label;
  const country = COUNTRIES.find((item) => item.value === value);
  if (country) return country.label;
  return value;
};

const populateSelect = (select, items) => {
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });
};

const loadEntries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const setStatus = (text, isError = false) => {
  livenessStatus.textContent = text;
  livenessStatus.style.color = isError ? "#d6426a" : "";
};

const resetChallenge = () => {
  const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  challengeText.textContent = challenge;
  challengeIssuedAt = Date.now();
  livenessPassed = false;
  captureBtn.disabled = true;
  submitBtn.disabled = true;
  livenessHint.textContent = DEFAULT_HINT;
};

const attachVideo = (mediaStream) => {
  if (!videoEl) {
    videoEl = document.createElement("video");
    videoEl.autoplay = true;
    videoEl.playsInline = true;
    videoEl.muted = true;
  }
  videoEl.srcObject = mediaStream;
  cameraWrap.innerHTML = "";
  cameraWrap.appendChild(videoEl);
};

const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    });
    attachVideo(stream);
    startCamBtn.disabled = true;
    stopCamBtn.disabled = false;
    livenessBtn.disabled = false;
    resetChallenge();
    setStatus("웹캠 준비 완료. 랜덤 동작을 수행하고 인증을 눌러주세요.");
  } catch (error) {
    console.error(error);
    setStatus("웹캠 접근이 거부되었습니다.", true);
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  stream = null;
  videoEl = null;
  cameraWrap.innerHTML = `
    <div class="camera-placeholder">
      <p>웹캠 화면</p>
      <small>권한을 허용해주세요.</small>
    </div>
  `;
  startCamBtn.disabled = false;
  stopCamBtn.disabled = true;
  livenessBtn.disabled = true;
  captureBtn.disabled = true;
  submitBtn.disabled = true;
  setStatus("웹캠이 꺼졌습니다.");
};

const calculateFrameDiff = (dataA, dataB, step = 4) => {
  let diffSum = 0;
  let count = 0;
  for (let i = 0; i < dataA.length; i += 4 * step) {
    const dr = Math.abs(dataA[i] - dataB[i]);
    const dg = Math.abs(dataA[i + 1] - dataB[i + 1]);
    const db = Math.abs(dataA[i + 2] - dataB[i + 2]);
    diffSum += dr + dg + db;
    count += 3;
  }
  if (!count) return 0;
  return diffSum / (count * 255);
};

const runLivenessCheck = async () => {
  if (!videoEl) return;
  if (Date.now() - challengeIssuedAt > 8000) {
    setStatus("시간이 초과되었습니다. 새로운 동작으로 다시 시도해주세요.", true);
    resetChallenge();
    return;
  }
  livenessBtn.disabled = true;
  setStatus("움직임을 확인 중입니다...");

  const sampleWidth = 80;
  const sampleHeight = 60;
  videoCanvas.width = sampleWidth;
  videoCanvas.height = sampleHeight;

  const frames = [];
  for (let i = 0; i < 6; i += 1) {
    videoCtx.drawImage(videoEl, 0, 0, sampleWidth, sampleHeight);
    frames.push(videoCtx.getImageData(0, 0, sampleWidth, sampleHeight).data);
    await new Promise((resolve) => setTimeout(resolve, 180));
  }

  let diffTotal = 0;
  for (let i = 1; i < frames.length; i += 1) {
    diffTotal += calculateFrameDiff(frames[i - 1], frames[i]);
  }
  const avgDiff = diffTotal / (frames.length - 1);

  if (avgDiff > 0.06) {
    livenessPassed = true;
    captureBtn.disabled = false;
    setStatus("즉석 촬영 인증 완료! 이제 셀피를 찍어주세요.");
  } else {
    livenessPassed = false;
    setStatus("움직임이 충분하지 않습니다. 다시 시도해주세요.", true);
    resetChallenge();
  }
  livenessBtn.disabled = false;
};

const captureSelfie = () => {
  if (!videoEl) return;
  const size = 256;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  const vWidth = videoEl.videoWidth;
  const vHeight = videoEl.videoHeight;
  const side = Math.min(vWidth, vHeight);
  const sx = (vWidth - side) / 2;
  const sy = (vHeight - side) / 2;
  ctx.drawImage(videoEl, sx, sy, side, side, 0, 0, size, size);
  captureDataUrl = canvas.toDataURL("image/jpeg", 0.86);
  captureFeature = extractFeature(canvas);
  livenessHint.textContent = "셀피가 캡처되었습니다. 제출을 완료해 주세요.";
  submitBtn.disabled = !submitForm.checkValidity();
};

const extractFeature = (sourceCanvas) => {
  const targetSize = 16;
  const temp = document.createElement("canvas");
  const ctx = temp.getContext("2d", { willReadFrequently: true });
  temp.width = targetSize;
  temp.height = targetSize;
  ctx.drawImage(sourceCanvas, 0, 0, targetSize, targetSize);
  const data = ctx.getImageData(0, 0, targetSize, targetSize).data;

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  const grayValues = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sumR += r;
    sumG += g;
    sumB += b;
    const gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    grayValues.push(gray);
  }

  const pixelCount = data.length / 4;
  const meanR = sumR / (pixelCount * 255);
  const meanG = sumG / (pixelCount * 255);
  const meanB = sumB / (pixelCount * 255);
  const vector = [meanR, meanG, meanB, ...grayValues];

  let norm = 0;
  vector.forEach((val) => {
    norm += val * val;
  });
  norm = Math.sqrt(norm) || 1;
  return vector.map((val) => val / norm);
};

const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
  }
  return dot;
};

const passesFilter = (entry, selection) => {
  if (!entry) return false;
  if (selection.targetGender !== "any" && entry.selfGender !== selection.targetGender) {
    return false;
  }
  if (selection.scope === "continent") {
    return entry.selfContinent === selection.targetContinent;
  }
  if (selection.scope === "country") {
    return entry.selfCountry === selection.targetCountry;
  }
  return true;
};

const findBestMatch = (entries, feature, selection, excludeId) => {
  let best = null;
  let bestScore = -1;
  entries.forEach((entry) => {
    if (entry.id === excludeId) return;
    if (!passesFilter(entry, selection)) return;
    const score = cosineSimilarity(feature, entry.feature);
    if (score > bestScore) {
      bestScore = score;
      best = { ...entry, score };
    }
  });
  return best;
};

const updateHistory = (entries) => {
  historyList.innerHTML = "";
  if (!entries.length) {
    historyList.innerHTML = "<div class=\"muted\">저장된 셀피가 없습니다.</div>";
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <img src="${entry.photo}" alt="셀피" />
      <div>${entry.selfGender === "female" ? "여성" : entry.selfGender === "male" ? "남성" : "기타"}</div>
      <div>${toTitle(entry.selfContinent)} ${toTitle(entry.selfCountry)}</div>
    `;
    historyList.appendChild(item);
  });
};

const updateResult = (match) => {
  if (!match) {
    resultCard.querySelector("h3").textContent = "조건에 맞는 셀피가 없습니다";
    resultCard.querySelector("p").textContent = "다른 필터로 다시 시도하거나 더 많은 셀피가 필요합니다.";
    resultPhoto.innerHTML = "<span>결과 사진</span>";
    resultMeta.innerHTML = `
      <div>대상 성별: -</div>
      <div>대상 지역: -</div>
      <div>유사도 점수: -</div>
    `;
    return;
  }
  resultCard.querySelector("h3").textContent = "가장 잘 어울리는 셀피";
  resultCard.querySelector("p").textContent = "현재 저장된 셀피 중 분위기가 가장 비슷한 사진입니다.";
  resultPhoto.innerHTML = `<img src="${match.photo}" alt="매칭 결과" />`;
  const genderLabel = match.selfGender === "female" ? "여성" : match.selfGender === "male" ? "남성" : "기타";
  const locationLabel = `${toTitle(match.selfContinent)} ${toTitle(match.selfCountry)}`.trim();
  resultMeta.innerHTML = `
    <div>대상 성별: ${genderLabel}</div>
    <div>대상 지역: ${locationLabel || "-"}</div>
    <div>유사도 점수: ${(match.score * 100).toFixed(1)}%</div>
  `;
};

const applyScopeRules = () => {
  const scope = scopeSelect.value;
  const isContinent = scope === "continent";
  const isCountry = scope === "country";

  selfContinentWrap.classList.toggle("hidden", !isContinent);
  targetContinentWrap.classList.toggle("hidden", !isContinent);
  selfCountryWrap.classList.toggle("hidden", !isCountry);
  targetCountryWrap.classList.toggle("hidden", !isCountry);

  selfContinent.required = isContinent;
  targetContinent.required = isContinent;
  selfCountry.required = isCountry;
  targetCountry.required = isCountry;
};

const updateSubmitState = () => {
  submitBtn.disabled = !submitForm.checkValidity() || !captureDataUrl || !livenessPassed;
};

const handleSubmit = (event) => {
  event.preventDefault();
  if (!livenessPassed) {
    setStatus("즉석 촬영 인증을 먼저 완료해주세요.", true);
    return;
  }
  if (!captureDataUrl || !captureFeature) {
    setStatus("셀피를 먼저 찍어주세요.", true);
    return;
  }

  const entries = loadEntries();
  const entry = {
    id: `entry-${Date.now()}`,
    photo: captureDataUrl,
    feature: captureFeature,
    selfGender: selfGender.value,
    selfContinent: selfContinent.value || "",
    selfCountry: selfCountry.value || "",
    createdAt: Date.now()
  };

  const updated = [entry, ...entries].slice(0, MAX_ENTRIES);
  saveEntries(updated);
  updateHistory(updated);

  const selection = {
    targetGender: targetGender.value,
    scope: scopeSelect.value,
    targetContinent: targetContinent.value,
    targetCountry: targetCountry.value
  };

  const match = findBestMatch(updated, captureFeature, selection, entry.id);
  updateResult(match);

  livenessPassed = false;
  captureDataUrl = "";
  captureFeature = null;
  submitForm.reset();
  applyScopeRules();
  resetChallenge();
  setStatus("제출 완료! 새로운 셀피를 제출할 수 있습니다.");
};

const handleReset = () => {
  submitForm.reset();
  captureDataUrl = "";
  captureFeature = null;
  livenessPassed = false;
  applyScopeRules();
  resetChallenge();
  updateSubmitState();
};

populateSelect(selfContinent, CONTINENTS);
populateSelect(targetContinent, CONTINENTS);
populateSelect(selfCountry, COUNTRIES);
populateSelect(targetCountry, COUNTRIES);

applyScopeRules();
updateHistory(loadEntries());

startCamBtn.addEventListener("click", startCamera);
stopCamBtn.addEventListener("click", stopCamera);
livenessBtn.addEventListener("click", runLivenessCheck);
captureBtn.addEventListener("click", captureSelfie);
scopeSelect.addEventListener("change", () => {
  applyScopeRules();
  updateSubmitState();
});

[submitForm, selfGender, targetGender, selfContinent, selfCountry, targetContinent, targetCountry].forEach((el) => {
  el.addEventListener("input", updateSubmitState);
});

submitForm.addEventListener("submit", handleSubmit);
resetBtn.addEventListener("click", handleReset);

window.addEventListener("beforeunload", () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
});
