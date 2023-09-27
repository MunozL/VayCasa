import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotoUploader from "../PhotosUploader";
import axios from "axios";
//import axios from "axios";

export default function PlacesPage() {
  const { action } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]); //array for photos

  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  // const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState("");

  //Function to handle all the states of h2 element texts
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  //Function to handle all the states of <p> element texts
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  //
  //
  //function passing above functions as parameters
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  //
  /************* function to add new place******************
   * const data will include all info . endpoint created to send data
   */
  async function addNewPlace(ev) {
    ev.preventDefault();
    await axios.post("/places", {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    setRedirect("/account/places");
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      {action !== "new" && (
        <div className="text-center">
          <Link
            className=" inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <form onSubmit={addNewPlace}>
            {preInput("Title", "Title for your place")}

            <input
              className="border rounded-2xl"
              type="text "
              placeholder="enter title"
              style={{ width: "100%" }}
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            {preInput("Address", "Address for your place")}

            <input
              className="border rounded-2xl"
              type="text"
              placeholder=" enter address"
              style={{ width: "100%" }}
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
            />
            {preInput("Photos", "Add your photos")}
            <PhotoUploader
              addedPhotos={addedPhotos}
              onChange={setAddedPhotos}
            />

            {preInput("About property", "Add description of the place")}

            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
            {preInput("Amenities", "Add all perks that apply")}
            <Perks selected={perks} onChange={setPerks} />
            {preInput("Extra Info", "House rules, ...")}

            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />
            {preInput("Check in&out times", "add check in and out times")}

            <div className="grid sm:grid-cols-3 gap-2">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  className="border"
                  type="text"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  placeholder="14:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1 "> Check out time</h3>

                <input
                  className="border"
                  type="text"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  placeholder="11:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max guest</h3>

                <input
                  className="border"
                  type="number"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                />
              </div>
            </div>
            <div>
              <button className="primary my-4">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
