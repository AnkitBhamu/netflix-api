// for login th euser
const router = require("express").Router();
const express = require("express");
const User = require("../Schemas/User");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

function authorize_user(req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    res.status(404).json("Authorization failed!!");
  } else {
    let token = req.headers.authorization.split(" ")[1];
    try {
      jwt.verify(token, process.env.SECRET_KEY);
      next();
    } catch (err) {
      res.status(404).json("Authorization failed!!");
    }
  }
}

// UPDATE ITS ACCOUNT
router.get("/getUser/:id", authorize_user, async (req, res) => {
  try {
    // console.log(req.params.id);
    let user = await User.findById(req.params.id);
    user._doc.password = crypto.AES.decrypt(
      user._doc.password,
      process.env.SECRET_KEY
    ).toString(crypto.enc.Utf8);

    let { mylist, ...info } = user._doc;

    res.status(200).json(info);
  } catch (err) {
    // console.log(err);
    res.status(404).json("user not found!!");
  }
});

router.post("/update", authorize_user, async (req, res) => {
  let update_data = {
    name: req.body.name,
    email: req.body.email,
    password: crypto.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    // profilePicture: req.body.profile_pic,
  };

  try {
    const resp = await User.findByIdAndUpdate(req.body.id, update_data, {
      new: true,
    });
    let { password, mylist, ...info } = resp._doc;
    info.token = jwt.sign(info, process.env.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "7d",
    });
    res.status(200).json(info);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/getMyList/:id", authorize_user, async (req, res) => {
  try {
    const resp = await User.findById(req.params.id);
    let { password, mylist, ...info } = resp._doc;
    res.status(200).json(mylist);
  } catch (err) {
    // console.log(err);
    res.status(404).json(err);
  }
});

router.post("/updateMyList/:id", authorize_user, async (req, res) => {
  try {
    let operation =
      req.body.mode === "add"
        ? { $addToSet: { mylist: req.body.mid } }
        : { $pull: { mylist: req.body.mid } };

    const resp = await User.findByIdAndUpdate(req.params.id, operation, {
      new: true,
    });
    let { password, mylist, ...info } = resp._doc;
    res.status(200).json(info);
  } catch (err) {
    // console.log(err);
    res.status(404).json(err);
  }
});

// deleting the user this only admin can do i will update this later
router.post("/delete", async (req, res) => {
  let delete_data = {
    email: req.body.email,
  };

  try {
    await User.findOneAndDelete(
      { email: req.body.email },
      {
        new: true,
      }
    );
    res.status(200).json("Successfully deleted!!");
  } catch (err) {
    // console.log(err);
    res.status(404).json(err);
  }
});

module.exports = router;
