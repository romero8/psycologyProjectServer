const express = require("express");
const app = express();
const PORT = 5000;
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      email: req.body.email,
      password: hashedPassword,
      textArea: req.body.textArea,
    };
    users.push(user);
    console.log(users);
  } catch {
    res.status(500).send();
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

app.listen(PORT, () => {
  console.log("listening to port 5000.....");
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
