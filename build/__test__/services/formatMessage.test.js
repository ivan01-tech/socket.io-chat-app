import { formatMessage } from "../../services/formatMessage";
jest
    .mock("../../users/userRooms")
    .fn()
    .mockReturnValue({
    getUserById: jest.fn().mockReturnValue({ pseudo: "Ivan" }),
});
describe("format script unique test suite", function () {
    it("should return the correct object", function () {
        const obj = formatMessage("1234", "Bjr", "image.jpg");
        expect(obj).toEqual(expect.objectContaining({
            message: "Bjr",
            date: expect.any(String),
            user: undefined,
            pathImage: "image.jpg",
        }));
    });
});
