// const Captcha = require("node-captcha-generator");
let jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const Setting = require("../models/setting");
let config = require("../../config/database.js");
let configenv = require("../../config/config-env");
let middleware = require("../helpers/middleware");
let mailHelper = require("../helpers/email");
var pass = config.email_pass;
var email = config.email;

//signup
exports.create = async (req, res, next) => {
  let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let passwordReg = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  if (!req.body.email || !emailReg.test(req.body.email)) {
    return res.status(400).send({
      message: "Email field can not be empty and must be a valid email address",
    });
  }

  User.find({ email: req.body.email }, (err, docs) => {
    if (docs.length) {
      return res.status(409).json({
        message: "Email already exists",
      });
    } else {
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      });

      //save to db
      user
        .save()
        .then((data) => {
          let token = jwt.sign(
            { userId: data._id, email: req.body.email },
            config.secret
          );

          res.json({
            data: data,
            token: token,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while saving the User.",
          });
        });
    }
  });
};

exports.login = async (req, res, next) => {
  let regg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (
    !req.body.password ||
    req.body.password < 4 ||
    !req.body.email ||
    regg.test(req.body.email) === false
  ) {
    return res.status(400).send({
      message: "Invalid Credentials",
    });
  }

  User.findOne({ email: req.body.email }, (err, docs) => {
    if (docs) {
      docs.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          const error = new Error("Password is incorrect");
          error.statusCode = 401;
          next(error);
        }

        if (isMatch) {
          let token = jwt.sign(
            {
              userId: docs._id.toString(),
              email: req.body.email,
            },
            config.secret,
            {
              expiresIn: "100 days", // expires in 100 days
            }
          );
          // return the JWT token for the future API calls
          // console.log(docs);

          res.json({
            success: true,
            message: "Authentication successful!",
            token: token,
            data: docs,
          });
        } else {
          return res.status(400).json({
            message: "Invalid Credentials",
          });
        }
      });
    } else {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
  });
};

exports.findAllPaginated = async (req, res, next) => {
  const pageNo = parseInt(req.query.page) || 1;
  const perPage = 10;
  if (pageNo < 0 || pageNo === 0) {
    res.status(400).send({
      message: "Invalid Page Number, should start  with 1",
    });
  }
  try {
    const options = {
      page: pageNo,
      limit: perPage,
      sort: { createdAt: -1 },
      collation: {
        locale: "en",
      },
    };

    const users = await User.paginate({}, options);
    if (!users) {
      const error = new Error("Users not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      users,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Retrieve and return all users from the database.
exports.findAll = async (req, res, next) => {
  try {
    let users = await User.find()
      .sort("-createdAt")
      .populate("country_id")
      .populate("state_id");

    res.status(200).json({ users });
  } catch (err) {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
    // res.status(500).send({
    //   message:
    //     err.message || "Some error occurred while retrieving the users.",
    // });
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found with id " + req.params.user_id,
      });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
