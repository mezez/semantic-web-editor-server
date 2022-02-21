const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const rdocumentController = require("../controllers/rdocuments");
const middleware = require("../helpers/middleware");

//POST create rdocuments
router.post(
  "/document",
  middleware.checkToken,
  [
    body("name").trim().isLength({ min: 1 }),
    body("user_id").trim().isLength({ min: 1 }),
    body("users").trim().isArray(),
  ],
  rdocumentController.create
);

//invite user to document
router.post(
  "/document-users/invite",
  middleware.checkToken,
  [
    body("user_id").trim().isLength({ min: 1 }),
    body("invited_user_id").trim().isLength({ min: 1 }),
    body("invited_user_email").trim().isLength({ min: 1 }),
    body("document_id").trim().isLength({ min: 1 }),
    body("redirect_url").trim().isLength({ min: 1 })
  ],
  rdocumentController.sendInviteToDocument
);

router.post(
  "/document-users/join",
  [
    body("user_id").trim().isLength({ min: 1 }),
    body("invited_user_id").trim().isLength({ min: 1 }),
    body("invited_user_email").trim().isLength({ min: 1 }),
    body("document_id").trim().isLength({ min: 1 }),
    body("redirect_url").trim().isLength({ min: 1 }),
    body("type").trim().isLength({ min: 1 }),
  ],
  rdocumentController.processJoin
);

//add or remove user from document
router.post(
  "/document-users/:document_id",
  middleware.checkToken,
  [
    body("user_id").trim().isLength({ min: 1 }),
    body("other_user_id").trim().isLength({ min: 1 }),
    body("type").trim().isLength({ min: 1 }),
  ],
  rdocumentController.addOrRemoveUserInDocument
);

//GET all rdocuments
router.get(
  "/all-documents",
  middleware.checkToken,
  rdocumentController.findAll
);
router.get("/all-documents-paginated", rdocumentController.findAllPaginated);

router.get("/my-documents/:user_id", middleware.checkToken, rdocumentController.findMyDocuments);

//GET single rdocument
router.get(
  "/document/:document_id",
  middleware.checkToken,
  rdocumentController.findOne
);

router.post(
  "/delete-document/:document_id/:user_id",
  middleware.checkToken,
  rdocumentController.delete
);

module.exports = router;
