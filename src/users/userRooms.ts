export type userType = {
  pseudo: string;
  id: string;
  room: string;
};

export let Users: userType[] = [];

export function saveUser(user: userType): void {
  Users = [...Users, user];
}

export function getUserById(id: string) {
  return Users.find((user) => user.id == id);
}

export function getUserByRoomAndName(user: { pseudo: string; room: string }) {
  return Users.find((u) => user.pseudo == u.pseudo && u.room == user.room);
}

export function removeUser(id: string) {
  // const user = getUserById(id);
  Users = Users.filter((user) => user.id != id);
  // return user;
}

export function getAlluserByRoom(room: string) {
  console.log(Users);
  return Users.filter((user) => user.room == room);
}
