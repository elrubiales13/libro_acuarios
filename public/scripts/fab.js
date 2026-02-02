
const config = document.getElementById("app-config");

const BASE_URL = config?.dataset.base ?? "/";

console.log("BASE_URL:", BASE_URL);


const initFab = () => {
  const fab = document.querySelector(".fab");

  if (!fab) return;
  // Avoid double-initializing handlers
  if (window.__fabInitialized) return;
  window.__fabInitialized = true;

  const fabToggle = document.getElementById("fabToggle");
  const addBtn = document.getElementById("add-page-btn");
  const modal = document.getElementById("modal-backdrop");
  const waterBtn = document.getElementById("waterLevels");

  // Toggle FAB
  fabToggle?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    fab.classList.toggle("open");
  });

  // Botón "+"
  addBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.openFishModal) {
      window.openFishModal({ mode: "create" });
    }
  });

  // Botón water-levels
  waterBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    fab.classList.remove("open");
    const base = document.getElementById("app-config")?.dataset.base ?? "/";
    window.location.href = `${base}water-levels`;
  });

  // Click fuera → cerrar
  document.addEventListener("click", (ev) => {
    if (!fab.contains(ev.target)) {
      fab.classList.remove("open");
    }
  });
};

// inicial
initFab();

// reinicializar tras render SPA
document.addEventListener("spa:render", initFab);
