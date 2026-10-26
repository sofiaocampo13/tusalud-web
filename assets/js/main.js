/* =========================================================
   TuSalud+ · Script compartido
   - Menú desplegable en celular
   - Envío de formularios por correo con FormSubmit (https://formsubmit.co)
   ========================================================= */

// Correo que recibe las inscripciones y preguntas.
// La primera vez que alguien envíe un formulario, FormSubmit mandará un correo
// de activación a esta dirección: hay que abrirlo y confirmar.
const CORREO_DESTINO = "tusaludmas8@gmail.com";
const URL_ENVIO = "https://formsubmit.co/ajax/" + CORREO_DESTINO;

// ---------- Menú en celular ----------
document.querySelectorAll(".menu-boton").forEach((boton) => {
  const menu = document.getElementById(boton.getAttribute("aria-controls"));
  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto);
  });
  menu.querySelectorAll("a").forEach((enlace) =>
    enlace.addEventListener("click", () => {
      menu.classList.remove("abierto");
      boton.setAttribute("aria-expanded", "false");
    })
  );
});

// ---------- Formularios ----------
document.querySelectorAll("form[data-formulario]").forEach((formulario) => {
  const contenedor = formulario.closest(".formulario");
  const exito = contenedor.querySelector(".mensaje-ok");
  const error = formulario.querySelector(".mensaje-error");
  const botonEnviar = formulario.querySelector("button[type='submit']");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    error.classList.add("oculto");

    const datos = Object.fromEntries(new FormData(formulario).entries());
    datos._subject = formulario.dataset.asunto || "Nuevo mensaje desde el sitio TuSalud+";
    datos._template = "table";
    datos.pagina = document.title;

    const textoOriginal = botonEnviar.textContent;
    botonEnviar.disabled = true;
    botonEnviar.textContent = "Enviando…";

    try {
      const respuesta = await fetch(URL_ENVIO, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(datos),
      });
      if (!respuesta.ok) throw new Error("Respuesta " + respuesta.status);
      formulario.classList.add("oculto");
      exito.classList.remove("oculto");
      exito.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {
      error.classList.remove("oculto");
    } finally {
      botonEnviar.disabled = false;
      botonEnviar.textContent = textoOriginal;
    }
  });
});

// Año actual en el pie de página
document.querySelectorAll("[data-anio]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Pausar el video del inicio si la persona prefiere menos movimiento
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("video[autoplay]").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
}
