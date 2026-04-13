import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import page01 from "../assets/fasa/page-01.jpeg";
import page02 from "../assets/fasa/page-02.jpeg";
import page03 from "../assets/fasa/page-03.jpeg";
import page04 from "../assets/fasa/page-04.jpeg";
import page05 from "../assets/fasa/page-05.jpeg";
import page06 from "../assets/fasa/page-06.jpeg";
import page07 from "../assets/fasa/page-07.jpeg";
import page08 from "../assets/fasa/page-08.jpeg";
import page09 from "../assets/fasa/page-09.jpeg";
import page10 from "../assets/fasa/page-10.jpeg";
import page11 from "../assets/fasa/page-11.jpeg";
import page12 from "../assets/fasa/page-12.jpeg";
import page13 from "../assets/fasa/page-13.jpeg";
import page14 from "../assets/fasa/page-14.jpeg";
import page15 from "../assets/fasa/page-15.jpeg";

const pageSections = [
  {
    id: 1,
    title: "Introduction",
    text: "This opening section introduces FASA and sets the tone for the identity, spirit, and purpose of the faculty student body.",
    image: page01,
  },
  {
    id: 2,
    title: "Faculty Identity",
    text: "This section reflects the character of the Faculty of Arts Students’ Association and how it presents itself within the university community.",
    image: page02,
  },
  {
    id: 3,
    title: "Vision and Community",
    text: "Here, the emphasis is on belonging, student participation, visibility, and the shared culture that defines FASA.",
    image: page03,
  },
  {
    id: 4,
    title: "Student Experience",
    text: "This section highlights the atmosphere around student life, engagement, and memorable faculty experiences.",
    image: page04,
  },
  {
    id: 5,
    title: "Scale and Presence",
    text: "This part presents the strength and relevance of the faculty through its reach, student body, and active visibility.",
    image: page05,
  },
  {
    id: 6,
    title: "Programs and Activities",
    text: "This section captures how the faculty expresses itself through organized student-centered programs and events.",
    image: page06,
  },
  {
    id: 7,
    title: "Sports and Competition",
    text: "This page reflects the sporting culture, competitive spirit, and energy that surround faculty activities such as Artlympics.",
    image: page07,
  },
  {
    id: 8,
    title: "Creative and Social Culture",
    text: "This section shows the cultural and social side of FASA, balancing academics with expression, fun, and community.",
    image: page08,
  },
  {
    id: 9,
    title: "Participation and Representation",
    text: "This part reinforces how FASA gives students a visible platform for involvement, representation, and collective identity.",
    image: page09,
  },
  {
    id: 10,
    title: "Impact and Reach",
    text: "This section emphasizes influence, audience engagement, and the broader significance of FASA within campus life.",
    image: page10,
  },
  {
    id: 11,
    title: "Engagement Structure",
    text: "This page can serve as a visual section for structure, planning, or organized student interaction within the association.",
    image: page11,
  },
  {
    id: 12,
    title: "Momentum and Visibility",
    text: "This part continues the story of student visibility, event presentation, and the overall public image of FASA.",
    image: page12,
  },
  {
    id: 13,
    title: "Faculty Energy",
    text: "This section captures the dynamic side of the faculty and the energy that comes with coordinated student activities.",
    image: page13,
  },
  {
    id: 14,
    title: "Recognition and Value",
    text: "This page helps communicate the value, prestige, and recognition associated with the faculty and its student body.",
    image: page14,
  },
  {
    id: 15,
    title: "Closing Showcase",
    text: "The final section serves as a closing visual summary of the faculty’s identity, culture, and student experience.",
    image: page15,
  },
];

function AboutFasa() {
  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />

      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>About FASA</h1>
            <p className="page-intro">
              Explore the identity, culture, energy, and student experience of the
              Faculty of Arts Students’ Association, University of Lagos.
            </p>
          </div>

          <section className="about-fasa-hero">
            <div className="about-fasa-hero__content">
              <span className="about-fasa-hero__tag">Faculty of Arts Students’ Association</span>
              <h2>Culture, Community, Creativity, and Competition</h2>
              <p>
                FASA represents one of the most visible and vibrant student communities
                in the University of Lagos. This page presents the faculty through the
                visual story and materials drawn from its official presentation deck.
              </p>
            </div>

            <div className="about-fasa-hero__image-wrap">
              <img src={page01} alt="About FASA hero" className="about-fasa-hero__image" />
            </div>
          </section>

          <section className="about-fasa-overview">
            <div className="dark-card">
              <h3>What This Page Shows</h3>
              <p>
                This page is structured as a visual presentation of FASA. It highlights
                the faculty’s identity, student life, participation culture, sports
                atmosphere, and the broader energy that defines the Faculty of Arts.
              </p>
            </div>

            <div className="dark-card">
              <h3>Why It Matters</h3>
              <p>
                FASA is not only a representative student body. It is also a center of
                engagement, visibility, and shared experience for Arts students across
                the university.
              </p>
            </div>

            <div className="dark-card">
              <h3>Presentation Format</h3>
              <p>
                Rather than displaying the PDF as a document, the content is rebuilt here
                as a web page with sectioned visuals for a cleaner and more modern experience.
              </p>
            </div>
          </section>

          <section className="about-fasa-gallery">
            {pageSections.map((section, index) => (
              <article
                key={section.id}
                className={`about-fasa-section ${
                  index % 2 === 0 ? "about-fasa-section--left" : "about-fasa-section--right"
                }`}
              >
                <div className="about-fasa-section__image">
                  <img src={section.image} alt={section.title} />
                </div>

                <div className="about-fasa-section__content">
                 
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="about-fasa-summary page-card">
            <h2>FASA at a Glance</h2>
            <div className="about-fasa-summary__grid">
              <div className="about-fasa-summary__item">
                <strong>Community</strong>
                <p>A strong student body built around participation, identity, and belonging.</p>
              </div>
              <div className="about-fasa-summary__item">
                <strong>Culture</strong>
                <p>A lively faculty known for creativity, social expression, and visibility.</p>
              </div>
              <div className="about-fasa-summary__item">
                <strong>Sports</strong>
                <p>An active competitive environment that supports events like Artlympics.</p>
              </div>
              <div className="about-fasa-summary__item">
                <strong>Representation</strong>
                <p>A faculty body that reflects the voice and experience of Arts students.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AboutFasa;