import express from "express";
// import todoRoute from "./routes/todo.route";
import authRoute from "./routes/auth.route"
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
import { connectDb } from "./db";
import { isAuthenticate } from "./middlewares/isAuthenticate";
const port = 3001;
app.use(bodyParser.json());

app.get("/", function (req: any, res: any) {
  res.send("Hello World");
});

connectDb().then(() => {
  app.listen(port, () => {
    console.log("server is running on port http://localhost:" + port);
  });
});

app.use(express.json());
app.use("/api/auth",  authRoute);
// app.use("/api", isAuthenticate, todoRoute);
