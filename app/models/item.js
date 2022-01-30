const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ItemSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
ItemSchema.plugin(mongoosePaginate);
module.exports = mongoose.models.Item || mongoose.model("Item", ItemSchema);
