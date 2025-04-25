export const wordValidation = (submittedWord, referenceWord) => {
  const wordTry = [];
  const validLettersCount = new Map();
  referenceWord.split("").forEach((letter) => {
    if (validLettersCount.has(letter)) {
      return;
    }
    validLettersCount.set(letter, 1);
  });
  let success = true;
  submittedWord.split("").forEach((letter, index) => {
    if (letter === referenceWord[index]) {
      wordTry.push({ letter, status: "correct" });
      const letterNumberInWord = validLettersCount.get(letter);
      if (letterNumberInWord === undefined) {
        return;
      }
      validLettersCount.set(letter, letterNumberInWord + 1);
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
  submittedWord.split("").forEach((letter, index) => {
    if (wordTry[index].status === "correct") {
      const letterNumberInWord = validLettersCount.get(letter);
      if (letterNumberInWord === undefined) {
        return;
      }
      validLettersCount.set(letter, letterNumberInWord + 1);
      return;
    }
    if (wordTry[index].status === "present") {
      const letterCount = submittedWord.split(letter).length - 1;
      const referenceLetterCount = referenceWord.split(letter).length - 1;
      const letterNumberInWord = validLettersCount.get(letter);
      if (letterNumberInWord === undefined) {
        return;
      }

      validLettersCount.set(letter, letterNumberInWord + 1);

      if (
        letterCount > referenceLetterCount &&
        letterNumberInWord > referenceLetterCount
      ) {
        wordTry[index].status = "wrong";
      }
    }
  });
  return { wordTry, success };
};
