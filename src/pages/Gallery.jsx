import { useMemo, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import galleryData from "../data/galleryData";

function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(galleryData.map((item) => item.category))];
    return ["All", ...uniqueCategories];
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return galleryData;
    return galleryData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Gallery</h1>
            <p className="page-intro">
              Explore memorable moments from competitions, ceremonies, and major sports events.
            </p>
          </div>

          <div className="page-card">
            <div className="sport-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "sport-filter active" : "sport-filter"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="gallery-grid">
              {filteredItems.map((item) => (
                <div className="gallery-card" key={item.id}>
                  <img src={item.image} alt={item.title} className="gallery-card__image" />
                  <div className="gallery-card__content">
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Gallery;