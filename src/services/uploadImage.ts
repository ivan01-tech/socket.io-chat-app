// var server_urls = {
//   development: "localhost:3500",
//   production: "https://chat-app-cucz.onrender.com",
// };

// var server_url = "production";

// window.ENV = { app_env: "production" };
// const url = window.ENV.app_env;

// if (url == "development" || url == "production") server_url = server_urls[url];
// else server_url = server_urls["development"];

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
