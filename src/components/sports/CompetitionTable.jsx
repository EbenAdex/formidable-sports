function CompetitionTable({
  rows = [],
  editable = false,
  onFieldChange,
  onDeleteRow,
  emptyMessage = "No table data available.",
}) {
  return (
    <div className="table-wrapper">
      <table className={editable ? "admin-table" : "public-table"}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
            {editable && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {rows.length ? (
            rows.map((team, index) => (
              <tr key={team.id || `${team.team}-${index}`}>
                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.position ?? index + 1}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "position", e.target.value)
                      }
                    />
                  ) : (
                    team.position ?? index + 1
                  )}
                </td>

                <td>{team.team || "Unknown Team"}</td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.played ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "played", e.target.value)
                      }
                    />
                  ) : (
                    team.played ?? 0
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.won ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "won", e.target.value)
                      }
                    />
                  ) : (
                    team.won ?? 0
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.drawn ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "drawn", e.target.value)
                      }
                    />
                  ) : (
                    team.drawn ?? 0
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.lost ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "lost", e.target.value)
                      }
                    />
                  ) : (
                    team.lost ?? 0
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.goalsFor ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "goalsFor", e.target.value)
                      }
                    />
                  ) : (
                    team.goalsFor ?? 0
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.goalsAgainst ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "goalsAgainst", e.target.value)
                      }
                    />
                  ) : (
                    team.goalsAgainst ?? 0
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.goalDifference ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "goalDifference", e.target.value)
                      }
                    />
                  ) : (
                    team.goalDifference ?? 0
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.points ?? 0}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "points", e.target.value)
                      }
                    />
                  ) : (
                    team.points ?? 0
                  )}
                </td>

                {editable && (
                  <td>
                    <button type="button" onClick={() => onDeleteRow?.(team.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={editable ? 11 : 10}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CompetitionTable;