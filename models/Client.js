const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
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
    
    address: {
      type: Object,
    },

    phone: {
      type: Number,
    },
   
    gender: {
      type: String,
    },

    about: {
      type: String,
    },
    favorites: {
      type:Array
    },
    
  },
  { timestamps: true }
);

clientSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

clientSchema.statics.logIn = async function (email, password) {
  const client = await this.findOne({ email });
  if (client) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return client;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const Client = mongoose.model("client", clientSchema);
module.exports = Client;
