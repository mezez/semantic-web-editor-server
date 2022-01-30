const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const RDocumentRowSchema = mongoose.Schema(
  {
    rdocument_id: { type: mongoose.Schema.Types.ObjectId, ref: "RDocument" },
    row_data: {
      first_column: { type: String },

      second_column: { type: String },

      third_column: { type: String },
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
module.exports =
  mongoose.models.RDocumentRow ||
  mongoose.model("RDocumentRow", RDocumentRowSchema);
