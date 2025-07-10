const API_URL = import.meta.env.VITE_API_URL;

class BookmarkService {
  // Get authentication token
  getToken() {
    return localStorage.getItem("token");
  }

  // Add a bookmark
  async addBookmark(itemId, itemType) {
    try {
      const response = await fetch(`${API_URL}/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ itemId, itemType }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add bookmark");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  }

  // Remove a bookmark
  async removeBookmark(itemId, itemType) {
    try {
      const response = await fetch(
        `${API_URL}/api/bookmarks/${itemId}?itemType=${itemType}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove bookmark");
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  }

  // Toggle bookmark (add if not exists, remove if exists)
  async toggleBookmark(itemId, itemType) {
    try {
      const isBookmarked = await this.checkBookmark(itemId, itemType);

      if (isBookmarked) {
        return await this.removeBookmark(itemId, itemType);
      } else {
        return await this.addBookmark(itemId, itemType);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  }

  // Check if user has bookmarked an item
  async checkBookmark(itemId, itemType) {
    try {
      const response = await fetch(
        `${API_URL}/api/bookmarks/check/${itemId}?itemType=${itemType}`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to check bookmark status");
      }

      const data = await response.json();
      return data.isBookmarked;
    } catch (error) {
      console.error("Error checking bookmark:", error);
      return false;
    }
  }

  // Get user's bookmarks
  async getUserBookmarks(userId, itemType = null) {
    try {
      let url = `${API_URL}/api/bookmarks/user/${userId}`;
      if (itemType) {
        url += `?itemType=${itemType}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch user bookmarks");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
      throw error;
    }
  }

  // Get bookmark count for an item
  async getBookmarkCount(itemId, itemType) {
    try {
      const response = await fetch(
        `${API_URL}/api/bookmarks/count/${itemId}?itemType=${itemType}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch bookmark count");
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error("Error fetching bookmark count:", error);
      return 0;
    }
  }

  // Get user's bookmarked item IDs as a Set (for efficient lookup)
  async getBookmarkedItemIds(userId, itemType = null) {
    try {
      const bookmarks = await this.getUserBookmarks(userId, itemType);
      return new Set(bookmarks.map((bookmark) => bookmark.itemId));
    } catch (error) {
      console.error("Error fetching bookmarked item IDs:", error);
      return new Set();
    }
  }
}

export default new BookmarkService();
