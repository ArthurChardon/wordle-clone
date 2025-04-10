import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const user = useAuth()?.user;

  //TODO put it on help page
  const [greeting, setGreeting] = useState("Welcome!");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 7 || hour >= 22) return setGreeting("Good night!");
    if (hour >= 7 && hour < 13) return setGreeting("Good morning!");
    if (hour >= 13 && hour < 18) return setGreeting("Good afternoon!");
    if (hour >= 18 && hour < 22) return setGreeting("Good evening!");
  }, []);

  return (
    <>
      <nav className="flex gap-[1rem] p-[1rem] justify-end items-center">
        <h2 className="mr-[5rem] block opacity-0">{greeting}</h2>
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
    </>
  );
};

export default Navbar;
