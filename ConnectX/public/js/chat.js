const socket = io();

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const userResponse = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const userData = await userResponse.json();
    const currentUser = userData.username;

    const messageContainer = document.getElementById('message-container');

    const addMessage = (message, sender, username, timestamp) => {
        const messageElement = document.createElement('div');
        let formattedTimestamp = '';
        if (typeof timestamp === 'number') {
            const date = new Date(timestamp);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString();
            formattedTimestamp = `[${dateString} | ${timeString}]`;
        }
        if (sender === 'Notification') {
            messageElement.textContent = `Notification 🔔: ${message}`;
        } else if (sender === userData._id) {
            messageElement.textContent = `You 📤: ${message} ${formattedTimestamp}`;
        } else {
            messageElement.textContent = `${username} 📥: ${message} ${formattedTimestamp}`;
        }
        messageContainer.appendChild(messageElement);
    };

    socket.on('message', (msg) => {
        addMessage(msg.text, msg.sender, msg.username, msg.timestamp);
    });

    socket.on('joinRoom', (msg) => {
        addMessage(msg.text, msg.sender, msg.username, msg.timestamp);
    });

    document.getElementById('message-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value;

        if (!message) return;

        socket.emit('chatMessage', {
            text: message,
            sender: userData._id,
            room: 'chatroom',
            username: currentUser
        });

        messageInput.value = '';
    });

    socket.emit('joinRoom', { username: currentUser, room: 'chatroom' });
});
