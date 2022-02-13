const Joi = require("joi");
const faxValidationSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .required()
    .error(() => {
      return {
        message: "Empty Name",
      };
    }),
  to_phone: Joi.string()
    .regex(/^(\+1){1}([2-9]\d\d[2-9]\d{6})$/)
    .required()
    .error(() => {
      return {
        message: "Invalid number format",
      };
    }),
  callback_url: Joi.string()
    .regex(
      /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
    )
    .required()
    .error(() => {
      return {
        message: "invalid callback url",
      };
    }),
});

exports.faxValidationSchema = faxValidationSchema;
