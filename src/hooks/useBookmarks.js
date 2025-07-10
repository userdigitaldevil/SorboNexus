import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import bookmarkService from "../services/bookmarkService";

export const useBookmarks = (itemType) => {
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id); // Use the User ID, not the Alumni ID
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  // Load user's bookmarks on mount
  useEffect(() => {
    if (userId && itemType) {
      loadBookmarks();
    } else {
      setLoading(false);
    }
  }, [userId, itemType]);

  const loadBookmarks = useCallback(async () => {
    if (!userId || !itemType) return;

    try {
      setLoading(true);
      setError(null);
      const bookmarkedIds = await bookmarkService.getBookmarkedItemIds(
        userId,
        itemType
      );
      setBookmarkedItems(bookmarkedIds);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId, itemType]);

  const toggleBookmark = useCallback(
    async (itemId) => {
      if (!userId) {
        setError("User not authenticated");
        return;
      }

      try {
        setError(null);
        await bookmarkService.toggleBookmark(itemId, itemType);

        // Update local state
        setBookmarkedItems((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(itemId)) {
            newSet.delete(itemId);
          } else {
            newSet.add(itemId);
          }
          return newSet;
        });
      } catch (error) {
        console.error("Error toggling bookmark:", error);
        setError(error.message);
      }
    },
    [userId, itemType]
  );

  const isBookmarked = useCallback(
    (itemId) => {
      return bookmarkedItems.has(itemId);
    },
    [bookmarkedItems]
  );

  const refreshBookmarks = useCallback(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarkedItems,
    loading,
    error,
    toggleBookmark,
    isBookmarked,
    refreshBookmarks,
    userId,
  };
};

export default useBookmarks;
