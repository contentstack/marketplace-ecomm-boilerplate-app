const express = require("express");
const cors = require("cors");
const handler = require("./index");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/", async (req, res) => {
  const event = {
    queryStringParameters: req.query,
    body: req.body,
  };
  const response = await handler(event);
  res.set(response.headers);
  res.status(response.statusCode).json(response.body);
});

const port = 8080;
app.listen(port, () => {
  console.info("Server listening at port ", port);
});
