// pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';

let theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Blue
        },
        secondary: {
            main: '#dc004e', // Pink
        },
    },
    typography: {
        h1: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
    },
});

// Enable responsive font sizes
theme = responsiveFontSizes(theme);

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
            default:
                return false; // No tab selected
        }
    };

    const currentTab = getCurrentTab();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Head>
                <title>Book Borrowing App</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            {/* Only show Navbar if a tab is selected */}
            {currentTab !== false && <Navbar currentTab={currentTab} />}
            <main style={{ padding: '20px', minHeight: '80vh' }}>
                <Component {...pageProps} />
            </main>
            <footer style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5' }}>
                &copy; {new Date().getFullYear()} Book Borrowing App
            </footer>
        </ThemeProvider>
    );
};

export default MyApp;
