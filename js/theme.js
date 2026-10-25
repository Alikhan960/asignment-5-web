/* Day / Night theme switch.
   The theme is a CSS class on <body>; all colours come from CSS variables (see styles.css). */
(() => {
  "use strict";

  const button = document.getElementById("theme-btn");
  const colourButton = document.getElementById("bg-color-btn");
  if (!button) return;

  let isDay = false;
  try {
    isDay = localStorage.getItem("gg-theme") === "day";
  } catch (error) {
    /* storage unavailable - start in night mode */
  }

  function applyTheme() {
    document.body.classList.toggle("theme-day", isDay);
    button.textContent = isDay ? "Switch to Night" : "Switch to Day";
    button.setAttribute("aria-pressed", String(isDay));
    /* the background colour picker only makes sense on the dark theme */
    if (colourButton) {
      colourButton.disabled = isDay;
      colourButton.title = isDay ? "Available in Night mode" : "";
    }
  }

  button.addEventListener("click", () => {
    isDay = !isDay;
    applyTheme();
    GGSound.play("click");
    try {
      localStorage.setItem("gg-theme", isDay ? "day" : "night");
    } catch (error) {
      /* ignore */
    }
  });

  applyTheme();
})();
