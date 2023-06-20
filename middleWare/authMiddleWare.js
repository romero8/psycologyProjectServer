const jwt = require("jsonwebtoken");
const User = require('../models/User')

function requireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "ezPsy secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/");
  }
}

function checkUser(){
    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, "ezPsy secret", async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          console.log(decodedToken);
          let user = User.findById(decodedToken.id)
          res.locals.user = user
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
    }



module.exports = { requireAuth , checkUser };
