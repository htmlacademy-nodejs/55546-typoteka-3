(() => {
  const artcilesContainer = document.querySelector(`.last__list`);
  const commentsContainer = document.querySelector(`.hot__list`);
  const socket = io('http://localhost:3000');

  socket.addEventListener(`update-artciles`, (data) => {
    console.log(data);
  });

  socket.addEventListener(`update-comments`, (data) => {
    console.log(data);
  });

  socket.addEventListener(`connect`, () => {
    console.log(`SocketIO - подключено`);
  });

  socket.addEventListener(`disconnect`, () => {
    console.log(`SocketIO - отключено`);
  });
}) ();
