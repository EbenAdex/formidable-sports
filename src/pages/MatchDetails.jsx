import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function MatchDetails() {
  const { id } = useParams();
  const { fixtures, getTeamById, getSportRuleBySport } = useAppData();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const match = fixtures.find((item) => String(item.id) === String(id));

  const rule = useMemo(() => {
    if (!match) return null;
    return getSportRuleBySport(match.sport);
  }, [match, getSportRuleBySport]);

  if (!match) {
    return (
      <>
        <Navbar />
        <div className="navbar-spacer" />
        <main className="page-shell">
          <div className="container">
            <div className="page-card">
              <p>Match not found.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const timing = match.timing || {};

  const resolvePlayerName = (team, playerId) =>
    team?.players?.find((player) => String(player.id) === String(playerId))?.name ||
    "Unknown Player";

  const getClockDisplay = () => {
    if (!timing.currentPeriodStartedAt) {
      return "00:00";
    }

    if (!timing.isRunning) {
      const total = Number(timing.remainingSeconds || 0);
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    const start = new Date(timing.currentPeriodStartedAt).getTime();
    const now = Date.now();
    const elapsed = Math.max(Math.floor((now - start) / 1000), 0);
    const total = Number(timing.periodDurationMinutes || 0) * 60;
    const remaining = Math.max(total - elapsed, 0);

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />

      <main className="page-shell">
        <div className="container">
          <div className="match-details-page">
            <section className="match-details-hero">
              <p className="match-details-hero__meta">
                {match.sport} • {match.category}
                {match.competitionGroup ? ` • ${match.competitionGroup}` : ""}
              </p>

              <h1 className="match-details-hero__title">
                {match.homeTeam} <span>{match.score?.home ?? 0}</span> -{" "}
                <span>{match.score?.away ?? 0}</span> {match.awayTeam}
              </h1>

              <p className="match-details-hero__status">
                Status: {match.postponed ? "Postponed" : match.status}
              </p>

              <p className="match-details-hero__status">
                Phase: {timing.phase || "Pre-Match"}
              </p>

              {rule?.mode === "clock" && (
                <p className="match-details-hero__status">
                  {timing.periodLabel || rule.periodLabel || "Period"} {timing.currentPeriod || 0} •{" "}
                  {getClockDisplay()}
                </p>
              )}

              {rule?.mode === "sets" && (
                <p className="match-details-hero__status">
                  Set {timing.currentSetNumber || 0} • Sets Won: {timing.homeSetsWon || 0} -{" "}
                  {timing.awaySetsWon || 0}
                </p>
              )}
            </section>

            <section className="match-details-grid">
              <div className="match-panel">
                <h2>Match Information</h2>
                <p><strong>Stage:</strong> {match.stage}</p>
                <p><strong>Group:</strong> {match.competitionGroup || "N/A"}</p>
                <p><strong>Date:</strong> {match.date}</p>
                <p><strong>Kickoff:</strong> {match.kickoffTime}</p>
                <p><strong>End Time:</strong> {match.endTime}</p>
                <p><strong>Venue:</strong> {match.venue}</p>
              </div>

              <div className="match-panel">
                <h2>Match Statistics</h2>
                <p><strong>{match.homeTeam}</strong> — Yellow Cards: {match.cards?.homeYellow ?? 0}</p>
                <p><strong>{match.awayTeam}</strong> — Yellow Cards: {match.cards?.awayYellow ?? 0}</p>
                <p><strong>{match.homeTeam}</strong> — Red Cards: {match.cards?.homeRed ?? 0}</p>
                <p><strong>{match.awayTeam}</strong> — Red Cards: {match.cards?.awayRed ?? 0}</p>
                <p><strong>{match.homeTeam}</strong> — Substitutions: {match.substitutions?.home ?? 0}</p>
                <p><strong>{match.awayTeam}</strong> — Substitutions: {match.substitutions?.away ?? 0}</p>

                {rule?.mode === "sets" && (
                  <>
                    <p><strong>Current Set Score:</strong> {timing.currentSetHome || 0} - {timing.currentSetAway || 0}</p>
                    <p><strong>Sets Won:</strong> {timing.homeSetsWon || 0} - {timing.awaySetsWon || 0}</p>
                  </>
                )}
              </div>
            </section>

            <section className="match-details-grid">
              <div className="match-panel">
                <h2>Lineups</h2>

                <div className="lineup-block">
                  <h3>{match.homeTeam}</h3>
                  <p><strong>Coach:</strong> {match.lineups?.homeCoach || "Not yet updated"}</p>
                  {match.lineups?.homePlayerIds?.length ? (
                    <ul className="lineup-list">
                      {match.lineups.homePlayerIds.map((playerId) => (
                        <li key={playerId}>{resolvePlayerName(homeTeam, playerId)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No lineup submitted yet.</p>
                  )}
                </div>

                <div className="lineup-block">
                  <h3>{match.awayTeam}</h3>
                  <p><strong>Coach:</strong> {match.lineups?.awayCoach || "Not yet updated"}</p>
                  {match.lineups?.awayPlayerIds?.length ? (
                    <ul className="lineup-list">
                      {match.lineups.awayPlayerIds.map((playerId) => (
                        <li key={playerId}>{resolvePlayerName(awayTeam, playerId)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No lineup submitted yet.</p>
                  )}
                </div>
              </div>

              <div className="match-panel">
                <h2>Live Events</h2>

                {match.events?.length ? (
                  <div className="events-list">
                    {match.events.map((item) => {
                      const currentTeam = item.teamSide === "home" ? homeTeam : awayTeam;

                      return (
                        <div className="event-item" key={item.id}>
                          <strong>{item.minute}</strong> — {item.type} —{" "}
                          {item.type === "Substitution"
                            ? `${resolvePlayerName(currentTeam, item.playerOutId)} out, ${resolvePlayerName(
                                currentTeam,
                                item.playerInId
                              )} in`
                            : resolvePlayerName(currentTeam, item.playerId)}
                          {item.note ? ` — ${item.note}` : ""}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No live events yet.</p>
                )}
              </div>
            </section>

            {rule?.mode === "sets" && (
              <section className="match-panel">
                <h2>Completed Sets</h2>

                {(timing.sets || []).length ? (
                  <div className="events-list">
                    {timing.sets.map((setItem, index) => (
                      <div className="event-item" key={index}>
                        <strong>Set {setItem.setNumber}</strong> — {match.homeTeam} {setItem.home} -{" "}
                        {setItem.away} {match.awayTeam}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No completed sets yet.</p>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MatchDetails;