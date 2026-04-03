import { createContext, useContext, useEffect, useMemo, useState } from "react";
import initialFixtures from "../data/fixtureData";
import initialResults from "../data/resultsData";
import initialNews from "../data/newsData";
import initialTable from "../data/tableData";
import initialSports from "../data/sportsData";
import facultyDepartments from "../data/facultyDepartments";
import defaultSportRules from "../config/defaultSportRules";

import {
  seedDefaultSportRules,
  subscribeToSportRules,
  updateSportRuleInFirestore,
} from "../services/sportRulesService";
import { subscribeToTeams,
          addTeamToFirestore,
          updateTeamInFirestore,
          deleteTeamFromFirestore
 } from "../services/teamService";
 import {
  subscribeToFixtures,
  addFixtureToFirestore,
  updateFixtureInFirestore,
  deleteFixtureFromFirestore,
 } from "../services/fixtureService";

 import {
  subscribeToResults,
  addResultToFirestore,
  updateResultInFirestore,
  deleteResultFromFirestore,
} from "../services/resultService";

import {
  subscribeToTables,
  addTableRowToFirestore,
  updateTableRowInFirestore,
  deleteTableRowFromFirestore,
} from "../services/tableService";

import {
  subscribeToRankings,
  addRankingToFirestore,
  updateRankingInFirestore,
  deleteRankingFromFirestore,
} from "../services/rankingService";

import {
  subscribeToNews, 
  addNewsToFirestore,
  updateNewsInFirestore,
  deleteNewsFromFirestore,
} from "../services/newsService";

import {
  subscribeToContactMessages,
  addContactMessageToFirestore,
  deleteContactMessageFromFirestore,
} from "../services/contactService";

const AppDataContext = createContext();

const FIXTURES_KEY = "formidableSportsFixtures";
const RESULTS_KEY = "formidableSportsResults";
const NEWS_KEY = "formidableSportsNews";
const TABLE_KEY = "formidableSportsTable";
const TEAMS_KEY = "formidableSportsTeams";
const SPORTS_KEY = "formidableSportsSports";
const FAVOURITES_KEY = "formidableSportsFavourites";

const VALID_CATEGORIES = ["Male", "Female"];

const defaultTeams = [
  {
    id: 1,
    name: "Philosophy",
    logo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=300&q=80",
    qualified: true,
    category: "Male",
    about: "A disciplined and organized side with strong tactical structure.",
    coach: {
      name: "Coach Adebayo",
      about: "Experienced faculty coach with a focus on discipline and possession play.",
    },
    sports: ["Football"],
    players: [
      {
        id: 101,
        name: "John Musa",
        position: "Forward",
        jerseyNumber: 9,
        goals: 0,
        cleanSheets: 0,
        points: 0,
        appearances: 0,
      },
      {
        id: 102,
        name: "David Segun",
        position: "Goalkeeper",
        jerseyNumber: 1,
        goals: 0,
        cleanSheets: 0,
        points: 0,
        appearances: 0,
      },
    ],
  },
  {
    id: 2,
    name: "Economics",
    logo: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=300&q=80",
    qualified: true,
    category: "Male",
    about: "A competitive team known for direct attacking football.",
    coach: {
      name: "Coach Chinedu",
      about: "Focuses on transitions and quick buildup.",
    },
    sports: ["Football"],
    players: [],
  },
  {
    id: 3,
    name: "Law",
    logo: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80",
    qualified: true,
    category: "Female",
    about: "A strong female side with excellent defensive shape.",
    coach: {
      name: "Coach Ada",
      about: "Encourages structured pressing and balance.",
    },
    sports: ["Football"],
    players: [],
  },
];

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

export function isValidCategory(category) {
  return VALID_CATEGORIES.includes(category);
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function AppDataProvider({ children }) {
  const [rawFixtures, setRawFixtures] = useState(() => {
    const saved = localStorage.getItem(FIXTURES_KEY);
    return saved ? JSON.parse(saved) : initialFixtures;
  });

  const getSportRuleBySport = (sportName) => {
  return sportRules.find(
    (rule) =>
      String(rule.sport || "").toLowerCase() === String(sportName || "").toLowerCase()
  );
};

const updateSportRule = async (id, updates) => {
  await updateSportRuleInFirestore(id, updates);
};

  const [results, setResults] = useState([]);
    useEffect(() => {
  const unsubscribe = subscribeToFixtures((firestoreFixtures) => {
    setRawFixtures(firestoreFixtures);
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  const unsubscribe = subscribeToResults((firestoreResults) => {
    setResults(firestoreResults);
  });

  return () => unsubscribe();
}, []);

const [sportRules, setSportRules] = useState([]);
     useEffect(() => {
  seedDefaultSportRules(defaultSportRules);
}, []);

useEffect(() => {
  const unsubscribe = subscribeToSportRules((firestoreRules) => {
    setSportRules(firestoreRules);
  });

  return () => unsubscribe();
}, []);
  const [news, setNews] = useState([]);
    useEffect(() => {
  const unsubscribe = subscribeToNews((firestoreNews) => {
    setNews(firestoreNews);
  });

  return () => unsubscribe();
}, []);

  const [table, setTable] = useState([]);
    useEffect(() => {
      const unsubscribe = subscribeToTables((firestoreRows) => {
        setTable(firestoreRows);
      });
      return () => unsubscribe();
    }, []);
 const [teams, setTeams] = useState([]);

 useEffect(() => {
  const unsubscribe = subscribeToTeams((firestoreTeams) => {
    setTeams(firestoreTeams);
  });

  return () => unsubscribe();
}, []);

  const [rankings, setRankings] = useState([]);

  useEffect(() => {
  const unsubscribe = subscribeToRankings((firestoreRankings) => {
    setRankings(firestoreRankings);
  });

  return () => unsubscribe();

}, []);

   const [ contactMessages, setContactMessages] = useState([]);
   useEffect(() => {
  const unsubscribe = subscribeToContactMessages((firestoreMessages) => {
    setContactMessages(firestoreMessages);
  });

  return () => unsubscribe();
}, []);

  const [sports, setSports] = useState(() => {
    const saved = localStorage.getItem(SPORTS_KEY);
    return saved ? JSON.parse(saved) : initialSports;
  });

  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem(FAVOURITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const getTeamById = (teamId) =>
  teams.find((team) => String(team.id) === String(teamId));

  const getTeamByLegacyNameAndCategory = (teamName, category) =>
    teams.find(
      (team) =>
        normalizeText(team.name) === normalizeText(teamName) &&
        normalizeText(team.category) === normalizeText(category)
    );

  const getPlayerById = (teamId, playerId) => {
  const team = getTeamById(teamId);
  return team?.players?.find((player) => String(player.id) === String(playerId));
};

  const fixtures = useMemo(() => {
    return rawFixtures.map((fixture) => {
      const homeTeam =
  getTeamById(fixture.homeTeamId) ||
  getTeamByLegacyNameAndCategory(
    fixture.homeTeam || fixture.legacyHomeTeamName,
    fixture.gender || fixture.category
  );

const awayTeam =
  getTeamById(fixture.awayTeamId) ||
  getTeamByLegacyNameAndCategory(
    fixture.awayTeam || fixture.legacyAwayTeamName,
    fixture.gender || fixture.category
  );

      return {
        ...fixture,
        category: fixture.category || fixture.gender || homeTeam?.category || awayTeam?.category || "",
        gender: fixture.category || fixture.gender || homeTeam?.category || awayTeam?.category || "",
        homeTeamId: homeTeam?.id ?? fixture.homeTeamId ?? null,
        awayTeamId: awayTeam?.id ?? fixture.awayTeamId ?? null,
        homeTeam: homeTeam?.name || fixture.homeTeam || "Unknown Team",
        awayTeam: awayTeam?.name || fixture.awayTeam || "Unknown Team",
        lineups: {
          homeCoach: fixture.lineups?.homeCoach || "",
          awayCoach: fixture.lineups?.awayCoach || "",
          homePlayerIds: ensureArray(fixture.lineups?.homePlayerIds),
          awayPlayerIds: ensureArray(fixture.lineups?.awayPlayerIds),
        },
        score: {
          home: fixture.score?.home ?? 0,
          away: fixture.score?.away ?? 0,
        },
        cards: {
          homeYellow: fixture.cards?.homeYellow ?? 0,
          awayYellow: fixture.cards?.awayYellow ?? 0,
          homeRed: fixture.cards?.homeRed ?? 0,
          awayRed: fixture.cards?.awayRed ?? 0,
        },
        substitutions: {
          home: fixture.substitutions?.home ?? 0,
          away: fixture.substitutions?.away ?? 0,
        },
        events: ensureArray(fixture.events),
      };
    });
  }, [rawFixtures, teams]);

  useEffect(() => {
    localStorage.setItem(FIXTURES_KEY, JSON.stringify(rawFixtures));
  }, [rawFixtures]);

  useEffect(() => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem(NEWS_KEY, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(TABLE_KEY, JSON.stringify(table));
  }, [table]);

  

  useEffect(() => {
    localStorage.setItem(SPORTS_KEY, JSON.stringify(sports));
  }, [sports]);

  useEffect(() => {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const addContactMessage = async (message) => {
  await addContactMessageToFirestore(message);
};

const deleteContactMessage = async (id) => {
  await deleteContactMessageFromFirestore(id);
};

 const addFixture = async (fixture) => {
  await addFixtureToFirestore(fixture);
};

const deleteFixture = async (id) => {
  await deleteFixtureFromFirestore(id);
};

const updateFixture = async (id, updates) => {
  await updateFixtureInFirestore(id, updates);
};

const updateFixtureWithCallback = async (id, callback) => {
  const currentFixture = rawFixtures.find(
    (fixture) => String(fixture.id) === String(id)
  );

  if (!currentFixture) return;

  const updatedFixture = callback(currentFixture);
  await updateFixtureInFirestore(id, updatedFixture);
};

  const addResult = async (result) => {
  await addResultToFirestore(result);
};

const updateResult = async (id, updates) => {
  await updateResultInFirestore(id, updates);
};

const deleteResult = async (id) => {
  await deleteResultFromFirestore(id);
};

const syncResultsFromEndedFixtures = async () => {
  const existingMap = new Map(
    results.map((result) => [String(result.localId || result.id), result])
  );


 

  const endedFixtures = fixtures.filter((fixture) => fixture.status === "Ended");

  for (const fixture of endedFixtures) {
    const payload = {
      sport: fixture.sport,
      gender: fixture.category,
      category: fixture.category,
      homeTeamId: fixture.homeTeamId,
      awayTeamId: fixture.awayTeamId,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      homeScore: fixture.score?.home ?? 0,
      awayScore: fixture.score?.away ?? 0,
      date: fixture.date,
      venue: fixture.venue,
      localId: fixture.id,
    };

    const existing = existingMap.get(String(fixture.id));

    if (existing) {
      await updateResultInFirestore(existing.id, payload);
    } else {
      await addResultToFirestore(payload);
    }
  }
};

 const addNews = async (item) => {
  await addNewsToFirestore(item);
};

const updateNews = async (id, updates) => {
  await updateNewsInFirestore(id, updates);
};

const deleteNews = async (id) => {
  await deleteNewsFromFirestore(id);
};

 const updateTableRow = async (id, field, value) => {
  await updateTableRowInFirestore(id, {
    [field]:
      ["team", "sport", "category"].includes(field)
        ? value
        : Number(value),
  });
};

const addTableTeam = async (teamName, sport = "Football", category = "Male") => {
  await addTableRowToFirestore({
    sport,
    category,
    team: teamName,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    position: 1,
  });
};

const deleteTableTeam = async (id) => {
  await deleteTableRowFromFirestore(id);
};

const getSortedTable = (sport = "Football", category = "Male") => {
  return [...table]
    .filter(
      (row) =>
        (row.sport || "").toLowerCase() === sport.toLowerCase() &&
        (row.category || "").toLowerCase() === category.toLowerCase()
    )
    .sort((a, b) => {
      if ((b.points ?? 0) !== (a.points ?? 0)) return (b.points ?? 0) - (a.points ?? 0);
      if ((b.goalDifference ?? 0) !== (a.goalDifference ?? 0)) {
        return (b.goalDifference ?? 0) - (a.goalDifference ?? 0);
      }
      return (b.goalsFor ?? 0) - (a.goalsFor ?? 0);
    })
    .map((row, index) => ({
      ...row,
      position: index + 1,
    }));
};

const recalculateTablesFromEndedFixtures = async () => {
  const leagueFixtures = fixtures.filter(
    (fixture) =>
      String(fixture.sport || "").toLowerCase() === "football" &&
      String(fixture.stage || "").toLowerCase() === "group stage" &&
      fixture.status === "Ended" &&
      ["male", "female"].includes(String(fixture.category || "").toLowerCase())
  );

  const grouped = {};

  leagueFixtures.forEach((fixture) => {
    const key = `${fixture.sport}__${fixture.category}`;
    if (!grouped[key]) grouped[key] = {};

    const homeName = fixture.homeTeam;
    const awayName = fixture.awayTeam;
    const homeScore = fixture.score?.home ?? 0;
    const awayScore = fixture.score?.away ?? 0;

    const ensureTeam = (teamName) => {
      if (!grouped[key][teamName]) {
        grouped[key][teamName] = {
          sport: fixture.sport,
          category: fixture.category,
          team: teamName,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          position: 1,
        };
      }
    };

    ensureTeam(homeName);
    ensureTeam(awayName);

    grouped[key][homeName].played += 1;
    grouped[key][awayName].played += 1;

    grouped[key][homeName].goalsFor += homeScore;
    grouped[key][homeName].goalsAgainst += awayScore;
    grouped[key][awayName].goalsFor += awayScore;
    grouped[key][awayName].goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      grouped[key][homeName].won += 1;
      grouped[key][homeName].points += 3;
      grouped[key][awayName].lost += 1;
    } else if (awayScore > homeScore) {
      grouped[key][awayName].won += 1;
      grouped[key][awayName].points += 3;
      grouped[key][homeName].lost += 1;
    } else {
      grouped[key][homeName].drawn += 1;
      grouped[key][awayName].drawn += 1;
      grouped[key][homeName].points += 1;
      grouped[key][awayName].points += 1;
    }
  });

  const existingRows = [...table];

  for (const key of Object.keys(grouped)) {
    const rows = Object.values(grouped[key])
      .map((row) => ({
        ...row,
        goalDifference: row.goalsFor - row.goalsAgainst,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      })
      .map((row, index) => ({
        ...row,
        position: index + 1,
      }));

    for (const row of rows) {
      const existing = existingRows.find(
        (item) =>
          String(item.team || "").toLowerCase() === String(row.team || "").toLowerCase() &&
          String(item.sport || "").toLowerCase() === String(row.sport || "").toLowerCase() &&
          String(item.category || "").toLowerCase() === String(row.category || "").toLowerCase()
      );

      if (existing) {
        await updateTableRowInFirestore(existing.id, row);
      } else {
        await addTableRowToFirestore(row);
      }
    }
  }
};

  const addTeam = async (team) => {
  await addTeamToFirestore({
    ...team,
    players: team.players || [],
    sports: team.sports || [],
  });
};

const updateTeam = async (id, updates) => {
  await updateTeamInFirestore(id, updates);
};

const deleteTeam = async (id) => {
  await deleteTeamFromFirestore(id);
};

const addPlayerToTeam = async (teamId, player) => {
  const team = teams.find((item) => String(item.id) === String(teamId));
  if (!team) return;

  const currentPlayers = team.players || [];

  if (currentPlayers.length >= 30) return;

  await updateTeamInFirestore(teamId, {
    players: [...currentPlayers, player],
  });
};

const updatePlayerInTeam = async (teamId, playerId, updates) => {
  const team = teams.find((item) => String(item.id) === String(teamId));
  if (!team) return;

  const updatedPlayers = (team.players || []).map((player) =>
    String(player.id) === String(playerId)
      ? { ...player, ...updates }
      : player
  );

  await updateTeamInFirestore(teamId, {
    players: updatedPlayers,
  });
};

const deletePlayerFromTeam = async (teamId, playerId) => {
  const team = teams.find((item) => String(item.id) === String(teamId));
  if (!team) return;

  const updatedPlayers = (team.players || []).filter(
    (player) => String(player.id) !== String(playerId)
  );

  await updateTeamInFirestore(teamId, {
    players: updatedPlayers,
  });
};
  const isSquadValid = (teamId) => {
    const team = teams.find((item) => String (item.id) === String(teamId));
    if (!team) return false;

    const count = (team.players || []).length;
    return count >= 25 && count <= 30;
  };

  const recalculateAllPlayerStats = () => {
    setTeams((prevTeams) => {
      const nextTeams = prevTeams.map((team) => ({
        ...team,
        players: (team.players || []).map((player) => ({
          ...player,
          goals: 0,
          cleanSheets: 0,
          appearances: 0,
        })),
      }));

      const fixturesForStats = fixtures.filter((fixture) =>
        ["Ended", "Live"].includes(fixture.status)
      );

      fixturesForStats.forEach((fixture) => {
        const homeTeam = nextTeams.find((team) => team.id === fixture.homeTeamId);
        const awayTeam = nextTeams.find((team) => team.id === fixture.awayTeamId);

        const homeAppearanceIds = new Set([
          ...ensureArray(fixture.lineups?.homePlayerIds),
          ...ensureArray(fixture.events)
            .filter((event) => event.type === "Substitution" && event.teamSide === "home")
            .map((event) => event.playerInId)
            .filter(Boolean),
        ]);

        const awayAppearanceIds = new Set([
          ...ensureArray(fixture.lineups?.awayPlayerIds),
          ...ensureArray(fixture.events)
            .filter((event) => event.type === "Substitution" && event.teamSide === "away")
            .map((event) => event.playerInId)
            .filter(Boolean),
        ]);

        if (homeTeam) {
          homeTeam.players = (homeTeam.players || []).map((player) =>
            homeAppearanceIds.has(player.id)
              ? { ...player, appearances: (player.appearances || 0) + 1 }
              : player
          );
        }

        if (awayTeam) {
          awayTeam.players = (awayTeam.players || []).map((player) =>
            awayAppearanceIds.has(player.id)
              ? { ...player, appearances: (player.appearances || 0) + 1 }
              : player
          );
        }

        ensureArray(fixture.events).forEach((event) => {
          const currentTeam = event.teamSide === "home" ? homeTeam : awayTeam;
          if (!currentTeam || !event.playerId) return;

          currentTeam.players = (currentTeam.players || []).map((player) => {
            if (player.id !== Number(event.playerId)) return player;

            if (normalizeText(fixture.sport) === "football" && event.type === "Goal") {
              return { ...player, goals: (player.goals || 0) + 1 };
            }

            if (
              ["basketball", "volleyball", "tennis"].includes(normalizeText(fixture.sport)) &&
              event.type === "Score"
            ) {
              return { ...player, points: (player.points || 0) + (Number(event.pointsValue) || 1) };
            }

            return player;
          });
        });

        if (fixture.status === "Ended" && normalizeText(fixture.sport) === "football") {
          if ((fixture.score?.away ?? 0) === 0 && homeTeam) {
            const validHomeKeepers = (homeTeam.players || []).filter(
              (player) =>
                normalizeText(player.position) === "goalkeeper" &&
                homeAppearanceIds.has(player.id)
            );

            if (validHomeKeepers.length) {
              const keeperIds = new Set(validHomeKeepers.map((player) => player.id));
              homeTeam.players = (homeTeam.players || []).map((player) =>
                keeperIds.has(player.id)
                  ? { ...player, cleanSheets: (player.cleanSheets || 0) + 1 }
                  : player
              );
            }
          }

          if ((fixture.score?.home ?? 0) === 0 && awayTeam) {
            const validAwayKeepers = (awayTeam.players || []).filter(
              (player) =>
                normalizeText(player.position) === "goalkeeper" &&
                awayAppearanceIds.has(player.id)
            );

            if (validAwayKeepers.length) {
              const keeperIds = new Set(validAwayKeepers.map((player) => player.id));
              awayTeam.players = (awayTeam.players || []).map((player) =>
                keeperIds.has(player.id)
                  ? { ...player, cleanSheets: (player.cleanSheets || 0) + 1 }
                  : player
              );
            }
          }
        }
      });

      return nextTeams;
    });
  };

  const getTeamFixtures = (teamId) =>
    fixtures.filter(
      (fixture) => fixture.homeTeamId === Number(teamId) || fixture.awayTeamId === Number(teamId)
    );

  const getPlayerMatchHistory = (teamId, playerId) => {
    const teamFixtures = getTeamFixtures(teamId);

    return teamFixtures.filter((fixture) => {
      const started =
        ensureArray(fixture.lineups?.homePlayerIds).includes(Number(playerId)) ||
        ensureArray(fixture.lineups?.awayPlayerIds).includes(Number(playerId));

      const subbedIn = ensureArray(fixture.events).some(
        (event) =>
          event.type === "Substitution" && Number(event.playerInId) === Number(playerId)
      );

      const hadEvent = ensureArray(fixture.events).some(
        (event) => Number(event.playerId) === Number(playerId)
      );

      return started || subbedIn || hadEvent;
    });
  };

  const addSport = (sport) => {
    setSports((prev) => [sport, ...prev]);
  };

  const updateSport = (id, updates) => {
    setSports((prev) =>
      prev.map((sport) => (sport.id === id ? { ...sport, ...updates } : sport))
    );
  };

  const toggleFavouriteMatch = (matchId) => {
    setFavourites((prev) =>
      prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId]
    );
  };

  const removeFavouriteMatch = (matchId) => {
    setFavourites((prev) => prev.filter((id) => id !== matchId));
  };

  const isFavouriteMatch = (matchId) => favourites.includes(matchId);

  const addRanking = async (ranking) => {
    await addRankingToFirestore(ranking);
  };

  const updateRanking = async (id, updates) => {
    await updateRankingInFirestore(id, updates);
  };

  const deleteRanking = async (id) => {
    await deleteRankingFromFirestore(id);
  };

  const getRankingsBySportAndCategory = (sport, category) => {
    return [...rankings]
      .filter(
        (item) =>
          String(item.sport || "").toLowerCase() === String(sport || "").toLowerCase() &&
          String(item.category || "").toLowerCase() === String(category || "").toLowerCase()
      )
      .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  };

  const value = useMemo(
    () => ({
      fixtures,
      rawFixtures,
      results,
      news,
      table,
      teams,
      sports,
      favourites,
      facultyDepartments,
      getTeamById,
      getPlayerById,
      getTeamFixtures,
      getPlayerMatchHistory,
      addFixture,
      deleteFixture,
      updateFixture,
      updateFixtureWithCallback,
      addResult,
      updateResult,
      deleteResult,
      syncResultsFromEndedFixtures,
      addNews,
      deleteNews,
      updateTableRow,
      addTableTeam,
      deleteTableTeam,
      getSortedTable,
      recalculateTablesFromEndedFixtures,
      setTable,
      addTeam,
      updateTeam,
      deleteTeam,
      addPlayerToTeam,
      updatePlayerInTeam,
      deletePlayerFromTeam,
      isSquadValid,
      recalculateAllPlayerStats,
      addSport,
      updateSport,
      toggleFavouriteMatch,
      removeFavouriteMatch,
      isFavouriteMatch,
      rankings,
      addRanking,
      updateRanking,
      deleteRanking,
      getRankingsBySportAndCategory,
      addNews,
      updateNews,
      deleteNews,
      contactMessages,
      addContactMessage,
      deleteContactMessage,
      sportRules,
      getSportRuleBySport,
      updateSportRule,
    }),
    [fixtures, rawFixtures, results, news, table, teams, sports, favourites]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}