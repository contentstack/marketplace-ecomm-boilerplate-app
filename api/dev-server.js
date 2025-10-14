/*
This is a simple express server to test the cloud function locally.
It listens on port 8080 and forwards all requests to the function handler.
*/
import "dotenv/config";

import express from "express";
import cors from "cors";
import launchFunction from "./api.js";
import constants from "./constants/index.js";

const app = express();
const PORT = 8080;

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", async (req, res) => {
  const request = {
    query: req.query,
    body: req.body,
  };
  const result = await launchFunction(request);
  res.status(result.statusCode).json(result.body);
});

//Global Error handler middleware.
app.use((err, req, res, next) => {
  console.error("Global Error thrown: ", err);
  res
    .status(constants.HTTP_ERROR_CODES.BAD_REQ)
    .json({ error: constants.HTTP_ERROR_TEXTS.BAD_REQ });
});

app.listen(PORT, () => {
  console.info("Server listening at port ", PORT);
});
