import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Grid, Divider, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Slider from 'react-slick';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ReplayIcon from '@mui/icons-material/Replay';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

const featuredBooks = [
    'https://picsum.photos/600/300?random=1',
    'https://picsum.photos/600/300?random=2',
    'https://picsum.photos/600/300?random=3',
];

const features = [
    {
        icon: <ShippingIcon fontSize="large" />,
        title: 'FREE SHIPPING',
        description: 'Order over $100',
        color: '#f44336',
        border: '1px dashed #f44336'
    },
    {
        icon: <SecurityIcon fontSize="large" />,
        title: 'SECURE PAYMENT',
        description: '100% Secure Payment',
        color: '#4caf50',
        border: '1px dashed #4caf50'
    },
    {
        icon: <PriceCheckIcon fontSize="large" />,
        title: 'BEST PRICE',
        description: 'Guaranteed Price',
        color: '#2196f3',
        border: '1px dashed #2196f3'
    },
    {
        icon: <ReplayIcon fontSize="large" />,
        title: 'FREE RETURNS',
        description: 'Within 30 Days returns',
        color: '#ff9800',
        border: '1px dashed #ff9800'
    },
];

const Home = () => {
    const [bookTypes, setBookTypes] = useState({});
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const db = getFirestore();
                const booksCollection = collection(db, 'books');
                const booksSnapshot = await getDocs(booksCollection);
                const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const types = booksList.reduce((acc, book) => {
                    if (!acc[book.bookType]) {
                        acc[book.bookType] = [];
                    }
                    acc[book.bookType].push(book);
                    return acc;
                }, {});

                setBookTypes(types);
                const defaultType = Object.keys(types)[0];
                setSelectedType(defaultType);
            } catch (err) {
                console.error('Error fetching books:', err);
                setError('Error fetching books');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleCardClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleShopNow = () => {
        navigate('/bookList');
    };

    const handleTypeChange = (event, newType) => {
        setSelectedType(newType);
    };

    if (loading) return <Typography variant="h6" align="center">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error" align="center">{error}</Typography>;

    return (
        <Container>
            {/* Carousel Section */}
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Featured Books & Offers
                </Typography>
                <Slider {...settings}>
                    {featuredBooks.map((image, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                            <CardMedia
                                component="img"
                                height="350"
                                image={image}
                                alt={`Featured Book ${index + 1}`}
                                sx={{ objectFit: 'cover', borderRadius: 2 }}
                            />
                            <CardContent
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    width: '100%',
                                    p: 2,
                                    borderRadius: '0 0 8px 8px'
                                }}
                            >
                                <Typography variant="h6" component="div" gutterBottom>
                                    Featured Book Title {index + 1}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={handleShopNow}
                                >
                                    Shop Now
                                </Button>
                            </CardContent>
                        </Box>
                    ))}
                </Slider>
            </Box>

            {/* Feature Boxes Section */}
            <Box sx={{ mt: 15, mb: 14 }}>
                <Typography variant="h4" component="h2" gutterBottom textAlign="center">
                    Why Choose Us
                </Typography>
                <Grid container spacing={4} justifyContent="center" >
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} mb={3}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '100%',
                                    p: 2,

                                    border: feature.border,
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: `0 8px 16px rgba(0, 0, 0, 0.3)`
                                    },
                                    '&:active': {
                                        transform: 'scale(1)',
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: feature.color }}>
                                    {feature.icon}
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Books by Type Section */}
            <Box sx={{ mt: 10 }}>
                <Typography variant="h4" component="h2" gutterBottom textAlign="center" m={5} >
                    Books by Type
                </Typography>

                {/* Book Type Selector */}
                <Box sx={{ mb: 4 }}>
                    <ToggleButtonGroup
                        value={selectedType}
                        exclusive
                        onChange={handleTypeChange}
                        aria-label="book type"
                        sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}
                    >
                        {Object.keys(bookTypes).map((type) => (
                            <ToggleButton
                                key={type}
                                value={type}
                                aria-label={type}
                                sx={{
                                    border: 'none',
                                    backgroundColor: '#FFFAF0', 
                                    color: '#333', 
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease', 
                                    '&:hover': {
                                        backgroundColor: '#FFEBE5',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#FFA500', 
                                        color: '#FFF', 
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            transition: 'width 0.3s ease',
                                        }
                                    }
                                }}
                            >
                                {type}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                {selectedType && (
                    <Grid container spacing={2} justifyContent="center">
                        {bookTypes[selectedType].slice(0, 5).map(book => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: `0 8px 16px rgba(0, 0, 0, 0.3)`
                                        },
                                        '&:active': {
                                            transform: 'scale(1)',
                                            boxShadow: 'none'
                                        },
                                        width: 250,
                                        height: 400,
                                    }}
                                    onClick={() => handleCardClick(book.id)}
                                >
                                    <CardMedia
                                        component="img"
                                        alt={book.title}
                                        image={book.imageURL || 'https://picsum.photos/200/300'}
                                        title={book.title}
                                        sx={{
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: 300,
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 2 }}>
                                        <Typography variant="body2" component="div">
                                            {book.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Divider sx={{ my: 3 }} />
            </Box>



            {/* Static Banner Section */}
            <Box
                sx={{
                    mt: 10,
                    mb: 10,
                    position: 'relative',
                    height: { xs: 'auto', sm: '300px', md: '400px' },
                    backgroundImage: 'url("https://picsum.photos/1200/400?random=5")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))',
                        zIndex: 1
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        p: 3
                    }}
                >
                    <Typography variant="h3" component="div" gutterBottom>
                        BOOK FESTIVAL
                    </Typography>
                    <Typography variant="h5" component="div" gutterBottom>
                        ALL BOOKS ARE FLAT 50% OFF
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mb: 3 }}>
                        Shop wide range of collections
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/bookList')}
                    >
                        Explore Offers
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Home;



