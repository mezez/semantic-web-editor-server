const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const RDocumentRowSchema = mongoose.Schema(
  {
    rdocument_id: { type: mongoose.Schema.Types.ObjectId, ref: "RDocument" },
    row_data: {
      first_column: { type: Number },

      second_column: { type: Number },

      third_column: { type: Number },
    },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);
RDocumentRowSchema.pre("remove", function (next) {
  // this.model("Picture").remove({ RDocument_id: this._id }, next);
});
RDocumentRowSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("RDocumentRow", RDocumentRowSchema);
