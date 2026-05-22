import { HTTP_API } from "./config";

const apiBase = HTTP_API;

async function fetchJson(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getQueue(limit = 50) {
  return fetchJson(`/api/v1/radio/queue?limit=${limit}`);
}

export async function getShows() {
  return fetchJson(`/api/v1/radio/shows`);
}

export async function getStatus() {
  return fetchJson(`/status`);
}

export async function getHealth() {
  return fetchJson(`/health`);
}
