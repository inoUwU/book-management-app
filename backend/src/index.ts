import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'


type BookManager = {
  id: number,
  name: string,
  status: string // TODO to const enum
}

const books: BookManager[] = [
  {
    id: 1,
    name: "Harry Potter",
    status: "Available"
  },
  {
    id: 2,
    name: "The Lord of the Rings",
    status: "Not Available"
  },
  {
    id: 3,
    name: "The Hobbit",
    status: "loaned"
  }
]

const app = new Hono()

// setting cors
app.use("/*", cors({
  origin: ["http://localhost:5173"],
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Type"],
  maxAge: 3600,
  credentials: true
}))

/**
 * 書籍の一覧を取得する
 */
app.get("/books", (c) => {
  const query = c.req.query();
  const keyword = query.keyword;
  if (keyword) {
    return c.json(books.filter(book => book.name.includes(keyword)));
  }
  return c.json(books);
})

/**
 * 書籍の状態を更新する
 */
app.put("/books/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const status = body.status;

  const book = books.find(book => book.id.toString() === id);

  if (!book) {
    c.status(404);
    return c.json({ error: "Book not found" });
  }

  book.status = status;

  return c.json(book);
})

const port = 8000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
