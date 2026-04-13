import { useMemo, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import MatchCard from "../components/sports/MatchCard";
import { useAppData } from "../context/AppDataContext";

function Fixtures() {
  const { fixtures } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFixtures = useMemo(() => {
    return fixtures.filter((fixture) => {
      const combined = [
        fixture.homeTeam,
        fixture.awayTeam,
        fixture.sport,
        fixture.stage,
        fixture.venue,
      ]
        .join(" ")
        .toLowerCase();

      return combined.includes(searchTerm.toLowerCase());
    });
  }, [fixtures, searchTerm]);

  const groupedFixtures = useMemo(() => {
    return filteredFixtures.reduce((acc, fixture) => {
      if (!acc[fixture.date]) {
        acc[fixture.date] = [];
      }
      acc[fixture.date].push(fixture);
      return acc;
    }, {});
  }, [filteredFixtures]);

  const groupedDates = Object.keys(groupedFixtures).sort();

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Fixtures</h1>
            <p className="page-intro">View upcoming match schedules and fixtures.</p>
          </div>

          <div className="page-card">
            <div className="team-search-bar">
              <input
                type="text"
                placeholder="Search fixtures by team, sport, stage, or venue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {groupedDates.length ? (
              groupedDates.map((date) => (
                <section className="fixture-group" key={date}>
                  <h2 className="fixture-group__title">{date}</h2>
                  <div className="match-list">
                    {groupedFixtures[date].map((fixture) => (
                      <MatchCard key={fixture.id} match={fixture} type="fixture" />
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <p>No fixtures match your search.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Fixtures;