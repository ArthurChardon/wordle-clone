export class WordleCloneApi {
  baseURL = import.meta.env.VITE_WORDLE_CLONE_API_URL;

  public submitWord = async (word: string) => {
    return fetch(`/api/game/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });
  };

  public getProfile = async () => {
    return fetch("/api/profile", {
      method: "GET",
      credentials: "include",
    });
  };
}
