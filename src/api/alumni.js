// src/api/alumni.js

export async function getAlumni() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni`);
  if (!response.ok) throw new Error("Erreur lors du chargement des alumni");
  return response.json();
}

export async function getAlumniById(id) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/alumni/${id}`
  );
  if (!response.ok) throw new Error("Erreur lors du chargement de l'alumni");
  return response.json();
}

export async function deleteAlumni(id, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/alumni/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function getAlumniCount() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni`);
  if (!response.ok) throw new Error("Erreur lors du chargement des alumni");
  const data = await response.json();
  return data.length;
}
