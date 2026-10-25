/* Task 3 - Popup subscription form (author: Akejan Ahmetov) */
(function () {
  "use strict";

  var overlay = document.getElementById("subscribe-popup");
  var openBtns = document.querySelectorAll("[data-open-popup]");
  if (!overlay || !openBtns.length) return;

  var closeBtn = overlay.querySelector(".popup-close");
  var form = overlay.querySelector("form");
  var emailInput = document.getElementById("popup-email");
  var status = document.getElementById("popup-status");
  var lastFocused = null;

  function openPopup() {
    lastFocused = document.activeElement;
    overlay.classList.add("show");
    GGSound.play("pop");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");
    emailInput.focus();
  }

  function closePopup() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");
    if (lastFocused) lastFocused.focus();
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", openPopup);
  });
  closeBtn.addEventListener("click", closePopup);

  /* click outside the white box closes the popup */
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closePopup();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("show")) closePopup();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      status.className = "text-danger mt-2 mb-0";
      status.textContent = "Please enter a valid email address.";
      emailInput.classList.add("is-invalid");
      GGSound.play("error");
      return;
    }
    emailInput.classList.remove("is-invalid");
    status.className = "text-success mt-2 mb-0";
    GGSound.play("success");
    status.textContent = "Subscribed! Thank you, " + value + ".";
    form.reset();
    setTimeout(closePopup, 1500);
  });
})();
