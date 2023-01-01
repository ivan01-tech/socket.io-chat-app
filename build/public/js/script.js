const form = document.querySelector("#form")
const speudo = document.querySelector("#name")
const room = document.querySelector("#room")
const error = document.querySelector(".error")

form.addEventListener("submit", function (e) {

	e.preventDefault()

	if (!(speudo.value.length > 3) || !(room.value.length > 2)) {
		error.classList.add("show")
		speudo.value = ""
		room.value = ""
		return
	} else {
		form.submit()
	}

})
