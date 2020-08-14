const express = require("express");
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const logger = require('./logger')
const { v4: uuid } = require('uuid')
const bookmarkRouter = require("./bookmark-router");
const app = require("./app");

bookmarkRouter
  .route("/bookmark")
  .get((req, res) => {
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const bookmarks = [
      {
        id: uuid(),
        title: "Title",
        url: "URL",
        description: "Description",
        rating: 4,
      },
    ];
    const {
      title,
      url,
      description,
      rating,
      header,
      bookmarkIds = [],
    } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Title is required");
    }
    if (!url) {
      logger.error(`Url is required`);
      return res.status(400).send("Url is required");
    }
    if (!description) {
      logger.error(`Description is required`);
      return res.status(400).send("Decsription is required");
    }
    if (!rating) {
      logger.error(`Rating is required`);
      return res.status(400).send("Rating is required");
    }

    if (!header) {
      logger.error(`Header is required`);
      return res.status(400).send("Invalid data");
    }

    if (bookmarkIds.length > 0) {
      let valid = true;
      bookmarkIds.forEach((cid) => {
        const bookmark = bookmarks.find((c) => c.id == cid);
        if (!bookmark) {
          logger.error(`Bookmark with id ${cid} not found in bookmarks array.`);
          valid = false;
        }
      });

      if (!valid) {
        return res.status(400).send("Invalid data");
      }
    }
    const newBookmark = {
      id,
      title,
      url,
      description,
      rating,
    };
    // get an id
    const id = uuid();
    bookmarks.push(newBookmark);

    logger.info(`Bookmark with id ${id} created`);
    res.status(201).location(`http://localhost:8000/list/${id}`).json({ id });
  });
