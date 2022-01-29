const RLabel = require("../models/rLabel");

exports.create = async (req, res, next) => {
  let data = {
    name: req.body.name,
    rprefix_id: req.body.prefix_id,
    description: req.body.description,
  };
  const newRLabel = new RLabel(data);

  try {
    let rlabel = await newRLabel.save();
    return res.status(200).json(rlabel);
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

    const labels = await RLabel.paginate({}, options);
    if (!labels) {
      const error = new Error("Labels not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      labels,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows from the database.
exports.findAll = async (req, res, next) => {
  try {
    let labels = await RLabel.find().populate("rprefix_id").sort("-createdAt");

    res.status(200).json({ labels });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let rlabel = await RLabel.findById(req.params.rlabel_id).populate(
      "rprefix_id"
    );
    if (!rlabel) {
      return res.status(404).json({
        message: "RLabel not found with id " + req.params.rlabel_id,
      });
    }
    return res.status(200).send(rlabel);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const rlabel_id = req.params.rlabel_id;
  try {
    const rlabel = await RLabel.findById(rlabel_id);
    if (!rlabel) {
      const error = new Error("RLabel not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await RLabel.findByIdAndDelete(rlabel_id);
    res.status(200).json({ message: "RLabel successfully deleted", rlabel });
  } catch (err) {
    next(err);
  }
};
