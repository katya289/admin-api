const express = require('express');
const router = express.Router();
const userController = require('./controllers/UserController');
const podcastController = require('./controllers/PodcastController');
const verifyToken = require('./middleware/authJWT');



router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.post('/podcasts/upload', verifyToken, podcastController.uploadPodcast);




router.get('/podcasts/get', verifyToken, podcastController.getPodcasts);

module.exports = router;