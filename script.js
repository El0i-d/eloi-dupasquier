/* =========================================================
   Eloi Dupasquier — interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- Année dans le footer -------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------- Menu mobile -------- */
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
    };
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    // Ferme le menu après un clic sur un lien
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    // Ferme avec Échap
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* -------- Reveals au scroll -------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* -------- Formulaire de contact (sans back-end) --------
     Ouvre le client mail avec le message pré-rempli.
     Pour recevoir les messages directement (sans client mail),
     crée un formulaire sur https://formspree.io et remplace ce bloc
     par un <form action="https://formspree.io/f/TON_ID" method="POST">.
  */
  const DEST_EMAIL = "eloi.dupasquier@proton.me";
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#cf-name").value.trim();
      const email = form.querySelector("#cf-email").value.trim();
      const type = form.querySelector("#cf-type").value;
      const message = form.querySelector("#cf-message").value.trim();

      if (!name || !email || !message) {
        if (note) note.textContent = "Merci de remplir votre nom, email et message.";
        return;
      }

      const subject = `Nouveau projet — ${type} · ${name}`;
      const body =
        `Nom : ${name}\n` +
        `Email : ${email}\n` +
        `Type de projet : ${type}\n\n` +
        `${message}\n`;

      const mailto = `mailto:${DEST_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      if (note) {
        note.textContent = "Votre logiciel de messagerie va s'ouvrir. À très vite !";
      }
    });
  }
})();
