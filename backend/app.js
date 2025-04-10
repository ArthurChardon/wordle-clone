import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import path from "node:path";

import cors from "cors";

import { router as authRouter } from "./routes/auth.js";
import { router as wordleRouter } from "./routes/wordle.js";
import { router as profileRouter } from "./routes/profile.js";

const __dirname = import.meta.dirname;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(passport.initialize());

app.use("/api", authRouter);
app.use("/api/game", wordleRouter);
app.use("/api/profile", profileRouter);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function restrict(req, res, next) {}

app.get("/restricted", restrict, function (req, res) {
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.listen(3000);
console.log("Server started on http://localhost:3000");

// passport-jwt + secu https://medium.com/@bryanmanuele/sessionless-authentication-withe-jwts-with-node-express-passport-js-69b059e4b22c
