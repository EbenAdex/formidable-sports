import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SportPageContent from "../components/sports/SportPageContent";

function Basketball() {
  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Basketball</h1>
            <p className="page-intro">Track basketball fixtures, final-stage matches, competition schedules, and current match information.</p>
          </div>

          <div className="page-card">
            <SportPageContent sportName="Basketball" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Basketball;