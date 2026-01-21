const BASE = import.meta.env.BASE_URL;

window.addEventListener("DOMContentLoaded", () => {
  const fab = document.querySelector(".fab");
  if (!fab) return;

  document.addEventListener("click", (ev) => {
    let node = ev.target;
    while (node && node.nodeType !== 1) node = node.parentNode;
    if (!node) return;

    const el = node;

    // Toggle FAB
    if (el.closest("#fabToggle")) {
      ev.preventDefault();
      ev.stopPropagation();
      fab.classList.toggle("open");
      return;
    }

    // Water levels
    if (el.closest("#waterLevels")) {
      ev.preventDefault();
      ev.stopPropagation();
      fab.classList.remove("open");
      window.location.href = `${BASE}water-levels`;
      return;
    }

    // Add page
    if (el.closest("#add-page-btn")) {
      ev.preventDefault();
      ev.stopPropagation();
      fab.classList.remove("open");
      document.getElementById("add-page-btn")?.click();
      return;
    }

    // Click fuera → cerrar
    if (!fab.contains(el)) {
      fab.classList.remove("open");
    }
  });
});
