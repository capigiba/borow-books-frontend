import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Stack,
} from '@mui/material';
import { fetchBooks, fetchAuthors } from '../lib/api';
import { useRouter } from 'next/router';
import FieldVisibilitySelector from '../components/FieldVisibilitySelector';
import FilterManager from '../components/FilterManager';
import SortManager from '../components/SortManager';
import ActionButtons from '../components/ActionButtons';
import DataTable from '../components/DataTable';
import NotificationSnackbar from '../components/NotificationSnackbar';

interface Book {
    id: number;
    title: string;
    author_id: number;
    published_at: string;
    // Add other fields if necessary
}

interface Author {
    id: number;
    name: string;
}

const availableFields = ['id', 'title', 'author_id', 'published_at'];
const filterOperators = [
    { label: 'Equals', value: 'eq' },
    { label: 'Not Equals', value: 'neq' },
    { label: 'Greater Than', value: 'gt' },
    { label: 'Greater Than or Equal', value: 'gte' },
    { label: 'Less Than', value: 'lt' },
    { label: 'Less Than or Equal', value: 'lte' },
    { label: 'Contains', value: 'ilike' },
];
const sortOrders = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
];

const BooksPage: React.FC = () => {
    const router = useRouter();

    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedFields, setSelectedFields] = useState<string[]>(['id', 'title', 'author_id', 'published_at']);
    const [filters, setFilters] = useState<{ field: string; operator: string; value: string }[]>([]);
    const [sorts, setSorts] = useState<{ field: string; order: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchBooksData = async () => {
        setLoading(true);
        setError(null);
        try {
            const filterParams = filters.map(f => `${f.field}__${f.operator}__${f.value}`);
            const sortParams = sorts.map(s => `${s.field}__${s.order}`);
            const fieldsParam = selectedFields.join(',');

            const data = await fetchBooks(filterParams, sortParams, fieldsParam);
            setBooks(data);
            setSuccessMessage('Books fetched successfully!');
        } catch (err: any) {
            console.error('Error fetching books:', err);
            setError(err.message || 'Failed to fetch books.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAuthorsData = async () => {
        try {
            const data = await fetchAuthors();
            setAuthors(data);
        } catch (err: any) {
            console.error('Error fetching authors:', err);
            setError('Failed to fetch authors.');
        }
    };

    useEffect(() => {
        fetchAuthorsData();
        fetchBooksData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddFilter = () => {
        setFilters([...filters, { field: 'title', operator: 'eq', value: '' }]);
    };

    const handleRemoveFilter = (index: number) => {
        const newFilters = [...filters];
        newFilters.splice(index, 1);
        setFilters(newFilters);
    };

    const handleFilterChange = (index: number, key: string, value: string) => {
        const newFilters = [...filters];
        (newFilters[index] as any)[key] = value;
        setFilters(newFilters);
    };

    const handleAddSort = () => {
        setSorts([...sorts, { field: 'title', order: 'asc' }]);
    };

    const handleRemoveSort = (index: number) => {
        const newSorts = [...sorts];
        newSorts.splice(index, 1);
        setSorts(newSorts);
    };

    const handleSortChange = (index: number, key: string, value: string) => {
        const newSorts = [...sorts];
        (newSorts[index] as any)[key] = value;
        setSorts(newSorts);
    };

    const handleFieldVisibilityChange = (fields: string[]) => {
        setSelectedFields(fields);
    };

    const handleApplyFilters = () => {
        fetchBooksData();
    };

    const handleResetFilters = () => {
        setFilters([]);
        setSorts([]);
        setSelectedFields(['id', 'title', 'author_id', 'published_at']);
        fetchBooksData();
    };

    const getAuthorName = (author_id: number) => {
        const author = authors.find(a => a.id === author_id);
        return author ? author.name : 'Unknown';
    };

    const handleEdit = (bookId: number) => {
        router.push(`/books/manage?id=${bookId}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Books
            </Typography>

            {/* Controls Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Stack spacing={2}>
                    {/* Field Visibility */}
                    <FieldVisibilitySelector
                        availableFields={availableFields}
                        selectedFields={selectedFields}
                        onChange={handleFieldVisibilityChange}
                        label="Fields to Display"
                    />

                    {/* Filters */}
                    <FilterManager
                        availableFields={availableFields}
                        filterOperators={filterOperators}
                        filters={filters}
                        onAdd={handleAddFilter}
                        onRemove={handleRemoveFilter}
                        onChange={handleFilterChange}
                    />

                    {/* Sorting */}
                    <SortManager
                        availableFields={availableFields}
                        sortOrders={sortOrders}
                        sorts={sorts}
                        onAdd={handleAddSort}
                        onRemove={handleRemoveSort}
                        onChange={handleSortChange}
                    />
                </Stack>

                {/* Action Buttons */}
                <ActionButtons onApply={handleApplyFilters} onReset={handleResetFilters} />
            </Paper>

            {/* Display Books */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <DataTable<Book>
                    data={books}
                    selectedFields={selectedFields}
                    loading={loading}
                    error={error}
                    getDisplayValue={(item, field) => {
                        if (field === 'author_id') return getAuthorName(item.author_id);
                        return (item as any)[field];
                    }}
                    onEdit={handleEdit}
                    emptyMessage="No books found."
                />
            </Paper>

            {/* Notification Snackbars */}
            <NotificationSnackbar
                open={!!successMessage}
                message={successMessage || ''}
                severity="success"
                onClose={() => setSuccessMessage(null)}
                autoHideDuration={3000}
            />

            <NotificationSnackbar
                open={!!error}
                message={error || ''}
                severity="error"
                onClose={() => setError(null)}
                autoHideDuration={6000}
            />
        </Container>
    );
};

export default BooksPage;