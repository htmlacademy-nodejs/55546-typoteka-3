(() => {
  const artcilesContainer = document.querySelector(`.last__list`);
  const commentsContainer = document.querySelector(`.hot__list`);
  const socket = io('http://localhost:3000');

  const MAX_COUNT_ITEMS = 4;

  const createItem = (container, itemSelector, itemTemplate) => {
    const items = container.querySelectorAll(itemSelector);
    if (items.length >= MAX_COUNT_ITEMS) {
      items[0].remove();
    }

    container.insertAdjacentHTML(`beforeEnd`, itemTemplate);
  };

  socket.addEventListener(`test`, (data) => console.log(data));

  socket.addEventListener(`update-artciles`, (data) => {
    console.log(`CLIENT update-artciles`, data);
    createItem(artcilesContainer, `.last__list-item`, `<li class="last__list-item">
      <img class="last__list-image" src="/upload/users/admin-1.jpg" width="20" height="20" alt="Аватар пользователя">
      <b class="last__list-name">Admin Adminov</b>
      <a class="last__list-link" href="/articles/8">Согласен с автором! Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компью...</a>
    </li>`);
  });

  socket.addEventListener(`update-comments`, (data) => {
    console.log(`CLIENT update-comments`, data);
    createItem(commentsContainer, `.hot__list-item`, `<li class="hot__list-item">
      <a class="hot__list-link" href="/articles/10">
        Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка.Бол...
        <sup class="hot__link-sup">10</sup>
      </a>
    </li>`);
  });

  socket.addEventListener(`connect`, () => {
    console.log(`SocketIO - подключено`);
  });

  socket.addEventListener(`disconnect`, () => {
    console.log(`SocketIO - отключено`);
  });
}) ();
