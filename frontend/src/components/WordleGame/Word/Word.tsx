import { useEffect } from "react";
import "./Word.css";
import { LetterStatus } from "../../../types/words";

const Word = ({
  isEditable = false,
  wordElementId,
  wordLength,
  wordTry,
  onKeyboardInput,
}: {
  isEditable?: boolean;
  wordElementId: string;
  wordLength: number;
  wordTry: { letter: string; status: LetterStatus }[];
  onKeyboardInput?: (input: string) => void;
}) => {
  useEffect(() => {
    const keyDownEventHandler = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" ||
        event.key === "Enter" ||
        (event.key.length === 1 && event.key.match(/[a-zA-Z]/))
      ) {
        onKeyboardInput?.(event.key);
      }
    };

    if (isEditable) document.addEventListener("keydown", keyDownEventHandler);
    else document.removeEventListener("keydown", keyDownEventHandler);

    return () => {
      document.removeEventListener("keydown", keyDownEventHandler);
    };
  }, [isEditable]);

  const getLetter = (index: number) => {
    return index < wordTry.length ? wordTry[index].letter : " ";
  };

  const getLetterStatusClasses = (index: number) => {
    if (isEditable) return "editable";
    return index < wordTry.length ? "status-" + wordTry[index].status : "";
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
            className={
              "word-letter wordle-letter " + getLetterStatusClasses(index)
            }
          >
            <span className="z-10">{getLetter(index)}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Word;
