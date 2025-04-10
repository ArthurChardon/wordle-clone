const Login = () => {
  return (
    <div className="flex items-center">
      <div>
        <form method="post" action="/api/login">
          <p>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="login-username"></input>
          </p>
          <p>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="login-password"></input>
          </p>
          <p>
            <button type="submit">Login</button>
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

      <form method="post" action="/api/signup">
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
          <input type="password" name="password" id="signup-password"></input>
        </p>
        <p>
          <button type="submit">Sign up</button>
        </p>
      </form>
    </div>
  );
};

export default Login;
