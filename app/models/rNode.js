const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RNodeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rprefix_id: { type: mongoose.Schema.Types.ObjectId, ref: "RPrefix" },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
RNodeSchema.plugin(mongoosePaginate);
module.exports = mongoose.models.RNode || mongoose.model("RNode", RNodeSchema);
