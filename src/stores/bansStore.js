import { map, atom } from "nanostores";

export const bans = map([]);

const fetchBans = async () => {
  const api = "https://baltimare.org/hhapi/estatebannedusers";
  try {
    const response = await fetch(api);
    const data = await response.json();

    bans.set(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export function updateBans() {
  fetchBans();
}