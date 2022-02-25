const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const RDocumentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    number_records: { type: Number, required: false, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true }],
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
RDocumentSchema.pre("remove", function (next) {
  this.model("Comment").remove({ rdocument_id: this._id }, next);
  this.model("RDocumentRow").remove({ rdocument_id: this._id }, next);
});
RDocumentSchema.plugin(mongoosePaginate);
module.exports =
  mongoose.models.RDocument || mongoose.model("RDocument", RDocumentSchema);
