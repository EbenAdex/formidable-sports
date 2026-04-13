import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function ManageGallery() {
  const {
    gallery = [],
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  } = useAppData();

  const [editingId, setEditingId] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    category: "General",
  });

  const categories = useMemo(() => {
    const dynamicCategories = [
      ...new Set((gallery || []).map((item) => item.category).filter(Boolean)),
    ];
    return ["All", "General", ...dynamicCategories.filter((item) => item !== "General")];
  }, [gallery]);

  const filteredGallery = useMemo(() => {
    if (filterCategory === "All") return gallery || [];
    return (gallery || []).filter((item) => item.category === filterCategory);
  }, [gallery, filterCategory]);

  const resetForm = () => {
    setEditingId("");
    setFormData({
      title: "",
      image: "",
      description: "",
      category: "General",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.image.trim()) return;

    const payload = {
      title: formData.title.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      category: formData.category.trim() || "General",
    };

    if (editingId) {
      await updateGalleryItem(editingId, payload);
    } else {
      await addGalleryItem(payload);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      image: item.image || "",
      description: item.description || "",
      category: item.category || "General",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this gallery item?");
    if (!confirmed) return;

    await deleteGalleryItem(id);

    if (String(editingId) === String(id)) {
      resetForm();
    }
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>{editingId ? "Edit Gallery Item" : "Add Gallery Item"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <input
              type="text"
              name="title"
              placeholder="Gallery title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description / write-up"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="admin-actions">
            <button type="submit">
              {editingId ? "Update Gallery Item" : "Add Gallery Item"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-section-card">
        <h2>Gallery Items</h2>

        <div className="filter-row">
          <select
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-list">
          {filteredGallery.length ? (
            filteredGallery.map((item) => (
              <div className="admin-list-card" key={item.id}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    maxWidth: "260px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                  }}
                />

                <h3>{item.title}</h3>
                <p>
                  <strong>Category:</strong> {item.category || "General"}
                </p>
                <p>{item.description || "No description provided."}</p>

                <div className="admin-actions">
                  <button type="button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No gallery items available yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageGallery;