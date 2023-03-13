const jwt = require("jsonwebtoken");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { blacklist } = require("../../blacklist");
const { Usermodel } = require("../models/user.model");

require("dotenv").config();

const authenticate = async (req, res, next) => {
//   console.log(req.cookies);
  if (blacklist.includes(req.cookies.access_token) && blacklist.includes(req.cookies.refresh_token)) {
    res.send({ msg: "Login Again" });
  } else {
    try {
      if (req.cookies.access_token) {
        const decoded = jwt.verify(
          req.cookies.access_token,
          process.env.accesstoken
        );
        const { userID } = decoded;
        const user = await Usermodel.findById(userID);
        req.user = user;
        next();
      } else if (!req.cookies.access_token && req.cookies.refresh_token) {
        let fetching = await fetch(
          `http://localhost:${process.env.port}/user/refresh`,
          {
            headers: {
              Cookie: `refresh_token=${req.cookies.refresh_token}`,
            },
          }
        ).then((res) => res.json());

        const decoded = jwt.verify(
          fetching.access_token,
          process.env.accesstoken
        );
        if (decoded) {
          const { userID } = decoded;
          const user = await Usermodel.findById(userID);
          req.user = user;
          res.cookie("access_token", fetching.access_token, {
            httpOnly: true,
            maxAge: 60 * 1 * 1000,
          });
        } else {
          res.send({ msg: "Login Again" });
        }
      } else {
        res.send({ msg: "Login Again" });
      }
    } catch (err) {
      res.send({ err: err.message });
    }
  }
};

module.exports = { authenticate };
