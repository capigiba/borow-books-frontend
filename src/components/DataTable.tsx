import React from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    CircularProgress,
    Typography,
    Box,
    Paper,
} from '@mui/material';

interface DataTableProps<T> {
    data: T[];
    selectedFields: string[];
    loading: boolean;
    error: string | null;
    getDisplayValue?: (item: T, field: string) => React.ReactNode;
    onEdit: (id: number) => void;
    emptyMessage?: string;
    tableTitle?: string;
}

const DataTable = <T extends { id: number }>({
    data,
    selectedFields,
    loading,
    error,
    getDisplayValue,
    onEdit,
    emptyMessage = 'No records found.',
}: DataTableProps<T>) => {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    if (data.length === 0) {
        return <Typography align="center">{emptyMessage}</Typography>;
    }

    return (
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
                {data.map((item) => (
                    <TableRow key={item.id}>
                        {selectedFields.map((field) => (
                            <TableCell key={field}>
                                {getDisplayValue ? getDisplayValue(item, field) : (item as any)[field]}
                            </TableCell>
                        ))}
                        <TableCell>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => onEdit(item.id)}
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
    );
};

export default DataTable;