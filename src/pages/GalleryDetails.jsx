import { Link, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function GalleryDetails() {
  const { id } = useParams();
  const { gallery = [] } = useAppData();

  const item = gallery.find((galleryItem) => String(galleryItem.id) === String(id));

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="navbar-spacer" />
        <main className="page-shell">
          <div className="container">
            <div className="page-card">
              <p>Gallery item not found.</p>
              <Link to="/gallery" className="homepage-link-btn">
                Back to Gallery
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
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>{item.title}</h1>
            <p className="page-intro">{item.category || "Gallery Details"}</p>
          </div>

          <div className="page-card gallery-details-card">
            <img
              src={item.image}
              alt={item.title}
              className="gallery-details-card__image"
            />

            <div className="gallery-details-card__content">
              <h2>{item.title}</h2>
              <p>
                <strong>Category:</strong> {item.category || "General"}
              </p>
              <p>{item.description || "No detailed description has been added yet."}</p>

              <Link to="/gallery" className="homepage-link-btn">
                Back to Gallery
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default GalleryDetails;