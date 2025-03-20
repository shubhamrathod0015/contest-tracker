import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import API from "../services/api";

const BookmarkContext = createContext();

const BookmarkProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);

  
  const fetchBookmarks = async () => {
    if (!user) return;
    const res = await API.get("/bookmarks", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setBookmarks(res.data);
  };
  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user]);

  const addBookmark = async (contestId) => {
    if (!user) return;
    await API.post("bookmarks", { contestId }, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchBookmarks();
  };

  const removeBookmark = async (contestId) => {
    if (!user) return;
    await API.delete(`/bookmarks/${contestId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchBookmarks();
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export { BookmarkContext, BookmarkProvider };
