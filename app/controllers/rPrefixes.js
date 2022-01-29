const RPrefix = require("../models/rPrefix");

exports.create = async (req, res, next) => {
  let data = {
    name: req.body.name,
    url: req.body.url,
    description: req.body.description,
  };
  const newPrefix = new RPrefix(data);

  try {
    let savedDocument = await newPrefix.save();
    return res.status(200).json(savedDocument);
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

    const prefixes = await RPrefix.paginate({}, options);
    if (!prefixes) {
      const error = new Error("Prefixes not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      prefixes,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows from the database.
exports.findAll = async (req, res, next) => {
  try {
    let prefixes = await RPrefix.find().sort("-createdAt");

    res.status(200).json({ prefixes });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let prefix = await RPrefix.findById(req.params.prefix_id);
    if (!rdocumentRow) {
      return res.status(404).json({
        message: "Prefix not found with id " + req.params.prefix_id,
      });
    }
    return res.status(200).send(prefix);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const prefix_id = req.params.prefix_id;
  try {
    const prefix = await RPrefix.findById(prefix_id);
    if (!prefix) {
      const error = new Error("Prefix not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await RPrefix.findByIdAndDelete(prefix_id);
    res.status(200).json({ message: "Prefix successfully deleted", prefix });
  } catch (err) {
    next(err);
  }
};
