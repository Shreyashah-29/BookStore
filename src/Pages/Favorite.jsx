import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    IconButton,
    Snackbar,
    Alert,
    useMediaQuery
} from '@mui/material';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc, arrayRemove, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useTheme } from '@mui/material/styles'; 

const Favorite = () => {
    const [likedBooks, setLikedBooks] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const db = getFirestore();
    const navigate = useNavigate();
    const theme = useTheme(); 
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

    useEffect(() => {
        const fetchLikedBooks = async () => {
            const user = getAuth().currentUser;
            if (!user) {
                setError('Please log in to view liked books');
                setLoading(false);
                return;
            }

            try {
                const userLikesRef = doc(db, 'userLikes', user.uid);
                const userLikesSnap = await getDoc(userLikesRef);

                if (userLikesSnap.exists()) {
                    const likedBookIds = userLikesSnap.data().likedBooks || [];
                    setLikedBooks(likedBookIds);

                    const booksCollection = collection(db, 'books');
                    const booksSnapshot = await getDocs(booksCollection);
                    const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setBooks(booksList);
                } else {
                    throw new Error('No liked books found');
                }
            } catch (err) {
                setError(err.message || 'Error fetching liked books');
            } finally {
                setLoading(false);
            }
        };
        fetchLikedBooks();
    }, [db]);

    const handleAddToCart = async (book) => {
        const user = getAuth().currentUser;
        if (!user) {
            setSnackbarMessage('Please log in to add items to the cart.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        try {
            const cartRef = doc(db, 'carts', user.uid);
            const cartDoc = await getDoc(cartRef);

            let updatedBooks = [];

            if (cartDoc.exists()) {
                const cartData = cartDoc.data();
                updatedBooks = cartData.books || [];
                const existingBookIndex = updatedBooks.findIndex(item => item.title === book.title);

                if (existingBookIndex > -1) {
                    updatedBooks[existingBookIndex].quantity += 1;
                } else {
                    updatedBooks.push({ ...book, quantity: 1 });
                }

                await updateDoc(cartRef, { books: updatedBooks });
            } else {
                updatedBooks = [{ ...book, quantity: 1 }];
                await setDoc(cartRef, { books: updatedBooks });
            }

            setSnackbarMessage('Book added to cart');
            setSnackbarSeverity('success');

            // Redirect to checkout page with the cartBooks in state
            navigate('/cart', { state: { books: updatedBooks } });
        } catch (err) {
            console.error('Error adding book to cart:', err);
            setSnackbarMessage('Error adding book to cart');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleRemoveFromLike = async (bookId) => {
        const user = getAuth().currentUser;
        if (!user) {
            setError('Please log in to remove books from likes');
            return;
        }

        try {
            const userLikesRef = doc(db, 'userLikes', user.uid);
            await updateDoc(userLikesRef, {
                likedBooks: arrayRemove(bookId)
            });
            setLikedBooks(likedBooks.filter(id => id !== bookId));
            setSnackbarMessage('Removed from likes');
            setSnackbarSeverity('success');
        } catch (err) {
            setSnackbarMessage('Error removing from likes');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <CircularProgress sx={{ m: 'auto', display: 'block', mt: 5 }} />;
    if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

    const likedBooksList = books.filter(book => likedBooks.includes(book.id));

    return (
        <Container component="main" sx={{ mt: 4, maxWidth: 'lg', px: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Liked Books
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {likedBooksList.length > 0 ? (
                    likedBooksList.map((book) => (
                        <Grid item xs={6} sm={4} md={2} key={book.id} gap={2} m={5}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', height: '100%', boxShadow: 2 }}>
                                {book.imageURL && (
                                    <CardMedia
                                        component="img"
                                        height={isMobile ? "200" : "250"}
                                        image={book.imageURL || 'https://via.placeholder.com/250'}
                                        alt={book.title}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="h6" component="div" noWrap sx={{ fontSize: '1rem', mb: 1 }}>
                                        {book.title}
                                    </Typography>
                                    <Typography color="textSecondary" noWrap sx={{ fontSize: '0.875rem', mb: 1 }}>
                                        {book.author}
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem', mb: 1 }}>
                                        Price: ${book.price}
                                    </Typography>
                                    <Grid container spacing={1} sx={{ mt: 1 }}>
                                        <Grid item>
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleAddToCart(book)}
                                                title='Buy Now'
                                            >
                                                <ShoppingCartIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item>
                                            <IconButton 
                                                color="error" 
                                                onClick={() => handleRemoveFromLike(book.id)}
                                                title='Remove From Wish-list'
                                            >
                                                <RemoveCircleIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">No liked books found</Typography>
                    </Grid>
                )}
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

export default Favorite;
