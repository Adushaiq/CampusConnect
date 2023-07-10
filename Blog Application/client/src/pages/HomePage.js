import campusImage from "../Assets/brooke-cagle-g1Kr4Ozfoac-unsplash.jpg";
import { Link } from "react-router-dom";

import { useRef } from "react";
import { useInView } from "framer-motion";

function Section({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref}>
      <span
        style={{
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .5s",
        }}
      >
        {children}
      </span>
    </section>
  );
}

export default function HomePage() {
  return (
    <Section>
      <div className="heroSection">
        <div classname="heroContent">
          <h1 classname="heroTitle">Welcome to Campus Connect!</h1>
          <p classname="heroDescription">
            A platform for students to share their stories, ideas, and
            perspectives with the campus community.
          </p>
          <Link className="heroBtn" to="/register">
            Join the community
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </Link>
        </div>
        <div>
          <img src={campusImage} alt="" />
        </div>
      </div>
    </Section>
  );
}
