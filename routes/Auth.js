// for login th euser
const router = require("express").Router();
const express = require("express");
const User = require("../Schemas/User");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

async function isUserexists(email) {
  let res = await User.findOne({ email: email });
  if (res) {
    return true;
  } else return false;
}

// register function
router.post("/register", async (req, res) => {
  let status = await isUserexists(req.body.email);
  let name = Math.random().toString(36).slice(2, 10);
  if (status) {
    res.status(200).json("UserExists!");
    return;
  }
  try {
    const user = new User({
      name: name,
      email: req.body.email,
      password: crypto.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });

    const resp = await user.save();
    let { password, mylist, ...info } = resp._doc;

    info.token = jwt.sign(info, process.env.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    res.json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("Invalid entries Try again");
    }

    if (user) {
      let decrypt_pass = crypto.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(crypto.enc.Utf8);

      if (decrypt_pass !== req.body.password) {
        res.status(404).json("Invalid entries Try again");
      } else {
        const { password, mylist, ...info } = user._doc;

        info.token = jwt.sign(info, process.env.SECRET_KEY, {
          algorithm: "HS256",
          expiresIn: "7d",
        });

        res.status(200).json(info);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
