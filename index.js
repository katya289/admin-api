const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' }); 

const s3 = new AWS.S3({
  accessKeyId: 'AKIARGWINUHMYBN2CEW4',
  secretAccessKey: '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'
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }
  const params = {
    Bucket: 'aws-bucket.test',
    Key: file.originalname,
    Body: fs.createReadStream(file.path),
    StorageClass: 'STANDARD' 
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      res.status(500).send('Error uploading file');
    } else {
      console.log('File uploaded successfully:', data);
      res.send('File uploaded successfully');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
