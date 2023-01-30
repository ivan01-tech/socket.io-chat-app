var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var server_urls = {
    development: "localhost:3500",
    production: "https://chat-app-cucz.onrender.com",
};
var server_url = "production";
window.ENV = { app_env: "production" };
const url = window.ENV.app_env;
if (url == "development" || url == "production")
    server_url = server_urls[url];
else
    server_url = server_urls["development"];
function uploadImageClient(files) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append(files.name, files);
        try {
            //("server_url : ", server_url);
            const response = yield fetch(`https://chat-app-cucz.onrender.com/upload`, {
                method: "post",
                body: formData,
            });
            const json = yield response.json();
            //("json : ", json);
            return json;
        }
        catch (err) {
            //("err : ", err);
        }
    });
}
export default uploadImageClient;
