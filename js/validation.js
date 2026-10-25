/* Task 1 - Form validation (author: Alikhan Yertaiuly) */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MIN_PASSWORD = 8;

  function field(id) {
    return document.getElementById(id);
  }

  function setError(input, message) {
    var box = document.getElementById(input.id + "-error");
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    input.setAttribute("aria-invalid", "true");
    if (box) box.textContent = message;
  }

  function setValid(input) {
    var box = document.getElementById(input.id + "-error");
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    input.setAttribute("aria-invalid", "false");
    if (box) box.textContent = "";
  }

  /* every validator returns an error string or "" when the value is correct */
  var rules = {
    name: function (v) {
      v = v.trim();
      if (!v) return "Name is required.";
      if (v.length < 2) return "Name must contain at least 2 characters.";
      if (!/^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүІіҺһ\s'-]+$/.test(v)) return "Name can contain only letters.";
      return "";
    },
    email: function (v) {
      v = v.trim();
      if (!v) return "Email is required.";
      if (!EMAIL_RE.test(v)) return "Enter a valid email, for example name@mail.com.";
      return "";
    },
    password: function (v) {
      if (!v) return "Password is required.";
      if (v.length < MIN_PASSWORD) return "Password must be at least " + MIN_PASSWORD + " characters long.";
      if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) return "Password must contain letters and digits.";
      return "";
    },
    confirm: function (v) {
      if (!v) return "Please confirm your password.";
      if (v !== field("password").value) return "Passwords do not match.";
      return "";
    },
    message: function (v) {
      v = v.trim();
      if (!v) return "Message is required.";
      if (v.length < 10) return "Message must contain at least 10 characters.";
      return "";
    }
  };

  function validateField(id) {
    var input = field(id);
    var error = rules[id](input.value);
    if (error) setError(input, error);
    else setValid(input);
    return !error;
  }

  function validateConsent() {
    var box = field("consent");
    var msg = document.getElementById("consent-error");
    var ok = box.checked;
    box.classList.toggle("is-invalid", !ok);
    msg.textContent = ok ? "" : "You must agree to be contacted.";
    return ok;
  }

  Object.keys(rules).forEach(function (id) {
    var input = field(id);
    input.addEventListener("blur", function () {
      validateField(id);
    });
    input.addEventListener("input", function () {
      if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) validateField(id);
      /* keep the confirmation in sync while the password is edited */
      if (id === "password" && field("confirm").value) validateField("confirm");
    });
  });
  field("consent").addEventListener("change", validateConsent);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var status = document.getElementById("form-status");
    var results = Object.keys(rules).map(validateField);
    results.push(validateConsent());

    if (results.indexOf(false) !== -1) {
      status.className = "alert alert-danger mt-3";
      status.textContent = "Please fix the highlighted fields and try again.";
      GGSound.play("error");
      var firstBad = form.querySelector(".is-invalid");
      if (firstBad) firstBad.focus();
      return;
    }

    GGSound.play("success");
    status.className = "alert alert-success mt-3";
    status.textContent = "Thank you, " + field("name").value.trim() + "! Your request has been sent.";
    form.reset();
    form.querySelectorAll(".is-valid, .is-invalid").forEach(function (el) {
      el.classList.remove("is-valid", "is-invalid");
    });
  });
})();
