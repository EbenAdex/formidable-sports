import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function MatchDetails() {
  const { id } = useParams();
  const { fixtures, getTeamById } = useAppData();

  const match = fixtures.find((item) => String(item.id) === String(id));

  if (!match) {
    return (
      <>
        <Navbar />
        <main className="page section">
          <div className="container">
            <p>Match not found.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  const resolvePlayerName = (team, playerId) =>
    team?.players?.find((player) => player.id === Number(playerId))?.name || "Unknown Player";

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <div className="match-details-page">
            <section className="match-details-hero">
              <p className="match-details-hero__meta">
                {match.sport} • {match.category}
              </p>

              <h1 className="match-details-hero__title">
                {match.homeTeam} <span>{match.score?.home ?? 0}</span> -{" "}
                <span>{match.score?.away ?? 0}</span> {match.awayTeam}
              </h1>

              <p className="match-details-hero__status">
                Status: {match.postponed ? "Postponed" : match.status}
              </p>
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
                          <strong>{item.minute}'</strong> — {item.type} —{" "}
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MatchDetails;