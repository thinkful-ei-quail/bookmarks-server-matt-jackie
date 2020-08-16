const { v4: uuid } = require('uuid');

const bookmarks = [
  { id: uuid(),
    title: 'facebook',
    url: 'https://www.facebook.com',
    description: 'social media site',
    rating: 4 },
  {id: uuid(),
    title: 'Google',
    url: 'https://www.google.com',
    description: 'A search engine for finding anything',
    rating: 5},
  {id: uuid(),
    title:'Aol.com',
    url: 'https://www.aol.com',
    description: 'Grandfather ISP',
    rating: 2},
];

module.exports = {bookmarks};