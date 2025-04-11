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

  useEffect(() => {
    const api = new WordleCloneApi();
    api.getProfile().then((response) => {
      if (response.status === 401) {
        navigate("/login");
      }
    });
  });

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
        <h2>
          {greeting} at Wordle Clone {user?.username} !
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
            <label>You have successfully completed {3} challenges!</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
