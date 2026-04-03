import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Accordion from "../components/common/Accordion";
import faqData from "../data/faqData";

function Faq() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Frequently Asked Questions</h1>
            <p className="page-intro">
              Find quick answers to common questions about registration, matches, teams, and support.
            </p>
          </div>

          <div className="page-card">
            <Accordion items={faqData} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Faq;