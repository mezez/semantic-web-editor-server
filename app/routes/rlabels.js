const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rlabelController = require("../controllers/rLabels");
const middleware = require("../helpers/middleware");

//POST create rlabels
router.post(
  "/rlabel",
  middleware.checkToken,
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
    body("prefix_id").trim().isLength({ min: 1 }),
  ],
  rlabelController.create
);

//GET all rlabels
router.get("/all-rlabels", middleware.checkToken, rlabelController.findAll);
router.get(
  "/all-rlabels-paginated",
  middleware.checkToken,
  rlabelController.findAllPaginated
);

//GET single rlabels
router.get(
  "/rlabel/:rlabel_id",
  middleware.checkToken,
  rlabelController.findOne
);

router.post(
  "/delete-rlabel/:rlabel_id/",
  middleware.checkToken,
  rlabelController.delete
);

module.exports = router;
