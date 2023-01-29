const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#msgForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const { message } = event.target.elements;

  socket.emit('sendMessage', message.value);
});
