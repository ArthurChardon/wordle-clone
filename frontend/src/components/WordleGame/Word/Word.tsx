import "./Word.css";
import { LetterStatus } from "../../../types/words";

const Word = ({
  isEditable = false,
  wordElementId,
  wordLength,
  wordTry,
}: {
  isEditable?: boolean;
  wordElementId: string;
  wordLength: number;
  wordTry: { letter: string; status: LetterStatus }[];
}) => {
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
            grid grid-cols-5 gap-[.5rem] w-[19.5rem] h-[3.5rem] xl:w-[22rem] xl:h-[4rem] 3xl:w-[27rem] 3xl:h-[5rem]"
      >
        {Array.from({ length: wordLength }, (_, index) => (
          <div
            key={index}
            className={
              "word-letter wordle-letter text-[1.75rem] xl:text-[2.75rem] " +
              getLetterStatusClasses(index)
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
