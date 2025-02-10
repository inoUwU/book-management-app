import { use, useActionState } from "react"
import { BookManage, BookManageJson, BookState } from "./domain/book";


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
  const [bookState, updateBookState, isPending] = useActionState(async (preveState: BookState | undefined, formDate: FormData): Promise<BookState> => {
    if (!preveState) {
      throw new Error('preveState is undefined');
    }

    const name = formDate.get('bookName');
    if (!name) {
      throw new Error('name is undefined');
    }
    const response = await fetch('http://localhost:8000/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('response is not ok');
    }
    const book: BookManageJson = await response.json();

    bookState.allBooks.push(new BookManage(book.id, book.name, book.status));
    return { ...preveState.allBooks, allBooks: [...bookState.allBooks] };
  }, { allBooks: initialBooks });

  return (
    <>
      <div>
        <form action={updateBookState}>
          <input type="text" name="bookName" placeholder="書籍名" />
          <button className="bg-blue-500" type="submit" disabled={isPending}>
            追加
          </button>
        </form>
        <ul>
          {bookState.allBooks.map((book: BookManage) => (
            <li key={book.id}>{book.name} - {book.status}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
