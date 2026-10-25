/* Prices page: multi-step membership form.
   Next / Back buttons call changeStep(), which uses a callback (renderStep) to show the right step.
   All inputs stay in the page, so their values are kept while moving between steps. */
(() => {
  "use strict";

  const form = document.getElementById("join-form");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".join-step"));
  const dots = Array.from(document.querySelectorAll("#step-dots li"));
  const progress = document.getElementById("step-progress");
  const backButton = document.getElementById("join-back");
  const nextButton = document.getElementById("join-next");
  const resetButton = document.getElementById("join-reset");
  const status = document.getElementById("join-status");
  const summary = document.getElementById("join-summary");
  const stepError = document.getElementById("step-error");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const COACHING_PRICE = 10000;

  /* object with a method that calculates the price */
  const membership = {
    plans: {
      starter: { title: "Starter", price: 15000 },
      standard: { title: "Standard", price: 25000 },
      performance: { title: "Performance", price: 40000 }
    },

    /* discount depends on how many months are paid at once */
    discount(months) {
      switch (months) {
        case 3:
          return 0.05;
        case 12:
          return 0.15;
        default:
          return 0;
      }
    },

    total(planKey, months, withCoaching) {
      const monthly = this.plans[planKey].price + (withCoaching ? COACHING_PRICE : 0);
      const full = monthly * months;
      return Math.round(full * (1 - this.discount(months)));
    }
  };

  let currentStep = 0;

  const money = (value) => `₸${value.toLocaleString("en-US")}`;

  function readChoices() {
    return {
      planKey: form.querySelector('input[name="plan"]:checked').value,
      months: Number(form.elements.months.value),
      coaching: form.elements.coaching.checked,
      name: form.elements.fullname.value.trim(),
      email: form.elements.email.value.trim()
    };
  }

  /* callback: shows only the step with the given index and updates the controls */
  function renderStep(index) {
    steps.forEach((step, stepIndex) => {
      step.style.display = stepIndex === index ? "block" : "none";
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("current", dotIndex === index);
      dot.classList.toggle("done", dotIndex < index);
    });
    progress.style.width = `${((index + 1) / steps.length) * 100}%`;
    backButton.disabled = index === 0;
    nextButton.textContent = index === steps.length - 1 ? "Confirm membership" : "Next";
    stepError.textContent = "";

    if (index === steps.length - 1) {
      const choice = readChoices();
      const plan = membership.plans[choice.planKey];
      summary.innerHTML = "";
      /* build the summary with a loop over [label, value] pairs */
      [
        ["Plan", plan.title],
        ["Period", `${choice.months} month${choice.months > 1 ? "s" : ""}`],
        ["Personal coaching", choice.coaching ? "Yes (+₸10,000 / month)" : "No"],
        ["Name", choice.name],
        ["Email", choice.email],
        ["Total", money(membership.total(choice.planKey, choice.months, choice.coaching))]
      ].forEach(([label, value]) => {
        const term = document.createElement("dt");
        const detail = document.createElement("dd");
        term.textContent = label;
        detail.textContent = value;
        summary.append(term, detail);
      });
    }
    steps[index].classList.remove("slide-in");
    void steps[index].offsetWidth;
    steps[index].classList.add("slide-in");
  }

  /* returns an error message for the current step, or "" if it is valid */
  function validateStep(index) {
    if (index === 2) {
      const choice = readChoices();
      if (choice.name.length < 2) return "Please enter your name (at least 2 characters).";
      if (!EMAIL_RE.test(choice.email)) return "Please enter a valid email, for example name@mail.com.";
    }
    return "";
  }

  /* move forward (+1) or back (-1) and call the callback to display the result */
  function changeStep(direction, callback) {
    if (direction > 0) {
      const error = validateStep(currentStep);
      if (error) {
        stepError.textContent = error;
        GGSound.play("error");
        return;
      }
    }
    const target = currentStep + direction;
    if (target < 0 || target >= steps.length) return;
    currentStep = target;
    callback(currentStep);
    GGSound.play("tick");
  }

  nextButton.addEventListener("click", () => {
    if (currentStep === steps.length - 1) {
      const choice = readChoices();
      status.className = "alert alert-success mt-3";
      status.textContent = `Thank you, ${choice.name}! Your ${membership.plans[choice.planKey].title} membership request was received. Total: ${money(membership.total(choice.planKey, choice.months, choice.coaching))}.`;
      GGSound.play("success");
      return;
    }
    changeStep(1, renderStep);
  });

  backButton.addEventListener("click", () => changeStep(-1, renderStep));

  /* reset button: clear the text fields, restore the defaults and go to step 1 */
  resetButton.addEventListener("click", () => {
    form.reset();
    form.querySelectorAll('input[type="text"], input[type="email"]').forEach((input) => (input.value = ""));
    status.className = "";
    status.textContent = "";
    currentStep = 0;
    renderStep(currentStep);
    updateLivePrice();
    GGSound.play("click");
  });

  /* live price under the plan options (updates on every change) */
  const livePrice = document.getElementById("live-price");
  function updateLivePrice() {
    const choice = readChoices();
    livePrice.textContent = `Estimated total: ${money(membership.total(choice.planKey, choice.months, choice.coaching))}`;
  }
  form.addEventListener("change", updateLivePrice);

  /* Enter must not submit the form */
  form.addEventListener("submit", (event) => event.preventDefault());

  renderStep(currentStep);
  updateLivePrice();
})();
