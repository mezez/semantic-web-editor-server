let Setting = require("../models/setting");

exports.getSettingByName = async (settingName) => {
    try {
      const data = await Setting.findOne({ name: settingName });
      return data.value;
    } catch (err) {
      console.log(err);
    }
  };