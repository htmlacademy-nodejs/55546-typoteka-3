
(() => {
  const MAX_COUNT_ITEMS = 4;

  const TextLength = {
    MIN: 0,
    MAX: 100
  };

  const artcilesContainer = document.querySelector(`.hot__list`);
  const commentsContainer = document.querySelector(`.last__list`);
  const socket = io(window.location.origin);

  const createElement = (html) => {
    const element = document.createElement(`div`);
    element.innerHTML = html;
    return element.firstChild;
  };

  socket.addEventListener(`update-articles`, (articles) => {
    artcilesContainer.innerHTML = ``;
    articles.forEach(({ id, announce, commentsCount }) => {
      artcilesContainer.appendChild(createElement(`<li class="hot__list-item">
        <a class="hot__list-link" href="/articles/${id}">
          ${announce.length <= TextLength.MAX ? announce : `${announce.slice(TextLength.MIN, TextLength.MAX) }...`}
          <sup class="hot__link-sup">${commentsCount}</sup>
        </a>
      </li>`));
    })
  });

  socket.addEventListener(`update-comments`, ({ text, article, author }) => {
    const items = [createElement(`<li class="last__list-item">
      <img class="last__list-image" src="/upload/users/${author.avatar}" width="20" height="20" alt="Аватар пользователя">
      <b class="last__list-name">${author.name} ${author.surname}</b>
      <a class="last__list-link" href="/articles/${article.id}">
        ${text.length <= TextLength.MAX ? text : `${text.slice(TextLength.MIN, TextLength.MAX)}...`}}
      </a>
    </li>`), ...commentsContainer.querySelectorAll(`.last__list-item`)]
      .splice(0, MAX_COUNT_ITEMS);

    commentsContainer.innerHTML = ``;
    items.forEach((it) => commentsContainer.appendChild(it));
  });

  socket.addEventListener(`connect`, () => {
    console.log(`SocketIO - подключено`);
  });

  socket.addEventListener(`disconnect`, () => {
    console.log(`SocketIO - отключено`);
  });
}) ();
