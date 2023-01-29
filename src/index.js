const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.emit('message', 'Welcome');
  socket.broadcast.emit('message', 'A new guy');

  socket.on('sendMessage', (msg) => {
    io.emit('message', msg);
  });

  socket.on('sendLocation', ({ latitude, longitude }) => {
    io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A guy left');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`SERVER started on ${port}`));
