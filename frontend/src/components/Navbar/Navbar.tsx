import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const user = useAuth()?.user;

  return (
    <>
      <header className="flex justify-between items-center p-[1rem]">
        <Link to="/">
          <h1 className="main-title main-title-link">
            W<mark>O</mark>R<mark>D</mark>Y
          </h1>
        </Link>
        <nav className="flex gap-[1rem] justify-end items-center">
          <Link to="/">
            <img src="letter-w.svg" width="50" height="50" alt="home"></img>
          </Link>
          {!user && (
            <Link to="/login">
              <img src="login.svg" width="50" height="50" alt="login"></img>
            </Link>
          )}
          {user && (
            <>
              <Link to="/profile">
                <img
                  src="person.svg"
                  width="50"
                  height="50"
                  alt="profile"
                ></img>
              </Link>
              <Link to="/logout">
                <img src="logout.svg" width="50" height="50" alt="logout"></img>
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
