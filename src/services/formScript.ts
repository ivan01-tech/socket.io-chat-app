import { Socket } from "socket.io";
import { SocketData } from "../socketConfig.js";
import { messageType } from "./formatMessage.js";
import utils from "./utilMessage.js";
import { userType } from "./userRooms.js";

const socket: Socket = io();
let userWhoIsTypping: string[] = [];
const url = new URL(window.location.href);
const pseudo = url.searchParams.get("name");
const room = url.searchParams.get("room");

const formMsg = document.querySelector(".form") as HTMLFormElement;
const inputMsg = document.querySelector<HTMLInputElement>("#input-msg")!;

// went he log in a particular room
function emitLogInfo() {
  socket.emit("sendInfo", { pseudo, room });
}

function initApp() {
  emitLogInfo();

  socket.on(
    "newUser",
    function ({ pseudo, room }: SocketData, users: userType[]) {
      utils.addUser(pseudo, false);
      console.log(room, " apresC");
      utils.rendersAllusers(users, room);
    }
  );

  // receive a new message and add it
  socket.on("receive-msg", function (msg: messageType) {
    utils.addMessage(msg, false);
  });

  socket.on("userDisconnect", function (user: userType, users) {
    utils.addUser(user.pseudo, true);
    console.log(user.room, " apresD");
    utils.rendersAllusers(users, user.room);
  });

  // send a message
  formMsg.addEventListener("submit", function (e) {
    e.preventDefault();

    const msg = inputMsg.value;

    if (!msg) return;
    const date = new Date();
    socket.emit("send-msg", msg);
    utils.addMessage(
      {
        message: msg,
        date: `${date.getHours()}:${date.getMinutes()}`,
        user: "You",
      },
      true
    );

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
    if (!userWhoIsTypping.includes(pseudo)) userWhoIsTypping.push(pseudo);
    utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
  });

  socket.on("user-stop", function (pseudo) {
    userWhoIsTypping = userWhoIsTypping.filter((user) => user != pseudo);
    utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
  });
}

// lunch everything
document.addEventListener("DOMContentLoaded", initApp);