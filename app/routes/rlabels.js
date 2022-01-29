const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rlabelController = require("../controllers/rLabels");
const middleware = require("../helpers/middleware");

//POST create rlabels
router.post(
  "/rlabel",
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
    body("prefix_id").trim().isLength({ min: 1 }),
  ],
  rlabelController.create
);

//GET all rlabels
router.get("/all-rlabels", rlabelController.findAll);
router.get("/all-rlabels-paginated", rlabelController.findAllPaginated);

//GET single rlabels
router.get("/rlabel/:rlabel_id", rlabelController.findOne);

router.post("/delete-rlabel/:rlabel_id/", rlabelController.delete);

module.exports = router;
