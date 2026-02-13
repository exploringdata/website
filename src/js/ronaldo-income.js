// Helper to set text content
const setVal = (selector, val) => {
  document.querySelectorAll(selector).forEach(el => el.textContent = val);
};

// Calculate factors
const euroToDollar = 1.24;
const incomeRonaldo = 8e7 / euroToDollar;
const gainOrtega = 7e9 / euroToDollar;
const spainAvgWage = 2019 * 12;

const factorAvgWage = Math.floor(incomeRonaldo / spainAvgWage);
const factorOrtega = Math.floor(gainOrtega / incomeRonaldo);
const factorOrtegaAvgWage = factorOrtega * factorAvgWage;

// Fill values
setVal('.answer-avg-wage', factorAvgWage);
setVal('.answer-ortega', factorOrtega);
setVal('.workers-lives', Math.floor(factorAvgWage / 50));
setVal('.ortega-avg-wage', factorOrtegaAvgWage);

// Render icons
const createIcons = (containerId, count, className) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = `icon ${className}`;
    fragment.appendChild(div);
  }

  container.appendChild(fragment);
};

createIcons('avg-wage', factorAvgWage, 'worker');
createIcons('ortega', factorOrtega, 'ronaldo');
