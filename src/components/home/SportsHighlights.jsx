import sportsData from "../../data/sportsData";
import SportCard from "../sports/SportCard";

function SportsHighlights() {
  return (
    <section className="sports-highlights section">
      <div className="container">
        <div className="section__top">
          <h2>Sports Categories</h2>
          <p>Explore all sporting activities available on Formidable Sports.</p>
        </div>

        <div className="sports-grid">
          {sportsData.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SportsHighlights;