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
