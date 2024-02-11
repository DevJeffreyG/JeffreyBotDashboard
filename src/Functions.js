const jwt = require("jsonwebtoken");

const UpdateObj = function (obj, prop, value) {
  if (typeof prop === "string")
    prop = prop.split(".");

  if (prop.length > 1) {
    var e = prop.shift();
    UpdateObj(obj[e] =
      Object.prototype.toString.call(obj[e]) === "[object Object]"
        ? obj[e]
        : {},
      prop,
      value);
  } else
    obj[prop[0]] = value;
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {Boolean} If token was valid
 */
const ValidateToken = function (req, res) {
  const token = req.cookies.token;

  try {
    jwt.verify(token, process.env.TOKEN)
  } catch (err) {
    console.log(err);

    if (err instanceof jwt.TokenExpiredError) {
      const newToken = jwt.sign({ ip: req.ip }, process.env.TOKEN, { expiresIn: "30m" });
      res.cookie("token", newToken)

      return true;
    }

    res.clearCookie("token");
    return false;
  }

  return true;
}

module.exports = {
  UpdateObj,
  ValidateToken
}