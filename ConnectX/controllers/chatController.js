const Message = require('../models/Message');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.receiverId },
                { sender: req.params.receiverId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(400).json({ msg: 'Failed to fetch messages', error });
    }
};

exports.sendMessage = async (req, res) => {
    const { text } = req.body;
    try {
        const message = await Message.create({
            sender: req.user.id,
            receiver: req.params.receiverId,
            text
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ msg: 'Failed to send message', error });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) throw Error('User not found');
        
        req.app.get('io').emit('joinRoom', { text: `${user.username} has joined the room`, sender: 'Alert', username: user.username });
        res.sendStatus(200);
    } catch (error) {
        res.status(400).json({ msg: 'Failed to join room', error });
    }
};
