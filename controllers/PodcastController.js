const AWS = require('aws-sdk');
const fs = require('fs');

var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Podcast = require('../models/Podcast');


const multer = require('multer'); 
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});


const upload = multer({ dest: 'uploads/' });

exports.uploadPodcast = async (req, res) => {
    try {

        upload.single('file')(req, res, async function(err) {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(400).json({ error: 'Error uploading file' });
            }

            const { name, description, format, category } = req.body;
            const userId = req.user.id; 
            const file = req.file; 
            const params = {
                Bucket: 'aws-bucket.test',
                Key: file.originalname, 
                Body: fs.createReadStream(file.path), 
                StorageClass: 'STANDARD'
            };
            const s3UploadResponse = await s3.upload(params).promise();
            console.log(s3UploadResponse)
            const podcast = await Podcast.create({ name, description, format, category, path_file: s3UploadResponse.Location, userId });

            fs.unlinkSync(file.path);

            res.status(200).json({ message: 'Uploaded podcast successfully', podcast });
        });
    }
    catch (error) {
        console.error('Error uploading podcast:', error);
        return res.status(400).json({ error: 'Error uploading podcast' });
    }
}

