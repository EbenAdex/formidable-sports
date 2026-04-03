import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import MatchCard from "../components/sports/MatchCard";
import { useAppData } from "../context/AppDataContext";

function Results() {
  const { results } = useAppData();

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Results</h1>
            <p className="page-intro">Check out the latest match results.</p>
          </div>

          <div className="page-card">
            <div className="match-list">
              {results.map((result) => (
                <MatchCard key={result.id} match={result} type="result" />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Results;