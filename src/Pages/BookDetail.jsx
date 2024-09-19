// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Typography, Card, CardContent, CardMedia, Box, CircularProgress, Alert, Button, Grid, Snackbar } from '@mui/material';
// import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { useFirebase } from '../Context/Firebase';
// import Reviews from './Review';

// const BookDetail = () => {
//     const { id } = useParams();
//     const [book, setBook] = useState(null);
//     const [user, setUser] = useState(null);
//     const [bookOwner, setBookOwner] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('success');
//     const db = getFirestore();
//     const { user: firebaseUser } = useFirebase();

//     useEffect(() => {
//         const fetchBookAndUser = async () => {
//             try {
//                 // Fetch book details
//                 const bookDoc = doc(db, 'books', id);
//                 const bookSnapshot = await getDoc(bookDoc);
//                 if (bookSnapshot.exists()) {
//                     const bookData = bookSnapshot.data();
//                     setBook(bookData);

//                     // Fetch book owner details if available
//                     if (bookData.userId) {
//                         const userDoc = doc(db, 'users', bookData.userId);
//                         const userSnapshot = await getDoc(userDoc);
//                         if (userSnapshot.exists()) {
//                             setBookOwner(userSnapshot.data());
//                         }
//                     }

//                     if (firebaseUser) {
//                         setUser(firebaseUser);
//                     }
//                 } else {
//                     setError('Book not found');
//                     setSnackbarMessage('Book not found');
//                     setSnackbarSeverity('error');
//                     setSnackbarOpen(true);
//                 }
//             } catch (err) {
//                 console.error('Error fetching book and user details:', err);
//                 setError('Error fetching book details');
//                 setSnackbarMessage('Error fetching book details');
//                 setSnackbarSeverity('error');
//                 setSnackbarOpen(true);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookAndUser();
//     }, [id, db, firebaseUser]);

//     const handleAddToCart = async () => {
//         if (!user) {
//             setSnackbarMessage('Please log in to add items to the cart.');
//             setSnackbarSeverity('warning');
//             setSnackbarOpen(true);
//             return;
//         }
    
//         console.log('User:', user.uid);
//         console.log('Book ID:', id); // Log only the book ID
    
//         try {
//             const cartRef = doc(db, 'carts', user.uid);
//             const cartDoc = await getDoc(cartRef);
    
//             if (cartDoc.exists()) {
//                 const cartData = cartDoc.data();
//                 const existingBooks = cartData.books || [];
//                 const bookId = id;
    
//                 console.log('Existing books in cart:', existingBooks.map(item => item.title)); 
    
//                 // Check if the book is already in the cart by ID
//                 const existingBookIndex = existingBooks.findIndex(item => item.title === book.title);
//                 console.log(existingBookIndex);
    
//                 if (existingBookIndex > -1) {
//                     console.log('Book already in cart, updating quantity.');
//                     const updatedBooks = existingBooks.map((item, index) =>
//                         index === existingBookIndex
//                             ? { ...item, quantity: item.quantity + 1 }
//                             : item
//                     );
    
//                     await updateDoc(cartRef, { books: updatedBooks });
//                 } else {
//                     // Book is not in the cart, add it
//                     console.log('Adding new book to cart.');
//                     const updatedBooks = [...existingBooks, { ...book, quantity: 1 }];
    
//                     await updateDoc(cartRef, { books: updatedBooks });
//                 }
//             } else {
//                 // Cart document doesn't exist, create it
//                 console.log('Creating new cart document from BookDetail.');
//                 await setDoc(cartRef, {
//                     books: [{ ...book, quantity: 1 }]
//                 });
//             }
    
//             setSnackbarMessage('Book added to cart');
//             setSnackbarSeverity('success');
//             setSnackbarOpen(true);
//         } catch (err) {
//             console.error('Error adding book to cart:', err);
//             setSnackbarMessage('Error adding book to cart');
//             setSnackbarSeverity('error');
//             setSnackbarOpen(true);
//         }
//     };
    
    

//     const handleSnackbarClose = () => {
//         setSnackbarOpen(false);
//     };

//     const handleMoreDetails = () => {
//         alert("For More Details Buy The Book");
//     };

//     if (loading) return <CircularProgress sx={{ m: 'auto', display: 'block', mt: 5 }} />;
//     if (error) return <Alert severity="error">{error}</Alert>;

//     return (
//         <Container component="main" sx={{ mt: 4, maxWidth: 'lg' }}>
//             {book && (
//                 <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 2, backgroundColor: '#f9f9f9', boxShadow: 2 }}>
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
//                             {book.imageURL && (
//                                 <CardMedia
//                                     component="img"
//                                     alt={book.title}
//                                     image={book.imageURL}
//                                     title={book.title}
//                                     sx={{ maxWidth: 300, maxHeight: 400, objectFit: 'cover', borderRadius: 2, boxShadow: 2 }}
//                                 />
//                             )}
//                         </Grid>
//                         <Grid item xs={12} md={8}>
//                             <CardContent>
//                                 <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
//                                     {book.title}
//                                 </Typography>
//                                 <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
//                                     <b>Author:</b> {book.author}
//                                 </Typography>
//                                 <Typography variant="body1" color="textPrimary" sx={{ mb: 1 }}>
//                                     <b>Description:</b><br /> {book.description}
//                                     <small style={{ cursor: 'pointer', color: 'blue' }} onClick={handleMoreDetails}> ...more</small>
//                                 </Typography>
//                                 <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
//                                     <b>ISBN:</b> {book.isbn}
//                                 </Typography>
//                                 <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
//                                     <b>Price:</b> ${book.price}
//                                 </Typography>
//                                 <Typography variant="h6" color="textPrimary" sx={{ mb: 2 }}>
//                                     <b>Type:</b> {book.bookType}
//                                 </Typography>
//                                 {bookOwner && (
//                                     <Box sx={{ mb: 2 }}>
//                                         <Typography variant="body1" color="textPrimary">
//                                             <b>Added by:</b> {bookOwner.name || 'Unknown'}
//                                         </Typography>
//                                         <Typography variant="body1" color="textPrimary">
//                                             <b>Email:</b> {bookOwner.email || 'Unknown'}
//                                         </Typography>
//                                     </Box>
//                                 )}
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     sx={{ mt: 2 }}
//                                     onClick={handleAddToCart}
//                                 >
//                                     Add to Cart
//                                 </Button>
//                             </CardContent>
//                         </Grid>
//                     </Grid>
//                     <Snackbar
//                         open={snackbarOpen}
//                         autoHideDuration={3000}
//                         onClose={handleSnackbarClose}
//                         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                     >
//                         <Alert
//                             onClose={handleSnackbarClose}
//                             severity={snackbarSeverity}
//                             sx={{ width: '100%' }}
//                         >
//                             {snackbarMessage}
//                         </Alert>
//                     </Snackbar>
//                 </Card>
//             )}
//             <Reviews bookId={id} /> 
//         </Container>
//     );
// };

// export default BookDetail;





















































import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Box, CircularProgress, Alert, Button, Grid, Snackbar } from '@mui/material';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Reviews from './Review';
import { useFirebase } from '../Context/Firebase';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [, setUser] = useState(null);
    const [bookOwner, setBookOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const db = getFirestore();
    const { user: firebaseUser } = useFirebase();

    useEffect(() => {
        const fetchBookAndUser = async () => {
            try {
                const bookDoc = doc(db, 'books', id);
                const bookSnapshot = await getDoc(bookDoc);
                if (bookSnapshot.exists()) {
                    const bookData = bookSnapshot.data();
                    setBook(bookData);

                    if (bookData.userId) {
                        const userDoc = doc(db, 'users', bookData.userId);
                        const userSnapshot = await getDoc(userDoc);
                        if (userSnapshot.exists()) {
                            setBookOwner(userSnapshot.data());
                        }
                    }

                    if (firebaseUser) {
                        setUser(firebaseUser);
                    }
                } else {
                    throw new Error('Book not found');
                }
            } catch (err) {
                console.error('Error fetching book details:', err);
                setError(err.message || 'Error fetching book details');
                setSnackbarMessage(err.message || 'Error fetching book details');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBookAndUser();
    }, [id, db, firebaseUser]);

    const handleAddToCart = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (!user) {
            setSnackbarMessage('Please log in to add items to the cart.');
            setSnackbarSeverity('error');
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
                    setSnackbarMessage('This book is already in your cart.');
                    setSnackbarSeverity('warning');
                    setSnackbarOpen(true);
                    return;
                } else {
                    updatedBooks.push({ ...book, quantity: 1 });
                }
    
                await updateDoc(cartRef, { books: updatedBooks });
            } else {
                // First time adding a book to the cart
                updatedBooks = [{ ...book, quantity: 1 }];
                await setDoc(cartRef, { books: updatedBooks });
            }
    
            setSnackbarMessage('Book added to cart');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            setSnackbarMessage(err.message || 'Error adding book to cart');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleMoreDetails = () => {
        alert("For more details, buy the book");
    };

    if (loading) return <CircularProgress sx={{ m: 'auto', display: 'block', mt: 5 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container component="main" sx={{ mt: 4, maxWidth: 'lg' }}>
            {book && (
                <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 2, backgroundColor: '#f9f9f9', boxShadow: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {book.imageURL && (
                                <CardMedia
                                    component="img"
                                    alt={book.title}
                                    image={book.imageURL}
                                    title={book.title}
                                    sx={{ maxWidth: 300, maxHeight: 400, objectFit: 'cover', borderRadius: 2, boxShadow: 2 }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {book.title}
                                </Typography>
                                <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                                    <b>Author:</b> {book.author}
                                </Typography>
                                <Typography variant="body1" color="textPrimary" sx={{ mb: 1 }}>
                                    <b>Description:</b><br /> {book.description}
                                    <small style={{ cursor: 'pointer', color: 'blue' }} onClick={handleMoreDetails}> ...more</small>
                                </Typography>
                                <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                                    <b>ISBN:</b> {book.isbn}
                                </Typography>
                                <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                                    <b>Price:</b> ${book.price}
                                </Typography>
                                <Typography variant="h6" color="textPrimary" sx={{ mb: 2 }}>
                                    <b>Type:</b> {book.bookType}
                                </Typography>
                                {bookOwner && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1" color="textPrimary">
                                            <b>Added by:</b> {bookOwner.name || 'Unknown'}
                                        </Typography>
                                        <Typography variant="body1" color="textPrimary">
                                            <b>Email:</b> {bookOwner.email || 'Unknown'}
                                        </Typography>
                                    </Box>
                                )}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Grid>
                    </Grid>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={handleSnackbarClose}
                            severity={snackbarSeverity}
                            sx={{ width: '100%' }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Card>
            )}
  <Reviews bookId={id} />          
        </Container>
    );
};

export default BookDetail;
