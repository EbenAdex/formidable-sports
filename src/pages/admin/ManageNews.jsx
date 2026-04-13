import AdminLayout from "../../components/admin/AdminLayout";
import AdminNewsForm from "../../components/admin/AdminNewsForm";
import { useAppData } from "../../context/AppDataContext";

function ManageNews() {
  const { news = [], addNews, deleteNews } = useAppData();

  const handleAddNews = async (newNews) => {
    await addNews({
      ...newNews,
      summary: newNews.summary || "",
      content: newNews.content || newNews.summary || "",
    });
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage News</h2>
        <p>Publish and manage sports-related updates and announcements.</p>
        <AdminNewsForm onAddNews={handleAddNews} />
      </div>

      <div className="admin-section-card">
        <h2>News List</h2>

        <div className="admin-list">
          {news.length ? (
            news.map((item) => (
              <div className="admin-list-card" key={item.id}>
                <h3>{item.title || "Untitled News"}</h3>
                <p>
                  <strong>Category:</strong> {item.category || "General"}
                </p>
                <p>{item.summary || item.content || item.excerpt || "No summary available."}</p>

                <div className="admin-actions">
                  <button
                    type="button"
                    onClick={async () => {
                      const confirmed = window.confirm(`Delete news: ${item.title}?`);
                      if (!confirmed) return;
                      await deleteNews(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No news available yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageNews;