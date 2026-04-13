import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function FixtureCalendar() {
  const { fixtures } = useAppData();

  const groupedFixtures = fixtures.reduce((acc, fixture) => {
    if (!acc[fixture.date]) {
      acc[fixture.date] = [];
    }
    acc[fixture.date].push(fixture);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedFixtures).sort();

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Fixture Calendar</h1>
            <p className="page-intro">
              Browse scheduled matches grouped by date.
            </p>
          </div>

          <div className="dark-grid">
            {sortedDates.length ? (
              sortedDates.map((date) => (
                <div className="page-card" key={date}>
                  <h2 style={{ color: "#fff", marginTop: 0 }}>{date}</h2>

                  <div className="calendar-grid-dark">
                    {groupedFixtures[date].map((fixture) => (
                      <div className="dark-card" key={fixture.id}>
                        <h3 className="calendar-match-title">
                          {fixture.homeTeam} vs {fixture.awayTeam}
                        </h3>
                        <p>
                          <strong>Sport:</strong> {fixture.sport}
                        </p>
                        <p>
                          <strong>Category:</strong> {fixture.category || fixture.gender}
                        </p>
                        <p>
                          <strong>Time:</strong> {fixture.kickoffTime}
                        </p>
                        <p>
                          <strong>Venue:</strong> {fixture.venue}
                        </p>
                        <p>
                          <strong>Stage:</strong> {fixture.stage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="page-card">
                <p className="empty-state">No fixtures scheduled yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default FixtureCalendar;