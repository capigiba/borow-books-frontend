import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    SelectChangeEvent,
} from '@mui/material';
import { fetchAuthors, fetchBookById, createBook, updateBook, deleteBook } from '../../lib/api';

interface Author {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
    author_id: number;
    published_at: string;
}

const ManageBookPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const isEditMode = !!id;

    const [authors, setAuthors] = useState<Author[]>([]);
    const [book, setBook] = useState<Book>({
        id: 0,
        title: '',
        author_id: 0,
        published_at: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    // Fetch authors
    useEffect(() => {
        const getAuthors = async () => {
            try {
                const data = await fetchAuthors();
                setAuthors(data);
            } catch (err: any) {
                console.error('Error fetching authors:', err);
                setError('Failed to fetch authors.');
            }
        };
        getAuthors();
    }, []);

    // Fetch book details if in edit mode
    useEffect(() => {
        if (isEditMode && typeof id === 'string') {
            const getBook = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetchBookById(parseInt(id));
                    if (!data) {
                        setError('Book not found.');
                    } else {
                        setBook(data);
                    }
                } catch (err: any) {
                    console.error('Error fetching book:', err);
                    setError(err.message || 'Failed to fetch book details.');
                } finally {
                    setLoading(false);
                }
            };
            getBook();
        }
    }, [id, isEditMode]);

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBook((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAuthorSelectChange = (e: SelectChangeEvent<number>) => {
        const { value } = e.target;
        setBook((prev) => ({
            ...prev,
            author_id: value as number,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (isEditMode && typeof id === 'string') {
                await updateBook(parseInt(id), book.title, book.author_id, book.published_at);
                alert('Book updated successfully');
            } else {
                await createBook(book.title, book.author_id, book.published_at);
                alert('Book created successfully');
            }
            router.push('/books');
        } catch (err: any) {
            console.error('Error saving book:', err);
            setError(err.message || 'Failed to save book.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditMode || typeof id !== 'string') return;
        setSaving(true);
        setError(null);
        try {
            await deleteBook(parseInt(id));
            alert('Book deleted successfully');
            router.push('/books');
        } catch (err: any) {
            console.error('Error deleting book:', err);
            setError(err.message || 'Failed to delete book.');
        } finally {
            setSaving(false);
            setDeleteDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {isEditMode ? 'Edit Book' : 'Add Book'}
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Title */}
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Title"
                            name="title"
                            value={book.title}
                            onChange={handleTextFieldChange}
                        />
                    </Grid>

                    {/* Author Selection */}
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Author</InputLabel>
                            <Select
                                name="author_id"
                                value={book.author_id}
                                onChange={handleAuthorSelectChange}
                                label="Author"
                            >
                                {authors.map((author) => (
                                    <MenuItem key={author.id} value={author.id}>
                                        {author.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Published At */}
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Published At"
                            type="date"
                            name="published_at"
                            value={book.published_at ? book.published_at.split('T')[0] : ''}
                            onChange={handleTextFieldChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={saving}
                        >
                            {saving ? <CircularProgress size={24} /> : isEditMode ? 'Update Book' : 'Add Book'}
                        </Button>

                        {isEditMode && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                style={{ marginLeft: '10px' }}
                                onClick={() => setDeleteDialogOpen(true)}
                                disabled={saving}
                            >
                                Delete Book
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Book</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this book? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" disabled={saving}>
                        {saving ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageBookPage;
