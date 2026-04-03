import { useState } from "react";

function AdminNewsForm({ onAddNews }) {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    excerpt: "",
    image: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newNews = {
      ...formData,
      id: Date.now(),
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=800&q=80",
    };

    onAddNews(newNews);

    setFormData({
      category: "",
      title: "",
      excerpt: "",
      image: "",
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__grid">
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="News Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL (optional)"
          value={formData.image}
          onChange={handleChange}
        />
        <textarea
          name="excerpt"
          placeholder="News excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <button type="submit" className="btn btn--primary">
        Publish News
      </button>
    </form>
  );
}

export default AdminNewsForm;