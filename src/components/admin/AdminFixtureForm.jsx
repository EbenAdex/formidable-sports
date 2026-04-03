import { useMemo, useState } from "react";
import { useAppData } from "../../context/AppDataContext";

function AdminFixtureForm({ onAddFixture }) {
  const { teams, sports } = useAppData();

  const [formData, setFormData] = useState({
    sport: "Football",
    category: "Male",
    stage: "Group Stage",
    competitionGroup: "",
    homeTeamId: "",
    awayTeamId: "",
    date: "",
    kickoffTime: "",
    endTime: "",
    venue: "",
    status: "Upcoming",
  });

  const selectableTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.qualified &&
        (team.category || "").toLowerCase() === formData.category.toLowerCase() &&
        (team.sports || []).some(
          (sport) => sport.toLowerCase() === formData.sport.toLowerCase()
        )
    );
  }, [teams, formData.category, formData.sport]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "sport" || name === "category"
        ? { homeTeamId: "", awayTeamId: "" }
        : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.homeTeamId || !formData.awayTeamId) return;
    if (String(formData.homeTeamId) === String(formData.awayTeamId)) return;

    onAddFixture({
  ...formData,
  homeTeamId: formData.homeTeamId,
  awayTeamId: formData.awayTeamId,
  postponed: false,
  status: "Upcoming",
  score: { home: 0, away: 0 },
  cards: {
    homeYellow: 0,
    awayYellow: 0,
    homeRed: 0,
    awayRed: 0,
  },
  substitutions: {
    home: 0,
    away: 0,
  },
  lineups: {
    homeCoach: "",
    awayCoach: "",
    homePlayerIds: [],
    awayPlayerIds: [],
  },
  events: [],
  timing: {
    mode: "clock",
    currentPeriod: 0,
    totalPeriods: 0,
    periodLabel: "",
    periodDurationMinutes: 0,
    breakDurationMinutes: 0,
    phase: "Pre-Match",
    isRunning: false,
    startedAt: null,
    pausedAt: null,
    currentPeriodStartedAt: null,
    breakStartedAt: null,
    remainingSeconds: 0,
    homeSetsWon: 0,
    awaySetsWon: 0,
    sets: [],
    currentSetNumber: 0,
    currentSetHome: 0,
    currentSetAway: 0,
  },
});

    setFormData({
      sport: "Football",
      category: "Male",
      stage: "Group Stage",
      competitionGroup: "",
      homeTeamId: "",
      awayTeamId: "",
      date: "",
      kickoffTime: "",
      endTime: "",
      venue: "",
      status: "Upcoming",
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__grid">
        <select name="sport" value={formData.sport} onChange={handleChange}>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.name}>
              {sport.name}
            </option>
          ))}
        </select>

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select name="stage" value={formData.stage} onChange={handleChange}>
          <option value="Group Stage">Group Stage</option>
          <option value="Final">Final</option>
          <option value="Third Place">Third Place</option>
        </select>

        <input
          type="text"
          name="competitionGroup"
          placeholder="Group (optional)"
          value={formData.competitionGroup}
          onChange={handleChange}
        />

        <select
          name="homeTeamId"
          value={formData.homeTeamId}
          onChange={handleChange}
          required
        >
          <option value="">Select Home Team</option>
          {selectableTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <select
          name="awayTeamId"
          value={formData.awayTeamId}
          onChange={handleChange}
          required
        >
          <option value="">Select Away Team</option>
          {selectableTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="kickoffTime"
          placeholder="Kickoff Time"
          value={formData.kickoffTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="endTime"
          placeholder="End Time"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn--primary">
        Add Fixture
      </button>
    </form>
  );
}

export default AdminFixtureForm;