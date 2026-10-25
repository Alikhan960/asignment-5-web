/* Contact page: "Reset form" button clears every input and removes the validation marks. */
(() => {
  "use strict";

  const button = document.getElementById("contact-reset");
  const form = document.getElementById("contact-form");
  if (!button || !form) return;

  button.addEventListener("click", () => {
    form.querySelectorAll("input, textarea").forEach((field) => {
      if (field.type === "checkbox" || field.type === "radio") field.checked = field.defaultChecked;
      else field.value = "";
    });
    form.querySelectorAll("select").forEach((select) => (select.selectedIndex = 0));
    form.querySelectorAll(".is-valid, .is-invalid").forEach((field) => field.classList.remove("is-valid", "is-invalid"));
    form.querySelectorAll(".error-text").forEach((box) => (box.textContent = ""));
    const status = document.getElementById("form-status");
    status.className = "";
    status.textContent = "";
    GGSound.play("click");
  });
})();
