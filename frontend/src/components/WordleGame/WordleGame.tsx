import { LetterStatus } from "../../types/words";
import Word from "./Word/Word";
import "./WordleGame.css";

const WordleGame = () => {
  const theWord = "mundo";
  const tries: {
    letter: string;
    status: LetterStatus;
  }[] = [];

  const wordTry1 = [
    { letter: "M", status: LetterStatus.CORRECT },
    { letter: "O", status: LetterStatus.PRESENT },
    { letter: "T", status: LetterStatus.WRONG },
    { letter: "U", status: LetterStatus.PRESENT },
    { letter: "S", status: LetterStatus.WRONG },
  ];
  return (
    <>
      <div className="words-container flex flex-col justify-center items-center gap-[1rem]">
        <Word wordElementId="1" wordTry={wordTry1}></Word>
        <Word isEditable={true} wordElementId="2"></Word>
        <Word wordElementId="3"></Word>
      </div>
    </>
  );
};

export default WordleGame;
