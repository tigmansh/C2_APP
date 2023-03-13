const express = require("express");
const { Usermodel } = require("../models/user.model");
const {blacklist} = require("../../blacklist");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  const { name, email, pass, role } = req.body;
  const user = await Usermodel.findOne({ email: req.body.email });

  if (!user) {
    try {
      bcrypt.hash(pass, 5, async (err, hash) => {
        if (err) {
          res.send({ err: err.message });
        } else {
          const userData = new Usermodel({ name, email, pass: hash, role });
          await userData.save();
          res.send({ msg: `Hello ${req.body.name}, signup successfull` });
        }
      });
    } catch (err) {
      res.send({ err: err.message });
    }
  } else {
    res.send({ err: "This email-id is already registered" });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await Usermodel.findOne({ email });
  if (!user) {
    res.send({ Error: "Invalid email or password" });
  } else {
    try {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          var access_token = jwt.sign(
            { userID: user._id },
            process.env.accesstoken,
            { expiresIn: "1m" }
          );

          var refresh_token = jwt.sign(
            { userID: user._id },
            process.env.refreshtoken,
            { expiresIn: "5m" }
          );

          res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 60 * 1 * 1000,
          });

          res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 60 * 5 * 1000,
          });

          res.send({ msg: "Login done", token: access_token });
        } else {
          res.send({ Error: "Invalid email or password" });
        }
      });
    } catch (err) {
      res.send({ Error: err.message });
    }
  }
});

UserRouter.get("/refresh", async(req,res)=> {
    const decoded = jwt.verify(req.cookies.refresh_token, process.env.refreshtoken);

    if(decoded) {
        let access_token = jwt.sign({userID:decoded.userID},process.env.accesstoken,{expiresIn:"1m"});

        res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 60 * 1 * 1000,
        });

        res.send({msg: "Done", token: access_token});
    } else {
        res.send({err:"Login Again Please"});
    }
})


UserRouter.post("/logout", async(req,res)=>{
    blacklist.push(req.cookies.access_token);
    blacklist.push(req.cookies.refresh_token);
    // req.cookies = {};
    // console.log(blacklist);
    res.send({msg: "Logged Out Successfully"});
})

module.exports = {UserRouter};