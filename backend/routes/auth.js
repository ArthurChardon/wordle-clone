import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import hash from "pbkdf2-password";
import crypto from "node:crypto";
import { createUser, getUserByUsername } from "../db.js";
import { queryResultErrorCode } from "pg-promise/lib/errors/index.js";

dotenv.config();

export const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("Google profile:", profile, accessToken, refreshToken);
      return cb(null, profile);
    }
  )
);
passport.use(
  new LocalStrategy(function verify(username, password, cb) {
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
          req.session.success = "User signed up successfully!";
          res.redirect("/login");
        })
        .catch((err) => {
          console.error("Error creating user:", err);
          req.session.error = "Error creating user, please try again.";
          res.redirect("/signup");
        });
    }
  );
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureMessage: true,
  })
);

router.get("/logout", function (req, res) {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function () {
    res.redirect("/");
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("Google auth success, redirect", req.user);
    res.redirect("/restricted");
  }
);
