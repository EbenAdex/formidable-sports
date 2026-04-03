export function getAllPlayersFromTeams(teams = []) {
  return teams.flatMap((team) =>
    (team.players || []).map((player) => ({
      ...player,
      teamId: team.id,
      teamName: team.name,
      teamLogo: team.logo,
      sports: team.sports || [],
    }))
  );
}

export function getTopScorers(players = [], limit = 10) {
  return [...players]
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))
    .slice(0, limit);
}

export function getTopCleanSheets(players = [], limit = 10) {
  return [...players]
    .filter((player) => (player.cleanSheets || 0) > 0)
    .sort((a, b) => (b.cleanSheets || 0) - (a.cleanSheets || 0))
    .slice(0, limit);
}

export function getTopPoints(players = [], limit = 10) {
  return [...players]
    .filter((player) => (player.points || 0) > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, limit);
}