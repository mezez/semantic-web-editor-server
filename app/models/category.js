const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CategorySchema = mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
  // { toJSON: { virtuals: true } }
);

// CategorySchema.virtual("products", {
//   ref: "Product", // The model to use
//   localField: "name", // Your local field, like a `FOREIGN KEY` in RDS
//   foreignField: "category_name", // Your foreign field which `localField` linked to. Like `REFERENCES` in RDS
//   // If `justOne` is true, 'members' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   justOne: false,
// });

CategorySchema.pre("remove", function (next) {
  this.model("RDocumentRow").remove({ category_id: this._id }, next);
});
CategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Category", CategorySchema);
