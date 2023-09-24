import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";

export default function PlacesPage() {
  const { action } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]); //array for photos
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  // const [price, setPrice] = useState(100);
  // const [redirect, setRedirect] = useState(false);

  //Function to handle all the states of h2 element texts
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  //Function to handle all the states of <p> element texts
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  //function passing above functions as parameters
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  //Function to upload photos by link using api post /upload-by-link
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });

    setAddedPhotos((prev) => {
      return [...prev, filename];
    });
    setPhotoLink(""); //Reset Photolink
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
          <form>
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
            <div className="flex gap-1">
              <input
                className="border rounded-2xl"
                style={{ width: "100%" }}
                type="text"
                placeholder={"Add using a url link ....jp"}
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
              ></input>
              <button
                onClick={addPhotoByLink}
                className="bg gray-200 px-4 rounded-2xl "
              >
                Submit&nbsp;Photo
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              <button className=" flex justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
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
                    d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                  />
                </svg>
                Upload photo
              </button>
            </div>
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
