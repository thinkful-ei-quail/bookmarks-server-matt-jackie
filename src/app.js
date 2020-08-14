require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const bookmarkRouter = require('./bookmark-router')
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

app.post('/bookmark', (req, res) => {

  
});

app.delete('/card/:id', (req, res) => {
  const { id } = req.params;

  const bookIndex = bookmarks.findIndex(bm => bm.id == id);

  if (bookIndex === -1) {
    logger.error(`Card with id ${id} not found.`);
    return res
      .status(404)
      .send('Not found');
  }
  bookmarks.forEach(bookmark => {
    const bookmarkIds = bookmark.bookmarkIds.filter(cid => cid !== id);
    bookmark.bookmarkIds = bookmarkIds;
  });

  bookmarks.splice(bookIndex, 1);

  logger.info(`Book with id ${id} deleted.`);

  res
    .status(204)
    .end();
});

app.use(bookmarkRouter)
module.exports = app;
