import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function ManageFavourites() {
  const { fixtures, favourites, removeFavouriteMatch } = useAppData();

  const watchedMatches = fixtures.filter((fixture) =>
    favourites.includes(fixture.id)
  );

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Watchlists</h2>
        <p>
          Remove matches from the current saved favourites/watchlist store.
        </p>

        <div className="admin-list">
          {watchedMatches.length ? (
            watchedMatches.map((match) => (
              <div className="admin-list-card" key={match.id}>
                <h3>
                  {match.homeTeam} vs {match.awayTeam}
                </h3>
                <p>
                  <strong>Sport:</strong> {match.sport}
                </p>
                <p>
                  <strong>Category:</strong> {match.gender}
                </p>
                <p>
                  <strong>Status:</strong> {match.status}
                </p>

                <div className="admin-actions">
                  <button
                    type="button"
                    onClick={() => removeFavouriteMatch(match.id)}
                  >
                    Remove From Watchlist
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No matches are currently in watchlists.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageFavourites;