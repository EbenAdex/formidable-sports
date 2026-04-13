import { Link, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function ResultDetails() {
  const { id } = useParams();
  const { results = [] } = useAppData();

  const result = results.find(
    (item) =>
      String(item.id) === String(id) ||
      String(item.fixtureId) === String(id) ||
      String(item.localId) === String(id)
  );

  if (!result) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="container">
            <div className="page-card">
              <p>Result not found.</p>
              <Link to="/results" className="homepage-link-btn">
                Back to Results
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Result Details</h1>
            <p className="page-intro">
              Full breakdown of the completed match result.
            </p>
          </div>

          <div className="page-card result-details-card">
            <h2>
              {result.homeTeam || "Home"} {result.homeScore ?? 0} - {result.awayScore ?? 0}{" "}
              {result.awayTeam || "Away"}
            </h2>

            <p>
              <strong>Sport:</strong> {result.sport || "N/A"}
            </p>
            <p>
              <strong>Category:</strong> {result.category || result.gender || "N/A"}
            </p>
            <p>
              <strong>Stage:</strong> {result.stage || "N/A"}
            </p>
            <p>
              <strong>Group:</strong> {result.competitionGroup || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {result.date || "N/A"}
            </p>
            <p>
              <strong>Kickoff:</strong> {result.kickoffTime || "N/A"}
            </p>
            <p>
              <strong>End Time:</strong> {result.endTime || "N/A"}
            </p>
            <p>
              <strong>Venue:</strong> {result.venue || "N/A"}
            </p>

            <div className="result-summary-box">
              <h3>Match Summary</h3>
              <p>{result.summary || "No summary available."}</p>
            </div>

            {Array.isArray(result.events) && result.events.length > 0 && (
              <div className="result-events-list">
                  {result.events.map((event, index) => (
                    <div className="result-event-item" key={event.id || index}>
                      <strong>
                        {event.minute ? `${event.minute}' ` : ""}
                        {event.type || "Event"}
                      </strong>
                      <p>{event.note || "No extra note"}</p>
                    </div>
                  ))}
              </div>
            )}

            <div style={{ marginTop: "1.25rem" }}>
              <Link to="/results" className="homepage-link-btn">
                Back to Results
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ResultDetails;