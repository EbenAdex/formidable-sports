import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminResultForm from "../../components/admin/AdminResultForm";
import { useAppData } from "../../context/AppDataContext";

function ManageResults() {
  const { results, addResult, updateResult, deleteResult } = useAppData();

  const [editingResultId, setEditingResultId] = useState(null);
  const [editForm, setEditForm] = useState({
    sport: "",
    gender: "",
    homeTeam: "",
    awayTeam: "",
    homeScore: "",
    awayScore: "",
    date: "",
    venue: "",
  });

  useEffect(() => {
    if (!editingResultId) return;

    const resultToEdit = results.find((item) => item.id === editingResultId);

    if (resultToEdit) {
      setEditForm({
        sport: resultToEdit.sport || "",
        gender: resultToEdit.gender || resultToEdit.category || "",
        homeTeam: resultToEdit.homeTeam || "",
        awayTeam: resultToEdit.awayTeam || "",
        homeScore: String(resultToEdit.homeScore ?? ""),
        awayScore: String(resultToEdit.awayScore ?? ""),
        date: resultToEdit.date || "",
        venue: resultToEdit.venue || "",
      });
    }
  }, [editingResultId, results]);

  const handleAddResult = async (newResult) => {
    try{
            await addResult(newResult);
    } catch (error) {
      console.error("ManageResults add failed:", error);
      alert(error.message || "Failed to add result.");
    }
    
  };

  const handleStartEdit = (result) => {
    setEditingResultId(result.id);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();

    updateResult(editingResultId, {
      ...editForm,
      homeScore: Number(editForm.homeScore),
      awayScore: Number(editForm.awayScore),
    });

    setEditingResultId(null);
  };

  const handleCancelEdit = () => {
    setEditingResultId(null);
  };

  const handleDeleteResult = (id) => {
    deleteResult(id);

    if (editingResultId === id) {
      setEditingResultId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Results</h2>
        <p>View, add, update, and delete match outcomes across all sports.</p>
        <AdminResultForm onAddResult={handleAddResult} />
      </div>

      {editingResultId && (
        <div className="admin-section-card">
          <h2>Edit Result</h2>

          <form className="admin-form" onSubmit={handleSaveEdit}>
            <div className="admin-form__grid">
              <input
                type="text"
                name="sport"
                placeholder="Sport"
                value={editForm.sport}
                onChange={handleEditChange}
                required
              />

              <input
                type="text"
                name="gender"
                placeholder="Category"
                value={editForm.gender}
                onChange={handleEditChange}
                required
              />

              <input
                type="text"
                name="homeTeam"
                placeholder="Home Team"
                value={editForm.homeTeam}
                onChange={handleEditChange}
                required
              />

              <input
                type="text"
                name="awayTeam"
                placeholder="Away Team"
                value={editForm.awayTeam}
                onChange={handleEditChange}
                required
              />

              <input
                type="number"
                name="homeScore"
                placeholder="Home Score"
                value={editForm.homeScore}
                onChange={handleEditChange}
                required
              />

              <input
                type="number"
                name="awayScore"
                placeholder="Away Score"
                value={editForm.awayScore}
                onChange={handleEditChange}
                required
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
                name="venue"
                placeholder="Venue"
                value={editForm.venue}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="admin-actions">
              <button type="submit">Save Result</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-section-card">
        <h2>Results List</h2>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sport</th>
                <th>Category</th>
                <th>Result</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {results.length ? (
                results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.sport}</td>
                    <td>{result.gender || result.category}</td>
                    <td>
                      {result.homeTeam} {result.homeScore} - {result.awayScore}{" "}
                      {result.awayTeam}
                    </td>
                    <td>{result.date}</td>
                    <td>{result.venue}</td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" onClick={() => handleStartEdit(result)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No results available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageResults;