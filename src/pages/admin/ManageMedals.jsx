import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function ManageMedals() {
  const {
    teams = [],
    rankings = [],
    addRanking,
    updateRanking,
    deleteRanking,
  } = useAppData();
  

  const [form, setForm] = useState({
    teamId: "",
    gold: 0,
    silver: 0,
    bronze: 0,
  });

  // Deduplicate teams by department name — one entry per department
  const uniqueDepartmentTeams = useMemo(() => {
    const seen = new Set();
    return teams.filter((team) => {
      const key = String(team.department || team.name || "").trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [teams]);

  const selectedTeam = useMemo(() => {
    return uniqueDepartmentTeams.find(
      (team) => String(team.id) === String(form.teamId)
    );
  }, [uniqueDepartmentTeams, form.teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const payload = {
      teamId: selectedTeam.id,
      team: selectedTeam.department || selectedTeam.name || "Unknown",
      sport: selectedTeam.sport || "",
      category: selectedTeam.category || "Male",
      gold: Number(form.gold || 0),
      silver: Number(form.silver || 0),
      bronze: Number(form.bronze || 0),
    };

    const existing = rankings.find(
      (item) => String(item.teamId) === String(selectedTeam.id)
    );

    if (existing) {
      await updateRanking(existing.id, payload);
    } else {
      await addRanking(payload);
    }

    setForm({ teamId: "", gold: 0, silver: 0, bronze: 0 });
  };

  const handleEdit = (item) => {
    setForm({
      teamId: item.teamId,
      gold: item.gold || 0,
      silver: item.silver || 0,
      bronze: item.bronze || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedRankings = useMemo(() => {
    return [...rankings].sort((a, b) => {
      if ((b.gold || 0) !== (a.gold || 0)) return (b.gold || 0) - (a.gold || 0);
      if ((b.silver || 0) !== (a.silver || 0)) return (b.silver || 0) - (a.silver || 0);
      return (b.bronze || 0) - (a.bronze || 0);
    });
  }, [rankings]);

  return (
    <AdminLayout>

      {/* Form card */}
      <div className="admin-section-card">
        <h2>{form.teamId && rankings.find(r => String(r.teamId) === String(form.teamId)) ? "Edit Medal Record" : "Add Medal Record"}</h2>
        <p>Assign gold, silver, and bronze medals to a department.</p>

        <form onSubmit={handleSubmit} className="admin-form medals-form">
          <div className="medals-form__grid">
            <select
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {uniqueDepartmentTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.department || team.name}
                </option>
              ))}
            </select>

            <div className="medals-input-group">
              <span className="medal-dot gold-dot" />
              <input
                type="number"
                min="0"
                placeholder="Gold"
                value={form.gold}
                onChange={(e) => setForm({ ...form, gold: Number(e.target.value) })}
              />
            </div>

            <div className="medals-input-group">
              <span className="medal-dot silver-dot" />
              <input
                type="number"
                min="0"
                placeholder="Silver"
                value={form.silver}
                onChange={(e) => setForm({ ...form, silver: Number(e.target.value) })}
              />
            </div>

            <div className="medals-input-group">
              <span className="medal-dot bronze-dot" />
              <input
                type="number"
                min="0"
                placeholder="Bronze"
                value={form.bronze}
                onChange={(e) => setForm({ ...form, bronze: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="admin-actions medals-form__actions">
            <button type="submit" className="medal-save-btn">
              Save Medal Record
            </button>
            {form.teamId && (
              <button
                type="button"
                className="medal-cancel-btn"
                onClick={() => setForm({ teamId: "", gold: 0, silver: 0, bronze: 0 })}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table card */}
      <div className="admin-section-card">
        <h2>Medal Standings</h2>
        <p>Sorted by gold, then silver, then bronze.</p>

        <div className="medals-table-wrap">
          <table className="medals-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Department</th>
                <th className="medal-gold">🥇 Gold</th>
                <th className="medal-silver">🥈 Silver</th>
                <th className="medal-bronze">🥉 Bronze</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRankings.length ? (
                sortedRankings.map((item, index) => {
                  const total =
                    Number(item.gold || 0) +
                    Number(item.silver || 0) +
                    Number(item.bronze || 0);

                  const isEditing = String(form.teamId) === String(item.teamId);

                  return (
                    <tr key={item.id} className={isEditing ? "medals-row--editing" : ""}>
                      <td className="medals-pos">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </td>
                      <td className="medals-team">{item.team || item.department || "Unknown"}</td>
                      <td className="medal-gold medals-count">{item.gold || 0}</td>
                      <td className="medal-silver medals-count">{item.silver || 0}</td>
                      <td className="medal-bronze medals-count">{item.bronze || 0}</td>
                      <td className="medals-total">{total}</td>
                      <td>
                        <div className="medals-actions">
                          <button
                            type="button"
                            className="medal-edit-btn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="medal-delete-btn"
                            onClick={() => deleteRanking(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="medals-empty">
                    No medal records yet. Add the first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </AdminLayout>
  );
}

export default ManageMedals;