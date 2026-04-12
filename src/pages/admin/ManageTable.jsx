import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";
import CompetitionTable from "../../components/sports/CompetitionTable";

function ManageTable() {
  const {
    table,
    sports,
    updateTableRow,
    addTableTeam,
    deleteTableTeam,
    recalculateTablesFromEndedFixtures,
  } = useAppData();

  console.log(table);

  const [teamName, setTeamName] = useState("");
  const [selectedSport, setSelectedSport] = useState("Football");
  const [selectedCategory, setSelectedCategory] = useState("Male");
  const [selectedGroup, setSelectedGroup] = useState("Group A");

 const filteredTable = useMemo(() => {
  return table.filter((row) => {
    const sportMatch =
      (row.sport || "").toLowerCase() === selectedSport.toLowerCase();

    const categoryMatch =
      (row.category || "").toLowerCase() === selectedCategory.toLowerCase();

    const groupMatch = row.group
      ? row.group.toLowerCase() === selectedGroup.toLowerCase()
      : true; 

    return sportMatch && categoryMatch && groupMatch;
  });
}, [table, selectedSport, selectedCategory, selectedGroup]);

  const sortedFilteredTable = useMemo(() => {
    return [...filteredTable].sort((a, b) => {
      if ((a.position ?? 0) !== (b.position ?? 0)) {
        return (a.position ?? 0) - (b.position ?? 0);
      }
      return (b.points ?? 0) - (a.points ?? 0);
    });
  }, [filteredTable]);

 const handleAddTeam = async (event) => {
  event.preventDefault();

  if (!teamName.trim()) return;

  await addTableTeam(teamName.trim(), selectedSport, selectedCategory, selectedGroup);
  setTeamName("");
};

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage League Tables</h2>
        <p>Select a sport and category to manage one table at a time.</p>

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
        </div>

        <select
  value={selectedGroup}
  onChange={(e) => setSelectedGroup(e.target.value)}
>
  <option value="Group A">Group A</option>
  <option value="Group B">Group B</option>
  <option value="Group C">Group C</option>
  <option value="Group D">Group D</option>
</select>

        <div className="admin-actions">
          <button type="button" onClick={recalculateTablesFromEndedFixtures}>
            Auto Update Tables From Ended Fixtures
          </button>
        </div>
      </div>

      <div className="admin-section-card">
        <h2>
          Add Team to {selectedSport} {selectedCategory} Table
        </h2>

        <form className="admin-form admin-inline-form" onSubmit={handleAddTeam}>
          <input
            type="text"
            placeholder={`New team for ${selectedSport} ${selectedCategory}`}
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
          {selectedSport} {selectedCategory}  Table
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