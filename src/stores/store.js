import { map, atom } from "nanostores";

export const avatarPosBaltimare = map([]);
export const avatarPosHorseHeights = map([]);
export const avatarPosObjBaltimare = map({});
export const avatarPosObjHorseHeights = map({});

const fetchAvatarPositionsBaltimare = async () => {
  const api = "https://api.baltimare.org/corrade/getavatarpositions";
  try {
    const response = await fetch(api);
    const data = await response.json();

    avatarPosBaltimare.set(
      data.map((user) => ({
      ...user,
      UUID: user.user_uuid,
      user_position: user.user_position.slice(1, -1).split(",").map(Number),
    })));

    avatarPosObjBaltimare.set(
      avatarPosBaltimare.value.reduce(
      (acc, { user_uuid, ...rest }) => {
        acc[user_uuid] = rest;
        return acc;
      },
      {}
    ));
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

const fetchAvatarPositionsHorseHeights = async () => {
  const api = "https://api.baltimare.org/hhapi/getavatarpositions";
  try {
    const response = await fetch(api);
    const data = await response.json();

    avatarPosHorseHeights.set(
      data.map((user) => ({
      ...user,
      UUID: user.user_uuid,
      user_position: user.user_position.slice(1, -1).split(",").map(Number),
    })));

    avatarPosObjHorseHeights.set(
      avatarPosHorseHeights.value.reduce(
      (acc, { user_uuid, ...rest }) => {
        acc[user_uuid] = rest;
        return acc;
      },
      {}
    ));
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

export function updateData() {
  setInterval(() => {
    fetchAvatarPositionsBaltimare();
    fetchAvatarPositionsHorseHeights();
  }, 1000);
}
