import { WordleCloneApi } from "../../apis/WordleCloneApi";

const Login = () => {
  const login = async (username: string, password: string) => {
    const api = new WordleCloneApi();
    await api.login(username, password);
  };

  return (
    <div className="flex items-center">
      <div>
        <form method="post" action="/login" rel="noopener" target="_blank">
          <p>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="login-username"></input>
          </p>
          <p>
            <label htmlFor="password">Password:</label>
            <input type="text" name="password" id="login-password"></input>
          </p>
          <p>
            <button
              type="button"
              onClick={() => {
                login("acc", "pwd");
              }}
            >
              Login
            </button>
          </p>
        </form>

        <div className="sso-container">
          <div className="container">
            <p>Click the button below to sign in with Google:</p>
            <a href="/auth/google" className="btn">
              Sign in with Google
            </a>
          </div>
        </div>
      </div>

      <form method="post" action="/signup" rel="noopener" target="_blank">
        <p>
          <label htmlFor="email">Email:</label>
          <input type="text" name="email" id="signup-email"></input>
        </p>
        <p>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="signup-username"></input>
        </p>
        <p>
          <label htmlFor="password">Password:</label>
          <input type="text" name="password" id="signup-password"></input>
        </p>
        <p>
          <input type="submit" value="Create account"></input>
        </p>
      </form>
    </div>
  );
};

export default Login;
