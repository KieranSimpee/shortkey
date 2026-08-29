/* Gold Standards preview helpers — GOR_GOR_REVIEW */
(function () {
  const progress = document.querySelector(".progress-indicator");
  if (progress) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.setProperty("--progress", pct + "%");
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".slide-panel");
  const backdrop = document.querySelector(".panel-backdrop");
  const closeBtn = document.querySelector(".panel-close");

  function openPanel() {
    panel?.classList.add("open");
    backdrop?.classList.add("open");
  }
  function closePanel() {
    panel?.classList.remove("open");
    backdrop?.classList.remove("open");
  }

  toggle?.addEventListener("click", openPanel);
  closeBtn?.addEventListener("click", closePanel);
  backdrop?.addEventListener("click", closePanel);

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    });
  });
})();
