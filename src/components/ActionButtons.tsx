import React from 'react';
import { Box, Grid, Button } from '@mui/material';

interface ActionButtonsProps {
    onApply: () => void;
    onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onApply, onReset }) => {
    return (
        <Box mt={3}>
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={onApply}>
                        Apply
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="secondary" onClick={onReset}>
                        Reset
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ActionButtons;