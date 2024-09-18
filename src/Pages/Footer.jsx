import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { Instagram, Twitter, Facebook, LinkedIn } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            sx={{
                mt: 4,
                py: 4,
                backgroundColor: '#f8f8f8',
                borderTop: '1px solid #ddd',
                textAlign: 'center'
            }}
        >
            <Container>
                <Typography variant="h6" gutterBottom>
                    About Us
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    We are a leading book retailer providing a wide range of books across various genres. Our mission is to make reading accessible to everyone.
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Quick Links
                    </Typography>
                    <Link href="/" color="inherit" sx={{ mx: 1 }}>
                        Home
                    </Link>
                    <Link href="/about" color="inherit" sx={{ mx: 1 }}>
                        About Us
                    </Link>
                    <Link href="/contact" color="inherit" sx={{ mx: 1 }}>
                        Contact
                    </Link>
                    <Link href="/privacy" color="inherit" sx={{ mx: 1 }}>
                        Privacy Policy
                    </Link>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Follow Us
                    </Typography>
                    <Link href="https://www.facebook.com" color="inherit" sx={{ mx: 1 }}>
                        <Facebook />
                    </Link>
                    <Link href="https://twitter.com" color="inherit" sx={{ mx: 1 }}>
                        <Twitter />
                    </Link>
                    <Link href="https://www.instagram.com" color="inherit" sx={{ mx: 1 }}>
                        <Instagram />
                    </Link>
                    <Link href="https://www.linkedin.com" color="inherit" sx={{ mx: 1 }}>
                        <LinkedIn />
                    </Link>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        © {new Date().getFullYear()} BookStore. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
