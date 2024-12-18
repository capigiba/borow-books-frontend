import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to the Book Borrowing App
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    Manage and explore your collection with ease.
                </Typography>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                View & Filter Books
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Browse through the collection of books, apply filters, and find your next read.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link href="/books" passHref>
                                <Button size="small" color="primary" variant="contained">
                                    Explore Books
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                View & Filter Authors
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Discover authors, their biographies, and the books they've written.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link href="/authors" passHref>
                                <Button size="small" color="primary" variant="contained">
                                    Explore Authors
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Manage Books
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Create, update, or delete books in your collection.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link href="/books/manage" passHref>
                                <Button size="small" color="secondary" variant="contained">
                                    Manage Books
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Manage Authors
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Add, update, or remove authors from your database.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link href="/authors/manage" passHref>
                                <Button size="small" color="secondary" variant="contained">
                                    Manage Authors
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}