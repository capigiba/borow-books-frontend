import React from 'react';
import {
    Stack,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Button,
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

interface Filter {
    field: string;
    operator: string;
    value: string;
}

interface FilterManagerProps {
    availableFields: string[];
    filterOperators: { label: string; value: string }[];
    filters: Filter[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, key: keyof Filter, value: string) => void;
}

const FilterManager: React.FC<FilterManagerProps> = ({
    availableFields,
    filterOperators,
    filters,
    onAdd,
    onRemove,
    onChange,
}) => {
    return (
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
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id={`filter-operator-label-${index}`}>Operator</InputLabel>
                            <Select
                                labelId={`filter-operator-label-${index}`}
                                id={`filter-operator-${index}`}
                                value={filter.operator}
                                onChange={(e) => onChange(index, 'operator', e.target.value)}
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
                            onChange={(e) => onChange(index, 'value', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
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
                Add Filter
            </Button>
        </Stack>
    );
};

export default FilterManager;