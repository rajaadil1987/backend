const express = require('express');
const { query } = require('express-validator');
const { searchImages: searchHandler } = require('../controllers/image.controller');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.get(
  '/',
  [
    query('q').trim().notEmpty().withMessage('Search query is required'),
    validate
  ],
  searchHandler
);

module.exports = router;
