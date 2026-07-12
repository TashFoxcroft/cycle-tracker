function toDateKey(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    function getDayOfCycle(lastPeriodStart, cycleLength) {
      const start = new Date(lastPeriodStart);
      const today = new Date();
      start.setHours(0,0,0,0); today.setHours(0,0,0,0);
      const diffDays = Math.floor((today - start) / 86400000);
      return ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
    }

    // Predicted period days, fertile window, and ovulation day for a given displayed month
    function getCycleCalendarData(lastPeriod, cycleLength, year, month) {
      const predictedDays = new Set();
      const fertileDays = new Set();
      let ovulationKey = null;

      const cycleStartBase = new Date(lastPeriod + "T00:00:00");
      cycleStartBase.setHours(0,0,0,0);

      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      const diffToMonthStart = Math.floor((monthStart - cycleStartBase) / 86400000);
      const cyclesBack = Math.floor(diffToMonthStart / cycleLength) - 1;

      for (let c = cyclesBack; c <= cyclesBack + 3; c++) {
        const cycleStart = new Date(cycleStartBase);
        cycleStart.setDate(cycleStart.getDate() + c * cycleLength);

        for (let i = 0; i < 5; i++) {
          const d = new Date(cycleStart);
          d.setDate(d.getDate() + i);
          if (d >= monthStart && d <= monthEnd) predictedDays.add(toDateKey(d));
        }

        const ovDate = new Date(cycleStart);
        ovDate.setDate(ovDate.getDate() + Math.round(cycleLength * 0.5));
        if (ovDate >= monthStart && ovDate <= monthEnd) ovulationKey = toDateKey(ovDate);

        for (let i = -5; i <= 0; i++) {
          const d = new Date(ovDate);
          d.setDate(d.getDate() + i);
          if (d >= monthStart && d <= monthEnd) fertileDays.add(toDateKey(d));
        }
      }

      return { predictedDays: [...predictedDays], fertileDays: [...fertileDays], ovulationKey };
    }

    function getPhase(day, cycleLength) {
      if (day <= 5) return "menstrual";
      if (day <= Math.round(cycleLength * 0.46)) return "follicular";
      if (day <= Math.round(cycleLength * 0.57)) return "ovulation";
      return "luteal";
    }

    function formatDate(dateStr) {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" });
    }

    // Finds the first day of each logged period: a day with flow logged
    // where the previous day had no flow logged. Returns date keys, oldest first.
    function getPeriodStarts(logs) {
      const flowDays = Object.keys(logs)
        .filter(key => logs[key] && logs[key].flow != null)
        .sort();

      const starts = [];
      flowDays.forEach(key => {
        const d = new Date(key + "T00:00:00");
        d.setDate(d.getDate() - 1);
        const prevKey = toDateKey(d);
        if (!flowDays.includes(prevKey)) starts.push(key);
      });

      return starts;
    }

    // Calculates average cycle length from real logged period starts.
    // Uses at most the last 6 cycles, and ignores implausible gaps
    // (e.g. missed logging months) so one bad gap doesn't skew the average.
    function getAutoCycleStats(logs) {
      const starts = getPeriodStarts(logs);
      const mostRecentStart = starts.length ? starts[starts.length - 1] : null;

      if (starts.length < 2) {
        return { averageCycleLength: null, cycleCount: 0, mostRecentStart };
      }

      const diffs = [];
      for (let i = 1; i < starts.length; i++) {
        const a = new Date(starts[i - 1] + "T00:00:00");
        const b = new Date(starts[i] + "T00:00:00");
        const days = Math.round((b - a) / 86400000);
        if (days >= 15 && days <= 60) diffs.push(days);
      }

      const recentDiffs = diffs.slice(-6);

      if (recentDiffs.length === 0) {
        return { averageCycleLength: null, cycleCount: 0, mostRecentStart };
      }

      const avg = Math.round(recentDiffs.reduce((sum, d) => sum + d, 0) / recentDiffs.length);
      return { averageCycleLength: avg, cycleCount: recentDiffs.length, mostRecentStart };
    }
