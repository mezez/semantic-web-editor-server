const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments");
const middleware = require("../helpers/middleware");

//POST create comments
router.post(
  "/comment",
  [
    body("text").trim().isLength({ min: 1 }),
    body("user_id").trim().isLength({ min: 1 }),
    body("rdocument_id").trim().isLength({ min: 1 }),
  ],
  commentController.create
);

//GET all comments
router.get("/all-comments", commentController.findAll);
router.get("/all-comments-paginated", commentController.findAllPaginated);

//GET single comments
router.get("/comment/:comment_id", commentController.findOne);

router.post("/delete-comment/:comment_id/", commentController.delete);

module.exports = router;
