import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { store } from "./store.js";

const cfg = document.getElementById("app-config");
const BASE = cfg.dataset.base;

if (!cfg?.dataset.url || !cfg?.dataset.key) {
  throw new Error("Supabase config missing in #app-config");
}


const supabase = createClient(
  cfg.dataset.url,
  cfg.dataset.key
);

const qs = (sel) => document.querySelector(sel);

// helpers de inicio
const getPageFromUrl = () => {
  const p = new URLSearchParams(window.location.search).get("p");
  return Math.max(0, Number(p) || 0);
};

const setUrl = (p) => {
  history.pushState({ p }, "", p === 0 ? BASE : `${BASE}?p=${p}`);
};


// renderizadores de html puro
const renderIndex = (fishes) => {
  const tpl = document.getElementById("tpl-index");
  const node = tpl.content.cloneNode(true);
  const ul = node.querySelector(".fish-index");

  fishes.forEach((f, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="#" data-p="${i + 1}">
        <span class="index-name">${f.nombre_comun}</span>
        <span class="index-dots"></span>
        <span class="index-page">${i + 1}</span>
      </a>
    `;
    ul.appendChild(li);
  });

  qs("#left-page").replaceChildren(node);
  
  qs("#right-page").innerHTML = `
    
    <img src="https://huxgizbfvularmgupzby.supabase.co/storage/v1/object/public/imagenes/IMG20250510161433.jpg" alt="Libro de acuarios">
    
  `;
};

const renderFish = (fish) => {
  const tpl = document.getElementById("tpl-fish");
  const node = tpl.content.cloneNode(true);
  const page = node.querySelector(".page-content");

  page.innerHTML = `
    <div class="fish-card" data-fish-id="${fish.id}">
      <h2>${fish.nombre_comun}</h2>
      <p><em>${fish.nombre_cientifico}</em></p>

      <section class="fish-meta">
        <p><strong>Familia:</strong> ${fish.familia ?? "-"}</p>
        <p><strong>Origen:</strong> ${fish.origen ?? "-"}</p>
        <p><strong>Color:</strong> ${fish.color ?? "-"}</p>
        <p><strong>Sexo:</strong> ${fish.sexo ?? "-"}</p>
        <p><strong>Tamaño adulto:</strong> ${fish.tamano_adulto ?? "-"}</p>
      </section>

      <section class="fish-water">
        <p><strong>Temperatura:</strong> ${fish.temperature_min}–${fish.temperature_max} °C</p>
        <p><strong>pH:</strong> ${fish.ph_min}–${fish.ph_max}</p>
        <p><strong>GH:</strong> ${fish.gh_min}–${fish.gh_max}</p>
        <p><strong>KH:</strong> ${fish.kh_min}–${fish.kh_max}</p>
      </section>

      <section class="fish-extra">
        <p><strong>Comportamiento:</strong> ${fish.comportamiento ?? "-"}</p>
        <p><strong>Alimentación:</strong> ${fish.alimentacion ?? "-"}</p>
        <p><strong>Compatibilidad:</strong> ${fish.compatibilidad ?? "-"}</p>
        <p><strong>Reproducción:</strong> ${fish.reproduccion ?? "-"}</p>
      </section>

      ${fish.notas_adicionales ? `
        <section class="fish-notes">
          <p><strong>Notas:</strong></p>
          <p>${fish.notas_adicionales}</p>
        </section>` : ""
      }
    </div>
  `;

  document.querySelector("#left-page").replaceChildren(page);

  document.querySelector("#right-page").innerHTML = fish.foto_url
    ? `<img src="${fish.foto_url}" loading="lazy">`
    : `<div class="no-image">${fish.nombre_comun}</div>`;
};

//funcion para abrir el modal de añadir pez
function openFishModal({ mode, fish = null }) {
  const modal = document.getElementById("modal-backdrop");
  const form = document.getElementById("add-fish-form");
  const title = document.getElementById("modal-title");

  if (!modal || !form || !title) return;

  // Reset común
  form.reset();
  form.dataset.mode = mode;
  form.dataset.fishId = "";

  const notice = document.querySelector(".species-notice");
  if (notice) notice.remove();

  if (mode === "create") {
    title.textContent = "Nueva ficha de pez";
  }

  if (mode === "edit" && fish) {
    title.textContent = "Editar ficha del pez";
    form.dataset.fishId = fish.id;

    // rellenar campos
    form.nombreComun.value = fish.nombre_comun ?? "";
    form.nombreCientifico.value = fish.nombre_cientifico ?? "";
    form.familia.value = fish.familia ?? "";
    form.origen.value = fish.origen ?? "";
    form.color.value = fish.color ?? "";
    form.sexo.value = fish.sexo ?? "";
    form.tamanoAdulto.value = fish.tamano_adulto ?? "";

    form.temperaturaMin.value = fish.temperature_min ?? "";
    form.temperaturaMax.value = fish.temperature_max ?? "";
    form.phMin.value = fish.ph_min ?? "";
    form.phMax.value = fish.ph_max ?? "";
    form.ghMin.value = fish.gh_min ?? "";
    form.ghMax.value = fish.gh_max ?? "";
    form.khMin.value = fish.kh_min ?? "";
    form.khMax.value = fish.kh_max ?? "";

    form.comportamiento.value = fish.comportamiento ?? "";
    form.alimentacion.value = fish.alimentacion ?? "";
    form.compatibilidad.value = fish.compatibilidad ?? "";
    form.reproduccion.value = fish.reproduccion ?? "";
    form.notas.value = fish.notas_adicionales ?? "";

    form.tank_id.value = fish.tank_id ?? "";
    form.fechaIncorporacion.value = fish.fecha_incorporacion ?? "";
    form.fechaFallecimiento.value = fish.fecha_fallecimiento ?? "";
    form.causaMuerte.value = fish.causa_muerte ?? "";
    form.compradoEn.value = fish.comprado_en ?? "";
    form.curiosidades.value = fish.curiosidades ?? "";
    form.fotoUrl.value = fish.foto_url ?? "";
  }

  modal.hidden = false;
}


// Listener para editar las fichas de los peces
document.addEventListener("click", (e) => {
  const card = e.target.closest(".fish-card");
  if (!card) return;

  const fishId = card.dataset.fishId;
  if (!fishId) return;
  e.preventDefault();
  e.stopPropagation();
  openEditFishModal(fishId);
});

// función para abrir el modal de edición de pez
function openEditFishModal(fishId) {
  const { fishes } = store.getState();
  const fish = fishes.find(f => f.id === fishId);
  if (!fish) return;

  openFishModal({ mode: "edit", fish });
}




// suscripción a strore clave
store.subscribe(({ fishes, currentPage, loaded }) => {
    if (!loaded) return;

    if (currentPage === 0) {
        renderIndex(fishes);
    } else {
        renderFish(fishes[currentPage - 1]);
    }

    qs("#nav-prev").style.visibility = currentPage > 0 ? "visible" : "hidden";
    qs("#nav-next").style.visibility =
        currentPage < fishes.length ? "visible" : "hidden";

    document.dispatchEvent(new Event("spa:render"));

});


// navegación
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-p]");
  if (!a) return;

  e.preventDefault();
  const p = Number(a.dataset.p);
  setUrl(p);
  store.setState({ currentPage: p });
});

qs("#nav-prev").addEventListener("click", (e) => {
  e.preventDefault();
  const { currentPage } = store.getState();
  if (currentPage > 0) {
    setUrl(currentPage - 1);
    store.setState({ currentPage: currentPage - 1 });
  }
});

qs("#nav-next").addEventListener("click", (e) => {
  e.preventDefault();
  const { currentPage, fishes } = store.getState();
  if (currentPage < fishes.length) {
    setUrl(currentPage + 1);
    store.setState({ currentPage: currentPage + 1 });
  }
});


// carga inicial de datos
window.addEventListener("popstate", (e) => {
  store.setState({
    currentPage: e.state?.p ?? getPageFromUrl()
  });
});

(async () => {
  const { data } = await supabase
    .from("fish_records")
    .select("*")
    .order("created_at");

  store.setState({
    fishes: data ?? [],
    loaded: true,
    currentPage: getPageFromUrl()
  });
})();

// Exponer función global para abrir el modal de añadir pez
window.openFishModal = openFishModal;
