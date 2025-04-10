import express from "express";
import passport from "passport";

import { getProfileByUserName } from "../db.js";

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

router.get("/edit", function (req, res) {});
