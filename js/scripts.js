let animationObserver = null;

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    services: [],
    activeCategory: "all",
    activeSort: "price-asc"
  };

  initAccordion();
  initLightbox();
  initModal();
  initAnimations();
  initKeyboardFocus();
  initServices(state);
  initContactForm();
  initEnquiryForm(state);
});

function initAccordion() {
  document.querySelectorAll(".accordion-toggle").forEach((button, index) => {
    const panel = button.nextElementSibling;
    if (!panel) {
      return;
    }

    if (!panel.id) {
      panel.id = `accordion-panel-${index + 1}`;
    }

    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", panel.id);
    panel.hidden = true;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      button.classList.toggle("active", !isOpen);
      panel.hidden = isOpen;

      if (isOpen) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeButton = document.getElementById("lightboxClose");

  if (!lightbox || !lightboxImage || !closeButton) {
    return;
  }

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll(".gallery-item").forEach((image) => {
    image.addEventListener("click", () => {
      lightboxImage.src = image.dataset.full || image.src;
      lightboxImage.alt = image.alt;
      if (lightboxCaption) {
        lightboxCaption.textContent = image.dataset.caption || image.alt;
      }
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    });
  });

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      close();
    }
  });
}

function initModal() {
  const modal = document.getElementById("siteModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeButton = document.getElementById("modalClose");

  if (!modal || !modalTitle || !modalBody || !closeButton) {
    return;
  }

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-modal]");
    if (!trigger) {
      return;
    }

    modalTitle.textContent = trigger.dataset.modalTitle || "More information";
    modalBody.innerHTML = trigger.dataset.modalContent || "<p>Information is coming soon.</p>";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });

  closeButton.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      close();
    }
  });
}

function initAnimations() {
  const animatedItems = document.querySelectorAll("[data-animate]");

  if (!animatedItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  animatedItems.forEach((item) => animationObserver.observe(item));
}

function activateAnimations(container) {
  if (!container) {
    return;
  }

  const animatedItems = container.querySelectorAll("[data-animate]");
  if (!animatedItems.length) {
    return;
  }

  if (!animationObserver) {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  animatedItems.forEach((item) => animationObserver.observe(item));
}

function initKeyboardFocus() {
  document.body.addEventListener("keyup", (event) => {
    if (event.key === "Tab") {
      document.body.classList.add("show-focus");
    }
  });

  document.body.addEventListener("mousedown", () => {
    document.body.classList.remove("show-focus");
  });
}

async function initServices(state) {
  const servicesList = document.getElementById("servicesList");
  const featuredList = document.getElementById("featuredServices");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sortServices");
  const resultsCount = document.getElementById("resultsCount");
  const categoryButtons = document.querySelectorAll("[data-category-filter]");
  const requestedServiceSelect = document.getElementById("requestedService");

  if (!servicesList && !featuredList && !requestedServiceSelect) {
    return;
  }

  try {
    const response = await fetch("data/posts.json");
    if (!response.ok) {
      throw new Error("Unable to load service data.");
    }

    state.services = await response.json();
    renderFeaturedServices(featuredList, state.services);
    renderServices(state, servicesList, resultsCount, searchInput);
    populateServiceOptions(state.services);
  } catch (error) {
    if (servicesList) {
      servicesList.innerHTML = '<p class="status-message status-error">Unable to load services right now. Please try again later.</p>';
    }
    if (featuredList) {
      featuredList.innerHTML = "";
    }
    populateServiceOptions([]);
    return;
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => renderServices(state, servicesList, resultsCount, searchInput));
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.activeSort = sortSelect.value;
      renderServices(state, servicesList, resultsCount, searchInput);
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.categoryFilter || "all";
      categoryButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderServices(state, servicesList, resultsCount, searchInput);
    });
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-service]");
    if (!trigger) {
      return;
    }

    const service = state.services.find((item) => String(item.id) === trigger.dataset.openService);
    if (!service) {
      return;
    }

    const modalTrigger = document.createElement("button");
    modalTrigger.type = "button";
    modalTrigger.hidden = true;
    modalTrigger.dataset.openModal = "true";
    modalTrigger.dataset.modalTitle = service.title;
    modalTrigger.dataset.modalContent =
      `<p>${escapeHtml(service.description)}</p>
      <p><strong>Category:</strong> ${formatCategory(service.category)}</p>
      <p><strong>Price from:</strong> R${Number(service.priceFrom).toLocaleString("en-ZA")}</p>
      <p><strong>Availability:</strong> ${escapeHtml(service.availability)}</p>
      <p><strong>Turnaround:</strong> ${escapeHtml(service.turnaround)}</p>
      <p><strong>Coverage:</strong> ${escapeHtml(service.location)}</p>`;

    document.body.appendChild(modalTrigger);
    modalTrigger.click();
    modalTrigger.remove();
  });
}

function renderFeaturedServices(container, services) {
  if (!container) {
    return;
  }

  const featured = services.slice(0, 3);
  container.innerHTML = featured.map((service) => `
    <article class="service-card" data-animate>
      <span class="pill">${formatCategory(service.category)}</span>
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.description)}</p>
      <div class="service-meta">
        <span>From R${Number(service.priceFrom).toLocaleString("en-ZA")}</span>
        <span>${escapeHtml(service.availability)}</span>
      </div>
      <button class="btn btn-secondary" type="button" data-open-service="${service.id}">View details</button>
    </article>
  `).join("");

  activateAnimations(container);
}

function renderServices(state, container, countNode, searchInput) {
  if (!container) {
    return;
  }

  const query = (searchInput?.value || "").trim().toLowerCase();
  let results = [...state.services];

  if (state.activeCategory !== "all") {
    results = results.filter((service) => service.category === state.activeCategory);
  }

  if (query) {
    results = results.filter((service) => {
      const haystack = [
        service.title,
        service.description,
        service.location,
        service.tags,
        service.category
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }

  switch (state.activeSort) {
    case "price-desc":
      results.sort((a, b) => b.priceFrom - a.priceFrom);
      break;
    case "title-asc":
      results.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      results.sort((a, b) => a.priceFrom - b.priceFrom);
      break;
  }

  if (countNode) {
    countNode.textContent = `${results.length} service${results.length === 1 ? "" : "s"} found`;
  }

  if (!results.length) {
    container.innerHTML = '<p class="status-message status-info">No services match that search yet. Try a different keyword or category.</p>';
    return;
  }

  container.innerHTML = results.map((service) => `
    <article class="service-card" data-animate>
      <div class="service-card-top">
        <span class="pill">${formatCategory(service.category)}</span>
        <strong>From R${Number(service.priceFrom).toLocaleString("en-ZA")}</strong>
      </div>
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.description)}</p>
      <div class="service-meta">
        <span>${escapeHtml(service.availability)}</span>
        <span>${escapeHtml(service.turnaround)}</span>
      </div>
      <p class="service-location">${escapeHtml(service.location)}</p>
      <button class="btn btn-secondary" type="button" data-open-service="${service.id}">Open service details</button>
    </article>
  `).join("");

  activateAnimations(container);
}

function populateServiceOptions(services) {
  const select = document.getElementById("requestedService");
  if (!select) {
    return;
  }

  const options = services
    .filter((service) => service.category !== "community")
    .map((service) => `<option value="${escapeHtml(service.title)}">${escapeHtml(service.title)}</option>`)
    .join("");

  select.innerHTML = '<option value="">Select a service</option>' + options;
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) {
    return;
  }

  attachValidation(contactForm);

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm(contactForm)) {
      setStatus(contactForm, "Please correct the highlighted contact form fields.", "error");
      return;
    }

    const formData = new FormData(contactForm);
    const recipient = contactForm.dataset.recipient || "info@tmanoperations.example";
    const resultBox = document.getElementById("contactResult");
    const messageType = formData.get("messageType");
    const subject = `Website ${messageType}: ${formData.get("firstName")} ${formData.get("lastName")}`;
    const body =
      `Name: ${formData.get("firstName")} ${formData.get("lastName")}\n` +
      `Email: ${formData.get("email")}\n` +
      `Phone: ${formData.get("telephone")}\n` +
      `Address: ${formData.get("address")}\n` +
      `Message type: ${messageType}\n\n` +
      `${formData.get("question")}`;

    toggleSubmit(contactForm, true);
    setStatus(contactForm, "Submitting your message...", "info");

    try {
      await submitForm(contactForm, formData);
      setStatus(contactForm, "Your message has been prepared and saved for follow-up.", "success");

      if (resultBox) {
        resultBox.innerHTML =
          `<h3>Email draft ready</h3>
          <p>Your contact details were validated and compiled into an email draft for ${escapeHtml(recipient)}.</p>
          <p><a class="btn btn-secondary" href="mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Open email draft</a></p>`;
      }

      contactForm.reset();
    } catch (error) {
      setStatus(contactForm, "The async submission could not complete. You can still send the prepared email draft below.", "error");

      if (resultBox) {
        resultBox.innerHTML =
          `<h3>Email draft ready</h3>
          <p>The website could not submit the form automatically from this environment, but your message is still ready to send.</p>
          <p><a class="btn btn-secondary" href="mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Open email draft</a></p>`;
      }
    } finally {
      toggleSubmit(contactForm, false);
    }
  });
}

function initEnquiryForm(state) {
  const enquiryForm = document.getElementById("enquiryForm");
  if (!enquiryForm) {
    return;
  }

  attachValidation(enquiryForm);

  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm(enquiryForm)) {
      setStatus(enquiryForm, "Please correct the highlighted enquiry form fields.", "error");
      return;
    }

    const formData = new FormData(enquiryForm);
    const resultBox = document.getElementById("enquiryResult");
    const enquiryType = formData.get("type");
    const requestedService = formData.get("requestedService");
    const matchedService = state.services.find((service) => service.title === requestedService);
    const enquiryResponse = buildEnquiryResponse(enquiryType, matchedService);

    toggleSubmit(enquiryForm, true);
    setStatus(enquiryForm, "Processing your enquiry...", "info");

    try {
      await submitForm(enquiryForm, formData);
      setStatus(enquiryForm, "Your enquiry was submitted successfully.", "success");
    } catch (error) {
      setStatus(enquiryForm, "The website could not submit this enquiry automatically here, but the estimate below has still been generated.", "error");
    } finally {
      toggleSubmit(enquiryForm, false);
    }

    if (resultBox) {
      resultBox.innerHTML =
        `<h3>Your enquiry response</h3>
        <p>${escapeHtml(enquiryResponse.summary)}</p>
        <p><strong>Estimated cost:</strong> ${escapeHtml(enquiryResponse.price)}</p>
        <p><strong>Availability:</strong> ${escapeHtml(enquiryResponse.availability)}</p>
        <p><strong>Next step:</strong> ${escapeHtml(enquiryResponse.nextStep)}</p>`;
    }

    enquiryForm.reset();
  });
}

function buildEnquiryResponse(type, service) {
  if (type === "volunteer") {
    return {
      summary: "Thank you for offering to volunteer with TMAN Operations community work.",
      price: "No cost",
      availability: "Applications reviewed within 3 business days",
      nextStep: "We will contact you with onboarding details and available outreach dates."
    };
  }

  if (type === "sponsor") {
    return {
      summary: "Your sponsorship enquiry has been logged for community project review.",
      price: "Custom package",
      availability: "Proposal discussion within 2 business days",
      nextStep: "A team member will share available sponsorship tiers and campaign needs."
    };
  }

  if (service) {
    return {
      summary: `${service.title} is available for booking in selected Gauteng areas.`,
      price: `From R${Number(service.priceFrom).toLocaleString("en-ZA")}`,
      availability: service.availability,
      nextStep: `A consultant will confirm the final scope, travel, and the ${service.turnaround.toLowerCase()} timeline.`
    };
  }

  return {
    summary: "We received your general service enquiry and prepared an initial estimate.",
    price: "From R450",
    availability: "Scheduling is subject to technician availability",
    nextStep: "A consultant will contact you to confirm the exact service and booking slot."
  };
}

function attachValidation(form) {
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });
}

function validateForm(form) {
  const fields = form.querySelectorAll("input, textarea, select");
  let isValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  if (field.type === "hidden" || field.name === "bot-field") {
    return true;
  }

  field.setCustomValidity("");

  if (field.dataset.validate === "phone") {
    const phonePattern = /^\+?[0-9()\s-]{7,20}$/;
    if (field.value.trim() && !phonePattern.test(field.value.trim())) {
      field.setCustomValidity("Enter a valid phone number.");
    }
  }

  if (field.dataset.minlength) {
    const minLength = Number(field.dataset.minlength);
    if (field.value.trim() && field.value.trim().length < minLength) {
      field.setCustomValidity(`Please enter at least ${minLength} characters.`);
    }
  }

  if (field.dataset.futureDate === "true" && field.value) {
    const selectedDate = new Date(field.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      field.setCustomValidity("Choose a current or future date.");
    }
  }

  if (!field.checkValidity()) {
    showFieldError(field, field.validationMessage);
    return false;
  }

  clearFieldError(field);
  return true;
}

function showFieldError(field, message) {
  const errorId = `${field.id || field.name}-error`;
  let error = document.getElementById(errorId);

  if (!error) {
    error = document.createElement("p");
    error.id = errorId;
    error.className = "field-error";
    field.insertAdjacentElement("afterend", error);
  }

  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", errorId);
  error.textContent = message;
}

function clearFieldError(field) {
  const errorId = `${field.id || field.name}-error`;
  const error = document.getElementById(errorId);

  field.removeAttribute("aria-invalid");
  if (field.getAttribute("aria-describedby") === errorId) {
    field.removeAttribute("aria-describedby");
  }
  if (error) {
    error.remove();
  }
}

async function submitForm(form, formData) {
  if (window.location.protocol === "file:") {
    return Promise.resolve({ simulated: true });
  }

  const response = await fetch(form.action || "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(formData).toString()
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  return response;
}

function toggleSubmit(form, isBusy) {
  const submitButton = form.querySelector('[type="submit"]');
  if (!submitButton) {
    return;
  }

  submitButton.disabled = isBusy;
  submitButton.value = isBusy ? "Sending..." : submitButton.dataset.label || submitButton.value;
}

function setStatus(form, message, type) {
  const status = form.parentElement.querySelector(".form-status");
  if (!status) {
    return;
  }

  status.className = `form-status status-${type}`;
  status.textContent = message;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatCategory(category) {
  if (!category) {
    return "General";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}
