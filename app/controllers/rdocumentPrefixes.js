const RDocument = require("../models/rDocument");
const RDocumentPrefix = require("../models/rDocumentPrefix");
let config = require("../../config/database.js");

exports.create = async (req, res, next) => {
  let data = {
    rprefix_id: req.body.prefix_id,
    rdocument_id: req.body.document_id,
  };
  const newDocument = new RDocumentPrefix(data);

  try {
    //prevent dulicating prefix for a single document
    let prefixExists = RDocumentPrefix.find({rprefix_id:req.body.prefix_id, rdocument_id:req.body.document_id})
    if(prefixExists){
      return res.status(400).json({message: "Prefix already exists in this document"});
    }
    let savedDocument = await newDocument.save();
    return res.status(200).json(savedDocument);
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all prefixes for a document from the database.
exports.findAllByDocumentId = async (req, res, next) => {
  const document_id = req.params.document_id;
  try {
    let rdocumentPrefixes = await RDocumentPrefix.find({
      rdocument_id: document_id,
    }).sort("-createdAt");

    res.status(200).json({ rdocumentPrefixes });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const prefix_id = req.params.prefix_id;
  try {
    const documentPrefix = await RDocumentPrefix.findById(prefix_id);
    if (!documentPrefix) {
      const error = new Error("Record not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await RDocumentPrefix.findByIdAndDelete(prefix_id);
    res
      .status(200)
      .json({ message: "Row successfully deleted", documentPrefix });
  } catch (err) {
    next(err);
  }
};
