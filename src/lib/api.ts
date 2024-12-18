// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

async function fetchData(endpoint: string, filters?: string[], sorts?: string[], fields?: string) {
    const params = new URLSearchParams();
    if (filters && filters.length > 0) {
        filters.forEach(f => params.append('filter', f));
    }
    if (sorts && sorts.length > 0) {
        sorts.forEach(s => params.append('sort', s));
    }
    if (fields && fields.trim() !== '') {
        params.append('fields', fields);
    }

    const res = await fetch(`${API_BASE_URL}/${endpoint}?${params.toString()}`);
    if (!res.ok) {
        // Attempt to extract error message from response
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || `Failed to fetch ${endpoint}`;
        throw new Error(errorMessage);
    }
    return res.json();
}

export async function fetchBooks(filters?: string[], sorts?: string[], fields?: string) {
    return fetchData('books', filters, sorts, fields);
}

export async function fetchBookById(id: number) {
    return fetchData(`books/${id}`);
}

export async function fetchAuthors(filters?: string[], sorts?: string[], fields?: string) {
    return fetchData('authors', filters, sorts, fields);
}

export async function fetchBorrows(filters?: string[], sorts?: string[], fields?: string) {
    return fetchData('borrows', filters, sorts, fields);
}

// CRUD for Books
export async function createBook(title: string, author_id: number, published_at: string) {
    const res = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author_id, published_at })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to create book';
        throw new Error(errorMessage);
    }
    return res.json();
}

export async function updateBook(id: number, title: string, author_id: number, published_at: string) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author_id, published_at })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to update book';
        throw new Error(errorMessage);
    }
    return res.json();
}

export async function deleteBook(id: number) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to delete book';
        throw new Error(errorMessage);
    }
    return;
}

// CRUD for Authors
export async function createAuthor(name: string) {
    const res = await fetch(`${API_BASE_URL}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to create author';
        throw new Error(errorMessage);
    }
    return res.json();
}

export async function updateAuthor(id: number, name: string) {
    const res = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to update author';
        throw new Error(errorMessage);
    }
    return res.json();
}

export async function deleteAuthor(id: number) {
    const res = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to delete author';
        throw new Error(errorMessage);
    }
    return;
}

// Create a Borrow
export async function createBorrow(book_id: number, user_id: number) {
    const res = await fetch(`${API_BASE_URL}/borrows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id, user_id })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to create borrow record';
        throw new Error(errorMessage);
    }
    return res.json();
}
