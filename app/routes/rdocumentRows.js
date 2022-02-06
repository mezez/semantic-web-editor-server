const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rdocumentRowController = require("../controllers/rdocumentRows");
const middleware = require("../helpers/middleware");

//POST create rdocuments
router.post(
  "/document-row",
  middleware.checkToken,
  [
    body("document_id").trim().isLength({ min: 1 }),
    body("category_id").trim().isLength({ min: 1 }),
    body("first_column").trim().isLength({ min: 1 }),
    body("second_column").trim().isLength({ min: 1 }),
    body("third_column").trim().isLength({ min: 1 }),
  ],
  rdocumentRowController.create
);

//GET all triples rdocumentrows by document id
router.get(
  "/all-triple-document-rows/:document_id",
  middleware.checkToken,
  rdocumentRowController.findAllTriplesByDocumentId
);

//GET all properties and concepts rdocumentrows by document id
router.get(
  "/all-properties-and-concepts-document-rows/:document_id",
  middleware.checkToken,
  rdocumentRowController.findAllPropertiesAndConceptsByDocumentId
);


//GET all rdocumentrows by document id
router.get(
  "/all-document-rows/:document_id",
  middleware.checkToken,
  rdocumentRowController.findAllByDocumentId
);
router.get(
  "/all-documents-rows",
  middleware.checkToken,
  rdocumentRowController.findAll
);
router.get(
  "/all-documents-rows-paginated",
  middleware.checkToken,
  rdocumentRowController.findAllPaginated
);

//GET single rdocument
router.get(
  "/document-row/:document_row_id",
  middleware.checkToken,
  rdocumentRowController.findOne
);

router.post(
  "/delete-document-row/:document_row_id/",
  middleware.checkToken,
  rdocumentRowController.delete
);

module.exports = router;
