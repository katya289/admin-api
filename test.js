const AWS = require('aws-sdk');
const fs = require('fs');

// Создание экземпляра S3 клиента
const s3 = new AWS.S3({
  accessKeyId: 'AKIARGWINUHMYBN2CEW4',
  secretAccessKey: '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'
});

// Параметры для загрузки файла на Amazon S3
const params = {
  Bucket: 'aws-bucket.test',
  Key: '49.jpg',
  Body: fs.createReadStream('49.jpg'),
 
  StorageClass: 'STANDARD' // Класс хранения
};

// Загрузка файла на Amazon S3
s3.upload(params, (err, data) => {
  if (err) {
    console.error('Error uploading file:', err);
  } else {
    console.log('File uploaded successfully:', data);
  }
});
