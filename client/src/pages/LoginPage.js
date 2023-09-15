import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  function addTestCredentials(ev){
    ev.preventDefault();
    setUsername("TestUser");
    setPassword("testuser");
  }

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
      toast.success("Logged in Successfully");
    } else {
      toast.error("Wrong Credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/blog"} />;
  }

  return (
    <div className="Form">
      <form className="login" onSubmit={login}>
        <h1>Login</h1>

        <p>Enter Your Username</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />

        <p>Enter Your Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Login</button>
      </form>
      <button className="test" onClick={addTestCredentials}>Get Test Username & Password</button>

      <p className="loginLink">
        Don't have an account yet?
        <br />
        <Link to={"/register"}> Sign Up Now! </Link>
      </p>
    </div>
  );
}
