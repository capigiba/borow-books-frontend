import React from 'react';
import { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useRouter } from 'next/router';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Customize your primary color
        },
        secondary: {
            main: '#dc004e', // Customize your secondary color
        },
    },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    // Determine the current tab index based on the route
    const getCurrentTab = () => {
        switch (router.pathname) {
            case '/':
                return 0;
            case '/books':
            case '/books/manage':
                return 1;
            case '/authors':
            case '/authors/manage':
                return 2;
            case '/borrows':
            case '/borrows/borrow':
                return 3;
            default:
                return false; // No tab selected
        }
    };

    const currentTab = getCurrentTab();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Only show Navbar if a tab is selected */}
            {currentTab !== false && <Navbar currentTab={currentTab} />}
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default MyApp;