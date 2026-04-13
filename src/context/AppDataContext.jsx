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

import {
  subscribeToTeams,
  addTeamToFirestore,
  updateTeamInFirestore,
  deleteTeamFromFirestore,
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

import {
  subscribeToGallery,
  addGalleryItemToFirestore,
  updateGalleryItemInFirestore,
  deleteGalleryItemFromFirestore,
} from "../services/galleryService";

const AppDataContext = createContext();

const FIXTURES_KEY = "formidableSportsFixtures";
const RESULTS_KEY = "formidableSportsResults";
const NEWS_KEY = "formidableSportsNews";
const TABLE_KEY = "formidableSportsTable";
const SPORTS_KEY = "formidableSportsSports";
const FAVOURITES_KEY = "formidableSportsFavourites";

const VALID_CATEGORIES = ["Male", "Female"];

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
}

function safeId(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
}

export function isValidCategory(category) {
  return VALID_CATEGORIES.includes(category);
}

export function AppDataProvider({ children }) {
  const [rawFixtures, setRawFixtures] = useState(() => {
    const saved = localStorage.getItem(FIXTURES_KEY);
    return saved ? JSON.parse(saved) : initialFixtures;
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem(RESULTS_KEY);
    return saved ? JSON.parse(saved) : initialResults;
  });

  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem(NEWS_KEY);
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [table, setTable] = useState(() => {
    const saved = localStorage.getItem(TABLE_KEY);
    return saved ? JSON.parse(saved) : initialTable;
  });

  const [teams, setTeams] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [sportRules, setSportRules] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [sports, setSports] = useState(() => {
    const saved = localStorage.getItem(SPORTS_KEY);
    return saved ? JSON.parse(saved) : initialSports;
  });

  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem(FAVOURITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    seedDefaultSportRules(defaultSportRules);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToSportRules((firestoreRules) => {
      setSportRules(firestoreRules);
    });
    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    const unsubscribe = subscribeToNews((firestoreNews) => {
      setNews(firestoreNews);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToTables((firestoreRows) => {
      setTable(firestoreRows);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToTeams((firestoreTeams) => {
      setTeams(firestoreTeams);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToRankings((firestoreRankings) => {
      setRankings(firestoreRankings);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToContactMessages((firestoreMessages) => {
      setContactMessages(firestoreMessages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToGallery((firestoreGallery) => {
      setGallery(firestoreGallery);
    });
    return () => unsubscribe();
  }, []);

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

  const getSportRuleBySport = (sportName) => {
    return sportRules.find(
      (rule) => normalizeText(rule?.sport) === normalizeText(sportName)
    );
  };

  const updateSportRule = async (id, updates) => {
    await updateSportRuleInFirestore(id, updates);
  };

  const getTeamById = (teamId) =>
    teams.find((team) => String(team.id) === String(teamId));

  const getTeamByLegacyIdentity = (teamName, category, sport) =>
    teams.find(
      (team) =>
        normalizeText(team.department || team.name) === normalizeText(teamName) &&
        normalizeText(team.category) === normalizeText(category) &&
        normalizeText(team.sport) === normalizeText(sport)
    );

  const getPlayerById = (teamId, playerId) => {
    const team = getTeamById(teamId);
    return team?.players?.find((player) => String(player.id) === String(playerId));
  };

  const fixtures = useMemo(() => {
    return rawFixtures.map((fixture) => {
      const safeSport = safeText(fixture.sport, "");
      const safeCategory =
        safeText(fixture.category, "") || safeText(fixture.gender, "");

      const homeTeam =
        getTeamById(fixture.homeTeamId) ||
        getTeamByLegacyIdentity(
          fixture.homeTeam || fixture.legacyHomeTeamName,
          safeCategory,
          safeSport
        );

      const awayTeam =
        getTeamById(fixture.awayTeamId) ||
        getTeamByLegacyIdentity(
          fixture.awayTeam || fixture.legacyAwayTeamName,
          safeCategory,
          safeSport
        );

      return {
        ...fixture,
        id: safeId(fixture.id || fixture.localId, ""),
        localId: safeId(fixture.localId, ""),
        sport: safeSport,
        category:
          safeCategory ||
          safeText(homeTeam?.category, "") ||
          safeText(awayTeam?.category, ""),
        gender:
          safeCategory ||
          safeText(homeTeam?.category, "") ||
          safeText(awayTeam?.category, ""),
        stage: safeText(fixture.stage, ""),
        competitionGroup: safeText(fixture.competitionGroup, ""),
        homeTeamId: safeId(homeTeam?.id || fixture.homeTeamId, ""),
        awayTeamId: safeId(awayTeam?.id || fixture.awayTeamId, ""),
        homeTeam:
          safeText(homeTeam?.department || homeTeam?.name, "") ||
          safeText(fixture.homeTeam, "Unknown Team"),
        awayTeam:
          safeText(awayTeam?.department || awayTeam?.name, "") ||
          safeText(fixture.awayTeam, "Unknown Team"),
        date: safeText(fixture.date, ""),
        kickoffTime: safeText(fixture.kickoffTime, ""),
        endTime: safeText(fixture.endTime, ""),
        venue: safeText(fixture.venue, ""),
        status: safeText(fixture.status, "Upcoming"),
        postponed: Boolean(fixture.postponed),
        periodDurationMinutes: Number(fixture.periodDurationMinutes || 0),
        lineups: {
          homeCoach: safeText(fixture.lineups?.homeCoach, ""),
          awayCoach: safeText(fixture.lineups?.awayCoach, ""),
          homePlayerIds: ensureArray(fixture.lineups?.homePlayerIds),
          awayPlayerIds: ensureArray(fixture.lineups?.awayPlayerIds),
        },
        score: {
          home: Number(fixture.score?.home ?? 0),
          away: Number(fixture.score?.away ?? 0),
        },
        cards: {
          homeYellow: Number(fixture.cards?.homeYellow ?? 0),
          awayYellow: Number(fixture.cards?.awayYellow ?? 0),
          homeRed: Number(fixture.cards?.homeRed ?? 0),
          awayRed: Number(fixture.cards?.awayRed ?? 0),
        },
        substitutions: {
          home: Number(fixture.substitutions?.home ?? 0),
          away: Number(fixture.substitutions?.away ?? 0),
        },
        events: ensureArray(fixture.events),
        timing:
          fixture.timing && typeof fixture.timing === "object"
            ? fixture.timing
            : {
                mode: "clock",
                currentPeriod: 0,
                totalPeriods: 2,
                periodLabel: "Half",
                periodDurationMinutes: Number(fixture.periodDurationMinutes || 30),
                breakDurationMinutes: 0,
                phase: "Pre-Match",
                isRunning: false,
                startedAt: null,
                pausedAt: null,
                currentPeriodStartedAt: null,
                breakStartedAt: null,
                elapsedSeconds: 0,
                remainingSeconds: 0,
                homeSetsWon: 0,
                awaySetsWon: 0,
                sets: [],
                currentSetNumber: 0,
                currentSetHome: 0,
                currentSetAway: 0,
              },
      };
    });
  }, [rawFixtures, teams]);

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

    if (!currentFixture) return null;

    const updatedFixture = callback(currentFixture);
    await updateFixtureInFirestore(id, updatedFixture);
    return updatedFixture;
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

  const syncSingleResultFromFixture = async (fixture) => {
    if (!fixture || fixture.status !== "Ended") return;

    const existing = results.find(
      (result) =>
        String(result.fixtureId || result.localId || result.id) === String(fixture.id)
    );

    const summary = ensureArray(fixture.events)
      .filter((event) =>
        ["Goal", "Score", "Yellow Card", "Red Card", "Substitution"].includes(event.type)
      )
      .slice(0, 10)
      .map((event) => {
        const minute = event.minute ? `${event.minute}'` : "";
        const teamName =
          event.teamSide === "home" ? fixture.homeTeam : fixture.awayTeam;

        return `${minute} ${event.type} - ${teamName}`;
      })
      .join(" • ");

    const payload = {
      fixtureId: fixture.id,
      localId: fixture.id,
      sport: fixture.sport || "",
      gender: fixture.category || fixture.gender || "",
      category: fixture.category || fixture.gender || "",
      stage: fixture.stage || "",
      competitionGroup: fixture.competitionGroup || "",
      homeTeamId: fixture.homeTeamId || "",
      awayTeamId: fixture.awayTeamId || "",
      homeTeam: fixture.homeTeam || "",
      awayTeam: fixture.awayTeam || "",
      homeScore: fixture.score?.home ?? 0,
      awayScore: fixture.score?.away ?? 0,
      date: fixture.date || "",
      kickoffTime: fixture.kickoffTime || "",
      endTime: fixture.endTime || "",
      venue: fixture.venue || "",
      events: ensureArray(fixture.events),
      summary:
        summary ||
        `${fixture.homeTeam || "Home"} ${fixture.score?.home ?? 0} - ${fixture.score?.away ?? 0} ${fixture.awayTeam || "Away"}`,
    };

    if (existing) {
      await updateResultInFirestore(existing.id, payload);
    } else {
      await addResultToFirestore(payload);
    }
  };

  const syncResultsFromEndedFixtures = async () => {
    const endedFixtures = fixtures.filter((fixture) => fixture.status === "Ended");

    for (const fixture of endedFixtures) {
      await syncSingleResultFromFixture(fixture);
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

  const addGalleryItem = async (item) => {
    await addGalleryItemToFirestore(item);
  };

  const updateGalleryItem = async (id, updates) => {
    await updateGalleryItemInFirestore(id, updates);
  };

  const deleteGalleryItem = async (id) => {
    await deleteGalleryItemFromFirestore(id);
  };

  const updateTableRow = async (id, field, value) => {
    await updateTableRowInFirestore(id, {
      [field]: ["team", "sport", "category", "competitionGroup"].includes(field)
        ? value
        : Number(value),
    });
  };

  const addTableTeam = async (
    teamName,
    sport = "Football",
    category = "Male",
    competitionGroup = ""
  ) => {
    await addTableRowToFirestore({
      sport,
      category,
      competitionGroup,
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

const getSortedTable = (
  sport = "Football",
  category = "Male",
  competitionGroup = ""
) => {
  return [...table]
    .filter((row) => {
      const sameSport =
        normalizeText(row.sport) === normalizeText(sport);
      const sameCategory =
        normalizeText(row.category) === normalizeText(category);

      if (!sameSport || !sameCategory) return false;

      if (competitionGroup) {
        return normalizeText(row.competitionGroup) === normalizeText(competitionGroup);
      }

      return normalizeText(row.competitionGroup) !== "";
    })
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
        normalizeText(fixture.stage) === "group stage" &&
        fixture.status === "Ended" &&
        ["male", "female"].includes(normalizeText(fixture.category))
    );

    const grouped = {};

    leagueFixtures.forEach((fixture) => {
      const key = `${fixture.sport}__${fixture.category}__${fixture.competitionGroup || ""}`;

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
            competitionGroup: fixture.competitionGroup || "",
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
            normalizeText(item.team) === normalizeText(row.team) &&
            normalizeText(item.sport) === normalizeText(row.sport) &&
            normalizeText(item.category) === normalizeText(row.category) &&
            normalizeText(item.competitionGroup) === normalizeText(row.competitionGroup)
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
      String(player.id) === String(playerId) ? { ...player, ...updates } : player
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
    const team = teams.find((item) => String(item.id) === String(teamId));
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
          points: 0,
        })),
      }));

      const fixturesForStats = fixtures.filter((fixture) =>
        ["Ended", "Live"].includes(fixture.status)
      );

      fixturesForStats.forEach((fixture) => {
        const homeTeam = nextTeams.find((team) => String(team.id) === String(fixture.homeTeamId));
        const awayTeam = nextTeams.find((team) => String(team.id) === String(fixture.awayTeamId));

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
            if (String(player.id) !== String(event.playerId)) return player;

            if (normalizeText(fixture.sport) === "football" && event.type === "Goal") {
              return { ...player, goals: (player.goals || 0) + 1 };
            }

            if (
              ["basketball", "volleyball", "table tennis", "tennis"].includes(
                normalizeText(fixture.sport)
              ) &&
              event.type === "Score"
            ) {
              return {
                ...player,
                points: (player.points || 0) + (Number(event.pointsValue) || 1),
              };
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
      (fixture) =>
        String(fixture.homeTeamId) === String(teamId) ||
        String(fixture.awayTeamId) === String(teamId)
    );

  const getPlayerMatchHistory = (teamId, playerId) => {
    const teamFixtures = getTeamFixtures(teamId);

    return teamFixtures.filter((fixture) => {
      const playerIdAsString = String(playerId);

      const started =
        ensureArray(fixture.lineups?.homePlayerIds).some((id) => String(id) === playerIdAsString) ||
        ensureArray(fixture.lineups?.awayPlayerIds).some((id) => String(id) === playerIdAsString);

      const subbedIn = ensureArray(fixture.events).some(
        (event) =>
          event.type === "Substitution" &&
          String(event.playerInId) === playerIdAsString
      );

      const hadEvent = ensureArray(fixture.events).some(
        (event) => String(event.playerId) === playerIdAsString
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
          normalizeText(item.sport) === normalizeText(sport) &&
          normalizeText(item.category) === normalizeText(category)
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
      gallery,
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
      syncSingleResultFromFixture,
      addNews,
      updateNews,
      deleteNews,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
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
      contactMessages,
      addContactMessage,
      deleteContactMessage,
      sportRules,
      getSportRuleBySport,
      updateSportRule,
    }),
    [
      fixtures,
      rawFixtures,
      results,
      news,
      table,
      teams,
      sports,
      favourites,
      gallery,
      rankings,
      contactMessages,
      sportRules,
    ]
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