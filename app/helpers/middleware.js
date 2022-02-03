let jwt = require('jsonwebtoken');
const config = require('../../config/database');
const User = require('../models/user');

let checkToken = (req, res, next) => {
    //  console.log(req.headers);
    let token =
      req.headers["x-access-token"] ||
      req.headers["authorization"] ||
      req.headers["Authorization"] ||
      null; // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
      if (token.startsWith("Token ")) {
        // Remove Token from string
        token = token.slice(6, token.length);
      }
    } else {
      return res.status(401).send({
        message: "Token is not valid",
      });
    }
  
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          console.log(err);
  
          return res.status(401).send({
            message: "Token is not valid",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        message: "Token is not valid",
      });
    }
  };

  module.exports = {
    checkToken: checkToken
  };