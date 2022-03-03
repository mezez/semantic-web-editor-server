const Comment = require("../models/comment");
const RDocument = require("../models/rDocument");

exports.create = async (req, res, next) => {
  let docId = null
  let rowId = null
  if(req.body.rdocument_id){
    docId = req.body.rdocument_id
  }
  if(req.body.rdocument_row_id){
    docId = req.body.rdocument_id
  }
  let data = {
    text: req.body.text,
    rdocument_id: docId,
    rdocument_row_id: rowId,
    user_id: req.body.user_id,
  };
  const newComment = new Comment(data);

  try {
    //document should be valid
    let document = await RDocument.findById(req.body.rdocument_id);
    if (!document) {
      return res.status(404).json({ message: "Invalid document id" });
    }
    if (!document.users.includes(req.body.user_id)) {
      return res
        .status(400)
        .json({ message: "User is not a contributor to this document" });
    }
    //you need to be part of the contributors to comment
    let comment = await newComment.save();
    return res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.findAllPaginated = async (req, res, next) => {
  const pageNo = parseInt(req.query.page) || 1;
  const perPage = 10;
  if (pageNo < 0 || pageNo === 0) {
    res.status(400).send({
      message: "Invalid Page Number, should start  with 1",
    });
  }
  try {
    const options = {
      page: pageNo,
      limit: perPage,
      sort: { createdAt: -1 },
      collation: {
        locale: "en",
      },
    };

    const comments = await Comment.paginate({}, options);
    if (!comments) {
      const error = new Error("Nodes not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      comments,
    });
  } catch (err) {
    next(err);
  }
};

exports.findAllDocumentComments = async (req, res, next) => {
  document_id = req.params.document_id
  try {
    let comments = await Comment.find({"rdocument_id": document_id}).populate("user_id").sort("-createdAt");

    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.findAllDocumentRowComments = async (req, res, next) => {
  document_row_id = req.params.document_row_id
  try {
    let comments = await Comment.find({"rdocument_row_id": document_row_id}).populate("user_id").sort("-createdAt");

    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows from the database.
exports.findAll = async (req, res, next) => {
  try {
    let comments = await Comment.find().populate("user_id").sort("-createdAt");

    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.comment_id).populate(
      "user_id"
    );
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found with id " + req.params.comment_id,
      });
    }
    return res.status(200).send(comment);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  try {
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await Comment.findByIdAndDelete(comment_id);
    res.status(200).json({ message: "Comment successfully deleted", comment });
  } catch (err) {
    next(err);
  }
};
