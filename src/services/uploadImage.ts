// manage image data here

async function uploadImageClient(files: File) {
  const formData = new FormData();
  formData.append(files.name, files);
  try {
    const response = await fetch(`http://localhost:${3500}/upload`, {
      method: "post",
      body: formData,
    });
    const json = await response.json();
    console.log("json : ", json);
    return json;
  } catch (err) {
    console.log("err : ", err);
  }
}

export default uploadImageClient;
