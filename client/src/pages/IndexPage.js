import { useEffect, useState } from "react";
import Post from "../post";
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

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      fetch("http://localhost:4000/post").then((response) => {
        response.json().then((posts) => {
          setPosts(posts);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (posts == 0)
    return (
      <div className="noPostsFound">
        It seems like no has posted yet. Be the first! Create a new post now.
      </div>
    );

  return (
    <Section>
      <div>
        <>
          {posts.length > 0 &&
            posts.map((post) => {
              return <Post {...post} />;
            })}
        </>
      </div>
    </Section>
  );
}
