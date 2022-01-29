const RNode = require("../models/rNode");

exports.create = async (req, res, next) => {
  let data = {
    name: req.body.name,
    rprefix_id: req.body.prefix_id,
    description: req.body.description,
  };
  const newRNode = new RNode(data);

  try {
    let rnode = await newRNode.save();
    return res.status(200).json(rnode);
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

    const rnodes = await RNode.paginate({}, options);
    if (!rnodes) {
      const error = new Error("Nodes not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      rnodes,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows from the database.
exports.findAll = async (req, res, next) => {
  try {
    let rnodes = await RNode.find().populate("rprefix_id").sort("-createdAt");

    res.status(200).json({ rnodes });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let rnode = await RNode.findById(req.params.rnode_id).populate(
      "rprefix_id"
    );
    if (!rnode) {
      return res.status(404).json({
        message: "RNode not found with id " + req.params.rnode_id,
      });
    }
    return res.status(200).send(rnode);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const rnode_id = req.params.rnode_id;
  try {
    const rnode = await RNode.findById(rnode_id);
    if (!rnode) {
      const error = new Error("RNode not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await RNode.findByIdAndDelete(rnode_id);
    res.status(200).json({ message: "RNode successfully deleted", rnode });
  } catch (err) {
    next(err);
  }
};
