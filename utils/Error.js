const { randomUUID } = require("crypto"); // Added in: node v14.17.0
const axios = require("axios");
const Util = require("./Util");
const Constant = require("./Constant");
const errorDebugger = require("debug")("app:utils:error");

const handleError = (err, req, res, next) => {
  if (!err) return next();
  errorDebugger("sending request in 5 seconds");
  setTimeout(async () => {
    try {
      await axios.post(callback, {
        fax_id: uniqueReqId,
        status: Constant.SUCCESS,
        error: err.message,
        attempt: 1,
      });
    } catch (error) {
      errorDebugger("error pccured while calling api " + error.message);
    }
  }, 5000);
  errorDebugger("sending request in 5 minutes");
  setTimeout(async () => {
    try {
      await axios.post(callback, {
        fax_id: uniqueReqId,
        status: Constant.SUCCESS,
        error: err.message,
        attempt: 2,
      });
    } catch (error) {
      errorDebugger("error pccured while calling api " + error.message);
    }
  }, 5000);
  return Util.getForbiddenRequest(
    "Request Failed With Error",
    {
      fax_id: randomUUID(),
      status: Constant.FAILURE,
      error: err.message,
    },
    res
  );
};

module.exports = {
  handleError,
};
