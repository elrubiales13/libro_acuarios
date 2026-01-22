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
    li.innerHTML = `<a href="#" data-p="${i + 1}">${f.nombre_comun}</a>`;
    ul.appendChild(li);
  });

  qs("#left-page").replaceChildren(node);
  qs("#right-page").innerHTML = "<p>Seleccione una especie</p>";
};

const renderFish = (fish) => {
  const tpl = document.getElementById("tpl-fish");
  const node = tpl.content.cloneNode(true);
  const page = node.querySelector(".page-content");

  page.innerHTML = `
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
      </section>` : ""}
  `;

  document.querySelector("#left-page").replaceChildren(page);

  document.querySelector("#right-page").innerHTML = fish.foto_url
    ? `<img src="${fish.foto_url}" loading="lazy">`
    : `<div class="no-image">${fish.nombre_comun}</div>`;
};



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
