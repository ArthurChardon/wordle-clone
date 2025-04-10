import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import "./App.css";
import WordleGame from "./components/WordleGame/WordleGame";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile/Profile";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<WordleGame />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
