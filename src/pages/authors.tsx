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
import { fetchAuthors } from '../lib/api';
import { useRouter } from 'next/router';

interface Author {
    id: number;
    name: string;
}

const availableFields = ['id', 'name'];
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

const AuthorsPage: React.FC = () => {
    const router = useRouter();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedFields, setSelectedFields] = useState<string[]>(['id', 'name']);
    const [filters, setFilters] = useState<{ field: string; operator: string; value: string }[]>([]);
    const [sorts, setSorts] = useState<{ field: string; order: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchAuthorsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const filterParams = filters.map(f => `${f.field}__${f.operator}__${f.value}`);
            const sortParams = sorts.map(s => `${s.field}__${s.order}`);
            const fieldsParam = selectedFields.join(',');

            const data = await fetchAuthors(filterParams, sortParams, fieldsParam);
            setAuthors(data);
            setSuccessMessage('Authors fetched successfully!');
        } catch (err: any) {
            console.error('Error fetching authors:', err);
            setError(err.message || 'Failed to fetch authors.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthorsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddFilter = () => {
        setFilters([...filters, { field: 'name', operator: 'eq', value: '' }]);
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
        setSorts([...sorts, { field: 'name', order: 'asc' }]);
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
        fetchAuthorsData();
    };

    const handleResetFilters = () => {
        setFilters([]);
        setSorts([]);
        setSelectedFields(['id', 'name']);
        fetchAuthorsData();
    };

    const handleEdit = (authorId: number) => {
        router.push(`/authors/manage?id=${authorId}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Authors
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
                            <FormControl fullWidth>
                                <InputLabel>Fields to Display</InputLabel>
                                <Select
                                    multiple
                                    value={selectedFields}
                                    onChange={handleFieldVisibilityChange}
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
                                            <FormControl fullWidth>
                                                <InputLabel>Field</InputLabel>
                                                <Select
                                                    value={filter.field}
                                                    onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
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
                                            <FormControl fullWidth>
                                                <InputLabel>Operator</InputLabel>
                                                <Select
                                                    value={filter.operator}
                                                    onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
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
                                            <FormControl fullWidth>
                                                <InputLabel>Field</InputLabel>
                                                <Select
                                                    value={sort.field}
                                                    onChange={(e) => handleSortChange(index, 'field', e.target.value)}
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
                                            <FormControl fullWidth>
                                                <InputLabel>Order</InputLabel>
                                                <Select
                                                    value={sort.order}
                                                    onChange={(e) => handleSortChange(index, 'order', e.target.value)}
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

            {/* Display Authors */}
            <Paper elevation={3} sx={{ p: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                ) : authors.length === 0 ? (
                    <Typography align="center">No authors found.</Typography>
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
                            {authors.map((author) => (
                                <TableRow key={author.id}>
                                    {selectedFields.map((field) => (
                                        <TableCell key={field}>{(author as any)[field]}</TableCell>
                                    ))}
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEdit(author.id)}
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

export default AuthorsPage;