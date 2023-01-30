const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMsg } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('message', generateMessage('Welcome'));
    socket.broadcast
      .to(room)
      .emit('message', generateMessage(`${username} has joined`));
  });

  socket.on('sendMessage', (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback(`Profanity is a no no`);
    }

    io.to('web').emit('message', generateMessage(msg));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    io.to('web').emit(
      'locationMessage',
      generateLocationMsg(`https://google.com/maps?q=${latitude},${longitude}`)
    );
    callback();
  });

  socket.on('disconnect', () => {
    io.to('web').emit('message', generateMessage('A guy left'));
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`SERVER started on ${port}`));
