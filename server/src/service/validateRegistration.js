const MyError = require("../exception");
const { REQUEST_PARAMS_ERROR_CODE } = require("../exception/errorCode");

const emailDomains = new Set([
  "qq.com", "foxmail.com", "163.com", "126.com", "yeah.net", "139.com",
  "sina.com", "sina.cn", "sohu.com", "gmail.com", "outlook.com",
  "hotmail.com", "live.com", "icloud.com", "yahoo.com",
]);

function validateRegistration(username, password, email) {
  if (typeof username !== "string" || !/^[A-Za-z]{3,32}$/.test(username)) {
    throw new MyError(REQUEST_PARAMS_ERROR_CODE, "用户名须由 3 至 32 个英文字母组成");
  }
  if (
    typeof password !== "string" || !/^[!-~]{8,14}$/.test(password) ||
    !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)
  ) {
    throw new MyError(REQUEST_PARAMS_ERROR_CODE, "密码须为 8 至 14 位，包含英文字母和数字，可使用半角符号");
  }
  const address = typeof email === "string" && email.split("@");
  if (!address || address.length !== 2 || address[0].length > 64 ||
      !/^[A-Za-z0-9_+'%-]+(?:\.[A-Za-z0-9_+'%-]+)*$/.test(address[0])) {
    throw new MyError(REQUEST_PARAMS_ERROR_CODE, "邮箱格式不正确");
  }
  if (!emailDomains.has(address[1].toLowerCase())) {
    throw new MyError(REQUEST_PARAMS_ERROR_CODE, `支持的邮箱域名：${[...emailDomains].join("、")}`);
  }
}

module.exports = validateRegistration;
