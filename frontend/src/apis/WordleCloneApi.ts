export class WordleCloneApi {
  baseURL = import.meta.env.VITE_WORDLE_CLONE_API_URL;

  public login = async (username: string, password: string) => {
    return fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  };

  public submitWord = async (word: string) => {
    return fetch(`/api/game/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });
  };
}
