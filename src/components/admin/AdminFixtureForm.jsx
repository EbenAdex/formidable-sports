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
    periodDurationMinutes: "",
  });

  const selectableTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.qualified &&
        String(team.sport || "").toLowerCase() ===
          String(formData.sport || "").toLowerCase() &&
        String(team.category || "").toLowerCase() ===
          String(formData.category || "").toLowerCase()
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
      ...(name === "stage" && value !== "Group Stage"
        ? { competitionGroup: "" }
        : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.homeTeamId || !formData.awayTeamId) {
      alert("Please select both teams.");
      return;
    }

    if (String(formData.homeTeamId) === String(formData.awayTeamId)) {
      alert("Home and away teams cannot be the same.");
      return;
    }

    if (
      formData.stage === "Group Stage" &&
      !String(formData.competitionGroup || "").trim()
    ) {
      alert("Please select a group for group stage fixtures.");
      return;
    }

    const homeTeam = teams.find(
      (team) => String(team.id) === String(formData.homeTeamId)
    );

    const awayTeam = teams.find(
      (team) => String(team.id) === String(formData.awayTeamId)
    );

    if (!homeTeam || !awayTeam) {
      alert("Selected teams are invalid.");
      return;
    }

    onAddFixture({
      sport: formData.sport,
      category: formData.category,
      gender: formData.category,
      stage: formData.stage,
      competitionGroup:
        formData.stage === "Group Stage" ? formData.competitionGroup : "",
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeTeam: homeTeam.department || homeTeam.name,
      awayTeam: awayTeam.department || awayTeam.name,
      date: formData.date,
      kickoffTime: formData.kickoffTime,
      endTime: formData.endTime,
      venue: formData.venue,
      status: "Upcoming",
      postponed: false,
      periodDurationMinutes: Number(formData.periodDurationMinutes) || 0,
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
        periodDurationMinutes: Number(formData.periodDurationMinutes) || 0,
        breakDurationMinutes: 0,
        phase: "Pre-Match",
        isRunning: false,
        startedAt: null,
        pausedAt: null,
        currentPeriodStartedAt: null,
        breakStartedAt: null,
        elapsedSeconds: 0,
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
      periodDurationMinutes: "",
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
          <option value="Quarter Final">Quarter Final</option>
          <option value="Semi Final">Semi Final</option>
          <option value="Final">Final</option>
          <option value="Third Place">Third Place</option>
        </select>

        {formData.stage === "Group Stage" && (
          <select
            name="competitionGroup"
            value={formData.competitionGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Group</option>
            <option value="Group A">Group A</option>
            <option value="Group B">Group B</option>
            <option value="Group C">Group C</option>
            <option value="Group D">Group D</option>
          </select>
        )}

        <select
          name="homeTeamId"
          value={formData.homeTeamId}
          onChange={handleChange}
          required
        >
          <option value="">Select Home Team</option>
          {selectableTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.displayName || `${team.department || team.name} ${team.sport} ${team.category}`}
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
              {team.displayName || `${team.department || team.name} ${team.sport} ${team.category}`}
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

        <input
          type="number"
          name="periodDurationMinutes"
          value={formData.periodDurationMinutes}
          onChange={handleChange}
          placeholder="Period duration (minutes)"
          min={1}
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