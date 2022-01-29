const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RPrefixSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

RPrefixSchema.pre("remove", function (next) {
  this.model("RDocumentPrefix").remove({ rprefix_id: this._id }, next);
  this.model("RNode").remove({ rprefix_id: this._id }, next);
});

RPrefixSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("RPrefix", RPrefixSchema);
