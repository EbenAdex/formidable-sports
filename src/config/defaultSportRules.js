const defaultSportRules = [
  {
    sport: "Football",
    mode: "clock",
    periods: 2,
    periodLabel: "Half",
    minutesPerPeriod: 30,
    halftimeAfterPeriod: 1,
    halftimeMinutes: 10,
    shortBreakMinutes: 0,
  },
  {
    sport: "Basketball",
    mode: "clock",
    periods: 4,
    periodLabel: "Quarter",
    minutesPerPeriod: 10,
    halftimeAfterPeriod: 2,
    halftimeMinutes: 10,
    shortBreakMinutes: 2,
  },
  {
    sport: "Volleyball",
    mode: "sets",
    setsToWin: 3,
    setTargets: [25, 25, 25, 25, 15],
    winByTwo: true,
    intervalBetweenSetsMinutes: 2,
  },
  {
    sport: "Table Tennis",
    mode: "sets",
    setsToWin: 3,
    setTargets: [11, 11, 11, 11, 11],
    winByTwo: true,
    intervalBetweenSetsMinutes: 1,
  },
  {
    sport: "Tennis",
    mode: "sets",
    setsToWin: 2,
    setTargets: [6, 6, 6],
    winByTwo: true,
    intervalBetweenSetsMinutes: 2,
  },
];

export default defaultSportRules;