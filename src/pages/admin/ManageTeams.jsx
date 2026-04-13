import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";
import facultyDepartments from "../../data/facultyDepartments";


function ManageTeams() {
  const {
    teams,
    sports,
    addTeam,
    updateTeam,
    deleteTeam,
    addPlayerToTeam,
    updatePlayerInTeam,
    deletePlayerFromTeam,
    isSquadValid,
  } = useAppData();

  const [teamForm, setTeamForm] = useState({
    department: "",
    sport: "",
    logo: "",
    about: "",
    coachName: "",
    coachAbout: "",
    qualified: true,
    category: "Male",
  });

  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  
  const [teamEditForm, setTeamEditForm] = useState({
    department: "",
    sport: "",
    logo: "",
    about: "",
    coachName: "",
    coachAbout: "",
    qualified: true,
    category: "Male",
  });

  const [playerForm, setPlayerForm] = useState({
    name: "",
    position: "",
    jerseyNumber: "",
    goals: "",
    cleanSheets: "",
    points: "",
    appearances: "",
  });

  const [teamCategoryFilter, setTeamCategoryFilter] = useState("all");
  const [teamSportFilter, setTeamSportFilter] = useState("all");
  const [uploading, setUploading] = useState(false);


  const selectedTeam = useMemo(
    () => teams.find((team) => String(team.id) === String(selectedTeamId)),
    [teams, selectedTeamId]
  );

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const categoryMatch =
        teamCategoryFilter === "all" ||
        String(team.category || "").toLowerCase() === teamCategoryFilter.toLowerCase();

      const sportMatch =
        teamSportFilter === "all" ||
        String(team.sport || "").toLowerCase() === teamSportFilter.toLowerCase();

      return categoryMatch && sportMatch;
    });
  }, [teams, teamCategoryFilter, teamSportFilter]);

  const maleTeams = useMemo(
    () => filteredTeams.filter((team) => String(team.category || "").toLowerCase() === "male"),
    [filteredTeams]
  );

  const femaleTeams = useMemo(
    () => filteredTeams.filter((team) => String(team.category || "").toLowerCase() === "female"),
    [filteredTeams]
  );

  const unidentifiedTeams = useMemo(
    () =>
      teams.filter(
        (team) => !["male", "female"].includes(String(team.category || "").toLowerCase())
      ),
    [teams]
  );

  const selectableTeams = useMemo(() => filteredTeams, [filteredTeams]);

  const handleTeamChange = (event) => {
    const { name, value, type, checked } = event.target;

    setTeamForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };



  const handleCreateTeam = async (event) => {
  event.preventDefault();

  if (!teamForm.department.trim() || !teamForm.sport.trim()) {
    alert("Department and sport are required.");
    return;
  }

  const duplicateTeam = teams.find(
    (team) =>
      String(team.department || team.name || "").toLowerCase() ===
        teamForm.department.trim().toLowerCase() &&
      String(team.sport || "").toLowerCase() ===
        teamForm.sport.trim().toLowerCase() &&
      String(team.category || "").toLowerCase() ===
        teamForm.category.toLowerCase()
  );

  if (duplicateTeam) {
    alert("This squad already exists for that department, sport, and category.");
    return;
  }

  setUploading(true);

  try {
    const logoUrl =
      teamForm.logo.trim() ||
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=300&q=80";

    await addTeam({
      department: teamForm.department.trim(),
      name: teamForm.department.trim(),
      sport: teamForm.sport.trim(),
      category: teamForm.category,
      displayName: `${teamForm.department.trim()} ${teamForm.sport.trim()} ${teamForm.category} Team`,
      logo: logoUrl,
      qualified: teamForm.qualified,
      about: teamForm.about.trim(),
      coach: {
        name: teamForm.coachName.trim(),
        about: teamForm.coachAbout.trim(),
      },
      players: [],
    });

    setTeamForm({
      department: "",
      sport: "",
      logo: "",
      about: "",
      coachName: "",
      coachAbout: "",
      qualified: true,
      category: "Male",
    });
  } catch (error) {
    console.error("Error adding team:", error);
    alert("Failed to add team. Please try again.");
  } finally {
    setUploading(false);

  }
};

  const handlePlayerChange = (event) => {
    const { name, value } = event.target;

    setPlayerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetPlayerForm = () => {
    setPlayerForm({
      name: "",
      position: "",
      jerseyNumber: "",
      goals: "",
      cleanSheets: "",
      points: "",
      appearances: "",
    });
    setEditingPlayerId(null);
  };

  const handleAddOrUpdatePlayer = async (event) => {
    event.preventDefault();

    if (!selectedTeam || !playerForm.name.trim()) return;

    if (!editingPlayerId && (selectedTeam.players?.length || 0) >= 30) {
      alert("A team cannot have more than 30 players.");
      return;
    }

    const payload = {
      name: playerForm.name.trim(),
      position: playerForm.position,
      jerseyNumber: Number(playerForm.jerseyNumber) || 0,
      goals: Number(playerForm.goals) || 0,
      cleanSheets: Number(playerForm.cleanSheets) || 0,
      points: Number(playerForm.points) || 0,
      appearances: Number(playerForm.appearances) || 0,
    };

    if (editingPlayerId) {
      await updatePlayerInTeam(selectedTeam.id, editingPlayerId, payload);
    } else {
      await addPlayerToTeam(selectedTeam.id, {
        id: Date.now(),
        ...payload,
      });
    }

    resetPlayerForm();
  };

  const handleEditPlayer = (player) => {
    setEditingPlayerId(player.id);
    setPlayerForm({
      name: player.name || "",
      position: player.position || "",
      jerseyNumber: String(player.jerseyNumber || ""),
      goals: String(player.goals || ""),
      cleanSheets: String(player.cleanSheets || ""),
      points: String(player.points || ""),
      appearances: String(player.appearances || ""),
    });
  };

  const handleStartEditTeam = (team) => {
    setEditingTeamId(team.id);
    setTeamEditForm({
      department: team.department || team.name || "",
      sport: team.sport || "",
      logo: team.logo || "",
      about: team.about || "",
      coachName: team.coach?.name || "",
      coachAbout: team.coach?.about || "",
      qualified: !!team.qualified,
      category: team.category || "Male",
    });
  };

  const handleTeamEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setTeamEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveTeamEdit = async (event) => {
    event.preventDefault();

    await updateTeam(editingTeamId, {
      department: teamEditForm.department.trim(),
      name: teamEditForm.department.trim(),
      sport: teamEditForm.sport.trim(),
      category: teamEditForm.category,
      displayName: `${teamEditForm.department.trim()} ${teamEditForm.sport.trim()} ${teamEditForm.category} Team`,
      logo: teamEditForm.logo,
      about: teamEditForm.about,
      qualified: teamEditForm.qualified,
      coach: {
        name: teamEditForm.coachName,
        about: teamEditForm.coachAbout,
      },
    });

    setEditingTeamId(null);
  };

  const handleCancelTeamEdit = () => {
    setEditingTeamId(null);
  };

  const handleToggleQualified = async (team) => {
    await updateTeam(team.id, {
      qualified: !team.qualified,
    });
  };

  const renderTeamSection = (title, list) => (
    <div className="admin-section-card">
      <h2>{title}</h2>

      <div className="admin-list">
        {list.length ? (
          list.map((team) => (
            <div className="admin-list-card" key={team.id}>
              <h3>{team.displayName || `${team.department || team.name} ${team.sport} ${team.category}`}</h3>
              <p>
                <strong>Department:</strong> {team.department || team.name}
              </p>
              <p>
                <strong>Sport:</strong> {team.sport || "Not assigned"}
              </p>
              <p>
                <strong>Category:</strong> {team.category}
              </p>
              <p>
                <strong>Status:</strong> {team.qualified ? "Qualified" : "Not Qualified"}
              </p>
              <p>
                <strong>Coach:</strong> {team.coach?.name || "Not updated"}
              </p>
              <p>
                <strong>Players:</strong> {team.players?.length || 0}
              </p>
              <p>
                <strong>Squad Status:</strong>{" "}
                {isSquadValid(team.id) ? "Valid squad" : "Below minimum squad size"}
              </p>

              <div className="admin-actions">
                <button type="button" onClick={() => handleStartEditTeam(team)}>
                  Edit Team
                </button>
                <button type="button" onClick={() => handleToggleQualified(team)}>
                  {team.qualified ? "Mark Not Qualified" : "Mark Qualified"}
                </button>
                <button type="button" onClick={() => deleteTeam(team.id)}>
                  Delete Team
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No teams in this category yet.</p>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Create Team</h2>

        <form className="admin-form" onSubmit={handleCreateTeam}>
          <div className="admin-form__grid">
            <select
              name="department"
              value={teamForm.department}
              onChange={handleTeamChange}
              required
            >
              <option value="">Select Department</option>
              {facultyDepartments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              name="sport"
              value={teamForm.sport}
              onChange={handleTeamChange}
              required
            >
              <option value="">Select Sport</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>

           <input 
              type="text"
              name="logo"
              placeholder="Team logo URL"
              value={teamForm.logo}
              onChange={handleTeamChange}
            />

            <select
              name="category"
              value={teamForm.category}
              onChange={handleTeamChange}
            >
              <option value="Male">Male Team</option>
              <option value="Female">Female Team</option>
            </select>

            <textarea
              name="about"
              placeholder="About team"
              value={teamForm.about}
              onChange={handleTeamChange}
              rows="3"
            />

            <input
              type="text"
              name="coachName"
              placeholder="Coach name"
              value={teamForm.coachName}
              onChange={handleTeamChange}
            />

            <textarea
              name="coachAbout"
              placeholder="Coach details"
              value={teamForm.coachAbout}
              onChange={handleTeamChange}
              rows="3"
            />
          </div>

          <label className="remember-me">
            <input
              type="checkbox"
              name="qualified"
              checked={teamForm.qualified}
              onChange={handleTeamChange}
            />
            <span>Qualified</span>
          </label>

          <button type="submit" className="btn btn--primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Team"}
          </button>
        </form>
      </div>

      {editingTeamId && (
        <div className="admin-section-card">
          <h2>Edit Team Details</h2>

          <form className="admin-form" onSubmit={handleSaveTeamEdit}>
            <div className="admin-form__grid">
              <select
                name="department"
                value={teamEditForm.department}
                onChange={handleTeamEditChange}
                required
              >
                <option value="">Select Department</option>
                {facultyDepartments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                name="sport"
                value={teamEditForm.sport}
                onChange={handleTeamEditChange}
                required
              >
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.name}>
                    {sport.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="logo"
                placeholder="Team logo URL"
                value={teamEditForm.logo}
                onChange={handleTeamEditChange}
              />

              <select
                name="category"
                value={teamEditForm.category}
                onChange={handleTeamEditChange}
              >
                <option value="Male">Male Team</option>
                <option value="Female">Female Team</option>
              </select>

              <textarea
                name="about"
                placeholder="About team"
                value={teamEditForm.about}
                onChange={handleTeamEditChange}
                rows="3"
              />

              <input
                type="text"
                name="coachName"
                placeholder="Coach name"
                value={teamEditForm.coachName}
                onChange={handleTeamEditChange}
              />

              <textarea
                name="coachAbout"
                placeholder="Coach details"
                value={teamEditForm.coachAbout}
                onChange={handleTeamEditChange}
                rows="3"
              />
            </div>

            <label className="remember-me">
              <input
                type="checkbox"
                name="qualified"
                checked={teamEditForm.qualified}
                onChange={handleTeamEditChange}
              />
              <span>Qualified</span>
            </label>

            <div className="admin-actions">
              <button type="submit">Save Team Changes</button>
              <button type="button" onClick={handleCancelTeamEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-section-card">
        <h2>Manage Players</h2>

        <div className="team-search-bar">
          <select
            value={teamCategoryFilter}
            onChange={(e) => setTeamCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={teamSportFilter}
            onChange={(e) => setTeamSportFilter(e.target.value)}
          >
            <option value="all">All Sports</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        <select
          className="admin-select"
          value={selectedTeamId}
          onChange={(e) => {
            setSelectedTeamId(e.target.value);
            resetPlayerForm();
          }}
        >
          <option value="">Select team</option>
          {selectableTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.displayName || `${team.department || team.name} (${team.category}) — ${team.sport}`}
            </option>
          ))}
        </select>

        {selectedTeam && (
          <>
            <p
              className={`page-intro ${
                (selectedTeam.players?.length || 0) < 25 ? "squad-warning" : "squad-valid"
              }`}
            >
              Squad count: {selectedTeam.players?.length || 0}/30
              {(selectedTeam.players?.length || 0) < 25
                ? " — Minimum squad size is 25 players."
                : " — Squad size is valid."}
            </p>

            <form className="admin-form" onSubmit={handleAddOrUpdatePlayer}>
              <div className="admin-form__grid">
                <input
                  type="text"
                  name="name"
                  placeholder="Player name"
                  value={playerForm.name}
                  onChange={handlePlayerChange}
                  required
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={playerForm.position}
                  onChange={handlePlayerChange}
                />
                <input
                  type="number"
                  name="jerseyNumber"
                  placeholder="Jersey number"
                  value={playerForm.jerseyNumber}
                  onChange={handlePlayerChange}
                />
                <input
                  type="number"
                  name="goals"
                  placeholder="Goals"
                  value={playerForm.goals}
                  onChange={handlePlayerChange}
                />
                <input
                  type="number"
                  name="cleanSheets"
                  placeholder="Clean sheets"
                  value={playerForm.cleanSheets}
                  onChange={handlePlayerChange}
                />
                <input
                  type="number"
                  name="points"
                  placeholder="Points"
                  value={playerForm.points}
                  onChange={handlePlayerChange}
                />
                <input
                  type="number"
                  name="appearances"
                  placeholder="Appearances"
                  value={playerForm.appearances}
                  onChange={handlePlayerChange}
                />
              </div>

              <div className="admin-actions">
                <button type="submit">
                  {editingPlayerId ? "Update Player" : "Add Player"}
                </button>
                {editingPlayerId && (
                  <button type="button" onClick={resetPlayerForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="admin-list">
              {(selectedTeam.players || []).map((player) => (
                <div className="admin-list-card" key={player.id}>
                  <h3>{player.name}</h3>
                  <p>
                    <strong>Position:</strong> {player.position}
                  </p>
                  <p>
                    <strong>Jersey:</strong> {player.jerseyNumber}
                  </p>
                  <p>
                    <strong>Goals:</strong> {player.goals || 0}
                  </p>
                  <p>
                    <strong>Clean Sheets:</strong> {player.cleanSheets || 0}
                  </p>
                  <p>
                    <strong>Points:</strong> {player.points || 0}
                  </p>
                  <p>
                    <strong>Appearances:</strong> {player.appearances || 0}
                  </p>

                  <div className="admin-actions">
                    <button type="button" onClick={() => handleEditPlayer(player)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePlayerFromTeam(selectedTeam.id, player.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {unidentifiedTeams.length > 0 && (
        <div className="admin-section-card">
          <h2>Unidentified Teams</h2>
          <p>
            These teams do not have a valid category. Delete or edit them immediately.
          </p>

          <div className="admin-list">
            {unidentifiedTeams.map((team) => (
              <div className="admin-list-card" key={team.id}>
                <h3>{team.displayName || team.name || "Unnamed Team"}</h3>
                <p>
                  <strong>Category:</strong> {team.category || "Not assigned"}
                </p>
                <p>
                  <strong>Sport:</strong> {team.sport || "Not assigned"}
                </p>
                <p>
                  <strong>Players:</strong> {team.players?.length || 0}
                </p>

                <div className="admin-actions">
                  <button type="button" onClick={() => handleStartEditTeam(team)}>
                    Edit Team
                  </button>
                  <button type="button" onClick={() => deleteTeam(team.id)}>
                    Delete Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {renderTeamSection("Male Teams", maleTeams)}
      {renderTeamSection("Female Teams", femaleTeams)}
    </AdminLayout>
  );
}

export default ManageTeams;