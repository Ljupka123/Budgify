const toggleBtn = document.querySelector('.toggle-theme');
const body = document.body;
const logos = document.querySelectorAll('.logos');

function updateLogo() {
  const dark = body.classList.contains("dark-theme");

  logos.forEach(logo => {
    logo.src = dark ? "img/logo-dark.svg" : "img/logo-header.svg";
  });
}

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-theme");
}

updateLogo();

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-theme");

  const theme = body.classList.contains("dark-theme") ? "dark" : "light";
  localStorage.setItem("theme", theme);

  updateLogo();
});


const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const authFormContainer = document.getElementById("authFormContainer");
const formTitle = document.getElementById("formTitle");
const closeForm = document.getElementById("closeForm");
const submitBtn = document.getElementById("submitBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const userActions = document.querySelector(".user-actions");

function openForm(type) {
  formTitle.textContent = type;
  authFormContainer.classList.remove("hidden");
}

loginBtn.addEventListener("click", () => openForm("Login"));
signupBtn.addEventListener("click", () => openForm("Signup"));

closeForm.addEventListener("click", () => {
  authFormContainer.classList.add("hidden");
});

authFormContainer.addEventListener("click", e => {
  if (e.target === authFormContainer) {
    authFormContainer.classList.add("hidden");
  }
});

submitBtn.addEventListener("click", () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  userActions.innerHTML = `
  <div class="user-logged-in">
  <img src="img/user.svg" class="user-icon" width="35" height="35">
  <span>John Doe</span>
  <button id="logoutBtn">Logout</button>
  </div>
  `;

  emailInput.value = "";
  passwordInput.value = "";
  authFormContainer.classList.add("hidden");

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {

    userActions.innerHTML = `
      <button class="user" id="loginBtn">
        <img src="img/user.svg" class="user-icon" width="35" height="35">
        <span>Login</span>
      </button>
      <button class="user" id="signupBtn">
        <span>Signup</span>
      </button>
    `;

    document.getElementById("loginBtn")
      .addEventListener("click", () => openForm("Login"));

    document.getElementById("signupBtn")
      .addEventListener("click", () => openForm("Signup"));

  });

});

const burgerBtn = document.querySelector(".burger-btn");
const nav = document.querySelector(".nav");

const overlay = document.createElement("div");
overlay.classList.add("menu-overlay");
document.body.appendChild(overlay);

function toggleMenu() {
  burgerBtn.classList.toggle("active");
  nav.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeMenu() {
  burgerBtn.classList.remove("active");
  nav.classList.remove("active");
  overlay.classList.remove("active");
}

burgerBtn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", closeMenu);

document.querySelectorAll(".nav-item").forEach(link => {
  link.addEventListener("click", closeMenu);
});


const slider = document.querySelector(".testimonial-slider");
const cards = document.querySelectorAll(".testimonial-card");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let index = 0;
const totalCards = cards.length;
const visibleCards = 3;

for (let i = 0; i < visibleCards; i++) {
  slider.appendChild(cards[i].cloneNode(true));
  slider.insertBefore(cards[totalCards - 1 - i].cloneNode(true), slider.firstChild);
}

const cardWidth = cards[0].offsetWidth + 20;
const position = -cardWidth * visibleCards;

slider.style.transform = `translateX(${position}px)`;

function slide() {

  slider.style.transition = "transform 0.5s ease-in-out";
  slider.style.transform = `translateX(${position - index * cardWidth}px)`;

  slider.addEventListener("transitionend", () => {

    if (index >= totalCards) {
      slider.style.transition = "none";
      index = 0;
    }

    if (index < 0) {
      slider.style.transition = "none";
      index = totalCards - 1;
    }

    slider.style.transform = `translateX(${position - index * cardWidth}px)`;

  }, { once: true });

}

nextBtn.addEventListener("click", () => {
  index++;
  slide();
});

prevBtn.addEventListener("click", () => {
  index--;
  slide();
});

setInterval(() => {
  index++;
  slide();
}, 4000);


const counters = document.querySelectorAll(".count");

counters.forEach(counter => {

  const target = +counter.dataset.target;

  const update = () => {

    const count = +counter.innerText;
    const increment = target / 200;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      requestAnimationFrame(update);
    } else {
      counter.innerText = target.toLocaleString();
    }

  };

  const observer = new IntersectionObserver(entries => {

    if (entries[0].isIntersecting) {
      update();
      observer.unobserve(counter);
    }

  }, { threshold: 0.5 });

  observer.observe(counter);

});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const dailyThoughtText = document.querySelector(".daily-thought-container p");
const refreshThoughtBtn = document.querySelector("#refreshImg");

if (refreshThoughtBtn) {

  refreshThoughtBtn.addEventListener("click", async () => {

    dailyThoughtText.textContent = "Loading a new thought...";

    const thought = await getDailyThought();

    dailyThoughtText.textContent = thought;

  });

}

async function getDailyThought() {

  await sleep(600);

  const thoughts = [
    "Small steps today, big freedom tomorrow.",
    "Every dollar saved is a step toward financial freedom.",
    "Budgeting is your superpower.",
    "Invest in yourself first; your future self will thank you.",
    "Money grows when you plan for it.",
    "Track your spending, master your money.",
    "Save a little, gain a lot over time.",
    "Financial discipline creates options.",
    "Wealth is built one habit at a time.",
    "A budget is your roadmap to freedom."
  ];

  return thoughts[Math.floor(Math.random() * thoughts.length)];

}


let fixedExpenses = [];
let variableExpenses = [];

const fixedTableBody = document.querySelector("#fixed-expenses-table tbody");
const variableTableBody = document.querySelector("#variable-expenses-table tbody");

const incomeInput = document.querySelector("#income");
const savingsOutput = document.querySelector("#savings-output");

const pieCanvas = document.getElementById("pie-chart");
const barCanvas = document.getElementById("bar-chart");


fetch("data/table.json")
  .then(res => res.json())
  .then(data => {

    fixedExpenses = data.fixedExpenses || [];
    variableExpenses = data.variableExpenses || [];

    renderTable(fixedTableBody, fixedExpenses);
    renderTable(variableTableBody, variableExpenses);

  });

function addRow(tbody, value = "") {

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>
      <input type="text" value="${value}">
    </td>
    <td class="amount-cell">
      <input type="number" placeholder="0" class="amount-input">
      <img src="img/delete.svg" class="delete-icon" alt="delete">
    </td>
  `;

  tr.querySelector(".delete-icon").addEventListener("click", () => {
    tr.remove();
  });

  tbody.appendChild(tr);

}

function renderTable(tbody, items) {

  tbody.innerHTML = "";

  items.forEach(item => {
    addRow(tbody, item);
  });

}


document.getElementById("add-fixed-expense")
  .addEventListener("click", () => {

    fixedExpenses.push("");
    addRow(fixedTableBody);

  });


document.getElementById("add-variable-expense")
  .addEventListener("click", () => {

    variableExpenses.push("");
    addRow(variableTableBody);

  });


function getTotal(table) {

  return Array.from(table.querySelectorAll("tr"))
    .reduce((sum, row) => {

      const value =
        parseFloat(row.querySelector("td:nth-child(2) input").value) || 0;

      return sum + value;

    }, 0);

}

function calculateSavings() {

  const income = parseFloat(incomeInput.value) || 0;
  const fixed = getTotal(fixedTableBody);
  const variable = getTotal(variableTableBody);

  const savings = income - (fixed + variable);

  const percent = income > 0
    ? Math.round((savings / income) * 100)
    : 0;

  savingsOutput.textContent = `Savings: $${savings} (${percent}%)`;

  return { income, fixed, variable, savings };

}

function updateSummary(totals) {

  const percent = totals.income > 0
    ? Math.round((totals.savings / totals.income) * 100)
    : 0;

  document.getElementById("summary-income").innerHTML =
    `Income: <span style="color: black;">${totals.income}</span>`;

  document.getElementById("summary-fixed").innerHTML =
    `Fixed: <span style="color: black;">$${totals.fixed}</span>`;

  document.getElementById("summary-variable").innerHTML =
    `Variable: <span style="color: black;">${totals.variable}</span>`;

  document.getElementById("summary-savings").innerHTML =
    `Savings: <span style="color: black;">${totals.savings} (${percent}%)</span>`;

}


function updateFinancialReport(totals) {

  const totalExpenses = totals.fixed + totals.variable;

  const percent = totals.income > 0
    ? Math.round((totals.savings / totals.income) * 100)
    : 0;


  document.getElementById("report-income").innerHTML =
    `TOTAL INCOME: <span style="color: black;">${totals.income}</span>`;

  document.getElementById("report-expenses").innerHTML =
    `TOTAL EXPENSES: <span style="color: black;">${totalExpenses}</span>`;

  document.getElementById("report-savings").innerHTML =
    `NET SAVINGS: <span style="color: black;">${totals.savings}</span>`;

  document.getElementById("report-percentage").innerHTML =
    `SAVINGS PERCENTAGE: <span style="color: black;">${percent}%</span>`;

  document.getElementById("report-status").innerHTML =
    totals.savings > 0
      ? `Status: <span style="color: #1A5A6B;">POSITIVE BALANCE ✅</span>`
      : `Status: <span style="color: #FF0000 ">WARNING! NEGATIVE BALANCE ⚠️</span>`;

}


function drawPieChart(fixed, variable) {
  const ctx = pieCanvas.getContext("2d");
  ctx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);

  const total = fixed + variable;
  if (total === 0) return;

  const values = [fixed, variable];
  const colors = ["#A65967", "#1A5A6B"];
  const labels = ["Fixed", "Variable"];

  let startAngle = 0;

 
  values.forEach((val, i) => {
    const slice = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(pieCanvas.width / 2, pieCanvas.height / 2);
    ctx.arc(pieCanvas.width / 2, pieCanvas.height / 2, 100, startAngle, startAngle + slice);
    ctx.fillStyle = colors[i];
    ctx.fill();
    startAngle += slice;
  });

  const boxWidth = 20;
  const padding = 5;
  ctx.font = "16px Arial";
  const textWidths = labels.map(label => ctx.measureText(label).width);
  const legendItems = labels.map((label, i) => boxWidth + padding + textWidths[i]);
  const totalLegendWidth = legendItems.reduce((a, b) => a + b, 0) + (labels.length - 1) * 20;
  let startX = (pieCanvas.width - totalLegendWidth) / 2;
  const legendY = pieCanvas.height - 40;

  labels.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(startX, legendY, boxWidth, boxWidth);

    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(label, startX + boxWidth + padding, legendY + boxWidth - 5);

    startX += legendItems[i] + 20;
  });
}

function drawBarChart(income, fixed, variable, savings) {
  const ctx = barCanvas.getContext("2d");
  ctx.clearRect(0, 0, barCanvas.width, barCanvas.height);

  const data = [income, fixed, variable, savings];
  const labels = ["Income", "Fixed", "Variable", "Savings"];
  const colors = ["#DBBCAD", "#1A5A6B", "#A65967", "#9FB8B1"];
  const max = Math.max(...data, 1);

  const barWidth = 50;
  const barSpacing = 70;

  
  data.forEach((val, i) => {
    const height = (val / max) * 200;
    const x = i * barSpacing + 30;
    const y = 250 - height;

  
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, y, barWidth, height);

   
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], x + barWidth / 2, 270);
  });
}

const navItems = document.querySelectorAll(".nav-item");

const sections = {
  home: document.getElementById("home-section"),
  dashboard: document.getElementById("dashboard-section"),
  overview: document.getElementById("overview-section"),
  summary: document.getElementById("summary-section")
};

navItems.forEach(item => {

  item.addEventListener("click", () => {

    const target =
      item.classList.contains("home-item") ? "home" :
      item.classList.contains("dashboard-item") ? "dashboard" :
      item.classList.contains("overview-item") ? "overview" :
      "summary";

    Object.values(sections).forEach(sec => sec.style.display = "none");

    navItems.forEach(nav => nav.classList.remove("active"));

    sections[target].style.display = "block";
    item.classList.add("active");

    updateAll();

  });

});


incomeInput.addEventListener("input", updateAll);
fixedTableBody.addEventListener("input", updateAll);
variableTableBody.addEventListener("input", updateAll);

function updateAll() {

  const totals = calculateSavings();

  updateSummary(totals);
  updateFinancialReport(totals);

  drawPieChart(totals.fixed, totals.variable);

  drawBarChart(
    totals.income,
    totals.fixed,
    totals.variable,
    totals.savings
  );

}


sections.home.style.display = "block";
sections.dashboard.style.display = "none";
sections.overview.style.display = "none";
sections.summary.style.display = "none";