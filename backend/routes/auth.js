import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import crypto from "node:crypto";
import { queryResultErrorCode } from "pg-promise/lib/errors/index.js";

import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  verifiesRef,
} from "../db.js";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const router = express.Router();

// Functions

export const cookieExtractor = function (req) {
  let token = null;
  let headers = req.headers;
  if (req && headers.cookie) {
    token = headers.cookie.substr(4);
  }
  return token;
};

export const setAuthJwtCookie = function (req, res, { username, email }) {
  const payload = {
    username,
    email,
    expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
  };

  const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);
  res.cookie("jwt", token, { httpOnly: true, secure: true });
};

// Passport strategies

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_REDIRECT_URL_HOST + "/api/auth/google/callback",
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
    console.log("LocalStrategy", username);
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

passport.use(
  new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
    function verify(payload, cb) {
      getUserByUsername(payload.username)
        .then((user) => {
          console.log("JwtStrategy user:", user);
          if (!user) {
            return cb(null, false, { message: "Incorrect username." });
          }
          return cb(null, user);
        })
        .catch((err) => {
          if (err.code === queryResultErrorCode.noData) {
            console.error("User not found");
            return cb(null, false, { message: "User not found." });
          }
          console.error("Error fetching user:", err);
          return cb(err);
        });
    }
  )
);

// Routes
router.get("/auth/check", (req, res) => {
  const token = cookieExtractor(req);
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

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
      const verificationRef = crypto.randomBytes(16).toString("hex");
      createUser(
        req.body.email,
        req.body.username,
        hash.toString("hex"),
        salt,
        false,
        verificationRef
      )
        .then((a) => {
          const msg = {
            to: req.body.email,
            from: "wordy@arthurchardon.fr",
            subject: "Verify your Wordy account",
            text: "Hello there! Please verify your account using this link!",
            html: `Hello there! Please verify your account using <a clicktracking=off href='${process.env.APP_URL}/api/verify?ref=${verificationRef}'>this link!</a>`,
          };
          sgMail
            .send(msg)
            .then(() => {
              console.log("Email sent");
            })
            .catch((error) => {
              console.error(error);
            });
          res.redirect("/login");
        })
        .catch((err) => {
          console.error("Error creating user:", err);
          res.redirect("/login?error=2");
        });
    }
  );
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login?error=1");
    const username = user.username;
    const email = user.email;
    setAuthJwtCookie(req, res, { username, email });
    return res.redirect("/");
  })(req, res, next);
});

router.post("/logout", function (req, res) {
  res.clearCookie("jwt");
  return res.redirect("/");
});

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
    failureRedirect: "/login?error=2",
    session: false,
  }),
  function (req, res) {
    console.log("Google auth success, redirect", req.user);
    if (req.user.emails.length) {
      const username = req.user.displayName;
      const email = req.user.emails[0].value;
      getUserByEmail(email)
        .then(() => {
          //TODO: if user already registered with email, problem
          setAuthJwtCookie(req, res, { username, email });
          res.redirect("/");
        })
        .catch((err) => {
          if (err.code === queryResultErrorCode.noData) {
            console.error("Google user not found");
            //TODO: verify double username in db!
            createUser(email, username, "", "", true);
            setAuthJwtCookie(req, res, { username, email });
            res.redirect("/");
          }
        });
    }
  }
);

router.get("/verify", (req, res) => {
  verifiesRef(req.query.ref).then(() => {
    res.redirect("/verified");
  });
});
