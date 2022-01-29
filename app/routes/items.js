const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/items");
const middleware = require("../helpers/middleware");

//POST create items
router.post(
  "/item",
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
  ],
  itemController.create
);

//GET all items
router.get("/all-items", itemController.findAll);
router.get("/all-items-paginated", itemController.findAllPaginated);

//GET single items
router.get("/item/:item_id", itemController.findOne);

router.post("/delete-item/:item_id/", itemController.delete);

module.exports = router;
