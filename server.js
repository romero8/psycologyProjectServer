const express = require("express");
const cors = require('cors')
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

require("dotenv").config()

function handleErrors(err) {
  console.log(err.message, err.code);
}

const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
  return jwt.sign({ id }, "ezPsy secret", {
    expiresIn: maxAge,
  });
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

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

app.get('/',(req,res)=>{
  res.setHeader("Access-Control-Allow-Credentials","true");
  res.json([{name:"shlomo",age:22},{name:"yossi",age:32},])
})

app.get("/userLoggedIn", (req, res) => {
  const userId = req.body
  console.log(userId)
  // User.findById(req.params.userId)
  // .then(doc=>{
  //   if(!doc){
  //     return res.status(404).end()
  //   }
  //   else{
  //     return res.status(200).json(doc)
  //   }
  // })
  // .catch(err=>next(err))
});

app.post("/signUp", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
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
      LGBTQ: req.body.LGBTQ,
      about: req.body.about,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    handleErrors(err);
    res.status(500).send(err);
  }
});

app.post("/logIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.logIn(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user, token: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

// app.post("/logIn", async (req, res) => {
//   const user = users.find((user) => (user.email = req.body.email));
//   if (user == null) {
//     return res.status(400).send("Cannot find user");
//   }
//   try {
//     if (await bcrypt.compare(req.body.password, user.password)) {
//       res.json("Success");
//     } else {
//       res.json("Not Allowed");
//     }
//   } catch {
//     res.status(500).send();
//   }
// });

// const psychologiesTypes = [
//   //   "Abnormal Psychology",
//   //   "Biopsychology",
//   //   "Social Psychology",
//   //   "Cognitive Psychology",
//   //   "Developmental Psychology",
//   //   "Personality Psychology",
//   //   "Forensic Psychology",
//   //   "Industrial-Organizational Psychology",
//   // ];

// const therapistTypes = [
//   "Psychology",
//   "Social Worker",
//   "Criminologiest",
//   "Creative Arts Therapist",
//   "Psychodrama Therapist",
//   "Bibliotherapist",
//   "Occupational Therapist",
//   "Speach Therapist",
//   "psycho Therapist",
//   "CBT Therapist",
//   "DBT Therapist",
//   "NLP Therapist",
//   "EMDR Therapist",
//   "Coacher",
//   "Animal-Assisted Therapist",
//   "neurofeedback",
//   "psychoanaliest",
//   "Psychiatrist",
//   "Family Therapist",
//   "Caple Therapist",
//   "Dance Therapist",
// ];

// app.get("/therapistTypes", (req, res) => {
//   res.json(therapistTypes);
// });

// app.get("/addUSer", (req, res) => {
//   const user = new User({
//     title: 'newBloggggggggg',
//     snipped:'about my new Blogggggg',
//     body: ' more About my new blog'
//   })
//   user.save()
//   .then((result) => res.send(result))
//   .catch((err)=> console.log(err))
// });

// app.get("/allUsers", (req, res) => {

//   User.find()
//   .then((result) => res.send(result))
//   .catch((err)=> console.log(err))
// });
