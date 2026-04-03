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
            rows.map((team) => (
              <tr key={team.id}>
                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.position}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "position", e.target.value)
                      }
                    />
                  ) : (
                    team.position
                  )}
                </td>

                <td>{team.team}</td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.played}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "played", e.target.value)
                      }
                    />
                  ) : (
                    team.played
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.won}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "won", e.target.value)
                      }
                    />
                  ) : (
                    team.won
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.drawn}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "drawn", e.target.value)
                      }
                    />
                  ) : (
                    team.drawn
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.lost}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "lost", e.target.value)
                      }
                    />
                  ) : (
                    team.lost
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.goalsFor}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "goalsFor", e.target.value)
                      }
                    />
                  ) : (
                    team.goalsFor
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.goalsAgainst}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "goalsAgainst", e.target.value)
                      }
                    />
                  ) : (
                    team.goalsAgainst
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.goalDifference}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "goalDifference", e.target.value)
                      }
                    />
                  ) : (
                    team.goalDifference
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      type="number"
                      value={team.points}
                      onChange={(e) =>
                        onFieldChange?.(team.id, "points", e.target.value)
                      }
                    />
                  ) : (
                    team.points
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