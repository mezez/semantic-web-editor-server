const dbconfig = require("./database");

const port = process.env.PORT || dbconfig.PORT;

exports.variables = {
  baseUrl: `https://localhost:${port}:`,
  upload_preset: `sade_images`, //upload preset for cloudinary
  cloudinaryUrl: `https://api.cloudinary.com/v1_1/mezez/image/upload`, //cloudinary image upload url
};