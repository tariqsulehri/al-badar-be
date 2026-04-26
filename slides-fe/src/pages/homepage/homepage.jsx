import React from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromStore } from "../../utils/fetchFromStore";
import "./homePage.css";

const highlights = [
  {
    title: "Fast feature delivery",
    copy: "Clean navigation and surface hierarchy make day-to-day tasks easier to scan and complete.",
  },
  {
    title: "Operational visibility",
    copy: "A sharper dashboard structure gives teams a better sense of active media inventory and setup health.",
  },
  {
    title: "Professional polish",
    copy: "Refined spacing, typography, and cards bring the product closer to a modern business platform.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = fetchFromStore("auth");

  return (
    <section className="home-hero page-section">
      <div className="home-hero__panel page-card">
        <div className="home-hero__content">
          <span className="page-header__eyebrow">Modernized Experience</span>
          <h1>Manage slides, inventory, and setup data from one polished workspace.</h1>
          <p>
            The interface now leans into a cleaner product feel with stronger hierarchy,
            better spacing, and a more executive dashboard aesthetic.
          </p>

          <div className="home-hero__actions">
            <button className="btn btn-primary" onClick={() => navigate("/slides/list")}>
              Explore Slides
            </button>
            <button className="home-hero__ghost" onClick={() => navigate("/dashboard")}>
              Open Dashboard
            </button>
          </div>

          <div className="home-hero__welcome">
            <strong>{currentUser ? `Welcome back, ${currentUser.name}` : "Welcome to Slides Control Center"}</strong>
            <span>{currentUser ? "Your workspace is ready for feature work and daily operations." : "Sign in to unlock setup, slide, and user workflows."}</span>
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__orb home-hero__orb--primary" />
          <div className="home-hero__orb home-hero__orb--accent" />

          <div className="home-hero__showcase">
            <div className="home-hero__metric">
              <span>Media inventory</span>
              <strong>Centralized</strong>
            </div>
            <div className="home-hero__metric">
              <span>Slide workflows</span>
              <strong>Smoother</strong>
            </div>
            <div className="home-hero__metric">
              <span>Team experience</span>
              <strong>More modern</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="home-highlights">
        {highlights.map((item) => (
          <article key={item.title} className="page-card home-highlight">
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Home;
