// src/api/ressources.js

export async function getRessources() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/ressources`
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des ressources");
  return response.json();
}

export async function addRessource(payload, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/ressources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'ajout de la ressource");
  return response.json();
}

export async function editRessource(id, payload, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/ressources/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la modification de la ressource");
  return response.json();
}

export async function deleteRessource(id, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/ressources/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de la ressource");
  return response;
}
