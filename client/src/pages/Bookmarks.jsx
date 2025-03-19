import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Bookmarks = () => {
  const { user, token } = useContext(AuthContext);
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    if (!user || !token) return;

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get("/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarked(res.data);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, [user, token]);

  const removeBookmark = async (bookmarkId) => {
    if (!bookmarkId) {
      toast.error("Invalid bookmark ID.");
      return;
    }

    try {
      await axios.delete(`/api/bookmarks/${bookmarkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookmarked((prev) => prev.filter((bookmark) => bookmark._id !== bookmarkId));
      toast.success("Bookmark removed.");

      const event = new Event("bookmark-updated");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark.");
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold text-purple-500">Bookmarked Contests</h2>
        <p>Please log in to view your bookmarked contests.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:mx-[120px] mt-3 rounded-md shadow-lg">
      <h2 className="text-xl font-bold text-purple-500">Bookmarked Contests</h2>
      <ul>
        {bookmarked.map((bookmark) => (
          <li key={bookmark._id} className="mt-2 p-3 border rounded-sm shadow-md flex justify-between items-center">
            <div>
              <Link
                to={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-semibold"
              >
                {bookmark.title} ({bookmark.platform})
              </Link>
              <p className="text-gray-600 text-sm">
                Starts at: {new Date(bookmark.startTime).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => removeBookmark(bookmark._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookmarks;
