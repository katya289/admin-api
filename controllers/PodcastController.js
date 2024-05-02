const AWS = require('aws-sdk');
const fs = require('fs');
const ntpClient = require('ntp-client');
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Podcast = require('../models/Podcast');
const multer = require('multer');
const Category = require('../models/Category');
const Like = require('../models/Like');

let s3;
const upload = multer({ dest: 'uploads/' });
var uploadMultiple = upload.fields([{ name: 'preview', maxCount: 3 }, { name: 'file', maxCount: 3 }])
// exports.uploadPodcast = async (req, res) => {
//     try {
//         upload.single('file')(req, res, async function (err) {
//             if (err) {
//                 console.error('Error uploading file:', err);
//                 return res.status(400).json({ error: 'Error uploading file' });
//             }
//             const { name, description, format, category } = req.body;
//             const userId = req.user.id;
//             const file = req.file;
//             const params = {
//                 Bucket: 'aws-bucket.test',
//                 Key: file.originalname,
//                 Body: fs.createReadStream(file.path),
//                 StorageClass: 'STANDARD'
//             };
//             const s3UploadResponse = await s3.upload(params).promise();
//             console.log(s3UploadResponse);
//             let existingCategory = await Category.findOne({ where: { name: category } });
//             if (!existingCategory) {
//                 existingCategory = await Category.create({
//                     name: category
//                 });
//             }
//             const podcast = await Podcast.create({
//                 name,
//                 description,
//                 format,
//                 categoryId: existingCategory.id,
//                 userId: userId,
//                 path_file: s3UploadResponse.Location
//             });

//             fs.unlinkSync(file.path);

//             res.status(200).json({ message: 'Uploaded podcast successfully', podcast });
//         });
//     } catch (error) {
//         console.error('Error uploading podcast:', error);
//         return res.status(400).json({ error: 'Error uploading podcast' });
//     }
// };


exports.uploadPodcast = async (req, res) => {
    try {
        uploadMultiple(req, res, async function (err) {
            if (req.files) {
                const { name, description, format, category } = req.body;
                const userId = req.user.id;
                const file = req.files.file[0];
                const preview = req.files.preview[0];
            
                const params = {
                    Bucket: 'aws-bucket.test',
                    Key: file.originalname,
                    Body: fs.createReadStream(file.path),
                    StorageClass: 'STANDARD'
                };
                const s3UploadResponse = await s3.upload(params).promise();
              
                const previewParams = {
                    Bucket: 'aws-bucket.test',
                    Key: preview.originalname,
                    Body: fs.createReadStream(preview.path),
                    StorageClass: 'STANDARD'
                };
           
                const s3UploadPreviewResponse = await s3.upload(previewParams).promise();
               
                let existingCategory = await Category.findOne({ where: { name: category } });
                if (!existingCategory) {
                    existingCategory = await Category.create({
                        name: category
                    });
                }
                const podcast = await Podcast.create({
                    name,
                    description,
                    format,
                    categoryId: existingCategory.id,
                    userId: userId,
                    path_file: s3UploadResponse.Location,
                    preview: s3UploadPreviewResponse.Location,
                });
                fs.unlinkSync(file.path);
                fs.unlinkSync(preview.path);

                res.status(200).json({ message: 'Uploaded podcast successfully', podcast });
            }

        })
    }
    catch (error) {
        console.error('Error uploading podcast:', error);
        return res.status(400).json({ error: 'Error uploading podcast' });
    }
}

ntpClient.getNetworkTime("pool.ntp.org", 123, function (err, date) {
    if (err) {
        console.log(err)
    } else {
        console.log('System time synchronized:', date);

        const awsTime = new Date(date);
        const awsOffset = awsTime.getTimezoneOffset() * 60 * 1000;
        const correctedTime = new Date(awsTime.getTime() - awsOffset);

        console.log('Corrected time:', correctedTime);
        AWS.config.update({ correctClockSkew: true, systemClockOffset: awsOffset });

        s3 = new AWS.S3({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: 'eu-central-1'
        });
    }
});



exports.getPodcasts = async (req, res) => {
    try {

        const userId = req.user.id;
        const podcast = await Podcast.findAll({ where: { userId: userId } });
        return res.status(200).json({ message: 'Success', podcast });
    }

    catch (error) {
        console.error('Error getting podcast:', error);
        return res.status(400).json({ error: 'Error getting podcast' });
    }
}



exports.getPodcastsById = async (req, res) => {
    try {
        const podcastId = req.params.id;
        const podcast = await Podcast.findOne({ where: { id: podcastId } });
        console.log(podcast)
        return res.status(200).json({ message: 'Success', podcast });
    }
    catch (error) {
        console.error('Error getting podcast by id:', error);
        return res.status(400).json({ error: 'Error getting podcast by id' });
    }
}


exports.getPodcastsByCategory = async (req, res) => {
    try {
        const categoryName = req.params.category;
        console.log(categoryName)
        if (!categoryName) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const category = await Category.findOne({ where: { name: categoryName } });
        console.log(category)
        const podcasts = await Podcast.findAll({ where: { categoryId: category.id } });
        return res.status(200).json({ message: 'Success', podcasts });
    }
    catch (error) {
        console.error('Error getting podcasts by category:', error);
        return res.status(400).json({ error: 'Error getting podcasts by category' });
    }
}



// exports.getLikedPodcasts = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const likes = await Like.findAll({ where: { user_id: userId } });
//         const likedPodcasts = likes.map(like => like.podcast_id);
//         const podcasts = await Podcast.findAll({
//             where: { id: likedPodcasts }
//         });

//         res.status(200).json({ likedPodcasts: podcasts });
//     }
//     catch (error) {
//         console.error('Error fetching user liked podcasts:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

exports.getLikedPodcasts = async (req, res) => {
    try {
        const userId = req.user.id;
        const likes = await Like.findAll({ where: { user_id: userId } });
        const likedPodcasts = likes.map(like => like.podcast_id);
        const podcasts = await Podcast.findAll({
            where: { id: likedPodcasts },
            include: [{ model: Category, as: 'Category' }]
        });


        if (!podcasts || podcasts.length === 0) {
            return res.status(404).json({ message: 'No liked podcasts found' });
        }


        const categorizedPodcasts = podcasts.reduce((acc, podcast) => {
            const category = podcast.Category.name;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(podcast);
            return acc;
        }, {});

        res.status(200).json({ likedPodcasts: categorizedPodcasts });
    }
    catch (error) {
        console.error('Error fetching user liked podcasts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

