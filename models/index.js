const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const UserModel = require('./User')(sequelize, Sequelize.DataTypes);
const PodcastModel = require('./Podcast')(sequelize, Sequelize.DataTypes);
const CategoryModel = require('./Category')(sequelize, Sequelize.DataTypes);
const LikeModel = require('./Like')(sequelize, Sequelize.DataTypes);
const CommentModel = require('./Comment')(sequelize, Sequelize.DataTypes);


UserModel.hasMany(CommentModel, {foreignKey: 'userId', as: 'comments'});

PodcastModel.belongsTo(UserModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
PodcastModel.belongsTo(CategoryModel, { foreignKey: 'categoryId', as: 'Category' });

CommentModel.belongsTo(UserModel, {foreignKey: 'userId', as: 'user'});

LikeModel.belongsTo(PodcastModel, { foreignKey: 'podcast_id', onDelete: 'CASCADE' });
LikeModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User: UserModel,
  Podcast: PodcastModel,
  Category: CategoryModel,
  Like: LikeModel,
  Comment: CommentModel,
};
