import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, IconButton, Box, Snackbar, Alert, Button } from '@mui/material';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBooks = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                const db = getFirestore();
                const booksCollection = collection(db, 'books');
                const userBooksQuery = query(booksCollection, where('userId', '==', user.uid));
                const booksSnapshot = await getDocs(userBooksQuery);
                const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setBooks(booksList);
            } catch (err) {
                console.error('Error fetching user books:', err);
                setError('Error fetching user books');
            } finally {
                setLoading(false);
            }
        };

        fetchUserBooks();
    }, []);

    const handleView = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleEdit = (bookId) => {
        navigate(`/editBook/${bookId}`);
        console.log('Edit book', bookId);
    };

    const handleDelete = async (bookId) => {
        try {
            const db = getFirestore();
            const bookDoc = doc(db, 'books', bookId);
            await deleteDoc(bookDoc);
            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            setSnackbarMessage('Book deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Error deleting book:', err);
            setSnackbarMessage('Error deleting book');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                My Books
            </Typography>
            {books.length === 0 ? (
                <Typography>No books found</Typography>
            ) : (
                <Grid container spacing={2}>
                    {books.map(book => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                            <Card
                                sx={{
                                    height: '300px',
                                    width: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '140px',
                                        width: '100%',
                                        '&:hover .overlay': {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    {book.imageURL && (
                                        <CardMedia
                                            component="img"
                                            alt={book.title}
                                            height="140"
                                            image={book.imageURL}
                                            title={book.title}
                                            sx={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                                        />
                                    )}
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            bottom: '-160px',
                                            left: 0,
                                            right: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'all 0.3s ease',
                                            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            backgroundColor: 'white',
                                            color: 'white',
                                            flexDirection: 'row',
                                            gap: 1,
                                            p: 1
                                        }}
                                    >
                                        <IconButton color="primary" aria-label="view" onClick={() => handleView(book.id)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="secondary" aria-label="edit" onClick={() => handleEdit(book.id)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" aria-label="delete" onClick={() => handleDelete(book.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message={snackbarMessage}
                action={
                    <Button color="inherit" onClick={handleCloseSnackbar}>
                        Close
                    </Button>
                }
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Account;
