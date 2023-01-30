const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const { message } = event.target.elements;

  socket.emit('sendMessage', message.value, (error) => {
    if (error) {
      return console.log(error);
    }

    console.log('Message delivered');
  });
});

document.querySelector('#send-location').addEventListener('click', (event) => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => console.log('Location shared')
    );
  });
});
