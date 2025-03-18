import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import Bookmarks from "./pages/Bookmarks";
import Navbar from "./components/Navbar";
import CodeChefContests from "./pages/codechefContest";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";


const App = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        {isAuthenticated && <Route path="/bookmarks" element={<Bookmarks />} />}
        {isAuthenticated && <Route path="/admin" element={<AdminPanel />} />}
        {/* <Route path="/codechef" element={<CodeChefContests />} /> */}
        {!isAuthenticated && <Route path="/login" element={<Login />} />}
        {!isAuthenticated && <Route path="/signup" element={<Signup />} />}
      </Routes>
    </Router>
  );
};

export default App;