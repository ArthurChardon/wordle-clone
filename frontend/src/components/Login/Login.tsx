import { useSearchParams } from "react-router-dom";
import "./Login.css";

enum LoginError {
  noError,
  badLogin,
  duplicateUser,
}

const Login = () => {
  const [searchParams] = useSearchParams();
  const errorCase = Number(searchParams.get("error") ?? 0);

  const getErrorText = (errorCase: LoginError) => {
    switch (errorCase) {
      case LoginError.badLogin:
        return "Incorrect username or password. Please try again.";

      case LoginError.duplicateUser:
        return "This username already exists. Please choose another.";
    }
  };

  return (
    <>
      <div className="flex items-center w-full justify-center gap-[3rem] grow relative">
        {errorCase > 0 && (
          <div className="error-case">{getErrorText(errorCase)}</div>
        )}
        <div className="containing-box login-box">
          <h2 className="text-jet-black">
            <strong>Log in</strong> to save your progress
          </h2>
          <form method="post" action="/api/login">
            <div className="flex flex-col">
              <label htmlFor="login-username">Username:</label>
              <input type="text" name="username" id="login-username"></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="login-password">Password:</label>
              <input
                type="password"
                name="password"
                id="login-password"
              ></input>
            </div>
            <div className="grid grid-cols-2 gap-[2rem] items-center">
              <button type="submit">Login</button>
              <a className="a-google-signin" href="/api/auth/google">
                Sign in with Google
                <div className="a-google-logo"></div>
              </a>
            </div>
          </form>
        </div>

        <div className="containing-box login-box">
          <h2>
            <strong>Sign up</strong> to start your journey
          </h2>
          <form method="post" action="/api/signup">
            <div className="flex flex-col">
              <label htmlFor="signup-email">Email:</label>
              <input
                type="email"
                autoComplete="on"
                name="email"
                id="signup-email"
              ></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="signup-username">Username:</label>
              <input type="text" name="username" id="signup-username"></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="signup-password">Password:</label>
              <input
                type="password"
                name="password"
                id="signup-password"
              ></input>
            </div>
            <div className="flex">
              <button className="grow" type="submit">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
