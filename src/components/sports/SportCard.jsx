import { Link } from "react-router-dom";

function SportCard({ sport }) {
  return (
    <div className="sport-card">
      <div className="sport-card__image">
        <img src={sport.image} alt={sport.name} />
      </div>

      <div className="sport-card__body">
        <h3>{sport.name}</h3>
        <p>{sport.description}</p>
        <Link to={sport.link} className="sport-card__link">
          Explore
        </Link>
      </div>
    </div>
  );
}

export default SportCard;