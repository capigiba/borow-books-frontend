import React from 'react';
import {
    Stack,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Button,
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

interface Sort {
    field: string;
    order: string;
}

interface SortManagerProps {
    availableFields: string[];
    sortOrders: { label: string; value: string }[];
    sorts: Sort[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, key: keyof Sort, value: string) => void;
}

const SortManager: React.FC<SortManagerProps> = ({
    availableFields,
    sortOrders,
    sorts,
    onAdd,
    onRemove,
    onChange,
}) => {
    return (
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
                                onChange={(e) => onChange(index, 'field', e.target.value)}
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
                                onChange={(e) => onChange(index, 'order', e.target.value)}
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
                        <IconButton color="error" onClick={() => onRemove(index)}>
                            <RemoveCircle />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button
                variant="outlined"
                startIcon={<AddCircle />}
                onClick={onAdd}
                color="primary"
            >
                Add Sort
            </Button>
        </Stack>
    );
};

export default SortManager;