import { useMemo, useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminFixtureForm from "../../components/admin/AdminFixtureForm";
import { useAppData } from "../../context/AppDataContext";
import defaultSportRules from "../../config/defaultSportRules"

function ManageFixtures() {
  const {
    fixtures,
    addFixture,
    deleteFixture,
    updateFixture,
    recalculateAllPlayerStats,
    syncResultsFromEndedFixtures,
    recalculateTablesFromEndedFixtures,
  } = useAppData();

  const [editingFixtureId, setEditingFixtureId] = useState(null);
  const [editForm, setEditForm] = useState({
    sport: "Football",
    category: "Male",
    stage: "Group Stage",
    competitionGroup: "",
    date: "",
    kickoffTime: "",
    endTime: "",
    venue: "",
    status: "Upcoming",
    postponed: false,
  });


useEffect(() => {
  const interval = setInterval(() => {
    fixtures.forEach(fixture => {
      if (
        fixture.status === "Upcoming" &&
        new Date(fixture.date + " " + fixture.kickoffTime) <= new Date()
      ) {
        handleStartMatch(fixture);
      }
    });
  }, 1000 * 30); // check every 30 seconds

  return () => clearInterval(interval);
}, [fixtures]);

  const sortedFixtures = useMemo(() => {
    return [...fixtures].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [fixtures]);

  const handleAddFixture = async (fixture) => {
    await addFixture(fixture);
  };

  const handleStartEdit = (fixture) => {
    setEditingFixtureId(fixture.id);
    setEditForm({
      sport: fixture.sport || "Football",
      category: fixture.category || fixture.gender || "Male",
      stage: fixture.stage || "Group Stage",
      competitionGroup: fixture.competitionGroup || "",
      date: fixture.date || "",
      kickoffTime: fixture.kickoffTime || "",
      endTime: fixture.endTime || "",
      venue: fixture.venue || "",
      status: fixture.status || "Upcoming",
      postponed: !!fixture.postponed,
    });
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    await updateFixture(editingFixtureId, {
      ...editForm,
      gender: editForm.category,
      postponed: editForm.status === "Postponed" ? true : editForm.postponed,
    });

    setEditingFixtureId(null);

    await recalculateAllPlayerStats();
    await syncResultsFromEndedFixtures();
    await recalculateTablesFromEndedFixtures();
  };

  const handleCancelEdit = () => {
    setEditingFixtureId(null);
  };

  const handleDeleteFixture = async (id) => {
    await deleteFixture(id);
  };

function getRulesForSport(sportName) {
  return defaultSportRules.find(
    (rule) => rule.sport.toLowerCase() === sportName.toLowerCase()
  );
}

const handleStartMatch = async (fixture) => {
  const rules = getRulesForSport(fixture.sport);
  if (!rules) {
    alert("No rules defined for this sport");
    return;
  }

  if (rules.mode === "clock") {
    // Time-based sports (Football, Basketball)
    await updateFixture(fixture.id, {
      status: "Live",
      postponed: false,
      timing: {
        mode: "clock",
        currentPeriod: 1,
        totalPeriods: rules.periods,
        periodLabel: rules.periodLabel,
        periodDurationMinutes: fixture.periodDurationMinutes || rules.minutesPerPeriod,
        phase: "Live",
        isRunning: true,
        startedAt: new Date().toISOString(),
        currentPeriodStartedAt: new Date().toISOString(),
        remainingSeconds: (fixture.periodDurationMinutes || rules.minutesPerPeriod) * 60,
        halftimeAfterPeriod: rules.halftimeAfterPeriod,
        halftimeMinutes: rules.halftimeMinutes,
        shortBreakMinutes: rules.shortBreakMinutes,
      },
    });
  }

  if (rules.mode === "sets") {
    // Set-based sports (Volleyball, Table Tennis)
    await updateFixture(fixture.id, {
      status: "Live",
      postponed: false,
      timing: {
        mode: "sets",
        currentSetNumber: 1,
        totalSetsToWin: rules.setsToWin,
        setTargets: rules.setTargets,
        winByTwo: rules.winByTwo,
        homeSetsWon: 0,
        awaySetsWon: 0,
        currentSetHome: 0,
        currentSetAway: 0,
        phase: "Live",
        isRunning: true,
        intervalBetweenSetsMinutes: rules.intervalBetweenSetsMinutes,
      },
    });
  }
};

  const handleFinishMatch = async (id) => {
    await updateFixture(id, {
      status: "Ended",
      postponed: false,
    });

    await recalculateAllPlayerStats();
    await syncResultsFromEndedFixtures();
    await recalculateTablesFromEndedFixtures();
  };

  const handlePostponeMatch = async (id) => {
    await updateFixture(id, {
      status: "Postponed",
      postponed: true,
    });
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Fixtures</h2>
        <p>Add, update, postpone, start, end, and delete fixtures.</p>
        <AdminFixtureForm onAddFixture={handleAddFixture} />
      </div>

      {editingFixtureId && (
        <div className="admin-section-card">
          <h2>Edit Fixture</h2>

          <form className="admin-form" onSubmit={handleSaveEdit}>
            <div className="admin-form__grid">
              <input
                type="text"
                name="sport"
                value={editForm.sport}
                onChange={handleEditChange}
                placeholder="Sport"
                required
              />

              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input
                type="text"
                name="stage"
                value={editForm.stage}
                onChange={handleEditChange}
                placeholder="Stage"
                required
              />

              <input
                type="text"
                name="competitionGroup"
                value={editForm.competitionGroup}
                onChange={handleEditChange}
                placeholder="Group"
              />

              <input
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
                required
              />

              <input
                type="text"
                name="kickoffTime"
                value={editForm.kickoffTime}
                onChange={handleEditChange}
                placeholder="Kickoff time"
                required
              />

              <input
                type="text"
                name="endTime"
                value={editForm.endTime}
                onChange={handleEditChange}
                placeholder="End time"
                required
              />

              <input
                type="text"
                name="venue"
                value={editForm.venue}
                onChange={handleEditChange}
                placeholder="Venue"
                required
              />

              <input
  type="number"
  name="periodDurationMinutes"
  value={editForm.periodDurationMinutes}
  onChange={handleEditChange}
  placeholder="Enter period duration (minutes)"
  min={1}
  required
/>

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Ended">Ended</option>
                <option value="Postponed">Postponed</option>
              </select>
            </div>

            <div className="admin-actions">
              <button type="submit">Save Fixture</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-section-card">
        <h2>Fixture List</h2>

        <div className="admin-list">
          {sortedFixtures.length ? (
            sortedFixtures.map((fixture) => (
              <div className="admin-list-card" key={fixture.id}>
                <h3>
                  {fixture.homeTeam} vs {fixture.awayTeam}
                </h3>
                <p>
                  <strong>Sport:</strong> {fixture.sport}
                </p>
                <p>
                  <strong>Category:</strong> {fixture.category || fixture.gender}
                </p>
                <p>
                  <strong>Status:</strong> {fixture.status}
                </p>
                <p>
                  <strong>Date:</strong> {fixture.date}
                </p>
                <p>
                  <strong>Time:</strong> {fixture.kickoffTime} - {fixture.endTime}
                </p>
                <p>
                  <strong>Venue:</strong> {fixture.venue}
                </p>

                <div className="admin-actions">
                  <button type="button" onClick={() => handleStartEdit(fixture)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteFixture(fixture.id)}>
                    Delete
                  </button>

                  {fixture.status !== "Live" && fixture.status !== "Ended" && (
                    <button type="button" onClick={() => handleStartMatch(fixture)}>
                      Start Match
                    </button>
                    )}
                  

                  {fixture.status !== "Ended" && (
                    <button type="button" onClick={() => handleFinishMatch(fixture.id)}>
                      End Match
                    </button>
                  )}

                  {fixture.status !== "Postponed" && (
                    <button type="button" onClick={() => handlePostponeMatch(fixture.id)}>
                      Postpone
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No fixtures available.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageFixtures;