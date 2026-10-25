/* Trainers page: category filter (switch), star ratings (querySelectorAll) and live statistics. */
(() => {
  "use strict";

  const cards = Array.from(document.querySelectorAll(".trainer-col"));
  const filterButtons = document.querySelectorAll("[data-filter]");
  const counter = document.getElementById("filter-count");
  const averageBox = document.getElementById("rating-average");
  if (!cards.length) return;

  /* ---------- filtering ---------- */

  /* switch returns the test function that matches the chosen category */
  function getFilter(category) {
    switch (category) {
      case "strength":
        return (card) => card.dataset.category === "strength";
      case "functional":
        return (card) => card.dataset.category === "functional";
      case "performance":
        return (card) => card.dataset.category === "performance";
      default:
        return () => true; /* "all" */
    }
  }

  function applyFilter(category) {
    const matches = getFilter(category);
    let visible = 0;
    cards.forEach((card) => {
      const show = matches(card);
      card.style.display = show ? "" : "none";
      if (show) {
        visible += 1;
        /* restart the appearing animation */
        card.classList.remove("pop-in");
        void card.offsetWidth;
        card.classList.add("pop-in");
      }
    });
    counter.textContent = `Showing ${visible} of ${cards.length} coaches`;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((other) => {
        const active = other === button;
        other.classList.toggle("active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      GGSound.play("click");
      applyFilter(button.dataset.filter);
    });
  });

  /* ---------- star ratings ---------- */

  const ratings = {}; /* trainer name -> rating from 1 to 5 */
  try {
    Object.assign(ratings, JSON.parse(localStorage.getItem("gg-ratings") || "{}"));
  } catch (error) {
    /* ignore broken storage */
  }

  function ratingLabel(value) {
    switch (value) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Great";
      case 5:
        return "Outstanding";
      default:
        return "";
    }
  }

  function paintStars(box, value) {
    box.querySelectorAll(".star").forEach((star) => {
      const filled = Number(star.dataset.value) <= value;
      star.classList.toggle("active", filled); /* gold colour */
      star.setAttribute("aria-checked", String(Number(star.dataset.value) === value));
    });
  }

  /* higher-order functions: Object.values().map() / reduce() */
  function updateAverage() {
    const values = Object.values(ratings).map(Number);
    if (!values.length) {
      averageBox.textContent = "You have not rated any coach yet. Click the stars on a card.";
      return;
    }
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    averageBox.textContent = `Your average rating: ${average.toFixed(1)} / 5 (${values.length} coach${values.length > 1 ? "es" : ""} rated)`;
  }

  document.querySelectorAll(".rating").forEach((box) => {
    const trainer = box.dataset.trainer;
    const message = box.parentElement.querySelector(".rating-text");
    const stars = box.querySelectorAll(".star");

    if (ratings[trainer]) {
      paintStars(box, ratings[trainer]);
      message.textContent = `You rated ${trainer}: ${ratings[trainer]}/5 - ${ratingLabel(ratings[trainer])}`;
    }

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const value = Number(star.dataset.value);
        ratings[trainer] = value;
        paintStars(box, value);
        message.textContent = `You rated ${trainer}: ${value}/5 - ${ratingLabel(value)}`;
        /* bounce animation on the clicked star */
        star.classList.remove("bounce");
        void star.offsetWidth;
        star.classList.add("bounce");
        GGSound.play(`star${value}`);
        try {
          localStorage.setItem("gg-ratings", JSON.stringify(ratings));
        } catch (error) {
          /* ignore */
        }
        updateAverage();
      });

      /* hover preview */
      star.addEventListener("mouseenter", () => {
        const hoverValue = Number(star.dataset.value);
        stars.forEach((s) => s.classList.toggle("hover", Number(s.dataset.value) <= hoverValue));
      });
    });
    box.addEventListener("mouseleave", () => stars.forEach((s) => s.classList.remove("hover")));
  });

  applyFilter("all");
  updateAverage();
})();
