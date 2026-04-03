import { Link } from "react-router-dom";
import MatchStatusBadge from "./MatchStatusBadge";
import MatchCountdown from "./MatchCountdown";
import { useAppData } from "../../context/AppDataContext";

function MatchCard({ match, type = "fixture" }) {
  const { toggleFavouriteMatch, isFavouriteMatch } = useAppData();

  return (
    <div className="match-card">
      <div className="match-card__top">
        <div className="match-card__meta">
          <span className="match-card__tag">{match.sport}</span>
          <span className="match-card__tag">{match.gender || match.category}</span>
        </div>

        {type === "fixture" && (
          <div className="match-card__status-wrap">
            <MatchStatusBadge match={match} />
          </div>
        )}
      </div>

      {type === "fixture" ? (
        <>
          <h3 className="match-card__teams">
            {match.homeTeam} vs {match.awayTeam}
          </h3>

          <div className="match-card__details">
            <p className="match-card__info">
              <strong>Stage:</strong> {match.stage}
            </p>

            {match.competitionGroup && (
              <p className="match-card__info">
                <strong>Group:</strong> {match.competitionGroup}
              </p>
            )}

            <p className="match-card__info">
              <strong>Date:</strong> {match.date}
            </p>

            <p className="match-card__info">
              <strong>Kicks Off:</strong> {match.kickoffTime}
            </p>

            <p className="match-card__info">
              <strong>Ends:</strong> {match.endTime}
            </p>

            <p className="match-card__info">
              <strong>Venue:</strong> {match.venue}
            </p>
          </div>

          <div className="match-card__countdown">
            <MatchCountdown match={match} />
          </div>

          <div className="match-card__actions">
            <Link to={`/match/${match.id}`} className="match-card__link">
              Match Details
            </Link>

            <button
              type="button"
              className="match-favourite-btn"
              onClick={() => toggleFavouriteMatch(match.id)}
            >
              {isFavouriteMatch(match.id) ? "★ Favourite" : "☆ Add Favourite"}
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="match-card__teams">
            {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
          </h3>

          <div className="match-card__details">
            <p className="match-card__info">
              <strong>Date:</strong> {match.date}
            </p>
            <p className="match-card__info">
              <strong>Venue:</strong> {match.venue}
            </p>
          </div>

          <div className="match-card__actions">
            <Link to={`/results/${match.id}`} className="match-card__link">
              Result Details
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default MatchCard;