const MODEL_KEY = "tm-model-url";

const modelUrlInput = document.getElementById("modelUrlInput");
const loadModelBtn = document.getElementById("loadModelBtn");
const resetModelBtn = document.getElementById("resetModelBtn");
const startCamBtn = document.getElementById("startCamBtn");
const stopCamBtn = document.getElementById("stopCamBtn");
const playBtn = document.getElementById("playBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const statusText = document.getElementById("statusText");
const cameraWrap = document.getElementById("cameraWrap");
const predictionText = document.getElementById("predictionText");
const playerChoice = document.getElementById("playerChoice");
const aiChoice = document.getElementById("aiChoice");
const roundResult = document.getElementById("roundResult");
const playerScore = document.getElementById("playerScore");
const aiScore = document.getElementById("aiScore");
const drawScore = document.getElementById("drawScore");

let model = null;
let webcam = null;
let isCamRunning = false;
let currentPrediction = null;
let animationFrame = null;

const scores = { player: 0, ai: 0, draw: 0 };

const CHOICE_MAP = {
  rock: "바위",
  paper: "보",
  scissors: "가위"
};

const normalizeLabel = (label) => {
  if (!label) return null;
  const text = label.toLowerCase().replace(/\s/g, "");
  if (text.includes("rock") || text.includes("바위")) return "rock";
  if (text.includes("paper") || text.includes("보")) return "paper";
  if (text.includes("scissors") || text.includes("가위")) return "scissors";
  return null;
};

const setStatus = (text, isError = false) => {
  statusText.textContent = text;
  statusText.dataset.error = isError ? "true" : "false";
};

const setPrediction = (label, prob) => {
  if (!label) {
    predictionText.textContent = "현재 인식: -";
    return;
  }
  const percent = prob ? ` (${Math.round(prob * 100)}%)` : "";
  predictionText.textContent = `현재 인식: ${label}${percent}`;
};

const updateScores = () => {
  playerScore.textContent = scores.player;
  aiScore.textContent = scores.ai;
  drawScore.textContent = scores.draw;
};

const updateRoundResult = (title, message) => {
  roundResult.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
};

const sanitizeModelUrl = (url) => {
  if (!url) return "";
  let clean = url.trim();
  if (!clean.endsWith("/")) {
    clean += "/";
  }
  return clean;
};

const loadModel = async () => {
  const url = sanitizeModelUrl(modelUrlInput.value);
  if (!url) {
    setStatus("모델 URL을 입력해주세요.", true);
    return;
  }
  setStatus("모델을 불러오는 중...");
  loadModelBtn.disabled = true;
  try {
    model = await tmImage.load(`${url}model.json`, `${url}metadata.json`);
    localStorage.setItem(MODEL_KEY, url);
    setStatus("모델 연결 완료! 이제 웹캠을 켜세요.");
    startCamBtn.disabled = false;
  } catch (error) {
    setStatus("모델을 불러오지 못했어요. URL을 다시 확인해주세요.", true);
    console.error(error);
  } finally {
    loadModelBtn.disabled = false;
  }
};

const setupWebcam = async () => {
  if (!model) {
    setStatus("모델을 먼저 불러오세요.", true);
    return;
  }
  if (isCamRunning) return;
  setStatus("웹캠을 준비 중...");
  try {
    webcam = new tmImage.Webcam(240, 180, true);
    await webcam.setup();
    await webcam.play();
    isCamRunning = true;
    cameraWrap.innerHTML = "";
    cameraWrap.appendChild(webcam.canvas);
    startCamBtn.disabled = true;
    stopCamBtn.disabled = false;
    playBtn.disabled = false;
    setStatus("웹캠이 켜졌어요. 한 판을 눌러주세요!");
    loop();
  } catch (error) {
    setStatus("웹캠 접근이 거부되었어요.", true);
    console.error(error);
  }
};

const stopWebcam = () => {
  if (!webcam || !isCamRunning) return;
  webcam.stop();
  isCamRunning = false;
  cancelAnimationFrame(animationFrame);
  startCamBtn.disabled = false;
  stopCamBtn.disabled = true;
  playBtn.disabled = true;
  setPrediction(null);
  setStatus("웹캠이 꺼졌어요.");
  cameraWrap.innerHTML = `
    <div class="camera-placeholder">
      <p>웹캠 화면</p>
      <small>권한을 허용해주세요.</small>
    </div>
  `;
};

const loop = async () => {
  if (!isCamRunning) return;
  webcam.update();
  const prediction = await model.predict(webcam.canvas);
  const best = prediction.reduce((acc, cur) => (cur.probability > acc.probability ? cur : acc));
  const normalized = normalizeLabel(best.className);
  currentPrediction = normalized ? { key: normalized, prob: best.probability } : null;
  setPrediction(normalized ? CHOICE_MAP[normalized] : "알 수 없음", best.probability);
  animationFrame = requestAnimationFrame(loop);
};

const pickAiChoice = () => {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * options.length)];
};

const judge = (player, ai) => {
  if (player === ai) return "draw";
  if (
    (player === "rock" && ai === "scissors") ||
    (player === "paper" && ai === "rock") ||
    (player === "scissors" && ai === "paper")
  ) {
    return "player";
  }
  return "ai";
};

const playRound = () => {
  if (!currentPrediction) {
    updateRoundResult("손 모양이 없어요", "카메라에 가위/바위/보를 보여주세요.");
    return;
  }
  const playerPick = currentPrediction.key;
  const aiPick = pickAiChoice();
  const result = judge(playerPick, aiPick);

  playerChoice.textContent = CHOICE_MAP[playerPick];
  aiChoice.textContent = CHOICE_MAP[aiPick];

  if (result === "player") {
    scores.player += 1;
    updateRoundResult("승리!", "AI를 이겼어요 🎉");
  } else if (result === "ai") {
    scores.ai += 1;
    updateRoundResult("패배", "다음 판에 다시 도전! 💪");
  } else {
    scores.draw += 1;
    updateRoundResult("무승부", "다시 한 판 해볼까요?");
  }

  updateScores();
};

const resetScore = () => {
  scores.player = 0;
  scores.ai = 0;
  scores.draw = 0;
  updateScores();
  playerChoice.textContent = "-";
  aiChoice.textContent = "-";
  updateRoundResult("준비 완료", "가위/바위/보를 보여주세요.");
};

const initModelUrl = () => {
  const stored = localStorage.getItem(MODEL_KEY);
  if (stored) {
    modelUrlInput.value = stored;
  }
};

loadModelBtn.addEventListener("click", loadModel);
resetModelBtn.addEventListener("click", () => {
  modelUrlInput.value = "";
  localStorage.removeItem(MODEL_KEY);
  setStatus("URL을 초기화했어요.");
});
startCamBtn.addEventListener("click", setupWebcam);
stopCamBtn.addEventListener("click", stopWebcam);
playBtn.addEventListener("click", playRound);
resetScoreBtn.addEventListener("click", resetScore);

window.addEventListener("beforeunload", () => {
  if (webcam && isCamRunning) {
    webcam.stop();
  }
});

initModelUrl();
updateScores();
resetScore();
