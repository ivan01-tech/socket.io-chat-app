import { getUserById } from "../users/userRooms.js";
export function formatMessage(id, msg, pathImage) {
    var _a;
    const date = new Date();
    console.log("id : ", id);
    return {
        message: msg,
        date: `${date.getHours()}:${date.getMinutes()}`,
        user: (_a = getUserById(id)) === null || _a === void 0 ? void 0 : _a.pseudo,
        pathImage,
    };
}
