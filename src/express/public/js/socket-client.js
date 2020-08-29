
(async () => {
  const MAX_COUNT_ITEMS = 4;

  const SocketEvent = await fetch(`/api/data/get-socket-event-const`)
    .then((result) => result.json())
    .catch((error) => {
      console.error(`Ошибка при получении констант событий для SocketIO: ${error}`);
      return {};
    });

  const artcilesContainer = document.querySelector(`.hot__list`);
  const commentsContainer = document.querySelector(`.last__list`);
  const socket = io(window.location.origin);

  const createElement = (html) => {
    const element = document.createElement(`div`);
    element.innerHTML = html;
    return element.firstChild;
  };

  socket.addEventListener(SocketEvent.UPDATE_ARTICLESS, (articles) => {
    artcilesContainer.innerHTML = ``;
    articles.forEach(({id, commentsCount, limitAnnounce}) => {
      artcilesContainer.appendChild(createElement(`<li class="hot__list-item">
        <a class="hot__list-link" href="/articles/${id}">
          ${limitAnnounce}
          <sup class="hot__link-sup">${commentsCount}</sup>
        </a>
      </li>`));
    })
  });

  socket.addEventListener(SocketEvent.UPDATE_COMMENTS, ({article, author, limitText}) => {
    const items = [createElement(`<li class="last__list-item">
      <img class="last__list-image" src="/upload/users/${author.avatar}" width="20" height="20" alt="Аватар пользователя">
      <b class="last__list-name">${author.name} ${author.surname}</b>
      <a class="last__list-link" href="/articles/${article.id}">
        ${limitText}
      </a>
    </li>`), ...commentsContainer.querySelectorAll(`.last__list-item`)]
      .splice(0, MAX_COUNT_ITEMS);

    commentsContainer.innerHTML = ``;
    items.forEach((it) => commentsContainer.appendChild(it));
  });

  socket.addEventListener(SocketEvent.CONNECT, () => {
    console.log(`SocketIO - подключено`);
  });

  socket.addEventListener(SocketEvent.DISCONNECT, () => {
    console.log(`SocketIO - отключено`);
  });
}) ();
