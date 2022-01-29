const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rnodeController = require("../controllers/rNodes");
const middleware = require("../helpers/middleware");

//POST create rnodes
router.post(
  "/rnode",
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
    body("prefix_id").trim().isLength({ min: 1 }),
  ],
  rnodeController.create
);

//GET all rnodes
router.get("/all-rnodes", rnodeController.findAll);
router.get("/all-rnodes-paginated", rnodeController.findAllPaginated);

//GET single rnodes
router.get("/rnode/:rnode_id", rnodeController.findOne);

router.post("/delete-rnode/:rnode_id/", rnodeController.delete);

module.exports = router;
