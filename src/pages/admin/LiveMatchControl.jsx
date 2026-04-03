import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function LiveMatchControl() {
  const {
    fixtures,
    getTeamById,
    getSportRuleBySport,
    updateFixtureWithCallback,
    recalculateAllPlayerStats,
    syncResultsFromEndedFixtures,
    recalculateTablesFromEndedFixtures,
  } = useAppData();

  const [selectedMatchId, setSelectedMatchId] = useState(fixtures[0]?.id || "");
  const [editingEventId, setEditingEventId] = useState(null);

  const [eventForm, setEventForm] = useState({
    minute: "",
    type: "Goal",
    teamSide: "home",
    playerId: "",
    playerInId: "",
    playerOutId: "",
    pointsValue: "1",
    note: "",
  });

  const selectedMatch = useMemo(() => {
    return fixtures.find((match) => String(match.id) === String(selectedMatchId));
  }, [fixtures, selectedMatchId]);

  const rule = useMemo(() => {
    if (!selectedMatch) return null;
    return getSportRuleBySport(selectedMatch.sport);
  }, [selectedMatch, getSportRuleBySport]);

  const normalizeSport = (sport) => String(sport || "").trim().toLowerCase();

  const currentTeam = useMemo(() => {
    if (!selectedMatch) return null;
    return eventForm.teamSide === "home"
      ? getTeamById(selectedMatch.homeTeamId)
      : getTeamById(selectedMatch.awayTeamId);
  }, [selectedMatch, eventForm.teamSide, getTeamById]);

  const timing = selectedMatch?.timing || {};

  const [derivedRemainingSeconds, setDerivedRemainingSeconds] = useState(
    Number(timing.remainingSeconds || 0)
  );

  useEffect(() => {
    if (!selectedMatch || !rule) return;

    const currentTiming = selectedMatch.timing || {};

    if (rule.mode !== "clock") return;

    const computeRemaining = () => {
      if (!currentTiming.isRunning || !currentTiming.currentPeriodStartedAt) {
        return Number(currentTiming.remainingSeconds || 0);
      }

      const startedAt = new Date(currentTiming.currentPeriodStartedAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startedAt) / 1000);
      const total = Number(currentTiming.periodDurationMinutes || rule.minutesPerPeriod || 0) * 60;
      return Math.max(total - elapsed, 0);
    };

    setDerivedRemainingSeconds(computeRemaining());

    const interval = setInterval(() => {
      setDerivedRemainingSeconds(computeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedMatch, rule]);

  useEffect(() => {
    if (!selectedMatch || !rule) return;
    if (rule.mode !== "clock") return;
    if (!timing.isRunning) return;
    if (derivedRemainingSeconds > 0) return;

    const handleAutoStopAtPeriodEnd = async () => {
      await updateFixtureWithCallback(selectedMatch.id, (match) => {
        const current = match.timing || {};
        const currentPeriod = Number(current.currentPeriod || 1);
        const totalPeriods = Number(current.totalPeriods || rule.periods || 2);
        const isFinalPeriod = currentPeriod >= totalPeriods;
        const isHalftime =
          currentPeriod === Number(rule.halftimeAfterPeriod || 1) && !isFinalPeriod;

        return {
          ...match,
          status: isFinalPeriod ? "Ended" : isHalftime ? "Halftime" : "Break",
          timing: {
            ...current,
            isRunning: false,
            phase: isFinalPeriod ? "Ended" : isHalftime ? "Halftime" : "Break",
            remainingSeconds: 0,
            breakStartedAt: new Date().toISOString(),
          },
        };
      });

      await recalculateAllPlayerStats();
      await syncResultsFromEndedFixtures();
      await recalculateTablesFromEndedFixtures();
    };

    handleAutoStopAtPeriodEnd();
  }, [
    derivedRemainingSeconds,
    selectedMatch,
    rule,
    timing.isRunning,
    updateFixtureWithCallback,
    recalculateAllPlayerStats,
    syncResultsFromEndedFixtures,
    recalculateTablesFromEndedFixtures,
  ]);

  const handleEventChange = (event) => {
    const { name, value } = event.target;

    setEventForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "teamSide" ? { playerId: "", playerInId: "", playerOutId: "" } : {}),
    }));
  };

  const resetEventForm = () => {
    setEventForm({
      minute: "",
      type: "Goal",
      teamSide: "home",
      playerId: "",
      playerInId: "",
      playerOutId: "",
      pointsValue: "1",
      note: "",
    });
    setEditingEventId(null);
  };

  const recalculateMatchFromEvents = (match, events) => {
    const nextMatch = {
      ...match,
      score: { home: 0, away: 0 },
      cards: {
        homeYellow: 0,
        awayYellow: 0,
        homeRed: 0,
        awayRed: 0,
      },
      substitutions: {
        home: 0,
        away: 0,
      },
      events,
    };

    events.forEach((item) => {
      if (normalizeSport(match.sport) === "football" && item.type === "Goal") {
        nextMatch.score[item.teamSide] += 1;
      }

      if (
        ["basketball", "volleyball", "table tennis"].includes(normalizeSport(match.sport)) &&
        item.type === "Score"
      ) {
        nextMatch.score[item.teamSide] += Number(item.pointsValue || 1);
      }

      if (item.type === "Yellow Card") {
        const key = item.teamSide === "home" ? "homeYellow" : "awayYellow";
        nextMatch.cards[key] += 1;
      }

      if (item.type === "Red Card") {
        const key = item.teamSide === "home" ? "homeRed" : "awayRed";
        nextMatch.cards[key] += 1;
      }

      if (item.type === "Substitution") {
        nextMatch.substitutions[item.teamSide] += 1;
      }
    });

    return nextMatch;
  };

  const handleAddOrUpdateEvent = async (event) => {
    event.preventDefault();

    if (!selectedMatch) return;

    const needsSinglePlayer =
      eventForm.type !== "Substitution" &&
      (eventForm.type === "Goal" ||
        eventForm.type === "Yellow Card" ||
        eventForm.type === "Red Card" ||
        eventForm.type === "Score");

    if (!eventForm.minute) return;
    if (needsSinglePlayer && !eventForm.playerId) return;
    if (eventForm.type === "Substitution" && (!eventForm.playerInId || !eventForm.playerOutId)) {
      return;
    }

    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      let nextEvents = [...(match.events || [])];

      const payload = {
        id: editingEventId || Date.now(),
        minute: eventForm.minute,
        type: eventForm.type,
        teamSide: eventForm.teamSide,
        playerId: eventForm.playerId ? Number(eventForm.playerId) : null,
        playerInId: eventForm.playerInId ? Number(eventForm.playerInId) : null,
        playerOutId: eventForm.playerOutId ? Number(eventForm.playerOutId) : null,
        pointsValue: Number(eventForm.pointsValue || 1),
        note: eventForm.note,
      };

      if (editingEventId) {
        nextEvents = nextEvents.map((item) =>
          item.id === editingEventId ? payload : item
        );
      } else {
        nextEvents = [payload, ...nextEvents];
      }

      return recalculateMatchFromEvents(match, nextEvents);
    });

    resetEventForm();

    await recalculateAllPlayerStats();
    await syncResultsFromEndedFixtures();
    await recalculateTablesFromEndedFixtures();
  };

  const handleEditEvent = (eventItem) => {
    setEditingEventId(eventItem.id);
    setEventForm({
      minute: eventItem.minute || "",
      type: eventItem.type || "Goal",
      teamSide: eventItem.teamSide || "home",
      playerId: eventItem.playerId ? String(eventItem.playerId) : "",
      playerInId: eventItem.playerInId ? String(eventItem.playerInId) : "",
      playerOutId: eventItem.playerOutId ? String(eventItem.playerOutId) : "",
      pointsValue: String(eventItem.pointsValue || 1),
      note: eventItem.note || "",
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!selectedMatch) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const nextEvents = (match.events || []).filter((item) => item.id !== eventId);
      return recalculateMatchFromEvents(match, nextEvents);
    });

    if (editingEventId === eventId) {
      resetEventForm();
    }

    await recalculateAllPlayerStats();
    await syncResultsFromEndedFixtures();
    await recalculateTablesFromEndedFixtures();
  };

  const resolvePlayerName = (playerId, side) => {
    if (!selectedMatch || !playerId) return "Unknown Player";

    const team =
      side === "home"
        ? getTeamById(selectedMatch.homeTeamId)
        : getTeamById(selectedMatch.awayTeamId);

    return (
      team?.players?.find((player) => String(player.id) === String(playerId))?.name ||
      "Unknown Player"
    );
  };

  const canAutoStart = () => {
    if (!selectedMatch) return false;
    if (selectedMatch.status !== "Upcoming") return false;

    const kickoff = new Date(`${selectedMatch.date}T${selectedMatch.kickoffTime}:00`);
    if (Number.isNaN(kickoff.getTime())) return false;

    return Date.now() >= kickoff.getTime();
  };

  const handleStartClockMatch = async () => {
    if (!selectedMatch || !rule) return;

    const totalSeconds = Number(rule.minutesPerPeriod || 0) * 60;

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      timing: {
        ...(match.timing || {}),
        mode: "clock",
        currentPeriod: 1,
        totalPeriods: Number(rule.periods || 2),
        periodLabel: rule.periodLabel || "Half",
        periodDurationMinutes: Number(rule.minutesPerPeriod || 0),
        breakDurationMinutes: Number(rule.halftimeMinutes || 0),
        phase: "Live",
        isRunning: true,
        startedAt: match.timing?.startedAt || new Date().toISOString(),
        currentPeriodStartedAt: new Date().toISOString(),
        breakStartedAt: null,
        remainingSeconds: totalSeconds,
      },
    }));
  };

  const handlePauseClock = async () => {
    if (!selectedMatch) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      timing: {
        ...(match.timing || {}),
        isRunning: false,
        phase: "Paused",
        remainingSeconds: derivedRemainingSeconds,
        pausedAt: new Date().toISOString(),
      },
    }));
  };

  const handleResumeClock = async () => {
    if (!selectedMatch || !rule) return;

    const remaining = Number(
      derivedRemainingSeconds || timing.remainingSeconds || rule.minutesPerPeriod * 60
    );

    const totalPeriodSeconds = Number(rule.minutesPerPeriod || 0) * 60;
    const startedAt = new Date(Date.now() - (totalPeriodSeconds - remaining) * 1000).toISOString();

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      timing: {
        ...(match.timing || {}),
        isRunning: true,
        phase: "Live",
        currentPeriodStartedAt: startedAt,
        pausedAt: null,
        remainingSeconds: remaining,
      },
    }));
  };

  const handleStartNextClockPeriod = async () => {
    if (!selectedMatch || !rule) return;

    const currentPeriod = Number(timing.currentPeriod || 0);
    const nextPeriod = currentPeriod + 1;
    const totalPeriods = Number(rule.periods || 2);

    if (nextPeriod > totalPeriods) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      timing: {
        ...(match.timing || {}),
        currentPeriod: nextPeriod,
        phase: "Live",
        isRunning: true,
        currentPeriodStartedAt: new Date().toISOString(),
        breakStartedAt: null,
        remainingSeconds: Number(rule.minutesPerPeriod || 0) * 60,
      },
    }));
  };

  const handleEndMatch = async () => {
    if (!selectedMatch) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Ended",
      timing: {
        ...(match.timing || {}),
        phase: "Ended",
        isRunning: false,
        remainingSeconds: 0,
      },
    }));

    await recalculateAllPlayerStats();
    await syncResultsFromEndedFixtures();
    await recalculateTablesFromEndedFixtures();
  };

  const handleStartSetMatch = async () => {
    if (!selectedMatch || !rule) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      timing: {
        ...(match.timing || {}),
        mode: "sets",
        phase: "Live",
        isRunning: true,
        currentSetNumber: 1,
        homeSetsWon: 0,
        awaySetsWon: 0,
        currentSetHome: 0,
        currentSetAway: 0,
        sets: [],
      },
    }));
  };

  const handleUpdateCurrentSetScore = async (teamSide, delta) => {
    if (!selectedMatch) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const current = match.timing || {};
      const home = Number(current.currentSetHome || 0);
      const away = Number(current.currentSetAway || 0);

      return {
        ...match,
        timing: {
          ...current,
          currentSetHome: teamSide === "home" ? Math.max(0, home + delta) : home,
          currentSetAway: teamSide === "away" ? Math.max(0, away + delta) : away,
        },
      };
    });
  };

  const handleEndCurrentSet = async () => {
    if (!selectedMatch || !rule) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const current = match.timing || {};
      const setNumber = Number(current.currentSetNumber || 1);
      const home = Number(current.currentSetHome || 0);
      const away = Number(current.currentSetAway || 0);

      let homeSetsWon = Number(current.homeSetsWon || 0);
      let awaySetsWon = Number(current.awaySetsWon || 0);

      const winner = home > away ? "home" : away > home ? "away" : null;
      if (winner === "home") homeSetsWon += 1;
      if (winner === "away") awaySetsWon += 1;

      const nextSets = [
        ...(current.sets || []),
        {
          setNumber,
          home,
          away,
          winner,
        },
      ];

      const ended =
        homeSetsWon >= Number(rule.setsToWin || 0) ||
        awaySetsWon >= Number(rule.setsToWin || 0);

      return {
        ...match,
        status: ended ? "Ended" : "Break",
        timing: {
          ...current,
          phase: ended ? "Ended" : "Set Break",
          isRunning: false,
          homeSetsWon,
          awaySetsWon,
          sets: nextSets,
          currentSetHome: 0,
          currentSetAway: 0,
        },
      };
    });

    await recalculateAllPlayerStats();
    await syncResultsFromEndedFixtures();
    await recalculateTablesFromEndedFixtures();
  };

  const handleStartNextSet = async () => {
    if (!selectedMatch) return;

    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const current = match.timing || {};

      return {
        ...match,
        status: "Live",
        timing: {
          ...current,
          phase: "Live",
          isRunning: true,
          currentSetNumber: Number(current.currentSetNumber || 1) + 1,
          currentSetHome: 0,
          currentSetAway: 0,
        },
      };
    });
  };

  const formatSeconds = (totalSeconds) => {
    const minutes = Math.floor(Number(totalSeconds || 0) / 60);
    const seconds = Number(totalSeconds || 0) % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Live Match Control</h2>

        <select
          className="admin-select"
          value={selectedMatchId}
          onChange={(e) => {
            setSelectedMatchId(e.target.value);
            resetEventForm();
          }}
        >
          <option value="">Select match</option>
          {fixtures.map((match) => (
            <option key={match.id} value={match.id}>
              {match.homeTeam} vs {match.awayTeam}
            </option>
          ))}
        </select>
      </div>

      {selectedMatch && (
        <>
          <div className="admin-section-card">
            <h2>
              {selectedMatch.homeTeam} {selectedMatch.score.home} - {selectedMatch.score.away}{" "}
              {selectedMatch.awayTeam}
            </h2>
            <p>
              <strong>Sport:</strong> {selectedMatch.sport}
            </p>
            <p>
              <strong>Category:</strong> {selectedMatch.category}
            </p>
            <p>
              <strong>Status:</strong> {selectedMatch.status}
            </p>
            <p>
              <strong>Phase:</strong> {timing.phase || "Pre-Match"}
            </p>
          </div>

          {rule?.mode === "clock" && (
            <div className="admin-section-card">
              <h2>Clock Control</h2>
              <p>
                <strong>
                  {timing.periodLabel || rule.periodLabel || "Period"} {timing.currentPeriod || 0}
                </strong>
              </p>
              <p>
                <strong>Timer:</strong> {formatSeconds(derivedRemainingSeconds)}
              </p>

              <div className="admin-actions">
                {selectedMatch.status === "Upcoming" && canAutoStart() && (
                  <button type="button" onClick={handleStartClockMatch}>
                    Start Match
                  </button>
                )}

                {timing.phase === "Paused" && (
                  <button type="button" onClick={handleResumeClock}>
                    Resume
                  </button>
                )}

                {timing.isRunning && (
                  <button type="button" onClick={handlePauseClock}>
                    Pause
                  </button>
                )}

                {(selectedMatch.status === "Halftime" || selectedMatch.status === "Break") &&
                  Number(timing.currentPeriod || 0) < Number(timing.totalPeriods || 0) && (
                    <button type="button" onClick={handleStartNextClockPeriod}>
                      Start Next {timing.periodLabel || rule.periodLabel || "Period"}
                    </button>
                  )}

                {selectedMatch.status !== "Ended" && (
                  <button type="button" onClick={handleEndMatch}>
                    End Match
                  </button>
                )}
              </div>
            </div>
          )}

          {rule?.mode === "sets" && (
            <div className="admin-section-card">
              <h2>Set Control</h2>
              <p>
                <strong>Current Set:</strong> {timing.currentSetNumber || 0}
              </p>
              <p>
                <strong>Sets Won:</strong> {selectedMatch.homeTeam} {timing.homeSetsWon || 0} -{" "}
                {timing.awaySetsWon || 0} {selectedMatch.awayTeam}
              </p>
              <p>
                <strong>Current Set Score:</strong> {selectedMatch.homeTeam}{" "}
                {timing.currentSetHome || 0} - {timing.currentSetAway || 0}{" "}
                {selectedMatch.awayTeam}
              </p>

              <div className="admin-actions">
                {selectedMatch.status === "Upcoming" && (
                  <button type="button" onClick={handleStartSetMatch}>
                    Start Match
                  </button>
                )}

                {selectedMatch.status === "Live" && (
                  <>
                    <button type="button" onClick={() => handleUpdateCurrentSetScore("home", 1)}>
                      +1 Home
                    </button>
                    <button type="button" onClick={() => handleUpdateCurrentSetScore("away", 1)}>
                      +1 Away
                    </button>
                    <button type="button" onClick={() => handleUpdateCurrentSetScore("home", -1)}>
                      -1 Home
                    </button>
                    <button type="button" onClick={() => handleUpdateCurrentSetScore("away", -1)}>
                      -1 Away
                    </button>
                    <button type="button" onClick={handleEndCurrentSet}>
                      End Current Set
                    </button>
                  </>
                )}

                {timing.phase === "Set Break" && selectedMatch.status !== "Ended" && (
                  <button type="button" onClick={handleStartNextSet}>
                    Start Next Set
                  </button>
                )}

                {selectedMatch.status !== "Ended" && (
                  <button type="button" onClick={handleEndMatch}>
                    End Match
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="admin-section-card">
            <h2>{editingEventId ? "Edit Event" : "Add Event"}</h2>

            <form className="admin-form" onSubmit={handleAddOrUpdateEvent}>
              <div className="admin-form__grid">
                <input
                  type="text"
                  name="minute"
                  placeholder="Minute / Stage note"
                  value={eventForm.minute}
                  onChange={handleEventChange}
                  required
                />

                <select
                  name="teamSide"
                  value={eventForm.teamSide}
                  onChange={handleEventChange}
                >
                  <option value="home">{selectedMatch.homeTeam}</option>
                  <option value="away">{selectedMatch.awayTeam}</option>
                </select>

                <select
                  name="type"
                  value={eventForm.type}
                  onChange={handleEventChange}
                >
                  {normalizeSport(selectedMatch.sport) === "football" ? (
                    <>
                      <option value="Goal">Goal</option>
                      <option value="Yellow Card">Yellow Card</option>
                      <option value="Red Card">Red Card</option>
                      <option value="Substitution">Substitution</option>
                    </>
                  ) : (
                    <>
                      <option value="Score">Score</option>
                      <option value="Substitution">Substitution</option>
                    </>
                  )}
                </select>

                {eventForm.type !== "Substitution" ? (
                  <select
                    name="playerId"
                    value={eventForm.playerId}
                    onChange={handleEventChange}
                  >
                    <option value="">Select player</option>
                    {(currentTeam?.players || []).map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <select
                      name="playerOutId"
                      value={eventForm.playerOutId}
                      onChange={handleEventChange}
                    >
                      <option value="">Player out</option>
                      {(currentTeam?.players || []).map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>

                    <select
                      name="playerInId"
                      value={eventForm.playerInId}
                      onChange={handleEventChange}
                    >
                      <option value="">Player in</option>
                      {(currentTeam?.players || []).map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {["basketball", "volleyball", "table tennis"].includes(
                  normalizeSport(selectedMatch.sport)
                ) &&
                  eventForm.type === "Score" && (
                    <input
                      type="number"
                      name="pointsValue"
                      placeholder="Points value"
                      value={eventForm.pointsValue}
                      onChange={handleEventChange}
                    />
                  )}

                <textarea
                  name="note"
                  placeholder="Optional note"
                  value={eventForm.note}
                  onChange={handleEventChange}
                  rows="3"
                />
              </div>

              <div className="admin-actions">
                <button type="submit">
                  {editingEventId ? "Update Event" : "Add Event"}
                </button>
                {editingEventId && (
                  <button type="button" onClick={resetEventForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {rule?.mode === "sets" && (
            <div className="admin-section-card">
              <h2>Completed Sets</h2>
              <div className="admin-list">
                {(timing.sets || []).length ? (
                  timing.sets.map((item, index) => (
                    <div className="admin-list-card" key={index}>
                      <p>
                        <strong>Set {item.setNumber}:</strong> {selectedMatch.homeTeam} {item.home} -{" "}
                        {item.away} {selectedMatch.awayTeam}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No completed sets yet.</p>
                )}
              </div>
            </div>
          )}

          <div className="admin-section-card">
            <h2>Match Events</h2>

            <div className="admin-list">
              {selectedMatch.events?.length ? (
                selectedMatch.events.map((item) => (
                  <div className="admin-list-card" key={item.id}>
                    <p>
                      <strong>{item.minute}</strong> — {item.type} —{" "}
                      {item.type === "Substitution"
                        ? `${resolvePlayerName(item.playerOutId, item.teamSide)} out, ${resolvePlayerName(
                            item.playerInId,
                            item.teamSide
                          )} in`
                        : resolvePlayerName(item.playerId, item.teamSide)}
                      {item.note ? ` — ${item.note}` : ""}
                    </p>

                    <div className="admin-actions">
                      <button type="button" onClick={() => handleEditEvent(item)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDeleteEvent(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No live events yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default LiveMatchControl;