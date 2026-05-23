import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function LiveMatchControl() {
  const {
    fixtures,
    getTeamById,
    getSportRuleBySport,
    updateFixtureWithCallback,
    recalculateAllPlayerStats,
    syncSingleResultFromFixture,
    recalculateTablesFromEndedFixtures,
  } = useAppData();

  const [searchParams] = useSearchParams();
  const queryMatchId = searchParams.get("match");

  const [selectedMatchId, setSelectedMatchId] = useState(queryMatchId || "");
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

  useEffect(() => {
    if (queryMatchId) setSelectedMatchId(queryMatchId);
  }, [queryMatchId]);

  useEffect(() => {
    if (!selectedMatchId && fixtures.length) {
      const preferred =
        fixtures.find((m) => m.status === "Live") ||
        fixtures.find((m) => m.status === "Halftime") ||
        fixtures.find((m) => m.status === "Break") ||
        fixtures[0];
      if (preferred) setSelectedMatchId(preferred.id);
    }
  }, [fixtures, selectedMatchId]);

  const selectedMatch = useMemo(
    () => fixtures.find((m) => String(m.id) === String(selectedMatchId)),
    [fixtures, selectedMatchId]
  );

  const rule = useMemo(
    () => (selectedMatch ? getSportRuleBySport(selectedMatch.sport) : null),
    [selectedMatch, getSportRuleBySport]
  );

  const timing = selectedMatch?.timing || {};

  const normalizeSport = (sport) => String(sport || "").trim().toLowerCase();

  const currentTeam = useMemo(() => {
    if (!selectedMatch) return null;
    return eventForm.teamSide === "home"
      ? getTeamById(selectedMatch.homeTeamId)
      : getTeamById(selectedMatch.awayTeamId);
  }, [selectedMatch, eventForm.teamSide, getTeamById]);

  const [derivedRemainingSeconds, setDerivedRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!selectedMatch || !rule || rule.mode !== "clock") {
      setDerivedRemainingSeconds(0);
      return;
    }

    const compute = () => {
      const t = selectedMatch.timing || {};
      if (!t.isRunning || !t.currentPeriodStartedAt) {
        return Number(t.remainingSeconds || 0);
      }
      const elapsed = Math.floor(
        (Date.now() - new Date(t.currentPeriodStartedAt).getTime()) / 1000
      );
      const total = Number(t.periodDurationMinutes || rule.minutesPerPeriod || 30) * 60;
      return Math.max(total - elapsed, 0);
    };

    setDerivedRemainingSeconds(compute());

    if (timing.isRunning) {
      const id = setInterval(() => setDerivedRemainingSeconds(compute()), 1000);
      return () => clearInterval(id);
    }
  }, [
    selectedMatch?.id,
    selectedMatch?.timing?.isRunning,
    selectedMatch?.timing?.currentPeriodStartedAt,
    selectedMatch?.timing?.remainingSeconds,
    rule,
  ]);

  const formatSeconds = (s) => {
    const m = Math.floor(Number(s || 0) / 60);
    const sec = Number(s || 0) % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const statusClass = (status) => {
    const map = {
      Live: "sb-status--live",
      Halftime: "sb-status--halftime",
      Break: "sb-status--halftime",
      Ended: "sb-status--ended",
      Upcoming: "sb-status--upcoming",
    };
    return map[status] || "";
  };

  const resetEventForm = () => {
    setEventForm({
      minute: "",
      type: normalizeSport(selectedMatch?.sport) === "football" ? "Goal" : "Score",
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
    const next = {
      ...match,
      score: { home: 0, away: 0 },
      cards: { homeYellow: 0, awayYellow: 0, homeRed: 0, awayRed: 0 },
      substitutions: { home: 0, away: 0 },
      events,
    };

    events.forEach((item) => {
      if (normalizeSport(match.sport) === "football" && item.type === "Goal") {
        next.score[item.teamSide] += 1;
      }
      if (
        ["basketball", "volleyball", "table tennis", "tennis"].includes(
          normalizeSport(match.sport)
        ) &&
        item.type === "Score"
      ) {
        next.score[item.teamSide] += Number(item.pointsValue || 1);
      }
      if (item.type === "Yellow Card")
        next.cards[item.teamSide === "home" ? "homeYellow" : "awayYellow"] += 1;
      if (item.type === "Red Card")
        next.cards[item.teamSide === "home" ? "homeRed" : "awayRed"] += 1;
      if (item.type === "Substitution") next.substitutions[item.teamSide] += 1;
    });

    return next;
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "teamSide" ? { playerId: "", playerInId: "", playerOutId: "" } : {}),
    }));
  };

  const handleAddOrUpdateEvent = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return;

    const needsPlayer =
      eventForm.type !== "Substitution" &&
      ["Goal", "Yellow Card", "Red Card", "Score"].includes(eventForm.type);

    if (!eventForm.minute) return;
    if (needsPlayer && !eventForm.playerId) return;
    if (
      eventForm.type === "Substitution" &&
      (!eventForm.playerInId || !eventForm.playerOutId)
    )
      return;

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
          String(item.id) === String(editingEventId) ? payload : item
        );
      } else {
        nextEvents = [payload, ...nextEvents];
      }

      return recalculateMatchFromEvents(match, nextEvents);
    });

    resetEventForm();
    await recalculateAllPlayerStats();
  };

  const handleEditEvent = (item) => {
    setEditingEventId(item.id);
    setEventForm({
      minute: item.minute || "",
      type: item.type || "Goal",
      teamSide: item.teamSide || "home",
      playerId: item.playerId ? String(item.playerId) : "",
      playerInId: item.playerInId ? String(item.playerInId) : "",
      playerOutId: item.playerOutId ? String(item.playerOutId) : "",
      pointsValue: String(item.pointsValue || 1),
      note: item.note || "",
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!selectedMatch) return;
    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const nextEvents = (match.events || []).filter(
        (item) => String(item.id) !== String(eventId)
      );
      return recalculateMatchFromEvents(match, nextEvents);
    });
    if (String(editingEventId) === String(eventId)) resetEventForm();
    await recalculateAllPlayerStats();
  };

  const resolvePlayerName = (playerId, side) => {
    if (!selectedMatch || !playerId) return "Unknown";
    const team =
      side === "home"
        ? getTeamById(selectedMatch.homeTeamId)
        : getTeamById(selectedMatch.awayTeamId);
    return (
      team?.players?.find((p) => String(p.id) === String(playerId))?.name ||
      "Unknown"
    );
  };

  const handleStartClockMatch = async () => {
    if (!selectedMatch || !rule) return;
    const minutes =
      Number(selectedMatch.periodDurationMinutes) ||
      Number(selectedMatch.timing?.periodDurationMinutes) ||
      Number(rule.minutesPerPeriod) ||
      30;

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      postponed: false,
      timing: {
        ...(match.timing || {}),
        mode: "clock",
        currentPeriod: 1,
        totalPeriods: Number(rule.periods || 2),
        periodLabel: rule.periodLabel || "Half",
        periodDurationMinutes: minutes,
        phase: "First Half",
        isRunning: true,
        startedAt: new Date().toISOString(),
        currentPeriodStartedAt: new Date().toISOString(),
        pausedAt: null,
        breakStartedAt: null,
        remainingSeconds: minutes * 60,
      },
    }));
  };

  const handlePauseClock = async () => {
    if (!selectedMatch) return;
    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const t = match.timing || {};
      let remaining = Number(t.remainingSeconds || 0);
      if (t.isRunning && t.currentPeriodStartedAt) {
        const elapsed = Math.floor(
          (Date.now() - new Date(t.currentPeriodStartedAt).getTime()) / 1000
        );
        remaining = Math.max(Number(t.periodDurationMinutes || 30) * 60 - elapsed, 0);
      }
      return {
        ...match,
        timing: {
          ...t,
          isRunning: false,
          phase: "Paused",
          remainingSeconds: remaining,
          pausedAt: new Date().toISOString(),
        },
      };
    });
  };

  const handleResumeClock = async () => {
    if (!selectedMatch) return;
    const remaining = Number(timing.remainingSeconds || 0);
    const total = Number(timing.periodDurationMinutes || 30) * 60;
    const currentPeriodStartedAt = new Date(
      Date.now() - (total - remaining) * 1000
    ).toISOString();

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      timing: {
        ...(match.timing || {}),
        isRunning: true,
        phase:
          Number(match.timing?.currentPeriod || 1) === 1 ? "First Half" : "Second Half",
        currentPeriodStartedAt,
        pausedAt: null,
        remainingSeconds: remaining,
      },
    }));
  };

  const handleEndFirstHalf = async () => {
    if (!selectedMatch) return;
    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Halftime",
      timing: {
        ...(match.timing || {}),
        isRunning: false,
        phase: "Halftime",
        remainingSeconds: 0,
        pausedAt: null,
        breakStartedAt: new Date().toISOString(),
      },
    }));
  };

  const handleStartSecondHalf = async () => {
    if (!selectedMatch || !rule) return;
    const minutes =
      Number(selectedMatch.periodDurationMinutes) ||
      Number(selectedMatch.timing?.periodDurationMinutes) ||
      Number(rule.minutesPerPeriod) ||
      30;

    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      timing: {
        ...(match.timing || {}),
        currentPeriod: 2,
        totalPeriods: 2,
        periodLabel: "Half",
        periodDurationMinutes: minutes,
        phase: "Second Half",
        isRunning: true,
        currentPeriodStartedAt: new Date().toISOString(),
        pausedAt: null,
        breakStartedAt: null,
        remainingSeconds: minutes * 60,
      },
    }));
  };

  const handleEndMatch = async () => {
    if (!selectedMatch) return;
    const updated = await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Ended",
      timing: {
        ...(match.timing || {}),
        phase: "Ended",
        isRunning: false,
        remainingSeconds: 0,
      },
    }));
    if (!updated) return;
    await recalculateAllPlayerStats();
    await syncSingleResultFromFixture(updated);
    await recalculateTablesFromEndedFixtures();
  };

  const handleStartSetMatch = async () => {
    if (!selectedMatch || !rule) return;
    await updateFixtureWithCallback(selectedMatch.id, (match) => ({
      ...match,
      status: "Live",
      postponed: false,
      timing: {
        ...(match.timing || {}),
        mode: "sets",
        currentSetNumber: 1,
        totalSetsToWin: Number(rule.setsToWin || 2),
        homeSetsWon: 0,
        awaySetsWon: 0,
        currentSetHome: 0,
        currentSetAway: 0,
        phase: "Set 1",
        isRunning: true,
        sets: [],
      },
    }));
  };

  const handleUpdateCurrentSetScore = async (side, delta) => {
    if (!selectedMatch) return;
    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const t = match.timing || {};
      return {
        ...match,
        timing: {
          ...t,
          currentSetHome:
            side === "home"
              ? Math.max(0, Number(t.currentSetHome || 0) + delta)
              : Number(t.currentSetHome || 0),
          currentSetAway:
            side === "away"
              ? Math.max(0, Number(t.currentSetAway || 0) + delta)
              : Number(t.currentSetAway || 0),
        },
      };
    });
  };

  const handleEndCurrentSet = async () => {
    if (!selectedMatch || !rule) return;
    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const t = match.timing || {};
      const home = Number(t.currentSetHome || 0);
      const away = Number(t.currentSetAway || 0);
      let homeSetsWon = Number(t.homeSetsWon || 0);
      let awaySetsWon = Number(t.awaySetsWon || 0);
      const winner = home > away ? "home" : away > home ? "away" : null;
      if (winner === "home") homeSetsWon += 1;
      if (winner === "away") awaySetsWon += 1;
      const nextSets = [...(t.sets || []), { setNumber: t.currentSetNumber, home, away, winner }];
      const ended =
        homeSetsWon >= Number(rule.setsToWin || 2) ||
        awaySetsWon >= Number(rule.setsToWin || 2);
      return {
        ...match,
        status: ended ? "Ended" : "Break",
        timing: {
          ...t,
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
    const refreshed = fixtures.find((f) => String(f.id) === String(selectedMatch.id));
    if (refreshed?.status === "Ended") {
      await syncSingleResultFromFixture(refreshed);
      await recalculateTablesFromEndedFixtures();
    }
  };

  const handleStartNextSet = async () => {
    if (!selectedMatch) return;
    await updateFixtureWithCallback(selectedMatch.id, (match) => {
      const t = match.timing || {};
      const next = Number(t.currentSetNumber || 1) + 1;
      return {
        ...match,
        status: "Live",
        timing: {
          ...t,
          phase: `Set ${next}`,
          isRunning: true,
          currentSetNumber: next,
          currentSetHome: 0,
          currentSetAway: 0,
        },
      };
    });
  };

  const eventIcon = (type) => {
    const icons = {
      Goal: "⚽",
      "Yellow Card": "🟨",
      "Red Card": "🟥",
      Substitution: "🔄",
      Score: "🏀",
    };
    return icons[type] || "•";
  };

  return (
    <AdminLayout>

      {/* Match selector */}
      <div className="admin-section-card">
        <h2>Live Match Control</h2>
        <p>Select a match to manage.</p>
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
              {match.homeTeam} vs {match.awayTeam}{" "}
              {match.status === "Live" ? "🔴" : match.status === "Halftime" ? "⏸" : ""}
            </option>
          ))}
        </select>
      </div>

      {selectedMatch && (
        <>
          {/* ── SCOREBOARD ── */}
          <div className="lmc-scoreboard">

            {/* top bar */}
            <div className="lmc-sb__topbar">
              <span className="lmc-sb__competition">
                {selectedMatch.competitionName || selectedMatch.sport}
                {selectedMatch.category ? ` · ${selectedMatch.category}` : ""}
              </span>
              <div className="lmc-sb__badges">
                <span className={`lmc-sb__status ${statusClass(selectedMatch.status)}`}>
                  {selectedMatch.status === "Live" && (
                    <span className="lmc-sb__pulse" />
                  )}
                  {selectedMatch.status}
                </span>
                {timing.phase && timing.phase !== selectedMatch.status && (
                  <span className="lmc-sb__phase">{timing.phase}</span>
                )}
              </div>
            </div>

            {/* main score row */}
            <div className="lmc-sb__main">
              <div className="lmc-sb__team lmc-sb__team--home">
                <span className="lmc-sb__team-name">{selectedMatch.homeTeam}</span>
                <span className="lmc-sb__score">{selectedMatch.score?.home ?? 0}</span>
              </div>

              <div className="lmc-sb__center">
                {rule?.mode === "clock" ? (
                  <div className="lmc-sb__timer">
                    <span className="lmc-sb__timer-label">
                      {timing.periodLabel || "Half"} {timing.currentPeriod || "—"}
                    </span>
                    <span className="lmc-sb__timer-value">
                      {formatSeconds(derivedRemainingSeconds)}
                    </span>
                    <span className="lmc-sb__timer-sub">
                      {timing.isRunning ? "Running" : "Stopped"}
                    </span>
                  </div>
                ) : rule?.mode === "sets" ? (
                  <div className="lmc-sb__sets">
                    <span className="lmc-sb__sets-label">Sets</span>
                    <span className="lmc-sb__sets-score">
                      {timing.homeSetsWon ?? 0} – {timing.awaySetsWon ?? 0}
                    </span>
                    <span className="lmc-sb__sets-current">
                      {timing.currentSetHome ?? 0} – {timing.currentSetAway ?? 0}
                    </span>
                    <span className="lmc-sb__sets-sub">
                      {timing.phase || "Pre-Match"}
                    </span>
                  </div>
                ) : (
                  <span className="lmc-sb__vs">VS</span>
                )}
              </div>

              <div className="lmc-sb__team lmc-sb__team--away">
                <span className="lmc-sb__score">{selectedMatch.score?.away ?? 0}</span>
                <span className="lmc-sb__team-name">{selectedMatch.awayTeam}</span>
              </div>
            </div>

            {/* stat row — cards + subs */}
            {normalizeSport(selectedMatch.sport) === "football" && (
              <div className="lmc-sb__stats">
                <div className="lmc-sb__stat-group">
                  <span className="lmc-sb__stat-val">
                    {selectedMatch.cards?.homeYellow ?? 0}🟨
                    {selectedMatch.cards?.homeRed ?? 0}🟥
                  </span>
                  <span className="lmc-sb__stat-label">Cards</span>
                  <span className="lmc-sb__stat-val">
                    {selectedMatch.cards?.awayYellow ?? 0}🟨
                    {selectedMatch.cards?.awayRed ?? 0}🟥
                  </span>
                </div>
                <div className="lmc-sb__stat-group">
                  <span className="lmc-sb__stat-val">
                    {selectedMatch.substitutions?.home ?? 0}
                  </span>
                  <span className="lmc-sb__stat-label">Subs</span>
                  <span className="lmc-sb__stat-val">
                    {selectedMatch.substitutions?.away ?? 0}
                  </span>
                </div>
              </div>
            )}

            {/* meta */}
            <div className="lmc-sb__meta">
              {selectedMatch.date && <span>{selectedMatch.date}</span>}
              {selectedMatch.venue && <span>{selectedMatch.venue}</span>}
              {selectedMatch.stage && <span>{selectedMatch.stage}</span>}
            </div>
          </div>

          {/* ── CLOCK CONTROLS ── */}
          {rule?.mode === "clock" && (
            <div className="admin-section-card">
              <h2>Clock Controls</h2>
              <div className="admin-actions">
                {selectedMatch.status === "Upcoming" && (
                  <button type="button" onClick={handleStartClockMatch}>
                    ▶ Start Match
                  </button>
                )}
                {selectedMatch.status === "Live" && timing.isRunning && (
                  <button type="button" onClick={handlePauseClock}>
                    ⏸ Pause
                  </button>
                )}
                {selectedMatch.status === "Live" &&
                  !timing.isRunning &&
                  timing.phase === "Paused" && (
                    <button type="button" onClick={handleResumeClock}>
                      ▶ Resume
                    </button>
                  )}
                {selectedMatch.status === "Live" &&
                  Number(timing.currentPeriod || 1) === 1 && (
                    <button type="button" onClick={handleEndFirstHalf}>
                      ⏹ End First Half
                    </button>
                  )}
                {selectedMatch.status === "Halftime" && (
                  <button type="button" onClick={handleStartSecondHalf}>
                    ▶ Start Second Half
                  </button>
                )}
                {selectedMatch.status === "Live" &&
                  Number(timing.currentPeriod || 1) === 2 && (
                    <button type="button" onClick={handleEndMatch}>
                      🏁 End Match
                    </button>
                  )}
              </div>
            </div>
          )}

          {/* ── SET CONTROLS ── */}
          {rule?.mode === "sets" && (
            <div className="admin-section-card">
              <h2>Set Controls</h2>
              <div className="admin-actions">
                {selectedMatch.status === "Upcoming" && (
                  <button type="button" onClick={handleStartSetMatch}>
                    ▶ Start Match
                  </button>
                )}
                {selectedMatch.status === "Live" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateCurrentSetScore("home", 1)}
                    >
                      +1 {selectedMatch.homeTeam}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateCurrentSetScore("away", 1)}
                    >
                      +1 {selectedMatch.awayTeam}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateCurrentSetScore("home", -1)}
                    >
                      -1 {selectedMatch.homeTeam}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateCurrentSetScore("away", -1)}
                    >
                      -1 {selectedMatch.awayTeam}
                    </button>
                    <button type="button" onClick={handleEndCurrentSet}>
                      ⏹ End Set
                    </button>
                  </>
                )}
                {timing.phase === "Set Break" && selectedMatch.status !== "Ended" && (
                  <button type="button" onClick={handleStartNextSet}>
                    ▶ Start Next Set
                  </button>
                )}
                {selectedMatch.status !== "Ended" && (
                  <button type="button" onClick={handleEndMatch}>
                    🏁 End Match
                  </button>
                )}
              </div>

              {/* completed sets */}
              {(timing.sets || []).length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <p><strong>Completed Sets</strong></p>
                  <div className="admin-list" style={{ marginTop: "0.5rem" }}>
                    {timing.sets.map((s, i) => (
                      <div className="admin-list-card" key={i}>
                        <p>
                          Set {s.setNumber}: {selectedMatch.homeTeam}{" "}
                          <strong>{s.home}</strong> – <strong>{s.away}</strong>{" "}
                          {selectedMatch.awayTeam}
                          {s.winner && (
                            <span style={{ marginLeft: "0.5rem", color: "#facc15" }}>
                              ({s.winner === "home" ? selectedMatch.homeTeam : selectedMatch.awayTeam} wins)
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ADD EVENT ── */}
          <div className="admin-section-card">
            <h2>{editingEventId ? "Edit Event" : "Add Event"}</h2>

            <form className="admin-form" onSubmit={handleAddOrUpdateEvent}>
              <div className="admin-form__grid">
                <input
                  type="text"
                  name="minute"
                  placeholder="Minute (e.g. 45)"
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
                      <option value="Goal">⚽ Goal</option>
                      <option value="Yellow Card">🟨 Yellow Card</option>
                      <option value="Red Card">🟥 Red Card</option>
                      <option value="Substitution">🔄 Substitution</option>
                    </>
                  ) : (
                    <>
                      <option value="Score">Score</option>
                      <option value="Substitution">🔄 Substitution</option>
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
                    {(currentTeam?.players || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.jerseyNumber || "—"} {p.name}
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
                      {(currentTeam?.players || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.jerseyNumber || "—"} {p.name}
                        </option>
                      ))}
                    </select>
                    <select
                      name="playerInId"
                      value={eventForm.playerInId}
                      onChange={handleEventChange}
                    >
                      <option value="">Player in</option>
                      {(currentTeam?.players || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.jerseyNumber || "—"} {p.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {["basketball", "volleyball", "table tennis", "tennis"].includes(
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
                  rows="2"
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

          {/* ── EVENTS LOG ── */}
          <div className="admin-section-card">
            <h2>Match Events</h2>
            <div className="admin-list">
              {selectedMatch.events?.length ? (
                selectedMatch.events.map((item) => (
                  <div className="admin-list-card lmc-event-card" key={item.id}>
                    <div className="lmc-event__left">
                      <span className="lmc-event__icon">{eventIcon(item.type)}</span>
                      <div>
                        <p className="lmc-event__line">
                          <strong>{item.minute}'</strong> —{" "}
                          <span className="lmc-event__type">{item.type}</span> —{" "}
                          {item.type === "Substitution"
                            ? `${resolvePlayerName(item.playerOutId, item.teamSide)} ↓  ${resolvePlayerName(item.playerInId, item.teamSide)} ↑`
                            : resolvePlayerName(item.playerId, item.teamSide)}
                          <span className="lmc-event__team">
                            {item.teamSide === "home"
                              ? ` (${selectedMatch.homeTeam})`
                              : ` (${selectedMatch.awayTeam})`}
                          </span>
                        </p>
                        {item.note && (
                          <p className="lmc-event__note">{item.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="admin-actions" style={{ marginTop: 0 }}>
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
                <p>No events yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default LiveMatchControl;