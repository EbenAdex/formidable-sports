import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SportPageContent from "../components/sports/SportPageContent";

function Football() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Football</h1>
            <p className="page-intro">Follow football fixtures, live match activity, group stage games, finals, and team lineups for both male and female categories.</p>
          </div>

          <div className="page-card">
            <SportPageContent sportName="Football" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Football;