const express = require("express");
const app = express();
const PORT = 5000;

const psychologiesTypes = [
  "Abnormal Psychology",
  "Biopsychology",
  "Social Psychology",
  "Cognitive Psychology",
  "Developmental Psychology",
  "Personality Psychology",
  "Forensic Psychology",
  "Industrial-Organizational Psychology",
];

const therapistTypes = [
  "Psychology",
  "Social Worker",
  "Criminologiest",
  "Creative Arts Therapist",
  "Psychodrama Therapist",
  "Bibliotherapist",
  "Occupational Therapist",
  "Speach Therapist",
  "psycho Therapist",
  "CBT Therapist",
  "DBT Therapist",
  "NLP Therapist",
  "EMDR Therapist",
  "Coacher",
  "Animal-Assisted Therapist",
  "neurofeedback",
  "psychoanaliest",
  "Psychiatrist",
  "Family Therapist",
  "Caple Therapist",
  "Dance Therapist",
];

app.get("/therapistTypes", (req, res) => {
  res.json(therapistTypes);
});

app.listen(PORT, () => {
  console.log("listening to port 5000.....");
});
