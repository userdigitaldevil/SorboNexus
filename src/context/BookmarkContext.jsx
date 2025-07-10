import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as bookmarkApi from "../api/bookmarks";
import { jwtDecode } from "jwt-decode";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState({}); // { itemType: Set(itemId) }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (e) {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  // Load all bookmarks for all types on mount or user change
  const loadBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarks({});
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch bookmarks for all types
      const types = ["alumni", "ressource", "link"];
      const all = {};
      for (const type of types) {
        const ids = await bookmarkApi.getBookmarkedItemIds(userId, type);
        all[type] = ids;
      }
      setBookmarks(all);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Toggle bookmark for an item
  const toggleBookmark = useCallback(
    async (itemId, itemType) => {
      if (!userId) {
        setError("User not authenticated");
        return;
      }
      try {
        setError(null);
        await bookmarkApi.toggleBookmark(itemId, itemType);
        setBookmarks((prev) => {
          const prevSet = prev[itemType] || new Set();
          const newSet = new Set(prevSet);
          if (newSet.has(itemId)) {
            newSet.delete(itemId);
          } else {
            newSet.add(itemId);
          }
          return { ...prev, [itemType]: newSet };
        });
      } catch (err) {
        setError(err.message);
      }
    },
    [userId]
  );

  // Check if an item is bookmarked
  const isBookmarked = useCallback(
    (itemId, itemType) => {
      return bookmarks[itemType]?.has(itemId) || false;
    },
    [bookmarks]
  );

  // Refresh bookmarks (e.g., after login/logout)
  const refreshBookmarks = useCallback(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        loading,
        error,
        toggleBookmark,
        isBookmarked,
        refreshBookmarks,
        userId,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  return useContext(BookmarkContext);
}
