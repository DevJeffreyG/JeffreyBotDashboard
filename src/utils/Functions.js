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

/**
 * 
 * @param {String} str 
 */
const Markdown = function (str) {
  str = str
    .replace(/(?:\*\*)(?:(?!\s))((?:(?!\*\*|\n).)+)(?:\*\*)/g, '<b>$1</b>')
    .replace(/(?:\*)(?:(?!\s))((?:(?!\n|\*).)+)(?:\*)/g, '<i>$1</i>')
    .replace(/(?:~)(?:(?!\s))((?:(?!\n|~).)+)(?:~)/g, '<s>$1</s>')
    .replace(/(?:__)(?:(?!\s))((?:(?!\n|__).)+)(?:__)/g, '<u>$1</u>')
    .replace(/(?:_)(?:(?!\s))((?:(?!\n|_).)+)(?:_)/g, '<u>$1</u>')
    .replace(/(?:##)(?:(?!\s))((?:(?!\n|##).)+)(?:##)/g, '<h2>$1</h2>')
    .replace(/\\n/g, "<br/>");

  // check [text](url)
  let elements = str.match(/\[.*?\)/g);
  if (elements != null && elements.length > 0) {
    for (el of elements) {
      let txt = el.match(/\[(.*?)\]/)[1]; //solo txt
      let url = el.match(/\((.*?)\)/)[1]; //solo link

      str = str.replace(el, '<a class="show-link" href="' + url + '" target="_blank">' + txt + '</a>')
    }
  }

  return str

}

module.exports = {
  UpdateObj,
  ValidateToken,
  Markdown
}