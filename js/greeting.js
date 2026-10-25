/* Personal greeting (home page).
   - a switch statement picks the greeting by the time of day
   - the visitor can type a name; the greeting element is found with getElementById and updated */
(() => {
  "use strict";

  const greeting = document.getElementById("greeting");
  const subtitle = document.getElementById("greeting-sub");
  const form = document.getElementById("name-form");
  const input = document.getElementById("name-input");
  if (!greeting || !form || !input) return;

  /* returns the greeting object for the current hour */
  function getDayPart(hour) {
    switch (true) {
      case hour >= 5 && hour < 12:
        return { text: "Good morning", tip: "Morning sessions are quiet - perfect for heavy lifts." };
      case hour >= 12 && hour < 18:
        return { text: "Good afternoon", tip: "Fuel up with a snack and train before the evening rush." };
      case hour >= 18 && hour < 23:
        return { text: "Good evening", tip: "Evening classes are open. Finish the day strong." };
      default:
        return { text: "Hello, night owl", tip: "All clubs are open until 00:00 - mobility work is a great late session." };
    }
  }

  let visitorName = "";
  try {
    visitorName = localStorage.getItem("gg-visitor") || "";
  } catch (error) {
    /* ignore */
  }

  function renderGreeting() {
    const part = getDayPart(new Date().getHours());
    greeting.textContent = visitorName ? `${part.text}, ${visitorName}!` : `${part.text}!`;
    subtitle.textContent = part.tip;
    /* restart the CSS animation */
    greeting.classList.remove("flash");
    void greeting.offsetWidth;
    greeting.classList.add("flash");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      input.classList.add("is-invalid");
      subtitle.textContent = "Please type your name first.";
      GGSound.play("error");
      return;
    }
    input.classList.remove("is-invalid");
    visitorName = value;
    try {
      localStorage.setItem("gg-visitor", value);
    } catch (error) {
      /* ignore */
    }
    renderGreeting();
    GGSound.play("success");
    input.value = "";
  });

  renderGreeting();
})();
