// manage image data here
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function uploadImageClient(files) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append(files.name, files);
        try {
            const response = yield fetch(`http://localhost:${3500}/upload`, {
                method: "post",
                body: formData,
            });
            const json = yield response.json();
            console.log("json : ", json);
            return json;
        }
        catch (err) {
            console.log("err : ", err);
        }
    });
}
export default uploadImageClient;
