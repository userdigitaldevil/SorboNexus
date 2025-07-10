// src/api/upload.js

export async function uploadFile(file, token) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/upload`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'upload du fichier");
  const data = await response.json();
  if (!data.filename) throw new Error("Réponse d'upload invalide");
  return data;
}
