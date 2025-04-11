import { useEffect, useRef } from "react";

const Logout = () => {
  const logout = useRef<any>(null);

  useEffect(() => {
    if (!logout.current) return;
    logout.current.click();
  });

  return (
    <>
      <form style={{ visibility: "hidden" }} method="post" action="/api/logout">
        <button ref={logout} type="submit">
          LOGOUT
        </button>
      </form>
    </>
  );
};

export default Logout;
