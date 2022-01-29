const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rdocumentRowController = require("../controllers/rdocumentRows");
const middleware = require("../helpers/middleware");

//POST create rdocuments
router.post(
  "/document-row",
  [
    body("document_id").trim().isLength({ min: 1 }),
    body("category_id").trim().isLength({ min: 1 }),
    body("first_column").trim().isLength({ min: 1 }),
    body("second_column").trim().isLength({ min: 1 }),
    body("third_column").trim().isLength({ min: 1 }),
  ],
  rdocumentRowController.create
);

//GET all rdocuments
router.get(
  "/all-document-rows:document_id",
  rdocumentRowController.findAllByDocumentId
);
router.get("/all-documents-rows", rdocumentRowController.findAll);
router.get(
  "/all-documents-rows-paginated",
  rdocumentRowController.findAllPaginated
);

//GET single rdocument
router.get("/document-row/:document_row_id", rdocumentRowController.findOne);

router.post(
  "/delete-document-row/:document_row_id/",
  rdocumentRowController.delete
);

module.exports = router;
