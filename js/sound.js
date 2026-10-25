/* Sound effects - generated with the Web Audio API, so no audio files are needed.
   Only one effect plays at a time: a new sound stops the previous one (no overlapping). */
const GGSound = (() => {
  "use strict";

  /* every effect is a list of [frequency in Hz, duration in seconds] notes */
  const EFFECTS = {
    click: [[620, 0.07]],
    tick: [[440, 0.05]],
    pop: [[520, 0.06], [780, 0.09]],
    success: [[523, 0.1], [659, 0.1], [784, 0.18]],
    error: [[220, 0.12], [165, 0.2]],
    star1: [[392, 0.09]],
    star2: [[440, 0.09]],
    star3: [[494, 0.09]],
    star4: [[587, 0.09]],
    star5: [[659, 0.08], [880, 0.16]]
  };

  let context = null;
  let activeNodes = [];
  let enabled = true;

  try {
    enabled = localStorage.getItem("gg-sound") !== "off";
  } catch (error) {
    /* storage unavailable - sound stays on */
  }

  function stopCurrent() {
    activeNodes.forEach((node) => {
      try {
        node.stop();
      } catch (error) {
        /* already stopped */
      }
    });
    activeNodes = [];
  }

  function play(name) {
    const notes = EFFECTS[name];
    if (!enabled || !notes) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!context) context = new AudioContextClass();
    if (context.state === "suspended") context.resume();

    stopCurrent();

    let startTime = context.currentTime;
    notes.forEach(([frequency, duration]) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      /* quick fade in/out avoids clicking noises */
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration + 0.02);
      activeNodes.push(oscillator);
      startTime += duration;
    });
  }

  function setEnabled(value) {
    enabled = value;
    if (!enabled) stopCurrent();
    try {
      localStorage.setItem("gg-sound", enabled ? "on" : "off");
    } catch (error) {
      /* ignore */
    }
  }

  /* sound on/off button in the tools bar (present on every page) */
  const soundButton = document.getElementById("sound-btn");

  function renderSoundButton() {
    if (!soundButton) return;
    soundButton.textContent = enabled ? "Sound: On" : "Sound: Off";
    soundButton.setAttribute("aria-pressed", String(enabled));
  }

  if (soundButton) {
    renderSoundButton();
    soundButton.addEventListener("click", () => {
      setEnabled(!enabled);
      renderSoundButton();
      play("click");
    });
  }

  return { play, isEnabled: () => enabled };
})();
