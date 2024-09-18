import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Snackbar, Alert, Grid, Box, LinearProgress, FormControl, FormLabel, Badge } from '@mui/material';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useFirebase } from '../Context/Firebase';
import StarRatings from 'react-star-ratings';

const Reviews = ({ bookId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [ratingCounts, setRatingCounts] = useState({ excellent: 0, good: 0, average: 0, belowAverage: 0, veryPoor: 0 });
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(2);
    const reviewsPerPage = 2;
    const db = getFirestore();
    const { user } = useFirebase();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsCollection = collection(db, 'reviews');
                const q = query(reviewsCollection, where('bookId', '==', bookId));
                const querySnapshot = await getDocs(q);
                const reviewsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        rating: Number(data.rating) || 1,
                    };
                });
                setReviews(reviewsList);

                // Calculate rating counts
                const counts = { excellent: 0, good: 0, average: 0, belowAverage: 0, veryPoor: 0 };
                reviewsList.forEach(review => {
                    switch (review.rating) {
                        case 5:
                            counts.excellent++;
                            break;
                        case 4:
                            counts.good++;
                            break;
                        case 3:
                            counts.average++;
                            break;
                        case 2:
                            counts.belowAverage++;
                            break;
                        case 1:
                            counts.veryPoor++;
                            break;
                        default:
                            break;
                    }
                });
                setRatingCounts(counts);

            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError('Error fetching reviews');
                setSnackbarMessage('Error fetching reviews');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [bookId, db]);

    const handleAddReview = async () => {
        if (!user) {
            setSnackbarMessage('Please log in to add a review.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        if (!newReview.trim()) {
            setSnackbarMessage('Review cannot be empty.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        try {
            await addDoc(collection(db, 'reviews'), {
                bookId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                text: newReview,
                rating: Number(rating),
                createdAt: new Date(),
            });

            setSnackbarMessage('Review added successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setNewReview('');
            setRating(4);

            // Re-fetch reviews
            const reviewsCollection = collection(db, 'reviews');
            const q = query(reviewsCollection, where('bookId', '==', bookId));
            const querySnapshot = await getDocs(q);
            const reviewsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    rating: Number(data.rating) || 1,
                };
            });
            setReviews(reviewsList);

            // Recalculate rating counts
            const counts = { excellent: 0, good: 0, average: 0, belowAverage: 0, veryPoor: 0 };
            reviewsList.forEach(review => {
                switch (review.rating) {
                    case 5:
                        counts.excellent++;
                        break;
                    case 4:
                        counts.good++;
                        break;
                    case 3:
                        counts.average++;
                        break;
                    case 2:
                        counts.belowAverage++;
                        break;
                    case 1:
                        counts.veryPoor++;
                        break;
                    default:
                        break;
                }
            });
            setRatingCounts(counts);

        } catch (err) {
            console.error('Error adding review:', err);
            setSnackbarMessage('Error adding review');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    if (loading) return <CircularProgress sx={{ m: 'auto', display: 'block', mt: 5 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    // Calculate total reviews to normalize progress bars
    const totalReviews = reviews.length;
    const getBarValue = (count) => (totalReviews > 0 ? (count / totalReviews) * 100 : 0);

    // Define color based on rating
    const getColor = (rating) => {
        switch (rating) {
            case 5:
                return '#ff4545'; // Red for very poor
            case 4:
                return '#ffa534'; // Orange for below average
            case 3:
                return '#ffe234'; // Yellow for average
            case 2:
                return '#b7dd29'; // Light Green for good
            case 1:
                return '#57e32c'; // Green for excellent
            default:
                return 'grey'; // Default color
        }
    };

    return (
        <Container sx={{ mt: 8 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                        Reviews
                        <Badge badgeContent={reviews.length} color="secondary" sx={{ ml: 2 }} />
                    </Typography>
                    <Box sx={{ border: '1px solid #ddd', borderRadius: '4px', p: 2 }}>
                        {reviews.length > 0 ? (
                            reviews.slice(0, visibleReviewsCount).map((review) => (
                                <Box key={review.id} sx={{ mb: 2, p: 2, borderBottom: '1px solid #ddd' }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {review.userName} ({new Date(review.createdAt.seconds * 1000).toLocaleDateString()})
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                        Rating: <StarRatings
                                            rating={parseFloat(review.rating) || 1}
                                            starRatedColor="gold"
                                            numberOfStars={5}
                                            starDimension="20px"
                                            starSpacing="2px"
                                            name='rating'
                                            starEmptyColor="#ddd"
                                        />
                                    </Typography>
                                    <Typography variant="body1">
                                        {review.text}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body1">No reviews yet.</Typography>
                        )}
                        {reviews.length > visibleReviewsCount && (
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => setVisibleReviewsCount(visibleReviewsCount + reviewsPerPage)}
                            >
                                Show More
                            </Button>
                        )}
                    </Box>
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Rating</FormLabel>
                        <StarRatings
                            rating={rating}
                            starRatedColor="gold"
                            changeRating={handleRatingChange}
                            numberOfStars={5}
                            starDimension="30px"
                            starSpacing="5px"
                            name='rating'
                            starEmptyColor="#ddd"
                        />
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write your review here..."
                        sx={{ mt: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleAddReview}
                    >
                        Submit Review
                    </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            p: 3,
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            mt: 5,
                            width: '100%',
                            backgroundColor: '#fff',
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                            Ratings Overview
                        </Typography>
                        {Object.keys(ratingCounts).map((key) => (
                            <Box
                                key={key}
                                sx={{
                                    width: '100%',
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                }}
                            >
                                <Typography variant="body2" sx={{ flexShrink: 0 }}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    <Badge badgeContent={ratingCounts[key]} color="secondary" sx={{ ml: 2 }} />
                                </Typography>
                                <Box sx={{ flexGrow: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={getBarValue(ratingCounts[key])}
                                        sx={{
                                            height: 10,
                                            borderRadius: '5px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getColor(Object.keys(ratingCounts).indexOf(key) + 1),
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
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
        </Container>
    );
};

export default Reviews;
