import { useState } from "react";
import { LetterStatus } from "../../types/words";
import Word from "./Word/Word";
import "./WordleGame.css";
import { WordleCloneApi } from "../../apis/WordleCloneApi";

const WordleGame = () => {
  const [tries, setTries] = useState<
    {
      letter: string;
      status: LetterStatus;
    }[][]
  >(Array(5).fill([]));
  const [editableWordId, setEditableWordId] = useState(0);

  const wordValidated = async (word: string) => {
    const api = new WordleCloneApi();
    const response = await api.submitWord(word);
    if (response.status === 406) {
      console.error("invalid word");
      return;
    }
    if (response.status === 200 || response.status === 201) {
      const { result } = (await response.json()) as {
        result: { letter: string; status: LetterStatus }[];
      };
      const newTries = [...tries];
      newTries[editableWordId] = result;
      setTries(newTries);
      if (
        result.every(
          (letterResult) => letterResult.status === LetterStatus.CORRECT
        )
      ) {
        console.log("You won!!");
        setEditableWordId(-1);
        return;
      }
      if (editableWordId === 5 - 1) {
        console.log("You lost!");
        setEditableWordId(-1);
        return;
      }
      setEditableWordId(editableWordId + 1);
    } else {
      console.error("error submitting word");
    }
  };

  return (
    <>
      <div className="words-container flex flex-col justify-center items-center gap-[1rem] p-[2rem]">
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
