import { getUserById } from "../users/userRooms.js";

export type messageType = {
  message?: string;
  date: string;
  user: string | undefined;
  pathImage?: string;
};

export function formatMessage(
  id: string,
  msg?: string,
  pathImage?: string
): messageType {
  const date = new Date();
  //("id : ", id);
  return {
    message: msg,
    date: `${date.getHours()}:${date.getMinutes()}`,
    user: getUserById(id)?.pseudo,
    pathImage,
  };
}
