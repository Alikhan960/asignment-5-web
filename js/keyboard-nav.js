/* Keyboard navigation for the main menu.
   Arrow keys move the focus between the menu items, Home / End jump to the first / last one. */
(() => {
  "use strict";

  const links = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));
  if (!links.length) return;

  function focusLink(index) {
    /* wrap around at both ends */
    const target = links[(index + links.length) % links.length];
    target.focus();
    GGSound.play("tick");
  }

  links.forEach((link, index) => {
    link.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusLink(index + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusLink(index - 1);
          break;
        case "Home":
          event.preventDefault();
          focusLink(0);
          break;
        case "End":
          event.preventDefault();
          focusLink(links.length - 1);
          break;
        default:
          /* any other key keeps its normal behaviour (Enter follows the link) */
          break;
      }
    });
  });
})();
