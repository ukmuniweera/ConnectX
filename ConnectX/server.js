const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const connectDB = require('./config/db');
const { verifyToken } = require('./middleware/authMiddleware');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/chat', verifyToken, chatRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        io.to(room).emit('message', { text: `${username} has joined the room`, sender: 'Notification' });
    });

    socket.on('chatMessage', (msg) => {
        const messageWithTimestamp = {
            ...msg,
            timestamp: new Date().getTime()
        };
        io.to(msg.room).emit('message', messageWithTimestamp);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
