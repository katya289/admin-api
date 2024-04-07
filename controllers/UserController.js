const multer = require("multer");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');



// Конфигурация хранилища для Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'avatars/'); // Указываем папку для сохранения файлов
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Используем оригинальное имя файла
    }
});

// Инициализация Multer с использованием настроенного хранилища
const upload = multer({ storage: storage });

exports.registerUser = async (req, res) => {
    try {
        // Используем метод upload.single() для обработки одиночного файла с именем "avatar"
        upload.single('avatar')(req, res, async function (err) {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(400).json({ error: 'Error uploading file' });
            }

            // Получаем данные из запроса
            const { name, email, password } = req.body;
            const avatar = req.file.originalname; // Получаем оригинальное имя файла

            // Проверяем существует ли пользователь с таким email
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            // Хешируем пароль
            const hashedPassword = await bcrypt.hash(password, 10);

            // Создаем новую запись пользователя с указанием имени файла аватара
            const newUser = await User.create({ name, email, password: hashedPassword, avatar });

            // Отправляем ответ с информацией о зарегистрированном пользователе
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
                expiresIn: 86400
            });
            return res.status(200).send({
                user: {
                    id: user.id,
                    email: user.email
                },
                message: 'Logged in successfully',
                accessToken: token
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error authorizing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAuthorizedUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });

        }
        return res.status(200).send({ message: 'Successfully fetched authorized user info', user: req.user })
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

}


