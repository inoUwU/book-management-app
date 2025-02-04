import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

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

app.get("/books", (c) => {

  const query = c.req.query();
  const keyword = query.keyword;
  if (keyword) {
    return c.json(books.filter(book => book.name.includes(keyword)));
  }
  return c.json(books);
})

app.post("/books", async (c) => {
  const body = await c.req.json();
  const name = body.name;

  const newBook = {
    id: books.length + 1,
    name,
    status: "Available"
  }
  books.push(newBook);

  return c.json(newBook);
})

const port = 8000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
