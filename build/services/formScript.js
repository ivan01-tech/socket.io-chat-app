var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import utils from "./utilMessage.js";
import uploadFileClient from "./uploadImage.js";
const socket = io();
let userWhoIsTypping = [];
const url = new URL(window.location.href);
const pseudo = url.searchParams.get("name");
const room = url.searchParams.get("room");
let isloading = false;
const sendBtn = document.querySelector(".send-btn");
const inputMsg = document.querySelector("#input-msg");
// went he log in a particular room
function emitLogInfo() {
    socket.emit("sendInfo", { pseudo, room });
}
function printLoading(params) {
    var _a;
    (_a = document.querySelector(".loading")) === null || _a === void 0 ? void 0 : _a.classList.toggle("show", params);
}
function initApp() {
    emitLogInfo();
    socket.on("newUser", function ({ pseudo, room }, users) {
        utils.addUser(pseudo, false);
        console.log(room, " apresC");
        utils.rendersAllusers(users, room);
    });
    // receive a new message and add it
    socket.on("receiveMsg", function (msg) {
        utils.addMessage(msg, false);
    });
    socket.on("userDisconnect", function (user, users) {
        utils.addUser(user.pseudo, true);
        utils.rendersAllusers(users, user.room);
    });
    // send a message
    sendBtn.addEventListener("click", function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            e.stopPropagation();
            // check an upload image if exists
            let imagePath;
            let msg = inputMsg.value;
            const Files = document.querySelector("#files");
            console.log("===================");
            console.log(Files, msg);
            console.log("===================");
            if (Files && Files.files && Files.files[0]) {
                isloading = true;
                printLoading(isloading);
                try {
                    imagePath = yield uploadFileClient(Files === null || Files === void 0 ? void 0 : Files.files[0]);
                    console.log("imagePath =======================");
                    console.log("imagePath : ", imagePath === null || imagePath === void 0 ? void 0 : imagePath.message);
                    Files.files = null;
                }
                catch (err) {
                    console.log(err);
                    return;
                }
                finally {
                    isloading = false;
                    printLoading(isloading);
                }
            }
            Files.files = null;
            Files.value = "";
            if (!imagePath && !msg)
                return;
            const date = new Date();
            const img = imagePath ? imagePath === null || imagePath === void 0 ? void 0 : imagePath.message : "";
            socket.emit("sendMsg", msg, img);
            utils.addMessage({
                message: msg,
                date: `${date.getHours()}:${date.getMinutes()}`,
                user: "You",
                pathImage: img,
            }, true);
            inputMsg.value = "";
        });
    });
    // to determine if the user is tipping
    inputMsg.addEventListener("focus", function (e) {
        socket.emit("isTypping");
    });
    inputMsg.addEventListener("blur", function (e) {
        socket.emit("stopTypping");
    });
    // receive who is typping
    socket.on("userTypping", function (pseudo) {
        if (!userWhoIsTypping.includes(pseudo))
            userWhoIsTypping.push(pseudo);
        utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
    });
    socket.on("userStop", function (pseudo) {
        userWhoIsTypping = userWhoIsTypping.filter((user) => user != pseudo);
        utils.usesWhoAreTyppingListRenders(userWhoIsTypping);
    });
}
// lunch everything
document.addEventListener("DOMContentLoaded", initApp);
