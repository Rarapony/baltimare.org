import { map, atom } from "nanostores";

export const users = map([]);
export const avatarPos = map([]);
export const avatarPosObj = map({});


const fetchUsers = async () => {
  const api = "https://baltimare.org/corrade/onlineusers";
  try {
    const response = await fetch(api);
    const data = await response.json();
    users.set(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

const fetchAvatarPositions = async () => {
  const api = "https://baltimare.org/corrade/getavatarpositions";
  try {
    const response = await fetch(api);
    const data = await response.json();

    avatarPos.set(
      data.map((user) => ({
      ...user,
      UUID: user.user_uuid,
      user_position: user.user_position.slice(1, -1).split(",").map(Number),
    })));

    avatarPosObj.set(
      avatarPos.value.reduce(
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
    fetchUsers();
    fetchAvatarPositions();
  }, 1000);
}
