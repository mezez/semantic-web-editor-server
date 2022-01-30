const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categories");
const middleware = require("../helpers/middleware");

//POST create categories
router.post(
  "/category",
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
  ],
  categoryController.create
);

//GET all categories
router.get(
  "/all-categories",
  middleware.checkToken,
  categoryController.findAll
);
router.get(
  "/all-categories-paginated",
  middleware.checkToken,
  categoryController.findAllPaginated
);

//GET single categories
router.get(
  "/category/:category_id",
  middleware.checkToken,
  categoryController.findOne
);

router.post(
  "/delete-category/:category_id/",
  middleware.checkToken,
  categoryController.delete
);

module.exports = router;
