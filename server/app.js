import express from "express";
const app = express();
import  "./dbConnect.js";

import cors from "cors";

const port = 5000;
app.use(cors());

import userRouter from "./controllers/users/index.js";
app.use(express.json()); //body parser
app.get("/", (req, res) => {
  res.send("Hello World!");
})
 
app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(` app listening on port ${port}`);
  });