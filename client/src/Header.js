import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import toast from 'react-hot-toast';
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

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    toast.success('Logged Out Successfully');
  }

  const username = userInfo?.username;

  return (
    <Section>
      <header>
        <Link to="/" className="logo">
          Campus Connect
        </Link>
        <nav>
          {username && (
            <>
              <Link to="/blog">Blog</Link>
              <Link to="/create">Create new post</Link>
              <Link to="/" onClick={logout}>
                Log Out
              </Link>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </nav>
      </header>
    </Section>
  );
}
