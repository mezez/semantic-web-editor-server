const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const CommentSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    rdocument_id: { type: mongoose.Schema.Types.ObjectId, ref: "RDocument" },
    rdocument_row_id: { type: mongoose.Schema.Types.ObjectId, ref: "RDocumentRow" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
CommentSchema.pre("remove", function (next) {
  // this.model("Picture").remove({ RDocument_id: this._id }, next);
});
CommentSchema.plugin(mongoosePaginate);
module.exports =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
