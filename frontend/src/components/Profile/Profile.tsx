import "./Profile.css";
import { WordleCloneApi } from "../../apis/WordleCloneApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const authContext = useAuth();
  const user = authContext?.user;

  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Welcome!");
  const [successes, setSuccesses] = useState([]);
  const [verifiedAccount, setVerifiedAccount] = useState(false);

  useEffect(() => {
    const api = new WordleCloneApi();
    api.getProfile().then((response) => {
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      response.json().then((result) => {
        setSuccesses(result.profile.successes);
        setVerifiedAccount(result.user.emailVerified);
      });
    });
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 7 || hour >= 22) return setGreeting("Good night");
    if (hour >= 7 && hour < 13) return setGreeting("Good morning");
    if (hour >= 13 && hour < 18) return setGreeting("Good afternoon");
    if (hour >= 18 && hour < 22) return setGreeting("Good evening");
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-center">
          {greeting} at{" "}
          <span className="font-[Bungee] main-title">
            W<mark>O</mark>R<mark>D</mark>Y
          </span>
          <br></br>
          {user?.username} !
        </h2>
        <div className="grid grid-cols-2 gap-[1rem]">
          <form
            className="p-[1rem] flex flex-col gap-[.5rem]"
            method="post"
            action="api/profile/edit"
          >
            <div className="flex flex-col">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="profile-username"
                defaultValue={user?.username}
              ></input>
            </div>
            <button type="submit">Update profile</button>
          </form>
          <div className="p-[1rem]">
            <div>
              {verifiedAccount
                ? "You account is verified."
                : "Please verify your account."}
            </div>
            <div>
              {successes.length
                ? "You have successfully completed " +
                  successes.length +
                  "challenges!"
                : "You have not yet completed any challenges."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
