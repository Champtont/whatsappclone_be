import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import expressServer from "./server.js";

const port = process.env.PORT | 3001;

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  expressServer.listen(port, () => {
    console.log("Server is running on port:", port);
    console.table(listEndpoints(expressServer));
  });
});
