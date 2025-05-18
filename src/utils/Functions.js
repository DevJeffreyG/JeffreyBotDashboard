const jwt = require("jsonwebtoken");
const crypto = require('crypto');

let used = new Set();
let countedUsed = new Map();

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
 * Valida el token regulador
 * @param {*} req 
 * @param {*} res 
 * @param {Boolean} use Usa el Token usado
 * @returns {Boolean} Regresa si el Token regulador fue válido
 */
const ValidateToken = function (req, res, use = true) {
  const query = req.query?.token ? decodeURIComponent(req.query?.token) : req.cookies.token;
  console.log("query token?", req.query?.token ? true : false + "... using:", query);
  if (!query) return false;
  const token = Decrypt(query, process.env.APP_SECRET);

  try {
    console.log("decrypted control token:", token);
    let decoded = jwt.verify(token, process.env.TOKEN)
    //console.log(decoded);

    if ((!decoded.uses && used.has(decoded.m)) || (decoded.uses === 1 && used.has(decoded.m)) || (decoded.uses != 1 && countedUsed.get(decoded.m) >= decoded.uses)) throw Error("Token already used");
    if (Date.now() >= decoded.iat * 1000 + 60000) throw new jwt.TokenExpiredError("jwt expired", new Date(decoded.iat * 1000 + 60000));

    if (use) {
      console.log("using token, uses: ", decoded.uses);
      used.add(decoded.m)
      if (!countedUsed.get(decoded.m)) countedUsed.set(decoded.m, 1)
      else countedUsed.set(decoded.m, countedUsed.get(decoded.m) + 1)
      RefreshToken(res);

      setTimeout(() => {
        used.delete(decoded.m);
      }, 60000);
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error("expired control token");
      RefreshToken(res);

      return true;
    } else console.error("token validation error", err.message);

    res.clearCookie("token");
    return false;
  }

  console.log("CONTROL TOKEN OK");
  return true;
}

/**
 * Actualiza el token regulador para la Dashboard
 * @param {void}
 */
const RefreshToken = (res) => {
  const newToken = jwt.sign({ m: Math.ceil(Math.random() * Date.now()) }, process.env.TOKEN);
  res.cookie("token", Encrypt(newToken), { httpOnly: true, secure: true, sameSite: "strict" })
  console.log("refreshed control token!");
}

const IsInDev = function () {
  return process.env.DEV === "TRUE"
}

/**
 * Genera una autenticación para el server-side en Jeffrey Bot
 * @param {Number} t
 * @param {Number} uses
 * @returns {String}
 */
const GenerateServerAuth = (t = 1, uses = 1) => {
  return Encrypt(jwt.sign({ m: Math.ceil(Math.random() * Date.now() * t), uses }, process.env.TOKEN, { expiresIn: "30s" }));
}

const Encrypt = (text) => {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(process.env.APP_SECRET, salt, 100000, 32, 'sha256');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

const Decrypt = (encryptedBase64, key) => {
  try {
    const data = Buffer.from(encryptedBase64, 'base64');

    const salt = Buffer.from(data.subarray(0, 16));
    const iv = Buffer.from(data.subarray(16, 28));
    const tag = Buffer.from(data.subarray(28, 44));
    const encrypted = Buffer.from(data.subarray(44));

    const pass = crypto.pbkdf2Sync(key, salt, 100000, 32, 'sha256');

    const decipher = crypto.createDecipheriv('aes-256-gcm', pass, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString('utf8');
  } catch (err) {
    console.error("error decrypting:", err.message);
    return null;
  }
}

/**
 * 
 * @param {String} str 
 */
const Markdown = function (str) {
  str = str
    .replace(/(?<!\\)\*\*(?:(?!\s))((?:(?!\*\*|\n).)+)\*\*/g, '<b>$1</b>')
    .replace(/(?<!\\)\*(?:(?!\s))((?:(?!\n|\*).)+)\*/g, '<i>$1</i>')
    .replace(/(?<!\\)~(?:(?!\s))((?:(?!\n|~).)+)~/g, '<s>$1</s>')
    .replace(/(?<!\\)__(?:(?!\s))((?:(?!\n|__).)+)__/g, '<u>$1</u>')
    .replace(/(?<!\\)_(?:(?!\s))((?:(?!\n|_).)+)_/g, '<u>$1</u>')
    .replace(/(?<!\\)##(?:(?!\s))((?:(?!\n|##).)+)##/g, '<h2>$1</h2>')
    .replace(/\\n/g, "<br/>")
    .replace(/\\(?=\*\*|\*|~|__|_|##)/g, '');

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
  Markdown,
  IsInDev,
  RefreshToken,
  GenerateServerAuth,
  Encrypt,
  Decrypt
}