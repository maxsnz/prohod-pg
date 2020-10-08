const express = require('express');
const api = express.Router();
const dataGetController = require('../controllers/dataGetController');
const dataPostController = require('../controllers/dataPostController');

api.get('/data', dataGetController);
api.post('/data', dataPostController);

module.exports = api;