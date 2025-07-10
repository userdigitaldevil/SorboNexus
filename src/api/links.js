// src/api/links.js

export async function getLinks() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/links`
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des liens");
  return response.json();
}

export async function addLink(payload, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/links`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'ajout du lien");
  return response.json();
}

export async function editLink(id, payload, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/links/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la modification du lien");
  return response.json();
}

export async function deleteLink(id, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/links/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la suppression du lien");
  return response;
}
