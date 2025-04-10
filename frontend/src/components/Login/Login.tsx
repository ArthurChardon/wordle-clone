import "./Login.css";

const Login = () => {
  return (
    <>
      <div className="flex items-center w-full justify-center gap-[3rem] grow">
        <div>
          <div className="container-box bg-white px-[2rem] py-[1.5rem] rounded-xl">
            <h1 className="text-jet-black">
              <strong>Log in</strong> to save your progress
            </h1>
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
              <div className="flex gap-[2rem] items-center">
                <button type="submit">Login</button>
                <a href="/auth/google" className="btn">
                  Sign in with Google
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="container-box bg-white px-[2rem] py-[1.5rem] rounded-xl">
          <h1>
            <strong>Sign up</strong> to start your journey
          </h1>
          <form method="post" action="/api/signup">
            <div className="flex flex-col">
              <label htmlFor="signup-email">Email:</label>
              <input type="text" name="email" id="signup-email"></input>
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
            <p>
              <button type="submit">Sign up</button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
