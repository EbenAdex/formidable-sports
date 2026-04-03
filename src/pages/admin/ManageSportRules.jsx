import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function ManageSportRules() {
  const { sportRules, updateSportRule } = useAppData();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);

  const sortedRules = useMemo(
    () => [...sportRules].sort((a, b) => String(a.sport).localeCompare(String(b.sport))),
    [sportRules]
  );

  const startEdit = (rule) => {
    setEditingId(rule.id);
    setFormData({ ...rule });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    await updateSportRule(editingId, {
      ...formData,
      periods: Number(formData.periods || 0),
      minutesPerPeriod: Number(formData.minutesPerPeriod || 0),
      shortBreakMinutes: Number(formData.shortBreakMinutes || 0),
      halftimeAfterPeriod: Number(formData.halftimeAfterPeriod || 0),
      halftimeMinutes: Number(formData.halftimeMinutes || 0),
      setsToWin: Number(formData.setsToWin || 0),
      intervalBetweenSetsMinutes: Number(formData.intervalBetweenSetsMinutes || 0),
    });

    setEditingId(null);
    setFormData(null);
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Sport Rules</h2>
        <p>Configure sport timing and set formats for live match control.</p>
      </div>

      {editingId && formData && (
        <div className="admin-section-card">
          <h2>Edit {formData.sport} Rules</h2>

          <form className="admin-form" onSubmit={handleSave}>
            <div className="admin-form__grid">
              <select name="mode" value={formData.mode} onChange={handleChange}>
                <option value="clock">Clock</option>
                <option value="sets">Sets</option>
              </select>

              <label className="remember-me">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={!!formData.enabled}
                  onChange={handleChange}
                />
                <span>Enabled</span>
              </label>

              {formData.mode === "clock" && (
                <>
                  <input
                    type="number"
                    name="periods"
                    placeholder="Periods"
                    value={formData.periods || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="periodLabel"
                    placeholder="Period label"
                    value={formData.periodLabel || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="minutesPerPeriod"
                    placeholder="Minutes per period"
                    value={formData.minutesPerPeriod || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="shortBreakMinutes"
                    placeholder="Short break minutes"
                    value={formData.shortBreakMinutes || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="halftimeAfterPeriod"
                    placeholder="Halftime after period"
                    value={formData.halftimeAfterPeriod || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="halftimeMinutes"
                    placeholder="Halftime minutes"
                    value={formData.halftimeMinutes || ""}
                    onChange={handleChange}
                  />
                </>
              )}

              {formData.mode === "sets" && (
                <>
                  <input
                    type="number"
                    name="setsToWin"
                    placeholder="Sets to win"
                    value={formData.setsToWin || ""}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    placeholder="Set targets e.g. 25,25,25,25,15"
                    value={Array.isArray(formData.setTargets) ? formData.setTargets.join(",") : ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        setTargets: e.target.value
                          .split(",")
                          .map((item) => Number(item.trim()))
                          .filter(Boolean),
                      }))
                    }
                  />

                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="winByTwo"
                      checked={!!formData.winByTwo}
                      onChange={handleChange}
                    />
                    <span>Win by Two</span>
                  </label>

                  <input
                    type="number"
                    name="intervalBetweenSetsMinutes"
                    placeholder="Interval between sets"
                    value={formData.intervalBetweenSetsMinutes || ""}
                    onChange={handleChange}
                  />
                </>
              )}
            </div>

            <div className="admin-actions">
              <button type="submit">Save Rules</button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-section-card">
        <div className="admin-list">
          {sortedRules.map((rule) => (
            <div className="admin-list-card" key={rule.id}>
              <h3>{rule.sport}</h3>
              <p>
                <strong>Mode:</strong> {rule.mode}
              </p>
              <p>
                <strong>Enabled:</strong> {rule.enabled ? "Yes" : "No"}
              </p>
              <div className="admin-actions">
                <button type="button" onClick={() => startEdit(rule)}>
                  Edit Rules
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageSportRules;