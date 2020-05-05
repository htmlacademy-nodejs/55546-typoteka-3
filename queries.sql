
-- Получить список всех категорий (идентификатор, наименование категории);
SELECT id, title FROM categories;

-- Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT id, title FROM categories WHERE EXISTS (SELECT COUNT(*) FROM articles_category WHERE articles_category.category_id = categories.id);

-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT id, title, (SELECT COUNT(*) FROM articles_category WHERE articles_category.category_id = categories.id) as total FROM categories;

-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора,
-- контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
SELECT
  a.id,
  a.title,
  a.announce,
  a.img,
  a.full_text,
  a.date_create,
  u.name,
  u.email,
  (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comment_count,
  string_agg(DISTINCT ct.title, ',') as categories
  FROM articles a
  JOIN users u ON a.author_id = u.id
  JOIN articles_category oct ON a.id = oct.article_id
  JOIN categories ct ON oct.category_id = ct.id
  GROUP BY a.id, u.name, u.email
  ORDER BY a.date_create;

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, дата публикации, путь к изображению,
-- имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT
  a.id,
  a.title,
  a.announce,
  a.img,
  a.full_text,
  a.date_create,
  u.name,
  u.email,
  (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comment_count,
  string_agg(DISTINCT ct.title, ',') as categories
  FROM articles a
  JOIN users u ON a.author_id = u.id
  JOIN articles_category oct ON a.id = oct.article_id
  JOIN categories ct ON oct.category_id = ct.id
  WHERE o.id = 1
  GROUP BY a.id, u.name, u.email;

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT c.*, u.name FROM comments c
  JOIN users u ON c.author_id = u.id
  ORDER BY date_create
  LIMIT 5;

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария).
-- Сначала новые комментарии;
SELECT c.*, u.name, u.surname FROM comments c
  JOIN users u ON c.author_id = u.id
  WHERE c.article_id = 1
  ORDER BY date_create;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles SET title = 'Как я встретил Новый год' WHERE id = 1;
