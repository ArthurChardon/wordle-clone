import "./Keyboard.css";

const Keyboard = ({
  validLetters,
  presentLetters,
  wrongLetters,
  keyboardLetterClicked,
}: {
  validLetters: string[];
  presentLetters: string[];
  wrongLetters: string[];
  keyboardLetterClicked: (letter: string) => void;
}) => {
  const firstRow = "AZERTYUIOP";
  const secondRow = "QSDFGHJKLM";
  const thirdRow = "WXCVBN";

  const getLetterStatusClasses = (letter: string) => {
    if (validLetters.includes(letter)) return "valid";
    if (presentLetters.includes(letter)) return "present";
    if (wrongLetters.includes(letter)) return "wrong";
    return "";
  };

  return (
    <div className="flex gap-[.5rem]">
      <div className="flex flex-col items-center gap-[.5rem]">
        {Array.from([firstRow, secondRow, thirdRow]).map((row, index) => (
          <div className="flex gap-[.5rem]" key={index}>
            {Array.from(row).map((letter) => (
              <button
                key={letter}
                tabIndex={0}
                className={
                  "wordle-letter keyboard-letter " +
                  getLetterStatusClasses(letter)
                }
                onClick={() => {
                  keyboardLetterClicked(letter);
                }}
              >
                <span>{letter}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <button
          className={"wordle-letter keyboard-letter"}
          tabIndex={0}
          onClick={() => {
            keyboardLetterClicked("Backspace");
          }}
        >
          <span aria-label="Delete">⟵</span>
        </button>
        <button
          className={"wordle-letter keyboard-letter"}
          tabIndex={0}
          onClick={() => {
            keyboardLetterClicked("Enter");
          }}
        >
          <span aria-label="Enter">⤶</span>
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
