export function initAddFishModal() {
  const modal = document.getElementById("add-fish-modal");
  const backdrop = document.getElementById("modal-backdrop");
  const openBtn = document.getElementById("add-page-btn");
  const closeBtns = modal?.querySelectorAll("[data-modal-close]") ?? [];
  const form = modal?.querySelector("form");

  if (!modal || !openBtn) {
    // El modal no existe en esta página
    return;
  }

  function openModal() {
    modal.classList.remove("hidden");
    backdrop?.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.add("hidden");
    backdrop?.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  // --- BOTÓN "+"
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  // --- BOTONES DE CIERRE (X, cancelar, etc.)
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  // --- CLICK EN EL BACKDROP
  backdrop?.addEventListener("click", closeModal);

  // --- TECLA ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // --- SUBMIT DEL FORMULARIO
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Aquí NO duplico tu lógica de submit
      // porque ya la tienes funcionando.
      // El submit seguirá funcionando igual
      // (fetch, supabase, lo que uses).

      closeModal();
    });
  }
}
