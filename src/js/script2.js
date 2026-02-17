const hamburger = document.querySelector('.hamburger button');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Return the dimension of the container element specified by the selector and dimension type (e.g., 'width' or 'height').
function containerDim(selector, dim) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const value = getComputedStyle(el)[dim];
  return parseFloat(value);
}

// Handle click events on elements with the 'close' class to hide their closest close-target.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.close');
  if (!btn) return;
  const target = btn.closest('.close-target');
  if (target) target.style.display = 'none';
});
