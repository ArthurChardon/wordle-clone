import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="flex gap-[1rem] p-[1rem] justify-end">
      <Link to="/">
        <img src="letter-w.svg" width="50" height="50"></img>
      </Link>
      <Link to="/profile">
        {" "}
        <img src="person.svg" width="50" height="50"></img>
      </Link>
    </nav>
  );
};

export default Navbar;
