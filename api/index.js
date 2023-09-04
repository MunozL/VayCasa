require("dotenv").config();
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const app = express();

const bcryptSalt = bcryptjs.genSaltSync(10); // bcryptSalt defined
const jwtSecret = "randomstring";

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

app.get("/api/profile", (req, res) => {
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

app.listen(4000);
