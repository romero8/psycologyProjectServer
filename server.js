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

app.get("/psychologiesTypes", (req, res) => {
  res.json(psychologiesTypes);
});

app.listen(PORT, () => {
    console.log("listening to port 5000.....");
  });
