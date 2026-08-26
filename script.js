/* 
   Countdown
    */


function updateCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");
  const noteEl = document.getElementById("countdown-note");

  // Only run on the invitation page
  if (!daysEl) return;

  daysEl.textContent = "0";
  hoursEl.textContent = "0";
  minutesEl.textContent = "0";
  secondsEl.textContent = "0";

  if (noteEl) {
    noteEl.textContent = "A new date will be announced soon.";
  }
}

updateCountdown();




document.querySelectorAll(".photo").forEach((img) => {
  img.addEventListener("error", () => {
    img.classList.add("photo--broken");
  });
});

/* 
   Gentle fade-in for the invitation card
    */
const fadeSections = document.querySelectorAll(".fade-section");

if (fadeSections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeSections.forEach((section) => observer.observe(section));
}

/* 
   Scroll-to-top button — appears once you're near the bottom
    */
const scrollTopBtn = document.getElementById("scroll-top-btn");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 200;
    scrollTopBtn.classList.toggle("hidden", !nearBottom);
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* 
   Confetti burst — plays once when the invitation page opens
    */
if (document.body.dataset.confetti) {
  launchConfetti();
}

function launchConfetti() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const colors = [
    "var(--gold)",
    "var(--gold-soft)",
    "var(--blush)",
    "var(--blush-deep)",
    "var(--cream)",
  ];

  const container = document.createElement("div");
  container.className = "confetti-container";
  document.body.appendChild(container);

  const pieceCount = 45;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    const isStar = Math.random() < 0.35;
    piece.className = isStar
      ? "confetti-piece confetti-star"
      : "confetti-piece confetti-square";
    if (isStar) piece.textContent = "✦";

    const left = Math.random() * 100;
    const duration = 2.5 + Math.random() * 1.5;
    const delay = Math.random() * 0.4;
    const drift = (Math.random() - 0.5) * 160;
    const size = isStar ? 14 + Math.random() * 10 : 6 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotateStart = Math.random() * 360;

    piece.style.left = `${left}%`;
    piece.style.setProperty("--duration", `${duration}s`);
    piece.style.setProperty("--delay", `${delay}s`);
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--rotate-start", `${rotateStart}deg`);
    piece.style.color = color;

    if (isStar) {
      piece.style.fontSize = `${size}px`;
    } else {
      piece.style.background = color;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.4}px`;
    }

    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 4200);
}

/* 
   Baby Shower Announcement
    */

const announcementPopup = document.getElementById("announcement-popup");
const announcementClose = document.getElementById("announcement-close");

if (announcementPopup && announcementClose) {

  announcementClose.addEventListener("click", () => {
    announcementPopup.classList.add("is-hidden");
  });

}
