function addMessage(message, send) {
    const messageWrapper = document.querySelector(".messages-wrap");
    const className = send ? "send" : "";
    const newMsg = document.createElement("div");
    newMsg.classList.add("message");
    newMsg.innerHTML += `
					<!-- a message ${send ? "send" : "receive"} -->
						<div class="msg-info ${className}">
							<span class="owner">${message.user}</span>
							<span class="time">${message.date}</span>
						</div>
						<div class="msg-content ${className}">
							<p>
								${message.message}
							</p>
						</div>
					`;
    messageWrapper.appendChild(newMsg);
    newMsg.scrollIntoView();
}
function addUser(pseudo, disconnect) {
    const messageWrapper = document.querySelector(".messages-wrap");
    const newUser = document.createElement("div");
    newUser.classList.add("new-user");
    newUser.innerText = disconnect
        ? `${pseudo} left the room!`
        : `${pseudo} join the room!`;
    messageWrapper.appendChild(newUser);
}
function rendersAllusers(users) {
    const usersDOM = document.querySelector(".users");
    const onlineuser = document.querySelector(".online-users");
    let content = "";
    content = users.map((user) => `<li>${user.pseudo}</li>`).join("");
    usersDOM.innerHTML = `
	<!--  users list in the room -->
	${content}`;
    const length = users.length;
    if (length > 0) {
        const users = length > 1 ? "users" : "user";
        onlineuser.innerHTML = `${length} ${users} online`;
    }
    else {
        onlineuser.innerHTML = "";
    }
}
function usesWhoAreTyppingListRenders(list) {
    const whoAreType = document.querySelector(".user-list-typping");
    if (list.length > 0)
        whoAreType.innerHTML = `${list.join(",")}${list.length > 1 ? " are " : " is "}typping...`;
    else
        whoAreType.innerHTML = "";
}
export default {
    addMessage,
    usesWhoAreTyppingListRenders,
    rendersAllusers,
    addUser,
};
