const RDocument = require("../models/rDocument");
const Category = require("../models/category");
const RDocumentRow = require("../models/rDocumentRow");
const RNode = require("../models/rNode");
const RLabel = require("../models/rLabel");
const Item = require("../models/item");

exports.create = async (req, res, next) => {
  first_column = req.body.first_column;
  second_column = req.body.second_column;
  third_column = req.body.third_column;

  let data = {
    rdocument_id: req.body.document_id,
    category_id: req.body.category_id,
    row_data: {
      first_column,
      second_column,
      third_column,
    },
  };

  const newDocument = new RDocumentRow(data);

  try {
    let savedDocument = await newDocument.save();
    return res.status(200).json(savedDocument);
  } catch (err) {
    next(err);
  }
};

exports.findAllPropertiesAndConceptsByDocumentId = async (req, res, next) => {
  const document_id = req.params.document_id;
  
  try {
    let conceptAndPropertyCategory = await Category.find({name: "Concept/Property"});
    if (!conceptAndPropertyCategory) {
      return res.status(404).json({message: "triplet category not found"})
    }

    

    let rdocumentRows = await RDocumentRow.find({
      rdocument_id: document_id,
      category_id: conceptAndPropertyCategory[0]._id,
    })
      .populate("category_id")
      .sort("-createdAt");

    // console.log(rdocumentRows);
    //loop through the data, get the names(node, label or item) of the row data based on the category

    const documentRowLength = rdocumentRows.length;
    let finalDocumentRows = [];
    let updatedDocumentRow;
    for (let i = 0; i < documentRowLength; i++) {
      if (rdocumentRows[i].category_id.name == "Triple") {
        const firstNode = await RNode.find({
          _id: rdocumentRows[i].row_data.first_column,
        });

        const secondNode = await RNode.find({
          _id: rdocumentRows[i].row_data.second_column,
        });

        const thirdNode = await RNode.find({
          _id: rdocumentRows[i].row_data.third_column,
        });

        updatedDocumentRow = {
          ...rdocumentRows[i]._doc,
          firstNode,
          secondNode,
          thirdNode,
        };
      } else {
        //concept or property
        const rNode = await RNode.find({
          _id: rdocumentRows[i].row_data.first_column,
        }).populate("rprefix_id");

        const rLabel = await RLabel.find({
          _id: rdocumentRows[i].row_data.second_column,
        }).populate("rprefix_id");

        const item = await Item.find({
          _id: rdocumentRows[i].row_data.third_column,
        });

        updatedDocumentRow = {
          ...rdocumentRows[i]._doc,
          rNode,
          rLabel,
          item,
        };
      }

      finalDocumentRows.push(updatedDocumentRow);
    }

    // console.log(finalDocumentRows);

    res.status(200).json({ rdocumentRows: finalDocumentRows });
  } catch (err) {
    next(err);
  }
};

exports.findAllTriplesByDocumentId = async (req, res, next) => {
  const document_id = req.params.document_id;
  
  try {
    let triplesCategory = await Category.find({name: "Triple"});
    if (!triplesCategory) {
      return res.status(404).json({message: "properties and concept category not found"})
    }

    

    let rdocumentRows = await RDocumentRow.find({
      rdocument_id: document_id,
      category_id: triplesCategory[0]._id,
    })
      .populate("category_id")
      .sort("-createdAt");

    // console.log(rdocumentRows);
    //loop through the data, get the names(node, label or item) of the row data based on the category

    const documentRowLength = rdocumentRows.length;
    let finalDocumentRows = [];
    let updatedDocumentRow;
    for (let i = 0; i < documentRowLength; i++) {
      if (rdocumentRows[i].category_id.name == "Triple") {
        const firstNode = await RNode.find({
          _id: rdocumentRows[i].row_data.first_column,
        });

        const secondNode = await RNode.find({
          _id: rdocumentRows[i].row_data.second_column,
        });

        const thirdNode = await RNode.find({
          _id: rdocumentRows[i].row_data.third_column,
        });

        updatedDocumentRow = {
          ...rdocumentRows[i]._doc,
          firstNode,
          secondNode,
          thirdNode,
        };
      } else {
        //concept or property
        const rNode = await RNode.find({
          _id: rdocumentRows[i].row_data.first_column,
        }).populate("rprefix_id");

        const rLabel = await RLabel.find({
          _id: rdocumentRows[i].row_data.second_column,
        }).populate("rprefix_id");

        const item = await Item.find({
          _id: rdocumentRows[i].row_data.third_column,
        });

        updatedDocumentRow = {
          ...rdocumentRows[i]._doc,
          rNode,
          rLabel,
          item,
        };
      }

      finalDocumentRows.push(updatedDocumentRow);
    }

    // console.log(finalDocumentRows);

    res.status(200).json({ rdocumentRows: finalDocumentRows });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows for a document from the database.
exports.findAllByDocumentId = async (req, res, next) => {
  const document_id = req.params.document_id;
  try {
    let rdocumentRows = await RDocumentRow.find({
      rdocument_id: document_id,
    })
      .populate("category_id")
      .sort("-createdAt");

    // console.log(rdocumentRows);
    //loop through the data, get the names(node, label or item) of the row data based on the category

    const documentRowLength = rdocumentRows.length;
    let finalDocumentRows = [];
    let updatedDocumentRow;
    for (let i = 0; i < documentRowLength; i++) {
      if (rdocumentRows[i].category_id.name == "Triple") {
        const firstNode = await RNode.find({
          _id: rdocumentRows[i].row_data.first_column,
        });

        const secondNode = await RNode.find({
          _id: rdocumentRows[i].row_data.second_column,
        });

        const thirdNode = await RNode.find({
          _id: rdocumentRows[i].row_data.third_column,
        });

        updatedDocumentRow = {
          ...rdocumentRows[i]._doc,
          firstNode,
          secondNode,
          thirdNode,
        };
      } else {
        //concept or property
        const rNode = await RNode.find({
          _id: rdocumentRows[i].row_data.first_column,
        }).populate("rprefix_id");

        const rLabel = await RLabel.find({
          _id: rdocumentRows[i].row_data.second_column,
        }).populate("rprefix_id");

        const item = await Item.find({
          _id: rdocumentRows[i].row_data.third_column,
        });

        updatedDocumentRow = {
          ...rdocumentRows[i]._doc,
          rNode,
          rLabel,
          item,
        };
      }

      finalDocumentRows.push(updatedDocumentRow);
    }

    // console.log(finalDocumentRows);

    res.status(200).json({ rdocumentRows: finalDocumentRows });
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

    const rdocumentRows = await RDocumentRow.paginate({}, options);
    if (!rdocumentRows) {
      const error = new Error("Documents not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      rdocumentRows,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows from the database.
exports.findAll = async (req, res, next) => {
  try {
    let rdocumentRows = await RDocumentRow.find().sort("-createdAt");

    res.status(200).json({ rdocumentRows });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let rdocumentRow = await RDocumentRow.findById(req.params.document_row_id);
    if (!rdocumentRow) {
      return res.status(404).json({
        message: "Row not found with id " + req.params.document_row_id,
      });
    }
    return res.status(200).send(rdocumentRow);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const document_row_id = req.params.document_row_id;
  try {
    const documentRow = await RDocumentRow.findById(document_row_id);
    if (!documentRow) {
      const error = new Error("Row not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await RDocumentRow.findByIdAndDelete(document_row_id);
    res.status(200).json({ message: "Row successfully deleted", documentRow });
  } catch (err) {
    next(err);
  }
};
