import { useState } from "react";

function AdminResultForm({ onAddResult }) {
  const [formData, setFormData] = useState({
    sport: "Football",
    gender: "Male",
    homeTeam: "",
    awayTeam: "",
    homeScore: "",
    awayScore: "",
    date: "",
    venue: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await onAddResult({
        sport: formData.sport,
        gender: formData.gender,
        category: formData.gender,
        homeTeam: formData.homeTeam,
        awayTeam: formData.awayTeam,
        homeScore: Number(formData.homeScore),
        awayScore: Number(formData.awayScore),
        date: formData.date,
        venue: formData.venue,
      });

      setFormData({
        sport: "Football",
        gender: "Male",
        homeTeam: "",
        awayTeam: "",
        homeScore: "",
        awayScore: "",
        date: "",
        venue: "",
      });
    } catch (error) {
      console.error("Add result failed:", error);
      alert(error.message || "Failed to add result.");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__grid">
        <input
          type="text"
          name="sport"
          placeholder="Sport"
          value={formData.sport}
          onChange={handleChange}
          required
        />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          name="homeTeam"
          placeholder="Home Team"
          value={formData.homeTeam}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="awayTeam"
          placeholder="Away Team"
          value={formData.awayTeam}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="homeScore"
          placeholder="Home Score"
          value={formData.homeScore}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="awayScore"
          placeholder="Away Score"
          value={formData.awayScore}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
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
        Add Result
      </button>
    </form>
  );
}

export default AdminResultForm;