const express = require('express');
const router = express.Router();

const { getUserProfile } = require('../controllers/users.controller');

router.get('/:username', getUserProfile);

module.exports = router;
