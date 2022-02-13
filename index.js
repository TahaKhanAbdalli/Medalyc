const express = require("express");
const helmet = require("helmet");
const config = require("config");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const app = express();
const cors = require("cors");
const formidable = require("express-formidable");
const { upload } = require("./utils/fileHandler");
const faxApi = require("./controllers/faxApi");
const errorHandler = require("./utils/Error");

// startupDebugger(process.env.NODE_ENV);
// startupDebugger(app.get('env'));
// Configurations
startupDebugger(`application name ${config.get("name")}`);
startupDebugger(`application mail ${config.get("mail.host")}`);

// built-in middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded());

//multer

app.use(upload);

// 3rd party middlewares
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan Debug Log Enabled...");
}
app.use(cors());
// custom middlewares/api's
app.use("/api", faxApi);
// Global Error Handler
app.use(errorHandler.handleError);
const port = process.env.PORT || 5000;
app.listen(port, () => startupDebugger(`Listening on port ${port}...`));
