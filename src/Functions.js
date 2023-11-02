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

module.exports = {
    UpdateObj
}