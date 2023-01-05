import { getUserById } from "../users/userRooms.js";

export type messageType = {
  message: string;
  date: string;
  user: string | undefined;
};

export function formatMessage(msg: string, id: string): messageType {
  const date = new Date();
  console.log("id : ", id);
  return {
    message: msg,
    date: `${date.getHours()}:${date.getMinutes()}`,
    user: getUserById(id)?.pseudo,
  };
}
