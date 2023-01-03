import { getAlluserByRoom, getUserById, removeUser, saveUser, } from "./services/userRooms.js";
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
                saveUser({ pseudo, id: socket.id, room });
                // make the actual user join the room
                socket.join(room);
                // join a specifique room
                this.io
                    .to(room)
                    .emit("newUser", { pseudo, room }, getAlluserByRoom(room));
            });
            socket.on("send-msg", (msg) => {
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
}
export default SocketIO;
