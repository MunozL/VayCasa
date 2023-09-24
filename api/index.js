require("dotenv").config();
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const app = express();

const bcryptSalt = bcryptjs.genSaltSync(10); // bcryptSalt defined
const jwtSecret = "randomstring";

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
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//mongodb event handler
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//***********************get method test ********************
app.get("/test", (req, res) => {
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

//*****************profile endpoint************************
app.get("/profile", (req, res) => {
  //mongoose.connect(process.env.MONGO_URL);
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
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName, //dirname(directory path name) then add to uploads directory
  });
  res.json(newName);
});

//*****************upload photo from device endpoint************************
//
//define upload functionality
const photosMiddleware = multer({ dest: "api/uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  //for loop to rename paths of photos
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext; // new path equals path +
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

app.listen(4000);
