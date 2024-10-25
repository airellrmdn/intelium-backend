const express = require('express');
const { getFish, getSensor, getFeederHistory, servo } = require('../handler');

const router = express.Router();

router.get('/data', getFish);
router.get('/sensor', getSensor);
router.get('/feedHistory', getFeederHistory);

router.post('/servo', servo);

module.exports = router;
