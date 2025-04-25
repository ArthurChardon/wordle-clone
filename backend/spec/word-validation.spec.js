import { wordValidation } from "../game-utils/word-validation.js";

describe("wordValidation unique letters: LEGIT", () => {
  it("wordValidation LEGIT LEGIT", () => {
    expect(wordValidation("LEGIT", "LEGIT")).toEqual({
      wordTry: [
        { letter: "L", status: "correct" },
        { letter: "E", status: "correct" },
        { letter: "G", status: "correct" },
        { letter: "I", status: "correct" },
        { letter: "T", status: "correct" },
      ],
      success: true,
    });
  });

  it("wordValidation MAGIC LEGIT", () => {
    expect(wordValidation("MAGIC", "LEGIT")).toEqual({
      wordTry: [
        { letter: "M", status: "wrong" },
        { letter: "A", status: "wrong" },
        { letter: "G", status: "correct" },
        { letter: "I", status: "correct" },
        { letter: "C", status: "wrong" },
      ],
      success: false,
    });
  });

  it("wordValidation TALES LEGIT", () => {
    expect(wordValidation("TALES", "LEGIT")).toEqual({
      wordTry: [
        { letter: "T", status: "present" },
        { letter: "A", status: "wrong" },
        { letter: "L", status: "present" },
        { letter: "E", status: "present" },
        { letter: "S", status: "wrong" },
      ],
      success: false,
    });
  });
});

describe("wordValidation with duplicates: EAGLE", () => {
  it("wordValidation EAGLE EAGLE", () => {
    expect(wordValidation("EAGLE", "EAGLE")).toEqual({
      wordTry: [
        { letter: "E", status: "correct" },
        { letter: "A", status: "correct" },
        { letter: "G", status: "correct" },
        { letter: "L", status: "correct" },
        { letter: "E", status: "correct" },
      ],
      success: true,
    });
  });

  it("wordValidation LEGAL EAGLE", () => {
    expect(wordValidation("LEGAL", "EAGLE")).toEqual({
      wordTry: [
        { letter: "L", status: "present" },
        { letter: "E", status: "present" },
        { letter: "G", status: "correct" },
        { letter: "A", status: "present" },
        { letter: "L", status: "wrong" },
      ],
      success: false,
    });
  });

  it("wordValidation LEETS EAGLE", () => {
    expect(wordValidation("LEETS", "EAGLE")).toEqual({
      wordTry: [
        { letter: "L", status: "present" },
        { letter: "E", status: "present" },
        { letter: "E", status: "present" },
        { letter: "T", status: "wrong" },
        { letter: "S", status: "wrong" },
      ],
      success: false,
    });
  });

  it("wordValidation EEEEE EAGLE", () => {
    expect(wordValidation("EEEEE", "EAGLE")).toEqual({
      wordTry: [
        { letter: "E", status: "correct" },
        { letter: "E", status: "wrong" },
        { letter: "E", status: "wrong" },
        { letter: "E", status: "wrong" },
        { letter: "E", status: "correct" },
      ],
      success: false,
    });
  });

  it("wordValidation DEEED EAGLE", () => {
    expect(wordValidation("DEEED", "EAGLE")).toEqual({
      wordTry: [
        { letter: "D", status: "wrong" },
        { letter: "E", status: "present" },
        { letter: "E", status: "present" },
        { letter: "E", status: "wrong" },
        { letter: "D", status: "wrong" },
      ],
      success: false,
    });
  });
});
