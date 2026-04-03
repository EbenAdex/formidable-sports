import { Link } from "react-router-dom";
import NewsCard from "../sports/NewsCard";
import { useAppData } from "../../context/AppDataContext";

function NewsPreview() {
  const { news } = useAppData();

  return (
    <section className="section">
      <div className="container">
        <div className="section__top">
          <h2>Latest News</h2>
          <Link to="/news" className="section__link">
            Read more
          </Link>
        </div>

        <div className="news-grid">
          {news.slice(0, 3).map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsPreview;