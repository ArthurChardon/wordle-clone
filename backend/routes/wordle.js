import express from "express";
import checkWord from "check-word";
import jwt from "jsonwebtoken";

import { queryResultErrorCode } from "pg-promise/lib/errors/index.js";
import { generate } from "random-words";
import {
  getWordByDate,
  createWord,
  updateProfileSuccesses,
  getProfileByUserName,
} from "../db.js";
import { cookieExtractor } from "./auth.js";
import { wordValidation } from "../game-utils/word-validation.js";

export const router = express.Router();

router.post("/submit", function (req, res, next) {
  const token = cookieExtractor(req);
  if (!req.body) return res.sendStatus(400);
  const date = new Date();
  let stringifiedDate =
    "" +
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate();
  if (req.body.date) stringifiedDate = req.body.date;
  const submittedWord = req.body.word;

  return getWordByDate(stringifiedDate)
    .then((word) => {
      const validEnglishWords = checkWord("en");
      if (
        word.word === submittedWord ||
        validEnglishWords.check(submittedWord.toLowerCase())
      ) {
        const { success, wordTry } = wordValidation(req.body.word, word.word);
        if (success && token) {
          try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            getProfileByUserName(user.username).then((profile) => {
              if (profile.successes.includes(stringifiedDate)) return;
              updateProfileSuccesses(profile.id, [
                ...profile.successes,
                stringifiedDate,
              ]);
              return;
            });
          } catch (err) {
            return;
          }
        }

        return res.status(200).send({ result: wordTry });
      } else {
        return res.status(406).send();
      }
    })
    .catch((err) => {
      if (err.code === queryResultErrorCode.noData) {
        const randomWord = generate({
          minLength: 5,
          maxLength: 5,
        }).toUpperCase();
        return createWord(randomWord, stringifiedDate).then(() => {
          const { success, wordTry } = wordValidation(
            req.body.word,
            randomWord
          );

          if (success && token) {
            try {
              const user = jwt.verify(token, process.env.JWT_SECRET);
              getProfileByUserName(user.username).then((profile) => {
                if (profile.successes.includes(stringifiedDate)) return;
                updateProfileSuccesses(profile.id, [
                  ...profile.successes,
                  stringifiedDate,
                ]);
                return;
              });
            } catch (err) {
              return;
            }
          }

          return res.status(201).send({
            result: wordTry,
          });
        });
      }
      return res.status(500).send(err);
    });
});

router.get("/answer", function (req, res, next) {
  const date = new Date();
  let stringifiedDate =
    "" +
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate();
  if (req.query.date) stringifiedDate = req.query.date;
  return getWordByDate(stringifiedDate)
    .then((word) => {
      return res.status(200).send({ word: word.word });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});
