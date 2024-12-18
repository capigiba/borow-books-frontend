import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
} from '@mui/material';

interface FieldVisibilitySelectorProps {
    availableFields: string[];
    selectedFields: string[];
    onChange: (fields: string[]) => void;
    label: string;
}

const FieldVisibilitySelector: React.FC<FieldVisibilitySelectorProps> = ({
    availableFields,
    selectedFields,
    onChange,
    label,
}) => {
    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        onChange(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                id={`${label}-select`}
                multiple
                value={selectedFields}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
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
    );
};

export default FieldVisibilitySelector;