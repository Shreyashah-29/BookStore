import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, CardMedia, IconButton, Box, TextField, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '../Context/Firebase';
import { useNavigate } from 'react-router-dom';

const AddToCart = () => {
    const [cartBooks, setCartBooks] = useState([]);
    const [total, setTotal] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [appliedCouponCode, setAppliedCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponAvailable, setCouponAvailable] = useState(null); // New state for coupon availability
    const { user } = useFirebase();
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const cartRef = doc(db, 'carts', user.uid);
                    const cartDoc = await getDoc(cartRef);

                    if (cartDoc.exists()) {
                        setCartBooks(cartDoc.data().books || []);
                    } else {
                        setCartBooks([]);
                    }
                } catch (err) {
                    console.error('Error fetching cart:', err);
                }
            };
            fetchCart();
        }
    }, [db, user]);

    useEffect(() => {
        const calculateTotal = () => {
            return cartBooks.reduce((sum, book) => sum + (book.price * book.quantity), 0).toFixed(2);
        };

        setTotal(calculateTotal());
    }, [cartBooks]);

    useEffect(() => {
        const checkCouponAvailability = async () => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                try {
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setCouponAvailable(userData.couponCode || 'No coupon available');
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                }
            }
        };

        checkCouponAvailability();
    }, [user, db]);

    const handleQuantityChange = async (index, change) => {
        const updatedCart = [...cartBooks];
        const newQuantity = updatedCart[index].quantity + change;

        if (newQuantity <= 0) {
            updatedCart.splice(index, 1);
        } else if (newQuantity > 5) {
            alert(`You cannot add more than 5 books at a time`);
            return;
        } else {
            updatedCart[index].quantity = newQuantity;
        }
        setCartBooks(updatedCart);

        if (user) {
            const cartRef = doc(db, 'carts', user.uid);

            try {
                await updateDoc(cartRef, {
                    books: updatedCart
                });
            } catch (err) {
                console.error('Error updating cart:', err);
            }
        }
    };

    const handleRemoveBook = async (index) => {
        const updatedCart = [...cartBooks];
        updatedCart.splice(index, 1);
        setCartBooks(updatedCart);

        if (user) {
            const cartRef = doc(db, 'carts', user.uid);

            try {
                await updateDoc(cartRef, {
                    books: updatedCart
                });
            } catch (err) {
                console.error('Error updating cart:', err);
            }
        }
    };

    const handleClearCart = async () => {
        setCartBooks([]);

        if (user) {
            const cartRef = doc(db, 'carts', user.uid);

            try {
                await deleteDoc(cartRef);
            } catch (err) {
                console.error('Error clearing cart:', err);
            }
        }
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { books: cartBooks, total } });
    };

    const handleApplyCoupon = async () => {
        if (!user) {
            setError('You must be logged in to apply a coupon.');
            setSnackbarOpen(true);
            return;
        }

        if (!couponCode.trim()) {
            setError('Please enter a coupon code.');
            setSnackbarOpen(true);
            return;
        }

        const userRef = doc(db, 'users', user.uid);

        try {
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const storedCouponCode = userData.couponCode;

                if (couponCode === storedCouponCode) {
                    const discount = 50; // Discount amount in dollars
                    setDiscountAmount(discount);
                    setAppliedCouponCode(couponCode);
                    setTotal(prevTotal => (Math.max(prevTotal - discount, 0)).toFixed(2));

                    await updateDoc(userRef, {
                        couponCode: null // Or some other field indicating the coupon has been used
                    });

                    setSuccess('Coupon applied successfully!');
                    setCouponCode('');
                    setIsCouponApplied(true);
                } else {
                    setError('Invalid coupon code.');
                }
            } else {
                setError('User data not found.');
            }
        } catch (err) {
            console.error('Error applying coupon:', err);
            setError('Error applying coupon. Please try again.');
        }

        setSnackbarOpen(true);
    };

    const originalTotal = parseFloat(total) + discountAmount;

    return (
        <Container component="main" sx={{ mt: 4, maxWidth: 'lg', padding: 2 }}>
            <Grid container spacing={3}>
                {/* Cart Items Section */}
                <Grid item xs={12} md={8}>
                    {cartBooks.length > 0 ? (
                        cartBooks.map((book, index) => (
                            <Card
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 2,
                                    mb: 2,
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={book.imageURL || 'https://via.placeholder.com/140'}
                                    alt={book.title}
                                    sx={{
                                        width: 140,
                                        objectFit: 'cover',
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        padding: 2,
                                        width: '100%',
                                    }}
                                >
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body1" color="textPrimary" sx={{ mb: 1 }}>
                                        <b>Price:</b> ${book.price}
                                    </Typography>
                                    <Typography variant="body1" color="textPrimary" sx={{ mb: 2 }}>
                                        <b>Type:</b> {book.bookType}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            onClick={() => handleQuantityChange(index, -1)}
                                            color="primary"
                                            disabled={book.quantity <= 1}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography variant="body1" sx={{ mx: 2 }}>
                                            {book.quantity}
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleQuantityChange(index, 1)}
                                            color="primary"
                                        >
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleRemoveBook(index)}
                                            color="error"
                                            sx={{ ml: 2 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="h6">No books in the cart.</Typography>
                    )}
                </Grid>

                {/* Cart Summary and Actions Section */}
                {cartBooks.length > 0 && (
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                padding: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: 2,
                                height: '100%',
                                borderRadius: 2,
                            }}
                        >
                            <CardContent sx={{ mb: 1 }}>
                                <Typography variant="h6" component="div">
                                    <b>Total Price:</b> ${total}
                                </Typography>
                                {isCouponApplied && (
                                    <>
                                        <Typography variant="body1" component="div" color="textSecondary">
                                            <b>Applied Coupon Code:</b> {appliedCouponCode}
                                        </Typography>
                                        <Typography variant="body1" component="div" color="textSecondary">
                                            <b>Original Price:</b> ${originalTotal.toFixed(2)}
                                        </Typography>
                                        <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                                            <b>Discounted Total:</b> ${total}
                                        </Typography>
                                    </>
                                )}
                                {couponAvailable && !isCouponApplied && (
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        {couponAvailable === 'No coupon available' ? 'Coupon is not available.' : `Available Coupon: ${couponAvailable}`}
                                    </Typography>
                                )}
                            </CardContent>

                            {!isCouponApplied && couponAvailable !== 'No coupon available' && (
                                <Box sx={{ p: 0, mb: 2 }}>
                                    <TextField
                                        label="Coupon Code"
                                        variant="outlined"
                                        fullWidth
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={handleApplyCoupon}
                                    >
                                        Apply Coupon
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ p: 0 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mb: 1, width: '100%' }}
                                    onClick={handleCheckout}
                                    disabled={cartBooks.length === 0}
                                >
                                    Checkout
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ width: '100%' }}
                                    onClick={handleClearCart}
                                    disabled={cartBooks.length === 0}
                                >
                                    Clear Cart
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Snackbar for Feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                action={
                    <Button color="inherit" onClick={() => setSnackbarOpen(false)}>
                        Close
                    </Button>
                }
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={error ? 'error' : 'success'}>
                    {error || success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddToCart;
