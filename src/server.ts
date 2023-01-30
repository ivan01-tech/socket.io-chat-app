// import "./types/globals";
// import "./types/index";

import express, { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { createServer } from "http";
import path, { join } from "path";
import { Server } from "socket.io";
import SocketIO from "./socket.js";
import fileupload from "express-fileupload";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./socketConfig.js";
if (typeof window !== "undefined")
  if (typeof process !== "undefined")
    window.ENV.app_env = process.env.NODE_ENV || "development";
  else window.ENV.app_env = "development";

// window.ENV.app_env = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 3500;

const app = express();
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  server
);
// the socket class create to handle all event on io
const socketEvent = new SocketIO(io);

app.use(express.static(path.join(process.cwd(), "build", "public")));
app.use(express.static(path.join(process.cwd(), "build", "services")));
app.use(express.static(path.join(process.cwd(), "build", "users")));

app.get("/", function (req, res) {
  res.sendFile(
    path.join(process.cwd(), "build", "public", "html", "form.html")
  );
});

app.post(
  "/upload",
  fileupload({ createParentPath: true }),
  function (req: Request, res: Response) {
    //("===================");
    //(res, req);
    //("===================");

    let pathImage;
    let pathImageFormSite;
    req.files &&
      Object.keys(req.files).forEach(function (name) {
        if (req.files) {
          //("===================");
          //(req?.files[name]);
          //("===================");

          const objFile = req.files[name] as UploadedFile;
          const formatName = objFile.name.split(" ").join("");

          pathImage = join(
            process.cwd(),
            "build",
            "public",
            "image",
            formatName
          );

          pathImageFormSite = join("image", formatName);

          //("pathImage : ", pathImage);

          objFile.mv(pathImage, function (err: Error) {
            if (err)
              return res
                .status(500)
                .send({ status: "Error", message: "Something went wrong !" });
          });
        }
      });

    if (pathImageFormSite)
      return res.send({
        status: "Success",
        message: `${pathImageFormSite}`,
      });
    else
      return res.status(500).send({
        status: "Error",
        message: `something went wrong !`,
      });
  }
);

// to lunch to onConnectionevent
socketEvent.startSocket();

server.listen(PORT, function () {
  //("Server running on port  : ", PORT);
});
