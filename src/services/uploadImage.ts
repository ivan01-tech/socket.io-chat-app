async function uploadImageClient(files: File) {
  const formData = new FormData();
  formData.append(files.name, files);
  try {
    // //("server_url : ", server_url);
    const response = await fetch(`https://chat-app-cucz.onrender.com/upload`, {
      method: "post",
      body: formData,
    });
    const json = await response.json();
    //("json : ", json);
    return json;
  } catch (err) {
    //("err : ", err);
  }
}

export default uploadImageClient;
