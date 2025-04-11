import express from "express";
import passport from "passport";

import { setAuthJwtCookie } from "./auth.js";
import {
  getProfileByUserName,
  updateUserUsername,
  clearedUsername,
} from "../db.js";

export const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return getProfileByUserName(req.user.username).then((profile) => {
      return res
        .status(200)
        .send({ profile, user: { username: req.user.username } });
    });
  }
);

router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    const newUsername = req.body.username;
    return clearedUsername(newUsername)
      .then(() => {
        return updateUserUsername(req.user.username, newUsername).then(
          (user) => {
            const username = user.username;
            const email = user.username;
            setAuthJwtCookie(req, res, { username, email });
            return res.status(200).redirect("/profile");
          }
        );
      })
      .catch(() => {
        return res.status(406).redirect("/profile?error=1");
      });
  }
);
