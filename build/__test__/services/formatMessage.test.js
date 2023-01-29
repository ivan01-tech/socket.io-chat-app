import { formatMessage } from "../../services/formatMessage";
const id = "message-123";
describe("format message unique test suite", function () {
    it("should and object", () => {
        const message = "message";
        const pathImage = "message-123.png";
        const user = expect.any(String);
        const obj = formatMessage(id, message, pathImage);
        expect(obj).toEqual(expect.objectContaining({
            message,
            pathImage,
            user,
            date: expect.any(String),
        }));
    });
});
