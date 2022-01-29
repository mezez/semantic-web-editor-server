const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SettingSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
SettingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Setting", SettingSchema);
