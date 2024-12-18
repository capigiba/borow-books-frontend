import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Button,
    Grid,
    TextField,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Snackbar,
    Alert,
    Box,
    Stack,
} from '@mui/material';
import { AddCircle, RemoveCircle, ExpandMore } from '@mui/icons-material';
import { fetchBooks, fetchAuthors } from '../lib/api';
import { useRouter } from 'next/router';

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
    { label: 'Contains', value: 'ilike' }, // 'ilike' for case-insensitive partial matches
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

    const handleFieldVisibilityChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedFields(typeof value === 'string' ? value.split(',') : value);
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
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Field Visibility</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel id="fields-to-display-label">Fields to Display</InputLabel>
                                <Select
                                    labelId="fields-to-display-label"
                                    id="fields-to-display"
                                    multiple
                                    value={selectedFields}
                                    onChange={handleFieldVisibilityChange}
                                    label="Fields to Display"
                                    renderValue={(selected) => (selected as string[]).join(', ')}
                                >
                                    {availableFields.map((field) => (
                                        <MenuItem key={field} value={field}>
                                            <Checkbox checked={selectedFields.indexOf(field) > -1} />
                                            <ListItemText primary={field.charAt(0).toUpperCase() + field.slice(1)} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>

                    {/* Filters */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Filters</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                {filters.map((filter, index) => (
                                    <Grid container spacing={2} alignItems="center" key={index}>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth variant="outlined" margin="normal">
                                                <InputLabel id={`filter-field-label-${index}`}>Field</InputLabel>
                                                <Select
                                                    labelId={`filter-field-label-${index}`}
                                                    id={`filter-field-${index}`}
                                                    value={filter.field}
                                                    onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                                                    label="Field"
                                                >
                                                    {availableFields.map((field) => (
                                                        <MenuItem key={field} value={field}>
                                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth variant="outlined" margin="normal">
                                                <InputLabel id={`filter-operator-label-${index}`}>Operator</InputLabel>
                                                <Select
                                                    labelId={`filter-operator-label-${index}`}
                                                    id={`filter-operator-${index}`}
                                                    value={filter.operator}
                                                    onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                                                    label="Operator"
                                                >
                                                    {filterOperators.map((op) => (
                                                        <MenuItem key={op.value} value={op.value}>
                                                            {op.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                margin="normal"
                                                label="Value"
                                                value={filter.value}
                                                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <IconButton color="error" onClick={() => handleRemoveFilter(index)}>
                                                <RemoveCircle />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircle />}
                                    onClick={handleAddFilter}
                                    color="primary"
                                >
                                    Add Filter
                                </Button>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    {/* Sorting */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Sorting</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                {sorts.map((sort, index) => (
                                    <Grid container spacing={2} alignItems="center" key={index}>
                                        <Grid item xs={12} sm={5}>
                                            <FormControl fullWidth variant="outlined" margin="normal">
                                                <InputLabel id={`sort-field-label-${index}`}>Field</InputLabel>
                                                <Select
                                                    labelId={`sort-field-label-${index}`}
                                                    id={`sort-field-${index}`}
                                                    value={sort.field}
                                                    onChange={(e) => handleSortChange(index, 'field', e.target.value)}
                                                    label="Field"
                                                >
                                                    {availableFields.map((field) => (
                                                        <MenuItem key={field} value={field}>
                                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <FormControl fullWidth variant="outlined" margin="normal">
                                                <InputLabel id={`sort-order-label-${index}`}>Order</InputLabel>
                                                <Select
                                                    labelId={`sort-order-label-${index}`}
                                                    id={`sort-order-${index}`}
                                                    value={sort.order}
                                                    onChange={(e) => handleSortChange(index, 'order', e.target.value)}
                                                    label="Order"
                                                >
                                                    {sortOrders.map((order) => (
                                                        <MenuItem key={order.value} value={order.value}>
                                                            {order.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <IconButton color="error" onClick={() => handleRemoveSort(index)}>
                                                <RemoveCircle />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircle />}
                                    onClick={handleAddSort}
                                    color="primary"
                                >
                                    Add Sort
                                </Button>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Stack>

                {/* Action Buttons */}
                <Box mt={3}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleApplyFilters}>
                                Apply
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Display Books */}
            <Paper elevation={3} sx={{ p: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                ) : books.length === 0 ? (
                    <Typography align="center">No books found.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {selectedFields.map((field) => (
                                    <TableCell key={field} sx={{ fontWeight: 'bold' }}>
                                        {field.toUpperCase()}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow key={book.id}>
                                    {selectedFields.map((field) => (
                                        <TableCell key={field}>
                                            {field === 'author_id' ? getAuthorName(book.author_id) : (book as any)[field]}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEdit(book.id)}
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                        {/* Optionally, add a Delete button here */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            {/* Snackbar for success messages */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Snackbar for error messages */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );

};

export default BooksPage;
