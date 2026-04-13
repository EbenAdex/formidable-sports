import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";
import CompetitionTable from "../../components/sports/CompetitionTable";

function ManageTable() {
  const {
    table = [],
    sports = [],
    updateTableRow,
    addTableTeam,
    deleteTableTeam,
    recalculateTablesFromEndedFixtures,
  } = useAppData();

  const [teamName, setTeamName] = useState("");
  const [selectedSport, setSelectedSport] = useState("Football");
  const [selectedCategory, setSelectedCategory] = useState("Male");
  const [selectedGroup, setSelectedGroup] = useState("Group A");

  const filteredTable = useMemo(() => {
    return table.filter((row) => {
      const sportMatch =
        String(row.sport || "").toLowerCase() === selectedSport.toLowerCase();

      const categoryMatch =
        String(row.category || "").toLowerCase() === selectedCategory.toLowerCase();

      const groupMatch =
        String(row.competitionGroup || "").toLowerCase() === selectedGroup.toLowerCase();

      return sportMatch && categoryMatch && groupMatch;
    });
  }, [table, selectedSport, selectedCategory, selectedGroup]);

  const sortedFilteredTable = useMemo(() => {
    return [...filteredTable]
      .sort((a, b) => {
        if ((b.points ?? 0) !== (a.points ?? 0)) {
          return (b.points ?? 0) - (a.points ?? 0);
        }
        if ((b.goalDifference ?? 0) !== (a.goalDifference ?? 0)) {
          return (b.goalDifference ?? 0) - (a.goalDifference ?? 0);
        }
        return (b.goalsFor ?? 0) - (a.goalsFor ?? 0);
      })
      .map((row, index) => ({
        ...row,
        position: index + 1,
      }));
  }, [filteredTable]);

  const handleAddTeam = async (event) => {
    event.preventDefault();

    if (!teamName.trim()) return;

    const duplicate = table.find(
      (row) =>
        String(row.team || "").toLowerCase() === teamName.trim().toLowerCase() &&
        String(row.sport || "").toLowerCase() === selectedSport.toLowerCase() &&
        String(row.category || "").toLowerCase() === selectedCategory.toLowerCase() &&
        String(row.competitionGroup || "").toLowerCase() === selectedGroup.toLowerCase()
    );

    if (duplicate) {
      alert("This team already exists in the selected table group.");
      return;
    }

    await addTableTeam(
      teamName.trim(),
      selectedSport,
      selectedCategory,
      selectedGroup
    );

    setTeamName("");
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage League Tables</h2>
        <p>Select a sport, category, and group to manage one table at a time.</p>

        <div className="team-search-bar">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            {sports.length ? (
              sports.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))
            ) : (
              <option value="Football">Football</option>
            )}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="Group A">Group A</option>
            <option value="Group B">Group B</option>
            <option value="Group C">Group C</option>
            <option value="Group D">Group D</option>
          </select>
        </div>

        <div className="admin-actions">
          <button type="button" onClick={recalculateTablesFromEndedFixtures}>
            Auto Update Tables From Ended Fixtures
          </button>
        </div>
      </div>

      <div className="admin-section-card">
        <h2>
          Add Team to {selectedSport} {selectedCategory} {selectedGroup}
        </h2>

        <form className="admin-form admin-inline-form" onSubmit={handleAddTeam}>
          <input
            type="text"
            placeholder={`New team for ${selectedSport} ${selectedCategory} ${selectedGroup}`}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <button type="submit" className="btn btn--primary">
            Add Team to Table
          </button>
        </form>
      </div>

      <div className="admin-section-card">
        <h2>
          {selectedSport} {selectedCategory} {selectedGroup} Table
        </h2>

        <CompetitionTable
          rows={sortedFilteredTable}
          editable
          onFieldChange={updateTableRow}
          onDeleteRow={deleteTableTeam}
          emptyMessage={`No teams added yet for ${selectedSport} ${selectedCategory} ${selectedGroup}.`}
        />
      </div>
    </AdminLayout>
  );
}

export default ManageTable;