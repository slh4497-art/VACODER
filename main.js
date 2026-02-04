const MAX_ENTRIES = 100;
const STORAGE_KEY = "selfie-vibe-entries";
const LANGUAGE_KEY = "selfie-vibe-language";

const SUPABASE_URL = "https://aoqnyonbzyxgofwenejj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_J-z4jzkNQePfIY4uUgiZdA_eWrDGtta";
const SUPABASE_BUCKET = "selfies";

const startCamBtn = document.getElementById("startCamBtn");
const stopCamBtn = document.getElementById("stopCamBtn");
const livenessBtn = document.getElementById("livenessBtn");
const captureBtn = document.getElementById("captureBtn");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const submitForm = document.getElementById("submitForm");
const languageSelect = document.getElementById("languageSelect");

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

const supabase = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

let stream = null;
let videoEl = null;
let livenessPassed = false;
let captureDataUrl = "";
let captureFeature = null;
let challengeIssuedAt = 0;
let currentLang = "ko";
let entriesCache = [];
let lastMatch = null;

const I18N = {
  ko: {
    title: "바이브픽",
    eyebrow: "selfie vibe match",
    heroTitle: "바이브픽",
    heroSubtitle: "지금 찍은 셀피로, 분위기 찰떡인 사진만 보여줘요.",
    languageLabel: "언어",
    captureTitle: "즉석 셀피 제출",
    capturePill: "WebCam Only",
    cameraPlaceholder: "웹캠 화면",
    cameraHelp: "권한을 허용해주세요.",
    chipNoUpload: "파일 업로드 금지",
    chipLiveness: "즉석 촬영 확인",
    livenessHint: "랜덤 동작을 수행하고 15초 내에 인증을 완료하세요.",
    startCam: "웹캠 켜기",
    stopCam: "웹캠 끄기",
    livenessBtn: "즉석 촬영 인증",
    captureBtn: "셀피 찍기",
    livenessStatus: "웹캠을 켜면 랜덤 동작이 표시됩니다.",
    selfGender: "내 성별",
    targetGender: "원하는 상대 성별",
    selectPlaceholder: "선택",
    genderFemale: "여성",
    genderMale: "남성",
    genderOther: "기타",
    genderAny: "무관",
    scopeLabel: "찾는 범위",
    scopeGlobal: "전세계",
    scopeContinent: "특정 대륙",
    scopeCountry: "특정 국가",
    selfContinent: "내 소속 대륙",
    selfCountry: "내 소속 국가",
    targetContinent: "찾을 대륙",
    targetCountry: "찾을 국가",
    consentText: "즉석 촬영 및 데이터 처리에 동의합니다.",
    submitBtn: "셀피 제출하기",
    resetBtn: "입력 초기화",
    resultTitle: "어울림 결과",
    resultEmptyTitle: "아직 제출된 셀피가 없어요",
    resultEmptyBody: "즉석 촬영 인증을 완료하고 셀피를 제출해 주세요.",
    resultPhoto: "결과 사진",
    resultMetaGenderLabel: "대상 성별",
    resultMetaLocationLabel: "대상 지역",
    resultMetaScoreLabel: "유사도 점수",
    noteTitle: "알림:",
    noteBody: "국가/대륙은 제출자가 선택한 정보이며, 사진만으로 국가를 판별할 수 없습니다.",
    historyTitle: "저장된 셀피",
    historyHint: "최대 100장까지 저장됩니다.",
    aboutTitle: "서비스 소개",
    aboutPill: "What it does",
    aboutSubtitle: "즉석 셀피로 분위기(톤/스타일) 유사도가 높은 사진 1장을 보여주는 서비스입니다.",
    aboutPoint1: "지금 찍은 셀피만 업로드할 수 있어요(파일 업로드 없음).",
    aboutPoint2: "전 세계 사용자가 올린 셀피 풀에서 가장 비슷한 분위기를 찾습니다.",
    aboutPoint3: "매칭/연결 없이 결과 사진만 보여줍니다.",
    faqTitle: "자주 묻는 질문",
    faq1Title: "어떤 기준으로 어울림을 찾나요?",
    faq1Body: "이미지 톤/색감/분위기 유사도를 기준으로 가장 가까운 사진을 찾아 보여줍니다.",
    faq2Title: "내 사진은 어디에 저장되나요?",
    faq2Body: "업로드된 셀피는 매칭을 위해 저장되며, 요청 시 삭제할 수 있습니다.",
    faq3Title: "매칭/연결 기능이 있나요?",
    faq3Body: "없습니다. 결과 사진만 보여주는 서비스입니다.",
    policyTitle: "이용 안내 및 정책",
    policyPill: "Policy",
    policyPrivacyTitle: "개인정보",
    policyPrivacyBody: "셀피와 선택한 메타데이터(성별/지역)는 매칭을 위해 저장됩니다. 언제든 삭제 요청이 가능합니다.",
    policyContentTitle: "콘텐츠 기준",
    policyContentBody: "불법·폭력·혐오·성인·기만 콘텐츠는 허용되지 않습니다.",
    policyContactTitle: "문의",
    policyContactBody: "문의: slh4497@gmail.com",
    policyLinkPrivacy: "개인정보처리방침",
    policyLinkTerms: "이용약관",
    policyLinkContact: "문의하기",
    footerNote: "프로토타입: 즉석 촬영 확인은 보조 지표이며 완벽한 보장은 아닙니다.",
    statusReady: "웹캠 준비 완료. 랜덤 동작을 수행하고 인증을 눌러주세요.",
    statusDenied: "웹캠 접근이 거부되었습니다.",
    statusStopped: "웹캠이 꺼졌습니다.",
    statusTimeout: "시간이 초과되었습니다. 새로운 동작으로 다시 시도해주세요.",
    statusChecking: "움직임을 확인 중입니다...",
    statusPassed: "즉석 촬영 인증 완료! 이제 셀피를 찍어주세요.",
    statusFailed: "움직임이 충분하지 않습니다. 다시 시도해주세요.",
    statusCaptured: "셀피가 캡처되었습니다. 제출을 완료해 주세요.",
    statusNeedLiveness: "즉석 촬영 인증을 먼저 완료해주세요.",
    statusNeedSelfie: "셀피를 먼저 찍어주세요.",
    statusSubmitted: "제출 완료! 새로운 셀피를 제출할 수 있습니다.",
    statusUploading: "셀피 업로드 중...",
    statusSaving: "데이터 저장 중...",
    statusLoadFailed: "데이터를 불러오지 못했습니다.",
    resultNoMatchTitle: "조건에 맞는 셀피가 없습니다",
    resultNoMatchBody: "다른 필터로 다시 시도하거나 더 많은 셀피가 필요합니다.",
    resultMatchTitle: "가장 잘 어울리는 셀피",
    resultMatchBody: "현재 저장된 셀피 중 분위기가 가장 비슷한 사진입니다.",
    historyEmpty: "저장된 셀피가 없습니다.",
    selfieAlt: "셀피",
    matchAlt: "매칭 결과",
    challenges: [
      "고개를 좌우로 흔들어 주세요",
      "손을 한 번 흔들어 주세요",
      "눈을 빠르게 두 번 깜빡여 주세요",
      "살짝 웃어 주세요"
    ]
  },
  en: {
    title: "VibePick",
    eyebrow: "selfie vibe match",
    heroTitle: "VibePick",
    heroSubtitle: "Snap a selfie now and see the most vibe-matching photo.",
    languageLabel: "Language",
    captureTitle: "Instant Selfie",
    capturePill: "Webcam Only",
    cameraPlaceholder: "Camera preview",
    cameraHelp: "Allow camera permission.",
    chipNoUpload: "No file upload",
    chipLiveness: "Live capture check",
    livenessHint: "Do the random action and finish within 15 seconds.",
    startCam: "Start camera",
    stopCam: "Stop camera",
    livenessBtn: "Live check",
    captureBtn: "Capture selfie",
    livenessStatus: "Start the camera to see a random action.",
    selfGender: "My gender",
    targetGender: "Target gender",
    selectPlaceholder: "Select",
    genderFemale: "Female",
    genderMale: "Male",
    genderOther: "Other",
    genderAny: "Any",
    scopeLabel: "Search range",
    scopeGlobal: "Global",
    scopeContinent: "By continent",
    scopeCountry: "By country",
    selfContinent: "My continent",
    selfCountry: "My country",
    targetContinent: "Target continent",
    targetCountry: "Target country",
    consentText: "I agree to live capture and data processing.",
    submitBtn: "Submit selfie",
    resetBtn: "Reset",
    resultTitle: "Top match",
    resultEmptyTitle: "No selfies yet",
    resultEmptyBody: "Complete the live check and submit your selfie.",
    resultPhoto: "Result photo",
    resultMetaGenderLabel: "Target gender",
    resultMetaLocationLabel: "Target region",
    resultMetaScoreLabel: "Similarity",
    noteTitle: "Note:",
    noteBody: "Country/continent are user-selected. A photo alone can't verify a country.",
    historyTitle: "Saved selfies",
    historyHint: "Up to 100 photos are stored.",
    aboutTitle: "About",
    aboutPill: "What it does",
    aboutSubtitle: "Upload a live selfie and see the single most vibe-matching photo.",
    aboutPoint1: "Only live selfies are allowed (no file uploads).",
    aboutPoint2: "We search the global selfie pool for the closest vibe.",
    aboutPoint3: "No matching or messaging—just a result photo.",
    faqTitle: "FAQ",
    faq1Title: "How do you find the best match?",
    faq1Body: "We compare tone, color, and vibe similarity to find the closest photo.",
    faq2Title: "Where is my photo stored?",
    faq2Body: "Uploaded selfies are stored for matching and can be deleted upon request.",
    faq3Title: "Is there any matching or messaging?",
    faq3Body: "No. We only show a result photo.",
    policyTitle: "Policy & Info",
    policyPill: "Policy",
    policyPrivacyTitle: "Privacy",
    policyPrivacyBody: "Selfies and selected metadata (gender/region) are stored for matching. You may request deletion anytime.",
    policyContentTitle: "Content rules",
    policyContentBody: "Illegal, violent, hateful, adult, or deceptive content is not allowed.",
    policyContactTitle: "Contact",
    policyContactBody: "Contact: slh4497@gmail.com",
    policyLinkPrivacy: "Privacy Policy",
    policyLinkTerms: "Terms of Service",
    policyLinkContact: "Contact",
    footerNote: "Prototype: live check is a supporting signal, not a guarantee.",
    statusReady: "Camera ready. Do the action and tap live check.",
    statusDenied: "Camera permission was denied.",
    statusStopped: "Camera stopped.",
    statusTimeout: "Time expired. Try a new action.",
    statusChecking: "Checking movement...",
    statusPassed: "Live check passed! Now capture your selfie.",
    statusFailed: "Not enough movement. Try again.",
    statusCaptured: "Selfie captured. Please submit.",
    statusNeedLiveness: "Complete live check first.",
    statusNeedSelfie: "Capture a selfie first.",
    statusSubmitted: "Submitted! You can add another selfie.",
    statusUploading: "Uploading selfie...",
    statusSaving: "Saving data...",
    statusLoadFailed: "Failed to load data.",
    resultNoMatchTitle: "No matching selfie",
    resultNoMatchBody: "Try different filters or add more selfies.",
    resultMatchTitle: "Best vibe match",
    resultMatchBody: "Most similar vibe from saved selfies.",
    historyEmpty: "No saved selfies.",
    selfieAlt: "Selfie",
    matchAlt: "Match result",
    challenges: [
      "Turn your head left and right",
      "Wave your hand once",
      "Blink twice quickly",
      "Give a small smile"
    ]
  },
  ja: {
    title: "バイブピック",
    eyebrow: "selfie vibe match",
    heroTitle: "バイブピック",
    heroSubtitle: "今撮ったセルフィーで、いちばん雰囲気が合う写真を見せます。",
    languageLabel: "言語",
    captureTitle: "今撮りセルフィー",
    capturePill: "Webカメラのみ",
    cameraPlaceholder: "カメラ画面",
    cameraHelp: "カメラの許可をしてください。",
    chipNoUpload: "ファイルアップ不可",
    chipLiveness: "即時撮影チェック",
    livenessHint: "ランダム動作を15秒以内に完了してください。",
    startCam: "カメラ起動",
    stopCam: "カメラ停止",
    livenessBtn: "即時チェック",
    captureBtn: "セルフィー撮影",
    livenessStatus: "カメラを起動するとランダム動作が表示されます。",
    selfGender: "自分の性別",
    targetGender: "相手の性別",
    selectPlaceholder: "選択",
    genderFemale: "女性",
    genderMale: "男性",
    genderOther: "その他",
    genderAny: "指定なし",
    scopeLabel: "検索範囲",
    scopeGlobal: "世界",
    scopeContinent: "大陸",
    scopeCountry: "国",
    selfContinent: "自分の大陸",
    selfCountry: "自分の国",
    targetContinent: "対象の大陸",
    targetCountry: "対象の国",
    consentText: "即時撮影とデータ処理に同意します。",
    submitBtn: "送信する",
    resetBtn: "リセット",
    resultTitle: "マッチ結果",
    resultEmptyTitle: "まだセルフィーがありません",
    resultEmptyBody: "即時チェックを完了してセルフィーを送信してください。",
    resultPhoto: "結果写真",
    resultMetaGenderLabel: "対象の性別",
    resultMetaLocationLabel: "対象地域",
    resultMetaScoreLabel: "類似度",
    noteTitle: "注意:",
    noteBody: "国/大陸は自己申告です。写真だけで国を判定できません。",
    historyTitle: "保存済みセルフィー",
    historyHint: "最大100枚まで保存されます。",
    aboutTitle: "サービス紹介",
    aboutPill: "What it does",
    aboutSubtitle: "今撮ったセルフィーから、最も雰囲気が合う写真1枚を表示します。",
    aboutPoint1: "アップロードできるのは今撮ったセルフィーのみです。",
    aboutPoint2: "世界中のセルフィーから雰囲気が近いものを探します。",
    aboutPoint3: "マッチングや連絡はなく、写真のみを表示します。",
    faqTitle: "よくある質問",
    faq1Title: "どのようにマッチしますか？",
    faq1Body: "色味や雰囲気の類似度で最も近い写真を表示します。",
    faq2Title: "写真はどこに保存されますか？",
    faq2Body: "マッチングのために保存され、削除依頼が可能です。",
    faq3Title: "マッチング/連絡機能はありますか？",
    faq3Body: "ありません。結果写真のみ表示します。",
    policyTitle: "利用案内・ポリシー",
    policyPill: "Policy",
    policyPrivacyTitle: "プライバシー",
    policyPrivacyBody: "セルフィーと選択メタデータ(性別/地域)はマッチングのために保存されます。削除依頼が可能です。",
    policyContentTitle: "コンテンツ基準",
    policyContentBody: "違法・暴力・ヘイト・成人・虚偽コンテンツは許可されません。",
    policyContactTitle: "お問い合わせ",
    policyContactBody: "連絡先: slh4497@gmail.com",
    policyLinkPrivacy: "プライバシーポリシー",
    policyLinkTerms: "利用規約",
    policyLinkContact: "お問い合わせ",
    footerNote: "プロトタイプ: 即時チェックは補助指標です。",
    statusReady: "カメラ準備完了。動作してチェックを押してください。",
    statusDenied: "カメラへのアクセスが拒否されました。",
    statusStopped: "カメラを停止しました。",
    statusTimeout: "時間切れです。別の動作で再試行してください。",
    statusChecking: "動きを確認中...",
    statusPassed: "即時チェック完了！セルフィーを撮影してください。",
    statusFailed: "動きが足りません。再試行してください。",
    statusCaptured: "セルフィーを撮影しました。送信してください。",
    statusNeedLiveness: "先に即時チェックを完了してください。",
    statusNeedSelfie: "先にセルフィーを撮影してください。",
    statusSubmitted: "送信完了！次のセルフィーを追加できます。",
    statusUploading: "セルフィーをアップロード中...",
    statusSaving: "データ保存中...",
    statusLoadFailed: "データを取得できませんでした。",
    resultNoMatchTitle: "該当するセルフィーがありません",
    resultNoMatchBody: "条件を変えるか、セルフィーを追加してください。",
    resultMatchTitle: "最も雰囲気が近いセルフィー",
    resultMatchBody: "保存済みの中で最も雰囲気が近い写真です。",
    historyEmpty: "保存済みセルフィーがありません。",
    selfieAlt: "セルフィー",
    matchAlt: "マッチ結果",
    challenges: [
      "顔を左右に動かしてください",
      "手を一回振ってください",
      "素早く二回まばたきしてください",
      "軽く微笑んでください"
    ]
  },
  es: {
    title: "VibePick",
    eyebrow: "selfie vibe match",
    heroTitle: "VibePick",
    heroSubtitle: "Tómate una selfie ahora y mira la foto con mejor vibra.",
    languageLabel: "Idioma",
    captureTitle: "Selfie instantánea",
    capturePill: "Solo cámara",
    cameraPlaceholder: "Vista de cámara",
    cameraHelp: "Permite el acceso a la cámara.",
    chipNoUpload: "Sin subir archivos",
    chipLiveness: "Verificación en vivo",
    livenessHint: "Haz la acción aleatoria y termina en 15 segundos.",
    startCam: "Iniciar cámara",
    stopCam: "Detener cámara",
    livenessBtn: "Verificación",
    captureBtn: "Tomar selfie",
    livenessStatus: "Inicia la cámara para ver una acción aleatoria.",
    selfGender: "Mi género",
    targetGender: "Género objetivo",
    selectPlaceholder: "Seleccionar",
    genderFemale: "Mujer",
    genderMale: "Hombre",
    genderOther: "Otro",
    genderAny: "Cualquiera",
    scopeLabel: "Rango de búsqueda",
    scopeGlobal: "Global",
    scopeContinent: "Por continente",
    scopeCountry: "Por país",
    selfContinent: "Mi continente",
    selfCountry: "Mi país",
    targetContinent: "Continente objetivo",
    targetCountry: "País objetivo",
    consentText: "Acepto la captura en vivo y el procesamiento de datos.",
    submitBtn: "Enviar selfie",
    resetBtn: "Restablecer",
    resultTitle: "Mejor match",
    resultEmptyTitle: "Aún no hay selfies",
    resultEmptyBody: "Completa la verificación y envía tu selfie.",
    resultPhoto: "Foto resultado",
    resultMetaGenderLabel: "Género objetivo",
    resultMetaLocationLabel: "Región objetivo",
    resultMetaScoreLabel: "Similitud",
    noteTitle: "Nota:",
    noteBody: "País/continente son datos elegidos. Una foto no puede verificar un país.",
    historyTitle: "Selfies guardadas",
    historyHint: "Se guardan hasta 100 fotos.",
    aboutTitle: "Acerca de",
    aboutPill: "What it does",
    aboutSubtitle: "Sube una selfie en vivo y verás la foto con vibra más parecida.",
    aboutPoint1: "Solo se permiten selfies en vivo (sin subir archivos).",
    aboutPoint2: "Buscamos en el pool global la vibra más cercana.",
    aboutPoint3: "Sin emparejar ni mensajes: solo la foto resultado.",
    faqTitle: "Preguntas frecuentes",
    faq1Title: "¿Cómo encuentran el mejor match?",
    faq1Body: "Comparamos tono, color y vibra para hallar la foto más cercana.",
    faq2Title: "¿Dónde se guarda mi foto?",
    faq2Body: "Las selfies se guardan para el match y pueden eliminarse a pedido.",
    faq3Title: "¿Hay emparejamiento o mensajes?",
    faq3Body: "No. Solo mostramos la foto resultado.",
    policyTitle: "Política e info",
    policyPill: "Policy",
    policyPrivacyTitle: "Privacidad",
    policyPrivacyBody: "Las selfies y metadatos (género/región) se guardan para el match. Puedes solicitar eliminación.",
    policyContentTitle: "Normas de contenido",
    policyContentBody: "No se permite contenido ilegal, violento, de odio, adulto o engañoso.",
    policyContactTitle: "Contacto",
    policyContactBody: "Contacto: slh4497@gmail.com",
    policyLinkPrivacy: "Política de privacidad",
    policyLinkTerms: "Términos del servicio",
    policyLinkContact: "Contacto",
    footerNote: "Prototipo: la verificación es solo un indicador auxiliar.",
    statusReady: "Cámara lista. Haz la acción y pulsa verificar.",
    statusDenied: "Se denegó el permiso de cámara.",
    statusStopped: "Cámara detenida.",
    statusTimeout: "Se acabó el tiempo. Intenta otra acción.",
    statusChecking: "Comprobando movimiento...",
    statusPassed: "¡Verificación OK! Ahora toma la selfie.",
    statusFailed: "No hay suficiente movimiento. Intenta de nuevo.",
    statusCaptured: "Selfie capturada. Envíala.",
    statusNeedLiveness: "Completa primero la verificación.",
    statusNeedSelfie: "Toma una selfie primero.",
    statusSubmitted: "¡Enviado! Puedes añadir otra selfie.",
    statusUploading: "Subiendo selfie...",
    statusSaving: "Guardando datos...",
    statusLoadFailed: "No se pudieron cargar los datos.",
    resultNoMatchTitle: "No hay coincidencias",
    resultNoMatchBody: "Prueba otros filtros o añade más selfies.",
    resultMatchTitle: "Mejor vibra",
    resultMatchBody: "La foto con vibra más parecida en guardadas.",
    historyEmpty: "No hay selfies guardadas.",
    selfieAlt: "Selfie",
    matchAlt: "Resultado",
    challenges: [
      "Gira la cabeza a izquierda y derecha",
      "Saluda con la mano una vez",
      "Parpadea dos veces rápido",
      "Sonríe un poco"
    ]
  }
};

const REGION_DATA = {
  continents: [
    { value: "africa", labels: { ko: "아프리카", en: "Africa", ja: "アフリカ", es: "África" } },
    { value: "asia", labels: { ko: "아시아", en: "Asia", ja: "アジア", es: "Asia" } },
    { value: "europe", labels: { ko: "유럽", en: "Europe", ja: "ヨーロッパ", es: "Europa" } },
    { value: "north-america", labels: { ko: "북아메리카", en: "North America", ja: "北アメリカ", es: "Norteamérica" } },
    { value: "south-america", labels: { ko: "남아메리카", en: "South America", ja: "南アメリカ", es: "Sudamérica" } },
    { value: "oceania", labels: { ko: "오세아니아", en: "Oceania", ja: "オセアニア", es: "Oceanía" } }
  ],
  countries: [
    { value: "kr", continent: "asia", labels: { ko: "대한민국", en: "South Korea", ja: "韓国", es: "Corea del Sur" } },
    { value: "jp", continent: "asia", labels: { ko: "일본", en: "Japan", ja: "日本", es: "Japón" } },
    { value: "cn", continent: "asia", labels: { ko: "중국", en: "China", ja: "中国", es: "China" } },
    { value: "sg", continent: "asia", labels: { ko: "싱가포르", en: "Singapore", ja: "シンガポール", es: "Singapur" } },
    { value: "th", continent: "asia", labels: { ko: "태국", en: "Thailand", ja: "タイ", es: "Tailandia" } },
    { value: "vn", continent: "asia", labels: { ko: "베트남", en: "Vietnam", ja: "ベトナム", es: "Vietnam" } },
    { value: "ph", continent: "asia", labels: { ko: "필리핀", en: "Philippines", ja: "フィリピン", es: "Filipinas" } },
    { value: "in", continent: "asia", labels: { ko: "인도", en: "India", ja: "インド", es: "India" } },
    { value: "au", continent: "oceania", labels: { ko: "호주", en: "Australia", ja: "オーストラリア", es: "Australia" } },
    { value: "nz", continent: "oceania", labels: { ko: "뉴질랜드", en: "New Zealand", ja: "ニュージーランド", es: "Nueva Zelanda" } },
    { value: "us", continent: "north-america", labels: { ko: "미국", en: "United States", ja: "アメリカ", es: "Estados Unidos" } },
    { value: "ca", continent: "north-america", labels: { ko: "캐나다", en: "Canada", ja: "カナダ", es: "Canadá" } },
    { value: "mx", continent: "north-america", labels: { ko: "멕시코", en: "Mexico", ja: "メキシコ", es: "México" } },
    { value: "br", continent: "south-america", labels: { ko: "브라질", en: "Brazil", ja: "ブラジル", es: "Brasil" } },
    { value: "ar", continent: "south-america", labels: { ko: "아르헨티나", en: "Argentina", ja: "アルゼンチン", es: "Argentina" } },
    { value: "cl", continent: "south-america", labels: { ko: "칠레", en: "Chile", ja: "チリ", es: "Chile" } },
    { value: "co", continent: "south-america", labels: { ko: "콜롬비아", en: "Colombia", ja: "コロンビア", es: "Colombia" } },
    { value: "gb", continent: "europe", labels: { ko: "영국", en: "United Kingdom", ja: "イギリス", es: "Reino Unido" } },
    { value: "fr", continent: "europe", labels: { ko: "프랑스", en: "France", ja: "フランス", es: "Francia" } },
    { value: "de", continent: "europe", labels: { ko: "독일", en: "Germany", ja: "ドイツ", es: "Alemania" } },
    { value: "it", continent: "europe", labels: { ko: "이탈리아", en: "Italy", ja: "イタリア", es: "Italia" } },
    { value: "es", continent: "europe", labels: { ko: "스페인", en: "Spain", ja: "スペイン", es: "España" } },
    { value: "nl", continent: "europe", labels: { ko: "네덜란드", en: "Netherlands", ja: "オランダ", es: "Países Bajos" } },
    { value: "se", continent: "europe", labels: { ko: "스웨덴", en: "Sweden", ja: "スウェーデン", es: "Suecia" } },
    { value: "za", continent: "africa", labels: { ko: "남아프리카공화국", en: "South Africa", ja: "南アフリカ", es: "Sudáfrica" } },
    { value: "eg", continent: "africa", labels: { ko: "이집트", en: "Egypt", ja: "エジプト", es: "Egipto" } },
    { value: "ng", continent: "africa", labels: { ko: "나이지리아", en: "Nigeria", ja: "ナイジェリア", es: "Nigeria" } },
    { value: "ma", continent: "africa", labels: { ko: "모로코", en: "Morocco", ja: "モロッコ", es: "Marruecos" } },
    { value: "ke", continent: "africa", labels: { ko: "케냐", en: "Kenya", ja: "ケニア", es: "Kenia" } }
  ]
};

const videoCanvas = document.createElement("canvas");
const videoCtx = videoCanvas.getContext("2d", { willReadFrequently: true });

const t = (key) => {
  const pack = I18N[currentLang] || I18N.en;
  return pack[key] ?? I18N.en[key] ?? key;
};

const getChallenges = () => {
  const pack = I18N[currentLang] || I18N.en;
  return pack.challenges || I18N.en.challenges;
};

const getRegionLabel = (entry) => {
  if (!entry) return "-";
  const label = entry.labels[currentLang] || entry.labels.en || entry.value;
  return label;
};

const toTitle = (value) => {
  if (!value) return "-";
  const continent = REGION_DATA.continents.find((item) => item.value === value);
  if (continent) return getRegionLabel(continent);
  const country = REGION_DATA.countries.find((item) => item.value === value);
  if (country) return getRegionLabel(country);
  return value;
};

const populateSelect = (select, items) => {
  const placeholder = select.querySelector("option[value='']");
  select.innerHTML = "";
  if (placeholder) {
    select.appendChild(placeholder);
  }
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = getRegionLabel(item);
    select.appendChild(option);
  });
};

const applyTranslations = () => {
  document.documentElement.lang = currentLang;
  document.title = t("title");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  populateSelect(selfContinent, REGION_DATA.continents);
  populateSelect(targetContinent, REGION_DATA.continents);
  populateSelect(selfCountry, REGION_DATA.countries);
  populateSelect(targetCountry, REGION_DATA.countries);

  updateHistory(entriesCache);
  updateResult(lastMatch);
  resetChallenge();
};

const setStatus = (text, isError = false) => {
  livenessStatus.textContent = text;
  livenessStatus.style.color = isError ? "#d6426a" : "";
};

const resetChallenge = () => {
  const challenges = getChallenges();
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  challengeText.textContent = challenge;
  challengeIssuedAt = Date.now();
  livenessPassed = false;
  captureBtn.disabled = true;
  submitBtn.disabled = true;
  livenessHint.textContent = t("livenessHint");
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

const renderCameraPlaceholder = () => {
  cameraWrap.innerHTML = `
    <div class="camera-placeholder">
      <p>${t("cameraPlaceholder")}</p>
      <small>${t("cameraHelp")}</small>
    </div>
  `;
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
    setStatus(t("statusReady"));
  } catch (error) {
    console.error(error);
    setStatus(t("statusDenied"), true);
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  stream = null;
  videoEl = null;
  renderCameraPlaceholder();
  startCamBtn.disabled = false;
  stopCamBtn.disabled = true;
  livenessBtn.disabled = true;
  captureBtn.disabled = true;
  submitBtn.disabled = true;
  setStatus(t("statusStopped"));
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
  if (Date.now() - challengeIssuedAt > 15000) {
    setStatus(t("statusTimeout"), true);
    resetChallenge();
    return;
  }
  livenessBtn.disabled = true;
  setStatus(t("statusChecking"));

  const sampleWidth = 80;
  const sampleHeight = 60;
  videoCanvas.width = sampleWidth;
  videoCanvas.height = sampleHeight;

  const frames = [];
  for (let i = 0; i < 8; i += 1) {
    videoCtx.drawImage(videoEl, 0, 0, sampleWidth, sampleHeight);
    frames.push(videoCtx.getImageData(0, 0, sampleWidth, sampleHeight).data);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  let diffTotal = 0;
  for (let i = 1; i < frames.length; i += 1) {
    diffTotal += calculateFrameDiff(frames[i - 1], frames[i]);
  }
  const avgDiff = diffTotal / (frames.length - 1);

  if (avgDiff > 0.03) {
    livenessPassed = true;
    captureBtn.disabled = false;
    setStatus(t("statusPassed"));
  } else {
    livenessPassed = false;
    setStatus(t("statusFailed"), true);
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
  livenessHint.textContent = t("statusCaptured");
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
  if (selection.targetGender !== "any" && entry.self_gender !== selection.targetGender) {
    return false;
  }
  if (selection.scope === "continent") {
    return entry.self_continent === selection.targetContinent;
  }
  if (selection.scope === "country") {
    return entry.self_country === selection.targetCountry;
  }
  return true;
};

const findBestMatch = (entries, feature, selection, excludeId) => {
  let best = null;
  let bestScore = -1;
  entries.forEach((entry) => {
    if (entry.id === excludeId) return;
    if (!passesFilter(entry, selection)) return;
    const score = cosineSimilarity(feature, entry.embedding);
    if (score > bestScore) {
      bestScore = score;
      best = { ...entry, score };
    }
  });
  return best;
};

const genderLabel = (value) => {
  if (value === "female") return t("genderFemale");
  if (value === "male") return t("genderMale");
  return t("genderOther");
};

const updateHistory = (entries) => {
  historyList.innerHTML = "";
  if (!entries.length) {
    historyList.innerHTML = `<div class="muted">${t("historyEmpty")}</div>`;
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <img src="${entry.image_path}" alt="${t("selfieAlt")}" />
      <div>${genderLabel(entry.self_gender)}</div>
      <div>${toTitle(entry.self_continent)} ${toTitle(entry.self_country)}</div>
    `;
    historyList.appendChild(item);
  });
};

const updateResult = (match) => {
  if (!match) {
    const hasEntries = entriesCache.length > 0;
    resultCard.querySelector("h3").textContent = hasEntries ? t("resultNoMatchTitle") : t("resultEmptyTitle");
    resultCard.querySelector("p").textContent = hasEntries ? t("resultNoMatchBody") : t("resultEmptyBody");
    resultPhoto.innerHTML = `<span>${t("resultPhoto")}</span>`;
    resultMeta.innerHTML = `
      <div>${t("resultMetaGenderLabel")}: -</div>
      <div>${t("resultMetaLocationLabel")}: -</div>
      <div>${t("resultMetaScoreLabel")}: -</div>
    `;
    return;
  }
  resultCard.querySelector("h3").textContent = t("resultMatchTitle");
  resultCard.querySelector("p").textContent = t("resultMatchBody");
  resultPhoto.innerHTML = `<img src="${match.image_path}" alt="${t("matchAlt")}" />`;
  const locationLabel = `${toTitle(match.self_continent)} ${toTitle(match.self_country)}`.trim();
  resultMeta.innerHTML = `
    <div>${t("resultMetaGenderLabel")}: ${genderLabel(match.self_gender)}</div>
    <div>${t("resultMetaLocationLabel")}: ${locationLabel || "-"}</div>
    <div>${t("resultMetaScoreLabel")}: ${(match.score * 100).toFixed(1)}%</div>
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

const dataUrlToBlob = (dataUrl) => {
  const [meta, content] = dataUrl.split(",");
  const mime = meta.match(/:(.*?);/)[1];
  const binary = atob(content);
  const length = binary.length;
  const array = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

const uploadSelfie = async (dataUrl) => {
  if (!supabase) throw new Error("Supabase not available");
  const blob = dataUrlToBlob(dataUrl);
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filename, blob, { contentType: "image/jpeg" });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
};

const fetchEntries = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("selfies")
    .select("id, created_at, image_path, embedding, self_gender, self_continent, self_country")
    .order("created_at", { ascending: false })
    .limit(MAX_ENTRIES);
  if (error) {
    console.error(error);
    setStatus(t("statusLoadFailed"), true);
    return [];
  }
  return data || [];
};

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!livenessPassed) {
    setStatus(t("statusNeedLiveness"), true);
    return;
  }
  if (!captureDataUrl || !captureFeature) {
    setStatus(t("statusNeedSelfie"), true);
    return;
  }
  if (!supabase) {
    setStatus(t("statusLoadFailed"), true);
    return;
  }

  try {
    setStatus(t("statusUploading"));
    const imageUrl = await uploadSelfie(captureDataUrl);

    setStatus(t("statusSaving"));
    const { data: inserted, error } = await supabase
      .from("selfies")
      .insert({
        image_path: imageUrl,
        embedding: captureFeature,
        self_gender: selfGender.value,
        self_continent: selfContinent.value || null,
        self_country: selfCountry.value || null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    entriesCache = await fetchEntries();
    updateHistory(entriesCache);

    const selection = {
      targetGender: targetGender.value,
      scope: scopeSelect.value,
      targetContinent: targetContinent.value,
      targetCountry: targetCountry.value
    };

    lastMatch = findBestMatch(entriesCache, captureFeature, selection, inserted?.id);
    updateResult(lastMatch);

    livenessPassed = false;
    captureDataUrl = "";
    captureFeature = null;
    submitForm.reset();
    applyScopeRules();
    resetChallenge();
    setStatus(t("statusSubmitted"));
  } catch (error) {
    console.error(error);
    setStatus(t("statusLoadFailed"), true);
  }
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

const initLanguage = () => {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved && I18N[saved]) {
    currentLang = saved;
  } else if (languageSelect) {
    const browserLang = navigator.language?.slice(0, 2);
    if (browserLang && I18N[browserLang]) {
      currentLang = browserLang;
    }
  }
  if (languageSelect) {
    languageSelect.value = currentLang;
  }
  applyTranslations();
};

if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    const next = languageSelect.value;
    if (I18N[next]) {
      currentLang = next;
      localStorage.setItem(LANGUAGE_KEY, currentLang);
      applyTranslations();
    }
  });
}

const initData = async () => {
  applyScopeRules();
  initLanguage();
  renderCameraPlaceholder();
  entriesCache = await fetchEntries();
  updateHistory(entriesCache);
  updateResult(lastMatch);
};

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

initData();
