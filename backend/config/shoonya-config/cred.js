const { authenticator } = require('otplib');
const dotenv = require("dotenv");
dotenv.config(); 

module.exports.authparams = {
  'userid'   : process.env.SHOONYA_USERNAME,
  'password' : process.env.SHOONYA_PASSWORD,
  'twoFA'    : authenticator.generate(process.env.SHOONYA_TOTP),
  'vendor_code' : process.env.SHOONYA_VENDOR_CODE,
  'api_secret' : process.env.SHOONYA_API_KEY,
  'imei'       : process.env.SHOONYA_IMEI
}
