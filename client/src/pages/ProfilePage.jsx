import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

//import StaysPage from "./StaysPage";

import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

//*************Account Page function with export included */
export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  //If user is not ready console out loading
  if (!ready) {
    return "loading...";
  }

  //if ready and there is no user go to login
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto ">
          Logged in as {(user.name, user.email)}
          <br />
          <button onClick={logout} className="primary max-w-sm ">
            Log out
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}

// export default function AccountPage() {
//   const [redirect, setRedirect] = useState(null);
//   const { ready, user, setUser } = useContext(UserContext); //use useCOntext fro UserCOntext to get status of user and ready

//   async function logout() {
//     await axios.post("/logout");
//     setRedirect("/");
//     setUser(null);
//   }

//   if (!ready) {
//     return "Loading....";
//   }

//   //If statements to handle potential null or undefined values:
//   //If not ready and theres no user or no user name then navigate to login page
//   if ((ready && !user) || !user.name) return <Navigate to={"/login"} />;
// //   //function to highlight link of current page.
//   function LinkClasses(type = null) {
//     let classes = "py-2 px-6";
//     if (type === subpage) {
//       classes += " bg-primary rounded-full"; // Concatenate the classes using +=
//     }
//     return classes;
//   }

//   //**********Button Links STAYS AND LISTINGS**********/

//   if (redirect) {
//     return <Navigate to={redirect} />;
//   }

// }
