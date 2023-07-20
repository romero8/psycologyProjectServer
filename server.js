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

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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

app.get("/userLoggedIn", (req, res) => {
  const userId = req.body;
  console.log(userId);
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

app.get("/allTherapists", async (req, res) => {
 try{
  const allTherapists = await Therapist.find({})
  res.send({status:"ok",data:allTherapists})
 } catch(err){
  console.log(err)
 }
});

app.post("/update/client", async (req, res) => {
 try{
  const updateData = await req.body
  const updateClient = await Client.updateOne({_id:updateData.userLoggedIn._id},{$set:{favorites:updateData.userToAdd}})
  res.send({status:"ok",message:'User Updated',updateClient:updateClient})
 } catch(err){
  console.log(err)
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
    const user = await Therapist.logIn(email, password) ? await Therapist.logIn(email, password) : await Client.logIn(email,password);   
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.cookie();
    res.status(200).json(user.profession ? {therapist:user,token:token} :{client:user,token:token} );
  } catch (err) {
    res.status(400).send(handleErrors(err));
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
