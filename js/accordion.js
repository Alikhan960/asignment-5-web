/* Task 2 - Accordion for FAQ (author: Yelnur Akhmetzhan) */
(function () {
  "use strict";

  var items = document.querySelectorAll(".accordion-item-gg");
  if (!items.length) return;

  function close(item) {
    var button = item.querySelector(".accordion-question");
    var panel = item.querySelector(".accordion-answer");
    item.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = "0px"; /* hidden by default and when clicked again */
  }

  function open(item) {
    var button = item.querySelector(".accordion-question");
    var panel = item.querySelector(".accordion-answer");
    item.classList.add("open");
    button.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = panel.scrollHeight + "px"; /* CSS transition animates this */
  }

  items.forEach(function (item) {
    close(item);
    item.querySelector(".accordion-question").addEventListener("click", function () {
      if (item.classList.contains("open")) close(item);
      else open(item);
    });
  });

  /* keep the open panels the right height when the window is resized */
  window.addEventListener("resize", function () {
    items.forEach(function (item) {
      if (item.classList.contains("open")) {
        var panel = item.querySelector(".accordion-answer");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
})();
