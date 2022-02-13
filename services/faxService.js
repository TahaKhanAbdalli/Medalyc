const serviceDebugger = require("debug")("app:service:fax");
const fileHandler = require("../utils/fileHandler");
const Joi = require("joi");
const { faxValidationSchema } = require("../validation_schemas/fax");
const Util = require("../utils/Util");
const Constant = require("../utils/Constant");
const { randomUUID } = require("crypto"); // Added in: node v14.17.0
const axios = require("axios");

async function recieveFax(req, res) {
  try {
    //Joi validation checking
    const uniqueReqId = randomUUID();
    const callback = req.body.callback_url;
    serviceDebugger("validating req body");
    serviceDebugger(req.body);
    const { error } = Joi.validate(req.body, faxValidationSchema);
    if (error)
      return Util.getForbiddenRequest(
        "Request Failed With Error",
        {
          fax_id: uniqueReqId,
          status: Constant.FAILURE,
          error: error.details[0].message,
        },
        res
      );
    serviceDebugger("req body is valid");
    await fileHandler.uploadFile(req, res);
    serviceDebugger("sending request in 5 seconds");
    setTimeout(async () => {
      try {
        await axios.post(callback, {
          fax_id: uniqueReqId,
          status: Constant.SUCCESS,
          error: null,
          attempt: 1,
        });
      } catch (error) {
        serviceDebugger("this is error" + error.message);
      }
    }, 5000);
    serviceDebugger("sending request in 5 minutes");
    setTimeout(async () => {
      await axios.post(callback, {
        fax_id: uniqueReqId,
        status: Constant.SUCCESS,
        error: null,
        attempt: 2,
      });
    }, 300000);

    return Util.getOkRequest(
      {
        fax_id: uniqueReqId,
        status: Constant.QUEUED,
        error: null,
      },
      "Successfully executed",
      res
    );
  } catch (ex) {
    serviceDebugger(ex);
    return Util.getBadRequest(ex.message, res);
  }
}

async function recieveFaxStatus(req, res) {
  serviceDebugger(req.body);
  res.send(JSON.stringify(req.body));
}

module.exports = {
  recieveFax,
  recieveFaxStatus,
};
