/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";

export default function PhotoUploader({ addedPhotos, onChange }) {
  //array for photos
  const [photoLink, setPhotoLink] = useState("");
  //
  //Function to upload photos by link using api post /upload-by-link
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    onChange((prev) => {
      return [...prev, filename];
    });
    setPhotoLink(""); //Reset Photolink
  }

  //
  //Function to upload photos from computer
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        onChange((prev) => {
          return [...prev, ...filenames];
        });
      });
  }
  return (
    <>
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
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className=" h-32 flex" key={link}>
              <img
                className="rounded-2xl w-full object-cover position-center"
                src={`http://localhost:4000/${link}`}
                alt="Uploaded"
              />
            </div>
          ))}

        <label className=" h-32 cursor-pointer flex justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
          <input
            multiple
            type="file"
            className="hidden"
            onChange={uploadPhoto}
          ></input>
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
        </label>
      </div>
    </>
  );
}
