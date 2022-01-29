const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const RDocumentPrefixSchema = mongoose.Schema(
  {
    rdocument_id: { type: mongoose.Schema.Types.ObjectId, ref: "RDocument" },
    rprefix_id: { type: mongoose.Schema.Types.ObjectId, ref: "RPrefix" },
  },
  {
    timestamps: true,
  }
);
RDocumentPrefixSchema.pre("remove", function (next) {
  // this.model("Picture").remove({ RDocument_id: this._id }, next);
});
RDocumentPrefixSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("RDocumentPrefix", RDocumentPrefixSchema);
