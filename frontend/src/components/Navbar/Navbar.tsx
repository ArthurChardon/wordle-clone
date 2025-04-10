import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const user = useAuth()?.user;
  return (
    <nav className="flex gap-[1rem] p-[1rem] justify-end">
      <Link to="/">
        <img src="letter-w.svg" width="50" height="50"></img>
      </Link>
      {!user && (
        <Link to="/login">
          <img src="login.svg" width="50" height="50"></img>
        </Link>
      )}
      {user && (
        <>
          <Link to="/profile">
            <img src="person.svg" width="50" height="50"></img>
          </Link>
          <Link to="/logout">
            <img src="logout.svg" width="50" height="50"></img>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
