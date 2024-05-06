const Podcast = require('../models/Podcast');
const User = require('../models/User');
const Comment = require('../models/Comment');


exports.addComment = async (req, res) => {
    try {
        const { podcastId } = req.params;
        const userId = req.user.id;
        const { commentText } = req.body; // Предполагается, что текст комментария передается в теле запроса

        // Создаем комментарий
        const comment = await Comment.create({
            podcastId: podcastId,
            userId: userId,
            commentText: commentText
        });

        // Отправляем успешный ответ
        res.status(201).json({ message: 'Comment added successfully', comment: comment });
    } catch (error) {
        // Если произошла ошибка, отправляем ответ с ошибкой
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
}
