const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const url = require("url");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect("/");
  }
  try {
    const data = jwt.verify(token, "secretKey");
    req.name = data.name;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/login", function (req, res) {
  res.redirect(url.format({ pathname: "/entrar", query: req.query }));
});

router.get("/entrar", (req, res) => {
  const hashPassword = crypto
    .createHash("sha256")
    .update("12354hdfnb63ybcxbrthy")
    .digest("hex");
  if (hashPassword === req.query.password) {
    const token = jwt.sign({ name: req.query.name }, "secretKey");
    if (token) {
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
        })
        .status(200)
        .send("<a href='/interno'>Interno</a>");
    } else {
      return res.send("<a href='/'>Home</a>");
    }
  } else {
    return res.send("<a href='/'>Home</a>");
  }
});

router.get("/interno", authorization, (req, res) => {
  res.send("Hola " +req.name+" bienvenido!!");
});

module.exports = router;
