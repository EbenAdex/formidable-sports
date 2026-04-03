import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import NewsCard from "../components/sports/NewsCard";
import { useAppData } from "../context/AppDataContext";

function News() {
  const { news } = useAppData();

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Sports News</h1>
            <p className="page-intro">Stay updated with the latest sports news and updates.</p>
          </div>

          <div className="page-card">
            <div className="news-grid">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default News;