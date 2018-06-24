const express = require('express');
const router = express.Router();

const { getUserProfileFromUserName, getAllUsers, getUserProfile } = require('../controllers/users.controller');

router.get('/', getAllUsers);

router.get('/:username', getUserProfileFromUserName);

router.get('/id/:_id', getUserProfile);

module.exports = router;
