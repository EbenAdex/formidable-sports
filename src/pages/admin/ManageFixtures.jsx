import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminFixtureForm from "../../components/admin/AdminFixtureForm";
import { useAppData } from "../../context/AppDataContext";

function ManageFixtures() {
  const {
    fixtures,
    teams,
    addFixture,
    deleteFixture,
    updateFixture,
  } = useAppData();

  const navigate = useNavigate();
  const [editingFixtureId, setEditingFixtureId] = useState(null);

  const [editForm, setEditForm] = useState({
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
    postponed: false,
    periodDurationMinutes: "",
  });

  const sortedFixtures = useMemo(() => {
    return [...fixtures].sort((a, b) =>
      String(a.date || "").localeCompare(String(b.date || ""))
    );
  }, [fixtures]);

  const editableTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.qualified &&
        String(team.sport || "").toLowerCase() ===
          String(editForm.sport || "").toLowerCase() &&
        String(team.category || "").toLowerCase() ===
          String(editForm.category || "").toLowerCase()
    );
  }, [teams, editForm.sport, editForm.category]);

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
      homeTeamId: fixture.homeTeamId ? String(fixture.homeTeamId) : "",
      awayTeamId: fixture.awayTeamId ? String(fixture.awayTeamId) : "",
      date: fixture.date || "",
      kickoffTime: fixture.kickoffTime || "",
      endTime: fixture.endTime || "",
      venue: fixture.venue || "",
      status: fixture.status || "Upcoming",
      postponed: !!fixture.postponed,
      periodDurationMinutes:
        fixture.timing?.periodDurationMinutes ||
        fixture.periodDurationMinutes ||
        "",
    });
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setEditForm((prev) => {
      const nextValue = type === "checkbox" ? checked : value;

      if (name === "sport" || name === "category") {
        return {
          ...prev,
          [name]: nextValue,
          homeTeamId: "",
          awayTeamId: "",
        };
      }

      if (name === "stage" && value !== "Group Stage") {
        return {
          ...prev,
          stage: value,
          competitionGroup: "",
        };
      }

      return {
        ...prev,
        [name]: nextValue,
      };
    });
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editForm.homeTeamId || !editForm.awayTeamId) {
      alert("Please select both teams.");
      return;
    }

    if (String(editForm.homeTeamId) === String(editForm.awayTeamId)) {
      alert("Home and away teams cannot be the same.");
      return;
    }

    if (
      editForm.stage === "Group Stage" &&
      !String(editForm.competitionGroup || "").trim()
    ) {
      alert("Please select a group for group stage fixtures.");
      return;
    }

    const homeTeam = teams.find(
      (team) => String(team.id) === String(editForm.homeTeamId)
    );
    const awayTeam = teams.find(
      (team) => String(team.id) === String(editForm.awayTeamId)
    );

    if (!homeTeam || !awayTeam) {
      alert("Selected teams are invalid.");
      return;
    }

    await updateFixture(editingFixtureId, {
      ...editForm,
      gender: editForm.category,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeTeam: homeTeam.department || homeTeam.name,
      awayTeam: awayTeam.department || awayTeam.name,
      postponed: editForm.status === "Postponed" ? true : editForm.postponed,
      periodDurationMinutes: Number(editForm.periodDurationMinutes) || 0,
      timing: {
        ...(fixtures.find((item) => String(item.id) === String(editingFixtureId))
          ?.timing || {}),
        periodDurationMinutes: Number(editForm.periodDurationMinutes) || 0,
      },
    });

    setEditingFixtureId(null);
  };

  const handleCancelEdit = () => {
    setEditingFixtureId(null);
  };

  const handleDeleteFixture = async (id) => {
    await deleteFixture(id);
  };

  const handlePostponeMatch = async (id) => {
    const fixture = fixtures.find((item) => String(item.id) === String(id));

    await updateFixture(id, {
      status: "Postponed",
      postponed: true,
      timing: {
        ...(fixture?.timing || {}),
        isRunning: false,
        phase: "Postponed",
      },
    });
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Fixtures</h2>
        <p>Add, edit, postpone, or delete fixtures. Match start and live control happen only inside Live Match Control.</p>
        <AdminFixtureForm onAddFixture={handleAddFixture} />
      </div>

      {editingFixtureId && (
        <div className="admin-section-card">
          <h2>Edit Fixture</h2>

          <form className="admin-form" onSubmit={handleSaveEdit}>
            <div className="admin-form__grid">
              <select name="sport" value={editForm.sport} onChange={handleEditChange} required>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Table Tennis">Table Tennis</option>
                <option value="Tennis">Tennis</option>
              </select>

              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select name="stage" value={editForm.stage} onChange={handleEditChange}>
                <option value="Group Stage">Group Stage</option>
                <option value="Quarter Final">Quarter Final</option>
                <option value="Semi Final">Semi Final</option>
                <option value="Final">Final</option>
                <option value="Third Place">Third Place</option>
              </select>

              {editForm.stage === "Group Stage" && (
                <select
                  name="competitionGroup"
                  value={editForm.competitionGroup}
                  onChange={handleEditChange}
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
                value={editForm.homeTeamId}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Home Team</option>
                {editableTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.displayName || `${team.department || team.name} ${team.sport} ${team.category}`}
                  </option>
                ))}
              </select>

              <select
                name="awayTeamId"
                value={editForm.awayTeamId}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Away Team</option>
                {editableTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.displayName || `${team.department || team.name} ${team.sport} ${team.category}`}
                  </option>
                ))}
              </select>

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
                placeholder="Period duration (minutes)"
                min={1}
                required
              />

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Postponed">Postponed</option>
                <option value="Ended">Ended</option>
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
                <p><strong>Sport:</strong> {fixture.sport}</p>
                <p><strong>Category:</strong> {fixture.category || fixture.gender}</p>
                <p><strong>Stage:</strong> {fixture.stage}</p>
                <p><strong>Group:</strong> {fixture.competitionGroup || "N/A"}</p>
                <p><strong>Status:</strong> {fixture.status}</p>
                <p><strong>Date:</strong> {fixture.date}</p>
                <p><strong>Time:</strong> {fixture.kickoffTime} - {fixture.endTime}</p>
                <p><strong>Venue:</strong> {fixture.venue}</p>

                <div className="admin-actions">
                  <button type="button" onClick={() => handleStartEdit(fixture)}>
                    Edit
                  </button>

                  <button type="button" onClick={() => navigate(`/admin/live?match=${fixture.id}`)}>
                    Open Live Control
                  </button>

                  <button type="button" onClick={() => handleDeleteFixture(fixture.id)}>
                    Delete
                  </button>

                  {fixture.status !== "Postponed" && fixture.status !== "Ended" && (
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