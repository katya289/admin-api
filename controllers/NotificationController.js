const { Podcast, User, Comment } = require('../models/index');

const Op = require('sequelize').Op;




exports.getNotification = async (req, res) => {
    try {
        const userId = req.user.id;

        const comments = await Comment.findAll({ where: { userId: { [Op.ne]: userId } } });

        return res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
