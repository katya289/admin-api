
const { where } = require('sequelize');
const { User, Comment } = require('../models/index');

exports.addComment = async (req, res) => {
    try {
        const { podcastId } = req.params;
        const userId = req.user.id;
        const { commentText } = req.body;
        const comment = await Comment.create({
            podcastId: podcastId,
            userId: userId,
            commentText: commentText
        });

        res.status(201).json({ message: 'Comment added successfully', comment: comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
}

exports.fetchComments = async (req, res) => {
    try {
        const { podcastId } = req.params;
        console.log(podcastId);
        const comments = await Comment.findAll({
            where: { podcastId: podcastId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'avatar']
            }],
            attributes: ['id', 'commentText', 'userId']
        });

        res.status(200).json({ message: 'Comments fetched successfully', comments: comments });
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
}


exports.deleteComment = async (req, res) => {
    try {
        const { commId } = req.params;
        console.log(commId);
        // if(!commId) {
        //     res.status(404).json({ error: 'Such comment doesnt exist' });
        // }
        const deletedComment = await Comment.destroy({where: {id: commId}});
        res.status(200).json({ message: 'Successfully deleted comment' });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
}





