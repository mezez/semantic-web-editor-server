const RDocument = require("../models/rdocument");
const User = require("../models/user");

exports.create = async (req, res, next) => {
  let data = {
    name: req.body.name,
    users: req.body.users,
    user_id: req.body.user_id,
  };
  const newDocument = new RDocument(data);

  try {
    let savedDocument = await newDocument.save();
    return res.status(200).json(savedDocument);
  } catch (err) {
    next(err);
  }
};

exports.addOrRemoveUserInDocument = async (req, response, next) => {
  const document_id = req.params.document_id;
  const user_id = req.body.user_id;
  const other_user_id = req.body.other_user_id;
  const type = req.body.type;

  if (!document_id || !user_id || other_user_id) {
    return res.status(400).json({
      message:
        "IDs of Document, user and user to be added or removed are required",
    });
  }
  try {
    //confirm document and users are valid
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const document = await RDocument.find({ _id: document_id, user_id });
    if (!document) {
      res.status(404).json({ message: "Document not found" });
    }

    //append or remove user add
    if (type == "add") {
      document.users.push(user_id);
    } else {
      //TODO CONFIRM THAT THE USERS ARE SAVED AS JUST ARRAYS
      updatedUsers = document.users.filter(
        (userId, index) => userId != user_id
      );
      document.users = updatedUsers;
      await document.save();
    }
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

    const rdocuments = await RDocument.paginate({}, options);
    if (!rdocuments) {
      const error = new Error("Documents not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      rdocuments,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all Docs from the database.
exports.findAll = async (req, res, next) => {
  try {
    let rdocuments = await RDocument.find().sort("-createdAt");

    res.status(200).json({ rdocuments });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let rdocument = await RDocument.findById(req.params.document_id);
    if (!rdocument) {
      return res.status(404).json({
        message: "Document not found with id " + req.params.document_id,
      });
    }
    return res.status(200).send(rdocument);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const document_id = req.params.document_id;
  const user_id = req.params.user_id;
  try {
    const document = await RDocument.find({ _id: document_id, user_id });
    if (!document) {
      const error = new Error("Document not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await Episode.findByIdAndDelete(document_id);
    res.status(200).json({ message: "Document successfully deleted", episode });
  } catch (err) {
    next(err);
  }
};
