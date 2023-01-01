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
            socket.on("sendInfo", ({ pseudo }) => {
                saveUser({ pseudo, id: socket.id });
                // socket.broadcast.emit("newUser", { speudo });
                this.io.emit("newUser", { pseudo }, getAlluserByRoom());
            });
            socket.on("send-msg", (msg) => {
                socket.broadcast.emit("receive-msg", formatMessage(msg, socket.id));
            });
            socket.on("disconnect", function () {
                var _a;
                socket.broadcast.emit("userDisconnect", (_a = removeUser(socket.id)) === null || _a === void 0 ? void 0 : _a.pseudo, getAlluserByRoom());
            });
            // is typping
            socket.on("is-typping", function () {
                var _a;
                console.log(+" is typping...");
                socket.broadcast.emit("user-typping", (_a = getUserById(socket.id)) === null || _a === void 0 ? void 0 : _a.pseudo);
            });
            socket.on("stop-typping", function () {
                var _a, _b;
                console.log(((_a = getUserById(socket.id)) === null || _a === void 0 ? void 0 : _a.pseudo) + " stop typping...");
                socket.broadcast.emit("user-stop", (_b = getUserById(socket.id)) === null || _b === void 0 ? void 0 : _b.pseudo);
            });
        };
    }
}
export default SocketIO;
