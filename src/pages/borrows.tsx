// import { useEffect, useState } from 'react'
// import { fetchBorrows } from '../lib/api'
// import FilterForm from '../components/FilterForm'
// import SortForm from '../components/SortForm'
// import FieldsForm from '../components/FieldsForm'

// interface Borrow {
//     id: number;
//     book_id: number;
//     user_id: number;
//     borrowed_at: string;
// }

// export default function BorrowsPage() {
//     const [borrows, setBorrows] = useState<Borrow[]>([])
//     const [filters, setFilters] = useState<string[]>([])
//     const [sorts, setSorts] = useState<string[]>([])
//     const [fields, setFields] = useState('')
//     const [message, setMessage] = useState('')

//     useEffect(() => {
//         (async () => {
//             try {
//                 const data = await fetchBorrows(filters, sorts, fields)
//                 setBorrows(Array.isArray(data) ? data : [])
//             } catch (err) {
//                 console.error(err)
//                 setMessage('Failed to load borrows')
//             }
//         })()
//     }, [filters, sorts, fields])

//     return (
//         <div>
//             <h1>Borrows</h1>
//             <p>Use filters, sorts, and fields to customize the view.</p>

//             <h2>Display Fields</h2>
//             <FieldsForm onChangeFields={setFields} />

//             <h2>Add Filters</h2>
//             <FilterForm onAddFilter={f => setFilters([...filters, f])} />
//             {filters.length > 0 && (
//                 <ul>
//                     {filters.map((f, i) => <li key={i}>{f}</li>)}
//                 </ul>
//             )}

//             <h2>Add Sorts</h2>
//             <SortForm onAddSort={s => setSorts([...sorts, s])} />
//             {sorts.length > 0 && (
//                 <ul>
//                     {sorts.map((s, i) => <li key={i}>{s}</li>)}
//                 </ul>
//             )}

//             {message && <p>{message}</p>}

//             <h2>Results</h2>
//             {borrows.length === 0 ? (
//                 <p>No borrow records found.</p>
//             ) : (
//                 <table border={1} cellPadding={5}>
//                     <thead>
//                         <tr>
//                             {Object.keys(borrows[0]).map((key, i) => (
//                                 <th key={i}>{key}</th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {borrows.map((b, idx) => (
//                             <tr key={idx}>
//                                 {Object.entries(b).map(([k, v], i) => <td key={i}>{String(v)}</td>)}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     )
// }
