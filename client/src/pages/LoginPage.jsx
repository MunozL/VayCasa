import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom"; // for React Router DOM
import { UserContext } from "../UserContext";

export default function LoginPage() {
  //state for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  // **************** HandleLogin Async FUNCTION *******************
  async function handleLoginSubmit(ev) {
    ev.preventDefault(); //prevents page from reloading
    //login user using axios.post

    try {
      const data = await axios.post("/login", { email, password });
      setUser(data);
      alert("Login successful!");
      setRedirect(true);
    } catch (error) {
      alert("Login failed");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto " onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder={"your@email.com"}
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder={"password"}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Dont have an account yet?
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
