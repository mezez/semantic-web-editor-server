const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rdocumentPrefixController = require("../controllers/rdocumentPrefixes");
const middleware = require("../helpers/middleware");

//POST create rdocuments
router.post(
  "/document-prefix",
  [
    body("prefix_id").trim().isLength({ min: 1 }),
    body("document_id").trim().isLength({ min: 1 }),
  ],
  rdocumentPrefixController.create
);

//GET all rdocuments by doc id
router.get(
  "/all-document-prefixes/:document_id",
  rdocumentPrefixController.findAllByDocumentId
);

router.post(
  "/delete-document-prefix/:document_prefix_id/",
  rdocumentPrefixController.delete
);

module.exports = router;
