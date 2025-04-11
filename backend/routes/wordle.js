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

export const router = express.Router();

router.post("/submit", function (req, res, next) {
  const token = cookieExtractor(req);
  if (!req.body) return res.sendStatus(400);
  const date = new Date();
  const stringifiedDate =
    "" +
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate();
  const submittedWord = req.body.word;

  return getWordByDate(stringifiedDate)
    .then((word) => {
      const validEnglishWords = checkWord("en");
      if (
        word === submittedWord ||
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

const wordValidation = (submittedWord, referenceWord) => {
  const wordTry = [];
  let success = true;
  submittedWord.split("").forEach((letter, index) => {
    if (letter === referenceWord[index]) {
      wordTry.push({ letter, status: "correct" });
      return;
    }
    if (referenceWord.includes(letter)) {
      success = false;
      wordTry.push({ letter, status: "present" });
      return;
    }
    success = false;
    wordTry.push({ letter, status: "wrong" });
  });
  return { wordTry, success };
};
