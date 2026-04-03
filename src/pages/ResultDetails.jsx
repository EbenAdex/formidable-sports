import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function ResultDetails() {
  const { id } = useParams();
  const { results } = useAppData();

  const result = results.find((item) => item.id === Number(id));

  if (!result) {
    return (
      <>
        <Navbar />
        <main className="page section">
          <div className="container">
            <p>Result not found.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <div className="match-details-page">
            <section className="match-details-hero">
              <p className="match-details-hero__meta">
                {result.sport} • {result.gender}
              </p>
              <h1 className="match-details-hero__title">
                {result.homeTeam} <span>{result.homeScore}</span> -{" "}
                <span>{result.awayScore}</span> {result.awayTeam}
              </h1>
              <p className="match-details-hero__status">Final Result</p>
            </section>

            <section className="match-details-grid">
              <div className="match-panel">
                <h2>Match Summary</h2>
                <p>
                  <strong>Date:</strong> {result.date}
                </p>
                <p>
                  <strong>Venue:</strong> {result.venue}
                </p>
                <p>
                  <strong>Category:</strong> {result.gender}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ResultDetails;