export class WordleCloneApi {
  baseURL = import.meta.env.VITE_WORDLE_CLONE_API_URL;

  public submitWord = async (word: string, date?: string) => {
    return fetch(`/api/game/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word, date }),
    });
  };

  public getAnswer = async (date?: string) => {
    return fetch("/api/game/answer" + (date ? `?date=${date}` : ""), {
      method: "GET",
    });
  };

  public getProfile = async () => {
    return fetch("/api/profile", {
      method: "GET",
      credentials: "include",
    });
  };
}
