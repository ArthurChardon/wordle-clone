import { useEffect, useState } from "react";
import "./Word.css";
import { LetterStatus } from "../../../types/words";

export default function Word({
  isEditable = false,
  wordElementId,
  wordTry,
}: {
  isEditable?: boolean;
  wordElementId: string;
  wordTry?: { letter: string; status: LetterStatus }[];
}) {
  const wordLength = 5;
  const [letters, setLetters] = useState<string[]>([]);
  console.log("aaaa" + wordElementId, letters); //TODO: why refreshed 2 times ?

  useEffect(() => {
    const keyDownEventHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        //TODO
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
    if (isEditable || !wordTry) {
      return;
    }
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
