/* Task 4 - Change background colour (author: Akejan Ahmetov) */
(function () {
  "use strict";

  var button = document.getElementById("bg-color-btn");
  if (!button) return;

  /* dark shades keep the light text readable */
  var colors = ["#17140f", "#10222b", "#2a1519", "#142619", "#231a33", "#2e2a12"];
  var index = 0;

  try {
    var saved = parseInt(localStorage.getItem("gg-bg-index"), 10);
    if (!isNaN(saved) && saved >= 0 && saved < colors.length) index = saved;
  } catch (e) {
    /* storage unavailable - ignore */
  }
  document.body.style.backgroundColor = colors[index];

  button.addEventListener("click", function () {
    index = (index + 1) % colors.length;
    document.body.style.backgroundColor = colors[index];
    try {
      localStorage.setItem("gg-bg-index", String(index));
    } catch (e) {
      /* ignore */
    }
  });
})();
