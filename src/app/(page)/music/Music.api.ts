import { BASE_URL } from "./Music.type";

export async function fetchAllMusic() {
  const res = await fetch(BASE_URL);
  const json = await res.json();
  return json.data || [];
}

export async function createMusic(data: unknown) {
  await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateMusic(id: string, data: unknown) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteMusic(id: string) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}