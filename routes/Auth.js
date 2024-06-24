// for login th euser
const router = require("express").Router();
const express = require("express");
const User = require("../Schemas/User");
const crypto = require("crypto-js");

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
  // console.log("name and pass is : ", req.body.password);

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
    // save is asyn function

    const resp = await user.save();
    let { password, ...info } = resp._doc;
    res.json(info);
  } catch (err) {
    res.status(500).json("Check params!!");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log("user pass is : ", user.password);

    if (!user) {
      res.status(404).json("Invalid entries Try again");
    }

    if (user) {
      let decrypt_pass = crypto.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(crypto.enc.Utf8);

      // console.log("decrypt pass is : ", decrypt_pass);

      if (decrypt_pass !== req.body.password) {
        res.status(404).json("Invalid entries Try again");
      } else {
        // send th user details instead of its password
        const { password, ...info } = user._doc;
        res.status(200).json(info);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
