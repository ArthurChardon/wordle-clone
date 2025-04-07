import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import hash from "pbkdf2-password";

dotenv.config();

export const router = express.Router();

function authenticate(name, pass, fn) {
  console.log("authenticating %s:%s", name, pass);
  /*const user = users[name];
  if (!user) return fn(null, null);
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user);
    fn(null, null);
  });*/
  return fn(null, null);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // Here you would typically find or create a user in your database
      console.log("Google profile:", profile, accessToken, refreshToken);
      return cb(null, profile);
    }
  )
);
passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log("LocalStrategy", username, password);
  })
);

router.get("/signup", function (req, res) {
  res.render("signup", { title: "Sign up" });
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.post("/login", function (req, res, next) {
  if (!req.body) return res.sendStatus(400);
  authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) return next(err);
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function () {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success =
          "Authenticated as " +
          user.name +
          ' click to <a href="/logout">logout</a>. ' +
          ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect(req.get("Referrer") || "/");
      });
    } else {
      req.session.error =
        "Authentication failed, please check your " +
        " username and password." +
        ' (use "tj" and "foobar")';
      res.redirect("/login");
    }
  });
});

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
