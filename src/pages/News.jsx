import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function News() {
  const { news = [] } = useAppData();

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Sports News</h1>
            <p className="page-intro">Stay updated with the latest sports news and updates.</p>
          </div>

          <div className="page-card">
            <div className="news-grid">
              {news.length ? (
                news.map((item) => (
                  <Link to={`/news/${item.id}`} className="news-card" key={item.id}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="news-card__img"
                    />
                    <div className="news-card__body">
                      <p className="news-card__meta">{item.category || "General"}</p>
                      <h3>{item.title}</h3>
                      <p>{item.summary || item.content || item.excerpt || "No summary available."}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="empty-state">No news available yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default News;