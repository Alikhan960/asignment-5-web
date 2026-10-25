/* Workout of the day (home page).
   Data lives in an array of objects; the list is built with loops and
   the higher-order functions filter, map, reduce and forEach. */
(() => {
  "use strict";

  const listElement = document.getElementById("exercise-list");
  const goalButtons = document.querySelectorAll("[data-goal]");
  const quickToggle = document.getElementById("quick-only");
  const summary = document.getElementById("workout-summary");
  const progressBar = document.getElementById("workout-progress");
  const progressText = document.getElementById("workout-progress-text");
  if (!listElement || !goalButtons.length) return;

  /* array of objects - one object per exercise */
  const exercises = [
    { name: "Back squat", goal: "strength", sets: 5, reps: 5, minutes: 15, calories: 120 },
    { name: "Bench press", goal: "strength", sets: 4, reps: 6, minutes: 12, calories: 90 },
    { name: "Deadlift", goal: "strength", sets: 3, reps: 5, minutes: 10, calories: 110 },
    { name: "Overhead press", goal: "strength", sets: 4, reps: 8, minutes: 8, calories: 70 },
    { name: "Rowing machine", goal: "endurance", sets: 1, reps: 20, minutes: 20, calories: 220 },
    { name: "Kettlebell swings", goal: "endurance", sets: 5, reps: 20, minutes: 10, calories: 130 },
    { name: "Burpees", goal: "endurance", sets: 4, reps: 15, minutes: 8, calories: 100 },
    { name: "Jump rope", goal: "endurance", sets: 6, reps: 60, minutes: 9, calories: 110 },
    { name: "Hip opener flow", goal: "mobility", sets: 2, reps: 10, minutes: 8, calories: 30 },
    { name: "Thoracic rotations", goal: "mobility", sets: 3, reps: 12, minutes: 6, calories: 25 },
    { name: "Hamstring stretch", goal: "mobility", sets: 3, reps: 30, minutes: 6, calories: 20 },
    { name: "Cat-cow and breathing", goal: "mobility", sets: 2, reps: 15, minutes: 5, calories: 15 }
  ];

  /* an object with methods that work with the exercise list */
  const planner = {
    goal: "strength",
    quickOnly: false,

    /* filter keeps only the exercises that match the chosen goal (and the time limit) */
    getPlan() {
      return exercises
        .filter((exercise) => exercise.goal === this.goal)
        .filter((exercise) => (this.quickOnly ? exercise.minutes <= 10 : true));
    },

    /* reduce adds up one property of every exercise in the plan */
    total(plan, property) {
      return plan.reduce((sum, exercise) => sum + exercise[property], 0);
    }
  };

  let doneCount = 0;
  let planLength = 0;

  function describe(exercise) {
    return `${exercise.sets} x ${exercise.reps} - ${exercise.minutes} min - ${exercise.calories} kcal`;
  }

  function updateProgress() {
    const percent = planLength ? Math.round((doneCount / planLength) * 100) : 0;
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(percent));
    progressText.textContent = planLength
      ? `${doneCount} of ${planLength} exercises done (${percent}%)`
      : "No exercises match these filters.";
    progressBar.classList.toggle("complete", planLength > 0 && doneCount === planLength);
  }

  /* callback used by the checkbox change event */
  function onExerciseToggle(event) {
    const row = event.target.closest("li");
    row.classList.toggle("done", event.target.checked);
    doneCount += event.target.checked ? 1 : -1;
    updateProgress();
    if (planLength > 0 && doneCount === planLength) {
      GGSound.play("success");
      summary.textContent = "Workout complete - great job! Rest, drink water and come back tomorrow.";
    } else {
      GGSound.play("pop");
    }
  }

  function render() {
    const plan = planner.getPlan();
    doneCount = 0;
    planLength = plan.length;
    listElement.innerHTML = "";

    /* loop over the plan and create one list item per exercise */
    plan.forEach((exercise, index) => {
      const item = document.createElement("li");
      item.className = "exercise-item";
      item.style.animationDelay = `${index * 70}ms`;
      const id = `exercise-${index}`;
      item.innerHTML =
        `<input class="form-check-input" type="checkbox" id="${id}">` +
        `<label for="${id}"><strong>${exercise.name}</strong><span>${describe(exercise)}</span></label>`;
      item.querySelector("input").addEventListener("change", onExerciseToggle);
      listElement.appendChild(item);
    });

    summary.textContent = planLength
      ? `${planLength} exercises - ${planner.total(plan, "minutes")} minutes - about ${planner.total(plan, "calories")} kcal`
      : "Try turning off the quick-session filter.";
    updateProgress();
  }

  goalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      planner.goal = button.dataset.goal;
      goalButtons.forEach((other) => {
        const active = other === button;
        other.classList.toggle("active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      GGSound.play("click");
      render();
    });
  });

  quickToggle.addEventListener("change", () => {
    planner.quickOnly = quickToggle.checked;
    GGSound.play("click");
    render();
  });

  render();
})();
