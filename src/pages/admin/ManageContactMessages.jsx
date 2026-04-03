import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function ManageContactMessages() {
  const { contactMessages, deleteContactMessage } = useAppData();

  const sortedMessages = [...contactMessages].sort((a, b) =>
    String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
  );

  const handleDelete = async (id) => {
    try {
      await deleteContactMessage(id);
    } catch (error) {
      alert(error.message || "Failed to delete message.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Contact Messages</h2>
        <p>View and manage messages submitted through the contact form.</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-list">
          {sortedMessages.length ? (
            sortedMessages.map((message) => (
              <div className="admin-list-card" key={message.id}>
                <h3>{message.name || "No name provided"}</h3>

                <p>
                  <strong>Email:</strong> {message.email}
                </p>

                <p>
                  <strong>Category:</strong> {message.category}
                </p>

                <p>
                  <strong>Submitted:</strong>{" "}
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleString()
                    : "No date"}
                </p>

                <div className="admin-message-box">
                  <strong>Message:</strong>
                  <p>{message.message}</p>
                </div>

                <div className="admin-actions">
                  <button type="button" onClick={() => handleDelete(message.id)}>
                    Delete Message
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No contact messages yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageContactMessages;