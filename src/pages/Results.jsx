import { useMemo } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

function Results() {
  const { results = [] } = useAppData();

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      const dateA = `${a?.date || ""} ${a?.kickoffTime || ""}`.trim();
      const dateB = `${b?.date || ""} ${b?.kickoffTime || ""}`.trim();
      return dateB.localeCompare(dateA);
    });
  }, [results]);

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Results</h1>
            <p className="page-intro">Check out the latest match results.</p>
          </div>

          <div className="page-card">
            <div className="match-list">
              {sortedResults.length ? (
                sortedResults.map((result) => (
                  <div className="dark-link-card" key={result.id}>
                    <h3>
                      {result.homeTeam || "Home"} {result.homeScore ?? 0} -{" "}
                      {result.awayScore ?? 0} {result.awayTeam || "Away"}
                    </h3>

                    <p>
                      <strong>Sport:</strong> {result.sport || "Sport not set"}
                    </p>

                    <p>
                      <strong>Category:</strong>{" "}
                      {result.category || result.gender || "Category not set"}
                    </p>

                    <p>
                      <strong>Stage:</strong> {result.stage || "N/A"}
                    </p>

                    <p>
                      <strong>Group:</strong> {result.competitionGroup || "N/A"}
                    </p>

                    <p>
                      <strong>Date:</strong> {result.date || "No date"}
                    </p>

                    <p>
                      <strong>Venue:</strong> {result.venue || "No venue"}
                    </p>

                    {result.summary ? (
                      <p>
                        <strong>Summary:</strong> {result.summary}
                      </p>
                    ) : null}

                    <Link
                      to={`/results/${result.id}`}
                      className="homepage-link-btn"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <p className="empty-state">No results available yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Results;