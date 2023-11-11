const express = require("express");
const cors = require("cors");
const app = express();
// const PORT = 5000;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dbURI =
  "mongodb+srv://shayRomero:Ilovepizza20@psychologycluster.lyxb36s.mongodb.net/psychologiesDataBase";
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { requireAuth, checkUser } = require("./middleWare/authMiddleWare");
const Therapist = require("./models/Therapist");
const Client = require("./models/Client");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

require("dotenv").config();

function handleErrors(err) {
  console.log(err.message, err.code);
  if (err.code === 11000) {
    return {
      errors: { email: { message: "That Email is already registred" } },
    };
  }
  if (err.message === "incorrect email") {
    return { errors: { email: { message: "incorrect email" } } };
  }
  if (err.message === "incorrect password") {
    return { errors: { password: { message: "incorrect password" } } };
  } else {
    return err;
  }
}

const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
  return jwt.sign({ id }, "ezPsy secret", {
    expiresIn: maxAge,
  });
}
// "http://localhost:3000"


app.use(cookieParser());
app.use(
  cors({
    origin:"https://mangisite.netlify.app",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(express.json());
let users = [];

mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(process.env.PORT || 5000, () => {
      console.log("listening to port 5000.....");
    })
  )
  .catch((err) => console.log(err));

// app.get('*',checkUser)

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.json([
    { name: "shlomo", age: 22 },
    { name: "yossi", age: 32 },
  ]);
});

app.post("/userLoggedIn", async (req, res) => {
  try {
    const clientLoggedIn = await Client.findById(req.body._id);
    res.json({ status: "ok", clientLoggedIn: clientLoggedIn });
  } catch (err) {
    console.log(err);
  }
});

app.get("/allTherapists", async (req, res) => {
  try {
    const allTherapists = await Therapist.find({});
    res.send({ status: "ok", data: allTherapists });
  } catch (err) {
    console.log(err);
  }
});

app.get("/allClients", async (req, res) => {
  try {
    const allClients = await Client.find({});
    res.send({ status: "ok", data: allClients });
  } catch (err) {
    console.log(err);
  }
});

app.post("/update/client", async (req, res) => {
  try {
    const clientLoggedIn = await Client.findById(req.body.userLoggedIn._id);
    const updateData = await req.body;
    const updateClient = await Client.updateOne(
      { _id: updateData.userLoggedIn._id },
      { $set: { favorites: updateData.favoritesToUpdate } }
    );
    res.send({
      status: "ok",
      message: "User Updated",
      clientLoggedIn: clientLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/update/therapist", async (req, res) => {
  try {
    const therapistUpdated = await Therapist.findById(req.body.id);
    const updateData = await req.body;
    const updateTherapist = await Therapist.updateOne(
      { _id: updateData.id },
      {
        $set: {
          addedToFavorites: updateData.addedToFavorites,
          clientsIcalled: updateData.clientsIcalled,
        },
      }
    );
    res.send({
      status: "ok",
      message: "User Updated",
      therapistUpdated: therapistUpdated,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signUp/therapist", async (req, res) => {
  try {
    const therapist = await Therapist.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      lastName: req.body.lastName,
      profession: req.body.profession,
      experties: req.body.experties,
      address: req.body.address,
      phone: req.body.phone,
      price: req.body.price,
      gender: req.body.gender,
      language: req.body.language,
      experience: req.body.experience,
      about: req.body.about,
    });
    const token = createToken(therapist._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ therapist: therapist._id });
  } catch (err) {
    handleErrors(err);
    res.status(500).send(handleErrors(err));
  }
});

app.post("/signUp/client", async (req, res) => {
  try {
    const client = await Client.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      lastName: req.body.lastName,
      profession: req.body.profession,
      experties: req.body.experties,
      address: req.body.address,
      phone: req.body.phone,
      price: req.body.price,
      gender: req.body.gender,
      language: req.body.language,
      experience: req.body.experience,
      about: req.body.about,
    });
    const token = createToken(client._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ client: client._id });
  } catch (err) {
    handleErrors(err);
    res.status(500).send(handleErrors(err));
  }
});

app.post("/logIn", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = (await Therapist.logIn(email, password))
      ? await Therapist.logIn(email, password)
      : await Client.logIn(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.cookie();
    res
      .status(200)
      .json(
        user.profession
          ? { therapist: user, token: token }
          : { client: user, token: token }
      );
  } catch (err) {
    res.status(400).send(handleErrors(err));
  }
});

// ap
