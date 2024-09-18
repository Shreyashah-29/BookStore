import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, CircularProgress, Alert, IconButton, Button, Select, MenuItem, Slider, InputLabel, FormControl, Snackbar } from '@mui/material';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getAuth } from 'firebase/auth'; 

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({ type: '', price: [0, 1000], author: '' });
    const [types, setTypes] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [likedBooks, setLikedBooks] = useState(new Set());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Added severity state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const db = getFirestore();
                const booksCollection = collection(db, 'books');
                const booksSnapshot = await getDocs(booksCollection);
                const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBooks(booksList);
                setFilteredBooks(booksList);

                // Extract unique types and authors
                const uniqueTypes = [...new Set(booksList.map(book => book.bookType))];
                const uniqueAuthors = [...new Set(booksList.map(book => book.author))];
                setTypes(uniqueTypes);
                setAuthors(uniqueAuthors);
            } catch (err) {
                setError('Error fetching books');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        const filterBooks = () => {
            let filtered = books;

            if (filter.type) {
                filtered = filtered.filter(book => book.bookType === filter.type);
            }

            if (filter.author) {
                filtered = filtered.filter(book => book.author === filter.author);
            }

            filtered = filtered.filter(book => book.price >= filter.price[0] && book.price <= filter.price[1]);

            setFilteredBooks(filtered);
        };

        filterBooks();
    }, [filter, books]);

    useEffect(() => {
        const fetchLikedBooks = async () => {
            const user = getAuth().currentUser;
            if (user) {
                const userLikesRef = doc(getFirestore(), 'userLikes', user.uid);
                const userLikesSnap = await getDoc(userLikesRef);
                if (userLikesSnap.exists()) {
                    const likedBooksIds = userLikesSnap.data().likedBooks || [];
                    setLikedBooks(new Set(likedBooksIds));
                }
            }
        };

        fetchLikedBooks();
    }, []);

    const handleView = (id) => {
        navigate(`/book/${id}`);
    };

    const handleLike = async (id) => {
        const user = getAuth().currentUser;
        if (!user) {
            setSnackbarMessage('Please log in to like books');
            setSnackbarSeverity('info'); 
            setSnackbarOpen(true);
            return;
        }

        const userLikesRef = doc(getFirestore(), 'userLikes', user.uid);
        const userLikesSnap = await getDoc(userLikesRef);

        try {
            const newLikedBooks = userLikesSnap.exists() ? userLikesSnap.data().likedBooks || [] : [];
            const isAlreadyLiked = newLikedBooks.includes(id);

            if (isAlreadyLiked) {
                // Remove from liked books
                const updatedLikedBooks = newLikedBooks.filter(bookId => bookId !== id);
                await updateDoc(userLikesRef, { likedBooks: updatedLikedBooks });
                setSnackbarMessage('Removed from favorites');
                setSnackbarSeverity('error'); 
                setLikedBooks(new Set(updatedLikedBooks)); 
            } else {
                // Add to liked books
                newLikedBooks.push(id);
                await setDoc(userLikesRef, { likedBooks: newLikedBooks }, { merge: true });
                setSnackbarMessage('Added to favorites');
                setSnackbarSeverity('success'); 
                setLikedBooks(new Set(newLikedBooks)); 
            }

            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Error updating favorites');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleFilterChange = (event) => {
        setFilter({ ...filter, [event.target.name]: event.target.value });
    };

    const handlePriceChange = (event, newValue) => {
        setFilter({ ...filter, price: newValue });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <CircularProgress sx={{ m: '20%', ml: '50%' }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container component="main" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                All Books
            </Typography>

            <Grid container spacing={2}>
                {/* Filters Section */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h6" gutterBottom>Filters</Typography>
                        <Grid container spacing={2}>
                            {/* Book Type Filter */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Book Type</InputLabel>
                                    <Select
                                        name="type"
                                        value={filter.type}
                                        onChange={handleFilterChange}
                                        label="Book Type"
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        {types.map((type, index) => (
                                            <MenuItem key={index} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Author Filter */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Author</InputLabel>
                                    <Select
                                        name="author"
                                        value={filter.author}
                                        onChange={handleFilterChange}
                                        label="Author"
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        {authors.map((author, index) => (
                                            <MenuItem key={index} value={author}>{author}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Price Filter */}
                            <Grid item xs={12}>
                                <Typography gutterBottom>Price Range</Typography>
                                <Slider
                                    value={filter.price}
                                    onChange={handlePriceChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={1000}
                                    step={1}
                                    marks
                                    sx={{ mb: 2 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Min: ${filter.price[0]}</Typography>
                                    <Typography variant="body2">Max: ${filter.price[1]}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                {/* Books List Section */}
                <Grid item xs={12} md={9}>
                    <Grid container spacing={4} justifyContent="center">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <Grid item xs={12} sm={6} md={4} key={book.id}>
                                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 300, margin: 'auto' }}>
                                        {book.imageURL && (
                                            <CardMedia
                                                component="img"
                                                alt={book.title}
                                                image={book.imageURL}
                                                title={book.title}
                                                sx={{
                                                    width: '100%',
                                                    height: { xs: 400, sm: 400, md: 400 },
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="h6" component="div" noWrap>
                                                {book.title}
                                            </Typography>
                                            <Typography color="textSecondary" noWrap>
                                                {book.author}
                                            </Typography>
                                            <Typography variant="body2" color="textPrimary">
                                                Price: ${book.price}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                                <IconButton 
                                                    onClick={() => handleLike(book.id)}
                                                    color={likedBooks.has(book.id) ? 'secondary' : 'default'}
                                                >
                                                    {likedBooks.has(book.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </IconButton>
                                                <Button variant="contained" color="primary" size="small" onClick={() => handleView(book.id)}>
                                                    View Details
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center">No books found</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default BooksList;
