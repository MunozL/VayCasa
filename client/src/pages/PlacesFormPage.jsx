import { useEffect, useState } from "react";
import PhotoUploader from "../PhotosUploader";
import Perks from "../Perks";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]); //array for photos

  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  useEffect(() => {
    if (!id) {
      return;
    } //if there is id fetch all the data with axios api end point
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

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
  /************* function to add new place into data base using axios post******************
   * const data will include all info . endpoint created to send data
   */
  async function saveNewPlace(ev) {
    ev.preventDefault();
    const placeData = {
      //define const for object
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      //update by using put request. Include id in body to know which post needs to be updated
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      //add a new place with a post request
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <form onSubmit={saveNewPlace}>
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
        <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

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

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
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
          <div>
            <h3 className="mt-2 -mb-1">Price Per Night</h3>

            <input
              className="border"
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
