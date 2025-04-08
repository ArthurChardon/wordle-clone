import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "node:crypto";
import { queryResultErrorCode } from "pg-promise/lib/errors/index.js";

import { createUser, getUserByUsername } from "../db.js";

dotenv.config();

export const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("Google profile:", profile, accessToken, refreshToken);
      return cb(null, profile);
    }
  )
);
passport.use(
  new LocalStrategy({ session: false }, function verify(
    username,
    password,
    cb
  ) {
    console.log("LocalStrategy", username, password);
    getUserByUsername(username)
      .then((user) => {
        console.log("LocalStrategy user:", user);
        if (!user) {
          return cb(null, false, { message: "Incorrect username." });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          1000,
          32,
          "sha256",
          function (err, hash) {
            if (err) return cb(err);
            if (user.hashed_pwd !== hash.toString("hex")) {
              return cb(null, false, { message: "Incorrect password." });
            }
            return cb(null, user);
          }
        );
      })
      .catch((err) => {
        if (err.code === queryResultErrorCode.noData) {
          console.error("User not found");
          return cb(null, false, { message: "User not found." });
        }
        console.error("Error fetching user:", err);
        return cb(err);
      });
  })
);

router.get("/signup", function (req, res) {
  res.render("signup", { title: "Sign up" });
});

router.post("/signup", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const salt = crypto.randomBytes(16).toString("hex");
  crypto.pbkdf2(
    req.body.password,
    salt,
    1000,
    32,
    "sha256",
    function (err, hash) {
      if (err) return res.sendStatus(500);
      createUser(req.body.email, req.body.username, hash.toString("hex"), salt)
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.error("Error creating user:", err);
          res.redirect("/signup");
        });
    }
  );
});

const handleSuccessfulAuthentication = (req, res) => {
  const user = req.user;
  const username = user.username;
  const payload = {
    username: username,
    expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
  };

  req.login(payload, { session: false }, (error) => {
    if (error) {
      res.status(400).send({ error });
    }
    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);

    res.cookie("jwt", token, { httpOnly: true, secure: true });
    res.status(200).send({ username });
  });
};

router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    session: false,
  }),
  handleSuccessfulAuthentication
);

router.get("/logout", function (req, res) {});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("Google auth success, redirect", req.user);
    res.redirect("/restricted");
  }
);
