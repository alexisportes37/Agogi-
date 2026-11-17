
/* AGOGI - Weekly Muscle Heatmap Data */
(function () {
  "use strict";

  const STORAGE_KEY = "agogi_muscle_sets_v1";

  function getRecords() {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch {
      return [];
    }
  }

  function saveRecords(records) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );
  }

  function logSet(muscles, date = new Date()) {
    const records = getRecords();

    records.push({
      muscles: [...new Set(muscles)],
      date: new Date(date).toISOString()
    });

    saveRecords(records);
  }

  function getWeeklySets(date = new Date()) {
    const start = new Date(date);
    const day = (start.getDay() + 6) % 7;

    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const totals = {};

    for (const record of getRecords()) {
      const recorded = new Date(record.date);

      if (recorded < start || recorded >= end) {
        continue;
      }

      for (const muscle of record.muscles || []) {
        totals[muscle] = (totals[muscle] || 0) + 1;
      }
    }

    return totals;
  }

  function getIntensity(sets) {
    if (sets <= 0) return 0;
    if (sets <= 3) return 1;
    if (sets <= 7) return 2;
    if (sets <= 11) return 3;
    return 4;
  }

  window.AGOGI_HEATMAP = {
    logSet,
    getWeeklySets,
    getIntensity,
    getRecords
  };
})();
