import { useEffect, useRef, useState } from "react";
import "./Word.css";
import { LetterStatus } from "../../../types/words";

export default function Word({
  isEditable = false,
  wordElementId,
  wordTry,
  validateWord,
}: {
  isEditable?: boolean;
  wordElementId: string;
  wordTry?: { letter: string; status: LetterStatus }[];
  validateWord?: (word: string) => void;
}) {
  const wordLength = 5;
  const [letters, setLetters] = useState<string[]>([]);
  const lettersRef = useRef([...letters]);

  useEffect(() => {
    lettersRef.current = [...letters];
  }, [letters]);

  useEffect(() => {
    const keyDownEventHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (lettersRef.current.length === wordLength && validateWord) {
          validateWord(lettersRef.current.join(""));
        }
        return;
      }
      if (event.key === "Backspace") {
        popLetter();
        return;
      }
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        if (letters.length >= wordLength) return;
        pushLetter(event.key.toUpperCase());
        return;
      }
    };

    const pushLetter = (letter: string) => {
      setLetters((freshLetters) => {
        const newLetters = [...freshLetters];
        newLetters.push(letter);
        return [...newLetters];
      });
    };

    const popLetter = () => {
      setLetters((freshLetters) => {
        const newLetters = [...freshLetters];
        newLetters.pop();
        return [...newLetters];
      });
    };

    if (isEditable) document.addEventListener("keydown", keyDownEventHandler);
    else document.removeEventListener("keydown", keyDownEventHandler);

    return () => {
      document.removeEventListener("keydown", keyDownEventHandler);
    };
  }, [isEditable]);

  const getLetter = (index: number) => {
    if (isEditable) {
      return letters[index] ?? " ";
    }
    if (wordTry) {
      return wordTry[index]?.letter ?? " ";
    }
    return " ";
  };

  const getLetterStatusClasses = (index: number) => {
    if (isEditable) return "editable";
    if (!wordTry) return;
    return "status-" + wordTry[index].status;
  };

  return (
    <>
      <div
        id={wordElementId}
        className="
            grid grid-cols-5 gap-[.5rem] w-[27rem] h-[5rem]"
      >
        {Array.from({ length: wordLength }, (_, index) => (
          <div
            key={index}
            className={"word-letter " + getLetterStatusClasses(index)}
          >
            {getLetter(index)}
          </div>
        ))}
      </div>
    </>
  );
}

//export default Word;
