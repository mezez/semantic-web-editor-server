const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rnodeController = require("../controllers/rNodes");
const middleware = require("../helpers/middleware");

//POST create rnodes
router.post(
  "/rnode",
  middleware.checkToken,
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
    body("prefix_id").trim().isLength({ min: 1 }),
  ],
  rnodeController.create
);

//GET all rnodes
router.get("/all-rnodes", middleware.checkToken, rnodeController.findAll);
router.get(
  "/all-rnodes-paginated",
  middleware.checkToken,
  rnodeController.findAllPaginated
);

//GET single rnodes
router.get("/rnode/:rnode_id", middleware.checkToken, rnodeController.findOne);

router.post(
  "/delete-rnode/:rnode_id/",
  middleware.checkToken,
  rnodeController.delete
);

module.exports = router;
