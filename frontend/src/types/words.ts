export enum LetterStatus {
  IDLE = "idle",
  WRONG = "wrong",
  PRESENT = "present",
  CORRECT = "correct",
}

export type TryLetter = {
  letter: string;
  status: LetterStatus;
};
