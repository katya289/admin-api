
const Podcast = require('../models/Podcast');
const Like = require('../models/Like');
exports.postLike = async (req, res) => {
    try {
        const { podcastId } = req.params;
        const userId = req.user.id; // Предполагается, что информация о пользователе хранится в req.user после аутентификации
  
        // Проверяем, существует ли подкаст с указанным ID
        const podcast = await Podcast.findByPk(podcastId);
        if (!podcast) {
          return res.status(404).json({ message: 'Podcast not found' });
        }
  
        // Проверяем, был ли уже поставлен лайк этим пользователем
        const existingLike = await Like.findOne({
          where: { podcast_id: podcastId, user_id: userId }
        });
        if (existingLike) {
          return res.status(400).json({ message: 'You already liked this podcast' });
        }
  
        // Создаем новый лайк
        await Like.create({ podcast_id: podcastId, user_id: userId });
  
        // Увеличиваем счетчик лайков у подкаста
        await podcast.increment('likes_count');
  
        return res.status(201).json({ message: 'Podcast liked successfully' });
      } catch (error) {
        console.error('Error liking podcast:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }