import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import MatchCard from "../components/sports/MatchCard";
import { useAppData } from "../context/AppDataContext";

function Favourites() {
  const { fixtures, favourites } = useAppData();

  const favouriteMatches = fixtures.filter((fixture) =>
    favourites.includes(fixture.id)
  );



  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Favourite Matches</h1>
            <p className="page-intro">
              Track matches you have marked for quick access and updates.
            </p>
          </div>

          <div className="page-card">
            {favouriteMatches.length ? (
              <div className="match-list">
                {favouriteMatches.map((match) => (
                  <MatchCard key={match.id} match={match} type="fixture" />
                ))}
              </div>
            ) : (
              <p style={{color: 'white'}} >No favourite matches yet.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}



export default Favourites;