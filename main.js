const menus = [
  {
    name: "Bibimbap",
    cuisine: "Korean",
    price: "mid",
    distance: ["near", "medium"],
    diet: ["vegetarian", "gluten-light", "no-pork", "no-beef"],
    vibe: ["balanced", "cozy"],
    time: "medium",
    notes: "Warm, colorful bowl with a clean finish."
  },
  {
    name: "Kimchi Fried Rice",
    cuisine: "Korean",
    price: "low",
    distance: ["near", "medium"],
    diet: ["no-beef", "no-pork"],
    vibe: ["spicy", "quick"],
    time: "fast",
    notes: "Fast, spicy, and satisfying."
  },
  {
    name: "Bulgogi Bento",
    cuisine: "Korean",
    price: "mid",
    distance: ["medium", "far"],
    diet: ["no-pork"],
    vibe: ["cozy", "shareable"],
    time: "medium",
    notes: "Classic comfort with variety."
  },
  {
    name: "Salmon Poke Bowl",
    cuisine: "Salad/Bowl",
    price: "high",
    distance: ["near", "delivery"],
    diet: ["pescatarian", "gluten-light", "no-pork", "no-beef"],
    vibe: ["light"],
    time: "fast",
    notes: "Fresh, clean, and energizing."
  },
  {
    name: "Chicken Katsu",
    cuisine: "Japanese",
    price: "mid",
    distance: ["medium", "far"],
    diet: ["no-beef", "no-pork"],
    vibe: ["cozy"],
    time: "medium",
    notes: "Crispy with a cozy crunch."
  },
  {
    name: "Udon Soup",
    cuisine: "Noodles",
    price: "mid",
    distance: ["near", "medium"],
    diet: ["no-beef", "no-pork"],
    vibe: ["cozy"],
    time: "medium",
    notes: "Warm, comforting, and slurp-friendly."
  },
  {
    name: "Tempura Soba",
    cuisine: "Noodles",
    price: "mid",
    distance: ["medium", "far"],
    diet: ["pescatarian", "no-pork", "no-beef"],
    vibe: ["cozy"],
    time: "medium",
    notes: "Light noodles with a crispy edge."
  },
  {
    name: "Pho",
    cuisine: "Southeast Asian",
    price: "mid",
    distance: ["medium", "far"],
    diet: ["no-pork"],
    vibe: ["cozy"],
    time: "medium",
    notes: "Aromatic broth for a reset."
  },
  {
    name: "Pad Thai",
    cuisine: "Southeast Asian",
    price: "mid",
    distance: ["medium", "delivery"],
    diet: ["no-beef", "no-pork"],
    vibe: ["shareable"],
    time: "medium",
    notes: "Sweet-savory noodles with crunch."
  },
  {
    name: "Green Curry",
    cuisine: "Southeast Asian",
    price: "high",
    distance: ["delivery", "far"],
    diet: ["gluten-light", "no-beef", "no-pork"],
    vibe: ["spicy"],
    time: "medium",
    notes: "Aromatic and spicy comfort."
  },
  {
    name: "Margherita Slice",
    cuisine: "Western",
    price: "low",
    distance: ["near"],
    diet: ["vegetarian", "no-pork", "no-beef"],
    vibe: ["quick", "shareable"],
    time: "fast",
    notes: "Simple, fast, and crowd friendly."
  },
  {
    name: "Caesar Salad",
    cuisine: "Salad/Bowl",
    price: "mid",
    distance: ["near", "delivery"],
    diet: ["no-pork", "no-beef"],
    vibe: ["light"],
    time: "fast",
    notes: "Light with a creamy crunch."
  },
  {
    name: "Grain + Veg Bowl",
    cuisine: "Salad/Bowl",
    price: "mid",
    distance: ["near", "delivery"],
    diet: ["vegan", "vegetarian", "gluten-light", "dairy-free", "no-pork", "no-beef"],
    vibe: ["light"],
    time: "fast",
    notes: "Plant-forward and steady energy."
  },
  {
    name: "Falafel Wrap",
    cuisine: "Middle Eastern",
    price: "mid",
    distance: ["near", "delivery"],
    diet: ["vegan", "vegetarian", "dairy-free", "no-pork", "no-beef"],
    vibe: ["shareable", "quick"],
    time: "fast",
    notes: "Crispy, herby, and handheld."
  },
  {
    name: "Shawarma Plate",
    cuisine: "Middle Eastern",
    price: "high",
    distance: ["far", "delivery"],
    diet: ["no-pork"],
    vibe: ["cozy"],
    time: "medium",
    notes: "Big flavor and satisfying portions."
  },
  {
    name: "Chicken Burrito Bowl",
    cuisine: "Mexican",
    price: "mid",
    distance: ["near", "delivery"],
    diet: ["no-pork", "no-beef"],
    vibe: ["shareable"],
    time: "fast",
    notes: "Hearty, fast, and customizable."
  },
  {
    name: "Veggie Tacos",
    cuisine: "Mexican",
    price: "mid",
    distance: ["near", "delivery"],
    diet: ["vegetarian", "no-pork", "no-beef"],
    vibe: ["shareable", "light"],
    time: "fast",
    notes: "Bright, citrusy, and light."
  },
  {
    name: "Chana Masala",
    cuisine: "Indian",
    price: "mid",
    distance: ["delivery", "far"],
    diet: ["vegan", "vegetarian", "dairy-free", "no-pork", "no-beef"],
    vibe: ["spicy"],
    time: "medium",
    notes: "Spice-forward and plant-based."
  },
  {
    name: "Butter Chicken",
    cuisine: "Indian",
    price: "high",
    distance: ["delivery", "far"],
    diet: ["no-pork"],
    vibe: ["cozy"],
    time: "medium",
    notes: "Rich, creamy, and indulgent."
  },
  {
    name: "Chinese Dumplings",
    cuisine: "Chinese",
    price: "low",
    distance: ["near", "medium"],
    diet: ["no-beef"],
    vibe: ["shareable"],
    time: "fast",
    notes: "Quick bites with a warm core."
  },
  {
    name: "Mapo Tofu",
    cuisine: "Chinese",
    price: "mid",
    distance: ["medium", "far"],
    diet: ["vegetarian", "no-pork", "no-beef"],
    vibe: ["spicy"],
    time: "medium",
    notes: "Spicy, numbing comfort."
  },
  {
    name: "Turkey Club",
    cuisine: "Sandwich",
    price: "mid",
    distance: ["near"],
    diet: ["no-beef", "no-pork"],
    vibe: ["quick"],
    time: "fast",
    notes: "Classic sandwich energy."
  },
  {
    name: "Egg Salad Sandwich",
    cuisine: "Sandwich",
    price: "low",
    distance: ["near"],
    diet: ["vegetarian", "no-pork", "no-beef"],
    vibe: ["quick"],
    time: "fast",
    notes: "Simple, creamy, and fast."
  },
  {
    name: "Yogurt Parfait",
    cuisine: "Snack",
    price: "low",
    distance: ["near"],
    diet: ["vegetarian", "no-pork", "no-beef"],
    vibe: ["light"],
    time: "fast",
    notes: "Ultra light and refreshing."
  },
  {
    name: "Avocado Toast",
    cuisine: "Snack",
    price: "mid",
    distance: ["near"],
    diet: ["vegetarian", "no-pork", "no-beef"],
    vibe: ["light"],
    time: "fast",
    notes: "Simple and trendy."
  }
];

const historyLimit = 5;
const history = [];

const cuisineSelect = document.getElementById("cuisineSelect");
const dietSelect = document.getElementById("dietSelect");
const budgetSelect = document.getElementById("budgetSelect");
const distanceSelect = document.getElementById("distanceSelect");
const vibeSelect = document.getElementById("vibeSelect");
const timeSelect = document.getElementById("timeSelect");
const recommendBtn = document.getElementById("recommendBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const resetBtn = document.getElementById("resetBtn");
const resultName = document.getElementById("resultName");
const resultDesc = document.getElementById("resultDesc");
const resultChips = document.getElementById("resultChips");
const resultReasons = document.getElementById("resultReasons");
const matchCount = document.getElementById("matchCount");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "vacoder-theme";

const dietMatches = (menu, diet) => {
  if (diet === "any") return true;
  if (diet === "vegetarian") return menu.diet.includes("vegetarian") || menu.diet.includes("vegan");
  if (diet === "vegan") return menu.diet.includes("vegan");
  if (diet === "pescatarian") return menu.diet.includes("pescatarian");
  return menu.diet.includes(diet);
};

const vibeMatches = (menu, vibe) => {
  if (vibe === "any") return true;
  if (vibe === "quick") return menu.vibe.includes("quick") || menu.time === "fast";
  if (vibe === "cozy") return menu.vibe.includes("cozy");
  if (vibe === "spicy") return menu.vibe.includes("spicy");
  if (vibe === "light") return menu.vibe.includes("light");
  if (vibe === "shareable") return menu.vibe.includes("shareable");
  return true;
};

const matchesFilters = (menu, filters) => {
  if (filters.cuisine !== "any" && menu.cuisine !== filters.cuisine) return false;
  if (filters.budget !== "any" && menu.price !== filters.budget) return false;
  if (filters.distance !== "any" && !menu.distance.includes(filters.distance)) return false;
  if (filters.time !== "any" && menu.time !== filters.time) return false;
  if (!dietMatches(menu, filters.diet)) return false;
  if (!vibeMatches(menu, filters.vibe)) return false;
  return true;
};

const buildReasons = (menu, filters) => {
  const reasons = [];
  if (filters.cuisine !== "any") reasons.push(`Cuisine match: ${menu.cuisine}`);
  if (filters.budget !== "any") reasons.push(`Budget fit: ${menu.price}`);
  if (filters.distance !== "any") reasons.push(`Distance fit: ${filters.distance}`);
  if (filters.time !== "any") reasons.push(`Time fit: ${menu.time}`);
  if (filters.vibe !== "any") reasons.push(`Vibe: ${filters.vibe}`);
  if (filters.diet !== "any") reasons.push(`Diet friendly: ${filters.diet}`);
  if (!reasons.length) reasons.push("Balanced pick from the full list.");
  return reasons;
};

const updateHistory = (menu) => {
  if (!menu) return;
  history.unshift(menu.name);
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

const renderResult = (menu, count, reasons) => {
  resultName.textContent = menu.name;
  resultDesc.textContent = menu.notes;
  resultChips.innerHTML = "";

  [menu.cuisine, menu.price, menu.time, ...menu.vibe].forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = tag;
    resultChips.appendChild(chip);
  });

  resultReasons.innerHTML = "";
  reasons.forEach((reason) => {
    const li = document.createElement("li");
    li.textContent = reason;
    resultReasons.appendChild(li);
  });

  matchCount.textContent = `${count} match${count === 1 ? "" : "es"}`;
  updateHistory(menu);
};

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

const getFilters = () => ({
  cuisine: cuisineSelect.value,
  diet: dietSelect.value,
  budget: budgetSelect.value,
  distance: distanceSelect.value,
  vibe: vibeSelect.value,
  time: timeSelect.value
});

const recommend = () => {
  const filters = getFilters();
  const filtered = menus.filter((menu) => matchesFilters(menu, filters));
  const list = filtered.length ? filtered : menus;
  const picked = pickRandom(list);
  const reasons = buildReasons(picked, filters);

  if (!filtered.length) {
    reasons.unshift("No exact matches, so I widened the net.");
  }

  renderResult(picked, list.length, reasons);
};

const surprise = () => {
  const picked = pickRandom(menus);
  renderResult(picked, menus.length, ["Surprise mode engaged. Enjoy the ride."]);
};

const reset = () => {
  cuisineSelect.value = "any";
  dietSelect.value = "any";
  budgetSelect.value = "any";
  distanceSelect.value = "any";
  vibeSelect.value = "any";
  timeSelect.value = "any";
  matchCount.textContent = "Ready";
  resultName.textContent = "Press recommend";
  resultDesc.textContent = "Set a few preferences, or go wild with Surprise me.";
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
