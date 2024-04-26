
const Podcast = require('../models/Podcast');
const Like = require('../models/Like');
exports.postLike = async (req, res) => {
  try {
    const { podcastId } = req.params;
    const userId = req.user.id;

    const podcast = await Podcast.findByPk(podcastId);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    const existingLike = await Like.findOne({
      where: { podcast_id: podcastId, user_id: userId }
    });
    // if (existingLike) {
    //   return res.status(400).json({ message: 'You already liked this podcast' });
    // }
    // else {
      await Like.create({ podcast_id: podcastId, user_id: userId });

      await podcast.increment('likes_count');

      return res.status(201).json({ message: 'Podcast liked successfully' });
    // }


  } catch (error) {
    console.error('Error liking podcast:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteLike = async (req, res) => {
  try {
    const { podcastId } = req.params;
    const userId = req.user.id;
    const like = await Like.destroy({ where: { user_id: userId, podcast_id: podcastId } });
    if (like === 0) {

      return res.status(404).json({ message: 'Like not found for deletion' });
    }
    return res.status(200).json({ message: 'Successfully deleted like' });
  }
  catch (error) {
    console.error('Error deleting like', error)
    return res.status(500).json({ message: 'Error' });
  }

}