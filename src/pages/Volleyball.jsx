import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SportPageContent from "../components/sports/SportPageContent";

function Volleyball() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Volleyball</h1>
            <p className="page-intro">Stay updated with volleyball match schedules, upcoming games, and match details across the competition.</p>
          </div>

          <div className="page-card">
            <SportPageContent sportName="Volleyball" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Volleyball;