const express = require("express");
const cors = require("cors");
const { handler } = require("./index");
const constants = require("./constants");

const app = express();
const PORT = 8080;

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", async (req, res) => {
  const event = {
    queryStringParameters: req.query,
    body: req.body,
  };
  const response = await handler(event);
  res.set(response.headers);
  res.status(response.statusCode).json(response.body);
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
