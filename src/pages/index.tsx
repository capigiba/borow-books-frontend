import Link from 'next/link'

export default function Home() {
    return (
        <div>
            <h1>Welcome to the Book Borrowing App</h1>
            <p>Use the links below to view and manage data:</p>
            <nav>
                <ul>
                    <li><Link href="/books">View & Filter Books</Link></li>
                    <li><Link href="/authors">View & Filter Authors</Link></li>
                    <li><Link href="/borrows">View & Filter Borrows</Link></li>
                    <li><Link href="/raw">Run Raw Query (Admin)</Link></li>
                    <li><Link href="/books/manage">Manage Books (Create/Update/Delete)</Link></li>
                    <li><Link href="/authors/manage">Manage Authors (Create/Update/Delete)</Link></li>
                    <li><Link href="/borrows/borrow">Borrow a Book</Link></li>
                </ul>
            </nav>
        </div>
    )
}
