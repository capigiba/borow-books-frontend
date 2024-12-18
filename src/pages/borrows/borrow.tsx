import { useEffect, useState } from 'react'
import { fetchBooks, createBorrow } from '../../lib/api'

interface Book {
    id: number;
    title: string;
    author_id: number;
    published_at: string;
}

export default function BorrowBookPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null)
    const [userId, setUserId] = useState<number>(1)
    const [message, setMessage] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchBooks()
                setBooks(Array.isArray(data) ? data : [])
                if (Array.isArray(data) && data.length > 0) {
                    setSelectedBookId(data[0].id)
                }
            } catch (err) {
                console.error(err)
                setMessage('Failed to load books')
            }
        })()
    }, [])

    const handleBorrow = async () => {
        if (selectedBookId === null) {
            setMessage('No book selected')
            return
        }
        try {
            await createBorrow(selectedBookId, userId)
            setMessage(`Book ${selectedBookId} borrowed by user ${userId}!`)
        } catch (err) {
            console.error(err)
            setMessage('Failed to borrow book')
        }
    }

    return (
        <div>
            <h1>Borrow a Book</h1>
            {books.length === 0 ? (
                <p>No books available to borrow.</p>
            ) : (
                <>
                    <div>
                        <label>Select Book: </label>
                        <select onChange={e => setSelectedBookId(Number(e.target.value))}>
                            {books.map(b => (
                                <option key={b.id} value={b.id}>{b.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>User ID: </label>
                        <input type="number" value={userId} onChange={e => setUserId(Number(e.target.value))} />
                    </div>
                    <button onClick={handleBorrow}>Borrow</button>
                </>
            )}
            {message && <p>{message}</p>}
        </div>
    )
}
