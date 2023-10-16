const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Client = require("./Client");
const Schema = mongoose.Schema;

const therapistSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please Enter An Email"],
      unique: true,
      lowerCase: true,
      validate: [isEmail, "Please Enter A Valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter A Password"],
      minlength: [6, "Minimum Password Length Is 6"],
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    experties: {
      type: Array,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    phone: {
      type: Number,
    },
    price: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    language: {
      type: Array,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    addedToFavorites:{
      type: Array,
    },
    clientsIcalled:{
      type:Array
    }
  },
  { timestamps: true }
);

therapistSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

therapistSchema.statics.logIn = async function (email, password) {
  const therapist = await this.findOne({ email });
  const client = await Client.findOne({ email });

  if (therapist) {
    const auth = await bcrypt.compare(password, therapist.password);
    if (auth) {
      return therapist;
    }
    throw Error("incorrect password");
  }

  if (client) {
    const auth = await bcrypt.compare(password, client.password);
    if (auth) {
      return client;
    }
    throw Error("incorrect password");
  }
  
  throw Error("incorrect email")
};

const Therapist = mongoose.model("therapist", therapistSchema);
module.exports = Therapist;
