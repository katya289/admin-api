const express = require('express');
const router = express.Router();
const userController = require('./controllers/UserController');
const podcastController = require('./controllers/PodcastController');
const likeController = require('./controllers/LikeController');
const commentController = require('./controllers/CommentController');
const notificationController = require('./controllers/NotificationController');
const verifyToken = require('./middleware/authJWT');


router.get('/users/get/notifications', verifyToken, notificationController.getNotification);
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);


router.delete('/podcasts/comment/delete/:commId', verifyToken, commentController.deleteComment);
router.post('/podcasts/comment/add/:podcastId', verifyToken, commentController.addComment);
router.get('/podcasts/comments/:podcastId', verifyToken, commentController.fetchComments);

router.post('/podcasts/like/:podcastId', verifyToken, likeController.postLike);
router.delete('/podcasts/like-delete/:podcastId', verifyToken, likeController.deleteLike);

router.delete('/account/delete', verifyToken, userController.deleteUserAccount);
router.get('/users/get/:userId', userController.getUserByUserId);

router.post('/podcasts/upload', verifyToken, podcastController.uploadPodcast);
router.get('/podcasts/likes', verifyToken, podcastController.getLikedPodcasts);
router.get('/users/get', verifyToken, userController.getAuthorizedUser);
router.get('/podcasts/get', verifyToken, podcastController.getPodcasts);
router.get('/podcasts/:id/get', verifyToken, podcastController.getPodcastsById);
router.get('/by-category/:category', verifyToken, podcastController.getPodcastsByCategory);



module.exports = router;