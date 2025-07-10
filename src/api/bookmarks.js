// src/api/bookmarks.js

const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

export async function addBookmark(itemId, itemType) {
  const response = await fetch(`${API_URL}/api/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ itemId, itemType }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add bookmark");
  }
  return response.json();
}

export async function removeBookmark(itemId, itemType) {
  const response = await fetch(
    `${API_URL}/api/bookmarks/${itemId}?itemType=${itemType}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove bookmark");
  }
  return response.json();
}

export async function checkBookmark(itemId, itemType) {
  const response = await fetch(
    `${API_URL}/api/bookmarks/check/${itemId}?itemType=${itemType}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to check bookmark status");
  }
  const data = await response.json();
  return data.isBookmarked;
}

export async function toggleBookmark(itemId, itemType) {
  const isBookmarked = await checkBookmark(itemId, itemType);
  if (isBookmarked) {
    return removeBookmark(itemId, itemType);
  } else {
    return addBookmark(itemId, itemType);
  }
}

export async function getUserBookmarks(userId, itemType = null) {
  let url = `${API_URL}/api/bookmarks/user/${userId}`;
  if (itemType) {
    url += `?itemType=${itemType}`;
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user bookmarks");
  }
  return response.json();
}

export async function getBookmarkCount(itemId, itemType) {
  const response = await fetch(
    `${API_URL}/api/bookmarks/count/${itemId}?itemType=${itemType}`
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch bookmark count");
  }
  const data = await response.json();
  return data.count;
}

export async function getBookmarkedItemIds(userId, itemType = null) {
  const bookmarks = await getUserBookmarks(userId, itemType);
  return new Set(bookmarks.map((bookmark) => bookmark.itemId));
}
