import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData } from "./socketConfig.js";

import {
  getAlluserByRoom,
  getUserById,
  getUserByRoomAndName,
  removeUser,
  saveUser,
} from "./users/userRooms.js";

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

    socket.on("sendInfo", ({ pseudo, room }: SocketData) => {
      const userPresent = getUserByRoomAndName({ pseudo, room });

      if (userPresent) {
        socket
          .to(room)
          .emit("newUser", { pseudo, room }, getAlluserByRoom(room));
        return;
      }

      socket.join(room);
      saveUser({ pseudo, id: socket.id, room });
      // make the actual user join the room
      // join a specifique room
      this.io
        .to(room)
        .emit("newUser", { pseudo, room }, getAlluserByRoom(room));
    });

    socket.on("send-msg", (msg: string) => {
      const user = getUserById(socket.id);

      if (!user) {
        console.log("user not found : ", socket.id);
        return;
      }
      socket.broadcast
        .to(user.room)
        .emit("receive-msg", formatMessage(msg, socket.id));
    });

    socket.on("disconnect", function () {
      const user = getUserById(socket.id);

      if (!user) {
        console.log("user not found : ", socket.id);
        return;
      }

      removeUser(socket.id);

      socket.broadcast
        .to(user.room)
        .emit("userDisconnect", user, getAlluserByRoom(user.room));
    });

    // is typping
    socket.on("is-typping", function () {
      const user = getUserById(socket.id);

      if (!user) {
        console.log("user not found : ", socket.id);
        return;
      }

      console.log(user.room + " is typping... ", user.pseudo);

      socket.broadcast.to(user.room).emit("user-typping", user.pseudo);
    });

    socket.on("stop-typping", function () {
      const user = getUserById(socket.id);

      if (!user) {
        console.log("user not found : ", socket.id);
        return;
      }

      console.log(user.pseudo + " stop typping...");
      socket.broadcast.to(user.room).emit("user-stop", user.pseudo);
    });
  };
}

export default SocketIO;
