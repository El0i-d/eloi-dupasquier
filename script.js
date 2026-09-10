/* =========================================================
   Eloi Dupasquier — interactions
   ========================================================= */
(function () {
  "use strict";

  /* Sans JavaScript, aucun contenu ne doit rester masqué : la mise
     en retrait des éléments révélés n'est appliquée que si ce
     marqueur est posé. */
  document.documentElement.classList.add("js-anim");

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

    /* Filet de sécurité : si l'observateur n'a rien signalé, tout
       élément déjà présent à l'écran est révélé malgré tout. Un
       contenu invisible serait bien pire qu'une animation manquée. */
    setTimeout(() => {
      revealEls.forEach((el) => {
        if (el.classList.contains("in")) return;
        const b = el.getBoundingClientRect();
        if (b.top < window.innerHeight && b.bottom > 0) el.classList.add("in");
      });
    }, 1200);
  }

  /* -------- Formulaire de contact --------
     Envoi direct via Web3Forms (api.web3forms.com) : aucun back-end à
     héberger, les messages arrivent par email. La clé "access_key" dans
     le formulaire identifie où les messages doivent être livrés.
  */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    const submitBtn = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector("#cf-name").value.trim();
      const email = form.querySelector("#cf-email").value.trim();
      const message = form.querySelector("#cf-message").value.trim();

      if (!name || !email || !message) {
        if (note) note.textContent = "Merci de remplir votre nom, email et message.";
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (note) note.textContent = "Envoi en cours…";

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const result = await response.json();

        if (result.success) {
          form.reset();
          if (note) note.textContent = "Message envoyé ! Je vous réponds sous 24 à 48 h.";
        } else {
          throw new Error(result.message || "Échec de l'envoi");
        }
      } catch (err) {
        if (note) {
          note.textContent =
            "L'envoi a échoué. Vous pouvez aussi m'écrire directement à eloi.dupasquier@proton.me.";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
