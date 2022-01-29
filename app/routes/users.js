const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const middleware = require("../helpers/middleware");

const userController = require("../controllers/users");

//create new user
router.post(
  "/signup",
  [
    body("first_name").trim().isLength({ min: 1 }),
    body("last_name").trim().isLength({ min: 1 }),
    body("email").trim().isLength({ min: 4 }),
    body("password").trim().isLength({ min: 4 }),
  ],
  userController.create
);

//create new user
router.post(
  "/login",
  [
    body("email").trim().isLength({ min: 4 }),
    body("password").trim().isLength({ min: 4 }),
  ],
  userController.login
);

//get all users
router.get("/index", userController.findAllPaginated);

//get single user
router.get("/:user_id", userController.findOne);

module.exports = router;
