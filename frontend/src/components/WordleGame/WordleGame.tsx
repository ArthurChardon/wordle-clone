import { useEffect, useRef, useState } from "react";
import { TryLetter, LetterStatus } from "../../types/words";
import Word from "./Word/Word";
import "./WordleGame.css";
import { WordleCloneApi } from "../../apis/WordleCloneApi";
import ForceDate from "./ForceDate/ForceDate";
import Keyboard from "./Keyboard/Keyboard";
import Alert from "./Alert/Alert";

enum AnswerStatus {
  None = 0,
  Wait = 1,
  Wrong = 2,
  Success = 3,
  Failure = 4,
}

const WordleGame = () => {
  const maxTries = 6;
  const wordLength = 5;
  const triesLocalStorageKey = "wordle-state-tries";
  const editIdLocalStorageKey = "wordle-state-editId";
  const dateLocalStorageKey = "wordle-state-date";
  const validLetters: string[] = [];
  const presentLetters: string[] = [];
  const wrongLetters: string[] = [];

  const hiddenTryInput = useRef<HTMLTextAreaElement>(null);

  const [tries, setTries] = useState<TryLetter[][]>(() => {
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
  const [currentWord, setCurrentWord] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    status: "success" | "info" | "error";
  } | null>(null);

  const currentWordRef = useRef<string[]>([...currentWord]);

  useEffect(() => {
    currentWordRef.current = [...currentWord];
  }, [currentWord]);

  useEffect(() => {
    const date = new Date();
    const stringifiedDate =
      "" +
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate();

    const stickyValue = window.localStorage.getItem(dateLocalStorageKey);
    if (stickyValue !== null) {
      if (stickyValue !== stringifiedDate) {
        setNewTries(Array(maxTries).fill([]));
        setNewEditId(0);
      }
    }
  }, []);

  const setNewTries = (tries: TryLetter[][]) => {
    setTries(tries);
    updateValidAndPresentLetters(tries);
    window.localStorage.setItem(triesLocalStorageKey, JSON.stringify(tries));
    const date = new Date();
    const stringifiedDate =
      "" +
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate();
    window.localStorage.setItem(dateLocalStorageKey, stringifiedDate);
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
    const forceDate = window.localStorage.getItem("force-date");
    let response;
    setAlertMessage(null);
    if (forceDate) response = await api.submitWord(word, forceDate);
    else response = await api.submitWord(word);
    setAnswerSubmitted(AnswerStatus.None);
    if (response.status === 406) {
      setAnswerSubmitted(AnswerStatus.Wrong);
      setAlertMessage({ message: "Invalid word", status: "error" });
      console.error("invalid word");
      return;
    }
    if (response.status === 200 || response.status === 201) {
      const { result } = (await response.json()) as {
        result: TryLetter[];
      };
      const newTries = [...tries];
      newTries[editableWordId] = result;
      setNewTries(newTries);
      setCurrentWord([]);
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

  const updateValidAndPresentLetters = (tries: TryLetter[][]) => {
    tries.forEach((tryLetters) => {
      tryLetters.forEach((letterResult) => {
        if (letterResult.status === LetterStatus.WRONG) {
          wrongLetters.push(letterResult.letter);
          return;
        }
        if (letterResult.status === LetterStatus.CORRECT) {
          validLetters.push(letterResult.letter);
          return;
        }
        if (letterResult.status === LetterStatus.PRESENT) {
          presentLetters.push(letterResult.letter);
        }
      });
    });
  };

  const letterInputTriggered = (letter: string) => {
    if (letter === "Enter") {
      if (currentWordRef.current.length === wordLength) {
        validateWord(currentWordRef.current.join(""));
      }
      return;
    }
    if (letter === "Backspace") {
      popLetterInCurrentWord();
      return;
    }
    if (letter.match(/[a-zA-Z]/)) {
      if (currentWordRef.current.length >= wordLength) return;
      pushLetterInCurrentWord(letter.toUpperCase());
      return;
    }
  };

  const pushLetterInCurrentWord = (letter: string) => {
    setCurrentWord((freshLetters) => {
      const newLetters = [...freshLetters];
      newLetters.push(letter);
      return [...newLetters];
    });
  };

  const popLetterInCurrentWord = () => {
    setCurrentWord((freshLetters) => {
      const newLetters = [...freshLetters];
      newLetters.pop();
      return [...newLetters];
    });
  };

  const focusTextInput = () => {
    if (hiddenTryInput.current) {
      hiddenTryInput.current.focus();
    }
  };

  const handleKeyboardInput = (event: InputEvent) => {
    if (event.inputType === "insertText" && event.data) {
      if (event.data.match(/[a-zA-Z]/)) {
        if (currentWordRef.current.length >= wordLength) return;
        pushLetterInCurrentWord(event.data.toUpperCase());
      }
      return;
    }
    if (event.inputType === "insertLineBreak") {
      if (currentWordRef.current.length === wordLength) {
        validateWord(currentWordRef.current.join(""));
      }
      return;
    }
    if (event.inputType === "deleteContentBackward") {
      popLetterInCurrentWord();
      return;
    }
  };

  const playAgain = () => {
    setNewTries(Array(maxTries).fill([]));
    setNewEditId(0);
    setCurrentWord([]);
    setAnswerSubmitted(AnswerStatus.None);
    setAlertMessage(null);
    window.localStorage.removeItem(triesLocalStorageKey);
    window.localStorage.removeItem(editIdLocalStorageKey);
    window.localStorage.removeItem(dateLocalStorageKey);
    hiddenTryInput.current?.focus();
  };

  const revealWord = async () => {
    const api = new WordleCloneApi();
    let answer;
    const forceDate = window.localStorage.getItem("force-date");
    if (forceDate) answer = await api.getAnswer(forceDate);
    else answer = await api.getAnswer();
    const { word } = (await answer.json()) as {
      word: string;
    };
    setAlertMessage({
      message: "The word was " + word,
      status: "info",
    });
  };

  updateValidAndPresentLetters(tries);

  return (
    <>
      <div className="flex items-center flex-col p-[2rem] gap-[2rem] relative">
        <Alert alertMessage={alertMessage}></Alert>
        <div
          className={"words-container containing-box"}
          onClick={() => {
            focusTextInput();
          }}
        >
          <textarea
            ref={hiddenTryInput}
            autoFocus
            className="mobile-input"
            onInput={(event) => {
              handleKeyboardInput(event.nativeEvent as InputEvent);
            }}
          />
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
                wordTry={
                  index === editableWordId
                    ? currentWord.map((letter) => ({
                        letter,
                        status: LetterStatus.IDLE,
                      }))
                    : wordTry
                }
                wordLength={wordLength}
                isEditable={index === editableWordId}
              ></Word>
            );
          })}
        </div>
        <div className="max-w-[100vw] flex flex-col items-center gap-[1rem]">
          <ForceDate></ForceDate>
          <div className="min-h-[3rem] flex gap-[1rem]">
            <button
              className={
                "play-again " + (editableWordId === -1 ? "" : "hidden")
              }
              onClick={() => {
                playAgain();
              }}
            >
              Clear tries
            </button>
            <button
              className={
                "reveal-words " + (editableWordId === -1 ? "" : "hidden")
              }
              onClick={() => {
                revealWord();
              }}
            >
              Reveal word
            </button>
          </div>
          <Keyboard
            validLetters={validLetters}
            presentLetters={presentLetters}
            wrongLetters={wrongLetters}
            keyboardLetterClicked={(letter: string) => {
              letterInputTriggered(letter);
            }}
          ></Keyboard>
        </div>
      </div>
    </>
  );
};

export default WordleGame;
