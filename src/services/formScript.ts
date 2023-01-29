import { SocketData } from "../socketConfig.js";
import { messageType } from "./formatMessage.js";
import utils from "./utilMessage.js";
import { userType } from "../users/userRooms.js";
import uploadFileClient from "./uploadImage.js";

const socket = io();

let userWhoIsTypping: string[] = [];
const url = new URL(window.location.href);
const pseudo = url.searchParams.get("name");
const room = url.searchParams.get("room");
let isloading = false;

const sendBtn = document.querySelector(".send-btn") as HTMLButtonElement;
const inputMsg = document.querySelector<HTMLInputElement>("#input-msg")!;

// went he log in a particular room
function emitLogInfo() {
  socket.emit("sendInfo", { pseudo, room });
}

function printLoading(params: boolean) {
  document.querySelector(".loading")?.classList.toggle("show", params);
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
  socket.on("receiveMsg", function (msg: messageType) {
    utils.addMessage(msg, false);
  });

  socket.on("userDisconnect", function (user: userType, users: userType[]) {
    utils.addUser(user.pseudo, true);
    utils.rendersAllusers(users, user.room);
  });

  // send a message
  sendBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    // check an upload image if exists
    let imagePath;
    let msg = inputMsg.value;
    const Files = document.querySelector<HTMLInputElement>("#files")!;

    console.log("===================");
    console.log(Files, msg);
    console.log("===================");

    if (Files && Files.files && Files.files[0]) {
      isloading = true;
      printLoading(isloading);
      try {
        imagePath = await uploadFileClient(Files?.files[0]);
        console.log("imagePath =======================");
        console.log("imagePath : ", imagePath?.message);

        Files.files = null;
      } catch (err) {
        console.log(err);
        return;
      } finally {
        isloading = false;
        printLoading(isloading);
      }
    }
    Files.files = null;
    Files.value = "";

    if (!imagePath && !msg) return;

    const date = new Date();
    const img = imagePath ? imagePath?.message : "";
    socket.emit("sendMsg", msg, img);
    utils.addMessage(
      {
        message: msg,
        date: `${date.getHours()}:${date.getMinutes()}`,
        user: "You",
        pathImage: img,
      },
      true
    );

    inputMsg.value = "";
  });

  // to determine if the user is tipping
  inputMsg.addEventListener("focus", function (e) {
    socket.emit("isTypping");
  });

  inputMsg.addEventListener("blur", function (e) {
    socket.emit("stopTypping");
  });

  // receive who is typping
  socket.on("userTypping", function (pseudo: string) {
    if (!userWhoIsTypping.includes(pseudo)) userWhoIsTypping.push(pseudo);
    utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
  });

  socket.on("userStop", function (pseudo: string) {
    userWhoIsTypping = userWhoIsTypping.filter((user) => user != pseudo);
    utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
  });
}

// lunch everything
document.addEventListener("DOMContentLoaded", initApp);
