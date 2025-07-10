import { useBookmarkContext } from "../context/BookmarkContext";

export default function useBookmarks(itemType) {
  const {
    bookmarks,
    loading,
    error,
    toggleBookmark,
    isBookmarked,
    refreshBookmarks,
    userId,
  } = useBookmarkContext();

  return {
    bookmarkedItems: bookmarks[itemType] || new Set(),
    loading,
    error,
    toggleBookmark: (itemId) => toggleBookmark(itemId, itemType),
    isBookmarked: (itemId) => isBookmarked(itemId, itemType),
    refreshBookmarks,
    userId,
  };
}
