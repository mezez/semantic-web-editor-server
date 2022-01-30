const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rprefixController = require("../controllers/rPrefixes");
const middleware = require("../helpers/middleware");

//POST create rprefixs
router.post(
  "/rprefix",
  middleware.checkToken,
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
    body("url").trim().isLength({ min: 1 }),
  ],
  rprefixController.create
);

//GET all rprefixs
router.get("/all-rprefixes", middleware.checkToken, rprefixController.findAll);
router.get(
  "/all-rprefixes-paginated",
  middleware.checkToken,
  rprefixController.findAllPaginated
);

//GET single rprefixs
router.get(
  "/rprefix/:prefix_id",
  middleware.checkToken,
  rprefixController.findOne
);

router.post(
  "/delete-prefix/:prefix_id/",
  middleware.checkToken,
  rprefixController.delete
);

module.exports = router;
