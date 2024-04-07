const express = require('express');
const router = express.Router();
const userController = require('./controllers/UserController');
const podcastController = require('./controllers/PodcastController');
const verifyToken = require('./middleware/authJWT');



router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);



router.post('/podcasts/upload', verifyToken, podcastController.uploadPodcast);
router.get('/users/get', verifyToken, userController.getAuthorizedUser);
router.get('/podcasts/get', verifyToken, podcastController.getPodcasts);
router.get('/podcasts/:id/get', verifyToken, podcastController.getPodcastsById);

module.exports = router;