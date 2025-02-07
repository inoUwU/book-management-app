import { use } from "react"
import { BookManage } from "./domain/book";


async function fetchBookMange(): Promise<BookManage[]> {
  // サスペンドを体感するために1秒待つ
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const response = await fetch('http://localhost:8000/books')
  const data = await response.json();
  return data.map((book: { id: number; name: string; status: string; }) => new BookManage(book.id, book.name, book.status));
}

const fetchBookMangePromise = fetchBookMange();

function App() {
  // use でサスペンド可能な関数を呼び出す
  const initialBooks = use(fetchBookMangePromise);

  return (
    <>
      <div>
        <ul>
          {initialBooks.map(book => (
            <li key={book.id}>{book.name} - {book.status}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
