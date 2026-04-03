import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function ManageSports() {
  const { sports, teams, addSport, updateTeam } = useAppData();

  const [sportForm, setSportForm] = useState({
    name: "",
    image: "",
    description: "",
    link: "",
  });

  const [selectedSport, setSelectedSport] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const handleSportChange = (event) => {
    const { name, value } = event.target;

    setSportForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSport = (event) => {
    event.preventDefault();

    if (!sportForm.name.trim()) return;

    addSport({
      id: Date.now(),
      name: sportForm.name.trim(),
      image:
        sportForm.image ||
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=800&q=80",
      description: sportForm.description,
      link:
        sportForm.link ||
        `/sports/${sportForm.name.trim().toLowerCase().replace(/\s+/g, "-")}`,
    });

    setSportForm({
      name: "",
      image: "",
      description: "",
      link: "",
    });
  };

  const handleAssignTeam = (event) => {
    event.preventDefault();

    if (!selectedSport || !selectedTeamId) return;

    const team = teams.find((item) => item.id === Number(selectedTeamId));
    if (!team) return;

    const alreadyAssigned = team.sports?.includes(selectedSport);
    if (alreadyAssigned) return;

    updateTeam(team.id, {
      sports: [...(team.sports || []), selectedSport],
    });

    setSelectedSport("");
    setSelectedTeamId("");
  };

  const handleRemoveTeamFromSport = (team, sportName) => {
    updateTeam(team.id, {
      sports: (team.sports || []).filter((item) => item !== sportName),
    });
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Sports</h2>
        <p>Add sports and assign qualified teams to those sports.</p>

        <form className="admin-form" onSubmit={handleAddSport}>
          <div className="admin-form__grid">
            <input
              type="text"
              name="name"
              placeholder="Sport name"
              value={sportForm.name}
              onChange={handleSportChange}
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Sport image URL (optional)"
              value={sportForm.image}
              onChange={handleSportChange}
            />
            <input
              type="text"
              name="link"
              placeholder="Route link (optional)"
              value={sportForm.link}
              onChange={handleSportChange}
            />
            <textarea
              name="description"
              placeholder="Sport description"
              value={sportForm.description}
              onChange={handleSportChange}
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn--primary">
            Add Sport
          </button>
        </form>
      </div>

      <div className="admin-section-card">
        <h2>Assign Teams to Sports</h2>

        <form className="admin-form admin-inline-form" onSubmit={handleAssignTeam}>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">Select sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">Select team</option>
            {teams
              .filter((team) => team.qualified)
              .map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
          </select>

          <button type="submit" className="btn btn--primary">
            Assign Team
          </button>
        </form>
      </div>

      <div className="admin-section-card">
        <h2>Sports List</h2>

        <div className="admin-list">
          {sports.map((sport) => {
            const assignedTeams = teams.filter((team) =>
              team.sports?.includes(sport.name)
            );

            return (
              <div className="admin-list-card" key={sport.id}>
                <h3>{sport.name}</h3>
                <p>{sport.description}</p>

                <p>
                  <strong>Assigned Teams:</strong>{" "}
                  {assignedTeams.length
                    ? assignedTeams.map((team) => team.name).join(", ")
                    : "No teams assigned yet"}
                </p>

                {assignedTeams.length > 0 && (
                  <div className="admin-actions">
                    {assignedTeams.map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => handleRemoveTeamFromSport(team, sport.name)}
                      >
                        Remove {team.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageSports;