const express = require("express");
const bodyParser = require("body-parser");
const { errorHandler } = require("./app/helpers/error-handler");
var cors = require("cors");

const app = express();

//enable cross origin
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require("./config/database.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.db, {})
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json("Connection successful!");
});

//import routes
const userRoutes = require("./app/routes/users");
const rdocumentRoutes = require("./app/routes/rdocuments");
const rdocumentRowRoutes = require("./app/routes/rdocumentRows");
const categoryRoutes = require("./app/routes/categories");
const commentRoutes = require("./app/routes/comments");
const itemRoutes = require("./app/routes/items");
const rdocumentPrefixRoutes = require("./app/routes/rdocumentPrefixes");
const rLabelRoutes = require("./app/routes/rlabels");
const rNodeRoutes = require("./app/routes/rnodes");
const rPrefixRoutes = require("./app/routes/rprefixes");

//define routes
const prefix = "/api/v1";

app.use(prefix + "/users", userRoutes);
app.use(prefix + "/documents", rdocumentRoutes);
app.use(prefix + "/document-rows", rdocumentRowRoutes);
app.use(prefix + "/categories", categoryRoutes);
app.use(prefix + "/comments", commentRoutes);
app.use(prefix + "/items", itemRoutes);
app.use(prefix + "/document-prefixes", rdocumentPrefixRoutes);
app.use(prefix + "/labels", rLabelRoutes);
app.use(prefix + "/nodes", rNodeRoutes);
app.use(prefix + "/prefixes", rPrefixRoutes);

//default error handling. See categories getAllCategories endpoint for sample usage. Call next() on error to forward to default error handler outside a promise or try block
app.use(errorHandler);

//listen for requests
app.listen(process.env.PORT || dbConfig.port, () => {
  console.log(
    `VirtualCom listening on port ${process.env.PORT || dbConfig.port}`
  );
});
