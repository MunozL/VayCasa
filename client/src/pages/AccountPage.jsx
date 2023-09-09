import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

//*************Account Page function with export included */
export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext); //use useCOntext fro UserCOntext to get status of user and ready

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "account";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return "Loading....";
  }

  //If statements to handle potential null or undefined values:
  //If not ready and theres no user or no user name then navigate to login page
  if ((ready && !user) || !user.name) return <Navigate to={"/login"} />;
  //function to highlight link of current page.
  function LinkClasses(type = null) {
    let classes = "py-2 px-6";
    if (type === subpage) {
      classes += " bg-primary rounded-full"; // Concatenate the classes using +=
    }
    return classes;
  }

  //**********Button Links STAYS AND LISTINGS**********/

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link className={LinkClasses("account")} to={"/account"}>
          My Profile
        </Link>
        <Link className={LinkClasses("listings")} to={"/account/listings"}>
          My listings
        </Link>
        <Link className={LinkClasses("stays")} to={"/account/stays"}>
          My stays
        </Link>
      </nav>

      {subpage === "account" && (
        <div className="text-center max-w-lg mx-auto ">
          Logged in as {(user.name, user.email)}
          <br />
          <button onClick={logout} className="primary max-w-sm ">
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
