
/* AGOGI - Interactive Muscle Map */

(function () {
  "use strict";

  const AGOGI_MUSCLES = {
    chest: "Chest",
    shoulders: "Shoulders",
    biceps: "Biceps",
    triceps: "Triceps",
    back: "Back",
    abs: "Abs",
    quads: "Quadriceps",
    hamstrings: "Hamstrings",
    glutes: "Glutes",
    calves: "Calves"
  };

  function getMuscleIntensity(muscle) {
    const heatmap = window.AGOGI_HEATMAP;

    if (!heatmap) return 0;

    const weeklySets = heatmap.getWeeklySets();
    const sets = weeklySets[muscle] || 0;

    return heatmap.getIntensity(sets);
  }

  window.AGOGI_MUSCLE_MAP = {
    muscles: AGOGI_MUSCLES,
    getMuscleIntensity
  };
})();
