import { Link, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function NewsDetails() {
  const { id } = useParams();
  const { news = [] } = useAppData();

  const item = news.find((newsItem) => String(newsItem.id) === String(id));

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="container">
            <div className="page-card">
              <p>News article not found.</p>
              <Link to="/news" className="homepage-link-btn">
                Back to News
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>{item.title}</h1>
            <p className="page-intro">
              {item.category || "Sports News"}
            </p>
          </div>

          <div className="page-card news-details-card">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="news-details-card__image"
              />
            ) : null}

            <div className="news-details-card__content">
              <p>
                <strong>Category:</strong> {item.category || "General"}
              </p>

              <div className="news-details-card__text">
                <p>{item.content || item.summary || "No content available."}</p>
              </div>

              <Link to="/news" className="homepage-link-btn">
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NewsDetails;