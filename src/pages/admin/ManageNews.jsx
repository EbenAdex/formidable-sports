import AdminLayout from "../../components/admin/AdminLayout";
import AdminNewsForm from "../../components/admin/AdminNewsForm";
import { useAppData } from "../../context/AppDataContext";

function ManageNews() {
  const { news, addNews, deleteNews } = useAppData();

  const handleAddNews = (newNews) => {
    addNews(newNews);
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
          {news.map((item) => (
            <div className="admin-list-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>
                <strong>Category:</strong> {item.category}
              </p>
              <p>{item.excerpt}</p>

              <div className="admin-actions">
                <button type="button" onClick={() => deleteNews(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageNews;