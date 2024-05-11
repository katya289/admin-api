const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./api');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use('/avatars', express.static('avatars'));
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('newComment', (data) => {
        console.log(`New comment: ${data.comment} from ${data.author}`);
        socket.broadcast.emit('notifyComment', {
            author: data.author,
            message: 'добавил комментарий к вашему подкасту',
            podcastId: data.podcastId
        });
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
