import { useState } from "react";
import { LetterStatus } from "../../types/words";
import Word from "./Word/Word";
import "./WordleGame.css";

const WordleGame = () => {
  const theWord = "MUNDO";
  const [tries, setTries] = useState<
    {
      letter: string;
      status: LetterStatus;
    }[][]
  >(Array(5).fill([]));
  const [editableWordId, setEditableWordId] = useState(0);

  const wordValidated = (word: string) => {
    const wordTry: { letter: string; status: LetterStatus }[] = [];
    word.split("").forEach((letter, index) => {
      console.log(letter, theWord, index);
      if (letter === theWord[index]) {
        wordTry.push({ letter, status: LetterStatus.CORRECT });
        return;
      }
      if (theWord.includes(letter)) {
        wordTry.push({ letter, status: LetterStatus.PRESENT });
        return;
      }
      wordTry.push({ letter, status: LetterStatus.WRONG });
    });
    const newTries = [...tries];
    newTries[editableWordId] = wordTry;
    setTries(newTries);
    setEditableWordId(editableWordId < 5 - 1 ? editableWordId + 1 : -1);
  };

  return (
    <>
      <div className="words-container flex flex-col justify-center items-center gap-[1rem]">
        {tries.map((wordTry, index) => {
          return (
            <Word
              key={index}
              wordElementId={index.toString()}
              wordTry={wordTry.length ? wordTry : undefined}
              validateWord={
                index === editableWordId
                  ? (word: string) => wordValidated(word)
                  : undefined
              }
              isEditable={index === editableWordId}
            ></Word>
          );
        })}
      </div>
    </>
  );
};

export default WordleGame;
