require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const winston = require('winston');
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { v4: uuid } = require('uuid');
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});


if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}



app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const bookmarks = [{
  id: uuid(),
  title: 'Title',
  url: 'URL',
  description: 'Description',
  rating: 4
}];

if (!title) {
  logger.error(`Title is required`);
  return res
    .status(400)
    .send('Title is required');
}
if (!url) {
  logger.error(`Url is required`);
  return res
    .status(400)
    .send('Url is required');
}
if (!description) {
  logger.error(`Description is required`);
  return res
    .status(400)
    .send('Decsription is required');
}


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});



module.exports = app;
