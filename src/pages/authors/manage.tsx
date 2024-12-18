import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/router';
import { fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../lib/api';

interface Author {
    id: number;
    name: string;
}

const ManageAuthorPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    // If `id` is provided in the query string, we assume we're editing that author
    // Otherwise, if no id, we could still show a dropdown and allow changing selection
    // Or if the user wants to handle it differently, we can always ignore `id`.
    // For now, let's just respect the `id` if it's present, but also allow changing the selected author via the dropdown.

    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthorId, setSelectedAuthorId] = useState<number | ''>(id ? parseInt(id as string, 10) : '');
    const [authorName, setAuthorName] = useState<string>('');
    const [loadingAuthors, setLoadingAuthors] = useState<boolean>(false);
    const [loadingAuthorDetails, setLoadingAuthorDetails] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const isEditMode = selectedAuthorId !== '';

    // Fetch all authors to populate the dropdown
    useEffect(() => {
        const getAuthors = async () => {
            setLoadingAuthors(true);
            setError(null);
            try {
                // No filters, sorts, or fields passed for simplicity
                const data = await fetchAuthors();
                setAuthors(data);
            } catch (err: any) {
                console.error('Error fetching authors:', err);
                setError('Failed to fetch authors.');
            } finally {
                setLoadingAuthors(false);
            }
        };
        getAuthors();
    }, []);

    // Fetch author details if an author is selected
    useEffect(() => {
        const fetchAuthorDetails = async (authorId: number) => {
            setLoadingAuthorDetails(true);
            setError(null);
            try {
                const res = await fetch(`/api/authors/${authorId}`);
                if (!res.ok) {
                    const errData = await res.json().catch(() => null);
                    throw new Error(errData?.error || 'Failed to fetch author details.');
                }
                const authorData: Author = await res.json();
                if (!authorData) {
                    setError('Author not found.');
                } else {
                    setAuthorName(authorData.name);
                }
            } catch (err: any) {
                console.error('Error fetching author details:', err);
                setError(err.message || 'Failed to fetch author details.');
            } finally {
                setLoadingAuthorDetails(false);
            }
        };

        if (isEditMode && typeof selectedAuthorId === 'number') {
            fetchAuthorDetails(selectedAuthorId);
        } else {
            // If no author is selected, clear the name field
            setAuthorName('');
        }
    }, [selectedAuthorId, isEditMode]);

    const handleAuthorSelectChange = (event: SelectChangeEvent<number>) => {
        const val = event.target.value as number | '';
        setSelectedAuthorId(val);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthorName(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (isEditMode && typeof selectedAuthorId === 'number') {
                // Update mode
                await updateAuthor(selectedAuthorId, authorName);
                alert('Author updated successfully');
            } else {
                // Create mode
                await createAuthor(authorName);
                alert('Author created successfully');
            }
            router.push('/authors');
        } catch (err: any) {
            console.error('Error saving author:', err);
            setError(err.message || 'Failed to save author.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditMode || typeof selectedAuthorId !== 'number') return;
        setSaving(true);
        setError(null);
        try {
            await deleteAuthor(selectedAuthorId);
            alert('Author deleted successfully');
            router.push('/authors');
        } catch (err: any) {
            console.error('Error deleting author:', err);
            setError(err.message || 'Failed to delete author.');
        } finally {
            setSaving(false);
            setDeleteDialogOpen(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Manage Author
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            {loadingAuthors ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Author Selection Dropdown for update/delete */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select an Author to Edit (or leave blank to create new)</InputLabel>
                                <Select
                                    value={selectedAuthorId}
                                    onChange={handleAuthorSelectChange}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Create New Author</em>
                                    </MenuItem>
                                    {authors.map((author) => (
                                        <MenuItem key={author.id} value={author.id}>
                                            {author.name} (ID: {author.id})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Author Name Field */}
                        <Grid item xs={12}>
                            {loadingAuthorDetails ? (
                                <CircularProgress />
                            ) : (
                                <TextField
                                    required
                                    fullWidth
                                    label="Author Name"
                                    name="name"
                                    value={authorName}
                                    onChange={handleNameChange}
                                />
                            )}
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={saving || loadingAuthorDetails}
                            >
                                {saving ? (
                                    <CircularProgress size={24} />
                                ) : isEditMode ? 'Update Author' : 'Create Author'}
                            </Button>

                            {isEditMode && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => setDeleteDialogOpen(true)}
                                    disabled={saving || loadingAuthorDetails}
                                >
                                    Delete Author
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Author</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this author? This action cannot be undone.
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

export default ManageAuthorPage;
