/* This is just for developing purpose only.
The production deployment will be done on AWS Lambda.
Hence the lambda will call the handler function in ./index.js directly
without any server requirement.
As this is only for development, keep only one API always with empty route,
and handle all the functionality in that API. Don't add multiple APIs. */

import express from "express";
import cors from 'cors';
import handler from './index';
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/', async (req: any, res: any) => {
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
  console.info('Server listening at port ', port);
});
