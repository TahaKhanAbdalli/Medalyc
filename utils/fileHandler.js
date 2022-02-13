const multer = require("multer");
const utiltiyDebugger = require("debug")("app:utility:saveFile");

const fileExtensionAllowed = ["application/pdf"];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage,
  fileFilter: async (req, file, cb) => {
    if (file.mimetype != "application/pdf") {
      req.fileValidationError = true;
      return cb(new Error("The file is not PDF"), false);
    }
    cb(null, true);
  },
}).single("file");

const uploadFile = async (req, res) => {
  var message = "";

  upload(req, res, (err) => {
    // FILE SIZE ERROR
    if (err instanceof multer.MulterError) {
      message = "Max file size 2MB allowed!";
    }
    // INVALID FILE TYPE, message will return from fileFilter callback
    else if (err) {
      message = err.message;
    }
    // FILE NOT SELECTED
    else if (!req.file) {
      message = "File is required!";
    }
    // SUCCESS
    else {
      message = "File uploaded successfully!";
    }
    utiltiyDebugger(message);
  });
};

module.exports = {
  uploadFile,
  upload,
};
