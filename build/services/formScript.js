import utils from "./utilMessage.js";
const socket = io();
let userWhoIsTypping = [];
const url = new URL(window.location.href);
const pseudo = url.searchParams.get("name");
const room = url.searchParams.get("room");
const formMsg = document.querySelector(".form");
const inputMsg = document.querySelector("#input-msg");
function emitLogInfo() {
    socket.emit("sendInfo", { pseudo, room });
    // send a feed back for the new connection
    // utils.addUser("You ", false);
}
function initApp() {
    emitLogInfo();
    socket.on("newUser", function ({ pseudo }, users) {
        utils.addUser(pseudo, false);
        utils.rendersAllusers(users);
    });
    // receive a new message and add it
    socket.on("receive-msg", function (msg) {
        utils.addMessage(msg, false);
    });
    socket.on("userDisconnect", function (pseudo, users) {
        utils.addUser(pseudo, true);
        utils.rendersAllusers(users);
    });
    // send a message
    formMsg.addEventListener("submit", function (e) {
        e.preventDefault();
        const msg = inputMsg.value;
        if (!msg)
            return;
        const date = new Date();
        socket.emit("send-msg", msg);
        utils.addMessage({
            message: msg,
            date: `${date.getHours()}:${date.getMinutes()}`,
            user: "You",
        }, true);
        inputMsg.value = "";
        inputMsg.focus();
    });
    // to determine if the user is tipping
    inputMsg.addEventListener("focus", function (e) {
        socket.emit("is-typping");
    });
    inputMsg.addEventListener("blur", function (e) {
        socket.emit("stop-typping");
    });
    // receive who is typping
    socket.on("user-typping", function (pseudo) {
        if (!userWhoIsTypping.includes(pseudo))
            userWhoIsTypping.push(pseudo);
        utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
    });
    socket.on("user-stop", function (pseudo) {
        userWhoIsTypping = userWhoIsTypping.filter((user) => user != pseudo);
        utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
    });
}
// lunch everything
document.addEventListener("DOMContentLoaded", initApp);
