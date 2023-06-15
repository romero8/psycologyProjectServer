const express = require("express");
const app = express();
const PORT = 5000;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dbURI =
  "mongodb+srv://shayRomero:Ilovepizza20@psychologycluster.lyxb36s.mongodb.net/psychologiesDataBase";
const User = require("./models/User");

function handleErrors(err){
console.log(err.message,err.code)
}

app.use(express.json());

let users = [];

mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(PORT, () => {
      console.log("listening to port 5000.....");
    })
  )
  .catch((err) => console.log(err));

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      textArea: req.body.textArea,
    });
    res.status(201).json(user);
    users.push(user)

    

  } catch(err) {
    handleErrors(err)
    res.status(500).send("error,user not created");
  }
});

app.post("/users/logIn", async (req, res) => {
  const user = users.find((user) => (user.email = req.body.email));
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.json("Success");
    } else {
      res.json("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

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
