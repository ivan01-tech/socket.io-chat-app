import { getAlluserByRoom, getUserById, getUserByRoomAndName, removeUser, saveUser, } from "./users/userRooms.js";
import { formatMessage } from "./services/formatMessage.js";
class SocketIO {
    constructor(io) {
        this.io = io;
        /**
         * Lunch the connection event on io
         */
        this.startSocket = () => {
            this.io.on("connection", this.connection);
        };
        this.connection = (socket) => {
            console.log("new user ");
            socket.on("sendInfo", ({ pseudo, room }) => {
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
            socket.on("sendMsg", (msg, pathImage) => {
                const user = getUserById({ id: socket.id });
                if (!user) {
                    console.log("user not found : ", socket.id);
                    return;
                }
                socket.broadcast
                    .to(user.room)
                    .emit("receiveMsg", formatMessage(socket.id, msg, pathImage));
            });
            socket.on("disconnect", function () {
                const user = getUserById({ id: socket.id });
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
            socket.on("isTypping", function () {
                const user = getUserById({ id: socket.id });
                if (!user) {
                    console.log("user not found : ", socket.id);
                    return;
                }
                console.log(user.room + " is typping... ", user.pseudo);
                socket.broadcast.to(user.room).emit("userTypping", user.pseudo);
            });
            socket.on("stopTypping", function () {
                const user = getUserById({ id: socket.id });
                if (!user) {
                    console.log("user not found : ", socket.id);
                    return;
                }
                console.log(user.pseudo + " stop typping...");
                socket.broadcast.to(user.room).emit("userStop", user.pseudo);
            });
        };
    }
}
export default SocketIO;
