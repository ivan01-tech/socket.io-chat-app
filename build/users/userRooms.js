export let Users = [];
export function saveUser(user) {
    Users = [...Users, user];
}
export function getUserById(id) {
    return Users.find((user) => user.id == id);
}
export function getUserByRoomAndName(user) {
    return Users.find((u) => user.pseudo == u.pseudo && u.room == user.room);
}
export function removeUser(id) {
    // const user = getUserById(id);
    Users = Users.filter((user) => user.id != id);
    // return user;
}
export function getAlluserByRoom(room) {
    console.log(Users);
    return Users.filter((user) => user.room == room);
}
