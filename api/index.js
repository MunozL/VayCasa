require("dotenv").config();
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");
const app = express();

const bcryptSalt = bcryptjs.genSaltSync(10); // bcryptSalt defined
const jwtSecret = "randomstring";

app.use(express.json()); //This allows to parse info into json

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

//get method
app.get("/test", (req, res) => {
  res.json("test ok");
});

//post method
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      //create a User object
      name,
      email,
      password: bcryptjs.hashSync(password, bcryptSalt), //bcryptjs helps with password encription// define (bcryptSalt) at the top
    });
    res.json({ userDoc });
  } catch (e) {
    res.status(422).json(e);
  }
});
//app opens at localhost4000

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //find user with given email by using model
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    //check that password is ok
    const passwordOk = bcryptjs.compareSync(password, userDoc.password);
    if (passwordOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json("Password matched");
        }
      );
    } else {
      res.status(422).json("Password does not match");
    }
  } else {
    res.json("Not found");
  }
});

app.listen(4000);
