const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
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
    LGBTQ: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.logIn = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
