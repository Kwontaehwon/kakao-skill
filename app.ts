import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import { router } from "./router";

const app = express();

app.set("port", 3000);
app.use(logger("dev", {}));
app.use(bodyParser.json());
app.use("/api", router);

app.listen(3000, function () {
  console.log("Example skill server listening on port 3000!");
});
