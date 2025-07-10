// src/api/annonces.js

export async function getAnnonces(page = 1, perPage = 3) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/annonces?skip=${
      (page - 1) * perPage
    }&take=${perPage}`
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des annonces.");
  return response.json();
}

export async function addAnnonce({ title, content }, token) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/annonces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return response;
}

export async function deleteAnnonce(id, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/annonces/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}
