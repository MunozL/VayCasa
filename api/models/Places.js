const { default: mongoose, model } = require("mongoose");

const placeSchema = new mongoose.Schema({
  //Use mongoose.Schema.Types with Object id to identify who the post owner is

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkout: Number,
  maxGuests: Number,
});

const PlaceModel = mongoose.model("Place", placeSchema);
model.export = PlaceModel;
