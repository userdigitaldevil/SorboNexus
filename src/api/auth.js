// src/api/auth.js

export async function login(username, password) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );
  const data = await response.json();
  if (!response.ok || !data.token) {
    throw new Error(data.error || "Identifiants invalides");
  }
  return data;
}
