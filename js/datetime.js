/* Task 5 - Current date and time (author: Yelnur Akhmetzhan) */
(function () {
  "use strict";

  var output = document.getElementById("datetime");
  if (!output) return;

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /* format: "October 9, 2026, 10:45:07 AM" */
  function format(d) {
    var h = d.getHours();
    var suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + ", " + h + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + " " + suffix;
  }

  function tick() {
    var now = new Date();
    output.textContent = format(now);
    output.setAttribute("datetime", now.toISOString());
  }

  tick();
  setInterval(tick, 1000); /* refresh every second */
})();
