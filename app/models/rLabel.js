const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RLabelSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    rprefix_id: { type: mongoose.Schema.Types.ObjectId, ref: "RPrefix" },
    label_type: {
      type: String,
      required: true,
      default: "generic",
      enum: ["generic", "none_generic"],
    },
  },
  {
    timestamps: true,
  }
);
RLabelSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("RLabel", RLabelSchema);
