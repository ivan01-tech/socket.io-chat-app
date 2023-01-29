import { messageType } from "./services/formatMessage";
import { userType } from "./users/userRooms";

export type SocketData = {
  pseudo: string;
  room: string;
};

export interface ServerToClientEvents {
  newUser: (obj: SocketData, users: userType[]) => void;
  receiveMsg: (a: messageType) => void;
  userDisconnect: (d: userType, users: userType[]) => void;
  userStop: (d: string) => void;
  userTypping: (d: string) => void;
}

export interface ClientToServerEvents {
  sendInfo: (obj: SocketData) => void;
  sendMsg: (msg: string | undefined, imagePath: string | undefined) => void;
  stopTypping: () => void;
  isTypping: () => void;
}

// export interface InterServerEvents {
//   ping: () => void;
// }
