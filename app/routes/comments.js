const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments");
const middleware = require("../helpers/middleware");

//POST create comments
router.post(
  "/comment",
  middleware.checkToken,
  [
    body("text").trim().isLength({ min: 1 }),
    body("user_id").trim().isLength({ min: 1 })
  ],
  commentController.create
);

router.get("/all-document-comments/:document_id", middleware.checkToken, commentController.findAllDocumentComments);
router.get("/all-document-row-comments/:document_row_id", middleware.checkToken, commentController.findAllDocumentRowComments);
//GET all comments
router.get("/all-comments", middleware.checkToken, commentController.findAll);
router.get("/all-comments-paginated", commentController.findAllPaginated);

//GET single comments
router.get(
  "/comment/:comment_id",
  middleware.checkToken,
  commentController.findOne
);

router.post(
  "/delete-comment/:comment_id/",
  middleware.checkToken,
  commentController.delete
);

module.exports = router;
