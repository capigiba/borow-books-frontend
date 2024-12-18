import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Tabs,
    Tab,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton, // Import ListItemButton
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NextMuiLink from './NextMuiLink';

interface NavbarProps {
    currentTab: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const tabs = [
        { label: 'Home', href: '/' },
        { label: 'Books', href: '/books' },
        { label: 'Authors', href: '/authors' },
    ];

    const drawerItems = (
        <List>
            {tabs.map((tab, index) => (
                <ListItem key={index} disablePadding>
                    <ListItemButton
                        component={NextMuiLink}
                        href={tab.href}
                        onClick={() => setDrawerOpen(false)}
                    >
                        <ListItemText primary={tab.label} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Book Borrowing App
                    </Typography>
                    {isMobile ? (
                        <>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                aria-label="menu"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="right"
                                open={drawerOpen}
                                onClose={handleDrawerToggle}
                            >
                                {drawerItems}
                            </Drawer>
                        </>
                    ) : (
                        <Tabs
                            value={currentTab}
                            textColor="inherit"
                            indicatorColor="secondary"
                            aria-label="navigation tabs"
                        >
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab.label}
                                    component={NextMuiLink}
                                    href={tab.href}
                                />
                            ))}
                        </Tabs>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Navbar;