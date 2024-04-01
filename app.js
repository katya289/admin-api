require('dotenv').config();
const cors = require('cors');
const express = require('express');
const apiRoutes = require('./api'); // Подключаем файл api.js

const app = express();
// app.use(express.json());

app.use(cors());
// Используем маршруты из файла api.js
app.use(express.json());
app.use('/api', apiRoutes);

// Другие настройки и мидлвары вашего Express приложения

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
