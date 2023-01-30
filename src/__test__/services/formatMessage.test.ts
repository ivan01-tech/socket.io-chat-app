import { formatMessage } from "../../services/formatMessage";

jest
  .mock("../../users/userRooms")
  .fn()
  .mockReturnValue({
    getUserById: jest.fn().mockReturnValue({ pseudo: "Ivan" }),
  });

describe("format mesaage unique  test suite", function () {
  it("should return the correct object", function () {
    console.log(require("../../users/userRooms").getUserById.);
    const obj = formatMessage("1234", "Bjr", "image.jpg");

    expect(obj).toEqual(
      expect.objectContaining({
        message: "Bjr",
        date: expect.any(String),
        user: expect.any(String),
        pathImage: "image.jpg",
      })
    );
  });
});
