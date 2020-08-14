/* eslint-disable strict */
const express = require('express');
const store = require('./store');
const bodyParser = express.json();
const logger = require('./logger');
const { v4: uuid } = require('uuid');


const bookmarkRouter = express.Router();
const bodyParser = express.json();
bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    for(const field of ['title','url','rating']){
      if(!req.body[field]){
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' if required`)
      }
    }

    const {title,url,description,rating} = req.body

    if(!Number.isInteger(rating) || rating < 0 || rating > 5){
      logger.error(`Invalid '${rating}' supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }
    if(!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send(`'url' must be a valid URL`)
    }
    const bookmark = { id: uuid(), title, url, description, rating}

    store.bookmarks.push(bookmark)
    logger.info(`Bookmark with id ${bookmark.id} created`)
    res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
    .json(bookmark)
  })
  bookmarkRouter
    .route('/bookmarks/:bookmark-id')
    .get((req,res) => {
      const {bookmark-id} = req.params
      const bookmark = store.bookmarks.find(c => c.id == bookmark-id)

      if(!bookmark){
        logger.error(`Bookmark with id ${bookmark_id} not found.`)
        return res
          .status(404)
          .send('Bookmark Not Found')
      }
      res.json(bookmark)
    })
    .delete((req,res) => {
      const {bookmark-id} = req.params
      const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark-id)

      if(bookmarkIndex === -1){
        logger.error(`Bookmark with id ${bookmark-id} not found.`)
        return res
        .status(404)
        .send('Bookmark Not Found')
      }
      store.bookmarks.splice(bookmarkIndex, 1)
      logger.info(`Bookmark with id ${bookmark-id} deleted.`)
      res
      .status(204)
      .end()
    })
module.exports = bookmarkRouter