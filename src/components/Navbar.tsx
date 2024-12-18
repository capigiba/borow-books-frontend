import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';

interface NavbarProps {
    currentTab: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const tabs = [
        { label: 'Home', href: '/' },
        { label: 'Books', href: '/books' },
        { label: 'Authors', href: '/authors' },
        { label: 'Borrows', href: '/borrows' },
    ];

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Borrow Book App
                </Typography>
                {!isMobile && (
                    <Tabs value={currentTab} textColor="inherit" indicatorColor="secondary">
                        {tabs.map((tab, index) => (
                            <Tab
                                key={tab.href}
                                label={tab.label}
                                component={Link}
                                href={tab.href}
                                // Prevent default anchor behavior
                                onClick={(e) => e.preventDefault()}
                            />
                        ))}
                    </Tabs>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;