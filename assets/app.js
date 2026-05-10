const pageConfigs = {
  tasacion: {
    base: 115000,
    unit: "€",
    suffix: "",
    defaultText: "Completa el simulador y veras una horquilla orientativa.",
    steps: [
      { key: "city", title: "Donde esta tu vivienda", type: "options", options: [["Madrid", 1.04], ["Chamberi / Salamanca", 1.18], ["Asturias", .72], ["Castilla y Leon", .62]] },
      { key: "property", title: "Tipo de inmueble", type: "options", options: [["Piso", 1], ["Atico", 1.12], ["Chalet", 1.18], ["Local u oficina", .82]] },
      { key: "meters", title: "Metros construidos", type: "number", min: 35, max: 450, value: 95 },
      { key: "features", title: "Que extras tiene", type: "multi", options: [["Terraza", .08], ["Ascensor", .06], ["Garaje", .07], ["Reformado", .12], ["Exterior", .05], ["Piscina", .06]] }
    ],
    calculate(data) {
      const meters = Number(data.meters || 95);
      const multiplier = (data.city || 1) * (data.property || 1) * (1 + (data.features || 0));
      const value = Math.round((this.base + meters * 1650) * multiplier / 5000) * 5000;
      return {
        headline: `${formatMoney(value * .9)} - ${formatMoney(value * 1.04)}`,
        label: "Valor orientativo de mercado",
        confidence: "Estimacion prudente para iniciar una valoracion",
        details: [
          ["Valor medio", formatMoney(value)],
          ["Escenario prudente", formatMoney(value * .9)],
          ["Escenario optimista", formatMoney(value * 1.04)]
        ]
      };
    },
    bullets: ["Informe gratuito con rango realista", "Comparativa por zona y tipologia", "Siguiente paso: visita o llamada comercial"]
  },
  alquiler: {
    base: 820,
    unit: "€",
    suffix: "/mes",
    defaultText: "Responde unas preguntas y calcula una renta orientativa.",
    steps: [
      { key: "city", title: "Ciudad o zona principal", type: "options", options: [["Madrid", 1.45], ["Costa", 1.18], ["Asturias", .82], ["Soria / Castilla", .72]] },
      { key: "rooms", title: "Habitaciones", type: "options", options: [["1", .76], ["2", 1], ["3", 1.24], ["4 o mas", 1.42]] },
      { key: "mode", title: "Tipo de alquiler", type: "options", options: [["Larga estancia", 1], ["Temporal", 1.18], ["Estudiantes", 1.08], ["Turistico", 1.35]] },
      { key: "features", title: "Estado y ventajas", type: "multi", options: [["Amueblado", .08], ["Reformado", .12], ["Garaje", .07], ["Terraza", .08], ["Ascensor", .05], ["Alta demanda", .1]] }
    ],
    calculate(data) {
      const multiplier = (data.city || 1) * (data.rooms || 1) * (data.mode || 1) * (1 + (data.features || 0));
      const value = Math.round(this.base * multiplier / 25) * 25;
      return {
        headline: `${formatMoney(value)}${this.suffix}`,
        label: "Renta mensual orientativa",
        confidence: "Revisar estado, demanda de zona y perfil de inquilino",
        details: [
          ["Rango prudente", `${formatMoney(value * .92)}/mes`],
          ["Rango alto", `${formatMoney(value * 1.1)}/mes`],
          ["Ingreso anual estimado", formatMoney(value * 12)]
        ]
      };
    },
    bullets: ["Estimacion de renta mensual", "Filtro de inquilino fiable", "Gestion comercial y documental"]
  },
  espana: {
    base: 1,
    defaultText: "El resultado prioriza ciudad, presupuesto y motivo de mudanza.",
    steps: [
      { key: "origin", title: "Desde donde nos contactas", type: "options", options: [["Latinoamerica", 1], ["Estados Unidos", 1.1], ["Reino Unido", 1.08], ["Union Europea", .95]] },
      { key: "goal", title: "Que quieres hacer en Espana", type: "options", options: [["Comprar", 1.2], ["Alquilar", .9], ["Invertir", 1.35], ["Vivir por teletrabajo", 1.05]] },
      { key: "property", title: "Tipo de propiedad", type: "options", options: [["Piso", 1], ["Chalet", 1.22], ["Estudio", .72], ["Atico", 1.18]] },
      { key: "budget", title: "Cuanto quieres invertir o pagar", type: "conditional", source: "goal", fallback: "Comprar", options: {
        "Comprar": [["Hasta 180.000 €", .72], ["180.000 - 350.000 €", .95], ["350.000 - 650.000 €", 1.18], ["Mas de 650.000 €", 1.4]],
        "Alquilar": [["Hasta 900 €/mes", .65], ["900 - 1.500 €/mes", .88], ["1.500 - 2.500 €/mes", 1.12], ["Mas de 2.500 €/mes", 1.35]],
        "Invertir": [["Hasta 150.000 €", .72], ["150.000 - 300.000 €", .96], ["300.000 - 600.000 €", 1.18], ["Mas de 600.000 €", 1.4]],
        "Vivir por teletrabajo": [["Hasta 1.000 €/mes", .7], ["1.000 - 1.800 €/mes", .95], ["1.800 - 3.000 €/mes", 1.18], ["Mas de 3.000 €/mes", 1.35]]
      } }
    ],
    calculate(data) {
      const score = (data.origin || 1) * (data.goal || 1) * (data.property || 1) * (data.budget || 1);
      const profile = score > 1.55 ? "Perfil prioritario" : score > 1.05 ? "Perfil activo" : "Perfil exploratorio";
      return {
        headline: profile,
        label: "Ruta inmobiliaria sugerida",
        confidence: "Primero conviene validar ciudad, presupuesto y tipo de propiedad",
        details: [
          ["Compra", score > 1.2 ? "Shortlist de zonas" : "Guia inicial"],
          ["Alquiler", "Rango mensual y barrios"],
          ["Siguiente paso", "Llamada de orientacion"]
        ]
      };
    },
    bullets: ["Acompanar compra, alquiler o inversion", "Reducir friccion legal y operativa", "Convertir dudas internacionales en llamada"]
  },
  espanaEn: {
    base: 1,
    defaultText: "Answer a few questions and get a first route for Spain.",
    labels: { next: "Next", back: "Back", result: "See result" },
    summary: "Your first route is ready. The next step is a short advisory call, using only the essential contact details.",
    steps: [
      { key: "origin", title: "Where are you contacting us from?", type: "options", options: [["Latin America", 1], ["United States", 1.1], ["United Kingdom", 1.08], ["European Union", .95]] },
      { key: "goal", title: "What do you want to do in Spain?", type: "options", options: [["Buy", 1.2], ["Rent", .9], ["Invest", 1.35], ["Remote work stay", 1.05]] },
      { key: "property", title: "Property type", type: "options", options: [["Apartment", 1], ["House / villa", 1.22], ["Studio", .72], ["Penthouse", 1.18]] },
      { key: "budget", title: "Budget", type: "conditional", source: "goal", fallback: "Buy", options: {
        "Buy": [["Up to 180,000 €", .72], ["180,000 - 350,000 €", .95], ["350,000 - 650,000 €", 1.18], ["More than 650,000 €", 1.4]],
        "Rent": [["Up to 900 €/month", .65], ["900 - 1,500 €/month", .88], ["1,500 - 2,500 €/month", 1.12], ["More than 2,500 €/month", 1.35]],
        "Invest": [["Up to 150,000 €", .72], ["150,000 - 300,000 €", .96], ["300,000 - 600,000 €", 1.18], ["More than 600,000 €", 1.4]],
        "Remote work stay": [["Up to 1,000 €/month", .7], ["1,000 - 1,800 €/month", .95], ["1,800 - 3,000 €/month", 1.18], ["More than 3,000 €/month", 1.35]]
      } }
    ],
    calculate(data) {
      const score = (data.origin || 1) * (data.goal || 1) * (data.property || 1) * (data.budget || 1);
      const profile = score > 1.55 ? "Priority profile" : score > 1.05 ? "Active profile" : "Exploratory profile";
      return {
        headline: profile,
        label: "Suggested Spain route",
        confidence: "Validate city, budget and property type before booking visits",
        details: [
          ["Buying route", score > 1.2 ? "Curated areas" : "Initial guide"],
          ["Rental route", "Monthly range and areas"],
          ["Next step", "Advisory call"]
        ]
      };
    },
    bullets: ["Buy, rent or invest with local guidance", "Madrid-based team with 20+ years of experience", "Clear next step: a short advisory call"]
  },
  hogar: {
    base: 1,
    defaultText: "El test cruza estilo de vida, presupuesto y necesidades.",
    steps: [
      { key: "pace", title: "Que estilo de vida prefieres", type: "options", options: [["Centro con vida", 1.3], ["Barrio familiar", 1.05], ["Sierra tranquila", .9], ["Costa y movilidad", 1.1]] },
      { key: "reason", title: "Motivo principal", type: "options", options: [["Familia", 1.1], ["Inversion", 1.35], ["Primera vivienda", .95], ["Cambio de vida", 1.05]] },
      { key: "must", title: "Imprescindible", type: "multi", options: [["Terraza", .08], ["Colegios cerca", .06], ["Teletrabajo", .06], ["Zonas verdes", .07], ["Metro", .08], ["Piscina", .05]] },
      { key: "budget", title: "Presupuesto", type: "options", options: [["Hasta 300.000 €", .82], ["300.000 - 600.000 €", 1], ["600.000 - 1.000.000 €", 1.2], ["Mas de 1.000.000 €", 1.45]] }
    ],
    calculate(data) {
      const score = (data.pace || 1) * (data.reason || 1) * (1 + (data.must || 0)) * (data.budget || 1);
      const fit = score > 1.75 ? "Zonas prime y activos seleccionados" : score > 1.15 ? "Barrios consolidados con buena demanda" : "Oportunidades emergentes y compra prudente";
      return {
        headline: fit,
        label: "Encaje recomendado",
        confidence: "Basado en estilo de vida, motivo y presupuesto",
        details: [
          ["Prioridad", score > 1.15 ? "Calidad de zona" : "Precio de entrada"],
          ["Tipo de busqueda", "Seleccion personalizada"],
          ["Siguiente paso", "Recibir zonas sugeridas"]
        ]
      };
    },
    bullets: ["Recomendacion por estilo de vida", "Zonas sugeridas antes de ensenar pisos", "Lead mas cualificado para el asesor"]
  },
  inversion: {
    base: 4.2,
    unit: "",
    suffix: "% rentabilidad bruta estimada",
    defaultText: "El calculo orienta la conversacion hacia rentabilidad y plazo.",
    steps: [
      { key: "capital", title: "Capital disponible", type: "options", options: [["Hasta 200.000 €", .9], ["200.000 - 500.000 €", 1.05], ["500.000 - 1.000.000 €", 1.22], ["Mas de 1.000.000 €", 1.35]] },
      { key: "area", title: "Mercado preferido", type: "options", options: [["Madrid", 1.08], ["Asturias", 1.18], ["Castilla y Leon", 1.22], ["Costa", 1.15]] },
      { key: "asset", title: "Tipo de activo", type: "options", options: [["Vivienda", 1], ["Local comercial", 1.18], ["Oficina", 1.12], ["Proyecto rural", 1.3]] },
      { key: "horizon", title: "Horizonte", type: "options", options: [["Compra inmediata", 1.2], ["3 meses", 1.1], ["6-12 meses", 1], ["Exploracion", .88]] }
    ],
    calculate(data) {
      const value = this.base * (data.capital || 1) * (data.area || 1) * (data.asset || 1) * (data.horizon || 1);
      return {
        headline: `${value.toFixed(1).replace(".", ",")}${this.suffix}`,
        label: "Rentabilidad bruta orientativa",
        confidence: "Antes de invertir hay que revisar gastos, ocupacion y riesgo",
        details: [
          ["Escenario conservador", `${(value - .7).toFixed(1).replace(".", ",")}%`],
          ["Escenario objetivo", `${value.toFixed(1).replace(".", ",")}%`],
          ["Escenario alto", `${(value + .8).toFixed(1).replace(".", ",")}%`]
        ]
      };
    },
    bullets: ["Segmenta por capital y urgencia", "Abre conversacion sobre zonas", "Perfecta para leads premium"]
  }
};

function formatMoney(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function initWizard(root) {
  const id = root.dataset.wizard;
  const config = pageConfigs[id];
  if (!config) return;
  const state = {};
  let index = 0;
  const progress = root.querySelector(".progress span");
  const stepHost = root.querySelector(".steps");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const result = document.querySelector("[data-result]");
  const summary = document.querySelector("[data-summary]");
  const bullets = document.querySelector("[data-bullets]");
  const contactGate = document.querySelector("[data-contact-gate]");

  function renderStep() {
    const step = config.steps[index];
    progress.style.width = `${((index + 1) / config.steps.length) * 100}%`;
    prev.disabled = index === 0;
    const labels = config.labels || { next: "Siguiente", back: "Anterior", result: "Ver resultado" };
    prev.textContent = labels.back;
    next.textContent = index === config.steps.length - 1 ? labels.result : labels.next;
    stepHost.innerHTML = `<div class="step active"><h2 class="step-title">${step.title}</h2>${renderControl(step)}</div>`;
    bindControls(step);
  }

  function renderControl(step) {
    if (step.type === "number") {
      return `<div class="field"><label for="${step.key}">Introduce una cifra orientativa</label><input id="${step.key}" type="number" min="${step.min}" max="${step.max}" value="${state[step.key] || step.value}"></div>`;
    }
    const options = getStepOptions(step);
    return `<div class="options">${options.map(([label, value]) => `<button class="option" type="button" data-key="${step.key}" data-label="${label}" data-value="${value}">${label}</button>`).join("")}</div>`;
  }

  function getStepOptions(step) {
    if (step.type !== "conditional") return step.options;
    const selectedLabel = state[`${step.source}Label`] || step.fallback;
    return step.options[selectedLabel] || step.options[step.fallback];
  }

  function bindControls(step) {
    if (step.type === "number") {
      stepHost.querySelector("input").addEventListener("input", event => state[step.key] = event.target.value);
      state[step.key] = state[step.key] || step.value;
      return;
    }
    stepHost.querySelectorAll(".option").forEach(button => {
      button.addEventListener("click", () => {
        const rawValue = button.dataset.value;
        const value = Number.isNaN(Number(rawValue)) ? rawValue : Number(rawValue);
        if (step.type === "multi") {
          button.classList.toggle("selected");
          const selected = [...stepHost.querySelectorAll(".option.selected")].reduce((sum, el) => sum + Number(el.dataset.value), 0);
          state[step.key] = selected;
        } else {
          stepHost.querySelectorAll(".option").forEach(item => item.classList.remove("selected"));
          button.classList.add("selected");
          state[step.key] = value;
          state[`${step.key}Label`] = button.dataset.label;
        }
      });
    });
  }

  function updateResult() {
    const value = config.calculate(state);
    renderResult(value);
    summary.textContent = config.summary || "Resultado orientativo listo. El siguiente paso comercial es ofrecer un informe gratuito o una llamada breve, no pedir demasiados datos.";
    bullets.innerHTML = config.bullets.map(item => `<li>${item}</li>`).join("");
    if (contactGate) contactGate.hidden = false;
    root.hidden = true;
  }

  function renderResult(value) {
    if (typeof value === "string") {
      result.textContent = value;
      return;
    }
    result.innerHTML = `
      <span class="result-label">${value.label}</span>
      <strong>${value.headline}</strong>
      <small>${value.confidence}</small>
      <div class="simulation-grid">
        ${value.details.map(([label, detail]) => `<div><span>${label}</span><b>${detail}</b></div>`).join("")}
      </div>
    `;
  }

  prev.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    renderStep();
  });

  next.addEventListener("click", () => {
    if (index < config.steps.length - 1) {
      index += 1;
      renderStep();
    } else {
      updateResult();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  result.textContent = config.defaultText;
  bullets.innerHTML = config.bullets.map(item => `<li>${item}</li>`).join("");
  if (contactGate) contactGate.hidden = true;
  renderStep();
}

document.querySelectorAll("[data-wizard]").forEach(initWizard);

function initLandingUtilities() {
  const isEnglish = document.documentElement.lang === "en";
  const body = document.body;
  if (!body.classList.contains("landing-body")) return;

  const legalText = isEnglish
    ? "I accept the terms of use and agree to receive property offers, articles and useful updates from Mira Real Estate by email."
    : "Acepto las condiciones de uso y acepto recibir por correo ofertas, articulos e informacion de interes de Mira Real Estate.";

  document.querySelectorAll(".cta-box").forEach(box => {
    if (box.querySelector(".legal-check")) return;
    const wrapper = document.createElement("label");
    wrapper.className = "legal-check";
    wrapper.innerHTML = `<input type="checkbox" required> <span>${legalText} <button type="button" data-open-legal>${isEnglish ? "Read terms" : "Ver condiciones"}</button></span>`;
    const submit = box.querySelector(".cta-submit");
    if (submit) {
      box.insertBefore(wrapper, submit);
    } else {
      box.appendChild(wrapper);
    }
  });

  const widget = document.createElement("div");
  widget.className = "contact-widget";
  widget.innerHTML = `
    <button class="contact-fab" type="button" aria-expanded="false">${isEnglish ? "More information?" : "¿Mas informacion?"}<span>✆</span></button>
    <div class="contact-panel" hidden>
      <div class="contact-panel-head">
        <div class="panel-icon">⌕</div>
        <strong>${isEnglish ? "How can we help?" : "¿Como puedo ayudarte?"}</strong>
        <button type="button" data-close-contact aria-label="Cerrar">×</button>
      </div>
      <a href="https://wa.me/34916194162" target="_blank"><span class="contact-ico whatsapp">☘</span><b>WhatsApp</b><small>${isEnglish ? "Online advisory" : "Asesoria online"}</small></a>
      <a href="mailto:mira@mirarealestate.es"><span class="contact-ico mail">✉</span><b>${isEnglish ? "Email" : "Correo"}</b><small>mira@mirarealestate.es</small></a>
      <a href="https://mirarealestate.es/contacto/" target="_blank"><span class="contact-ico facebook">f</span><b>Facebook / Messenger</b><small>${isEnglish ? "Connect from the contact page" : "Contacta desde la pagina oficial"}</small></a>
    </div>`;
  body.appendChild(widget);

  const modal = document.createElement("div");
  modal.className = "legal-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="legal-dialog" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <button class="legal-close" type="button" aria-label="Cerrar">×</button>
      <h2 id="legal-title">${isEnglish ? "Terms of use and privacy notice" : "Condiciones de uso y aviso de privacidad"}</h2>
      <p>${isEnglish ? "This landing is designed to request a first real estate orientation from Mira Real Estate. The estimates are indicative and do not replace a professional valuation, legal review or financial advice." : "Esta landing sirve para solicitar una primera orientacion inmobiliaria de Mira Real Estate. Las estimaciones son orientativas y no sustituyen una valoracion profesional, revision legal o asesoramiento financiero."}</p>
      <p>${isEnglish ? "By submitting your contact details, you consent to being contacted by phone, email or messaging channels about your request. If you check the subscription consent, you may also receive property offers, articles and updates from the company." : "Al enviar tus datos, aceptas que la empresa pueda contactarte por telefono, correo o canales de mensajeria sobre tu solicitud. Si aceptas la suscripcion, tambien podras recibir ofertas inmobiliarias, articulos y novedades de la empresa."}</p>
      <p>${isEnglish ? "You can request access, correction or removal of your data by writing to mira@mirarealestate.es. Official legal pages are available on the Mira Real Estate website." : "Puedes solicitar acceso, rectificacion o eliminacion de tus datos escribiendo a mira@mirarealestate.es. Las paginas legales oficiales estan disponibles en la web de Mira Real Estate."}</p>
      <p><a href="https://mirarealestate.es/aviso-legal/" target="_blank">${isEnglish ? "Legal notice" : "Aviso legal"}</a> · <a href="https://mirarealestate.es/politica-de-privacidad/" target="_blank">${isEnglish ? "Privacy policy" : "Politica de privacidad"}</a> · <a href="https://mirarealestate.es/condiciones-de-uso/" target="_blank">${isEnglish ? "Terms of use" : "Condiciones de uso"}</a></p>
    </div>`;
  body.appendChild(modal);

  const panel = widget.querySelector(".contact-panel");
  const fab = widget.querySelector(".contact-fab");
  fab.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
  });
  widget.querySelector("[data-close-contact]").addEventListener("click", () => {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll("[data-open-legal], [data-legal-link]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      modal.hidden = false;
    });
  });
  modal.querySelector(".legal-close").addEventListener("click", () => modal.hidden = true);
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.hidden = true;
  });
}

initLandingUtilities();
