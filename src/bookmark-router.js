<<<<<<< Updated upstream
=======
/* eslint-disable eqeqeq */
/* eslint-disable strict */
>>>>>>> Stashed changes
const express = require('express');
const store = require('./store');
const logger = require('./logger');
const { v4: uuid } = require('uuid');


const bookmarkRouter = express.Router();
const bodyParser = express.json();
bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    for(const field of ['title','url','rating']){
      if(!req.body[field]){
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const {title,url,description,rating} = req.body;

    if(!Number.isInteger(rating) || rating < 0 || rating > 5){
      logger.error(`Invalid '${rating}' supplied`);
      return res.status(400).send('\'rating\' must be a number between 0 and 5');
    }
    const bookmark = { id: uuid(), title, url, description, rating};

    store.bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${bookmark.id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });
bookmarkRouter
  .route('/bookmarks/:id')
  .get((req,res) => {
    const {id} = req.params;
    const bookmark = store.bookmarks.find(c => c.id == id);

    if(!bookmark){
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req,res) => {
    const { id } = req.params;
    const bookmarkIndex = store.bookmarks.findIndex(b => b.id === id);

    if(bookmarkIndex === -1){
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    store.bookmarks.splice(bookmarkIndex, 1);
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });
module.exports = bookmarkRouter;