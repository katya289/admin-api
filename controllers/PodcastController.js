const AWS = require('aws-sdk');
const fs = require('fs');
const ntpClient = require('ntp-client');
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Podcast = require('../models/Podcast');
const multer = require('multer');

let s3; // Определение переменной s3 здесь
const upload = multer({dest: 'uploads/'});

// Функция uploadPodcast
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
    } catch (error) {
        console.error('Error uploading podcast:', error);
        return res.status(400).json({ error: 'Error uploading podcast' });
    }
};

// Получение сетевого времени и установка AWS SDK
ntpClient.getNetworkTime("pool.ntp.org", 123, function(err, date) {
    if (err) {
        console.log(err)
    } else {
        console.log('System time synchronized:', date);

        const awsTime = new Date(date); // Время вашего сервера
        const awsOffset = awsTime.getTimezoneOffset() * 60 * 1000; // Получение смещения времени вашего сервера
        const correctedTime = new Date(awsTime.getTime() - awsOffset); // Корректировка времени вашего сервера

        console.log('Corrected time:', correctedTime);

        // Настройка AWS SDK с корректированным временем
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
        // const podcast = req.body;
        const userId = req.user.id;
        const podcast = await Podcast.findAll({ where: { userId: userId } });
        return res.status(200).json({ message: 'Success', podcast });
    }

    catch (error) {
        console.error('Error getting podcast:', error);
        return res.status(400).json({ error: 'Error getting podcast' });
    }
}