import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SportPageContent from "../components/sports/SportPageContent";

function Tennis() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Tennis</h1>
            <p className="page-intro">View tennis match information, fixtures, and competition progress for the current sports festival.</p>
          </div>

          <div className="page-card">
            <SportPageContent sportName="Tennis" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Tennis;