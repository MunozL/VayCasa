require("dotenv").config();
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const Places = require("./models/Places");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const mime = require("mime-types");
const cookieParser = require("cookie-parser");
const Booking = require("./models/Booking");
const { resolve } = require("path");
const { rejects } = require("assert");
const app = express();

const bcryptSalt = bcryptjs.genSaltSync(10); // bcryptSalt defined
const jwtSecret = "randomstring";
const bucket = "vaycasa-booking-app";

app.use("/api/uploads", express.static(__dirname + "/api/uploads"));

app.use(express.json()); //This allows to parse info into json
app.use(cookieParser());

//fix cors errors
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

//Connect to mongodb
// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//mongodb event handler
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//***********************FUNCTION FOR uploading files to S3 bucket********************

async function uploadToS3(path, originalFileName, mimetype) {
  //define client
  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFileName.split(".");
  const ext = parts[parts.length - 1];
  const newFileName = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFileName,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
}

//***********************get method test ********************
app.get("/test", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json("test is ok");
});

//********************post endpoint method*******************
app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcryptjs.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});
//app opens at localhost4000

//*****************Login endpoint************************

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcryptjs.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

//*****************profile GET endpoint************************
app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

//*****************Logout endpoint************************
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});
//
//
//*****************photo link upload endpoint************************
//this end point will help for uploading the images as url links/Library(yarn add image-downloader)
app.post("/upload-by-link", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName, //temporary directory
  });
  const url = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );
  res.json(url);
});

//*****************upload photo from device endpoint************************
//
//define upload functionality
const photosMiddleware = multer({ dest: "/tmp " });
//
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  //for loop to rename paths of photos
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

//  const parts = originalname.split(".");
//  const ext = parts[parts.length - 1];
//  const newPath = path + "." + ext; // new path equals path +
//  fs.renameSync(path, newPath);
//  uploadedFiles.push(newPath.replace("uploads/", ""));

/*****************Accomodations/places endpoint***********************
 create a new place import Place model and use create()
 find user owner id with token/jwt*/ ////if user is found create new Place */
app.post("/places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Places.create({
      owner: userData.id,
      title,
      address,
      photo: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests, //userData comes from token
    });
    res.json(placeDoc);
  });
});

/*****************endpoint to grab all places and display them***********************/
//use jwt token to grab user id
app.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies; //grab cookie token
  //decrypt it next with jwt.verify
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Places.find({ owner: id }));
  });
});

/*****************endpoint to grab all places by user id and display them***********************/

app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Places.findById(id));
});

/*****************end point for (update) put request of places ***********************/
app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
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
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Places.findById(id); //fetch place from DB
    //verify token that userData is the same as the place doc owner
    //Added .toString to changed placeDoc.owner to a string in order to be able to compare it with id string
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});
/***************** GET end point for places ***********************/

app.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  res.json(await Places.find());
});

/*****************Post end point adding/saving a booking ***********************/
app.post("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});
/*****************GET end point for showing all bookings ***********************/

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}
app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(4000);
