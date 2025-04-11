import "./Profile.css";
import { WordleCloneApi } from "../../apis/WordleCloneApi";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const authContext = useAuth();
  const user = authContext?.user;

  const navigate = useNavigate();

  useEffect(() => {
    const api = new WordleCloneApi();
    api.getProfile().then((response) => {
      if (response.status === 401) {
        navigate("/login");
      }
    });
  });

  return (
    <>
      <div className="flex flex-col items-center">
        <h1>Welcome to Wordle Clone {user?.username} !</h1>
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
