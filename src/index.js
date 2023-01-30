const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMsg } = require('./utils/messages');
const { addUser, removeUser, getUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome'));
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage(`${user.username} has joined`));

    callback();
  });

  socket.on('sendMessage', (msg, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback(`Profanity is a no no`);
    }

    io.to(user.room).emit('message', generateMessage(user.username, msg));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMsg(
        user.username,
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage(`${user.username} has left`)
      );
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`SERVER started on ${port}`));
