import { useState } from "react";
import Image from "./Image";

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black  text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-"> {place.title}'s photos</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed  right-12  top-8 flex gap-1 py-1 px-4 rounded-2xl shadow shadow-black bg-white text-black  "
            >
              x close photos
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <div>
                <Image src={photo} alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {place.photos?.[0] && (
            <div>
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover  cursor-pointer"
                src={place.photos[0]}
              />
            </div>
          )}
        </div>
        <div className="grid ">
          {place.photos?.[0] && (
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="aspect-square object-cover cursor-pointer
 "
              src={place.photos[1]}
            />
          )}
          <div className="overflow-hidden">
            {" "}
            {place.photos?.[0] && (
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover relative top-2 cursor-pointer
"
                src={place.photos[2]}
              />
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex  absolute bottom-1 right-1 py-1 px-4 bg-white rounded-2xl shadow-md shadow-gray-500 "
      >
        More photos
      </button>
    </div>
  );
}
