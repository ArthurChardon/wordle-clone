import { useState } from "react";
import { LetterStatus } from "../../types/words";
import Word from "./Word/Word";
import "./WordleGame.css";
import { WordleCloneApi } from "../../apis/WordleCloneApi";

enum AnswerStatus {
  None = 0,
  Wait = 1,
  Wrong = 2,
  Success = 3,
  Failure = 4,
}

const WordleGame = () => {
  const maxTries = 6;
  const triesLocalStorageKey = "wordle-state-tries";
  const editIdLocalStorageKey = "wordle-state-editId";
  const [tries, setTries] = useState<
    {
      letter: string;
      status: LetterStatus;
    }[][]
  >(() => {
    const stickyValue = window.localStorage.getItem(triesLocalStorageKey);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : Array(maxTries).fill([]);
  });

  const [editableWordId, setEditableWordId] = useState(() => {
    const stickyValue = window.localStorage.getItem(editIdLocalStorageKey);
    return stickyValue !== null ? JSON.parse(stickyValue) : 0;
  });
  const [answerSubmitted, setAnswerSubmitted] = useState(AnswerStatus.None);

  const setNewTries = (tries: { letter: string; status: LetterStatus }[][]) => {
    setTries(tries);
    window.localStorage.setItem(triesLocalStorageKey, JSON.stringify(tries));
  };

  const setNewEditId = (editId: number) => {
    setEditableWordId(editId);
    window.localStorage.setItem(editIdLocalStorageKey, JSON.stringify(editId));
  };

  const validateWord = (word: string) => {
    setAnswerSubmitted(AnswerStatus.Wait);
    wordValidated(word);
  };

  const wordValidated = async (word: string) => {
    const api = new WordleCloneApi();
    const response = await api.submitWord(word);
    setAnswerSubmitted(AnswerStatus.None);
    if (response.status === 406) {
      setAnswerSubmitted(AnswerStatus.Wrong);
      console.error("invalid word");
      return;
    }
    if (response.status === 200 || response.status === 201) {
      const { result } = (await response.json()) as {
        result: { letter: string; status: LetterStatus }[];
      };
      const newTries = [...tries];
      newTries[editableWordId] = result;
      setNewTries(newTries);
      if (
        result.every(
          (letterResult) => letterResult.status === LetterStatus.CORRECT
        )
      ) {
        console.log("You won!!");
        setAnswerSubmitted(AnswerStatus.Success);
        setNewEditId(-1);
        return;
      }
      if (editableWordId === maxTries - 1) {
        console.log("You lost!");
        setAnswerSubmitted(AnswerStatus.Failure);
        setNewEditId(-1);
        return;
      }
      setNewEditId(editableWordId + 1);
    } else {
      console.error("error submitting word");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-[2rem] gap-[2rem]">
        <div className={"words-container containing-box"}>
          <div
            className={
              "interactivity-status" +
              (answerSubmitted === AnswerStatus.Wait ? " waiting-answer" : "") +
              (answerSubmitted === AnswerStatus.Success
                ? " success-answer"
                : "") +
              (answerSubmitted === AnswerStatus.Failure
                ? " failure-answer"
                : "") +
              (answerSubmitted === AnswerStatus.Wrong ? " wrong-answer" : "") +
              (answerSubmitted > 0 ? " information-answer" : "")
            }
          ></div>
          {tries.map((wordTry, index) => {
            return (
              <Word
                key={index}
                wordElementId={index.toString()}
                wordTry={wordTry.length ? wordTry : undefined}
                validateWord={
                  index === editableWordId
                    ? (word: string) => validateWord(word)
                    : undefined
                }
                isEditable={index === editableWordId}
              ></Word>
            );
          })}
        </div>
        <div className="">KEYBOARD</div>
      </div>
    </>
  );
};

export default WordleGame;
