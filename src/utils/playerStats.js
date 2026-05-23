export function getAllPlayersFromTeams(teams = []) {
  return teams.flatMap((team) =>
    (team.players || []).map((player) => ({
      ...player,
      teamId: team.id,
      teamName: team.name,
      teamLogo: team.logo,
      sports: team.sports || [],
      category: team.category,
    }))
  );
}

export function getTopScorers(players = [], limit = 10) {
  return [...players]
    .filter((player) => (player.goals || 0) > 0)
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))
    .slice(0, limit);
}

export function getTopCleanSheets(players = [], limit = 10) {
  return [...players]
    .filter((player) => {
      const position = (player.position || "").toLowerCase();

      return (
        (position === "goalkeeper" ||
          position === "defender") &&
        (player.cleanSheets || 0) > 0
      );
    })
    .sort((a, b) => (b.cleanSheets || 0) - (a.cleanSheets || 0))
    .slice(0, limit);
}

export function getTopPoints(teams = [], limit = 10) {
  return [...teams]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, limit);
}

export function recalculatePlayerStats(fixtures, teams) {
  const playersMap = {};

  fixtures.forEach((fixture) => {
    if (!["Ended", "Live"].includes(fixture.status)) return;

    const events = fixture.events || [];

    events.forEach((event) => {
      const { playerId, type } = event;

      if (!playerId) return;

      if (!playersMap[playerId]) {
        playersMap[playerId] = {
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          cleanSheets: 0,
          appearances: 0,
          points: 0,
        };
      }

      if (
        type === "Goal" ||
        type === "goal"
      ) {
        playersMap[playerId].goals += 1;
      }

      if (
        type === "Yellow Card" ||
        type === "yellow_card"
      ) {
        playersMap[playerId].yellowCards += 1;
      }

      if (
        type === "Red Card" ||
        type === "red_card"
      ) {
        playersMap[playerId].redCards += 1;
      }

      if (
        type === "Score" ||
        type === "score"
      ) {
        playersMap[playerId].points += 1;
      }
    });

    if (
      fixture.status === "Ended" &&
      fixture.sport?.toLowerCase() === "football"
    ) {
      const homeConceded = fixture.score?.away || 0;
      const awayConceded = fixture.score?.home || 0;

      const homePlayers =
        fixture.lineups?.homePlayerIds || [];

      const awayPlayers =
        fixture.lineups?.awayPlayerIds || [];

      teams.forEach((team) => {
        const isHome =
          String(team.id) === String(fixture.homeTeamId);

        const isAway =
          String(team.id) === String(fixture.awayTeamId);

        if (!isHome && !isAway) return;

        const conceded = isHome
          ? homeConceded
          : awayConceded;

        const lineup = isHome
          ? homePlayers
          : awayPlayers;

        if (conceded === 0) {
          (team.players || []).forEach((player) => {
            const position = (
              player.position || ""
            ).toLowerCase();

            if (
              lineup.includes(player.id) &&
              (position === "goalkeeper" ||
                position === "defender")
            ) {
              if (!playersMap[player.id]) {
                playersMap[player.id] = {
                  goals: 0,
                  assists: 0,
                  yellowCards: 0,
                  redCards: 0,
                  cleanSheets: 0,
                  appearances: 0,
                  points: 0,
                };
              }

              playersMap[player.id].cleanSheets += 1;
            }
          });
        }
      });
    }
  });

  return playersMap;
}