const Category = require("../models/category");

exports.create = async (req, res, next) => {
  let data = {
    name: req.body.name,
    description: req.body.description,
  };
  const newCategory = new Category(data);

  try {
    let category = await newCategory.save();
    return res.status(200).json(category);
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

    const categories = await Category.paginate({}, options);
    if (!categories) {
      const error = new Error("Categories not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      categories,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all rows from the database.
exports.findAll = async (req, res, next) => {
  try {
    let categories = await Category.find().sort("-createdAt");

    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.category_id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found with id " + req.params.category_id,
      });
    }
    return res.status(200).send(category);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const category_id = req.params.category_id;
  try {
    const category = await Category.findById(category_id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await Category.findByIdAndDelete(category_id);
    res
      .status(200)
      .json({ message: "Category successfully deleted", category });
  } catch (err) {
    next(err);
  }
};
