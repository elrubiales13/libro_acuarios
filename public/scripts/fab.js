
const initFab = () => {
  const fab = document.querySelector(".fab");

  if (!fab) return;

  const fabToggle = document.getElementById("fabToggle");
  const addBtn = document.getElementById("add-page-btn");
  const waterBtn = document.getElementById("waterLevels");
  const waterGuideBtn = document.getElementById("waterGuide");

  // Toggle FAB
  if (fabToggle && !fabToggle.dataset.bound) {
    fabToggle.dataset.bound = "true";
    fabToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fab.classList.toggle("open");
    });
  }

  // Botón "+" (Añadir pez)
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = "true";
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fab.classList.remove("open");
      if (window.openFishModal) {
        window.openFishModal({ mode: "create" });
      }
    });
  }

  // Botón water-levels
  if (waterBtn && !waterBtn.dataset.bound) {
    waterBtn.dataset.bound = "true";
    waterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fab.classList.remove("open");
      const base = document.getElementById("app-config")?.dataset.base ?? "/";
      window.location.href = `${base}water-levels`;
    });
  }

  // Botón water-guide
  if (waterGuideBtn && !waterGuideBtn.dataset.bound) {
    waterGuideBtn.dataset.bound = "true";
    waterGuideBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fab.classList.remove("open");
      const base = document.getElementById("app-config")?.dataset.base ?? "/";
      window.location.href = `${base}water-guide`;
    });
  }

  // Click fuera → cerrar menu
  if (!document.datasetHasFabClose) {
    document.datasetHasFabClose = true;
    document.addEventListener("click", (ev) => {
      const activeFab = document.querySelector(".fab");
      if (activeFab && !activeFab.contains(ev.target)) {
        activeFab.classList.remove("open");
      }
    });
  }
};

// inicial
initFab();
document.addEventListener("DOMContentLoaded", initFab);
document.addEventListener("spa:render", initFab);
