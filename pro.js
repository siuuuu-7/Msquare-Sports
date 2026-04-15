// Smooth reveal animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = "translateY(0)";
      entry.target.style.opacity = "1";
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll("section").forEach(sec => {
  sec.style.opacity = "0";
  sec.style.transform = "translateY(40px)";
  sec.style.transition = "0.6s ease";
  observer.observe(sec);
});

// Dynamic year in footer
const footer = document.querySelector("footer p");
if (footer) {
  footer.innerHTML = `© ${new Date().getFullYear()} MSquare Sports & Men's Wear`;
}
