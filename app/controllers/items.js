const Item = require("../models/item");

exports.create = async (req, res, next) => {
  let data = {
    name: req.body.name,
    description: req.body.description,
  };
  const newItem = new Item(data);

  try {
    let item = await newItem.save();
    return res.status(200).json(item);
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

    const items = await Item.paginate({}, options);
    if (!items) {
      const error = new Error("Nodes not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      items,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows from the database.
exports.findAll = async (req, res, next) => {
  try {
    let items = await Item.find().sort("-createdAt");

    res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.item_id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found with id " + req.params.item_id,
      });
    }
    return res.status(200).send(item);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const item_id = req.params.item_id;
  try {
    const item = await Item.findById(item_id);
    if (!item) {
      const error = new Error("Item not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await Item.findByIdAndDelete(item_id);
    res.status(200).json({ message: "Item successfully deleted", item });
  } catch (err) {
    next(err);
  }
};
