import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData } from "./socketConfig.js";
import {
  getAlluserByRoom,
  getUserById,
  removeUser,
  saveUser,
} from "./services/userRooms.js";
import { formatMessage } from "./services/formatMessage.js";

class SocketIO {
  constructor(
    public io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {}

  /**
   * Lunch the connection event on io
   */
  startSocket = () => {
    this.io.on("connection", this.connection);
  };

  connection = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    console.log("new user ");

    socket.on("sendInfo", ({ pseudo }: SocketData) => {
      saveUser({ pseudo, id: socket.id });
      // socket.broadcast.emit("newUser", { speudo });
      this.io.emit("newUser", { pseudo }, getAlluserByRoom());
    });

    socket.on("send-msg", (msg: string) => {
      socket.broadcast.emit("receive-msg", formatMessage(msg, socket.id));
    });

    socket.on("disconnect", function () {
      socket.broadcast.emit(
        "userDisconnect",
        removeUser(socket.id)?.pseudo,
        getAlluserByRoom()
      );
    });

    // is typping
    socket.on("is-typping", function () {
      console.log(+" is typping...");

      socket.broadcast.emit("user-typping", getUserById(socket.id)?.pseudo);
    });

    socket.on("stop-typping", function () {
      console.log(getUserById(socket.id)?.pseudo + " stop typping...");
      socket.broadcast.emit("user-stop", getUserById(socket.id)?.pseudo);
    });
  };
}

export default SocketIO;
