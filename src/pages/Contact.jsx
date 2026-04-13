import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function Contact() {
  const { addContactMessage } = useAppData();
      
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Information",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  await addContactMessage({
    name: formData.name,
    email: formData.email,
    category: formData.category,
    message: formData.message,
  });

  setSubmitted(true);
  setFormData({
    name: "",
    email: "",
    category: "Information",
    message: "",
  });
};
  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Contact Us</h1>
            <p className="page-intro">
              Reach the platform team for information, support, feedback, or suggestions.
            </p>
          </div>

          <div className="contact-page-grid">
            <div className="page-card">
              <h2 className="contact-title">Send a Message</h2>

              {submitted && (
                <div className="contact-success">
                  Your message has been submitted successfully.
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Information">Information</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Complaint">Complaint</option>
                </select>

                <textarea
                  name="message"
                  placeholder="Write your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className="btn btn--primary">
                  Submit Message
                </button>
              </form>
            </div>

            <div className="page-card">
              <h2 className="contact-title">Support Desk</h2>
              <div className="contact-side-block">
                <p>
                  Use this page for inquiries about registration, schedules,
                  fixtures, results, team participation, and competition updates.
                </p>
                <p>
                  You can also send suggestions and feedback to improve the platform.
                </p>
                <p>
                  Registration confirmation emails will be fully activated during
                  the backend production phase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Contact;