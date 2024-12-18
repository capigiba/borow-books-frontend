import { useState } from 'react'

export default function RawQueryPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])

    const runQuery = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/extra-query/raw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        })

        if (!res.ok) {
            console.error('Failed to run query')
            return
        }
        const data = await res.json()
        setResults(data)
    }

    return (
        <div>
            <h1>Run Raw Query (Admin Use Only)</h1>
            <p>Enter a raw SQL query. This is for administrative purposes, not general customer use.</p>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM books;"
            />
            <button onClick={runQuery}>Execute</button>

            <h2>Results</h2>
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
    )
}
