/* BMI calculator (home page).
   An object with methods does the maths; a switch statement chooses the category. */
(() => {
  "use strict";

  const form = document.getElementById("bmi-form");
  const heightInput = document.getElementById("bmi-height");
  const weightInput = document.getElementById("bmi-weight");
  const resultValue = document.getElementById("bmi-value");
  const resultText = document.getElementById("bmi-text");
  const marker = document.getElementById("bmi-marker");
  const resetButton = document.getElementById("bmi-reset");
  if (!form) return;

  /* scale of the bar: BMI 15 (left) ... 40 (right) */
  const SCALE_MIN = 15;
  const SCALE_MAX = 40;

  const calculator = {
    heightCm: 0,
    weightKg: 0,

    /* BMI = weight (kg) / height (m) squared */
    bmi() {
      const meters = this.heightCm / 100;
      return this.weightKg / (meters * meters);
    },

    category() {
      const value = this.bmi();
      switch (true) {
        case value < 18.5:
          return { label: "Underweight", advice: "Focus on progressive strength training and enough calories." };
        case value < 25:
          return { label: "Healthy range", advice: "Keep your mix of strength and cardio going." };
        case value < 30:
          return { label: "Overweight", advice: "Add 2-3 conditioning sessions a week to your lifting." };
        default:
          return { label: "Obesity range", advice: "Start with low-impact cardio and talk to one of our coaches." };
      }
    }
  };

  function showError(message) {
    resultValue.textContent = "--";
    resultText.textContent = message;
    resultText.classList.add("text-danger");
    marker.style.opacity = "0";
    GGSound.play("error");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculator.heightCm = parseFloat(heightInput.value);
    calculator.weightKg = parseFloat(weightInput.value);

    const valid =
      calculator.heightCm >= 100 && calculator.heightCm <= 250 && calculator.weightKg >= 30 && calculator.weightKg <= 300;
    if (!valid) {
      showError("Enter a height from 100 to 250 cm and a weight from 30 to 300 kg.");
      return;
    }

    const value = calculator.bmi();
    const info = calculator.category();
    resultText.classList.remove("text-danger");
    resultValue.textContent = value.toFixed(1);
    resultText.textContent = `${info.label}. ${info.advice}`;

    /* move the marker along the bar (clamped between 0 and 100 %) */
    const percent = Math.min(100, Math.max(0, ((value - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));
    marker.style.opacity = "1";
    marker.style.left = `${percent}%`;
    GGSound.play("success");
  });

  /* reset button clears every input in the form */
  resetButton.addEventListener("click", () => {
    form.querySelectorAll("input").forEach((input) => (input.value = ""));
    resultValue.textContent = "--";
    resultText.textContent = "Enter your height and weight to see your result.";
    resultText.classList.remove("text-danger");
    marker.style.opacity = "0";
    marker.style.left = "0%";
    GGSound.play("click");
  });
})();
