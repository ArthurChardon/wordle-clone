import express from "express";
import { queryResultErrorCode } from "pg-promise/lib/errors/index.js";
import { generate } from "random-words";
import checkWord from "check-word";

import { getWordByDate, createWord } from "../db.js";

export const router = express.Router();

router.post("/submit", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const date = new Date();
  const stringifiedDate =
    "" + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  const submittedWord = req.body.word;

  return getWordByDate(stringifiedDate)
    .then((word) => {
      const validEnglishWords = checkWord("en");
      if (
        word === submittedWord ||
        validEnglishWords.check(submittedWord.toLowerCase())
      ) {
        return res
          .status(200)
          .send({ result: wordValidation(req.body.word, word.word) });
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
          return res
            .status(201)
            .send({ result: wordValidation(req.body.word, randomWord) });
        });
      }
      return res.status(500).send(err);
    });
});

const wordValidation = (submittedWord, referenceWord) => {
  const wordTry = [];
  submittedWord.split("").forEach((letter, index) => {
    if (letter === referenceWord[index]) {
      wordTry.push({ letter, status: "correct" });
      return;
    }
    if (referenceWord.includes(letter)) {
      wordTry.push({ letter, status: "present" });
      return;
    }
    wordTry.push({ letter, status: "wrong" });
  });
  return wordTry;
};
